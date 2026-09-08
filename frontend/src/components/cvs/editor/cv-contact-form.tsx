'use client';

import { useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Méta-données d'affichage pour les types de liens (icône + couleur de badge).
// Doit rester synchronisé avec l'enum LinkType côté backend (Prisma).
// ---------------------------------------------------------------------------
const LINK_TYPE_OPTIONS: { value: string; label: string; badgeClass: string }[] = [
  { value: 'LINKEDIN', label: 'LinkedIn', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'GITHUB', label: 'GitHub', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'PORTFOLIO', label: 'Portfolio', badgeClass: 'bg-violet-50 text-violet-700 border-violet-200' },
  { value: 'PERSONAL', label: 'Site personnel', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'BEHANCE', label: 'Behance', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'DRIBBBLE', label: 'Dribbble', badgeClass: 'bg-pink-50 text-pink-700 border-pink-200' },
  { value: 'TWITTER', label: 'Twitter / X', badgeClass: 'bg-slate-100 text-slate-900 border-slate-300' },
  { value: 'OTHER', label: 'Autre', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
];

function linkMeta(type: string) {
  return LINK_TYPE_OPTIONS.find((o) => o.value === type) ?? LINK_TYPE_OPTIONS[LINK_TYPE_OPTIONS.length - 1];
}

const PHONE_LABEL_SUGGESTIONS = ['Mobile', 'Fixe', 'Professionnel', 'WhatsApp'];

function isLikelyUrl(value: string) {
  return /^https?:\/\/.+/i.test(value.trim());
}

// ---------------------------------------------------------------------------
// Chip d'action (style "+ Ajouter…") — cohérent avec les pastilles
// "informations supplémentaires" des générateurs de CV pro.
// ---------------------------------------------------------------------------
function AddChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
    >
      {label}
      <span className="text-base leading-none">+</span>
    </button>
  );
}

