import { getStore } from "@netlify/blobs";
import { computeProgress } from "../../src/lib/backend-core.js";
import {
  baseQuestions,
  buildFlashcardBank,
  buildMockExamQuestionSet,
  buildPracticeQuestionBank,
  topicLabels,
} from "../../src/lib/question-bank.js";
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
} from "../../server/lib/auth.js";
import {
  buildOAuthAuthorizationUrl,
  createOAuthState,
  exchangeOAuthCodeForProfile,
  listOAuthProviders,
  normalizeOrigin,
  normalizeRedirectPath,
} from "../../server/lib/oauth.js";
import { buildSeedDb, normalizeDb, resolveUserRole } from "../../server/lib/seed.js";

const store = getStore("rbt-genius-data");

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      ...(init.headers || {}),
    },
  });
}

async function readDb() {
  const db = await store.get("db", { type: "json" });
  if (db) {
    return normalizeDb(db);
  }

  const seed = buildSeedDb();
  await store.setJSON("db", seed);
  return seed;
}

async function writeDb(nextDb) {
  const payload = normalizeDb({
    ...nextDb,
    updatedAt: new Date().toISOString(),
  });
  await store.setJSON("db", payload);
  return payload;
}

async function updateDb(updater) {
  const current = await readDb();
  const next = updater(current);
  return writeDb(next);
}

function getQuestionBank(mode = "practice", options = {}) {
  const { seed } = options;

  if (mode === "flashcards") {
    return buildFlashcardBank(300, seed);
  }

  if (mode === "mock") {
    return buildMockExamQuestionSet(85, null, seed);
  }

  if (mode === "base") {
    return baseQuestions;
  }

  return buildPracticeQuestionBank(3000, seed);
}

function applyQuestionFilters(questions, searchParams) {
  const topic = searchParams.get("topic") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const bank = searchParams.get("bank") || "all";
  const limit = Number(searchParams.get("limit") || 0);

  const filtered = questions.filter((question) => {
    const topicMatch = topic === "all" || question.topic === topic;
    const difficultyMatch = difficulty === "all" || question.difficulty === difficulty;
    const bankMatch = bank === "all" || question.bank_id === bank;
    return topicMatch && difficultyMatch && bankMatch;
  });

  return limit > 0 ? filtered.slice(0, limit) : filtered;
}

function createTutorReply(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("discrete trial")) {
    return "Discrete trial training is a structured teaching method with a clear instruction, learner response, and consequence. It works well for breaking skills into smaller teachable parts.";
  }

  if (normalized.includes("positive reinforcement")) {
    return "Positive reinforcement means adding something valuable right after a behavior so that behavior is more likely to happen again. A simple example is praising a learner immediately after a correct response.";
  }

  if (normalized.includes("functional behavior assessment")) {
    return "A functional behavior assessment helps identify why a behavior happens by looking at antecedents, behavior, and consequences. The goal is to understand function before choosing an intervention.";
  }

  if (
    normalized.includes("rbt exam") ||
    normalized.includes("exam tips") ||
    normalized.includes("study")
  ) {
    return "A strong RBT study session usually combines short concept review, practice questions, and explanation of missed answers. Focus on reinforcement, prompting, data collection, ethics, and behavior reduction vocabulary.";
  }

  return "This AI Tutor is now backed by the server. We can later connect a real LLM endpoint, but your conversations are already persisted outside the browser.";
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createSafeUser(user) {
  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } = user;
  return safeUser;
}

function pruneOAuthStates(states = {}) {
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(states).filter(([, value]) => {
      const createdAt = new Date(value?.created_at || 0).getTime();
      return Number.isFinite(createdAt) && now - createdAt < 1000 * 60 * 15;
    }),
  );
}

async function consumeOAuthState(stateId) {
  let stateRecord = null;

  await updateDb((current) => {
    const nextStates = pruneOAuthStates(current.oauthStates);
    stateRecord = nextStates[stateId] || null;
    delete nextStates[stateId];

    return {
      ...current,
      oauthStates: nextStates,
    };
  });

  return stateRecord;
}

