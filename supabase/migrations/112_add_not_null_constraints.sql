-- NOT NULL制約とデフォルト値を追加
-- 既存のNULL値をデフォルト値に更新してからNOT NULL制約を追加

-- ===============================
-- maps テーブル
-- ===============================

-- is_public: 既存のNULL値をFALSEに更新
UPDATE maps SET is_public = FALSE WHERE is_public IS NULL;
-- デフォルト値を設定（既に設定されている場合は上書き）
ALTER TABLE maps ALTER COLUMN is_public SET DEFAULT FALSE;
-- NOT NULL制約を追加
ALTER TABLE maps ALTER COLUMN is_public SET NOT NULL;

-- is_default: 既存のNULL値をFALSEに更新
UPDATE maps SET is_default = FALSE WHERE is_default IS NULL;
ALTER TABLE maps ALTER COLUMN is_default SET DEFAULT FALSE;
ALTER TABLE maps ALTER COLUMN is_default SET NOT NULL;

-- is_official: 既存のNULL値をFALSEに更新
UPDATE maps SET is_official = FALSE WHERE is_official IS NULL;
ALTER TABLE maps ALTER COLUMN is_official SET DEFAULT FALSE;
ALTER TABLE maps ALTER COLUMN is_official SET NOT NULL;

-- is_article_public: 既存のNULL値をFALSEに更新
UPDATE maps SET is_article_public = FALSE WHERE is_article_public IS NULL;
ALTER TABLE maps ALTER COLUMN is_article_public SET DEFAULT FALSE;
ALTER TABLE maps ALTER COLUMN is_article_public SET NOT NULL;

-- spots_count: 既存のNULL値を0に更新
UPDATE maps SET spots_count = 0 WHERE spots_count IS NULL;
ALTER TABLE maps ALTER COLUMN spots_count SET DEFAULT 0;
ALTER TABLE maps ALTER COLUMN spots_count SET NOT NULL;

-- likes_count: 既存のNULL値を0に更新
UPDATE maps SET likes_count = 0 WHERE likes_count IS NULL;
ALTER TABLE maps ALTER COLUMN likes_count SET DEFAULT 0;
ALTER TABLE maps ALTER COLUMN likes_count SET NOT NULL;

-- comments_count: 既存のNULL値を0に更新
UPDATE maps SET comments_count = 0 WHERE comments_count IS NULL;
ALTER TABLE maps ALTER COLUMN comments_count SET DEFAULT 0;
ALTER TABLE maps ALTER COLUMN comments_count SET NOT NULL;

-- bookmarks_count: 既存のNULL値を0に更新
UPDATE maps SET bookmarks_count = 0 WHERE bookmarks_count IS NULL;
ALTER TABLE maps ALTER COLUMN bookmarks_count SET DEFAULT 0;
ALTER TABLE maps ALTER COLUMN bookmarks_count SET NOT NULL;

-- ===============================
-- collections テーブル
-- ===============================

-- is_public: 既存のNULL値をFALSEに更新
UPDATE collections SET is_public = FALSE WHERE is_public IS NULL;
ALTER TABLE collections ALTER COLUMN is_public SET DEFAULT FALSE;
ALTER TABLE collections ALTER COLUMN is_public SET NOT NULL;

-- maps_count: 既存のNULL値を0に更新
UPDATE collections SET maps_count = 0 WHERE maps_count IS NULL;
ALTER TABLE collections ALTER COLUMN maps_count SET DEFAULT 0;
ALTER TABLE collections ALTER COLUMN maps_count SET NOT NULL;

-- ===============================
-- コメント追加
-- ===============================

COMMENT ON COLUMN maps.is_public IS 'マップが公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN maps.is_default IS 'デフォルトマップかどうか（デフォルト: false）';
COMMENT ON COLUMN maps.is_official IS '公式マップかどうか（デフォルト: false）';
COMMENT ON COLUMN maps.is_article_public IS '記事が公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN maps.spots_count IS 'スポット数（デフォルト: 0）';
COMMENT ON COLUMN maps.likes_count IS 'いいね数（デフォルト: 0）';
COMMENT ON COLUMN maps.comments_count IS 'コメント数（デフォルト: 0）';
COMMENT ON COLUMN maps.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';

COMMENT ON COLUMN collections.is_public IS 'コレクションが公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN collections.maps_count IS 'マップ数（デフォルト: 0）';

-- ===============================
-- user_spots テーブル
-- ===============================

-- likes_count: 既存のNULL値を0に更新
UPDATE user_spots SET likes_count = 0 WHERE likes_count IS NULL;
ALTER TABLE user_spots ALTER COLUMN likes_count SET DEFAULT 0;
ALTER TABLE user_spots ALTER COLUMN likes_count SET NOT NULL;

-- comments_count: 既存のNULL値を0に更新
UPDATE user_spots SET comments_count = 0 WHERE comments_count IS NULL;
ALTER TABLE user_spots ALTER COLUMN comments_count SET DEFAULT 0;
ALTER TABLE user_spots ALTER COLUMN comments_count SET NOT NULL;

-- bookmarks_count: 既存のNULL値を0に更新
UPDATE user_spots SET bookmarks_count = 0 WHERE bookmarks_count IS NULL;
ALTER TABLE user_spots ALTER COLUMN bookmarks_count SET DEFAULT 0;
ALTER TABLE user_spots ALTER COLUMN bookmarks_count SET NOT NULL;

-- images_count: 既存のNULL値を0に更新
UPDATE user_spots SET images_count = 0 WHERE images_count IS NULL;
ALTER TABLE user_spots ALTER COLUMN images_count SET DEFAULT 0;
ALTER TABLE user_spots ALTER COLUMN images_count SET NOT NULL;

-- order_index: 既存のNULL値を0に更新
UPDATE user_spots SET order_index = 0 WHERE order_index IS NULL;
ALTER TABLE user_spots ALTER COLUMN order_index SET DEFAULT 0;
ALTER TABLE user_spots ALTER COLUMN order_index SET NOT NULL;

COMMENT ON COLUMN user_spots.likes_count IS 'いいね数（デフォルト: 0）';
COMMENT ON COLUMN user_spots.comments_count IS 'コメント数（デフォルト: 0）';
COMMENT ON COLUMN user_spots.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';
COMMENT ON COLUMN user_spots.images_count IS '画像数（デフォルト: 0）';
COMMENT ON COLUMN user_spots.order_index IS '表示順序（デフォルト: 0）';
