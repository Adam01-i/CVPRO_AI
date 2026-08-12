import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationStatus, UserRole } from '../../generated/prisma/client';
import { JwtPayload } from '../auth/auth.service'; import { CurrentUser } from '../auth/decorators/current-user.decorator'; import { Roles } from '../auth/decorators/roles.decorator'; import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateCompanyDto } from './dto/create-company.dto'; import { CreateJobApplicationDto } from './dto/create-job-application.dto'; import { CreateJobOfferDto } from './dto/create-job-offer.dto'; import { QueryJobOffersDto } from './dto/query-job-offers.dto'; import { UpdateCompanyDto } from './dto/update-company.dto'; import { UpdateJobApplicationStatusDto } from './dto/update-job-application-status.dto'; import { UpdateJobOfferDto } from './dto/update-job-offer.dto'; import { UpdateJobOfferStatusDto } from './dto/update-job-offer-status.dto'; import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}
  @Get('companies') companies() { return this.jobs.findCompanies(); }
  @Get('companies/:id') company(@Param('id') id: string) { return this.jobs.findCompany(id); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Post('companies') createCompany(@Body() dto: CreateCompanyDto) { return this.jobs.createCompany(dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Patch('companies/:id') updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDto) { return this.jobs.updateCompany(id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @HttpCode(HttpStatus.NO_CONTENT) @Delete('companies/:id') async removeCompany(@Param('id') id: string) { await this.jobs.removeCompany(id); }
  @Get('offers') offers(@Query() query: QueryJobOffersDto) { return this.jobs.findOffers(query); }
  @Get('offers/:id') offer(@Param('id') id: string) { return this.jobs.findOffer(id); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Post('offers') createOffer(@Body() dto: CreateJobOfferDto) { return this.jobs.createOffer(dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Patch('offers/:id') updateOffer(@Param('id') id: string, @Body() dto: UpdateJobOfferDto) { return this.jobs.updateOffer(id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @HttpCode(HttpStatus.NO_CONTENT) @Delete('offers/:id') async removeOffer(@Param('id') id: string) { await this.jobs.removeOffer(id); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Patch('offers/:id/status') status(@Param('id') id: string, @Body() dto: UpdateJobOfferStatusDto) { return this.jobs.setOfferStatus(id, dto.isActive); }
  @UseGuards(JwtAuthGuard) @Post('offers/:id/apply') apply(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateJobApplicationDto) { return this.jobs.apply(user.id, id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Get('offers/:id/applications') offerApplications(@Param('id') id: string) { return this.jobs.offerApplications(id); }
  @UseGuards(JwtAuthGuard) @Get('applications/me') myApplications(@CurrentUser() user: JwtPayload) { return this.jobs.myApplications(user.id); }
  @UseGuards(JwtAuthGuard) @Get('applications/:id') application(@CurrentUser() user: JwtPayload, @Param('id') id: string) { return this.jobs.findApplication(id, user.id, user.role); }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @Patch('applications/:id/status') updateApplication(@Param('id') id: string, @Body() dto: UpdateJobApplicationStatusDto) { return this.jobs.updateApplicationStatus(id, dto.status); }
  @UseGuards(JwtAuthGuard) @Patch('applications/:id/withdraw') withdraw(@CurrentUser() user: JwtPayload, @Param('id') id: string) { return this.jobs.withdraw(id, user.id); }
}
