import Link from 'next/link';
import { CvPage } from '@/components/cvs/preview/cv-page';
import { CvTemplate } from '@/components/cvs/preview/cv-template';
import { SAMPLE_CV } from '@/components/cvs/templates/sample-cv';

const STEPS = [
  { number: '01', title: 'Choisissez un modèle', text: 'Sélectionnez un design parmi plusieurs modèles professionnels et définissez votre couleur principale.' },
  { number: '02', title: 'Remplissez vos informations', text: 'Coordonnées, expériences, formations, compétences — une étape à la fois, guidée par une sidebar claire.' },
  { number: '03', title: 'Visualisez en temps réel', text: 'Votre CV au format A4 se met à jour instantanément à chaque modification.' },
  { number: '04', title: 'Téléchargez et postulez', text: 'Votre CV est prêt, sauvegardé automatiquement, accessible à tout moment depuis votre compte.' },
];

const FEATURES = [
  { title: 'Édition immersive', text: "Un espace de travail plein écran pensé pour se concentrer sur le contenu, pas sur l'interface." },
  { title: 'Aperçu A4 fidèle', text: 'Ce que vous voyez à l’écran est la mise en page réelle de votre document, pas une approximation.' },
  { title: 'Modèles & couleurs', text: 'Changez de modèle et de couleur principale à tout moment, avant ou pendant la création.' },
  { title: 'Sauvegarde automatique', text: 'Chaque modification est enregistrée sans action de votre part.' },
  { title: 'Photo de profil', text: 'Ajoutez ou retirez votre photo directement depuis l’éditeur.' },
  { title: 'Sans engagement', text: 'Créez un CV sans compte, ou connectez-vous pour retrouver vos versions plus tard.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-900">C</div>
            <span className="text-sm font-semibold tracking-tight">CVPro AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:text-white">
              Se connecter
            </Link>
            <Link href="/create" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
              Créer mon CV
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute right-[-10%] top-1/4 h-[480px] w-[480px] rounded-full bg-emerald-500/20 blur-[120px]" />
          <div className="absolute bottom-[-15%] left-1/3 h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
              Nouveau · Choisissez votre couleur et votre modèle
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Créez un CV qui donne envie de vous rencontrer.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
              Un éditeur immersif, un aperçu fidèle au format A4, et des modèles pensés pour mettre votre profil en valeur — sans complexité inutile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Créer mon CV gratuitement
              </Link>
              <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40">
                J'ai déjà un compte
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/50">Aucune création de compte requise pour commencer.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute inset-0 -z-10 rotate-3 rounded-[32px] bg-gradient-to-br from-indigo-500/40 to-emerald-400/30 blur-2xl" />
            <div className="overflow-hidden rounded-[24px] bg-white shadow-2xl">
              <CvPage pageNumber={1} totalPages={1}>
                <CvTemplate cv={{ ...SAMPLE_CV, templateId: 'modern' }} userName="Prénom Nom" photoUrl={null} accentColor="#1d4ed8" />
              </CvPage>
            </div>
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="border-t border-white/10 bg-slate-900/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Comment ça marche</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Quatre étapes, un CV prêt.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <span className="text-sm font-semibold text-white/40">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="bg-slate-50 py-20 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pourquoi CVPro AI</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Pensé pour la clarté, pas pour la complexité.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Votre prochain CV commence maintenant.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60 sm:text-base">
            Choisissez un modèle, remplissez vos informations, téléchargez. C'est aussi simple que ça.
          </p>
          <Link href="/create" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Créer mon CV
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-white/40 sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} CVPro AI</span>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-white/70">Se connecter</Link>
            <Link href="/create" className="hover:text-white/70">Créer un CV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}