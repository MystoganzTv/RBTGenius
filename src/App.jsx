import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import UserNotRegisteredError from "@/components/UserNotRegisteredError.jsx";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import PageNotFound from "@/lib/PageNotFound";
import { queryClientInstance } from "@/lib/query-client";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import { pagesConfig } from "./pages.config";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : null;

function LayoutWrapper({ children, currentPageName }) {
  if (!Layout) {
    return <>{children}</>;
  }

  return <Layout currentPageName={currentPageName}>{children}</Layout>;
}

function resolvePageComponent(pageName) {
  return Pages[pageName] || null;
}

function QueryPageRenderer() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestedPage = searchParams.get("page");
  const pageKey = requestedPage && Pages[requestedPage] ? requestedPage : mainPageKey;
  const PageComponent = resolvePageComponent(pageKey) || MainPage;

  if (!PageComponent) {
    return <PageNotFound />;
  }

  return (
    <LayoutWrapper currentPageName={pageKey}>
      <PageComponent />
    </LayoutWrapper>
  );
}

function LegacyPageRenderer() {
  const { pageName } = useParams();
  const PageComponent = resolvePageComponent(pageName);

  if (!PageComponent) {
    return <PageNotFound />;
  }

  return (
    <LayoutWrapper currentPageName={pageName}>
      <PageComponent />
    </LayoutWrapper>
  );
}

function RootRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const requestedPage = new URLSearchParams(location.search).get("page");

  if (!isAuthenticated) {
    if (requestedPage) {
      return (
        <Navigate
          to={`/login?redirectTo=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`}
          replace
        />
      );
    }

    return <Landing />;
  }

  return <QueryPageRenderer />;
}

function ProtectedLegacyRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`}
        replace
      />
    );
  }

  return <LegacyPageRenderer />;
}

function AuthenticatedApp() {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
    isAuthenticated,
  } = useAuth();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const isLandingRoute = location.pathname === "/" && !new URLSearchParams(location.search).get("page");

  useEffect(() => {
    if (authError?.type === "auth_required" && !isLoginRoute && !isLandingRoute) {
      navigateToLogin();
    }
  }, [authError?.type, isLandingRoute, isLoginRoute, navigateToLogin]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-800 dark:border-t-slate-200" />
      </div>
    );
  }

  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  if (authError?.type === "auth_required" && !isLoginRoute && !isLandingRoute && !isAuthenticated) {
    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRoute />} />
      <Route path="/:pageName" element={<ProtectedLegacyRoute />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
