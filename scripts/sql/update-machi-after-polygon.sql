-- machiのidとcity_nameを更新
-- admin_boundariesポリゴン登録後に実行

-- ============================================================
-- Step 1: city_idを更新（ST_Containsでポリゴン内判定）
-- ============================================================
UPDATE machi m
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE m.city_id IS NULL
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(m.longitude, m.latitude), 4326));

-- ============================================================
-- Step 2: idを更新（unknown形式から正式形式へ）
-- ============================================================

-- 2-1. 衝突しないものを更新
UPDATE machi m
SET id = m.city_id || '_' || substring(m.id from '_unknown_(.+)')
WHERE m.id LIKE '%_unknown_%'
  AND m.city_id IS NOT NULL
  AND length(substring(m.id from '_unknown_(.+)')) > 0
  AND NOT EXISTS (
    SELECT 1 FROM machi m2
    WHERE m2.id = m.city_id || '_' || substring(m.id from '_unknown_(.+)')
      AND m2.id <> m.id
  );

-- 2-2. 衝突するものは _2 サフィックスを付けて更新
UPDATE machi m
SET id = m.city_id || '_' || substring(m.id from '_unknown_(.+)') || '_2'
WHERE m.id LIKE '%_unknown_%'
  AND m.city_id IS NOT NULL
  AND length(substring(m.id from '_unknown_(.+)')) > 0;

-- ============================================================
-- Step 3: city_nameを更新（citiesテーブルから取得）
-- ============================================================
UPDATE machi m
SET city_name = c.name
FROM cities c
WHERE m.city_id = c.id
  AND m.city_name IS NULL;
