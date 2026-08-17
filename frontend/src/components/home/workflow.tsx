import { BrowserFrame } from './browser-frame';
import { ScrollReveal } from './scroll-reveal';
import { WORKFLOW_STEPS } from './data';

export function Workflow() {
  return (
    <section id="comment-ca-marche" className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Comment ça marche</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Un parcours guidé, du premier mot au CV prêt à envoyer.
          </h2>
        </ScrollReveal>

        <div className="mt-20 space-y-20">
          {WORKFLOW_STEPS.map((step, index) => (
            <ScrollReveal key={step.number} stagger={((index % 3) + 1) as 1 | 2 | 3}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <span className="text-6xl font-semibold text-slate-200">{step.number}</span>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{step.text}</p>
                </div>
                <BrowserFrame label={`cvpro.ai/create — ${step.title.toLowerCase()}`}>
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs font-medium text-slate-300">Capture d'écran à venir</span>
                  </div>
                </BrowserFrame>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}