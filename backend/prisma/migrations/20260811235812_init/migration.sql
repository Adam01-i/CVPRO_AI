-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('CDI', 'CDD', 'STAGE', 'ALTERNANCE', 'FREELANCE', 'INTERIM', 'TEMPORARY', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'APPLIED', 'UNDER_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "AnalysisType" AS ENUM ('CV_ANALYSIS', 'JOB_MATCHING', 'CV_IMPROVEMENT');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('BAC', 'BAC_PLUS_1', 'BAC_PLUS_2', 'BAC_PLUS_3', 'BAC_PLUS_4', 'BAC_PLUS_5', 'DOCTORATE', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "profileImage" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "profession" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "level" "EducationLevel",
    "location" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_skills" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "years" DOUBLE PRECISION,

    CONSTRAINT "cv_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "githubUrl" TEXT,
    "technologies" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "issueDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "location" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_offers" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "contractType" "ContractType",
    "salaryMin" DOUBLE PRECISION,
    "salaryMax" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'XOF',
    "requirements" TEXT,
    "responsibilities" TEXT,
    "applicationUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_offer_skills" (
    "id" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "job_offer_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT,
    "jobOfferId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "coverLetter" TEXT,
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "type" "AnalysisType" NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,
    "overallFeedback" TEXT,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "recommendations" JSONB,
    "extractedData" JSONB,
    "rawResponse" JSONB,
    "model" TEXT,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_matchings" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "skillsScore" DOUBLE PRECISION,
    "experienceScore" DOUBLE PRECISION,
    "educationScore" DOUBLE PRECISION,
    "semanticScore" DOUBLE PRECISION,
    "matchedSkills" JSONB,
    "missingSkills" JSONB,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_matchings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "cvs_userId_idx" ON "cvs"("userId");

-- CreateIndex
CREATE INDEX "experiences_cvId_idx" ON "experiences"("cvId");

-- CreateIndex
CREATE INDEX "educations_cvId_idx" ON "educations"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE INDEX "cv_skills_cvId_idx" ON "cv_skills"("cvId");

-- CreateIndex
CREATE INDEX "cv_skills_skillId_idx" ON "cv_skills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "cv_skills_cvId_skillId_key" ON "cv_skills"("cvId", "skillId");

-- CreateIndex
CREATE INDEX "projects_cvId_idx" ON "projects"("cvId");

-- CreateIndex
CREATE INDEX "certifications_cvId_idx" ON "certifications"("cvId");

-- CreateIndex
CREATE INDEX "languages_cvId_idx" ON "languages"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE INDEX "job_offers_companyId_idx" ON "job_offers"("companyId");

-- CreateIndex
CREATE INDEX "job_offers_isActive_idx" ON "job_offers"("isActive");

-- CreateIndex
CREATE INDEX "job_offer_skills_jobOfferId_idx" ON "job_offer_skills"("jobOfferId");

-- CreateIndex
CREATE INDEX "job_offer_skills_skillId_idx" ON "job_offer_skills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "job_offer_skills_jobOfferId_skillId_key" ON "job_offer_skills"("jobOfferId", "skillId");

-- CreateIndex
CREATE INDEX "job_applications_userId_idx" ON "job_applications"("userId");

-- CreateIndex
CREATE INDEX "job_applications_jobOfferId_idx" ON "job_applications"("jobOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_userId_jobOfferId_key" ON "job_applications"("userId", "jobOfferId");

-- CreateIndex
CREATE INDEX "ai_analyses_userId_idx" ON "ai_analyses"("userId");

-- CreateIndex
CREATE INDEX "ai_analyses_cvId_idx" ON "ai_analyses"("cvId");

-- CreateIndex
CREATE INDEX "ai_analyses_type_idx" ON "ai_analyses"("type");

-- CreateIndex
CREATE INDEX "job_matchings_cvId_idx" ON "job_matchings"("cvId");

-- CreateIndex
CREATE INDEX "job_matchings_jobOfferId_idx" ON "job_matchings"("jobOfferId");

-- CreateIndex
CREATE INDEX "job_matchings_score_idx" ON "job_matchings"("score");

-- CreateIndex
CREATE UNIQUE INDEX "job_matchings_cvId_jobOfferId_key" ON "job_matchings"("cvId", "jobOfferId");

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_skills" ADD CONSTRAINT "cv_skills_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_skills" ADD CONSTRAINT "cv_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offer_skills" ADD CONSTRAINT "job_offer_skills_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offer_skills" ADD CONSTRAINT "job_offer_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_matchings" ADD CONSTRAINT "job_matchings_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_matchings" ADD CONSTRAINT "job_matchings_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
