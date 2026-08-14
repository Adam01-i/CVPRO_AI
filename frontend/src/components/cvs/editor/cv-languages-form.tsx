'use client';
export function CvLanguagesForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 8</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Langues</h2>
      </div>
      <form onSubmit={editor.createLanguage} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input name="name" placeholder="Langue" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="level" placeholder="Niveau" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">+ Ajouter une langue</button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {editor.languages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune langue ajoutée.</div>
        ) : null}
        {editor.languages.map((language: any) => (
          <div key={language.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
            <span>{language.name}{language.level ? ` · ${language.level}` : ''}</span>
            <button type="button" onClick={() => editor.removeLanguage(language.id)} className="text-rose-600">×</button>
          </div>
        ))}
      </div>
    </section>
  );
}