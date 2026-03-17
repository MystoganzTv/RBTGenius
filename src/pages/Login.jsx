import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Github,
  Globe,
  GraduationCap,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const OAUTH_OPTIONS = [
  {
    id: "google",
    label: "Continue with Google",
    Icon: Globe,
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

function normalizeRedirectPath(value) {
  if (!value) {
    return "/";
  }

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

function getRedirectPath(search) {
  const searchParams = new URLSearchParams(search);
  return normalizeRedirectPath(searchParams.get("redirectTo"));
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = useMemo(() => getRedirectPath(location.search), [location.search]);
  const { user, isAuthenticated, login } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authProviders, setAuthProviders] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .getAuthProviders()
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
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath, user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authToken = searchParams.get("authToken");
    const oauthError = searchParams.get("oauthError");

    if (oauthError) {
      setErrorMessage(oauthError);
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
          setErrorMessage(error.message || "Unable to complete sign in");
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
      setErrorMessage(error.message || "Unable to sign in");
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
      setErrorMessage(error.message || "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableProviderIds = new Set(authProviders.map((provider) => provider.id));

  const handleProviderAuth = (providerId) => {
    setErrorMessage("");
    window.location.assign(api.getOAuthStartUrl(providerId, redirectPath));
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
            Sign in to sync your progress, mock exams, and AI tutor history.
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {OAUTH_OPTIONS.map(({ id, label, Icon }) => {
            const isAvailable = availableProviderIds.has(id);

            return (
              <Button
                key={id}
                type="button"
                variant="outline"
                disabled={!isAvailable || isSubmitting}
                onClick={() => handleProviderAuth(id)}
                className="w-full justify-start gap-3 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="h-4 w-4" />
                {label}
                {!isAvailable && !isLoadingProviders ? (
                  <span className="ml-auto text-[11px] uppercase tracking-wide text-slate-400">
                    Soon
                  </span>
                ) : null}
              </Button>
            );
          })}
        </div>

        <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span>or continue manually</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
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
                placeholder="Password"
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
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                placeholder="Full name"
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
                placeholder="Email"
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
                placeholder="Password (min 8 chars)"
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
                  "Create Account"
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

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Demo account: <strong>demo@rbtgenius.app</strong> / <strong>demo123456</strong>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="text-[#1E5EFF] hover:underline">
            Back to app
          </Link>
        </div>
      </Card>
    </div>
  );
}
