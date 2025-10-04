/*
  Warnings:

  - You are about to drop the column `nom` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "nom",
ADD COLUMN     "deleteAt" TIMESTAMP(3),
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "deleteAt" TIMESTAMP(3);
