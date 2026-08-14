export function CvLibraryHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Portfolio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Mes CV</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Gérez, personnalisez et préparez vos CV pour vos prochaines candidatures.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Créer un CV
        </button>
      </div>
    </section>
  );
}