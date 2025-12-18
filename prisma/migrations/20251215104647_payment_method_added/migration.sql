-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `razorpayOrderId` VARCHAR(191) NULL;
