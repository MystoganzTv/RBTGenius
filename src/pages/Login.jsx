<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import {
  BadgeCheck,
  Building2,
  Github,
  Globe,
  GraduationCap,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
=======
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { GraduationCap, Loader2, Sparkles } from "lucide-react";
>>>>>>> main
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { api, isNativeAppRuntime } from "@/lib/api";
import { appParams } from "@/lib/app-params";
import { useAuth } from "@/lib/AuthContext";
import { translateUi } from "@/lib/i18n";
import {
  clearNativeAuthDebug,
  DEBUG_EVENT_NAME,
  logNativeAuthDebug,
  readNativeAuthDebug,
} from "@/lib/native-auth-debug";
import { enableNativePreviewMode } from "@/lib/native-preview";
import { createPageUrl } from "@/utils";

<<<<<<< HEAD
const OAUTH_OPTIONS = [
  {
    id: "google",
    label: "Continue with Google",
    Icon: Globe,
  },
  {
    id: "apple",
    label: "Continue with Apple",
    Icon: BadgeCheck,
  },
  {
    id: "github",
    label: "Continue with GitHub",
    Icon: Github,
  },
  {
    id: "microsoft",
    label: "Continue with Microsoft",
    Icon: Building2,
  },
];

const NATIVE_FALLBACK_PROVIDER_IDS = ["google"];

const providerButtonStyles = {
  google:
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  apple:
    "border-black bg-black text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
  github:
    "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
  microsoft:
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
};

const PENDING_NATIVE_AUTH_TOKEN_KEY = "rbt_genius_pending_native_auth_token";
const PENDING_NATIVE_AUTH_STATE_KEY = "rbt_genius_native_auth_pending";
const AUTH_STORAGE_KEYS = ["rbt_genius_auth_token", "access_token", "token"];

function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of AUTH_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
}

=======
>>>>>>> main
function normalizeRedirectPath(value) {
  if (!value) {
    return createPageUrl("Dashboard");
  }

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || createPageUrl("Dashboard");
  } catch {
    return createPageUrl("Dashboard");
  }
}

function getRedirectPath(search) {
  const params = new URLSearchParams(search);
  return normalizeRedirectPath(params.get("redirectTo"));
}

export default function Login() {
  const location = useLocation();
  const { language } = useLanguage();
  const {
    user,
    isAuthenticated,
    isLoadingAuth,
    authError,
    login,
  } = useAuth();
  const redirectPath = useMemo(() => getRedirectPath(location.search), [location.search]);
  const googleAuthUrl = useMemo(
    () => api.getOAuthStartUrl("google", redirectPath),
    [redirectPath],
  );
  const initialMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("mode") === "register" ? "register" : "login";
  }, [location.search]);
<<<<<<< HEAD
  const { user, isAuthenticated, login, checkUserAuth } = useAuth();
=======
>>>>>>> main
  const t = (value) => translateUi(value, language);
  const canUseNativePreviewMode =
    isNativeAppRuntime() && String(appParams.nativePreview || "").toLowerCase() === "true";

  const [activeTab, setActiveTab] = useState(initialMode);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
