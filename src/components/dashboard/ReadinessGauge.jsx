export default function ReadinessGauge({ score = 0 }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) {
      return "#10B981";
    }

    if (score >= 60) {
      return "#FFB800";
    }

    return "#EF4444";
  };

  const getLabel = () => {
    if (score >= 80) {
      return "Exam Ready";
    }

    if (score >= 60) {
      return "Almost There";
    }

    return "Keep Studying";
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Exam Readiness
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{score}%</span>
          </div>
        </div>

        <span className="mt-3 text-sm font-medium" style={{ color: getColor() }}>
          {getLabel()}
        </span>
        <p className="mt-1 text-center text-xs text-slate-400">
          Based on your practice performance
        </p>
      </div>
    </div>
  );
}
