-- maps テーブルに total_view_count カラムを追加
-- 全ユーザーの合計閲覧数を即時インクリメントで管理

-- 1. カラム追加
ALTER TABLE public.maps
ADD COLUMN IF NOT EXISTS total_view_count integer DEFAULT 0 NOT NULL;

-- 2. 既存データのバックフィル（view_history から集計）
UPDATE public.maps
SET total_view_count = (
  SELECT COALESCE(SUM(view_count), 0)
  FROM public.view_history
  WHERE map_id = maps.id
);

-- 3. record_map_view RPC を更新（total_view_count のインクリメントを追加）
CREATE OR REPLACE FUNCTION public.record_map_view(p_map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  BEGIN
    -- 未認証ユーザーは拒否
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION 'Authentication required';
    END IF;

    -- 個人の閲覧履歴を記録（UPSERT）
    INSERT INTO public.view_history (user_id, map_id, viewed_at, view_count)
    VALUES (auth.uid(), p_map_id, now(), 1)
    ON CONFLICT (user_id, map_id)
    DO UPDATE SET
      viewed_at = now(),
      view_count = view_history.view_count + 1,
      updated_at = now();

    -- マップの総閲覧数をインクリメント
    UPDATE public.maps
    SET total_view_count = total_view_count + 1
    WHERE id = p_map_id;
  END;
  $$;
