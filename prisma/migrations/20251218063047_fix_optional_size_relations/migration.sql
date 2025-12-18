-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `sizeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `discountType` VARCHAR(191) NULL,
    ADD COLUMN `discountValue` DECIMAL(10, 2) NULL,
    ADD COLUMN `originalPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `sizeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `ProductSize`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `ProductSize`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
