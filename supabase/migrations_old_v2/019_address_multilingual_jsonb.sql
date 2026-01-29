-- master_spotsとuser_spotsの住所カラムをJSONB形式に変更
-- 多言語対応: {"ja": "日本語住所", "en": "English address", "zh": "中文地址"}
-- 既存データは "ja" キーとして移行（現状日本語のみのため）

-- ============================================
-- 1. master_spots テーブルの変更
-- ============================================

-- 1-1. 既存データをJSONB形式に変換（一時カラム使用）
ALTER TABLE master_spots
ADD COLUMN google_formatted_address_new jsonb;

ALTER TABLE master_spots
ADD COLUMN google_short_address_new jsonb;

-- 1-2. 既存データを移行（日本語として）
UPDATE master_spots
SET google_formatted_address_new =
  CASE
    WHEN google_formatted_address IS NOT NULL
    THEN jsonb_build_object('ja', google_formatted_address)
    ELSE NULL
  END;

UPDATE master_spots
SET google_short_address_new =
  CASE
    WHEN google_short_address IS NOT NULL
    THEN jsonb_build_object('ja', google_short_address)
    ELSE NULL
  END;

-- 1-3. 旧カラムを削除して新カラムをリネーム
ALTER TABLE master_spots DROP COLUMN google_formatted_address;
ALTER TABLE master_spots DROP COLUMN google_short_address;

ALTER TABLE master_spots RENAME COLUMN google_formatted_address_new TO google_formatted_address;
ALTER TABLE master_spots RENAME COLUMN google_short_address_new TO google_short_address;

-- 1-4. コメント追加
COMMENT ON COLUMN master_spots.google_formatted_address IS '多言語住所（完全形式）: {"ja": "日本語", "en": "English"}';
COMMENT ON COLUMN master_spots.google_short_address IS '多言語住所（短縮形式）: {"ja": "日本語", "en": "English"}';

-- ============================================
-- 2. user_spots テーブルの変更
-- ============================================

-- 2-1. 既存データをJSONB形式に変換（一時カラム使用）
ALTER TABLE user_spots
ADD COLUMN google_formatted_address_new jsonb;

ALTER TABLE user_spots
ADD COLUMN google_short_address_new jsonb;

-- 2-2. 既存データを移行（日本語として）
UPDATE user_spots
SET google_formatted_address_new =
  CASE
    WHEN google_formatted_address IS NOT NULL
    THEN jsonb_build_object('ja', google_formatted_address)
    ELSE NULL
  END;

UPDATE user_spots
SET google_short_address_new =
  CASE
    WHEN google_short_address IS NOT NULL
    THEN jsonb_build_object('ja', google_short_address)
    ELSE NULL
  END;

-- 2-3. 旧カラムを削除して新カラムをリネーム
ALTER TABLE user_spots DROP COLUMN google_formatted_address;
ALTER TABLE user_spots DROP COLUMN google_short_address;

ALTER TABLE user_spots RENAME COLUMN google_formatted_address_new TO google_formatted_address;
ALTER TABLE user_spots RENAME COLUMN google_short_address_new TO google_short_address;

-- 2-4. コメント追加
COMMENT ON COLUMN user_spots.google_formatted_address IS '多言語住所（完全形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';
COMMENT ON COLUMN user_spots.google_short_address IS '多言語住所（短縮形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';
