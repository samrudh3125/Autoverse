/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[triggerId]` on the table `Zap` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `triggerId` to the `Zap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Zap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "role",
DROP COLUMN "updatedAt",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Zap" ADD COLUMN     "triggerId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Zap_triggerId_key" ON "Zap"("triggerId");

-- AddForeignKey
ALTER TABLE "Zap" ADD CONSTRAINT "Zap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
