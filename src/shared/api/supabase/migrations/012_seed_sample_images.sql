-- サンプルスポット用の画像データ
-- Unsplashの無料画像URLを使用

-- ===============================
-- ラーメン店の画像
-- ===============================

-- 一蘭 渋谷店
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', 0, NOW(), NOW()),
('11111111-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- AFURI 恵比寿店
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0002-0002-0002-000000000002', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 麺屋武蔵 新宿本店
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0003-0003-0003-000000000003', 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===============================
-- カフェの画像
-- ===============================

-- ブルーボトルコーヒー 清澄白河
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0006-0006-0006-000000000006', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 0, NOW(), NOW()),
('11111111-0006-0006-0006-000000000006', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Starbucks Reserve Roastery Tokyo
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0007-0007-0007-000000000007', 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Fuglen Tokyo
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('11111111-0008-0008-0008-000000000008', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===============================
-- 観光スポットの画像
-- ===============================

-- 東京スカイツリー
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800', 0, NOW(), NOW()),
('22222222-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 浅草寺
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0002-0002-0002-000000000002', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800', 0, NOW(), NOW()),
('22222222-0002-0002-0002-000000000002', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 東京タワー
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0003-0003-0003-000000000003', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 明治神宮
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0004-0004-0004-000000000004', 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===============================
-- 公園の画像
-- ===============================

-- 代々木公園
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0006-0006-0006-000000000006', 'https://images.unsplash.com/photo-1568702846914-96b305d2uj82?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 井の頭恩賜公園
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0007-0007-0007-000000000007', 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 上野恩賜公園
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0008-0008-0008-000000000008', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 新宿御苑
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('22222222-0009-0009-0009-000000000009', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', 0, NOW(), NOW()),
('22222222-0009-0009-0009-000000000009', 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===============================
-- お気に入りスポットの画像
-- ===============================

-- 代官山 蔦屋書店
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('33333333-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- SHIBUYA SKY
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('33333333-0004-0004-0004-000000000004', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 0, NOW(), NOW()),
('33333333-0004-0004-0004-000000000004', 'https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 下北沢駅前商店街
INSERT INTO images (spot_id, cloud_path, order_index, created_at, updated_at) VALUES
('33333333-0005-0005-0005-000000000005', 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===============================
-- images_count を更新
-- ===============================

UPDATE user_spots SET images_count = (
  SELECT COUNT(*) FROM images WHERE images.spot_id = user_spots.id
)
WHERE id IN (
  '11111111-0001-0001-0001-000000000001',
  '11111111-0002-0002-0002-000000000002',
  '11111111-0003-0003-0003-000000000003',
  '11111111-0006-0006-0006-000000000006',
  '11111111-0007-0007-0007-000000000007',
  '11111111-0008-0008-0008-000000000008',
  '22222222-0001-0001-0001-000000000001',
  '22222222-0002-0002-0002-000000000002',
  '22222222-0003-0003-0003-000000000003',
  '22222222-0004-0004-0004-000000000004',
  '22222222-0006-0006-0006-000000000006',
  '22222222-0007-0007-0007-000000000007',
  '22222222-0008-0008-0008-000000000008',
  '22222222-0009-0009-0009-000000000009',
  '33333333-0001-0001-0001-000000000001',
  '33333333-0004-0004-0004-000000000004',
  '33333333-0005-0005-0005-000000000005'
);
