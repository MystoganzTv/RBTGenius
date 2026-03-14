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

const fallbackQuestions = Array.from({ length: 320 }, (_, index) => ({
  id: `question-${index + 1}`,
}));

function readLocalJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

async function loadDashboardData() {
  const progress = readLocalJson("rbt_genius_user_progress", fallbackProgress);
  const allQuestions = readLocalJson("rbt_genius_questions", fallbackQuestions);

  return {
    progress: progress || fallbackProgress,
    allQuestions: Array.isArray(allQuestions) ? allQuestions : fallbackQuestions,
  };
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Let's continue your RBT exam preparation.
          </p>
        </div>

        <Link to={createPageUrl("Practice")}>
          <Button className="gap-2 rounded-xl bg-[#1E5EFF] shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90">
            <Zap className="h-4 w-4" />
            Start Practicing
          </Button>
        </Link>
      </div>

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
