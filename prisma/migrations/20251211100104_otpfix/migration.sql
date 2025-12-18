/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `OtpCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OtpCode_email_key` ON `OtpCode`(`email`);
