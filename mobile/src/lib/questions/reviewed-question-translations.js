import reviewedQuestionTranslationsEs from "./question-translations-es.json";
import { questionConceptLookup } from "./question-bank.js";

// `options_es` is not consistently shaped. Of the 490 concept entries, 92 key
// their options by the English option text (what the lookup expects), 131 key
// them only by the field name ("answer"/"purpose"), and 267 mix both.
//
// Those field-name keys are not option texts. Including them in the global
// lookup was actively harmful: all 398 entries that use them collide on the
// same two keys, so `lookup["purpose"]` ended up holding whichever concept
// happened to be parsed last.
const FIELD_NAME_KEYS = new Set(["answer", "purpose", "definition", "scenario", "explanation"]);

const reviewedOptionLookup = Object.values(reviewedQuestionTranslationsEs || {}).reduce((result, entry) => {
  const options = entry?.options_es || {};
  for (const [english, spanish] of Object.entries(options)) {
    if (FIELD_NAME_KEYS.has(english)) continue;
    if (english?.trim() && spanish?.trim()) {
      result[english.trim()] = spanish.trim();
    }
  }
  return result;
}, {});

// Fallback lookup, English option text -> reviewed Spanish.
//
// Every answer option is, by construction, either the `answer` or the `purpose`
// of some concept — distractors are pulled from other concepts in the same
// topic. So when a concept's `options_es` doesn't list a given distractor, the
// translation still exists: it lives on the concept that owns that text.
//
// Without this, half of all option texts (467 of 932) resolved to an empty
// string and the UI showed "Spanish translation is not available yet".
const conceptOwnedTextLookup = Object.values(questionConceptLookup || {}).reduce((result, concept) => {
  const reviewed = reviewedQuestionTranslationsEs?.[concept?.id];
  if (!reviewed) return result;

  const english = { answer: concept?.answer, purpose: concept?.purpose };
  for (const field of ["answer", "purpose"]) {
    const en = String(english[field] || "").trim();
    const es = String(reviewed[field] || "").trim();
    if (en && es && !result[en]) {
      result[en] = es;
    }
  }
  return result;
}, {});

function stripTrailingPeriod(text) {
  return String(text || "").replace(/[.。]+$/, "").trim();
}

function stripLeadingPara(text) {
  return String(text || "").replace(/^para\s+/i, "").trim();
}

export function getConceptTranslationEs(conceptId) {
  return reviewedQuestionTranslationsEs?.[conceptId] || null;
}

export function getSpanishForOptionText(englishText) {
  const key = String(englishText || "").trim();
  return reviewedOptionLookup[key] || conceptOwnedTextLookup[key] || "";
}

function buildReviewedQuestionText(question, reviewed) {
  if (!reviewed) return "";
  const kind = question?.id?.split("_").pop();

  if (kind === "definition" && reviewed.definition) {
    return `¿Qué concepto corresponde a esta definición: ${stripTrailingPeriod(reviewed.definition)}?`;
  }

  if (kind === "scenario" && reviewed.scenario) {
    return `${reviewed.scenario} ¿Qué concepto corresponde mejor?`;
  }

  if (kind === "purpose" && reviewed.answer) {
    return `¿Cuál es el objetivo principal de ${stripTrailingPeriod(reviewed.answer)}?`;
  }

  return reviewed.scenario || reviewed.definition || reviewed.answer || "";
}

function buildReviewedExplanationText(question, reviewed) {
  if (!reviewed) return "";
  const kind = question?.id?.split("_").pop();

  if (kind === "purpose" && reviewed.explanation && reviewed.purpose) {
    return `${reviewed.explanation} El objetivo principal es ${stripTrailingPeriod(stripLeadingPara(reviewed.purpose))}.`;
  }

  return reviewed.explanation || "";
}

export function buildQuestionTranslationContent(question) {
  if (!question) return null;

  const reviewed = getConceptTranslationEs(question.concept_id);
  const questionTextEs = buildReviewedQuestionText(question, reviewed);
  const explanationEs = buildReviewedExplanationText(question, reviewed);
  const options = (question.options || []).map((option) => ({
    label: option.label,
    english: option.text || "",
    spanish: reviewed?.options_es?.[String(option.text || "").trim()] || getSpanishForOptionText(option.text) || "",
  }));

  return {
    conceptId: question.concept_id,
    englishText: question.text || "",
    spanishText: questionTextEs,
    explanationEnglish: question.explanation || "",
    explanationSpanish: explanationEs,
    options,
  };
}
