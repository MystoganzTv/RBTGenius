import { getStore } from "@netlify/blobs";
import {
  DEMO_TOKEN,
  computeProgress,
  defaultUser,
} from "../../src/lib/backend-core.js";
import {
  baseQuestions,
  buildFlashcardBank,
  buildMockExamQuestionSet,
  buildPracticeQuestionBank,
  topicLabels,
} from "../../src/lib/question-bank.js";

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

function createSeedDb() {
  return {
    users: [defaultUser],
    attempts: [],
    mockExams: [],
    payments: [],
    practiceSessions: {},
    tutorConversations: {},
    customQuestions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function readDb() {
  const db = await store.get("db", { type: "json" });
  if (db) {
    return db;
  }

  const seed = createSeedDb();
  await store.setJSON("db", seed);
  return seed;
}

async function writeDb(nextDb) {
  const payload = {
    ...nextDb,
    updatedAt: new Date().toISOString(),
  };
  await store.setJSON("db", payload);
  return payload;
}

async function updateDb(updater) {
  const current = await readDb();
  const next = updater(current);
  return writeDb(next);
}

function getQuestionBank(mode = "practice") {
  if (mode === "flashcards") {
    return buildFlashcardBank();
  }

  if (mode === "mock") {
    return buildMockExamQuestionSet();
  }

  if (mode === "base") {
    return baseQuestions;
  }

  return buildPracticeQuestionBank();
}

function applyQuestionFilters(questions, searchParams) {
  const topic = searchParams.get("topic") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const limit = Number(searchParams.get("limit") || 0);

  const filtered = questions.filter((question) => {
    const topicMatch = topic === "all" || question.topic === topic;
    const difficultyMatch = difficulty === "all" || question.difficulty === difficulty;
    return topicMatch && difficultyMatch;
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

function getToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return DEMO_TOKEN;
  }

  return authHeader.slice("Bearer ".length);
}

async function getCurrentUser(request) {
  const db = await readDb();
  return db.users.find((user) => user.token === getToken(request)) || db.users[0] || null;
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

function getApiPath(url) {
  const { pathname } = new URL(url);
  return pathname
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "") || "/";
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
    return json({ auth_required: false, app_name: "RBT Genius" });
  }

  if (apiPath === "/auth/me" && request.method === "GET") {
    const auth = await requireUser(request);
    if (auth.error) {
      return auth.error;
    }

    return json(auth.user);
  }

  if (apiPath === "/auth/logout" && request.method === "POST") {
    return json({ ok: true });
  }

  if (apiPath === "/questions" && request.method === "GET") {
    const mode = url.searchParams.get("mode") || "practice";
    const questions = getQuestionBank(mode);
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
      user: auth.user,
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
          plan: updates.plan ?? user.plan,
        };

        return updatedUser;
      }),
    }));

    return json(updatedUser);
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
