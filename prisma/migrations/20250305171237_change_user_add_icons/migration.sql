/*
  Warnings:

  - Added the required column `joinedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "icon" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Icons" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Icons_pkey" PRIMARY KEY ("id")
);
