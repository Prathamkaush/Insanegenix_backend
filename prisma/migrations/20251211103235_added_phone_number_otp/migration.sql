/*
  Warnings:

  - You are about to drop the column `email` on the `otpcode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `OtpCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `OtpCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OtpCode_email_key` ON `otpcode`;

-- AlterTable
ALTER TABLE `otpcode` DROP COLUMN `email`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OtpCode_phone_key` ON `OtpCode`(`phone`);
