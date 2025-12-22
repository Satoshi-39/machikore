-- ===============================
-- 既存のタグデータをtagsテーブルと中間テーブルに移行
-- maps.tags = JSONB, user_spots.tags = TEXT[]
-- ===============================

-- 1. maps.tagsからの移行（JSONB）
DO $$
DECLARE
  map_record RECORD;
  tag_name TEXT;
  tag_uuid UUID;
BEGIN
  -- 既存のmapsテーブルからtagsを持つレコードを取得
  FOR map_record IN SELECT id, tags FROM maps WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0 LOOP
    -- 各タグをループ
    FOR tag_name IN SELECT jsonb_array_elements_text(map_record.tags) LOOP
      -- 空文字列をスキップ
      IF tag_name IS NOT NULL AND tag_name != '' THEN
        -- タグが存在しなければ作成
        INSERT INTO tags (name, slug)
        VALUES (tag_name, lower(replace(tag_name, ' ', '-')))
        ON CONFLICT (name) DO NOTHING;

        -- タグIDを取得
        SELECT id INTO tag_uuid FROM tags WHERE name = tag_name;

        -- map_tagsに挿入
        INSERT INTO map_tags (map_id, tag_id)
        VALUES (map_record.id, tag_uuid)
        ON CONFLICT (map_id, tag_id) DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Maps tags migration completed';
END $$;

-- 2. user_spots.tagsからの移行（TEXT[]配列）
DO $$
DECLARE
  spot_record RECORD;
  tag_name TEXT;
  tag_uuid UUID;
BEGIN
  -- 既存のuser_spotsテーブルからtagsを持つレコードを取得
  FOR spot_record IN SELECT id, tags FROM user_spots WHERE tags IS NOT NULL AND array_length(tags, 1) > 0 LOOP
    -- 各タグをループ（UNNESTでTEXT[]を展開）
    FOREACH tag_name IN ARRAY spot_record.tags LOOP
      -- 空文字列をスキップ
      IF tag_name IS NOT NULL AND tag_name != '' THEN
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
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Spots tags migration completed';
END $$;

-- 3. usage_countを正しく再計算
UPDATE tags t
SET usage_count = (
  SELECT COUNT(*) FROM map_tags WHERE tag_id = t.id
) + (
  SELECT COUNT(*) FROM spot_tags WHERE tag_id = t.id
);

-- 移行完了後のコメント
-- 注意: 移行後、maps.tags と user_spots.tags カラムは非推奨となります
-- 将来的に削除予定ですが、フロントエンドの移行が完了するまで保持します
COMMENT ON COLUMN maps.tags IS '非推奨: map_tagsテーブルを使用してください。将来的に削除予定';
COMMENT ON COLUMN user_spots.tags IS '非推奨: spot_tagsテーブルを使用してください。将来的に削除予定';
