'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { cvsApi } from '@/lib/api/cvs.api';
import { DEFAULT_TEMPLATE_ID, DEFAULT_ACCENT_COLOR } from '../templates/template-registry';
import type {
  Certification, Cv, CvLink, CvPhone, CvSkill,
  Education, Experience, Language, Project,
} from '@/types/api';

export type TemplateSelection = { templateId: string; accentColor: string };

function buildEmptyCvBase(initialTemplate?: TemplateSelection) {
  return {
    title: '', profession: '', summary: '', email: '',
    phone: '', address: '', linkedin: '', github: '', portfolio: '',
    addressLine: '', postalCode: '', city: '', country: '',
    isActive: false,
    templateId: initialTemplate?.templateId ?? DEFAULT_TEMPLATE_ID,
    accentColor: initialTemplate?.accentColor ?? DEFAULT_ACCENT_COLOR,
  };
}

function normalizeDate(value?: string) {
  if (!value) return undefined;
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function useCvEditor(cvId?: string, initialTemplate?: TemplateSelection) {
  const router = useRouter();
  const { token, user } = useAuth();
  const emptyCvBase = useMemo(() => buildEmptyCvBase(initialTemplate), [initialTemplate]);

  const [cv, setCv] = useState<Cv | null>(null);
  const [draft, setDraft] = useState<Record<string, string | boolean>>(emptyCvBase);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<CvSkill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [phonesState, setPhonesState] = useState<CvPhone[]>([]);
  const [linksState, setLinksState] = useState<CvLink[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const userName = useMemo(
    () => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Votre profil',
    [user],
  );

  const fetchCv = async () => {
    if (token && cvId) {
      try {
        const nextCv = await cvsApi.getById(token, cvId);
        setCv(nextCv);
        setDraft({
          title: nextCv.title ?? '', profession: nextCv.profession ?? '',
          summary: nextCv.summary ?? '', email: nextCv.email ?? '',
          phone: nextCv.phone ?? '', address: nextCv.address ?? '',
          linkedin: nextCv.linkedin ?? '', github: nextCv.github ?? '',
          portfolio: nextCv.portfolio ?? '', addressLine: nextCv.addressLine ?? '',
          postalCode: nextCv.postalCode ?? '', city: nextCv.city ?? '',
          country: nextCv.country ?? '', isActive: Boolean(nextCv.isActive),
          templateId: nextCv.templateId ?? DEFAULT_TEMPLATE_ID,
          accentColor: nextCv.accentColor ?? DEFAULT_ACCENT_COLOR,
        });
        setExperiences(nextCv.experiences ?? []);
        setEducations(nextCv.educations ?? []);
        setSkills(nextCv.skills ?? []);
        setProjects(nextCv.projects ?? []);
        setCertifications(nextCv.certifications ?? []);
        setLanguages(nextCv.languages ?? []);
        const phones = await cvsApi.listPhones(token, cvId);
        const links = await cvsApi.listLinks(token, cvId);
        setPhonesState(phones ?? []);
        setLinksState(links ?? []);
      } catch {
        setError('Impossible de charger ce CV.');
      }
      return;
    }
    try {
      const saved = localStorage.getItem(cvId ? `cv:draft:${cvId}` : 'cv:draft:local');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDraft((prev) => ({ ...prev, ...parsed.draft }));
        setExperiences(parsed.experiences ?? []);
        setEducations(parsed.educations ?? []);
        setSkills(parsed.skills ?? []);
        setProjects(parsed.projects ?? []);
        setCertifications(parsed.certifications ?? []);
        setLanguages(parsed.languages ?? []);
        setPhonesState(parsed.phones ?? []);
        setLinksState(parsed.links ?? []);
      } else {
        setDraft(emptyCvBase);
        setExperiences([]); setEducations([]); setSkills([]);
        setProjects([]); setCertifications([]); setLanguages([]);
        setPhonesState([]); setLinksState([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (cvId) { void fetchCv(); return; }
    setDraft(emptyCvBase);
    setExperiences([]); setEducations([]); setSkills([]);
    setProjects([]); setCertifications([]); setLanguages([]);
  }, [token, cvId]);

  const saveCv = async ({ auto = false }: { auto?: boolean } = {}) => {
    if (!token) return;
    const payload = {
      title: String(draft.title ?? '').trim(),
      profession: String(draft.profession ?? '').trim() || undefined,
      summary: String(draft.summary ?? '').trim() || undefined,
      email: String(draft.email ?? '').trim() || undefined,
      phone: String(draft.phone ?? '').trim() || undefined,
      address: String(draft.address ?? '').trim() || undefined,
      linkedin: String(draft.linkedin ?? '').trim() || undefined,
      github: String(draft.github ?? '').trim() || undefined,
      portfolio: String(draft.portfolio ?? '').trim() || undefined,
      addressLine: String(draft.addressLine ?? '').trim() || undefined,
      postalCode: String(draft.postalCode ?? '').trim() || undefined,
      city: String(draft.city ?? '').trim() || undefined,
      country: String(draft.country ?? '').trim() || undefined,
      templateId: String(draft.templateId ?? DEFAULT_TEMPLATE_ID),
      accentColor: String(draft.accentColor ?? DEFAULT_ACCENT_COLOR),
    };
    if (!payload.title) {
      if (!auto) setError('Le titre du CV est obligatoire.');
      return;
    }
    setSaveState('saving');
    setError(null);
    try {
      if (token) {
        if (cvId) {
          const updated = await cvsApi.update(token, cvId, payload);
          setCv(updated);
        } else {
          const created = await cvsApi.create(token, payload);
          router.replace(`/dashboard/cvs/${created.id}`);
        }
      } else {
        const key = cvId ? `cv:draft:${cvId}` : 'cv:draft:local';
        const toSave = { draft: payload, experiences, educations, skills, projects, certifications, languages, phones: phonesState, links: linksState };
        localStorage.setItem(key, JSON.stringify(toSave));
      }
      setSaveState('saved');
    } catch (e) {
      console.error(e);
      setSaveState('error');
      setError('La sauvegarde a échoué. Vérifiez les informations saisies.');
    }
  };

  useEffect(() => {
    const hasDraftContent = Object.values(draft).some((value) =>
      typeof value === 'string' ? value.trim().length > 0 : Boolean(value));
    if (!hasDraftContent) return;
    const timer = setTimeout(() => {
      if (cvId || draft.title) void saveCv({ auto: true });
    }, 900);
    return () => clearTimeout(timer);
  }, [cvId, draft, experiences, educations, skills, projects, certifications, languages, phonesState, linksState, token]);

  const resetSectionState = async () => { await fetchCv(); };

  const activate = async () => {
    if (!token || !cvId) return;
    await cvsApi.activate(token, cvId);
    await fetchCv();
  };

  const uploadPhoto = async (file: File) => {
    if (!token || !cvId) return;
    setPhotoUploading(true);
    try {
      const updated = await cvsApi.uploadPhoto(token, cvId, file);
      setCv(updated);
    } catch (e) {
      console.error(e);
      setError('Échec de l’envoi de la photo.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const removePhoto = async () => {
    if (!token || !cvId) return;
    await cvsApi.removePhoto(token, cvId);
    await fetchCv();
  };

  const applyTemplate = (selection: { templateId: string; accentColor: string }) => {
    setDraft((prev) => ({ ...prev, templateId: selection.templateId, accentColor: selection.accentColor }));
    // L'autosave existant (useEffect à 900ms) prend le relais automatiquement.
  };

  const createExperience = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      company: String(form.get('company') ?? '').trim(),
      position: String(form.get('position') ?? '').trim(),
      location: String(form.get('location') ?? '').trim() || undefined,
      description: String(form.get('description') ?? '').trim() || undefined,
      startDate: normalizeDate(String(form.get('startDate') ?? '')),
      endDate: normalizeDate(String(form.get('endDate') ?? '')) || undefined,
      isCurrent: Boolean(form.get('isCurrent')),
    };
    if (!payload.company || !payload.position || !payload.startDate) return;
    await cvsApi.createExperience(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const addPhone = async (payload: { label?: string; number: string; primary?: boolean }) => {
    if (token && cvId) {
      await cvsApi.createPhone(token, cvId, payload as any);
      const phones = await cvsApi.listPhones(token, cvId);
      setPhonesState(phones ?? []);
    } else {
      setPhonesState((prev) => [{ id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() } as CvPhone, ...prev]);
    }
  };

  const removePhoneLocal = async (id: string) => {
    if (token && cvId && !id.startsWith('local-')) {
      await cvsApi.removePhone(token, cvId, id);
      const phones = await cvsApi.listPhones(token, cvId);
      setPhonesState(phones ?? []);
    } else {
      setPhonesState((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const addLink = async (payload: { type: string; label?: string; url: string }) => {
    if (token && cvId) {
      await cvsApi.createLink(token, cvId, payload as any);
      const links = await cvsApi.listLinks(token, cvId);
      setLinksState(links ?? []);
    } else {
      setLinksState((prev) => [{ id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() } as CvLink, ...prev]);
    }
  };

  const removeLinkLocal = async (id: string) => {
    if (token && cvId && !id.startsWith('local-')) {
      await cvsApi.removeLink(token, cvId, id);
      const links = await cvsApi.listLinks(token, cvId);
      setLinksState(links ?? []);
    } else {
      setLinksState((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const createEducation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      institution: String(form.get('institution') ?? '').trim(),
      degree: String(form.get('degree') ?? '').trim(),
      field: String(form.get('field') ?? '').trim() || undefined,
      level: String(form.get('level') ?? '').trim() || undefined,
      location: String(form.get('location') ?? '').trim() || undefined,
      description: String(form.get('description') ?? '').trim() || undefined,
      startDate: normalizeDate(String(form.get('startDate') ?? '')),
      endDate: normalizeDate(String(form.get('endDate') ?? '')) || undefined,
      isCurrent: Boolean(form.get('isCurrent')),
    };
    if (!payload.institution || !payload.degree || !payload.startDate) return;
    await cvsApi.createEducation(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const createSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      category: String(form.get('category') ?? '').trim() || undefined,
      level: (String(form.get('level') ?? 'INTERMEDIATE') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') || 'INTERMEDIATE',
      years: Number(form.get('years') ?? 0) || undefined,
    };
    if (!payload.name) return;
    await cvsApi.createSkill(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const createProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      description: String(form.get('description') ?? '').trim() || undefined,
      url: String(form.get('url') ?? '').trim() || undefined,
      githubUrl: String(form.get('githubUrl') ?? '').trim() || undefined,
      technologies: String(form.get('technologies') ?? '').trim() || undefined,
      startDate: normalizeDate(String(form.get('startDate') ?? '')),
      endDate: normalizeDate(String(form.get('endDate') ?? '')) || undefined,
    };
    if (!payload.name) return;
    await cvsApi.createProject(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const createCertification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      organization: String(form.get('organization') ?? '').trim() || undefined,
      issueDate: normalizeDate(String(form.get('issueDate') ?? '')),
      expirationDate: normalizeDate(String(form.get('expirationDate') ?? '')) || undefined,
      credentialId: String(form.get('credentialId') ?? '').trim() || undefined,
      credentialUrl: String(form.get('credentialUrl') ?? '').trim() || undefined,
    };
    if (!payload.name) return;
    await cvsApi.createCertification(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const createLanguage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !cvId) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      level: String(form.get('level') ?? '').trim() || undefined,
    };
    if (!payload.name) return;
    await cvsApi.createLanguage(token, cvId, payload as any);
    event.currentTarget.reset();
    await resetSectionState();
  };

  const removeExperience = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeExperience(token, cvId, id); await resetSectionState(); };
  const removeEducation = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeEducation(token, cvId, id); await resetSectionState(); };
  const removeSkill = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeSkill(token, cvId, id); await resetSectionState(); };
  const removeProject = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeProject(token, cvId, id); await resetSectionState(); };
  const removeCertification = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeCertification(token, cvId, id); await resetSectionState(); };
  const removeLanguage = async (id: string) => { if (!token || !cvId) return; await cvsApi.removeLanguage(token, cvId, id); await resetSectionState(); };

  const sectionStatus = useMemo(() => {
    const hasText = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
    return {
      identity: hasText(draft.title) && (hasText(draft.email) || phonesState.length > 0) ? 'done' : hasText(draft.title) ? 'in_progress' : 'todo',
      profile: hasText(draft.summary) ? 'done' : 'todo',
      experience: experiences.length > 0 ? 'done' : 'todo',
      education: educations.length > 0 ? 'done' : 'todo',
      skills: skills.length > 0 ? 'done' : 'todo',
      projects: projects.length > 0 ? 'done' : 'todo',
      certifications: certifications.length > 0 ? 'done' : 'todo',
      languages: languages.length > 0 ? 'done' : 'todo',
    } as const;
  }, [draft, experiences, educations, skills, projects, certifications, languages, phonesState]);

  const progressPercent = useMemo(() => {
    const values = Object.values(sectionStatus);
    const done = values.filter((v) => v === 'done').length;
    return Math.round((done / values.length) * 100);
  }, [sectionStatus]);

  return {
    cv, draft, setDraft, experiences, educations, skills, projects,
    certifications, languages, phonesState, linksState,
    saveState, error, userName, photoUploading,
    sectionStatus, progressPercent,
    saveCv, activate, uploadPhoto, removePhoto,
    createExperience, createEducation, createSkill, createProject,
    createCertification, createLanguage,
    removeExperience, removeEducation, removeSkill, removeProject,
    removeCertification, removeLanguage,
    addPhone, removePhoneLocal, addLink, removeLinkLocal,
    applyTemplate,
  };
}