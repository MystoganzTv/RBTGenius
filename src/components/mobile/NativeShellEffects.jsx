import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useTheme } from "@/hooks/use-theme";
import { NATIVE_AUTH_CALLBACK_SCHEME } from "@/lib/api";

function getStatusBarStyle(isDark) {
  return isDark ? Style.Dark : Style.Light;
}

function getStatusBarColor(isDark) {
  return isDark ? "#081121" : "#f8fbff";
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

      let targetUrl;

      try {
        targetUrl = new URL(url);
      } catch {
        return;
      }

      if (targetUrl.protocol !== `${NATIVE_AUTH_CALLBACK_SCHEME}:`) {
        return;
      }

      const nextPath = `${targetUrl.pathname || "/login"}${targetUrl.search}${targetUrl.hash}`;
      Browser.close().catch(() => {});

      window.setTimeout(() => {
        window.location.assign(nextPath.startsWith("/") ? nextPath : `/${nextPath}`);
      }, 0);
    });

    return () => {
      listener.then((handle) => handle.remove()).catch(() => {});
    };
  }, []);

  return null;
}
