-- コメント数から返信を除外する修正マイグレーション
-- 既存のcomments_countはすべてのコメント（返信含む）をカウントしていたが、
-- トップレベルコメントのみをカウントするように修正

-- user_spotsのcomments_countを再計算（トップレベルのみ）
UPDATE user_spots
SET comments_count = (
  SELECT COUNT(*)
  FROM comments
  WHERE comments.spot_id = user_spots.id
    AND comments.parent_id IS NULL
);

-- mapsのcomments_countを再計算（トップレベルのみ）
UPDATE maps
SET comments_count = (
  SELECT COUNT(*)
  FROM comments
  WHERE comments.map_id = maps.id
    AND comments.parent_id IS NULL
);
