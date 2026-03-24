import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  Crown,
  GraduationCap,
  LayoutDashboard,
  MessageSquareMore,
  Moon,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { useTheme } from "@/hooks/use-theme";
import { ACCESS_COMPARISON } from "@/lib/plan-access";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

const featureCards = [
  {
    title: "Practice With a Large Bank",
    description: "Work through thousands of RBT-style questions organized for steady progress.",
    Icon: Target,
  },
  {
    title: "Take Realistic Mock Exams",
    description: "Simulate the exam experience with timed tests pulled from the same question bank.",
    Icon: ClipboardCheck,
  },
  {
    title: "Track Meaningful Progress",
    description: "See overall progress, streaks, readiness, and domain performance without noisy session swings.",
    Icon: LayoutDashboard,
  },
];

const premiumPreviewPanels = [
  {
    label: "Premium Preview",
    title: "Smarter exam prep",
    subtitle: "Practice, flashcards, mock exams, and AI support in one place.",
    accentClassName:
      "bg-emerald-500/14 text-emerald-300",
    Icon: Brain,
    renderMobileContent: (isDark) => (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`rounded-[1.15rem] p-3 ${
              isDark ? "bg-white/[0.04]" : "bg-white/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.18)]"
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Question bank
            </p>
            <p className={`mt-2 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>3000</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>practice questions</p>
          </div>
          <div
            className={`rounded-[1.15rem] p-3 ${
              isDark ? "bg-white/[0.04]" : "bg-white/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.18)]"
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Mock exams
            </p>
            <p className={`mt-2 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>85</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>questions each</p>
          </div>
        </div>
        <div className={`mt-4 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-[#2D6BFF]/14 text-[#8EB0FF]" : "bg-[#2D6BFF]/8 text-[#1E5EFF]"}`}>Practice</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>Flashcards</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"}`}>AI tutor</span>
        </div>
      </div>
    ),
    renderContent: (isDark) => (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-[1.4rem] border p-4 backdrop-blur-sm ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white/88 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.25)]"
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Question Bank
            </p>
            <p className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>3000</p>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>practice questions</p>
          </div>
          <div
            className={`rounded-[1.4rem] border p-4 backdrop-blur-sm ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white/88 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.25)]"
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Mock Exams
            </p>
            <p className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>85</p>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>questions per exam</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-[#2D6BFF]/30 bg-[#2D6BFF]/14 text-[#8EB0FF]" : "border-[#2D6BFF]/18 bg-[#2D6BFF]/8 text-[#1E5EFF]"}`}>
            Practice
          </div>
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border-emerald-300/40 bg-emerald-50 text-emerald-700"}`}>
            Flashcards
          </div>
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-violet-400/20 bg-violet-500/10 text-violet-300" : "border-violet-300/40 bg-violet-50 text-violet-700"}`}>
            AI Tutor
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Premium Preview",
    title: "Mock exam confidence",
    subtitle: "Timed exams with clearer signals on whether you are ready to test.",
    accentClassName:
      "bg-[#2D6BFF]/14 text-[#8EB0FF]",
    Icon: ClipboardCheck,
    renderMobileContent: (isDark) => (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Mock readiness
            </p>
            <p className={`mt-2 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>212</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>average scaled score</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${isDark ? "bg-amber-500/16 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
            Keep practicing
          </span>
        </div>
        <div className={`mt-4 h-3 rounded-full p-0.5 ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#FF8A3D] via-[#FFB800] to-emerald-400" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className={`rounded-[1rem] p-3 ${isDark ? "bg-white/[0.04]" : "bg-white/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.18)]"}`}>
            <p className="text-2xl font-black text-emerald-300">2</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>passed</p>
          </div>
          <div className={`rounded-[1rem] p-3 ${isDark ? "bg-white/[0.04]" : "bg-white/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.18)]"}`}>
            <p className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>6</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>taken</p>
          </div>
          <div className={`rounded-[1rem] p-3 ${isDark ? "bg-white/[0.04]" : "bg-white/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.18)]"}`}>
            <p className="text-2xl font-black text-amber-300">4</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>review</p>
          </div>
        </div>
      </div>
    ),
    renderContent: (isDark) => (
      <div className="space-y-4">
        <div
          className={`rounded-[1.4rem] border p-5 backdrop-blur-sm ${
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/88 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Average mock score</span>
            <span className={`rounded-full px-3 py-1 font-semibold ${isDark ? "bg-amber-500/16 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
              Keep practicing
            </span>
          </div>
          <div className="mt-5">
            <div className={`h-4 rounded-full p-1 ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#FF8A3D] via-[#FFB800] to-emerald-400" />
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className={`text-4xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>212</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>scaled average score</p>
              </div>
              <div className={`text-right text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <p>6 mock exams taken</p>
                <p>2 passed, 4 to review</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className={`rounded-[1.2rem] border px-4 py-3 ${isDark ? "border-emerald-400/18 bg-emerald-500/8" : "border-emerald-300/40 bg-emerald-50"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Passed
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-300">2</p>
          </div>
          <div className={`rounded-[1.2rem] border px-4 py-3 ${isDark ? "border-amber-400/18 bg-amber-500/8" : "border-amber-300/40 bg-amber-50"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Need review
            </p>
            <p className="mt-2 text-2xl font-black text-amber-300">4</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Premium Preview",
    title: "Ask the AI coach",
    subtitle: "Get quick explanations, study prompts, and targeted help when you get stuck.",
    accentClassName:
      "bg-violet-500/14 text-violet-300",
    Icon: MessageSquareMore,
    renderMobileContent: (isDark) => (
      <div>
        <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 text-xs ${isDark ? "bg-white/8 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
          Why is differential reinforcement better than just saying “no”?
        </div>
        <div className="mt-3 ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#2D6BFF] px-3 py-2 text-xs text-white">
          It teaches what to do instead, so the learner has a replacement behavior to reinforce.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"}`}>Concepts</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-white/6 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Explain</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${isDark ? "bg-white/6 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Prompts</span>
        </div>
      </div>
    ),
    renderContent: (isDark) => (
      <div className="space-y-4">
        <div
          className={`space-y-3 rounded-[1.4rem] border p-5 backdrop-blur-sm ${
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/88 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm ${isDark ? "bg-white/8 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
            Why is differential reinforcement better than just saying “no”?
          </div>
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#2D6BFF] px-4 py-3 text-sm text-white">
            Because it teaches what to do instead, not only what to stop. That makes the
            replacement behavior easier to reinforce consistently.
          </div>
          <div className={`flex items-center gap-2 pt-2 text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Unlimited premium AI support
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-violet-400/20 bg-violet-500/10 text-violet-300" : "border-violet-300/40 bg-violet-50 text-violet-700"}`}>
            RBT concepts
          </div>
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>
            Quick explanations
          </div>
          <div className={`rounded-[1.2rem] border px-4 py-3 text-sm font-medium ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>
            Study prompts
          </div>
        </div>
      </div>
    ),
  },
];

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [outgoingPreviewIndex, setOutgoingPreviewIndex] = useState(null);
  const outgoingPanel =
    outgoingPreviewIndex !== null ? premiumPreviewPanels[outgoingPreviewIndex] : null;

  const rotatePreview = (nextIndex) => {
    setActivePreviewIndex((current) => {
      const resolvedNext =
        typeof nextIndex === "number"
          ? nextIndex % premiumPreviewPanels.length
          : (current + 1) % premiumPreviewPanels.length;

      if (resolvedNext === current) {
        return current;
      }

      setOutgoingPreviewIndex(current);
      window.setTimeout(() => {
        setOutgoingPreviewIndex((previous) => (previous === current ? null : previous));
      }, 3200);

      return resolvedNext;
    });
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      rotatePreview();
    }, 6400);

    return () => window.clearInterval(intervalId);
  }, []);

  const renderDesktopWindowBar = (title, stateLabel) => (
    <div
      className={`flex items-center justify-between border-b px-5 py-3 ${
        isDark ? "border-white/8 bg-white/[0.025]" : "border-slate-200/80 bg-white/65"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex items-center gap-3">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {title}
        </p>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
            isDark ? "border-white/10 bg-white/[0.03] text-slate-400" : "border-slate-200 bg-white/85 text-slate-500"
          }`}
        >
          {stateLabel}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground dark:bg-background">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#1E5EFF]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex min-w-0 items-center gap-1">
              <span className="truncate text-base font-bold text-slate-900 dark:text-slate-50 sm:text-lg">RBT</span>
              <span className="truncate text-base font-bold text-[#1E5EFF] sm:text-lg">Genius</span>
              <Sparkles className="h-3.5 w-3.5 text-[#FFB800]" />
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
            {isAuthenticated ? (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="rounded-xl bg-[#1E5EFF] px-3 text-sm hover:bg-[#1E5EFF]/90 sm:px-4 sm:text-base">
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" className="rounded-xl">
                    Log In
                  </Button>
                </Link>
                <Link to="/login?mode=register">
                  <Button className="rounded-xl bg-[#1E5EFF] px-3 text-sm hover:bg-[#1E5EFF]/90 sm:px-4 sm:text-base">
                    <span className="hidden sm:inline">Create Account</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5EFF]/15 bg-[#1E5EFF]/8 px-4 py-2 text-xs font-medium text-[#1E5EFF] dark:border-[#1E5EFF]/20 dark:bg-[#1E5EFF]/10 dark:text-[#8EB0FF] sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Built for RBT exam prep
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] text-slate-900 dark:text-slate-50 sm:mt-6 sm:text-5xl lg:text-6xl">
              Study with structure, not guesswork.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-xl">
              RBT Genius helps future technicians practice consistently, take realistic mock exams,
              and track meaningful progress across the full learning journey.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {isAuthenticated ? (
                <Link to={createPageUrl("Dashboard")}>
                  <Button className="h-12 w-full rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90 sm:w-auto">
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login?mode=register">
                    <Button className="h-12 w-full rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90 sm:w-auto">
                      Start Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="h-12 w-full rounded-2xl px-6 text-base sm:w-auto">
                      I already have an account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative min-h-[380px] px-0 py-2 sm:min-h-[520px] sm:px-2 sm:py-6 lg:px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(45,107,255,0.10),transparent_23%),radial-gradient(circle_at_34%_74%,rgba(139,92,246,0.08),transparent_22%)] blur-3xl" />
            <div className="mx-auto mb-3 hidden max-w-[22rem] text-center sm:mb-4 sm:max-w-[34rem] sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-4 py-2 text-[11px] font-medium text-[#C88700] dark:border-[#FFB800]/25 dark:bg-[#FFB800]/12 dark:text-[#FFD36B] sm:text-sm">
                <Crown className="h-3.5 w-3.5" />
                Premium Preview
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:max-w-md">
                A quick look at the premium tools you unlock with mock exams, AI support, and deeper study workflows.
              </p>
            </div>
            <div className="relative mx-auto max-w-[22rem] sm:hidden">
              {(() => {
                const activePanel = premiumPreviewPanels[activePreviewIndex];

                return (
                  <div
                    className={`rounded-[2rem] border p-3 ${
                      isDark
                        ? "border-slate-800 bg-[linear-gradient(180deg,#0b1224,#0a1020)]"
                        : "border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_30px_80px_-50px_rgba(15,23,42,0.18)]"
                    }`}
                  >
                    <div className="mb-3 flex justify-start">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-4 py-2 text-[11px] font-medium text-[#C88700] dark:border-[#FFB800]/25 dark:bg-[#FFB800]/12 dark:text-[#FFD36B]">
                        <Crown className="h-3.5 w-3.5" />
                        Premium Preview
                      </span>
                    </div>
                    <div
                      className={`overflow-hidden rounded-[1.75rem] ${
                        isDark
                          ? "bg-[linear-gradient(180deg,#0f1930,#0b1427)] shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)]"
                          : "bg-[linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_24px_60px_-42px_rgba(15,23,42,0.16)]"
                      }`}
                    >
                      <div
                        className={`rounded-[1.75rem] ${
                          isDark
                            ? "bg-[linear-gradient(180deg,rgba(18,31,58,0.94),rgba(10,18,35,0.9))] text-white backdrop-blur-xl"
                            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] text-slate-900 backdrop-blur-xl"
                        }`}
                        style={{
                          animation:
                            "landing-preview-mobile-enter 560ms cubic-bezier(0.19, 1, 0.22, 1) both",
                        }}
                      >
                        <div
                          className={`flex items-center justify-between border-b px-4 py-3 ${
                            isDark ? "border-white/8" : "border-slate-200/80"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                          </div>
                          <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            RBT Genius
                          </div>
                        </div>
                        <div className="flex min-h-[246px] flex-col p-4 pb-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${activePanel.accentClassName}`}
                            >
                              <activePanel.Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p
                                className={`text-sm font-semibold leading-tight ${
                                  isDark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {activePanel.title}
                              </p>
                              <p
                                className={`text-xs leading-5 ${
                                  isDark ? "text-slate-300" : "text-slate-500"
                                }`}
                              >
                                {activePanel.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex-1">
                            {(activePanel.renderMobileContent ?? activePanel.renderContent)(isDark)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="relative mx-auto hidden h-[470px] max-w-[34rem] sm:block">
              {premiumPreviewPanels.map(
                ({ label, title, subtitle, accentClassName, Icon, renderContent }, index) => {
                  if (index === outgoingPreviewIndex) {
                    return null;
                  }

                  const order =
                    (index - activePreviewIndex + premiumPreviewPanels.length) %
                    premiumPreviewPanels.length;
                  const isFrontCard = order === 0;

                  const cardStyles = [
                    "z-30 translate-x-0 translate-y-5 rotate-[-3deg] scale-100 opacity-100 shadow-[0_32px_72px_-42px_rgba(15,23,42,0.28)] sm:translate-y-8 sm:rotate-[-4.5deg] sm:shadow-[0_40px_100px_-52px_rgba(15,23,42,0.32)]",
                    "z-20 translate-x-4 translate-y-1 rotate-[3.5deg] scale-[0.98] opacity-[0.45] sm:translate-x-9 sm:rotate-[5.5deg] sm:scale-[0.972] sm:opacity-[0.58]",
                    "z-10 translate-x-8 translate-y-8 rotate-[6deg] scale-[0.955] opacity-[0.18] sm:translate-x-16 sm:translate-y-12 sm:rotate-[9deg] sm:scale-[0.94] sm:opacity-[0.34]",
                  ];

                  return (
                    <button
                      key={title}
                      type="button"
                      aria-label={`Show ${title} preview`}
                      onClick={() => rotatePreview(index)}
                      className={`absolute left-1/2 top-0 w-[96%] -translate-x-1/2 rounded-[1.9rem] border text-left transition-all will-change-transform sm:w-[92%] sm:rounded-[2.1rem] ${cardStyles[order]} ${
                        isFrontCard
                          ? isDark
                            ? "border-slate-300/12 bg-[linear-gradient(180deg,rgba(18,31,58,0.9),rgba(10,18,35,0.86))] text-white backdrop-blur-xl"
                            : "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] text-slate-900 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.20)] backdrop-blur-xl"
                          : isDark
                            ? "border-slate-300/10 bg-[linear-gradient(180deg,rgba(23,36,68,0.24),rgba(11,19,38,0.18))] text-white backdrop-blur-md"
                            : "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.58))] text-slate-700 shadow-[0_20px_50px_-46px_rgba(15,23,42,0.12)] backdrop-blur-md"
                      }`}
                      style={{
                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                        transitionDuration: "3000ms",
                      }}
                    >
                      <div className="overflow-hidden rounded-[1.9rem] sm:rounded-[2.1rem]">
                        {renderDesktopWindowBar(title, order === 0 ? "Now" : order === 1 ? "Next" : "Then")}
                        <div
                          className="flex min-h-[290px] flex-col p-5 pb-5 sm:min-h-[390px] sm:p-6 sm:pb-7"
                          style={{
                            animation:
                              order % 2 === 0
                                ? `landing-preview-drift ${isFrontCard ? "8.5s" : "10.5s"} ease-in-out infinite`
                                : `landing-preview-drift-alt ${isFrontCard ? "9.25s" : "11.25s"} ease-in-out infinite`,
                            animationDelay: `${index * 0.45}s`,
                          }}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${accentClassName}`}
                            >
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.24em] ${isDark ? "text-slate-500/90" : "text-slate-400"}`}>
                                {label}
                              </p>
                              <p className={`text-sm font-semibold leading-tight sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                                {title}
                              </p>
                              <p className={`max-w-md text-xs leading-5 sm:text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                {subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex-1">
                            {isFrontCard ? (
                              renderContent(isDark)
                            ) : (
                              <div className="space-y-4">
                                <div className={`rounded-[1.3rem] p-4 sm:rounded-[1.55rem] sm:p-5 ${isDark ? "bg-white/[0.03]" : "bg-white/65"}`}>
                                  <div className="flex items-center justify-between">
                                    <div className={`h-3 w-28 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                                    <div className={`h-8 w-24 rounded-full ${isDark ? "bg-white/[0.05]" : "bg-white/90 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)]"}`} />
                                  </div>
                                  <div className="mt-4 space-y-3">
                                    <div className={`h-12 rounded-[1.2rem] ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                      <div className={`h-24 rounded-[1.2rem] ${isDark ? "bg-white/[0.04]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                                      <div className={`h-24 rounded-[1.2rem] ${isDark ? "bg-white/[0.04]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                  <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.04]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                                  <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.04]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                                  <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.04]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                },
              )}

              {outgoingPanel ? (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-1/2 top-0 z-40 w-[96%] -translate-x-1/2 rounded-[1.9rem] border text-left sm:w-[92%] sm:rounded-[2.1rem] ${
                    isDark
                      ? "border-slate-300/12 bg-[linear-gradient(180deg,rgba(18,31,58,0.9),rgba(10,18,35,0.86))] text-white backdrop-blur-xl"
                      : "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] text-slate-900 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.20)] backdrop-blur-xl"
                  }`}
                  style={{
                    animation:
                      "landing-preview-orbit-exit 3200ms cubic-bezier(0.19, 1, 0.22, 1) forwards",
                  }}
                >
                  <div className="overflow-hidden rounded-[1.9rem] sm:rounded-[2.1rem]">
                    {renderDesktopWindowBar(outgoingPanel.title, "Passing")}
                    <div className="flex min-h-[290px] flex-col p-5 pb-5 sm:min-h-[390px] sm:p-6 sm:pb-7">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${outgoingPanel.accentClassName}`}
                        >
                          <outgoingPanel.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.24em] ${isDark ? "text-slate-500/90" : "text-slate-400"}`}>
                            {outgoingPanel.label}
                          </p>
                          <p className={`text-sm font-semibold leading-tight sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                            {outgoingPanel.title}
                          </p>
                          <p className={`max-w-md text-xs leading-5 sm:text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                            {outgoingPanel.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex-1 space-y-4">
                        <div className={`rounded-[1.3rem] p-4 sm:rounded-[1.55rem] sm:p-5 ${isDark ? "bg-white/[0.025]" : "bg-white/70"}`}>
                          <div className="flex items-center justify-between">
                            <div className={`h-3 w-28 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                            <div className={`h-8 w-24 rounded-full ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className={`h-12 rounded-[1.2rem] ${isDark ? "bg-white/[0.05]" : "bg-slate-100"}`} />
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className={`h-24 rounded-[1.2rem] ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                              <div className={`h-24 rounded-[1.2rem] ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                          <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                          <div className={`h-16 rounded-[1.1rem] ${isDark ? "bg-white/[0.03]" : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]"}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:mt-16 md:gap-5 md:grid-cols-3">
          {featureCards.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E5EFF]/10 text-[#1E5EFF] dark:bg-[#1E5EFF]/12 dark:text-[#8EB0FF]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950 sm:mt-16 sm:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-4 py-2 text-sm font-medium text-[#C88700] dark:border-[#FFB800]/25 dark:bg-[#FFB800]/12 dark:text-[#FFD36B]">
              <Crown className="h-4 w-4" />
              Guest, Free, and Premium
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              See what changes when you upgrade.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              Guests can explore the app, free members get daily guided practice, and Premium unlocks unlimited prep with full analytics and mock exams.
            </p>
          </div>

          <div className="mt-8 hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Free
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {ACCESS_COMPARISON.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-b-0 dark:border-slate-900"
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {row.guest}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {row.free}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-4 md:hidden">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Guest</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Explore the product, preview pricing, and see how the study flow works before signing up.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Free</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Build a daily routine with guided practice, flashcards, and a lighter version of the AI tutor.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Premium</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Unlock full mock exams, analytics, unlimited study support, and the complete prep experience.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isAuthenticated ? (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="w-full rounded-2xl bg-[#1E5EFF] px-6 hover:bg-[#1E5EFF]/90 sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login?mode=register">
                <Button className="w-full rounded-2xl bg-[#1E5EFF] px-6 hover:bg-[#1E5EFF]/90 sm:w-auto">
                  Start Free
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("Pricing")}>
              <Button variant="outline" className="w-full rounded-2xl px-6 sm:w-auto">
                View Full Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
