-- Migration: user_spots と images の SELECT ポリシーにスポットの is_public チェックを追加
--
-- 公開マップ内でも is_public = false のスポットは非オーナーに見えないようにする
-- images も同様に、非公開スポットの画像は非オーナーに見えないようにする

BEGIN;

-- user_spots: 公開マップ & 公開スポット、または自分のマップ
DROP POLICY IF EXISTS user_spots_select_public_or_own ON public.user_spots;
CREATE POLICY user_spots_select_public_or_own ON public.user_spots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND (
    ((maps.is_public = true) AND (user_spots.is_public = true))
    OR (maps.user_id = (select auth.uid()))
  )))));

-- images: 公開マップ & 公開スポット、または自分のマップ
DROP POLICY IF EXISTS images_select_public_or_own ON public.images;
CREATE POLICY images_select_public_or_own ON public.images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.user_spots
     JOIN public.maps ON ((maps.id = user_spots.map_id)))
  WHERE ((user_spots.id = images.user_spot_id) AND (
    ((maps.is_public = true) AND (user_spots.is_public = true))
    OR (((select auth.uid()) IS NOT NULL) AND (maps.user_id = (select auth.uid())))
  )))));

COMMIT;
