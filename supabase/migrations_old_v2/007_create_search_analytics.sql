-- 検索分析テーブルを作成
-- 匿名化された検索データを長期保存（分析用）

-- ============================================================
-- search_analytics（検索分析）
-- ============================================================

CREATE TABLE public.search_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    query text NOT NULL,
    search_type text NOT NULL DEFAULT 'discover',
    search_count integer DEFAULT 1 NOT NULL,

    -- 匿名デモグラフィック（任意、オンボーディングで収集予定）
    gender text,              -- 'male', 'female', 'other', null
    age_group text,           -- '10s', '20s', '30s', '40s', '50s', '60s+', null
    prefecture text,          -- 都道府県名, null

    first_searched_at timestamp with time zone DEFAULT now() NOT NULL,
    last_searched_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.search_analytics IS '検索分析用データ（匿名化、長期保存）';
COMMENT ON COLUMN public.search_analytics.query IS '検索クエリ';
COMMENT ON COLUMN public.search_analytics.search_type IS '検索タイプ: discover, defaultMap, userMap';
COMMENT ON COLUMN public.search_analytics.search_count IS '検索回数';
COMMENT ON COLUMN public.search_analytics.gender IS '性別（匿名）: male, female, other';
COMMENT ON COLUMN public.search_analytics.age_group IS '年代（匿名）: 10s, 20s, 30s, 40s, 50s+';
COMMENT ON COLUMN public.search_analytics.prefecture IS '居住都道府県（匿名）';
COMMENT ON COLUMN public.search_analytics.first_searched_at IS '初回検索日時';
COMMENT ON COLUMN public.search_analytics.last_searched_at IS '最終検索日時';

-- 主キー
ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_pkey PRIMARY KEY (id);

-- ユニーク制約（同じ条件の組み合わせは1レコード）
ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_unique
    UNIQUE NULLS NOT DISTINCT (query, search_type, gender, age_group, prefecture);

-- 検索タイプのチェック制約
ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_search_type_check
    CHECK (search_type IN ('discover', 'defaultMap', 'userMap'));

-- 性別のチェック制約
ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_gender_check
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));

-- 年代のチェック制約
ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_age_group_check
    CHECK (age_group IS NULL OR age_group IN ('10s', '20s', '30s', '40s', '50s', '60s+'));

-- インデックス
CREATE INDEX idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX idx_search_analytics_search_type ON public.search_analytics(search_type);
CREATE INDEX idx_search_analytics_search_count ON public.search_analytics(search_count DESC);
CREATE INDEX idx_search_analytics_last_searched ON public.search_analytics(last_searched_at DESC);
CREATE INDEX idx_search_analytics_prefecture ON public.search_analytics(prefecture) WHERE prefecture IS NOT NULL;

-- updated_atトリガー
CREATE TRIGGER update_search_analytics_updated_at
    BEFORE UPDATE ON public.search_analytics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS（Row Level Security）ポリシー
-- ============================================================
-- 分析データは匿名なので、読み取りは管理者のみ
-- 挿入はシステム（関数経由）のみ

ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- 一般ユーザーはアクセス不可（管理者はService Roleで直接アクセス）
-- 挿入は SECURITY DEFINER 関数経由で行う

-- ============================================================
-- add_search_history関数を更新（分析データも記録）
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
    v_max_count integer := 20;
    v_gender text;
    v_age_group text;
    v_prefecture text;
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

    -- ユーザーのデモグラフィック情報を取得（将来のオンボーディング用、現在はNULL）
    -- SELECT gender, age_group, prefecture INTO v_gender, v_age_group, v_prefecture
    -- FROM user_demographics WHERE user_id = v_user_id;
    v_gender := NULL;
    v_age_group := NULL;
    v_prefecture := NULL;

    -- 1. ユーザー用の検索履歴に追加
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

    -- 2. 分析用テーブルに追加（匿名、カウントアップ）
    INSERT INTO public.search_analytics (
        query, search_type, gender, age_group, prefecture,
        search_count, first_searched_at, last_searched_at
    )
    VALUES (
        trim(p_query), p_search_type, v_gender, v_age_group, v_prefecture,
        1, now(), now()
    )
    ON CONFLICT (query, search_type, gender, age_group, prefecture)
    DO UPDATE SET
        search_count = search_analytics.search_count + 1,
        last_searched_at = now(),
        updated_at = now();

    RETURN v_new_id;
END;
$$;

COMMENT ON FUNCTION public.add_search_history(text, text)
IS '検索履歴を追加（ユーザー用 + 分析用の両方に記録）';

-- ============================================================
-- 人気検索ワードを取得する関数
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_popular_searches(
    p_search_type text DEFAULT 'discover',
    p_limit integer DEFAULT 10,
    p_prefecture text DEFAULT NULL
) RETURNS TABLE (
    query text,
    search_count integer,
    last_searched_at timestamp with time zone
)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        sa.query,
        SUM(sa.search_count)::integer as search_count,
        MAX(sa.last_searched_at) as last_searched_at
    FROM public.search_analytics sa
    WHERE sa.search_type = p_search_type
      AND (p_prefecture IS NULL OR sa.prefecture = p_prefecture)
    GROUP BY sa.query
    ORDER BY search_count DESC
    LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_popular_searches(text, integer, text)
IS '人気の検索ワードを取得（オプションで都道府県フィルター可）';
