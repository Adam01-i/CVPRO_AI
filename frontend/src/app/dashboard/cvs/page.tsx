'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvCard } from '@/components/cvs/cv-card';
import { useAuth } from '@/contexts/auth-context';
import { cvsApi } from '@/lib/api/cvs.api';
import type { Cv } from '@/types/api';

export default function DashboardCvsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCvs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await cvsApi.list(token);
      setCvs(response.data);
    } catch {
      setCvs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCvs();
  }, [token]);

  const handleActivate = async (id: string) => {
    if (!token) return;
    await cvsApi.activate(token, id);
    await loadCvs();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const confirmed = window.confirm('Supprimer ce CV ? Cette action est définitive.');
    if (!confirmed) return;
    await cvsApi.remove(token, id);
    await loadCvs();
  };

  const handleDuplicate = async (cv: Cv) => {
    if (!token) return;
    const created = await cvsApi.create(token, {
      title: `${cv.title} (copie)`,
      profession: cv.profession ?? undefined,
      summary: cv.summary ?? undefined,
      email: cv.email ?? undefined,
      phone: cv.phone ?? undefined,
      address: cv.address ?? undefined,
      linkedin: cv.linkedin ?? undefined,
      github: cv.github ?? undefined,
      portfolio: cv.portfolio ?? undefined,
    });
    router.push(`/dashboard/cvs/${created.id}`);
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Portfolio</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Mes CV</h1>
              </div>
              <button type="button" onClick={() => router.push('/dashboard/cvs/new')} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                + Créer un CV
              </button>
            </div>
          </section>

          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-500">Chargement de vos CV...</div>
          ) : cvs.length === 0 ? (
            <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto max-w-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-700">✦</div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900">Votre prochain CV commence ici.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Créez une version claire, professionnelle et à jour pour chaque opportunité que vous ciblez.</p>
                <button type="button" onClick={() => router.push('/dashboard/cvs/new')} className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">Créer mon premier CV</button>
              </div>
            </section>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cvs.map((cv) => (
                <CvCard key={cv.id} cv={cv} onActivate={handleActivate} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
