import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Target, Trophy, Zap } from "lucide-react";
import QuestionCard from "@/components/practice/QuestionCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QUESTIONS_STORAGE_KEY = "rbt_genius_questions";
const ATTEMPTS_STORAGE_KEY = "rbt_genius_question_attempts";

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

export default function Practice() {
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [started, setStarted] = useState(false);
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

  const questions = allQuestions.filter((question) => {
    const topicMatch = topicFilter === "all" || question.topic === topicFilter;
    const difficultyMatch =
      difficultyFilter === "all" || question.difficulty === difficultyFilter;
    return topicMatch && difficultyMatch;
  });

  const handleAnswer = async (answer, isCorrect) => {
    const question = questions[currentIndex];

    setSessionStats((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    }));

    await attemptMutation.mutateAsync({
      question_id: question.id,
      selected_answer: answer,
      is_correct: isCorrect,
      topic: question.topic,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
    }
  };

  const startSession = () => {
    setStarted(true);
    setCurrentIndex(0);
    setSessionStats({ correct: 0, total: 0 });
  };

  const accuracy =
    sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;
  const isComplete =
    started && currentIndex >= questions.length - 1 && sessionStats.total > 0;

  if (!started) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E5EFF]/8">
            <HelpCircle className="h-8 w-8 text-[#1E5EFF]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Practice Questions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose your topic and difficulty to start practicing.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
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
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
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
        <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-12 text-center">
          <div className="mx-auto mb-4 h-6 w-1/2 rounded bg-slate-100" />
          <div className="mx-auto h-4 w-1/3 rounded bg-slate-50" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-12">
          <HelpCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="font-medium text-slate-500">
            No questions available for this filter
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => setStarted(false)}
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
        <div className="rounded-2xl border border-slate-100 bg-white p-12">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-[#FFB800]" />
          <h2 className="text-2xl font-bold text-slate-900">
            Session Complete!
          </h2>
          <p className="mt-2 text-slate-500">
            You answered {sessionStats.correct} out of {sessionStats.total} correctly.
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
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setStarted(false)}
            >
              New Session
            </Button>
            <Button
              className="rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
              onClick={() => {
                setCurrentIndex(0);
                setSessionStats({ correct: 0, total: 0 });
              }}
            >
              Retry Same Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4 text-[#1E5EFF]" />
            <span className="text-sm font-medium text-slate-600">
              {accuracy}% accuracy
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">
              {sessionStats.total}/{questions.length}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs text-slate-400"
          onClick={() => setStarted(false)}
        >
          End Session
        </Button>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#1E5EFF] transition-all duration-500"
          style={{ width: `${(sessionStats.total / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        key={questions[currentIndex]?.id}
        question={questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
