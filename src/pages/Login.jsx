import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { translateUi } from "@/lib/i18n";
import { createPageUrl } from "@/utils";

function normalizeRedirectPath(value) {
  if (!value) {
    return createPageUrl("Dashboard");
  }

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return createPageUrl("Dashboard");
  }
}

function getRedirectPath(search) {
  const searchParams = new URLSearchParams(search);
  return normalizeRedirectPath(searchParams.get("redirectTo"));
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const redirectPath = useMemo(() => getRedirectPath(location.search), [location.search]);
  const initialMode = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("mode") === "register" ? "register" : "login";
  }, [location.search]);
  const { user, isAuthenticated, login } = useAuth();
  const t = (value) => translateUi(value, language);

  const [activeTab, setActiveTab] = useState(initialMode);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath, user]);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authToken = searchParams.get("authToken");
    const oauthError = searchParams.get("oauthError");

    if (oauthError) {
      setErrorMessage(t(oauthError));
    }

    if (!authToken) {
      return;
    }

    let isMounted = true;
    setIsSubmitting(true);
    setErrorMessage("");

    api
      .getMe(authToken)
      .then((nextUser) => {
        if (!isMounted) {
          return;
        }

        login({ token: authToken, user: nextUser });
        navigate(redirectPath, { replace: true });
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(t(error.message || "Unable to complete sign in"));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsSubmitting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.search, login, navigate, redirectPath]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const authData = await api.login(loginForm);
      login(authData);
      navigate(redirectPath, { replace: true });
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
      login(authData);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(t(error.message || "Unable to create account"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {t("Choose the easiest way to continue and keep your study progress synced.")}
          </p>
        </div>

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
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="text-[#1E5EFF] hover:underline">
            {t("Back to app")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
