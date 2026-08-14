'use client';
export function CvProjectsForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 6</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Projets</h2>
        <p className="mt-1 text-sm text-slate-500">Vos réalisations les plus démonstratives.</p>
      </div>
      <form onSubmit={editor.createProject} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input name="name" placeholder="Nom du projet" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="url" placeholder="URL" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="githubUrl" placeholder="GitHub" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="technologies" placeholder="Technologies" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input type="date" name="startDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input type="date" name="endDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <textarea name="description" rows={4} placeholder="Description" className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">+ Ajouter un projet</button>
        </div>
      </form>
      <div className="mt-4 space-y-3">
        {editor.projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucun projet ajouté.</div>
        ) : null}
        {editor.projects.map((project: any) => (
          <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{project.name}</div>
                <div className="text-sm text-slate-600">{project.technologies || 'Technologies non renseignées'}</div>
              </div>
              <button type="button" onClick={() => editor.removeProject(project.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}