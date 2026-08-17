import { TESTIMONIALS } from './data';
import { ScrollReveal } from './scroll-reveal';

export function Testimonials() {
  return (
    <section className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Retours d'expérience</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Témoignages de démonstration.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-500">
            Ces témoignages illustrent l'expérience type visée par CVPro AI et seront remplacés par de vrais retours utilisateurs.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <ScrollReveal key={t.name} stagger={((index % 3) + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex gap-0.5 text-amber-400" aria-label={`${t.rating} étoiles sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating ? '' : 'text-slate-200'}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}