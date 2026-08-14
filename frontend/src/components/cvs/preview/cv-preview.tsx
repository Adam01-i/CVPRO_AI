'use client';

import type { Cv } from '@/types/api';
import { CvPage } from './cv-page';
import { CvTemplate } from './cv-template';

export function CvPreview({ cv, userName }: { cv: Partial<Cv>; userName: string }) {
  const photoUrl = cv.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${cv.photoUrl}`
    : null;

  // Pagination multi-pages réelle non implémentée dans cette itération
  // (nécessite de mesurer la hauteur du contenu rendu) — voir points
  // restants en fin de livrable. Pour l'instant : une page A4, contenu
  // long visible en scroll interne à l'intérieur de la page si besoin.
  return (
    <div>
      <CvPage pageNumber={1} totalPages={1}>
        <CvTemplate cv={cv} userName={userName} photoUrl={photoUrl} />
      </CvPage>
    </div>
  );
}