export type UserRole = 'USER' | 'ADMIN';

export type SafeUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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

export type Cv = {
  id: string;
  userId: string;
  title: string;
  summary?: string | null;
  profession?: string | null;
  email?: string | null;
  phone?: string | null; // legacy single phone
  address?: string | null; // legacy freeform address
  addressLine?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  phones?: CvPhone[];
  links?: CvLink[];
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  experiences?: Experience[];
  educations?: Education[];
  skills?: CvSkill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
};

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

export type Language = {
  id: string;
  cvId: string;
  name: string;
  level?: string | null;
  createdAt: string;
};

export type CvPhone = {
  id: string;
  cvId: string;
  label?: string | null;
  number: string;
  primary: boolean;
  createdAt: string;
};

export type CvLink = {
  id: string;
  cvId: string;
  type: 'LINKEDIN' | 'GITHUB' | 'PORTFOLIO' | 'PERSONAL' | 'BEHANCE' | 'DRIBBBLE' | 'TWITTER' | 'OTHER';
  label?: string | null;
  url: string;
  createdAt: string;
};

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
  user?: Pick<SafeUser, 'id' | 'email' | 'firstName' | 'lastName'>;
};

export type AiAnalysis = {
  id: string;
  userId: string;
  cvId: string;
  type: 'CV_ANALYSIS' | 'JOB_MATCHING' | 'CV_IMPROVEMENT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
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
