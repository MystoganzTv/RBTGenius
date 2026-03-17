import { Flame } from "lucide-react";

export default function StreakCard({ streak = 0 }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Study Streak</h3>
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">
          <Flame className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
          <span className="text-xs font-bold text-orange-600 dark:text-orange-300">
            {streak} days
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        {days.map((day, index) => {
          const isCompleted =
            index <= adjustedToday && index >= adjustedToday - streak + 1;
          const isToday = index === adjustedToday;

          return (
            <div key={`${day}-${index}`} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  isCompleted
                    ? "border border-[#4F7BFF]/35 bg-[#1E5EFF]/12 text-[#6E8FFF] dark:border-[#4F7BFF]/30 dark:bg-[#1E5EFF]/12 dark:text-[#91A8FF]"
                    : isToday
                      ? "border border-amber-400/40 bg-amber-500/8 text-amber-500 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-300"
                      : "bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : day}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
