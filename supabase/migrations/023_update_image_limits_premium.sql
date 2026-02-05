-- 画像上限をプレミアム対応: 無料 4枚、プレミアム 10枚
DROP POLICY IF EXISTS images_insert_own_with_limit ON public.images;
CREATE POLICY images_insert_own_with_limit ON public.images
  FOR INSERT TO authenticated
  WITH CHECK (
    -- 自分のスポットの画像であること
    (EXISTS (
      SELECT 1 FROM public.user_spots us
      WHERE us.id = images.user_spot_id
        AND us.user_id = (SELECT auth.uid())
    ))
    AND (
      -- プレミアムユーザー: 10枚まで
      (public.is_user_premium((SELECT auth.uid())) AND public.count_images_in_spot(user_spot_id) < 10)
      OR
      -- 無料ユーザー: 4枚まで
      (NOT public.is_user_premium((SELECT auth.uid())) AND public.count_images_in_spot(user_spot_id) < 4)
    )
  );
