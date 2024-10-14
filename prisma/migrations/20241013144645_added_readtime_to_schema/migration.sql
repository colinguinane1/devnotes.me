-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "readingTime" TEXT,
ALTER COLUMN "updatedAt" DROP NOT NULL;
