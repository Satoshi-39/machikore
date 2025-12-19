-- 既存のuser_spotsデータにprefecture_idを設定
-- machi_idがある場合はmachiテーブルからprefecture_idを取得

-- machi_idを持つスポットのprefecture_idを更新
UPDATE user_spots
SET prefecture_id = machi.prefecture_id
FROM machi
WHERE user_spots.machi_id = machi.id
  AND user_spots.prefecture_id IS NULL
  AND user_spots.machi_id IS NOT NULL;

-- 更新結果のログ出力（確認用）
DO $$
DECLARE
  updated_count INTEGER;
  remaining_null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count FROM user_spots WHERE prefecture_id IS NOT NULL;
  SELECT COUNT(*) INTO remaining_null_count FROM user_spots WHERE prefecture_id IS NULL;

  RAISE NOTICE 'Prefecture ID migration completed:';
  RAISE NOTICE '  - Spots with prefecture_id: %', updated_count;
  RAISE NOTICE '  - Spots without prefecture_id: %', remaining_null_count;
END $$;
