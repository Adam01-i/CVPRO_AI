import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let service: JobsService;
  const prisma = { company: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), update: jest.fn() }, jobOffer: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), count: jest.fn(), update: jest.fn(), delete: jest.fn() }, jobOfferSkill: { deleteMany: jest.fn() }, skill: { count: jest.fn() }, jobApplication: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn() }, cV: { findUnique: jest.fn() }, $transaction: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('creates a company and rejects duplicate names', async () => {
    prisma.company.findUnique.mockResolvedValue(null); prisma.company.create.mockResolvedValue({ id: 'company-1', name: 'Acme' });
    await expect(service.createCompany({ name: 'Acme' })).resolves.toMatchObject({ name: 'Acme' });
    prisma.company.findUnique.mockResolvedValue({ id: 'company-1' });
    await expect(service.createCompany({ name: 'Acme' })).rejects.toBeInstanceOf(ConflictException);
  });
  it('paginates job offers', async () => {
    prisma.jobOffer.findMany.mockResolvedValue([]); prisma.jobOffer.count.mockResolvedValue(42); prisma.$transaction.mockResolvedValue([[], 42]);
    await expect(service.findOffers({ page: 2, limit: 20 })).resolves.toEqual({ data: [], meta: { page: 2, limit: 20, total: 42, totalPages: 3 } });
  });
  it('rejects an invalid salary range before creating an offer', async () => {
    await expect(service.createOffer({ title: 'Developer', description: 'Build APIs', salaryMin: 100, salaryMax: 99 })).rejects.toBeInstanceOf(BadRequestException);
  });
});