function buildFrontendLoginRedirect(frontendOrigin, redirectTo, params = {}) {
  const url = new URL("/login", frontendOrigin);
  if (redirectTo) {
    url.searchParams.set("redirectTo", normalizeRedirectPath(redirectTo));
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function upsertOAuthUser(profile, providerId) {
  let safeUser = null;
  let sessionToken = null;

  await updateDb((current) => {
    const existingUser = current.users.find(
      (user) => user.email.toLowerCase() === profile.email.toLowerCase(),
    );

    sessionToken = createSessionToken();
    const nextUsers = existingUser
      ? current.users.map((user) => {
          if (user.id !== existingUser.id) {
            return user;
          }

          const updatedUser = {
            ...user,
            full_name: user.full_name || profile.name,
            token: sessionToken,
            role: resolveUserRole(user.email, user.role || "student"),
            auth_provider: user.auth_provider || providerId,
            oauth_accounts: {
              ...(user.oauth_accounts || {}),
              [providerId]: {
                id: profile.id,
                email: profile.email,
                linked_at: new Date().toISOString(),
              },
            },
          };
          safeUser = createSafeUser(updatedUser);
          return updatedUser;
        })
      : [
          ...current.users,
          {
            id: createId("user"),
            full_name: profile.name,
            email: profile.email,
            role: resolveUserRole(profile.email),
            plan: "free",
            token: sessionToken,
            auth_provider: providerId,
            oauth_accounts: {
              [providerId]: {
                id: profile.id,
                email: profile.email,
                linked_at: new Date().toISOString(),
              },
            },
          },
        ];

    if (!safeUser) {
      const createdUser = nextUsers[nextUsers.length - 1];
      safeUser = createSafeUser(createdUser);
    }

    return {
      ...current,
      users: nextUsers,
    };
  });

  return { token: sessionToken, user: safeUser };
}

function getToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

async function getCurrentUser(request) {
  const token = getToken(request);
  if (!token) {
    return null;
  }

  const db = await readDb();
  return db.users.find((user) => user.token === token) || null;
}

async function requireUser(request) {
  const user = await getCurrentUser(request);

  if (!user) {
    return {
      error: json(
        {
          message: "Authentication required",
          extra_data: { reason: "auth_required" },
        },
        { status: 401 },
      ),
    };
  }

  return { user };
}

async function requireAdmin(request) {
  const auth = await requireUser(request);
  if (auth.error) {
    return auth;
  }

  if (auth.user?.role !== "admin") {
    return {
      error: json({ message: "Admin access required" }, { status: 403 }),
    };
  }

  return auth;
}

function getApiPath(url) {
  const { pathname } = new URL(url);
  return pathname
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "") || "/";
}

function isOAuthStartRoute(apiPath) {
  return /^\/auth\/oauth\/[^/]+\/start$/.test(apiPath);
}

function isOAuthCallbackRoute(apiPath) {
  return /^\/auth\/oauth\/[^/]+\/callback$/.test(apiPath);
}

async function parseCallbackParams(request) {
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const bodyText = await request.text();
      return Object.fromEntries(new URLSearchParams(bodyText));
    }

    if (contentType.includes("application/json")) {
      return await request.json();
    }
  }

  const url = new URL(request.url);
  return Object.fromEntries(url.searchParams.entries());
}

