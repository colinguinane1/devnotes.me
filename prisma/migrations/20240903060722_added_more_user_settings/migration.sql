-- AlterTable
ALTER TABLE "public"."Author" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "pref_discordLink" TEXT,
ADD COLUMN     "pref_displayBio" BOOLEAN DEFAULT true,
ADD COLUMN     "pref_displayEmail" BOOLEAN DEFAULT false,
ADD COLUMN     "pref_displayFullName" BOOLEAN DEFAULT true,
ADD COLUMN     "pref_githubLink" TEXT,
ADD COLUMN     "pref_linkedinLink" TEXT,
ADD COLUMN     "pref_twitterLink" TEXT,
ADD COLUMN     "verified" BOOLEAN DEFAULT false;
