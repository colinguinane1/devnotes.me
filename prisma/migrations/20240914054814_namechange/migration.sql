/*
  Warnings:

  - You are about to drop the column `pref_discordLink` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `pref_githubLink` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `pref_linkedinLink` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `pref_twitterLink` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Author" DROP COLUMN "pref_discordLink",
DROP COLUMN "pref_githubLink",
DROP COLUMN "pref_linkedinLink",
DROP COLUMN "pref_twitterLink",
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;
