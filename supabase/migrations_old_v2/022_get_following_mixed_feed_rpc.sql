-- ============================================================
-- フォロー中混合フィード取得RPC関数
-- ============================================================
-- フォロー中ユーザーのマップとスポットを混合して新着順で取得
-- cursor方式のページネーションに対応
-- 最終更新: 2026-01-18

-- ===============================
-- RPC関数
-- ===============================

CREATE OR REPLACE FUNCTION public.get_following_mixed_feed(
  p_user_id UUID,
  p_limit INT DEFAULT 10,
  p_cursor TIMESTAMPTZ DEFAULT NULL
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ユーザーIDが必須
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH
  -- フォロー中のユーザーIDを取得
  following_users AS (
    SELECT followee_id FROM follows WHERE follower_id = p_user_id
  ),

  -- フォロー中ユーザーの公開マップを取得
  maps_cte AS (
    SELECT
      'map'::TEXT AS item_type,
      m.id AS item_id,
      m.created_at,
      -- マップフィールド
      m.id AS map_id,
      m.name AS map_name,
      m.description AS map_description,
      m.thumbnail_url AS map_thumbnail_url,
      m.is_public AS map_is_public,
      m.is_article_public AS map_is_article_public,
      m.spots_count AS map_spots_count,
      m.likes_count AS map_likes_count,
      m.bookmarks_count AS map_bookmarks_count,
      m.comments_count AS map_comments_count,
      m.category_id AS map_category_id,
      m.language AS map_language,
      m.user_id AS map_user_id,
      u.username AS map_user_username,
      u.display_name AS map_user_display_name,
      u.avatar_url AS map_user_avatar_url,
      -- タグ情報をJSONB配列で取得
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM map_tags mt
         JOIN tags t ON t.id = mt.tag_id
         WHERE mt.map_id = m.id),
        '[]'::jsonb
      ) AS map_tags,
      -- スポット用フィールドはNULL
      NULL::UUID, NULL::UUID, NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::UUID, NULL::JSONB, NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::INT,
      NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::JSONB, NULL::JSONB,
      NULL::BOOLEAN, NULL::JSONB,
      NULL::JSONB, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::TEXT,
      NULL::JSONB, NULL::JSONB, NULL::TEXT[],
      NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::BOOLEAN,
      NULL::JSONB
    FROM maps_public m
    INNER JOIN following_users fu ON fu.followee_id = m.user_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_cursor IS NULL OR m.created_at < p_cursor)
  ),

  -- フォロー中ユーザーの公開スポットを取得
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      -- マップ用フィールドはNULL
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::TEXT, NULL::VARCHAR(10),
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB,
      -- スポットフィールド
      s.id AS spot_id,
      s.user_id AS spot_user_id,
      s.map_id AS spot_map_id,
      s.master_spot_id AS spot_master_spot_id,
      s.machi_id AS spot_machi_id,
      s.description AS spot_description,
      s.spot_color AS spot_spot_color,
      s.label_id AS spot_label_id,
      s.name AS spot_name,
      s.images_count AS spot_images_count,
      s.likes_count AS spot_likes_count,
      s.bookmarks_count AS spot_bookmarks_count,
      s.comments_count AS spot_comments_count,
      s.order_index AS spot_order_index,
      s.latitude AS spot_latitude,
      s.longitude AS spot_longitude,
      s.google_formatted_address AS spot_google_formatted_address,
      s.google_short_address AS spot_google_short_address,
      s.is_public AS spot_is_public,
      s.article_content AS spot_article_content,
      -- マスタースポット情報
      ms.name AS spot_master_spot_name,
      ms.latitude AS spot_master_spot_latitude,
      ms.longitude AS spot_master_spot_longitude,
      ms.google_place_id AS spot_master_spot_google_place_id,
      ms.google_formatted_address AS spot_master_spot_google_formatted_address,
      ms.google_short_address AS spot_master_spot_google_short_address,
      ms.google_types AS spot_master_spot_google_types,
      -- ユーザー情報
      u.username AS spot_user_username,
      u.display_name AS spot_user_display_name,
      u.avatar_url AS spot_user_avatar_url,
      -- マップ情報
      m.name AS spot_map_name,
      m.is_public AS spot_map_is_public,
      -- 画像URL（order_indexでソートして取得）
      COALESCE(
        (SELECT jsonb_agg(i.cloud_path ORDER BY i.order_index)
         FROM images i
         WHERE i.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_image_urls
    FROM user_spots s
    INNER JOIN following_users fu ON fu.followee_id = s.user_id
    INNER JOIN maps m ON m.id = s.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_cursor IS NULL OR s.created_at < p_cursor)
  ),

  -- マップとスポットを結合してソート
  combined AS (
    SELECT * FROM maps_cte
    UNION ALL
    SELECT * FROM spots_cte
  )

  SELECT * FROM combined
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_following_mixed_feed IS 'フォロー中ユーザーの混合フィード取得（マップ+スポット、cursor方式ページネーション対応）';

-- 実行権限を付与
GRANT EXECUTE ON FUNCTION public.get_following_mixed_feed TO authenticated;
