// =========================================================
// AUTH / USER
// =========================================================

export type UserRole = 'USER' | 'ADMIN';

export type SafeUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

  // Legacy / profil utilisateur
  phone?: string | null;
  location?: string | null;
  profileImage?: string | null;

  role: UserRole;

  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};


// =========================================================
// CV
// =========================================================

export type Cv = {
  id: string;
  userId: string;

  title: string;

  summary?: string | null;
  profession?: string | null;
  email?: string | null;
  photoUrl?: string | null; // ajouté

  templateId?: string;   // ajouté — défaut "modern" côté backend
  accentColor?: string;  // ajouté — défaut "#0f172a" côté backend

  // =======================================================
  // LEGACY FIELDS
  // =======================================================
  // On les conserve volontairement pour compatibilité
  // avec les anciennes données / anciennes API.
  phone?: string | null;
  address?: string | null;

  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;

  // =======================================================
  // NOUVELLE ADRESSE STRUCTURÉE
  // =======================================================

  addressLine?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;

  // =======================================================
  // NOUVEAUX TÉLÉPHONES
  // =======================================================

  phones?: CvPhone[];

  // =======================================================
  // NOUVEAUX LIENS
  // =======================================================

  links?: CvLink[];

  // =======================================================
  // STATUS
  // =======================================================

  isActive: boolean;
  isPublic: boolean;

  createdAt: string;
  updatedAt: string;

  // =======================================================
  // CV CONTENT
  // =======================================================

  experiences?: Experience[];
  educations?: Education[];
  skills?: CvSkill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
};


// =========================================================
// EXPERIENCE
// =========================================================

export type Experience = {
  id: string;
  cvId: string;

  company: string;
  position: string;

  location?: string | null;
  description?: string | null;

  startDate: string;
  endDate?: string | null;

  isCurrent?: boolean;

  createdAt: string;
  updatedAt: string;
};


// =========================================================
// EDUCATION
// =========================================================

export type Education = {
  id: string;
  cvId: string;

  institution: string;
  degree: string;

  field?: string | null;
  level?: string | null;
  location?: string | null;
  description?: string | null;

  startDate: string;
  endDate?: string | null;

  isCurrent?: boolean;

  createdAt: string;
  updatedAt: string;
};


// =========================================================
// SKILLS
// =========================================================

export type Skill = {
  id: string;
  name: string;
  category?: string | null;
};

export type CvSkill = {
  id: string;
  cvId: string;
  skillId: string;

  level?: string | null;
  years?: number | null;

  skill: Skill;
};


// =========================================================
// PROJECTS
// =========================================================

export type Project = {
  id: string;
  cvId: string;

  name: string;

  description?: string | null;

  url?: string | null;
  githubUrl?: string | null;

  technologies?: string | null;

  startDate?: string | null;
  endDate?: string | null;

  createdAt: string;
  updatedAt: string;
};


// =========================================================
// CERTIFICATIONS
// =========================================================

export type Certification = {
  id: string;
  cvId: string;

  name: string;

  organization?: string | null;

  issueDate?: string | null;
  expirationDate?: string | null;

  credentialId?: string | null;
  credentialUrl?: string | null;

  createdAt: string;
};


// =========================================================
// LANGUAGES
// =========================================================

export type Language = {
  id: string;
  cvId: string;

  name: string;
  level?: string | null;

  createdAt: string;
};


// =========================================================
// CV PHONES
// =========================================================

export type CvPhone = {
  id: string;
  cvId: string;

  label?: string | null;
  number: string;

  primary: boolean;

  createdAt: string;
};


// =========================================================
// CV LINKS
// =========================================================

export type CvLinkType =
  | 'LINKEDIN'
  | 'GITHUB'
  | 'PORTFOLIO'
  | 'PERSONAL'
  | 'BEHANCE'
  | 'DRIBBBLE'
  | 'TWITTER'
  | 'OTHER';

export type CvLink = {
  id: string;
  cvId: string;

  type: CvLinkType;

  label?: string | null;

  url: string;

  createdAt: string;
};


// =========================================================
// COMPANY
// =========================================================

export type Company = {
  id: string;
  name: string;

  description?: string | null;
  website?: string | null;
  location?: string | null;
  logoUrl?: string | null;

  createdAt: string;
  updatedAt: string;
};


// =========================================================
// JOB OFFERS
// =========================================================

export type JobOffer = {
  id: string;

  companyId?: string | null;

  title: string;
  description: string;

  location?: string | null;

  remote: boolean;

  contractType?: string | null;

  salaryMin?: number | null;
  salaryMax?: number | null;

  currency?: string | null;

  requirements?: string | null;
  responsibilities?: string | null;

  applicationUrl?: string | null;

  isActive: boolean;

  publishedAt?: string | null;
  deadline?: string | null;

  createdAt: string;
  updatedAt: string;

  company?: Company | null;

  skills?: JobOfferSkill[];

  applicationCount?: number;
  hasApplied?: boolean;
};


export type JobOfferSkill = {
  id: string;
  jobOfferId: string;
  skillId: string;

  required: boolean;

  skill: Skill;
};


// =========================================================
// JOB APPLICATION
// =========================================================

export type JobApplication = {
  id: string;

  userId: string;

  cvId?: string | null;

  jobOfferId: string;

  status: string;

  coverLetter?: string | null;
  appliedAt?: string | null;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  jobOffer?: JobOffer;

  cv?: Cv;

  user?: Pick<
    SafeUser,
    'id' | 'email' | 'firstName' | 'lastName'
  >;
};


// =========================================================
// AI ANALYSIS
// =========================================================

export type AiAnalysis = {
  id: string;

  userId: string;
  cvId: string;

  type:
    | 'CV_ANALYSIS'
    | 'JOB_MATCHING'
    | 'CV_IMPROVEMENT';

  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED';

  score?: number | null;

  overallFeedback?: string | null;

  strengths?: string[] | null;
  weaknesses?: string[] | null;
  recommendations?: string[] | null;

  extractedData?: Record<string, unknown> | null;
  rawResponse?: Record<string, unknown> | null;

  model?: string | null;

  processingTime?: number | null;

  createdAt: string;
  updatedAt: string;
};


// =========================================================
// AI CV IMPROVEMENT
// =========================================================

export type CVImprovementResult = {
  id: string;

  userId: string;
  cvId: string;

  type: 'CV_IMPROVEMENT';

  status: 'COMPLETED';

  scoreBefore: number;
  scoreAfter: number;

  improvements: {
    title: string;
    summary: string;
    skills: string;
    experience: string[];
    projects: string;
  };

  keywords: string[];

  recommendations: string[];

  model?: string | null;

  createdAt: string;
  updatedAt: string;
};