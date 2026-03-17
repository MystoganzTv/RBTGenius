import { topicLabels } from "./question-bank.js";

export const DEMO_USER_ID = "user-demo";

export const defaultUser = {
  id: DEMO_USER_ID,
  token: null,
  full_name: "Demo Student",
  email: "demo@rbtgenius.app",
  role: "student",
  plan: "free",
};

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
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const dateKey of sorted) {
    const currentKey = cursor.toISOString().slice(0, 10);
    if (dateKey === currentKey) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0) {
      break;
    }

    const expectedPrevious = new Date(cursor);
    expectedPrevious.setDate(expectedPrevious.getDate() + 1);
    if (dateKey === expectedPrevious.toISOString().slice(0, 10)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return {
    streak: streak || 1,
    lastStudyDate: sorted[0],
  };
}

export function computeProgress(db, userId) {
  const attempts = db.attempts.filter((attempt) => attempt.user_id === userId);
  const exams = db.mockExams.filter((exam) => exam.user_id === userId);
  const user = db.users.find((entry) => entry.id === userId) || defaultUser;

  const totalQuestionsCompleted = attempts.length;
  const totalCorrect = attempts.filter((attempt) => attempt.is_correct).length;
  const totalAccuracy =
    totalQuestionsCompleted > 0
      ? Math.round((totalCorrect / totalQuestionsCompleted) * 100)
      : 0;

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

  const readinessScore = Math.min(
    100,
    Math.round(totalAccuracy * 0.6 + averageExamScore * 0.4),
  );

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
    total_correct: totalCorrect,
    study_streak_days: streak,
    last_study_date: lastStudyDate,
    study_hours: studyHours,
    readiness_score: readinessScore,
    badges: [],
    plan: user.plan || "free",
    domain_mastery: domainMastery,
    questions_today: attempts.filter(
      (attempt) => attempt.created_at?.slice(0, 10) === new Date().toISOString().slice(0, 10),
    ).length,
    last_question_date: lastStudyDate,
  };
}
