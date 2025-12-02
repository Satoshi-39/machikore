-- サンプルマップのサムネイル画像を追加
-- Unsplashの無料画像URLを使用

-- ===============================
-- マップのサムネイル画像を更新
-- ===============================

-- 東京ラーメンマップ
UPDATE maps SET thumbnail_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'
WHERE id = '11111111-aaaa-1111-aaaa-111111111111';

-- 東京おしゃれカフェ
UPDATE maps SET thumbnail_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
WHERE id = '11111111-bbbb-1111-bbbb-111111111111';

-- 東京定番観光スポット
UPDATE maps SET thumbnail_url = 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800'
WHERE id = '22222222-aaaa-2222-aaaa-222222222222';

-- 東京の癒し公園
UPDATE maps SET thumbnail_url = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
WHERE id = '22222222-bbbb-2222-bbbb-222222222222';

-- 私のお気に入りスポット
UPDATE maps SET thumbnail_url = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
WHERE id = '33333333-aaaa-3333-aaaa-333333333333';
