'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TEMPLATES, DEFAULT_TEMPLATE_ID, DEFAULT_ACCENT_COLOR } from '../templates/template-registry';
import { TemplateCard } from './template-card';
import { TemplateChooserSidebar, type Filters } from './template-chooser-sidebar';
import { ColorPicker } from './color-picker';

export type TemplateSelection = { templateId: string; accentColor: string };

const EMPTY_FILTERS: Filters = { designTypes: [], photo: 'any', columns: [], styleTags: [], popularity: [] };

export function TemplateChooser({
  onUseTemplate,
  onClose,
  initialSelection,
}: {
  onUseTemplate: (selection: TemplateSelection) => void;
  onClose?: () => void;
  initialSelection?: TemplateSelection;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialSelection?.templateId ?? DEFAULT_TEMPLATE_ID);
  const [accentColor, setAccentColor] = useState(initialSelection?.accentColor ?? DEFAULT_ACCENT_COLOR);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (filters.designTypes.length > 0 && !filters.designTypes.includes(t.designType)) return false;
      if (filters.photo === 'with' && !t.supportsPhoto) return false;
      if (filters.photo === 'without' && t.supportsPhoto) return false;
      if (filters.columns.length > 0 && !filters.columns.includes(t.columns)) return false;
      if (filters.styleTags.length > 0 && !filters.styleTags.some((s) => t.styleTags.includes(s))) return false;
      if (filters.popularity.includes('popular') && !t.isPopular) return false;
      if (filters.popularity.includes('new') && !t.isNew) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="fixed inset-0 flex bg-slate-50">
      {/* Sidebar sombre collée à gauche, couleur du bouton "Utiliser ce modèle" */}
      <div className="hidden w-[280px] shrink-0 overflow-y-auto bg-slate-900 px-6 py-8 lg:block">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-900">C</div>
          <span className="text-sm font-semibold tracking-tight text-white">CVPro AI</span>
        </Link>
        <TemplateChooserSidebar
          filters={filters}
          onChange={setFilters}
          resultCount={filteredTemplates.length}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      {/* Drawer mobile */}
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[85%] max-w-sm overflow-y-auto bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Filtres</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="text-sm font-medium text-slate-300">
                Fermer
              </button>
            </div>
            <TemplateChooserSidebar
              filters={filters}
              onChange={setFilters}
              resultCount={filteredTemplates.length}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          </div>
          <button type="button" aria-label="Fermer les filtres" onClick={() => setMobileFiltersOpen(false)} className="flex-1 bg-slate-900/40" />
        </div>
      ) : null}

      {/* Contenu principal */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">C</div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">CVPro AI</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
            >
              Filtres
            </button>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Choisissez votre modèle</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Commencez avec un modèle professionnel conçu pour mettre votre profil en valeur.
            </p>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Aucun modèle ne correspond à ces filtres pour le moment.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={template.id === selectedTemplateId}
                  accentColor={accentColor}
                  onSelect={() => setSelectedTemplateId(template.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-slate-200 bg-white p-6 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.15)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <ColorPicker value={accentColor} onChange={setAccentColor} />
            <button
              type="button"
              onClick={() => onUseTemplate({ templateId: selectedTemplateId, accentColor })}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              Utiliser ce modèle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}