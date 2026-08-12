import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            cV: { findUnique: jest.fn() },
            jobOffer: { findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            jobMatching: { findUnique: jest.fn(), upsert: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
          },
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
});
