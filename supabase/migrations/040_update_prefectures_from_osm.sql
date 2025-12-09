-- =============================================
-- 都道府県データの更新（OSMから取得）
-- 生成日時: 2025-12-09T12:46:34.278Z
-- データ取得日時: 2025-12-09T12:37:51.053Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 都道府県データの更新
-- =============================================

UPDATE prefectures SET
  name = '北海道',
  name_kana = COALESCE('ほっかいどう', name_kana),
  latitude = 43.4316324,
  longitude = 142.4916576,
  updated_at = NOW()
WHERE id = 'hokkaido';

UPDATE prefectures SET
  name = '青森県',
  name_kana = COALESCE('あおもりけん', name_kana),
  latitude = 40.9118853,
  longitude = 140.5690398,
  updated_at = NOW()
WHERE id = 'aomori';

UPDATE prefectures SET
  name = '岩手県',
  name_kana = COALESCE('いわてけん', name_kana),
  latitude = 39.6539952,
  longitude = 141.4923162,
  updated_at = NOW()
WHERE id = 'iwate';

UPDATE prefectures SET
  name = '宮城県',
  name_kana = COALESCE('みやぎけん', name_kana),
  latitude = 38.3880155,
  longitude = 141.1631147,
  updated_at = NOW()
WHERE id = 'miyagi';

UPDATE prefectures SET
  name = '秋田県',
  name_kana = COALESCE('あきたけん', name_kana),
  latitude = 39.6920715,
  longitude = 140.1692751,
  updated_at = NOW()
WHERE id = 'akita';

UPDATE prefectures SET
  name = '山形県',
  name_kana = COALESCE('やまがたけん', name_kana),
  latitude = 38.6633517,
  longitude = 139.8923423,
  updated_at = NOW()
WHERE id = 'yamagata';

UPDATE prefectures SET
  name = '福島県',
  name_kana = COALESCE('ふくしまけん', name_kana),
  latitude = 37.3664672,
  longitude = 140.3012033,
  updated_at = NOW()
WHERE id = 'fukushima';

UPDATE prefectures SET
  name = '茨城県',
  name_kana = COALESCE('いばらきけん', name_kana),
  latitude = 36.34222,
  longitude = 140.3592463,
  updated_at = NOW()
WHERE id = 'ibaraki';

UPDATE prefectures SET
  name = '栃木県',
  name_kana = COALESCE('とちぎけん', name_kana),
  latitude = 36.6773725,
  longitude = 139.809403,
  updated_at = NOW()
WHERE id = 'tochigi';

UPDATE prefectures SET
  name = '群馬県',
  name_kana = COALESCE('ぐんまけん', name_kana),
  latitude = 36.5219801,
  longitude = 139.033483,
  updated_at = NOW()
WHERE id = 'gunma';

UPDATE prefectures SET
  name = '埼玉県',
  name_kana = COALESCE('さいたまけん', name_kana),
  latitude = 36.0184661,
  longitude = 139.3058455,
  updated_at = NOW()
WHERE id = 'saitama';

UPDATE prefectures SET
  name = '千葉県',
  name_kana = COALESCE('ちばけん', name_kana),
  latitude = 35.360459,
  longitude = 140.3217107,
  updated_at = NOW()
WHERE id = 'chiba';

-- 東京都: 県庁所在地の座標を使用（離島を含むため）
UPDATE prefectures SET
  name = '東京都',
  name_kana = COALESCE('とうきょうと', name_kana),
  latitude = 35.6895,
  longitude = 139.6917,
  updated_at = NOW()
WHERE id = 'tokyo';

UPDATE prefectures SET
  name = '神奈川県',
  name_kana = COALESCE('かながわけん', name_kana),
  latitude = 35.3150313,
  longitude = 139.386759,
  updated_at = NOW()
WHERE id = 'kanagawa';

UPDATE prefectures SET
  name = '新潟県',
  name_kana = COALESCE('にいがたけん', name_kana),
  latitude = 37.8169186,
  longitude = 138.7157609,
  updated_at = NOW()
WHERE id = 'niigata';

