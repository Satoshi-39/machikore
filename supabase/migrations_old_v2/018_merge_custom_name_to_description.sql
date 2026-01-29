-- user_spotsテーブルのcustom_nameをdescriptionに統合
-- custom_nameのデータをdescriptionに移行し、custom_nameカラムを削除
-- descriptionを必須項目（NOT NULL）に変更

-- 1. custom_nameのデータをdescriptionにコピー（descriptionを上書き）
UPDATE user_spots
SET description = custom_name
WHERE custom_name IS NOT NULL;

-- 2. descriptionがNULLの行に対してデフォルト値を設定（既存データ対応）
UPDATE user_spots
SET description = ''
WHERE description IS NULL;

-- 3. descriptionをNOT NULLに変更
ALTER TABLE user_spots
ALTER COLUMN description SET NOT NULL;

-- 4. custom_nameカラムを削除
ALTER TABLE user_spots
DROP COLUMN custom_name;

-- 5. コメント追加
COMMENT ON COLUMN user_spots.description IS 'スポットの説明（一言キャッチコピー）';
