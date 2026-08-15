// src/app/layout.tsx
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'CVPro AI',
  description: 'Plateforme de gestion de CV et de candidatures pilotée par l’IA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
