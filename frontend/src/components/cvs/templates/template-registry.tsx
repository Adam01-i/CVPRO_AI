import type { Cv } from '@/types/api';
import { ModernTemplate } from '../preview/templates/modern-template';
import { ClassicTemplate } from '../preview/templates/classic-template';
import { MinimalTemplate } from '../preview/templates/minimal-template';

export type TemplateDesignType = 'moderne' | 'classique' | 'minimaliste' | 'creatif' | 'professionnel';
export type TemplateStyleTag = 'sobre' | 'elegant' | 'impactant' | 'ats';

export type CvTemplateRenderProps = {
  cv: Partial<Cv>;
  userName: string;
  photoUrl: string | null;
  accentColor: string;
};

export type TemplateMeta = {
  id: string;
  name: string;
  designType: TemplateDesignType;
  columns: 1 | 2;
  styleTags: TemplateStyleTag[];
  supportsPhoto: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  component: React.ComponentType<CvTemplateRenderProps>;
};

export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Bleu nuit', value: '#0f172a' },
  { name: 'Bleu', value: '#1d4ed8' },
  { name: 'Turquoise', value: '#0f766e' },
  { name: 'Vert', value: '#15803d' },
  { name: 'Rouge', value: '#b91c1c' },
  { name: 'Orange', value: '#c2410c' },
  { name: 'Violet', value: '#6d28d9' },
  { name: 'Noir', value: '#171717' },
];

export const DEFAULT_TEMPLATE_ID = 'modern';
export const DEFAULT_ACCENT_COLOR = ACCENT_COLORS[0].value;

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'modern',
    name: 'Modern',
    designType: 'moderne',
    columns: 2,
    styleTags: ['sobre', 'elegant'],
    supportsPhoto: true,
    isNew: true,
    isPopular: true,
    component: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classique',
    designType: 'classique',
    columns: 1,
    styleTags: ['sobre', 'ats'],
    supportsPhoto: false,
    isPopular: true,
    component: ClassicTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    designType: 'minimaliste',
    columns: 1,
    styleTags: ['sobre', 'elegant', 'ats'],
    supportsPhoto: false,
    isNew: true,
    component: MinimalTemplate,
  },
];

export function getTemplateMeta(templateId?: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
}