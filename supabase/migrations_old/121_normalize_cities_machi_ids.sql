-- ===============================
-- cities.id と machi.id を {country_code}_{prefecture}_{name} 形式に統一
-- ===============================
-- cities: chiyoda → jp_tokyo_chiyoda, tokyo_meguro → jp_tokyo_meguro
-- machi: tokyo_unknown_kagurazaka → jp_tokyo_unknown_kagurazaka
-- ===============================

-- ===============================
-- 1. 外部キー制約を一時的に削除
-- ===============================
-- cities を参照する制約
ALTER TABLE machi DROP CONSTRAINT IF EXISTS machi_city_id_fkey;
ALTER TABLE transport_hubs DROP CONSTRAINT IF EXISTS transport_hubs_city_id_fkey;

-- machi を参照する制約
ALTER TABLE user_spots DROP CONSTRAINT IF EXISTS user_spots_machi_id_fkey;
ALTER TABLE master_spots DROP CONSTRAINT IF EXISTS master_spots_machi_id_fkey;
ALTER TABLE visits DROP CONSTRAINT IF EXISTS visits_machi_id_fkey;
ALTER TABLE spots DROP CONSTRAINT IF EXISTS spots_machi_id_fkey;
ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_machi_id_fkey;

-- ===============================
-- 2. cities.id の正規化
-- ===============================

-- 2a. 新しい形式 (tokyo_xxx) に jp_ プレフィックスを追加
-- machi.city_id を更新
UPDATE machi SET city_id = 'jp_' || city_id
WHERE city_id IS NOT NULL
  AND city_id LIKE '%_%'
  AND city_id NOT LIKE 'jp_%'
  AND city_id NOT LIKE 'kr_%'
  AND city_id NOT LIKE 'cn_%'
  AND city_id NOT LIKE 'th_%'
  AND city_id NOT LIKE 'tw_%';

-- transport_hubs.city_id を更新
UPDATE transport_hubs SET city_id = 'jp_' || city_id
WHERE city_id IS NOT NULL
  AND city_id LIKE '%_%'
  AND city_id NOT LIKE 'jp_%'
  AND city_id NOT LIKE 'kr_%'
  AND city_id NOT LIKE 'cn_%'
  AND city_id NOT LIKE 'th_%'
  AND city_id NOT LIKE 'tw_%';

-- cities.id を更新
UPDATE cities SET id = 'jp_' || id
WHERE id LIKE '%_%'
  AND id NOT LIKE 'jp_%'
  AND id NOT LIKE 'kr_%'
  AND id NOT LIKE 'cn_%'
  AND id NOT LIKE 'th_%'
  AND id NOT LIKE 'tw_%';

-- 2b. 古い形式 (prefecture_idなし: chiyoda, minato など) に jp_{prefecture}_ プレフィックスを追加
-- 日本のcitiesでアンダースコアを含まないものを、prefecture_idを使って正規化

-- まず、prefecture_id から jp_ プレフィックスを除去した値を使って新IDを構築
-- machi.city_id を更新
UPDATE machi m SET city_id = 'jp_' || REPLACE(c.prefecture_id, 'jp_', '') || '_' || m.city_id
FROM cities c
WHERE m.city_id = c.id
  AND m.city_id IS NOT NULL
  AND m.city_id NOT LIKE '%_%';

-- transport_hubs.city_id を更新
UPDATE transport_hubs t SET city_id = 'jp_' || REPLACE(c.prefecture_id, 'jp_', '') || '_' || t.city_id
FROM cities c
WHERE t.city_id = c.id
  AND t.city_id IS NOT NULL
  AND t.city_id NOT LIKE '%_%';

-- cities.id を更新（prefecture_idを使って）
UPDATE cities SET id = 'jp_' || REPLACE(prefecture_id, 'jp_', '') || '_' || id
WHERE id NOT LIKE '%_%';

-- ===============================
-- 3. machi.id の正規化
-- ===============================

-- 日本のmachiでjp_プレフィックスがないものに追加
UPDATE machi SET id = 'jp_' || id
WHERE id NOT LIKE 'jp_%'
  AND id NOT LIKE 'kr_%'
  AND id NOT LIKE 'cn_%'
  AND id NOT LIKE 'th_%'
  AND id NOT LIKE 'tw_%';

-- ===============================
-- 4. user_spots と master_spots の machi_id を更新
-- ===============================
-- user_spots.machi_id を更新
UPDATE user_spots SET machi_id = 'jp_' || machi_id
WHERE machi_id IS NOT NULL
  AND machi_id NOT LIKE 'jp_%'
  AND machi_id NOT LIKE 'kr_%'
  AND machi_id NOT LIKE 'cn_%'
  AND machi_id NOT LIKE 'th_%'
  AND machi_id NOT LIKE 'tw_%';

-- master_spots.machi_id を更新
UPDATE master_spots SET machi_id = 'jp_' || machi_id
WHERE machi_id IS NOT NULL
  AND machi_id NOT LIKE 'jp_%'
  AND machi_id NOT LIKE 'kr_%'
  AND machi_id NOT LIKE 'cn_%'
  AND machi_id NOT LIKE 'th_%'
  AND machi_id NOT LIKE 'tw_%';

-- visits.machi_id を更新
UPDATE visits SET machi_id = 'jp_' || machi_id
WHERE machi_id IS NOT NULL
  AND machi_id NOT LIKE 'jp_%'
  AND machi_id NOT LIKE 'kr_%'
  AND machi_id NOT LIKE 'cn_%'
  AND machi_id NOT LIKE 'th_%'
  AND machi_id NOT LIKE 'tw_%';

-- spots.machi_id を更新（存在する場合）
UPDATE spots SET machi_id = 'jp_' || machi_id
WHERE machi_id IS NOT NULL
  AND machi_id NOT LIKE 'jp_%'
  AND machi_id NOT LIKE 'kr_%'
  AND machi_id NOT LIKE 'cn_%'
  AND machi_id NOT LIKE 'th_%'
  AND machi_id NOT LIKE 'tw_%';

-- schedules.machi_id を更新（存在する場合）
UPDATE schedules SET machi_id = 'jp_' || machi_id
WHERE machi_id IS NOT NULL
  AND machi_id NOT LIKE 'jp_%'
  AND machi_id NOT LIKE 'kr_%'
  AND machi_id NOT LIKE 'cn_%'
  AND machi_id NOT LIKE 'th_%'
  AND machi_id NOT LIKE 'tw_%';

-- ===============================
-- 5. 外部キー制約を再作成
-- ===============================
-- cities を参照する制約
ALTER TABLE machi ADD CONSTRAINT machi_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities(id);

-- transport_hubs の制約は存在する場合のみ追加
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transport_hubs' AND column_name = 'city_id') THEN
    ALTER TABLE transport_hubs ADD CONSTRAINT transport_hubs_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities(id);
  END IF;
END $$;

-- machi を参照する制約
ALTER TABLE user_spots ADD CONSTRAINT user_spots_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES machi(id);
ALTER TABLE master_spots ADD CONSTRAINT master_spots_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES machi(id);
ALTER TABLE visits ADD CONSTRAINT visits_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES machi(id);

-- spots と schedules はテーブルとカラムが存在する場合のみ追加
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spots' AND column_name = 'machi_id') THEN
    ALTER TABLE spots ADD CONSTRAINT spots_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES machi(id);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schedules' AND column_name = 'machi_id') THEN
    ALTER TABLE schedules ADD CONSTRAINT schedules_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES machi(id);
  END IF;
END $$;
