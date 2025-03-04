/*
  Warnings:

  - Added the required column `groupid` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "groupid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
