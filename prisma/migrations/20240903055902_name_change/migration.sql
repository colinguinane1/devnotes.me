/*
  Warnings:

  - You are about to drop the column `first_name` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Author" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "full_name" TEXT;
