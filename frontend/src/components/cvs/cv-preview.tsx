import type { Cv, Certification, CvSkill, Education, Experience, Language, Project } from '@/types/api';

function formatDate(date?: string | null) {
  if (!date) return 'Date non renseignée';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function CvPreview({ cv, userName }: { cv: Partial<Cv>; userName: string }) {
  const name = `${userName}`.trim() || 'Nom et prénom';

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]">
      <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">CV</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{cv.title || 'Titre du CV'}</h2>
            <p className="mt-2 text-base text-slate-600">{cv.profession || 'Profession'}</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            {cv.isActive ? 'Actif' : 'Brouillon'}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
          {cv.email ? <span className="rounded-full bg-white px-2.5 py-1">{cv.email}</span> : null}
          {(cv.phones && cv.phones.length > 0) ? (cv.phones as any[]).map((p) => <span key={p.id} className="rounded-full bg-white px-2.5 py-1">{p.number}</span>) : (cv.phone ? <span className="rounded-full bg-white px-2.5 py-1">{cv.phone}</span> : null)}
          {(cv.addressLine || cv.city) ? <span className="rounded-full bg-white px-2.5 py-1">{[cv.addressLine, cv.postalCode, cv.city].filter(Boolean).join(' · ')}</span> : null}
          {(cv.links && cv.links.length > 0) ? (cv.links as any[]).map((l) => <span key={l.id} className="rounded-full bg-white px-2.5 py-1">{l.type}</span>) : null}
        </div>

        <div className="mt-8 space-y-8">
          {cv.summary ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Profil</h3>
              <p className="text-sm leading-7 text-slate-700">{cv.summary}</p>
            </section>
          ) : null}

          {cv.experiences && cv.experiences.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Expérience</h3>
              <div className="space-y-4">
                {(cv.experiences as Experience[]).map((experience) => (
                  <div key={experience.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">{experience.position}</div>
                        <div className="text-sm text-slate-600">{experience.company}</div>
                      </div>
                      <div className="text-xs text-slate-500">{experience.location ?? 'Lieu non renseigné'}</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(experience.startDate)} – {experience.isCurrent ? 'Aujourd’hui' : experience.endDate ? formatDate(experience.endDate) : 'À ce jour'}
                    </div>
                    {experience.description ? <p className="mt-3 text-sm leading-6 text-slate-700">{experience.description}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {cv.educations && cv.educations.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Formation</h3>
              <div className="space-y-4">
                {(cv.educations as Education[]).map((education) => (
                  <div key={education.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="font-semibold text-slate-900">{education.degree}</div>
                    <div className="text-sm text-slate-600">{education.institution}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(education.startDate)} – {education.isCurrent ? 'Aujourd’hui' : education.endDate ? formatDate(education.endDate) : 'À ce jour'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {cv.skills && cv.skills.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {(cv.skills as CvSkill[]).map((skill) => (
                  <span key={skill.id} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                    {skill.skill?.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {cv.projects && cv.projects.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Projets</h3>
              <div className="space-y-4">
                {(cv.projects as Project[]).map((project) => (
                  <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="font-semibold text-slate-900">{project.name}</div>
                    {project.description ? <p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p> : null}
                    {project.technologies ? <div className="mt-3 text-xs text-slate-500">{project.technologies}</div> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {cv.certifications && cv.certifications.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Certifications</h3>
              <div className="space-y-3">
                {(cv.certifications as Certification[]).map((cert) => (
                  <div key={cert.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">{cert.name}</div>
                    <div className="mt-1">{cert.organization}</div>
                    {cert.issueDate ? <div className="mt-2 text-xs text-slate-500">Obtenue le {formatDate(cert.issueDate)}</div> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {cv.languages && cv.languages.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Langues</h3>
              <div className="flex flex-wrap gap-2">
                {(cv.languages as Language[]).map((language) => (
                  <span key={language.id} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                    {language.name} {language.level ? `· ${language.level}` : ''}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
