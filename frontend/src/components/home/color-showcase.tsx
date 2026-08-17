'use client';

import { useState } from 'react';
import { CvMiniPreview } from '@/components/cvs/preview/cv-mini-preview';
import { SAMPLE_CV } from '@/components/cvs/templates/sample-cv';
import { ACCENT_COLORS } from '@/components/cvs/templates/template-registry';
import { ScrollReveal } from './scroll-reveal';

export function ColorShowcase() {
  const [color, setColor] = useState(ACCENT_COLORS[1].value);

  return (
    <section className="bg-gradient-to-b from-[#1a2a6b] to-[#2B4EFF] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-2 lg:items-center">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Personnalisation</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Une couleur qui vous ressemble, en un clic.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/70 sm:text-base">
            Testez-le tout de suite : choisissez une couleur et regardez votre CV se transformer instantanément.
          </p>

          <div className="mt-8 flex flex-wrap gap-3" role="radiogroup" aria-label="Couleur du CV">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={c.value === color}
                aria-label={c.name}
                onClick={() => setColor(c.value)}
                className={`h-10 w-10 rounded-full transition ${
                  c.value === color ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#2B4EFF] ring-white' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={2}>
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[24px] shadow-2xl">
            <CvMiniPreview cv={{ ...SAMPLE_CV, templateId: 'modern' }} userName="Prénom Nom" accentColor={color} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}