-- Add shipping & pricing fields to Order table

ALTER TABLE `Order`
  ADD COLUMN `shippingCharge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN `finalAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN `totalWeight` DECIMAL(6,2) NULL;

-- Optional: backfill finalAmount for old orders
UPDATE `Order`
SET `finalAmount` = `totalAmount`
WHERE `finalAmount` = 0;
