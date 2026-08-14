'use client';
export function CvCertificationsForm({ editor }: { editor: any }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 7</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Certifications</h2>
      </div>
      <form onSubmit={editor.createCertification} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input name="name" placeholder="Nom de la certification" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="organization" placeholder="Organisation" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="credentialId" placeholder="Identifiant" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input name="credentialUrl" placeholder="URL" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input type="date" name="issueDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <input type="date" name="expirationDate" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">+ Ajouter une certification</button>
        </div>
      </form>
      <div className="mt-4 space-y-3">
        {editor.certifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Aucune certification ajoutée.</div>
        ) : null}
        {editor.certifications.map((certification: any) => (
          <div key={certification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{certification.name}</div>
                <div className="text-sm text-slate-600">{certification.organization || 'Organisation non renseignée'}</div>
              </div>
              <button type="button" onClick={() => editor.removeCertification(certification.id)} className="text-sm font-medium text-rose-600">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}