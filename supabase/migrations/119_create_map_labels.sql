-- map_labels テーブルを作成し、user_spots.label を label_id に変更
-- マップごとにラベルを定義し、スポットに紐付ける

-- ===============================
-- 1. map_labels テーブル作成
-- ===============================

CREATE TABLE map_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 同じマップ内で同じ名前のラベルは作れない
  UNIQUE(map_id, name)
);

-- インデックス
CREATE INDEX idx_map_labels_map_id ON map_labels(map_id);

-- コメント
COMMENT ON TABLE map_labels IS 'マップごとのラベル定義（スポットの種類分け用）';
COMMENT ON COLUMN map_labels.name IS 'ラベル名（例: ドトール、スタバ）';
COMMENT ON COLUMN map_labels.color IS 'ラベルの色（pink, red, orange, yellow, green, blue, purple, gray, white）';
COMMENT ON COLUMN map_labels.sort_order IS '表示順';

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_map_labels_updated_at
  BEFORE UPDATE ON map_labels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- 2. RLS ポリシー
-- ===============================

ALTER TABLE map_labels ENABLE ROW LEVEL SECURITY;

-- マップが閲覧可能ならラベルも閲覧可能
CREATE POLICY "Map labels are viewable if map is viewable"
  ON map_labels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = map_labels.map_id
      AND (maps.is_public = true OR maps.user_id = auth.uid())
    )
  );

-- マップの所有者のみラベルを作成可能
CREATE POLICY "Users can create labels in their own maps"
  ON map_labels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = map_labels.map_id
      AND maps.user_id = auth.uid()
    )
  );

-- マップの所有者のみラベルを更新可能
CREATE POLICY "Users can update labels in their own maps"
  ON map_labels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = map_labels.map_id
      AND maps.user_id = auth.uid()
    )
  );

-- マップの所有者のみラベルを削除可能
CREATE POLICY "Users can delete labels in their own maps"
  ON map_labels FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = map_labels.map_id
      AND maps.user_id = auth.uid()
    )
  );

-- ===============================
-- 3. user_spots の label を label_id に変更
-- ===============================

-- 既存の label カラムを削除
ALTER TABLE user_spots DROP COLUMN IF EXISTS label;

-- label_id カラムを追加（外部キー）
ALTER TABLE user_spots
ADD COLUMN label_id UUID REFERENCES map_labels(id) ON DELETE SET NULL;

-- インデックス
CREATE INDEX idx_user_spots_label_id ON user_spots(label_id);

COMMENT ON COLUMN user_spots.label_id IS 'スポットのラベル（map_labelsへの外部キー）';
