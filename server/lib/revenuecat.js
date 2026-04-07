import { PLAN_IDS, normalizePlan } from "../../src/lib/plan-access.js";

const REVENUECAT_BASE_URL = "https://api.revenuecat.com/v2";

const MOBILE_PRODUCT_ENV = {
  [PLAN_IDS.PREMIUM_MONTHLY]: "REVENUECAT_PRODUCTS_PREMIUM_MONTHLY",
  [PLAN_IDS.PREMIUM_YEARLY]: "REVENUECAT_PRODUCTS_PREMIUM_YEARLY",
};

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function splitEnvList(name) {
  return String(process.env[name] || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getPrivateConfig() {
  return {
    secretKey: readEnv("REVENUECAT_SECRET_KEY"),
    projectId: readEnv("REVENUECAT_PROJECT_ID"),
    entitlementId: readEnv("REVENUECAT_PREMIUM_ENTITLEMENT_ID"),
  };
}

function getPublicConfig() {
  return {
    iosApiKey: readEnv("REVENUECAT_IOS_API_KEY"),
    androidApiKey: readEnv("REVENUECAT_ANDROID_API_KEY"),
    offeringIdentifier: readEnv("REVENUECAT_OFFERING_ID") || "default",
  };
}

export function isRevenueCatPublicConfigReady() {
  const config = getPublicConfig();
  return Boolean(config.iosApiKey || config.androidApiKey);
}

export function isRevenueCatSyncReady() {
  const config = getPrivateConfig();
  return Boolean(
    isRevenueCatPublicConfigReady() &&
      config.secretKey &&
      config.projectId &&
      config.entitlementId,
  );
}

export function getRevenueCatPublicBillingConfig() {
  const publicConfig = getPublicConfig();
  const enabled = isRevenueCatSyncReady();

  return {
    enabled,
    offering_identifier: publicConfig.offeringIdentifier,
    api_keys: {
      ios: publicConfig.iosApiKey,
      android: publicConfig.androidApiKey,
    },
    checkout_enabled: {
      [PLAN_IDS.PREMIUM_MONTHLY]: enabled,
      [PLAN_IDS.PREMIUM_YEARLY]: enabled,
    },
  };
}

function ensureRevenueCatSyncReady() {
  const config = getPrivateConfig();

  if (!isRevenueCatPublicConfigReady()) {
    throw new Error("RevenueCat public SDK keys are not configured yet.");
  }

  if (!config.secretKey || !config.projectId || !config.entitlementId) {
    throw new Error("RevenueCat server sync is not configured yet.");
  }

  return config;
}

function buildRevenueCatHeaders() {
  const config = ensureRevenueCatSyncReady();
  return {
    Authorization: `Bearer ${config.secretKey}`,
    "Content-Type": "application/json",
  };
}

export function resolveRevenueCatPlan(activeProductIds = [], fallbackPlan = null) {
  const normalizedFallback = normalizePlan(fallbackPlan);

  const matchedPlan = Object.entries(MOBILE_PRODUCT_ENV).find(([, envName]) => {
    const expectedIds = splitEnvList(envName);
    return expectedIds.some((productId) => activeProductIds.includes(productId));
  })?.[0];

  if (matchedPlan) {
    return normalizePlan(matchedPlan);
  }

  if (normalizedFallback === PLAN_IDS.PREMIUM_YEARLY) {
    return PLAN_IDS.PREMIUM_YEARLY;
  }

  if (normalizedFallback === PLAN_IDS.PREMIUM_MONTHLY) {
    return PLAN_IDS.PREMIUM_MONTHLY;
  }

  return PLAN_IDS.PREMIUM_MONTHLY;
}

export async function fetchRevenueCatActiveEntitlements(customerId) {
  const config = ensureRevenueCatSyncReady();
  const encodedCustomerId = encodeURIComponent(String(customerId || "").trim());

  if (!encodedCustomerId) {
    throw new Error("RevenueCat customer id is required.");
  }

  const response = await fetch(
    `${REVENUECAT_BASE_URL}/projects/${config.projectId}/customers/${encodedCustomerId}/active_entitlements`,
    {
      method: "GET",
      headers: buildRevenueCatHeaders(),
    },
  );

  if (response.status === 404) {
    return [];
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to read RevenueCat entitlements.");
  }

  return Array.isArray(data?.items) ? data.items : [];
}

export function getRevenueCatEntitlementId() {
  return ensureRevenueCatSyncReady().entitlementId;
}
