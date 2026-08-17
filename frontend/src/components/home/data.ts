export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Awa', role: 'Étudiante en informatique', quote: "J'ai enfin réussi à créer un CV dont je suis fière, sans passer des heures sur la mise en page.", rating: 5 },
  { name: 'Moussa', role: 'Développeur web', quote: "L'aperçu en temps réel m'a fait gagner un temps fou. Je voyais exactement le rendu final à chaque modification.", rating: 5 },
  { name: 'Fatou', role: 'Commerciale', quote: "Le choix des couleurs a fait toute la différence. Mon CV me ressemble enfin.", rating: 5 },
  { name: 'Ibrahima', role: 'Jeune diplômé', quote: "Simple à prendre en main, même sans aucune notion de design.", rating: 4 },
  { name: 'Aïcha', role: 'Cadre en reconversion', quote: "Pouvoir garder plusieurs versions de mon CV pour différents postes est exactement ce qu'il me fallait.", rating: 5 },
  { name: 'Cheikh', role: 'Chef de projet', quote: "La structure guidée m'a évité d'oublier des informations importantes.", rating: 5 },
];

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  { question: "Qu'est-ce qu'un CV designer ?", answer: "C'est un outil en ligne qui vous guide étape par étape pour créer un CV structuré et professionnel, sans avoir besoin de logiciel de mise en page." },
  { question: 'Comment créer un CV professionnel ?', answer: "Choisissez un modèle, renseignez vos informations section par section, et visualisez le résultat en temps réel avant de télécharger votre CV." },
  { question: 'Dois-je créer un compte pour commencer ?', answer: "Non. Vous pouvez créer un CV sans compte. Créer un compte vous permet en plus de conserver et retrouver vos CV plus tard." },
  { question: 'Combien de temps faut-il pour créer un CV ?', answer: "Cela dépend de la richesse de votre parcours, mais l'interface guidée est pensée pour aller à l'essentiel rapidement." },
  { question: 'Puis-je modifier mon CV après sa création ?', answer: "Oui, à tout moment depuis votre espace si vous êtes connecté. Chaque modification est enregistrée automatiquement." },
  { question: 'Puis-je changer de modèle ?', answer: "Oui, directement depuis l'éditeur, à tout moment, sans perdre vos informations déjà saisies." },
  { question: 'Puis-je changer les couleurs ?', answer: "Oui, une sélection de couleurs principales est disponible pour personnaliser votre CV." },
  { question: 'Puis-je ajouter une photo ?', answer: "Oui, l'ajout d'une photo de profil est possible directement depuis l'éditeur." },
  { question: 'Le CV est-il compatible avec les logiciels ATS ?', answer: "Certains modèles sont conçus en priorité pour la lisibilité par les logiciels de suivi des candidatures (ATS)." },
  { question: 'Puis-je télécharger mon CV en PDF ?', answer: "Le téléchargement est prévu comme étape finale de votre création de CV." },
  { question: 'Puis-je créer plusieurs versions de mon CV ?', answer: "Oui, en étant connecté, vous pouvez conserver plusieurs CV et activer celui que vous souhaitez utiliser." },
  { question: "L'intelligence artificielle peut-elle m'aider ?", answer: "Oui, une fonctionnalité d'analyse et d'amélioration de votre CV est disponible pour vous donner des recommandations concrètes." },
];

export type Persona = { emoji: string; title: string; text: string; color: string };

export const PERSONAS: Persona[] = [
  { emoji: '🎓', title: 'Étudiants', text: 'Un premier CV clair, même sans expérience professionnelle.', color: '#2B4EFF' },
  { emoji: '🚀', title: 'Jeunes diplômés', text: 'Mettez en valeur vos stages, projets et formations.', color: '#0F766E' },
  { emoji: '💼', title: 'Professionnels', text: 'Structurez un parcours riche sans perdre en clarté.', color: '#7C5CFC' },
  { emoji: '🔄', title: 'Reconversion', text: 'Racontez une transition de carrière de façon cohérente.', color: '#FF6B4A' },
  { emoji: '🌍', title: 'Candidats internationaux', text: 'Un format lisible, adaptable à différents contextes.', color: '#16A34A' },
  { emoji: '📈', title: 'Cadres et managers', text: 'Valorisez des responsabilités et des résultats concrets.', color: '#0B1220' },
];

export type Feature = { title: string; text: string };

export const FEATURES: Feature[] = [
  { title: 'Édition immersive', text: "Un espace plein écran pensé pour se concentrer sur le contenu, pas sur l'interface." },
  { title: 'Aperçu A4 fidèle', text: 'Ce que vous voyez à l’écran est la mise en page réelle de votre document.' },
  { title: 'Modèles & couleurs', text: 'Changez de modèle et de couleur à tout moment, avant ou pendant la création.' },
  { title: 'Sauvegarde automatique', text: 'Chaque modification est enregistrée sans action de votre part.' },
  { title: 'Photo de profil', text: 'Ajoutez ou retirez votre photo directement depuis l’éditeur.' },
  { title: 'Sans engagement', text: 'Créez un CV sans compte, ou connectez-vous pour retrouver vos versions.' },
];

export type WorkflowStep = { number: string; title: string; text: string };

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { number: '01', title: 'Choisissez votre modèle', text: 'Parcourez la bibliothèque de modèles et définissez votre couleur principale.' },
  { number: '02', title: 'Personnalisez votre profil', text: 'Renseignez vos coordonnées et rédigez votre résumé professionnel.' },
  { number: '03', title: 'Ajoutez vos expériences', text: 'Décrivez votre parcours professionnel, poste après poste.' },
  { number: '04', title: 'Valorisez vos compétences', text: 'Listez vos compétences clés et vos langues.' },
  { number: '05', title: 'Visualisez en temps réel', text: 'Votre CV au format A4 se met à jour à chaque modification.' },
  { number: '06', title: 'Finalisez et téléchargez', text: 'Votre CV est prêt, enregistré et accessible à tout moment.' },
];