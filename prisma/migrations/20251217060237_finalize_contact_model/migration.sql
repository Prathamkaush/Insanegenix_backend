/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayOrderId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `img1` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `img2` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `img3` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `img4` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `productsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `contactmessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contactrequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `otpcode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contactmessage` DROP FOREIGN KEY `ContactMessage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `contactrequest` DROP FOREIGN KEY `ContactRequest_orderId_fkey`;

-- DropIndex
DROP INDEX `Order_razorpayOrderId_key` ON `order`;

-- DropIndex
DROP INDEX `User_googleId_key` ON `user`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `paidAt`,
    DROP COLUMN `paymentId`,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `razorpayOrderId`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `img1`,
    DROP COLUMN `img2`,
    DROP COLUMN `img3`,
    DROP COLUMN `img4`;

-- AlterTable
ALTER TABLE `productsubtype` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `googleId`,
    DROP COLUMN `isVerified`,
    DROP COLUMN `passwordHash`;

-- DropTable
DROP TABLE `contactmessage`;

-- DropTable
DROP TABLE `contactrequest`;

-- DropTable
DROP TABLE `otpcode`;

-- DropTable
DROP TABLE `settings`;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `reason` ENUM('GENERAL', 'PAYMENT_FAILED', 'ORDER_QUERY') NOT NULL DEFAULT 'GENERAL',
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'NEW',
    `orderId` INTEGER NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
