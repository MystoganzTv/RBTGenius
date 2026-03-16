import { ArrowRight, CheckCircle2, Flag, Lightbulb, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer = null,
  isSubmitted = false,
  isFlagged = false,
  onSelectAnswer,
  onAnswer,
  onNext,
  onToggleFlag,
}) {
  const handleSubmit = () => {
    if (!selectedAnswer) {
      return;
    }

    onAnswer?.(selectedAnswer, selectedAnswer === question.correct_answer);
  };

  const handleNext = () => {
    onNext?.();
  };

  const isCorrect = selectedAnswer === question?.correct_answer;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge
            variant="secondary"
            className="border border-[#1E5EFF]/10 bg-[#1E5EFF]/5 text-[10px] text-[#1E5EFF]"
          >
            {topicLabels[question?.topic] || question?.topic}
          </Badge>
          {question?.bacb_concept ? (
            <Badge variant="secondary" className="text-[10px]">
              {question.bacb_concept}
            </Badge>
          ) : null}
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "text-[10px]",
            question?.difficulty === "beginner"
              ? "bg-green-50 text-green-700"
              : question?.difficulty === "intermediate"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700",
          )}
        >
          {question?.difficulty}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "ml-2 rounded-xl px-2.5 text-xs",
            isFlagged
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "text-slate-500 hover:bg-slate-100",
          )}
          onClick={onToggleFlag}
        >
          <Flag className={cn("h-3.5 w-3.5", isFlagged && "fill-current")} />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      <div className="p-6">
        <p className="mb-6 text-base font-medium leading-relaxed text-slate-900">
          {question?.text}
        </p>

        <div className="space-y-3">
          {(question?.options || []).map((option) => {
            const isThis = selectedAnswer === option.label;
            const isCorrectAnswer = option.label === question?.correct_answer;
            let optionStyle =
              "border-slate-200 hover:border-[#1E5EFF]/30 hover:bg-[#1E5EFF]/3";

            if (isSubmitted) {
              if (isCorrectAnswer) {
                optionStyle = "border-emerald-400 bg-emerald-50";
              } else if (isThis && !isCorrect) {
                optionStyle = "border-red-400 bg-red-50";
              } else {
                optionStyle = "border-slate-100 opacity-60";
              }
            } else if (isThis) {
              optionStyle =
                "border-[#1E5EFF] bg-[#1E5EFF]/5 shadow-sm shadow-[#1E5EFF]/10";
            }

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => !isSubmitted && onSelectAnswer?.(option.label)}
                disabled={isSubmitted}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
                  optionStyle,
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    isSubmitted && isCorrectAnswer
                      ? "bg-emerald-500 text-white"
                      : isSubmitted && isThis && !isCorrect
                        ? "bg-red-500 text-white"
                        : isThis
                          ? "bg-[#1E5EFF] text-white"
                          : "bg-slate-100 text-slate-500",
                  )}
                >
                  {isSubmitted && isCorrectAnswer ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isSubmitted && isThis && !isCorrect ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    option.label
                  )}
                </span>
                <span className="text-sm text-slate-900">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-4">
            {question?.explanation ? (
              <div className="rounded-xl border border-[#1E5EFF]/10 bg-[#1E5EFF]/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#FFB800]" />
                  <span className="text-xs font-semibold text-[#1E5EFF]">
                    Explanation
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {question.explanation}
                </p>
              </div>
            ) : null}

            <Button
              onClick={handleNext}
              className="w-full gap-2 rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
            >
              Next Question <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
