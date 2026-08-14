'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CvPreview } from '../preview/cv-preview';
import { CvEditorSidebar, type CvSectionId } from './cv-editor-sidebar';
import { useCvEditor } from './use-cv-editor';
import { CvContactForm } from './cv-contact-form';
import { CvProfileForm } from './cv-profile-form';
import { CvExperienceForm } from './cv-experience-form';
import { CvEducationForm } from './cv-education-form';
import { CvSkillsForm } from './cv-skills-form';
import { CvProjectsForm } from './cv-projects-form';
import { CvCertificationsForm } from './cv-certifications-form';
import { CvLanguagesForm } from './cv-languages-form';

const SECTION_ORDER: CvSectionId[] = [
  'identity', 'profile', 'experience', 'education',
  'skills', 'projects', 'certifications', 'languages',
];

export function CvEditorShell({ cvId }: { cvId?: string }) {
  const editor = useCvEditor(cvId);
  const [activeSection, setActiveSection] = useState<CvSectionId>('identity');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!editor) return null;

  const goToNext = () => {
    const idx = SECTION_ORDER.indexOf(activeSection);
    setActiveSection(SECTION_ORDER[Math.min(SECTION_ORDER.length - 1, idx + 1)]);
  };
  const goToPrev = () => {
    const idx = SECTION_ORDER.indexOf(activeSection);
    setActiveSection(SECTION_ORDER[Math.max(0, idx - 1)]);
  };

  const previewCv = {
    ...editor.cv,
    ...editor.draft,
    phones: editor.phonesState,
    links: editor.linksState,
    experiences: editor.experiences,
    educations: editor.educations,
    skills: editor.skills,
    projects: editor.projects,
    certifications: editor.certifications,
    languages: editor.languages,
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'identity':
        return <CvContactForm editor={editor} />;
      case 'profile':
        return <CvProfileForm editor={editor} />;
      case 'experience':
        return <CvExperienceForm editor={editor} />;
      case 'education':
        return <CvEducationForm editor={editor} />;
      case 'skills':
        return <CvSkillsForm editor={editor} />;
      case 'projects':
        return <CvProjectsForm editor={editor} />;
      case 'certifications':
        return <CvCertificationsForm editor={editor} />;
      case 'languages':
        return <CvLanguagesForm editor={editor} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-slate-50">
      {/* Sidebar desktop */}
      <div className="hidden w-[22%] min-w-[260px] max-w-[320px] lg:block">
        <CvEditorSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
          sectionStatus={editor.sectionStatus}
          progressPercent={editor.progressPercent}
          cvTitle={String(editor.draft.title ?? '')}
          onFinalize={() => void editor.saveCv()}
        />
      </div>

      {/* Drawer mobile */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[80%] max-w-[320px]">
            <CvEditorSidebar
              activeSection={activeSection}
              onSelect={(id) => { setActiveSection(id); setMobileNavOpen(false); }}
              sectionStatus={editor.sectionStatus}
              progressPercent={editor.progressPercent}
              cvTitle={String(editor.draft.title ?? '')}
              onFinalize={() => void editor.saveCv()}
            />
          </div>
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={() => setMobileNavOpen(false)}
            className="flex-1 bg-slate-900/40"
          />
        </div>
      ) : null}

      {/* Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
              aria-label="Ouvrir la navigation"
            >
              ☰
            </button>
            <Link href="/dashboard/cvs" className="text-sm font-medium text-slate-500 hover:text-slate-800">
              ← Retour
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 sm:inline" aria-live="polite">
              {editor.saveState === 'saving' ? 'Enregistrement…' : editor.saveState === 'saved' ? '✓ Enregistré' : ''}
            </span>
            {cvId ? (
              <button
                type="button"
                onClick={() => void editor.activate()}
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 md:inline-flex"
              >
                Définir comme actif
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white lg:hidden"
            >
              Aperçu
            </button>
          </div>
        </header>

        {editor.error ? (
          <div className="mx-4 mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 lg:mx-8">
            {editor.error}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Édition */}
          <div className="min-h-0 overflow-y-auto px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6">
              {renderSection()}

              <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-sm text-slate-500">
                  {SECTION_ORDER.indexOf(activeSection) + 1} / {SECTION_ORDER.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={activeSection === SECTION_ORDER[0]}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    {activeSection === SECTION_ORDER[SECTION_ORDER.length - 1] ? 'Terminer' : 'Suivant'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview desktop */}
          <div className="hidden min-h-0 overflow-y-auto border-l border-slate-200 bg-slate-100 px-6 py-8 lg:block">
            <CvPreview cv={previewCv} userName={editor.userName} />
          </div>
        </div>
      </div>

      {/* Preview mobile en overlay */}
      {mobilePreviewOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 lg:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <span className="text-sm font-semibold text-slate-900">Aperçu</span>
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              Fermer
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <CvPreview cv={previewCv} userName={editor.userName} />
          </div>
        </div>
      ) : null}
    </div>
  );
}