import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Certification,
  CVLink,
  CVPhone,
  Education,
  Experience,
  Language,
  Prisma,
  Project,
  SkillLevel,
  CVSkill,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { CreateCvDto } from './dto/create-cv.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateLanguageDto } from './dto/create-language.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateCvPhoneDto } from './dto/create-cv-phone.dto';
import { UpdateCvPhoneDto } from './dto/update-cv-phone.dto';
import { CreateCvLinkDto } from './dto/create-cv-link.dto';
import { UpdateCvLinkDto } from './dto/update-cv-link.dto';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const cvDetails = {
  experiences: { orderBy: { startDate: 'desc' } },
  educations: { orderBy: { startDate: 'desc' } },
  skills: { include: { skill: true }, orderBy: { skill: { name: 'asc' } } },
  projects: { orderBy: { createdAt: 'desc' } },
  certifications: { orderBy: { createdAt: 'desc' } },
  languages: { orderBy: { name: 'asc' } },
} satisfies Prisma.CVInclude;

@Injectable()
export class CvsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService, // ajouté
  ) {}

  async create(userId: string, dto: CreateCvDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.cV.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });
      return tx.cV.create({ data: { ...dto, userId, isActive: true } });
    });
  }

  async findAll(userId: string) {
    const data = await this.prisma.cV.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        isActive: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { data, count: data.length };
  }

  async findOne(userId: string, id: string) {
    await this.findOwnedCv(userId, id);
    return this.prisma.cV.findUniqueOrThrow({
      where: { id },
      include: cvDetails,
    });
  }

  async update(userId: string, id: string, dto: UpdateCvDto) {
    await this.findOwnedCv(userId, id);
    return this.prisma.cV.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOwnedCv(userId, id);
    await this.prisma.cV.delete({ where: { id } });
  }

  async activate(userId: string, id: string) {
    await this.findOwnedCv(userId, id);
    return this.prisma.$transaction(async (tx) => {
      await tx.cV.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });
      return tx.cV.update({ where: { id }, data: { isActive: true } });
    });
  }

  async createExperience(
    userId: string,
    cvId: string,
    dto: CreateExperienceDto,
  ) {
    await this.findOwnedCv(userId, cvId);
    this.assertDateRange(dto.startDate, dto.endDate);
    return this.prisma.experience.create({ data: { ...dto, cvId } });
  }
  async listExperiences(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.experience.findMany({
      where: { cvId },
      orderBy: { startDate: 'desc' },
    });
  }
  async getExperience(userId: string, cvId: string, id: string) {
    await this.findOwnedCv(userId, cvId);
    return this.findChild<Experience>('experience', cvId, id);
  }
  async updateExperience(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateExperienceDto,
  ) {
    const existing = await this.getExperience(userId, cvId, id);
    this.assertDateRange(
      dto.startDate ?? existing.startDate,
      dto.endDate ?? existing.endDate,
    );
    return this.prisma.experience.update({ where: { id }, data: dto });
  }
  async removeExperience(
    userId: string,
    cvId: string,
    id: string,
  ): Promise<void> {
    await this.getExperience(userId, cvId, id);
    await this.prisma.experience.delete({ where: { id } });
  }

  async createEducation(userId: string, cvId: string, dto: CreateEducationDto) {
    await this.findOwnedCv(userId, cvId);
    this.assertDateRange(dto.startDate, dto.endDate);
    return this.prisma.education.create({ data: { ...dto, cvId } });
  }
  async listEducations(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.education.findMany({
      where: { cvId },
      orderBy: { startDate: 'desc' },
    });
  }
  async updateEducation(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateEducationDto,
  ) {
    const existing = await this.findChild<Education>(
      'education',
      cvId,
      id,
      userId,
    );
    this.assertDateRange(
      dto.startDate ?? existing.startDate,
      dto.endDate ?? existing.endDate,
    );
    return this.prisma.education.update({ where: { id }, data: dto });
  }
  async removeEducation(
    userId: string,
    cvId: string,
    id: string,
  ): Promise<void> {
    await this.findChild<Education>('education', cvId, id, userId);
    await this.prisma.education.delete({ where: { id } });
  }

  async createSkill(userId: string, cvId: string, dto: CreateSkillDto) {
    await this.findOwnedCv(userId, cvId);
    let skillId = dto.skillId;
    if (!skillId && dto.name) {
      const skill = await this.prisma.skill.upsert({
        where: { name: dto.name },
        update: dto.category ? { category: dto.category } : {},
        create: { name: dto.name, category: dto.category },
      });
      skillId = skill.id;
    }
    if (!skillId)
      throw new BadRequestException('Provide either skillId or name.');
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new NotFoundException('Skill not found.');
    const existing = await this.prisma.cVSkill.findUnique({
      where: { cvId_skillId: { cvId, skillId } },
    });
    if (existing)
      throw new ConflictException('This skill is already assigned to the CV.');
    return this.prisma.cVSkill.create({
      data: {
        cvId,
        skillId,
        level: dto.level ?? SkillLevel.INTERMEDIATE,
        years: dto.years,
      },
      include: { skill: true },
    });
  }
  async listSkills(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.cVSkill.findMany({
      where: { cvId },
      include: { skill: true },
      orderBy: { skill: { name: 'asc' } },
    });
  }
  async updateSkill(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateSkillDto,
  ) {
    await this.findChild<CVSkill>('cVSkill', cvId, id, userId);
    return this.prisma.cVSkill.update({
      where: { id },
      data: dto,
      include: { skill: true },
    });
  }
  async removeSkill(userId: string, cvId: string, id: string): Promise<void> {
    await this.findChild<CVSkill>('cVSkill', cvId, id, userId);
    await this.prisma.cVSkill.delete({ where: { id } });
  }

  async createProject(userId: string, cvId: string, dto: CreateProjectDto) {
    await this.findOwnedCv(userId, cvId);
    this.assertDateRange(dto.startDate, dto.endDate);
    return this.prisma.project.create({ data: { ...dto, cvId } });
  }
  async listProjects(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.project.findMany({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async updateProject(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateProjectDto,
  ) {
    const existing = await this.findChild<Project>('project', cvId, id, userId);
    this.assertDateRange(
      dto.startDate ?? existing.startDate,
      dto.endDate ?? existing.endDate,
    );
    return this.prisma.project.update({ where: { id }, data: dto });
  }
  async removeProject(userId: string, cvId: string, id: string): Promise<void> {
    await this.findChild<Project>('project', cvId, id, userId);
    await this.prisma.project.delete({ where: { id } });
  }

  async createCertification(
    userId: string,
    cvId: string,
    dto: CreateCertificationDto,
  ) {
    await this.findOwnedCv(userId, cvId);
    this.assertDateRange(dto.issueDate, dto.expirationDate);
    return this.prisma.certification.create({ data: { ...dto, cvId } });
  }
  async listCertifications(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.certification.findMany({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async updateCertification(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateCertificationDto,
  ) {
    const existing = await this.findChild<Certification>(
      'certification',
      cvId,
      id,
      userId,
    );
    this.assertDateRange(
      dto.issueDate ?? existing.issueDate,
      dto.expirationDate ?? existing.expirationDate,
    );
    return this.prisma.certification.update({ where: { id }, data: dto });
  }
  async removeCertification(
    userId: string,
    cvId: string,
    id: string,
  ): Promise<void> {
    await this.findChild<Certification>('certification', cvId, id, userId);
    await this.prisma.certification.delete({ where: { id } });
  }

  async createLanguage(userId: string, cvId: string, dto: CreateLanguageDto) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.language.create({ data: { ...dto, cvId } });
  }
  async listLanguages(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);
    return this.prisma.language.findMany({
      where: { cvId },
      orderBy: { name: 'asc' },
    });
  }
  async updateLanguage(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateLanguageDto,
  ) {
    await this.findChild<Language>('language', cvId, id, userId);
    return this.prisma.language.update({ where: { id }, data: dto });
  }
  async removeLanguage(
    userId: string,
    cvId: string,
    id: string,
  ): Promise<void> {
    await this.findChild<Language>('language', cvId, id, userId);
    await this.prisma.language.delete({ where: { id } });
  }

  // Phones
  async createPhone(userId: string, cvId: string, dto: CreateCvPhoneDto) {
    await this.findOwnedCv(userId, cvId);

    return this.prisma.cVPhone.create({
      data: {
        ...dto,
        cvId,
      },
    });
  }

  async listPhones(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);

    return this.prisma.cVPhone.findMany({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePhone(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateCvPhoneDto,
  ) {
    await this.findChild<CVPhone>('cVPhone', cvId, id, userId);

    return this.prisma.cVPhone.update({
      where: { id },
      data: dto,
    });
  }

  async removePhone(userId: string, cvId: string, id: string): Promise<void> {
    await this.findChild<CVPhone>('cVPhone', cvId, id, userId);

    await this.prisma.cVPhone.delete({
      where: { id },
    });
  }

  // Links
  async createLink(userId: string, cvId: string, dto: CreateCvLinkDto) {
    await this.findOwnedCv(userId, cvId);

    return this.prisma.cVLink.create({
      data: {
        ...dto,
        cvId,
      },
    });
  }

  async listLinks(userId: string, cvId: string) {
    await this.findOwnedCv(userId, cvId);

    return this.prisma.cVLink.findMany({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLink(
    userId: string,
    cvId: string,
    id: string,
    dto: UpdateCvLinkDto,
  ) {
    await this.findChild<CVLink>('cVLink', cvId, id, userId);

    return this.prisma.cVLink.update({
      where: { id },
      data: dto,
    });
  }

  async removeLink(userId: string, cvId: string, id: string): Promise<void> {
    await this.findChild<CVLink>('cVLink', cvId, id, userId);

    await this.prisma.cVLink.delete({
      where: { id },
    });
  }

  private async findOwnedCv(userId: string, id: string) {
    const cv = await this.prisma.cV.findUnique({ where: { id } });
    if (!cv) throw new NotFoundException('CV not found.');
    if (cv.userId !== userId)
      throw new ForbiddenException('You cannot access this CV.');
    return cv;
  }

  private async findChild<T>(
    model:
      | 'experience'
      | 'education'
      | 'cVSkill'
      | 'project'
      | 'certification'
      | 'language'
      | 'cVPhone'
      | 'cVLink',
    cvId: string,
    id: string,
    userId?: string,
  ): Promise<T> {
    if (userId) await this.findOwnedCv(userId, cvId);
    const delegate = this.prisma[model] as unknown as {
      findFirst(args: {
        where: { id: string; cvId: string };
      }): Promise<T | null>;
    };
    const record = await delegate.findFirst({ where: { id, cvId } });
    if (!record) throw new NotFoundException('Resource not found.');
    return record;
  }

  private assertDateRange(
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    if (startDate && endDate && endDate < startDate)
      throw new BadRequestException('End date must be after start date.');
  }

  // ============================================================
  // PHOTO
  // ============================================================
  async updatePhoto(userId: string, id: string, file: Express.Multer.File) {
    const cv = await this.findOwnedCv(userId, id);

    // Supprime l'ancienne photo si elle existe, pour ne pas accumuler
    // des fichiers orphelins sur le disque.
    if (cv.photoUrl) {
      await this.storage.deleteFile(cv.photoUrl);
    }

    const ext = extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const { path } = await this.storage.saveFile(
      file.buffer,
      filename,
      'cv-photos',
    );

    return this.prisma.cV.update({ where: { id }, data: { photoUrl: path } });
  }

  async removePhoto(userId: string, id: string): Promise<void> {
    const cv = await this.findOwnedCv(userId, id);
    if (cv.photoUrl) {
      await this.storage.deleteFile(cv.photoUrl);
      await this.prisma.cV.update({ where: { id }, data: { photoUrl: null } });
    }
  }
}