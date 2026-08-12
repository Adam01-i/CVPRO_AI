import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, Prisma, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { QueryJobOffersDto } from './dto/query-job-offers.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('A company with this name already exists.');
    return this.prisma.company.create({ data: dto });
  }
  findCompanies() { return this.prisma.company.findMany({ orderBy: { name: 'asc' } }); }
  async findCompany(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id }, include: { _count: { select: { jobOffers: true } }, jobOffers: { where: { isActive: true }, take: 10, orderBy: { publishedAt: 'desc' } } } });
    if (!company) throw new NotFoundException('Company not found.'); return company;
  }
  async updateCompany(id: string, dto: UpdateCompanyDto) { await this.findCompany(id); return this.prisma.company.update({ where: { id }, data: dto }); }
  async removeCompany(id: string): Promise<void> { await this.findCompany(id); await this.prisma.company.delete({ where: { id } }); }

  async createOffer(dto: CreateJobOfferDto) {
    this.assertOfferRange(dto.salaryMin, dto.salaryMax, dto.publishedAt, dto.deadline);
    if (dto.companyId && !(await this.prisma.company.findUnique({ where: { id: dto.companyId } }))) throw new NotFoundException('Company not found.');
    await this.assertSkills(dto.skills?.map((item) => item.skillId));
    const { skills, ...data } = dto;
    return this.prisma.$transaction((tx) => tx.jobOffer.create({ data: { ...data, skills: skills?.length ? { create: skills.map((item) => ({ skillId: item.skillId, required: item.required ?? true })) } : undefined }, include: { company: true, skills: { include: { skill: true } } } }));
  }
  async findOffers(query: QueryJobOffersDto) {
    const page = query.page ?? 1, limit = query.limit ?? 20;
    const where: Prisma.JobOfferWhereInput = { isActive: query.isActive ?? true, companyId: query.companyId, contractType: query.contractType, remote: query.remote, location: query.location ? { contains: query.location, mode: 'insensitive' } : undefined, salaryMax: query.minSalary !== undefined ? { gte: query.minSalary } : undefined, salaryMin: query.maxSalary !== undefined ? { lte: query.maxSalary } : undefined };
    if (query.search) where.OR = ['title', 'description', 'requirements', 'responsibilities'].map((field) => ({ [field]: { contains: query.search, mode: 'insensitive' } }));
    const [data, total] = await this.prisma.$transaction([this.prisma.jobOffer.findMany({ where, include: { company: true, skills: { include: { skill: true } }, _count: { select: { applications: true } } }, skip: (page - 1) * limit, take: limit, orderBy: { publishedAt: 'desc' } }), this.prisma.jobOffer.count({ where })]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  async findOffer(id: string, userId?: string, role?: UserRole) {
    const offer = await this.prisma.jobOffer.findUnique({ where: { id }, include: { company: true, skills: { include: { skill: true } }, _count: { select: { applications: true } } } });
    if (!offer || (!offer.isActive && role !== UserRole.ADMIN)) throw new NotFoundException('Job offer not found.');
    const hasApplied = userId ? Boolean(await this.prisma.jobApplication.findUnique({ where: { userId_jobOfferId: { userId, jobOfferId: id } } })) : false;
    return { ...offer, applicationCount: offer._count.applications, hasApplied };
  }
  async updateOffer(id: string, dto: UpdateJobOfferDto) {
    const offer = await this.findOffer(id, undefined, UserRole.ADMIN); this.assertOfferRange(dto.salaryMin ?? offer.salaryMin ?? undefined, dto.salaryMax ?? offer.salaryMax ?? undefined, dto.publishedAt ?? offer.publishedAt ?? undefined, dto.deadline ?? offer.deadline ?? undefined);
    if (dto.companyId && !(await this.prisma.company.findUnique({ where: { id: dto.companyId } }))) throw new NotFoundException('Company not found.'); await this.assertSkills(dto.skills?.map((item) => item.skillId));
    const { skills, ...data } = dto;
    return this.prisma.$transaction(async (tx) => { if (skills) await tx.jobOfferSkill.deleteMany({ where: { jobOfferId: id } }); return tx.jobOffer.update({ where: { id }, data: { ...data, skills: skills ? { create: skills.map((item) => ({ skillId: item.skillId, required: item.required ?? true })) } : undefined }, include: { company: true, skills: { include: { skill: true } } } }); });
  }
  async removeOffer(id: string): Promise<void> { await this.findOffer(id, undefined, UserRole.ADMIN); await this.prisma.jobOffer.delete({ where: { id } }); }
  async setOfferStatus(id: string, isActive: boolean) { await this.findOffer(id, undefined, UserRole.ADMIN); return this.prisma.jobOffer.update({ where: { id }, data: { isActive } }); }

  async apply(userId: string, offerId: string, dto: CreateJobApplicationDto) {
    const offer = await this.findOffer(offerId, undefined, UserRole.ADMIN);
    if (!offer.isActive) throw new BadRequestException('Job offer is inactive.');
    if (offer.deadline && offer.deadline < new Date()) throw new BadRequestException('Job offer deadline has passed.');
    if (dto.cvId) { const cv = await this.prisma.cV.findUnique({ where: { id: dto.cvId } }); if (!cv) throw new NotFoundException('CV not found.'); if (cv.userId !== userId) throw new ForbiddenException('You cannot use this CV.'); }
    if (await this.prisma.jobApplication.findUnique({ where: { userId_jobOfferId: { userId, jobOfferId: offerId } } })) throw new ConflictException('You have already applied to this offer.');
    return this.prisma.jobApplication.create({ data: { userId, jobOfferId: offerId, cvId: dto.cvId, coverLetter: dto.coverLetter, status: ApplicationStatus.APPLIED, appliedAt: new Date() }, include: { jobOffer: { include: { company: true } }, cv: true } });
  }
  myApplications(userId: string) { return this.prisma.jobApplication.findMany({ where: { userId }, include: { jobOffer: { include: { company: true } }, cv: true }, orderBy: { createdAt: 'desc' } }); }
  async findApplication(id: string, userId: string, role: UserRole) { const application = await this.prisma.jobApplication.findUnique({ where: { id }, include: { jobOffer: { include: { company: true } }, cv: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } } }); if (!application) throw new NotFoundException('Application not found.'); if (role !== UserRole.ADMIN && application.userId !== userId) throw new ForbiddenException('You cannot access this application.'); return application; }
  async updateApplicationStatus(id: string, status: ApplicationStatus) { const application = await this.prisma.jobApplication.findUnique({ where: { id } }); if (!application) throw new NotFoundException('Application not found.'); return this.prisma.jobApplication.update({ where: { id }, data: { status } }); }
  async withdraw(id: string, userId: string) { const application = await this.findApplication(id, userId, UserRole.USER); return this.prisma.jobApplication.update({ where: { id }, data: { status: ApplicationStatus.WITHDRAWN } }); }
  async offerApplications(offerId: string) { await this.findOffer(offerId, undefined, UserRole.ADMIN); return this.prisma.jobApplication.findMany({ where: { jobOfferId: offerId }, include: { cv: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }); }
  private async assertSkills(ids?: string[]) { if (!ids) return; if (new Set(ids).size !== ids.length) throw new BadRequestException('Duplicate skills are not allowed.'); const count = await this.prisma.skill.count({ where: { id: { in: ids } } }); if (count !== ids.length) throw new NotFoundException('One or more skills were not found.'); }
  private assertOfferRange(min?: number, max?: number, publishedAt?: Date, deadline?: Date) { if (min !== undefined && max !== undefined && max < min) throw new BadRequestException('Maximum salary must be greater than minimum salary.'); if (publishedAt && deadline && deadline < publishedAt) throw new BadRequestException('Deadline must be after publication date.'); }
}
