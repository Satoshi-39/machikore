-- usersテーブルにデモグラフィック情報を追加
-- オンボーディングで収集し、検索分析に活用

-- ============================================================
-- usersテーブルにカラム追加
-- ============================================================

ALTER TABLE public.users
    ADD COLUMN gender text,
    ADD COLUMN age_group text,
    ADD COLUMN prefecture text;

COMMENT ON COLUMN public.users.gender IS '性別: male, female, other（任意）';
COMMENT ON COLUMN public.users.age_group IS '年代: 10s, 20s, 30s, 40s, 50s, 60s+（任意）';
COMMENT ON COLUMN public.users.prefecture IS '居住都道府県（任意）';

-- チェック制約
ALTER TABLE public.users
    ADD CONSTRAINT users_gender_check
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));

ALTER TABLE public.users
    ADD CONSTRAINT users_age_group_check
    CHECK (age_group IS NULL OR age_group IN ('10s', '20s', '30s', '40s', '50s', '60s+'));

-- ============================================================
-- add_search_history関数を更新（usersテーブルからデモグラフィック取得）
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

    -- ユーザーのデモグラフィック情報を取得
    SELECT gender, age_group, prefecture
    INTO v_gender, v_age_group, v_prefecture
    FROM public.users
    WHERE id = v_user_id;

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
IS '検索履歴を追加（ユーザー用 + 分析用の両方に記録、デモグラフィック情報を含む）';