export default async (request) => {
  if (request.method === "OPTIONS") {
    return json({}, { status: 204 });
  }

  const url = new URL(request.url);
  const apiPath = getApiPath(request.url);

  if (apiPath === "/health" && request.method === "GET") {
    return json({ ok: true });
  }

  if (apiPath === "/public-settings" && request.method === "GET") {
    return json({ auth_required: true, app_name: "RBT Genius" });
  }

  if (apiPath === "/auth/providers" && request.method === "GET") {
    return json({
      providers: listOAuthProviders(),
    });
  }

  if (request.method === "GET" && isOAuthStartRoute(apiPath)) {
    const providerId = apiPath.split("/")[3];
    const redirectTo = normalizeRedirectPath(url.searchParams.get("redirectTo"));
    const backendOrigin = url.origin;
    const frontendOrigin = normalizeOrigin(url.searchParams.get("origin"), backendOrigin);
    const state = createOAuthState();

    try {
      await updateDb((current) => ({
        ...current,
        oauthStates: {
          ...pruneOAuthStates(current.oauthStates),
          [state]: {
            provider_id: providerId,
            frontend_origin: frontendOrigin,
            redirect_to: redirectTo,
            created_at: new Date().toISOString(),
          },
        },
      }));

      return Response.redirect(
        buildOAuthAuthorizationUrl({
          providerId,
          state,
          backendOrigin,
        }),
        302,
      );
    } catch (error) {
      return Response.redirect(
        buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
          oauthError: error.message || "Unable to start sign-in",
        }),
        302,
      );
    }
  }

  if ((request.method === "GET" || request.method === "POST") && isOAuthCallbackRoute(apiPath)) {
    const providerId = apiPath.split("/")[3];
    const callbackParams = await parseCallbackParams(request);
    const stateRecord = await consumeOAuthState(String(callbackParams.state || ""));
    const frontendOrigin = stateRecord?.frontend_origin || url.origin;
    const redirectTo = stateRecord?.redirect_to || "/";

    if (!stateRecord || stateRecord.provider_id !== providerId) {
      return Response.redirect(
        buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
          oauthError: "Your sign-in session expired. Please try again.",
        }),
        302,
      );
    }

    if (callbackParams.error) {
      return Response.redirect(
        buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
          oauthError: callbackParams.error_description || callbackParams.error,
        }),
        302,
      );
    }

    try {
      const profile = await exchangeOAuthCodeForProfile({
        providerId,
        code: String(callbackParams.code || ""),
        backendOrigin: url.origin,
        callbackParams,
      });
      const authData = await upsertOAuthUser(profile, providerId);

      return Response.redirect(
        buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
          authToken: authData.token,
        }),
        302,
      );
    } catch (error) {
      return Response.redirect(
        buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
          oauthError: error.message || "Unable to complete sign-in",
        }),
        302,
      );
    }
  }

  if (apiPath === "/auth/register" && request.method === "POST") {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const fullName = String(body?.full_name || "").trim();

    if (!email || !password || !fullName) {
      return json(
        { message: "Full name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = await readDb();
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      return json(
        { message: "An account with that email already exists" },
        { status: 409 },
      );
    }

    const passwordData = hashPassword(password);
    const newUser = {
      id: createId("user"),
      full_name: fullName,
      email,
      role: resolveUserRole(email),
      plan: "free",
      token: createSessionToken(),
      auth_provider: "password",
      oauth_accounts: {},
      password_hash: passwordData.hash,
      password_salt: passwordData.salt,
    };

    await updateDb((current) => ({
      ...current,
      users: [...current.users, newUser],
    }));

    return json({ token: newUser.token, user: createSafeUser(newUser) }, { status: 201 });
  }

  if (apiPath === "/auth/login" && request.method === "POST") {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const db = await readDb();
    const user = db.users.find((entry) => entry.email.toLowerCase() === email);

    if (
      !user ||
      !user.password_hash ||
      !user.password_salt ||
      !verifyPassword(password, user.password_salt, user.password_hash)
    ) {
      return json({ message: "Invalid email or password" }, { status: 401 });
    }

    const nextToken = createSessionToken();
    let updatedUser = null;

    await updateDb((current) => ({
      ...current,
      users: current.users.map((entry) => {
        if (entry.id !== user.id) {
          return entry;
        }

        updatedUser = {
          ...entry,
          role: resolveUserRole(entry.email, entry.role || "student"),
          token: nextToken,
        };
        return updatedUser;
      }),
    }));

    return json({ token: nextToken, user: createSafeUser(updatedUser) });
  }

  if (apiPath === "/auth/me" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    return json(createSafeUser(auth.user));
  }

  if (apiPath === "/auth/logout" && request.method === "POST") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    await updateDb((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === auth.user.id
          ? {
              ...user,
              token: null,
            }
          : user,
      ),
    }));

    return json({ ok: true });
  }

  if (apiPath === "/questions" && request.method === "GET") {
    const mode = url.searchParams.get("mode") || "practice";
    const questions = getQuestionBank(mode, { seed: url.searchParams.get("seed") });
    return json(applyQuestionFilters(questions, url.searchParams));
  }

  if (apiPath === "/practice/session" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json(db.practiceSessions[auth.user.id] || null);
  }

  if (apiPath === "/practice/session" && request.method === "PUT") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const nextSession = await request.json();
    await updateDb((current) => ({
      ...current,
      practiceSessions: {
        ...current.practiceSessions,
        [auth.user.id]: nextSession,
      },
    }));

    return json(nextSession);
  }

  if (apiPath === "/practice/session" && request.method === "DELETE") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    await updateDb((current) => {
      const nextSessions = { ...current.practiceSessions };
      delete nextSessions[auth.user.id];
      return {
        ...current,
        practiceSessions: nextSessions,
      };
    });

    return json({}, { status: 204 });
  }

  if (apiPath === "/question-attempts" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json(db.attempts.filter((attempt) => attempt.user_id === auth.user.id));
  }

  if (apiPath === "/question-attempts" && request.method === "POST") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const payload = {
      id: createId("attempt"),
      user_id: auth.user.id,
      created_at: new Date().toISOString(),
      ...(await request.json()),
    };

    await updateDb((current) => ({
      ...current,
      attempts: [payload, ...current.attempts],
    }));

    return json(payload, { status: 201 });
  }

  if (apiPath === "/mock-exams" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json(db.mockExams.filter((exam) => exam.user_id === auth.user.id));
  }

  if (apiPath === "/mock-exams" && request.method === "POST") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const payload = {
      id: createId("mock_exam"),
      user_id: auth.user.id,
      created_at: new Date().toISOString(),
      ...(await request.json()),
    };

    await updateDb((current) => ({
      ...current,
      mockExams: [payload, ...current.mockExams],
    }));

    return json(payload, { status: 201 });
  }

  if (apiPath === "/dashboard" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json({
      progress: computeProgress(db, auth.user.id),
      allQuestions: getQuestionBank("practice"),
      exams: db.mockExams.filter((exam) => exam.user_id === auth.user.id),
    });
  }

  if (apiPath === "/analytics" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json({
      progress: computeProgress(db, auth.user.id),
      attempts: db.attempts.filter((attempt) => attempt.user_id === auth.user.id),
      exams: db.mockExams.filter((exam) => exam.user_id === auth.user.id),
    });
  }

  if (apiPath === "/profile" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json({
      user: {
        id: auth.user.id,
        full_name: auth.user.full_name,
        email: auth.user.email,
        role: auth.user.role,
        plan: auth.user.plan,
      },
      progress: computeProgress(db, auth.user.id),
      payments: db.payments.filter((payment) => payment.user_id === auth.user.id),
    });
  }

  if (apiPath === "/profile" && request.method === "PATCH") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const updates = await request.json();
    let updatedUser = null;

    await updateDb((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.id !== auth.user.id) {
          return user;
        }

        updatedUser = {
          ...user,
          full_name: updates.full_name ?? user.full_name,
          role: resolveUserRole(user.email, user.role || "student"),
          plan: user.plan,
        };
        return updatedUser;
      }),
    }));

    const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } =
      updatedUser;
    return json(safeUser);
  }

  if (apiPath === "/admin/members" && request.method === "GET") {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    const members = db.users.map((user) => {
      const progress = computeProgress(db, user.id);
      const attemptsCount = db.attempts.filter((attempt) => attempt.user_id === user.id).length;
      const examsCount = db.mockExams.filter((exam) => exam.user_id === user.id).length;

      return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: resolveUserRole(user.email, user.role || "student"),
        plan: user.plan || "free",
        study_streak_days: progress.study_streak_days,
        readiness_score: progress.readiness_score,
        total_questions_completed: progress.total_questions_completed,
        attempts_count: attemptsCount,
        exams_count: examsCount,
        last_study_date: progress.last_study_date,
      };
    });

    return json(members);
  }

  if (/^\/admin\/members\/[^/]+$/.test(apiPath) && request.method === "PATCH") {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const memberId = apiPath.split("/")[3];
    const updates = await request.json();
    let updatedUser = null;

    await updateDb((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.id !== memberId) {
          return user;
        }

        updatedUser = {
          ...user,
          full_name: updates.full_name ?? user.full_name,
          role: resolveUserRole(
            user.email,
            updates.role === "admin" || updates.role === "student" ? updates.role : user.role,
          ),
          plan:
            updates.plan === "premium_monthly" ||
            updates.plan === "premium_yearly" ||
            updates.plan === "free"
              ? updates.plan
              : user.plan,
        };

        return updatedUser;
      }),
    }));

    if (!updatedUser) {
      return json({ message: "Member not found" }, { status: 404 });
    }

    return json({
      id: updatedUser.id,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      role: updatedUser.role,
      plan: updatedUser.plan,
    });
  }

  if (apiPath === "/ai-tutor/conversations" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const db = await readDb();
    return json(db.tutorConversations[auth.user.id] || []);
  }

  if (apiPath === "/ai-tutor/conversations" && request.method === "POST") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const body = await request.json();
    const conversation = {
      id: createId("convo"),
      metadata: { name: body?.name || "New Chat" },
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await updateDb((current) => {
      const currentConversations = current.tutorConversations[auth.user.id] || [];
      return {
        ...current,
        tutorConversations: {
          ...current.tutorConversations,
          [auth.user.id]: [conversation, ...currentConversations],
        },
      };
    });

    return json(conversation, { status: 201 });
  }

  const tutorMatch = apiPath.match(/^\/ai-tutor\/conversations\/([^/]+)\/messages$/);
  if (tutorMatch && request.method === "POST") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    const content = String((await request.json())?.content || "").trim();
    if (!content) {
      return json({ message: "Message content is required" }, { status: 400 });
    }

    const conversationId = tutorMatch[1];
    const userMessage = {
      id: createId("msg"),
      role: "user",
      content,
    };
    const assistantMessage = {
      id: createId("msg"),
      role: "assistant",
      content: createTutorReply(content),
    };

    let updatedConversation = null;

    await updateDb((current) => {
      const currentConversations = current.tutorConversations[auth.user.id] || [];
      return {
        ...current,
        tutorConversations: {
          ...current.tutorConversations,
          [auth.user.id]: currentConversations.map((conversation) => {
            if (conversation.id !== conversationId) {
              return conversation;
            }

            updatedConversation = {
              ...conversation,
              metadata: {
                ...conversation.metadata,
                name:
                  conversation.metadata?.name === "New Chat"
                    ? content.slice(0, 50)
                    : conversation.metadata?.name || content.slice(0, 50),
              },
              messages: [...(conversation.messages || []), userMessage, assistantMessage],
              updatedAt: new Date().toISOString(),
            };

            return updatedConversation;
          }),
        },
      };
    });

    if (!updatedConversation) {
      return json({ message: "Conversation not found" }, { status: 404 });
    }

    return json(updatedConversation, { status: 201 });
  }

  return json({ message: "Not found" }, { status: 404 });
};
