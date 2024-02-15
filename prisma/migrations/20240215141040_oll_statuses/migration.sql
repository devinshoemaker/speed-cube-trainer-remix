-- CreateTable
CREATE TABLE "OllStatus" (
    "id" TEXT NOT NULL,
    "ollName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OllStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OllStatus" ADD CONSTRAINT "OllStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
