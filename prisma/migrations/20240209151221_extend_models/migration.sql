-- AlterEnum
ALTER TYPE "Visit" ADD VALUE 'guarantee';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "Expenses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Total" INTEGER NOT NULL DEFAULT 0;
