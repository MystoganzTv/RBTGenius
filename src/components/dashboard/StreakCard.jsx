import { Flame } from "lucide-react";

export default function StreakCard({ streak = 0 }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Study Streak</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          <span className="text-xs font-bold text-orange-600">
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
                    ? "bg-gradient-to-br from-[#1E5EFF] to-[#6366F1] text-white shadow-md shadow-[#1E5EFF]/20"
                    : isToday
                      ? "border-2 border-dashed border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800]"
                      : "bg-slate-50 text-slate-400"
                }`}
              >
                {isCompleted ? "✓" : day}
              </div>
              <span className="text-[10px] text-slate-400">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
