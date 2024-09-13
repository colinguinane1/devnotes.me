/*
  Warnings:

  - You are about to drop the column `mdx` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "mdx",
ADD COLUMN     "markdown" BOOLEAN DEFAULT false;
