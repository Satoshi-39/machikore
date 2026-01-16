-- =============================================
-- user_spots テーブルの正規化
--
-- machi テーブルとの JOIN で取得可能な非正規化カラムを削除
-- これらのデータは machi_id を使って machi テーブルから参照する
-- =============================================

-- 削除するカラム:
-- - prefecture_id: machi.prefecture_id で取得可能
-- - prefecture_name: machi.prefecture_name で取得可能
-- - city_id: machi.city_id で取得可能
-- - city_name: machi.city_name で取得可能
-- - machi_name: machi.name で取得可能

-- 注意: machi_id が NULL のスポット（ピン刺し・現在地登録など）は
-- machi テーブルから情報を取得できないが、これは許容する

ALTER TABLE public.user_spots
DROP COLUMN IF EXISTS prefecture_id,
DROP COLUMN IF EXISTS prefecture_name,
DROP COLUMN IF EXISTS city_id,
DROP COLUMN IF EXISTS city_name,
DROP COLUMN IF EXISTS machi_name;

-- インデックスの確認（machi_id にインデックスがあることを確認）
-- 既存のインデックスがなければ作成
CREATE INDEX IF NOT EXISTS idx_user_spots_machi_id ON public.user_spots(machi_id);

COMMENT ON COLUMN public.user_spots.machi_id IS '街ID。machi テーブルとの JOIN に使用。NULL の場合は街に紐づかないスポット（ピン刺し・現在地登録など）';
