-- ============================================================
-- user_spots に name カラムを追加
-- ============================================================
-- 現在地登録/ピン刺し登録用のスポット名（master_spotがない場合に使用）
-- 最終更新: 2026-01-09

-- name カラムを追加（JSONB形式で多言語対応）
ALTER TABLE public.user_spots
ADD COLUMN name jsonb;

COMMENT ON COLUMN public.user_spots.name IS '多言語スポット名（現在地/ピン刺し登録用）: {"ja": "日本語名", "en": "English name"}。master_spot_idがNULLの場合のみ使用';
