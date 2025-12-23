-- ============================================================
-- 共通機能（拡張機能・ENUM型・共通関数）
-- ============================================================
-- 全テーブルで使用される共通の拡張機能、型、関数
-- 最終更新: 2025-12-23

-- ============================================================
-- 拡張機能（Extensions）
-- ============================================================

-- UUID生成（Supabaseで自動有効化済み）
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS（地理空間データ）
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- pg_net（HTTP リクエスト用、プッシュ通知に使用）
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- ENUM型定義
-- ============================================================

-- 報告理由
CREATE TYPE public.report_reason AS ENUM (
    'spam',
    'inappropriate',
    'harassment',
    'misinformation',
    'copyright',
    'other'
);

-- 報告ステータス
CREATE TYPE public.report_status AS ENUM (
    'pending',
    'reviewing',
    'resolved',
    'dismissed'
);

-- 報告対象タイプ
CREATE TYPE public.report_target_type AS ENUM (
    'map',
    'spot',
    'user',
    'comment'
);

-- ============================================================
-- 共通トリガー関数
-- ============================================================

-- updated_at を現在時刻に更新（全テーブルで使用）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
