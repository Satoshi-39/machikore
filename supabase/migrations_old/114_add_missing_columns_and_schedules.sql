-- 不足しているカラムとテーブルを追加

-- ===============================
-- prefectures テーブル
-- ===============================

-- country_code カラムを追加
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'jp';

-- name_translations カラムを追加（JSON）
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS name_translations JSONB DEFAULT NULL;

COMMENT ON COLUMN prefectures.country_code IS '国コード（デフォルト: jp）';
COMMENT ON COLUMN prefectures.name_translations IS '多言語翻訳 {"en": "Tokyo", "zh": "东京"}';

-- ===============================
-- regions テーブル
-- ===============================

-- name_translations カラムを追加（JSON）
ALTER TABLE regions ADD COLUMN IF NOT EXISTS name_translations JSONB DEFAULT NULL;

COMMENT ON COLUMN regions.name_translations IS '多言語翻訳 {"en": "Kanto", "zh": "关东"}';

-- ===============================
-- countries テーブル
-- ===============================

-- continent_id カラムを追加
ALTER TABLE countries ADD COLUMN IF NOT EXISTS continent_id TEXT DEFAULT NULL;

-- 外部キー制約を追加
ALTER TABLE countries
  ADD CONSTRAINT countries_continent_id_fkey
  FOREIGN KEY (continent_id) REFERENCES continents(id) ON DELETE SET NULL;

COMMENT ON COLUMN countries.continent_id IS '大陸ID（外部キー → continents.id）';

-- 日本のcontinent_idを設定
UPDATE countries SET continent_id = 'east_asia' WHERE country_code = 'jp';

-- ===============================
-- schedules テーブル（新規作成）
-- ===============================

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machi_id TEXT NOT NULL REFERENCES machi(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  memo TEXT DEFAULT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_machi_id ON schedules(machi_id);
CREATE INDEX IF NOT EXISTS idx_schedules_scheduled_at ON schedules(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_schedules_user_scheduled ON schedules(user_id, scheduled_at);

-- コメント
COMMENT ON TABLE schedules IS 'ユーザーの予定（街への訪問予定など）';
COMMENT ON COLUMN schedules.id IS '予定ID';
COMMENT ON COLUMN schedules.user_id IS 'ユーザーID';
COMMENT ON COLUMN schedules.machi_id IS '街ID';
COMMENT ON COLUMN schedules.scheduled_at IS '予定日時';
COMMENT ON COLUMN schedules.title IS '予定タイトル';
COMMENT ON COLUMN schedules.memo IS 'メモ';
COMMENT ON COLUMN schedules.is_completed IS '完了済みかどうか';
COMMENT ON COLUMN schedules.completed_at IS '完了日時';

-- RLS有効化
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
CREATE POLICY "schedules_select_own" ON schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "schedules_insert_own" ON schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "schedules_update_own" ON schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "schedules_delete_own" ON schedules
  FOR DELETE USING (auth.uid() = user_id);
