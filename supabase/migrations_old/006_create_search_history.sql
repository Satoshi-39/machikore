-- 検索履歴テーブルを作成
-- Discover検索の履歴をDBに保存してクラウド同期
-- 将来的にdefaultMap, userMapの検索履歴も蓄積予定

-- ============================================================
-- search_history（検索履歴）
-- ============================================================

CREATE TABLE public.search_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    query text NOT NULL,
    search_type text NOT NULL DEFAULT 'discover',
    searched_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.search_history IS 'ユーザーの検索履歴（クラウド同期対応）';
COMMENT ON COLUMN public.search_history.user_id IS '検索したユーザーID';
COMMENT ON COLUMN public.search_history.query IS '検索クエリ';
COMMENT ON COLUMN public.search_history.search_type IS '検索タイプ: discover, defaultMap, userMap';
COMMENT ON COLUMN public.search_history.searched_at IS '検索日時';

-- 主キー
ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);

-- 外部キー
ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 検索タイプのチェック制約
ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_search_type_check
    CHECK (search_type IN ('discover', 'defaultMap', 'userMap'));

-- インデックス
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_user_type_searched
    ON public.search_history(user_id, search_type, searched_at DESC);

-- ============================================================
-- RLS（Row Level Security）ポリシー
-- ============================================================

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- 自分の検索履歴のみ閲覧可能
CREATE POLICY search_history_select_own ON public.search_history
    FOR SELECT USING (auth.uid() = user_id);

-- 自分の検索履歴のみ追加可能
CREATE POLICY search_history_insert_own ON public.search_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の検索履歴のみ削除可能
CREATE POLICY search_history_delete_own ON public.search_history
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 検索履歴を追加する関数（重複防止＆件数制限付き）
-- ============================================================

CREATE OR REPLACE FUNCTION public.add_search_history(
    p_query text,
    p_search_type text DEFAULT 'discover'
) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_new_id uuid;
    v_max_count integer := 20; -- 最大履歴数
BEGIN
    -- 認証チェック
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- 空のクエリはスキップ
    IF p_query IS NULL OR trim(p_query) = '' THEN
        RETURN NULL;
    END IF;

    -- 同じクエリが既にあれば削除（重複防止）
    DELETE FROM public.search_history
    WHERE user_id = v_user_id
      AND search_type = p_search_type
      AND query = trim(p_query);

    -- 新しい履歴を追加
    INSERT INTO public.search_history (user_id, query, search_type, searched_at)
    VALUES (v_user_id, trim(p_query), p_search_type, now())
    RETURNING id INTO v_new_id;

    -- 古い履歴を削除（最大件数を超えた分）
    DELETE FROM public.search_history
    WHERE id IN (
        SELECT id FROM public.search_history
        WHERE user_id = v_user_id
          AND search_type = p_search_type
        ORDER BY searched_at DESC
        OFFSET v_max_count
    );

    RETURN v_new_id;
END;
$$;

COMMENT ON FUNCTION public.add_search_history(text, text)
IS '検索履歴を追加（重複防止、最大20件）';

-- ============================================================
-- 検索履歴を全削除する関数
-- ============================================================

CREATE OR REPLACE FUNCTION public.clear_search_history(
    p_search_type text DEFAULT 'discover'
) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_deleted_count integer;
BEGIN
    -- 認証チェック
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    DELETE FROM public.search_history
    WHERE user_id = v_user_id
      AND search_type = p_search_type;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

COMMENT ON FUNCTION public.clear_search_history(text)
IS '指定タイプの検索履歴を全削除';
