'use client';

import type { Cv } from '@/types/api';
import { ModernTemplate } from './templates/modern-template';

export type CvTemplateProps = {
  cv: Partial<Cv>;
  userName: string;
  photoUrl: string | null;
};

/**
 * Point d'entrée unique pour le choix du template.
 * Ajouter un nouveau style : créer templates/classic-template.tsx,
 * l'importer ici, et le sélectionner selon cv.templateId (à ajouter
 * plus tard côté backend si besoin — non nécessaire aujourd'hui).
 */
export function CvTemplate(props: CvTemplateProps) {
  return <ModernTemplate {...props} />;
}