-- カテゴリ別おすすめタグテーブル（運営選定）
-- ハイブリッド方式: 運営選定タグ + 自動人気タグ

CREATE TABLE category_featured_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 同じカテゴリに同じタグは一度だけ
  UNIQUE(category_id, tag_id)
);

-- インデックス
CREATE INDEX idx_category_featured_tags_category ON category_featured_tags(category_id);
CREATE INDEX idx_category_featured_tags_active ON category_featured_tags(is_active) WHERE is_active = true;

-- RLS有効化
ALTER TABLE category_featured_tags ENABLE ROW LEVEL SECURITY;

-- 全員が閲覧可能（アクティブなもののみ）
CREATE POLICY "category_featured_tags_select_policy" ON category_featured_tags
  FOR SELECT
  USING (is_active = true);

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_category_featured_tags_updated_at
  BEFORE UPDATE ON category_featured_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- コメント
COMMENT ON TABLE category_featured_tags IS 'カテゴリ別おすすめタグ（運営選定）';
COMMENT ON COLUMN category_featured_tags.category_id IS 'カテゴリID';
COMMENT ON COLUMN category_featured_tags.tag_id IS 'タグID';
COMMENT ON COLUMN category_featured_tags.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN category_featured_tags.is_active IS '有効フラグ';
