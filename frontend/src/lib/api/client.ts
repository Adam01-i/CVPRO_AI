const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  statusCode?: number;
  detail?: string;

  constructor(message: string, statusCode?: number, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message ?? payload?.error ?? 'Une erreur est survenue.';
    throw new ApiError(message, response.status, payload?.details ?? payload?.message);
  }

  return payload as T;
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cvpro-token');
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cvpro-token', token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cvpro-token');
}
