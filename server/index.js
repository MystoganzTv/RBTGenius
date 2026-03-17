import express from "express";
import {
  computeProgress,
  getQuestionBank,
  readDb,
  updateDb,
} from "./lib/store.js";
import { createSessionToken, hashPassword, verifyPassword } from "./lib/auth.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(express.json());
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

function applyQuestionFilters(questions, query) {
  const topic = query.topic || "all";
  const difficulty = query.difficulty || "all";
  const limit = Number(query.limit || 0);

  const filtered = questions.filter((question) => {
    const topicMatch = topic === "all" || question.topic === topic;
    const difficultyMatch = difficulty === "all" || question.difficulty === difficulty;
    return topicMatch && difficultyMatch;
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/public-settings", (_req, res) => {
  res.json({
    auth_required: true,
    app_name: "RBT Genius",
  });
});

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
    role: "student",
    plan: "free",
    token: createSessionToken(),
    password_hash: passwordData.hash,
    password_salt: passwordData.salt,
  };

  updateDb((current) => ({
    ...current,
    users: [...current.users, newUser],
  }));

  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } = newUser;
  res.status(201).json({ token: newUser.token, user: safeUser });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const db = readDb();
  const user = db.users.find((entry) => entry.email.toLowerCase() === email);

  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
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
        token: nextToken,
      };
      return updatedUser;
    }),
  }));

  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } = updatedUser;
  res.json({ token: nextToken, user: safeUser });
});

app.get("/api/auth/me", requireUser, (req, res) => {
  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } =
    req.currentUser;
  res.json(safeUser);
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
  const questions = getQuestionBank(mode);
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
        plan: updates.plan ?? user.plan,
      };
      return updatedUser;
    }),
  }));

  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...safeUser } = updatedUser;
  res.json(safeUser);
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
