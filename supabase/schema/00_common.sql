-- ============================================================
-- 共通関数・拡張機能
-- ============================================================
-- 全テーブルで使用される共通の関数と拡張機能
-- 最終更新: 2025-12-23

-- ============================================================
-- 拡張機能
-- ============================================================

-- UUID生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS（地理空間データ）
CREATE EXTENSION IF NOT EXISTS postgis;

-- pg_net（HTTP リクエスト用、プッシュ通知に使用）
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- 共通トリガー関数
-- ============================================================

-- updated_at を現在時刻に更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- プッシュ通知送信関数
-- ============================================================
-- Supabase Edge Function経由でプッシュ通知を送信
-- この関数は notifications テーブルへの INSERT トリガーから呼び出される

CREATE OR REPLACE FUNCTION send_push_notification()
RETURNS TRIGGER AS $$
DECLARE
    push_token TEXT;
    notification_settings user_notification_settings%ROWTYPE;
    should_send BOOLEAN := true;
BEGIN
    -- ユーザーのプッシュトークンを取得
    SELECT u.push_token INTO push_token
    FROM users u
    WHERE u.id = NEW.user_id;

    -- トークンがなければ終了
    IF push_token IS NULL THEN
        RETURN NEW;
    END IF;

    -- 通知設定を取得
    SELECT * INTO notification_settings
    FROM user_notification_settings
    WHERE user_id = NEW.user_id;

    -- 通知種別に応じて設定をチェック
    IF notification_settings IS NOT NULL THEN
        CASE NEW.type
            WHEN 'like_spot', 'like_map' THEN
                should_send := notification_settings.likes_enabled;
            WHEN 'comment_spot', 'comment_map' THEN
                should_send := notification_settings.comments_enabled;
            WHEN 'follow' THEN
                should_send := notification_settings.follows_enabled;
            WHEN 'system' THEN
                should_send := notification_settings.system_enabled;
            ELSE
                should_send := true;
        END CASE;
    END IF;

    -- 通知が無効なら終了
    IF NOT should_send THEN
        RETURN NEW;
    END IF;

    -- Edge Functionにリクエストを送信（非同期）
    -- 注: 実際のURLは環境変数から取得する必要があります
    -- PERFORM net.http_post(
    --     url := 'https://your-project.supabase.co/functions/v1/send-push-notification',
    --     headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
    --     body := jsonb_build_object(
    --         'push_token', push_token,
    --         'notification_id', NEW.id,
    --         'type', NEW.type,
    --         'actor_id', NEW.actor_id
    --     )
    -- );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- マイグレーション用関数（一時的）
-- ============================================================

-- maps.tags を map_tags テーブルに移行
CREATE OR REPLACE FUNCTION migrate_maps_tags_to_table()
RETURNS INTEGER AS $$
DECLARE
    migrated INTEGER := 0;
BEGIN
    -- Implementation would go here
    RETURN migrated;
END;
$$ LANGUAGE plpgsql;

-- user_spots.tags を spot_tags テーブルに移行
CREATE OR REPLACE FUNCTION migrate_spots_tags_to_table()
RETURNS INTEGER AS $$
DECLARE
    migrated INTEGER := 0;
BEGIN
    -- Implementation would go here
    RETURN migrated;
END;
$$ LANGUAGE plpgsql;
