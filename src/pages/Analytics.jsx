import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, BookOpen, Brain, Clock, Target } from "lucide-react";
import PremiumGate from "@/components/billing/PremiumGate";
import StatCard from "@/components/dashboard/StatCard";
import { api } from "@/lib/api";
import { isPremiumPlan } from "@/lib/plan-access";

const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

const topicKeys = Object.keys(topicLabels);
const COLORS = ["#1E5EFF", "#6366F1", "#10B981", "#FFB800", "#F43F5E", "#8B5CF6"];

export default function Analytics() {
  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: api.getProfile,
  });

  const entitlements = profileData?.entitlements;

  const analyticsQuery = useQuery({
    queryKey: ["analytics-data"],
    queryFn: api.getAnalytics,
    enabled: isPremiumPlan(entitlements?.plan),
  });

  const progress = analyticsQuery.data?.progress;
  const attempts = analyticsQuery.data?.attempts || [];
  const exams = analyticsQuery.data?.exams || [];

  const totalQuestions = progress?.total_questions_completed || 0;
  const totalCorrect = progress?.total_correct || 0;
  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const studyHours = progress?.study_hours || 0;
  const readiness = progress?.readiness_score || 0;

  const topicData = useMemo(
    () =>
      topicKeys
        .map((key) => {
          const topicAttempts = attempts.filter((attempt) => attempt.topic === key);
          return {
            name: topicLabels[key],
            value: topicAttempts.length,
            correct: topicAttempts.filter((attempt) => attempt.is_correct).length,
          };
        })
        .filter((item) => item.value > 0),
    [attempts],
  );

  const masteryData = useMemo(
    () =>
      topicKeys.map((key) => ({
        name: topicLabels[key],
        mastery: progress?.domain_mastery?.[key] || 0,
      })),
    [progress],
  );

  const examScoreData = useMemo(
    () =>
      exams.map((exam, index) => ({
        exam: `Exam ${index + 1}`,
        score: exam.score || 0,
      })),
    [exams],
  );

  if (!entitlements) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-12 dark:border-slate-800 dark:bg-slate-950">
          <div className="h-8 w-48 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="mt-3 h-4 w-72 rounded bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  if (!isPremiumPlan(entitlements.plan)) {
    return (
      <PremiumGate
        feature="analytics"
        bullets={[
          "Readiness tracking that stays more stable over time",
          "Topic distribution from your real attempt history",
          "Mock exam trends and deeper performance breakdowns",
        ]}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review patterns across your attempts, domains, and mock exams.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Study Hours"
          value={studyHours.toFixed(1)}
          subtitle="Total tracked"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle="Across answered questions"
          icon={Target}
          color="green"
        />
        <StatCard
          title="Readiness"
          value={`${readiness}%`}
          subtitle="Coverage-adjusted"
          icon={Brain}
          color="purple"
        />
        <StatCard
          title="Questions"
          value={totalQuestions}
          subtitle="Tracked attempts"
          icon={BookOpen}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Domain Performance
            </h3>
            {analyticsQuery.isLoading ? (
              <span className="text-xs text-slate-400">Loading...</span>
            ) : null}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={masteryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.15} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #1E293B",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="mastery" fill="#1E5EFF" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Questions by Topic
          </h3>
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #1E293B",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center">
              <p className="text-sm text-slate-400">
                Keep answering questions to unlock this view.
              </p>
            </div>
          )}

          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {topicData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Mock Exam Score Trend
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="h-3.5 w-3.5" />
              {exams.length} exams tracked
            </div>
          </div>
          {examScoreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={examScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.15} />
                <XAxis dataKey="exam" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #1E293B",
                    fontSize: "12px",
                  }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E5EFF" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1E5EFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#1E5EFF"
                  fill="url(#scoreGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center">
              <p className="text-sm text-slate-400">
                Complete your first mock exam to start building this chart.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
