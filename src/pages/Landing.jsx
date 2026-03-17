import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  Crown,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCESS_COMPARISON } from "@/lib/plan-access";
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

export default function Landing() {
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
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-slate-950">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Smarter exam prep
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Practice, flashcards, mock exams, and AI support in one place.
                  </p>
                </div>
              </div>

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
            <Link to="/login?mode=register">
              <Button className="rounded-2xl bg-[#1E5EFF] px-6 hover:bg-[#1E5EFF]/90">
                Start Free
              </Button>
            </Link>
            <Link to={createPageUrl("Pricing")}>
              <Button variant="outline" className="rounded-2xl px-6">
                View Full Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
