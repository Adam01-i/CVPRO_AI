import type {
  Cv,
  Certification,
  CvLink,
  CvPhone,
  CvSkill,
  Education,
  Experience,
  Language,
  Project,
} from "@/types/api";

function formatDate(date?: string | null) {
  if (!date) return "Date non renseignée";

  return new Date(date).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

function getLinkLabel(link: CvLink) {
  if (link.label) return link.label;

  switch (link.type) {
    case "LINKEDIN":
      return "LinkedIn";

    case "GITHUB":
      return "GitHub";

    case "PORTFOLIO":
      return "Portfolio";

    case "PERSONAL":
      return "Site personnel";

    case "BEHANCE":
      return "Behance";

    case "DRIBBBLE":
      return "Dribbble";

    case "TWITTER":
      return "Twitter";

    default:
      return "Lien";
  }
}

export function CvPreview({
  cv,
  userName,
}: {
  cv: Partial<Cv>;
  userName: string;
}) {
  const name = `${userName}`.trim() || "Nom et prénom";

  /*
   * Compatibilité :
   * - nouveau système : phones[]
   * - ancien système : phone
   */
  const phones: CvPhone[] =
    cv.phones && cv.phones.length > 0
      ? cv.phones
      : cv.phone
        ? [
            {
              id: "legacy-phone",
              cvId: cv.id ?? "",
              number: cv.phone,
              primary: true,
              createdAt: "",
            },
          ]
        : [];

  /*
   * Compatibilité :
   * - nouveau système : links[]
   * - ancien système : linkedin / github / portfolio
   *
   * On privilégie links[] s'il contient des données.
   * Sinon on reconstruit les anciens liens.
   */
  const links: CvLink[] =
    cv.links && cv.links.length > 0
      ? cv.links
      : [
          cv.linkedin
            ? {
                id: "legacy-linkedin",
                cvId: cv.id ?? "",
                type: "LINKEDIN",
                url: cv.linkedin,
                createdAt: "",
              }
            : null,

          cv.github
            ? {
                id: "legacy-github",
                cvId: cv.id ?? "",
                type: "GITHUB",
                url: cv.github,
                createdAt: "",
              }
            : null,

          cv.portfolio
            ? {
                id: "legacy-portfolio",
                cvId: cv.id ?? "",
                type: "PORTFOLIO",
                url: cv.portfolio,
                createdAt: "",
              }
            : null,
        ].filter((link): link is CvLink => link !== null);

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]">
      <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              CV
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {cv.title || "Titre du CV"}
            </h2>

            <p className="mt-2 text-base text-slate-600">
              {cv.profession || "Profession"}
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            {cv.isActive ? "Actif" : "Brouillon"}
          </div>
        </div>

        {/* CONTACT */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
          {cv.email ? (
            <span className="rounded-full bg-white px-2.5 py-1">
              {cv.email}
            </span>
          ) : null}

          {cv.phones && cv.phones.length > 0 ? (
            cv.phones.map((phone) => (
              <span
                key={phone.id}
                className="rounded-full bg-white px-2.5 py-1"
              >
                {phone.number}
              </span>
            ))
          ) : cv.phone ? (
            <span className="rounded-full bg-white px-2.5 py-1">
              {cv.phone}
            </span>
          ) : null}

          {cv.addressLine || cv.city || cv.address ? (
            <span className="rounded-full bg-white px-2.5 py-1">
              {cv.addressLine || cv.address
                ? [cv.addressLine || cv.address, cv.postalCode, cv.city]
                    .filter(Boolean)
                    .join(" · ")
                : cv.city}
            </span>
          ) : null}

          {cv.links && cv.links.length > 0
            ? cv.links.map((link) => (
                <span
                  key={link.id}
                  className="rounded-full bg-white px-2.5 py-1"
                >
                  {link.label || link.type}
                </span>
              ))
            : null}
        </div>

        {/* CONTENU */}
        <div className="mt-8 space-y-8">
          {/* PROFIL */}
          {cv.summary ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Profil
              </h3>

              <p className="text-sm leading-7 text-slate-700">{cv.summary}</p>
            </section>
          ) : null}

          {/* EXPERIENCE */}
          {cv.experiences && cv.experiences.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Expérience
              </h3>

              <div className="space-y-4">
                {(cv.experiences as Experience[]).map((experience) => (
                  <div
                    key={experience.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {experience.position}
                        </div>

                        <div className="text-sm text-slate-600">
                          {experience.company}
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        {experience.location ?? "Lieu non renseigné"}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(experience.startDate)} –{" "}
                      {experience.isCurrent
                        ? "Aujourd’hui"
                        : experience.endDate
                          ? formatDate(experience.endDate)
                          : "À ce jour"}
                    </div>

                    {experience.description ? (
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {experience.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* FORMATION */}
          {cv.educations && cv.educations.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Formation
              </h3>

              <div className="space-y-4">
                {(cv.educations as Education[]).map((education) => (
                  <div
                    key={education.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="font-semibold text-slate-900">
                      {education.degree}
                    </div>

                    <div className="text-sm text-slate-600">
                      {education.institution}
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(education.startDate)} –{" "}
                      {education.isCurrent
                        ? "Aujourd’hui"
                        : education.endDate
                          ? formatDate(education.endDate)
                          : "À ce jour"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* COMPETENCES */}
          {cv.skills && cv.skills.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Compétences
              </h3>

              <div className="flex flex-wrap gap-2">
                {(cv.skills as CvSkill[]).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {skill.skill?.name || "Compétence"}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {/* PROJETS */}
          {cv.projects && cv.projects.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Projets
              </h3>

              <div className="space-y-4">
                {(cv.projects as Project[]).map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="font-semibold text-slate-900">
                      {project.name}
                    </div>

                    {project.description ? (
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {project.description}
                      </p>
                    ) : null}

                    {project.technologies ? (
                      <div className="mt-3 text-xs text-slate-500">
                        {project.technologies}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* CERTIFICATIONS */}
          {cv.certifications && cv.certifications.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Certifications
              </h3>

              <div className="space-y-3">
                {(cv.certifications as Certification[]).map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
                  >
                    <div className="font-semibold text-slate-900">
                      {cert.name}
                    </div>

                    <div className="mt-1">{cert.organization}</div>

                    {cert.issueDate ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Obtenue le {formatDate(cert.issueDate)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* LANGUES */}
          {cv.languages && cv.languages.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Langues
              </h3>

              <div className="flex flex-wrap gap-2">
                {(cv.languages as Language[]).map((language) => (
                  <span
                    key={language.id}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {language.name}
                    {language.level ? ` · ${language.level}` : ""}
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
