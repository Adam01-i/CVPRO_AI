import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AnalysisStatus, AnalysisType } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AiService, LocalCVAnalysisEngine } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  let prisma: {
    user: { findUnique: jest.Mock };
    cV: { findUnique: jest.Mock };
    aIAnalysis: { create: jest.Mock; findFirst: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock };
    jobOffer: { findUnique: jest.Mock; findMany: jest.Mock; count: jest.Mock };
    jobMatching: { findUnique: jest.Mock; upsert: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      cV: { findUnique: jest.fn() },
      aIAnalysis: { create: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
      jobOffer: { findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn() },
      jobMatching: { findUnique: jest.fn(), upsert: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('normalizes equivalent skill names consistently', () => {
    expect(service.normalizeSkillName('JavaScript')).toBe('javascript');
    expect(service.normalizeSkillName('javascript')).toBe('javascript');
    expect(service.normalizeSkillName('Node.js')).toBe('nodejs');
    expect(service.normalizeSkillName('NodeJS')).toBe('nodejs');
    expect(service.normalizeSkillName('node js')).toBe('nodejs');
  });

  it('calculates a full skills match when all required skills are present', () => {
    const result = service.calculateSkillScore(
      ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      [],
    );

    expect(result).toBe(100);
  });

  it('calculates partial skills match and optional skill bonus', () => {
    const result = service.calculateSkillScore(
      ['Java', 'PostgreSQL'],
      ['Java', 'Spring Boot', 'PostgreSQL'],
      [{ name: 'Docker', required: false }],
    );

    expect(result).toBeGreaterThan(60);
    expect(result).toBeLessThan(100);
  });

  it('reports zero when there are no matching skills', () => {
    expect(service.calculateSkillScore(['Python'], ['Java', 'Spring'], [])).toBe(0);
  });

  it('calculates the weighted score exactly with the expected formula', () => {
    expect(service.calculateOverallScore(100, 80, 75, 82)).toBe(87.65);
  });

  it('builds a deterministic score for an empty CV within range', () => {
    const engine = new LocalCVAnalysisEngine();
    const result = engine.analyze({
      id: 'cv-1',
      userId: 'user-1',
      title: '',
      summary: '',
      profession: '',
      experiences: [],
      educations: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: '',
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBe(engine.analyze({
      id: 'cv-1',
      userId: 'user-1',
      title: '',
      summary: '',
      profession: '',
      experiences: [],
      educations: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: '',
    }).score);
  });

  it('throws when the CV does not exist for a user analysis request', async () => {
    prisma.cV.findUnique.mockResolvedValue(null);

    await expect(service.analyzeCvForUser('user-1', 'missing-cv')).rejects.toThrow(NotFoundException);
  });

  it('throws when a user tries to analyze another user CV', async () => {
    prisma.cV.findUnique.mockResolvedValue({ id: 'cv-1', userId: 'other-user', title: 'Dev' });

    await expect(service.analyzeCvForUser('user-1', 'cv-1')).rejects.toThrow(ForbiddenException);
  });

  it('persists a completed CV analysis record', async () => {
    const cv = {
      id: 'cv-1',
      userId: 'user-1',
      title: 'Senior Backend Developer',
      summary: 'Java and Node backend engineer with strong product delivery experience.',
      profession: 'Backend Developer',
      email: 'dev@example.com',
      phone: null,
      address: null,
      linkedin: 'https://linkedin.com/in/dev',
      github: 'https://github.com/dev',
      portfolio: null,
      experiences: [
        {
          id: 'exp-1',
          position: 'Backend Engineer',
          company: 'Acme',
          description: 'Built APIs and improved deployment reliability in production.',
          startDate: new Date('2021-01-01'),
          endDate: new Date('2024-01-01'),
          isCurrent: false,
        },
      ],
      educations: [
        {
          id: 'edu-1',
          degree: 'Master of Science',
          field: 'Computer Science',
          level: 'BAC_PLUS_5',
          startDate: new Date('2017-01-01'),
          endDate: new Date('2019-01-01'),
          isCurrent: false,
        },
      ],
      skills: [{ skill: { name: 'Java' } }, { skill: { name: 'Node.js' } }, { skill: { name: 'PostgreSQL' } }],
      projects: [{ name: 'API Platform', description: 'Built internal services.', githubUrl: 'https://github.com/dev/api', technologies: 'Java, Spring Boot', url: 'https://demo.example.com' }],
      certifications: [{ name: 'AWS', organization: 'AWS', issueDate: new Date('2023-01-01') }],
      languages: [{ name: 'English', level: 'C1' }, { name: 'French', level: 'Native' }],
    };

    prisma.cV.findUnique.mockResolvedValue(cv);
    prisma.aIAnalysis.create.mockResolvedValue({
      id: 'analysis-1',
      userId: 'user-1',
      cvId: 'cv-1',
      type: AnalysisType.CV_ANALYSIS,
      status: AnalysisStatus.COMPLETED,
      score: 80,
      overallFeedback: 'Strong profile',
      strengths: ['Strong technical skills'],
      weaknesses: [],
      recommendations: ['Add more measurable results'],
      extractedData: { score: 80 },
      rawResponse: { score: 80 },
      model: 'local-deterministic-cv-analysis-v1',
      processingTime: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.analyzeCvForUser('user-1', 'cv-1');

    expect(result).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
    expect(result.atsScore).toBeGreaterThan(0);
    expect(prisma.aIAnalysis.create).toHaveBeenCalled();
  });

  it('generates a structured CV improvement recommendation for a valid owned CV', async () => {
    const cv = {
      id: 'cv-2',
      userId: 'user-1',
      title: 'Developer',
      summary: 'I build software for clients.',
      profession: 'Software Developer',
      email: 'dev@example.com',
      phone: null,
      address: null,
      linkedin: 'https://linkedin.com/in/dev',
      github: 'https://github.com/dev',
      portfolio: null,
      experiences: [{
        id: 'exp-2',
        position: 'Backend Developer',
        company: 'Acme',
        description: 'Wrote code for apps.',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2024-01-01'),
        isCurrent: false,
      }],
      educations: [{
        id: 'edu-2',
        degree: 'Bachelor',
        field: 'Computer Science',
        level: 'BAC_PLUS_3',
        startDate: new Date('2018-01-01'),
        endDate: new Date('2022-01-01'),
        isCurrent: false,
      }],
      skills: [{ skill: { name: 'Java' } }, { skill: { name: 'Spring Boot' } }],
      projects: [{ name: 'Payment API', description: 'Built a payment gateway.', technologies: 'Java, Spring Boot', githubUrl: 'https://github.com/dev/payments' }],
      certifications: [],
      languages: [{ name: 'English', level: 'B2' }],
    };

    prisma.cV.findUnique.mockResolvedValue(cv);
    prisma.aIAnalysis.create.mockResolvedValue({
      id: 'analysis-improve-1',
      userId: 'user-1',
      cvId: 'cv-2',
      type: AnalysisType.CV_IMPROVEMENT,
      status: AnalysisStatus.COMPLETED,
      score: 74,
      overallFeedback: 'Good base',
      strengths: ['Profile with technical grounding'],
      weaknesses: ['Summary too generic'],
      recommendations: ['Add clear impact statements'],
      extractedData: { scoreBefore: 68, scoreAfter: 84 },
      rawResponse: { scoreBefore: 68, scoreAfter: 84 },
      model: 'local-deterministic-cv-improvement-v1',
      processingTime: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.improveCvForUser('user-1', 'cv-2');

    expect(result).toBeDefined();
    expect(result.scoreBefore).toBeGreaterThan(0);
    expect(result.scoreAfter).toBeGreaterThan(result.scoreBefore);
    expect(result.improvements.title).toBeDefined();
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(prisma.aIAnalysis.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ type: AnalysisType.CV_IMPROVEMENT }),
    }));
  });

  it('rejects improving a CV that belongs to another user', async () => {
    prisma.cV.findUnique.mockResolvedValue({ id: 'cv-3', userId: 'other-user' });

    await expect(service.improveCvForUser('user-1', 'cv-3')).rejects.toThrow(ForbiddenException);
  });
});
