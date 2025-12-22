-- マップ記事機能
-- user_spotsにarticle_contentカラムを追加
-- マップの説明(maps.description)と各スポットの紹介文でブログ形式の記事を構成

-- article_content: スポットの記事用紹介文（長文可）
ALTER TABLE user_spots
ADD COLUMN IF NOT EXISTS article_content TEXT;

-- コメント追加
COMMENT ON COLUMN user_spots.article_content IS 'マップ記事用のスポット紹介文';
