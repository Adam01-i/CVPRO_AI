'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { jobsApi } from '@/lib/api/jobs.api';
import type { JobApplication } from '@/types/api';

export default function ApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    jobsApi
      .myApplications(token)
      .then((data) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Candidatures</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Suivi de vos candidatures</h1>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">Chargement de vos candidatures...</div>
          ) : applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Aucune candidature en cours.</div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{application.jobOffer?.title ?? 'Offre'}</div>
                      <div className="mt-1 text-sm text-slate-600">{application.jobOffer?.company?.name ?? 'Entreprise'} · {application.status}</div>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">{application.status}</span>
                  </div>
                  <div className="mt-4 text-sm text-slate-600">Candidature enregistrée le {new Date(application.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
