/**
 * questionService.js
 * Adapter between the raw question bank and the mobile UI.
 * Keeps App.tsx clean — all bank imports are isolated here.
 */

import {
  buildFlashcardBank,
  buildMockExamQuestionSet,
  buildPracticeQuestionBank,
  evaluateQuestionAnswer,
  OFFICIAL_CONCEPT_COUNT,
  PRACTICE_BATCH_SIZE,
  topicLabels,
  TOTAL_PRACTICE_QUESTIONS,
} from '../lib/question-bank.js';

// ─── Re-exports used by the UI ────────────────────────────────────────────────
export { OFFICIAL_CONCEPT_COUNT, TOTAL_PRACTICE_QUESTIONS, topicLabels };

// ─── Constants ────────────────────────────────────────────────────────────────
/** Maps internal topic keys → display labels for domain filter pills */
export const TOPIC_KEYS = Object.keys(topicLabels);

/** Ordered list of topic objects for domain stats / filter pills */
export const TOPICS = TOPIC_KEYS.map((key) => ({
  key,
  label: topicLabels[key],
}));

// ─── Format helpers ───────────────────────────────────────────────────────────

/**
 * Converts a raw bank question into the shape the mobile UI expects.
 * Raw:  { text, options:[{label,text}], correct_answer:"B", difficulty, topic, explanation }
 * UI:   { id, prompt, options:[string], correctIndex, difficulty, topic, topicLabel, explanation }
 */
export function adaptQuestion(q) {
  const optionTexts = q.options.map((o) => o.text);
  const correctIndex = q.options.findIndex((o) => o.label === q.correct_answer);
  return {
    id: q.id,
    concept_id: q.concept_id,
    prompt: q.text,
    options: optionTexts,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    correct_answer: q.correct_answer,
    difficulty: capitalizeDifficulty(q.difficulty),
    topic: q.topic,
    topicLabel: topicLabels[q.topic] ?? q.topic,
    task_list_code: q.task_list_code ?? null,
    task_list_section: q.task_list_section ?? null,
    explanation: q.explanation ?? '',
    timeEstimate: q.difficulty === 'advanced' ? 3 : q.difficulty === 'intermediate' ? 2 : 1,
  };
}

function capitalizeDifficulty(d) {
  if (!d) return 'Medium';
  const map = { beginner: 'Easy', intermediate: 'Medium', advanced: 'Hard' };
  return map[d] ?? d;
}

// ─── Practice ─────────────────────────────────────────────────────────────────

let _practiceCache = null;

/**
 * Returns the full adapted practice question bank (lazy-loaded once).
 */
export function getPracticeBank() {
  if (!_practiceCache) {
    const raw = buildPracticeQuestionBank(TOTAL_PRACTICE_QUESTIONS);
    _practiceCache = raw.map(adaptQuestion);
  }
  return _practiceCache;
}

/**
 * Returns questions filtered by topic key.
 * If topic is null / undefined returns all questions.
 */
export function getPracticeByTopic(topicKey, limit = PRACTICE_BATCH_SIZE) {
  const all = getPracticeBank();
  const filtered = topicKey ? all.filter((q) => q.topic === topicKey) : all;
  return filtered.slice(0, limit);
}

// ─── Mock Exams ───────────────────────────────────────────────────────────────

/**
 * Builds a fresh mock exam question set.
 * @param {number} size  20 | 50 | 85
 */
export function getMockExamQuestions(size = 85) {
  const raw = buildMockExamQuestionSet(size);
  return raw.map(adaptQuestion);
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

let _flashcardCache = null;

/**
 * Returns adapted flashcard objects (lazy-loaded once).
 * Flashcards use the same structure as practice questions —
 * the "question" side shows the concept name / term,
 * the "answer" side shows the definition (first option == correct answer).
 */
export function getFlashcards(limit = 120) {
  if (!_flashcardCache) {
    const raw = buildFlashcardBank(limit);
    _flashcardCache = raw.map((q) => ({
      id: q.id,
      domain: topicLabels[q.topic] ?? q.topic,
      topic: q.topic,
      question: q.text,
      answer: q.options.find((o) => o.label === q.correct_answer)?.text ?? '',
      explanation: q.explanation ?? '',
    }));
  }
  return _flashcardCache;
}

// ─── Answer evaluation ────────────────────────────────────────────────────────

/**
 * Evaluates a selected answer letter ("A"–"D") for a given question ID.
 * Returns { is_correct, correct_answer, explanation }.
 */
export function checkAnswer(questionId, selectedLetter) {
  return evaluateQuestionAnswer(questionId, selectedLetter);
}

// ─── Domain stats (static weights — real per-user stats come from the API) ────

export const DOMAIN_ACCENT_MAP = {
  measurement: 'success',
  assessment: 'gold',
  skill_acquisition: 'primary',
  behavior_reduction: 'gold',
  documentation: 'success',
  professional_conduct: 'primary',
};

export const DOMAIN_STATUS_MAP = {
  measurement: { status: 'Exam Ready', recommendation: 'Keep sharp with mixed-review sets twice a week.' },
  assessment: { status: 'Almost There', recommendation: 'Review preference assessments and indirect measures.' },
  skill_acquisition: { status: 'Keep Studying', recommendation: 'Spend time on prompting, shaping and fading decisions.' },
  behavior_reduction: { status: 'Almost There', recommendation: 'Practice matching strategies to the function of behavior.' },
  documentation: { status: 'Domain Mastery', recommendation: 'Maintain with short warm-up questions before each session.' },
  professional_conduct: { status: 'Keep Studying', recommendation: 'Review boundaries, scope of competence and reporting.' },
};

/** Build the domainStats array from real topic data */
export function buildDomainStats(userMastery = {}) {
  return TOPICS.map(({ key, label }) => ({
    key,
    label,
    accent: DOMAIN_ACCENT_MAP[key] ?? 'primary',
    mastery: userMastery[key] ?? defaultMastery[key] ?? 75,
    ...(DOMAIN_STATUS_MAP[key] ?? { status: 'Keep Studying', recommendation: 'Keep practicing!' }),
  }));
}

const defaultMastery = {
  measurement: 92,
  assessment: 81,
  skill_acquisition: 76,
  behavior_reduction: 79,
  documentation: 88,
  professional_conduct: 74,
};
