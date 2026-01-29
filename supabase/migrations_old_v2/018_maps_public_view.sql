-- 公開マップ用ビュー
-- 他ユーザーが見る場合、spots_countは公開スポットのみをカウント

-- ===============================
-- maps_public ビューを作成
-- ===============================

-- 既存のビューがあれば削除
DROP VIEW IF EXISTS public.maps_public;

CREATE VIEW public.maps_public AS
SELECT
  m.id,
  m.user_id,
  m.name,
  m.description,
  m.thumbnail_url,
  m.is_public,
  m.is_official,
  m.is_article_public,
  m.show_label_chips,
  m.category_id,
  m.language,
  m.created_at,
  m.updated_at,
  m.likes_count,
  m.comments_count,
  m.bookmarks_count,
  m.article_intro,
  m.article_outro,
  -- 公開スポットのみをカウント（spots_countを上書き）
  (SELECT COUNT(*)::INT FROM user_spots us WHERE us.map_id = m.id AND us.is_public = true) AS spots_count
FROM maps m
WHERE m.is_public = true;

-- RLSはビューには直接適用できないが、元テーブル(maps)のRLSが適用される
-- ビューはSECURITY INVOKERがデフォルトなので、アクセス者の権限で実行される

COMMENT ON VIEW public.maps_public IS '公開マップ一覧（spots_countは公開スポット数のみ）';
