'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Simule une page A4 (210 x 297mm) à l'échelle de l'écran.
 * 1mm ≈ 3.7795px à 96dpi -> on fixe une largeur de référence en px
 * et on calcule le ratio d'échelle selon le conteneur disponible.
 */
const A4_WIDTH_PX = 794;  // 210mm @ 96dpi
const A4_HEIGHT_PX = 1123; // 297mm @ 96dpi

export function CvPage({ children, pageNumber, totalPages }: { children: React.ReactNode; pageNumber: number; totalPages: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? A4_WIDTH_PX;
      setScale(Math.min(1, width / A4_WIDTH_PX));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto mb-6 w-full max-w-[794px]">
      <div
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="relative"
      >
        <div className="h-full w-full overflow-hidden bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)] ring-1 ring-slate-200">
          {children}
        </div>
      </div>
      {/* Réserve l'espace réel après mise à l'échelle pour ne pas chevaucher la page suivante */}
      <div style={{ height: A4_HEIGHT_PX * scale - A4_HEIGHT_PX, marginTop: -1 }} aria-hidden />
      {totalPages > 1 ? (
        <p className="mt-2 text-center text-xs text-slate-400">Page {pageNumber} / {totalPages}</p>
      ) : null}
    </div>
  );
}