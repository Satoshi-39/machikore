-- ===============================
-- スポットとタグの中間テーブル作成
-- ===============================

-- 1. スポットとタグの中間テーブルを作成
CREATE TABLE IF NOT EXISTS spot_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_spot_id, tag_id)
);

-- spot_tagsテーブルのRLSを有効化
ALTER TABLE spot_tags ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "spot_tags_select_policy" ON spot_tags
  FOR SELECT USING (true);

-- スポットの所有者のみタグを追加/削除可能
CREATE POLICY "spot_tags_insert_policy" ON spot_tags
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_spots WHERE user_spots.id = user_spot_id AND user_spots.user_id = auth.uid()
    )
  );

CREATE POLICY "spot_tags_delete_policy" ON spot_tags
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_spots WHERE user_spots.id = user_spot_id AND user_spots.user_id = auth.uid()
    )
  );

-- インデックス
CREATE INDEX IF NOT EXISTS idx_spot_tags_user_spot_id ON spot_tags (user_spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_tags_tag_id ON spot_tags (tag_id);

-- 2. タグ使用数を更新するトリガー（スポット用）
CREATE OR REPLACE FUNCTION update_tag_usage_count_for_spots()
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
CREATE TRIGGER update_tag_usage_count_for_spots_trigger
  AFTER INSERT OR DELETE ON spot_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count_for_spots();

-- 3. 既存のuser_spots.tagsからデータを移行する関数
CREATE OR REPLACE FUNCTION migrate_spots_tags_to_table()
RETURNS void AS $$
DECLARE
  spot_record RECORD;
  tag_name TEXT;
  tag_uuid UUID;
BEGIN
  -- 既存のuser_spotsテーブルからtagsを持つレコードを取得
  FOR spot_record IN SELECT id, tags FROM user_spots WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0 LOOP
    -- 各タグをループ
    FOR tag_name IN SELECT jsonb_array_elements_text(spot_record.tags) LOOP
      -- タグが存在しなければ作成
      INSERT INTO tags (name, slug)
      VALUES (tag_name, lower(replace(tag_name, ' ', '-')))
      ON CONFLICT (name) DO NOTHING;

      -- タグIDを取得
      SELECT id INTO tag_uuid FROM tags WHERE name = tag_name;

      -- spot_tagsに挿入
      INSERT INTO spot_tags (user_spot_id, tag_id)
      VALUES (spot_record.id, tag_uuid)
      ON CONFLICT (user_spot_id, tag_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 移行を実行（コメントアウト - 必要に応じて手動実行）
-- SELECT migrate_spots_tags_to_table();
