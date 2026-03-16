import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}) {
  const colorStyles = {
    blue: "bg-[#1E5EFF]/10 text-[#1E5EFF] dark:bg-[#1E5EFF]/15 dark:text-[#8EB0FF]",
    gold: "bg-[#FFB800]/12 text-[#D18B00] dark:bg-[#FFB800]/12 dark:text-[#FFD36A]",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300",
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-35px_rgba(30,94,255,0.35)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-50">{value}</p>

          {subtitle ? (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          ) : null}

          {typeof trend === "number" ? (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                trend > 0 ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            colorStyles[color] ?? colorStyles.blue,
          )}
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>
    </div>
  );
}
