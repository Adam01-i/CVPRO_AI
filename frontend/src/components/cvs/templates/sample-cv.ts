import type { Cv } from '@/types/api';

export const SAMPLE_CV: Partial<Cv> = {
  title: 'Chef de projet digital',
  profession: 'Chef de projet digital',
  summary: "Professionnel organisé avec une solide expérience en gestion de projets digitaux et coordination d'équipes pluridisciplinaires.",
  email: 'prenom.nom@email.com',
  addressLine: '',
  city: 'Dakar',
  experiences: [
    {
      id: 's1', cvId: '', company: 'Entreprise XYZ', position: 'Chef de projet',
      location: 'Dakar', description: 'Pilotage de projets digitaux de bout en bout.',
      startDate: '2022-01-01', endDate: null, isCurrent: true,
      createdAt: '', updatedAt: '',
    } as any,
    {
      id: 's2', cvId: '', company: 'Entreprise ABC', position: 'Chargé de projet',
      location: 'Dakar', description: 'Coordination des équipes techniques et créatives.',
      startDate: '2019-03-01', endDate: '2021-12-01', isCurrent: false,
      createdAt: '', updatedAt: '',
    } as any,
  ],
  educations: [
    {
      id: 's3', cvId: '', institution: 'Université', degree: 'Master en gestion de projet',
      startDate: '2017-09-01', endDate: '2019-06-01', isCurrent: false,
      createdAt: '', updatedAt: '',
    } as any,
  ],
  skills: [
    { id: 's4', cvId: '', skillId: '', skill: { id: '', name: 'Gestion de projet' } } as any,
    { id: 's5', cvId: '', skillId: '', skill: { id: '', name: 'Communication' } } as any,
    { id: 's6', cvId: '', skillId: '', skill: { id: '', name: 'Agilité' } } as any,
  ],
  languages: [
    { id: 's7', cvId: '', name: 'Français', level: 'Natif', createdAt: '' },
    { id: 's8', cvId: '', name: 'Anglais', level: 'Courant', createdAt: '' },
  ],
};