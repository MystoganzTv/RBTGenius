import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAvailableAsync, requestReview } from 'expo-store-review';

const REVIEW_STATE_KEY = 'rbt_review_prompt_state_v1';
const REVIEW_WINDOW_SIZE = 10;
const MIN_CORRECT_ANSWERS = 8;
const REVIEW_COOLDOWN_MS = 120 * 24 * 60 * 60 * 1000;

let reviewCheckInFlight = false;

function readState(rawState) {
  if (!rawState) return { recentResults: [], lastPromptAt: 0 };

  try {
    const parsed = JSON.parse(rawState);
    return {
      recentResults: Array.isArray(parsed?.recentResults)
        ? parsed.recentResults.filter(result => typeof result === 'boolean').slice(-REVIEW_WINDOW_SIZE)
        : [],
      lastPromptAt: Number.isFinite(parsed?.lastPromptAt) ? parsed.lastPromptAt : 0,
    };
  } catch {
    return { recentResults: [], lastPromptAt: 0 };
  }
}

async function requestNativeReview(now) {
  const available = await isAvailableAsync();
  if (!available) return false;

  // Persist before opening StoreKit so quick taps cannot trigger duplicates.
  await AsyncStorage.setItem(REVIEW_STATE_KEY, JSON.stringify({
    recentResults: [],
    lastPromptAt: now,
  }));
  await requestReview();
  return true;
}

/**
 * Records a free-practice result and asks for an App Store rating only after a
 * genuinely positive milestone. StoreKit still decides whether to display its
 * native prompt, so this function intentionally fails silently.
 */
export async function recordPracticeResultForReview(isCorrect) {
  if (reviewCheckInFlight) return false;
  reviewCheckInFlight = true;

  try {
    const storedState = await AsyncStorage.getItem(REVIEW_STATE_KEY);
    const state = readState(storedState);
    const recentResults = [...state.recentResults, Boolean(isCorrect)].slice(-REVIEW_WINDOW_SIZE);
    const now = Date.now();
    const cooldownComplete = !state.lastPromptAt || now - state.lastPromptAt >= REVIEW_COOLDOWN_MS;
    const correctAnswers = recentResults.filter(Boolean).length;
    const reachedPositiveMilestone = (
      isCorrect
      && recentResults.length === REVIEW_WINDOW_SIZE
      && correctAnswers >= MIN_CORRECT_ANSWERS
      && cooldownComplete
    );

    if (!reachedPositiveMilestone) {
      await AsyncStorage.setItem(REVIEW_STATE_KEY, JSON.stringify({
        recentResults,
        lastPromptAt: state.lastPromptAt,
      }));
      return false;
    }

    const prompted = await requestNativeReview(now);
    if (!prompted) {
      await AsyncStorage.setItem(REVIEW_STATE_KEY, JSON.stringify({
        recentResults,
        lastPromptAt: state.lastPromptAt,
      }));
    }
    return prompted;
  } catch {
    return false;
  } finally {
    reviewCheckInFlight = false;
  }
}

/**
 * Preserves the existing successful-mock-exam prompt while making it share the
 * same cooldown as free practice.
 */
export async function requestReviewAfterPositiveMilestone() {
  if (reviewCheckInFlight) return false;
  reviewCheckInFlight = true;

  try {
    const storedState = await AsyncStorage.getItem(REVIEW_STATE_KEY);
    const state = readState(storedState);
    const now = Date.now();
    const cooldownComplete = !state.lastPromptAt || now - state.lastPromptAt >= REVIEW_COOLDOWN_MS;
    if (!cooldownComplete) return false;
    return await requestNativeReview(now);
  } catch {
    return false;
  } finally {
    reviewCheckInFlight = false;
  }
}
