import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import {
  LOG_LEVEL,
  PACKAGE_TYPE,
  Purchases,
} from "@revenuecat/purchases-capacitor";
import { PLAN_IDS } from "@/lib/plan-access";
import { api } from "@/lib/api";

let configuredUserId = null;
let configuredApiKey = null;

function getNativePlatform() {
  return Capacitor.getPlatform();
}

export function isNativeStorePlatform() {
  const platform = getNativePlatform();
  return platform === "ios" || platform === "android";
}

function getNativeApiKey(billing) {
  if (!billing?.revenuecat_enabled) {
    return null;
  }

  return getNativePlatform() === "ios"
    ? billing?.mobile_api_keys?.ios || null
    : billing?.mobile_api_keys?.android || null;
}

export function isNativeBillingAvailable(billing) {
  return Boolean(
    isNativeStorePlatform() &&
      billing?.revenuecat_enabled &&
      getNativeApiKey(billing),
  );
}

function serializeCustomerInfo(customerInfo) {
  const activeEntitlements = Object.values(customerInfo?.entitlements?.active || {}).map(
    (entry) => ({
      id: entry.identifier,
      product_identifier: entry.productIdentifier,
      store: entry.store,
      expiration_date: entry.expirationDate,
      latest_purchase_date: entry.latestPurchaseDate,
      will_renew: entry.willRenew,
    }),
  );

  return {
    original_app_user_id: customerInfo?.originalAppUserId || null,
    management_url: customerInfo?.managementURL || null,
    active_subscriptions: Array.isArray(customerInfo?.activeSubscriptions)
      ? customerInfo.activeSubscriptions
      : [],
    active_entitlements: activeEntitlements,
  };
}

export function hasNativePremiumEntitlement(customerInfo) {
  return Object.keys(customerInfo?.entitlements?.active || {}).length > 0;
}

export async function ensureNativeBillingReady({ user, billing }) {
  if (!isNativeBillingAvailable(billing) || !user?.id) {
    return null;
  }

  const apiKey = getNativeApiKey(billing);
  const { isConfigured } = await Purchases.isConfigured();

  if (!isConfigured) {
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO });
    await Purchases.configure({
      apiKey,
      appUserID: user.id,
    });
    configuredUserId = user.id;
    configuredApiKey = apiKey;
    return user.id;
  }

  if (configuredUserId !== user.id || configuredApiKey !== apiKey) {
    await Purchases.logIn({ appUserID: user.id });
    configuredUserId = user.id;
    configuredApiKey = apiKey;
  }

  return user.id;
}

export async function getNativeCustomerInfo({ user, billing }) {
  await ensureNativeBillingReady({ user, billing });
  const result = await Purchases.getCustomerInfo();
  return result.customerInfo;
}

function getPackageForPlan(offering, planId) {
  if (!offering) {
    return null;
  }

  if (planId === PLAN_IDS.PREMIUM_YEARLY) {
    return (
      offering.annual ||
      Object.values(offering.availablePackages || {}).find(
        (entry) => entry?.packageType === PACKAGE_TYPE.ANNUAL,
      ) ||
      null
    );
  }

  return (
    offering.monthly ||
    Object.values(offering.availablePackages || {}).find(
      (entry) => entry?.packageType === PACKAGE_TYPE.MONTHLY,
    ) ||
    null
  );
}

export async function getNativePlanAvailability({ user, billing }) {
  if (!isNativeBillingAvailable(billing)) {
    return {};
  }

  await ensureNativeBillingReady({ user, billing });
  const offerings = await Purchases.getOfferings();
  const currentOffering =
    offerings?.current ||
    (billing?.mobile_offering_identifier
      ? offerings?.all?.[billing.mobile_offering_identifier]
      : null);

  return {
    [PLAN_IDS.PREMIUM_MONTHLY]: Boolean(
      getPackageForPlan(currentOffering, PLAN_IDS.PREMIUM_MONTHLY),
    ),
    [PLAN_IDS.PREMIUM_YEARLY]: Boolean(
      getPackageForPlan(currentOffering, PLAN_IDS.PREMIUM_YEARLY),
    ),
  };
}

export async function purchaseNativePlan({ user, billing, planId }) {
  await ensureNativeBillingReady({ user, billing });
  const offerings = await Purchases.getOfferings();
  const currentOffering =
    offerings?.current ||
    (billing?.mobile_offering_identifier
      ? offerings?.all?.[billing.mobile_offering_identifier]
      : null);

  const selectedPackage = getPackageForPlan(currentOffering, planId);

  if (!selectedPackage) {
    throw new Error("The native subscription package is not configured for this plan yet.");
  }

  const result = await Purchases.purchasePackage({ aPackage: selectedPackage });
  const customerInfo = result?.customerInfo;

  if (!customerInfo) {
    throw new Error("The purchase completed without updated customer info.");
  }

  await api.syncMobileBilling({
    plan: planId,
    customer_info: serializeCustomerInfo(customerInfo),
  });

  return customerInfo;
}

export async function restoreNativePurchases({ user, billing }) {
  await ensureNativeBillingReady({ user, billing });
  const result = await Purchases.restorePurchases();
  const customerInfo = result?.customerInfo;

  await api.syncMobileBilling({
    customer_info: serializeCustomerInfo(customerInfo),
  });

  return customerInfo;
}

export async function syncNativeBillingState({ user, billing }) {
  const customerInfo = await getNativeCustomerInfo({ user, billing });

  await api.syncMobileBilling({
    customer_info: serializeCustomerInfo(customerInfo),
  });

  return customerInfo;
}

export async function openNativeManagementUrl(url) {
  if (!url) {
    return false;
  }

  if (!isNativeStorePlatform()) {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  await Browser.open({ url });
  return true;
}

export async function openNativeManagement({ user, billing, fallbackUrl = null }) {
  const customerInfo = await getNativeCustomerInfo({ user, billing });
  const targetUrl = customerInfo?.managementURL || fallbackUrl;
  return openNativeManagementUrl(targetUrl);
}

export function isNativePurchaseCancelled(error) {
  return (
    String(error?.code || "") === "1" ||
    /cancel/i.test(String(error?.message || ""))
  );
}
