'use client';
export function CvExperienceForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 3</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Expériences</h2>
        <p className="mt-1 text-sm text-slate-500">Ajoutez vos expériences les plus pertinentes.</p>
      </div>
      <form onSubmit={editor.createExperience} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input name="company" placeholder="Entreprise" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="position" placeholder="Poste" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="location" placeholder="Localisation" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="isCurrent" className="h-4 w-4" /> Poste actuel</label>
        <input type="date" name="startDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input type="date" name="endDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <textarea name="description" rows={4} placeholder="Description" className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">+ Ajouter une expérience</button>
        </div>
      </form>
      <div className="mt-4 space-y-3">
        {editor.experiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune expérience ajoutée.</div>
        ) : null}
        {editor.experiences.map((experience: any) => (
          <div key={experience.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{experience.position}</div>
                <div className="text-sm text-slate-600">{experience.company}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(experience.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  {' — '}
                  {experience.isCurrent ? 'Aujourd\'hui' : experience.endDate ? new Date(experience.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''}
                </div>
              </div>
              <button type="button" onClick={() => editor.removeExperience(experience.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}