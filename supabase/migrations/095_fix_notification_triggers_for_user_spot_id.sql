-- =============================================
-- 通知トリガー関数を修正（spot_id → user_spot_id）
-- =============================================

-- スポットいいね時の通知トリガー関数を再作成
CREATE OR REPLACE FUNCTION create_like_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

  -- 自分へのいいねは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, user_spot_id)
    VALUES (spot_owner_id, NEW.user_id, 'like_spot', NEW.user_spot_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットコメント時の通知トリガー関数を再作成
CREATE OR REPLACE FUNCTION create_comment_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

  -- 自分へのコメントは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, user_spot_id, comment_id)
    VALUES (spot_owner_id, NEW.user_id, 'comment_spot', NEW.user_spot_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを再作成（名前とWHEN条件をuser_spot_idに変更）
DROP TRIGGER IF EXISTS on_spot_like_create_notification ON likes;
DROP TRIGGER IF EXISTS on_user_spot_like_create_notification ON likes;
CREATE TRIGGER on_user_spot_like_create_notification
  AFTER INSERT ON likes
  FOR EACH ROW
  WHEN (NEW.user_spot_id IS NOT NULL)
  EXECUTE FUNCTION create_like_spot_notification();

DROP TRIGGER IF EXISTS on_spot_comment_create_notification ON comments;
DROP TRIGGER IF EXISTS on_user_spot_comment_create_notification ON comments;
CREATE TRIGGER on_user_spot_comment_create_notification
  AFTER INSERT ON comments
  FOR EACH ROW
  WHEN (NEW.user_spot_id IS NOT NULL)
  EXECUTE FUNCTION create_comment_spot_notification();
