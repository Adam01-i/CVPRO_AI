import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
import { CvsService } from './cvs.service';

@UseGuards(JwtAuthGuard)
@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post() create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCvDto) {
    return this.cvsService.create(user.id, dto);
  }
  @Get() findAll(@CurrentUser() user: JwtPayload) {
    return this.cvsService.findAll(user.id);
  }
  @Get(':id') findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.cvsService.findOne(user.id, id);
  }
  @Patch(':id') update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCvDto,
  ) {
    return this.cvsService.update(user.id, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT) @Delete(':id') async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    await this.cvsService.remove(user.id, id);
  }
  @Patch(':id/activate') activate(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.cvsService.activate(user.id, id);
  }

  @Post(':cvId/experiences') createExperience(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateExperienceDto,
  ) {
    return this.cvsService.createExperience(user.id, cvId, dto);
  }
  @Get(':cvId/experiences') listExperiences(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listExperiences(user.id, cvId);
  }
  @Get(':cvId/experiences/:id') getExperience(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    return this.cvsService.getExperience(user.id, cvId, id);
  }
  @Patch(':cvId/experiences/:id') updateExperience(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.cvsService.updateExperience(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/experiences/:id')
  async removeExperience(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeExperience(user.id, cvId, id);
  }

  @Post(':cvId/educations') createEducation(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateEducationDto,
  ) {
    return this.cvsService.createEducation(user.id, cvId, dto);
  }
  @Get(':cvId/educations') listEducations(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listEducations(user.id, cvId);
  }
  @Patch(':cvId/educations/:id') updateEducation(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.cvsService.updateEducation(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/educations/:id')
  async removeEducation(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeEducation(user.id, cvId, id);
  }

  @Post(':cvId/skills') createSkill(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateSkillDto,
  ) {
    return this.cvsService.createSkill(user.id, cvId, dto);
  }
  @Get(':cvId/skills') listSkills(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listSkills(user.id, cvId);
  }
  @Patch(':cvId/skills/:id') updateSkill(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.cvsService.updateSkill(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/skills/:id')
  async removeSkill(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeSkill(user.id, cvId, id);
  }

  @Post(':cvId/projects') createProject(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.cvsService.createProject(user.id, cvId, dto);
  }
  @Get(':cvId/projects') listProjects(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listProjects(user.id, cvId);
  }
  @Patch(':cvId/projects/:id') updateProject(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.cvsService.updateProject(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/projects/:id')
  async removeProject(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeProject(user.id, cvId, id);
  }

  @Post(':cvId/certifications') createCertification(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateCertificationDto,
  ) {
    return this.cvsService.createCertification(user.id, cvId, dto);
  }
  @Get(':cvId/certifications') listCertifications(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listCertifications(user.id, cvId);
  }
  @Patch(':cvId/certifications/:id') updateCertification(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.cvsService.updateCertification(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/certifications/:id')
  async removeCertification(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeCertification(user.id, cvId, id);
  }

  @Post(':cvId/languages') createLanguage(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateLanguageDto,
  ) {
    return this.cvsService.createLanguage(user.id, cvId, dto);
  }
  @Get(':cvId/languages') listLanguages(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.listLanguages(user.id, cvId);
  }
  @Patch(':cvId/languages/:id') updateLanguage(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.cvsService.updateLanguage(user.id, cvId, id, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/languages/:id')
  async removeLanguage(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeLanguage(user.id, cvId, id);
  }

  // Phones
  @Post(':cvId/phones')
  createPhone(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateCvPhoneDto,
  ) {
    return this.cvsService.createPhone(user.id, cvId, dto);
  }

  @Get(':cvId/phones')
  listPhones(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.cvsService.listPhones(user.id, cvId);
  }

  @Patch(':cvId/phones/:id')
  updatePhone(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCvPhoneDto,
  ) {
    return this.cvsService.updatePhone(user.id, cvId, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/phones/:id')
  async removePhone(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removePhone(user.id, cvId, id);
  }

  // Links
  @Post(':cvId/links')
  createLink(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Body() dto: CreateCvLinkDto,
  ) {
    return this.cvsService.createLink(user.id, cvId, dto);
  }

  @Get(':cvId/links')
  listLinks(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.cvsService.listLinks(user.id, cvId);
  }

  @Patch(':cvId/links/:id')
  updateLink(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCvLinkDto,
  ) {
    return this.cvsService.updateLink(user.id, cvId, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cvId/links/:id')
  async removeLink(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ) {
    await this.cvsService.removeLink(user.id, cvId, id);
  }
}
