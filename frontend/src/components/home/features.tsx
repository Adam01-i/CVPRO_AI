import { FEATURES } from './data';
import { ScrollReveal } from './scroll-reveal';

export function Features() {
  const [first, second, third, fourth, fifth, sixth] = FEATURES;

  return (
    <section id="fonctionnalites" className="bg-[#0B1220] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Pourquoi CVPro AI</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Pensé pour la clarté, pas pour la complexité.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <ScrollReveal stagger={1} className="lg:col-span-2 lg:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-[#2B4EFF]/30 bg-gradient-to-br from-[#2B4EFF]/15 to-transparent p-8">
              <div>
                <h3 className="text-2xl font-semibold text-white">{first.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{first.text}</p>
              </div>
              <div className="mt-8 h-28 rounded-2xl bg-white/5" />
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={2}>
            <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold text-white">{second.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{second.text}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={3}>
            <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold text-white">{third.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{third.text}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={1}>
            <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold text-white">{fourth.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{fourth.text}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={2} className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{fifth.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">{fifth.text}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <h3 className="text-lg font-semibold text-white">{sixth.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">{sixth.text}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}