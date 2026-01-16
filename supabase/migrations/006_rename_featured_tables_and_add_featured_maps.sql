-- ============================================================
-- 特集テーブルのリネームと featured_maps テーブル追加
-- ============================================================
-- featured_carousel_items → featured_items にリネーム
-- featured_maps テーブルを新規作成（特集ごとのキュレーションマップ）
-- 最終更新: 2025-01-14

-- ============================================================
-- 1. featured_carousel_items → featured_items にリネーム
-- ============================================================

-- インデックスを削除
DROP INDEX IF EXISTS idx_featured_carousel_items_active_order;
DROP INDEX IF EXISTS idx_featured_carousel_items_category;

-- RLSポリシーを削除
DROP POLICY IF EXISTS featured_carousel_items_select_active ON public.featured_carousel_items;

-- トリガーを削除
DROP TRIGGER IF EXISTS update_featured_carousel_items_updated_at ON public.featured_carousel_items;

-- テーブルをリネーム
ALTER TABLE public.featured_carousel_items RENAME TO featured_items;

-- 制約をリネーム
ALTER TABLE public.featured_items RENAME CONSTRAINT featured_carousel_items_pkey TO featured_items_pkey;
ALTER TABLE public.featured_items RENAME CONSTRAINT featured_carousel_items_category_id_fkey TO featured_items_category_id_fkey;

-- インデックスを再作成
CREATE INDEX idx_featured_items_active_order ON public.featured_items USING btree (is_active, display_order) WHERE (is_active = true);
CREATE INDEX idx_featured_items_category ON public.featured_items USING btree (category_id);

-- トリガーを再作成
CREATE TRIGGER update_featured_items_updated_at
    BEFORE UPDATE ON public.featured_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLSポリシーを再作成
CREATE POLICY featured_items_select_active ON public.featured_items
    FOR SELECT TO authenticated, anon
    USING (
        (is_active = true)
        AND ((starts_at IS NULL) OR (starts_at <= now()))
        AND ((ends_at IS NULL) OR (ends_at > now()))
    );

-- コメントを更新
COMMENT ON TABLE public.featured_items IS '特集アイテム（カルーセルバナー等）';

-- ============================================================
-- 2. featured_maps テーブルを新規作成
-- ============================================================

CREATE TABLE public.featured_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    featured_item_id uuid NOT NULL,
    map_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.featured_maps IS '特集アイテムに紐づくキュレーションマップ';
COMMENT ON COLUMN public.featured_maps.featured_item_id IS '特集アイテムID';
COMMENT ON COLUMN public.featured_maps.map_id IS 'マップID';
COMMENT ON COLUMN public.featured_maps.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.featured_maps.is_active IS '有効フラグ';

-- 主キー
ALTER TABLE ONLY public.featured_maps ADD CONSTRAINT featured_maps_pkey PRIMARY KEY (id);

-- ユニーク制約（同じ特集に同じマップは1つだけ）
ALTER TABLE ONLY public.featured_maps ADD CONSTRAINT featured_maps_featured_item_id_map_id_key
    UNIQUE (featured_item_id, map_id);

-- 外部キー
ALTER TABLE ONLY public.featured_maps ADD CONSTRAINT featured_maps_featured_item_id_fkey
    FOREIGN KEY (featured_item_id) REFERENCES public.featured_items(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.featured_maps ADD CONSTRAINT featured_maps_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

-- インデックス
CREATE INDEX idx_featured_maps_featured_item ON public.featured_maps USING btree (featured_item_id);
CREATE INDEX idx_featured_maps_active ON public.featured_maps USING btree (is_active) WHERE (is_active = true);

-- トリガー
CREATE TRIGGER update_featured_maps_updated_at
    BEFORE UPDATE ON public.featured_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.featured_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY featured_maps_select_active ON public.featured_maps
    FOR SELECT TO authenticated, anon
    USING (is_active = true);
