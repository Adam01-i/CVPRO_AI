'use client';

import type { CvTemplateRenderProps } from '../../templates/template-registry';

function formatDate(date?: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function MinimalTemplate({ cv, userName, accentColor }: CvTemplateRenderProps) {
  const color = accentColor || '#0f172a';
  const phones = cv.phones && cv.phones.length > 0 ? cv.phones : cv.phone ? [{ id: 'legacy', number: cv.phone }] : [];

  return (
    <div className="h-full w-full px-12 py-12 font-[Inter,Segoe_UI,sans-serif] text-[13px] text-slate-800">
      <header>
        <h1 className="text-[24px] font-light tracking-tight text-slate-900">{userName}</h1>
        <div className="mt-2 h-[2px] w-8" style={{ backgroundColor: color }} aria-hidden />
        <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-slate-500">{cv.profession || 'Profession'}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500">
          {cv.email ? <span>{cv.email}</span> : null}
          {phones.map((p) => <span key={p.id}>{p.number}</span>)}
          {(cv.addressLine || cv.city) ? <span>{[cv.addressLine, cv.postalCode, cv.city].filter(Boolean).join(' · ')}</span> : null}
        </div>
      </header>

      <div className="mt-10 space-y-8">
        {cv.summary ? (
          <section>
            <p className="text-[12.5px] leading-7 text-slate-600">{cv.summary}</p>
          </section>
        ) : null}

        {cv.experiences && cv.experiences.length > 0 ? (
          <section>
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">Expérience</h2>
            <div className="space-y-5">
              {cv.experiences.map((exp: any) => (
                <div key={exp.id} className="grid grid-cols-[110px_1fr] gap-4">
                  <span className="text-[11px] text-slate-400">
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Présent' : formatDate(exp.endDate)}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{exp.position}</p>
                    <p className="text-[12px] text-slate-500">{exp.company}</p>
                    {exp.description ? <p className="mt-1 text-[12px] leading-5 text-slate-600">{exp.description}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.educations && cv.educations.length > 0 ? (
          <section>
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">Formation</h2>
            <div className="space-y-3">
              {cv.educations.map((edu: any) => (
                <div key={edu.id} className="grid grid-cols-[110px_1fr] gap-4">
                  <span className="text-[11px] text-slate-400">{formatDate(edu.startDate)}</span>
                  <div>
                    <p className="font-medium text-slate-900">{edu.degree}</p>
                    <p className="text-[12px] text-slate-500">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.skills && cv.skills.length > 0 ? (
          <section>
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">Compétences</h2>
            <p className="text-[12px] leading-6 text-slate-600">
              {cv.skills.map((s: any) => s.skill?.name).join(' · ')}
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}