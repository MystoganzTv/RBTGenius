import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const REVENUECAT_API_KEY = 'appl_fKgYufvLyPKZGTjOdEoAtsNwjnU';
let isConfigured = false;
let currentAppUserId = null;

export async function initRevenueCat(userId) {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  if (!isConfigured) {
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    isConfigured = true;
  }

  if (!userId || currentAppUserId === userId) {
    return;
  }

  try {
    await Purchases.logIn(userId);
    currentAppUserId = userId;
  } catch {}
}

export async function resetRevenueCat() {
  if (!isConfigured) {
    currentAppUserId = null;
    return;
  }

  try {
    await Purchases.logOut();
  } catch {}

  currentAppUserId = null;
}

export async function getOfferings() {
  try { const o = await Purchases.getOfferings(); return o.current ?? null; }
  catch (e) { console.warn('[RC]', e); return null; }
}
export async function purchasePackage(pkg) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: customerInfo.entitlements.active['pro'] !== undefined, customerInfo };
  } catch (e) {
    console.warn('[RC purchase]', e.code, e.message, 'userCancelled:', e.userCancelled);
    if (e.userCancelled) return { success: false, cancelled: true };
    // The user may already own the subscription (e.g. sandbox "You're currently
    // subscribed", or PRODUCT_ALREADY_PURCHASED). That's not a failure — check
    // the current entitlement and treat an active 'pro' as success.
    try {
      const ci = await Purchases.getCustomerInfo();
      if (ci.entitlements.active['pro'] !== undefined) {
        return { success: true, customerInfo: ci, alreadyActive: true };
      }
    } catch { /* fall through */ }
    return { success: false, error: e.message };
  }
}
export async function restorePurchases() {
  try { const ci = await Purchases.restorePurchases(); return ci.entitlements.active['pro'] !== undefined; }
  catch { return false; }
}
export async function checkProStatus() {
  try { const ci = await Purchases.getCustomerInfo(); return ci.entitlements.active['pro'] !== undefined; }
  catch { return false; }
}
