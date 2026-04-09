import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveApiUrl } from "@/lib/api";
import { appParams } from "@/lib/app-params";
import { logNativeAuthDebug } from "@/lib/native-auth-debug";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "rbt_genius_auth_token";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function persistAuthToken(token) {
  const storage = getStorage();

  if (!storage || !token) {
    return;
  }

  storage.setItem(AUTH_STORAGE_KEY, token);
  storage.setItem("access_token", token);
}

function clearAuthToken() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_STORAGE_KEY);
  storage.removeItem("access_token");
  storage.removeItem("token");
}

function getStoredAuthToken() {
  const storage = getStorage();

  if (appParams.token) {
    persistAuthToken(appParams.token);
    return appParams.token;
  }

  if (!storage) {
    return null;
  }

  const token =
    storage.getItem(AUTH_STORAGE_KEY) ||
    storage.getItem("access_token") ||
    storage.getItem("token");

  if (token) {
    persistAuthToken(token);
  }

  return token;
}

async function requestJson(url, options = {}, fetchImpl = fetch) {
  const { token, headers = {}, ...restOptions } = options;
  const resolvedUrl = resolveApiUrl(url);

  const response = await fetchImpl(resolvedUrl, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (
    response.ok &&
    typeof data === "string" &&
    /<(?:!doctype|html|head|body)\b/i.test(data) &&
    String(resolvedUrl).includes("/api/")
  ) {
    throw new Error("The app is not connected to the API correctly yet.");
  }

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      response.statusText ||
      "Request failed";
    const error = new Error(message);

    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizeAuthError(error) {
  if (error?.status === 403 && error?.data?.extra_data?.reason) {
    const reason = error.data.extra_data.reason;

    if (reason === "auth_required") {
      return {
        type: "auth_required",
        message: "Authentication required",
      };
    }

    if (reason === "user_not_registered") {
      return {
        type: "user_not_registered",
        message: "User not registered for this app",
      };
    }

    return {
      type: reason,
      message: error.message,
    };
  }

  if (error?.status === 401 || error?.status === 403) {
    return {
      type: "auth_required",
      message: "Authentication required",
    };
  }

  return {
    type: "unknown",
    message: error?.message || "An unexpected error occurred",
  };
}

export function AuthProvider({
  children,
  endpoints = {},
  loginPath = "/login",
  fetchImpl = fetch,
}) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const resolvedEndpoints = useMemo(
    () => ({
      me: endpoints.me || resolveApiUrl("/api/auth/me"),
      publicSettings:
        endpoints.publicSettings || resolveApiUrl("/api/public-settings"),
      logout: endpoints.logout || resolveApiUrl("/api/auth/logout"),
    }),
    [endpoints.logout, endpoints.me, endpoints.publicSettings],
  );

  const checkUserAuth = useCallback(
    async (tokenOverride) => {
      const token = tokenOverride || getStoredAuthToken();

      try {
        setIsLoadingAuth(true);

        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        persistAuthToken(token);

        if (!resolvedEndpoints.me) {
          setIsAuthenticated(true);
          return;
        }

        const currentUser = await requestJson(
          resolvedEndpoints.me,
          { token },
          fetchImpl,
        );

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
        setAuthError((current) =>
          current?.type === "user_not_registered"
            ? current
            : normalizeAuthError(error),
        );
      } finally {
        setIsLoadingAuth(false);
      }
    },
    [fetchImpl, resolvedEndpoints.me],
  );

  const checkAppState = useCallback(async () => {
    const token = getStoredAuthToken();

    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      if (resolvedEndpoints.publicSettings) {
        const publicSettings = await requestJson(
          resolvedEndpoints.publicSettings,
          {
            token,
            headers: appParams.appId ? { "X-App-Id": appParams.appId } : {},
          },
          fetchImpl,
        );

        setAppPublicSettings(publicSettings);

        if (!token && publicSettings?.auth_required) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
          setAuthError({
            type: "auth_required",
            message: "Authentication required",
          });
          return;
        }
      }

      if (token) {
        await checkUserAuth(token);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      setAppPublicSettings(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthError(normalizeAuthError(error));
    } finally {
      setIsLoadingPublicSettings(false);
    }
  }, [checkUserAuth, fetchImpl, resolvedEndpoints.publicSettings]);

  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let isMounted = true;

    const handleNativeOAuth = async (event) => {
      const token = event?.detail?.token;
      const redirectTo =
        typeof event?.detail?.redirectTo === "string" &&
        event.detail.redirectTo.startsWith("/")
          ? event.detail.redirectTo
          : "/";

      if (!token) {
        return;
      }

      try {
        persistAuthToken(token);
        await checkUserAuth(token);

        if (isMounted) {
          window.location.assign(redirectTo);
        }
      } catch {
        if (isMounted) {
          clearAuthToken();
          window.location.assign(
            `/login?oauthError=${encodeURIComponent("Unable to complete sign in")}`,
          );
        }
      }
    };

    window.addEventListener("rbt-genius-native-oauth", handleNativeOAuth);
    return () => {
      isMounted = false;
      window.removeEventListener("rbt-genius-native-oauth", handleNativeOAuth);
    };
  }, [checkUserAuth]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    window.__rbtNativeCompleteAuth = async ({ token, redirectTo } = {}) => {
      if (!token) {
        logNativeAuthDebug("auth_context_missing_token");
        return false;
      }

      try {
        logNativeAuthDebug("auth_context_get_me_start", redirectTo || "/");
        persistAuthToken(token);
        const currentUser = await requestJson(
          resolvedEndpoints.me,
          { token },
          fetchImpl,
        );

        setUser(currentUser);
        setIsAuthenticated(true);
        setAuthError(null);
        setIsLoadingAuth(false);
        logNativeAuthDebug("auth_context_get_me_success", currentUser?.email || currentUser?.id || "ok");

        if (redirectTo) {
          logNativeAuthDebug("auth_context_redirect", redirectTo);
          window.location.assign(redirectTo);
        }

        return true;
      } catch {
        logNativeAuthDebug("auth_context_get_me_failed");
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    };

    return () => {
      delete window.__rbtNativeCompleteAuth;
    };
  }, [fetchImpl, resolvedEndpoints.me]);

  const login = useCallback((nextAuth = {}) => {
    const authPayload =
      nextAuth &&
      typeof nextAuth === "object" &&
      ("user" in nextAuth || "token" in nextAuth)
        ? nextAuth
        : { user: nextAuth };

    if (authPayload.token) {
      persistAuthToken(authPayload.token);
    }

    setUser(authPayload.user || null);
    setIsAuthenticated(Boolean(authPayload.token || authPayload.user));
    setAuthError(null);
  }, []);

  const logout = useCallback(
    async (shouldRedirect = true) => {
      const token = getStoredAuthToken();

      if (resolvedEndpoints.logout && token) {
        try {
          await requestJson(
            resolvedEndpoints.logout,
            {
              method: "POST",
              token,
            },
            fetchImpl,
          );
        } catch {
          // Ignore logout request failures and continue cleaning local state.
        }
      }

      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);

      if (shouldRedirect && typeof window !== "undefined") {
        window.location.assign(loginPath);
      }
    },
    [fetchImpl, loginPath, resolvedEndpoints.logout],
  );

  const navigateToLogin = useCallback(
    (redirectTo) => {
      if (typeof window === "undefined") {
        return;
      }

      if (window.location.pathname === loginPath) {
        return;
      }

      const destination = redirectTo || window.location.href;
      const url = new URL(loginPath, window.location.origin);

      url.searchParams.set("redirectTo", destination);
      window.location.assign(url.toString());
    },
    [loginPath],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      login,
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
    }),
    [
      appPublicSettings,
      authError,
      checkAppState,
      checkUserAuth,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      login,
      logout,
      navigateToLogin,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext };
