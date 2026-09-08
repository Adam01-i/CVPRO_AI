'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvCard } from '@/components/cvs/cv-card';
import { CvLibraryHeader } from '@/components/cvs/cv-library-header';
import { CvLibraryStats } from '@/components/cvs/cv-library-stats';
import { CvEmptyState } from '@/components/cvs/cv-empty-state';
import { CvSkeletonCard } from '@/components/cvs/cv-skeleton-card';
import { useAuth } from '@/contexts/auth-context';
import { cvsApi } from '@/lib/api/cvs.api';
import type { Cv } from '@/types/api';

export default function DashboardCvsPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Votre profil';

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

  const goToNew = () => router.push('/dashboard/cvs/new');

  const activeCv = cvs.find((cv) => cv.isActive) ?? null;
  const otherCvs = cvs.filter((cv) => cv.id !== activeCv?.id);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <CvLibraryHeader onCreate={goToNew} />

          {loading ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-[24px] bg-white ring-1 ring-slate-200" />
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CvSkeletonCard key={i} />
                ))}
              </div>
            </>
          ) : cvs.length === 0 ? (
            <CvEmptyState onCreate={goToNew} />
          ) : (
            <>
              <CvLibraryStats cvs={cvs} />

              {activeCv ? (
                <CvCard
                  cv={activeCv}
                  userName={userName}
                  variant="featured"
                  onActivate={handleActivate}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ) : null}

              {otherCvs.length > 0 ? (
                <section>
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {activeCv ? 'Mes autres CV' : 'Mes CV'}
                  </h2>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {otherCvs.map((cv) => (
                      <CvCard
                        key={cv.id}
                        cv={cv}
                        userName={userName}
                        onActivate={handleActivate}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}