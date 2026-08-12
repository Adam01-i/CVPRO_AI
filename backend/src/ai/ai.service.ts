import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Education, Experience, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface SemanticMatcher {
  calculateSimilarity(cvText: string, jobText: string): Promise<number>;
}

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
      'projects', 'skills', 'profile', 'candidate', 'company', 'offers', 'offer'
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
      'candidate', 'using', 'used', 'team', 'profile', 'offer', 'offers'
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
