'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    try {
      await login({ email, password });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Échec de connexion.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">C</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">CVPro</div>
            <div className="text-xl font-semibold text-slate-900">AI</div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Bon retour</h1>
        <p className="mt-2 text-sm text-slate-600">Connectez-vous pour gérer vos CV, candidatures et opportunités.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <Button type="submit" className="w-full" variant="primary">
            {pending ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Nouveau chez CVPro ?{' '}
          <Link href="/register" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
