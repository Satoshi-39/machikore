-- ===============================
-- タグテーブル作成
-- ===============================

-- 1. タグテーブルを作成
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- デフォルト言語（日本語）
  name_translations JSONB, -- 他言語: {"en": "Ramen", "zh": "拉面", "ko": "라멘"}
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0, -- このタグが使われているマップ数
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- タグテーブルのRLSを有効化
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "tags_select_policy" ON tags
  FOR SELECT USING (true);

-- 認証済みユーザーはタグを作成可能
CREATE POLICY "tags_insert_policy" ON tags
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- タグテーブルのトリガー
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags (name);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags (usage_count DESC);

-- 2. マップとタグの中間テーブルを作成
CREATE TABLE IF NOT EXISTS map_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(map_id, tag_id)
);

-- map_tagsテーブルのRLSを有効化
ALTER TABLE map_tags ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "map_tags_select_policy" ON map_tags
  FOR SELECT USING (true);

-- マップの所有者のみタグを追加/削除可能
CREATE POLICY "map_tags_insert_policy" ON map_tags
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maps WHERE maps.id = map_id AND maps.user_id = auth.uid()
    )
  );

CREATE POLICY "map_tags_delete_policy" ON map_tags
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps WHERE maps.id = map_id AND maps.user_id = auth.uid()
    )
  );

-- インデックス
CREATE INDEX IF NOT EXISTS idx_map_tags_map_id ON map_tags (map_id);
CREATE INDEX IF NOT EXISTS idx_map_tags_tag_id ON map_tags (tag_id);

-- 3. タグ使用数を更新するトリガー関数
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
CREATE TRIGGER update_tag_usage_count_trigger
  AFTER INSERT OR DELETE ON map_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- 4. 既存のmaps.tagsからデータを移行する関数
-- 注意: この関数は一度だけ手動で実行する想定
CREATE OR REPLACE FUNCTION migrate_maps_tags_to_table()
RETURNS void AS $$
DECLARE
  map_record RECORD;
  tag_name TEXT;
  tag_id UUID;
BEGIN
  -- 既存のmapsテーブルからtagsを持つレコードを取得
  FOR map_record IN SELECT id, tags FROM maps WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0 LOOP
    -- 各タグをループ
    FOR tag_name IN SELECT jsonb_array_elements_text(map_record.tags) LOOP
      -- タグが存在しなければ作成
      INSERT INTO tags (name, slug)
      VALUES (tag_name, lower(replace(tag_name, ' ', '-')))
      ON CONFLICT (name) DO NOTHING;

      -- タグIDを取得
      SELECT id INTO tag_id FROM tags WHERE name = tag_name;

      -- map_tagsに挿入
      INSERT INTO map_tags (map_id, tag_id)
      VALUES (map_record.id, tag_id)
      ON CONFLICT (map_id, tag_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 移行を実行（コメントアウト - 必要に応じて手動実行）
-- SELECT migrate_maps_tags_to_table();
