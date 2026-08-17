import { CvMiniPreview } from '@/components/cvs/preview/cv-mini-preview';
import { SAMPLE_CV } from '@/components/cvs/templates/sample-cv';
import { TEMPLATES } from '@/components/cvs/templates/template-registry';
import { ScrollReveal } from './scroll-reveal';

const UPCOMING = ['Élégant', 'Créatif', 'Exécutif'];

export function TemplateShowcase() {
  return (
    <section id="modeles" className="bg-[#0B1220] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Bibliothèque de modèles</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Choisissez le style qui vous ressemble.
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((template, index) => (
            <ScrollReveal key={template.id} stagger={((index % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="group overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-2.5 transition hover:-translate-y-1 hover:border-white/20">
                <div className="overflow-hidden rounded-xl">
                  <CvMiniPreview cv={{ ...SAMPLE_CV, templateId: template.id }} userName="Prénom Nom" accentColor="#2B4EFF" />
                </div>
                <div className="px-1.5 py-2.5">
                  <p className="text-xs font-semibold text-white">{template.name}</p>
                  <p className="mt-0.5 text-[11px] capitalize text-white/50">{template.designType}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {UPCOMING.map((name, index) => (
            <ScrollReveal key={name} stagger={(((index + TEMPLATES.length) % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="flex aspect-[210/297] flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-white/[0.02] p-3">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/50">Bientôt</span>
                <p className="mt-2.5 text-xs font-medium text-white/40">{name}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}