'use client';

import type { CvTemplateProps } from '../cv-template';

function formatDate(date?: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function ModernTemplate({ cv, userName, photoUrl, accentColor }: CvTemplateProps) {
  const color = accentColor || '#0f172a';

  const phones = cv.phones && cv.phones.length > 0
    ? cv.phones
    : cv.phone ? [{ id: 'legacy', number: cv.phone }] : [];

  const links = cv.links && cv.links.length > 0
    ? cv.links
    : [
        cv.linkedin ? { id: 'li', type: 'LINKEDIN', url: cv.linkedin } : null,
        cv.github ? { id: 'gh', type: 'GITHUB', url: cv.github } : null,
        cv.portfolio ? { id: 'pf', type: 'PORTFOLIO', url: cv.portfolio } : null,
      ].filter(Boolean) as { id: string; type: string; url: string }[];

  return (
    <div className="flex h-full w-full font-[Inter,Segoe_UI,sans-serif] text-[13px] text-slate-800">
      {/* Colonne latérale — couleur dynamique */}
      <aside
        style={{ backgroundColor: color }}
        className="flex w-[34%] flex-col gap-6 px-6 py-8 text-slate-100"
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="h-24 w-24 self-center rounded-full object-cover ring-2 ring-white/20" />
        ) : null}

        <div className="text-center">
          <h1 className="text-lg font-semibold leading-tight text-white">{userName}</h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/70">
            {cv.profession || 'Profession'}
          </p>
        </div>

        <div className="space-y-2 border-t border-white/15 pt-4 text-[11px] leading-5 text-white/85">
          {cv.email ? <p className="break-words">{cv.email}</p> : null}
          {phones.map((p) => <p key={p.id}>{p.number}</p>)}
          {(cv.addressLine || cv.city) ? (
            <p>{[cv.addressLine, cv.postalCode, cv.city].filter(Boolean).join(' · ')}</p>
          ) : null}
        </div>

        {links.length > 0 ? (
          <div className="space-y-1.5 border-t border-white/15 pt-4 text-[11px] text-white/85">
            {links.map((l) => <p key={l.id} className="break-words">{l.url}</p>)}
          </div>
        ) : null}

        {cv.skills && cv.skills.length > 0 ? (
          <div className="border-t border-white/15 pt-4">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">Compétences</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((s: any) => (
                <span key={s.id} className="rounded-full bg-white/15 px-2 py-1 text-[10px] text-white">
                  {s.skill?.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {cv.languages && cv.languages.length > 0 ? (
          <div className="border-t border-white/15 pt-4">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">Langues</h3>
            <div className="space-y-1 text-[11px] text-white/85">
              {cv.languages.map((l: any) => (
                <p key={l.id}>{l.name}{l.level ? ` — ${l.level}` : ''}</p>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      {/* Colonne principale */}
      <main className="flex-1 space-y-6 px-8 py-8">
        <header>
          <div className="mb-2 h-[3px] w-10 rounded-full" style={{ backgroundColor: color }} aria-hidden />
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900">
            {cv.title || 'Titre du CV'}
          </h1>
        </header>

        {cv.summary ? (
          <section>
            <h2 className="mb-2 border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Profil
            </h2>
            <p className="text-[12.5px] leading-6 text-slate-700">{cv.summary}</p>
          </section>
        ) : null}

        {cv.experiences && cv.experiences.length > 0 ? (
          <section>
            <h2 className="mb-3 border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Expérience
            </h2>
            <div className="space-y-4">
              {cv.experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-slate-900">{exp.position}</span>
                    <span className="whitespace-nowrap text-[11px] text-slate-500">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Présent' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  {exp.description ? (
                    <p className="mt-1.5 text-[12px] leading-5 text-slate-700">{exp.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.educations && cv.educations.length > 0 ? (
          <section>
            <h2 className="mb-3 border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Formation
            </h2>
            <div className="space-y-3">
              {cv.educations.map((edu: any) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-slate-900">{edu.degree}</span>
                    <span className="whitespace-nowrap text-[11px] text-slate-500">
                      {formatDate(edu.startDate)} — {edu.isCurrent ? 'Présent' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.projects && cv.projects.length > 0 ? (
          <section>
            <h2 className="mb-3 border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Projets
            </h2>
            <div className="space-y-3">
              {cv.projects.map((p: any) => (
                <div key={p.id}>
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  {p.description ? <p className="mt-1 text-[12px] leading-5 text-slate-700">{p.description}</p> : null}
                  {p.technologies ? <p className="mt-1 text-[11px] text-slate-500">{p.technologies}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cv.certifications && cv.certifications.length > 0 ? (
          <section>
            <h2 className="mb-3 border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Certifications
            </h2>
            <div className="space-y-2">
              {cv.certifications.map((c: any) => (
                <div key={c.id} className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-slate-900">{c.name}</span>
                  <span className="text-[11px] text-slate-500">{c.organization}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}