import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyStripeChargeIdentifiers,
  applyStripePaymentFees,
  applyStripeWebhookEvent,
} from '../server/lib/stripe-sync.js';
import { paymentNeedsFeeReconciliation, stripeFeeLookupKeys } from '../server/lib/billing.js';

function baseDb() {
  return {
    users: [{ id: 'u1', plan: 'premium_monthly', stripe_customer_id: 'cus_1' }],
    payments: [
      {
        id: 'pay_1',
        user_id: 'u1',
        provider: 'stripe',
        status: 'completed',
        amount: 19.99,
        stripe_invoice_id: 'in_1',
        stripe_session_id: null,
        stripe_charge_id: null,
        stripe_payment_intent_id: null,
      },
    ],
    stripeEvents: {},
  };
}

test('a charge webhook links the charge id to the recorded payment', () => {
  const next = applyStripeWebhookEvent(
    baseDb(),
    {
      id: 'evt_1',
      type: 'charge.succeeded',
      data: { object: { id: 'ch_1', invoice: 'in_1', payment_intent: 'pi_1' } },
    },
    () => 'unused',
  );

  assert.equal(next.payments[0].stripe_charge_id, 'ch_1');
  assert.equal(next.payments[0].stripe_payment_intent_id, 'pi_1');
  assert.equal(next.stripeEvents.evt_1.type, 'charge.succeeded');
});

test('an unrelated charge does not touch other payments', () => {
  const before = baseDb();
  const next = applyStripeChargeIdentifiers(before, { id: 'ch_other', invoice: 'in_other' });
  assert.equal(next, before);
});

test('applying balance transaction data stores the real fee and net', () => {
  const next = applyStripePaymentFees(baseDb(), 'pay_1', {
    charge_id: 'ch_1',
    balance_transaction_id: 'txn_1',
    fee: 0.88,
    net: 19.11,
    settlement_currency: 'USD',
    available_on: '2026-08-05T00:00:00.000Z',
    reconciled_at: '2026-08-02T12:00:00.000Z',
    source: 'stripe_balance_transaction',
  });

  const payment = next.payments[0];
  assert.equal(payment.stripe_fee, 0.88);
  assert.equal(payment.stripe_net, 19.11);
  assert.equal(payment.stripe_balance_transaction_id, 'txn_1');
  assert.equal(paymentNeedsFeeReconciliation(payment), false);
});

test('incomplete fee payloads are rejected instead of faking a net', () => {
  const before = baseDb();
  assert.equal(applyStripePaymentFees(before, 'pay_1', null), before);
  assert.equal(applyStripePaymentFees(before, 'pay_1', { fee: 0.88 }), before);
  assert.equal(applyStripePaymentFees(before, 'missing', { fee: 1, net: 2 }), before);
});

test('only completed Stripe payments without a net are queued for reconciliation', () => {
  const [payment] = baseDb().payments;
  assert.equal(paymentNeedsFeeReconciliation(payment), true);
  assert.equal(paymentNeedsFeeReconciliation({ ...payment, provider: 'revenuecat' }), false);
  assert.equal(paymentNeedsFeeReconciliation({ ...payment, status: 'pending' }), false);
  assert.deepEqual(stripeFeeLookupKeys(payment), {
    chargeId: null,
    paymentIntentId: null,
    invoiceId: 'in_1',
    sessionId: null,
  });
});
