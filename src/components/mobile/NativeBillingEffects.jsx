import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Purchases } from "@revenuecat/purchases-capacitor";
import {
  ensureNativeBillingReady,
  isNativeBillingAvailable,
  syncNativeBillingState,
} from "@/lib/mobile-billing";

let lastSyncedUserId = null;

export default function NativeBillingEffects() {
  const { user, isAuthenticated, appPublicSettings, checkUserAuth } = useAuth();
  const billing = appPublicSettings?.billing || null;

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isNativeBillingAvailable(billing)) {
      return undefined;
    }

    let cancelled = false;

    const sync = async () => {
      try {
        await ensureNativeBillingReady({ user, billing });

        if (lastSyncedUserId !== user.id) {
          await syncNativeBillingState({ user, billing });
          lastSyncedUserId = user.id;
          if (!cancelled) {
            await checkUserAuth();
          }
        }
      } catch {
        // Keep the web app usable even if native billing is not configured fully yet.
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [billing, checkUserAuth, isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isNativeBillingAvailable(billing)) {
      return undefined;
    }

    let listenerId = null;

    const attach = async () => {
      try {
        await ensureNativeBillingReady({ user, billing });
        listenerId = await Purchases.addCustomerInfoUpdateListener(async () => {
          try {
            await syncNativeBillingState({ user, billing });
            await checkUserAuth();
          } catch {
            // Ignore passive background sync failures.
          }
        });
      } catch {
        // Ignore listener registration failures until native billing is configured.
      }
    };

    attach();

    return () => {
      if (!listenerId) {
        return;
      }

      Purchases.removeCustomerInfoUpdateListener({
        listenerToRemove: listenerId,
      }).catch(() => {});
    };
  }, [billing, checkUserAuth, isAuthenticated, user]);

  return null;
}
