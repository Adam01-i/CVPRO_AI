import Link from 'next/link';

const COLUMNS = [
  { title: 'Produit', links: [{ label: 'Créer un CV', href: '/create' }, { label: 'Modèles', href: '/#modeles' }, { label: 'Fonctionnalités', href: '/#fonctionnalites' }] },
  { title: 'Ressources', links: [{ label: 'Conseils CV', href: '#' }, { label: 'FAQ', href: '/#faq' }, { label: 'Guides', href: '#' }] },
  { title: 'Entreprise', links: [{ label: 'À propos', href: '#' }, { label: 'Contact', href: '#' }] },
  { title: 'Légal', links: [{ label: 'Conditions', href: '#' }, { label: 'Confidentialité', href: '#' }] },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#0B1220] pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#0B1220]">C</div>
              <span className="text-sm font-semibold text-white">CVPro AI</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/40">
              Créez un CV professionnel, structuré et prêt à convaincre.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/60 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} CVPro AI</span>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-white/70">Se connecter</Link>
            <Link href="/create" className="hover:text-white/70">Créer un CV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}