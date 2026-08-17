'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from './data';
import { ScrollReveal } from './scroll-reveal';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#0B1220] py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Questions fréquentes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            CV designer : les questions les plus fréquentes
          </h2>
        </ScrollReveal>

        <div className="mt-14 divide-y divide-white/10 rounded-[24px] border border-white/10 bg-white/[0.02]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-white sm:text-base">{item.question}</span>
                  <span className={`shrink-0 text-white/50 transition-transform ${isOpen ? 'rotate-45' : ''}`} aria-hidden>
                    +
                  </span>
                </button>
                {isOpen ? (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-6 text-white/60">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}