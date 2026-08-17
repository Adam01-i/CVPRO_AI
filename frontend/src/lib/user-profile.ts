export type ExperienceLevel = 'student' | 'junior' | 'one_two' | 'three_five' | 'five_plus';

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; hint: string }[] = [
  { value: 'student', label: 'Étudiant', hint: "Vous êtes encore en formation" },
  { value: 'junior', label: "Moins d'1 an d'expérience", hint: 'Premiers stages ou premier emploi' },
  { value: 'one_two', label: '1 à 2 ans d’expérience', hint: 'Vous avez déjà occupé un ou plusieurs postes' },
  { value: 'three_five', label: '3 à 5 ans d’expérience', hint: 'Un parcours professionnel établi' },
  { value: 'five_plus', label: 'Plus de 5 ans d’expérience', hint: 'Profil confirmé ou expert' },
];

const STORAGE_KEY = 'cvpro:experience-level';

export function getStoredExperienceLevel(): ExperienceLevel | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(STORAGE_KEY);
  return (EXPERIENCE_LEVELS.some((l) => l.value === value) ? (value as ExperienceLevel) : null);
}

export function setStoredExperienceLevel(level: ExperienceLevel): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, level);
}

/**
 * Mapping simple, à enrichir à mesure que de nouveaux modèles sont ajoutés
 * au registry (voir components/cvs/templates/template-registry.tsx).
 */
export function getRecommendedTemplateId(level: ExperienceLevel | null): string | null {
  switch (level) {
    case 'student':
    case 'junior':
      return 'modern';
    case 'one_two':
      return 'minimal';
    case 'three_five':
    case 'five_plus':
      return 'classic';
    default:
      return null;
  }
}