import type { Cv } from '@/types/api';

export function CvLibraryStats({ cvs }: { cvs: Cv[] }) {
  if (cvs.length === 0) return null;

  const activeCv = cvs.find((cv) => cv.isActive) ?? null;
  const mostRecent = cvs.reduce((latest, cv) =>
    new Date(cv.updatedAt) > new Date(latest.updatedAt) ? cv : latest,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-sm text-slate-500">Total</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">
          {cvs.length} {cvs.length > 1 ? 'CV' : 'CV'}
        </div>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-sm text-slate-500">CV actif</div>
        <div className="mt-2 truncate text-2xl font-semibold text-slate-900">
          {activeCv ? activeCv.title : 'Aucun'}
        </div>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-sm text-slate-500">Dernière modification</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">
          {new Date(mostRecent.updatedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
  );
}