'use client';

import { CvMiniPreview } from '../preview/cv-mini-preview';
import { SAMPLE_CV } from '../templates/sample-cv';
import type { TemplateMeta } from '../templates/template-registry';

export function TemplateCard({
  template,
  selected,
  recommended,
  accentColor,
  onSelect,
}: {
  template: TemplateMeta;
  selected: boolean;
  recommended?: boolean;
  accentColor: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex flex-col overflow-hidden rounded-[18px] border bg-white p-2.5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        selected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'
      }`}
    >
      <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1">
        {recommended ? (
          <span className="rounded-full bg-[#2B4EFF] px-2 py-0.5 text-[9px] font-semibold text-white">Recommandé</span>
        ) : null}
        {template.isNew ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-800">Nouveau</span>
        ) : null}
        {template.isPopular ? (
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-semibold text-white">Populaire</span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
        <CvMiniPreview cv={{ ...SAMPLE_CV, templateId: template.id }} userName="Prénom Nom" accentColor={accentColor} />
      </div>

      <div className="mt-2.5 flex items-center justify-between px-0.5">
        <div>
          <p className="text-xs font-semibold text-slate-900">{template.name}</p>
          <p className="mt-0.5 text-[10px] capitalize text-slate-500">{template.designType} · {template.columns} col.</p>
        </div>
        {selected ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white" aria-hidden>✓</span>
        ) : null}
      </div>
    </button>
  );
}