CREATE TABLE `UserAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` CHAR(6) NOT NULL,

    `isDefault` BOOLEAN NOT NULL DEFAULT false,

    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL 
        DEFAULT CURRENT_TIMESTAMP(3) 
        ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `UserAddress_userId_idx` (`userId`),
    INDEX `UserAddress_userId_isDefault_idx` (`userId`, `isDefault`),

    PRIMARY KEY (`id`)
) ENGINE=InnoDB 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

ALTER TABLE `UserAddress`
ADD CONSTRAINT `UserAddress_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE
ON UPDATE CASCADE;