UPDATE prefectures SET
  name = '富山県',
  name_kana = COALESCE('とやまけん', name_kana),
  latitude = 36.7635807,
  longitude = 137.2658665,
  updated_at = NOW()
WHERE id = 'toyama';

UPDATE prefectures SET
  name = '石川県',
  name_kana = COALESCE('いしかわけん', name_kana),
  latitude = 37.1010934,
  longitude = 136.9734267,
  updated_at = NOW()
WHERE id = 'ishikawa';

UPDATE prefectures SET
  name = '福井県',
  name_kana = COALESCE('ふくいけん', name_kana),
  latitude = 35.8975675,
  longitude = 136.1408505,
  updated_at = NOW()
WHERE id = 'fukui';

UPDATE prefectures SET
  name = '山梨県',
  name_kana = COALESCE('やまなしけん', name_kana),
  latitude = 35.5700465,
  longitude = 138.657249,
  updated_at = NOW()
WHERE id = 'yamanashi';

UPDATE prefectures SET
  name = '長野県',
  name_kana = COALESCE('ながのけん', name_kana),
  latitude = 36.1143945,
  longitude = 138.0319015,
  updated_at = NOW()
WHERE id = 'nagano';

UPDATE prefectures SET
  name = '岐阜県',
  name_kana = COALESCE('ぎふけん', name_kana),
  latitude = 35.7993975,
  longitude = 136.964635,
  updated_at = NOW()
WHERE id = 'gifu';

UPDATE prefectures SET
  name = '静岡県',
  name_kana = COALESCE('しずおかけん', name_kana),
  latitude = 35.0092013,
  longitude = 138.4474315,
  updated_at = NOW()
WHERE id = 'shizuoka';

UPDATE prefectures SET
  name = '愛知県',
  name_kana = COALESCE('あいちけん', name_kana),
  latitude = 34.8505462,
  longitude = 137.254574,
  updated_at = NOW()
WHERE id = 'aichi';

UPDATE prefectures SET
  name = '三重県',
  name_kana = COALESCE('みえけん', name_kana),
  latitude = 34.4355564,
  longitude = 136.5893802,
  updated_at = NOW()
WHERE id = 'mie';

UPDATE prefectures SET
  name = '滋賀県',
  name_kana = COALESCE('しがけん', name_kana),
  latitude = 35.247154,
  longitude = 136.1093852,
  updated_at = NOW()
WHERE id = 'shiga';

UPDATE prefectures SET
  name = '京都府',
  name_kana = COALESCE('きょうとふ', name_kana),
  latitude = 35.427891,
  longitude = 135.4534093,
  updated_at = NOW()
WHERE id = 'kyoto';

UPDATE prefectures SET
  name = '大阪府',
  name_kana = COALESCE('おおさかふ', name_kana),
  latitude = 34.661557,
  longitude = 135.3862454,
  updated_at = NOW()
WHERE id = 'osaka';

UPDATE prefectures SET
  name = '兵庫県',
  name_kana = COALESCE('ひょうごけん', name_kana),
  latitude = 34.9433662,
  longitude = 134.860666,
  updated_at = NOW()
WHERE id = 'hyogo';

UPDATE prefectures SET
  name = '奈良県',
  name_kana = COALESCE('ならけん', name_kana),
  latitude = 34.320156,
  longitude = 135.884773,
  updated_at = NOW()
WHERE id = 'nara';

UPDATE prefectures SET
  name = '和歌山県',
  name_kana = COALESCE('わかやまけん', name_kana),
  latitude = 33.8136796,
  longitude = 135.6013633,
  updated_at = NOW()
WHERE id = 'wakayama';

UPDATE prefectures SET
  name = '鳥取県',
  name_kana = COALESCE('とっとりけん', name_kana),
  latitude = 35.4303659,
  longitude = 133.8256435,
  updated_at = NOW()
WHERE id = 'tottori';

UPDATE prefectures SET
  name = '島根県',
  name_kana = COALESCE('しまねけん', name_kana),
  latitude = 35.4291024,
  longitude = 132.5501852,
  updated_at = NOW()
