-- search_analyticsにcountryカラムを追加
-- デモグラフィック分析で国別の検索傾向を把握するため

-- countryカラムを追加
ALTER TABLE public.search_analytics ADD COLUMN country text;

COMMENT ON COLUMN public.search_analytics.country IS '居住国（ISO 3166-1 alpha-2）: jp, us, etc.';

-- countryを含むユニーク制約を更新
ALTER TABLE public.search_analytics
    DROP CONSTRAINT search_analytics_unique;

ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_unique
    UNIQUE NULLS NOT DISTINCT (query, search_type, gender, age_group, prefecture, country);

-- countryのインデックスを追加
CREATE INDEX idx_search_analytics_country ON public.search_analytics(country) WHERE country IS NOT NULL;

-- add_search_history関数を更新（countryも記録）
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
    v_country text;
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

    -- ユーザーのデモグラフィック情報を取得
    SELECT gender, age_group, prefecture, country
    INTO v_gender, v_age_group, v_prefecture, v_country
    FROM public.users WHERE id = v_user_id;

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
        query, search_type, gender, age_group, prefecture, country,
        search_count, first_searched_at, last_searched_at
    )
    VALUES (
        trim(p_query), p_search_type, v_gender, v_age_group, v_prefecture, v_country,
        1, now(), now()
    )
    ON CONFLICT (query, search_type, gender, age_group, prefecture, country)
    DO UPDATE SET
        search_count = search_analytics.search_count + 1,
        last_searched_at = now(),
        updated_at = now();

    RETURN v_new_id;
END;
$$;

COMMENT ON FUNCTION public.add_search_history(text, text)
IS '検索履歴を追加（ユーザー用 + 分析用の両方に記録、デモグラフィック対応）';

-- get_popular_searches関数を更新（countryフィルター追加）
CREATE OR REPLACE FUNCTION public.get_popular_searches(
    p_search_type text DEFAULT 'discover',
    p_limit integer DEFAULT 10,
    p_prefecture text DEFAULT NULL,
    p_country text DEFAULT NULL
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
      AND (p_country IS NULL OR sa.country = p_country)
    GROUP BY sa.query
    ORDER BY search_count DESC
    LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_popular_searches(text, integer, text, text)
IS '人気の検索ワードを取得（オプションで都道府県・国フィルター可）';
