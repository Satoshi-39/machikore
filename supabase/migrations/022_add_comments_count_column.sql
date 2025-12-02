-- mapsテーブルにcomments_countカラムを追加
ALTER TABLE maps
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- user_spotsテーブルにもcomments_countカラムがなければ追加
ALTER TABLE user_spots
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
