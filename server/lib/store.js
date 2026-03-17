import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  baseQuestions,
  buildFlashcardBank,
  buildMockExamQuestionSet,
  buildPracticeQuestionBank,
} from "../../src/lib/question-bank.js";
import {
  computeProgress,
} from "../../src/lib/backend-core.js";
import { buildSeedDb, normalizeDb } from "./seed.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const dbFile = path.join(dataDir, "db.json");

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(buildSeedDb(), null, 2));
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(dbFile, "utf8");
  return normalizeDb(JSON.parse(raw));
}

export function writeDb(nextDb) {
  ensureDb();
  const payload = {
    ...nextDb,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(dbFile, JSON.stringify(payload, null, 2));
  return payload;
}

export function updateDb(updater) {
  const current = readDb();
  const next = updater(current);
  return writeDb(next);
}

export function getUserFromToken(token) {
  const db = readDb();
  return db.users.find((user) => user.token === token) || null;
}

export function getQuestionBank(mode = "practice") {
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

export { computeProgress };
