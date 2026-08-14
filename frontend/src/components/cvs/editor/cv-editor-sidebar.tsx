'use client';

const STATUS_ICON: Record<string, string> = {
  done: '✓',
  in_progress: '●',
  todo: '○',
};

const STATUS_STYLE: Record<string, string> = {
  done: 'text-emerald-600',
  in_progress: 'text-amber-500',
  todo: 'text-slate-300',
};

export type CvSectionId =
  | 'identity' | 'profile' | 'experience' | 'education'
  | 'skills' | 'projects' | 'certifications' | 'languages';

const SECTIONS: { id: CvSectionId; label: string }[] = [
  { id: 'identity', label: 'Coordonnées' },
  { id: 'profile', label: 'Profil' },
  { id: 'experience', label: 'Expérience' },
  { id: 'education', label: 'Formation' },
  { id: 'skills', label: 'Compétences' },
  { id: 'projects', label: 'Projets' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Langues' },
];

export function CvEditorSidebar({
  activeSection,
  onSelect,
  sectionStatus,
  progressPercent,
  cvTitle,
  onFinalize,
}: {
  activeSection: CvSectionId;
  onSelect: (id: CvSectionId) => void;
  sectionStatus: Record<CvSectionId, 'done' | 'in_progress' | 'todo'>;
  progressPercent: number;
  cvTitle: string;
  onFinalize: () => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col bg-slate-900 text-slate-100">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">CVPro AI</p>
        <h1 className="mt-2 truncate text-lg font-semibold text-white">
          {cvTitle || 'Nouveau CV'}
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Sections du CV">
        <ul className="space-y-1">
          {SECTIONS.map((section) => {
            const status = sectionStatus[section.id] ?? 'todo';
            const isActive = section.id === activeSection;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span aria-hidden className={`w-4 text-center font-semibold ${STATUS_STYLE[status]}`}>
                    {STATUS_ICON[status]}
                  </span>
                  <span className="font-medium">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progression</span>
          <span className="font-semibold text-white">{progressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          type="button"
          onClick={onFinalize}
          className="mt-4 w-full rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {progressPercent >= 100 ? 'Finaliser mon CV' : 'Continuer'}
        </button>
      </div>
    </aside>
  );
}