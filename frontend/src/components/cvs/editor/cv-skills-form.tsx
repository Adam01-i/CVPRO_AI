'use client';
export function CvSkillsForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 5</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Compétences</h2>
        <p className="mt-1 text-sm text-slate-500">Mettez en avant vos expertises clés.</p>
      </div>
      <form onSubmit={editor.createSkill} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input name="name" placeholder="Nom de la compétence" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="category" placeholder="Catégorie" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <select name="level" defaultValue="INTERMEDIATE" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <option value="BEGINNER">Débutant</option>
          <option value="INTERMEDIATE">Intermédiaire</option>
          <option value="ADVANCED">Avancé</option>
          <option value="EXPERT">Expert</option>
        </select>
        <input type="number" min="0" step="1" name="years" placeholder="Années d'expérience" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">+ Ajouter une compétence</button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {editor.skills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune compétence ajoutée.</div>
        ) : null}
        {editor.skills.map((skill: any) => (
          <div key={skill.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
            <span>{skill.skill.name}</span>
            <button type="button" onClick={() => editor.removeSkill(skill.id)} className="text-rose-600">×</button>
          </div>
        ))}
      </div>
    </section>
  );
}