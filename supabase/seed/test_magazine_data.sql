-- ============================================================
-- テストデータ: マガジンシステム
-- ============================================================
-- Supabaseダッシュボードの SQL Editor で実行してください

-- 1. マガジンを作成
INSERT INTO public.magazines (id, title, description, thumbnail_url, content, is_active)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '東京のおすすめラーメン店まとめ',
    '東京で人気のラーメン店を厳選してご紹介します。',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    '# 東京ラーメン特集

東京には数多くのラーメン店がありますが、その中でも特におすすめの店舗をマップでご紹介します。

各エリアごとに人気店をまとめましたので、ぜひ参考にしてください！',
    true
);

-- 2. 特集アイテム（カルーセルバナー）を作成してマガジンにリンク
INSERT INTO public.featured_items (id, title, description, image_url, link_type, magazine_id, display_order, is_active)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '東京ラーメン特集',
    '人気店を厳選紹介',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    'magazine',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    true
);

-- 3. 既存のマップをマガジンに紐づけ
-- まず既存のマップIDを確認してください：
-- SELECT id, name FROM public.maps WHERE is_published = true LIMIT 5;

-- 確認後、以下のようにマガジンにマップを紐づけます：
-- INSERT INTO public.magazine_maps (magazine_id, map_id, display_order, source_type)
-- VALUES
--     ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '<map_id_1>', 0, 'manual'),
--     ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '<map_id_2>', 1, 'manual'),
--     ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '<map_id_3>', 2, 'manual');

-- ============================================================
-- 3. マガジンセクションを作成
-- ============================================================
INSERT INTO public.magazine_sections (id, magazine_id, title, description, display_order, is_active)
VALUES
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '東京エリア', '東京都内のおすすめラーメン店', 0, true),
    ('d4e5f6a7-b8c9-0123-def0-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '神奈川エリア', '神奈川県のおすすめラーメン店', 1, true),
    ('e5f6a7b8-c9d0-1234-ef01-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '埼玉エリア', '埼玉県のおすすめラーメン店', 2, true);

-- ============================================================
-- 4. 動的にマップを紐づける（セクション付き）
-- ============================================================
-- 最初の2件は「東京エリア」セクションに紐づけ
INSERT INTO public.magazine_maps (magazine_id, map_id, section_id, display_order, source_type)
SELECT
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    id,
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1,
    'manual'
FROM public.maps
WHERE is_public = true
LIMIT 2;

-- 次の1件は「神奈川エリア」セクションに紐づけ
INSERT INTO public.magazine_maps (magazine_id, map_id, section_id, display_order, source_type)
SELECT
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    id,
    'd4e5f6a7-b8c9-0123-def0-234567890123',
    0,
    'manual'
FROM public.maps
WHERE is_public = true
OFFSET 2
LIMIT 1;

-- セクションなしのマップも1件追加
INSERT INTO public.magazine_maps (magazine_id, map_id, section_id, display_order, source_type)
SELECT
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    id,
    NULL,
    0,
    'manual'
FROM public.maps
WHERE is_public = true
OFFSET 3
LIMIT 1;
