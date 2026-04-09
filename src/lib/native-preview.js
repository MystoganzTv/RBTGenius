import { computeProgress } from "@/lib/backend-core";
import {
  TOTAL_PRACTICE_QUESTIONS,
  buildFlashcardBank,
  buildMockExamQuestionSet,
  buildPracticeQuestionBank,
  evaluateQuestionAnswer,
  sanitizeQuestions,
  topicLabels,
} from "@/lib/question-bank";
import { getEntitlements } from "@/lib/plan-access";

const PREVIEW_MODE_STORAGE_KEY = "rbt_genius_native_preview_mode";
const PREVIEW_DB_STORAGE_KEY = "rbt_genius_native_preview_db";
const PREVIEW_AUTH_TOKEN = "native-preview-token";
const PREVIEW_USER = {
  id: "native-preview-user",
  full_name: "Preview Student",
  email: "preview@rbtgenius.local",
  role: "student",
  plan: "premium_yearly",
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function nowIso() {
  return new Date().toISOString();
}

function createPreviewDb() {
  return {
    attempts: [],
    mockExams: [],
    payments: [],
    practiceSession: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function readPreviewDb() {
  const storage = getStorage();
  if (!storage) {
    return createPreviewDb();
  }

  try {
    const parsed = JSON.parse(storage.getItem(PREVIEW_DB_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") {
      return createPreviewDb();
    }

    return {
      ...createPreviewDb(),
      ...parsed,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      mockExams: Array.isArray(parsed.mockExams) ? parsed.mockExams : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      practiceSession: parsed.practiceSession ?? null,
    };
  } catch {
    return createPreviewDb();
  }
}

function writePreviewDb(nextDb) {
  const storage = getStorage();
  if (!storage) {
    return nextDb;
  }

  const payload = {
    ...createPreviewDb(),
    ...nextDb,
    updatedAt: nowIso(),
  };
  storage.setItem(PREVIEW_DB_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

function updatePreviewDb(updater) {
  const current = readPreviewDb();
  const next = updater(current);
  return writePreviewDb(next);
}

function buildRuntimeDb(previewDb) {
  return {
    users: [
      {
        ...PREVIEW_USER,
        token: PREVIEW_AUTH_TOKEN,
        created_at: previewDb.createdAt || nowIso(),
      },
    ],
    attempts: previewDb.attempts,
    mockExams: previewDb.mockExams,
    payments: previewDb.payments,
    stripeEvents: {},
    practiceSessions: {
      [PREVIEW_USER.id]: previewDb.practiceSession,
    },
    oauthStates: {},
    tutorConversations: {
      [PREVIEW_USER.id]: [],
    },
    customQuestions: [],
    createdAt: previewDb.createdAt || nowIso(),
    updatedAt: previewDb.updatedAt || nowIso(),
  };
}

function getPreviewAccessState(previewDb = readPreviewDb()) {
  const db = buildRuntimeDb(previewDb);
  const progress = computeProgress(db, PREVIEW_USER.id);
  const entitlements = getEntitlements(PREVIEW_USER.plan, {
    practiceQuestionsToday: progress.questions_today,
    tutorMessagesToday: 0,
  });

  return {
    db,
    progress,
    entitlements,
    billing: {
      provider: "preview",
      checkout_enabled: false,
      portal_enabled: false,
      current_plan: PREVIEW_USER.plan,
      management_url: null,
    },
  };
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getSeenPracticeQuestionIds(previewDb) {
  return [
    ...new Set(
      previewDb.attempts
        .filter((attempt) => !attempt.source || attempt.source === "practice")
        .map((attempt) => attempt.question_id)
        .filter(Boolean),
    ),
  ];
}

function getSeenMockQuestionIds(previewDb) {
  return [
    ...new Set(
      previewDb.mockExams
        .flatMap((exam) => exam.answers || [])
        .map((answer) => answer.question_id)
        .filter(Boolean),
    ),
  ];
}

export function isNativePreviewMode() {
  const storage = getStorage();
  return storage?.getItem(PREVIEW_MODE_STORAGE_KEY) === "1";
}

export function enableNativePreviewMode() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(PREVIEW_MODE_STORAGE_KEY, "1");
  storage.setItem("rbt_genius_auth_token", PREVIEW_AUTH_TOKEN);
  storage.setItem("access_token", PREVIEW_AUTH_TOKEN);
}

export function disableNativePreviewMode() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(PREVIEW_MODE_STORAGE_KEY);
  storage.removeItem("rbt_genius_auth_token");
  storage.removeItem("access_token");
}

export function getPreviewUser() {
  return { ...PREVIEW_USER, token: PREVIEW_AUTH_TOKEN };
}

export function getPreviewProfile() {
  const previewDb = readPreviewDb();
  const { progress, entitlements, billing } = getPreviewAccessState(previewDb);

  return {
    user: getPreviewUser(),
    progress,
    entitlements,
    billing,
    payments: previewDb.payments,
  };
}

export function getPreviewDashboard() {
  const previewDb = readPreviewDb();
  const { progress, entitlements, billing } = getPreviewAccessState(previewDb);

  return {
    progress,
    entitlements,
    billing,
    allQuestionsCount: TOTAL_PRACTICE_QUESTIONS,
    exams: previewDb.mockExams,
  };
}

export function getPreviewAnalytics() {
  const previewDb = readPreviewDb();
  const { progress } = getPreviewAccessState(previewDb);

  return {
    progress,
    attempts: previewDb.attempts,
    exams: previewDb.mockExams,
  };
}

export function previewListQuestions(params = {}) {
  const mode = params.mode || "practice";
  const previewDb = readPreviewDb();

  if (mode === "flashcards") {
    return sanitizeQuestions(
      buildFlashcardBank(TOTAL_PRACTICE_QUESTIONS, params.seed || "preview-flashcards"),
      mode,
    );
  }

  const size = Number(params.limit || 0) || (mode === "mock" ? 85 : TOTAL_PRACTICE_QUESTIONS);
  const excludeIds =
    mode === "mock"
      ? getSeenMockQuestionIds(previewDb)
      : getSeenPracticeQuestionIds(previewDb);

  const questions =
    mode === "mock"
      ? buildMockExamQuestionSet(size, null, params.seed || "preview-mock", { excludeIds })
      : buildPracticeQuestionBank(size, params.seed || "preview-practice", { excludeIds });

  const filtered = questions.filter((question) => {
    const topicMatch = !params.topic || params.topic === "all" || question.topic === params.topic;
    const difficultyMatch =
      !params.difficulty ||
      params.difficulty === "all" ||
      question.difficulty === params.difficulty;
    return topicMatch && difficultyMatch;
  });

  return sanitizeQuestions(filtered, mode);
}

export function getPreviewPracticeSession() {
  return readPreviewDb().practiceSession || null;
}

export function savePreviewPracticeSession(session) {
  updatePreviewDb((current) => ({
    ...current,
    practiceSession: session,
  }));

  return session;
}

export function clearPreviewPracticeSession() {
  updatePreviewDb((current) => ({
    ...current,
    practiceSession: null,
  }));

  return null;
}

export function listPreviewAttempts() {
  return readPreviewDb().attempts;
}

export function createPreviewAttempt(payload = {}) {
  const evaluation = evaluateQuestionAnswer(payload.question_id, payload.selected_answer);

  if (!evaluation) {
    throw new Error("Question not found");
  }

  const attempt = {
    id: createId("attempt"),
    user_id: PREVIEW_USER.id,
    created_at: nowIso(),
    question_id: evaluation.question_id,
    selected_answer: evaluation.selected_answer,
    is_correct: evaluation.is_correct,
    topic: evaluation.topic,
    source: payload.source || "practice",
  };

  const previewDb = updatePreviewDb((current) => ({
    ...current,
    attempts: [attempt, ...current.attempts],
  }));
  const { entitlements } = getPreviewAccessState(previewDb);

  return {
    ...attempt,
    correct_answer: evaluation.correct_answer,
    explanation: evaluation.explanation,
    entitlements,
  };
}

export function listPreviewMockExams() {
  return readPreviewDb().mockExams;
}

export function createPreviewMockExam(payload = {}) {
  const questionIds = Array.isArray(payload.question_ids) ? payload.question_ids : [];
  const answers = payload.answers || {};
  const evaluated = questionIds
    .map((questionId) => evaluateQuestionAnswer(questionId, answers[questionId]))
    .filter(Boolean);

  if (evaluated.length === 0) {
    throw new Error("Mock exam questions are required");
  }

  const correct = evaluated.filter((entry) => entry.is_correct).length;
  const score = Math.round((correct / evaluated.length) * 100);
  const domainScores = Object.keys(topicLabels).reduce((result, key) => {
    const topicQuestions = evaluated.filter((entry) => entry.topic === key);
    const topicCorrect = topicQuestions.filter((entry) => entry.is_correct).length;
    result[key] = topicQuestions.length > 0 ? Math.round((topicCorrect / topicQuestions.length) * 100) : 0;
    return result;
  }, {});

  const exam = {
    id: createId("mock_exam"),
    user_id: PREVIEW_USER.id,
    created_at: nowIso(),
    score,
    total_questions: evaluated.length,
    correct_answers: correct,
    time_taken_minutes: Number(payload.time_taken_minutes || 0),
    status: "completed",
    answers: evaluated.map(({ question_id, selected_answer, is_correct }) => ({
      question_id,
      selected_answer,
      is_correct,
    })),
    passed: score >= 80,
    domain_scores: domainScores,
  };

  updatePreviewDb((current) => ({
    ...current,
    mockExams: [exam, ...current.mockExams],
  }));

  return exam;
}
