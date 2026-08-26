-- AlterTable
ALTER TABLE `Order` 
ADD COLUMN `addressId` INTEGER NULL AFTER `address`;

-- AddForeignKey (Optional but Recommended)
-- Assuming your address table is named UserAddress
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` 
    FOREIGN KEY (`addressId`) REFERENCES `UserAddress`(`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE;