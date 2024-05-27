/*
  Warnings:

  - You are about to drop the column `createdAt` on the `OrderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "updatedAt";
