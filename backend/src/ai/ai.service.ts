import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnalysisStatus, AnalysisType, Education, Experience, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface SemanticMatcher {
  calculateSimilarity(cvText: string, jobText: string): Promise<number>;
}

export interface CVAnalysisEngine {
  analyze(cv: CVAnalysisInput): CVAnalysisResult;
}

export type CVAnalysisInput = {
  id: string;
  userId: string;
  title?: string | null;
  summary?: string | null;
  profession?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  experiences?: Array<{
    position?: string | null;
    company?: string | null;
    description?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    isCurrent?: boolean | null;
  }> | null;
  educations?: Array<{
    institution?: string | null;
    degree?: string | null;
    field?: string | null;
    level?: string | null;
    description?: string | null;
  }> | null;
  skills?: Array<{ skill?: { name?: string | null } | null }> | null;
  projects?: Array<{
    name?: string | null;
    description?: string | null;
    githubUrl?: string | null;
    url?: string | null;
    technologies?: string | null;
  }> | null;
  certifications?: Array<{
    name?: string | null;
    organization?: string | null;
    issueDate?: Date | null;
    credentialUrl?: string | null;
  }> | null;
  languages?: Array<{ name?: string | null; level?: string | null }> | null;
};

export type CVAnalysisResult = {
  score: number;
  atsScore: number;
  completenessScore: number;
  experienceScore: number;
  skillsScore: number;
  educationScore: number;
  projectsScore: number;
  certificationsScore: number;
  languagesScore: number;
  presentationScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  atsIssues: string[];
  atsKeywords: string[];
  atsRecommendations: string[];
  overallFeedback: string;
  extractedData: Record<string, unknown>;
  rawResponse: Record<string, unknown>;
};

export class LocalSemanticMatcher implements SemanticMatcher {
  async calculateSimilarity(cvText: string, jobText: string): Promise<number> {
    const cvTokens = this.buildTokens(cvText);
    const jobTokens = this.buildTokens(jobText);

    if (!cvTokens.length || !jobTokens.length) {
      return 0;
    }

    const cvSet = new Set(cvTokens);
    const jobSet = new Set(jobTokens);
    const intersection = [...cvSet].filter((token) => jobSet.has(token)).length;
    const unionSize = new Set([...cvSet, ...jobSet]).size;

    if (unionSize === 0) {
      return 0;
    }

    const jaccard = intersection / unionSize;
    const overlap = intersection / Math.min(cvTokens.length, jobTokens.length);
    const score = Math.max(jaccard, overlap);

    return Number(Math.min(100, Math.max(0, score * 100)).toFixed(2));
  }

