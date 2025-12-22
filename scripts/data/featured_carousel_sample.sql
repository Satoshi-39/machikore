-- 特集カルーセルのサンプルデータ
-- 注意: このSQLは 083_create_featured_carousel_items.sql を適用後に実行してください

INSERT INTO public.featured_carousel_items (
  title,
  description,
  image_url,
  link_type,
  link_value,
  related_tags,
  display_order,
  is_active
) VALUES
-- ラーメン特集（タグカテゴリあり）
(
  'ラーメンマップ大集合',
  '全国の美味しいラーメンスポットを厳選',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'tag',
  'ラーメン',
  ARRAY['塩ラーメン', '味噌ラーメン', 'とんこつラーメン', '醤油ラーメン', '家系ラーメン'],
  1,
  true
),
-- カフェ特集（タグカテゴリあり）
(
  'おしゃれカフェ特集',
  '休日に行きたいこだわりカフェ',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  'tag',
  'カフェ',
  ARRAY['純喫茶', 'コーヒー専門店', 'スイーツカフェ', 'ブックカフェ'],
  2,
  true
),
-- 焼肉特集（タグカテゴリなし = 直接タグ検索へ）
(
  '肉好き必見！焼肉マップ',
  '予約必須の人気焼肉店',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'tag',
  '焼肉',
  NULL,
  3,
  true
);
