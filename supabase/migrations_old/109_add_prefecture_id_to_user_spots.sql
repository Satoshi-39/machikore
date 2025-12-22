-- user_spotsテーブルにprefecture_idカラムを追加
-- 都道府県別スポット検索を高速化するため

-- prefecture_idカラムを追加（nullable、外部キー付き）
ALTER TABLE user_spots
ADD COLUMN prefecture_id TEXT REFERENCES prefectures(id) ON DELETE SET NULL;

-- 検索用インデックスを作成
CREATE INDEX idx_user_spots_prefecture_id ON user_spots(prefecture_id);

-- カテゴリ+都道府県の複合検索用インデックス
-- maps.category_idと組み合わせて使用するため、map_idも含める
CREATE INDEX idx_user_spots_prefecture_map ON user_spots(prefecture_id, map_id);

COMMENT ON COLUMN user_spots.prefecture_id IS '都道府県ID（prefectures.id）。都道府県別検索の高速化のため非正規化';
