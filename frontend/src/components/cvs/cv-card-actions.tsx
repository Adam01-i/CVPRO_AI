'use client';

import { useEffect, useRef, useState } from 'react';

export function CvCardActions({
  isActive,
  onActivate,
  onDuplicate,
  onDelete,
}: {
  isActive: boolean;
  onActivate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Autres actions"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
      >
        <span aria-hidden>⋯</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.35)]"
        >
          {!isActive ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); onActivate(); }}
              className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Activer
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onDuplicate(); }}
            className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Dupliquer
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Supprimer
          </button>
        </div>
      ) : null}
    </div>
  );
}