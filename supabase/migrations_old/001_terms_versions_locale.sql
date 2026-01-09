-- terms_versions テーブルに多言語対応のための locale カラムを追加
-- 各バージョンの規約を複数言語で登録できるようにする

-- locale カラムを追加（デフォルトは 'ja'）
ALTER TABLE terms_versions ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ja';

-- 既存のユニーク制約を削除（存在する場合）
ALTER TABLE terms_versions DROP CONSTRAINT IF EXISTS terms_versions_type_version_unique;
ALTER TABLE terms_versions DROP CONSTRAINT IF EXISTS terms_versions_type_version_key;
ALTER TABLE terms_versions DROP CONSTRAINT IF EXISTS terms_versions_type_version_locale_unique;

-- 新しい複合ユニーク制約を追加（type + version + locale）
ALTER TABLE terms_versions ADD CONSTRAINT terms_versions_type_version_locale_unique
  UNIQUE (type, version, locale);

-- locale カラムにコメントを追加
COMMENT ON COLUMN terms_versions.locale IS '言語コード（ja, en, cn, tw）';

-- インデックスを追加（言語での検索を高速化）
CREATE INDEX IF NOT EXISTS idx_terms_versions_locale ON terms_versions(locale);

-- 最新バージョンを言語別に取得するためのインデックス
CREATE INDEX IF NOT EXISTS idx_terms_versions_type_locale_effective
  ON terms_versions(type, locale, effective_at DESC);

-- ビューを再作成（locale カラムを含める）
DROP VIEW IF EXISTS current_terms_versions;

CREATE VIEW current_terms_versions AS
SELECT DISTINCT ON (type, locale)
  id,
  type,
  version,
  content,
  summary,
  effective_at,
  created_at,
  locale
FROM terms_versions
WHERE effective_at <= now()
ORDER BY type, locale, effective_at DESC;

COMMENT ON VIEW current_terms_versions IS '現在有効な利用規約・プライバシーポリシーの最新バージョン（言語別）';
