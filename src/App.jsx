import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import UserNotRegisteredError from "@/components/UserNotRegisteredError.jsx";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import PageNotFound from "@/lib/PageNotFound";
import { queryClientInstance } from "@/lib/query-client";
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

function AuthenticatedApp() {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth();

  useEffect(() => {
    if (authError?.type === "auth_required") {
      navigateToLogin();
    }
  }, [authError?.type, navigateToLogin]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  if (authError?.type === "auth_required") {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<QueryPageRenderer />} />
      <Route path="/:pageName" element={<LegacyPageRenderer />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
