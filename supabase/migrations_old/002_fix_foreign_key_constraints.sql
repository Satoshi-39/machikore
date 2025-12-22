-- 外部キー制約を ON DELETE SET NULL に変更
-- machi が削除されても master_spots, user_spots のデータは保持される

-- ============================================================
-- 1. master_spots.machi_id の外部キー制約を変更
-- ============================================================
ALTER TABLE master_spots
DROP CONSTRAINT IF EXISTS master_spots_machi_id_fkey;

ALTER TABLE master_spots
ADD CONSTRAINT master_spots_machi_id_fkey
FOREIGN KEY (machi_id) REFERENCES machi(id) ON DELETE SET NULL;

-- ============================================================
-- 2. user_spots.machi_id の外部キー制約を変更
-- ============================================================
ALTER TABLE user_spots
DROP CONSTRAINT IF EXISTS user_spots_machi_id_fkey;

ALTER TABLE user_spots
ADD CONSTRAINT user_spots_machi_id_fkey
FOREIGN KEY (machi_id) REFERENCES machi(id) ON DELETE SET NULL;
