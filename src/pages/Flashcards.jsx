import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Filter,
  RotateCcw,
  Shuffle,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QUESTIONS_STORAGE_KEY = "rbt_genius_questions";
const ATTEMPTS_STORAGE_KEY = "rbt_genius_question_attempts";

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

async function loadQuestions() {
  const questions = readLocalJson(QUESTIONS_STORAGE_KEY, fallbackQuestions);
  return Array.isArray(questions) && questions.length > 0
    ? questions
    : fallbackQuestions;
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

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [filterTopic, setFilterTopic] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const queryClient = useQueryClient();

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ["flashcard-questions"],
    queryFn: loadQuestions,
    initialData: [],
  });

  const attemptMutation = useMutation({
    mutationFn: storeAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-data"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
  });

  const filteredQuestions = useMemo(
    () =>
      allQuestions.filter((question) => {
        const topicMatch = filterTopic === "all" || question.topic === filterTopic;
        const difficultyMatch =
          filterDifficulty === "all" || question.difficulty === filterDifficulty;

        return topicMatch && difficultyMatch && !masteredCards.includes(question.id);
      }),
    [allQuestions, filterDifficulty, filterTopic, masteredCards],
  );

  const currentCard = filteredQuestions[currentIndex] || null;

  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
      return;
    }

    if (currentIndex > filteredQuestions.length - 1) {
      setCurrentIndex(0);
    }

    setIsFlipped(false);
  }, [currentIndex, filteredQuestions.length]);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((current) =>
      filteredQuestions.length > 0 && current < filteredQuestions.length - 1
        ? current + 1
        : 0,
    );
  };

  const handleMastered = async () => {
    if (!currentCard) {
      return;
    }

    setMasteredCards((current) => [...current, currentCard.id]);
    setSessionStats((current) => ({
      ...current,
      correct: current.correct + 1,
    }));

    await attemptMutation.mutateAsync({
      question_id: currentCard.id,
      selected_answer: currentCard.correct_answer,
      is_correct: true,
      topic: currentCard.topic,
    });

    nextCard();
  };

  const handleNeedReview = async () => {
    if (!currentCard) {
      return;
    }

    setReviewCards((current) =>
      current.includes(currentCard.id) ? current : [...current, currentCard.id],
    );
    setSessionStats((current) => ({
      ...current,
      incorrect: current.incorrect + 1,
    }));

    await attemptMutation.mutateAsync({
      question_id: currentCard.id,
      selected_answer: "",
      is_correct: false,
      topic: currentCard.topic,
    });

    nextCard();
  };

  const handleShuffle = () => {
    if (filteredQuestions.length === 0) {
      return;
    }

    setCurrentIndex(Math.floor(Math.random() * filteredQuestions.length));
    setIsFlipped(false);
  };

  const handleReset = () => {
    setMasteredCards([]);
    setReviewCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const progress =
    allQuestions.length > 0 ? (masteredCards.length / allQuestions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1E5EFF] border-t-transparent" />
          <p className="text-slate-500">Cargando flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Flashcards Game 🎴
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Repasa conceptos del RBT con tarjetas interactivas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleShuffle} variant="outline" className="gap-2">
            <Shuffle className="h-4 w-4" />
            Mezclar
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Total Tarjetas</p>
              <p className="text-2xl font-bold text-slate-900">
                {allQuestions.length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-[#1E5EFF]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Dominadas</p>
              <p className="text-2xl font-bold text-emerald-600">
                {masteredCards.length}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Sesión Actual</p>
              <p className="text-2xl font-bold text-[#1E5EFF]">
                {sessionStats.correct}
              </p>
            </div>
            <ThumbsUp className="h-8 w-8 text-[#1E5EFF]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Para Revisar</p>
              <p className="text-2xl font-bold text-amber-600">
                {reviewCards.length}
              </p>
            </div>
            <ThumbsDown className="h-8 w-8 text-amber-600" />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Progreso Total
          </span>
          <span className="text-sm font-bold text-[#1E5EFF]">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filtros:</span>
          </div>

          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los temas</SelectItem>
              <SelectItem value="measurement">Measurement</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="skill_acquisition">Skill Acquisition</SelectItem>
              <SelectItem value="behavior_reduction">Behavior Reduction</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="professional_conduct">
                Professional Conduct
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dificultad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {currentCard ? (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Tarjeta {currentIndex + 1} de {filteredQuestions.length}
              </Badge>
              <div className="flex gap-2">
                <Badge className="bg-[#1E5EFF]/10 text-[#1E5EFF]">
                  {currentCard.topic.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline">{currentCard.difficulty}</Badge>
              </div>
            </div>

            <div
              className="relative h-[520px] cursor-pointer [perspective:1000px] sm:h-[560px]"
              onClick={() => setIsFlipped((current) => !current)}
            >
              <div
                className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <Card className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1E5EFF] to-[#6366F1] p-8 text-white [backface-visibility:hidden]">
                  <div className="text-center">
                    <p className="mb-4 text-xs uppercase tracking-wider opacity-80">
                      Pregunta
                    </p>
                    <h2 className="text-2xl font-bold leading-relaxed">
                      {currentCard.text}
                    </h2>
                    <p className="mt-8 text-xs opacity-60">
                      Click para ver la respuesta
                    </p>
                  </div>
                </Card>

                <Card
                  className="absolute inset-0 overflow-hidden border-2 border-[#1E5EFF] bg-white p-8 [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="flex h-full flex-col justify-between overflow-y-auto pr-1">
                    <div>
                      <p className="mb-4 text-xs uppercase tracking-wider text-[#1E5EFF]">
                        Respuesta Correcta
                      </p>
                      <div className="mb-6 space-y-3">
                        {currentCard.options?.map((option) => (
                          <div
                            key={option.label}
                            className={`rounded-lg p-3 ${
                              option.label === currentCard.correct_answer
                                ? "border-2 border-emerald-500 bg-emerald-50"
                                : "bg-slate-50 opacity-50"
                            }`}
                          >
                            <span className="font-semibold">{option.label}.</span>{" "}
                            {option.text}
                          </div>
                        ))}
                      </div>

                      {currentCard.explanation ? (
                        <div className="rounded-lg bg-blue-50 p-4">
                          <p className="mb-1 text-xs font-semibold text-[#1E5EFF]">
                            Explicación:
                          </p>
                          <p className="text-sm text-slate-700">
                            {currentCard.explanation}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                onClick={handleNeedReview}
                variant="outline"
                size="lg"
                className="gap-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
              >
                <ThumbsDown className="h-5 w-5 text-amber-600" />
                Necesito Repasar
              </Button>
              <Button
                onClick={handleMastered}
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <ThumbsUp className="h-5 w-5" />
                ¡La Domino!
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-[#FFB800]" />
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            ¡Felicidades!
          </h2>
          <p className="mb-6 text-slate-600">
            Has completado todas las tarjetas con estos filtros.
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
          >
            Comenzar Nueva Sesión
          </Button>
        </Card>
      )}
    </div>
  );
}
