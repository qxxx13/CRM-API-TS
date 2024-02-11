/*
  Warnings:

  - The values [rejected] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('pending', 'fulfilled', 'rejectedByClient', 'rejectedByMaster', 'atWork', 'active');
ALTER TABLE "Order" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "Status" TYPE "OrderStatus_new" USING ("Status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "Status" SET DEFAULT 'pending';
COMMIT;
