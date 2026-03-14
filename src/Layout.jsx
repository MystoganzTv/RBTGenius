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
  const plan = getStoredPlan();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPageName} />

      <div className="min-h-screen lg:pl-[260px]">
        <TopBar user={user} plan={plan} onLogout={() => logout(false)} />

        <main className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
