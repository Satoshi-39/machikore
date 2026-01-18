-- ============================================================
-- 既存スポットの prefecture_id, city_id を座標から一括更新
-- ============================================================
-- admin_boundaries テーブルのポリゴンデータを使用して
-- 各スポットの座標がどの行政区域に含まれるかを判定

-- 既存スポットの prefecture_id, city_id を更新
UPDATE public.user_spots us
SET
  prefecture_id = ab.prefecture_id,
  city_id = ab.city_id
FROM (
  SELECT DISTINCT ON (us_inner.id)
    us_inner.id as spot_id,
    ab_inner.prefecture_id,
    ab_inner.city_id
  FROM public.user_spots us_inner
  CROSS JOIN LATERAL (
    SELECT
      ab2.prefecture_id,
      ab2.city_id
    FROM public.admin_boundaries ab2
    WHERE ST_Contains(ab2.geom, ST_SetSRID(ST_Point(us_inner.longitude, us_inner.latitude), 4326))
    ORDER BY ab2.admin_level DESC
    LIMIT 1
  ) ab_inner
  WHERE us_inner.prefecture_id IS NULL
) ab
WHERE us.id = ab.spot_id;

-- 更新結果を確認（コメントアウト - 必要に応じて実行）
-- SELECT
--   COUNT(*) as total,
--   COUNT(prefecture_id) as with_prefecture,
--   COUNT(city_id) as with_city
-- FROM public.user_spots;
