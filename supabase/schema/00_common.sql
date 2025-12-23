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
-- 通知送信トリガー関数
-- ============================================================
-- notifications テーブルへの INSERT 時に Edge Function を呼び出す
-- Edge Function (send-notification) がプッシュ通知とメール通知を処理

CREATE OR REPLACE FUNCTION send_push_notification()
RETURNS TRIGGER AS $$
DECLARE
    supabase_url TEXT;
    service_role_key TEXT;
BEGIN
    -- 環境変数からSupabase URLとService Role Keyを取得
    supabase_url := current_setting('app.settings.supabase_url', true);
    service_role_key := current_setting('app.settings.service_role_key', true);

    -- Edge Functionを非同期で呼び出し
    PERFORM net.http_post(
        url := supabase_url || '/functions/v1/send-notification',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object(
            'notification_id', NEW.id,
            'user_id', NEW.user_id,
            'actor_id', NEW.actor_id,
            'type', NEW.type,
            'spot_id', NEW.spot_id,
            'map_id', NEW.map_id
        )
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーが発生しても通知の作成は続行
        RAISE WARNING 'Failed to send notification: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
