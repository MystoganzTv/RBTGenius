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
import { api } from "@/lib/api";
import { topicLabels } from "@/lib/question-bank";
import { cn } from "@/lib/utils";

const reviewFilters = [
  { id: "all", label: "All" },
  { id: "incorrect", label: "Incorrect" },
  { id: "flagged", label: "Flagged" },
  { id: "unanswered", label: "Unanswered" },
];

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
  return api.listQuestions({ mode: "practice" });
}

async function storeAttempt(attempt) {
  return api.createAttempt(attempt);
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
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [responses, setResponses] = useState({});
  const [started, setStarted] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [sessionHydrated, setSessionHydrated] = useState(false);
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

  const { data: savedSession } = useQuery({
    queryKey: ["practice-session"],
    queryFn: api.getPracticeSession,
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
    if (sessionHydrated) {
      return;
    }

    if (savedSession) {
      setTopicFilter(savedSession.topicFilter || "all");
      setDifficultyFilter(savedSession.difficultyFilter || "all");
      setReviewFilter(savedSession.reviewFilter || "all");
      setCurrentQuestionId(savedSession.currentQuestionId || null);
      setResponses(savedSession.responses || {});
      setStarted(Boolean(savedSession.started));
    }

    setSessionHydrated(true);
  }, [savedSession, sessionHydrated]);

  useEffect(() => {
    if (!sessionHydrated || !started) {
      return;
    }

    api.savePracticeSession({
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
    sessionHydrated,
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
    queryClient.setQueryData(["practice-session"], null);
    api.clearPracticeSession();
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
            Your practice session now runs against the server-backed question bank.
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