<<<<<<< HEAD
  const [authProviders, setAuthProviders] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [debugEntries, setDebugEntries] = useState(() => readNativeAuthDebug());
  const fallbackNativeProviders = useMemo(
    () => OAUTH_OPTIONS.filter((option) => NATIVE_FALLBACK_PROVIDER_IDS.includes(option.id)),
    [],
  );
  const availableProviders = useMemo(
    () => {
      const configuredProviders = OAUTH_OPTIONS.filter((option) =>
        authProviders.some((provider) => provider.id === option.id),
      );

      if (configuredProviders.length > 0) {
        return configuredProviders;
      }

      if (isNativeAppRuntime()) {
        return fallbackNativeProviders;
      }

      return [];
    },
    [authProviders, fallbackNativeProviders],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const providersLoadTimeout = isNativeAppRuntime() ? 10000 : 2500;
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, providersLoadTimeout);

    api
      .getAuthProviders({ signal: controller.signal })
      .then((data) => {
        if (isMounted) {
          setAuthProviders(data?.providers || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthProviders([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProviders(false);
        }
        window.clearTimeout(timeoutId);
      });

    return () => {
      isMounted = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      logNativeAuthDebug("login_effect_authenticated", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath, user]);
=======
>>>>>>> main

  useEffect(() => {
    if (typeof window === "undefined" || !isNativeAppRuntime()) {
      return undefined;
    }

    const refreshDebug = (event) => {
      setDebugEntries(event?.detail?.entries || readNativeAuthDebug());
    };

    window.addEventListener(DEBUG_EVENT_NAME, refreshDebug);

    return () => {
      window.removeEventListener(DEBUG_EVENT_NAME, refreshDebug);
    };
  }, []);

  const completeTokenSignIn = useCallback(
    async (authToken, nextRedirectPath = redirectPath) => {
      if (!authToken) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage("");
      logNativeAuthDebug("login_complete_start", nextRedirectPath);

      try {
        if (isNativeAppRuntime()) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("rbt_genius_auth_token", authToken);
            window.localStorage.setItem("access_token", authToken);
            window.localStorage.removeItem(PENDING_NATIVE_AUTH_TOKEN_KEY);
            window.localStorage.removeItem(PENDING_NATIVE_AUTH_STATE_KEY);
          }

          logNativeAuthDebug("login_native_bypass_reload", nextRedirectPath);
          window.location.assign(nextRedirectPath);
          return;
        }

        if (typeof window !== "undefined") {
          window.localStorage.setItem("rbt_genius_auth_token", authToken);
          window.localStorage.setItem("access_token", authToken);
        }

        const authCompleted = await checkUserAuth(authToken);

        if (!authCompleted) {
          throw new Error("Unable to complete sign in");
        }

        logNativeAuthDebug("login_complete_get_me_success", "ok");

        if (typeof window !== "undefined") {
          window.localStorage.removeItem(PENDING_NATIVE_AUTH_TOKEN_KEY);
          window.localStorage.removeItem(PENDING_NATIVE_AUTH_STATE_KEY);
        }

        if (isNativeAppRuntime()) {
          api.clearPracticeSession().catch(() => {});
        }

        logNativeAuthDebug("login_complete_navigate", nextRedirectPath);
        navigate(nextRedirectPath, { replace: true });
      } catch (error) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(PENDING_NATIVE_AUTH_TOKEN_KEY);
          window.localStorage.removeItem(PENDING_NATIVE_AUTH_STATE_KEY);
        }

        logNativeAuthDebug("login_complete_failed", error?.message || "unknown");
        setErrorMessage(t(error.message || "Unable to complete sign in"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [checkUserAuth, navigate, redirectPath, t],
  );

  const tryCompletePendingNativeSignIn = useCallback(() => {
    if (typeof window === "undefined" || !isNativeAppRuntime()) {
      return;
    }

    const nativeAuthPending =
      window.localStorage.getItem(PENDING_NATIVE_AUTH_STATE_KEY) === "1";
    const storedToken = getStoredAuthToken();

    if (!nativeAuthPending || !storedToken || isSubmitting || isAuthenticated) {
      return;
    }

    logNativeAuthDebug("login_retry_pending_native", redirectPath);
    completeTokenSignIn(storedToken, redirectPath).catch(() => {});
  }, [completeTokenSignIn, isAuthenticated, isSubmitting, redirectPath]);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  useEffect(() => {
<<<<<<< HEAD
    const searchParams = new URLSearchParams(location.search);
    const queryAuthToken = searchParams.get("authToken");
    const nativeAuthRequested = searchParams.get("nativeAuth") === "1";
    const pendingNativeAuthToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem(PENDING_NATIVE_AUTH_TOKEN_KEY)
        : null;
    const storedAuthToken =
      isNativeAppRuntime() && nativeAuthRequested ? getStoredAuthToken() : null;
    const authToken = queryAuthToken || pendingNativeAuthToken || storedAuthToken;
    const oauthError = searchParams.get("oauthError");

    if (oauthError && !authToken) {
      logNativeAuthDebug("login_oauth_error_param", oauthError);
      setErrorMessage(t(oauthError));
    } else if (authToken) {
      setErrorMessage("");
=======
    if (authError?.message) {
      setErrorMessage(t(authError.message));
>>>>>>> main
    }
  }, [authError, t]);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && user && typeof window !== "undefined") {
      window.location.replace(redirectPath);
    }
<<<<<<< HEAD

    logNativeAuthDebug(
      "login_token_detected",
      nativeAuthRequested ? "native" : "query_or_pending",
    );
    completeTokenSignIn(authToken, redirectPath).catch(() => {
      if (typeof window !== "undefined" && nativeAuthRequested) {
        AUTH_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
      }
    });
  }, [completeTokenSignIn, location.search, redirectPath]);

  useEffect(() => {
    if (typeof window === "undefined" || !isNativeAppRuntime()) {
      return undefined;
    }

    const handleNativeOAuthToken = (event) => {
      const nextToken = event?.detail?.token;
      const nextRedirectPath = normalizeRedirectPath(event?.detail?.redirectTo);

      logNativeAuthDebug("login_received_native_event", nextRedirectPath);
      completeTokenSignIn(nextToken, nextRedirectPath).catch(() => {});
    };

    window.addEventListener("rbt-genius-native-oauth-token", handleNativeOAuthToken);

    return () => {
      window.removeEventListener(
        "rbt-genius-native-oauth-token",
        handleNativeOAuthToken,
      );
    };
  }, [completeTokenSignIn]);

  useEffect(() => {
    if (typeof window === "undefined" || !isNativeAppRuntime()) {
      return undefined;
    }

    const handleVisibilityOrFocus = () => {
      logNativeAuthDebug("login_visibility_or_focus");
      tryCompletePendingNativeSignIn();
    };

    const appStateListener = CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        logNativeAuthDebug("login_app_active");
        tryCompletePendingNativeSignIn();
      }
    });

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      appStateListener.then((listener) => listener.remove()).catch(() => {});
    };
  }, [tryCompletePendingNativeSignIn]);
