-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('LINKEDIN', 'GITHUB', 'PORTFOLIO', 'PERSONAL', 'BEHANCE', 'DRIBBBLE', 'TWITTER', 'OTHER');

-- AlterTable
ALTER TABLE "cvs" ADD COLUMN     "addressLine" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postalCode" TEXT;

-- CreateTable
CREATE TABLE "cv_phones" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "label" TEXT,
    "number" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_links" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_phones_cvId_idx" ON "cv_phones"("cvId");

-- CreateIndex
CREATE INDEX "cv_links_cvId_idx" ON "cv_links"("cvId");

-- AddForeignKey
ALTER TABLE "cv_phones" ADD CONSTRAINT "cv_phones_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_links" ADD CONSTRAINT "cv_links_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
