'use client';

import type { Cv } from '@/types/api';

export function CvThumbnail({ cv, userName }: { cv: Cv; userName: string }) {
  const photoUrl = cv.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${cv.photoUrl}`
    : null;

  const hasExperience = (cv.experiences?.length ?? 0) > 0;
  const hasEducation = (cv.educations?.length ?? 0) > 0;
  const skillCount = cv.skills?.length ?? 0;

  return (
    <div
      className="relative aspect-[210/297] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
      role="img"
      aria-label={`Aperçu du CV ${cv.title}`}
    >
      <div className="flex h-full w-full">
        {/* Colonne sombre — reprend le style de la sidebar du template éditeur */}
        <div className="flex w-[32%] flex-col items-center gap-2 bg-slate-900 px-2 py-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-white/10" />
          )}
          <div className="mt-1 h-[3px] w-3/4 rounded-full bg-white/30" />
          <div className="h-[3px] w-1/2 rounded-full bg-white/15" />
          <div className="mt-3 w-full space-y-1">
            <div className="h-[2px] w-full rounded-full bg-white/10" />
            <div className="h-[2px] w-4/5 rounded-full bg-white/10" />
            {skillCount > 0 ? (
              <div className="flex flex-wrap gap-[2px] pt-1">
                {Array.from({ length: Math.min(skillCount, 6) }).map((_, i) => (
                  <span key={i} className="h-[4px] w-3 rounded-full bg-white/10" />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Colonne principale */}
        <div className="flex-1 space-y-2 px-2.5 py-4">
          <div className="h-[7px] w-3/4 rounded-full bg-slate-800" />
          <div className="h-[4px] w-1/2 rounded-full bg-slate-400" />

          {cv.summary ? (
            <div className="space-y-1 pt-1">
              <div className="h-[3px] w-full rounded-full bg-slate-200" />
              <div className="h-[3px] w-full rounded-full bg-slate-200" />
              <div className="h-[3px] w-2/3 rounded-full bg-slate-200" />
            </div>
          ) : null}

          {hasExperience ? (
            <div className="space-y-1 pt-1.5">
              <div className="h-[3px] w-1/3 rounded-full bg-slate-500" />
              <div className="h-[3px] w-full rounded-full bg-slate-200" />
              <div className="h-[3px] w-4/5 rounded-full bg-slate-200" />
            </div>
          ) : null}

          {hasEducation ? (
            <div className="space-y-1 pt-1.5">
              <div className="h-[3px] w-1/3 rounded-full bg-slate-500" />
              <div className="h-[3px] w-full rounded-full bg-slate-200" />
            </div>
          ) : null}

          {!cv.summary && !hasExperience && !hasEducation ? (
            <p className="pt-2 text-[6px] font-medium leading-tight text-slate-300">
              CV en préparation
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}