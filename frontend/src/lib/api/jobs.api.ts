import { JobApplication, JobOffer } from '@/types/api';
import { apiRequest } from './client';

export const jobsApi = {
  listOffers: (token?: string, params?: Record<string, string | number | boolean | undefined>) => {
    const search = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    });
    const suffix = search.toString() ? `?${search.toString()}` : '';
    return apiRequest<{ data: JobOffer[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(`/jobs/offers${suffix}`, { method: 'GET' }, token);
  },
  getOffer: (id: string, token?: string) => apiRequest<JobOffer>(`/jobs/offers/${id}`, { method: 'GET' }, token),
  myApplications: (token: string) => apiRequest<JobApplication[]>('/jobs/applications/me', { method: 'GET' }, token),
  apply: (token: string, offerId: string, payload: { cvId?: string; coverLetter?: string }) =>
    apiRequest<JobApplication>(`/jobs/offers/${offerId}/apply`, { method: 'POST', body: JSON.stringify(payload) }, token),
};
