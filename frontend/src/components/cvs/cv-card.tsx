import Link from 'next/link';
import type { Cv } from '@/types/api';
import { CvThumbnail } from './cv-thumbnail';
import { CvCardActions } from './cv-card-actions';

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Modifié aujourd'hui";
  if (diffDays === 1) return 'Modifié hier';
  if (diffDays < 7) return `Modifié il y a ${diffDays} jours`;
  return `Modifié le ${new Date(dateString).toLocaleDateString('fr-FR')}`;
}

export function CvCard({
  cv,
  userName,
  variant = 'default',
  onActivate,
  onDelete,
  onDuplicate,
}: {
  cv: Cv;
  userName: string;
  variant?: 'featured' | 'default';
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (cv: Cv) => void;
}) {
  const isFeatured = variant === 'featured';

  return (
    <article
      className={`group flex h-full gap-5 rounded-[28px] border bg-white p-5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-24px_rgba(15,23,42,0.35)] ${
        isFeatured
          ? 'flex-col border-slate-900/10 sm:flex-row sm:items-stretch'
          : 'flex-col border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={isFeatured ? 'sm:w-[38%]' : 'w-full'}>
        <CvThumbnail cv={cv} userName={userName} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            {cv.isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                CV actif
              </span>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">CV</span>
            )}
            <h3 className={`mt-2 font-semibold text-slate-900 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
              {cv.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {cv.profession ?? 'Profession non renseignée'}
            </p>
          </div>
        </div>

        {isFeatured && cv.summary ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {cv.summary.length > 160 ? `${cv.summary.slice(0, 160)}…` : cv.summary}
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <p className="text-xs text-slate-500">{timeAgo(cv.updatedAt)}</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href={`/dashboard/cvs/${cv.id}`}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Modifier
            </Link>
            <CvCardActions
              isActive={cv.isActive}
              onActivate={() => onActivate(cv.id)}
              onDuplicate={() => onDuplicate(cv)}
              onDelete={() => onDelete(cv.id)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}