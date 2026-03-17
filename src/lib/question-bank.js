export const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

const PRACTICE_BANK_COUNT = 10;

export const practiceBankOptions = Array.from(
  { length: PRACTICE_BANK_COUNT },
  (_, index) => {
    const bankNumber = index + 1;
    const padded = String(bankNumber).padStart(2, "0");

    return {
      id: `bank-${padded}`,
      label: `Bank ${padded}`,
    };
  },
);

export const baseQuestions = [
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

const practiceScenarioPrefixes = [
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

const practiceScenarioSuffixes = [
  "Choose the best response.",
  "Identify the most appropriate action.",
  "Select the option most aligned with RBT practice.",
  "Pick the answer that best matches ABA principles.",
  "Choose the response that protects treatment integrity.",
];

const flashcardScenarioPrefixes = [
  "During a clinic session,",
  "At the start of therapy,",
  "While collecting data,",
  "During a home visit,",
  "When reviewing behavior plans,",
  "In a school-based session,",
  "During skills training,",
  "While supporting a transition,",
  "During supervision follow-up,",
  "When documenting session notes,",
];

const flashcardScenarioSuffixes = [
  "Choose the best response.",
  "Pick the most appropriate action.",
  "Select the answer that best follows ABA principles.",
  "Choose the option most consistent with RBT practice.",
  "Pick the response that best supports treatment integrity.",
];

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seedValue) {
  let seed = hashString(String(seedValue)) || 1;

  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let result = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(items, random) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

function randomItem(items, random) {
  return items[Math.floor(random() * items.length)];
}

function getPracticeBankMeta(index) {
  const option = practiceBankOptions[index % practiceBankOptions.length];

  return {
    bank_id: option.id,
    bank_label: option.label,
    group_id: option.id,
    group_label: option.label,
  };
}

function remixOptions(options, correctAnswer, variantKey) {
  const random = createRandom(`options:${variantKey}`);
  const shuffled = shuffleWithRandom(options, random);
  const answerLabels = ["A", "B", "C", "D"];
  let nextCorrectAnswer = correctAnswer;

  const nextOptions = shuffled.map((option, index) => {
    const relabeledOption = {
      ...option,
      label: answerLabels[index],
    };

    if (option.label === correctAnswer) {
      nextCorrectAnswer = relabeledOption.label;
    }

    return relabeledOption;
  });

  return {
    options: nextOptions,
    correct_answer: nextCorrectAnswer,
  };
}

function buildQuestionVariant(
  seed,
  index,
  prefixes,
  suffixes,
  prefixId,
  metadata = {},
) {
  const variantKey = `${prefixId}:${seed.id}:${index + 1}`;
  const textRandom = createRandom(`text:${variantKey}`);
  const prefix = randomItem(prefixes, textRandom);
  const suffix = randomItem(suffixes, textRandom);
  const variantNumber = index + 1;
  const remixed = remixOptions(seed.options, seed.correct_answer, variantKey);

  return {
    ...seed,
    ...remixed,
    ...metadata,
    id: `${prefixId}_${seed.id}_${variantNumber}`,
    text: `${prefix} ${seed.text} ${suffix}`,
    original_id: seed.id,
  };
}

export function buildPracticeQuestionBank(size = 3000, seed = "practice-default") {
  const generatedQuestions = Array.from({ length: size }, (_, index) =>
    buildQuestionVariant(
      baseQuestions[index % baseQuestions.length],
      index,
      practiceScenarioPrefixes,
      practiceScenarioSuffixes,
      "practice",
      getPracticeBankMeta(index),
    ),
  );

  return shuffleWithRandom(generatedQuestions, createRandom(`practice-order:${seed}:${size}`));
}

export function buildFlashcardBank(size = 300, seed = "flashcards-default") {
  const generatedCards = Array.from({ length: size }, (_, index) =>
    buildQuestionVariant(
      baseQuestions[index % baseQuestions.length],
      index,
      flashcardScenarioPrefixes,
      flashcardScenarioSuffixes,
      "flashcard",
    ),
  );

  return shuffleWithRandom(generatedCards, createRandom(`flashcards-order:${seed}:${size}`));
}

export function buildMockExamQuestionSet(
  size = 85,
  sourceQuestions = null,
  seed = `mock-${Date.now()}`,
) {
  const pool =
    Array.isArray(sourceQuestions) && sourceQuestions.length > 0
      ? sourceQuestions
      : buildPracticeQuestionBank(3000, `${seed}:source`);

  const bankMap = new Map();

  pool.forEach((question) => {
    const bankId = question.bank_id || "bank-01";
    const bankQuestions = bankMap.get(bankId) || [];
    bankQuestions.push(question);
    bankMap.set(bankId, bankQuestions);
  });

  const bankIds = shuffleWithRandom([...bankMap.keys()], createRandom(`mock-banks:${seed}`));
  const shuffledBanks = new Map(
    [...bankMap.entries()].map(([bankId, bankQuestions]) => [
      bankId,
      shuffleWithRandom(bankQuestions, createRandom(`mock-bank:${seed}:${bankId}`)),
    ]),
  );

  const selectedQuestions = [];
  let cursor = 0;

  while (selectedQuestions.length < size && bankIds.length > 0) {
    const bankId = bankIds[cursor % bankIds.length];
    const bankQuestions = shuffledBanks.get(bankId) || [];

    if (bankQuestions.length > 0) {
      selectedQuestions.push(bankQuestions.shift());
      shuffledBanks.set(bankId, bankQuestions);
    }

    if (shuffledBanks.get(bankId)?.length === 0) {
      const bankIndex = bankIds.indexOf(bankId);
      if (bankIndex >= 0) {
        bankIds.splice(bankIndex, 1);
      }
      cursor = 0;
      continue;
    }

    cursor += 1;
  }

  return selectedQuestions.map((question, index) => ({
    ...question,
    id: `${question.id}_mock_${index + 1}`,
    original_id: question.original_id || question.id,
  }));
}
