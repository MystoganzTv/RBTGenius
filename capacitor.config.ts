import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mystodev.rbtgenius",
  appName: "RBT Genius",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 700,
      launchAutoHide: true,
      backgroundColor: "#081121",
      showSpinner: false,
    },
    StatusBar: {
      style: "default",
      backgroundColor: "#081121",
      overlaysWebView: false,
    },
  },
};

export default config;
