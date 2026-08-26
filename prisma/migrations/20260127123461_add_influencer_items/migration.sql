-- CreateTable
CREATE TABLE `InfluencerItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homepageSectionId` INTEGER NOT NULL,
    `mediaId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InfluencerItem_homepageSectionId_idx`(`homepageSectionId`),
    INDEX `InfluencerItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InfluencerItem` ADD CONSTRAINT `InfluencerItem_homepageSectionId_fkey` 
    FOREIGN KEY (`homepageSectionId`) REFERENCES `HomepageSection`(`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfluencerItem` ADD CONSTRAINT `InfluencerItem_mediaId_fkey` 
    FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfluencerItem` ADD CONSTRAINT `InfluencerItem_productId_fkey` 
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;