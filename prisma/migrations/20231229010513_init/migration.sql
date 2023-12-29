-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'fulfilled', 'rejected');

-- CreateEnum
CREATE TYPE "Visit" AS ENUM ('primary', 'repeated');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('master', 'admin');

-- CreateTable
CREATE TABLE "Order" (
    "Id" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "OrderDateTime" TIMESTAMP(3) NOT NULL,
    "Visit" "Visit" NOT NULL,
    "ClientPhoneNumber" TEXT NOT NULL,
    "ClientName" TEXT NOT NULL,
    "MasterId" INTEGER NOT NULL,
    "AnnouncedPrice" INTEGER NOT NULL DEFAULT 0,
    "Price" INTEGER NOT NULL DEFAULT 0,
    "Status" "Status" NOT NULL DEFAULT 'pending',
    "TelephoneRecord" TEXT NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "MasterName" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "UserName" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "TelegramChatId" TEXT NOT NULL,
    "Role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_MasterId_fkey" FOREIGN KEY ("MasterId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
