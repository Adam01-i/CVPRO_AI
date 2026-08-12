import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CvsService } from './cvs.service';

describe('CvsService', () => {
  let service: CvsService;
  const cv = { id: 'cv-1', userId: 'user-1', title: 'My CV', isActive: true };
  const prisma = {
    cV: { findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn() },
    experience: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    education: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    skill: { findUnique: jest.fn(), upsert: jest.fn() },
    cVSkill: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    project: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    certification: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    language: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CvsService>(CvsService);
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) => callback(prisma));
  });

  it('creates a CV for the authenticated user and deactivates prior CVs atomically', async () => {
    prisma.cV.create.mockResolvedValue(cv);
    await service.create('user-1', { title: 'My CV' });
    expect(prisma.cV.updateMany).toHaveBeenCalledWith({ where: { userId: 'user-1', isActive: true }, data: { isActive: false } });
    expect(prisma.cV.create).toHaveBeenCalledWith({ data: { title: 'My CV', userId: 'user-1', isActive: true } });
  });

  it('returns only a user’s CV summaries', async () => {
    prisma.cV.findMany.mockResolvedValue([cv]);
    await expect(service.findAll('user-1')).resolves.toEqual({ data: [cv], count: 1 });
  });

  it('rejects access to another user’s CV', async () => {
    prisma.cV.findUnique.mockResolvedValue({ ...cv, userId: 'user-2' });
    await expect(service.findOne('user-1', 'cv-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates an experience after ownership verification', async () => {
    prisma.cV.findUnique.mockResolvedValue(cv);
    prisma.experience.create.mockResolvedValue({ id: 'experience-1' });
    await service.createExperience('user-1', 'cv-1', { company: 'Acme', position: 'Developer', startDate: new Date('2025-01-01') });
    expect(prisma.experience.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ cvId: 'cv-1' }) }));
  });

  it('creates a missing skill and attaches it to the CV', async () => {
    prisma.cV.findUnique.mockResolvedValue(cv);
    prisma.skill.upsert.mockResolvedValue({ id: 'skill-1', name: 'NestJS' });
    prisma.skill.findUnique.mockResolvedValue({ id: 'skill-1' });
    prisma.cVSkill.findUnique.mockResolvedValue(null);
    await service.createSkill('user-1', 'cv-1', { name: 'NestJS' });
    expect(prisma.cVSkill.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ cvId: 'cv-1', skillId: 'skill-1' }) }));
  });

  it('activates a CV in a transaction', async () => {
    prisma.cV.findUnique.mockResolvedValue(cv);
    prisma.cV.update.mockResolvedValue(cv);
    await service.activate('user-1', 'cv-1');
    expect(prisma.cV.updateMany).toHaveBeenCalled();
    expect(prisma.cV.update).toHaveBeenCalledWith({ where: { id: 'cv-1' }, data: { isActive: true } });
  });
});
