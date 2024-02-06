/*
  Warnings:

  - The values [notWork] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `interestRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('atWork', 'waitForWork', 'wentForSparePart', 'dayOff');
ALTER TABLE "User" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "Status" TYPE "UserStatus_new" USING ("Status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "Status" SET DEFAULT 'atWork';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "interestRate",
DROP COLUMN "isOnline",
ADD COLUMN     "InterestRate" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "IsOnline" BOOLEAN NOT NULL DEFAULT false;
