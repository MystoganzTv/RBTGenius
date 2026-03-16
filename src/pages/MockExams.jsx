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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOTAL_QUESTIONS = 85;
const EXAM_DURATION_MINUTES = 90;
const PASS_SCORE = 80;
const QUESTIONS_STORAGE_KEY = "rbt_genius_questions";
const EXAMS_STORAGE_KEY = "rbt_genius_mock_exams";

const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

const baseQuestionBank = [
  {
    id: "q1",
    text: "What is the main purpose of positive reinforcement?",
    topic: "measurement",
    difficulty: "beginner",
    correct_answer: "B",
    explanation:
      "Positive reinforcement increases the future likelihood of a behavior by adding something valuable after it occurs.",
    options: [
      { label: "A", text: "To decrease future behavior" },
      { label: "B", text: "To increase future behavior" },
      { label: "C", text: "To ignore problem behavior" },
      { label: "D", text: "To remove a demand" },
    ],
  },
  {
    id: "q2",
    text: "Which part of the ABC sequence happens right before the behavior?",
    topic: "assessment",
    difficulty: "beginner",
    correct_answer: "A",
    explanation:
      "The antecedent is what occurs before the behavior and can signal or trigger it.",
    options: [
      { label: "A", text: "Antecedent" },
      { label: "B", text: "Consequence" },
      { label: "C", text: "Function" },
      { label: "D", text: "Data point" },
    ],
  },
  {
    id: "q3",
    text: "Prompt fading is used primarily to:",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    correct_answer: "C",
    explanation:
      "Prompt fading helps transfer stimulus control from the prompt to the natural cue so the learner becomes more independent.",
    options: [
      { label: "A", text: "Increase punishment intensity" },
      { label: "B", text: "Reduce reinforcement" },
      { label: "C", text: "Promote independent responding" },
      { label: "D", text: "Remove target behaviors" },
    ],
  },
  {
    id: "q4",
    text: "A replacement behavior should ideally:",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    correct_answer: "D",
    explanation:
      "A replacement behavior should be functionally equivalent and easier or more efficient for the learner to use.",
    options: [
      { label: "A", text: "Be harder than the problem behavior" },
      { label: "B", text: "Require more time and effort" },
      { label: "C", text: "Look exactly the same as the problem behavior" },
      { label: "D", text: "Serve the same function in a better way" },
    ],
  },
  {
    id: "q5",
    text: "Why is accurate data collection important for an RBT?",
    topic: "documentation",
    difficulty: "beginner",
    correct_answer: "B",
    explanation:
      "Reliable data helps supervisors make informed treatment decisions and track progress objectively.",
    options: [
      { label: "A", text: "It replaces parent communication" },
      { label: "B", text: "It supports clinical decision making" },
      { label: "C", text: "It eliminates the need for supervision" },
      { label: "D", text: "It guarantees treatment success" },
    ],
  },
  {
    id: "q6",
    text: "If an RBT is asked to work outside their scope, the best response is to:",
    topic: "professional_conduct",
    difficulty: "advanced",
    correct_answer: "A",
    explanation:
      "RBTs should stay within their role and consult the supervisor when asked to do something outside their competence or authorization.",
    options: [
      { label: "A", text: "Contact the supervisor for guidance" },
      { label: "B", text: "Guess and do the task anyway" },
      { label: "C", text: "Ignore the request silently" },
      { label: "D", text: "Change the treatment plan independently" },
    ],
  },
];

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

function writeLocalJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function buildQuestionSet(sourceQuestions) {
  const pool =
    Array.isArray(sourceQuestions) && sourceQuestions.length > 0
      ? sourceQuestions
      : baseQuestionBank;

  return Array.from({ length: TOTAL_QUESTIONS }, (_, index) => {
    const question = pool[index % pool.length];

    return {
      ...question,
      id: `${question.id}_mock_${index + 1}`,
      original_id: question.id,
    };
  });
}

async function loadMockExamQuestions() {
  const storedQuestions = readLocalJson(QUESTIONS_STORAGE_KEY, baseQuestionBank);
  return buildQuestionSet(storedQuestions);
}

