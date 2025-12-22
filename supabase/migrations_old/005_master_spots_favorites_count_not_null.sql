-- ===============================
-- master_spots.favorites_count を NOT NULL に変更
-- ===============================
-- カウント系カラムは NULL になる理由がない

UPDATE master_spots SET favorites_count = 0 WHERE favorites_count IS NULL;
ALTER TABLE master_spots ALTER COLUMN favorites_count SET NOT NULL;