WHERE id = 'shimane';

UPDATE prefectures SET
  name = '岡山県',
  name_kana = COALESCE('おかやまけん', name_kana),
  latitude = 34.8023747,
  longitude = 133.839977,
  updated_at = NOW()
WHERE id = 'okayama';

UPDATE prefectures SET
  name = '広島県',
  name_kana = COALESCE('ひろしまけん', name_kana),
  latitude = 34.5566578,
  longitude = 132.7669051,
  updated_at = NOW()
WHERE id = 'hiroshima';

UPDATE prefectures SET
  name = '山口県',
  name_kana = COALESCE('やまぐちけん', name_kana),
  latitude = 34.3156093,
  longitude = 131.4545526,
  updated_at = NOW()
WHERE id = 'yamaguchi';

UPDATE prefectures SET
  name = '徳島県',
  name_kana = COALESCE('とくしまけん', name_kana),
  latitude = 33.8485454,
  longitude = 134.3238008,
  updated_at = NOW()
WHERE id = 'tokushima';

UPDATE prefectures SET
  name = '香川県',
  name_kana = COALESCE('かがわけん', name_kana),
  latitude = 34.3204428,
  longitude = 133.9765295,
  updated_at = NOW()
WHERE id = 'kagawa';

UPDATE prefectures SET
  name = '愛媛県',
  name_kana = COALESCE('えひめけん', name_kana),
  latitude = 33.5530829,
  longitude = 132.7865786,
  updated_at = NOW()
WHERE id = 'ehime';

UPDATE prefectures SET
  name = '高知県',
  name_kana = COALESCE('こうちけん', name_kana),
  latitude = 33.1339092,
  longitude = 133.377517,
  updated_at = NOW()
WHERE id = 'kochi';

UPDATE prefectures SET
  name = '福岡県',
  name_kana = COALESCE('ふくおかけん', name_kana),
  latitude = 33.7936104,
  longitude = 130.5314035,
  updated_at = NOW()
WHERE id = 'fukuoka';

UPDATE prefectures SET
  name = '佐賀県',
  name_kana = COALESCE('さがけん', name_kana),
  latitude = 33.3114894,
  longitude = 130.0910709,
  updated_at = NOW()
WHERE id = 'saga';

-- 長崎県: 県庁所在地の座標を使用（離島を含むため）
UPDATE prefectures SET
  name = '長崎県',
  name_kana = COALESCE('ながさきけん', name_kana),
  latitude = 32.7448,
  longitude = 129.8737,
  updated_at = NOW()
WHERE id = 'nagasaki';

UPDATE prefectures SET
  name = '熊本県',
  name_kana = COALESCE('くまもとけん', name_kana),
  latitude = 32.6022056,
  longitude = 130.3255497,
  updated_at = NOW()
WHERE id = 'kumamoto';

UPDATE prefectures SET
  name = '大分県',
  name_kana = COALESCE('おおいたけん', name_kana),
  latitude = 33.1122524,
  longitude = 131.5504224,
  updated_at = NOW()
WHERE id = 'oita';

UPDATE prefectures SET
  name = '宮崎県',
  name_kana = COALESCE('みやざきけん', name_kana),
  latitude = 32.0452902,
  longitude = 131.4547797,
  updated_at = NOW()
WHERE id = 'miyazaki';

-- 鹿児島県: 県庁所在地の座標を使用（離島を含むため）
UPDATE prefectures SET
  name = '鹿児島県',
  name_kana = COALESCE('かごしまけん', name_kana),
  latitude = 31.5602,
  longitude = 130.5581,
  updated_at = NOW()
WHERE id = 'kagoshima';

-- 沖縄県: 県庁所在地の座標を使用（離島を含むため）
UPDATE prefectures SET
  name = '沖縄県',
  name_kana = COALESCE('おきなわけん', name_kana),
  latitude = 26.2124,
  longitude = 127.6809,
  updated_at = NOW()
WHERE id = 'okinawa';

-- トランザクションコミット
COMMIT;

-- 完了: 47件の都道府県データを更新