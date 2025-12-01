-- =====================================================
-- 通知テーブル (notifications)
-- =====================================================
--
-- 通知タイプ (type):
--   - 'like_spot': スポットへのいいね
--   - 'like_map': マップへのいいね
--   - 'comment_spot': スポットへのコメント
--   - 'comment_map': マップへのコメント
--   - 'follow': フォロー
--   - 'system': システム通知（お知らせ）
-- =====================================================

-- 通知テーブル作成
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- 通知を受け取るユーザー
  actor_id UUID REFERENCES users(id) ON DELETE CASCADE,          -- 通知を起こしたユーザー（システム通知はNULL）
  type TEXT NOT NULL,                                            -- 通知タイプ
  spot_id UUID REFERENCES user_spots(id) ON DELETE CASCADE,      -- 関連スポット
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,             -- 関連マップ
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,     -- 関連コメント
  content TEXT,                                                  -- カスタムメッセージ（システム通知用）
  is_read BOOLEAN DEFAULT FALSE,                                 -- 既読フラグ
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 通知タイプの制約
  CONSTRAINT valid_notification_type CHECK (
    type IN ('like_spot', 'like_map', 'comment_spot', 'comment_map', 'follow', 'system')
  )
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON notifications(actor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS（Row Level Security）有効化
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 自分の通知のみ閲覧可能
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- システムまたはトリガーで通知を作成（直接INSERTは許可しない）
-- 通常はトリガーまたはサーバーサイド関数経由で作成
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- 自分の通知のみ既読に更新可能
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分の通知のみ削除可能
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- システム通知テーブル (system_announcements)
-- 全ユーザー向けのお知らせ
-- =====================================================

CREATE TABLE IF NOT EXISTS system_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info',  -- 'info', 'update', 'maintenance', 'promotion'
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_system_announcements_published ON system_announcements(is_active, published_at DESC);

-- RLS
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがアクティブなお知らせを閲覧可能
CREATE POLICY "Anyone can view active announcements"
  ON system_announcements FOR SELECT
  USING (
    is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- =====================================================
-- 通知作成用のトリガー関数
-- =====================================================

-- スポットいいね時の通知トリガー
CREATE OR REPLACE FUNCTION create_like_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.spot_id;

  -- 自分へのいいねは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, spot_id)
    VALUES (spot_owner_id, NEW.user_id, 'like_spot', NEW.spot_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップいいね時の通知トリガー
CREATE OR REPLACE FUNCTION create_like_map_notification()
RETURNS TRIGGER AS $$
DECLARE
  map_owner_id UUID;
BEGIN
  -- マップの所有者を取得
  SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

  -- 自分へのいいねは通知しない
  IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, map_id)
    VALUES (map_owner_id, NEW.user_id, 'like_map', NEW.map_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットコメント時の通知トリガー
CREATE OR REPLACE FUNCTION create_comment_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.spot_id;

  -- 自分へのコメントは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, spot_id, comment_id)
    VALUES (spot_owner_id, NEW.user_id, 'comment_spot', NEW.spot_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップコメント時の通知トリガー
CREATE OR REPLACE FUNCTION create_comment_map_notification()
RETURNS TRIGGER AS $$
DECLARE
  map_owner_id UUID;
BEGIN
  -- マップの所有者を取得
  SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

  -- 自分へのコメントは通知しない
  IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, map_id, comment_id)
    VALUES (map_owner_id, NEW.user_id, 'comment_map', NEW.map_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- フォロー時の通知トリガー
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.followee_id, NEW.follower_id, 'follow');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー作成
DROP TRIGGER IF EXISTS on_spot_like_create_notification ON likes;
CREATE TRIGGER on_spot_like_create_notification
  AFTER INSERT ON likes
  FOR EACH ROW
  WHEN (NEW.spot_id IS NOT NULL)
  EXECUTE FUNCTION create_like_spot_notification();

DROP TRIGGER IF EXISTS on_map_like_create_notification ON likes;
CREATE TRIGGER on_map_like_create_notification
  AFTER INSERT ON likes
  FOR EACH ROW
  WHEN (NEW.map_id IS NOT NULL)
  EXECUTE FUNCTION create_like_map_notification();

DROP TRIGGER IF EXISTS on_spot_comment_create_notification ON comments;
CREATE TRIGGER on_spot_comment_create_notification
  AFTER INSERT ON comments
  FOR EACH ROW
  WHEN (NEW.spot_id IS NOT NULL)
  EXECUTE FUNCTION create_comment_spot_notification();

DROP TRIGGER IF EXISTS on_map_comment_create_notification ON comments;
CREATE TRIGGER on_map_comment_create_notification
  AFTER INSERT ON comments
  FOR EACH ROW
  WHEN (NEW.map_id IS NOT NULL)
  EXECUTE FUNCTION create_comment_map_notification();

DROP TRIGGER IF EXISTS on_follow_create_notification ON follows;
CREATE TRIGGER on_follow_create_notification
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION create_follow_notification();
