-- ============================================================
-- コレクション（collections, collection_maps）
-- ============================================================
-- マップをまとめるコレクション機能
-- 最終更新: 2025-12-23

-- ============================================================
-- collections（コレクション）
-- ============================================================

CREATE TABLE public.collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    thumbnail_url text,
    is_public boolean DEFAULT false NOT NULL,
    maps_count integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON COLUMN public.collections.is_public IS 'コレクションが公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN public.collections.maps_count IS 'マップ数（デフォルト: 0）';

ALTER TABLE ONLY public.collections ADD CONSTRAINT collections_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.collections ADD CONSTRAINT collections_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_collections_is_public ON public.collections USING btree (is_public);
CREATE INDEX idx_collections_user_id ON public.collections USING btree (user_id);

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY collections_select_public_or_own ON public.collections
    FOR SELECT USING (((is_public = true) OR (auth.uid() = user_id)));
CREATE POLICY collections_insert_own ON public.collections
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY collections_update_own ON public.collections
    FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY collections_delete_own ON public.collections
    FOR DELETE USING ((auth.uid() = user_id));

-- ============================================================
-- collection_maps（コレクションとマップの中間テーブル）
-- ============================================================

CREATE TABLE public.collection_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collection_id uuid NOT NULL,
    map_id uuid NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.collection_maps ADD CONSTRAINT collection_maps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.collection_maps ADD CONSTRAINT collection_maps_collection_id_map_id_key
    UNIQUE (collection_id, map_id);
ALTER TABLE ONLY public.collection_maps ADD CONSTRAINT collection_maps_collection_id_fkey
    FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.collection_maps ADD CONSTRAINT collection_maps_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

CREATE INDEX idx_collection_maps_collection_id ON public.collection_maps USING btree (collection_id);
CREATE INDEX idx_collection_maps_map_id ON public.collection_maps USING btree (map_id);

ALTER TABLE public.collection_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY collection_maps_select_public_or_own ON public.collection_maps
    FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND ((collections.is_public = true) OR (collections.user_id = auth.uid()))))));
CREATE POLICY collection_maps_insert_own ON public.collection_maps
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));
CREATE POLICY collection_maps_update_own ON public.collection_maps
    FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));
CREATE POLICY collection_maps_delete_own ON public.collection_maps
    FOR DELETE USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));

-- ============================================================
-- カウンター更新トリガー関数
-- ============================================================

-- collections.maps_count を更新するトリガー関数
CREATE FUNCTION public.update_collection_maps_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections SET maps_count = maps_count + 1, updated_at = NOW() WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections SET maps_count = maps_count - 1, updated_at = NOW() WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_collection_maps_count
    AFTER INSERT OR DELETE ON public.collection_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_collection_maps_count();
