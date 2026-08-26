START TRANSACTION;

ALTER TABLE `Product`
ADD COLUMN `weight` DECIMAL(6,2) NULL
COMMENT 'Product weight in KG for shipping';

ALTER TABLE `Order`
ADD COLUMN `courier` VARCHAR(50) NULL
COMMENT 'Courier provider name (e.g. DELHIVERY)',
ADD COLUMN `trackingId` VARCHAR(100) NULL
COMMENT 'Courier tracking / waybill number',
ADD COLUMN `shippedAt` DATETIME NULL
COMMENT 'Timestamp when order was shipped',
ADD COLUMN `deliveredAt` DATETIME NULL
COMMENT 'Timestamp when order was delivered',
ADD COLUMN `shippingResponse` JSON NULL
COMMENT 'Raw courier API response for audit/debug';

CREATE INDEX `idx_order_trackingId`
ON `Order` (`trackingId`);

COMMIT;
