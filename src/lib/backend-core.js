import { TOTAL_PRACTICE_QUESTIONS, topicLabels } from "./question-bank.js";

export const DEMO_USER_ID = "user-demo";

export const defaultUser = {
  id: DEMO_USER_ID,
  token: null,
  full_name: "Demo Student",
  email: "demo@rbtgenius.app",
  role: "student",
  plan: "free",
};

export const MIN_DOMAIN_ATTEMPTS = 10;

function getSmoothedRate(correct, total, baselineRate = 0.65, baselineWeight = 6) {
  if (total <= 0) {
    return 0;
  }

  const weightedCorrect = correct + baselineRate * baselineWeight;
  const weightedTotal = total + baselineWeight;
  return Math.round((weightedCorrect / weightedTotal) * 100);
}

function formatUniqueStudyDays(attempts) {
  const dateKeys = new Set(
    attempts
      .map((attempt) => attempt.created_at?.slice(0, 10))
      .filter(Boolean),
  );

  if (dateKeys.size === 0) {
    return { streak: 0, lastStudyDate: null };
  }

  const sorted = [...dateKeys].sort((left, right) => (left < right ? 1 : -1));
  let consecutiveDays = 1;
  let cursor = new Date(`${sorted[0]}T00:00:00`);

  for (const dateKey of sorted.slice(1)) {
    const expectedPrevious = new Date(cursor);
    expectedPrevious.setDate(expectedPrevious.getDate() - 1);

    if (dateKey === expectedPrevious.toISOString().slice(0, 10)) {
      consecutiveDays += 1;
      cursor = expectedPrevious;
      continue;
    }

    break;
  }

  return {
    streak: Math.max(0, consecutiveDays - 1),
    lastStudyDate: sorted[0],
  };
}

export function computeProgress(db, userId) {
  const attempts = db.attempts.filter((attempt) => attempt.user_id === userId);
  const exams = db.mockExams.filter((exam) => exam.user_id === userId);
  const user = db.users.find((entry) => entry.id === userId) || defaultUser;
  const recentAttempts = [...attempts]
    .sort((left, right) => (left.created_at < right.created_at ? 1 : -1))
    .slice(0, 50);

  const totalQuestionsCompleted = attempts.length;
  const totalCorrect = attempts.filter((attempt) => attempt.is_correct).length;
  const totalAccuracy =
    totalQuestionsCompleted > 0
      ? Math.round((totalCorrect / totalQuestionsCompleted) * 100)
      : 0;
  const accuracyRate = getSmoothedRate(totalCorrect, totalQuestionsCompleted, 0.62, 20);
  const recentCorrect = recentAttempts.filter((attempt) => attempt.is_correct).length;
  const recentAccuracy = getSmoothedRate(recentCorrect, recentAttempts.length, 0.62, 10);

  const domainAttemptCounts = Object.keys(topicLabels).reduce((result, key) => {
    result[key] = attempts.filter((attempt) => attempt.topic === key).length;
    return result;
  }, {});

  const domainMastery = Object.keys(topicLabels).reduce((result, key) => {
    const topicAttempts = attempts.filter((attempt) => attempt.topic === key);
    const topicCorrect = topicAttempts.filter((attempt) => attempt.is_correct).length;

    result[key] =
      topicAttempts.length > 0
        ? getSmoothedRate(topicCorrect, topicAttempts.length)
        : 0;
    return result;
  }, {});

  const averageExamScore =
    exams.length > 0
      ? Math.round(
          exams.reduce((total, exam) => total + (exam.score || 0), 0) / exams.length,
        )
      : 0;
  const passedMockExams = exams.filter((exam) => (exam.score || 0) >= 80).length;
  const failedMockExams = Math.max(0, exams.length - passedMockExams);

  const stableDomainKeys = Object.keys(topicLabels).filter(
    (key) => domainAttemptCounts[key] >= MIN_DOMAIN_ATTEMPTS,
  );
  const stableDomainAverage =
    stableDomainKeys.length > 0
      ? Math.round(
          stableDomainKeys.reduce((total, key) => total + domainMastery[key], 0) /
            stableDomainKeys.length,
        )
      : null;

  let readinessWeightedTotal = 0;
  let readinessWeights = 0;

  if (totalQuestionsCompleted > 0) {
    readinessWeightedTotal += accuracyRate * 0.75;
    readinessWeights += 0.75;
  }

  if (stableDomainAverage !== null) {
    readinessWeightedTotal += stableDomainAverage * 0.1;
    readinessWeights += 0.1;
  }

  if (exams.length > 0) {
    readinessWeightedTotal += averageExamScore * 0.15;
    readinessWeights += 0.15;
  }

  const readinessBaseScore =
    readinessWeights > 0
      ? Math.min(100, Math.round(readinessWeightedTotal / readinessWeights))
      : 0;
  const bankCoverage = Math.min(1, totalQuestionsCompleted / TOTAL_PRACTICE_QUESTIONS);
  const bankAccuracy =
    TOTAL_PRACTICE_QUESTIONS > 0
      ? Number(((totalCorrect / TOTAL_PRACTICE_QUESTIONS) * 100).toFixed(1))
      : 0;
  const examCoverageBoost = Math.min(0.35, exams.length * 0.08);
  const readinessCeiling = Math.min(1, bankCoverage * 3 + examCoverageBoost);
  const readinessScore = Math.round(readinessBaseScore * readinessCeiling);

  const readinessConfidence =
    exams.length > 0 || totalQuestionsCompleted >= 150
      ? "high"
      : totalQuestionsCompleted >= 50
        ? "medium"
        : "low";

  const studyHours =
    Math.round(
      ((attempts.length * 1.5 +
        exams.reduce((total, exam) => total + (exam.time_taken_minutes || 0), 0)) /
        60) *
        10,
    ) / 10;

  const { streak, lastStudyDate } = formatUniqueStudyDays(attempts);

  return {
    total_questions_completed: totalQuestionsCompleted,
    total_questions_available: TOTAL_PRACTICE_QUESTIONS,
    bank_coverage_percent: Math.round(bankCoverage * 100),
    total_correct: totalCorrect,
    bank_accuracy: bankAccuracy,
    accuracy_rate: accuracyRate,
    raw_accuracy: totalAccuracy,
    recent_accuracy: recentAccuracy,
    study_streak_days: streak,
    last_study_date: lastStudyDate,
    study_hours: studyHours,
    readiness_score: readinessScore,
    readiness_confidence: readinessConfidence,
    badges: [],
    plan: user.plan || "free",
    domain_mastery: domainMastery,
    domain_attempt_counts: domainAttemptCounts,
    questions_today: attempts.filter(
      (attempt) => attempt.created_at?.slice(0, 10) === new Date().toISOString().slice(0, 10),
    ).length,
    last_question_date: lastStudyDate,
    total_mock_exams: exams.length,
    passed_mock_exams: passedMockExams,
    failed_mock_exams: failedMockExams,
    average_mock_exam_score: averageExamScore,
  };
}
