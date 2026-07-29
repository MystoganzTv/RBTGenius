import assert from 'node:assert/strict';
import test from 'node:test';

import {
  attachSessionToUser,
  buildSession,
  createSafeUser,
  isSessionExpired,
  SESSION_REFRESH_THRESHOLD_MS,
  SESSION_TTL_MS,
  shouldRotateSession,
} from '../server/lib/auth.js';
import { normalizeDb } from '../server/lib/seed.js';

const DAY_MS = 24 * 60 * 60 * 1000;

test('sessions last one year and renew with ninety days remaining', () => {
  const now = Date.UTC(2026, 6, 29);
  const session = buildSession('device-a', now);

  assert.equal(
    new Date(session.expires_at).getTime() - now,
    365 * DAY_MS,
  );
  assert.equal(SESSION_TTL_MS, 365 * DAY_MS);
  assert.equal(SESSION_REFRESH_THRESHOLD_MS, 90 * DAY_MS);
  assert.equal(shouldRotateSession(attachSessionToUser({}, session), now), false);
  assert.equal(
    shouldRotateSession(
      attachSessionToUser({}, session),
      now + SESSION_TTL_MS - SESSION_REFRESH_THRESHOLD_MS,
    ),
    true,
  );
});

test('each request receives its own device token instead of the latest account token', () => {
  const accountRow = {
    id: 'user-1',
    email: 'student@example.com',
    token: 'latest-device-token',
    token_issued_at: '2026-07-29T12:00:00.000Z',
    token_expires_at: '2027-07-29T12:00:00.000Z',
  };
  const olderDeviceSession = {
    token: 'older-device-token',
    issued_at: '2026-07-01T12:00:00.000Z',
    expires_at: '2027-07-01T12:00:00.000Z',
  };

  const authenticatedUser = attachSessionToUser(
    accountRow,
    olderDeviceSession,
  );

  assert.equal(authenticatedUser.token, 'older-device-token');
  assert.equal(
    authenticatedUser.token_expires_at,
    olderDeviceSession.expires_at,
  );
  assert.equal(
    isSessionExpired(
      authenticatedUser,
      Date.parse('2026-12-01T12:00:00.000Z'),
    ),
    false,
  );
});

test('public user payloads never expose authentication credentials', () => {
  const safeUser = createSafeUser({
    id: 'user-1',
    email: 'student@example.com',
    token: 'secret-session-token',
    token_issued_at: '2026-07-29T12:00:00.000Z',
    token_expires_at: '2027-07-29T12:00:00.000Z',
    password_hash: 'secret-hash',
    password_salt: 'secret-salt',
    email_verification_token: 'secret-verification-token',
  });

  assert.deepEqual(safeUser, {
    id: 'user-1',
    email: 'student@example.com',
  });
});

test('local database migration preserves multiple sessions and backfills legacy users', () => {
  const db = normalizeDb({
    users: [
      {
        id: 'user-1',
        email: 'student@example.com',
        token: 'legacy-token',
        token_issued_at: '2026-07-29T12:00:00.000Z',
        token_expires_at: '2027-07-29T12:00:00.000Z',
      },
    ],
    sessions: [
      {
        token: 'device-a',
        user_id: 'user-1',
        issued_at: '2026-07-28T12:00:00.000Z',
        expires_at: '2027-07-28T12:00:00.000Z',
        last_seen_at: '2026-07-29T12:00:00.000Z',
        platform: 'password',
      },
    ],
  });

  assert.deepEqual(
    db.sessions.map((session) => session.token).sort(),
    ['device-a', 'legacy-token'],
  );
});