=======
  }, [isAuthenticated, isLoadingAuth, redirectPath, user]);
>>>>>>> main

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const authData = await api.login(loginForm);
<<<<<<< HEAD
      login(authData);
      if (isNativeAppRuntime()) {
        api.clearPracticeSession().catch(() => {});
      }
      navigate(redirectPath, { replace: true });
=======
      await login(authData);
      window.location.replace(redirectPath);
>>>>>>> main
    } catch (error) {
      setErrorMessage(t(error.message || "Unable to sign in"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const authData = await api.register(registerForm);
      await login(authData);
      window.location.replace(redirectPath);
    } catch (error) {
      setErrorMessage(t(error.message || "Unable to create account"));
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
  const handleProviderAuth = async (providerId) => {
    setErrorMessage("");
    const authUrl = api.getOAuthStartUrl(providerId, redirectPath);

    if (isNativeAppRuntime()) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PENDING_NATIVE_AUTH_STATE_KEY, "1");
      }
      clearNativeAuthDebug();
      setDebugEntries([]);
      logNativeAuthDebug("login_open_provider", providerId);
      await Browser.open({ url: authUrl });
      return;
    }

    window.location.assign(authUrl);
  };

  const handleNativePreviewMode = () => {
    if (!canUseNativePreviewMode) {
      return;
    }

    enableNativePreviewMode();
    window.location.assign(createPageUrl("Dashboard"));
  };

=======
>>>>>>> main
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E5EFF]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              RBT
            </span>
            <span className="text-xl font-bold text-[#1E5EFF]">Genius</span>
            <Sparkles className="-mt-1 h-4 w-4 text-[#FFB800]" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t("Use your email and password to continue.")}
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            {t("Quick sign in")}
          </p>
          <a
            href={googleAuthUrl}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z"
              />
              <path
                fill="#34A853"
                d="M2.8 7.2l3.2 2.3c.9-1.7 2.7-2.9 5-2.9 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4c-3.6 0-6.7 2-8.3 4.8Z"
              />
              <path
                fill="#FBBC05"
                d="M12 20.8c2.6 0 4.8-.9 6.4-2.5l-3-2.5c-.8.6-1.9 1-3.4 1-3.8 0-5.1-2.5-5.4-3.8l-3.2 2.5c1.6 3 4.7 5.3 8.6 5.3Z"
              />
              <path
                fill="#4285F4"
                d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.2 1.1-.9 2-1.8 2.7l3 2.5c1.8-1.7 2.5-4.1 2.5-7.5Z"
              />
            </svg>
            <span>{t("Continue with Google")}</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              {t("Or use email")}
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {canUseNativePreviewMode ? (
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleNativePreviewMode}
              className="h-14 w-full justify-start gap-4 rounded-2xl border border-dashed border-[#1E5EFF]/35 bg-[#1E5EFF]/5 px-5 text-base font-semibold text-[#1E5EFF] shadow-[0_14px_35px_-25px_rgba(30,94,255,0.35)] hover:bg-[#1E5EFF]/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-current">
                <Zap className="h-5 w-5" />
              </span>
              {t("Continue in Preview Mode")}
            </Button>
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("Login")}</TabsTrigger>
            <TabsTrigger value="register">{t("Register")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                {t("Manual login")}
              </p>
              <Input
                type="email"
                autoComplete="email"
                placeholder={t("Email")}
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              <Input
                type="password"
                autoComplete="current-password"
                placeholder={t("Password")}
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Sign In")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                {t("Manual registration")}
              </p>
              <Input
                autoComplete="name"
                placeholder={t("Full name")}
                value={registerForm.full_name}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    full_name: event.target.value,
                  }))
                }
              />
              <Input
                type="email"
                autoComplete="email"
                placeholder={t("Email")}
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              <Input
                type="password"
                autoComplete="new-password"
                placeholder={t("Password (min 8 chars)")}
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Create Account")
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}
<<<<<<< HEAD

        {isNativeAppRuntime() ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Native Auth Debug
              </p>
              <button
                type="button"
                onClick={() => {
                  clearNativeAuthDebug();
                  setDebugEntries([]);
                }}
                className="text-[11px] font-semibold text-[#1E5EFF]"
              >
                Clear
              </button>
            </div>

            <div className="max-h-44 space-y-2 overflow-y-auto text-[11px] leading-relaxed">
              {debugEntries.length > 0 ? (
                debugEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {entry.step}
                    </p>
                    {entry.detail ? (
                      <p className="mt-1 break-all text-slate-500 dark:text-slate-400">
                        {entry.detail}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No debug events yet.</p>
              )}
            </div>
          </div>
        ) : null}

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="text-[#1E5EFF] hover:underline">
            {t("Back to app")}
          </Link>
        </div>
=======
>>>>>>> main
      </Card>
    </div>
  );
}
