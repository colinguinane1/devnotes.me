-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;