export function CvContactForm({ editor }: { editor: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // cv.photoUrl vaut déjà "/uploads/cv-photos/xxx.jpg" : ce chemin est
  // désormais rewrité vers le backend par next.config.ts (règle /uploads/:path*),
  // il ne faut donc PAS le préfixer par NEXT_PUBLIC_API_URL (qui vaut /api/v1
  // et ne sert pas les fichiers statiques).
  const photoUrl = editor.cv?.photoUrl ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void editor.uploadPhoto(file);
    e.target.value = '';
  };

  // ------------------------------------------------------------------
  // Téléphones
  // ------------------------------------------------------------------
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState({ label: '', number: '', primary: false });
  const canSubmitPhone = phoneDraft.number.trim().length >= 3;

  const openPhoneForm = () => {
    setPhoneDraft({ label: '', number: '', primary: editor.phonesState.length === 0 });
    setShowPhoneForm(true);
  };

  const submitPhone = () => {
    if (!canSubmitPhone) return;
    void editor.addPhone({
      label: phoneDraft.label.trim() || undefined,
      number: phoneDraft.number.trim(),
      primary: phoneDraft.primary,
    });
    setShowPhoneForm(false);
  };

  // ------------------------------------------------------------------
  // Liens
  // ------------------------------------------------------------------
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkDraft, setLinkDraft] = useState({ type: 'LINKEDIN', label: '', url: '' });
  const [linkTouched, setLinkTouched] = useState(false);
  const linkUrlValid = isLikelyUrl(linkDraft.url);
  const canSubmitLink = linkUrlValid;

  const openLinkForm = () => {
    setLinkDraft({ type: 'LINKEDIN', label: '', url: '' });
    setLinkTouched(false);
    setShowLinkForm(true);
  };

  const submitLink = () => {
    setLinkTouched(true);
    if (!canSubmitLink) return;
    void editor.addLink({
      type: linkDraft.type,
      label: linkDraft.label.trim() || undefined,
      url: linkDraft.url.trim(),
    });
    setShowLinkForm(false);
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
          Email
          <input
            value={String(editor.draft.email ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, email: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="email@exemple.com"
          />
        </label>

        {/* -------------------------------------------------------------- */}
        {/* Téléphones                                                     */}
        {/* -------------------------------------------------------------- */}
        <div className="md:col-span-2 grid gap-3 text-sm font-medium text-slate-700">
          <div className="flex items-center justify-between">
            <span>Téléphones</span>
          </div>

          {editor.phonesState.length > 0 ? (
            <div className="flex flex-col gap-2">
              {editor.phonesState.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-200">
                      ☎
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{p.number}</span>
                        {p.primary ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            Principal
                          </span>
                        ) : null}
                      </div>
                      {p.label ? <div className="text-xs text-slate-500">{p.label}</div> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => editor.removePhoneLocal(p.id)}
                    className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Supprimer ce numéro"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {showPhoneForm ? (
            <div className="grid gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-slate-600">
                  Libellé (optionnel)
                  <input
                    list="phone-label-suggestions"
                    value={phoneDraft.label}
                    onChange={(e) => setPhoneDraft((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex : Mobile"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400"
                  />
                  <datalist id="phone-label-suggestions">
                    {PHONE_LABEL_SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </label>
                <label className="grid gap-1 text-xs font-medium text-slate-600">
                  Numéro
                  <input
                    autoFocus
                    value={phoneDraft.number}
                    onChange={(e) => setPhoneDraft((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="Ex : +221 77 123 45 67"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={phoneDraft.primary}
                  onChange={(e) => setPhoneDraft((prev) => ({ ...prev, primary: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                />
                Définir comme numéro principal
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={submitPhone}
                  disabled={!canSubmitPhone}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhoneForm(false)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div>
              <AddChip label="Ajouter un numéro" onClick={openPhoneForm} />
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Adresse (sans pays)                                            */}
        {/* -------------------------------------------------------------- */}
        <div className="md:col-span-2 grid gap-2">
          <span className="text-sm font-medium text-slate-700">Adresse</span>
          <input
            value={String(editor.draft.addressLine ?? '')}
            onChange={(e) => editor.setDraft((prev: any) => ({ ...prev, addressLine: e.target.value }))}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
            placeholder="Adresse (numéro, rue)"
          />
          <div className="grid grid-cols-2 gap-2">
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
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Liens professionnels                                           */}
        {/* -------------------------------------------------------------- */}
        <div className="md:col-span-2 grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Liens professionnels</span>
          </div>

          {editor.linksState.length > 0 ? (
            <div className="flex flex-col gap-2">
              {editor.linksState.map((l: any) => {
                const meta = linkMeta(l.type);
                return (
                  <div
                    key={l.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <div className="min-w-0">
                        {l.label ? (
                          <div className="text-sm font-medium text-slate-900">{l.label}</div>
                        ) : null}
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-sm text-blue-600 hover:underline"
                        >
                          {l.url}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => editor.removeLinkLocal(l.id)}
                      className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Supprimer ce lien"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

          {showLinkForm ? (
            <div className="grid gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-slate-600">
                  Type de lien
                  <select
                    value={linkDraft.type}
                    onChange={(e) => setLinkDraft((prev) => ({ ...prev, type: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400"
                  >
                    {LINK_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium text-slate-600">
                  Libellé (optionnel)
                  <input
                    value={linkDraft.label}
                    onChange={(e) => setLinkDraft((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex : Mon blog technique"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400"
                  />
                </label>
              </div>
              <label className="grid gap-1 text-xs font-medium text-slate-600">
                URL
                <input
                  autoFocus
                  value={linkDraft.url}
                  onChange={(e) => setLinkDraft((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://www.linkedin.com/in/votre-profil"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400"
                />
                {linkTouched && !linkUrlValid ? (
                  <span className="text-xs font-normal text-rose-600">
                    L’URL doit commencer par http:// ou https://
                  </span>
                ) : null}
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={submitLink}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkForm(false)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div>
              <AddChip label="Ajouter un lien" onClick={openLinkForm} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}