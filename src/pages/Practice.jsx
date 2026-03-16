import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Flag,
  HelpCircle,
  ListChecks,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import QuestionCard from "@/components/practice/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const QUESTIONS_STORAGE_KEY = "rbt_genius_questions";
const ATTEMPTS_STORAGE_KEY = "rbt_genius_question_attempts";
const PRACTICE_SESSION_STORAGE_KEY = "rbt_genius_practice_session";

const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

const PRACTICE_BANK_SIZE = 500;

const fallbackQuestions = [
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

const scenarioPrefixes = [
  "During a clinic session,",
  "During home-based therapy,",
  "While collecting data,",
  "When supporting a skill acquisition program,",
  "During supervision review,",
  "In a community outing,",
  "While implementing the treatment plan,",
  "At the start of session,",
  "During a transition between activities,",
  "While preparing session notes,",
];

const scenarioSuffixes = [
  "Choose the best response.",
  "Identify the most appropriate action.",
  "Select the option most aligned with RBT practice.",
  "Pick the answer that best matches ABA principles.",
  "Choose the response that protects treatment integrity.",
];

const reviewFilters = [
  { id: "all", label: "All" },
  { id: "incorrect", label: "Incorrect" },
  { id: "flagged", label: "Flagged" },
  { id: "unanswered", label: "Unanswered" },
];

function buildPracticeQuestionBank(size = PRACTICE_BANK_SIZE) {
  return Array.from({ length: size }, (_, index) => {
    const seed = fallbackQuestions[index % fallbackQuestions.length];
    const prefix = scenarioPrefixes[index % scenarioPrefixes.length];
    const suffix = scenarioSuffixes[index % scenarioSuffixes.length];
    const topicLabel =
      topicLabels[seed.topic] || seed.topic.replace(/_/g, " ");
    const variantNumber = index + 1;

    return {
      ...seed,
      id: `practice_${seed.id}_${variantNumber}`,
      text: `${prefix} (${topicLabel} set ${variantNumber}) ${seed.text} ${suffix}`,
      original_id: seed.id,
    };
  });
}

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

function removeLocalItem(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

function loadSavedPracticeSession() {
  return readLocalJson(PRACTICE_SESSION_STORAGE_KEY, null);
}

function getResponseState(questionId, responses) {
  return responses?.[questionId] || {};
}

function matchesReviewFilter(question, responses, reviewFilter) {
  if (reviewFilter === "all") {
    return true;
  }

  const state = getResponseState(question.id, responses);
  const isAnswered = Boolean(state.submitted);
  const isIncorrect = isAnswered && !state.isCorrect;
  const isFlagged = Boolean(state.flagged);

  if (reviewFilter === "incorrect") {
    return isIncorrect;
  }

  if (reviewFilter === "flagged") {
    return isFlagged;
  }

  if (reviewFilter === "unanswered") {
    return !isAnswered;
  }

  return true;
}

async function loadPracticeQuestions() {
  const generatedFallbackQuestions = buildPracticeQuestionBank();
  const questions = readLocalJson(QUESTIONS_STORAGE_KEY, generatedFallbackQuestions);

  if (Array.isArray(questions) && questions.length >= PRACTICE_BANK_SIZE) {
    return questions;
  }

  writeLocalJson(QUESTIONS_STORAGE_KEY, generatedFallbackQuestions);
  return generatedFallbackQuestions;
}

async function storeAttempt(attempt) {
  const currentAttempts = readLocalJson(ATTEMPTS_STORAGE_KEY, []);
  const nextAttempts = [
    {
      id: `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      created_at: new Date().toISOString(),
      ...attempt,
    },
    ...currentAttempts,
  ];

  writeLocalJson(ATTEMPTS_STORAGE_KEY, nextAttempts);
  return nextAttempts;
}

function QuestionNavigator({
  open,
  onOpenChange,
  questions,
  responses,
  currentQuestionId,
  onSelectQuestion,
}) {
  const answeredCount = questions.filter(
    (question) => getResponseState(question.id, responses).submitted,
  ).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Question Navigator</SheetTitle>
          <SheetDescription>
            Jump to any question and review your flagged or unanswered items.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                {questions.length}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-emerald-700">Answered</p>
              <p className="mt-1 text-lg font-semibold text-emerald-800">
                {answeredCount}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-amber-700">Flagged</p>
              <p className="mt-1 text-lg font-semibold text-amber-800">
                {
                  questions.filter(
                    (question) => getResponseState(question.id, responses).flagged,
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const state = getResponseState(question.id, responses);
              const isCurrent = currentQuestionId === question.id;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(question.id);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "relative rounded-xl border px-0 py-2 text-sm font-semibold transition-colors",
                    isCurrent && "border-[#1E5EFF] bg-[#1E5EFF]/10 text-[#1E5EFF]",
                    !isCurrent &&
                      state.submitted &&
                      state.isCorrect &&
                      "border-emerald-200 bg-emerald-50 text-emerald-700",
                    !isCurrent &&
                      state.submitted &&
                      !state.isCorrect &&
                      "border-red-200 bg-red-50 text-red-700",
                    !isCurrent &&
                      !state.submitted &&
                      "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900",
                  )}
                >
                  {index + 1}
                  {state.flagged ? (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Practice() {
  const savedSession = loadSavedPracticeSession();
  const [topicFilter, setTopicFilter] = useState(
    () => savedSession?.topicFilter || "all",
  );
  const [difficultyFilter, setDifficultyFilter] = useState(
    () => savedSession?.difficultyFilter || "all",
  );
  const [reviewFilter, setReviewFilter] = useState(
    () => savedSession?.reviewFilter || "all",
  );
  const [currentQuestionId, setCurrentQuestionId] = useState(
    () => savedSession?.currentQuestionId || null,
  );
  const [responses, setResponses] = useState(() => savedSession?.responses || {});
  const [started, setStarted] = useState(() => Boolean(savedSession?.started));
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ["practice-questions"],
    queryFn: loadPracticeQuestions,
    initialData: [],
    enabled: started,
  });

  const attemptMutation = useMutation({
    mutationFn: storeAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
  });

  const baseFilteredQuestions = useMemo(
    () =>
      allQuestions.filter((question) => {
        const topicMatch =
          topicFilter === "all" || question.topic === topicFilter;
        const difficultyMatch =
          difficultyFilter === "all" || question.difficulty === difficultyFilter;

        return topicMatch && difficultyMatch;
      }),
    [allQuestions, difficultyFilter, topicFilter],
  );

  const questions = useMemo(
    () =>
      baseFilteredQuestions.filter(
        (question) =>
          question.id === currentQuestionId ||
          matchesReviewFilter(question, responses, reviewFilter),
      ),
    [baseFilteredQuestions, currentQuestionId, responses, reviewFilter],
  );

  const currentQuestion =
    questions.find((question) => question.id === currentQuestionId) || questions[0] || null;
  const currentIndex = currentQuestion
    ? questions.findIndex((question) => question.id === currentQuestion.id)
    : 0;

  const answeredCount = baseFilteredQuestions.filter(
    (question) => getResponseState(question.id, responses).submitted,
  ).length;
  const correctCount = baseFilteredQuestions.filter((question) => {
    const state = getResponseState(question.id, responses);
    return state.submitted && state.isCorrect;
  }).length;
  const flaggedCount = baseFilteredQuestions.filter(
    (question) => getResponseState(question.id, responses).flagged,
  ).length;
  const incorrectCount = baseFilteredQuestions.filter((question) => {
    const state = getResponseState(question.id, responses);
    return state.submitted && !state.isCorrect;
  }).length;
  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const isComplete =
    started &&
    baseFilteredQuestions.length > 0 &&
    answeredCount >= baseFilteredQuestions.length;

  useEffect(() => {
    if (!started) {
      return;
    }

    writeLocalJson(PRACTICE_SESSION_STORAGE_KEY, {
      started,
      topicFilter,
      difficultyFilter,
      reviewFilter,
      currentQuestionId,
      responses,
    });
  }, [
    currentQuestionId,
    difficultyFilter,
    responses,
    reviewFilter,
    started,
    topicFilter,
  ]);

  useEffect(() => {
    if (!started || questions.length === 0) {
      return;
    }

    if (!currentQuestionId || !questions.some((question) => question.id === currentQuestionId)) {
      setCurrentQuestionId(questions[0].id);
    }
  }, [currentQuestionId, questions, started]);

  const resetSessionState = () => {
    setResponses({});
    setCurrentQuestionId(null);
    setReviewFilter("all");
    removeLocalItem(PRACTICE_SESSION_STORAGE_KEY);
  };

  const startSession = () => {
    resetSessionState();
    setStarted(true);
  };

  const endSession = () => {
    resetSessionState();
    setStarted(false);
  };

  const handleSelectAnswer = (answer) => {
    if (!currentQuestion) {
      return;
    }

    setResponses((current) => ({
      ...current,
      [currentQuestion.id]: {
        ...current[currentQuestion.id],
        selectedAnswer: answer,
      },
    }));
  };

  const handleAnswer = async (answer, isCorrect) => {
    if (!currentQuestion) {
      return;
    }

    setResponses((current) => ({
      ...current,
      [currentQuestion.id]: {
        ...current[currentQuestion.id],
        selectedAnswer: answer,
        submitted: true,
        isCorrect,
      },
    }));

    await attemptMutation.mutateAsync({
      question_id: currentQuestion.id,
      selected_answer: answer,
      is_correct: isCorrect,
      topic: currentQuestion.topic,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionId(questions[currentIndex + 1].id);
      return;
    }

    if (questions.length > 0) {
      setCurrentQuestionId(questions[0].id);
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) {
      return;
    }

    setResponses((current) => ({
      ...current,
      [currentQuestion.id]: {
        ...current[currentQuestion.id],
        flagged: !current[currentQuestion.id]?.flagged,
      },
    }));
  };

  const currentResponse = currentQuestion
    ? getResponseState(currentQuestion.id, responses)
    : {};

  if (!started) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E5EFF]/8">
            <HelpCircle className="h-8 w-8 text-[#1E5EFF]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Practice Questions
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Choose your topic and difficulty to start practicing.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Topic
              </label>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {Object.entries(topicLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Difficulty
              </label>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E5EFF]/10 bg-[#1E5EFF]/5 p-4 text-sm text-slate-700 dark:text-slate-200">
            The local bank is ready with up to {PRACTICE_BANK_SIZE} practice questions.
          </div>

          <Button
            onClick={startSession}
            className="w-full gap-2 rounded-xl py-6 text-base shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90"
            style={{ backgroundColor: "#1E5EFF" }}
          >
            <Zap className="h-5 w-5" />
            Start Practice Session
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto mb-4 h-6 w-1/2 rounded bg-slate-100" />
          <div className="mx-auto h-4 w-1/3 rounded bg-slate-50" />
        </div>
      </div>
    );
  }

  if (baseFilteredQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-12 dark:border-slate-800 dark:bg-slate-950">
          <HelpCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="font-medium text-slate-500 dark:text-slate-400">
            No questions available for this filter
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={endSession}
          >
            Change Filters
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-12 dark:border-slate-800 dark:bg-slate-950">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-[#FFB800]" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Session Complete!
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            You answered {correctCount} out of {answeredCount} correctly.
          </p>
          <div
            className="mt-4 text-5xl font-bold"
            style={{
              color:
                accuracy >= 80 ? "#10B981" : accuracy >= 60 ? "#FFB800" : "#EF4444",
            }}
          >
            {accuracy}%
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">{flaggedCount} flagged</Badge>
            <Badge variant="outline">{incorrectCount} incorrect</Badge>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" className="rounded-xl" onClick={endSession}>
              New Session
            </Button>
            <Button
              className="rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
              onClick={() => {
                setResponses({});
                setCurrentQuestionId(baseFilteredQuestions[0]?.id || null);
                setReviewFilter("all");
              }}
            >
              Retry Same Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-12 dark:border-slate-800 dark:bg-slate-950">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            No questions match the current review filter.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try switching back to all questions or another review state.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setReviewFilter("all")}
            >
              Show All
            </Button>
            <Button className="rounded-xl" onClick={() => setNavigatorOpen(true)}>
              Open Navigator
            </Button>
          </div>
        </div>
        <QuestionNavigator
          open={navigatorOpen}
          onOpenChange={setNavigatorOpen}
          questions={baseFilteredQuestions}
          responses={responses}
          currentQuestionId={currentQuestionId}
          onSelectQuestion={setCurrentQuestionId}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#1E5EFF]" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {accuracy}% accuracy
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {answeredCount}/{baseFilteredQuestions.length} answered
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {flaggedCount} flagged
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setNavigatorOpen(true)}
            >
              <ListChecks className="h-4 w-4" />
              Navigator
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs text-slate-400 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              onClick={endSession}
            >
              End Session
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {reviewFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setReviewFilter(filter.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                reviewFilter === filter.id
                  ? "border-[#1E5EFF] bg-[#1E5EFF]/10 text-[#1E5EFF]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
        <div
          className="h-full rounded-full bg-[#1E5EFF] transition-all duration-500"
          style={{
            width: `${(answeredCount / baseFilteredQuestions.length) * 100}%`,
          }}
        />
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={currentResponse.selectedAnswer || null}
        isSubmitted={Boolean(currentResponse.submitted)}
        isFlagged={Boolean(currentResponse.flagged)}
        onSelectAnswer={handleSelectAnswer}
        onToggleFlag={handleToggleFlag}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />

      <QuestionNavigator
        open={navigatorOpen}
        onOpenChange={setNavigatorOpen}
        questions={baseFilteredQuestions}
        responses={responses}
        currentQuestionId={currentQuestionId}
        onSelectQuestion={setCurrentQuestionId}
      />
    </div>
  );
}
