import express from "express";
import {
  computeProgress,
  getQuestionBank,
  readDb,
  updateDb,
} from "./lib/store.js";
import { createSessionToken, hashPassword, verifyPassword } from "./lib/auth.js";
import {
  buildOAuthAuthorizationUrl,
  createOAuthState,
  exchangeOAuthCodeForProfile,
  listOAuthProviders,
  normalizeOrigin,
  normalizeRedirectPath,
} from "./lib/oauth.js";
import { resolveUserRole } from "./lib/seed.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

function getToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

function getCurrentUser(req) {
  const token = getToken(req);
  if (!token) {
    return null;
  }

  const db = readDb();
  return db.users.find((user) => user.token === token) || null;
}

function requireUser(req, res, next) {
  const user = getCurrentUser(req);

  if (!user) {
    res.status(401).json({
      message: "Authentication required",
      extra_data: { reason: "auth_required" },
    });
    return;
  }

  req.currentUser = user;
  next();
}

function requireAdmin(req, res, next) {
  requireUser(req, res, () => {
    if (req.currentUser?.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    next();
  });
}

function applyQuestionFilters(questions, query) {
  const topic = query.topic || "all";
  const difficulty = query.difficulty || "all";
  const bank = query.bank || "all";
  const limit = Number(query.limit || 0);

  const filtered = questions.filter((question) => {
    const topicMatch = topic === "all" || question.topic === topic;
    const difficultyMatch = difficulty === "all" || question.difficulty === difficulty;
    const bankMatch = bank === "all" || question.bank_id === bank;
    return topicMatch && difficultyMatch && bankMatch;
  });

  if (limit > 0) {
    return filtered.slice(0, limit);
  }

  return filtered;
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

function getBackendOrigin(req) {
  return `${req.protocol}://${req.get("host")}`;
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

function consumeOAuthState(stateId) {
  let stateRecord = null;

  updateDb((current) => {
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

function upsertOAuthUser(profile, providerId) {
  let safeUser = null;
  let sessionToken = null;

  updateDb((current) => {
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/public-settings", (_req, res) => {
  res.json({
    auth_required: true,
    app_name: "RBT Genius",
  });
});

app.get("/api/auth/providers", (_req, res) => {
  res.json({
    providers: listOAuthProviders(),
  });
});

app.get("/api/auth/oauth/:providerId/start", (req, res) => {
  const { providerId } = req.params;
  const redirectTo = normalizeRedirectPath(req.query.redirectTo);
  const backendOrigin = getBackendOrigin(req);
  const frontendOrigin = normalizeOrigin(req.query.origin, backendOrigin);
  const state = createOAuthState();

  try {
    updateDb((current) => ({
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

    const authorizationUrl = buildOAuthAuthorizationUrl({
      providerId,
      state,
      backendOrigin,
    });

    res.redirect(authorizationUrl);
  } catch (error) {
    res.redirect(
      buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
        oauthError: error.message || "Unable to start sign-in",
      }),
    );
  }
});

async function handleOAuthCallback(req, res) {
  const { providerId } = req.params;
  const callbackState = String((req.body?.state || req.query.state) || "");
  const stateRecord = consumeOAuthState(callbackState);
  const fallbackOrigin = getBackendOrigin(req);
  const frontendOrigin = stateRecord?.frontend_origin || fallbackOrigin;
  const redirectTo = stateRecord?.redirect_to || "/";

  if (!stateRecord || stateRecord.provider_id !== providerId) {
    res.redirect(
      buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
        oauthError: "Your sign-in session expired. Please try again.",
      }),
    );
    return;
  }

  if (req.body?.error || req.query.error) {
    res.redirect(
      buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
        oauthError: String(
          req.body?.error_description ||
            req.query.error_description ||
            req.body?.error ||
            req.query.error,
        ),
      }),
    );
    return;
  }

  try {
    const profile = await exchangeOAuthCodeForProfile({
      providerId,
      code: String((req.body?.code || req.query.code) || ""),
      backendOrigin: fallbackOrigin,
      callbackParams: {
        ...req.query,
        ...req.body,
      },
    });
    const authData = upsertOAuthUser(profile, providerId);

    res.redirect(
      buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
        authToken: authData.token,
      }),
    );
  } catch (error) {
    res.redirect(
      buildFrontendLoginRedirect(frontendOrigin, redirectTo, {
        oauthError: error.message || "Unable to complete sign-in",
      }),
    );
  }
}

app.get("/api/auth/oauth/:providerId/callback", handleOAuthCallback);
app.post("/api/auth/oauth/:providerId/callback", handleOAuthCallback);

app.post("/api/auth/register", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const fullName = String(req.body?.full_name || "").trim();

  if (!email || !password || !fullName) {
    res.status(400).json({ message: "Full name, email, and password are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters" });
    return;
  }

  const db = readDb();
  if (db.users.some((user) => user.email.toLowerCase() === email)) {
    res.status(409).json({ message: "An account with that email already exists" });
    return;
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

  updateDb((current) => ({
    ...current,
    users: [...current.users, newUser],
  }));

  res.status(201).json({ token: newUser.token, user: createSafeUser(newUser) });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const db = readDb();
  const user = db.users.find((entry) => entry.email.toLowerCase() === email);

  if (
    !user ||
    !user.password_hash ||
    !user.password_salt ||
    !verifyPassword(password, user.password_salt, user.password_hash)
  ) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const nextToken = createSessionToken();
  let updatedUser = null;

  updateDb((current) => ({
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

  res.json({ token: nextToken, user: createSafeUser(updatedUser) });
});

app.get("/api/auth/me", requireUser, (req, res) => {
  res.json(createSafeUser(req.currentUser));
});

app.post("/api/auth/logout", requireUser, (req, res) => {
  updateDb((current) => ({
    ...current,
    users: current.users.map((user) =>
      user.id === req.currentUser.id
        ? {
            ...user,
            token: null,
          }
        : user,
    ),
  }));

  res.json({ ok: true });
});

app.get("/api/questions", (req, res) => {
  const mode = req.query.mode || "practice";
  const questions = getQuestionBank(mode, { seed: req.query.seed });
  res.json(applyQuestionFilters(questions, req.query));
});

app.get("/api/practice/session", requireUser, (req, res) => {
  const db = readDb();
  res.json(db.practiceSessions[req.currentUser.id] || null);
});

app.put("/api/practice/session", requireUser, (req, res) => {
  const nextSession = req.body || null;
  updateDb((current) => ({
    ...current,
    practiceSessions: {
      ...current.practiceSessions,
      [req.currentUser.id]: nextSession,
    },
  }));

  res.json(nextSession);
});

app.delete("/api/practice/session", requireUser, (req, res) => {
  updateDb((current) => {
    const nextSessions = { ...current.practiceSessions };
    delete nextSessions[req.currentUser.id];
    return {
      ...current,
      practiceSessions: nextSessions,
    };
  });

  res.status(204).end();
});

app.get("/api/question-attempts", requireUser, (req, res) => {
  const db = readDb();
  res.json(db.attempts.filter((attempt) => attempt.user_id === req.currentUser.id));
});

app.post("/api/question-attempts", requireUser, (req, res) => {
  const payload = {
    id: createId("attempt"),
    user_id: req.currentUser.id,
    created_at: new Date().toISOString(),
    ...req.body,
  };

  updateDb((current) => ({
    ...current,
    attempts: [payload, ...current.attempts],
  }));

  res.status(201).json(payload);
});

app.get("/api/mock-exams", requireUser, (req, res) => {
  const db = readDb();
  res.json(db.mockExams.filter((exam) => exam.user_id === req.currentUser.id));
});

app.post("/api/mock-exams", requireUser, (req, res) => {
  const payload = {
    id: createId("mock_exam"),
    user_id: req.currentUser.id,
    created_at: new Date().toISOString(),
    ...req.body,
  };

  updateDb((current) => ({
    ...current,
    mockExams: [payload, ...current.mockExams],
  }));

  res.status(201).json(payload);
});

app.get("/api/dashboard", requireUser, (req, res) => {
  const db = readDb();
  res.json({
    progress: computeProgress(db, req.currentUser.id),
    allQuestions: getQuestionBank("practice"),
  });
});

app.get("/api/analytics", requireUser, (req, res) => {
  const db = readDb();
  res.json({
    progress: computeProgress(db, req.currentUser.id),
    attempts: db.attempts.filter((attempt) => attempt.user_id === req.currentUser.id),
    exams: db.mockExams.filter((exam) => exam.user_id === req.currentUser.id),
  });
});

app.get("/api/profile", requireUser, (req, res) => {
  const db = readDb();
  res.json({
    user: {
      id: req.currentUser.id,
      full_name: req.currentUser.full_name,
      email: req.currentUser.email,
      role: req.currentUser.role,
      plan: req.currentUser.plan,
    },
    progress: computeProgress(db, req.currentUser.id),
    payments: db.payments.filter((payment) => payment.user_id === req.currentUser.id),
  });
});

app.patch("/api/profile", requireUser, (req, res) => {
  const updates = req.body || {};
  let updatedUser = null;

  updateDb((current) => ({
    ...current,
    users: current.users.map((user) => {
      if (user.id !== req.currentUser.id) {
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

  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } = updatedUser;
  res.json(safeUser);
});

app.get("/api/admin/members", requireAdmin, (req, res) => {
  const db = readDb();
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

  res.json(members);
});

app.patch("/api/admin/members/:memberId", requireAdmin, (req, res) => {
  const { memberId } = req.params;
  const updates = req.body || {};
  let updatedUser = null;

  updateDb((current) => ({
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
    res.status(404).json({ message: "Member not found" });
    return;
  }

  res.json({
    id: updatedUser.id,
    full_name: updatedUser.full_name,
    email: updatedUser.email,
    role: updatedUser.role,
    plan: updatedUser.plan,
  });
});

app.get("/api/ai-tutor/conversations", requireUser, (req, res) => {
  const db = readDb();
  res.json(db.tutorConversations[req.currentUser.id] || []);
});

app.post("/api/ai-tutor/conversations", requireUser, (req, res) => {
  const conversation = {
    id: createId("convo"),
    metadata: { name: req.body?.name || "New Chat" },
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  updateDb((current) => {
    const currentConversations = current.tutorConversations[req.currentUser.id] || [];
    return {
      ...current,
      tutorConversations: {
        ...current.tutorConversations,
        [req.currentUser.id]: [conversation, ...currentConversations],
      },
    };
  });

  res.status(201).json(conversation);
});

app.post("/api/ai-tutor/conversations/:conversationId/messages", requireUser, (req, res) => {
  const { conversationId } = req.params;
  const content = String(req.body?.content || "").trim();

  if (!content) {
    res.status(400).json({ message: "Message content is required" });
    return;
  }

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

  updateDb((current) => {
    const currentConversations = current.tutorConversations[req.currentUser.id] || [];
    return {
      ...current,
      tutorConversations: {
        ...current.tutorConversations,
        [req.currentUser.id]: currentConversations.map((conversation) => {
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
    res.status(404).json({ message: "Conversation not found" });
    return;
  }

  res.status(201).json(updatedConversation);
});

app.listen(port, () => {
  console.log(`RBT Genius API listening on http://localhost:${port}`);
});
