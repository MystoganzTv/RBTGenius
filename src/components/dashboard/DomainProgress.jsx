import { MIN_DOMAIN_ATTEMPTS } from "@/lib/backend-core";

const domains = [
  { key: "measurement", label: "Measurement", color: "#5E7CF7" },
  { key: "assessment", label: "Assessment", color: "#6D81E8" },
  { key: "skill_acquisition", label: "Skill Acquisition", color: "#4DAA94" },
  { key: "behavior_reduction", label: "Behavior Reduction", color: "#8C9AB3" },
  { key: "documentation", label: "Documentation", color: "#A07BB7" },
  {
    key: "professional_conduct",
    label: "Professional Conduct",
    color: "#8B78D8",
  },
];

export default function DomainProgress({ mastery = {}, attemptCounts = {} }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Domain Mastery
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Scores become reliable after at least {MIN_DOMAIN_ATTEMPTS} attempts per domain.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {domains.map((domain) => {
          const value = mastery[domain.key] || 0;
          const attempts = attemptCounts[domain.key] || 0;
          const hasEnoughData = attempts >= MIN_DOMAIN_ATTEMPTS;
          const displayValue = hasEnoughData
            ? `${value}%`
            : `${attempts}/${MIN_DOMAIN_ATTEMPTS}`;
          const progressWidth = hasEnoughData
            ? value
            : Math.min(100, Math.round((attempts / MIN_DOMAIN_ATTEMPTS) * 100));

          return (
            <div key={domain.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {domain.label}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {displayValue}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progressWidth}%`,
                    backgroundColor: hasEnoughData ? domain.color : "#475569",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
