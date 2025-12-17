-- ===============================
-- カテゴリテーブル作成
-- ===============================

-- 1. カテゴリテーブルを作成
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, -- デフォルト言語（日本語）
  name_translations JSONB, -- 他言語: {"en": "Gourmet", "zh": "美食", "ko": "맛집"}
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- カテゴリテーブルのRLSを有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "categories_select_policy" ON categories
  FOR SELECT USING (true);

-- カテゴリテーブルのトリガー
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories (display_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories (is_active);

-- 2. カテゴリデータを挿入
INSERT INTO categories (id, slug, name, name_translations, icon, display_order) VALUES
  ('gourmet', 'gourmet', 'グルメ', '{"en": "Gourmet"}', 'restaurant', 1),
  ('shopping', 'shopping', 'ショッピング', '{"en": "Shopping"}', 'cart', 2),
  ('tourism', 'tourism', '観光', '{"en": "Tourism"}', 'camera', 3),
  ('culture', 'culture', '文化/歴史', '{"en": "Culture / History"}', 'library', 4),
  ('entertainment', 'entertainment', 'エンタメ/娯楽', '{"en": "Entertainment"}', 'film', 5),
  ('activity', 'activity', 'アクティビティ/体験', '{"en": "Activity / Experience"}', 'bicycle', 6),
  ('lifestyle', 'lifestyle', '地域/暮らし', '{"en": "Lifestyle / Local"}', 'home', 7),
  ('learning', 'learning', '学習/教育', '{"en": "Learning / Education"}', 'school', 8),
  ('other', 'other', 'その他', '{"en": "Other"}', 'ellipsis-horizontal', 9)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  name_translations = EXCLUDED.name_translations,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
