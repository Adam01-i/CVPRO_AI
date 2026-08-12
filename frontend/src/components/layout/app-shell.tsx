'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  { href: '/dashboard', label: 'Accueil' },
  { href: '/dashboard/cvs', label: 'Mes CV' },
  { href: '/jobs', label: 'Offres' },
  { href: '/applications', label: 'Candidatures' },
  { href: '/profile', label: 'Profil' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-sm font-semibold text-white shadow-sm">
              C
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">CVPro</div>
              <div className="text-base font-semibold tracking-tight text-slate-900">AI</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium text-slate-900">
                {user?.firstName ?? 'Utilisateur'} {user?.lastName ?? ''}
              </div>
              <div className="text-[11px] text-slate-500">{user?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
