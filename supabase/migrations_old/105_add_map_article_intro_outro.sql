-- mapsテーブルにまえがき・あとがきカラムを追加
-- ProseMirror/TipTap形式のJSONを保存

-- まえがき（記事の冒頭に表示）
ALTER TABLE maps
ADD COLUMN article_intro JSONB DEFAULT NULL;

-- あとがき（記事の末尾に表示）
ALTER TABLE maps
ADD COLUMN article_outro JSONB DEFAULT NULL;

-- コメント追加
COMMENT ON COLUMN maps.article_intro IS 'マップ記事のまえがき（ProseMirror JSON形式）';
COMMENT ON COLUMN maps.article_outro IS 'マップ記事のあとがき（ProseMirror JSON形式）';
