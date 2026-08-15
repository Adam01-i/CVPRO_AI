'use client';

import type { CvTemplateRenderProps } from '../../templates/template-registry';

function formatDate(date?: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function ClassicTemplate({ cv, userName, accentColor }: CvTemplateRenderProps) {
  const color = accentColor || '#0f172a';
  const phones = cv.phones && cv.phones.length > 0 ? cv.phones : cv.phone ? [{ id: 'legacy', number: cv.phone }] : [];

  return (
    <div className="h-full w-full px-10 py-10 font-[Georgia,serif] text-[13px] text-slate-800">
      <header className="border-b-2 pb-4" style={{ borderColor: color }}>
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">{userName}</h1>
        <p className="mt-1 text-[13px] font-medium" style={{ color }}>{cv.profession || 'Profession'}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
          {cv.email ? <span>{cv.email}</span> : null}
          {phones.map((p) => <span key={p.id}>{p.number}</span>)}
          {(cv.addressLine || cv.city) ? <span>{[cv.addressLine, cv.postalCode, cv.city].filter(Boolean).join(' · ')}</span> : null}
        </div>
      </header>

      <div className="mt-6 space-y-6">
        {cv.summary ? (
          <section>
            <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color }}>Profil</h2>
            <p className="text-[12.5px] leading-6 text-slate-700">{cv.summary}</p>
          </section>
        ) : null}

        {cv.experiences && cv.experiences.length > 0 ? (
          <section>
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color }}>Expérience professionnelle</h2>
            <div className="space-y-4">
              {cv.experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-slate-900">{exp.position}, {exp.company}</span>
                    <span className="whitespace-nowrap text-[11px] italic text-slate-500">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Présent' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description ? <p className="mt-1 text-[12px] leading-5 text-slate-700">{exp.description}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.educations && cv.educations.length > 0 ? (
          <section>
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color }}>Formation</h2>
            <div className="space-y-2">
              {cv.educations.map((edu: any) => (
                <div key={edu.id} className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-slate-900">{edu.degree}, {edu.institution}</span>
                  <span className="whitespace-nowrap text-[11px] italic text-slate-500">
                    {formatDate(edu.startDate)} — {edu.isCurrent ? 'Présent' : formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-2 gap-6">
          {cv.skills && cv.skills.length > 0 ? (
            <section>
              <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color }}>Compétences</h2>
              <ul className="space-y-1 text-[12px] text-slate-700">
                {cv.skills.map((s: any) => <li key={s.id}>• {s.skill?.name}</li>)}
              </ul>
            </section>
          ) : null}
          {cv.languages && cv.languages.length > 0 ? (
            <section>
              <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color }}>Langues</h2>
              <ul className="space-y-1 text-[12px] text-slate-700">
                {cv.languages.map((l: any) => <li key={l.id}>{l.name}{l.level ? ` — ${l.level}` : ''}</li>)}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}