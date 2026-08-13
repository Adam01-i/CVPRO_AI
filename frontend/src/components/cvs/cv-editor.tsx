'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { aiApi } from '@/lib/api/ai.api';
import { cvsApi } from '@/lib/api/cvs.api';
import type { AiAnalysis, Certification, Cv, CvSkill, Education, Experience, Language, Project, CVImprovementResult } from '@/types/api';
import { CvPreview } from './cv-preview';

const steps = [
  { id: 'identity', label: 'Identité', hint: 'Informations principales' },
  { id: 'profile', label: 'Profil', hint: 'Résumé' },
  { id: 'experience', label: 'Expérience', hint: 'Parcours' },
  { id: 'education', label: 'Formation', hint: 'Diplômes' },
  { id: 'skills', label: 'Compétences', hint: 'Expertises' },
  { id: 'projects', label: 'Projets', hint: 'Réalisations' },
  { id: 'certifications', label: 'Certifs', hint: 'Prestations' },
  { id: 'languages', label: 'Langues', hint: 'Missions' },
  ...(typeof window !== 'undefined' ? [] : []),
] as const;

const emptyCvBase = {
  title: '',
  profession: '',
  summary: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
  portfolio: '',
  isActive: false,
};

function normalizeDate(value?: string) {
  if (!value) return undefined;
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function CvEditor({ cvId }: { cvId?: string }) {
  const router = useRouter();
  const { token, user } = useAuth();

  const [cv, setCv] = useState<Cv | null>(null);
  const [draft, setDraft] = useState<Record<string, string | boolean>>(emptyCvBase);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<CvSkill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [improvement, setImprovement] = useState<CVImprovementResult | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [phonesState, setPhonesState] = useState<any[]>([]);
  const [linksState, setLinksState] = useState<any[]>([]);

  const stepList = useMemo(
    () => [
      { id: 'identity', label: 'Identité', hint: 'Informations principales' },
      { id: 'profile', label: 'Profil', hint: 'Résumé' },
      { id: 'experience', label: 'Expérience', hint: 'Parcours' },
      { id: 'education', label: 'Formation', hint: 'Diplômes' },
      { id: 'skills', label: 'Compétences', hint: 'Expertises' },
      { id: 'projects', label: 'Projets', hint: 'Réalisations' },
      { id: 'certifications', label: 'Certifs', hint: 'Prestations' },
      { id: 'languages', label: 'Langues', hint: 'Missions' },
      ...(cvId ? [{ id: 'ai', label: 'IA', hint: 'Analyse' }] : []),
    ],
    [cvId],
  );

  const userName = useMemo(() => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Votre profil', [user]);

  const fetchCv = async () => {
    if (token && cvId) {
      try {
        const nextCv = await cvsApi.getById(token, cvId);
        setCv(nextCv);
        setDraft({
          title: nextCv.title ?? '',
          profession: nextCv.profession ?? '',
          summary: nextCv.summary ?? '',
          email: nextCv.email ?? '',
          phone: nextCv.phone ?? '',
          address: nextCv.address ?? '',
          linkedin: nextCv.linkedin ?? '',
          github: nextCv.github ?? '',
          portfolio: nextCv.portfolio ?? '',
          addressLine: nextCv.addressLine ?? '',
          postalCode: nextCv.postalCode ?? '',
          city: nextCv.city ?? '',
          country: nextCv.country ?? '',
          isActive: Boolean(nextCv.isActive),
        });
        setExperiences(nextCv.experiences ?? []);
        setEducations(nextCv.educations ?? []);
        setSkills(nextCv.skills ?? []);
        setProjects(nextCv.projects ?? []);
        setCertifications(nextCv.certifications ?? []);
        setLanguages(nextCv.languages ?? []);
        // load phones & links
        const phones = await cvsApi.listPhones(token, cvId);
        const links = await cvsApi.listLinks(token, cvId);
        setPhonesState(phones ?? []);
        setLinksState(links ?? []);
        setAnalysis(null);
        setImprovement(null);
      } catch {
        setError('Impossible de charger ce CV.');
      }
      return;
    }

    // visitor / local draft
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
        setExperiences([]);
        setEducations([]);
        setSkills([]);
        setProjects([]);
        setCertifications([]);
        setLanguages([]);
        setPhonesState([]);
        setLinksState([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // If user is authenticated, save server-side. Otherwise persist locally.
    if (cvId) {
      void fetchCv();
      return;
    }

    setDraft(emptyCvBase);
    setExperiences([]);
    setEducations([]);
    setSkills([]);
    setProjects([]);
    setCertifications([]);
    setLanguages([]);
    setAnalysis(null);
    setImprovement(null);
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
        // save draft locally
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
    const hasDraftContent = Object.values(draft).some((value) => typeof value === 'string' ? value.trim().length > 0 : Boolean(value));
    if (!hasDraftContent) return;

    const timer = setTimeout(() => {
      if (cvId || draft.title) {
        void saveCv({ auto: true });
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [cvId, draft, experiences, educations, skills, projects, certifications, languages, phonesState, linksState, token]);

  const resetSectionState = async () => {
    await fetchCv();
  };

  const activate = async () => {
    if (!token || !cvId) return;
    await cvsApi.activate(token, cvId);
    await fetchCv();
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

  // Phones (visitor or authenticated)
  const addPhone = async (payload: { label?: string; number: string; primary?: boolean }) => {
    if (token && cvId) {
      await cvsApi.createPhone(token, cvId, payload as any);
      const phones = await cvsApi.listPhones(token, cvId);
      setPhonesState(phones ?? []);
    } else {
      setPhonesState((prev) => [{ id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() }, ...prev]);
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

  // Links
  const addLink = async (payload: { type: string; label?: string; url: string }) => {
    if (token && cvId) {
      await cvsApi.createLink(token, cvId, payload as any);
      const links = await cvsApi.listLinks(token, cvId);
      setLinksState(links ?? []);
    } else {
      setLinksState((prev) => [{ id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() }, ...prev]);
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

  const removeExperience = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeExperience(token, cvId, id);
    await resetSectionState();
  };

  const removeEducation = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeEducation(token, cvId, id);
    await resetSectionState();
  };

  const removeSkill = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeSkill(token, cvId, id);
    await resetSectionState();
  };

  const removeProject = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeProject(token, cvId, id);
    await resetSectionState();
  };

  const removeCertification = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeCertification(token, cvId, id);
    await resetSectionState();
  };

  const removeLanguage = async (id: string) => {
    if (!token || !cvId) return;
    await cvsApi.removeLanguage(token, cvId, id);
    await resetSectionState();
  };

  const analyzeCv = async () => {
    if (!token || !cvId) return;
    const latest = await aiApi.analyzeCv(token, cvId);
    setAnalysis(latest);
  };

  const improveCv = async () => {
    if (!token || !cvId) return;
    const latest = await aiApi.improveCv(token, cvId);
    setImprovement(latest);
  };

  const renderStepContent = () => {
    switch (stepList[currentStep]?.id) {
      case 'identity':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 1</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Informations personnelles</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Identité</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Titre du CV
                <input value={String(draft.title ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white" placeholder="Ex : CV développeur full-stack" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Profession
                <input value={String(draft.profession ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, profession: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white" placeholder="Ex : Développeuse backend" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email
                <input value={String(draft.email ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white" placeholder={user?.email ?? 'email@exemple.com'} />
              </label>
              <div className="grid gap-2 text-sm font-medium text-slate-700">
                <div className="flex items-center justify-between">
                  <div>Téléphones</div>
                  <button type="button" onClick={() => {
                    const label = prompt('Libellé (ex: Mobile, Pro)') ?? undefined;
                    const number = prompt('Numéro (ex: +33 6 12 34 56 78)') ?? '';
                    if (number.trim()) void addPhone({ label, number: number.trim(), primary: false });
                  }} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">+ Ajouter un numéro</button>
                </div>
                <div className="flex flex-col gap-2">
                  {phonesState.length === 0 ? <div className="text-sm text-slate-500">Aucun numéro ajouté.</div> : phonesState.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <div className="text-sm font-medium">{p.label ?? 'Téléphone'}</div>
                        <div className="text-sm text-slate-700">{p.number}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => removePhoneLocal(p.id)} className="text-sm text-rose-600">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 grid gap-2">
                <div className="text-sm font-medium text-slate-700">Adresse</div>
                <input value={String(draft.addressLine ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, addressLine: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white" placeholder="Adresse (numéro, rue)" />
                <div className="grid grid-cols-3 gap-2">
                  <input value={String(draft.postalCode ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900" placeholder="Code postal" />
                  <input value={String(draft.city ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900" placeholder="Ville" />
                  <input value={String(draft.country ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, country: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900" placeholder="Pays" />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-700">Liens professionnels</div>
                  <button type="button" onClick={() => {
                    const type = prompt('Type (LINKEDIN, GITHUB, PORTFOLIO, PERSONAL, OTHER)') ?? 'OTHER';
                    const label = type === 'OTHER' ? prompt('Nom du lien (ex: Mon blog)') ?? undefined : undefined;
                    const url = prompt('URL complète (https://...)') ?? '';
                    if (url.trim()) void addLink({ type: type.toUpperCase(), label, url: url.trim() });
                  }} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">+ Ajouter un lien</button>
                </div>
                <div className="flex flex-col gap-2">
                  {linksState.length === 0 ? <div className="text-sm text-slate-500">Aucun lien ajouté.</div> : linksState.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <div className="text-sm font-medium">{l.type}{l.label ? ` · ${l.label}` : ''}</div>
                        <div className="text-sm text-slate-700">{l.url}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => removeLinkLocal(l.id)} className="text-sm text-rose-600">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      case 'profile':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 2</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Profil professionnel</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Résumé</span>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Résumé professionnel
              <textarea value={String(draft.summary ?? '')} onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))} rows={8} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white" placeholder="Décrivez votre profil, vos forces et le type de poste recherché." />
            </label>
          </section>
        );
      case 'experience':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 3</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Expériences</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Parcours</span>
            </div>
            <form onSubmit={createExperience} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="company" placeholder="Entreprise" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="position" placeholder="Poste" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="location" placeholder="Localisation" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="isCurrent" className="h-4 w-4" /> Poste actuel</label>
              <input type="date" name="startDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="endDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <textarea name="description" rows={4} placeholder="Description" className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter une expérience</button></div>
            </form>
            <div className="mt-4 space-y-3">
              {experiences.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune expérience ajoutée.</div> : null}
              {experiences.map((experience) => (
                <div key={experience.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{experience.position}</div>
                      <div className="text-sm text-slate-600">{experience.company}</div>
                    </div>
                    <button type="button" onClick={() => removeExperience(experience.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 4</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Formation</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Diplômes</span>
            </div>
            <form onSubmit={createEducation} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="institution" placeholder="Établissement" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="degree" placeholder="Diplôme" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="field" placeholder="Domaine" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="level" placeholder="Niveau" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="location" placeholder="Localisation" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="isCurrent" className="h-4 w-4" /> Formation actuelle</label>
              <input type="date" name="startDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="endDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <textarea name="description" rows={3} placeholder="Description" className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter une formation</button></div>
            </form>
            <div className="mt-4 space-y-3">
              {educations.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune formation ajoutée.</div> : null}
              {educations.map((education) => (
                <div key={education.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{education.degree}</div>
                      <div className="text-sm text-slate-600">{education.institution}</div>
                    </div>
                    <button type="button" onClick={() => removeEducation(education.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 5</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Compétences</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Expertises</span>
            </div>
            <form onSubmit={createSkill} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="name" placeholder="Nom de la compétence" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="category" placeholder="Catégorie" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <select name="level" defaultValue="INTERMEDIATE" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
                <option value="EXPERT">Expert</option>
              </select>
              <input type="number" min="0" step="1" name="years" placeholder="Années d'expérience" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter une compétence</button></div>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune compétence ajoutée.</div> : null}
              {skills.map((skill) => (
                <div key={skill.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  <span>{skill.skill.name}</span>
                  <button type="button" onClick={() => removeSkill(skill.id)} className="text-rose-600">×</button>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 6</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Projets</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Réalisations</span>
            </div>
            <form onSubmit={createProject} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="name" placeholder="Nom du projet" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="url" placeholder="URL" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="githubUrl" placeholder="GitHub" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="technologies" placeholder="Technologies" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="startDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="endDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <textarea name="description" rows={4} placeholder="Description" className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter un projet</button></div>
            </form>
            <div className="mt-4 space-y-3">
              {projects.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucun projet ajouté.</div> : null}
              {projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{project.name}</div>
                      <div className="text-sm text-slate-600">{project.technologies || 'Technologies non renseignées'}</div>
                    </div>
                    <button type="button" onClick={() => removeProject(project.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 7</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Certifications</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Prestations</span>
            </div>
            <form onSubmit={createCertification} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="name" placeholder="Nom de la certification" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="organization" placeholder="Organisation" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="credentialId" placeholder="Identifiant" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="credentialUrl" placeholder="URL" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="issueDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input type="date" name="expirationDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter une certification</button></div>
            </form>
            <div className="mt-4 space-y-3">
              {certifications.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune certification ajoutée.</div> : null}
              {certifications.map((certification) => (
                <div key={certification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{certification.name}</div>
                      <div className="text-sm text-slate-600">{certification.organization || 'Organisation non renseignée'}</div>
                    </div>
                    <button type="button" onClick={() => removeCertification(certification.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'languages':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 8</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Langues</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Missions</span>
            </div>
            <form onSubmit={createLanguage} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <input name="name" placeholder="Langue" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <input name="level" placeholder="Niveau" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              <div className="md:col-span-2 flex justify-end"><button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Ajouter une langue</button></div>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {languages.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune langue ajoutée.</div> : null}
              {languages.map((language) => (
                <div key={language.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  <span>{language.name}</span>
                  <button type="button" onClick={() => removeLanguage(language.id)} className="text-rose-600">×</button>
                </div>
              ))}
            </div>
          </section>
        );
      case 'ai':
        return (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 9</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Analyse IA</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Optimisation</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={analyzeCv} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900">Analyser mon CV</button>
              <button type="button" onClick={improveCv} className="rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600">Améliorer mon CV</button>
            </div>

            {analysis ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Score global</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{Math.round(Number(analysis.score ?? 0))}/100</div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{analysis.overallFeedback}</p>
                {analysis.strengths && analysis.strengths.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {(analysis.strengths as string[]).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
                {analysis.recommendations && analysis.recommendations.length > 0 ? (
                  <div className="mt-5">
                    <div className="text-sm font-semibold text-slate-900">Recommandations</div>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {(analysis.recommendations as string[]).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {improvement ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Amélioration proposée</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{Math.round(improvement.scoreAfter)}/100</div>
                <div className="mt-3 text-sm text-slate-700">Score avant : {Math.round(improvement.scoreBefore)} · Score après : {Math.round(improvement.scoreAfter)}</div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {improvement.recommendations.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}
          </section>
        );
      default:
        return null;
    }
  };

  if (!token) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">CV</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{cvId ? 'Édition du CV' : 'Construisons votre CV'}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void saveCv()} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              {saveState === 'saving' ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
            {cvId ? (
              <button type="button" onClick={activate} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Définir comme actif
              </button>
            ) : null}
            <Link href="/dashboard/cvs" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Retour à la liste
            </Link>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {stepList.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`rounded-full border px-3 py-2 text-left transition ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : isDone
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">{index + 1}</div>
                  <div className="mt-1 text-sm font-medium">{step.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {saveState === 'saved' ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Enregistré automatiquement.</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">
              {currentStep + 1} / {stepList.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(stepList.length - 1, prev + 1))}
                className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
              >
                {currentStep === stepList.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">Aperçu</div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Fixe</span>
            </div>
            <div className="max-h-[75vh] overflow-auto">
              <CvPreview cv={{ ...cv, ...draft, experiences, educations, skills, projects, certifications, languages }} userName={userName} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
