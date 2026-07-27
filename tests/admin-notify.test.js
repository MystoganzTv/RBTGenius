import assert from 'node:assert/strict';
import test from 'node:test';

import { notifyNewMember, sendAdminPush } from '../server/lib/admin-notify.js';

const originalFetch = globalThis.fetch;
const originalResendApiKey = process.env.RESEND_API_KEY;
const originalNotificationEmails = process.env.ADMIN_NOTIFICATION_EMAIL;
const originalAdminEmails = process.env.ADMIN_EMAILS;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalResendApiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalResendApiKey;
  if (originalNotificationEmails === undefined) delete process.env.ADMIN_NOTIFICATION_EMAIL;
  else process.env.ADMIN_NOTIFICATION_EMAIL = originalNotificationEmails;
  if (originalAdminEmails === undefined) delete process.env.ADMIN_EMAILS;
  else process.env.ADMIN_EMAILS = originalAdminEmails;
});

test('admin email falls back to every address in ADMIN_EMAILS', async () => {
  process.env.RESEND_API_KEY = 'test-key';
  delete process.env.ADMIN_NOTIFICATION_EMAIL;
  process.env.ADMIN_EMAILS = 'enrique@example.com, mauro@example.com';
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({ id: 'email-1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  await notifyNewMember({
    id: 'user-1',
    email: 'member@example.com',
    full_name: 'New Member',
  });

  assert.deepEqual(requestBody.to, [
    'enrique@example.com',
    'mauro@example.com',
  ]);
});

test('sendAdminPush reports every successful Expo ticket', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    data: [
      { status: 'ok', id: 'ticket-1' },
      { status: 'ok', id: 'ticket-2' },
    ],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const result = await sendAdminPush(
    ['ExponentPushToken[one]', 'ExponentPushToken[two]'],
    { title: 'New subscription', body: 'A member subscribed.' },
  );

  assert.deepEqual(result, {
    sent: true,
    count: 2,
    failed: 0,
    failures: [],
  });
});

test('sendAdminPush exposes DeviceNotRegistered for cleanup', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    data: [
      { status: 'ok', id: 'ticket-1' },
      {
        status: 'error',
        message: 'The device is not registered',
        details: { error: 'DeviceNotRegistered' },
      },
    ],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const result = await sendAdminPush(
    ['ExponentPushToken[valid]', 'ExponentPushToken[stale]'],
    { title: 'New subscription', body: 'A member subscribed.' },
  );

  assert.equal(result.sent, true);
  assert.equal(result.count, 1);
  assert.equal(result.failed, 1);
  assert.deepEqual(result.failures, [{
    token: 'ExponentPushToken[stale]',
    error: 'DeviceNotRegistered',
    message: 'The device is not registered',
  }]);
});

test('sendAdminPush does not treat a malformed Expo response as success', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ data: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await sendAdminPush(
    ['ExponentPushToken[one]'],
    { title: 'New subscription', body: 'A member subscribed.' },
  );

  assert.deepEqual(result, {
    sent: false,
    count: 0,
    failed: 1,
    reason: 'invalid_provider_response',
  });
});
