-- ===============================
-- users.display_name を NOT NULL に変更
-- ===============================
-- プロフィールに名前が表示されないのはUXとして問題
-- display_name が NULL の場合は username で埋める

UPDATE users SET display_name = username WHERE display_name IS NULL;
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
