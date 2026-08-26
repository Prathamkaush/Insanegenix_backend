-- 1. Add price column with temporary default
ALTER TABLE `CartItem`
ADD COLUMN `price` INT NOT NULL DEFAULT 0;

-- 2. Backfill existing cart items with product price
UPDATE `CartItem` ci
JOIN `Product` p ON p.id = ci.productId
SET ci.price = 
  CASE
    WHEN p.discountType = 'PERCENT' AND p.discountValue IS NOT NULL
      THEN ROUND(p.price - (p.price * p.discountValue / 100))
    WHEN p.discountType = 'FLAT' AND p.discountValue IS NOT NULL
      THEN GREATEST(0, p.price - p.discountValue)
    ELSE p.price
  END;

-- 3. Remove default (important for data correctness)
ALTER TABLE `CartItem`
ALTER COLUMN `price` DROP DEFAULT;
