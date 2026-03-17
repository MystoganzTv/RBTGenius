import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Flame,
  HelpCircle,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import DomainProgress from "@/components/dashboard/DomainProgress";
import ReadinessGauge from "@/components/dashboard/ReadinessGauge";
import StatCard from "@/components/dashboard/StatCard";
import StreakCard from "@/components/dashboard/StreakCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

const fallbackProgress = {
  total_questions_completed: 148,
  total_correct: 118,
  study_streak_days: 6,
  readiness_score: 78,
  domain_mastery: {
    measurement: 84,
    assessment: 71,
    skill_acquisition: 79,
    behavior_reduction: 67,
    documentation: 74,
    professional_conduct: 88,
  },
};

const fallbackQuestions = Array.from({ length: 500 }, (_, index) => ({
  id: `question-${index + 1}`,
}));

const planStyles = {
  free: {
    label: "Free Plan",
    className:
      "border-[#FFB800]/40 bg-[#FFB800]/10 text-[#D18B00] dark:border-[#FFB800]/30 dark:bg-[#FFB800]/15 dark:text-[#FFD36A]",
  },
  premium_monthly: {
    label: "Premium Monthly",
    className:
      "border-[#1E5EFF]/25 bg-[#1E5EFF]/10 text-[#1E5EFF] dark:border-[#1E5EFF]/30 dark:bg-[#1E5EFF]/15 dark:text-[#8EB0FF]",
  },
  premium_yearly: {
    label: "Premium Yearly",
    className:
      "border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
};

async function loadDashboardData() {
  return api.getDashboard();
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: loadDashboardData,
  });

  const progress = data?.progress || fallbackProgress;
  const allQuestions = data?.allQuestions || fallbackQuestions;

  const totalQuestions = progress?.total_questions_completed || 0;
  const accuracy =
    totalQuestions > 0
      ? Math.round(((progress?.total_correct || 0) / totalQuestions) * 100)
      : 0;
  const streak = progress?.study_streak_days || 0;
  const readiness = progress?.readiness_score || 0;

  const firstName =
    user?.full_name?.split(" ")[0] || user?.name?.split(" ")[0] || null;
  const plan = user?.plan || progress?.plan || "free";
  const activePlan = planStyles[plan] || planStyles.free;

  const badges = [
    { emoji: "🔥", label: "Streak 3", unlocked: streak >= 3 },
    { emoji: "🎯", label: "100 Qs", unlocked: totalQuestions >= 100 },
    { emoji: "⭐", label: "80% Acc", unlocked: accuracy >= 80 },
    { emoji: "📚", label: "200 Qs", unlocked: totalQuestions >= 200 },
    { emoji: "🏆", label: "Ready", unlocked: readiness >= 80 },
    { emoji: "🧠", label: "Mastery", unlocked: readiness >= 90 },
  ];

  const completionRate =
    allQuestions.length > 0 ? (totalQuestions / allQuestions.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#1E5EFF]/10 bg-white px-8 py-9 shadow-[0_30px_80px_-40px_rgba(30,94,255,0.35)] dark:border-slate-800 dark:bg-slate-950 sm:px-10">
        <div className="pointer-events-none absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-[#1E5EFF]/16 blur-[1px] dark:bg-[#1E5EFF]/20" />
        <div className="pointer-events-none absolute -right-3 -top-8 h-40 w-40 rounded-full bg-[#FFB800]/18 blur-[1px] dark:bg-[#FFB800]/12" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1E5EFF]">
              RBT Genius
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] text-[#0F172A] dark:text-slate-50 sm:text-5xl">
              Welcome back,
              <br />
              {firstName || "Student"}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500 dark:text-slate-300">
              Exam readiness at {readiness}% based on your latest practice performance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-[#1E5EFF]/20 bg-[#1E5EFF]/10 px-5 py-3 text-base font-semibold text-[#1E5EFF] dark:border-[#1E5EFF]/30 dark:bg-[#1E5EFF]/15 dark:text-[#8EB0FF]">
                Study streak {streak} days
              </div>
              <div className={`rounded-full border px-5 py-3 text-base font-semibold ${activePlan.className}`}>
                {activePlan.label}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <Link to={createPageUrl("Practice")}>
              <Button className="h-12 gap-2 rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90">
                <Zap className="h-4 w-4" />
                Start Practicing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Questions Done"
          value={totalQuestions}
          subtitle="Total completed"
          icon={HelpCircle}
          color="blue"
          trend={12}
        />
        <StatCard
          title="Accuracy Rate"
          value={`${accuracy}%`}
          subtitle="Correct answers"
          icon={Target}
          color="green"
          trend={5}
        />
        <StatCard
          title="Study Streak"
          value={`${streak} days`}
          subtitle="Keep it going!"
          icon={Flame}
          color="gold"
        />
        <StatCard
          title="Questions Available"
          value={allQuestions.length}
          subtitle="Practice questions"
          icon={BookOpen}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StreakCard streak={streak} />
          <DomainProgress mastery={progress?.domain_mastery || {}} />

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link to={createPageUrl("Practice")}>
                <div className="group cursor-pointer rounded-xl border border-[#1E5EFF]/10 bg-[#1E5EFF]/5 p-4 transition-all hover:border-[#1E5EFF]/30">
                  <HelpCircle className="mb-2 h-5 w-5 text-[#1E5EFF]" />
                  <p className="text-sm font-semibold text-slate-900">
                    Practice Questions
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Test your knowledge
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-[#1E5EFF] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link to={createPageUrl("MockExams")}>
                <div className="group cursor-pointer rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition-all hover:border-emerald-200">
                  <Trophy className="mb-2 h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    Mock Exam
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Simulate the real test
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link to={createPageUrl("AITutor")}>
                <div className="group cursor-pointer rounded-xl border border-violet-100 bg-violet-50 p-4 transition-all hover:border-violet-200">
                  <Brain className="mb-2 h-5 w-5 text-violet-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    AI Tutor
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Get instant help
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-violet-600 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ReadinessGauge score={readiness} />

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              Badges Earned
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center rounded-xl p-3 transition-all ${
                    badge.unlocked
                      ? "border border-[#FFB800]/30 bg-[#FFB800]/10"
                      : "bg-slate-50 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="mt-1 text-[10px] font-medium text-slate-600">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              Your Progress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Questions Completed
                </span>
                <span className="text-sm font-semibold text-[#1E5EFF]">
                  {totalQuestions}/{allQuestions.length}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#1E5EFF] to-[#6366F1] transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Pass Rate Needed</span>
                <span className="text-sm font-semibold text-emerald-600">
                  80%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Your Current</span>
                <span
                  className={`text-sm font-semibold ${
                    accuracy >= 80 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {accuracy}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
