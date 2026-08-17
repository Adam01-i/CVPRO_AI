'use client';

import { useState } from 'react';
import { EXPERIENCE_LEVELS, type ExperienceLevel } from '@/lib/user-profile';

export function ExperienceQuestionnaire({
  onComplete,
}: {
  onComplete: (level: ExperienceLevel | null) => void;
}) {
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4 py-16">
      <div className="w-full max-w-xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Avant de commencer</p>
        <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Où en êtes-vous dans votre parcours ?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-white/60">
          Cela nous permet de vous recommander un modèle adapté à votre profil.
        </p>

        <div className="mt-10 space-y-3" role="radiogroup" aria-label="Niveau d'expérience">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = selected === level.value;
            return (
              <button
                key={level.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(level.value)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                  isSelected
                    ? 'border-[#2B4EFF] bg-[#2B4EFF]/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-white">{level.label}</p>
                  <p className="mt-0.5 text-xs text-white/50">{level.hint}</p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? 'border-[#2B4EFF] bg-[#2B4EFF]' : 'border-white/25'
                  }`}
                >
                  {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={!selected}
            onClick={() => onComplete(selected)}
            className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0B1220] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuer
          </button>
          <button
            type="button"
            onClick={() => onComplete(null)}
            className="text-xs font-medium text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
}