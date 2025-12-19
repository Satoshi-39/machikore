-- article_contentをTEXTからJSONBに変更
-- ProseMirror/TipTap形式のJSONを保存するため

-- 既存のHTMLデータがある場合は手動で変換が必要
-- 現時点では既存データは空またはプレーンテキストのみを想定

-- カラムの型を変更
ALTER TABLE user_spots
ALTER COLUMN article_content TYPE JSONB USING
  CASE
    WHEN article_content IS NULL THEN NULL
    WHEN article_content = '' THEN NULL
    ELSE jsonb_build_object(
      'type', 'doc',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'content', jsonb_build_array(
            jsonb_build_object('type', 'text', 'text', article_content)
          )
        )
      )
    )
  END;

-- コメント更新
COMMENT ON COLUMN user_spots.article_content IS 'マップ記事用のスポット紹介文（ProseMirror JSON形式）';
