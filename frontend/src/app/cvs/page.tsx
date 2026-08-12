'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { cvsApi } from '@/lib/api/cvs.api';
import type { Cv } from '@/types/api';

export default function CvsPage() {
  const { token } = useAuth();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    cvsApi
      .list(token)
      .then((response) => setCvs(response.data))
      .catch(() => setCvs([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">CVs</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Mes versions de CV</h1>
            </div>
            <button className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Nouveau CV</button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">Chargement de vos CV...</div>
          ) : cvs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              Aucun CV pour le moment. Créez votre première version pour commencer.<br />
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cvs.map((cv) => (
                <div key={cv.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{cv.title}</div>
                      <div className="text-sm text-slate-500">{cv.profession ?? 'Profession non renseignée'}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cv.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {cv.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div>Mis à jour {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</div>
                    <div>{cv.summary ? cv.summary.slice(0, 120) : 'Aucun résumé ajouté.'}</div>
                  </div>

                  <a href={`/cvs/${cv.id}`} className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">Ouvrir</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
