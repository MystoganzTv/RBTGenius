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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground dark:bg-background">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E5EFF]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">RBT</span>
              <span className="text-lg font-bold text-[#1E5EFF]">Genius</span>
              <Sparkles className="h-3.5 w-3.5 text-[#FFB800]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
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
                <Button className="rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-xl">
                    Log In
                  </Button>
                </Link>
                <Link to="/login?mode=register">
                  <Button className="rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-14">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5EFF]/15 bg-[#1E5EFF]/8 px-4 py-2 text-sm font-medium text-[#1E5EFF] dark:border-[#1E5EFF]/20 dark:bg-[#1E5EFF]/10 dark:text-[#8EB0FF]">
              <Sparkles className="h-4 w-4" />
              Built for RBT exam prep
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] text-slate-900 dark:text-slate-50 sm:text-6xl">
              Study with structure, not guesswork.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              RBT Genius helps future technicians practice consistently, take realistic mock exams,
              and track meaningful progress across the full learning journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link to={createPageUrl("Dashboard")}>
                  <Button className="h-12 rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90">
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login?mode=register">
                    <Button className="h-12 rounded-2xl bg-[#1E5EFF] px-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90">
                      Start Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="h-12 rounded-2xl px-6 text-base">
                      I already have an account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative min-h-[520px] px-2 py-6 lg:px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(45,107,255,0.10),transparent_23%),radial-gradient(circle_at_34%_74%,rgba(139,92,246,0.08),transparent_22%)] blur-3xl" />
            <div className="relative mx-auto h-[470px] max-w-[34rem]">
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
                    "z-30 translate-x-0 translate-y-8 rotate-[-4.5deg] scale-100 opacity-100 shadow-[0_40px_100px_-52px_rgba(15,23,42,0.32)]",
                    "z-20 translate-x-9 translate-y-1 rotate-[5.5deg] scale-[0.972] opacity-[0.58]",
                    "z-10 translate-x-16 translate-y-12 rotate-[9deg] scale-[0.94] opacity-[0.34]",
                  ];

                  return (
                    <button
                      key={title}
                      type="button"
                      aria-label={`Show ${title} preview`}
                      onClick={() => rotatePreview(index)}
                      className={`absolute left-1/2 top-0 w-[92%] -translate-x-1/2 rounded-[2rem] border text-left transition-all will-change-transform ${cardStyles[order]} ${
                        isFrontCard
                          ? isDark
                            ? "border-slate-300/12 bg-[linear-gradient(180deg,rgba(18,31,58,0.88),rgba(10,18,35,0.84))] text-white backdrop-blur-xl"
                            : "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.92))] text-slate-900 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.20)] backdrop-blur-xl"
                          : isDark
                            ? "border-slate-300/10 bg-[linear-gradient(180deg,rgba(23,36,68,0.24),rgba(11,19,38,0.18))] text-white backdrop-blur-md"
                            : "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.58))] text-slate-700 shadow-[0_20px_50px_-46px_rgba(15,23,42,0.12)] backdrop-blur-md"
                      }`}
                      style={{
                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                        transitionDuration: "3000ms",
                      }}
                    >
                      <div
                        className="flex min-h-[390px] flex-col p-6 pb-7"
                        style={{
                          animation:
                            order % 2 === 0
                              ? `landing-preview-drift ${isFrontCard ? "8.5s" : "10.5s"} ease-in-out infinite`
                              : `landing-preview-drift-alt ${isFrontCard ? "9.25s" : "11.25s"} ease-in-out infinite`,
                          animationDelay: `${index * 0.45}s`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClassName}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-slate-500/90" : "text-slate-400"}`}>
                                {label}
                              </p>
                              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {title}
                              </p>
                              <p className={`max-w-md text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                {subtitle}
                              </p>
                            </div>
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "border-white/12 bg-white/5 text-slate-400" : "border-slate-200 bg-white/80 text-slate-400"}`}>
                            {order === 0 ? "Now" : order === 1 ? "Next" : "Then"}
                          </span>
                        </div>

                        <div className="mt-4 flex-1">
                          {isFrontCard ? (
                            renderContent(isDark)
                          ) : (
                            <div className="space-y-4">
                              <div className={`rounded-[1.55rem] border p-5 ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200/80 bg-white/65"}`}>
                                <div className="flex items-center justify-between">
                                  <div className={`h-3 w-28 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                                  <div className={`h-8 w-24 rounded-full border ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                                </div>
                                <div className="mt-4 space-y-3">
                                  <div className={`h-12 rounded-[1.2rem] ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <div className={`h-24 rounded-[1.2rem] border ${isDark ? "border-white/8 bg-white/[0.04]" : "border-slate-200 bg-white/80"}`} />
                                    <div className={`h-24 rounded-[1.2rem] border ${isDark ? "border-white/8 bg-white/[0.04]" : "border-slate-200 bg-white/80"}`} />
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.04]" : "border-slate-200 bg-white/80"}`} />
                                <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.04]" : "border-slate-200 bg-white/80"}`} />
                                <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.04]" : "border-slate-200 bg-white/80"}`} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                },
              )}

              {outgoingPanel ? (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-1/2 top-0 z-40 w-[92%] -translate-x-1/2 rounded-[2rem] border text-left ${
                    isDark
                      ? "border-slate-300/12 bg-[linear-gradient(180deg,rgba(18,31,58,0.88),rgba(10,18,35,0.84))] text-white backdrop-blur-xl"
                      : "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.92))] text-slate-900 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.20)] backdrop-blur-xl"
                  }`}
                  style={{
                    animation:
                      "landing-preview-orbit-exit 3200ms cubic-bezier(0.19, 1, 0.22, 1) forwards",
                  }}
                >
                  <div className="flex min-h-[390px] flex-col p-6 pb-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${outgoingPanel.accentClassName}`}
                        >
                          <outgoingPanel.Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-slate-500/90" : "text-slate-400"}`}>
                            {outgoingPanel.label}
                          </p>
                          <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {outgoingPanel.title}
                          </p>
                          <p className={`max-w-md text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                            {outgoingPanel.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "border-white/12 bg-white/5 text-slate-400" : "border-slate-200 bg-white/80 text-slate-400"}`}>
                        Passing
                      </span>
                    </div>

                    <div className="mt-4 flex-1 space-y-4">
                      <div className={`rounded-[1.55rem] border p-5 ${isDark ? "border-white/8 bg-white/[0.025]" : "border-slate-200/80 bg-white/70"}`}>
                        <div className="flex items-center justify-between">
                          <div className={`h-3 w-28 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                          <div className={`h-8 w-24 rounded-full border ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className={`h-12 rounded-[1.2rem] ${isDark ? "bg-white/[0.05]" : "bg-slate-100"}`} />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className={`h-24 rounded-[1.2rem] border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                            <div className={`h-24 rounded-[1.2rem] border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                        <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                        <div className={`h-16 rounded-[1.1rem] border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/80"}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
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

        <section className="mt-16 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-4 py-2 text-sm font-medium text-[#C88700] dark:border-[#FFB800]/25 dark:bg-[#FFB800]/12 dark:text-[#FFD36B]">
              <Crown className="h-4 w-4" />
              Guest, Free, and Premium
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              See what changes when you upgrade.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              Guests can explore the app, free members get daily guided practice, and Premium unlocks unlimited prep with full analytics and mock exams.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
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

          <div className="mt-8 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="rounded-2xl bg-[#1E5EFF] px-6 hover:bg-[#1E5EFF]/90">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login?mode=register">
                <Button className="rounded-2xl bg-[#1E5EFF] px-6 hover:bg-[#1E5EFF]/90">
                  Start Free
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("Pricing")}>
              <Button variant="outline" className="rounded-2xl px-6">
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
