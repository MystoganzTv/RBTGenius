import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const TOKEN_KEY = 'rbt_genius_auth_token';
const API_BASE = 'https://rbtgenius.com';

async function fetchDashboard(token) {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

function buildUser(rawUser, token, dashboard = {}) {
  const progress = dashboard.progress || {};
  return {
    id: rawUser.id,
    name: rawUser.full_name ?? rawUser.name ?? 'Student',
    email: rawUser.email,
    plan: rawUser.plan ?? 'free',
    role: rawUser.role ?? 'student',
    token,
    readiness: Math.round(progress.readiness_score ?? 0),
    streak: progress.study_streak_days ?? 0,
    completedQuestions: progress.total_questions_completed ?? 0,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) { setLoading(false); return; }

        const [meRes, dashboard] = await Promise.all([
          fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchDashboard(token),
        ]);

        if (!meRes.ok) {
          await AsyncStorage.removeItem(TOKEN_KEY);
          setLoading(false);
          return;
        }

        const rawUser = await meRes.json();
        setUser(buildUser(rawUser, token, dashboard));
      } catch {
        // Network error — keep user logged out
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    const { token, user: rawUser } = data;
    await AsyncStorage.setItem(TOKEN_KEY, token);

    const dashboard = await fetchDashboard(token);
    setUser(buildUser(rawUser, token, dashboard));
  };

  const register = async (fullName, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    const { token, user: rawUser } = data;
    await AsyncStorage.setItem(TOKEN_KEY, token);

    const dashboard = await fetchDashboard(token);
    setUser(buildUser(rawUser, token, dashboard));
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
