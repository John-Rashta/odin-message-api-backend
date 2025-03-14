-- CreateTable
CREATE TABLE "CustomIcons" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadAt" TIMESTAMP(3) NOT NULL,
    "personid" TEXT NOT NULL,

    CONSTRAINT "CustomIcons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomMessages" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadAt" TIMESTAMP(3) NOT NULL,
    "messageid" TEXT NOT NULL,

    CONSTRAINT "CustomMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomIcons_personid_key" ON "CustomIcons"("personid");

-- CreateIndex
CREATE UNIQUE INDEX "CustomMessages_messageid_key" ON "CustomMessages"("messageid");

-- AddForeignKey
ALTER TABLE "CustomIcons" ADD CONSTRAINT "CustomIcons_personid_fkey" FOREIGN KEY ("personid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMessages" ADD CONSTRAINT "CustomMessages_messageid_fkey" FOREIGN KEY ("messageid") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
