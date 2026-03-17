import { Link } from "react-router-dom";
import { GraduationCap, Moon, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function PublicPageShell({ title, description, children }) {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground dark:bg-background">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E5EFF]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">RBT</span>
              <span className="text-lg font-bold text-[#1E5EFF]">Genius</span>
              <Sparkles className="h-3.5 w-3.5 text-[#FFB800]" />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
            {isAuthenticated ? (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="rounded-xl">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-slate-950">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {children}
          </div>
        </div>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
