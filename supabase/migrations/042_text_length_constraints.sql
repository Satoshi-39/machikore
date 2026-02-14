-- テキストカラムに文字数制限のCHECK制約を追加
-- クライアント側(INPUT_LIMITS)と同じ値をサーバー側でも強制する
--
-- 注意: 適用前に既存データが制限を超えていないか確認してください
-- SELECT id, char_length(name) FROM maps WHERE char_length(name) > 30;
-- SELECT id, char_length(description) FROM maps WHERE char_length(description) > 200;
-- SELECT id, char_length(display_name) FROM users WHERE char_length(display_name) > 30;
-- SELECT id, char_length(username) FROM users WHERE char_length(username) > 30;
-- SELECT id, char_length(bio) FROM users WHERE bio IS NOT NULL AND char_length(bio) > 200;
-- SELECT id, char_length(name) FROM user_spots WHERE name IS NOT NULL AND char_length(name) > 30;
-- SELECT id, char_length(description) FROM user_spots WHERE char_length(description) > 30;
-- SELECT id, char_length(name) FROM collections WHERE char_length(name) > 30;
-- SELECT id, char_length(description) FROM collections WHERE description IS NOT NULL AND char_length(description) > 200;
-- SELECT id, char_length(content) FROM comments WHERE char_length(content) > 500;

-- =============================================
-- users テーブル
-- =============================================
ALTER TABLE users ADD CONSTRAINT users_display_name_length
  CHECK (char_length(display_name) <= 30);

ALTER TABLE users ADD CONSTRAINT users_username_length
  CHECK (char_length(username) <= 30);

ALTER TABLE users ADD CONSTRAINT users_bio_length
  CHECK (bio IS NULL OR char_length(bio) <= 200);

ALTER TABLE users ADD CONSTRAINT users_suspended_reason_length
  CHECK (suspended_reason IS NULL OR char_length(suspended_reason) <= 500);

-- =============================================
-- maps テーブル
-- =============================================
ALTER TABLE maps ADD CONSTRAINT maps_name_length
  CHECK (char_length(name) <= 30);

ALTER TABLE maps ADD CONSTRAINT maps_description_length
  CHECK (description IS NULL OR char_length(description) <= 200);

-- =============================================
-- user_spots テーブル
-- name: スポット名（SPOT_NAME: 30）※020でjsonb→textに変更済み
-- description: ひとことキャッチコピー（SPOT_ONE_WORD: 30）
-- =============================================
ALTER TABLE user_spots ADD CONSTRAINT user_spots_name_length
  CHECK (name IS NULL OR char_length(name) <= 30);

ALTER TABLE user_spots ADD CONSTRAINT user_spots_description_length
  CHECK (char_length(description) <= 30);

-- =============================================
-- collections テーブル
-- =============================================
ALTER TABLE collections ADD CONSTRAINT collections_name_length
  CHECK (char_length(name) <= 30);

ALTER TABLE collections ADD CONSTRAINT collections_description_length
  CHECK (description IS NULL OR char_length(description) <= 200);

-- =============================================
-- comments テーブル
-- =============================================
ALTER TABLE comments ADD CONSTRAINT comments_content_length
  CHECK (char_length(content) <= 500);

-- =============================================
-- tags テーブル
-- =============================================
ALTER TABLE tags ADD CONSTRAINT tags_name_length
  CHECK (char_length(name) <= 30);

-- =============================================
-- reports テーブル
-- =============================================
ALTER TABLE reports ADD CONSTRAINT reports_description_length
  CHECK (description IS NULL OR char_length(description) <= 500);

-- =============================================
-- schedules テーブル
-- =============================================
ALTER TABLE schedules ADD CONSTRAINT schedules_title_length
  CHECK (char_length(title) <= 100);

ALTER TABLE schedules ADD CONSTRAINT schedules_memo_length
  CHECK (memo IS NULL OR char_length(memo) <= 500);
