export function CvEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-8 p-8 sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:p-12">
        <div className="mx-auto w-full max-w-[220px]">
          <div className="aspect-[210/297] w-full rounded-2xl bg-slate-50 ring-1 ring-slate-200">
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white">✦</div>
              <div className="h-2 w-24 rounded-full bg-slate-200" />
              <div className="h-2 w-16 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Votre prochain CV commence ici
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Créez un CV professionnel, structuré et à jour, prêt à être personnalisé pour chaque
            opportunité que vous ciblez.
          </p>
          <button
            type="button"
            onClick={onCreate}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Créer mon premier CV
          </button>
        </div>
      </div>
    </section>
  );
}