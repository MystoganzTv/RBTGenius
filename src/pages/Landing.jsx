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
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Icon: Brain,
    content: (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50">3000</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">practice questions</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50">85</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">question mock exams</p>
        </div>
      </div>
    ),
  },
  {
    label: "Premium Preview",
    title: "Mock exam confidence",
    subtitle: "Timed exams with clearer signals on whether you are ready to test.",
    accentClassName:
      "bg-[#1E5EFF]/10 text-[#1E5EFF] dark:bg-[#1E5EFF]/12 dark:text-[#8EB0FF]",
    Icon: ClipboardCheck,
    content: (
      <div className="mt-6 rounded-[1.4rem] bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Average mock score</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Keep practicing
          </span>
        </div>
        <div className="mt-5">
          <div className="h-4 rounded-full bg-slate-100 p-1 dark:bg-slate-900">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#FF8A3D] via-[#FFB800] to-emerald-500" />
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-slate-50">212</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">scaled average score</p>
            </div>
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              <p>6 mock exams taken</p>
              <p>2 passed, 4 to review</p>
            </div>
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
      "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    Icon: MessageSquareMore,
    content: (
      <div className="mt-6 space-y-3 rounded-[1.4rem] bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          Why is differential reinforcement better than just saying “no”?
        </div>
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#1E5EFF] px-4 py-3 text-sm text-white">
          Because it teaches what to do instead, not only what to stop. That makes the replacement behavior easier to reinforce consistently.
        </div>
        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Unlimited premium AI support
        </div>
      </div>
    ),
  },
];

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePreviewIndex((current) => (current + 1) % premiumPreviewPanels.length);
    }, 4200);

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

          <div className="relative min-h-[430px] px-4 py-6">
            <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_top,rgba(30,94,255,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_top,rgba(30,94,255,0.12),transparent_48%)]" />
            <div className="relative min-h-[390px]">
              {premiumPreviewPanels.map(
                ({ label, title, subtitle, accentClassName, Icon, content }, index) => {
                  const order =
                    (index - activePreviewIndex + premiumPreviewPanels.length) %
                    premiumPreviewPanels.length;

                  const cardStyles = [
                    "z-30 translate-y-0 rotate-0 scale-100 opacity-100 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.34)]",
                    "z-20 translate-x-4 translate-y-6 rotate-[1.8deg] scale-[0.965] opacity-[0.9] shadow-[0_30px_70px_-48px_rgba(15,23,42,0.22)]",
                    "z-10 translate-x-8 translate-y-12 -rotate-[1.8deg] scale-[0.93] opacity-[0.72] shadow-[0_24px_60px_-52px_rgba(15,23,42,0.16)]",
                  ];

                  return (
                    <button
                      key={title}
                      type="button"
                      aria-label={`Show ${title} preview`}
                      onClick={() => setActivePreviewIndex(index)}
                      className={`absolute inset-0 w-full rounded-[1.8rem] border border-slate-200/80 bg-white text-left transition-all dark:border-slate-800 dark:bg-slate-950 ${cardStyles[order]}`}
                      style={{
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                        transitionDuration: "1600ms",
                      }}
                    >
                      <div className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClassName}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                                {label}
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {title}
                              </p>
                              <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                                {subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            {order === 0 ? "Now" : order === 1 ? "Next" : "Then"}
                          </span>
                        </div>

                        <div className="mt-4 flex-1">{content}</div>
                      </div>
                    </button>
                  );
                },
              )}

              <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/92 px-3 py-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/92">
                {premiumPreviewPanels.map((panel, index) => (
                  <button
                    key={panel.title}
                    type="button"
                    aria-label={`Show ${panel.title} preview`}
                    onClick={() => setActivePreviewIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activePreviewIndex
                        ? "w-8 bg-[#1E5EFF]"
                        : "w-2.5 bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
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
