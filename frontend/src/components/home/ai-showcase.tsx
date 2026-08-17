import { ScrollReveal } from './scroll-reveal';

export function AiShowcase() {
  return (
    <section className="bg-[#0B1220] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-2 lg:items-center">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B39CFF]">Assistant IA</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Un regard extérieur sur votre CV.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/70 sm:text-base">
            L'assistant analyse votre CV et vous propose des recommandations concrètes pour le renforcer — score, points forts, axes d'amélioration.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger={2}>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Score global</span>
              <span className="text-2xl font-semibold text-white">78/100</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] rounded-full bg-[#7C5CFC]" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Point fort</p>
                <p className="mt-1.5 text-sm text-white/80">Expériences bien structurées avec des résultats concrets.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Recommandation</p>
                <p className="mt-1.5 text-sm text-white/80">Ajoutez des mots-clés liés à votre secteur pour améliorer la lisibilité ATS.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}