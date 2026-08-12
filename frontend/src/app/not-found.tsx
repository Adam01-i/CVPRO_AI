import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page introuvable</h1>
        <p className="mt-3 text-slate-600">Cette ressource n’existe plus ou n’a pas encore été ajoutée.</p>
        <Link href="/login" className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          Revenir à l’accueil
        </Link>
      </div>
    </main>
  );
}
