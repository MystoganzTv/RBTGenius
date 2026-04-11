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
import { useLanguage } from "@/hooks/use-language";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { translateUi } from "@/lib/i18n";
import { createPageUrl } from "@/utils";

const emptyProgress = {
  total_questions_completed: 0,
  total_correct: 0,
  bank_accuracy: 0,
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
  passed_mock_exams: 0,
  failed_mock_exams: 0,
  average_mock_exam_score: 0,
  badges: [],
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

const badgeAccentStyles = {
  "First 50":
    "border-blue-200 bg-blue-50 text-blue-700 shadow-[0_14px_30px_-24px_rgba(30,94,255,0.55)] dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200",
  "250 Answered":
    "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-[0_14px_30px_-24px_rgba(99,102,241,0.55)] dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-200",
  "10% Covered":
    "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_14px_30px_-24px_rgba(6,182,212,0.5)] dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-200",
  "3-Day Streak":
    "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_14px_30px_-24px_rgba(249,115,22,0.45)] dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-200",
  "First Mock":
    "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_14px_30px_-24px_rgba(139,92,246,0.5)] dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200",
  "Mock Pass":
    "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_14px_30px_-24px_rgba(16,185,129,0.5)] dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200",
  "Ready Signal":
    "border-amber-200 bg-amber-50 text-amber-700 shadow-[0_14px_30px_-24px_rgba(245,158,11,0.45)] dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200",
};

async function loadDashboardData() {
  return api.getDashboard();
}

export default function Dashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { data } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: loadDashboardData,
  });

  const progress = data?.progress || emptyProgress;
  const exams = data?.exams || [];

  const totalQuestions = progress?.total_questions_completed || 0;
  const totalQuestionsAvailable = progress?.total_questions_available || data?.allQuestionsCount || 0;
  const bankCoverage = progress?.bank_coverage_percent || 0;
  const bankAccuracy = progress?.bank_accuracy || 0;
  const streak = progress?.study_streak_days || 0;
  const readiness = progress?.readiness_score || 0;
  const questionsToday = progress?.questions_today || 0;
  const studyHours = progress?.study_hours || 0;
  const mockExamsTaken = progress?.total_mock_exams || exams.length || 0;
  const passedMockExams = progress?.passed_mock_exams || 0;
  const failedMockExams = progress?.failed_mock_exams || 0;
  const averageMockExamScore = progress?.average_mock_exam_score || 0;

  const firstName =
    user?.full_name?.split(" ")[0] || user?.name?.split(" ")[0] || null;
  const plan = user?.plan || progress?.plan || "free";
  const activePlan = planStyles[plan] || planStyles.free;

  const badges = progress?.badges || [];
  const t = (value) => translateUi(value, language);
  const dateLabel = new Intl.DateTimeFormat(language === "es" ? "es-US" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const mobileStats = [
    {
      label: t("Answered"),
      value: totalQuestions,
      icon: "✅",
    },
    {
      label: t("Accuracy"),
      value: `${bankAccuracy}%`,
      icon: "🏆",
    },
    {
      label: t("Streak"),
      value: `${streak || 0}d`,
      icon: "🔥",
    },
    {
      label: t("Cards"),
      value: totalQuestionsAvailable,
      icon: "🗂️",
    },
  ];
  const mobileStudyModes = [
    {
      title: t("Practice Quiz"),
      subtitle: t("25 questions"),
      icon: "📝",
      to: createPageUrl("Practice"),
      className: "bg-gradient-to-br from-[#34518B] to-[#29406D] text-white",
    },
    {
      title: t("Flashcards"),
      subtitle: t(`${Math.min(20, totalQuestionsAvailable || 20)} cards`),
      icon: "🗂️",
      to: createPageUrl("Flashcards"),
      className: "bg-gradient-to-br from-[#67BDD1] to-[#4498B9] text-white",
    },
    {
      title: t("Mock Exam"),
      subtitle: t("75 questions"),
      icon: "🎓",
      to: createPageUrl("MockExams"),
      className: "bg-gradient-to-br from-[#73339A] to-[#5A247B] text-white",
    },
    {
      title: t("Progress"),
      subtitle: t("View stats"),
      icon: "📊",
      to: createPageUrl("Analytics"),
      className: "bg-gradient-to-br from-[#E89D31] to-[#CC7A1B] text-white",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[1.85rem] border border-[#1E5EFF]/10 bg-[#34518B] px-4 pb-4 pt-3.5 text-white shadow-[0_26px_70px_-42px_rgba(30,94,255,0.42)] md:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
          {t("RBT Genius")}
        </p>
        <h1 className="mt-3 text-[1.75rem] font-black leading-[0.98]">
          {t("Welcome back!")}
          <span className="ml-2 inline-block">👋</span>
        </h1>
        <p className="mt-1.5 text-[13px] text-white/72">{dateLabel}</p>

        <div className="mt-4 flex items-end justify-between gap-3 text-sm">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/72">
              {t("Overall Progress")}
            </p>
            <p className="mt-1 text-[1.8rem] font-black leading-none">{bankCoverage}%</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/72">
              {t("Accuracy")}
            </p>
            <p className="mt-1 text-[1.8rem] font-black leading-none">{bankAccuracy}%</p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/18">
          <div
            className="h-full rounded-full bg-[#FFD45D]"
            style={{ width: `${Math.max(bankCoverage, 6)}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {mobileStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.35rem] border border-slate-200/70 bg-white px-2 py-2.5 text-center text-slate-900 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.44)]"
            >
              <p className="text-lg">{item.icon}</p>
              <p className="mt-1.5 text-[1.7rem] font-black leading-none tracking-[-0.03em]">
                {item.value}
              </p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="md:hidden">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[1.6rem] font-black leading-none text-slate-900 dark:text-slate-50">
                {t("Study Modes")}
              </h2>
              <p className="mt-2 max-w-[26ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t("Choose the format that matches how you want to study today.")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {mobileStudyModes.map((item) => (
              <Link key={item.title} to={item.to}>
                <div className={`min-h-[146px] rounded-[1.65rem] px-4 pb-4 pt-3.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] ${item.className}`}>
                  <p className="text-[1.7rem]">{item.icon}</p>
                  <p className="mt-9 text-[1.55rem] font-black leading-[0.95] tracking-[-0.03em]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold text-white/78">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100/80 px-4 py-4 shadow-[0_18px_40px_-35px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                {t("Readiness")}
              </span>
              <span className="text-xl font-black text-[#1E5EFF] dark:text-[#8EB0FF]">
                {readiness}%
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-slate-500 dark:text-slate-400">
              {t(
                mockExamsTaken > 0
                  ? "Your readiness is influenced most by mock exams, bank coverage, and overall accuracy."
                  : "Take a mock exam once you feel steady in practice to unlock a stronger readiness signal.",
            )}
            </p>
          </div>
        </div>
      </section>

      <div className="hidden md:block">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#1E5EFF]/10 bg-white px-8 py-9 shadow-[0_30px_80px_-40px_rgba(30,94,255,0.35)] dark:border-slate-800 dark:bg-slate-950 sm:px-10">
        <div className="pointer-events-none absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-[#1E5EFF]/16 blur-[1px] dark:bg-[#1E5EFF]/20" />
        <div className="pointer-events-none absolute -right-3 -top-8 h-40 w-40 rounded-full bg-[#FFB800]/18 blur-[1px] dark:bg-[#FFB800]/12" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1E5EFF]">
              RBT Genius
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] text-[#0F172A] dark:text-slate-50 sm:text-5xl">
              {t("Welcome back,")}
              <br />
              {firstName || t("Student")}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500 dark:text-slate-300">
              {t(
                totalQuestions < 20 && exams.length === 0
                ? `You have covered ${bankCoverage}% of the full bank so far. Readiness will become more meaningful as coverage grows.`
                : `Exam readiness at ${readiness}% based on your overall progress, mock exam history, and bank coverage.`,
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-[#1E5EFF]/20 bg-[#1E5EFF]/10 px-5 py-3 text-base font-semibold text-[#1E5EFF] dark:border-[#1E5EFF]/30 dark:bg-[#1E5EFF]/15 dark:text-[#8EB0FF]">
                {streak > 0
                  ? t(`Study streak ${streak} days`)
                  : questionsToday > 0
                    ? t("First day in progress")
                    : t("Start your streak")}
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {t(`${totalQuestions}/${totalQuestionsAvailable} answered`)}
              </div>
              <div className={`rounded-full border px-5 py-3 text-base font-semibold ${activePlan.className}`}>
                {t(activePlan.label)}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <Link to={createPageUrl("Practice")}>
              <Button className="h-12 gap-2 rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90">
                <Zap className="h-4 w-4" />
                {t("Start Practicing")}
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
          title="Bank Accuracy"
          value={`${bankAccuracy}%`}
          subtitle={
            totalQuestions > 0
              ? `${progress?.total_correct || 0} correct out of ${totalQuestionsAvailable} total bank questions`
              : "No bank progress yet"
          }
          icon={Target}
          color="green"
        />
        <StatCard
          title="Bank Coverage"
          value={`${bankCoverage}%`}
          subtitle={`${totalQuestions} answered so far`}
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
              {t("Quick Actions")}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link to={createPageUrl("Practice")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-[#1E5EFF]/20 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#1E5EFF]/20 dark:hover:bg-slate-900">
                  <HelpCircle className="mb-2 h-5 w-5 text-[#1E5EFF] dark:text-[#8EB0FF]" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t("Practice Questions")}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {t("Test your knowledge")}
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-[#1E5EFF] transition-transform group-hover:translate-x-1 dark:text-[#8EB0FF]" />
                </div>
              </Link>

              <Link to={createPageUrl("MockExams")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-emerald-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/20 dark:hover:bg-slate-900">
                  <Trophy className="mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t("Mock Exam")}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {t("Simulate the real test")}
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1 dark:text-emerald-300" />
                </div>
              </Link>

              <Link to={createPageUrl("AITutor")}>
                <div className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-violet-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/20 dark:hover:bg-slate-900">
                  <Brain className="mb-2 h-5 w-5 text-violet-600 dark:text-violet-300" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t("AI Tutor")}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {t("Get instant help")}
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
            averageExamScore={averageMockExamScore}
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("Mock Exam Signal")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t("Mock Exams Taken")}
                </p>
                <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-50">
                  {mockExamsTaken}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    mockExamsTaken > 0
                      ? "Use mock exam results as your strongest exam-readiness signal."
                      : "Take your first mock exam to unlock a stronger readiness signal.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t("Average Mock Score")}
                </p>
                <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-50">
                  {mockExamsTaken > 0 ? `${averageMockExamScore}%` : "--"}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    mockExamsTaken > 0
                      ? averageMockExamScore >= 80
                        ? "You are performing in a ready-to-test range."
                        : "Keep practicing before scheduling the real exam."
                      : "Your readiness recommendation will improve once you have at least one mock exam.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t("Mock Exams Passed")}
                </p>
                <p className="mt-3 text-4xl font-black text-emerald-600 dark:text-emerald-300">
                  {passedMockExams}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t("Scores at or above 80% count as a passed mock exam.")}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t("Current Recommendation")}
                </p>
                <p
                  className={`mt-3 text-2xl font-black ${
                    mockExamsTaken === 0
                      ? "text-amber-500 dark:text-amber-300"
                      : averageMockExamScore >= 80
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-rose-500 dark:text-rose-300"
                  }`}
                >
                  {t(
                    mockExamsTaken === 0
                      ? "Take a mock exam"
                      : averageMockExamScore >= 80
                        ? "Ready for the exam"
                        : "Need more mock practice",
                  )}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    mockExamsTaken === 0
                      ? "Mock exams matter more than small practice samples for final readiness."
                      : `${failedMockExams} mock exam${failedMockExams === 1 ? "" : "s"} below the target score so far.`,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("Badges Earned")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center rounded-xl p-3 transition-all ${
                    badge.unlocked
                      ? `border ${badgeAccentStyles[badge.label] || "border-slate-200 bg-slate-50/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`
                      : "border border-slate-200/80 bg-slate-50/70 opacity-45 grayscale dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <span className="text-xl drop-shadow-sm">{badge.emoji}</span>
                  <span
                    className={`mt-1 text-[10px] font-semibold ${
                      badge.unlocked
                        ? "text-current"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t(badge.label)}
                  </span>
                  {badge.description ? (
                    <span
                      className={`mt-1 text-center text-[9px] leading-4 ${
                        badge.unlocked
                          ? "text-current/80"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {t(badge.description)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("Your Progress")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t("Questions Completed")}
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
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("Mock Exams Taken")}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {mockExamsTaken}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("Bank Accuracy")}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {bankAccuracy}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("Study Hours")}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {studyHours}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
