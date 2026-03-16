import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/lib/AuthContext";

const PROGRESS_STORAGE_KEY = "rbt_genius_user_progress";

function getStoredPlan() {
  if (typeof window === "undefined") {
    return "free";
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return "free";
    }

    const parsed = JSON.parse(raw);
    return parsed?.plan || "free";
  } catch {
    return "free";
  }
}

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const plan = getStoredPlan();
  const isAdmin = user?.role === "admin";

  if (currentPageName === "Pricing") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-foreground transition-colors dark:bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground transition-colors dark:bg-background">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden dark:bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="hidden lg:block">
        <Sidebar currentPage={currentPageName} isAdmin={isAdmin} />
      </div>

      <div className={sidebarOpen ? "lg:hidden block" : "hidden lg:hidden"}>
        <Sidebar currentPage={currentPageName} isAdmin={isAdmin} />
      </div>

      <div className="transition-all duration-300 lg:ml-[260px]">
        <TopBar
          onMenuClick={() => setSidebarOpen((current) => !current)}
          user={user}
          plan={plan}
          onLogout={() => logout(false)}
        />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
