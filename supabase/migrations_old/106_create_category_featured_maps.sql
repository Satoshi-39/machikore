-- カテゴリ別おすすめマップテーブル
-- 運営がカテゴリごとに選定したマップをカルーセル表示するため

CREATE TABLE category_featured_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 同じカテゴリに同じマップは一度だけ
  UNIQUE(category_id, map_id)
);

-- インデックス
CREATE INDEX idx_category_featured_maps_category ON category_featured_maps(category_id);
CREATE INDEX idx_category_featured_maps_active ON category_featured_maps(is_active) WHERE is_active = true;

-- RLS有効化
ALTER TABLE category_featured_maps ENABLE ROW LEVEL SECURITY;

-- 全員が閲覧可能（アクティブなもののみ）
CREATE POLICY "category_featured_maps_select_policy" ON category_featured_maps
  FOR SELECT
  USING (is_active = true);

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_category_featured_maps_updated_at
  BEFORE UPDATE ON category_featured_maps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- コメント
COMMENT ON TABLE category_featured_maps IS 'カテゴリ別おすすめマップ（運営選定）';
COMMENT ON COLUMN category_featured_maps.category_id IS 'カテゴリID';
COMMENT ON COLUMN category_featured_maps.map_id IS 'マップID';
COMMENT ON COLUMN category_featured_maps.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN category_featured_maps.is_active IS '有効フラグ';
