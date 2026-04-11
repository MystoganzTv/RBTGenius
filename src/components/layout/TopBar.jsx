import { Crown, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { isPremiumPlan } from "@/lib/plan-access";
import { translateUi } from "@/lib/i18n";
import { createPageUrl } from "@/utils";

const planLabels = {
  free: "Free Plan",
  premium_monthly: "Premium Monthly",
  premium_yearly: "Premium Yearly",
};

export default function TopBar({
  onMenuClick,
  currentPageName,
  user = null,
  plan = "free",
  onLogout,
}) {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const fullName = user?.full_name || user?.name || "Student";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const currentPageLabel = translateUi(currentPageName || "Dashboard", language);
  const currentPlanLabel = translateUi(planLabels[plan] ?? planLabels.free, language);

  return (
    <header className="app-topbar sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/88 px-4 py-2 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/88 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl border border-slate-200/80 bg-white/85 shadow-sm lg:hidden dark:border-slate-800 dark:bg-slate-950/80 dark:hover:bg-slate-900"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Button>
        ) : null}

        <div className="min-w-0 lg:hidden">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-semibold text-slate-900 dark:text-slate-50">
              {currentPageLabel}
            </p>
            <span className="rounded-full bg-[#1E5EFF]/8 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1E5EFF]">
              {isPremiumPlan(plan) ? "Pro" : "Free"}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            {currentPlanLabel}
          </p>
        </div>

        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {currentPageLabel}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {currentPlanLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="sm:hidden">
          <LanguageSwitcher compact />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl border border-slate-200/80 bg-white/80 text-slate-400 shadow-sm hover:text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/85 py-1.5 pl-2 pr-2.5 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80 dark:hover:bg-slate-900">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-[#1E5EFF] to-[#6366F1]">
                <AvatarFallback className="bg-transparent text-xs font-semibold text-white">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{fullName}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {currentPlanLabel}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <Link to={createPageUrl("Profile")}>
              <DropdownMenuItem className="rounded-lg">
                <User className="mr-2 h-4 w-4" /> {translateUi("Profile", language)}
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl("Pricing")}>
              <DropdownMenuItem className="rounded-lg text-[#FFB800]">
                <Crown className="mr-2 h-4 w-4" />{" "}
                {translateUi(
                  isPremiumPlan(plan) ? "Manage Plan" : "Upgrade to Premium",
                  language,
                )}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-lg text-red-500"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> {translateUi("Sign Out", language)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden sm:block">
          <LanguageSwitcher compact />
        </div>
      </div>
    </header>
  );
}
