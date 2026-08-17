import Link from 'next/link';
import { CvMiniPreview } from '@/components/cvs/preview/cv-mini-preview';
import { SAMPLE_CV } from '@/components/cvs/templates/sample-cv';

const PROOF_POINTS = ['Création guidée', 'Aperçu en temps réel', 'Modèles professionnels', 'Export PDF', 'Sans engagement'];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-[#2B4EFF]/25 blur-[130px]" />
        <div className="absolute right-[-8%] top-[35%] h-[380px] w-[380px] rounded-full bg-[#0F766E]/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80">
            Choisissez votre modèle, votre couleur, votre histoire
          </span>

          <h1 className="mt-7 text-[44px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[64px] lg:text-[76px]">
            Votre CV mérite
            <br />
            <span className="text-[#7C9CFF]">plus qu'un simple modèle.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
            CVPro AI transforme votre parcours en un CV professionnel, structuré et prêt à convaincre — sans être designer ni expert en recrutement.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1220] shadow-[0_12px_32px_-8px_rgba(255,255,255,0.3)] transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Créer mon CV gratuitement
            </Link>
            
            <a
              href="#comment-ca-marche"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Découvrir comment ça marche
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5">
            {PROOF_POINTS.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A]/20 text-[10px] text-[#4ADE80]">✓</span>
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[400px]">
          <div
            className="home-float-slow absolute -left-10 top-16 hidden w-40 rotate-[-8deg] rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:block"
            style={{ '--float-rot': '-8deg' } as React.CSSProperties}
          >
            <div className="h-2 w-3/4 rounded-full bg-white/20" />
            <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/10" />
            <div className="mt-3 flex gap-1">
              <span className="h-4 w-10 rounded-full bg-[#2B4EFF]/40" />
              <span className="h-4 w-10 rounded-full bg-[#0F766E]/40" />
            </div>
          </div>

          <div
            className="home-float-slow absolute -right-6 bottom-10 hidden w-32 rotate-[6deg] rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:block"
            style={{ '--float-rot': '6deg', animationDelay: '1.5s' } as React.CSSProperties}
          >
            <div className="h-6 w-6 rounded-full bg-[#FF6B4A]/40" />
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/15" />
            <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/10" />
          </div>

          <div
            className="home-float relative w-[340px] overflow-hidden rounded-[24px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] sm:w-[380px]"
            style={{ transform: 'rotate(2deg)', '--float-rot': '2deg' } as React.CSSProperties}
          >
            <CvMiniPreview cv={{ ...SAMPLE_CV, templateId: 'modern' }} userName="Prénom Nom" accentColor="#2B4EFF" />
          </div>
        </div>
      </div>
    </section>
  );
}