-- AlterTable
ALTER TABLE `Order`
ADD COLUMN `confirmedAt` DATETIME(3) NULL AFTER `trackingId`;