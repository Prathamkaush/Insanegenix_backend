/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,sizeId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `fk_wishlist_product`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `fk_wishlist_user`;

-- DropIndex
DROP INDEX `Wishlist_userId_productId_key` ON `wishlist`;

-- AlterTable
ALTER TABLE `wishlist` ADD COLUMN `sizeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Wishlist_userId_productId_sizeId_key` ON `Wishlist`(`userId`, `productId`, `sizeId`);

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `ProductSize`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
