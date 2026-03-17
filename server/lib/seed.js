import { defaultUser, DEMO_USER_ID } from "../../src/lib/backend-core.js";
import { createSessionToken } from "./auth.js";

const LEGACY_DEMO_EMAIL = "alex.carter@example.com";
const LEGACY_DEMO_EMAILS = [LEGACY_DEMO_EMAIL, "demo@rbtgenius.app"];
export const ADMIN_EMAILS = ["enrique.padron853@gmail.com"];

export function resolveUserRole(email, fallbackRole = "student") {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : fallbackRole;
}

export function buildSeedDb() {
  return {
    users: [],
    attempts: [],
    mockExams: [],
    payments: [],
    stripeEvents: {},
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
    users:
      Array.isArray(db.users) && db.users.length > 0
        ? db.users
            .filter((user) => {
              const normalizedEmail = String(user.email || "").toLowerCase();
              const isLegacyDemoUser =
                user.id === DEMO_USER_ID ||
                LEGACY_DEMO_EMAILS.includes(normalizedEmail) ||
                user.token === "demo-student-token";

              return !isLegacyDemoUser;
            })
            .map((user) => ({
              ...user,
              token: user.token || createSessionToken(),
              created_at: user.created_at || seedDb.createdAt,
              role: resolveUserRole(user.email, user.role || defaultUser.role),
              plan: user.plan || defaultUser.plan,
              auth_provider: user.auth_provider || "password",
              oauth_accounts:
                user.oauth_accounts && typeof user.oauth_accounts === "object"
                  ? user.oauth_accounts
                  : {},
            }))
        : seedDb.users,
    attempts: Array.isArray(db.attempts) ? db.attempts : [],
    mockExams: Array.isArray(db.mockExams) ? db.mockExams : [],
    payments: Array.isArray(db.payments) ? db.payments : [],
    stripeEvents:
      db.stripeEvents && typeof db.stripeEvents === "object"
        ? db.stripeEvents
        : {},
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
