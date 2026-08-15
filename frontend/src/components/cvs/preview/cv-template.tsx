'use client';

import type { Cv } from '@/types/api';
import { getTemplateMeta, DEFAULT_ACCENT_COLOR } from '../templates/template-registry';

export type CvTemplateProps = {
  cv: Partial<Cv>;
  userName: string;
  photoUrl: string | null;
  accentColor: string;
};

export function CvTemplate(props: Omit<CvTemplateProps, 'accentColor'> & { accentColor?: string }) {
  const meta = getTemplateMeta(props.cv.templateId);
  const TemplateComponent = meta.component;
  const accentColor = props.accentColor ?? props.cv.accentColor ?? DEFAULT_ACCENT_COLOR;

  return <TemplateComponent {...props} accentColor={accentColor} />;
}