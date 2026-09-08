/*
  Warnings:

  - You are about to drop the column `country` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `cvs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cvs" DROP COLUMN "country",
DROP COLUMN "profession";
