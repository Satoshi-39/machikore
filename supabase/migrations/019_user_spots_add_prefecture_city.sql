-- ============================================================
-- user_spots に prefecture_id, city_id カラムを追加
-- ============================================================
-- machi_id経由ではなく直接都道府県・市区町村を参照できるようにする
-- これにより machi_id が NULL でもエリア検索が可能になる

-- カラム追加
ALTER TABLE public.user_spots
  ADD COLUMN prefecture_id text,
  ADD COLUMN city_id text;

-- 外部キー制約
ALTER TABLE public.user_spots
  ADD CONSTRAINT user_spots_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id) ON DELETE SET NULL;

ALTER TABLE public.user_spots
  ADD CONSTRAINT user_spots_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id) ON DELETE SET NULL;

-- インデックス作成（エリア検索用）
CREATE INDEX idx_user_spots_prefecture_id ON public.user_spots USING btree (prefecture_id);
CREATE INDEX idx_user_spots_city_id ON public.user_spots USING btree (city_id);

-- カラムコメント
COMMENT ON COLUMN public.user_spots.prefecture_id IS '都道府県ID。スポット作成時に座標から自動判定。エリア検索に使用';
COMMENT ON COLUMN public.user_spots.city_id IS '市区町村ID。スポット作成時に座標から自動判定。エリア検索に使用';
