'use client';

import { useAuth } from '@/contexts/auth-context';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <header className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Profil</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Votre identité professionnelle</h1>
          </header>

          <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
            <div className="rounded-[30px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[var(--shadow-soft)]">
              <div className="flex h-32 w-32 items-center justify-center rounded-[24px] bg-white/10 text-4xl font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="mt-5 text-xl font-semibold">{user?.firstName ?? 'Utilisateur'} {user?.lastName ?? ''}</div>
              <div className="mt-2 text-sm text-slate-300">{user?.email}</div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-lg font-semibold text-slate-900">Informations</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Prénom</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{user?.firstName}</div>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Nom</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{user?.lastName}</div>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</div>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                    <div className="text-sm text-slate-500">Téléphone</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{user?.phone ?? 'Non renseigné'}</div>
                  </div>
                </div>
              </section>

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-lg font-semibold text-slate-900">Sécurité</h2>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                    Changer le mot de passe
                  </button>
                  <button type="button" className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
                    Supprimer le compte
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
