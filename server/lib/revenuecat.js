// RevenueCat server helpers — bridge App Store / RevenueCat purchases into the
// app's plan model. The mobile app calls `Purchases.logIn(user.id)`, so the
// RevenueCat *app_user_id* is always our internal user id.
//
// Two entry points use this:
//   1. POST /api/billing/revenuecat-sync   — app-driven, synchronous check after
//      a purchase/restore (queries the RevenueCat REST API).
//   2. POST /api/billing/revenuecat-webhook — RevenueCat-driven, for renewals,
//      cancellations and expirations over time.
//
// The entitlement identifier in RevenueCat must be exactly `pro` (matches the
// mobile app's `entitlements.active['pro']`).

import { PLAN_IDS } from '../../shared/plan-access.js';

const RC_API_BASE = 'https://api.revenuecat.com/v1';
export const RC_ENTITLEMENT_ID = 'pro';

// Map a RevenueCat / App Store product identifier to one of our plan ids.
// Robust to store suffixes (e.g. Google base-plan ":p1m") by substring match.
export function resolvePlanFromRevenueCatProduct(productId) {
  const id = String(productId || '').toLowerCase();
  if (!id) return null;
  if (id.includes('year') || id.includes('annual')) return PLAN_IDS.PREMIUM_YEARLY;
  if (id.includes('month')) return PLAN_IDS.PREMIUM_MONTHLY;
  return null;
}

function isEntitlementActive(entitlement, nowMs = Date.now()) {
  if (!entitlement) return false;
  const expires = entitlement.expires_date;
  if (!expires) return true; // lifetime / non-expiring
  const expiresMs = Date.parse(expires);
  return Number.isFinite(expiresMs) ? expiresMs > nowMs : false;
}

// Given a RevenueCat REST `subscriber` object, return the premium plan id if the
// `pro` entitlement is currently active, otherwise null.
export function derivePlanFromSubscriber(subscriber, nowMs = Date.now()) {
  const ent = subscriber?.entitlements?.[RC_ENTITLEMENT_ID];
  if (!isEntitlementActive(ent, nowMs)) return null;
  return resolvePlanFromRevenueCatProduct(ent.product_identifier) || PLAN_IDS.PREMIUM_MONTHLY;
}

export function isRevenueCatConfigured() {
  return Boolean(process.env.REVENUECAT_SECRET_KEY);
}

// Query the RevenueCat REST API for a subscriber. Returns the `subscriber`
// object or null. Throws only on configuration errors.
export async function fetchRevenueCatSubscriber(appUserId) {
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) throw new Error('REVENUECAT_SECRET_KEY is not configured');
  if (!appUserId) return null;

  const res = await fetch(`${RC_API_BASE}/subscribers/${encodeURIComponent(appUserId)}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 404) return null; // unknown subscriber = no purchases yet
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`RevenueCat API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => ({}));
  return data?.subscriber ?? null;
}

// Verify the Authorization header sent by RevenueCat webhooks. Configure the
// same value in RevenueCat → Project settings → Integrations → Webhooks.
export function verifyWebhookAuth(authorizationHeader) {
  const expected = process.env.REVENUECAT_WEBHOOK_AUTH;
  if (!expected) return false; // not configured → reject (fail closed)
  return authorizationHeader === expected || authorizationHeader === `Bearer ${expected}`;
}

// Webhook event types that mean the subscription is (still) active.
const ACTIVE_EVENT_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
]);

// Event types that mean access should end now.
const EXPIRE_EVENT_TYPES = new Set([
  'EXPIRATION',
  'SUBSCRIPTION_PAUSED',
]);

// Decide what a webhook event implies for our plan model.
// Returns { action: 'upgrade'|'downgrade'|'ignore', plan, appUserIds }
export function interpretWebhookEvent(event) {
  if (!event || !event.type) return { action: 'ignore' };

  const appUserIds = [event.app_user_id, event.original_app_user_id].filter(Boolean);
  const type = event.type;

  // CANCELLATION = auto-renew turned off; user keeps access until expiry → ignore.
  // BILLING_ISSUE = grace period → ignore (don't punish on a transient failure).
  if (ACTIVE_EVENT_TYPES.has(type)) {
    const plan = resolvePlanFromRevenueCatProduct(event.product_id) || PLAN_IDS.PREMIUM_MONTHLY;
    return { action: 'upgrade', plan, appUserIds };
  }
  if (EXPIRE_EVENT_TYPES.has(type)) {
    return { action: 'downgrade', plan: PLAN_IDS.FREE, appUserIds };
  }
  return { action: 'ignore', appUserIds };
}
