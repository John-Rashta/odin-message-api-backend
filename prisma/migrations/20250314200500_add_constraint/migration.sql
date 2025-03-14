-- DropForeignKey
ALTER TABLE "CustomIcons" DROP CONSTRAINT "CustomIcons_personid_fkey";

-- DropForeignKey
ALTER TABLE "CustomMessages" DROP CONSTRAINT "CustomMessages_messageid_fkey";

-- AddForeignKey
ALTER TABLE "CustomIcons" ADD CONSTRAINT "CustomIcons_personid_fkey" FOREIGN KEY ("personid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMessages" ADD CONSTRAINT "CustomMessages_messageid_fkey" FOREIGN KEY ("messageid") REFERENCES "Messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
