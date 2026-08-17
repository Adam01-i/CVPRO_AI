'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '#comment-ca-marche', label: 'Comment ça marche' },
  { href: '#modeles', label: 'Modèles' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-[#0B1220]/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#0B1220]">C</div>
          <span className="text-sm font-semibold tracking-tight text-white">CVPro AI</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-white/70 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-sm font-medium text-white/80 transition hover:text-white">
            Connexion
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-[#2B4EFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(43,78,255,0.6)] transition hover:bg-[#1d3fe0]"
          >
            Créer mon CV
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#0B1220] px-4 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white/80">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login" className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-medium text-white">
              Connexion
            </Link>
            <Link href="/create" className="rounded-full bg-[#2B4EFF] px-4 py-2.5 text-center text-sm font-semibold text-white">
              Créer mon CV
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}