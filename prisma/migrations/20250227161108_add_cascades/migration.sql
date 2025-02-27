-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_convoid_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_groupid_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_senderid_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_receiverid_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_senderid_fkey";

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_convoid_fkey" FOREIGN KEY ("convoid") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
