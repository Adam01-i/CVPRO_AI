'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { jobsApi } from '@/lib/api/jobs.api';
import type { JobOffer } from '@/types/api';

export default function JobsPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    jobsApi
      .listOffers(token, { isActive: true, limit: 12, page: 1 })
      .then((response) => setOffers(response.data))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <header className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Offres</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Trouvez des missions qui correspondent à votre parcours.
            </h1>
          </header>

          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-[var(--shadow-soft)]">Chargement des offres...</div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {offers.map((offer) => (
                <article key={offer.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-slate-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold tracking-tight text-slate-900">{offer.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{offer.company?.name ?? 'Entreprise'} · {offer.location ?? 'Télétravail'}</div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
                      {offer.contractType ?? 'CDI'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">{offer.description.slice(0, 220)}{offer.description.length > 220 ? '…' : ''}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(offer.skills ?? []).slice(0, 4).map((skill) => (
                      <span key={skill.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                        {skill.skill.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-500">{offer.applicationCount ?? 0} candidatures</div>
                    <div className="flex gap-2">
                      <button type="button" className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                        Voir l’offre
                      </button>
                      <button type="button" className="rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                        Postuler
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
