import { AiAnalysis, CVImprovementResult } from '@/types/api';
import { apiRequest } from './client';

export const aiApi = {
  analyzeCv: (token: string, cvId: string) =>
    apiRequest<AiAnalysis>(`/ai/analyze/cv/${cvId}`, { method: 'POST' }, token),
  getLatestAnalysis: (token: string, cvId: string) =>
    apiRequest<AiAnalysis>(`/ai/analyze/cv/${cvId}/latest`, { method: 'GET' }, token),
  getAnalysisHistory: (token: string, cvId: string) =>
    apiRequest<{ data: AiAnalysis[]; meta: { total: number } }>(`/ai/analyze/cv/${cvId}/history`, { method: 'GET' }, token),
  improveCv: (token: string, cvId: string) =>
    apiRequest<CVImprovementResult>(`/ai/improve/cv/${cvId}`, { method: 'POST' }, token),
  getLatestImprovement: (token: string, cvId: string) =>
    apiRequest<CVImprovementResult>(`/ai/improve/cv/${cvId}/latest`, { method: 'GET' }, token),
  getImprovementHistory: (token: string, cvId: string) =>
    apiRequest<{ data: CVImprovementResult[]; meta: { total: number } }>(`/ai/improve/cv/${cvId}/history`, { method: 'GET' }, token),
};
