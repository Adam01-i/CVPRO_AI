'use client';

import { useEffect, useState } from 'react';

export function RouteLoadingVeil({
  children,
  label = 'Préparation de votre espace de création…',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className={`transition-all duration-500 motion-reduce:transition-none ${ready ? 'opacity-100 blur-0' : 'opacity-60 blur-md'}`}>
        {children}
      </div>

      {!ready ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0B1220]/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" aria-hidden />
            <p className="text-sm font-medium text-white">{label}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}