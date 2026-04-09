const DEBUG_STORAGE_KEY = "rbt_genius_native_auth_debug";
const DEBUG_EVENT_NAME = "rbt-genius-native-auth-debug";
const MAX_DEBUG_ENTRIES = 25;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readNativeAuthDebug() {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const value = storage.getItem(DEBUG_STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearNativeAuthDebug() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(DEBUG_STORAGE_KEY);

  window.dispatchEvent(
    new CustomEvent(DEBUG_EVENT_NAME, {
      detail: {
        entries: [],
      },
    }),
  );
}

export function logNativeAuthDebug(step, detail = "") {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const timestamp = new Date().toISOString();
  const nextEntry = {
    id: `${timestamp}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    step: String(step || "unknown"),
    detail: detail ? String(detail) : "",
  };

  const entries = [...readNativeAuthDebug(), nextEntry].slice(-MAX_DEBUG_ENTRIES);
  storage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(entries));

  window.dispatchEvent(
    new CustomEvent(DEBUG_EVENT_NAME, {
      detail: {
        entries,
        latest: nextEntry,
      },
    }),
  );
}

export { DEBUG_EVENT_NAME };
