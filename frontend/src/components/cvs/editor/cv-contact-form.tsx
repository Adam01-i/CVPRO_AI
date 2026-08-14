'use client';

import { useRef } from 'react';

export function CvContactForm({ editor }: { editor: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoUrl = editor.cv?.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${editor.cv.photoUrl}`
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void editor.uploadPhoto(file);
    e.target.value = '';
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Étape 1</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Coordonnées</h2>
          <p className="mt-1 text-sm text-slate-500">
            Indiquez comment un recruteur peut vous contacter.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Photo de profil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl text-slate-300">👤</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={editor.photoUploading}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50"
          >
            {editor.photoUploading ? 'Envoi…' : photoUrl ? 'Changer la photo' : '+ Importer une photo'}
          </button>
          {photoUrl ? (
            <button
              type="button"
              onClick={() => void editor.removePhoto()}
              className="text-xs font-medium text-rose-600"
            >
              Supprimer la photo
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Titre du CV
          <input
            value={String(editor.draft.title ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, title: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Ex : CV développeur full-stack"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Profession
          <input
            value={String(editor.draft.profession ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, profession: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Ex : Développeuse backend"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            value={String(editor.draft.email ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, email: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="email@exemple.com"
          />
        </label>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <div className="flex items-center justify-between">
            <span>Téléphones</span>
            <button
              type="button"
              onClick={() => {
                const label = prompt('Libellé (ex: Mobile, Pro)') ?? undefined;
                const number = prompt('Numéro (ex: +33 6 12 34 56 78)') ?? '';
                if (number.trim()) void editor.addPhone({ label, number: number.trim(), primary: false });
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
            >
              + Ajouter un numéro
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {editor.phonesState.length === 0 ? (
              <div className="text-sm text-slate-500">Aucun numéro ajouté.</div>
            ) : editor.phonesState.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{p.label ?? 'Téléphone'}</div>
                  <div className="text-sm text-slate-700">{p.number}</div>
                </div>
                <button type="button" onClick={() => editor.removePhoneLocal(p.id)} className="text-sm text-rose-600">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 grid gap-2">
          <span className="text-sm font-medium text-slate-700">Adresse</span>
          <input
            value={String(editor.draft.addressLine ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, addressLine: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
            placeholder="Adresse (numéro, rue)"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              value={String(editor.draft.postalCode ?? '')}
              onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, postalCode: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
              placeholder="Code postal"
            />
            <input
              value={String(editor.draft.city ?? '')}
              onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, city: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
              placeholder="Ville"
            />
            <input
              value={String(editor.draft.country ?? '')}
              onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, country: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
              placeholder="Pays"
            />
          </div>
        </div>

        <div className="md:col-span-2 grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Liens professionnels</span>
            <button
              type="button"
              onClick={() => {
                const type = prompt('Type (LINKEDIN, GITHUB, PORTFOLIO, PERSONAL, OTHER)') ?? 'OTHER';
                const label = type === 'OTHER' ? prompt('Nom du lien (ex: Mon blog)') ?? undefined : undefined;
                const url = prompt('URL complète (https://...)') ?? '';
                if (url.trim()) void editor.addLink({ type: type.toUpperCase(), label, url: url.trim() });
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
            >
              + Ajouter un lien
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {editor.linksState.length === 0 ? (
              <div className="text-sm text-slate-500">Aucun lien ajouté.</div>
            ) : editor.linksState.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{l.type}{l.label ? ` · ${l.label}` : ''}</div>
                  <div className="text-sm text-slate-700">{l.url}</div>
                </div>
                <button type="button" onClick={() => editor.removeLinkLocal(l.id)} className="text-sm text-rose-600">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}