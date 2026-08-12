import { AuthResponse, SafeUser } from '@/types/api';
import { apiRequest } from './client';

export const authApi = {
  register: (payload: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    apiRequest<SafeUser>('/auth/me', {
      method: 'GET',
    }, token),

  changePassword: (token: string, payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),
};
