/*
  Warnings:

  - Made the column `updatedAt` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "updatedAt" SET NOT NULL;
