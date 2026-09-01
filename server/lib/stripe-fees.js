import {
  fetchStripePaymentFees,
  paymentNeedsFeeReconciliation,
  stripeFeeLookupKeys,
} from "./billing.js";
import { applyStripePaymentFees } from "./stripe-sync.js";
import { readDb, writeDb } from "./store.js";

const DEFAULT_LIMIT = 10;

export function listPaymentsPendingFeeReconciliation(payments = []) {
  return payments.filter(paymentNeedsFeeReconciliation);
}

/**
 * Storage-agnostic core: reads the real processing fee for Stripe payments we
 * recorded but never reconciled, and hands each result to `saveFees`.
 *
 * Safe to call on every webhook and on the owner dashboard: when Stripe is not
 * configured, or when a balance transaction is not available yet, the payment
 * is simply left pending for the next run.
 *
 * @param {object} options
 * @param {() => Promise<object[]>|object[]} options.loadPayments
 * @param {(paymentId: string, fees: object) => Promise<void>|void} options.saveFees
 */
export async function reconcileStripeFeesWith({
  loadPayments,
  saveFees,
  limit = DEFAULT_LIMIT,
  paymentIds = null,
}) {
  const payments = (await loadPayments()) || [];
  const pending = listPaymentsPendingFeeReconciliation(payments).filter(
    (payment) => !paymentIds || paymentIds.includes(payment.id),
  );
  const batch = limit > 0 ? pending.slice(0, limit) : pending;

  const summary = {
    checked: batch.length,
    reconciled: 0,
    unresolved: 0,
    failed: 0,
    pendingBefore: pending.length,
    pendingAfter: pending.length,
  };

  for (const payment of batch) {
    let fees = null;
    try {
      fees = await fetchStripePaymentFees(stripeFeeLookupKeys(payment));
    } catch {
      summary.failed += 1;
      continue;
    }

    if (!fees) {
      summary.unresolved += 1;
      continue;
    }

    try {
      await saveFees(payment.id, fees);
      summary.reconciled += 1;
    } catch {
      summary.failed += 1;
    }
  }

  summary.pendingAfter = Math.max(0, summary.pendingBefore - summary.reconciled);
  return summary;
}

/**
 * Local/dev binding: same reconciliation against the JSON file store.
 */
export async function reconcileStripeFees({ limit = DEFAULT_LIMIT, paymentIds = null } = {}) {
  const resolved = [];

  const summary = await reconcileStripeFeesWith({
    limit,
    paymentIds,
    loadPayments: () => readDb().payments || [],
    saveFees: (paymentId, fees) => {
      resolved.push({ paymentId, fees });
    },
  });

  if (resolved.length) {
    // Re-read so a webhook that landed while we were talking to Stripe is kept.
    let next = readDb();
    for (const entry of resolved) {
      next = applyStripePaymentFees(next, entry.paymentId, entry.fees);
    }
    writeDb(next);
  }

  return summary;
}
