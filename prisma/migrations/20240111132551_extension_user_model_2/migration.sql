-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "Comments" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Salary" INTEGER NOT NULL DEFAULT 0;
