-- ===============================
-- 古いtagsカラムを削除
-- maps.tags (JSONB) と user_spots.tags (TEXT[])
-- ===============================

-- 注意: このマイグレーションを実行する前に、以下を確認してください：
-- 1. マイグレーション101が実行され、データが中間テーブルに移行されている
-- 2. フロントエンドが中間テーブル（map_tags, spot_tags）から読み書きするように更新されている

-- 1. maps.tagsカラムを削除
ALTER TABLE maps DROP COLUMN IF EXISTS tags;

-- 2. user_spots.tagsカラムを削除
ALTER TABLE user_spots DROP COLUMN IF EXISTS tags;
