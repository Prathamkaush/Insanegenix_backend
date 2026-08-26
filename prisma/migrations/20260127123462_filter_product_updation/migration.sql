-- =========================================================
-- 1. CREATE MASTER ATTRIBUTE TABLES
-- =========================================================

CREATE TABLE `Season` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Season_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `hex` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Color_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Fabric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Fabric_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Occasion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Occasion_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Fit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    UNIQUE INDEX `Fit_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Sleeve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    UNIQUE INDEX `Sleeve_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Pattern` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    UNIQUE INDEX `Pattern_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================================================
-- 2. ALTER PRODUCT TABLE
-- =========================================================

ALTER TABLE `Product` ADD COLUMN `seasonId` INTEGER NULL;

ALTER TABLE `Product` ADD CONSTRAINT `Product_seasonId_fkey` 
    FOREIGN KEY (`seasonId`) REFERENCES `Season`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- =========================================================
-- 3. CREATE JUNCTION TABLES (MANY-TO-MANY)
-- =========================================================

CREATE TABLE `ProductColor` (
    `productId` INTEGER NOT NULL,
    `colorId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `colorId`),
    INDEX `ProductColor_colorId_idx`(`colorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductFabric` (
    `productId` INTEGER NOT NULL,
    `fabricId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `fabricId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductOccasion` (
    `productId` INTEGER NOT NULL,
    `occasionId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `occasionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductFit` (
    `productId` INTEGER NOT NULL,
    `fitId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `fitId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductSleeve` (
    `productId` INTEGER NOT NULL,
    `sleeveId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `sleeveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductPattern` (
    `productId` INTEGER NOT NULL,
    `patternId` INTEGER NOT NULL,
    PRIMARY KEY (`productId`, `patternId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================================================
-- 4. ADD FOREIGN KEY CONSTRAINTS FOR JUNCTION TABLES
-- =========================================================

ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProductFabric` ADD CONSTRAINT `ProductFabric_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductFabric` ADD CONSTRAINT `ProductFabric_fabricId_fkey` FOREIGN KEY (`fabricId`) REFERENCES `Fabric`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProductOccasion` ADD CONSTRAINT `ProductOccasion_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductOccasion` ADD CONSTRAINT `ProductOccasion_occasionId_fkey` FOREIGN KEY (`occasionId`) REFERENCES `Occasion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProductFit` ADD CONSTRAINT `ProductFit_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductFit` ADD CONSTRAINT `ProductFit_fitId_fkey` FOREIGN KEY (`fitId`) REFERENCES `Fit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProductSleeve` ADD CONSTRAINT `ProductSleeve_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductSleeve` ADD CONSTRAINT `ProductSleeve_sleeveId_fkey` FOREIGN KEY (`sleeveId`) REFERENCES `Sleeve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProductPattern` ADD CONSTRAINT `ProductPattern_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ProductPattern` ADD CONSTRAINT `ProductPattern_patternId_fkey` FOREIGN KEY (`patternId`) REFERENCES `Pattern`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;