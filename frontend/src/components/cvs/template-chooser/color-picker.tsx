'use client';

import { ACCENT_COLORS } from '../templates/template-registry';

export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-900">Couleur principale</p>
      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Couleur principale du CV">
        {ACCENT_COLORS.map((c) => {
          const selected = c.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c.name}
              onClick={() => onChange(c.value)}
              className={`h-9 w-9 rounded-full transition ${
                selected ? 'ring-2 ring-offset-2 ring-slate-900' : 'ring-1 ring-inset ring-black/10 hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            />
          );
        })}
      </div>
    </div>
  );
}