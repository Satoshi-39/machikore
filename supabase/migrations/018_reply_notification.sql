-- ============================================================
-- 返信通知機能の追加
-- reply_to_user_idで指定されたユーザーにも通知を送る
-- ============================================================

-- ============================================================
-- 1. notifications テーブルのCHECK制約を更新（reply_spot / reply_map を許可）
-- ============================================================

ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS valid_notification_type;

ALTER TABLE public.notifications
  ADD CONSTRAINT valid_notification_type CHECK (
    type = ANY (ARRAY['like_spot'::text, 'like_map'::text, 'comment_spot'::text, 'comment_map'::text, 'reply_spot'::text, 'reply_map'::text, 'follow'::text, 'system'::text])
  );

ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_id_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_id_check CHECK (
    ((type = ANY (ARRAY['like_spot'::text, 'comment_spot'::text, 'reply_spot'::text])) AND (user_spot_id IS NOT NULL))
    OR ((type = ANY (ARRAY['like_map'::text, 'comment_map'::text, 'reply_map'::text])) AND (map_id IS NOT NULL))
    OR ((type = 'follow'::text) AND (actor_id IS NOT NULL))
    OR (type = 'system'::text)
  );

-- ============================================================
-- 2. 返信通知トリガー関数を作成
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_reply_notification()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  content_owner_id UUID;
BEGIN
  IF NEW.reply_to_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.reply_to_user_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  IF NEW.map_id IS NOT NULL THEN
    SELECT user_id INTO content_owner_id FROM public.maps WHERE id = NEW.map_id;
  ELSIF NEW.user_spot_id IS NOT NULL THEN
    SELECT user_id INTO content_owner_id FROM public.user_spots WHERE id = NEW.user_spot_id;
  END IF;

  IF NEW.reply_to_user_id = content_owner_id THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = NEW.reply_to_user_id AND blocked_id = NEW.user_id)
       OR (blocker_id = NEW.user_id AND blocked_id = NEW.reply_to_user_id)
  ) THEN
    RETURN NEW;
  END IF;

  IF NEW.map_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, actor_id, type, map_id, comment_id)
    VALUES (NEW.reply_to_user_id, NEW.user_id, 'reply_map', NEW.map_id, NEW.id);
  ELSIF NEW.user_spot_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, actor_id, type, user_spot_id, comment_id)
    VALUES (NEW.reply_to_user_id, NEW.user_id, 'reply_spot', NEW.user_spot_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. トリガーを作成
-- ============================================================

DROP TRIGGER IF EXISTS on_comment_create_reply_notification ON public.comments;
CREATE TRIGGER on_comment_create_reply_notification
  AFTER INSERT ON public.comments
  FOR EACH ROW
  WHEN (NEW.reply_to_user_id IS NOT NULL)
  EXECUTE FUNCTION public.create_reply_notification();
