import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMemberActivitySummary,
  buildStudyDailySeries,
  deriveSubscriptionLifecycle,
} from '../server/lib/member-analytics.js';

const trial = {
  id: 'pay_trial',
  status: 'trial',
  amount: 0,
  payment_date: '2026-08-10T14:00:00.000Z',
  provider: 'revenuecat',
  metadata: {
    provider: 'revenuecat',
    environment: 'PRODUCTION',
    period_type: 'TRIAL',
    revenuecat_event_id: 'trial-event',
    revenuecat_event_type: 'INITIAL_PURCHASE',
    original_transaction_id: 'original-1',
    expiration_at: '2026-08-17T14:00:00.000Z',
  },
};

test('active seven-day RevenueCat trial is distinct from a paid monthly member', () => {
  assert.deepEqual(
    deriveSubscriptionLifecycle(
      { plan: 'premium_monthly' },
      [trial],
      new Date('2026-08-12T14:00:00.000Z'),
    ),
    {
      status: 'trialing',
      trial_started_at: '2026-08-10T14:00:00.000Z',
      trial_ends_at: '2026-08-17T14:00:00.000Z',
      converted_at: null,
      latest_renewal_at: null,
      days_remaining: 5,
    },
  );
});

test('first production renewal after a trial records the monthly conversion date', () => {
  const renewal = {
    id: 'pay_renewal',
    status: 'completed',
    amount: 19.99,
    payment_date: '2026-08-17T14:00:01.000Z',
    provider: 'revenuecat',
    metadata: {
      provider: 'revenuecat',
      environment: 'PRODUCTION',
      period_type: 'NORMAL',
      revenuecat_event_type: 'RENEWAL',
      original_transaction_id: 'original-1',
    },
  };

  const lifecycle = deriveSubscriptionLifecycle(
    { plan: 'premium_monthly' },
    [renewal, trial],
    new Date('2026-08-18T14:00:00.000Z'),
  );

  assert.equal(lifecycle.status, 'converted');
  assert.equal(lifecycle.converted_at, '2026-08-17T14:00:01.000Z');
  assert.equal(lifecycle.latest_renewal_at, '2026-08-17T14:00:01.000Z');
});

test('sandbox trials never affect the production lifecycle', () => {
  const lifecycle = deriveSubscriptionLifecycle(
    { plan: 'free' },
    [{ ...trial, status: 'sandbox', metadata: { ...trial.metadata, environment: 'SANDBOX' } }],
    new Date('2026-08-12T14:00:00.000Z'),
  );

  assert.equal(lifecycle.status, 'free');
  assert.equal(lifecycle.trial_started_at, null);
});

test('daily study series keeps separate question totals for consecutive days', () => {
  const series = buildStudyDailySeries(
    [
      ...Array.from({ length: 15 }, (_, index) => ({
        id: `today-${index}`,
        created_at: '2026-08-12T14:00:00.000Z',
        is_correct: true,
      })),
      ...Array.from({ length: 15 }, (_, index) => ({
        id: `yesterday-${index}`,
        created_at: '2026-08-11T14:00:00.000Z',
        is_correct: index < 12,
      })),
    ],
    [],
    7,
    new Date('2026-08-12T18:00:00.000Z'),
  );

  assert.equal(series.at(-1).date, '2026-08-12');
  assert.equal(series.at(-1).questions, 15);
  assert.equal(series.at(-2).date, '2026-08-11');
  assert.equal(series.at(-2).questions, 15);
  assert.equal(series.at(-2).correct, 12);
});

test('member activity summary merges visits with study history without exposing sessions', () => {
  const summary = buildMemberActivitySummary({
    user: { token_issued_at: '2026-08-10T14:00:00.000Z' },
    attempts: [
      { created_at: '2026-08-12T14:00:00.000Z', is_correct: true },
      { created_at: '2026-08-11T14:00:00.000Z', is_correct: false },
    ],
    visits: [
      {
        activity_date: '2026-08-10',
        last_seen_at: '2026-08-10T15:00:00.000Z',
        request_count: 4,
      },
    ],
    now: new Date('2026-08-12T18:00:00.000Z'),
  });

  assert.equal(summary.questions_today, 1);
  assert.equal(summary.questions_yesterday, 1);
  assert.equal(summary.active_days_7d, 3);
  assert.equal(summary.daily.find(day => day.date === '2026-08-10').request_count, 4);
});
