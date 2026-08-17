import { ScrollReveal } from './scroll-reveal';

export function ProblemTransformation() {
  return (
    <section className="bg-[#0B1220] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Le problème</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Vous n'avez pas besoin de savoir créer un CV.
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <ScrollReveal stagger={1}>
            <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/60">Avant</span>
              <div className="mt-6 space-y-3">
                <div className="h-3 w-2/3 rounded-full bg-white/15" />
                <div className="h-3 w-1/2 rounded-full bg-white/10" />
                <div className="h-3 w-3/4 rounded-full bg-white/10" style={{ marginLeft: '18px' }} />
                <div className="h-3 w-1/3 rounded-full bg-white/15" />
                <div className="h-3 w-2/5 rounded-full bg-white/10" style={{ marginLeft: '40px' }} />
              </div>
              <p className="mt-6 text-sm leading-6 text-white/50">
                Mise en page manuelle, alignements approximatifs, polices incohérentes, hésitations constantes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={2}>
            <div className="h-full rounded-[28px] border border-[#2B4EFF]/30 bg-gradient-to-br from-[#2B4EFF]/10 to-transparent p-8">
              <span className="inline-flex rounded-full bg-[#2B4EFF]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7C9CFF]">Après</span>
              <div className="mt-6 space-y-3">
                <div className="h-3 w-1/2 rounded-full bg-[#7C9CFF]/50" />
                <div className="h-2 w-1/3 rounded-full bg-white/30" />
                <div className="mt-4 h-2 w-full rounded-full bg-white/15" />
                <div className="h-2 w-5/6 rounded-full bg-white/15" />
                <div className="h-2 w-2/3 rounded-full bg-white/15" />
              </div>
              <p className="mt-6 text-sm leading-6 text-white/70">
                Un CV structuré, cohérent et professionnel, prêt à être envoyé — sans compromis sur le contenu.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}