-- -----------------------------------------
-- 1️⃣ ENUM for media source
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `_MediaSourceType` (
  `value` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`value`)
);

INSERT IGNORE INTO `_MediaSourceType` (`value`)
VALUES ('UPLOAD'), ('INSTAGRAM');

-- -----------------------------------------
-- 2️⃣ ALTER InfluencerItem table
-- -----------------------------------------
ALTER TABLE `InfluencerItem`
  ADD COLUMN `mediaType` ENUM('UPLOAD','INSTAGRAM') NOT NULL DEFAULT 'UPLOAD',
  ADD COLUMN `embedUrl` TEXT NULL,
  ADD COLUMN `influencerName` VARCHAR(191) NULL,
  ADD COLUMN `ctaText` VARCHAR(191) NULL DEFAULT 'Shop Now';

-- -----------------------------------------
-- 3️⃣ Make mediaId nullable (important)
-- -----------------------------------------
ALTER TABLE `InfluencerItem`
  MODIFY `mediaId` INT NULL;

-- -----------------------------------------
-- 4️⃣ Foreign key safety (media optional)
-- -----------------------------------------
ALTER TABLE `InfluencerItem`
  DROP FOREIGN KEY `InfluencerItem_mediaId_fkey`;

ALTER TABLE `InfluencerItem`
  ADD CONSTRAINT `InfluencerItem_mediaId_fkey`
  FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
