-- AlterTable
ALTER TABLE `Order`
ADD COLUMN `couponCode` VARCHAR(191) NULL AFTER `shippingResponse`,
ADD COLUMN `couponDiscount` DECIMAL(10, 2) NULL AFTER `couponCode`;