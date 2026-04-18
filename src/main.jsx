import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

const LEGACY_SW_RESET_KEY = "rbt_genius_legacy_sw_reset";

async function cleanupLegacyServiceWorkers() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return true;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  if (!registrations.length) {
    return true;
  }

  await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));

  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey).catch(() => false)));
  }

  if (navigator.serviceWorker.controller && !window.sessionStorage.getItem(LEGACY_SW_RESET_KEY)) {
    window.sessionStorage.setItem(LEGACY_SW_RESET_KEY, "1");
    window.location.replace(window.location.href);
    return false;
  }

  window.sessionStorage.removeItem(LEGACY_SW_RESET_KEY);
  return true;
}

async function bootstrap() {
  const shouldRender = await cleanupLegacyServiceWorkers();
  if (!shouldRender) {
    return;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

bootstrap();
