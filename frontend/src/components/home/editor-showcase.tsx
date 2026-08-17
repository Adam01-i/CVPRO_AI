import { BrowserFrame } from './browser-frame';
import { ScrollReveal } from './scroll-reveal';

export function EditorShowcase() {
  return (
    <section className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">L'éditeur</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Un espace de travail pensé pour se concentrer sur l'essentiel.
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger={2} className="mt-14">
          <BrowserFrame label="cvpro.ai/dashboard/cvs/[id]">
            <div className="flex h-full">
              <div className="hidden w-[28%] flex-col gap-2 bg-[#0B1220] p-4 sm:flex">
                <div className="h-2 w-2/3 rounded-full bg-white/30" />
                {['Coordonnées', 'Profil', 'Expérience', 'Formation', 'Compétences'].map((label, i) => (
                  <div key={label} className="mt-3 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${i < 2 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className="h-2 w-16 rounded-full bg-white/20" />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 items-center justify-center text-xs font-medium text-slate-300">
                Capture d'écran à venir
              </div>
            </div>
          </BrowserFrame>
        </ScrollReveal>
      </div>
    </section>
  );
}