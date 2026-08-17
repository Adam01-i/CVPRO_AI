'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { Cv } from '@/types/api';
import { CvTemplate } from './cv-template';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

/**
 * Miniature de CV avec échelle calculée en JavaScript, de façon synchrone
 * avant le premier paint (useLayoutEffect), pour éviter tout flash de
 * contenu non réduit. Contrairement à une tentative précédente basée sur
 * `scale(calc(100cqw / 794))` : cette syntaxe CSS (division de longueurs
 * en unités de container query) n'est pas fiablement supportée — quand
 * elle échoue silencieusement, le navigateur ignore le transform entier
 * et affiche le CV à sa taille native, coupé par overflow-hidden. D'où
 * le rendu "trop zoomé" observé. Cette version ne dépend plus de cette
 * fonctionnalité CSS récente.
 */
export function CvMiniPreview({
  cv,
  userName,
  photoUrl = null,
  accentColor,
  className = '',
}: {
  cv: Partial<Cv>;
  userName: string;
  photoUrl?: string | null;
  accentColor: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setScale(width / A4_WIDTH);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={{ aspectRatio: `${A4_WIDTH} / ${A4_HEIGHT}` }}
    >
      {scale !== null ? (
        <div
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CvTemplate cv={cv} userName={userName} photoUrl={photoUrl} accentColor={accentColor} />
        </div>
      ) : null}
    </div>
  );
}