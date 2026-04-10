import { Link } from "react-router-dom";
import {
  BarChart3,
  ClipboardCheck,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { translateUi } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { createPageUrl } from "@/utils";

const mobileNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Practice", icon: HelpCircle, page: "Practice" },
  { name: "Flashcards", icon: Sparkles, page: "Flashcards" },
  { name: "Mock Exams", icon: ClipboardCheck, page: "MockExams" },
  { name: "Analytics", icon: BarChart3, page: "Analytics" },
];

export default function MobileBottomNav({ currentPage }) {
  const { language } = useLanguage();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.85rem] border border-slate-200/80 bg-white/95 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_26px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const isActive = currentPage === item.page;

          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={cn(
                "relative flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2 text-center transition-all",
                isActive
                  ? "bg-[#1E5EFF] text-white shadow-[0_18px_32px_-20px_rgba(30,94,255,0.8)]"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200",
              )}
            >
              <span
                className={cn(
                  "absolute top-1.5 h-1.5 w-8 rounded-full transition-all",
                  isActive ? "bg-white/85" : "bg-transparent",
                )}
              />
              <item.icon className="h-[18px] w-[18px]" />
              <span className="text-[10px] font-semibold leading-none tracking-[0.01em]">
                {translateUi(item.name, language)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
