import type {
  Certification,
  Cv,
  CvLink,
  CvPhone,
  CvSkill,
  Education,
  Experience,
  Language,
  Project,
} from "@/types/api";

import { apiRequest } from "./client";

export const cvsApi = {
  // =========================================================
  // CV
  // =========================================================

  list: (token: string) =>
    apiRequest<{ data: Cv[]; count: number }>(
      "/cvs",
      {
        method: "GET",
      },
      token,
    ),

  create: (
    token: string,
    payload: {
      title: string;
      summary?: string;
      profession?: string;
      email?: string;

      // Legacy
      phone?: string;
      address?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    },
  ) =>
    apiRequest<Cv>(
      "/cvs",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  getById: (token: string, id: string) =>
    apiRequest<Cv>(
      `/cvs/${id}`,
      {
        method: "GET",
      },
      token,
    ),

  update: (token: string, id: string, payload: Partial<Cv>) =>
    apiRequest<Cv>(
      `/cvs/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  remove: (token: string, id: string) =>
    apiRequest<void>(
      `/cvs/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  activate: (token: string, id: string) =>
    apiRequest<Cv>(
      `/cvs/${id}/activate`,
      {
        method: "PATCH",
      },
      token,
    ),

  // =========================================================
  // EXPERIENCES
  // =========================================================

  createExperience: (
    token: string,
    cvId: string,
    payload: Partial<Experience>,
  ) =>
    apiRequest<Experience>(
      `/cvs/${cvId}/experiences`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listExperiences: (token: string, cvId: string) =>
    apiRequest<Experience[]>(
      `/cvs/${cvId}/experiences`,
      {
        method: "GET",
      },
      token,
    ),

  updateExperience: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<Experience>,
  ) =>
    apiRequest<Experience>(
      `/cvs/${cvId}/experiences/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeExperience: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/experiences/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // EDUCATIONS
  // =========================================================

  createEducation: (token: string, cvId: string, payload: Partial<Education>) =>
    apiRequest<Education>(
      `/cvs/${cvId}/educations`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listEducations: (token: string, cvId: string) =>
    apiRequest<Education[]>(
      `/cvs/${cvId}/educations`,
      {
        method: "GET",
      },
      token,
    ),

  updateEducation: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<Education>,
  ) =>
    apiRequest<Education>(
      `/cvs/${cvId}/educations/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeEducation: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/educations/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // SKILLS
  // =========================================================

  createSkill: (
    token: string,
    cvId: string,
    payload: {
      name?: string;
      category?: string;
      level?: string;
      years?: number;
      skillId?: string;
    },
  ) =>
    apiRequest<CvSkill>(
      `/cvs/${cvId}/skills`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listSkills: (token: string, cvId: string) =>
    apiRequest<CvSkill[]>(
      `/cvs/${cvId}/skills`,
      {
        method: "GET",
      },
      token,
    ),

  updateSkill: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<CvSkill>,
  ) =>
    apiRequest<CvSkill>(
      `/cvs/${cvId}/skills/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeSkill: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/skills/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // PROJECTS
  // =========================================================

  createProject: (token: string, cvId: string, payload: Partial<Project>) =>
    apiRequest<Project>(
      `/cvs/${cvId}/projects`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listProjects: (token: string, cvId: string) =>
    apiRequest<Project[]>(
      `/cvs/${cvId}/projects`,
      {
        method: "GET",
      },
      token,
    ),

  updateProject: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<Project>,
  ) =>
    apiRequest<Project>(
      `/cvs/${cvId}/projects/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeProject: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/projects/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // PHONES
  // =========================================================

  createPhone: (
    token: string,
    cvId: string,
    payload: {
      label?: string;
      number: string;
      primary?: boolean;
    },
  ) =>
    apiRequest<CvPhone>(
      `/cvs/${cvId}/phones`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listPhones: (token: string, cvId: string) =>
    apiRequest<CvPhone[]>(`/cvs/${cvId}/phones`, { method: "GET" }, token),

  updatePhone: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<{
      label?: string;
      number?: string;
      primary?: boolean;
    }>,
  ) =>
    apiRequest<CvPhone>(
      `/cvs/${cvId}/phones/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removePhone: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/phones/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // LINKS
  // =========================================================

  createLink: (
    token: string,
    cvId: string,
    payload: {
      type: CvLink["type"];
      label?: string;
      url: string;
    },
  ) =>
    apiRequest<CvLink>(
      `/cvs/${cvId}/links`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listLinks: (token: string, cvId: string) =>
    apiRequest<CvLink[]>(`/cvs/${cvId}/links`, { method: "GET" }, token),

  updateLink: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<{
      type: CvLink["type"];
      label?: string;
      url?: string;
    }>,
  ) =>
    apiRequest<CvLink>(
      `/cvs/${cvId}/links/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeLink: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/links/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // CERTIFICATIONS
  // =========================================================

  createCertification: (
    token: string,
    cvId: string,
    payload: Partial<Certification>,
  ) =>
    apiRequest<Certification>(
      `/cvs/${cvId}/certifications`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listCertifications: (token: string, cvId: string) =>
    apiRequest<Certification[]>(
      `/cvs/${cvId}/certifications`,
      {
        method: "GET",
      },
      token,
    ),

  updateCertification: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<Certification>,
  ) =>
    apiRequest<Certification>(
      `/cvs/${cvId}/certifications/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeCertification: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/certifications/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  // =========================================================
  // LANGUAGES
  // =========================================================

  createLanguage: (token: string, cvId: string, payload: Partial<Language>) =>
    apiRequest<Language>(
      `/cvs/${cvId}/languages`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    ),

  listLanguages: (token: string, cvId: string) =>
    apiRequest<Language[]>(
      `/cvs/${cvId}/languages`,
      {
        method: "GET",
      },
      token,
    ),

  updateLanguage: (
    token: string,
    cvId: string,
    id: string,
    payload: Partial<Language>,
  ) =>
    apiRequest<Language>(
      `/cvs/${cvId}/languages/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      token,
    ),

  removeLanguage: (token: string, cvId: string, id: string) =>
    apiRequest<void>(
      `/cvs/${cvId}/languages/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),
};
