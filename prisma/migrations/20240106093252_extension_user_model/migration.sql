/*
  Warnings:

  - You are about to drop the column `OrderDateTime` on the `Order` table. All the data in the column will be lost.
  - The `Status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `Date` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'fulfilled', 'rejected', 'atWork');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('atWork', 'notWork', 'wentForSparePart');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "OrderDateTime",
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Time" TEXT,
ALTER COLUMN "ClientName" DROP NOT NULL,
ALTER COLUMN "AnnouncedPrice" SET DEFAULT '0',
ALTER COLUMN "AnnouncedPrice" SET DATA TYPE TEXT,
ALTER COLUMN "Price" SET DEFAULT '0',
ALTER COLUMN "Price" SET DATA TYPE TEXT,
DROP COLUMN "Status",
ADD COLUMN     "Status" "OrderStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "TelephoneRecord" DROP NOT NULL,
ALTER COLUMN "Latitude" DROP NOT NULL,
ALTER COLUMN "Longitude" DROP NOT NULL,
ALTER COLUMN "MasterName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Status" "UserStatus" NOT NULL DEFAULT 'atWork',
ADD COLUMN     "interestRate" INTEGER NOT NULL DEFAULT 50,
ALTER COLUMN "Role" SET DEFAULT 'master',
ALTER COLUMN "isOnline" SET DEFAULT false;

-- DropEnum
DROP TYPE "Status";
