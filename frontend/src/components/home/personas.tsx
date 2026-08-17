import { PERSONAS } from './data';
import { ScrollReveal } from './scroll-reveal';

export function Personas() {
  return (
    <section className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pour tous les profils</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Quel que soit votre parcours, CVPro AI s'adapte.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((persona, index) => (
            <ScrollReveal key={persona.title} stagger={((index % 3) + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                  style={{ backgroundColor: `${persona.color}1A` }}
                >
                  {persona.emoji}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{persona.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{persona.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}