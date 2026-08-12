import Link from 'next/link';
import type { Cv } from '@/types/api';

export function CvCard({
  cv,
  onActivate,
  onDelete,
  onDuplicate,
}: {
  cv: Cv;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (cv: Cv) => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_44px_-24px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">CV</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{cv.title}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cv.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {cv.isActive ? 'Actif' : 'Inactif'}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-900">{cv.profession ?? 'Profession non renseignée'}</div>
        <div className="mt-2 text-xs leading-5 text-slate-500">
          {cv.summary ? (cv.summary.length > 110 ? `${cv.summary.slice(0, 110)}…` : cv.summary) : 'Aucun résumé professionnel ajouté pour le moment.'}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>Modifié le</span>
        <span className="font-medium text-slate-700">{new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <Link href={`/dashboard/cvs/${cv.id}`} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2.5 font-medium text-white transition hover:bg-slate-800">
          Ouvrir
        </Link>
        <button type="button" onClick={() => onActivate(cv.id)} className="rounded-full border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
          Activer
        </button>
        <button type="button" onClick={() => onDuplicate(cv)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100">
          Dupliquer
        </button>
        <button type="button" onClick={() => onDelete(cv.id)} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2.5 font-medium text-rose-700 transition hover:bg-rose-100">
          Supprimer
        </button>
      </div>
    </article>
  );
}
