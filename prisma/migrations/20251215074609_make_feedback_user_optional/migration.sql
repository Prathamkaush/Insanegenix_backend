-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_userId_fkey`;

-- AlterTable
ALTER TABLE `feedback` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
