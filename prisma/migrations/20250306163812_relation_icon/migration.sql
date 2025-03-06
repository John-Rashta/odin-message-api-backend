/*
  Warnings:

  - You are about to drop the column `icon` on the `User` table. All the data in the column will be lost.
  - Added the required column `iconid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "icon",
ADD COLUMN     "iconid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_iconid_fkey" FOREIGN KEY ("iconid") REFERENCES "Icons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
