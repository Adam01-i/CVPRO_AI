'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { cvsApi } from '@/lib/api/cvs.api';
import { jobsApi } from '@/lib/api/jobs.api';
import type { Cv, JobOffer } from '@/types/api';

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      jobsApi.listOffers(token, { limit: 3, page: 1 }),
      cvsApi.list(token),
    ])
      .then(([offersResponse, cvsResponse]) => {
        setOffers(offersResponse.data);
        setCvs(cvsResponse.data);
      })
      .catch(() => {
        setOffers([]);
        setCvs([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const activeCv = useMemo(() => cvs.find((cv) => cv.isActive) ?? cvs[0] ?? null, [cvs]);
  const firstName = user?.firstName ?? 'Bonjour';

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Bienvenue</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {firstName}, votre candidature mérite un meilleur CV.
                </h1>
              </div>
              <Link href="/dashboard/cvs/new" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                Créer un CV
              </Link>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">CV actif</div>
                <div className="mt-3 text-2xl font-semibold text-slate-900">{activeCv ? activeCv.title : 'Aucun'}</div>
                <div className="mt-2 text-sm text-slate-600">{activeCv ? 'Prêt pour les candidatures' : 'Créez votre premier CV pour commencer.'}</div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Offres récentes</div>
                <div className="mt-3 text-2xl font-semibold text-slate-900">{offers.length}</div>
                <div className="mt-2 text-sm text-slate-600">À comparer avec votre profil</div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Prochaine étape</div>
                <div className="mt-3 text-2xl font-semibold text-slate-900">Analyser</div>
                <div className="mt-2 text-sm text-slate-600">L’IA peut renforcer votre profil en quelques minutes.</div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Priorités</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Ce qui mérite votre attention</h2>
                </div>
                <Link href="/jobs" className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline">
                  Voir les offres
                </Link>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Chargement...</div>
              ) : offers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  Aucune offre récente pour le moment. Revenez plus tard ou mettez à jour votre CV.
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <article key={offer.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{offer.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{offer.company?.name ?? 'Entreprise'} · {offer.location ?? 'Télétravail'}</p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
                          {offer.contractType ?? 'CDI'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{offer.description.slice(0, 180)}{offer.description.length > 180 ? '…' : ''}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="rounded-[30px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[var(--shadow-soft)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Assistant IA</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Regard extérieur</h2>

              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div className="rounded-[22px] border border-slate-700 bg-slate-800/60 p-4">
                  <div className="text-slate-400">Votre CV</div>
                  <div className="mt-2 text-lg font-medium text-white">{activeCv ? activeCv.profession ?? activeCv.title : 'À compléter'}</div>
                </div>
                <div className="rounded-[22px] border border-slate-700 bg-slate-800/60 p-4">
                  <div className="text-slate-400">Suggestion utile</div>
                  <div className="mt-2 text-white">Mettez en avant les résultats concrets et les compétences clés.</div>
                </div>
                <div className="rounded-[22px] border border-slate-700 bg-slate-800/60 p-4">
                  <div className="text-slate-400">Action</div>
                  <div className="mt-2 text-white">Analyser mon CV pour cette recherche.</div>
                </div>
              </div>

              <Link href={activeCv ? `/dashboard/cvs/${activeCv.id}` : '/dashboard/cvs/new'} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                {activeCv ? 'Ouvrir mon CV' : 'Créer mon CV'}
              </Link>
            </aside>
          </section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
