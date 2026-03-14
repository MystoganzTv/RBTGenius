const domains = [
  { key: "measurement", label: "Measurement", color: "#1E5EFF" },
  { key: "assessment", label: "Assessment", color: "#6366F1" },
  { key: "skill_acquisition", label: "Skill Acquisition", color: "#10B981" },
  { key: "behavior_reduction", label: "Behavior Reduction", color: "#FFB800" },
  { key: "documentation", label: "Documentation", color: "#F43F5E" },
  {
    key: "professional_conduct",
    label: "Professional Conduct",
    color: "#8B5CF6",
  },
];

export default function DomainProgress({ mastery = {} }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Domain Mastery
      </h3>

      <div className="space-y-3">
        {domains.map((domain) => {
          const value = mastery[domain.key] || 0;

          return (
            <div key={domain.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  {domain.label}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {value}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${value}%`,
                    backgroundColor: domain.color,
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
