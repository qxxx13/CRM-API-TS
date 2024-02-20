/*
  Warnings:

  - You are about to drop the column `MessageId` on the `User` table. All the data in the column will be lost.
  - Added the required column `MessageThreadId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'masterWentForSparePart';
ALTER TYPE "OrderStatus" ADD VALUE 'awaitingPayment';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "BotMessageArr" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ClosingOrderId" INTEGER DEFAULT 0,
ADD COLUMN     "CompanyShare" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "MessageId",
ADD COLUMN     "MessageThreadId" TEXT NOT NULL;
