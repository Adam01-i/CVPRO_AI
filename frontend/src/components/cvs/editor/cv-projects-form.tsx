'use client';
import { useState } from 'react';

export function CvProjectsForm({ editor }: { editor: any }) {
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [technologyInput, setTechnologyInput] = useState('');

  const addTechnology = () => {
    const value = technologyInput.trim().replace(/[,;]+$/, '').trim();
    if (!value || technologies.some((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase())) return;
    setTechnologies((items) => [...items, value]);
    setTechnologyInput('');
  };
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 6</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Projets</h2>
        <p className="mt-1 text-sm text-slate-500">Vos réalisations les plus démonstratives.</p>
      </div>
      <form
        onSubmit={async (event) => {
          await editor.createProject(event);
          setTechnologies([]);
          setTechnologyInput('');
        }}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
      >
        <input name="name" placeholder="Nom du projet" required className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="url" placeholder="URL" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="githubUrl" placeholder="GitHub" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="grid min-w-0 gap-2">
          <label htmlFor="project-technology-input" className="text-sm font-medium text-slate-700">Technologies</label>
          <input type="hidden" name="technologies" value={technologies.join(', ')} />
          <div className="flex min-w-0 gap-2">
            <input
              id="project-technology-input"
              value={technologyInput}
              onChange={(event) => setTechnologyInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTechnology();
                }
              }}
              placeholder="Ex. React"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
            />
            <button type="button" onClick={addTechnology} className="shrink-0 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Ajouter
            </button>
          </div>
          {technologies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((technology, index) => (
                <span key={`${technology}-${index}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
                  {technology}
                  <button type="button" aria-label={`Supprimer ${technology}`} onClick={() => setTechnologies((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="ml-0.5 text-slate-400 hover:text-rose-600">×</button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
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