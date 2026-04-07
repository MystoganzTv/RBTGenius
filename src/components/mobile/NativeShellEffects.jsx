import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useTheme } from "@/hooks/use-theme";

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

  return null;
}
