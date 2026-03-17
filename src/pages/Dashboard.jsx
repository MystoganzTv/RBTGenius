import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Brain,
  BookOpenCheck,
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

const emptyProgress = {
  total_questions_completed: 0,
  total_correct: 0,
  accuracy_rate: 0,
  raw_accuracy: 0,
  recent_accuracy: 0,
  study_streak_days: 0,
  study_hours: 0,
  readiness_score: 0,
  readiness_confidence: "low",
  domain_mastery: {
    measurement: 0,
    assessment: 0,
    skill_acquisition: 0,
    behavior_reduction: 0,
    documentation: 0,
    professional_conduct: 0,
  },
  domain_attempt_counts: {
    measurement: 0,
    assessment: 0,
    skill_acquisition: 0,
    behavior_reduction: 0,
    documentation: 0,
    professional_conduct: 0,
  },
  questions_today: 0,
  total_mock_exams: 0,
};

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

  const progress = data?.progress || emptyProgress;
  const allQuestions = data?.allQuestions || [];
  const exams = data?.exams || [];

  const totalQuestions = progress?.total_questions_completed || 0;
  const totalQuestionsAvailable =
    progress?.total_questions_available || allQuestions.length || 3000;
  const bankCoverage = progress?.bank_coverage_percent || 0;
  const accuracy = progress?.raw_accuracy || 0;
  const recentAccuracy = progress?.recent_accuracy || 0;
  const streak = progress?.study_streak_days || 0;
  const readiness = progress?.readiness_score || 0;
  const questionsToday = progress?.questions_today || 0;
  const studyHours = progress?.study_hours || 0;
  const mockExamsTaken = progress?.total_mock_exams || exams.length || 0;

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
              {totalQuestions < 20 && exams.length === 0
                ? `You have covered ${bankCoverage}% of the full bank so far. Readiness will become more meaningful as coverage grows.`
                : `Exam readiness at ${readiness}% based on your overall progress, accuracy, and bank coverage.`}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-[#1E5EFF]/20 bg-[#1E5EFF]/10 px-5 py-3 text-base font-semibold text-[#1E5EFF] dark:border-[#1E5EFF]/30 dark:bg-[#1E5EFF]/15 dark:text-[#8EB0FF]">
                {streak > 0
                  ? `Study streak ${streak} days`
                  : questionsToday > 0
                    ? "First day in progress"
                    : "Start your streak"}
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {totalQuestions}/{totalQuestionsAvailable} answered
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
          title="Questions Answered"
          value={`${totalQuestions}/${totalQuestionsAvailable}`}
          subtitle="Across the full question bank"
          icon={HelpCircle}
          color="blue"
        />
        <StatCard
          title="Answered Accuracy"
          value={`${accuracy}%`}
          subtitle={
            totalQuestions > 0
              ? totalQuestions < 25
                ? `${progress?.total_correct || 0} correct out of ${totalQuestions} answered · early sample`
                : `${progress?.total_correct || 0} correct out of ${totalQuestions} answered`
              : "No answered questions yet"
          }
          icon={Target}
          color="green"
        />
        <StatCard
          title="Bank Coverage"
          value={`${bankCoverage}%`}
          subtitle={`${recentAccuracy}% recent form`}
          icon={BookOpenCheck}
          color="purple"
        />
        <StatCard
          title="Study Streak"
          value={streak > 0 ? `${streak} days` : questionsToday > 0 ? "Started" : "0 days"}
          subtitle={
            streak > 0
              ? "Consecutive return days"
              : questionsToday > 0
                ? "Come back tomorrow to start your streak"
                : "No streak yet"
          }
          icon={Flame}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StreakCard streak={streak} questionsToday={questionsToday} />
          <DomainProgress
            mastery={progress?.domain_mastery || {}}
            attemptCounts={progress?.domain_attempt_counts || {}}
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link to={createPageUrl("Practice")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-[#1E5EFF]/20 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#1E5EFF]/20 dark:hover:bg-slate-900">
                  <HelpCircle className="mb-2 h-5 w-5 text-[#1E5EFF] dark:text-[#8EB0FF]" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Practice Questions
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Test your knowledge
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-[#1E5EFF] transition-transform group-hover:translate-x-1 dark:text-[#8EB0FF]" />
                </div>
              </Link>

              <Link to={createPageUrl("MockExams")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/20 dark:hover:bg-slate-900">
                  <Trophy className="mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Mock Exam
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Simulate the real test
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1 dark:text-emerald-300" />
                </div>
              </Link>

              <Link to={createPageUrl("AITutor")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-violet-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/20 dark:hover:bg-slate-900">
                  <Brain className="mb-2 h-5 w-5 text-violet-600 dark:text-violet-300" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    AI Tutor
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Get instant help
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-violet-600 transition-transform group-hover:translate-x-1 dark:text-violet-300" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ReadinessGauge
            score={readiness}
            questionCount={totalQuestions}
            examCount={exams.length}
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Badges Earned
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center rounded-xl p-3 transition-all ${
                    badge.unlocked
                      ? "border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900"
                      : "bg-slate-50 opacity-40 grayscale dark:bg-slate-900"
                  }`}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="mt-1 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Your Progress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Questions Completed
                </span>
                <span className="text-sm font-semibold text-[#1E5EFF]">
                  {totalQuestions}/{totalQuestionsAvailable}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#1E5EFF] to-[#6366F1] transition-all"
                  style={{ width: `${bankCoverage}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Mock Exams Taken</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {mockExamsTaken}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Study Hours</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {studyHours}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
