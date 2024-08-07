/*
  Warnings:

  - Added the required column `image_url` to the `Achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievements" ADD COLUMN     "image_url" TEXT NOT NULL;
