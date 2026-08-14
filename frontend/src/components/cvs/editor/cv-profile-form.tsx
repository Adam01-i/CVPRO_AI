'use client';
export function CvProfileForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 2</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Profil professionnel</h2>
        <p className="mt-1 text-sm text-slate-500">Résumez votre parcours en quelques phrases percutantes.</p>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Résumé professionnel
        <textarea
          value={String(editor.draft.summary ?? '')}
          onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, summary: e.target.value }))}
          rows={8}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="Décrivez votre profil, vos forces et le type de poste recherché."
        />
      </label>
    </section>
  );
}