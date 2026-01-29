-- スポットのサムネイル画像を指定するためのカラムを追加
-- NULLの場合は記事に挿入されていない画像のうちorder_indexが最小のものを使用

ALTER TABLE user_spots
ADD COLUMN thumbnail_image_id UUID REFERENCES images(id) ON DELETE SET NULL;

-- インデックスを追加（thumbnail_image_idでの検索を高速化）
CREATE INDEX idx_user_spots_thumbnail_image_id ON user_spots(thumbnail_image_id);

COMMENT ON COLUMN user_spots.thumbnail_image_id IS 'サムネイルとして表示する画像のID。NULLの場合は記事に挿入されていない画像のうちorder_indexが最小のものを使用';
