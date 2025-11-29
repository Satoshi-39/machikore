-- サンプルユーザーとマップ・スポットデータの投入
-- 他ユーザーのマップを閲覧するためのデモデータ

-- ===============================
-- 0. 追加の市区町村・街データ
-- ===============================

-- 武蔵野市を追加
INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, latitude, longitude, country_code, created_at, updated_at)
VALUES ('musashino', 'tokyo', '武蔵野市', 'むさしのし', '{"en": "Musashino"}'::jsonb, '市', 35.7063, 139.5594, 'jp', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 追加の街データ
INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, created_at, updated_at)
VALUES
  ('machi_musashino_kichijoji', '吉祥寺', 'きちじょうじ', '{"en": "Kichijoji"}'::jsonb, 35.7024, 139.5795, '[{"ja":"JR中央線"},{"ja":"京王井の頭線"}]'::jsonb, 'tokyo', 'musashino', 'jp', '東京都', '{"en": "Tokyo"}'::jsonb, '武蔵野市', '{"en": "Musashino"}'::jsonb, NOW(), NOW()),
  ('machi_koto_kiyosumishirakawa', '清澄白河', 'きよすみしらかわ', '{"en": "Kiyosumi-Shirakawa"}'::jsonb, 35.6808, 139.8011, '[{"ja":"東京メトロ半蔵門線"},{"ja":"都営大江戸線"}]'::jsonb, 'tokyo', 'koto', 'jp', '東京都', '{"en": "Tokyo"}'::jsonb, '江東区', '{"en": "Koto"}'::jsonb, NOW(), NOW()),
  ('machi_minato_hamamatsucho', '浜松町', 'はままつちょう', '{"en": "Hamamatsucho"}'::jsonb, 35.6555, 139.7572, '[{"ja":"JR山手線"},{"ja":"東京モノレール"}]'::jsonb, 'tokyo', 'minato', 'jp', '東京都', '{"en": "Tokyo"}'::jsonb, '港区', '{"en": "Minato"}'::jsonb, NOW(), NOW()),
  ('machi_chiyoda_otemachi', '大手町', 'おおてまち', '{"en": "Otemachi"}'::jsonb, 35.6867, 139.7639, '[{"ja":"東京メトロ丸ノ内線"},{"ja":"東京メトロ東西線"},{"ja":"東京メトロ千代田線"}]'::jsonb, 'tokyo', 'chiyoda', 'jp', '東京都', '{"en": "Tokyo"}'::jsonb, '千代田区', '{"en": "Chiyoda"}'::jsonb, NOW(), NOW()),
  ('machi_shibuya_yoyogiuehara', '代々木上原', 'よよぎうえはら', '{"en": "Yoyogi-Uehara"}'::jsonb, 35.6693, 139.6789, '[{"ja":"小田急小田原線"},{"ja":"東京メトロ千代田線"}]'::jsonb, 'tokyo', 'shibuya', 'jp', '東京都', '{"en": "Tokyo"}'::jsonb, '渋谷区', '{"en": "Shibuya"}'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 1. サンプルユーザー作成
-- ===============================

-- ユーザー1: グルメブロガー（東京グルメマップ）
INSERT INTO users (id, email, username, display_name, bio, avatar_url, is_subscribed, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'gourmet@example.com',
  'tokyo_gourmet',
  '東京グルメ探検家',
  '🍜 東京のラーメン・カフェ・居酒屋を巡っています！おすすめスポットを共有中✨',
  NULL,
  false,
  NOW() - INTERVAL '30 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ユーザー2: 観光ガイド（東京観光マップ）
INSERT INTO users (id, email, username, display_name, bio, avatar_url, is_subscribed, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'tourism@example.com',
  'tokyo_guide',
  '東京観光ナビ',
  '🗼 東京の名所・観光スポットを紹介！初めての東京旅行にぴったりなマップを作成中📸',
  NULL,
  false,
  NOW() - INTERVAL '60 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ユーザー3: ライフスタイラー（お気に入りスポットマップ）
INSERT INTO users (id, email, username, display_name, bio, avatar_url, is_subscribed, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'lifestyle@example.com',
  'tokyo_life',
  '東京生活日記',
  '☕ 東京で暮らす日常のお気に入りスポットを記録しています。カフェ巡りが趣味🌿',
  NULL,
  false,
  NOW() - INTERVAL '45 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 2. サンプルマップ作成
-- ===============================

-- マップ1: 東京ラーメンマップ（グルメブロガー）
INSERT INTO maps (id, user_id, name, description, category, tags, is_public, is_default, is_official, spots_count, likes_count, created_at, updated_at)
VALUES (
  '11111111-aaaa-1111-aaaa-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '東京ラーメンマップ',
  '東京で食べた美味しいラーメン屋さんをまとめました！醤油、味噌、豚骨、つけ麺など様々なジャンルを網羅🍜',
  'グルメ',
  '["ラーメン", "グルメ", "東京"]'::jsonb,
  true,
  true,
  false,
  5,
  12,
  NOW() - INTERVAL '25 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- マップ2: 東京カフェマップ（グルメブロガー）
INSERT INTO maps (id, user_id, name, description, category, tags, is_public, is_default, is_official, spots_count, likes_count, created_at, updated_at)
VALUES (
  '11111111-bbbb-1111-bbbb-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '東京おしゃれカフェ',
  '作業にぴったりのカフェから、インスタ映えするおしゃれカフェまで！☕✨',
  'グルメ',
  '["カフェ", "コーヒー", "東京"]'::jsonb,
  true,
  false,
  false,
  4,
  8,
  NOW() - INTERVAL '20 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- マップ3: 東京観光名所（観光ガイド）
INSERT INTO maps (id, user_id, name, description, category, tags, is_public, is_default, is_official, spots_count, likes_count, created_at, updated_at)
VALUES (
  '22222222-aaaa-2222-aaaa-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '東京定番観光スポット',
  '初めての東京旅行におすすめ！定番の観光名所をまとめました🗼',
  '観光',
  '["観光", "東京", "名所"]'::jsonb,
  true,
  true,
  false,
  5,
  25,
  NOW() - INTERVAL '55 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- マップ4: 東京の公園（観光ガイド）
INSERT INTO maps (id, user_id, name, description, category, tags, is_public, is_default, is_official, spots_count, likes_count, created_at, updated_at)
VALUES (
  '22222222-bbbb-2222-bbbb-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '東京の癒し公園',
  '都会のオアシス！リフレッシュできる東京の公園を紹介🌳',
  '観光',
  '["公園", "自然", "東京"]'::jsonb,
  true,
  false,
  false,
  4,
  15,
  NOW() - INTERVAL '40 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- マップ5: お気に入りスポット（ライフスタイラー）
INSERT INTO maps (id, user_id, name, description, category, tags, is_public, is_default, is_official, spots_count, likes_count, created_at, updated_at)
VALUES (
  '33333333-aaaa-3333-aaaa-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '私のお気に入りスポット',
  '東京生活で見つけたお気に入りの場所を記録📝',
  'ライフスタイル',
  '["お気に入り", "日常", "東京"]'::jsonb,
  true,
  true,
  false,
  5,
  6,
  NOW() - INTERVAL '40 days',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 3. マスタースポット作成
-- ===============================

-- ラーメン店
INSERT INTO master_spots (id, name, latitude, longitude, google_formatted_address, google_types, created_at, updated_at)
VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', '一蘭 渋谷店', 35.6595, 139.7004, '東京都渋谷区宇田川町', ARRAY['restaurant', 'food'], NOW(), NOW()),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'AFURI 恵比寿店', 35.6466, 139.7108, '東京都渋谷区恵比寿', ARRAY['restaurant', 'food'], NOW(), NOW()),
  ('aaaaaaaa-0003-0003-0003-000000000003', '麺屋武蔵 新宿本店', 35.6917, 139.7006, '東京都新宿区西新宿', ARRAY['restaurant', 'food'], NOW(), NOW()),
  ('aaaaaaaa-0004-0004-0004-000000000004', '中華そば 青葉 中野本店', 35.7052, 139.6657, '東京都中野区中野', ARRAY['restaurant', 'food'], NOW(), NOW()),
  ('aaaaaaaa-0005-0005-0005-000000000005', 'つけ麺 道 池袋店', 35.7295, 139.7109, '東京都豊島区東池袋', ARRAY['restaurant', 'food'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- カフェ
INSERT INTO master_spots (id, name, latitude, longitude, google_formatted_address, google_types, created_at, updated_at)
VALUES
  ('bbbbbbbb-0001-0001-0001-000000000001', 'ブルーボトルコーヒー 清澄白河', 35.6808, 139.8011, '東京都江東区平野', ARRAY['cafe', 'food'], NOW(), NOW()),
  ('bbbbbbbb-0002-0002-0002-000000000002', 'Starbucks Reserve Roastery Tokyo', 35.6614, 139.6985, '東京都目黒区青葉台', ARRAY['cafe', 'food'], NOW(), NOW()),
  ('bbbbbbbb-0003-0003-0003-000000000003', 'Fuglen Tokyo', 35.6655, 139.6943, '東京都渋谷区富ヶ谷', ARRAY['cafe', 'food'], NOW(), NOW()),
  ('bbbbbbbb-0004-0004-0004-000000000004', 'STREAMER COFFEE COMPANY', 35.6516, 139.7101, '東京都渋谷区渋谷', ARRAY['cafe', 'food'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 観光スポット
INSERT INTO master_spots (id, name, latitude, longitude, google_formatted_address, google_types, created_at, updated_at)
VALUES
  ('cccccccc-0001-0001-0001-000000000001', '東京スカイツリー', 35.7101, 139.8107, '東京都墨田区押上', ARRAY['tourist_attraction'], NOW(), NOW()),
  ('cccccccc-0002-0002-0002-000000000002', '浅草寺', 35.7148, 139.7967, '東京都台東区浅草', ARRAY['tourist_attraction', 'place_of_worship'], NOW(), NOW()),
  ('cccccccc-0003-0003-0003-000000000003', '東京タワー', 35.6586, 139.7454, '東京都港区芝公園', ARRAY['tourist_attraction'], NOW(), NOW()),
  ('cccccccc-0004-0004-0004-000000000004', '明治神宮', 35.6764, 139.6993, '東京都渋谷区代々木神園町', ARRAY['tourist_attraction', 'place_of_worship'], NOW(), NOW()),
  ('cccccccc-0005-0005-0005-000000000005', '皇居東御苑', 35.6852, 139.7528, '東京都千代田区千代田', ARRAY['tourist_attraction', 'park'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 公園
INSERT INTO master_spots (id, name, latitude, longitude, google_formatted_address, google_types, created_at, updated_at)
VALUES
  ('dddddddd-0001-0001-0001-000000000001', '代々木公園', 35.6715, 139.6949, '東京都渋谷区代々木神園町', ARRAY['park'], NOW(), NOW()),
  ('dddddddd-0002-0002-0002-000000000002', '井の頭恩賜公園', 35.6997, 139.5729, '東京都武蔵野市御殿山', ARRAY['park'], NOW(), NOW()),
  ('dddddddd-0003-0003-0003-000000000003', '上野恩賜公園', 35.7146, 139.7732, '東京都台東区上野公園', ARRAY['park'], NOW(), NOW()),
  ('dddddddd-0004-0004-0004-000000000004', '新宿御苑', 35.6851, 139.7100, '東京都新宿区内藤町', ARRAY['park'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 日常スポット
INSERT INTO master_spots (id, name, latitude, longitude, google_formatted_address, google_types, created_at, updated_at)
VALUES
  ('eeeeeeee-0001-0001-0001-000000000001', '代官山 蔦屋書店', 35.6486, 139.7022, '東京都渋谷区猿楽町', ARRAY['book_store'], NOW(), NOW()),
  ('eeeeeeee-0002-0002-0002-000000000002', '東急ハンズ 渋谷店', 35.6604, 139.6994, '東京都渋谷区宇田川町', ARRAY['store'], NOW(), NOW()),
  ('eeeeeeee-0003-0003-0003-000000000003', '中目黒高架下', 35.6440, 139.6989, '東京都目黒区上目黒', ARRAY['shopping_mall'], NOW(), NOW()),
  ('eeeeeeee-0004-0004-0004-000000000004', 'SHIBUYA SKY', 35.6584, 139.7024, '東京都渋谷区渋谷', ARRAY['tourist_attraction'], NOW(), NOW()),
  ('eeeeeeee-0005-0005-0005-000000000005', '下北沢駅前商店街', 35.6617, 139.6677, '東京都世田谷区北沢', ARRAY['shopping_mall'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 4. スポット作成（マップとマスタースポットの紐付け）
-- ===============================

-- 東京ラーメンマップのスポット
INSERT INTO spots (id, user_id, map_id, master_spot_id, machi_id, description, order_index, created_at, updated_at)
VALUES
  ('11111111-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '11111111-aaaa-1111-aaaa-111111111111', 'aaaaaaaa-0001-0001-0001-000000000001', 'machi_shibuya_shibuya', '濃厚豚骨！替え玉必須です🍜', 1, NOW() - INTERVAL '20 days', NOW()),
  ('11111111-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', '11111111-aaaa-1111-aaaa-111111111111', 'aaaaaaaa-0002-0002-0002-000000000002', 'machi_shibuya_ebisu', 'ゆず塩ラーメンが絶品！あっさり派におすすめ', 2, NOW() - INTERVAL '18 days', NOW()),
  ('11111111-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', '11111111-aaaa-1111-aaaa-111111111111', 'aaaaaaaa-0003-0003-0003-000000000003', 'machi_shinjuku_shinjuku', 'つけ麺が最高！麺の量が選べます', 3, NOW() - INTERVAL '15 days', NOW()),
  ('11111111-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', '11111111-aaaa-1111-aaaa-111111111111', 'aaaaaaaa-0004-0004-0004-000000000004', 'machi_nakano_nakano', '特製中華そばがおすすめ。行列必至！', 4, NOW() - INTERVAL '10 days', NOW()),
  ('11111111-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', '11111111-aaaa-1111-aaaa-111111111111', 'aaaaaaaa-0005-0005-0005-000000000005', 'machi_toshima_ikebukuro', '濃厚魚介つけ麺。麺がもちもち！', 5, NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 東京カフェマップのスポット
INSERT INTO spots (id, user_id, map_id, master_spot_id, machi_id, description, order_index, created_at, updated_at)
VALUES
  ('11111111-0006-0006-0006-000000000006', '11111111-1111-1111-1111-111111111111', '11111111-bbbb-1111-bbbb-111111111111', 'bbbbbbbb-0001-0001-0001-000000000001', 'machi_koto_kiyosumishirakawa', 'サードウェーブコーヒーの聖地！雰囲気◎', 1, NOW() - INTERVAL '18 days', NOW()),
  ('11111111-0007-0007-0007-000000000007', '11111111-1111-1111-1111-111111111111', '11111111-bbbb-1111-bbbb-111111111111', 'bbbbbbbb-0002-0002-0002-000000000002', 'machi_meguro_nakameguro', '目黒川沿いの最高のロケーション☕', 2, NOW() - INTERVAL '15 days', NOW()),
  ('11111111-0008-0008-0008-000000000008', '11111111-1111-1111-1111-111111111111', '11111111-bbbb-1111-bbbb-111111111111', 'bbbbbbbb-0003-0003-0003-000000000003', 'machi_shibuya_yoyogiuehara', 'ノルウェー発のおしゃれカフェ。夜も雰囲気良し', 3, NOW() - INTERVAL '10 days', NOW()),
  ('11111111-0009-0009-0009-000000000009', '11111111-1111-1111-1111-111111111111', '11111111-bbbb-1111-bbbb-111111111111', 'bbbbbbbb-0004-0004-0004-000000000004', 'machi_shibuya_shibuya', 'ラテアートが素敵！作業にも◎', 4, NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 東京観光名所マップのスポット
INSERT INTO spots (id, user_id, map_id, master_spot_id, machi_id, description, order_index, created_at, updated_at)
VALUES
  ('22222222-0001-0001-0001-000000000001', '22222222-2222-2222-2222-222222222222', '22222222-aaaa-2222-aaaa-222222222222', 'cccccccc-0001-0001-0001-000000000001', 'machi_sumida_oshiage', '東京のシンボル！展望台からの夜景は必見🌃', 1, NOW() - INTERVAL '50 days', NOW()),
  ('22222222-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', '22222222-aaaa-2222-aaaa-222222222222', 'cccccccc-0002-0002-0002-000000000002', 'machi_taito_asakusa', '雷門からの参道は風情があります。おみくじもぜひ', 2, NOW() - INTERVAL '45 days', NOW()),
  ('22222222-0003-0003-0003-000000000003', '22222222-2222-2222-2222-222222222222', '22222222-aaaa-2222-aaaa-222222222222', 'cccccccc-0003-0003-0003-000000000003', 'machi_minato_hamamatsucho', '東京タワーのライトアップは夜がおすすめ🗼', 3, NOW() - INTERVAL '40 days', NOW()),
  ('22222222-0004-0004-0004-000000000004', '22222222-2222-2222-2222-222222222222', '22222222-aaaa-2222-aaaa-222222222222', 'cccccccc-0004-0004-0004-000000000004', 'machi_shibuya_harajuku', '都心とは思えない静けさ。パワースポットです⛩️', 4, NOW() - INTERVAL '35 days', NOW()),
  ('22222222-0005-0005-0005-000000000005', '22222222-2222-2222-2222-222222222222', '22222222-aaaa-2222-aaaa-222222222222', 'cccccccc-0005-0005-0005-000000000005', 'machi_chiyoda_otemachi', '皇居の美しい庭園。無料で入れます🌸', 5, NOW() - INTERVAL '30 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 東京の公園マップのスポット
INSERT INTO spots (id, user_id, map_id, master_spot_id, machi_id, description, order_index, created_at, updated_at)
VALUES
  ('22222222-0006-0006-0006-000000000006', '22222222-2222-2222-2222-222222222222', '22222222-bbbb-2222-bbbb-222222222222', 'dddddddd-0001-0001-0001-000000000001', 'machi_shibuya_harajuku', '週末はピクニックにぴったり！サイクリングも楽しめます🚴', 1, NOW() - INTERVAL '38 days', NOW()),
  ('22222222-0007-0007-0007-000000000007', '22222222-2222-2222-2222-222222222222', '22222222-bbbb-2222-bbbb-222222222222', 'dddddddd-0002-0002-0002-000000000002', 'machi_musashino_kichijoji', 'ボートデートの定番スポット！池の周りの散歩も◎', 2, NOW() - INTERVAL '35 days', NOW()),
  ('22222222-0008-0008-0008-000000000008', '22222222-2222-2222-2222-222222222222', '22222222-bbbb-2222-bbbb-222222222222', 'dddddddd-0003-0003-0003-000000000003', 'machi_taito_ueno', '美術館・博物館も併設。一日中楽しめます🎨', 3, NOW() - INTERVAL '30 days', NOW()),
  ('22222222-0009-0009-0009-000000000009', '22222222-2222-2222-2222-222222222222', '22222222-bbbb-2222-bbbb-222222222222', 'dddddddd-0004-0004-0004-000000000004', 'machi_shinjuku_shinjuku', '四季折々の花が美しい。特に春の桜は絶景🌸', 4, NOW() - INTERVAL '25 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- お気に入りスポットマップのスポット
INSERT INTO spots (id, user_id, map_id, master_spot_id, machi_id, description, order_index, created_at, updated_at)
VALUES
  ('33333333-0001-0001-0001-000000000001', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-3333-aaaa-333333333333', 'eeeeeeee-0001-0001-0001-000000000001', 'machi_shibuya_daikanyama', '本と音楽とコーヒー。最高の空間📚', 1, NOW() - INTERVAL '35 days', NOW()),
  ('33333333-0002-0002-0002-000000000002', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-3333-aaaa-333333333333', 'eeeeeeee-0002-0002-0002-000000000002', 'machi_shibuya_shibuya', '文房具からDIYまで何でも揃う！', 2, NOW() - INTERVAL '30 days', NOW()),
  ('33333333-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-3333-aaaa-333333333333', 'eeeeeeee-0003-0003-0003-000000000003', 'machi_meguro_nakameguro', 'おしゃれなお店が並ぶ高架下。散歩コースにぴったり', 3, NOW() - INTERVAL '25 days', NOW()),
  ('33333333-0004-0004-0004-000000000004', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-3333-aaaa-333333333333', 'eeeeeeee-0004-0004-0004-000000000004', 'machi_shibuya_shibuya', '渋谷の絶景スポット！夕日と夜景がおすすめ🌅', 4, NOW() - INTERVAL '20 days', NOW()),
  ('33333333-0005-0005-0005-000000000005', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-3333-aaaa-333333333333', 'eeeeeeee-0005-0005-0005-000000000005', 'machi_setagaya_shimokitazawa', '古着・雑貨・カフェ巡りが楽しい！', 5, NOW() - INTERVAL '15 days', NOW())
ON CONFLICT (id) DO NOTHING;
