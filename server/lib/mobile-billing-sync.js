import { PLAN_IDS, isPremiumPlan } from "../../src/lib/plan-access.js";
import {
  fetchRevenueCatActiveEntitlements,
  getRevenueCatEntitlementId,
  resolveRevenueCatPlan,
} from "./revenuecat.js";

function normalizeStore(value) {
  return String(value || "").trim().toUpperCase() || null;
}

function getStoreLabel(value) {
  switch (normalizeStore(value)) {
    case "APP_STORE":
      return "App Store";
    case "PLAY_STORE":
      return "Google Play";
    case "AMAZON":
      return "Amazon Appstore";
    default:
      return "RevenueCat";
  }
}

function upsertPayment(payments, match, nextPayment) {
  const index = payments.findIndex(match);

  if (index === -1) {
    return [nextPayment, ...payments];
  }

  return payments.map((payment, paymentIndex) =>
    paymentIndex === index
      ? {
          ...payment,
          ...nextPayment,
          id: payment.id,
          created_at: payment.created_at || nextPayment.created_at,
        }
      : payment,
  );
}

export async function buildRevenueCatSyncResult(user, payload = {}) {
  const customerId = user?.revenuecat_app_user_id || user?.id;
  const entitlementId = getRevenueCatEntitlementId();
  const entitlementItems = await fetchRevenueCatActiveEntitlements(customerId);
  const hasPremiumEntitlement = entitlementItems.some(
    (item) => item?.entitlement_id === entitlementId,
  );

  const activeEntitlements = Array.isArray(payload?.active_entitlements)
    ? payload.active_entitlements
    : [];

  const matchingEntitlement =
    activeEntitlements.find((entry) => entry?.id === entitlementId) ||
    activeEntitlements[0] ||
    null;

  const activeSubscriptions = Array.isArray(payload?.active_subscriptions)
    ? payload.active_subscriptions.filter(Boolean)
    : [];

  const plan = hasPremiumEntitlement
    ? resolveRevenueCatPlan(activeSubscriptions, payload?.plan || user?.plan)
    : PLAN_IDS.FREE;

  return {
    customer_id: customerId,
    has_premium_access: hasPremiumEntitlement,
    plan,
    entitlement_id: hasPremiumEntitlement ? entitlementId : null,
    active_subscriptions: activeSubscriptions,
    management_url: payload?.management_url || null,
    store: matchingEntitlement?.store || null,
    product_identifier: matchingEntitlement?.product_identifier || null,
    latest_purchase_date: matchingEntitlement?.latest_purchase_date || null,
    expiration_date: matchingEntitlement?.expiration_date || null,
    original_app_user_id: payload?.original_app_user_id || customerId,
  };
}

export function applyRevenueCatSync(current, userId, syncResult, createId) {
  const user = current.users.find((entry) => entry.id === userId);

  if (!user) {
    return current;
  }

  const now = new Date().toISOString();
  const shouldDowngradeRevenueCatPlan = Boolean(
    !syncResult?.has_premium_access &&
      user.revenuecat_entitlement_id &&
      !user.stripe_customer_id &&
      !user.stripe_subscription_id,
  );
  const nextPlan = syncResult?.has_premium_access
    ? syncResult.plan
    : shouldDowngradeRevenueCatPlan
      ? PLAN_IDS.FREE
      : user.plan || PLAN_IDS.FREE;
  const nextUsers = current.users.map((entry) =>
    entry.id === userId
      ? {
          ...entry,
          plan: nextPlan,
          revenuecat_app_user_id: syncResult?.customer_id || entry.revenuecat_app_user_id || entry.id,
          revenuecat_entitlement_id:
            syncResult?.has_premium_access || !shouldDowngradeRevenueCatPlan
              ? syncResult?.entitlement_id || entry.revenuecat_entitlement_id || null
              : null,
          revenuecat_store:
            syncResult?.has_premium_access || !shouldDowngradeRevenueCatPlan
              ? syncResult?.store || entry.revenuecat_store || null
              : null,
          revenuecat_product_identifier:
            syncResult?.has_premium_access || !shouldDowngradeRevenueCatPlan
              ? syncResult?.product_identifier || entry.revenuecat_product_identifier || null
              : null,
          revenuecat_management_url:
            syncResult?.has_premium_access || !shouldDowngradeRevenueCatPlan
              ? syncResult?.management_url || entry.revenuecat_management_url || null
              : null,
          revenuecat_last_synced_at: now,
        }
      : entry,
  );

  if (!syncResult?.has_premium_access || !isPremiumPlan(nextPlan)) {
    return {
      ...current,
      users: nextUsers,
    };
  }

  const nextPayment = {
    id: createId("payment"),
    user_id: userId,
    created_at: now,
    plan: nextPlan,
    amount: 0,
    currency: "USD",
    status: "completed",
    payment_date: syncResult.latest_purchase_date || now,
    provider: "revenuecat",
    provider_label: getStoreLabel(syncResult.store),
    revenuecat_customer_id: syncResult.customer_id,
    revenuecat_entitlement_id: syncResult.entitlement_id,
    revenuecat_product_identifier: syncResult.product_identifier,
    revenuecat_management_url: syncResult.management_url,
    revenuecat_expiration_date: syncResult.expiration_date,
  };

  return {
    ...current,
    users: nextUsers,
    payments: upsertPayment(
      current.payments,
      (payment) =>
        payment.user_id === userId &&
        payment.provider === "revenuecat" &&
        payment.revenuecat_product_identifier === syncResult.product_identifier,
      nextPayment,
    ),
  };
}
