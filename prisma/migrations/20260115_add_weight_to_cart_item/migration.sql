-- AlterTable
ALTER TABLE `CartItem` 
ADD COLUMN `weight` DOUBLE NOT NULL DEFAULT 0 AFTER `price`;