import { Capacitor } from "@capacitor/core";
import { appParams } from "@/lib/app-params";

const DEFAULT_NATIVE_APP_BASE_URL = "https://rbtgenius.com";
export const NATIVE_AUTH_CALLBACK_SCHEME = "rbtgenius";
export const NATIVE_AUTH_CALLBACK_ORIGIN = `${NATIVE_AUTH_CALLBACK_SCHEME}://auth`;

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("rbt_genius_auth_token") ||
    window.localStorage.getItem("access_token")
  );
}

function trimTrailingSlash(value = "") {
  return String(value).replace(/\/+$/, "");
}

function isHtmlResponse(value) {
  return typeof value === "string" && /<(?:!doctype|html|head|body)\b/i.test(value);
}

export function isNativeAppRuntime() {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

export function getAppBaseUrl() {
  const configuredBaseUrl = trimTrailingSlash(appParams.appBaseUrl || "");
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  return isNativeAppRuntime() ? DEFAULT_NATIVE_APP_BASE_URL : "";
}

export function resolveApiUrl(path) {
  if (!path) {
    return getAppBaseUrl() || "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getAppBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export function getOAuthFrontendOrigin() {
  if (isNativeAppRuntime()) {
    return NATIVE_AUTH_CALLBACK_ORIGIN;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return getAppBaseUrl();
}

async function request(path, options = {}) {
  const { headers = {}, body, token: tokenOverride, ...restOptions } = options;
  const token = tokenOverride || getAuthToken();
  const requestUrl = resolveApiUrl(path);
  const response = await fetch(requestUrl, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (response.ok && isHtmlResponse(data) && String(requestUrl).includes("/api/")) {
    throw new Error("The app is not connected to the API correctly yet.");
  }

  if (!response.ok) {
    const error = new Error(data?.message || response.statusText || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function createQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const api = {
  getPublicSettings() {
    return request("/api/public-settings");
  },
  getAuthProviders(options = {}) {
    return request("/api/auth/providers", options).then((data) => ({
      ...data,
      providers: Array.isArray(data?.providers) ? data.providers : [],
    }));
  },
  register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },
  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },
  getMe(token) {
    return request("/api/auth/me", token ? { token } : {});
  },
  logout() {
    return request("/api/auth/logout", { method: "POST" });
  },
  getOAuthStartUrl(provider, redirectTo = "/") {
    return resolveApiUrl(
      `/api/auth/oauth/${provider}/start${createQuery({
        redirectTo,
        origin: getOAuthFrontendOrigin(),
      })}`,
    );
  },
  listQuestions(params) {
    return request(`/api/questions${createQuery(params)}`).then((data) =>
      Array.isArray(data) ? data : Array.isArray(data?.questions) ? data.questions : [],
    );
  },
  getPracticeSession() {
    return request("/api/practice/session");
  },
  savePracticeSession(session) {
    return request("/api/practice/session", {
      method: "PUT",
      body: session,
    });
  },
  clearPracticeSession() {
    return request("/api/practice/session", { method: "DELETE" });
  },
  listAttempts() {
    return request("/api/question-attempts");
  },
  createAttempt(payload) {
    return request("/api/question-attempts", {
      method: "POST",
      body: payload,
    });
  },
  listMockExams() {
    return request("/api/mock-exams");
  },
  createMockExam(payload) {
    return request("/api/mock-exams", {
      method: "POST",
      body: payload,
    });
  },
  getDashboard() {
    return request("/api/dashboard");
  },
  getAnalytics() {
    return request("/api/analytics");
  },
  getProfile() {
    return request("/api/profile");
  },
  updateProfile(payload) {
    return request("/api/profile", {
      method: "PATCH",
      body: payload,
    });
  },
  resetProfileProgress(payload) {
    return request("/api/profile/reset-progress", {
      method: "POST",
      body: payload,
    });
  },
  createCheckoutSession(plan, origin) {
    return request("/api/billing/checkout", {
      method: "POST",
      body: {
        plan,
        origin:
          origin || (typeof window !== "undefined" ? window.location.origin : undefined),
      },
    });
  },
  confirmCheckout(sessionId) {
    return request("/api/billing/confirm", {
      method: "POST",
      body: { session_id: sessionId },
    });
  },
  createBillingPortal(origin) {
    return request("/api/billing/portal", {
      method: "POST",
      body: {
        origin:
          origin || (typeof window !== "undefined" ? window.location.origin : undefined),
      },
    });
  },
  syncMobileBilling(payload) {
    return request("/api/billing/mobile/sync", {
      method: "POST",
      body: payload,
    });
  },
  listAdminMembers() {
    return request("/api/admin/members");
  },
  getAdminMemberPayments(memberId) {
    return request(`/api/admin/members/${memberId}/payments`);
  },
  updateAdminMember(memberId, payload) {
    return request(`/api/admin/members/${memberId}`, {
      method: "PATCH",
      body: payload,
    });
  },
  deleteAdminMember(memberId) {
    return request(`/api/admin/members/${memberId}`, {
      method: "DELETE",
    });
  },
  listTutorConversations() {
    return request("/api/ai-tutor/conversations");
  },
  createTutorConversation(payload) {
    return request("/api/ai-tutor/conversations", {
      method: "POST",
      body: payload,
    });
  },
  sendTutorMessage(conversationId, payload) {
    return request(`/api/ai-tutor/conversations/${conversationId}/messages`, {
      method: "POST",
      body: payload,
    });
  },
};
