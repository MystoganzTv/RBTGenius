import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Clock,
  Trophy,
  XCircle,
} from "lucide-react";
import PremiumGate from "@/components/billing/PremiumGate";
import BilingualText from "@/components/i18n/BilingualText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { api } from "@/lib/api";
import { localizeQuestion, translateTopic, translateUi } from "@/lib/i18n";
import { isPremiumPlan } from "@/lib/plan-access";
import { topicLabels } from "@/lib/question-bank";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const TOTAL_QUESTIONS = 85;
const EXAM_DURATION_MINUTES = 90;
const PASS_SCORE = 80;

function normalizeQuestionList(value) {
  return Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : [];
}

async function saveMockExamResult(result) {
  return api.createMockExam(result);
}

export default function MockExams() {
  const { language } = useLanguage();
  const [examState, setExamState] = useState("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [examResult, setExamResult] = useState(null);
  const [examSeed, setExamSeed] = useState(null);
  const queryClient = useQueryClient();
  const finishExamRef = useRef(null);

  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: api.getProfile,
  });

  const entitlements = profileData?.entitlements;

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["mock-exam-questions", examSeed],
    queryFn: () =>
      api.listQuestions({
        mode: "mock",
        limit: TOTAL_QUESTIONS,
        seed: examSeed,
      }),
    select: normalizeQuestionList,
    enabled: examState === "in_progress" && Boolean(examSeed),
  });

  const saveMutation = useMutation({
    mutationFn: saveMockExamResult,
    onSuccess: (result) => {
      setExamResult(result);
      setExamState("completed");
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      toast({
        title:
          error?.data?.code === "premium_required"
            ? "Premium required"
            : "Unable to save exam",
        description:
          error?.data?.code === "premium_required"
            ? "Mock exams are part of Premium."
            : error.message || "Please try again.",
      });
    },
  });

  const handleStartExam = () => {
    setExamSeed(`mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    setExamState("in_progress");
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setExamResult(null);
  };

  const handleFinishExam = useCallback(() => {
    if (saveMutation.isPending || questions.length === 0) {
      return;
    }

    saveMutation.mutate({
      question_ids: questions.map((question) => question.id),
      answers,
      time_taken_minutes: EXAM_DURATION_MINUTES - Math.floor(timeLeft / 60),
    });
  }, [answers, questions, saveMutation, timeLeft]);

  useEffect(() => {
    finishExamRef.current = handleFinishExam;
  }, [handleFinishExam]);

  useEffect(() => {
    if (examState !== "in_progress") {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          finishExamRef.current?.();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex] || null;
  const localizedCurrentQuestion = localizeQuestion(currentQuestion, language);

  if (!entitlements) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-6 w-1/3 rounded bg-slate-100" />
          <div className="mx-auto h-4 w-1/4 rounded bg-slate-50" />
        </div>
      </div>
    );
  }

  if (!isPremiumPlan(entitlements.plan)) {
    return (
      <PremiumGate
        feature="mock_exams"
        bullets={[
          translateUi("Full 85-question timed mock exams", language),
          translateUi("Saved exam history and score trends", language),
          translateUi("Domain breakdown after each completed exam", language),
        ]}
      />
    );
  }

  if (examState === "idle") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 hidden text-center md:block">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <ClipboardCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {translateUi("Mock RBT Exam", language)}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {translateUi("Simulate the real BACB RBT certification exam.", language)}
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {TOTAL_QUESTIONS}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{translateUi("Questions", language)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {EXAM_DURATION_MINUTES}m
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{translateUi("Time Limit", language)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{PASS_SCORE}%</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{translateUi("Pass Score", language)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500 dark:text-amber-300" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {translateUi("Exam Instructions", language)}
              </p>
              <ul className="mt-1 space-y-1 text-xs text-amber-700 dark:text-amber-100/85">
                <li>• {translateUi("Answer all questions within the time limit", language)}</li>
                <li>• {translateUi("You can navigate between questions freely", language)}</li>
                <li>• {translateUi("Results are shown after submission", language)}</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleStartExam}
            className="w-full gap-2 rounded-2xl py-6 text-base hover:bg-emerald-700 dark:hover:bg-emerald-600"
            style={{ backgroundColor: "#059669" }}
          >
            <ClipboardCheck className="h-5 w-5" />
            {translateUi("Begin Mock Exam", language)}
          </Button>
        </div>

        <div className="space-y-5 md:hidden">
          <section className="overflow-hidden rounded-[2rem] border border-emerald-200/40 bg-gradient-to-br from-[#1F3F67] to-[#0C8A6A] px-5 py-5 text-white shadow-[0_28px_65px_-42px_rgba(5,150,105,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  {translateUi("Mock Exam", language)}
                </p>
                <h1 className="mt-3 text-[1.95rem] font-black leading-[0.95]">
                  {translateUi("Exam Simulation", language)}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-white/78">
                  {translateUi(
                    "Take a full-length timed exam in a cleaner mobile flow that feels closer to a real app session.",
                    language,
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[1.25rem] bg-white/10 px-3 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {translateUi("Questions", language)}
                </p>
                <p className="mt-1 text-xl font-black">{TOTAL_QUESTIONS}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/10 px-3 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {translateUi("Minutes", language)}
                </p>
                <p className="mt-1 text-xl font-black">{EXAM_DURATION_MINUTES}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/10 px-3 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {translateUi("Pass", language)}
                </p>
                <p className="mt-1 text-xl font-black">{PASS_SCORE}%</p>
              </div>
            </div>
          </section>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_55px_-40px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950">
            <div className="rounded-[1.4rem] bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {translateUi("Before you begin", language)}
              </p>
              <div className="mt-2 space-y-2 leading-relaxed">
                <p>{translateUi("Answer all questions within the time limit", language)}</p>
                <p>{translateUi("You can navigate between questions freely", language)}</p>
                <p>{translateUi("Results are shown after submission", language)}</p>
              </div>
            </div>

            <Button
              onClick={handleStartExam}
              className="mt-5 h-14 w-full gap-2 rounded-[1.45rem] bg-emerald-600 text-base font-semibold shadow-[0_22px_40px_-24px_rgba(5,150,105,0.75)] hover:bg-emerald-700"
            >
              <ClipboardCheck className="h-5 w-5" />
              {translateUi("Begin Mock Exam", language)}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (examState === "completed" && examResult) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <div
            className={cn(
              "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
              examResult.passed ? "bg-emerald-50" : "bg-red-50",
            )}
          >
            {examResult.passed ? (
              <Trophy className="h-10 w-10 text-[#FFB800]" />
            ) : (
              <XCircle className="h-10 w-10 text-red-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {translateUi(examResult.passed ? "Congratulations!" : "Keep Practicing", language)}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {examResult.passed
              ? translateUi("You passed the mock exam!", language)
              : translateUi("You need more preparation.", language)}
          </p>
        </div>

        <div className="rounded-[1.8rem] border border-slate-100 bg-white p-6">
          <div className="mb-6 text-center">
            <div
              className="text-6xl font-bold"
              style={{
                color:
                  examResult.score >= 80
                    ? "#10B981"
                    : examResult.score >= 60
                      ? "#FFB800"
                      : "#EF4444",
              }}
            >
              {examResult.score}%
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {examResult.correct_answers}/{examResult.total_questions} correct •{" "}
              {examResult.time_taken_minutes}min
            </p>
          </div>

          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            {translateUi("Domain Breakdown", language)}
          </h3>
          <div className="space-y-3">
            {Object.entries(examResult.domain_scores || {}).map(([key, value]) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {translateTopic(key, language) || topicLabels[key]}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        value >= 80 ? "#10B981" : value >= 60 ? "#FFB800" : "#EF4444",
                    }}
                  >
                    {value}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${value}%`,
                      backgroundColor:
                        value >= 80 ? "#10B981" : value >= 60 ? "#FFB800" : "#EF4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={() => setExamState("idle")}
          >
            {translateUi("Back to Exams", language)}
          </Button>
          <Button
            className="flex-1 rounded-2xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
            onClick={handleStartExam}
          >
            {translateUi("Retake Exam", language)}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || saveMutation.isPending || questions.length === 0 || !currentQuestion) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-6 w-1/3 rounded bg-slate-100" />
          <div className="mx-auto h-4 w-1/4 rounded bg-slate-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="sticky top-20 z-30 hidden items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3 md:flex">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1}/{questions.length}
          </Badge>
          <span className="text-sm text-slate-500">
            {translateUi(`${Object.keys(answers).length} answered`, language)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              timeLeft < 300
                ? "bg-red-50 text-red-600"
                : "bg-slate-50 text-slate-600",
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-xl"
            onClick={handleFinishExam}
          >
            {translateUi("Finish Exam", language)}
          </Button>
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white px-4 py-4 shadow-[0_24px_55px_-40px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
              {translateUi("Mock in progress", language)}
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
              timeLeft < 300
                ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                : "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {translateUi("Answered", language)}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {Object.keys(answers).length}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <Button
          size="sm"
          variant="destructive"
          className="mt-4 w-full rounded-2xl"
          onClick={handleFinishExam}
        >
          {translateUi("Finish Exam", language)}
        </Button>
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-[0_24px_55px_-40px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <BilingualText
          content={localizedCurrentQuestion?.localizedText}
          className="mb-6"
          primaryClassName="text-[1.02rem] font-semibold leading-relaxed text-slate-900 dark:text-slate-50"
          secondaryClassName="leading-relaxed text-slate-500"
        />
        <div className="space-y-3">
          {(localizedCurrentQuestion?.options || []).map((option) => {
            const isSelected = answers[currentQuestion.id] === option.label;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [currentQuestion.id]: option.label,
                  }))
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-[1.15rem] border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[#1E5EFF] bg-[#1E5EFF]/5"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    isSelected
                      ? "bg-[#1E5EFF] text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400",
                  )}
                >
                  {option.label}
                </span>
                <BilingualText
                  content={option.localizedText}
                  primaryClassName="text-sm text-slate-900 dark:text-slate-100"
                  secondaryClassName="text-slate-500"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          className="h-12 flex-1 gap-2 rounded-2xl"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((current) => current - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {translateUi("Previous", language)}
        </Button>
        <Button
          className="h-12 flex-1 gap-2 rounded-2xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
          disabled={currentIndex >= questions.length - 1}
          onClick={() => setCurrentIndex((current) => current + 1)}
        >
          {translateUi("Next", language)}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
