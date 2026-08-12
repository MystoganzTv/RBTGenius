const DAY_MS = 24 * 60 * 60 * 1000;

export function toEasternDateKey(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York',
  }).formatToParts(date);
  const get = type => parts.find(part => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function offsetDateKey(key, offset) {
  const date = new Date(`${key}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function buildStudyDailySeries(attempts = [], exams = [], days = 30, now = new Date()) {
  const today = toEasternDateKey(now);
  const safeDays = Math.min(90, Math.max(7, Number(days) || 30));
  return Array.from({ length: safeDays }, (_, index) => {
    const date = offsetDateKey(today, index - safeDays + 1);
    const dailyAttempts = attempts.filter(attempt => toEasternDateKey(attempt.created_at) === date);
    const dailyExams = exams.filter(exam => toEasternDateKey(exam.created_at) === date);
    return {
      date,
      questions: dailyAttempts.length,
      correct: dailyAttempts.filter(attempt => attempt.is_correct).length,
      exams: dailyExams.length,
      tutor_messages: 0,
      request_count: 0,
      last_seen_at: null,
      active: dailyAttempts.length > 0 || dailyExams.length > 0,
    };
  });
}

export function buildMemberActivitySummary({
  user,
  attempts = [],
  exams = [],
  sessions = [],
  visits = [],
  tutorActivity = [],
  now = new Date(),
}) {
  const today = toEasternDateKey(now);
  const yesterday = offsetDateKey(today, -1);
  const weekStart = offsetDateKey(today, -6);
  const monthStart = offsetDateKey(today, -29);
  const attemptDate = attempt => toEasternDateKey(attempt.created_at);
  const examDate = exam => toEasternDateKey(exam.created_at);

  const activeDays = new Set([
    ...attempts.map(attemptDate),
    ...exams.map(examDate),
    ...sessions.map(session => toEasternDateKey(session.last_seen_at || session.issued_at)),
    ...visits.map(visit => String(visit.activity_date).slice(0, 10)),
    ...tutorActivity.map(item => toEasternDateKey(item.created_at)),
  ].filter(Boolean));

  const activityTimes = [
    user?.token_issued_at,
    ...attempts.map(attempt => attempt.created_at),
    ...exams.map(exam => exam.created_at),
    ...sessions.map(session => session.last_seen_at || session.issued_at),
    ...visits.map(visit => visit.last_seen_at),
    ...tutorActivity.map(item => item.created_at),
  ]
    .filter(Boolean)
    .map(value => new Date(value))
    .filter(date => Number.isFinite(date.getTime()))
    .sort((left, right) => right - left);

  const daily = buildStudyDailySeries(attempts, exams, 30, now);
  const dailyByDate = new Map(daily.map(day => [day.date, day]));
  for (const visit of visits) {
    const day = dailyByDate.get(String(visit.activity_date).slice(0, 10));
    if (!day) continue;
    day.request_count += Number(visit.request_count || 0);
    day.last_seen_at = visit.last_seen_at || day.last_seen_at;
    day.active = true;
  }
  for (const item of tutorActivity) {
    const day = dailyByDate.get(toEasternDateKey(item.created_at));
    if (!day) continue;
    day.tutor_messages += 1;
    day.active = true;
  }

  return {
    total_questions: attempts.length,
    questions_today: attempts.filter(attempt => attemptDate(attempt) === today).length,
    questions_yesterday: attempts.filter(attempt => attemptDate(attempt) === yesterday).length,
    questions_7d: attempts.filter(attempt => attemptDate(attempt) >= weekStart).length,
    questions_30d: attempts.filter(attempt => attemptDate(attempt) >= monthStart).length,
    total_exams: exams.length,
    exams_30d: exams.filter(exam => examDate(exam) >= monthStart).length,
    active_days_7d: [...activeDays].filter(date => date >= weekStart).length,
    active_days_30d: [...activeDays].filter(date => date >= monthStart).length,
    last_active_at: activityTimes[0]?.toISOString() || null,
    daily,
  };
}

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function paymentDate(payment) {
  return toIso(
    payment?.metadata?.purchased_at ||
      payment?.payment_date ||
      payment?.created_at,
  );
}

function isProductionPayment(payment) {
  const environment = String(payment?.metadata?.environment || '').toUpperCase();
  return payment?.status !== 'sandbox' && environment !== 'SANDBOX';
}

function isRevenueCatPayment(payment) {
  return (
    payment?.provider === 'revenuecat' ||
    payment?.metadata?.provider === 'revenuecat' ||
    Boolean(payment?.metadata?.revenuecat_event_id)
  );
}

function isTrialPayment(payment) {
  return (
    isProductionPayment(payment) &&
    isRevenueCatPayment(payment) &&
    (payment?.status === 'trial' ||
      String(payment?.metadata?.period_type || '').toUpperCase() === 'TRIAL')
  );
}

function transactionFamily(payment) {
  return String(payment?.metadata?.original_transaction_id || '').trim() || null;
}

export function deriveSubscriptionLifecycle(user, payments = [], now = new Date()) {
  const ordered = [...payments]
    .map((payment) => ({ payment, occurredAt: paymentDate(payment) }))
    .filter((entry) => entry.occurredAt)
    .sort((left, right) => new Date(left.occurredAt) - new Date(right.occurredAt));

  const trialEntry = ordered.find(({ payment }) => isTrialPayment(payment));
  const trialStartedAt = trialEntry?.occurredAt || null;
  const trialFamily = trialEntry ? transactionFamily(trialEntry.payment) : null;
  const explicitTrialEnd = toIso(trialEntry?.payment?.metadata?.expiration_at);
  const trialEndsAt = trialStartedAt
    ? explicitTrialEnd || new Date(new Date(trialStartedAt).getTime() + 7 * DAY_MS).toISOString()
    : null;

  const paidEntries = ordered.filter(({ payment, occurredAt }) => {
    if (!trialStartedAt || occurredAt < trialStartedAt) return false;
    if (!isProductionPayment(payment) || !isRevenueCatPayment(payment)) return false;
    if (payment.status !== 'completed' || isTrialPayment(payment)) return false;
    const family = transactionFamily(payment);
    return !trialFamily || !family || family === trialFamily;
  });
  const convertedAt = paidEntries[0]?.occurredAt || null;

  const renewalEntries = ordered.filter(
    ({ payment }) =>
      isProductionPayment(payment) &&
      isRevenueCatPayment(payment) &&
      payment.status === 'completed' &&
      String(payment?.metadata?.revenuecat_event_type || '').toUpperCase() === 'RENEWAL',
  );
  const latestRenewalAt = renewalEntries.at(-1)?.occurredAt || convertedAt;

  const nowMs = new Date(now).getTime();
  const trialEndMs = trialEndsAt ? new Date(trialEndsAt).getTime() : 0;
  const hasPremiumAccess = Boolean(user?.plan && user.plan !== 'free');

  let status = hasPremiumAccess ? 'premium' : 'free';
  if (trialStartedAt && convertedAt) {
    status = 'converted';
  } else if (trialStartedAt && hasPremiumAccess && trialEndMs > nowMs) {
    status = 'trialing';
  } else if (trialStartedAt && hasPremiumAccess) {
    status = 'trial_ended';
  } else if (trialStartedAt) {
    status = 'expired';
  }

  return {
    status,
    trial_started_at: trialStartedAt,
    trial_ends_at: trialEndsAt,
    converted_at: convertedAt,
    latest_renewal_at: latestRenewalAt,
    days_remaining:
      status === 'trialing'
        ? Math.max(0, Math.ceil((trialEndMs - nowMs) / DAY_MS))
        : 0,
  };
}
