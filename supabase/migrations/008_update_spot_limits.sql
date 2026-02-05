-- スポット上限を変更: 無料 30→5、プレミアム 100→10
DROP POLICY IF EXISTS user_spots_insert_own_with_limit ON public.user_spots;
CREATE POLICY user_spots_insert_own_with_limit ON public.user_spots FOR INSERT TO authenticated WITH CHECK (((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = (select auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text)))) AND ((public.is_user_premium((select auth.uid())) AND (public.count_user_spots_in_map((select auth.uid()), map_id) < 10)) OR ((NOT public.is_user_premium((select auth.uid()))) AND (public.count_user_spots_in_map((select auth.uid()), map_id) < 5)))));
