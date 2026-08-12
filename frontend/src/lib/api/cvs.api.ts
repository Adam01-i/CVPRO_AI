import { Certification, Cv, CvSkill, Education, Experience, Language, Project } from '@/types/api';
import { apiRequest } from './client';

export const cvsApi = {
  list: (token: string) => apiRequest<{ data: Cv[]; count: number }>('/cvs', { method: 'GET' }, token),
  create: (token: string, payload: { title: string; summary?: string; profession?: string; email?: string; phone?: string; address?: string; linkedin?: string; github?: string; portfolio?: string }) =>
    apiRequest<Cv>('/cvs', { method: 'POST', body: JSON.stringify(payload) }, token),
  getById: (token: string, id: string) => apiRequest<Cv>(`/cvs/${id}`, { method: 'GET' }, token),
  update: (token: string, id: string, payload: Partial<Cv>) =>
    apiRequest<Cv>(`/cvs/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),
  remove: (token: string, id: string) => apiRequest<void>(`/cvs/${id}`, { method: 'DELETE' }, token),
  activate: (token: string, id: string) => apiRequest<Cv>(`/cvs/${id}/activate`, { method: 'PATCH' }, token),

  createExperience: (token: string, cvId: string, payload: Partial<Experience>) =>
    apiRequest<Experience>(`/cvs/${cvId}/experiences`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listExperiences: (token: string, cvId: string) =>
    apiRequest<Experience[]>(`/cvs/${cvId}/experiences`, { method: 'GET' }, token),
  removeExperience: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/experiences/${id}`, { method: 'DELETE' }, token),

  createEducation: (token: string, cvId: string, payload: Partial<Education>) =>
    apiRequest<Education>(`/cvs/${cvId}/educations`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listEducations: (token: string, cvId: string) =>
    apiRequest<Education[]>(`/cvs/${cvId}/educations`, { method: 'GET' }, token),
  removeEducation: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/educations/${id}`, { method: 'DELETE' }, token),

  createSkill: (token: string, cvId: string, payload: { name?: string; category?: string; level?: string; years?: number; skillId?: string }) =>
    apiRequest<CvSkill>(`/cvs/${cvId}/skills`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listSkills: (token: string, cvId: string) =>
    apiRequest<CvSkill[]>(`/cvs/${cvId}/skills`, { method: 'GET' }, token),
  removeSkill: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/skills/${id}`, { method: 'DELETE' }, token),

  createProject: (token: string, cvId: string, payload: Partial<Project>) =>
    apiRequest<Project>(`/cvs/${cvId}/projects`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listProjects: (token: string, cvId: string) =>
    apiRequest<Project[]>(`/cvs/${cvId}/projects`, { method: 'GET' }, token),
  removeProject: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/projects/${id}`, { method: 'DELETE' }, token),

  createCertification: (token: string, cvId: string, payload: Partial<Certification>) =>
    apiRequest<Certification>(`/cvs/${cvId}/certifications`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listCertifications: (token: string, cvId: string) =>
    apiRequest<Certification[]>(`/cvs/${cvId}/certifications`, { method: 'GET' }, token),
  removeCertification: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/certifications/${id}`, { method: 'DELETE' }, token),

  createLanguage: (token: string, cvId: string, payload: Partial<Language>) =>
    apiRequest<Language>(`/cvs/${cvId}/languages`, { method: 'POST', body: JSON.stringify(payload) }, token),
  listLanguages: (token: string, cvId: string) =>
    apiRequest<Language[]>(`/cvs/${cvId}/languages`, { method: 'GET' }, token),
  removeLanguage: (token: string, cvId: string, id: string) =>
    apiRequest<void>(`/cvs/${cvId}/languages/${id}`, { method: 'DELETE' }, token),
};