async function saveMockExamResult(result) {
  const current = readLocalJson(EXAMS_STORAGE_KEY, []);
  const next = [
    {
      id: `mock_exam_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      created_at: new Date().toISOString(),
      ...result,
    },
    ...current,
  ];

  writeLocalJson(EXAMS_STORAGE_KEY, next);
  return next;
}

export default function MockExams() {
  const [examState, setExamState] = useState("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [examResult, setExamResult] = useState(null);
  const queryClient = useQueryClient();
  const finishExamRef = useRef(null);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["mock-exam-questions"],
    queryFn: loadMockExamQuestions,
    enabled: examState === "in_progress",
  });

  const saveMutation = useMutation({
    mutationFn: saveMockExamResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
    },
  });

  const handleStartExam = () => {
    setExamState("in_progress");
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setExamResult(null);
  };

  const handleFinishExam = useCallback(() => {
    const correct = Object.entries(answers).filter(([questionId, answer]) => {
      const question = questions.find((item) => item.id === questionId);
      return question && answer === question.correct_answer;
    }).length;

    const score =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const passed = score >= PASS_SCORE;

    const domainScores = {};
    Object.keys(topicLabels).forEach((key) => {
      const topicQuestions = questions.filter((question) => question.topic === key);
      const topicCorrect = topicQuestions.filter(
        (question) => answers[question.id] === question.correct_answer,
      ).length;

      domainScores[key] =
        topicQuestions.length > 0
          ? Math.round((topicCorrect / topicQuestions.length) * 100)
          : 0;
    });

    const result = {
      score,
      total_questions: questions.length,
      correct_answers: correct,
      time_taken_minutes: EXAM_DURATION_MINUTES - Math.floor(timeLeft / 60),
      status: "completed",
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct:
          questions.find((question) => question.id === questionId)?.correct_answer ===
          selectedAnswer,
      })),
      passed,
      domain_scores: domainScores,
    };

    setExamResult(result);
    setExamState("completed");
    saveMutation.mutate(result);
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

  if (examState === "idle") {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-emerald-50 dark:bg-emerald-950/35">
            <ClipboardCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 sm:text-4xl">
            Mock RBT Exam
          </h1>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            Simulate the real BACB RBT certification exam.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-[#0A0A0B] p-5 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.85)] dark:border-slate-800 sm:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[1.35rem] bg-white/14 p-5 text-center backdrop-blur-sm">
              <p className="text-4xl font-black text-white">
                {TOTAL_QUESTIONS}
              </p>
              <p className="mt-2 text-base text-white/55">Questions</p>
            </div>
            <div className="rounded-[1.35rem] bg-white/14 p-5 text-center backdrop-blur-sm">
              <p className="text-4xl font-black text-white">
                {EXAM_DURATION_MINUTES}m
              </p>
              <p className="mt-2 text-base text-white/55">Time Limit</p>
            </div>
            <div className="rounded-[1.35rem] bg-white/14 p-5 text-center backdrop-blur-sm">
              <p className="text-4xl font-black text-white">{PASS_SCORE}%</p>
              <p className="mt-2 text-base text-white/55">Pass Score</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4 rounded-[1.35rem] border border-[#F4D35E] bg-[#FFF8E6] px-5 py-4">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#F59E0B]" />
            <div>
              <p className="text-xl font-bold text-[#9A4D12]">
                Exam Instructions
              </p>
              <ul className="mt-2.5 space-y-1.5 text-base text-[#C25D12]">
                <li>• Answer all questions within the time limit</li>
                <li>• You can navigate between questions freely</li>
                <li>• Results are shown after submission</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleStartExam}
            className="mt-6 h-14 w-full gap-3 rounded-[1.2rem] border-0 text-xl font-semibold text-white shadow-[0_0_28px_rgba(16,185,129,0.42)] hover:bg-emerald-700"
            style={{ backgroundColor: "#0F9D6C" }}
          >
            <ClipboardCheck className="h-5 w-5" />
            Begin Mock Exam
          </Button>
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
            {examResult.passed ? "Congratulations!" : "Keep Practicing"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {examResult.passed
              ? "You passed the mock exam!"
              : "You need more preparation."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6">
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
            Domain Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(examResult.domain_scores || {}).map(([key, value]) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {topicLabels[key]}
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
            className="flex-1 rounded-xl"
            onClick={() => setExamState("idle")}
          >
            Back to Exams
          </Button>
          <Button
            className="flex-1 rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
            onClick={handleStartExam}
          >
            Retake Exam
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || questions.length === 0 || !currentQuestion) {
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
      <div className="sticky top-20 z-30 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1}/{questions.length}
          </Badge>
          <span className="text-sm text-slate-500">
            {Object.keys(answers).length} answered
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
            Finish Exam
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <p className="mb-6 text-base font-medium leading-relaxed text-slate-900">
          {currentQuestion.text}
        </p>
        <div className="space-y-3">
          {(currentQuestion.options || []).map((option) => {
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
                  "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[#1E5EFF] bg-[#1E5EFF]/5"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    isSelected
                      ? "bg-[#1E5EFF] text-white"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {option.label}
                </span>
                <span className="text-sm text-slate-900">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((current) => current - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          className="gap-2 rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
          disabled={currentIndex >= questions.length - 1}
          onClick={() => setCurrentIndex((current) => current + 1)}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
