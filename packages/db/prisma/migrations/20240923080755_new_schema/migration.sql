/*
  Warnings:

  - You are about to drop the column `actionMetadata` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `availableTriggersId` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AvailableTriggers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `triggerId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_availableTriggersId_fkey";

-- DropIndex
DROP INDEX "Zap_triggerId_key";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionMetadata",
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "availableTriggersId",
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "triggerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verified";

-- DropTable
DROP TABLE "AvailableTriggers";

-- CreateTable
CREATE TABLE "AvailableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "AvailableTrigger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
