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
    blue: "bg-[#1E5EFF]/8 text-[#1E5EFF]",
    gold: "bg-[#FFB800]/10 text-[#FFB800]",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-500",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>

          {subtitle ? (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
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
