-- prevent_blocked_follow トリガー関数を SECURITY DEFINER に変更
-- 理由: SECURITY INVOKER だと user_blocks の RLS により、
-- ブロックされた側がブロッカーのレコードを参照できず、
-- ブロックチェックをすり抜けてフォローできてしまうバグがあった

CREATE OR REPLACE FUNCTION public.prevent_blocked_follow()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = NEW.follower_id AND blocked_id = NEW.followee_id)
       OR (blocker_id = NEW.followee_id AND blocked_id = NEW.follower_id)
  ) THEN
    RAISE EXCEPTION 'Cannot follow: block relationship exists'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
