'use client';

import type { TemplateDesignType, TemplateStyleTag } from '../templates/template-registry';

export type Filters = {
  designTypes: TemplateDesignType[];
  photo: 'any' | 'with' | 'without';
  columns: (1 | 2)[];
  styleTags: TemplateStyleTag[];
  popularity: ('popular' | 'new')[];
};

const DESIGN_OPTIONS: TemplateDesignType[] = ['moderne', 'classique', 'minimaliste', 'creatif', 'professionnel'];
const STYLE_OPTIONS: TemplateStyleTag[] = ['sobre', 'elegant', 'impactant', 'ats'];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm capitalize text-slate-300 transition hover:text-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-white/20 bg-white/5 text-white accent-white"
      />
      {label}
    </label>
  );
}

export function TemplateChooserSidebar({
  filters,
  onChange,
  resultCount,
  onReset,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
  onReset: () => void;
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Filtres</h2>
        <button type="button" onClick={onReset} className="text-xs font-medium text-slate-400 underline-offset-2 hover:text-white hover:underline">
          Réinitialiser
        </button>
      </div>

      <p className="text-xs text-slate-500">{resultCount} modèle{resultCount > 1 ? 's' : ''}</p>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-white">Type de design</legend>
        <div className="space-y-2.5">
          {DESIGN_OPTIONS.map((option) => (
            <Checkbox
              key={option}
              checked={filters.designTypes.includes(option)}
              onChange={() => onChange({ ...filters, designTypes: toggle(filters.designTypes, option) })}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-white">Photo</legend>
        <div className="space-y-2.5">
          {(['with', 'without'] as const).map((option) => (
            <Checkbox
              key={option}
              checked={filters.photo === option}
              onChange={() => onChange({ ...filters, photo: filters.photo === option ? 'any' : option })}
              label={option === 'with' ? 'Avec photo' : 'Sans photo'}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-white">Colonnes</legend>
        <div className="space-y-2.5">
          {([1, 2] as const).map((option) => (
            <Checkbox
              key={option}
              checked={filters.columns.includes(option)}
              onChange={() => onChange({ ...filters, columns: toggle(filters.columns, option) })}
              label={`${option} colonne${option > 1 ? 's' : ''}`}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-white">Style</legend>
        <div className="space-y-2.5">
          {STYLE_OPTIONS.map((option) => (
            <Checkbox
              key={option}
              checked={filters.styleTags.includes(option)}
              onChange={() => onChange({ ...filters, styleTags: toggle(filters.styleTags, option) })}
              label={option === 'ats' ? 'ATS-friendly' : option}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-white">Popularité</legend>
        <div className="space-y-2.5">
          {([['popular', 'Populaires'], ['new', 'Nouveautés']] as const).map(([value, label]) => (
            <Checkbox
              key={value}
              checked={filters.popularity.includes(value)}
              onChange={() => onChange({ ...filters, popularity: toggle(filters.popularity, value) })}
              label={label}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}