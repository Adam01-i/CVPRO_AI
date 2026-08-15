'use client';

import { CvPage } from '../preview/cv-page';
import { CvTemplate } from '../preview/cv-template';
import { SAMPLE_CV } from '../templates/sample-cv';
import type { TemplateMeta } from '../templates/template-registry';

export function TemplateCard({
  template,
  selected,
  accentColor,
  onSelect,
}: {
  template: TemplateMeta;
  selected: boolean;
  accentColor: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        selected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'
      }`}
    >
      <div className="absolute left-5 top-5 z-10 flex gap-1.5">
        {template.isNew ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">Nouveau</span>
        ) : null}
        {template.isPopular ? (
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">Populaire</span>
        ) : null}
      </div>

      <div className="pointer-events-none aspect-[210/297] w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
        <div className="h-[1400px] w-[990px] origin-top-left scale-[0.567]">
          <CvPage pageNumber={1} totalPages={1}>
            <CvTemplate cv={{ ...SAMPLE_CV, templateId: template.id }} userName="Prénom Nom" photoUrl={null} accentColor={accentColor} />
          </CvPage>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1">
        <div>
          <p className="text-base font-semibold text-slate-900">{template.name}</p>
          <p className="mt-0.5 text-xs capitalize text-slate-500">{template.designType} · {template.columns} colonne{template.columns > 1 ? 's' : ''}</p>
        </div>
        {selected ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs text-white" aria-hidden>✓</span>
        ) : null}
      </div>
    </button>
  );
}