'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    try {
      await register(form);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Échec de création du compte.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">C</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">CVPro</div>
            <div className="text-xl font-semibold text-slate-900">AI</div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Créer votre compte</h1>
        <p className="mt-2 text-sm text-slate-600">Commencez à construire un parcours de candidature plus intelligent.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
            <input
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Camille"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
            <input
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Martin"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Au moins 8 caractères"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="06 12 34 56 78"
            />
          </div>

          {error ? <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full" variant="primary">
              {pending ? 'Création...' : 'Créer mon compte'}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
