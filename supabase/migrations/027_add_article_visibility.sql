-- 記事に公開/非公開設定を追加
-- マップの公開設定とは独立して、記事の公開を制御

-- is_article_publicカラムを追加（デフォルトはfalse=非公開）
ALTER TABLE maps
ADD COLUMN IF NOT EXISTS is_article_public BOOLEAN DEFAULT FALSE;

-- 既存のマップで記事コンテンツがあるものは公開状態に（後方互換性）
UPDATE maps SET is_article_public = TRUE WHERE article_content IS NOT NULL AND is_article_public IS NULL;

-- インデックスを作成（公開記事検索の高速化）
CREATE INDEX IF NOT EXISTS idx_maps_is_article_public ON maps(is_article_public);

COMMENT ON COLUMN maps.is_article_public IS '記事の公開設定。trueで公開、falseで非公開。マップの公開設定とは独立';
