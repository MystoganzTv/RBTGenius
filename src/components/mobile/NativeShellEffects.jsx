import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useTheme } from "@/hooks/use-theme";
import { NATIVE_AUTH_CALLBACK_SCHEME } from "@/lib/api";
import { logNativeAuthDebug } from "@/lib/native-auth-debug";
import { createPageUrl } from "@/utils";

const PENDING_NATIVE_AUTH_TOKEN_KEY = "rbt_genius_pending_native_auth_token";
const PENDING_NATIVE_AUTH_STATE_KEY = "rbt_genius_native_auth_pending";

function emitNativeOAuthToken(token, redirectTo) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("rbt-genius-native-oauth-token", {
      detail: { token, redirectTo },
    }),
  );
}

function getStatusBarStyle(isDark) {
  return isDark ? Style.Dark : Style.Light;
}

function getStatusBarColor(isDark) {
  return isDark ? "#081121" : "#f8fbff";
}

function normalizeNativeRedirectPath(value) {
  if (!value) {
    return createPageUrl("Dashboard");
  }

  if (value.startsWith("/")) {
    return value;
  }

  return createPageUrl("Dashboard");
}

export default function NativeShellEffects() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    const syncNativeChrome = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {}

      try {
        await StatusBar.setBackgroundColor({ color: getStatusBarColor(isDark) });
      } catch {}

      try {
        await StatusBar.setStyle({ style: getStatusBarStyle(isDark) });
      } catch {}

      try {
        await SplashScreen.hide({ fadeOutDuration: 250 });
      } catch {}
    };

    syncNativeChrome();
    return undefined;
  }, [isDark]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    const listener = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack && window.history.length > 1) {
        window.history.back();
        return;
      }

      CapacitorApp.minimizeApp().catch(() => {});
    });

    return () => {
      listener.then((handle) => handle.remove()).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    const listener = CapacitorApp.addListener("appUrlOpen", ({ url }) => {
      if (!url) {
        return;
      }

      logNativeAuthDebug("callback_received", url);

      let targetUrl;

      try {
        targetUrl = new URL(url);
      } catch {
        logNativeAuthDebug("callback_invalid_url", url);
        return;
      }

      if (targetUrl.protocol !== `${NATIVE_AUTH_CALLBACK_SCHEME}:`) {
        logNativeAuthDebug("callback_ignored_protocol", targetUrl.protocol);
        return;
      }

      const authToken = targetUrl.searchParams.get("authToken");
      const redirectTo = normalizeNativeRedirectPath(
        targetUrl.searchParams.get("redirectTo"),
      );
      const loginPath = `${
        targetUrl.pathname || "/login"
      }${targetUrl.search}${targetUrl.hash}`;

      if (authToken) {
        logNativeAuthDebug("callback_token_found", redirectTo);
        window.localStorage.setItem("rbt_genius_auth_token", authToken);
        window.localStorage.setItem("access_token", authToken);
        window.localStorage.setItem(PENDING_NATIVE_AUTH_TOKEN_KEY, authToken);
        window.localStorage.setItem(PENDING_NATIVE_AUTH_STATE_KEY, "1");

        if (typeof window.__rbtNativeCompleteAuth === "function") {
          logNativeAuthDebug("callback_auth_context_start", redirectTo);
          window.__rbtNativeCompleteAuth({
            token: authToken,
            redirectTo,
          })
            .then((handled) => {
              if (handled) {
                logNativeAuthDebug("callback_auth_context_success", redirectTo);
                return;
              }

              logNativeAuthDebug("callback_auth_context_failed", redirectTo);
              logNativeAuthDebug("callback_emit_fallback_event", redirectTo);
              emitNativeOAuthToken(authToken, redirectTo);
              window.location.assign(
                `/login?nativeAuth=1&redirectTo=${encodeURIComponent(redirectTo)}`,
              );
            })
            .catch(() => {
              logNativeAuthDebug("callback_auth_context_failed", redirectTo);
              logNativeAuthDebug("callback_emit_fallback_event", redirectTo);
              emitNativeOAuthToken(authToken, redirectTo);
              window.location.assign(
                `/login?nativeAuth=1&redirectTo=${encodeURIComponent(redirectTo)}`,
              );
            });
        } else {
          logNativeAuthDebug("callback_emit_fallback_event", redirectTo);
          emitNativeOAuthToken(authToken, redirectTo);
          window.location.assign(
            `/login?nativeAuth=1&redirectTo=${encodeURIComponent(redirectTo)}`,
          );
        }

        Browser.close().catch(() => {});
        return;
      }

      logNativeAuthDebug("callback_no_token_redirect", loginPath);
      Browser.close().catch(() => {});
      window.location.assign(
        loginPath.startsWith("/") ? loginPath : `/${loginPath}`,
      );
    });

    return () => {
      listener.then((handle) => handle.remove()).catch(() => {});
    };
  }, []);

  return null;
}
