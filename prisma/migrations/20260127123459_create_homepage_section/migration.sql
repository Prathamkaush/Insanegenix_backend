CREATE TABLE `HomepageSection` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('HERO','CATEGORY_STRIP','INFLUENCER','EDITORIAL') NOT NULL,
  `title` VARCHAR(191),
  `config` JSON NOT NULL,
  `position` INT NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
);

CREATE INDEX `HomepageSection_type_idx` ON `HomepageSection`(`type`);
CREATE INDEX `HomepageSection_position_idx` ON `HomepageSection`(`position`);