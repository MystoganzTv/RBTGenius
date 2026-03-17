function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("rbt_genius_auth_token") ||
    window.localStorage.getItem("access_token")
  );
}

async function request(path, options = {}) {
  const { headers = {}, body, token: tokenOverride, ...restOptions } = options;
  const token = tokenOverride || getAuthToken();
  const response = await fetch(path, {
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
  getAuthProviders() {
    return request("/api/auth/providers");
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
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `/api/auth/oauth/${provider}/start${createQuery({ redirectTo, origin })}`;
  },
  listQuestions(params) {
    return request(`/api/questions${createQuery(params)}`);
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
