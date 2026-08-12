import { SafeUser } from '@/types/api';
import { apiRequest } from './client';

export const usersApi = {
  me: (token: string) => apiRequest<SafeUser>('/users/me', { method: 'GET' }, token),
  updateMe: (token: string, payload: Partial<SafeUser>) =>
    apiRequest<SafeUser>('/users/me', { method: 'PATCH', body: JSON.stringify(payload) }, token),
  deleteMe: (token: string) => apiRequest<void>('/users/me', { method: 'DELETE' }, token),
};