  private buildTokens(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'for', 'with', 'from', 'into', 'of', 'in', 'on',
      'at', 'to', 'by', 'as', 'is', 'are', 'be', 'been', 'being', 'this', 'that', 'these',
      'those', 'our', 'your', 'their', 'its', 'we', 'you', 'they', 'he', 'she', 'it', 'his',
      'her', 'them', 'role', 'work', 'experience', 'using', 'used', 'team', 'project',
      'projects', 'skills', 'profile', 'candidate', 'company', 'offers', 'offer',
    ]);

    return (text ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s+.#-]/g, ' ')
      .split(/\s+/)
      .map((token) => token.replace(/[.+#-]/g, ''))
      .filter((token) => token.length > 1 && !stopWords.has(token))
      .map((token) => token.replace(/s$/, ''));
  }
}

export class LocalCVAnalysisEngine implements CVAnalysisEngine {
  analyze(cv: CVAnalysisInput): CVAnalysisResult {
    const title = (cv.title ?? '').trim();
    const summary = (cv.summary ?? '').trim();
    const profession = (cv.profession ?? '').trim();
    const experiences = cv.experiences ?? [];
    const educations = cv.educations ?? [];
    const skills = cv.skills ?? [];
    const projects = cv.projects ?? [];
    const certifications = cv.certifications ?? [];
    const languages = cv.languages ?? [];

    const skillNames = skills
      .map((entry) => entry?.skill?.name ?? '')
      .filter((name) => !!name)
      .map((name) => name.trim());

    const projectNames = projects.map((project) => project.name ?? '').filter(Boolean);
    const certificationNames = certifications.map((cert) => cert.name ?? '').filter(Boolean);
    const languageNames = languages.map((language) => language.name ?? '').filter(Boolean);
    const totalExperienceYears = this.calculateTotalExperienceYears(experiences);
    const avgExperienceDescription = this.calculateAverageDescriptionLength(experiences);
    const professionalProgressionScore = this.calculateProgressionScore(experiences);
    const descriptionCoverage = this.calculateDescriptionCoverage(experiences);

    const completenessScore = this.calculateCompletenessScore({
      title,
      summary,
      profession,
      skillCount: skillNames.length,
      experienceCount: experiences.length,
      projectCount: projects.length,
      certificationCount: certifications.length,
      languageCount: languages.length,
      hasEmail: !!cv.email,
      hasPhone: !!cv.phone,
      hasLinkedin: !!cv.linkedin,
      hasGithub: !!cv.github,
      hasPortfolio: !!cv.portfolio,
    });

    const experienceScore = this.calculateExperienceScore({
      totalExperienceYears,
      experienceCount: experiences.length,
      averageDescriptionLength: avgExperienceDescription,
      descriptionCoverage,
      progressionScore: professionalProgressionScore,
    });

    const skillsScore = this.calculateSkillsScore(skillNames);
    const educationScore = this.calculateEducationScore(educations, profession || title || summary);
    const projectsScore = this.calculateProjectsScore(projects);
    const certificationsScore = this.calculateCertificationsScore(certifications);
    const languagesScore = this.calculateLanguagesScore(languages);
    const presentationScore = this.calculatePresentationScore({
      title,
      profession,
      summary,
      hasLinkedin: !!cv.linkedin,
      hasGithub: !!cv.github,
      hasPortfolio: !!cv.portfolio,
    });

    const score = this.round(
      completenessScore * 0.15 +
      experienceScore * 0.25 +
      skillsScore * 0.2 +
      educationScore * 0.1 +
      projectsScore * 0.15 +
      certificationsScore * 0.05 +
      languagesScore * 0.05 +
      presentationScore * 0.05,
    );

    const atsKeywords = this.extractAtsKeywords(skillNames, projectNames, certificationNames, languageNames, title, profession, summary);
    const atsIssues = this.buildAtsIssues({
      title,
      summary,
      profession,
      skillCount: skillNames.length,
      experienceCount: experiences.length,
      educationCount: educations.length,
      projectCount: projects.length,
      languages,
    });
    const atsRecommendations = this.buildAtsRecommendations({
      title,
      summary,
      skillCount: skillNames.length,
      experienceCount: experiences.length,
      projectCount: projects.length,
      languages,
      hasLinkedin: !!cv.linkedin,
      hasGithub: !!cv.github,
    });
    const atsScore = this.calculateAtsScore({
      title,
      summary,
      profession,
      skillCount: skillNames.length,
      experienceCount: experiences.length,
      educationCount: educations.length,
      projectCount: projects.length,
      languageCount: languages.length,
      keywords: atsKeywords,
    });

    const strengths = this.buildStrengths({
      skillNames,
      experienceCount: experiences.length,
      totalExperienceYears,
      projectCount: projects.length,
      certificationCount: certifications.length,
      languageCount: languages.length,
      educationCount: educations.length,
      summary,
      title,
      profession,
    });

    const weaknesses = this.buildWeaknesses({
      title,
      summary,
      skillCount: skillNames.length,
      averageDescriptionLength: avgExperienceDescription,
      experienceCount: experiences.length,
      projectCount: projects.length,
      certificationCount: certifications.length,
      languageCount: languages.length,
      hasGithub: !!cv.github,
      hasLinkedin: !!cv.linkedin,
      hasPortfolio: !!cv.portfolio,
      hasEmail: !!cv.email,
    });

    const recommendations = this.buildRecommendations({
      summary,
      skillNames,
      experienceCount: experiences.length,
      projectCount: projects.length,
      certificationCount: certifications.length,
      languageCount: languages.length,
      hasGithub: !!cv.github,
      hasLinkedin: !!cv.linkedin,
      hasPortfolio: !!cv.portfolio,
    });

    const extractedData = {
      title,
      profession,
      summary: summary || null,
      experienceCount: experiences.length,
      totalExperienceYears,
      skills: skillNames,
      projectCount: projects.length,
      certificationCount: certifications.length,
      languageCount: languages.length,
      educationCount: educations.length,
      linkedin: cv.linkedin ?? null,
      github: cv.github ?? null,
      portfolio: cv.portfolio ?? null,
      contacts: {
        email: cv.email ?? null,
        phone: cv.phone ?? null,
        address: cv.address ?? null,
      },
    };

    const overallFeedback = this.buildOverallFeedback(score, strengths, weaknesses);

    return {
      score,
      atsScore,
      completenessScore,
      experienceScore,
      skillsScore,
      educationScore,
      projectsScore,
      certificationsScore,
      languagesScore,
      presentationScore,
      strengths,
      weaknesses,
      recommendations,
      atsIssues,
      atsKeywords,
      atsRecommendations,
      overallFeedback,
      extractedData,
      rawResponse: {
        score,
        atsScore,
        completenessScore,
        experienceScore,
        skillsScore,
        educationScore,
        projectsScore,
        certificationsScore,
        languagesScore,
        presentationScore,
        strengths,
        weaknesses,
        recommendations,
        atsIssues,
        atsKeywords,
        atsRecommendations,
      },
    };
  }

  private calculateTotalExperienceYears(experiences: Array<{ startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean | null }>): number {
    return experiences.reduce((total, experience) => {
      let start = experience.startDate ? new Date(experience.startDate).getTime() : 0;
      const end = experience.isCurrent || !experience.endDate ? Date.now() : new Date(experience.endDate).getTime();
      if (!start || !end || !Number.isFinite(start) || !Number.isFinite(end)) return total;
      const deltaYears = Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 365.25));
      return total + deltaYears;
    }, 0);
  }

  private calculateAverageDescriptionLength(experiences: Array<{ description?: string | null }>): number {
    if (!experiences.length) return 0;
    const descriptions = experiences.map((experience) => (experience.description ?? '').trim()).filter(Boolean);
    if (!descriptions.length) return 0;
    const total = descriptions.reduce((sum, description) => sum + description.length, 0);
    return total / descriptions.length;
  }

  private calculateProgressionScore(experiences: Array<{ position?: string | null; company?: string | null; description?: string | null; startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean | null }>): number {
    if (!experiences.length) return 0;

    const hasRoleProgression = experiences.some((experience) => /manager|lead|senior|principal|head|director|architect/i.test(experience.position ?? ''));
    const hasCareerMovement = experiences.length > 1;
    const quality = experiences.filter((experience) => (experience.description ?? '').trim().length > 80).length;
    const contribution = (quality / experiences.length) * 100;

    return this.clamp((hasCareerMovement ? 35 : 0) + (hasRoleProgression ? 35 : 0) + contribution * 0.3);
  }

  private calculateDescriptionCoverage(experiences: Array<{ description?: string | null }>): number {
    if (!experiences.length) return 0;
    const covered = experiences.filter((experience) => (experience.description ?? '').trim().length > 40).length;
    return (covered / experiences.length) * 100;
  }

  private calculateCompletenessScore(input: {
    title: string;
    summary: string;
    profession: string;
    skillCount: number;
    experienceCount: number;
    projectCount: number;
    certificationCount: number;
    languageCount: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedin: boolean;
    hasGithub: boolean;
    hasPortfolio: boolean;
  }): number {
    let score = 0;
    score += input.title ? 15 : 0;
    score += input.summary ? 18 : 0;
    score += input.profession ? 12 : 0;
    score += input.skillCount > 0 ? 12 : 0;
    score += input.experienceCount > 0 ? 12 : 0;
    score += input.projectCount > 0 ? 8 : 0;
    score += input.certificationCount > 0 ? 6 : 0;
    score += input.languageCount > 0 ? 7 : 0;
    score += input.hasEmail ? 4 : 0;
    score += input.hasPhone ? 3 : 0;
    score += input.hasLinkedin ? 2 : 0;
    score += input.hasGithub ? 2 : 0;
    score += input.hasPortfolio ? 1 : 0;
    score += Math.min(10, input.skillCount * 1.5);
    score += Math.min(10, input.projectCount * 3);
    score = this.clamp(score);
    return score;
  }

  private calculateExperienceScore(input: {
    totalExperienceYears: number;
    experienceCount: number;
    averageDescriptionLength: number;
    descriptionCoverage: number;
    progressionScore: number;
  }): number {
    const yearsComponent = this.clamp((input.totalExperienceYears / 6) * 40);
    const countComponent = this.clamp((input.experienceCount / 5) * 20);
    const descriptionComponent = this.clamp((input.averageDescriptionLength / 120) * 25);
    const coverageComponent = input.descriptionCoverage * 0.15;
    const progressionComponent = input.progressionScore * 0.2;

    return this.clamp(yearsComponent + countComponent + descriptionComponent + coverageComponent + progressionComponent);
  }

  private calculateSkillsScore(skillNames: string[]): number {
    if (!skillNames.length) return 0;
    const technicalSkillCount = skillNames.filter((skill) => !this.isGenericSkill(skill)).length;
    const saturation = Math.min(100, (technicalSkillCount / 12) * 100);
    const diversityBonus = Math.min(20, (new Set(skillNames).size / 20) * 20);
    return this.clamp(saturation + diversityBonus * 0.5);
  }

  private calculateEducationScore(educations: Array<{ level?: string | null }>, context: string): number {
    if (!educations.length) {
      return 30;
    }

    const levels = educations.map((education) => education.level ?? '').filter(Boolean);
    const highestRank = levels.reduce((max, level) => Math.max(max, this.rankEducation(level)), 0);

    const contextHasStrongDegree = /(master|licence|bachelor|engineer|architect|data|scientist|manager)/i.test(context);
    const base = highestRank === 0 ? 60 : highestRank * 16;
    return this.clamp(base + (contextHasStrongDegree ? 10 : 0));
  }

  private calculateProjectsScore(projects: Array<{ name?: string | null; description?: string | null; githubUrl?: string | null; url?: string | null; technologies?: string | null }>): number {
    if (!projects.length) return 15;

    const validProjects = projects.filter((project) => (project.description ?? '').trim().length > 40 || (project.technologies ?? '').trim().length > 0 || !!project.githubUrl || !!project.url);
    const coverage = (validProjects.length / projects.length) * 100;
    const technologyBonus = projects.some((project) => (project.technologies ?? '').trim().length > 0) ? 15 : 0;
    return this.clamp(coverage * 0.7 + technologyBonus);
  }

  private calculateCertificationsScore(certifications: Array<{ name?: string | null }>): number {
    if (!certifications.length) return 20;
    return this.clamp((certifications.length / 4) * 100);
  }

  private calculateLanguagesScore(languages: Array<{ name?: string | null; level?: string | null }>): number {
    if (!languages.length) return 20;
    const levelCoverage = languages.filter((language) => !!language.level).length / languages.length;
    return this.clamp((languages.length / 4) * 45 + levelCoverage * 55);
  }

  private calculatePresentationScore(input: {
    title: string;
    profession: string;
    summary: string;
    hasLinkedin: boolean;
    hasGithub: boolean;
    hasPortfolio: boolean;
  }): number {
    let score = 0;
    score += input.title ? 30 : 0;
    score += input.profession ? 25 : 0;
    score += input.summary ? 25 : 0;
    score += input.hasLinkedin ? 7 : 0;
    score += input.hasGithub ? 7 : 0;
    score += input.hasPortfolio ? 6 : 0;
    return this.clamp(score);
  }

  private buildAtsIssues(input: {
    title: string;
    summary: string;
    profession: string;
    skillCount: number;
    experienceCount: number;
    educationCount: number;
    projectCount: number;
    languages: Array<{ name?: string | null; level?: string | null }>;
  }): string[] {
    const issues: string[] = [];
    if (!input.title) issues.push('Titre professionnel absent.');
    if (!input.summary) issues.push('Résumé professionnel absent.');
    if (!input.profession) issues.push('Profession non renseignée.');
    if (input.skillCount === 0) issues.push('Aucune compétence technique listée.');
    if (input.experienceCount === 0) issues.push('Aucune expérience professionnelle renseignée.');
    if (input.educationCount === 0) issues.push('Aucune formation mentionnée.');
    if (input.projectCount === 0) issues.push('Aucun projet concret mis en avant.');
    if (input.languages.some((language) => !language.level)) issues.push('Certains niveaux de langue ne sont pas renseignés.');
    return issues;
  }

  private buildAtsRecommendations(input: {
    title: string;
    summary: string;
    skillCount: number;
    experienceCount: number;
    projectCount: number;
    languages: Array<{ name?: string | null; level?: string | null }>;
    hasLinkedin: boolean;
    hasGithub: boolean;
  }): string[] {
    const recommendations: string[] = [];
    if (!input.title) recommendations.push('Ajouter un titre professionnel clair et ciblé.');
    if (!input.summary) recommendations.push('Rédiger un résumé de profil orienté métier.');
    if (input.skillCount === 0) recommendations.push('Ajouter des compétences techniques et transverses.');
    if (input.experienceCount === 0) recommendations.push('Ajouter les expériences clés avec résultats.');
    if (input.projectCount === 0) recommendations.push('Décrire au moins un projet concret avec technologies et contexte.');
    if (input.languages.some((language) => !language.level)) recommendations.push('Compléter les niveaux de langue pour un meilleur match ATS.');
    if (!input.hasLinkedin) recommendations.push('Ajouter un profil LinkedIn.');
    if (!input.hasGithub) recommendations.push('Ajouter un profil GitHub ou portfolio technique.');
    return recommendations;
  }

  private extractAtsKeywords(
    skillNames: string[],
    projectNames: string[],
    certificationNames: string[],
    languageNames: string[],
    title: string,
    profession: string,
    summary: string,
  ): string[] {
    const allTerms = [
      ...skillNames,
      ...projectNames,
      ...certificationNames,
      ...languageNames,
      title,
      profession,
      summary,
    ]
      .join(' ')
      .split(/[^a-zA-Z0-9+#./-]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !this.isGenericWord(token));

    return [...new Set(allTerms)].slice(0, 12);
  }

  private calculateAtsScore(input: {
    title: string;
    summary: string;
    profession: string;
    skillCount: number;
    experienceCount: number;
    educationCount: number;
    projectCount: number;
    languageCount: number;
    keywords: string[];
  }): number {
    let score = 0;
    score += input.title ? 18 : 0;
    score += input.summary ? 18 : 0;
    score += input.profession ? 14 : 0;
    score += input.skillCount > 0 ? 15 : 0;
    score += input.experienceCount > 0 ? 15 : 0;
    score += input.educationCount > 0 ? 10 : 0;
    score += input.projectCount > 0 ? 5 : 0;
    score += input.languageCount > 0 ? 5 : 0;
    score += Math.min(10, input.keywords.length * 1.2);
    return this.clamp(score);
  }

  private buildStrengths(input: {
    skillNames: string[];
    experienceCount: number;
    totalExperienceYears: number;
    projectCount: number;
    certificationCount: number;
    languageCount: number;
    educationCount: number;
    summary: string;
    title: string;
    profession: string;
  }): string[] {
    const strengths: string[] = [];

    if (input.skillNames.length >= 6) strengths.push('Large base de compétences techniques et métiers.');
    if (input.experienceCount >= 2 || input.totalExperienceYears >= 3) strengths.push('Expérience professionnelle cohérente avec la progression du profil.');
    if (input.projectCount > 0) strengths.push('Présence de projets concrets et démontrables.');
    if (input.certificationCount > 0) strengths.push('Certifications pertinentes pour le développement du profil.');
    if (input.languageCount > 0) strengths.push('Bonne ouverture linguistique avec des niveaux documentés.');
    if (input.educationCount > 0) strengths.push('Formation structurée et cohérente avec le parcours.');
    if (input.summary) strengths.push('Résumé professionnel clair et orienté métier.');
    if (input.title && input.profession) strengths.push('Titre et profession bien définis.');

    return strengths.slice(0, 6);
  }

  private buildWeaknesses(input: {
    title: string;
    summary: string;
    skillCount: number;
    averageDescriptionLength: number;
    experienceCount: number;
    projectCount: number;
    certificationCount: number;
    languageCount: number;
    hasGithub: boolean;
    hasLinkedin: boolean;
    hasPortfolio: boolean;
    hasEmail: boolean;
  }): string[] {
    const weaknesses: string[] = [];

    if (!input.title) weaknesses.push('Le titre professionnel est absent ou trop générique.');
    if (!input.summary) weaknesses.push('Le résumé est absent ou trop court pour présenter le profil.');
    if (input.skillCount < 5) weaknesses.push('Le CV contient peu de compétences techniques ou métiers.');
    if (input.experienceCount === 0) weaknesses.push('Aucune expérience n’est présentée.');
    if (input.averageDescriptionLength < 40) weaknesses.push('Les descriptions d’expérience sont trop courtes ou peu explicites.');
    if (input.projectCount === 0) weaknesses.push('Aucun projet n’est détaillé.');
    if (input.certificationCount === 0) weaknesses.push('Aucune certification n’est mentionnée.');
    if (input.languageCount === 0) weaknesses.push('Aucune langue n’est documentée.');
    if (!input.hasGithub) weaknesses.push('Le profil manque de lien GitHub ou de portfolio technique.');
    if (!input.hasLinkedin) weaknesses.push('Le profil ne mentionne pas de réseau professionnel public.');
    if (!input.hasPortfolio && !input.hasGithub) weaknesses.push('Le CV manque de preuve concrète de travaux réalisés.');
    if (!input.hasEmail) weaknesses.push('Aucun contact email n’est visible.');

    return weaknesses.slice(0, 6);
  }

  private buildRecommendations(input: {
    summary: string;
    skillNames: string[];
    experienceCount: number;
    projectCount: number;
    certificationCount: number;
    languageCount: number;
    hasGithub: boolean;
    hasLinkedin: boolean;
    hasPortfolio: boolean;
  }): string[] {
    const recommendations: string[] = [];

    if (!input.summary) recommendations.push('Ajouter un résumé professionnel synthétique et orienté résultats.');
    if (input.skillNames.length < 8) recommendations.push('Développer la liste de compétences en ajoutant les technologies clés du métier.');
    if (input.experienceCount === 0) recommendations.push('Ajouter des expériences avec des résultats chiffrés et des missions concrètes.');
    if (input.projectCount === 0) recommendations.push('Créer ou détailler un projet avec technologies, contexte et impact.');
    if (input.certificationCount === 0) recommendations.push('Ajouter des certifications ou formations reconnues dans le domaine.');
    if (input.languageCount === 0) recommendations.push('Indiquer les langues parlées avec un niveau clair.');
    if (!input.hasGithub) recommendations.push('Ajouter un lien GitHub ou portfolio pour valider vos compétences techniques.');
    if (!input.hasLinkedin) recommendations.push('Ajouter un profil LinkedIn pour renforcer la crédibilité du parcours.');
    if (!input.hasPortfolio && !input.hasGithub) recommendations.push('Publier des travaux ou démonstrations associées aux compétences mises en avant.');

    return recommendations.slice(0, 6);
  }

  private buildOverallFeedback(score: number, strengths: string[], weaknesses: string[]): string {
    if (score >= 85) {
      return `Profil très solide (${score}/100). Les points forts sont nombreux et le CV est bien positionné pour un poste technique ou managérial.`;
    }
    if (score >= 70) {
      return `Profil globalement solide (${score}/100). Le CV est convaincant, avec de bonnes bases à renforcer sur certains points.`;
    }
    if (score >= 50) {
      return `Profil moyen à correct (${score}/100). Il y a des éléments solides, mais plusieurs sections doivent être complétées pour gagner en crédibilité.`;
    }
    return `Profil incomplet ou peu exploité (${score}/100). Le CV nécessite des améliorations ciblées pour mieux refléter les compétences et l’expérience.`;
  }

  private clamp(value: number): number {
    return Math.min(100, Math.max(0, value));
  }

  private round(value: number): number {
    return Number(this.clamp(value).toFixed(2));
  }

  private isGenericSkill(skill: string): boolean {
    return /^(team|communication|leadership|problem solving|organisation|responsable|proactive|autonomie|travail en équipe)$/i.test(skill.trim());
  }

  private isGenericWord(value: string): boolean {
    const generic = new Set(['the', 'and', 'with', 'for', 'from', 'into', 'that', 'this', 'these', 'those', 'company', 'profile', 'developer', 'engineer', 'specialist', 'cv']);
    return generic.has(value.toLowerCase());
  }

  private rankEducation(level: string): number {
    const map: Record<string, number> = {
      BAC: 1,
      BAC_PLUS_1: 2,
      BAC_PLUS_2: 3,
      BAC_PLUS_3: 4,
      BAC_PLUS_4: 5,
      BAC_PLUS_5: 6,
      DOCTORATE: 7,
      OTHER: 0,
    };

    return map[level] ?? 0;
  }
}

type SkillLike = { name: string; required?: boolean };

@Injectable()
export class AiService {
  private readonly semanticMatcher: SemanticMatcher;

  constructor(private readonly prisma: PrismaService) {
    this.semanticMatcher = new LocalSemanticMatcher();
  }

  normalizeSkillName(value: string): string {
    if (!value) return '';

    let normalized = value
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[_.+/()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    normalized = normalized.replace(/(?:^|\s)node(?:\s*\.\s*js|\s*js)?(?:\s|$)/g, 'nodejs ');
    normalized = normalized.replace(/\s+/g, '');
    normalized = normalized.replace(/[^a-z0-9]/g, '');

    if (normalized === 'nodejs') return 'nodejs';
    if (normalized === 'javascript') return 'javascript';
    if (normalized === 'typescript') return 'typescript';
    if (normalized === 'csharp') return 'csharp';

    return normalized;
  }

  calculateSkillScore(
    cvSkills: string[],
    jobSkills: string[],
    optionalSkills: SkillLike[] = [],
  ): number {
    const cvSet = new Set(
      (cvSkills ?? []).map((skill) => this.normalizeSkillName(skill)).filter(Boolean),
    );

    const requiredSkills = (jobSkills ?? [])
      .map((skill) => this.normalizeSkillName(skill))
      .filter(Boolean);

    const optionalSkillNames = optionalSkills
      .map((skill) => ({
        name: this.normalizeSkillName(skill.name),
        required: skill.required ?? true,
      }))
      .filter((skill) => skill.name);

    const requiredSet = new Set(requiredSkills);
    const requiredMatches = [...requiredSet].filter((skill) => cvSet.has(skill)).length;

    if (requiredSet.size === 0 && optionalSkillNames.length === 0) {
      return 100;
    }

    const requiredScore = requiredSet.size === 0
      ? 100
      : Number(((requiredMatches / requiredSet.size) * 100).toFixed(2));

    if (optionalSkillNames.length === 0) {
      return requiredScore;
    }

    const optionalMatches = optionalSkillNames.filter((skill) => cvSet.has(skill.name)).length;
    const optionalBonus = Number(((optionalMatches / optionalSkillNames.length) * 10).toFixed(2));

    return Number(Math.min(100, requiredScore + optionalBonus).toFixed(2));
  }

  calculateOverallScore(
    skillsScore: number,
    experienceScore: number,
    educationScore: number,
    semanticScore: number,
  ): number {
    const total =
      skillsScore * 0.4 +
      experienceScore * 0.25 +
      educationScore * 0.15 +
      semanticScore * 0.2;

    return Number(Math.min(100, Math.max(0, total)).toFixed(2));
  }

  calculateExperienceScore(
    experiences: Experience[] = [],
    jobTitle: string,
    jobDescription: string,
    requirements?: string | null,
    responsibilities?: string | null,
  ): number {
    const targetText = [jobTitle, jobDescription, requirements, responsibilities]
      .filter(Boolean)
      .join(' ');

    if (!experiences.length) {
      return 0;
    }

    const years = experiences.reduce((total, experience) => {
      const start = new Date(experience.startDate).getTime();
      const endDate = experience.isCurrent || !experience.endDate
        ? new Date()
        : new Date(experience.endDate);
      const end = endDate.getTime();
      const deltaYears = Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 365.25));
      return total + deltaYears;
    }, 0);

    const baseYearsScore = Math.min(100, (years / 5) * 100);
    const relevanceScores = experiences.map((experience) => {
      const text = [experience.position, experience.company, experience.description]
        .filter(Boolean)
        .join(' ');
      return this.calculateTextSimilarity(text, targetText);
    });

    const averageRelevance = relevanceScores.length
      ? relevanceScores.reduce((sum, value) => sum + value, 0) / relevanceScores.length
      : 0;

    const score = (baseYearsScore * 0.6) + (averageRelevance * 0.4);

    return Number(Math.min(100, Math.max(0, score)).toFixed(2));
  }

  calculateEducationScore(
    educationEntries: Education[] = [],
    jobText: string,
  ): number {
    const requiredLevel = this.detectRequiredEducationLevel(jobText);

    if (!requiredLevel) {
      return 100;
    }

    const highestLevel = educationEntries.reduce((maxLevel, entry) => {
      if (!entry.level) return maxLevel;
      return Math.max(maxLevel, this.educationLevelValue(entry.level));
    }, 0);

    if (!highestLevel) {
      return 35;
    }

    if (highestLevel >= requiredLevel) return 100;
    if (highestLevel === requiredLevel - 1) return 75;
    if (highestLevel === requiredLevel - 2) return 55;
    return 30;
  }

  async calculateSemanticScore(cvText: string, jobText: string): Promise<number> {
    return this.semanticMatcher.calculateSimilarity(cvText, jobText);
  }

  private detectRequiredEducationLevel(jobText: string): number | null {
    const value = (jobText ?? '').toLowerCase();

    if (/bac\s*\+\s*5|master|mastère|msc|ingénieur|graduate degree|phd|doctorat/.test(value)) {
      return this.educationLevelValue('BAC_PLUS_5');
    }
    if (/bac\s*\+\s*4|licence|bachelor|degree/.test(value)) {
      return this.educationLevelValue('BAC_PLUS_4');
    }
    if (/bac\s*\+\s*3|bac\s*\+\s*2|dut|diplôme|bts|bac\+3/.test(value)) {
      return this.educationLevelValue('BAC_PLUS_3');
    }
    if (/bac\s*\+\s*2|bts|dut/.test(value)) {
      return this.educationLevelValue('BAC_PLUS_2');
    }
    if (/bac\s*\+\s*1|deug|technicien/.test(value)) {
      return this.educationLevelValue('BAC_PLUS_1');
    }
    if (/bac\b|baccalauréat|high school/.test(value)) {
      return this.educationLevelValue('BAC');
    }

    return null;
  }

  private educationLevelValue(level: string): number {
    const map: Record<string, number> = {
      BAC: 1,
      BAC_PLUS_1: 2,
      BAC_PLUS_2: 3,
      BAC_PLUS_3: 4,
      BAC_PLUS_4: 5,
      BAC_PLUS_5: 6,
      DOCTORATE: 7,
      OTHER: 0,
    };

    return map[level] ?? 0;
  }

  private calculateTextSimilarity(a: string, b: string): number {
    const left = this.tokenize(a);
    const right = this.tokenize(b);

    if (!left.length || !right.length) {
      return 0;
    }

    const leftSet = new Set(left);
    const rightSet = new Set(right);
    const intersection = [...leftSet].filter((token) => rightSet.has(token)).length;
    const union = new Set([...leftSet, ...rightSet]).size;

    if (union === 0) return 0;

    return Number(((intersection / union) * 100).toFixed(2));
  }

  private tokenize(value: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'for', 'with', 'from', 'into', 'of', 'in', 'on',
      'at', 'to', 'by', 'as', 'is', 'are', 'be', 'been', 'being', 'this', 'that', 'these',
      'those', 'role', 'work', 'experience', 'skills', 'project', 'projects', 'company',
      'candidate', 'using', 'used', 'team', 'profile', 'offer', 'offers',
    ]);

    return (value ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !stopWords.has(token));
  }

  private buildSkillSummary(skillNames: string[], limit = 4): string {
    return skillNames.slice(0, limit).join(', ');
  }

  private generateExplanation(
    score: number,
    matchedSkills: string[],
    missingSkills: string[],
    experienceScore: number,
    educationScore: number,
  ): string {
    const strengthLabel = score >= 80 ? 'fortement' : score >= 60 ? 'moyennement' : 'partiellement';
    const matchedText = matchedSkills.length
      ? `Les compétences ${this.buildSkillSummary(matchedSkills)} sont bien alignées.`
      : 'Le candidat n’a pas encore de compétences techniques clairement alignées avec cette mission.';

    const missingText = missingSkills.length
      ? `La principale lacune détectée est ${this.buildSkillSummary(missingSkills)}.`
      : 'Aucune compétence critique manquante n’a été détectée.';

    const experienceText = experienceScore >= 70
      ? 'L’expérience professionnelle est pertinente pour la fonction cible.'
      : 'L’expérience actuelle reste à renforcer pour mieux couvrir les besoins de l’offre.';

    const educationText = educationScore >= 80
      ? 'Le niveau de formation est compatible avec le poste.'
      : 'Le niveau de formation mérite d’être précisé ou complété pour mieux correspondre aux attentes.';

    return `Le profil correspond ${strengthLabel} à l’offre. ${matchedText} ${missingText} ${experienceText} ${educationText}`;
  }

  private generateRecommendations(
    missingSkills: string[],
    experienceScore: number,
    educationScore: number,
    semanticScore: number,
  ): string[] {
    const recommendations: string[] = [];

    if (missingSkills.length) {
      recommendations.push(`Ajouter ${this.buildSkillSummary(missingSkills, 3)} dans le CV pour mieux couvrir les exigences du poste.`);
    }

    if (experienceScore < 70) {
      recommendations.push('Mettre davantage en avant les expériences professionnelles les plus proches du poste ciblé.');
    }

    if (educationScore < 80) {
      recommendations.push('Préciser le niveau d’études ou les diplômes les plus pertinents pour l’offre.');
    }

    if (semanticScore < 70) {
      recommendations.push('Renforcer le summary, la profession et les projets pour mieux aligner le profil sur le poste.');
    }

    if (!recommendations.length) {
      recommendations.push('Conserver le profil actuel et continuer à valoriser ses compétences clés sur cette opportunité.');
    }

    return recommendations;
  }

  private buildJobText(job: {
    title: string;
    description: string | null;
    requirements?: string | null;
    responsibilities?: string | null;
  }): string {
    return [job.title, job.description, job.requirements, job.responsibilities]
      .filter(Boolean)
      .join(' ');
  }

  private async assertCvOwnership(userId: string, cvId: string): Promise<{
    id: string;
    userId: string;
    title: string | null;
    summary: string | null;
    profession: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    experiences: any[];
    educations: any[];
    skills: Array<{ skill: { name: string | null } }>; 
    projects: any[];
    certifications: any[];
    languages: any[];
  }> {
    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        skills: { include: { skill: true }, orderBy: { skill: { name: 'asc' } } },
        projects: { orderBy: { createdAt: 'desc' } },
        certifications: { orderBy: { createdAt: 'desc' } },
        languages: { orderBy: { name: 'asc' } },
      },
    });

    if (!cv) throw new NotFoundException('CV not found.');
    if (cv.userId !== userId) throw new ForbiddenException('You cannot access this CV.');

    return cv as any;
  }

  async analyzeCvForUser(userId: string, cvId: string) {
    const cv = await this.assertCvOwnership(userId, cvId);
    const startedAt = Date.now();
    const engine = new LocalCVAnalysisEngine();
    const analysis = engine.analyze({
      id: cv.id,
      userId: cv.userId,
      title: cv.title,
      summary: cv.summary,
      profession: cv.profession,
      email: cv.email,
      phone: cv.phone,
      address: cv.address,
      linkedin: cv.linkedin,
      github: cv.github,
      portfolio: cv.portfolio,
      experiences: cv.experiences ?? [],
      educations: cv.educations ?? [],
      skills: cv.skills ?? [],
      projects: cv.projects ?? [],
      certifications: cv.certifications ?? [],
      languages: cv.languages ?? [],
    });

    const persisted = await this.prisma.aIAnalysis.create({
      data: {
        userId,
        cvId,
        type: AnalysisType.CV_ANALYSIS,
        status: AnalysisStatus.COMPLETED,
        score: analysis.score,
        overallFeedback: analysis.overallFeedback,
        strengths: analysis.strengths as Prisma.InputJsonValue,
        weaknesses: analysis.weaknesses as Prisma.InputJsonValue,
        recommendations: analysis.recommendations as Prisma.InputJsonValue,
        extractedData: analysis.extractedData as Prisma.InputJsonValue,
        rawResponse: analysis.rawResponse as Prisma.InputJsonValue,
        model: 'local-deterministic-cv-analysis-v1',
        processingTime: Date.now() - startedAt,
      },
    });

    return {
      id: persisted.id,
      userId: persisted.userId,
      cvId: persisted.cvId,
      type: persisted.type,
      status: persisted.status,
      score: persisted.score ?? analysis.score,
      atsScore: analysis.atsScore,
      completenessScore: analysis.completenessScore,
      experienceScore: analysis.experienceScore,
      skillsScore: analysis.skillsScore,
      educationScore: analysis.educationScore,
      projectsScore: analysis.projectsScore,
      certificationsScore: analysis.certificationsScore,
      languagesScore: analysis.languagesScore,
      presentationScore: analysis.presentationScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
      atsIssues: analysis.atsIssues,
      atsKeywords: analysis.atsKeywords,
      atsRecommendations: analysis.atsRecommendations,
      overallFeedback: analysis.overallFeedback,
      extractedData: analysis.extractedData,
      model: persisted.model,
      processingTime: persisted.processingTime,
      createdAt: persisted.createdAt,
      updatedAt: persisted.updatedAt,
    };
  }

  async getLatestCvAnalysisForUser(userId: string, cvId: string) {
    await this.assertCvOwnership(userId, cvId);

    const result = await this.prisma.aIAnalysis.findFirst({
      where: {
        userId,
        cvId,
        type: AnalysisType.CV_ANALYSIS,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!result) {
      throw new NotFoundException('No CV analysis found.');
    }

    return result;
  }

  async getCvAnalysisHistoryForUser(userId: string, cvId: string) {
    await this.assertCvOwnership(userId, cvId);

    const result = await this.prisma.aIAnalysis.findMany({
      where: {
        userId,
        cvId,
        type: AnalysisType.CV_ANALYSIS,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: result, meta: { total: result.length } };
  }

  async getCvAnalysisByIdForUser(userId: string, analysisId: string) {
    const analysis = await this.prisma.aIAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis) {
      throw new NotFoundException('CV analysis not found.');
    }

    if (analysis.userId !== userId) {
      throw new ForbiddenException('You cannot access this CV analysis.');
    }

    return analysis;
  }

  async matchCvToJobOffer(
    userId: string,
    cvId: string,
    jobOfferId: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        skills: { include: { skill: true }, orderBy: { skill: { name: 'asc' } } },
        projects: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!cv) {
      throw new NotFoundException('CV not found.');
    }

    if (cv.userId !== userId) {
      throw new ForbiddenException('You cannot access this CV.');
    }

    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found.');
    }

    if (!jobOffer.isActive) {
      throw new NotFoundException('Job offer is not available.');
    }

    const requiredSkills = jobOffer.skills
      .filter((skill) => skill.required !== false)
      .map((skill) => skill.skill.name);
    const optionalSkills = jobOffer.skills
      .filter((skill) => skill.required === false)
      .map((skill) => ({ name: skill.skill.name, required: false }));

    const cvSkillNames = cv.skills.map((item) => item.skill.name);
    const matchedSkills = [...new Set(
      cvSkillNames.filter((cvSkill) =>
        requiredSkills.some((jobSkill) =>
          this.normalizeSkillName(cvSkill) === this.normalizeSkillName(jobSkill),
        ),
      ),
    )];

    const missingSkills = [...new Set(
      requiredSkills.filter((jobSkill) =>
        !cvSkillNames.some((cvSkill) =>
          this.normalizeSkillName(cvSkill) === this.normalizeSkillName(jobSkill),
        ),
      ),
    )];

    const skillsScore = this.calculateSkillScore(cvSkillNames, requiredSkills, optionalSkills);
    const experienceScore = this.calculateExperienceScore(
      cv.experiences,
      jobOffer.title,
      jobOffer.description,
      jobOffer.requirements,
      jobOffer.responsibilities,
    );
    const educationScore = this.calculateEducationScore(
      cv.educations,
      this.buildJobText(jobOffer),
    );

    const cvText = [
      cv.title,
      cv.summary,
      cv.profession,
      cv.experiences.map((experience) => [experience.position, experience.description].join(' ')).join(' '),
      cv.projects.map((project) => [project.name, project.description, project.technologies].join(' ')).join(' '),
      cv.skills.map((item) => item.skill.name).join(' '),
    ].filter(Boolean).join(' ');

    const semanticScore = await this.calculateSemanticScore(
      cvText,
      this.buildJobText(jobOffer),
    );

    const score = this.calculateOverallScore(
      skillsScore,
      experienceScore,
      educationScore,
      semanticScore,
    );

    const explanation = this.generateExplanation(
      score,
      matchedSkills,
      missingSkills,
      experienceScore,
      educationScore,
    );
    const recommendations = this.generateRecommendations(
      missingSkills,
      experienceScore,
      educationScore,
      semanticScore,
    );

    const payload = {
      cvId,
      jobOfferId,
      score,
      skillsScore,
      experienceScore,
      educationScore,
      semanticScore,
      matchedSkills: JSON.parse(JSON.stringify(matchedSkills)),
      missingSkills: JSON.parse(JSON.stringify(missingSkills)),
      explanation,
    } satisfies Prisma.JobMatchingUncheckedCreateInput;

    const stored = await this.prisma.jobMatching.upsert({
      where: { cvId_jobOfferId: { cvId, jobOfferId } },
      update: payload,
      create: payload,
    });

    return {
      id: stored.id,
      cvId: stored.cvId,
      jobOfferId: stored.jobOfferId,
      score: stored.score,
      skillsScore: stored.skillsScore ?? skillsScore,
      experienceScore: stored.experienceScore ?? experienceScore,
      educationScore: stored.educationScore ?? educationScore,
      semanticScore: stored.semanticScore ?? semanticScore,
      matchedSkills: Array.isArray(stored.matchedSkills) ? stored.matchedSkills : matchedSkills,
      missingSkills: Array.isArray(stored.missingSkills) ? stored.missingSkills : missingSkills,
      explanation: stored.explanation ?? explanation,
      recommendations,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    };
  }

  async getMatchingForUser(userId: string, cvId: string, jobOfferId: string) {
    const cv = await this.prisma.cV.findUnique({ where: { id: cvId } });
    if (!cv) throw new NotFoundException('CV not found.');
    if (cv.userId !== userId) throw new ForbiddenException('You cannot access this CV.');

    const offer = await this.prisma.jobOffer.findUnique({ where: { id: jobOfferId } });
    if (!offer) throw new NotFoundException('Job offer not found.');

    const record = await this.prisma.jobMatching.findUnique({
      where: { cvId_jobOfferId: { cvId, jobOfferId } },
    });

    if (!record) {
      throw new NotFoundException('Job matching not found.');
    }

    const matchedSkills = Array.isArray(record.matchedSkills) ? record.matchedSkills : [];
    const missingSkills = Array.isArray(record.missingSkills) ? record.missingSkills : [];

    return {
      ...record,
      matchedSkills,
      missingSkills,
      recommendations: this.generateRecommendations(
        missingSkills as string[],
        Number(record.experienceScore ?? 0),
        Number(record.educationScore ?? 0),
        Number(record.semanticScore ?? 0),
      ),
    };
  }

  async listMatchingsForUser(userId: string, query: { cvId?: string; minScore?: number; maxScore?: number; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);

    const cvIds = await this.prisma.cV.findMany({
      where: { userId },
      select: { id: true },
    });

    const allowedCvIds = cvIds.map((cv) => cv.id);

    if (query.cvId && !allowedCvIds.includes(query.cvId)) {
      throw new ForbiddenException('You cannot access this CV.');
    }

    const where: Prisma.JobMatchingWhereInput = {
      cvId: query.cvId ? query.cvId : { in: allowedCvIds },
      score: {
        gte: query.minScore ?? 0,
        ...(query.maxScore !== undefined ? { lte: query.maxScore } : {}),
      },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.jobMatching.findMany({
        where,
        orderBy: { score: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          cv: { select: { id: true, title: true, profession: true } },
          jobOffer: {
            include: { company: true },
          },
        },
      }),
      this.prisma.jobMatching.count({ where }),
    ]);

    return {
      data: data.map((item) => ({
        ...item,
        matchedSkills: Array.isArray(item.matchedSkills) ? item.matchedSkills : [],
        missingSkills: Array.isArray(item.missingSkills) ? item.missingSkills : [],
        recommendations: this.generateRecommendations(
          Array.isArray(item.missingSkills) ? (item.missingSkills as string[]) : [],
          Number(item.experienceScore ?? 0),
          Number(item.educationScore ?? 0),
          Number(item.semanticScore ?? 0),
        ),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopJobsForCv(userId: string, cvId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const cv = await this.prisma.cV.findUnique({
      where: { id: cvId },
      include: {
        experiences: true,
        educations: true,
        skills: { include: { skill: true } },
      },
    });

    if (!cv) throw new NotFoundException('CV not found.');
    if (cv.userId !== userId) throw new ForbiddenException('You cannot access this CV.');

    const offers = await this.prisma.jobOffer.findMany({
      where: { isActive: true },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });

    const ranked = await Promise.all(
      offers.map(async (offer) => {
        const result = await this.matchCvToJobOffer(userId, cvId, offer.id);
        return {
          jobOffer: {
            ...offer,
            company: offer.company,
          },
          score: result.score,
          matchedSkills: result.matchedSkills,
          missingSkills: result.missingSkills,
          explanation: result.explanation,
        };
      }),
    );

    ranked.sort((a, b) => b.score - a.score);

    return { data: ranked, meta: { total: ranked.length } };
  }
}
