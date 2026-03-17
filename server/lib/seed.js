import { defaultUser } from "../../src/lib/backend-core.js";
import { DEMO_CREDENTIALS, createSessionToken, hashPassword } from "./auth.js";

const LEGACY_DEMO_EMAIL = "alex.carter@example.com";

function buildSeedUser() {
  const credentials = hashPassword(DEMO_CREDENTIALS.password);

  return {
    ...defaultUser,
    token: createSessionToken(),
    password_hash: credentials.hash,
    password_salt: credentials.salt,
  };
}

export function buildSeedDb() {
  return {
    users: [buildSeedUser()],
    attempts: [],
    mockExams: [],
    payments: [],
    practiceSessions: {},
    oauthStates: {},
    tutorConversations: {},
    customQuestions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeDb(db) {
  if (!db || typeof db !== "object") {
    return buildSeedDb();
  }

  const seedDb = buildSeedDb();
  return {
    ...seedDb,
    ...db,
    users: Array.isArray(db.users) && db.users.length > 0
      ? db.users.map((user) => {
          const isLegacyDemoUser =
            user.id === defaultUser.id ||
            String(user.email || "").toLowerCase() === LEGACY_DEMO_EMAIL ||
            user.token === "demo-student-token";
          const normalizedUser = isLegacyDemoUser
            ? {
                ...user,
                id: defaultUser.id,
                full_name: defaultUser.full_name,
                email: defaultUser.email,
                role: user.role || defaultUser.role,
                plan: user.plan || defaultUser.plan,
              }
            : user;

          if (normalizedUser.password_hash && normalizedUser.password_salt) {
            return {
              ...normalizedUser,
              auth_provider: normalizedUser.auth_provider || "password",
              oauth_accounts:
                normalizedUser.oauth_accounts && typeof normalizedUser.oauth_accounts === "object"
                  ? normalizedUser.oauth_accounts
                  : {},
            };
          }

          const credentials = hashPassword(DEMO_CREDENTIALS.password);
          return {
            ...normalizedUser,
            auth_provider: normalizedUser.auth_provider || "password",
            oauth_accounts:
              normalizedUser.oauth_accounts && typeof normalizedUser.oauth_accounts === "object"
                ? normalizedUser.oauth_accounts
                : {},
            token: normalizedUser.token || createSessionToken(),
            password_hash: credentials.hash,
            password_salt: credentials.salt,
          };
        })
      : seedDb.users,
    attempts: Array.isArray(db.attempts) ? db.attempts : [],
    mockExams: Array.isArray(db.mockExams) ? db.mockExams : [],
    payments: Array.isArray(db.payments) ? db.payments : [],
    practiceSessions:
      db.practiceSessions && typeof db.practiceSessions === "object"
        ? db.practiceSessions
        : {},
    oauthStates:
      db.oauthStates && typeof db.oauthStates === "object"
        ? db.oauthStates
        : {},
    tutorConversations:
      db.tutorConversations && typeof db.tutorConversations === "object"
        ? db.tutorConversations
        : {},
    customQuestions: Array.isArray(db.customQuestions) ? db.customQuestions : [],
  };
}
