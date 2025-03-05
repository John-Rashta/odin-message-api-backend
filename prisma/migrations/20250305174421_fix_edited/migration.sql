/*
  Warnings:

  - Made the column `edited` on table `Messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "edited" SET NOT NULL,
ALTER COLUMN "edited" SET DEFAULT false;
