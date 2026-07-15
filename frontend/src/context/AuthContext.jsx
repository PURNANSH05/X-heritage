import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'heritagex-auth';

// Demo/default users pre-seeded so the app works out of the box
const DEFAULT_USERS = [
  {
    id: 'u-demo',
    name: 'Demo Explorer',
    email: 'demo@heritagex.com',
    password: 'heritage123',
    avatar: 'DE',
    joinedAt: '2025-01-01'
  }
];

function loadUsers() {
  try {
    const raw = localStorage.getItem('heritagex-users');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_USERS;
}

function saveUsers(users) {
  try {
    localStorage.setItem('heritagex-users', JSON.stringify(users));
  } catch {}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSession(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const session = loadSession();
    if (session) setUser(session);
    setReady(true);
  }, []);

  const login = useCallback((email, password) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (!found) {
      return { ok: false, error: 'Invalid email or password. Please try again.' };
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    saveSession(safeUser);
    return { ok: true, user: safeUser };
  }, []);

  const register = useCallback((name, email, password) => {
    const users = loadUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const initials = name
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: initials,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);
    saveSession(safeUser);
    return { ok: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout, isLoggedIn: !!user }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
