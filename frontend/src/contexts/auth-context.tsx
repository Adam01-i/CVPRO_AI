'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/api/client';
import type { SafeUser } from '@/types/api';

type AuthContextValue = {
  user: SafeUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<SafeUser>;
  register: (payload: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<SafeUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((nextToken: string | null) => {
    if (nextToken) {
      setStoredToken(nextToken);
      setToken(nextToken);
      return;
    }

    clearStoredToken();
    setToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = token ?? getStoredToken();
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const nextUser = await authApi.me(activeToken);
      setUser(nextUser);
      setToken(activeToken);
    } catch (error) {
      persistToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [persistToken, token]);

  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      void authApi.me(savedToken)
        .then((nextUser) => setUser(nextUser))
        .catch(() => {
          persistToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, [persistToken]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await authApi.login(payload);
    persistToken(response.accessToken);
    setUser(response.user);
    router.push('/dashboard');
    return response.user;
  }, [persistToken, router]);

  const register = useCallback(async (payload: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    const response = await authApi.register(payload);
    persistToken(response.accessToken);
    setUser(response.user);
    router.push('/dashboard');
    return response.user;
  }, [persistToken, router]);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
    router.push('/login');
  }, [persistToken, router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }), [login, logout, refreshUser, token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
