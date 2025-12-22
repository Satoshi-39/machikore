-- =============================================
-- 京都府の街データ（OSMから取得）
-- 生成日時: 2025-12-11T02:45:17.148Z
-- データ取得日時: 2025-12-11T00:58:22.022Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（京都府のみ）
-- =============================================

-- machiテーブルから京都府のデータを削除
DELETE FROM machi WHERE prefecture_id = 'kyoto';

-- citiesテーブルから京都府のデータを削除
DELETE FROM cities WHERE prefecture_id = 'kyoto';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_muko',
  'kyoto',
  '向日市',
  '向日市',
  '{"en":"Muko"}'::jsonb,
  '市',
  'jp',
  34.9487167,
  135.6980911
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_nagaokakyo',
  'kyoto',
  '長岡京市',
  '長岡京市',
  '{"en":"Nagaokakyo"}'::jsonb,
  '市',
  'jp',
  34.9265292,
  135.6953718
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_kameoka',
  'kyoto',
  '亀岡市',
  'かめおかし',
  '{"en":"Kameoka"}'::jsonb,
  '市',
  'jp',
  35.0134403,
  135.5733728
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_kizugawa',
  'kyoto',
  '木津川市',
  '木津川市',
  '{"en":"Kizugawa"}'::jsonb,
  '市',
  'jp',
  34.7371445,
  135.8201679
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_kyotanabe',
  'kyoto',
  '京田辺市',
  '京田辺市',
  '{"en":"Kyotanabe"}'::jsonb,
  '市',
  'jp',
  34.8143918,
  135.7677347
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_joyo',
  'kyoto',
  '城陽市',
  '城陽市',
  '{"en":"Joyo"}'::jsonb,
  '市',
  'jp',
  34.8530163,
  135.7799322
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_yawata',
  'kyoto',
  '八幡市',
  '八幡市',
  '{"en":"Yawata"}'::jsonb,
  '市',
  'jp',
  34.8754849,
  135.7075487
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_uji',
  'kyoto',
  '宇治市',
  'うじし',
  '{"en":"Uji"}'::jsonb,
  '市',
  'jp',
  34.885124,
  135.7995651
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_kyoto',
  'kyoto',
  '京都市',
  'きょうとし',
  '{"en":"Kyoto"}'::jsonb,
  '市',
  'jp',
  35.0115754,
  135.7681441
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_ayabe',
  'kyoto',
  '綾部市',
  '綾部市',
  '{"en":"Ayabe"}'::jsonb,
  '市',
  'jp',
  35.2989655,
  135.2588086
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_fukuchiyama',
  'kyoto',
  '福知山市',
  '福知山市',
  '{"en":"Fukuchiyama"}'::jsonb,
  '市',
  'jp',
  35.2966996,
  135.126643
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_maizuru',
  'kyoto',
  '舞鶴市',
  '舞鶴市',
  '{"en":"Maizuru"}'::jsonb,
  '市',
  'jp',
  35.4747274,
  135.3860338
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_miyazu',
  'kyoto',
  '宮津市',
  '宮津市',
  '{"en":"Miyazu"}'::jsonb,
  '市',
  'jp',
  35.5357466,
  135.1956369
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_nantan',
  'kyoto',
  '南丹市',
  '南丹市',
  '{"en":"Nantan"}'::jsonb,
  '市',
  'jp',
  35.1072823,
  135.4707092
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kyoto_kyotango',
  'kyoto',
  '京丹後市',
  'きょうたんごし',
  '{"en":"Kyotango"}'::jsonb,
  '市',
  'jp',
  35.6242023,
  135.0610964
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiuenocho',
  '上植野町',
  'かみうえのちょう',
  '{"en":"Kamiuenocho"}'::jsonb,
  34.9352541,
  135.7055784,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mukocho',
  '向日町',
  'むこうちょう',
  '{"en":"Mukocho"}'::jsonb,
  34.9440217,
  135.698273,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_teradocho',
  '寺戸町',
  'てらどちょう',
  '{"en":"Teradocho"}'::jsonb,
  34.9535424,
  135.7020832,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_morimotocho',
  '森本町',
  'もりもとちょう',
  '{"en":"Morimotocho"}'::jsonb,
  34.9500667,
  135.7122721,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634974,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mozumecho',
  '物集女町',
  'もずめちょう',
  '{"en":"Mozumecho"}'::jsonb,
  34.9630562,
  135.6954467,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634976,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaidecho',
  '鶏冠井町',
  'かいでちょう',
  '{"en":"Kaidecho"}'::jsonb,
  34.9422774,
  135.7082673,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2458634977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_zakuro',
  '柘榴',
  'ざくろ',
  '{"en":"Zakuro"}'::jsonb,
  34.73192,
  135.7614952,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2676596210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_修学院尺羅ケ谷四明ケ嶽',
  '修学院尺羅ケ谷四明ケ嶽',
  '修学院尺羅ケ谷四明ケ嶽',
  NULL,
  35.0664212,
  135.8290783,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  2927230084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sumiyama',
  '炭山',
  'すみやま',
  '{"en":"Sumiyama"}'::jsonb,
  34.9207023,
  135.8335078,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  3683209206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nio',
  '二尾',
  'にお',
  '{"en":"Nio"}'::jsonb,
  34.9113042,
  135.8601994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  3683209207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikenoo',
  '池尾',
  'いけのお',
  '{"en":"Ikenoo"}'::jsonb,
  34.9008611,
  135.8576121,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  3683210336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishi_kasatori',
  '西笠取',
  'にしかさとり',
  '{"en":"Nishi-Kasatori"}'::jsonb,
  34.9384181,
  135.8545591,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  4231621905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_amino',
  '網野町網野',
  'あみのちょうあみの',
  '{"en":"Aminocho-Amino"}'::jsonb,
  35.6811781,
  135.029311,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  4695272533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_gokasho',
  '五ケ庄',
  'ごかしょう',
  '{"en":"Gokasho"}'::jsonb,
  34.9120754,
  135.808733,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5049967292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shitsukawa',
  '志津川',
  'しつかわ',
  '{"en":"Shitsukawa"}'::jsonb,
  34.8890683,
  135.8270477,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5839817792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashi_kasatori',
  '東笠取',
  'ひがしかさとり',
  '{"en":"Higashi-Kasatori"}'::jsonb,
  34.9394708,
  135.8696129,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5839817793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_somada',
  '杣田',
  'そまだ',
  '{"en":"Somada"}'::jsonb,
  34.7892768,
  135.9033894,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minami',
  '南',
  'みなみ',
  '{"en":"Minami"}'::jsonb,
  34.7911976,
  135.9059966,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_白栖',
  '白栖',
  '白栖',
  NULL,
  34.7964664,
  135.8891201,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sono',
  '園',
  'その',
  '{"en":"Sono"}'::jsonb,
  34.8085181,
  135.9087324,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_monzen',
  '門前',
  'もんぜん',
  '{"en":"Monzen"}'::jsonb,
  34.8080071,
  135.9202337,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_bessho',
  '別所',
  'べっしょ',
  '{"en":"Bessho"}'::jsonb,
  34.8036905,
  135.9014475,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamatsuka',
  '釜塚',
  'かまつか',
  '{"en":"Kamatsuka"}'::jsonb,
  34.7964488,
  135.9062648,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5872941809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawara',
  '河原',
  'かわら',
  '{"en":"Kawara"}'::jsonb,
  35.5385123,
  135.1916385,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sumiyoshi',
  '住吉',
  'すみよし',
  '{"en":"Sumiyoshi"}'::jsonb,
  35.5393242,
  135.1914024,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirakase',
  '白柏',
  'しらかせ',
  '{"en":"Shirakase"}'::jsonb,
  35.5383552,
  135.1908338,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamachi',
  '宮町',
  'みやまち',
  '{"en":"Miyamachi"}'::jsonb,
  35.5402584,
  135.1891011,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ebisu',
  '蛭子',
  'えびす',
  '{"en":"Ebisu"}'::jsonb,
  35.5390536,
  135.1900774,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikenotani',
  '池ノ谷',
  'いけのたに',
  '{"en":"Ikenotani"}'::jsonb,
  35.5381413,
  135.1887095,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mannenshinchi',
  '万年新地',
  'まんねんしんち',
  '{"en":"Mannenshinchi"}'::jsonb,
  35.5373468,
  135.1897824,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ogawa',
  '小川',
  'おがわ',
  '{"en":"Ogawa"}'::jsonb,
  35.5362118,
  135.1896,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamoto',
  '宮本',
  'みやもと',
  '{"en":"Miyamoto"}'::jsonb,
  35.5346403,
  135.1944172,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yorozumachi',
  '万町',
  'よろずまち',
  '{"en":"Yorozumachi"}'::jsonb,
  35.5356836,
  135.1929635,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmachi',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  35.5362948,
  135.1939076,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uoya',
  '魚屋',
  'うおや',
  '{"en":"Uoya"}'::jsonb,
  35.5375192,
  135.1953667,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinhama',
  '新浜',
  'しんはま',
  '{"en":"Shinhama"}'::jsonb,
  35.5377047,
  135.1938701,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hamamachi',
  '浜町',
  'はままち',
  '{"en":"Hamamachi"}'::jsonb,
  35.5390558,
  135.1941034,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5896073777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okubo',
  '大久保',
  'おおくぼ',
  '{"en":"Okubo"}'::jsonb,
  35.533991,
  135.1925975,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanayadani',
  '金屋谷',
  'かなやだに',
  '{"en":"Kanayadani"}'::jsonb,
  35.5341581,
  135.1907995,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyokaido',
  '京街道',
  'きょうかいどう',
  '{"en":"Kyokaido"}'::jsonb,
  35.5328275,
  135.1933761,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yanaginawate',
  '柳縄手',
  'やなぎなわて',
  '{"en":"Yanaginawate"}'::jsonb,
  35.5336742,
  135.1945865,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyoguchimachi',
  '京口町',
  'きょうぐちまち',
  '{"en":"Kyoguchimachi"}'::jsonb,
  35.5312203,
  135.1931283,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ryoshi',
  '猟師',
  'りょうし',
  '{"en":"Ryoshi"}'::jsonb,
  35.5309554,
  135.190481,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kinobe',
  '木ノ部',
  'きのべ',
  '{"en":"Kinobe"}'::jsonb,
  35.530483,
  135.1919604,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyoguchi',
  '京口',
  'きょうぐち',
  '{"en":"Kyoguchi"}'::jsonb,
  35.5298436,
  135.1931071,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_babasaki',
  '馬場先',
  'ばばさき',
  '{"en":"Babasaki"}'::jsonb,
  35.5319099,
  135.1951017,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakanocho',
  '中ノ丁',
  'なかのちょう',
  '{"en":"Nakanocho"}'::jsonb,
  35.5327498,
  135.1969136,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sotogawa',
  '外側',
  'そとがわ',
  '{"en":"Sotogawa"}'::jsonb,
  35.5336385,
  135.1985646,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimasaki',
  '島崎',
  'しまさき',
  '{"en":"Shimasaki"}'::jsonb,
  35.5376131,
  135.196511,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsuruga',
  '鶴賀',
  'つるが',
  '{"en":"Tsuruga"}'::jsonb,
  35.5364868,
  135.1999442,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hajimachi',
  '波路町',
  'はじまち',
  '{"en":"Hajimachi"}'::jsonb,
  35.5394115,
  135.2057593,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_anchi',
  '安智',
  'あんち',
  '{"en":"Anchi"}'::jsonb,
  35.5343958,
  135.2019398,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5900888776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_suginosue',
  '杉末',
  'すぎのすえ',
  '{"en":"Suginosue"}'::jsonb,
  35.546893,
  135.1863062,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5916589450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ryoshi_quarter',
  '漁師',
  'りょうし',
  '{"en":"Ryoshi"}'::jsonb,
  35.5418587,
  135.1913964,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5916589451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawamukai',
  '川向',
  'かわむかい',
  '{"en":"Kawamukai"}'::jsonb,
  35.5416268,
  135.189722,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5916589452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shishizaki',
  '獅子崎',
  'ししざき',
  '{"en":"Shishizaki"}'::jsonb,
  35.5554037,
  135.2117014,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5920357538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_reihei',
  '加茂町例幣',
  'かもちょうれいへい',
  '{"en":"Kamocho-Reihei"}'::jsonb,
  34.7720581,
  135.8618152,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  5982559777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_ashiu',
  '美山町芦生',
  'みやまちょうあしう',
  '{"en":"Miyamacho-Ashiu"}'::jsonb,
  35.3101187,
  135.7142816,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6266747940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_taki',
  '滝',
  'たき',
  '{"en":"Taki"}'::jsonb,
  35.4804851,
  135.0706816,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6318362350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoza',
  '与謝',
  'よざ',
  '{"en":"Yoza"}'::jsonb,
  35.4663655,
  135.0799513,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6318362354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_仏谷',
  '仏谷',
  '仏谷',
  NULL,
  35.4378041,
  135.0702095,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6318362358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oguracho',
  '小倉町',
  'おぐらちょう',
  '{"en":"Oguracho"}'::jsonb,
  34.8962492,
  135.7806194,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6326639900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_isedacho',
  '伊勢田町',
  'いせだちょう',
  '{"en":"Isedacho"}'::jsonb,
  34.8905534,
  135.76922,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6347762545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ryokuenzaka',
  '緑苑坂',
  'りょくえんざか',
  '{"en":"Ryokuenzaka"}'::jsonb,
  34.8614699,
  135.8920893,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6699540219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hironocho',
  '広野町',
  'ひろのちょう',
  '{"en":"Hironocho"}'::jsonb,
  34.8723898,
  135.7870003,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6710072254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tai',
  '田井',
  'たい',
  '{"en":"Tai"}'::jsonb,
  35.565984,
  135.4543758,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734475570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nariu',
  '成生',
  'なりう',
  '{"en":"Nariu"}'::jsonb,
  35.578976,
  135.4472496,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734475571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nohara',
  '野原',
  'のはら',
  '{"en":"Nohara"}'::jsonb,
  35.5705864,
  135.42957,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oyama',
  '大山',
  'おおやま',
  '{"en":"Oyama"}'::jsonb,
  35.5483589,
  135.4516041,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obase',
  '小橋',
  'おばせ',
  '{"en":"Obase"}'::jsonb,
  35.5593511,
  135.4034283,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564824,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mihama',
  '三浜',
  'みはま',
  '{"en":"Mihama"}'::jsonb,
  35.5563626,
  135.39482,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sezaki',
  '瀬崎',
  'せざき',
  '{"en":"Sezaki"}'::jsonb,
  35.5415552,
  135.3502276,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_onyu',
  '大丹生',
  'おおにゅう',
  '{"en":"Onyu"}'::jsonb,
  35.5250466,
  135.3449828,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_taira',
  '平',
  'たいら',
  '{"en":"Taira"}'::jsonb,
  35.518039,
  135.3873968,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_akano',
  '赤野',
  'あかの',
  '{"en":"Akano"}'::jsonb,
  35.5221804,
  135.3883171,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tochio',
  '栃尾',
  'とちお',
  '{"en":"Tochio"}'::jsonb,
  35.532446,
  135.4364781,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawabehara',
  '河辺原',
  'かわべはら',
  '{"en":"Kawabehara"}'::jsonb,
  35.5292572,
  135.4242222,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawabeyuri',
  '河辺由里',
  'かわべゆり',
  '{"en":"Kawabeyuri"}'::jsonb,
  35.5284936,
  135.4198917,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_muroji',
  '室牛',
  'むろじ',
  '{"en":"Muroji"}'::jsonb,
  35.5241513,
  135.4192944,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishiya',
  '西屋',
  'にしや',
  '{"en":"Nishiya"}'::jsonb,
  35.5261164,
  135.410919,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawabenaka',
  '河辺中',
  'かわべなか',
  '{"en":"Kawabenaka"}'::jsonb,
  35.5228856,
  135.4036835,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chitose',
  '千歳',
  '千歳',
  '{"en":"Chitose"}'::jsonb,
  35.5119632,
  135.3480351,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sabaka',
  '佐波賀',
  'さばか',
  '{"en":"Sabaka"}'::jsonb,
  35.5066842,
  135.3680809,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakadacho',
  '中田町',
  'なかだちょう',
  '{"en":"Nakadacho"}'::jsonb,
  35.5136488,
  135.4034592,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obashimo',
  '大波下',
  'おおばしも',
  '{"en":"Obashimo"}'::jsonb,
  35.5038408,
  135.3994338,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obakami',
  '大波上',
  'おおばかみ',
  '{"en":"Obakami"}'::jsonb,
  35.5041863,
  135.4142227,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sasabe',
  '笹部',
  'ささべ',
  '{"en":"Sasabe"}'::jsonb,
  35.5194574,
  135.451472,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sugiyama',
  '杉山',
  'すぎやま',
  '{"en":"Sugiyama"}'::jsonb,
  35.506484,
  135.4629752,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_noborio',
  '登尾',
  'のぼりお',
  '{"en":"Noborio"}'::jsonb,
  35.5082082,
  135.4451681,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734564847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amarube_shimo',
  '余部下',
  'あまるべしも',
  '{"en":"Amarube shimo"}'::jsonb,
  35.4845218,
  135.3744665,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagahama',
  '長浜',
  'ながはま',
  '{"en":"Nagahama"}'::jsonb,
  35.4881758,
  135.3757166,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagahama_quarter',
  '長浜',
  'ながはま',
  '{"en":"Nagahama"}'::jsonb,
  35.4838398,
  135.3600093,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wada',
  '和田',
  'わだ',
  '{"en":"Wada"}'::jsonb,
  35.4770274,
  135.348831,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirahamadai',
  '白浜台',
  'しらはまだい',
  '{"en":"Shirahamadai"}'::jsonb,
  35.4775564,
  135.3532246,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoagu',
  '下安久',
  'しもあぐ',
  '{"en":"Shimoagu"}'::jsonb,
  35.4706447,
  135.3317757,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoagu_quarter',
  '下安久',
  'しもあぐ',
  '{"en":"Shimoagu"}'::jsonb,
  35.4578686,
  135.3323579,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiagu',
  '上安久',
  'かみあぐ',
  '{"en":"Kamiagu"}'::jsonb,
  35.4524305,
  135.336227,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ueyasu',
  '上安',
  'うえやす',
  '{"en":"Ueyasu"}'::jsonb,
  35.4531693,
  135.3446843,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kita',
  '喜多',
  'きた',
  '{"en":"Kita"}'::jsonb,
  35.4611007,
  135.3115357,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701365,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okimi',
  '大君',
  'おおきみ',
  '{"en":"Okimi"}'::jsonb,
  35.4726674,
  135.3111459,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701366,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoshida',
  '吉田',
  'よしだ',
  '{"en":"Yoshida"}'::jsonb,
  35.4821711,
  135.316299,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aoi',
  '青井',
  'あおい',
  '{"en":"Aoi"}'::jsonb,
  35.4911836,
  135.3211949,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701368,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirasugi',
  '白杉',
  'しらすぎ',
  '{"en":"Shirasugi"}'::jsonb,
  35.498348,
  135.3324742,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701369,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashikanzaki',
  '東神崎',
  'ひがしかんざき',
  '{"en":"Higashikanzaki"}'::jsonb,
  35.5126742,
  135.3007123,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishikanzaki',
  '西神崎',
  'にしかんざき',
  '{"en":"Nishikanzaki"}'::jsonb,
  35.5133659,
  135.2946431,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701373,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yugo',
  '油江',
  'ゆごう',
  '{"en":"Yugo"}'::jsonb,
  35.504002,
  135.2943762,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701374,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamaya',
  '蒲江',
  'かまや',
  '{"en":"Kamaya"}'::jsonb,
  35.4962485,
  135.2919654,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizuma',
  '水間',
  'みずま',
  '{"en":"Mizuma"}'::jsonb,
  35.4747081,
  135.2889493,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakayama',
  '中山',
  'なかやま',
  '{"en":"Nakayama"}'::jsonb,
  35.4710173,
  135.2827701,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701377,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimohigashi',
  '下東',
  'しもひがし',
  '{"en":"Shimohigashi"}'::jsonb,
  35.4608061,
  135.2891478,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamihigashi',
  '上東',
  'かみひがし',
  '{"en":"Kamihigashi"}'::jsonb,
  35.4544715,
  135.2740272,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mikkaichi',
  '三日市',
  'みっかいち',
  '{"en":"Mikkaichi"}'::jsonb,
  35.4436384,
  135.2672428,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kutami',
  '久田美',
  'くたみ',
  '{"en":"Kutami"}'::jsonb,
  35.4199635,
  135.2548058,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuwagaishimo',
  '桑飼下',
  'くわがいしも',
  '{"en":"Kuwagaishimo"}'::jsonb,
  35.4220793,
  135.2369316,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_桑飼上',
  '桑飼上',
  '桑飼上',
  NULL,
  35.4224115,
  135.2163537,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701383,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_jito',
  '地頭',
  'じとう',
  '{"en":"Jito"}'::jsonb,
  35.4351053,
  135.2106459,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734701384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okadayuri',
  '岡田由里',
  'おかだゆり',
  '{"en":"Okadayuri"}'::jsonb,
  35.4360843,
  135.2251299,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734793485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shidaka',
  '志高',
  'しだか',
  '{"en":"Shidaka"}'::jsonb,
  35.4334269,
  135.2483471,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734793486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okawa',
  '大川',
  'おおかわ',
  '{"en":"Okawa"}'::jsonb,
  35.4454197,
  135.2579816,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734793487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatta',
  '八田',
  'はった',
  '{"en":"Hatta"}'::jsonb,
  35.4566988,
  135.2680749,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734793488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatochi',
  '八戸地',
  'はとち',
  '{"en":"Hatochi"}'::jsonb,
  35.4600233,
  135.2585464,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734793489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maruta',
  '丸田',
  'まるた',
  '{"en":"Maruta"}'::jsonb,
  35.4612214,
  135.2723021,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wae',
  '和江',
  'わえ',
  '{"en":"Wae"}'::jsonb,
  35.4787951,
  135.2757368,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ishiura',
  '石浦',
  'いしうら',
  '{"en":"Ishiura"}'::jsonb,
  35.5004242,
  135.2854999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yura',
  '由良',
  'ゆら',
  '{"en":"Yura"}'::jsonb,
  35.517217,
  135.2786642,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_waki',
  '脇',
  'わき',
  '{"en":"Waki"}'::jsonb,
  35.5364796,
  135.2430902,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakamura',
  '中村',
  'なかむら',
  '{"en":"Nakamura"}'::jsonb,
  35.5385749,
  135.2409444,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kodera',
  '小寺',
  'こでら',
  '{"en":"Kodera"}'::jsonb,
  35.5412638,
  135.2388022,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamanaka',
  '山中',
  'やまなか',
  '{"en":"Yamanaka"}'::jsonb,
  35.5310052,
  135.2274114,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaibara',
  '皆原',
  'かいばら',
  '{"en":"Kaibara"}'::jsonb,
  35.534369,
  135.2162005,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_joshi',
  '上司',
  'じょうし',
  '{"en":"Joshi"}'::jsonb,
  35.5472602,
  135.2364243,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakatsu',
  '中津',
  'なかつ',
  '{"en":"Nakatsu"}'::jsonb,
  35.5556421,
  135.2383057,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_odashukuno',
  '小田宿野',
  'おだしゅくの',
  '{"en":"Odashukuno"}'::jsonb,
  35.5626207,
  135.250621,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimakage',
  '島陰',
  'しまかげ',
  '{"en":"Shimakage"}'::jsonb,
  35.5747952,
  135.2500907,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tai_quarter',
  '田井',
  'たい',
  '{"en":"Tai"}'::jsonb,
  35.5837246,
  135.2424783,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yawara',
  '矢原',
  'やわら',
  '{"en":"Yawara"}'::jsonb,
  35.570055,
  135.2279263,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chishi',
  '獅子',
  'ちし',
  '{"en":"Chishi"}'::jsonb,
  35.5662002,
  135.2206408,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734839284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_haji',
  '波路',
  'はじ',
  '{"en":"Haji"}'::jsonb,
  35.5399559,
  135.2082708,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shingu',
  '新宮',
  'しんぐう',
  '{"en":"Shingu"}'::jsonb,
  35.5166853,
  135.2317999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_monju',
  '文珠',
  'もんじゅ',
  '{"en":"Monju"}'::jsonb,
  35.5558357,
  135.1826755,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_suzu',
  '須津',
  'すづ',
  '{"en":"Suzu"}'::jsonb,
  35.5529542,
  135.1536995,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yumiki',
  '弓木',
  'ゆみき',
  '{"en":"Yumiki"}'::jsonb,
  35.5614117,
  135.1392116,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862390,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwataki',
  '岩滝',
  'いわたき',
  '{"en":"Iwataki"}'::jsonb,
  35.5656671,
  135.1552367,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862391,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_otokoyama',
  '男山',
  'おとこやま',
  '{"en":"Otokoyama"}'::jsonb,
  35.5716338,
  135.165482,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kokubun',
  '国分',
  'こくぶん',
  '{"en":"Kokubun"}'::jsonb,
  35.5782779,
  135.1779339,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizoshiri',
  '溝尻',
  'みぞしり',
  '{"en":"Mizoshiri"}'::jsonb,
  35.5773727,
  135.184798,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_komatsu',
  '小松',
  'こまつ',
  '{"en":"Komatsu"}'::jsonb,
  35.5804376,
  135.1854795,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakano',
  '中野',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  35.5823487,
  135.1894405,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862396,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ogaki',
  '大垣',
  'おおがき',
  '{"en":"Ogaki"}'::jsonb,
  35.5835256,
  135.1944841,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ejiri',
  '江尻',
  'えじり',
  '{"en":"Ejiri"}'::jsonb,
  35.5813371,
  135.199889,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nanbano',
  '難波野',
  'なんばの',
  '{"en":"Nanbano"}'::jsonb,
  35.5855777,
  135.2004767,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862399,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hioki',
  '日置',
  'ひおき',
  '{"en":"Hioki"}'::jsonb,
  35.608544,
  135.2202736,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862400,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_satohami',
  '里波見',
  'さとはみ',
  '{"en":"Satohami"}'::jsonb,
  35.6270997,
  135.2428322,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakahami',
  '中波見',
  'なかはみ',
  '{"en":"Nakahami"}'::jsonb,
  35.6338143,
  135.2289706,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagae',
  '長江',
  'ながえ',
  '{"en":"Nagae"}'::jsonb,
  35.6508861,
  135.2530675,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwagahana',
  '岩ケ鼻',
  'いわがはな',
  '{"en":"Iwagahana"}'::jsonb,
  35.6596461,
  135.2590894,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862404,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tonogaki',
  '外垣',
  'とのがき',
  '{"en":"Tonogaki"}'::jsonb,
  35.6635896,
  135.2512223,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862405,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higatani',
  '日ケ谷',
  'ひがたに',
  '{"en":"Higatani"}'::jsonb,
  35.6682952,
  135.2449612,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862406,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oshima',
  '大島',
  'おおしま',
  '{"en":"Oshima"}'::jsonb,
  35.667445,
  135.2648994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862407,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kameshima',
  '亀島',
  'かめしま',
  '{"en":"Kameshima"}'::jsonb,
  35.6659002,
  135.2922098,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_立石',
  '立石',
  '立石',
  NULL,
  35.6695365,
  135.2941216,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirata',
  '平田',
  'ひらた',
  '{"en":"Hirata"}'::jsonb,
  35.6785926,
  135.2891519,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ohara',
  '大原',
  'おおはら',
  '{"en":"Ohara"}'::jsonb,
  35.6864183,
  135.2932718,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nii',
  '新井',
  'にい',
  '{"en":"Nii"}'::jsonb,
  35.6971127,
  135.3045321,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tomari',
  '泊',
  'とまり',
  '{"en":"Tomari"}'::jsonb,
  35.7035905,
  135.2871658,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imuro',
  '井室',
  'いむろ',
  '{"en":"Imuro"}'::jsonb,
  35.6978053,
  135.277467,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatadani',
  '畑谷',
  'はただに',
  '{"en":"Hatadani"}'::jsonb,
  35.7007502,
  135.2705362,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_rokumanbu',
  '六万部',
  'ろくまんぶ',
  '{"en":"Rokumanbu"}'::jsonb,
  35.702789,
  135.282531,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_toge',
  '峠',
  'とうげ',
  '{"en":"Toge"}'::jsonb,
  35.7109763,
  135.272922,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734862430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsumo',
  '津母',
  'つも',
  '{"en":"Tsumo"}'::jsonb,
  35.7147094,
  135.284495,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865172,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nomuro',
  '野室',
  'のむろ',
  '{"en":"Nomuro"}'::jsonb,
  35.7244017,
  135.2822752,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865174,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honjohama',
  '本庄浜',
  'ほんじょうはま',
  '{"en":"Honjohama"}'::jsonb,
  35.7332244,
  135.2710313,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honjouji',
  '本庄宇治',
  'ほんじょううじ',
  '{"en":"Honjouji"}'::jsonb,
  35.7310123,
  135.2540154,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honjoage',
  '本庄上',
  'ほんじょうあげ',
  '{"en":"Honjoage"}'::jsonb,
  35.7171456,
  135.251481,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_choen',
  '長延',
  'ちょうえん',
  '{"en":"Choen"}'::jsonb,
  35.74481,
  135.2385951,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamanyu',
  '蒲入',
  'かまにゅう',
  '{"en":"Kamanyu"}'::jsonb,
  35.7549278,
  135.2497746,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_sodeshi',
  '丹後町袖志',
  'たんごちょうそでし',
  '{"en":"Tangocho-Sodeshi"}'::jsonb,
  35.762532,
  135.2036689,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734865184,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_owa',
  '丹後町尾和',
  'たんごちょうおわ',
  '{"en":"Tangocho-Owa"}'::jsonb,
  35.7618704,
  135.1922333,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734875585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_nakahama',
  '丹後町中浜',
  'たんごちょうなかはま',
  '{"en":"Tangocho-Nakahama"}'::jsonb,
  35.7595503,
  135.1792211,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734875586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_kyuso',
  '丹後町久僧',
  'たんごちょうきゅうそ',
  '{"en":"Tangocho-Kyuso"}'::jsonb,
  35.7563894,
  135.175243,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734875587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_ueno',
  '丹後町上野',
  'たんごちょううえの',
  '{"en":"Tangocho-Ueno"}'::jsonb,
  35.7515385,
  135.169232,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734875588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_hei',
  '丹後町平',
  'たんごちょうへい',
  '{"en":"Tangocho-Hei"}'::jsonb,
  35.7466563,
  135.1644371,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6734875589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okubocho',
  '大久保町',
  'おおくぼちょう',
  '{"en":"Okubocho"}'::jsonb,
  34.8711377,
  135.7728772,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6742356737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_kamakura',
  '東別院町鎌倉',
  'ひがしべついんちょうかまくら',
  '{"en":"Higashibetsuincho-Kamakura"}'::jsonb,
  34.9248061,
  135.5503777,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841256,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_kaibara',
  '東別院町栢原',
  'ひがしべついんちょうかいばら',
  '{"en":"Higashibetsuincho-Kaibara"}'::jsonb,
  34.9273823,
  135.5673836,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_yuya',
  '東別院町湯谷',
  'ひがしべついんちょうゆや',
  '{"en":"Higashibetsuincho-Yuya"}'::jsonb,
  34.9322339,
  135.532787,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841258,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_kuradani',
  '東別院町倉谷',
  'ひがしべついんちょうくらだに',
  '{"en":"Higashibetsuincho-Kuradani"}'::jsonb,
  34.9326266,
  135.5481082,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841259,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_nange',
  '東別院町南掛',
  'ひがしべついんちょうなんげ',
  '{"en":"Higashibetsuincho-Nange"}'::jsonb,
  34.9419125,
  135.5445936,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841260,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_toge',
  '東別院町東掛',
  'ひがしべついんちょうとうげ',
  '{"en":"Higashibetsuincho-Toge"}'::jsonb,
  34.9473252,
  135.553886,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841261,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_koizumi',
  '東別院町小泉',
  'ひがしべついんちょうこいずみ',
  '{"en":"Higashibetsuincho-Koizumi"}'::jsonb,
  34.96414,
  135.5614809,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_kamihara',
  '東別院町神原',
  'ひがしべついんちょうかみはら',
  '{"en":"Higashibetsuincho-Kamihara"}'::jsonb,
  34.9770877,
  135.5592413,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_koji',
  '西別院町神地',
  'にしべついんちょうこうじ',
  '{"en":"Nishibetsuincho-Koji"}'::jsonb,
  34.9445898,
  135.4962731,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_yunohara',
  '西別院町柚原',
  'にしべついんちょうゆのはら',
  '{"en":"Nishibetsuincho-Yunohara"}'::jsonb,
  34.9528962,
  135.512584,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_inukanno',
  '西別院町犬甘野',
  'にしべついんちょういぬかんの',
  '{"en":"Nishibetsuincho-Inukanno"}'::jsonb,
  34.9663524,
  135.5041511,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_waroji',
  '西別院町笑路',
  'にしべついんちょうわろうじ',
  '{"en":"Nishibetsuincho-Waroji"}'::jsonb,
  34.968319,
  135.5138225,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmecho_higashikaya',
  '本梅町東加舎',
  'ほんめちょうひがしかや',
  '{"en":"Honmecho-Higashikaya"}'::jsonb,
  35.0068748,
  135.4847929,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmecho_nishikaya',
  '本梅町西加舎',
  'ほんめちょうにしかや',
  '{"en":"Honmecho-Nishikaya"}'::jsonb,
  35.0089753,
  135.4740244,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmecho_ide',
  '本梅町井手',
  'ほんめちょういで',
  '{"en":"Honmecho-Ide"}'::jsonb,
  35.0135836,
  135.4841032,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmecho_hiramatsu',
  '本梅町平松',
  'ほんめちょうひらまつ',
  '{"en":"Honmecho-Hiramatsu"}'::jsonb,
  35.0198976,
  135.4890931,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmecho_nakano',
  '本梅町中野',
  'ほんめちょうなかの',
  '{"en":"Honmecho-Nakano"}'::jsonb,
  35.0242885,
  135.4832715,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyazakicho_inokura',
  '宮前町猪倉',
  'みやざきちょういのくら',
  '{"en":"Miyazakicho-Inokura"}'::jsonb,
  35.0258884,
  135.4994158,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyazakicho_miyagawa',
  '宮前町宮川',
  'みやざきちょうみやがわ',
  '{"en":"Miyazakicho-Miyagawa"}'::jsonb,
  35.040647,
  135.4823667,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihonmecho_nakano',
  '東本梅町中野',
  'ひがしほんめちょうなかの',
  '{"en":"Higashihonmecho-Nakano"}'::jsonb,
  35.0453684,
  135.4764229,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihonmecho_akakuma',
  '東本梅町赤熊',
  'ひがしほんめちょうあかくま',
  '{"en":"Higashihonmecho-Akakuma"}'::jsonb,
  35.0488115,
  135.4743844,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihonmecho_matsukuma',
  '東本梅町松熊',
  'ひがしほんめちょうまつくま',
  '{"en":"Higashihonmecho-Matsukuma"}'::jsonb,
  35.0512357,
  135.4802209,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihonmecho_higashiotani',
  '東本梅町東大谷',
  'ひがしほんめちょうひがしおおたに',
  '{"en":"Higashihonmecho-Higashiotani"}'::jsonb,
  35.0486007,
  135.4665095,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_minamiotani',
  '園部町南大谷',
  'そのべちょうみなみおおたに',
  '{"en":"Sonobecho-Minamiotani"}'::jsonb,
  35.0541272,
  135.4604629,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_wakamori',
  '園部町若森',
  'そのべちょうわかもり',
  '{"en":"Sonobecho-Wakamori"}'::jsonb,
  35.0582198,
  135.4603127,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748841284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_tonodani',
  '園部町殿谷',
  'そのべちょうとのだに',
  '{"en":"Sonobecho-Tonodani"}'::jsonb,
  35.0662289,
  135.4657844,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748851185,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_habu',
  '園部町埴生',
  'そのべちょうはぶ',
  '{"en":"Sonobecho-Habu"}'::jsonb,
  35.0625582,
  135.4456786,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748851186,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihonmecho_ouchi',
  '東本梅町大内',
  'ひがしほんめちょうおおうち',
  '{"en":"Higashihonmecho-Ouchi"}'::jsonb,
  35.0602304,
  135.4819336,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748851187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyazakicho_kozaki',
  '宮前町神前',
  'みやざきちょうこうざき',
  '{"en":"Miyazakicho-Kozaki"}'::jsonb,
  35.0513601,
  135.5135926,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748851188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_manganji',
  '西別院町万願寺',
  'にしべついんちょうまんがんじ',
  '{"en":"Nishibetsuincho-Manganji"}'::jsonb,
  34.9433764,
  135.5277626,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748891990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatanocho_sengahata',
  '畑野町千ケ畑',
  'はたのちょうせんがはた',
  '{"en":"Hatanocho-Sengahata"}'::jsonb,
  35.0140099,
  135.4475934,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748892004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatanocho_hirono',
  '畑野町広野',
  'はたのちょうひろの',
  '{"en":"Hatanocho-Hirono"}'::jsonb,
  35.0117234,
  135.4288701,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6748892005,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuse',
  '久世',
  'くせ',
  '{"en":"Kuse"}'::jsonb,
  34.8608801,
  135.7699656,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6750697519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_ono',
  '加茂町大野',
  'かもちょうおおの',
  '{"en":"Kamocho-Ono"}'::jsonb,
  34.7502519,
  135.8582532,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6829843995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_加茂町兎並',
  '加茂町兎並',
  '加茂町兎並',
  NULL,
  34.7516227,
  135.8672869,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6829843996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_anao',
  '曽我部町穴太',
  'そがべちょうあなお',
  '{"en":"Sogabecho-Anao"}'::jsonb,
  35.0074018,
  135.544247,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6831848928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_izumigaoka',
  '泉が丘',
  'いずみがおか',
  '{"en":"Izumigaoka"}'::jsonb,
  34.9145813,
  135.6837916,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6853142587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shironosato',
  '城の里',
  'しろのさと',
  '{"en":"Shironosato"}'::jsonb,
  34.9162286,
  135.7050937,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6897144308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oyamazaki',
  '大山崎',
  'おおやまざき',
  '{"en":"Oyamazaki"}'::jsonb,
  34.8983567,
  135.6862727,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7194482747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_shimotsuneyoshi',
  '大宮町下常吉',
  'おおみやちょうしもつねよし',
  '{"en":"Omiyacho-Shimotsuneyoshi"}'::jsonb,
  35.5575421,
  135.0722908,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7206522485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_kamitsuneyoshi',
  '大宮町上常吉',
  'おおみやちょうかみつねよし',
  '{"en":"Omiyacho-Kamitsuneyoshi"}'::jsonb,
  35.5463866,
  135.0695658,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7206522486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_iso',
  '網野町磯',
  'あみのちょういそ',
  '{"en":"Aminocho-Iso"}'::jsonb,
  35.6892454,
  134.9952862,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7265482382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_kamiyoshi',
  '八木町神吉',
  'やぎちょうかみよし',
  '{"en":"Yagicho-Kamiyoshi"}'::jsonb,
  35.1117023,
  135.5796887,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7449011518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_sasari',
  '美山町佐々里',
  'みやまちょうささり',
  '{"en":"Miyamacho-Sasari"}'::jsonb,
  35.2805285,
  135.6939148,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shiraishi',
  '美山町白石',
  'みやまちょうしらいし',
  '{"en":"Miyamacho-Shiraishi"}'::jsonb,
  35.2922427,
  135.6954815,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_tauta',
  '美山町田歌',
  'みやまちょうたうた',
  '{"en":"Miyamacho-Tauta"}'::jsonb,
  35.3250309,
  135.6780453,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_ewa',
  '美山町江和',
  'みやまちょうえわ',
  '{"en":"Miyamacho-Ewa"}'::jsonb,
  35.3208226,
  135.6588647,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_chimi',
  '美山町知見',
  'みやまちょうちみ',
  '{"en":"Miyamacho-Chimi"}'::jsonb,
  35.3447597,
  135.6448908,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shimo',
  '美山町下',
  'みやまちょうしも',
  '{"en":"Miyamacho-Shimo"}'::jsonb,
  35.3244593,
  135.6443229,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_naka',
  '美山町中',
  'みやまちょうなか',
  '{"en":"Miyamacho-Naka"}'::jsonb,
  35.3128725,
  135.6363115,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_kita',
  '美山町北',
  'みやまちょうきた',
  '{"en":"Miyamacho-Kita"}'::jsonb,
  35.3146897,
  135.623941,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_minami',
  '美山町南',
  'みやまちょうみなみ',
  '{"en":"Miyamacho-Minami"}'::jsonb,
  35.3080485,
  135.6257315,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_kawauchidani',
  '美山町河内谷',
  'みやまちょうかわうちだに',
  '{"en":"Miyamacho-Kawauchidani"}'::jsonb,
  35.3031725,
  135.643501,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_uchikubo',
  '美山町内久保',
  'みやまちょううちくぼ',
  '{"en":"Miyamacho-Uchikubo"}'::jsonb,
  35.3049143,
  135.6176883,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_arakura',
  '美山町荒倉',
  'みやまちょうあらくら',
  '{"en":"Miyamacho-Arakura"}'::jsonb,
  35.2908696,
  135.6020567,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_agake',
  '美山町安掛',
  'みやまちょうあがけ',
  '{"en":"Miyamacho-Agake"}'::jsonb,
  35.2791679,
  135.5848704,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_nozoe',
  '美山町野添',
  'みやまちょうのぞえ',
  '{"en":"Miyamacho-Nozoe"}'::jsonb,
  35.2766622,
  135.5927652,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_nagao',
  '美山町長尾',
  'みやまちょうながお',
  '{"en":"Miyamacho-Nagao"}'::jsonb,
  35.2718338,
  135.587679,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_kamihiraya',
  '美山町上平屋',
  'みやまちょうかみひらや',
  '{"en":"Miyamacho-Kamihiraya"}'::jsonb,
  35.2765733,
  135.5780532,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shimohiraya',
  '美山町下平屋',
  'みやまちょうしもひらや',
  '{"en":"Miyamacho-Shimohiraya"}'::jsonb,
  35.2735137,
  135.5725303,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_fukui',
  '美山町福居',
  'みやまちょうふくい',
  '{"en":"Miyamacho-Fukui"}'::jsonb,
  35.3463843,
  135.5635499,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_morisato',
  '美山町盛郷',
  'みやまちょうもりさと',
  '{"en":"Miyamacho-Morisato"}'::jsonb,
  35.3297663,
  135.5683115,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_toyosato',
  '美山町豊郷',
  'みやまちょうとよさと',
  '{"en":"Miyamacho-Toyosato"}'::jsonb,
  35.3351515,
  135.5355961,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_tsurugaoka',
  '美山町鶴ケ岡',
  'みやまちょうつるがおか',
  '{"en":"Miyamacho-Tsurugaoka"}'::jsonb,
  35.321107,
  135.5547725,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_takano',
  '美山町高野',
  'みやまちょうたかの',
  '{"en":"Miyamacho-Takano"}'::jsonb,
  35.2981419,
  135.5588084,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shizuhara',
  '美山町静原',
  'みやまちょうしずはら',
  '{"en":"Miyamacho-Shizuhara"}'::jsonb,
  35.2811654,
  135.557166,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_izumi',
  '美山町和泉',
  'みやまちょういずみ',
  '{"en":"Miyamacho-Izumi"}'::jsonb,
  35.279127,
  135.5479561,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shima',
  '美山町島',
  'みやまちょうしま',
  '{"en":"Miyamacho-Shima"}'::jsonb,
  35.2701528,
  135.5519115,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_otomi',
  '美山町音海',
  'みやまちょうおとみ',
  '{"en":"Miyamacho-Otomi"}'::jsonb,
  35.2816235,
  135.4838389,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_kashiwara',
  '美山町樫原',
  'みやまちょうかしわら',
  '{"en":"Miyamacho-Kashiwara"}'::jsonb,
  35.2716912,
  135.4721966,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_mukaiyama',
  '美山町向山',
  'みやまちょうむかいやま',
  '{"en":"Miyamacho-Mukaiyama"}'::jsonb,
  35.2656653,
  135.4755655,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_obuchi',
  '美山町小渕',
  'みやまちょうおぶち',
  '{"en":"Miyamacho-Obuchi"}'::jsonb,
  35.2664806,
  135.4887836,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_hijitani',
  '美山町肱谷',
  'みやまちょうひじたに',
  '{"en":"Miyamacho-Hijitani"}'::jsonb,
  35.2643445,
  135.4976625,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_mitsuno',
  '美山町三埜',
  'みやまちょうみつの',
  '{"en":"Miyamacho-Mitsuno"}'::jsonb,
  35.2926196,
  135.5034779,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_ono',
  '美山町大野',
  'みやまちょうおおの',
  '{"en":"Miyamacho-Ono"}'::jsonb,
  35.2771181,
  135.513533,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_kayano',
  '美山町萱野',
  'みやまちょうかやの',
  '{"en":"Miyamacho-Kayano"}'::jsonb,
  35.2774343,
  135.5236817,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_joshi',
  '美山町上司',
  'みやまちょうじょうし',
  '{"en":"Miyamacho-Joshi"}'::jsonb,
  35.2837205,
  135.5326917,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_nagatani',
  '美山町長谷',
  'みやまちょうながたに',
  '{"en":"Miyamacho-Nagatani"}'::jsonb,
  35.2757108,
  135.5408072,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_shimoyoshida',
  '美山町下吉田',
  'みやまちょうしもよしだ',
  '{"en":"Miyamacho-Shimoyoshida"}'::jsonb,
  35.2654572,
  135.5612542,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_miyanowaki',
  '美山町宮脇',
  'みやまちょうみやのわき',
  '{"en":"Miyamacho-Miyanowaki"}'::jsonb,
  35.251556,
  135.5639839,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_itahashi',
  '美山町板橋',
  'みやまちょういたはし',
  '{"en":"Miyamacho-Itahashi"}'::jsonb,
  35.2420949,
  135.5617733,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_hara',
  '美山町原',
  'みやまちょうはら',
  '{"en":"Miyamacho-Hara"}'::jsonb,
  35.2335951,
  135.5718192,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7459158562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_sasae',
  '日吉町佐々江',
  'ひよしちょうささえ',
  '{"en":"Hiyoshicho-Sasae"}'::jsonb,
  35.2037082,
  135.5756078,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389872,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_yotsuya',
  '日吉町四ツ谷',
  'ひよしちょうよつや',
  '{"en":"Hiyoshicho-Yotsuya"}'::jsonb,
  35.2109672,
  135.5435454,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_hatago',
  '日吉町畑郷',
  'ひよしちょうはたごう',
  '{"en":"Hiyoshicho-Hatago"}'::jsonb,
  35.2216818,
  135.4847943,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_goma',
  '日吉町胡麻',
  'ひよしちょうごま',
  '{"en":"Hiyoshicho-Goma"}'::jsonb,
  35.198932,
  135.47122,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_kamigoma',
  '日吉町上胡麻',
  'ひよしちょうかみごま',
  '{"en":"Hiyoshicho-Kamigoma"}'::jsonb,
  35.1905014,
  135.4635314,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389878,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_honoda',
  '日吉町保野田',
  'ひよしちょうほのだ',
  '{"en":"Hiyoshicho-Honoda"}'::jsonb,
  35.1706923,
  135.4934192,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389881,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_tawara',
  '日吉町田原',
  'ひよしちょうたわら',
  '{"en":"Hiyoshicho-Tawara"}'::jsonb,
  35.1731276,
  135.5140348,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461389884,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_kihata',
  '日吉町生畑',
  'ひよしちょうきはた',
  '{"en":"Hiyoshicho-Kihata"}'::jsonb,
  35.1889907,
  135.5536864,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406396,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_kozumi',
  '日吉町木住',
  'ひよしちょうこずみ',
  '{"en":"Hiyoshicho-Kozumi"}'::jsonb,
  35.1704036,
  135.5286376,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_nakaseki',
  '日吉町中世木',
  'ひよしちょうなかせき',
  '{"en":"Hiyoshicho-Nakaseki"}'::jsonb,
  35.1580665,
  135.5435859,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_tonoda',
  '日吉町殿田',
  'ひよしちょうとのだ',
  '{"en":"Hiyoshicho-Tonoda"}'::jsonb,
  35.1545839,
  135.5026678,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406399,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_naka',
  '日吉町中',
  'ひよしちょうなか',
  '{"en":"Hiyoshicho-Naka"}'::jsonb,
  35.1506885,
  135.5173975,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_amawaka',
  '日吉町天若',
  'ひよしちょうあまわか',
  '{"en":"Hiyoshicho-Amawaka"}'::jsonb,
  35.1340708,
  135.5291052,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiyoshicho_shiwaga',
  '日吉町志和賀',
  'ひよしちょうしわが',
  '{"en":"Hiyoshicho-Shiwaga"}'::jsonb,
  35.1551438,
  135.4718508,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406406,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kumazaki',
  '園部町熊崎',
  'そのべちょうくまざき',
  '{"en":"Sonobecho-Kumazaki"}'::jsonb,
  35.1308268,
  135.4625969,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406410,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_uriuno',
  '園部町瓜生野',
  'そのべちょううりうの',
  '{"en":"Sonobecho-Uriuno"}'::jsonb,
  35.1233008,
  135.4690884,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406411,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_園部町内林',
  '園部町内林町',
  'そのべちょううちばやしまち',
  NULL,
  35.1233491,
  135.4769551,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406413,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_shindo',
  '園部町新堂',
  'そのべちょうしんどう',
  '{"en":"Sonobecho-Shindo"}'::jsonb,
  35.1308945,
  135.4764394,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406414,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_funaoka',
  '園部町船岡',
  'そのべちょうふなおか',
  '{"en":"Sonobecho-Funaoka"}'::jsonb,
  35.1372171,
  135.4916886,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406415,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_senzuma',
  '園部町千妻',
  'そのべちょうせんづま',
  '{"en":"Sonobecho-Senzuma"}'::jsonb,
  35.126568,
  135.488818,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_ochikata',
  '園部町越方',
  'そのべちょうおちかた',
  '{"en":"Sonobecho-Ochikata"}'::jsonb,
  35.1294616,
  135.4997423,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_takaya',
  '園部町高屋',
  'そのべちょうたかや',
  '{"en":"Sonobecho-Takaya"}'::jsonb,
  35.1214083,
  135.4997243,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_odo',
  '園部町大戸',
  'そのべちょうおおど',
  '{"en":"Sonobecho-Odo"}'::jsonb,
  35.1177821,
  135.5052902,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_sagiri',
  '園部町佐切',
  'そのべちょうさぎり',
  '{"en":"Sonobecho-Sagiri"}'::jsonb,
  35.1200905,
  135.5085068,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kumahara',
  '園部町熊原',
  'そのべちょうくまはら',
  '{"en":"Sonobecho-Kumahara"}'::jsonb,
  35.1169009,
  135.5146215,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kuroda',
  '園部町黒田',
  'そのべちょうくろだ',
  '{"en":"Sonobecho-Kuroda"}'::jsonb,
  35.11254,
  135.4495347,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461406425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuchihatta',
  '口八田',
  'くちはった',
  '{"en":"Kuchihatta"}'::jsonb,
  35.1214964,
  135.4097479,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461496080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takaoka',
  '高岡',
  'たかおか',
  '{"en":"Takaoka"}'::jsonb,
  35.1324437,
  135.4068869,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461496081,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinmito',
  '新水戸',
  'しんみと',
  '{"en":"Shinmito"}'::jsonb,
  35.1310904,
  135.4325126,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461496082,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mito',
  '水戸',
  'みと',
  '{"en":"Mito"}'::jsonb,
  35.1399792,
  135.4267676,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461496083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichimori',
  '市森',
  'いちもり',
  '{"en":"Ichimori"}'::jsonb,
  35.1467527,
  135.4366411,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461496084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasui',
  '安井',
  'やすい',
  '{"en":"Yasui"}'::jsonb,
  35.1447507,
  135.3814754,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shiotadani',
  '塩田谷',
  'しおただに',
  '{"en":"Shiotadani"}'::jsonb,
  35.1477738,
  135.4025599,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shuchi',
  '須知',
  'しゅうち',
  '{"en":"Shuchi"}'::jsonb,
  35.1537629,
  135.4241268,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ueno',
  '上野',
  'うえの',
  '{"en":"Ueno"}'::jsonb,
  35.1627431,
  135.4370974,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_jisse',
  '実勢',
  'じっせ',
  '{"en":"Jisse"}'::jsonb,
  35.1790828,
  135.4455767,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_komo',
  '蒲生',
  'こも',
  '{"en":"Komo"}'::jsonb,
  35.1663319,
  135.4268073,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mori',
  '森',
  'もり',
  '{"en":"Mori"}'::jsonb,
  35.1560022,
  135.4040082,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sone',
  '曽根',
  'そね',
  '{"en":"Sone"}'::jsonb,
  35.1631678,
  135.4099615,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_innai',
  '院内',
  'いんない',
  '{"en":"Innai"}'::jsonb,
  35.1638162,
  135.4030736,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_toyota',
  '豊田',
  'とよた',
  '{"en":"Toyota"}'::jsonb,
  35.1671226,
  135.4001774,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chudai',
  '中台',
  'ちゅうだい',
  '{"en":"Chudai"}'::jsonb,
  35.1636716,
  135.3853224,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kono',
  '小野',
  'この',
  '{"en":"Kono"}'::jsonb,
  35.143204,
  135.3592762,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatta_quarter',
  '八田',
  'はった',
  '{"en":"Hatta"}'::jsonb,
  35.1575897,
  135.3549454,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamadani_oku',
  '鎌谷奥',
  'かまだにおく',
  '{"en":"Kamadani-oku"}'::jsonb,
  35.1594485,
  135.3033369,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamadani_naka',
  '鎌谷中',
  'かまだになか',
  '{"en":"Kamadani-naka"}'::jsonb,
  35.1691754,
  135.3186058,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamadani_shimo',
  '鎌谷下',
  'かまだにしも',
  '{"en":"Kamadani-shimo"}'::jsonb,
  35.1826061,
  135.3257361,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashimata',
  '東又',
  'ひがしまた',
  '{"en":"Higashimata"}'::jsonb,
  35.1688715,
  135.3334622,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimookubo',
  '下大久保',
  'しもおおくぼ',
  '{"en":"Shimookubo"}'::jsonb,
  35.1924345,
  135.2927539,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiokubo',
  '上大久保',
  'かみおおくぼ',
  '{"en":"Kamiokubo"}'::jsonb,
  35.1938671,
  135.3089832,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizuhara',
  '水原',
  'みずはら',
  '{"en":"Mizuhara"}'::jsonb,
  35.1906189,
  135.3206911,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inohana',
  '猪鼻',
  'いのはな',
  '{"en":"Inohana"}'::jsonb,
  35.2243786,
  135.2999073,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_totsukawa',
  '戸津川',
  'とつかわ',
  '{"en":"Totsukawa"}'::jsonb,
  35.245357,
  135.3116595,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shizushi',
  '質志',
  'しづし',
  '{"en":"Shizushi"}'::jsonb,
  35.2352758,
  135.3277963,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sannomiya',
  '三ノ宮',
  'さんのみや',
  '{"en":"Sannomiya"}'::jsonb,
  35.2235185,
  135.3407264,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizunomi',
  '水呑',
  'みずのみ',
  '{"en":"Mizunomi"}'::jsonb,
  35.2307029,
  135.3505823,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_myorakuji',
  '妙楽寺',
  'みょうらくじ',
  '{"en":"Myorakuji"}'::jsonb,
  35.2144284,
  135.3485487,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499617,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_awano',
  '粟野',
  'あわの',
  '{"en":"Awano"}'::jsonb,
  35.2065111,
  135.3547133,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499618,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hoidani',
  '保井谷',
  'ほいだに',
  '{"en":"Hoidani"}'::jsonb,
  35.2006305,
  135.3604466,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omisu',
  '大簾',
  'おおみす',
  '{"en":"Omisu"}'::jsonb,
  35.2550063,
  135.3382325,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirono',
  '広野',
  'ひろの',
  '{"en":"Hirono"}'::jsonb,
  35.2709927,
  135.3467343,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499621,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_saibara',
  '才原',
  'さいばら',
  '{"en":"Saibara"}'::jsonb,
  35.2777633,
  135.3435446,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hodosu',
  '仏主',
  'ほどす',
  '{"en":"Hodosu"}'::jsonb,
  35.3235441,
  135.4554066,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499624,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiawano',
  '上粟野',
  'かみあわの',
  '{"en":"Kamiawano"}'::jsonb,
  35.3172625,
  135.4366718,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499625,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hosotani',
  '細谷',
  'ほそたに',
  '{"en":"Hosotani"}'::jsonb,
  35.3063802,
  135.4316706,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoawano',
  '下粟野',
  'しもあわの',
  '{"en":"Shimoawano"}'::jsonb,
  35.3013281,
  135.4247973,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499627,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishikawauchi',
  '西河内',
  'にしかわうち',
  '{"en":"Nishikawauchi"}'::jsonb,
  35.3038104,
  135.414745,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499628,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sakabara',
  '坂原',
  'さかばら',
  '{"en":"Sakabara"}'::jsonb,
  35.2761675,
  135.3946435,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimootomi',
  '下乙見',
  'しもおとみ',
  '{"en":"Shimootomi"}'::jsonb,
  35.2874951,
  135.4292399,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499632,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shiotani',
  '塩谷',
  'しおたに',
  '{"en":"Shiotani"}'::jsonb,
  35.272026,
  135.4512694,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499634,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagase',
  '長瀬',
  'ながせ',
  '{"en":"Nagase"}'::jsonb,
  35.2624338,
  135.4503741,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7461499635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oitomicho',
  '老富町',
  'おいとみちょう',
  '{"en":"Oitomicho"}'::jsonb,
  35.4336168,
  135.4797003,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_光野',
  '光野町',
  'みつのちょう',
  NULL,
  35.4214861,
  135.4769787,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_koyaokacho',
  '故屋岡町',
  'こやおかちょう',
  '{"en":"Koyaokacho"}'::jsonb,
  35.3885683,
  135.4694971,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mutsuyoricho',
  '睦寄町',
  'むつよりちょう',
  '{"en":"Mutsuyoricho"}'::jsonb,
  35.3713037,
  135.4442183,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984975,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iizumicho',
  '五泉町',
  'いいずみちょう',
  '{"en":"Iizumicho"}'::jsonb,
  35.4074377,
  135.4257579,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_itsuaicho',
  '五津合町',
  'いつあいちょう',
  '{"en":"Itsuaicho"}'::jsonb,
  35.3810708,
  135.4236864,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yatsuaicho',
  '八津合町',
  'やつあいちょう',
  '{"en":"Yatsuaicho"}'::jsonb,
  35.3620857,
  135.4079898,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466984980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mutsuaicho',
  '睦合町',
  'むつあいちょう',
  '{"en":"Mutsuaicho"}'::jsonb,
  35.345409,
  135.3684879,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466998985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tadacho',
  '忠町',
  'ただちょう',
  '{"en":"Tadacho"}'::jsonb,
  35.3403263,
  135.3799681,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466998986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsukudacho',
  '佃町',
  'つくだちょう',
  '{"en":"Tsukudacho"}'::jsonb,
  35.3292815,
  135.3662618,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466998987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takeyoshicho',
  '武吉町',
  'たけよしちょう',
  '{"en":"Takeyoshicho"}'::jsonb,
  35.3292214,
  135.355491,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7466998988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_taiza',
  '丹後町間人',
  'たんごちょうたいざ',
  '{"en":"Tangocho-Taiza"}'::jsonb,
  35.7266555,
  135.0886259,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7499899586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tayama',
  '田山',
  'たやま',
  '{"en":"Tayama"}'::jsonb,
  34.7412666,
  136.017758,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minami_okawara',
  '南大河原',
  'みなみおおかわら',
  '{"en":"Minami-Okawara"}'::jsonb,
  34.7682208,
  135.9878933,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kita_okawara',
  '北大河原',
  'きたおおかわら',
  '{"en":"Kita-Okawara"}'::jsonb,
  34.7753161,
  135.9991866,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nodono',
  '野殿',
  'のどの',
  '{"en":"Nodono"}'::jsonb,
  34.7971541,
  136.0012001,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_dosenbo',
  '童仙房',
  'どうせんぼう',
  '{"en":"Dosenbo"}'::jsonb,
  34.8020144,
  135.9725187,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ariichi',
  '有市',
  'ありいち',
  '{"en":"Ariichi"}'::jsonb,
  34.768029,
  135.9561447,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asukaji',
  '飛鳥路',
  'あすかじ',
  '{"en":"Asukaji"}'::jsonb,
  34.7633092,
  135.9605594,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7611224031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hori',
  '堀',
  'ほり',
  '{"en":"Hori"}'::jsonb,
  35.2786454,
  135.1331234,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihagocho',
  '東羽合町',
  'ひがしはごうちょう',
  '{"en":"Higashihagocho"}'::jsonb,
  35.2926973,
  135.1161504,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirominecho',
  '広峯町',
  'ひろみねちょう',
  '{"en":"Hirominecho"}'::jsonb,
  35.2908663,
  135.1187133,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_midorigaokacho',
  '緑ヶ丘町',
  'みどりがおかちょう',
  '{"en":"Midorigaokacho"}'::jsonb,
  35.2891418,
  135.1228237,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asahigaoka',
  '旭が丘',
  'あさひがおか',
  '{"en":"Asahigaoka"}'::jsonb,
  35.2886733,
  135.1196319,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amada',
  '天田',
  'あまだ',
  '{"en":"Amada"}'::jsonb,
  35.2856563,
  135.1191008,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yuhigaoka',
  '夕陽が丘',
  'ゆうひがおか',
  '{"en":"Yuhigaoka"}'::jsonb,
  35.2878107,
  135.1146483,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shomyoji',
  '正明寺',
  'しょうみょうじ',
  '{"en":"Shomyoji"}'::jsonb,
  35.2863613,
  135.1034903,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imayasu',
  '今安',
  'いまやす',
  '{"en":"Imayasu"}'::jsonb,
  35.2910378,
  135.0933623,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_haishi',
  '拝師',
  'はいし',
  '{"en":"Haishi"}'::jsonb,
  35.2916858,
  135.077945,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_handa',
  '半田',
  'はんだ',
  '{"en":"Handa"}'::jsonb,
  35.3008803,
  135.0929654,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinjo',
  '新庄',
  'しんじょう',
  '{"en":"Shinjo"}'::jsonb,
  35.3021455,
  135.0995636,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_daimon',
  '大門',
  'だいもん',
  '{"en":"Daimon"}'::jsonb,
  35.3046891,
  135.0743723,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wakudera',
  '和久寺',
  'わくでら',
  '{"en":"Wakudera"}'::jsonb,
  35.3071757,
  135.0852728,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okunobe',
  '奥野部',
  'おくのべ',
  '{"en":"Okunobe"}'::jsonb,
  35.3106953,
  135.0986838,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwai',
  '岩井',
  'いわい',
  '{"en":"Iwai"}'::jsonb,
  35.3140046,
  135.1038444,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwaihigashimachi',
  '岩井東町',
  'いわいひがしまち',
  '{"en":"Iwaihigashimachi"}'::jsonb,
  35.3116802,
  135.1085892,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aragashinmachi',
  '荒河新町',
  'あらがしんまち',
  '{"en":"Aragashinmachi"}'::jsonb,
  35.3115248,
  135.1111588,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aragahigashimachi',
  '荒河東町',
  'あらがひがしまち',
  '{"en":"Aragahigashimachi"}'::jsonb,
  35.3123609,
  135.1124221,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wakuichi',
  '和久市',
  'わくいち',
  '{"en":"Wakuichi"}'::jsonb,
  35.3091719,
  135.1185965,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wakuichicho',
  '和久市町',
  'わくいちちょう',
  '{"en":"Wakuichicho"}'::jsonb,
  35.3081519,
  135.1148951,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tonyamachi',
  '問屋町',
  'とんやまち',
  '{"en":"Tonyamachi"}'::jsonb,
  35.3090668,
  135.1105928,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sasoo',
  '篠尾',
  'さそお',
  '{"en":"Sasoo"}'::jsonb,
  35.2932927,
  135.1085758,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atsu',
  '厚',
  'あつ',
  '{"en":"Atsu"}'::jsonb,
  35.304317,
  135.1075834,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atsunakamachi',
  '厚中町',
  'あつなかまち',
  '{"en":"Atsunakamachi"}'::jsonb,
  35.3049868,
  135.1109791,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atsuhigashimachi',
  '厚東町',
  'あつひがしまち',
  '{"en":"Atsuhigashimachi"}'::jsonb,
  35.3040543,
  135.1143801,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_showashinmachi',
  '昭和新町',
  'しょうわしんまち',
  '{"en":"Showashinmachi"}'::jsonb,
  35.3042097,
  135.1169899,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_showacho',
  '昭和町',
  'しょうわちょう',
  '{"en":"Showacho"}'::jsonb,
  35.3043673,
  135.1188862,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amada_quarter',
  '天田',
  'あまだ',
  '{"en":"Amada"}'::jsonb,
  35.3012042,
  135.1184759,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakano_quarter',
  '中ノ',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  35.3021017,
  135.1231644,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imoji',
  '鋳物師',
  'いもじ',
  '{"en":"Imoji"}'::jsonb,
  35.3063176,
  135.1215094,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tera',
  '寺',
  'てら',
  '{"en":"Tera"}'::jsonb,
  35.3055909,
  135.1238698,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishi',
  '西',
  'にし',
  '{"en":"Nishi"}'::jsonb,
  35.3036428,
  135.1240441,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimokoya',
  '下紺屋',
  'しもこや',
  '{"en":"Shimokoya"}'::jsonb,
  35.3040149,
  135.1243874,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hishiya',
  '菱屋',
  'ひしや',
  '{"en":"Hishiya"}'::jsonb,
  35.303286,
  135.1253825,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoyanagi',
  '下柳',
  'しもやなぎ',
  '{"en":"Shimoyanagi"}'::jsonb,
  35.303275,
  135.1265573,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiyanagi',
  '上柳',
  'かみやなぎ',
  '{"en":"Kamiyanagi"}'::jsonb,
  35.3022856,
  135.1275042,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamikoya',
  '上紺屋',
  'かみこや',
  '{"en":"Kamikoya"}'::jsonb,
  35.3014428,
  135.1252753,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoshin',
  '下新',
  'しもしん',
  '{"en":"Shimoshin"}'::jsonb,
  35.3009963,
  135.1261067,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashinaga',
  '東長',
  'ひがしなが',
  '{"en":"Higashinaga"}'::jsonb,
  35.3007434,
  135.1266056,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishinaga',
  '西長',
  'にしなが',
  '{"en":"Nishinaga"}'::jsonb,
  35.3007314,
  135.1273137,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_gofuku',
  '呉服',
  'ごふく',
  '{"en":"Gofuku"}'::jsonb,
  35.300819,
  135.128459,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamishin',
  '上新',
  'かみしん',
  '{"en":"Kamishin"}'::jsonb,
  35.2999225,
  135.1264581,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaji',
  '鍛冶',
  'かじ',
  '{"en":"Kaji"}'::jsonb,
  35.2999028,
  135.125754,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_urano',
  '裏ノ',
  'うらの',
  '{"en":"Urano"}'::jsonb,
  35.2977247,
  135.1228854,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634529284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_naiki',
  '内記',
  'ないき',
  '{"en":"Naiki"}'::jsonb,
  35.2974719,
  135.1269597,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634534985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amada_quarter_7634534986',
  '天田',
  'あまだ',
  '{"en":"Amada"}'::jsonb,
  35.2936211,
  135.1244008,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634534986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okano',
  '岡ノ',
  'おかの',
  '{"en":"Okano"}'::jsonb,
  35.2926403,
  135.1261818,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634534987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyo',
  '京',
  'きょう',
  '{"en":"Kyo"}'::jsonb,
  35.2993786,
  135.1304734,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7634534988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sengenji',
  '泉源寺',
  'せんげんじ',
  '{"en":"Sengenji"}'::jsonb,
  35.4869791,
  135.4086425,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7859976306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_tanba',
  '峰山町丹波',
  'みねやまちょうたんば',
  '{"en":"Mineyamacho-Tanba"}'::jsonb,
  35.6336142,
  135.0728676,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7908991542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_naiki',
  '峰山町内記',
  'みねやまちょうないき',
  '{"en":"Mineyamacho-Naiki"}'::jsonb,
  35.629701,
  135.0844037,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7918276039,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_izumi',
  '峰山町泉',
  'みねやまちょういずみ',
  '{"en":"Mineyamacho-Izumi"}'::jsonb,
  35.6204285,
  135.0609907,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921044200,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_komyoji',
  '峰山町光明寺',
  'みねやまちょうこうみょうじ',
  '{"en":"Mineyamacho-Komyoji"}'::jsonb,
  35.6174174,
  135.0620529,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921044201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_shiken',
  '峰山町四軒',
  'みねやまちょうしけん',
  '{"en":"Mineyamacho-Shiken"}'::jsonb,
  35.6318113,
  135.0569701,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_fudan',
  '峰山町不断',
  'みねやまちょうふだん',
  '{"en":"Mineyamacho-Fudan"}'::jsonb,
  35.6295266,
  135.0571525,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_orimoto',
  '峰山町織元',
  'みねやまちょうおりもと',
  '{"en":"Mineyamacho-Orimoto"}'::jsonb,
  35.6265405,
  135.0570001,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054972,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_kami',
  '峰山町上',
  'みねやまちょうかみ',
  '{"en":"Mineyamacho-Kami"}'::jsonb,
  35.6277476,
  135.0571243,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_muro',
  '峰山町室',
  'みねやまちょうむろ',
  '{"en":"Mineyamacho-Muro"}'::jsonb,
  35.6261256,
  135.0577265,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_furudono',
  '峰山町古殿',
  'みねやまちょうふるどの',
  '{"en":"Mineyamacho-Furudono"}'::jsonb,
  35.6249853,
  135.0551864,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054978,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_fukiya',
  '峰山町富貴屋',
  'みねやまちょうふきや',
  '{"en":"Mineyamacho-Fukiya"}'::jsonb,
  35.6245318,
  135.0576273,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_gofuku',
  '峰山町呉服',
  'みねやまちょうごふく',
  '{"en":"Mineyamacho-Gofuku"}'::jsonb,
  35.6246452,
  135.0587001,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_shiragane',
  '峰山町白銀',
  'みねやまちょうしらがね',
  '{"en":"Mineyamacho-Shiragane"}'::jsonb,
  35.6232564,
  135.0594726,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054981,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_naniwa',
  '峰山町浪花',
  'みねやまちょうなにわ',
  '{"en":"Mineyamacho-Naniwa"}'::jsonb,
  35.6238189,
  135.0579196,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054982,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_chitose',
  '峰山町千歳',
  'みねやまちょうちとせ',
  '{"en":"Mineyamacho-Chitose"}'::jsonb,
  35.6222643,
  135.0575897,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_otabi',
  '峰山町御旅',
  'みねやまちょうおたび',
  '{"en":"Mineyamacho-Otabi"}'::jsonb,
  35.6230449,
  135.0584802,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921054984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_yasu',
  '峰山町安',
  'みねやまちょうやす',
  '{"en":"Mineyamacho-Yasu"}'::jsonb,
  35.6212069,
  135.052185,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921055047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_yoshiwara',
  '峰山町吉原',
  'みねやまちょうよしわら',
  '{"en":"Mineyamacho-Yoshiwara"}'::jsonb,
  35.6292475,
  135.053494,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921055048,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_sugitani',
  '峰山町杉谷',
  'みねやまちょうすぎたに',
  '{"en":"Mineyamacho-Sugitani"}'::jsonb,
  35.627643,
  135.0648665,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7921055049,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_kobama',
  '網野町小浜',
  'あみのちょうこばま',
  '{"en":"Aminocho-Kobama"}'::jsonb,
  35.6919714,
  135.0337251,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7964396752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_mitsu',
  '網野町三津',
  'あみのちょうみつ',
  '{"en":"Aminocho-Mitsu"}'::jsonb,
  35.7092349,
  135.0681388,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7968664020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_suge',
  '峰山町菅',
  'みねやまちょうすげ',
  '{"en":"Mineyamacho-Suge"}'::jsonb,
  35.6129343,
  135.0644132,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8000799471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_taga',
  '多賀',
  'たが',
  '{"en":"Taga"}'::jsonb,
  34.81745,
  135.8115506,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichinobe',
  '市辺',
  'いちのべ',
  '{"en":"Ichinobe"}'::jsonb,
  34.8269798,
  135.8060253,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_naka',
  '中',
  'なか',
  '{"en":"Naka"}'::jsonb,
  34.8312423,
  135.8050489,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nashima',
  '奈島',
  'なしま',
  '{"en":"Nashima"}'::jsonb,
  34.8281247,
  135.7948673,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirakawa',
  '平川',
  'ひらかわ',
  '{"en":"Hirakawa"}'::jsonb,
  34.8655722,
  135.7669938,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kozuya',
  '上津屋',
  'こうづや',
  '{"en":"Kozuya"}'::jsonb,
  34.8668398,
  135.7570374,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuse_quarter',
  '久世',
  'くせ',
  '{"en":"Kuse"}'::jsonb,
  34.8668288,
  135.7847688,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_terada',
  '寺田',
  'てらだ',
  '{"en":"Terada"}'::jsonb,
  34.8502096,
  135.7691985,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_terada_quarter',
  '寺田',
  'てらだ',
  '{"en":"Terada"}'::jsonb,
  34.8547395,
  135.7836235,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagaike',
  '長池',
  'ながいけ',
  '{"en":"Nagaike"}'::jsonb,
  34.8410347,
  135.7941162,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kannondo',
  '観音堂',
  'かんのんどう',
  '{"en":"Kannondo"}'::jsonb,
  34.8357072,
  135.7978821,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tono',
  '富野',
  'との',
  '{"en":"Tono"}'::jsonb,
  34.8388113,
  135.780614,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_biwanosho',
  '枇杷庄',
  'びわのしょう',
  '{"en":"Biwanosho"}'::jsonb,
  34.8388421,
  135.7693434,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizushi',
  '水主',
  'みずし',
  '{"en":"Mizushi"}'::jsonb,
  34.8403303,
  135.7646817,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8044262525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoueno',
  '下植野',
  'しもうえの',
  '{"en":"Shimoueno"}'::jsonb,
  34.9088054,
  135.6981254,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8095903433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_enmyoji',
  '円明寺',
  'えんみょうじ',
  '{"en":"Enmyoji"}'::jsonb,
  34.9087042,
  135.685873,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8095903434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_jododani',
  '浄土谷',
  'じょうどだに',
  '{"en":"Jododani"}'::jsonb,
  34.9097996,
  135.6609634,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8095903436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hishida',
  '菱田',
  'ひしだ',
  '{"en":"Hishida"}'::jsonb,
  34.7841133,
  135.7939768,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8097278167,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibata',
  '東畑',
  'ひがしばた',
  '{"en":"Higashibata"}'::jsonb,
  34.7508073,
  135.745697,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8097278175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiyadacho',
  '上矢田町',
  'かみやだちょう',
  '{"en":"Kamiyadacho"}'::jsonb,
  34.9986531,
  135.5785525,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129689109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoyadacho',
  '下矢田町',
  'しもやだちょう',
  '{"en":"Shimoyadacho"}'::jsonb,
  35.0044534,
  135.5762672,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129689110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakayadacho',
  '中矢田町',
  'なかやだちょう',
  '{"en":"Nakayadacho"}'::jsonb,
  35.0028232,
  135.5809772,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129689111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_joboji',
  '篠町浄法寺',
  'しのちょうじょうぼうじ',
  '{"en":"Shinocho-Joboji"}'::jsonb,
  35.0017774,
  135.5920815,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_kasebara',
  '篠町柏原',
  'しのちょうかせばら',
  '{"en":"Shinocho-Kasebara"}'::jsonb,
  35.0102358,
  135.5961961,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_nojo',
  '篠町野条',
  'しのちょうのじょう',
  '{"en":"Shinocho-Nojo"}'::jsonb,
  35.0036581,
  135.5997419,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721323,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_umahori',
  '篠町馬堀',
  'しのちょううまほり',
  '{"en":"Shinocho-Umahori"}'::jsonb,
  35.0083992,
  135.6011367,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_yamamoto',
  '篠町山本',
  'しのちょうやまもと',
  '{"en":"Shinocho-Yamamoto"}'::jsonb,
  35.0132938,
  135.6103957,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_oji',
  '篠町王子',
  'しのちょうおうじ',
  '{"en":"Shinocho-Oji"}'::jsonb,
  34.9954628,
  135.6242895,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_shino',
  '篠町篠',
  'しのちょうしの',
  '{"en":"Shinocho-Shino"}'::jsonb,
  35.0036274,
  135.6086469,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_mori',
  '篠町森',
  'しのちょうもり',
  '{"en":"Shinocho-Mori"}'::jsonb,
  34.9966493,
  135.6007826,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721339,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minamitsutsujigaoka_sakuradai',
  '南つつじケ丘桜台',
  'みなみつつじがおかさくらだい',
  '{"en":"Minamitsutsujigaoka-sakuradai"}'::jsonb,
  34.9885455,
  135.5873609,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129721345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_kitahirose',
  '八木町北広瀬',
  'やぎちょうきたひろせ',
  '{"en":"Yagicho-Kitahirose"}'::jsonb,
  35.0806456,
  135.5315924,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_ikegami',
  '八木町池上',
  'やぎちょういけがみ',
  '{"en":"Yagicho-Ikegami"}'::jsonb,
  35.0859222,
  135.5348754,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_osabe',
  '八木町刑部',
  'やぎちょうおさべ',
  '{"en":"Yagicho-Osabe"}'::jsonb,
  35.083341,
  135.5389309,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_hidokoro',
  '八木町氷所',
  'やぎちょうひどころ',
  '{"en":"Yagicho-Hidokoro"}'::jsonb,
  35.0873532,
  135.5520201,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_aoto',
  '八木町青戸',
  'やぎちょうあおと',
  '{"en":"Yagicho-Aoto"}'::jsonb,
  35.0767385,
  135.5484796,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_nishida',
  '八木町西田',
  'やぎちょうにしだ',
  '{"en":"Yagicho-Nishida"}'::jsonb,
  35.0720497,
  135.5415165,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_kan_onji',
  '八木町観音寺',
  'やぎちょうかんおんじ',
  '{"en":"Yagicho-Kan-onji"}'::jsonb,
  35.0697491,
  135.5496007,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_kitayaga',
  '八木町北屋賀',
  'やぎちょうきたやが',
  '{"en":"Yagicho-Kitayaga"}'::jsonb,
  35.0734678,
  135.5547988,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_yaga',
  '八木町屋賀',
  'やぎちょうやが',
  '{"en":"Yagicho-Yaga"}'::jsonb,
  35.0678699,
  135.5531251,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asahicho',
  '旭町',
  'あさひちょう',
  '{"en":"Asahicho"}'::jsonb,
  35.0869757,
  135.5646479,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129910615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_umajicho',
  '馬路町',
  'うまじちょう',
  '{"en":"Umajicho"}'::jsonb,
  35.0595185,
  135.5607211,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chitosecho_chitose',
  '千歳町千歳',
  'ちとせちょうちとせ',
  '{"en":"Chitosecho-Chitose"}'::jsonb,
  35.0581046,
  135.5762887,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chitosecho_kokubu',
  '千歳町国分',
  'ちとせちょうこくぶ',
  '{"en":"Chitosecho-Kokubu"}'::jsonb,
  35.0417766,
  135.5869532,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chitosecho_bishamon',
  '千歳町毘沙門',
  'ちとせちょうびしゃもん',
  '{"en":"Chitosecho-Bishamon"}'::jsonb,
  35.0367169,
  135.583359,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913943,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawarabayashicho_kawarajiri',
  '河原林町河原尻',
  'かわらばやしちょうかわらじり',
  '{"en":"Kawarabayashicho-Kawarajiri"}'::jsonb,
  35.044526,
  135.5677915,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawarabayashicho_shorinjima',
  '河原林町勝林島',
  'かわらばやしちょうしょうりんじま',
  '{"en":"Kawarabayashicho-Shorinjima"}'::jsonb,
  35.0351093,
  135.5692935,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913945,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hozucho',
  '保津町',
  'ほづちょう',
  '{"en":"Hozucho"}'::jsonb,
  35.0254191,
  135.5937981,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8129913946,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_ota',
  '稗田野町太田',
  'ひえだのちょうおおた',
  '{"en":"Hiedanocho-Ota"}'::jsonb,
  35.0256212,
  135.5397248,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_rokuya',
  '稗田野町鹿谷',
  'ひえだのちょうろくや',
  '{"en":"Hiedanocho-Rokuya"}'::jsonb,
  35.0269302,
  135.5278158,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_okujo',
  '稗田野町奥条',
  'ひえだのちょうおくじょう',
  '{"en":"Hiedanocho-Okujo"}'::jsonb,
  35.0281514,
  135.5185675,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_kakihana',
  '稗田野町柿花',
  'ひえだのちょうかきはな',
  '{"en":"Hiedanocho-Kakihana"}'::jsonb,
  35.021852,
  135.5259061,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_saeki',
  '稗田野町佐伯',
  'ひえだのちょうさえき',
  '{"en":"Hiedanocho-Saeki"}'::jsonb,
  35.0159474,
  135.5329978,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_tengawa',
  '稗田野町天川',
  'ひえだのちょうてんがわ',
  '{"en":"Hiedanocho-Tengawa"}'::jsonb,
  35.0129247,
  135.5403578,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiedanocho_ashinoyama',
  '稗田野町芦ノ山',
  'ひえだのちょうあしのやま',
  '{"en":"Hiedanocho-Ashinoyama"}'::jsonb,
  35.018768,
  135.5094695,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_shigetoshi',
  '曽我部町重利',
  'そがべちょうしげとし',
  '{"en":"Sogabecho-Shigetoshi"}'::jsonb,
  35.0023443,
  135.5541873,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_nishijo',
  '曽我部町西条',
  'そがべちょうにしじょう',
  '{"en":"Sogabecho-Nishijo"}'::jsonb,
  35.0016324,
  135.5475998,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_nanjo',
  '曽我部町南条',
  'そがべちょうなんじょう',
  '{"en":"Sogabecho-Nanjo"}'::jsonb,
  34.996869,
  135.5531573,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_inukai',
  '曽我部町犬飼',
  'そがべちょういぬかい',
  '{"en":"Sogabecho-Inukai"}'::jsonb,
  34.9957968,
  135.5330944,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_hoki',
  '曽我部町法貴',
  'そがべちょうほうき',
  '{"en":"Sogabecho-Hoki"}'::jsonb,
  34.9887037,
  135.5372679,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_naka',
  '曽我部町中',
  'そがべちょうなか',
  '{"en":"Sogabecho-Naka"}'::jsonb,
  34.9843263,
  135.5426967,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_tera',
  '曽我部町寺',
  'そがべちょうてら',
  '{"en":"Sogabecho-Tera"}'::jsonb,
  34.9897848,
  135.551548,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sogabecho_kasukabe',
  '曽我部町春日部',
  'そがべちょうかすかべ',
  '{"en":"Sogabecho-Kasukabe"}'::jsonb,
  34.9780147,
  135.5442738,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashibetsuincho_ono',
  '東別院町大野',
  'ひがしべついんちょうおおの',
  '{"en":"Higashibetsuincho-Ono"}'::jsonb,
  34.9580481,
  135.536077,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_otsukunami',
  '西別院町大槻並',
  'にしべついんちょうおおつくなみ',
  '{"en":"Nishibetsuincho-Otsukunami"}'::jsonb,
  34.9551199,
  135.5289531,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_terada',
  '西別院町寺田',
  'にしべついんちょうてらだ',
  '{"en":"Nishibetsuincho-Terada"}'::jsonb,
  34.9397037,
  135.5173981,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8132890265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_koga',
  '久我',
  'こが',
  '{"en":"Koga"}'::jsonb,
  34.9420168,
  135.7295608,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hazukashi',
  '羽束師',
  'はづかし',
  '{"en":"Hazukashi"}'::jsonb,
  34.9299908,
  135.7245049,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250978,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ohashiberi',
  '大橋辺',
  'おおはしべり',
  '{"en":"Ohashiberi"}'::jsonb,
  34.8992719,
  135.7215142,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250982,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_baba',
  '馬場',
  'ばば',
  '{"en":"Baba"}'::jsonb,
  34.927381,
  135.708468,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_towaen',
  '東和苑',
  'とうわえん',
  '{"en":"Towaen"}'::jsonb,
  34.9231366,
  135.7078564,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250991,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kotari',
  '神足',
  'こうたり',
  '{"en":"Kotari"}'::jsonb,
  34.9204756,
  135.7083714,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichirizuka',
  '一里塚',
  'いちりづか',
  '{"en":"Ichirizuka"}'::jsonb,
  34.9255887,
  135.700475,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shoryuji',
  '勝竜寺',
  'しょうりゅうじ',
  '{"en":"Shoryuji"}'::jsonb,
  34.9144581,
  135.7039833,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187250999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_midorigaoka',
  '緑が丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  34.91695,
  135.6963149,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187251006,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takenodai',
  '竹の台',
  'たけのだい',
  '{"en":"Takenodai"}'::jsonb,
  34.9204316,
  135.6928682,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187251007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tomooka',
  '友岡',
  'ともおか',
  '{"en":"Tomooka"}'::jsonb,
  34.91717,
  135.6887242,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187251012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uguisudai',
  'うぐいす台',
  'うぐいすだい',
  '{"en":"Uguisudai"}'::jsonb,
  34.9330544,
  135.6844461,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chohoji',
  '長法寺',
  'ちょうほうじ',
  '{"en":"Chohoji"}'::jsonb,
  34.9316207,
  135.6807339,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kofudai',
  '光風台',
  'こうふうだい',
  '{"en":"Kofudai"}'::jsonb,
  34.9299758,
  135.678454,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okukaiinji',
  '奥海印寺',
  'おくかいいんじ',
  '{"en":"Okukaiinji"}'::jsonb,
  34.9234621,
  135.6766999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimokaiinji',
  '下海印寺',
  'しもかいいんじ',
  '{"en":"Shimokaiinji"}'::jsonb,
  34.917634,
  135.6855994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shibanosato',
  '柴の里',
  'しばのさと',
  '{"en":"Shibanosato"}'::jsonb,
  34.9366694,
  135.6976131,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imazato',
  '今里',
  'いまざと',
  '{"en":"Imazato"}'::jsonb,
  34.9355436,
  135.6848538,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imazato_quarter',
  '今里',
  'いまざと',
  '{"en":"Imazato"}'::jsonb,
  34.9374902,
  135.6943645,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ao',
  '粟生',
  'あお',
  '{"en":"Ao"}'::jsonb,
  34.9375137,
  135.6811416,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishinokyo',
  '西の京',
  'にしのきょう',
  '{"en":"Nishinokyo"}'::jsonb,
  34.9440879,
  135.692777,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inouchi',
  '井ノ内',
  'いのうち',
  '{"en":"Inouchi"}'::jsonb,
  34.9438725,
  135.6873751,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_koganegaoka',
  'こがねが丘',
  'こがねがおか',
  '{"en":"Koganegaoka"}'::jsonb,
  34.9192308,
  135.6723601,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343173,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takadai_nishi',
  '高台西',
  'たかだいにし',
  '{"en":"Takadai-nishi"}'::jsonb,
  34.9163606,
  135.6722796,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8187343174,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_asamogawa',
  '網野町浅茂川',
  'あみのちょうあさもがわ',
  '{"en":"Aminocho-Asamogawa"}'::jsonb,
  35.6875442,
  135.0198644,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8335007408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_shimooka',
  '網野町下岡',
  'あみのちょうしもおか',
  '{"en":"Aminocho-Shimooka"}'::jsonb,
  35.6745461,
  135.0209319,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8335353551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kosecho',
  '古世町',
  'こせちょう',
  '{"en":"Kosecho"}'::jsonb,
  35.0138166,
  135.5871838,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8462563854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minami_inayazuma',
  '南稲八妻',
  'みなみいなやづま',
  '{"en":"Minami-Inayazuma"}'::jsonb,
  34.7592435,
  135.783813,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ueda',
  '植田',
  'うえだ',
  '{"en":"Ueda"}'::jsonb,
  34.7539587,
  135.7890488,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sugai',
  '菅井',
  'すがい',
  '{"en":"Sugai"}'::jsonb,
  34.7546447,
  135.7968564,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hosono',
  '祝園',
  'ほうその',
  '{"en":"Hosono"}'::jsonb,
  34.7636815,
  135.7969056,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kita_inayazuma',
  '北稲八間',
  'きたいなやづま',
  '{"en":"Kita-Inayazuma"}'::jsonb,
  34.7654863,
  135.7861042,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimokoma',
  '下狛',
  'しもこま',
  '{"en":"Shimokoma"}'::jsonb,
  34.774669,
  135.785821,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ide',
  '井手',
  'いで',
  '{"en":"Ide"}'::jsonb,
  34.7992856,
  135.8132887,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tamura_shinden',
  '田村新田',
  'たむらしんでん',
  '{"en":"Tamura-shinden"}'::jsonb,
  34.8080952,
  135.8537364,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirasu',
  '白栖',
  'しらす',
  '{"en":"Shirasu"}'::jsonb,
  34.7967659,
  135.8921242,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_harayama',
  '原山',
  'はらやま',
  '{"en":"Harayama"}'::jsonb,
  34.8160407,
  135.9206629,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yubune',
  '湯船',
  'ゆぶね',
  '{"en":"Yubune"}'::jsonb,
  34.8314185,
  135.9458971,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ishitera',
  '石寺',
  'いしてら',
  '{"en":"Ishitera"}'::jsonb,
  34.7846087,
  135.879963,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_erihara',
  '撰原',
  'えりはら',
  '{"en":"Erihara"}'::jsonb,
  34.7821536,
  135.8921218,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimojima',
  '下島',
  'しもじま',
  '{"en":"Shimojima"}'::jsonb,
  34.7797833,
  135.8848146,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kiriyama',
  '切山',
  'きりやま',
  '{"en":"Kiriyama"}'::jsonb,
  34.7670288,
  135.9342284,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kasagi',
  '笠置',
  'かさぎ',
  '{"en":"Kasagi"}'::jsonb,
  34.751996,
  135.9331862,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takao',
  '高尾',
  'たかお',
  '{"en":"Takao"}'::jsonb,
  34.7293218,
  135.9975672,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169495,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yuyadani',
  '湯屋谷',
  'ゆやだに',
  '{"en":"Yuyadani"}'::jsonb,
  34.8525456,
  135.8966338,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tachikawa',
  '立川',
  'たちかわ',
  '{"en":"Tachikawa"}'::jsonb,
  34.850525,
  135.8754134,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_araki',
  '荒木',
  'あらき',
  '{"en":"Araki"}'::jsonb,
  34.8562121,
  135.8572268,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169498,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_meijodai',
  '銘城台',
  'めいじょうだい',
  '{"en":"Meijodai"}'::jsonb,
  34.8442171,
  135.8446423,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169499,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwayama',
  '岩山',
  'いわやま',
  '{"en":"Iwayama"}'::jsonb,
  34.8610641,
  135.8748973,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kono_quarter',
  '高尾',
  'こうの',
  '{"en":"Kono"}'::jsonb,
  34.8665301,
  135.8413635,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okuyamada',
  '奥山田',
  'おくやまだ',
  '{"en":"Okuyamada"}'::jsonb,
  34.85768,
  135.920725,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_neda',
  '贄田',
  'ねだ',
  '{"en":"Neda"}'::jsonb,
  34.8503288,
  135.8612923,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_gonokuchi',
  '郷之口',
  'ごうのくち',
  '{"en":"Gonokuchi"}'::jsonb,
  34.8539563,
  135.8502714,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minami_quarter',
  '南',
  'みなみ',
  '{"en":"Minami"}'::jsonb,
  34.843028,
  135.8560509,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_zenjoji',
  '禅定寺',
  'ぜんじょうじ',
  '{"en":"Zenjoji"}'::jsonb,
  34.8757208,
  135.8746154,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628169506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamada',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  34.73731,
  135.7840705,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628183419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inuidani',
  '乾谷',
  'いぬいだに',
  '{"en":"Inuidani"}'::jsonb,
  34.7338558,
  135.7707366,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628183420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mori_quarter',
  '森',
  'もり',
  '{"en":"Mori"}'::jsonb,
  34.8955343,
  135.7426097,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628275416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_bonoike',
  '坊之池',
  'ぼうのいけ',
  '{"en":"Bonoike"}'::jsonb,
  34.8904878,
  135.7332029,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_fujiwada',
  '藤和田',
  'ふじわだ',
  '{"en":"Fujiwada"}'::jsonb,
  34.8896928,
  135.7238917,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashi_imoarai',
  '東一口',
  'ひがしいもあらい',
  '{"en":"Higashi-Imoarai"}'::jsonb,
  34.9043899,
  135.7438247,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hayashi',
  '林',
  'はやし',
  '{"en":"Hayashi"}'::jsonb,
  34.8771858,
  135.7584423,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nomura',
  '野村',
  'のむら',
  '{"en":"Nomura"}'::jsonb,
  34.8898475,
  135.7426159,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishi_imoarai',
  '西一口',
  'にしいもあらい',
  '{"en":"Nishi-Imoarai"}'::jsonb,
  34.9010264,
  135.7330959,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakajima',
  '中島',
  'なかじま',
  '{"en":"Nakajima"}'::jsonb,
  34.8952592,
  135.730964,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tai_quarter_8628296124',
  '田井',
  'たい',
  '{"en":"Tai"}'::jsonb,
  34.8814108,
  135.736029,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimotsuya',
  '下津屋',
  'しもつや',
  '{"en":"Shimotsuya"}'::jsonb,
  34.8757401,
  135.7415307,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimata',
  '島田',
  'しまた',
  '{"en":"Shimata"}'::jsonb,
  34.885371,
  135.7323749,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sayama',
  '佐山',
  'さやま',
  '{"en":"Sayama"}'::jsonb,
  34.8744573,
  135.7502308,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sako',
  '佐古',
  'さこ',
  '{"en":"Sako"}'::jsonb,
  34.8818354,
  135.760996,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitakawazura',
  '北川顔',
  'きたかわづら',
  '{"en":"Kitakawazura"}'::jsonb,
  34.8950666,
  135.7220852,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ojima',
  '相島',
  'おじま',
  '{"en":"Ojima"}'::jsonb,
  34.8991624,
  135.736637,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichida',
  '市田',
  'いちだ',
  '{"en":"Ichida"}'::jsonb,
  34.8900354,
  135.7526618,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasudacho',
  '安田町',
  'やすだちょう',
  '{"en":"Yasudacho"}'::jsonb,
  34.8895536,
  135.7614939,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_makishimacho',
  '槇島町',
  'まきしまちょう',
  '{"en":"Makishimacho"}'::jsonb,
  34.9057632,
  135.787525,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirakicho',
  '開町',
  'ひらきちょう',
  '{"en":"Hirakicho"}'::jsonb,
  34.8802379,
  135.7826395,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_habyoshicho',
  '羽拍子町',
  'はびょうしちょう',
  '{"en":"Habyoshicho"}'::jsonb,
  34.8834495,
  135.782094,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296141,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_todo',
  '莵道',
  'とどう',
  '{"en":"Todo"}'::jsonb,
  34.902878,
  135.8135012,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinmei',
  '神明',
  'しんめい',
  '{"en":"Shinmei"}'::jsonb,
  34.8816921,
  135.788802,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirakawa',
  '白川',
  'しらかわ',
  '{"en":"Shirakawa"}'::jsonb,
  34.8767373,
  135.8116234,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kohata',
  '木幡',
  'こはた',
  '{"en":"Kohata"}'::jsonb,
  34.9225255,
  135.7995203,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uji',
  '宇治',
  'うじ',
  '{"en":"Uji"}'::jsonb,
  34.8858566,
  135.8041259,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8628296158,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanegahara',
  '金ケ原',
  'かねがはら',
  '{"en":"Kanegahara"}'::jsonb,
  34.9138555,
  135.6708097,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8629235832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honzaka',
  '本坂',
  'ほんざか',
  '{"en":"Honzaka"}'::jsonb,
  35.709228,
  135.23811,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737912505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nomura_quarter',
  '野村',
  'のむら',
  '{"en":"Nomura"}'::jsonb,
  35.722279,
  135.216055,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737912506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sugano',
  '菅野',
  'すがの',
  '{"en":"Sugano"}'::jsonb,
  35.696713,
  135.2536219,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737912507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hide',
  '日出',
  'ひで',
  '{"en":"Hide"}'::jsonb,
  35.673825,
  135.27578,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737912508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yotsutsuji',
  '四辻',
  'よつつじ',
  '{"en":"Yotsutsuji"}'::jsonb,
  35.5336782,
  135.1000685,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ushirono',
  '後野',
  'うしろの',
  '{"en":"Ushirono"}'::jsonb,
  35.4967596,
  135.0970085,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoyamada',
  '下山田',
  'しもやまだ',
  '{"en":"Shimoyamada"}'::jsonb,
  35.546049,
  135.125233,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sanjo',
  '算所',
  'さんじょ',
  '{"en":"Sanjo"}'::jsonb,
  35.509365,
  135.096987,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_migochi',
  '三河内',
  'みごち',
  '{"en":"Migochi"}'::jsonb,
  35.517969,
  135.090484,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kayaoku',
  '加悦奥',
  'かやおく',
  '{"en":"Kayaoku"}'::jsonb,
  35.500967,
  135.062555,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaya',
  '加悦',
  'かや',
  '{"en":"Kaya"}'::jsonb,
  35.5022852,
  135.0897147,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanaya',
  '金屋',
  'かなや',
  '{"en":"Kanaya"}'::jsonb,
  35.4864147,
  135.0970138,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiyamada',
  '上山田',
  'かみやまだ',
  '{"en":"Kamiyamada"}'::jsonb,
  35.540029,
  135.10774,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kago',
  '香河',
  'かご',
  '{"en":"Kago"}'::jsonb,
  35.502299,
  135.138914,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwaya',
  '岩屋',
  'いわや',
  '{"en":"Iwaya"}'::jsonb,
  35.5308997,
  135.0750814,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ishikawa',
  '石川',
  'いしかわ',
  '{"en":"Ishikawa"}'::jsonb,
  35.5290207,
  135.1326944,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikuji',
  '幾地',
  'いくじ',
  '{"en":"Ikuji"}'::jsonb,
  35.5314636,
  135.0936084,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atsue',
  '温江',
  'あつえ',
  '{"en":"Atsue"}'::jsonb,
  35.4956705,
  135.1124919,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_akeshi',
  '明石',
  'あけし',
  '{"en":"Akeshi"}'::jsonb,
  35.513364,
  135.110788,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737916609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wada_quarter',
  '和田',
  'わだ',
  '{"en":"Wada"}'::jsonb,
  35.1837888,
  135.3704423,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944189,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tomita',
  '富田',
  'とみた',
  '{"en":"Tomita"}'::jsonb,
  35.1885596,
  135.4175506,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944190,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shitsumi',
  '質美',
  'しつみ',
  '{"en":"Shitsumi"}'::jsonb,
  35.2113843,
  135.3931577,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinohara',
  '篠原',
  'しのはら',
  '{"en":"Shinohara"}'::jsonb,
  35.2699012,
  135.4310177,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944192,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoyama',
  '下山',
  'しもやま',
  '{"en":"Shimoyama"}'::jsonb,
  35.215489,
  135.4265399,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944193,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sakai',
  '坂井',
  'さかい',
  '{"en":"Sakai"}'::jsonb,
  35.1867358,
  135.3407401,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944194,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_osako',
  '大迫',
  'おおさこ',
  '{"en":"Osako"}'::jsonb,
  35.2677391,
  135.4370315,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944195,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okura',
  '大倉',
  'おおくら',
  '{"en":"Okura"}'::jsonb,
  35.2626751,
  135.4154382,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944196,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oboso',
  '大朴',
  'おぼそ',
  '{"en":"Oboso"}'::jsonb,
  35.1736441,
  135.3674378,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944197,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obata',
  '小畑',
  'おばた',
  '{"en":"Obata"}'::jsonb,
  35.2539834,
  135.4090831,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944198,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakayama_quarter',
  '中山',
  'なかやま',
  '{"en":"Nakayama"}'::jsonb,
  35.2343857,
  135.414302,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_naka_quarter',
  '中',
  'なか',
  '{"en":"Naka"}'::jsonb,
  35.2724203,
  135.387997,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944200,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_masutani',
  '升谷',
  'ますたに',
  '{"en":"Masutani"}'::jsonb,
  35.2476944,
  135.4224639,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiotomi',
  '上乙見',
  'かみおとみ',
  '{"en":"Kamiotomi"}'::jsonb,
  35.2922339,
  135.4503872,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kado',
  '角',
  'かど',
  '{"en":"Kado"}'::jsonb,
  35.2726647,
  135.3784778,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944203,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwaki',
  '井脇',
  'いわき',
  '{"en":"Iwaki"}'::jsonb,
  35.191928,
  135.362551,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944204,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inatsugi',
  '稲次',
  'いなつぎ',
  '{"en":"Inatsugi"}'::jsonb,
  35.2661915,
  135.3650626,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ijiri',
  '井尻',
  'いじり',
  '{"en":"Ijiri"}'::jsonb,
  35.177802,
  135.352344,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ideno',
  '出野',
  'いでの',
  '{"en":"Ideno"}'::jsonb,
  35.270471,
  135.360726,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichiba',
  '市場',
  'いちば',
  '{"en":"Ichiba"}'::jsonb,
  35.2592992,
  135.425791,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944208,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honjo',
  '本庄',
  'ほんじょう',
  '{"en":"Honjo"}'::jsonb,
  35.2653092,
  135.4028771,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirose',
  '広瀬',
  'ひろせ',
  '{"en":"Hirose"}'::jsonb,
  35.277808,
  135.3670183,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hashizume',
  '橋爪',
  'はしづめ',
  '{"en":"Hashizume"}'::jsonb,
  35.1820072,
  135.3814289,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944211,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aseri',
  '安栖里',
  'あせり',
  '{"en":"Aseri"}'::jsonb,
  35.2660456,
  135.3736801,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8737944212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_kakezu',
  '網野町掛津',
  'あみのちょうかけづ',
  '{"en":"Aminocho-Kakezu"}'::jsonb,
  35.7006828,
  135.0547221,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8843775230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_hirao',
  '山城町平尾',
  'やましろちょうひらお',
  '{"en":"Yamashirocho-Hirao"}'::jsonb,
  34.7748568,
  135.8166678,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_tsubai',
  '山城町椿井',
  'やましろちょうつばい',
  '{"en":"Yamashirocho-Tsubai"}'::jsonb,
  34.7606567,
  135.8165686,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_jindoji',
  '山城町神童子',
  'やましろちょうじんどうじ',
  '{"en":"Yamashirocho-Jindoji"}'::jsonb,
  34.7665566,
  135.8319086,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_kitagawara',
  '山城町北河原',
  'やましろちょうきたがわら',
  '{"en":"Yamashirocho-Kitagawara"}'::jsonb,
  34.76631,
  135.813096,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_kamikoma',
  '山城町上狛',
  'やましろちょうかみこま',
  '{"en":"Yamashirocho-Kamikoma"}'::jsonb,
  34.7514369,
  135.8183016,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamashirocho_kabata',
  '山城町綺田',
  'やましろちょうかばた',
  '{"en":"Yamashirocho-Kabata"}'::jsonb,
  34.7816929,
  135.811713,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_haze',
  '吐師',
  'はぜ',
  '{"en":"Haze"}'::jsonb,
  34.742228,
  135.796996,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867276305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_saganaka',
  '相楽',
  'さがなか',
  '{"en":"Saganaka"}'::jsonb,
  34.7311485,
  135.8016055,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kizumachi',
  '木津町',
  'きづまち',
  '{"en":"Kizumachi"}'::jsonb,
  34.7356413,
  135.817132,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kizu',
  '木津',
  'きづ',
  '{"en":"Kizu"}'::jsonb,
  34.73457,
  135.820896,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328227,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_yamada',
  '加茂町山田',
  'かもちょうやまだ',
  '{"en":"Kamocho-Yamada"}'::jsonb,
  34.7549139,
  135.8998367,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_mori',
  '加茂町森',
  'かもちょうもり',
  '{"en":"Kamocho-Mori"}'::jsonb,
  34.7383464,
  135.8902397,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_minamidaimon',
  '加茂町南大門',
  'かもちょうみなみだいもん',
  '{"en":"Kamocho-Minamidaimon"}'::jsonb,
  34.72092,
  135.874846,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_minamishimode',
  '加茂町南下手',
  'かもちょうみなみしもで',
  '{"en":"Kamocho-Minamishimode"}'::jsonb,
  34.739489,
  135.885715,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_minami',
  '加茂町美浪',
  'かもちょうみなみ',
  '{"en":"Kamocho-Minami"}'::jsonb,
  34.750434,
  135.873344,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_hokkejino',
  '加茂町法花寺野',
  'かもちょうほっけじの',
  '{"en":"Kamocho-Hokkejino"}'::jsonb,
  34.757084,
  135.846066,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_higashioshita',
  '加茂町東小下',
  'かもちょうひがしおした',
  '{"en":"Kamocho-Higashioshita"}'::jsonb,
  34.719722,
  135.878551,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_higashiokami',
  '加茂町東小上',
  'かもちょうひがしおかみ',
  '{"en":"Kamocho-Higashiokami"}'::jsonb,
  34.71907,
  135.875338,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_nishio',
  '加茂町西小',
  'かもちょうにしお',
  '{"en":"Kamocho-Nishio"}'::jsonb,
  34.71875,
  135.868078,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_nishi',
  '加茂町西',
  'かもちょうにし',
  '{"en":"Kamocho-Nishi"}'::jsonb,
  34.766679,
  135.850357,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_tsuji',
  '加茂町辻',
  'かもちょうつじ',
  '{"en":"Kamocho-Tsuji"}'::jsonb,
  34.732164,
  135.883299,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_takata',
  '加茂町高田',
  'かもちょうたかた',
  '{"en":"Kamocho-Takata"}'::jsonb,
  34.7350408,
  135.861814,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_takasari',
  '加茂町高去',
  'かもちょうたかさり',
  '{"en":"Kamocho-Takasari"}'::jsonb,
  34.735857,
  135.88878,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_zezu',
  '加茂町銭司',
  'かもちょうぜず',
  '{"en":"Kamocho-Zezu"}'::jsonb,
  34.764079,
  135.887981,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_shirieda',
  '加茂町尻枝',
  'かもちょうしりえだ',
  '{"en":"Kamocho-Shirieda"}'::jsonb,
  34.735515,
  135.878858,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_shobu',
  '加茂町勝風',
  'かもちょうしょうぶ',
  '{"en":"Kamocho-Shobu"}'::jsonb,
  34.732605,
  135.892877,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328243,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_sato',
  '加茂町里',
  'かもちょうさと',
  '{"en":"Kamocho-Sato"}'::jsonb,
  34.74852,
  135.8679064,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_kitadaimon',
  '加茂町北大門',
  'かもちょうきただいもん',
  '{"en":"Kamocho-Kitadaimon"}'::jsonb,
  34.721694,
  135.871647,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_kitashimode',
  '加茂町北下手',
  'かもちょうきたしもで',
  '{"en":"Kamocho-Kitashimode"}'::jsonb,
  34.741749,
  135.885871,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_kita',
  '加茂町北',
  'かもちょうきた',
  '{"en":"Kamocho-Kita"}'::jsonb,
  34.759891,
  135.874566,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_kan_onji',
  '加茂町観音寺',
  'かもちょうかんおんじ',
  '{"en":"Kamocho-Kan-onji"}'::jsonb,
  34.74488,
  135.855562,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_kawara',
  '加茂町河原',
  'かもちょうかわら',
  '{"en":"Kamocho-Kawara"}'::jsonb,
  34.7601571,
  135.8611543,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_okuhata',
  '加茂町奥畑',
  'かもちょうおくはた',
  '{"en":"Kamocho-Okuhata"}'::jsonb,
  34.7821769,
  135.8735258,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_okazaki',
  '加茂町岡崎',
  'かもちょうおかざき',
  '{"en":"Kamocho-Okazaki"}'::jsonb,
  34.763007,
  135.867885,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_ohata',
  '加茂町大畑',
  'かもちょうおおはた',
  '{"en":"Kamocho-Ohata"}'::jsonb,
  34.724333,
  135.892806,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_unami',
  '加茂町兎並',
  'かもちょううなみ',
  '{"en":"Kamocho-Unami"}'::jsonb,
  34.756132,
  135.875421,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328259,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_iwafune',
  '加茂町岩船',
  'かもちょういわふね',
  '{"en":"Kamocho-Iwafune"}'::jsonb,
  34.719522,
  135.885513,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328260,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamocho_ibirao',
  '加茂町井平尾',
  'かもちょういびらお',
  '{"en":"Kamocho-Ibirao"}'::jsonb,
  34.7678148,
  135.876497,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328261,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaseyama',
  '鹿背山',
  'かせやま',
  '{"en":"Kaseyama"}'::jsonb,
  34.7438291,
  135.840673,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_umedani',
  '梅谷',
  'うめだに',
  '{"en":"Umedani"}'::jsonb,
  34.7151357,
  135.8492543,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichisaka',
  '市坂',
  'いちさか',
  '{"en":"Ichisaka"}'::jsonb,
  34.7233156,
  135.8242597,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867328265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_yamamuro',
  '八木町山室',
  'やぎちょうやまむろ',
  '{"en":"Yagicho-Yamamuro"}'::jsonb,
  35.093851,
  135.514866,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_yaginoshima',
  '八木町八木嶋',
  'やぎちょうやぎのしま',
  '{"en":"Yagicho-Yaginoshima"}'::jsonb,
  35.0783,
  135.517608,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_yagi',
  '八木町八木',
  'やぎちょうやぎ',
  '{"en":"Yagicho-Yagi"}'::jsonb,
  35.066042,
  135.528848,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_morohata',
  '八木町諸畑',
  'やぎちょうもろはた',
  '{"en":"Yagicho-Morohata"}'::jsonb,
  35.1025464,
  135.5389029,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_murohashi',
  '八木町室橋',
  'やぎちょうむろはし',
  '{"en":"Yagicho-Murohashi"}'::jsonb,
  35.102251,
  135.525182,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_murogawara',
  '八木町室河原',
  'やぎちょうむろがわら',
  '{"en":"Yagicho-Murogawara"}'::jsonb,
  35.09927,
  135.4920592,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_minamihirose',
  '八木町南広瀬',
  'やぎちょうみなみひろせ',
  '{"en":"Yagicho-Minamihirose"}'::jsonb,
  35.076166,
  135.530004,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332091,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_misato',
  '八木町美里',
  'やぎちょうみさと',
  '{"en":"Yagicho-Misato"}'::jsonb,
  35.101252,
  135.51023,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332092,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_funaeda',
  '八木町船枝',
  'やぎちょうふなえだ',
  '{"en":"Yagicho-Funaeda"}'::jsonb,
  35.1111281,
  135.5239668,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_hioki',
  '八木町日置',
  'やぎちょうひおき',
  '{"en":"Yagicho-Hioki"}'::jsonb,
  35.0989129,
  135.5492744,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332094,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_nojo',
  '八木町野条',
  'やぎちょうのじょう',
  '{"en":"Yagicho-Nojo"}'::jsonb,
  35.092141,
  135.533628,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332095,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_toba',
  '八木町鳥羽',
  'やぎちょうとば',
  '{"en":"Yagicho-Toba"}'::jsonb,
  35.088271,
  135.509237,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332096,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_tamanoi',
  '八木町玉ノ井',
  'やぎちょうたまのい',
  '{"en":"Yagicho-Tamanoi"}'::jsonb,
  35.083218,
  135.507719,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332097,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_shibayama',
  '八木町柴山',
  'やぎちょうしばやま',
  '{"en":"Yagicho-Shibayama"}'::jsonb,
  35.067871,
  135.512516,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332098,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_kiwara',
  '八木町木原',
  'やぎちょうきわら',
  '{"en":"Yagicho-Kiwara"}'::jsonb,
  35.090394,
  135.4954412,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332099,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_oyabu',
  '八木町大薮',
  'やぎちょうおおやぶ',
  '{"en":"Yagicho-Oyabu"}'::jsonb,
  35.076122,
  135.524328,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332100,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yagicho_ikenouchi',
  '八木町池之内',
  'やぎちょういけのうち',
  '{"en":"Yagicho-Ikenouchi"}'::jsonb,
  35.0844041,
  135.4924486,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332101,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_matabayashi',
  '美山町又林',
  'みやまちょうまたばやし',
  '{"en":"Miyamacho-Matabayashi"}'::jsonb,
  35.2644888,
  135.5758833,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332102,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamacho_fukami',
  '美山町深見',
  'みやまちょうふかみ',
  '{"en":"Miyamacho-Fukami"}'::jsonb,
  35.263029,
  135.6075304,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332103,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_wakamatsucho',
  '園部町若松町',
  'そのべちょうわかまつちょう',
  '{"en":"Sonobecho-Wakamatsucho"}'::jsonb,
  35.1116842,
  135.4745772,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332104,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_yokota',
  '園部町横田',
  'そのべちょうよこた',
  '{"en":"Sonobecho-Yokota"}'::jsonb,
  35.10736,
  135.460431,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332105,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_miyamachi',
  '園部町宮町',
  'そのべちょうみやまち',
  '{"en":"Sonobecho-Miyamachi"}'::jsonb,
  35.1089866,
  135.471924,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332106,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_minamihatta',
  '園部町南八田',
  'そのべちょうみなみはった',
  '{"en":"Sonobecho-Minamihatta"}'::jsonb,
  35.0599586,
  135.4322997,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332107,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_misonomachi',
  '園部町美園町',
  'そのべちょうみそのまち',
  '{"en":"Sonobecho-Misonomachi"}'::jsonb,
  35.10633,
  135.474603,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332108,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_honmachi',
  '園部町本町',
  'そのべちょうほんまち',
  '{"en":"Sonobecho-Honmachi"}'::jsonb,
  35.110474,
  135.4743229,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_hokyo',
  '園部町法京',
  'そのべちょうほうきょう',
  '{"en":"Sonobecho-Hokyo"}'::jsonb,
  35.054994,
  135.394567,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_funasaka',
  '園部町船阪',
  'そのべちょうふなさか',
  '{"en":"Sonobecho-Funasaka"}'::jsonb,
  35.1079279,
  135.4423319,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_handa',
  '園部町半田',
  'そのべちょうはんだ',
  '{"en":"Sonobecho-Handa"}'::jsonb,
  35.090571,
  135.459656,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332112,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_nie',
  '園部町仁江',
  'そのべちょうにえ',
  '{"en":"Sonobecho-Nie"}'::jsonb,
  35.099337,
  135.435086,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332113,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_takei',
  '園部町竹井',
  'そのべちょうたけい',
  '{"en":"Sonobecho-Takei"}'::jsonb,
  35.091344,
  135.417039,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_sogadani',
  '園部町曽我谷',
  'そのべちょうそがだに',
  '{"en":"Sonobecho-Sogadani"}'::jsonb,
  35.114159,
  135.488566,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_shinmachi',
  '園部町新町',
  'そのべちょうしんまち',
  '{"en":"Sonobecho-Shinmachi"}'::jsonb,
  35.109202,
  135.477383,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867332116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_jonanmachi',
  '園部町城南町',
  'そのべちょうじょうなんまち',
  '{"en":"Sonobecho-Jonanmachi"}'::jsonb,
  35.0999239,
  135.4668857,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_shishiudo',
  '園部町宍人',
  'そのべちょうししうど',
  '{"en":"Sonobecho-Shishiudo"}'::jsonb,
  35.080379,
  135.439241,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_sakaemachi',
  '園部町栄町',
  'そのべちょうさかえまち',
  '{"en":"Sonobecho-Sakaemachi"}'::jsonb,
  35.1006851,
  135.4743374,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kozakuramachi',
  '園部町小桜町',
  'そのべちょうこざくらまち',
  '{"en":"Sonobecho-Kozakuramachi"}'::jsonb,
  35.105539,
  135.470414,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_koshi',
  '園部町口司',
  'そのべちょうこうし',
  '{"en":"Sonobecho-Koshi"}'::jsonb,
  35.078346,
  135.483527,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kuchiudo',
  '園部町口人',
  'そのべちょうくちうど',
  '{"en":"Sonobecho-Kuchiudo"}'::jsonb,
  35.0830329,
  135.4664188,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364822,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kizakimachi',
  '園部町木崎町',
  'そのべちょうきざきまち',
  '{"en":"Sonobecho-Kizakimachi"}'::jsonb,
  35.111953,
  135.480154,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364823,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kawaramachi',
  '園部町河原町',
  'そのべちょうかわらまち',
  '{"en":"Sonobecho-Kawaramachi"}'::jsonb,
  35.110847,
  135.467576,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364824,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kamihonmachi',
  '園部町上本町',
  'そのべちょうかみほんまち',
  '{"en":"Sonobecho-Kamihonmachi"}'::jsonb,
  35.1104885,
  135.4707937,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_kamikizakimachi',
  '園部町上木崎町',
  'そのべちょうかみきざきまち',
  '{"en":"Sonobecho-Kamikizakimachi"}'::jsonb,
  35.1156504,
  135.4640075,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_oyamahigashimachi',
  '園部町小山東町',
  'そのべちょうおやまひがしまち',
  '{"en":"Sonobecho-Oyamahigashimachi"}'::jsonb,
  35.098787,
  135.4837446,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_oyamanishimachi',
  '園部町小山西町',
  'そのべちょうおやまにしまち',
  '{"en":"Sonobecho-Oyamanishimachi"}'::jsonb,
  35.094143,
  135.475994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_onishi',
  '園部町大西',
  'そのべちょうおおにし',
  '{"en":"Sonobecho-Onishi"}'::jsonb,
  35.0975208,
  135.4456563,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_okawachi',
  '園部町大河内',
  'そのべちょうおおかわち',
  '{"en":"Sonobecho-Okawachi"}'::jsonb,
  35.0402472,
  135.4133999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_uchibayashimachi',
  '園部町内林町',
  'そのべちょううちばやしまち',
  '{"en":"Sonobecho-Uchibayashimachi"}'::jsonb,
  35.1200559,
  135.4766804,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sonobecho_amabiki',
  '園部町天引',
  'そのべちょうあまびき',
  '{"en":"Sonobecho-Amabiki"}'::jsonb,
  35.0660641,
  135.4064343,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867364832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_wadano',
  '弥栄町和田野',
  'やさかちょうわだの',
  '{"en":"Yasakacho-Wadano"}'::jsonb,
  35.6579207,
  135.0844519,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_yoshisawa',
  '弥栄町吉沢',
  'やさかちょうよしさわ',
  '{"en":"Yasakacho-Yoshisawa"}'::jsonb,
  35.635896,
  135.096632,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_mizotani',
  '弥栄町溝谷',
  'やさかちょうみぞたに',
  '{"en":"Yasakacho-Mizotani"}'::jsonb,
  35.6583638,
  135.1061424,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_funaki',
  '弥栄町船木',
  'やさかちょうふなき',
  '{"en":"Yasakacho-Funaki"}'::jsonb,
  35.6705123,
  135.1140609,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_nonaka',
  '弥栄町野中',
  'やさかちょうのなか',
  '{"en":"Yasakacho-Nonaka"}'::jsonb,
  35.6962403,
  135.1492354,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_tottori',
  '弥栄町鳥取',
  'やさかちょうとっとり',
  '{"en":"Yasakacho-Tottori"}'::jsonb,
  35.678867,
  135.0775797,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_torakuji',
  '弥栄町等楽寺',
  'やさかちょうとうらくじ',
  '{"en":"Yasakacho-Torakuji"}'::jsonb,
  35.637828,
  135.131756,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_tsutsumi',
  '弥栄町堤',
  'やさかちょうつつみ',
  '{"en":"Yasakacho-Tsutsumi"}'::jsonb,
  35.652786,
  135.099988,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_sugawa',
  '弥栄町須川',
  'やさかちょうすがわ',
  '{"en":"Yasakacho-Sugawa"}'::jsonb,
  35.6773052,
  135.1622658,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_koda',
  '弥栄町小田',
  'やさかちょうこだ',
  '{"en":"Yasakacho-Koda"}'::jsonb,
  35.694513,
  135.106969,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_kurobe',
  '弥栄町黒部',
  'やさかちょうくろべ',
  '{"en":"Yasakacho-Kurobe"}'::jsonb,
  35.682341,
  135.10722,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_kunihisa',
  '弥栄町国久',
  'やさかちょうくにひさ',
  '{"en":"Yasakacho-Kunihisa"}'::jsonb,
  35.690663,
  135.088439,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_kibashi',
  '弥栄町木橋',
  'やさかちょうきばし',
  '{"en":"Yasakacho-Kibashi"}'::jsonb,
  35.6684214,
  135.0746285,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_imono',
  '弥栄町芋野',
  'やさかちょういもの',
  '{"en":"Yasakacho-Imono"}'::jsonb,
  35.64676,
  135.0964973,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasakacho_inobe',
  '弥栄町井辺',
  'やさかちょういのべ',
  '{"en":"Yasakacho-Inobe"}'::jsonb,
  35.683073,
  135.089312,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_yata',
  '峰山町矢田',
  'みねやまちょうやた',
  '{"en":"Mineyamacho-Yata"}'::jsonb,
  35.639991,
  135.076257,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_masudome',
  '峰山町鱒留',
  'みねやまちょうますどめ',
  '{"en":"Mineyamacho-Masudome"}'::jsonb,
  35.5730133,
  135.0187686,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_hisatsugi',
  '峰山町久次',
  'みねやまちょうひさつぎ',
  '{"en":"Mineyamacho-Hisatsugi"}'::jsonb,
  35.5929256,
  135.0292593,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_hashigi',
  '峰山町橋木',
  'みねやまちょうはしぎ',
  '{"en":"Mineyamacho-Hashigi"}'::jsonb,
  35.654571,
  135.067972,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_ninbari',
  '峰山町新治',
  'みねやまちょうにんばり',
  '{"en":"Mineyamacho-Ninbari"}'::jsonb,
  35.608133,
  135.0451798,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_nishiyama',
  '峰山町西山',
  'みねやまちょうにしやま',
  '{"en":"Mineyamacho-Nishiyama"}'::jsonb,
  35.6189244,
  135.0296187,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_nika',
  '峰山町二箇',
  'みねやまちょうにか',
  '{"en":"Mineyamacho-Nika"}'::jsonb,
  35.597634,
  135.040932,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_nagaoka',
  '峰山町長岡',
  'みねやまちょうながおか',
  '{"en":"Mineyamacho-Nagaoka"}'::jsonb,
  35.6000685,
  135.0645227,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_shinmachi',
  '峰山町新町',
  'みねやまちょうしんまち',
  '{"en":"Mineyamacho-Shinmachi"}'::jsonb,
  35.6104093,
  135.0866302,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_sakai',
  '峰山町堺',
  'みねやまちょうさかい',
  '{"en":"Mineyamacho-Sakai"}'::jsonb,
  35.623999,
  135.055743,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_konishi',
  '峰山町小西',
  'みねやまちょうこにし',
  '{"en":"Mineyamacho-Konishi"}'::jsonb,
  35.6135235,
  135.027946,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_goka',
  '峰山町五箇',
  'みねやまちょうごか',
  '{"en":"Mineyamacho-Goka"}'::jsonb,
  35.5800981,
  135.0383424,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_ishimaru',
  '峰山町石丸',
  'みねやまちょういしまる',
  '{"en":"Mineyamacho-Ishimaru"}'::jsonb,
  35.648842,
  135.051359,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_arayama',
  '峰山町荒山',
  'みねやまちょうあらやま',
  '{"en":"Mineyamacho-Arayama"}'::jsonb,
  35.6165875,
  135.0781651,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mineyamacho_akasaka',
  '峰山町赤坂',
  'みねやまちょうあかさか',
  '{"en":"Mineyamacho-Akasaka"}'::jsonb,
  35.640719,
  135.0542371,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_yoshinaga',
  '丹後町吉永',
  'たんごちょうよしなが',
  '{"en":"Tangocho-Yoshinaga"}'::jsonb,
  35.714615,
  135.124871,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_yabata',
  '丹後町矢畑',
  'たんごちょうやばた',
  '{"en":"Tangocho-Yabata"}'::jsonb,
  35.72585,
  135.123086,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_miyama',
  '丹後町三山',
  'たんごちょうみやま',
  '{"en":"Tangocho-Miyama"}'::jsonb,
  35.7209342,
  135.172336,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_miyake',
  '丹後町三宅',
  'たんごちょうみやけ',
  '{"en":"Tangocho-Miyake"}'::jsonb,
  35.718355,
  135.104919,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_miya',
  '丹後町宮',
  'たんごちょうみや',
  '{"en":"Tangocho-Miya"}'::jsonb,
  35.731812,
  135.108358,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392757,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_fudeshi',
  '丹後町筆石',
  'たんごちょうふでし',
  '{"en":"Tangocho-Fudeshi"}'::jsonb,
  35.741893,
  135.120898,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_hata',
  '丹後町畑',
  'たんごちょうはた',
  '{"en":"Tangocho-Hata"}'::jsonb,
  35.7360031,
  135.1692645,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_nakano',
  '丹後町中野',
  'たんごちょうなかの',
  '{"en":"Tangocho-Nakano"}'::jsonb,
  35.7429615,
  135.161035,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_tokumitsu',
  '丹後町徳光',
  'たんごちょうとくみつ',
  '{"en":"Tangocho-Tokumitsu"}'::jsonb,
  35.7075773,
  135.0914936,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_chikaraishi',
  '丹後町力石',
  'たんごちょうちからいし',
  '{"en":"Tangocho-Chikaraishi"}'::jsonb,
  35.713412,
  135.140935,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_taniuchi',
  '丹後町谷内',
  'たんごちょうたにうち',
  '{"en":"Tangocho-Taniuchi"}'::jsonb,
  35.745796,
  135.181017,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_takekyuso',
  '丹後町竹久僧',
  'たんごちょうたけきゅうそ',
  '{"en":"Tangocho-Takekyuso"}'::jsonb,
  35.712929,
  135.17539,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_takano',
  '丹後町竹野',
  'たんごちょうたかの',
  '{"en":"Tangocho-Takano"}'::jsonb,
  35.74215,
  135.111,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_joganji',
  '丹後町成願寺',
  'たんごちょうじょうがんじ',
  '{"en":"Tangocho-Joganji"}'::jsonb,
  35.705884,
  135.109153,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_kowaki',
  '丹後町小脇',
  'たんごちょうこわき',
  '{"en":"Tangocho-Kowaki"}'::jsonb,
  35.712956,
  135.165828,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_koreyasu',
  '丹後町是安',
  'たんごちょうこれやす',
  '{"en":"Tangocho-Koreyasu"}'::jsonb,
  35.7106903,
  135.11428,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_konoshiro',
  '丹後町此代',
  'たんごちょうこのしろ',
  '{"en":"Tangocho-Konoshiro"}'::jsonb,
  35.744671,
  135.138568,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_konushi',
  '丹後町神主',
  'たんごちょうこうぬし',
  '{"en":"Tangocho-Konushi"}'::jsonb,
  35.713824,
  135.154195,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_kurauchi',
  '丹後町鞍内',
  'たんごちょうくらうち',
  '{"en":"Tangocho-Kurauchi"}'::jsonb,
  35.7276944,
  135.1614422,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_onge',
  '丹後町遠下',
  'たんごちょうおんげ',
  '{"en":"Tangocho-Onge"}'::jsonb,
  35.7381777,
  135.1529367,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_oyama',
  '丹後町大山',
  'たんごちょうおおやま',
  '{"en":"Tangocho-Oyama"}'::jsonb,
  35.723149,
  135.097922,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_oishi',
  '丹後町大石',
  'たんごちょうおおいし',
  '{"en":"Tangocho-Oishi"}'::jsonb,
  35.708245,
  135.148419,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_ueyama',
  '丹後町上山',
  'たんごちょううえやま',
  '{"en":"Tangocho-Ueyama"}'::jsonb,
  35.7360928,
  135.1901674,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_iwaki',
  '丹後町岩木',
  'たんごちょういわき',
  '{"en":"Tangocho-Iwaki"}'::jsonb,
  35.72157,
  135.110134,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_ichidan',
  '丹後町一段',
  'たんごちょういちだん',
  '{"en":"Tangocho-Ichidan"}'::jsonb,
  35.725863,
  135.13662,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_idani',
  '丹後町井谷',
  'たんごちょういだに',
  '{"en":"Tangocho-Idani"}'::jsonb,
  35.7385233,
  135.1632424,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_ikari',
  '丹後町碇',
  'たんごちょういかり',
  '{"en":"Tangocho-Ikari"}'::jsonb,
  35.724677,
  135.192569,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tangocho_aikawadani',
  '丹後町相川谷',
  'たんごちょうあいかわだに',
  '{"en":"Tangocho-Aikawadani"}'::jsonb,
  35.701946,
  135.132999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_yuike',
  '久美浜町油池',
  'くみはまちょうゆいけ',
  '{"en":"Kumihamacho-Yuike"}'::jsonb,
  35.602195,
  134.915913,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_mihara',
  '久美浜町三原',
  'くみはまちょうみはら',
  '{"en":"Kumihamacho-Mihara"}'::jsonb,
  35.6201449,
  134.9751549,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392782,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_minatomiya',
  '久美浜町湊宮',
  'くみはまちょうみなとみや',
  '{"en":"Kumihamacho-Minatomiya"}'::jsonb,
  35.6435834,
  134.9065994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_mitani',
  '久美浜町三谷',
  'くみはまちょうみたに',
  '{"en":"Kumihamacho-Mitani"}'::jsonb,
  35.5776515,
  134.893123,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_maruyama',
  '久美浜町丸山',
  'くみはまちょうまるやま',
  '{"en":"Kumihamacho-Maruyama"}'::jsonb,
  35.591738,
  134.955236,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_honde',
  '久美浜町品田',
  'くみはまちょうほんで',
  '{"en":"Kumihamacho-Honde"}'::jsonb,
  35.5758239,
  134.9222264,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_hotaino',
  '久美浜町布袋野',
  'くみはまちょうほたいの',
  '{"en":"Kumihamacho-Hotaino"}'::jsonb,
  35.5379763,
  134.9364616,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_futamata',
  '久美浜町二俣',
  'くみはまちょうふたまた',
  '{"en":"Kumihamacho-Futamata"}'::jsonb,
  35.550436,
  134.991979,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_hirata',
  '久美浜町平田',
  'くみはまちょうひらた',
  '{"en":"Kumihamacho-Hirata"}'::jsonb,
  35.633573,
  134.939964,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_hata',
  '久美浜町畑',
  'くみはまちょうはた',
  '{"en":"Kumihamacho-Hata"}'::jsonb,
  35.5518398,
  134.9297467,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_hashizume',
  '久美浜町橋爪',
  'くみはまちょうはしづめ',
  '{"en":"Kumihamacho-Hashizume"}'::jsonb,
  35.592997,
  134.933936,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_nonaka',
  '久美浜町野中',
  'くみはまちょうのなか',
  '{"en":"Kumihamacho-Nonaka"}'::jsonb,
  35.584041,
  134.9604588,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_nyo',
  '久美浜町女布',
  'くみはまちょうにょう',
  '{"en":"Kumihamacho-Nyo"}'::jsonb,
  35.5987219,
  134.9601529,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_niidani',
  '久美浜町新谷',
  'くみはまちょうにいだに',
  '{"en":"Kumihamacho-Niidani"}'::jsonb,
  35.574348,
  134.942516,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_nagano',
  '久美浜町長野',
  'くみはまちょうながの',
  '{"en":"Kumihamacho-Nagano"}'::jsonb,
  35.603431,
  134.980958,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_nagadome',
  '久美浜町永留',
  'くみはまちょうながどめ',
  '{"en":"Kumihamacho-Nagadome"}'::jsonb,
  35.596214,
  134.943476,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_tomoshige',
  '久美浜町友重',
  'くみはまちょうともしげ',
  '{"en":"Kumihamacho-Tomoshige"}'::jsonb,
  35.58637,
  134.922172,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_tochidani',
  '久美浜町栃谷',
  'くみはまちょうとちだに',
  '{"en":"Kumihamacho-Tochidani"}'::jsonb,
  35.5874548,
  134.9074086,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_tani',
  '久美浜町谷',
  'くみはまちょうたに',
  '{"en":"Kumihamacho-Tani"}'::jsonb,
  35.581644,
  134.948577,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_takefuji',
  '久美浜町竹藤',
  'くみはまちょうたけふじ',
  '{"en":"Kumihamacho-Takefuji"}'::jsonb,
  35.595501,
  134.966753,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392800,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_seki',
  '久美浜町関',
  'くみはまちょうせき',
  '{"en":"Kumihamacho-Seki"}'::jsonb,
  35.621238,
  134.946268,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_suda',
  '久美浜町須田',
  'くみはまちょうすだ',
  '{"en":"Kumihamacho-Suda"}'::jsonb,
  35.5650323,
  134.9243349,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_shinjo',
  '久美浜町新庄',
  'くみはまちょうしんじょう',
  '{"en":"Kumihamacho-Shinjo"}'::jsonb,
  35.5725166,
  134.9269294,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_jogahata',
  '久美浜町尉ケ畑',
  'くみはまちょうじょうがはた',
  '{"en":"Kumihamacho-Jogahata"}'::jsonb,
  35.5478452,
  134.9793987,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_shima',
  '久美浜町島',
  'くみはまちょうしま',
  '{"en":"Kumihamacho-Shima"}'::jsonb,
  35.583984,
  134.932305,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_sanbu',
  '久美浜町三分',
  'くみはまちょうさんぶ',
  '{"en":"Kumihamacho-Sanbu"}'::jsonb,
  35.636088,
  134.949343,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_sano',
  '久美浜町佐野',
  'くみはまちょうさの',
  '{"en":"Kumihamacho-Sano"}'::jsonb,
  35.5812127,
  134.9747403,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_sakadani',
  '久美浜町坂谷',
  'くみはまちょうさかだに',
  '{"en":"Kumihamacho-Sakadani"}'::jsonb,
  35.599978,
  134.990667,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_sakai',
  '久美浜町坂井',
  'くみはまちょうさかい',
  '{"en":"Kumihamacho-Sakai"}'::jsonb,
  35.590991,
  134.917718,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_koguwa',
  '久美浜町小桑',
  'くみはまちょうこぐわ',
  '{"en":"Kumihamacho-Koguwa"}'::jsonb,
  35.5692778,
  134.9702521,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_koyama',
  '久美浜町甲山',
  'くみはまちょうこうやま',
  '{"en":"Kumihamacho-Koyama"}'::jsonb,
  35.613386,
  134.917607,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392811,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_konashi',
  '久美浜町河梨',
  'くみはまちょうこうなし',
  '{"en":"Kumihamacho-Konashi"}'::jsonb,
  35.5956142,
  134.8745289,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_go',
  '久美浜町郷',
  'くみはまちょうごう',
  '{"en":"Kumihamacho-Go"}'::jsonb,
  35.589218,
  134.967147,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kuchimaji',
  '久美浜町口馬地',
  'くみはまちょうくちまじ',
  '{"en":"Kumihamacho-Kuchimaji"}'::jsonb,
  35.593149,
  134.887922,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392814,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kandani',
  '久美浜町神谷',
  'くみはまちょうかんだに',
  '{"en":"Kumihamacho-Kandani"}'::jsonb,
  35.601874,
  134.874731,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kanzaki',
  '久美浜町神崎',
  'くみはまちょうかんざき',
  '{"en":"Kumihamacho-Kanzaki"}'::jsonb,
  35.624622,
  134.917198,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867392816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kamai',
  '久美浜町蒲井',
  'くみはまちょうかまい',
  '{"en":"Kumihamacho-Kamai"}'::jsonb,
  35.648286,
  134.875249,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kano',
  '久美浜町鹿野',
  'くみはまちょうかの',
  '{"en":"Kumihamacho-Kano"}'::jsonb,
  35.637324,
  134.934613,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kanaya',
  '久美浜町金谷',
  'くみはまちょうかなや',
  '{"en":"Kumihamacho-Kanaya"}'::jsonb,
  35.558296,
  134.936883,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_kazurano',
  '久美浜町葛野',
  'くみはまちょうかづらの',
  '{"en":"Kumihamacho-Kazurano"}'::jsonb,
  35.6392186,
  134.9290698,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_okumaji',
  '久美浜町奥馬地',
  'くみはまちょうおくまじ',
  '{"en":"Kumihamacho-Okumaji"}'::jsonb,
  35.5835164,
  134.884104,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_omukai',
  '久美浜町大向',
  'くみはまちょうおおむかい',
  '{"en":"Kumihamacho-Omukai"}'::jsonb,
  35.642775,
  134.895393,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_oi',
  '久美浜町大井',
  'くみはまちょうおおい',
  '{"en":"Kumihamacho-Oi"}'::jsonb,
  35.6140333,
  134.9489172,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_endonji',
  '久美浜町円頓寺',
  'くみはまちょうえんどんじ',
  '{"en":"Kumihamacho-Endonji"}'::jsonb,
  35.5881732,
  134.9867127,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_urake',
  '久美浜町浦明',
  'くみはまちょううらけ',
  '{"en":"Kumihamacho-Urake"}'::jsonb,
  35.626879,
  134.929376,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_ichibu',
  '久美浜町壱分',
  'くみはまちょういちぶ',
  '{"en":"Kumihamacho-Ichibu"}'::jsonb,
  35.6064564,
  134.9520109,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_ichiba',
  '久美浜町市場',
  'くみはまちょういちば',
  '{"en":"Kumihamacho-Ichiba"}'::jsonb,
  35.5679595,
  134.9350225,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_ichinono',
  '久美浜町市野々',
  'くみはまちょういちのの',
  '{"en":"Kumihamacho-Ichinono"}'::jsonb,
  35.5399578,
  134.9536036,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_izusumi',
  '久美浜町出角',
  'くみはまちょういずすみ',
  '{"en":"Kumihamacho-Izusumi"}'::jsonb,
  35.5676918,
  134.9447954,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_anyoji',
  '久美浜町安養寺',
  'くみはまちょうあんようじ',
  '{"en":"Kumihamacho-Anyoji"}'::jsonb,
  35.5763982,
  134.9625323,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_ama',
  '久美浜町海士',
  'くみはまちょうあま',
  '{"en":"Kumihamacho-Ama"}'::jsonb,
  35.602744,
  134.930157,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho_ashiwara',
  '久美浜町芦原',
  'くみはまちょうあしわら',
  '{"en":"Kumihamacho-Ashiwara"}'::jsonb,
  35.580103,
  134.93974,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumihamacho',
  '久美浜町',
  'くみはまちょう',
  '{"en":"Kumihamacho"}'::jsonb,
  35.607463,
  134.891294,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_morimoto',
  '大宮町森本',
  'おおみやちょうもりもと',
  '{"en":"Omiyacho-Morimoto"}'::jsonb,
  35.582543,
  135.130373,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_misaka',
  '大宮町三坂',
  'おおみやちょうみさか',
  '{"en":"Omiyacho-Misaka"}'::jsonb,
  35.577971,
  135.105396,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_mie',
  '大宮町三重',
  'おおみやちょうみえ',
  '{"en":"Omiyacho-Mie"}'::jsonb,
  35.5659488,
  135.1150858,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_nobutoshi',
  '大宮町延利',
  'おおみやちょうのぶとし',
  '{"en":"Omiyacho-Nobutoshi"}'::jsonb,
  35.5976023,
  135.1445885,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_taniuchi',
  '大宮町谷内',
  'おおみやちょうたにうち',
  '{"en":"Omiyacho-Taniuchi"}'::jsonb,
  35.5640968,
  135.0986231,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_zennoji',
  '大宮町善王寺',
  'おおみやちょうぜんのうじ',
  '{"en":"Omiyacho-Zennoji"}'::jsonb,
  35.5942088,
  135.075017,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_suki',
  '大宮町周枳',
  'おおみやちょうすき',
  '{"en":"Omiyacho-Suki"}'::jsonb,
  35.588707,
  135.106035,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_shingu',
  '大宮町新宮',
  'おおみやちょうしんぐう',
  '{"en":"Omiyacho-Shingu"}'::jsonb,
  35.6051475,
  135.1621404,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_kobe',
  '大宮町河辺',
  'おおみやちょうこうべ',
  '{"en":"Omiyacho-Kobe"}'::jsonb,
  35.6024308,
  135.0970285,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_kuchiono',
  '大宮町口大野',
  'おおみやちょうくちおおの',
  '{"en":"Omiyacho-Kuchiono"}'::jsonb,
  35.583472,
  135.085051,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_kusumi',
  '大宮町久住',
  'おおみやちょうくすみ',
  '{"en":"Omiyacho-Kusumi"}'::jsonb,
  35.617013,
  135.135299,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_okuono',
  '大宮町奥大野',
  'おおみやちょうおくおおの',
  '{"en":"Omiyacho-Okuono"}'::jsonb,
  35.564156,
  135.079893,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_ikaga',
  '大宮町五十河',
  'おおみやちょういかが',
  '{"en":"Omiyacho-Ikaga"}'::jsonb,
  35.6122921,
  135.1522649,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omiyacho_akeda',
  '大宮町明田',
  'おおみやちょうあけだ',
  '{"en":"Omiyacho-Akeda"}'::jsonb,
  35.5961227,
  135.1296329,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_mizono',
  '網野町溝野',
  'あみのちょうみぞの',
  '{"en":"Aminocho-Mizono"}'::jsonb,
  35.6382505,
  134.9692034,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_hiwada',
  '網野町日和田',
  'あみのちょうひわだ',
  '{"en":"Aminocho-Hiwada"}'::jsonb,
  35.628944,
  134.991618,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_hamazume',
  '網野町浜詰',
  'あみのちょうはまづめ',
  '{"en":"Aminocho-Hamazume"}'::jsonb,
  35.663988,
  134.971467,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_chuzenji',
  '網野町仲禅寺',
  'あみのちょうちゅうぜんじ',
  '{"en":"Aminocho-Chuzenji"}'::jsonb,
  35.661562,
  135.054914,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_tawarano',
  '網野町俵野',
  'あみのちょうたわらの',
  '{"en":"Aminocho-Tawarano"}'::jsonb,
  35.6489667,
  134.964478,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_takahashi',
  '網野町高橋',
  'あみのちょうたかはし',
  '{"en":"Aminocho-Takahashi"}'::jsonb,
  35.6604324,
  135.0325968,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_shinjo',
  '網野町新庄',
  'あみのちょうしんじょう',
  '{"en":"Aminocho-Shinjo"}'::jsonb,
  35.6559819,
  135.0177452,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_shimazu',
  '網野町島津',
  'あみのちょうしまづ',
  '{"en":"Aminocho-Shimazu"}'::jsonb,
  35.6788372,
  135.0516165,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_shioe',
  '網野町塩江',
  'あみのちょうしおえ',
  '{"en":"Aminocho-Shioe"}'::jsonb,
  35.6747527,
  134.9735536,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_go',
  '網野町郷',
  'あみのちょうごう',
  '{"en":"Aminocho-Go"}'::jsonb,
  35.6474428,
  135.0300007,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396757,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_gujo',
  '網野町公庄',
  'あみのちょうぐじょう',
  '{"en":"Aminocho-Gujo"}'::jsonb,
  35.654368,
  135.037801,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_kirihata',
  '網野町切畑',
  'あみのちょうきりはた',
  '{"en":"Aminocho-Kirihata"}'::jsonb,
  35.6163494,
  135.0072694,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_kitsu',
  '網野町木津',
  'あみのちょうきつ',
  '{"en":"Aminocho-Kitsu"}'::jsonb,
  35.6542636,
  134.9770869,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_osaka',
  '網野町尾坂',
  'あみのちょうおさか',
  '{"en":"Aminocho-Osaka"}'::jsonb,
  35.696106,
  135.078096,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aminocho_ikunouchi',
  '網野町生野内',
  'あみのちょういくのうち',
  '{"en":"Aminocho-Ikunouchi"}'::jsonb,
  35.642039,
  135.039762,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867396762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wagicho',
  '和木町',
  'わぎちょう',
  '{"en":"Wagicho"}'::jsonb,
  35.277205,
  135.292165,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wakamatsucho',
  '若松町',
  'わかまつちょう',
  '{"en":"Wakamatsucho"}'::jsonb,
  35.2999812,
  135.258365,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wakatakecho',
  '若竹町',
  'わかたけちょう',
  '{"en":"Wakatakecho"}'::jsonb,
  35.298697,
  135.259383,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasubacho',
  '安場町',
  'やすばちょう',
  '{"en":"Yasubacho"}'::jsonb,
  35.278852,
  135.237549,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yashirocho',
  '八代町',
  'やしろちょう',
  '{"en":"Yashirocho"}'::jsonb,
  35.3860314,
  135.295943,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_monobecho',
  '物部町',
  'ものべちょう',
  '{"en":"Monobecho"}'::jsonb,
  35.355659,
  135.223632,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mukodacho',
  '向田町',
  'むこうだちょう',
  '{"en":"Mukodacho"}'::jsonb,
  35.363653,
  135.251234,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyashirocho',
  '宮代町',
  'みやしろちょう',
  '{"en":"Miyashirocho"}'::jsonb,
  35.300403,
  135.244793,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mitsunocho',
  '光野町',
  'みつのちょう',
  '{"en":"Mitsunocho"}'::jsonb,
  35.4103548,
  135.4658675,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mikatacho',
  '味方町',
  'みかたちょう',
  '{"en":"Mikatacho"}'::jsonb,
  35.2996496,
  135.2751665,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399255,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hongucho',
  '本宮町',
  'ほんぐうちょう',
  '{"en":"Hongucho"}'::jsonb,
  35.294766,
  135.261863,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hoshibaracho',
  '星原町',
  'ほしばらちょう',
  '{"en":"Hoshibaracho"}'::jsonb,
  35.336949,
  135.263961,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_boguchicho',
  '坊口町',
  'ぼうぐちちょう',
  '{"en":"Boguchicho"}'::jsonb,
  35.390499,
  135.236334,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_besshocho',
  '別所町',
  'べっしょちょう',
  '{"en":"Besshocho"}'::jsonb,
  35.374465,
  135.26742,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_fuchigakicho',
  '渕垣町',
  'ふちがきちょう',
  '{"en":"Fuchigakicho"}'::jsonb,
  35.3231547,
  135.2924808,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hirosecho',
  '広瀬町',
  'ひろせちょう',
  '{"en":"Hirosecho"}'::jsonb,
  35.303148,
  135.326678,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashiyamacho',
  '東山町',
  'ひがしやまちょう',
  '{"en":"Higashiyamacho"}'::jsonb,
  35.2989882,
  135.3147321,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hasojicho',
  '白道路町',
  'はそうじちょう',
  '{"en":"Hasojicho"}'::jsonb,
  35.350161,
  135.250718,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hashikamicho',
  '橋上町',
  'はしかみちょう',
  '{"en":"Hashikamicho"}'::jsonb,
  35.311734,
  135.326108,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nobucho',
  '延町',
  'のぶちょう',
  '{"en":"Nobucho"}'::jsonb,
  35.3060671,
  135.2366079,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nodacho',
  '野田町',
  'のだちょう',
  '{"en":"Nodacho"}'::jsonb,
  35.2863936,
  135.2758453,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_niwacho',
  '仁和町',
  'にわちょう',
  '{"en":"Niwacho"}'::jsonb,
  35.3803952,
  135.2370509,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibaracho',
  '西原町',
  'にしばらちょう',
  '{"en":"Nishibaracho"}'::jsonb,
  35.294111,
  135.287883,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishishinmachi',
  '西新町',
  'にししんまち',
  '{"en":"Nishishinmachi"}'::jsonb,
  35.3004085,
  135.2531977,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishizakacho',
  '西坂町',
  'にしざかちょう',
  '{"en":"Nishizakacho"}'::jsonb,
  35.36589,
  135.195814,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishigatacho',
  '西方町',
  'にしがたちょう',
  '{"en":"Nishigatacho"}'::jsonb,
  35.382345,
  135.216178,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nanmatsucho',
  '並松町',
  'なんまつちょう',
  '{"en":"Nanmatsucho"}'::jsonb,
  35.295366,
  135.26344,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakayamacho',
  '中山町',
  'なかやまちょう',
  '{"en":"Nakayamacho"}'::jsonb,
  35.3307651,
  135.3017643,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakasujicho',
  '中筋町',
  'なかすじちょう',
  '{"en":"Nakasujicho"}'::jsonb,
  35.3455939,
  135.2877325,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_toyosatocho',
  '豊里町',
  'とよさとちょう',
  '{"en":"Toyosatocho"}'::jsonb,
  35.319652,
  135.214142,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_toyosakacho',
  'とよさか町',
  'とよさかちょう',
  '{"en":"Toyosakacho"}'::jsonb,
  35.330209,
  135.287332,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399294,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tonasecho',
  '戸奈瀬町',
  'となせちょう',
  '{"en":"Tonasecho"}'::jsonb,
  35.2852305,
  135.3377646,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tokura_mukaicho',
  '十倉向町',
  'とくらむかいちょう',
  '{"en":"Tokura-mukaicho"}'::jsonb,
  35.3310222,
  135.3456413,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tokura_nabatakecho',
  '十倉名畑町',
  'とくらなばたけちょう',
  '{"en":"Tokura-nabatakecho"}'::jsonb,
  35.3370302,
  135.3477625,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tokura_nakamachi',
  '十倉中町',
  'とくらなかまち',
  '{"en":"Tokura-nakamachi"}'::jsonb,
  35.330927,
  135.337934,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tokura_shimocho',
  '十倉志茂町',
  'とくらしもちょう',
  '{"en":"Tokura-shimocho"}'::jsonb,
  35.3272542,
  135.3298682,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tenjincho',
  '天神町',
  'てんじんちょう',
  '{"en":"Tenjincho"}'::jsonb,
  35.3013165,
  135.254917,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_teramachi',
  '寺町',
  'てらまち',
  '{"en":"Teramachi"}'::jsonb,
  35.2877558,
  135.2612708,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsukimicho',
  '月見町',
  'つきみちょう',
  '{"en":"Tsukimicho"}'::jsonb,
  35.296906,
  135.255058,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tamachi',
  '田町',
  'たまち',
  '{"en":"Tamachi"}'::jsonb,
  35.2961684,
  135.2566332,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tanocho',
  '田野町',
  'たのちょう',
  '{"en":"Tanocho"}'::jsonb,
  35.2845262,
  135.2496063,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tachicho',
  '舘町',
  'たちちょう',
  '{"en":"Tachicho"}'::jsonb,
  35.326797,
  135.219809,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tadacho_quarter',
  '多田町',
  'ただちょう',
  '{"en":"Tadacho"}'::jsonb,
  35.320705,
  135.269161,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takanosucho',
  '鷹栖町',
  'たかのすちょう',
  '{"en":"Takanosucho"}'::jsonb,
  35.2960283,
  135.3085292,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takatsucho',
  '高津町',
  'たかつちょう',
  '{"en":"Takatsucho"}'::jsonb,
  35.3025843,
  135.2123934,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takatsukicho',
  '高槻町',
  'たかつきちょう',
  '{"en":"Takatsukicho"}'::jsonb,
  35.365854,
  135.308951,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takakuracho',
  '高倉町',
  'たかくらちょう',
  '{"en":"Takakuracho"}'::jsonb,
  35.331125,
  135.278063,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinmachi',
  '新町',
  'しんまち',
  '{"en":"Shinmachi"}'::jsonb,
  35.296143,
  135.2584863,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinjocho',
  '新庄町',
  'しんじょうちょう',
  '{"en":"Shinjocho"}'::jsonb,
  35.347995,
  135.214703,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shingucho',
  '新宮町',
  'しんぐうちょう',
  '{"en":"Shingucho"}'::jsonb,
  35.2965591,
  135.2594667,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_jingujicho',
  '神宮寺町',
  'じんぐうじちょう',
  '{"en":"Jingujicho"}'::jsonb,
  35.297488,
  135.250321,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shiroyamacho',
  '城山町',
  'しろやまちょう',
  '{"en":"Shiroyamacho"}'::jsonb,
  35.329069,
  135.270473,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoyatacho',
  '下八田町',
  'しもやたちょう',
  '{"en":"Shimoyatacho"}'::jsonb,
  35.3089875,
  135.2832475,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867399316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoshihara',
  '吉原',
  'よしはら',
  '{"en":"Yoshihara"}'::jsonb,
  35.5324268,
  135.198908,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400391,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyamura',
  '宮村',
  'みやむら',
  '{"en":"Miyamura"}'::jsonb,
  35.5264137,
  135.1974707,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mannen',
  '万年',
  'まんねん',
  '{"en":"Mannen"}'::jsonb,
  35.540881,
  135.178843,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_matsubara',
  '松原',
  'まつばら',
  '{"en":"Matsubara"}'::jsonb,
  35.5275208,
  135.191935,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_matsuo',
  '松尾',
  'まつお',
  '{"en":"Matsuo"}'::jsonb,
  35.6383931,
  135.2080606,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashino',
  '東野',
  'ひがしの',
  '{"en":"Higashino"}'::jsonb,
  35.641596,
  135.198287,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400396,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hata',
  '畑',
  'はた',
  '{"en":"Hata"}'::jsonb,
  35.612808,
  135.195638,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nariaiji',
  '成相寺',
  'なりあいじ',
  '{"en":"Nariaiji"}'::jsonb,
  35.5958768,
  135.1879914,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tawara',
  '田原',
  'たわら',
  '{"en":"Tawara"}'::jsonb,
  35.685027,
  135.269211,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400399,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takiba',
  '滝馬',
  'たきば',
  '{"en":"Takiba"}'::jsonb,
  35.5260673,
  135.1867345,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400400,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_so',
  '惣',
  'そう',
  '{"en":"So"}'::jsonb,
  35.533969,
  135.20683,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoseya',
  '下世屋',
  'しもせや',
  '{"en":"Shimoseya"}'::jsonb,
  35.6304754,
  135.209437,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_komakura',
  '駒倉',
  'こまくら',
  '{"en":"Komakura"}'::jsonb,
  35.640386,
  135.165815,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_gingaoka',
  '銀丘',
  'ぎんがおか',
  '{"en":"Gingaoka"}'::jsonb,
  35.5558369,
  135.2358157,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400404,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kita_quarter',
  '喜多',
  'きた',
  '{"en":"Kita"}'::jsonb,
  35.5124717,
  135.1818304,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400405,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kigo',
  '木子',
  'きご',
  '{"en":"Kigo"}'::jsonb,
  35.6580716,
  135.1853127,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400406,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiseya',
  '上世屋',
  'かみせや',
  '{"en":"Kamiseya"}'::jsonb,
  35.6372176,
  135.1890088,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400407,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kagamigaura',
  '鏡ケ浦',
  'かがみがうら',
  '{"en":"Kagamigaura"}'::jsonb,
  35.5640476,
  135.248053,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oda',
  '小田',
  'おだ',
  '{"en":"Oda"}'::jsonb,
  35.48396,
  135.162845,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400409,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okuhami',
  '奥波見',
  'おくはみ',
  '{"en":"Okuhami"}'::jsonb,
  35.6478217,
  135.2326338,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400410,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imafuku',
  '今福',
  'いまふく',
  '{"en":"Imafuku"}'::jsonb,
  35.5123902,
  135.1909028,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867400411,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimobaracho',
  '下原町',
  'しもばらちょう',
  '{"en":"Shimobaracho"}'::jsonb,
  35.2871686,
  135.3048391,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460917,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinodacho',
  '篠田町',
  'しのだちょう',
  '{"en":"Shinodacho"}'::jsonb,
  35.3685622,
  135.27073,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shichihyakukokucho',
  '七百石町',
  'しちひゃくこくちょう',
  '{"en":"Shichihyakukokucho"}'::jsonb,
  35.3561205,
  135.2872239,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460919,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shitanokachicho',
  '下替地町',
  'したのかちちょう',
  '{"en":"Shitanokachicho"}'::jsonb,
  35.2815427,
  135.3299715,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shigasatocho',
  '志賀郷町',
  'しがさとちょう',
  '{"en":"Shigasatocho"}'::jsonb,
  35.3686782,
  135.2393133,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460921,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_satocho',
  '里町',
  'さとちょう',
  '{"en":"Satocho"}'::jsonb,
  35.3128119,
  135.2640234,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_saiwaidori',
  '幸通り',
  'さいわいどおり',
  '{"en":"Saiwaidori"}'::jsonb,
  35.301389,
  135.250709,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_konishicho',
  '小西町',
  'こにしちょう',
  '{"en":"Konishicho"}'::jsonb,
  35.328903,
  135.200256,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kurotanicho',
  '黒谷町',
  'くろたにちょう',
  '{"en":"Kurotanicho"}'::jsonb,
  35.380878,
  135.316909,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuricho',
  '栗町',
  'くりちょう',
  '{"en":"Kuricho"}'::jsonb,
  35.3162825,
  135.2215439,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460929,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kisaichicho',
  '私市町',
  'きさいちちょう',
  '{"en":"Kisaichicho"}'::jsonb,
  35.3167931,
  135.1965081,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460930,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanbaracho',
  '上原町',
  'かんばらちょう',
  '{"en":"Kanbaracho"}'::jsonb,
  35.2938093,
  135.3235033,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawaitocho',
  '川糸町',
  'かわいとちょう',
  '{"en":"Kawaitocho"}'::jsonb,
  35.3003776,
  135.2630446,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiyatacho',
  '上八田町',
  'かみやたちょう',
  '{"en":"Kamiyatacho"}'::jsonb,
  35.356497,
  135.272664,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460933,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamanowacho',
  '釜輪町',
  'かまのわちょう',
  '{"en":"Kamanowacho"}'::jsonb,
  35.2989486,
  135.340317,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460934,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanegochicho',
  '金河内町',
  'かねごちちょう',
  '{"en":"Kanegochicho"}'::jsonb,
  35.386697,
  135.248426,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460935,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kajiyacho',
  '鍛治屋町',
  'かじやちょう',
  '{"en":"Kajiyacho"}'::jsonb,
  35.34081,
  135.201065,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_orocho',
  '小呂町',
  'おろちょう',
  '{"en":"Orocho"}'::jsonb,
  35.339181,
  135.273724,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460937,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oyogicho',
  '於与岐町',
  'およぎちょう',
  '{"en":"Oyogicho"}'::jsonb,
  35.378177,
  135.3503881,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460938,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obatacho',
  '小畑町',
  'おばたちょう',
  '{"en":"Obatacho"}'::jsonb,
  35.349571,
  135.189485,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460939,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okayasucho',
  '岡安町',
  'おかやすちょう',
  '{"en":"Okayasucho"}'::jsonb,
  35.335731,
  135.294322,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okacho',
  '岡町',
  'おかちょう',
  '{"en":"Okacho"}'::jsonb,
  35.299019,
  135.238827,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ogaicho',
  '小貝町',
  'おがいちょう',
  '{"en":"Ogaicho"}'::jsonb,
  35.309809,
  135.202642,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_obatakecho',
  '大畠町',
  'おおばたけちょう',
  '{"en":"Obatakecho"}'::jsonb,
  35.333604,
  135.2267297,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460943,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oshimacho',
  '大島町',
  'おおしまちょう',
  '{"en":"Oshimacho"}'::jsonb,
  35.3011967,
  135.2264956,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ekimaedori',
  '駅前通り',
  'えきまえどおり',
  '{"en":"Ekimaedori"}'::jsonb,
  35.300608,
  135.2522843,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460945,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uwanobucho',
  '上延町',
  'うわのぶちょう',
  '{"en":"Uwanobucho"}'::jsonb,
  35.2949574,
  135.2335989,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460946,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_umezakocho',
  '梅迫町',
  'うめざこちょう',
  '{"en":"Umezakocho"}'::jsonb,
  35.344724,
  135.3135131,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uchiguicho',
  '内久井町',
  'うちぐいちょう',
  '{"en":"Uchiguicho"}'::jsonb,
  35.3866879,
  135.257819,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uenocho',
  '上野町',
  'うえのちょう',
  '{"en":"Uenocho"}'::jsonb,
  35.290526,
  135.255912,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uesugicho',
  '上杉町',
  'うえすぎちょう',
  '{"en":"Uesugicho"}'::jsonb,
  35.3645906,
  135.3228576,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460950,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imadacho',
  '今田町',
  'いまだちょう',
  '{"en":"Imadacho"}'::jsonb,
  35.333602,
  135.211592,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inokuracho',
  '井倉町',
  'いのくらちょう',
  '{"en":"Inokuracho"}'::jsonb,
  35.301936,
  135.241886,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inokura_shinmachi',
  '井倉新町',
  'いのくらしんまち',
  '{"en":"Inokura-shinmachi"}'::jsonb,
  35.305486,
  135.250184,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inecho',
  '井根町',
  'いねちょう',
  '{"en":"Inecho"}'::jsonb,
  35.351369,
  135.357412,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_idencho',
  '位田町',
  'いでんちょう',
  '{"en":"Idencho"}'::jsonb,
  35.3146612,
  135.2454556,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ishiwaracho',
  '石原町',
  'いしわらちょう',
  '{"en":"Ishiwaracho"}'::jsonb,
  35.316568,
  135.207009,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ankokujicho',
  '安国寺町',
  'あんこくじちょう',
  '{"en":"Ankokujicho"}'::jsonb,
  35.33708,
  135.3051906,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ariokacho',
  '有岡町',
  'ありおかちょう',
  '{"en":"Ariokacho"}'::jsonb,
  35.328685,
  135.25644,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460958,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ayanakacho',
  '綾中町',
  'あやなかちょう',
  '{"en":"Ayanakacho"}'::jsonb,
  35.3012241,
  135.259119,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460959,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asahicho_quarter',
  '旭町',
  'あさひちょう',
  '{"en":"Asahicho"}'::jsonb,
  35.3156141,
  135.3132696,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aonocho',
  '青野町',
  'あおのちょう',
  '{"en":"Aonocho"}'::jsonb,
  35.3056506,
  135.2591117,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aioicho',
  '相生町',
  'あいおいちょう',
  '{"en":"Aioicho"}'::jsonb,
  35.3002316,
  135.2546537,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867460962,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ryugucho',
  '竜宮町',
  'りゅうぐうちょう',
  '{"en":"Ryugucho"}'::jsonb,
  35.4809325,
  135.4059817,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yohoro',
  '与保呂',
  'よほろ',
  '{"en":"Yohoro"}'::jsonb,
  35.445637,
  135.4275863,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoshino',
  '吉野',
  'よしの',
  '{"en":"Yoshino"}'::jsonb,
  35.4977524,
  135.4309895,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yukinaga_higashimachi',
  '行永東町',
  'ゆきながひがしまち',
  '{"en":"Yukinaga-higashimachi"}'::jsonb,
  35.463928,
  135.399154,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yukinaga_sakuradori',
  '行永桜通り',
  'ゆきながさくらどおり',
  '{"en":"Yukinaga-sakuradori"}'::jsonb,
  35.4650411,
  135.4033767,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yukinaga',
  '行永',
  'ゆきなが',
  '{"en":"Yukinaga"}'::jsonb,
  35.451092,
  135.389039,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yanosukecho',
  '矢之助町',
  'やのすけちょう',
  '{"en":"Yanosukecho"}'::jsonb,
  35.473033,
  135.401705,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasuokacho',
  '安岡町',
  'やすおかちょう',
  '{"en":"Yasuokacho"}'::jsonb,
  35.4829463,
  135.4330656,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491539,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasuoka',
  '安岡',
  'やすおか',
  '{"en":"Yasuoka"}'::jsonb,
  35.4859411,
  135.4362724,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_morihonmachi',
  '森本町',
  'もりほんまち',
  '{"en":"Morihonmachi"}'::jsonb,
  35.4636486,
  135.3911639,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_moricho',
  '森町',
  'もりちょう',
  '{"en":"Moricho"}'::jsonb,
  35.4669017,
  135.3940734,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mori_quarter_8867491543',
  '森',
  'もり',
  '{"en":"Mori"}'::jsonb,
  35.459699,
  135.379626,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491543,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_momoyamacho',
  '桃山町',
  'ももやまちょう',
  '{"en":"Momoyamacho"}'::jsonb,
  35.467236,
  135.390988,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyazuguchi',
  '宮津口',
  'みやづぐち',
  '{"en":"Miyazuguchi"}'::jsonb,
  35.449894,
  135.323101,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minamihamacho',
  '南浜町',
  'みなみはまちょう',
  '{"en":"Minamihamacho"}'::jsonb,
  35.4678275,
  135.3960938,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minamitanabe',
  '南田辺',
  'みなみたなべ',
  '{"en":"Minamitanabe"}'::jsonb,
  35.4466943,
  135.331068,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizoshiri_nakamachi',
  '溝尻中町',
  'みぞしりなかまち',
  '{"en":"Mizoshiri-nakamachi"}'::jsonb,
  35.470035,
  135.4052217,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizoshiricho',
  '溝尻町',
  'みぞしりちょう',
  '{"en":"Mizoshiricho"}'::jsonb,
  35.4670048,
  135.4084702,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mizoshiri_quarter',
  '溝尻',
  'みぞしり',
  '{"en":"Mizoshiri"}'::jsonb,
  35.470699,
  135.41,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_manganji',
  '万願寺',
  'まんがんじ',
  '{"en":"Manganji"}'::jsonb,
  35.430481,
  135.342912,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maruyama_nishimachi',
  '丸山西町',
  'まるやまにしまち',
  '{"en":"Maruyama-nishimachi"}'::jsonb,
  35.4570368,
  135.3883277,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maruyama_nakamachi',
  '丸山中町',
  'まるやまなかまち',
  '{"en":"Maruyama-nakamachi"}'::jsonb,
  35.458261,
  135.3906093,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maruyamacho',
  '丸山町',
  'まるやまちょう',
  '{"en":"Maruyamacho"}'::jsonb,
  35.4564994,
  135.3911746,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maruyamaguchicho',
  '丸山口町',
  'まるやまぐちちょう',
  '{"en":"Maruyamaguchicho"}'::jsonb,
  35.4597363,
  135.391434,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_matsukage',
  '松陰',
  'まつかげ',
  '{"en":"Matsukage"}'::jsonb,
  35.4540008,
  135.3236856,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_matsuo_quarter',
  '松尾',
  'まつお',
  '{"en":"Matsuo"}'::jsonb,
  35.4957052,
  135.4682043,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_magura',
  '真倉',
  'まぐら',
  '{"en":"Magura"}'::jsonb,
  35.400045,
  135.31702,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hon',
  '本',
  'ほん',
  '{"en":"Hon"}'::jsonb,
  35.448356,
  135.3273207,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_horikami',
  '堀上',
  'ほりかみ',
  '{"en":"Horikami"}'::jsonb,
  35.4476116,
  135.3252347,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hori_quarter',
  '堀',
  'ほり',
  '{"en":"Hori"}'::jsonb,
  35.4063693,
  135.3428776,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_bessho_quarter',
  '別所',
  'べっしょ',
  '{"en":"Bessho"}'::jsonb,
  35.4126636,
  135.3613007,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_fumuro',
  '富室',
  'ふむろ',
  '{"en":"Fumuro"}'::jsonb,
  35.444524,
  135.237839,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_fukitonyamachi',
  '福来問屋町',
  'ふきとんやまち',
  '{"en":"Fukitonyamachi"}'::jsonb,
  35.4416393,
  135.3484095,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_fuki',
  '福来',
  'ふき',
  '{"en":"Fuki"}'::jsonb,
  35.4450044,
  135.3506651,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hiranoya',
  '平野屋',
  'ひらのや',
  '{"en":"Hiranoya"}'::jsonb,
  35.4498419,
  135.3276335,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hikitsuchishin',
  '引土新',
  'ひきつちしん',
  '{"en":"Hikitsuchishin"}'::jsonb,
  35.445599,
  135.323988,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hikitsuchi',
  '引土',
  'ひきつち',
  '{"en":"Hikitsuchi"}'::jsonb,
  35.440638,
  135.32113,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashiyoshihara',
  '東吉原',
  'ひがしよしはら',
  '{"en":"Higashiyoshihara"}'::jsonb,
  35.457594,
  135.32775,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hamamachi_quarter',
  '浜町',
  'はままち',
  '{"en":"Hamamachi"}'::jsonb,
  35.4682307,
  135.39329,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hama',
  '浜',
  'はま',
  '{"en":"Hama"}'::jsonb,
  35.474708,
  135.393147,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hattanda_minamimachi',
  '八反田南町',
  'はったんだみなみまち',
  '{"en":"Hattanda-minamimachi"}'::jsonb,
  35.451469,
  135.396444,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hattanda_kitamachi',
  '八反田北町',
  'はったんだきたまち',
  '{"en":"Hattanda-kitamachi"}'::jsonb,
  35.4542443,
  135.3943816,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nomuraji',
  '野村寺',
  'のむらじ',
  '{"en":"Nomuraji"}'::jsonb,
  35.4324872,
  135.3066389,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nunoshiki',
  '布敷',
  'ぬのしき',
  '{"en":"Nunoshiki"}'::jsonb,
  35.4088861,
  135.3574864,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nyokitamachi',
  '女布北町',
  'にょうきたまち',
  '{"en":"Nyokitamachi"}'::jsonb,
  35.429826,
  135.322721,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491576,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nyo',
  '女布',
  'にょう',
  '{"en":"Nyo"}'::jsonb,
  35.4220504,
  135.3159429,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishiyoshihara',
  '西吉原',
  'にしよしはら',
  '{"en":"Nishiyoshihara"}'::jsonb,
  35.4553534,
  135.3291143,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishi_quarter',
  '西',
  'にし',
  '{"en":"Nishi"}'::jsonb,
  35.44988,
  135.320419,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nanukaichi',
  '七日市',
  'なぬかいち',
  '{"en":"Nanukaichi"}'::jsonb,
  35.429017,
  135.33213,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagatani',
  '長谷',
  'ながたに',
  '{"en":"Nagatani"}'::jsonb,
  35.48749,
  135.253967,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakada',
  '中田',
  'なかだ',
  '{"en":"Nakada"}'::jsonb,
  35.5143,
  135.406345,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tokura',
  '十倉',
  'とくら',
  '{"en":"Tokura"}'::jsonb,
  35.4179741,
  135.3282724,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_donooku',
  '堂奥',
  'どうのおく',
  '{"en":"Donooku"}'::jsonb,
  35.4626458,
  135.4226115,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tendaishinmachi',
  '天台新町',
  'てんだいしんまち',
  '{"en":"Tendaishinmachi"}'::jsonb,
  35.4516282,
  135.3600022,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tendai',
  '天台',
  'てんだい',
  '{"en":"Tendai"}'::jsonb,
  35.4502694,
  135.3640405,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_terada_quarter_8867491589',
  '寺田',
  'てらだ',
  '{"en":"Terada"}'::jsonb,
  35.4286034,
  135.3876181,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsuneshinmachi',
  '常新町',
  'つねしんまち',
  '{"en":"Tsuneshinmachi"}'::jsonb,
  35.4501091,
  135.4030678,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsune',
  '常',
  'つね',
  '{"en":"Tsune"}'::jsonb,
  35.447964,
  135.4055915,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chitose_quarter',
  '千歳',
  'ちとせ',
  '{"en":"Chitose"}'::jsonb,
  35.537042,
  135.338914,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tanba',
  '丹波',
  'たんば',
  '{"en":"Tanba"}'::jsonb,
  35.4498407,
  135.3283002,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tamon_in',
  '多門院',
  'たもんいん',
  '{"en":"Tamon-in"}'::jsonb,
  35.4610104,
  135.4475044,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_taneji',
  '多祢寺',
  'たねじ',
  '{"en":"Taneji"}'::jsonb,
  35.5297139,
  135.3858033,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tanakacho',
  '田中町',
  'たなかちょう',
  '{"en":"Tanakacho"}'::jsonb,
  35.482671,
  135.420989,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tanaka',
  '田中',
  'たなか',
  '{"en":"Tanaka"}'::jsonb,
  35.485035,
  135.4275443,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takeya',
  '竹屋',
  'たけや',
  '{"en":"Takeya"}'::jsonb,
  35.4509104,
  135.3265153,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takigauro',
  '滝ケ宇呂',
  'たきがうろ',
  '{"en":"Takigauro"}'::jsonb,
  35.4599699,
  135.2019569,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takanoyuri',
  '高野由里',
  'たかのゆり',
  '{"en":"Takanoyuri"}'::jsonb,
  35.430801,
  135.31693,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_takanodai',
  '高野台',
  'たかのだい',
  '{"en":"Takanodai"}'::jsonb,
  35.427873,
  135.31627,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shin',
  '新',
  'しん',
  '{"en":"Shin"}'::jsonb,
  35.4490263,
  135.3239894,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shiroyacho',
  '白屋町',
  'しろやちょう',
  '{"en":"Shiroyacho"}'::jsonb,
  35.494933,
  135.434454,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shiroya',
  '白屋',
  'しろや',
  '{"en":"Shiroya"}'::jsonb,
  35.497081,
  135.442025,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shirataki',
  '白滝',
  'しらたき',
  '{"en":"Shirataki"}'::jsonb,
  35.416694,
  135.390488,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shokunin',
  '職人',
  'しょくにん',
  '{"en":"Shokunin"}'::jsonb,
  35.4499543,
  135.3290777,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_showadai',
  '昭和台',
  'しょうわだい',
  '{"en":"Showadai"}'::jsonb,
  35.451568,
  135.353719,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_joya',
  '城屋',
  'じょうや',
  '{"en":"Joya"}'::jsonb,
  35.4166911,
  135.3017818,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimomidani',
  '下見谷',
  'しもみだに',
  '{"en":"Shimomidani"}'::jsonb,
  35.4723856,
  135.2330013,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimofukui',
  '下福井',
  'しもふくい',
  '{"en":"Shimofukui"}'::jsonb,
  35.447687,
  135.309258,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimourushibara',
  '下漆原',
  'しもうるしばら',
  '{"en":"Shimourushibara"}'::jsonb,
  35.4678876,
  135.2418375,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_jinai',
  '寺内',
  'じない',
  '{"en":"Jinai"}'::jsonb,
  35.4512808,
  135.324361,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shichijo_nakamachi',
  '七条中町',
  'しちじょうなかまち',
  '{"en":"Shichijo-nakamachi"}'::jsonb,
  35.4606904,
  135.3966963,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sakaidani',
  '境谷',
  'さかいだに',
  '{"en":"Sakaidani"}'::jsonb,
  35.436719,
  135.34053,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_saihoji',
  '西方寺',
  'さいほうじ',
  '{"en":"Saihoji"}'::jsonb,
  35.464986,
  135.214914,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_konya',
  '紺屋',
  'こんや',
  '{"en":"Konya"}'::jsonb,
  35.447436,
  135.322623,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867491616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_koura',
  '河原',
  'こうら',
  '{"en":"Koura"}'::jsonb,
  35.458581,
  135.23195,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuwagaikami',
  '桑飼上',
  'くわがいかみ',
  '{"en":"Kuwagaikami"}'::jsonb,
  35.411485,
  135.226633,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kurahashi_nakamachi',
  '倉梯中町',
  'くらはしなかまち',
  '{"en":"Kurahashi-nakamachi"}'::jsonb,
  35.460373,
  135.395721,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kurahashicho',
  '倉梯町',
  'くらはしちょう',
  '{"en":"Kurahashicho"}'::jsonb,
  35.463503,
  135.395941,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kuratani',
  '倉谷',
  'くらたに',
  '{"en":"Kuratani"}'::jsonb,
  35.444232,
  135.340088,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumonna',
  '公文名',
  'くもんな',
  '{"en":"Kumonna"}'::jsonb,
  35.432081,
  135.328584,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kiyomichi_shinmachi',
  '清道新町',
  'きよみちしんまち',
  '{"en":"Kiyomichi-shinmachi"}'::jsonb,
  35.45315,
  135.360989,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kiyomichi',
  '清道',
  'きよみち',
  '{"en":"Kiyomichi"}'::jsonb,
  35.454136,
  135.365277,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kiyomigaoka',
  '清美が丘',
  'きよみがおか',
  '{"en":"Kiyomigaoka"}'::jsonb,
  35.4549608,
  135.3597826,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyodashinmachi',
  '京田新町',
  'きょうだしんまち',
  '{"en":"Kyodashinmachi"}'::jsonb,
  35.4283168,
  135.3257771,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyoda',
  '京田',
  'きょうだ',
  '{"en":"Kyoda"}'::jsonb,
  35.413027,
  135.332872,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyogetsu_higashimachi',
  '京月東町',
  'きょうげつひがしまち',
  '{"en":"Kyogetsu-higashimachi"}'::jsonb,
  35.448912,
  135.401515,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyogetsucho',
  '京月町',
  'きょうげつちょう',
  '{"en":"Kyogetsucho"}'::jsonb,
  35.448439,
  135.398734,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyoguchi_quarter',
  '京口',
  'きょうぐち',
  '{"en":"Kyoguchi"}'::jsonb,
  35.446056,
  135.325079,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kinoshita',
  '木ノ下',
  'きのした',
  '{"en":"Kinoshita"}'::jsonb,
  35.4485153,
  135.4114528,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kichisaka',
  '吉坂',
  'きちさか',
  '{"en":"Kichisaka"}'::jsonb,
  35.4861739,
  135.4584576,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitahamacho',
  '北浜町',
  'きたはまちょう',
  '{"en":"Kitahamacho"}'::jsonb,
  35.4680625,
  135.3980776,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitatanabe',
  '北田辺',
  'きたたなべ',
  '{"en":"Kitatanabe"}'::jsonb,
  35.4493934,
  135.3298673,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitasui',
  '北吸',
  'きたすい',
  '{"en":"Kitasui"}'::jsonb,
  35.471467,
  135.381543,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kishidani',
  '岸谷',
  'きしだに',
  '{"en":"Kishidani"}'::jsonb,
  35.405418,
  135.3915459,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kannonji',
  '観音寺',
  'かんのんじ',
  '{"en":"Kannonji"}'::jsonb,
  35.540312,
  135.418324,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kameiwacho',
  '亀岩町',
  'かめいわちょう',
  '{"en":"Kameiwacho"}'::jsonb,
  35.4511674,
  135.398587,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamifukui',
  '上福井',
  'かみふくい',
  '{"en":"Kamifukui"}'::jsonb,
  35.4447194,
  135.2922122,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494539,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiurushibara',
  '上漆原',
  'かみうるしばら',
  '{"en":"Kamiurushibara"}'::jsonb,
  35.497391,
  135.239339,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawara_nishimachi',
  '鹿原西町',
  'かわらにしまち',
  '{"en":"Kawara-nishimachi"}'::jsonb,
  35.48,
  135.438459,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawara_quarter',
  '鹿原',
  'かわら',
  '{"en":"Kawara"}'::jsonb,
  35.4794236,
  135.4455872,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kanayacho',
  '金屋町',
  'かなやちょう',
  '{"en":"Kanayacho"}'::jsonb,
  35.458999,
  135.400543,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494543,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ogura',
  '小倉',
  'おぐら',
  '{"en":"Ogura"}'::jsonb,
  35.4780339,
  135.4273886,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_okayasu',
  '岡安',
  'おかやす',
  '{"en":"Okayasu"}'::jsonb,
  35.4994806,
  135.4380906,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_omata',
  '大俣',
  'おおまた',
  '{"en":"Omata"}'::jsonb,
  35.4444851,
  135.1855906,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ochinocho',
  '大内野町',
  'おおちのちょう',
  '{"en":"Ochinocho"}'::jsonb,
  35.4467744,
  135.3344503,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ouchi',
  '大内',
  'おおうち',
  '{"en":"Ouchi"}'::jsonb,
  35.446423,
  135.335895,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_enmanji',
  '円満寺',
  'えんまんじ',
  '{"en":"Enmanji"}'::jsonb,
  35.448882,
  135.332735,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uoya_quarter',
  '魚屋',
  'うおや',
  '{"en":"Uoya"}'::jsonb,
  35.451617,
  135.328117,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ueyasu_higashimachi',
  '上安東町',
  'うえやすひがしまち',
  '{"en":"Ueyasu-higashimachi"}'::jsonb,
  35.460401,
  135.350838,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uene',
  '上根',
  'うえね',
  '{"en":"Uene"}'::jsonb,
  35.4229521,
  135.3761288,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_imada',
  '今田',
  'いまだ',
  '{"en":"Imada"}'::jsonb,
  35.4185936,
  135.3415132,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichiba_quarter',
  '市場',
  'いちば',
  '{"en":"Ichiba"}'::jsonb,
  35.4764908,
  135.4073835,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_isazu',
  '伊佐津',
  'いさづ',
  '{"en":"Isazu"}'::jsonb,
  35.438662,
  135.332679,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikenouchishimo',
  '池ノ内下',
  'いけのうちしも',
  '{"en":"Ikenouchishimo"}'::jsonb,
  35.4034516,
  135.3523916,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amarubeshimo',
  '余部下',
  'あまるべしも',
  '{"en":"Amarubeshimo"}'::jsonb,
  35.477557,
  135.363615,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amarubekami',
  '余部上',
  'あまるべかみ',
  '{"en":"Amarubekami"}'::jsonb,
  35.4669225,
  135.3654188,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atago_hamamachi',
  '愛宕浜町',
  'あたごはままち',
  '{"en":"Atago-hamamachi"}'::jsonb,
  35.4788,
  135.4054314,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atago_nakamachi',
  '愛宕中町',
  'あたごなかまち',
  '{"en":"Atago-nakamachi"}'::jsonb,
  35.481889,
  135.407233,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atago_shimomachi',
  '愛宕下町',
  'あたごしもまち',
  '{"en":"Atago-shimomachi"}'::jsonb,
  35.4798192,
  135.4067654,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_atago_kamimachi',
  '愛宕上町',
  'あたごかみまち',
  '{"en":"Atago-kamimachi"}'::jsonb,
  35.483571,
  135.408211,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aseku_nishimachi',
  '朝来西町',
  'あせくにしまち',
  '{"en":"Aseku-nishimachi"}'::jsonb,
  35.4999883,
  135.425932,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asekunaka',
  '朝来中',
  'あせくなか',
  '{"en":"Asekunaka"}'::jsonb,
  35.5022658,
  135.4284927,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_asashiro',
  '朝代',
  'あさしろ',
  '{"en":"Asashiro"}'::jsonb,
  35.444299,
  135.324277,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867494565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoshikawacho_yoshida',
  '吉川町吉田',
  'よしかわちょうよしだ',
  '{"en":"Yoshikawacho-Yoshida"}'::jsonb,
  35.0183139,
  135.545724,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yoshikawacho_anagawa',
  '吉川町穴川',
  'よしかわちょうあながわ',
  '{"en":"Yoshikawacho-Anagawa"}'::jsonb,
  35.018462,
  135.554237,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751632,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yokocho',
  '横町',
  'よこちょう',
  '{"en":"Yokocho"}'::jsonb,
  35.010139,
  135.583291,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751633,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yanagimachi',
  '柳町',
  'やなぎまち',
  '{"en":"Yanagimachi"}'::jsonb,
  35.0097316,
  135.5788162,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751634,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yadamachi',
  '矢田町',
  'やだまち',
  '{"en":"Yadamachi"}'::jsonb,
  35.008685,
  135.580521,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasumachi',
  '安町',
  'やすまち',
  '{"en":"Yasumachi"}'::jsonb,
  35.0139744,
  135.5716181,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyakecho',
  '三宅町',
  'みやけちょう',
  '{"en":"Miyakecho"}'::jsonb,
  35.011183,
  135.591194,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751639,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_honmachi_quarter',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  35.0107187,
  135.5792198,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashitatsucho',
  '東竪町',
  'ひがしたつちょう',
  '{"en":"Higashitatsucho"}'::jsonb,
  35.008447,
  135.586921,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatanocho_dongahata',
  '畑野町土ケ畑',
  'はたのちょうどんがはた',
  '{"en":"Hatanocho-Dongahata"}'::jsonb,
  35.0223951,
  135.3909367,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatagomachi',
  '旅籠町',
  'はたごまち',
  '{"en":"Hatagomachi"}'::jsonb,
  35.010024,
  135.58216,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751643,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishimachi',
  '西町',
  'にしまち',
  '{"en":"Nishimachi"}'::jsonb,
  35.0137428,
  135.5767853,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751644,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishibetsuincho_maki',
  '西別院町牧',
  'にしべついんちょうまき',
  '{"en":"Nishibetsuincho-Maki"}'::jsonb,
  34.959135,
  135.487272,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishitatsucho',
  '西竪町',
  'にしたつちょう',
  '{"en":"Nishitatsucho"}'::jsonb,
  35.008323,
  135.584828,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nangocho',
  '南郷町',
  'なんごうちょう',
  '{"en":"Nangocho"}'::jsonb,
  35.013958,
  135.579634,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsukinukecho',
  '突抜町',
  'つきぬけちょう',
  '{"en":"Tsukinukecho"}'::jsonb,
  35.0093647,
  135.585458,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_yui',
  '千代川町湯井',
  'ちよかわちょうゆい',
  '{"en":"Chiyokawacho-Yui"}'::jsonb,
  35.0448037,
  135.5368507,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751649,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_hiyoshidai',
  '千代川町日吉台',
  'ちよかわちょうひよしだい',
  '{"en":"Chiyokawacho-Hiyoshidai"}'::jsonb,
  35.0411355,
  135.543992,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_haida',
  '千代川町拝田',
  'ちよかわちょうはいだ',
  '{"en":"Chiyokawacho-Haida"}'::jsonb,
  35.056039,
  135.534652,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751651,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_chihara',
  '千代川町千原',
  'ちよかわちょうちはら',
  '{"en":"Chiyokawacho-Chihara"}'::jsonb,
  35.054645,
  135.541909,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_takanohayashi',
  '千代川町高野林',
  'ちよかわちょうたかのはやし',
  '{"en":"Chiyokawacho-Takanohayashi"}'::jsonb,
  35.044109,
  135.550351,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751655,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_kitanosho',
  '千代川町北ノ庄',
  'ちよかわちょうきたのしょう',
  '{"en":"Chiyokawacho-Kitanosho"}'::jsonb,
  35.0495113,
  135.53279,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_kawazeki',
  '千代川町川関',
  'ちよかわちょうかわぜき',
  '{"en":"Chiyokawacho-Kawazeki"}'::jsonb,
  35.06034,
  135.544,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_obayashi',
  '千代川町小林',
  'ちよかわちょうおばやし',
  '{"en":"Chiyokawacho-Obayashi"}'::jsonb,
  35.040799,
  135.551253,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_chiyokawacho_imazu',
  '千代川町今津',
  'ちよかわちょういまづ',
  '{"en":"Chiyokawacho-Imazu"}'::jsonb,
  35.049132,
  135.550966,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751665,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinmachi_quarter',
  '新町',
  'しんまち',
  '{"en":"Shinmachi"}'::jsonb,
  35.009924,
  135.580697,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_hirota',
  '篠町広田',
  'しのちょうひろた',
  '{"en":"Shinocho-Hirota"}'::jsonb,
  34.983057,
  135.588199,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751671,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shinocho_kasebara_quarter',
  '篠町柏原',
  'しのちょうかせばら',
  '{"en":"Shinocho-Kasebara"}'::jsonb,
  34.9741,
  135.587892,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shioyamachi',
  '塩屋町',
  'しおやまち',
  '{"en":"Shioyamachi"}'::jsonb,
  35.0091185,
  135.5788511,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_konyamachi',
  '紺屋町',
  'こんやまち',
  '{"en":"Konyamachi"}'::jsonb,
  35.0109525,
  135.5774491,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_gofukumachi',
  '呉服町',
  'ごふくまち',
  '{"en":"Gofukumachi"}'::jsonb,
  35.0089779,
  135.5821667,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kyomachi',
  '京町',
  'きょうまち',
  '{"en":"Kyomachi"}'::jsonb,
  35.00827,
  135.582334,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitamachi',
  '北町',
  'きたまち',
  '{"en":"Kitamachi"}'::jsonb,
  35.015164,
  135.577758,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751677,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawaramachi',
  '河原町',
  'かわらまち',
  '{"en":"Kawaramachi"}'::jsonb,
  35.0198259,
  135.5734325,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_minamikanage',
  '大井町南金岐',
  'おおいちょうみなみかなげ',
  '{"en":"Oicho-Minamikanage"}'::jsonb,
  35.028926,
  135.541747,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751683,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_namikawa',
  '大井町並河',
  'おおいちょうなみかわ',
  '{"en":"Oicho-Namikawa"}'::jsonb,
  35.029287,
  135.564016,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751687,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_tsuchida',
  '大井町土田',
  'おおいちょうつちだ',
  '{"en":"Oicho-Tsuchida"}'::jsonb,
  35.036633,
  135.537095,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_kokanage',
  '大井町小金岐',
  'おおいちょうこかなげ',
  '{"en":"Oicho-Kokanage"}'::jsonb,
  35.0380465,
  135.5415767,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751696,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_kitakanage',
  '大井町北金岐',
  'おおいちょうきたかなげ',
  '{"en":"Oicho-Kitakanage"}'::jsonb,
  35.032234,
  135.540122,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oicho_kasumigaoka',
  '大井町かすみケ丘',
  'おおいちょうかすみがおか',
  '{"en":"Oicho-Kasumigaoka"}'::jsonb,
  35.0333089,
  135.5556935,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751698,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oiwakecho',
  '追分町',
  'おいわけちょう',
  '{"en":"Oiwakecho"}'::jsonb,
  35.0160314,
  135.5811084,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_utsunecho',
  '宇津根町',
  'うつねちょう',
  '{"en":"Utsunecho"}'::jsonb,
  35.022159,
  135.572526,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751700,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_uchimarucho',
  '内丸町',
  'うちまるちょう',
  '{"en":"Uchimarucho"}'::jsonb,
  35.0127733,
  135.5782998,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_aratsukacho',
  '荒塚町',
  'あらつかちょう',
  '{"en":"Aratsukacho"}'::jsonb,
  35.01323,
  135.580401,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amarubecho',
  '余部町',
  'あまるべちょう',
  '{"en":"Amarubecho"}'::jsonb,
  35.014646,
  135.563595,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8867751705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_heki',
  '夜久野町日置',
  'やくのちょうへき',
  '{"en":"Yakunocho-Heki"}'::jsonb,
  35.326043,
  134.969542,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190885,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_hirano',
  '夜久野町平野',
  'やくのちょうひらの',
  '{"en":"Yakunocho-Hirano"}'::jsonb,
  35.346415,
  134.932893,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_hata',
  '夜久野町畑',
  'やくのちょうはた',
  '{"en":"Yakunocho-Hata"}'::jsonb,
  35.3670864,
  135.0102509,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_nukata',
  '夜久野町額田',
  'やくのちょうぬかた',
  '{"en":"Yakunocho-Nukata"}'::jsonb,
  35.3240551,
  134.9948388,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_naomi',
  '夜久野町直見',
  'やくのちょうなおみ',
  '{"en":"Yakunocho-Naomi"}'::jsonb,
  35.373831,
  134.973517,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190889,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_chihara',
  '夜久野町千原',
  'やくのちょうちはら',
  '{"en":"Yakunocho-Chihara"}'::jsonb,
  35.305789,
  134.997014,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_takauchi',
  '夜久野町高内',
  'やくのちょうたかうち',
  '{"en":"Yakunocho-Takauchi"}'::jsonb,
  35.326338,
  134.950211,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_sue',
  '夜久野町末',
  'やくのちょうすえ',
  '{"en":"Yakunocho-Sue"}'::jsonb,
  35.3123078,
  134.964994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190892,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_oyugo',
  '夜久野町大油子',
  'やくのちょうおゆご',
  '{"en":"Yakunocho-Oyugo"}'::jsonb,
  35.338326,
  134.955301,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_ogura',
  '夜久野町小倉',
  'やくのちょうおぐら',
  '{"en":"Yakunocho-Ogura"}'::jsonb,
  35.3310999,
  134.9336706,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_imanishinaka',
  '夜久野町今西中',
  'やくのちょういまにしなか',
  '{"en":"Yakunocho-Imanishinaka"}'::jsonb,
  35.334904,
  135.004843,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_ito',
  '夜久野町板生',
  'やくのちょういとう',
  '{"en":"Yakunocho-Ito"}'::jsonb,
  35.381163,
  134.941827,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yakunocho_ida',
  '夜久野町井田',
  'やくのちょういだ',
  '{"en":"Yakunocho-Ida"}'::jsonb,
  35.3245815,
  135.0032201,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_yuri',
  '三和町岼',
  'みわちょうゆり',
  '{"en":"Miwacho-Yuri"}'::jsonb,
  35.240374,
  135.254162,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_miwa',
  '三和町みわ',
  'みわちょうみわ',
  '{"en":"Miwacho-Miwa"}'::jsonb,
  35.217373,
  135.221096,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190899,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_nakade',
  '三和町中出',
  'みわちょうなかで',
  '{"en":"Miwacho-Nakade"}'::jsonb,
  35.197594,
  135.21874,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_tomobuchi',
  '三和町友渕',
  'みわちょうともぶち',
  '{"en":"Miwacho-Tomobuchi"}'::jsonb,
  35.181525,
  135.274822,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_terao',
  '三和町寺尾',
  'みわちょうてらお',
  '{"en":"Miwacho-Terao"}'::jsonb,
  35.223041,
  135.208187,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_tsuji',
  '三和町辻',
  'みわちょうつじ',
  '{"en":"Miwacho-Tsuji"}'::jsonb,
  35.208553,
  135.232735,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_tanotani',
  '三和町田ノ谷',
  'みわちょうたのたに',
  '{"en":"Miwacho-Tanotani"}'::jsonb,
  35.174397,
  135.2126843,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_takasugi',
  '三和町高杉',
  'みわちょうたかすぎ',
  '{"en":"Miwacho-Takasugi"}'::jsonb,
  35.190296,
  135.265269,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_daito',
  '三和町台頭',
  'みわちょうだいと',
  '{"en":"Miwacho-Daito"}'::jsonb,
  35.2531705,
  135.2791821,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_senzoku',
  '三和町千束',
  'みわちょうせんぞく',
  '{"en":"Miwacho-Senzoku"}'::jsonb,
  35.2178292,
  135.2322127,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_shimokawai',
  '三和町下川合',
  'みわちょうしもかわい',
  '{"en":"Miwacho-Shimokawai"}'::jsonb,
  35.2325115,
  135.2477221,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190908,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_saimatsu',
  '三和町西松',
  'みわちょうさいまつ',
  '{"en":"Miwacho-Saimatsu"}'::jsonb,
  35.1882599,
  135.2065615,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_kusayama',
  '三和町草山',
  'みわちょうくさやま',
  '{"en":"Miwacho-Kusayama"}'::jsonb,
  35.207493,
  135.201199,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190910,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_kayo',
  '三和町加用',
  'みわちょうかよう',
  '{"en":"Miwacho-Kayo"}'::jsonb,
  35.22466,
  135.28751,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190911,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_kamigawai',
  '三和町上川合',
  'みわちょうかみがわい',
  '{"en":"Miwacho-Kamigawai"}'::jsonb,
  35.244417,
  135.265994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190912,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_omi',
  '三和町大身',
  'みわちょうおおみ',
  '{"en":"Miwacho-Omi"}'::jsonb,
  35.209111,
  135.284183,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_obara',
  '三和町大原',
  'みわちょうおおばら',
  '{"en":"Miwacho-Obara"}'::jsonb,
  35.254118,
  135.30453,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190914,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_umehara',
  '三和町梅原',
  'みわちょううめはら',
  '{"en":"Miwacho-Umehara"}'::jsonb,
  35.2171408,
  135.2452638,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190915,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_ubaranaka',
  '三和町菟原中',
  'みわちょううばらなか',
  '{"en":"Miwacho-Ubaranaka"}'::jsonb,
  35.20734,
  135.263339,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874190916,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_ubarashimo',
  '三和町菟原下',
  'みわちょううばらしも',
  '{"en":"Miwacho-Ubarashimo"}'::jsonb,
  35.1976483,
  135.248811,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199917,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miwacho_ashibuchi',
  '三和町芦渕',
  'みわちょうあしぶち',
  '{"en":"Miwacho-Ashibuchi"}'::jsonb,
  35.233337,
  135.2246,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minamihiranocho',
  '南平野町',
  'みなみひらのちょう',
  '{"en":"Minamihiranocho"}'::jsonb,
  35.291293,
  135.17586,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199919,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_minamiokamachi',
  '南岡町',
  'みなみおかまち',
  '{"en":"Minamiokamachi"}'::jsonb,
  35.2910474,
  135.1239999,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maedashinmachi',
  '前田新町',
  'まえだしんまち',
  '{"en":"Maedashinmachi"}'::jsonb,
  35.2951625,
  135.1532258,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199921,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_higashihiranocho',
  '東平野町',
  'ひがしひらのちょう',
  '{"en":"Higashihiranocho"}'::jsonb,
  35.294046,
  135.176948,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hagiwara_shinmachi',
  '萩原新町',
  'はぎわらしんまち',
  '{"en":"Hagiwara-shinmachi"}'::jsonb,
  35.238924,
  135.214498,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199929,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nishihiranocho',
  '西平野町',
  'にしひらのちょう',
  '{"en":"Nishihiranocho"}'::jsonb,
  35.2931476,
  135.1733969,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199930,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagayamacho',
  '長山町',
  'ながやまちょう',
  '{"en":"Nagayamacho"}'::jsonb,
  35.293246,
  135.167755,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakasakacho',
  '中坂町',
  'なかさかちょう',
  '{"en":"Nakasakacho"}'::jsonb,
  35.2953799,
  135.169798,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sunagomachi',
  '砂子町',
  'すなごまち',
  '{"en":"Sunagomachi"}'::jsonb,
  35.274759,
  135.167448,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199933,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitahiranocho',
  '北平野町',
  'きたひらのちょう',
  '{"en":"Kitahiranocho"}'::jsonb,
  35.295561,
  135.172643,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199937,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamonocho',
  '鴨野町',
  'かものちょう',
  '{"en":"Kamonocho"}'::jsonb,
  35.326467,
  135.043566,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_minamiyama',
  '大江町南山',
  'おおえちょうみなみやま',
  '{"en":"Oecho-Minamiyama"}'::jsonb,
  35.352688,
  135.15373,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_minamiariji',
  '大江町南有路',
  'おおえちょうみなみありじ',
  '{"en":"Oecho-Minamiariji"}'::jsonb,
  35.3836105,
  135.1801735,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_busshoji',
  '大江町佛性寺',
  'おおえちょうぶっしょうじ',
  '{"en":"Oecho-Busshoji"}'::jsonb,
  35.4549381,
  135.1284897,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_futamata',
  '大江町二俣',
  'おおえちょうふたまた',
  '{"en":"Oecho-Futamata"}'::jsonb,
  35.4123158,
  135.151508,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_bito',
  '大江町尾藤',
  'おおえちょうびとう',
  '{"en":"Oecho-Bito"}'::jsonb,
  35.3756077,
  135.1494034,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_hito',
  '大江町日藤',
  'おおえちょうひとう',
  '{"en":"Oecho-Hito"}'::jsonb,
  35.3669967,
  135.1128592,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199958,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_habi',
  '大江町波美',
  'おおえちょうはび',
  '{"en":"Oecho-Habi"}'::jsonb,
  35.385821,
  135.156039,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199959,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_hashidani',
  '大江町橋谷',
  'おおえちょうはしだに',
  '{"en":"Oecho-Hashidani"}'::jsonb,
  35.414123,
  135.116981,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_nika',
  '大江町二箇',
  'おおえちょうにか',
  '{"en":"Oecho-Nika"}'::jsonb,
  35.404533,
  135.197247,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_natsuma',
  '大江町夏間',
  'おおえちょうなつま',
  '{"en":"Oecho-Natsuma"}'::jsonb,
  35.3629829,
  135.1221056,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199962,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_naiku',
  '大江町内宮',
  'おおえちょうないく',
  '{"en":"Oecho-Naiku"}'::jsonb,
  35.4320283,
  135.1577041,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199963,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_tsunezu',
  '大江町常津',
  'おおえちょうつねづ',
  '{"en":"Oecho-Tsunezu"}'::jsonb,
  35.368771,
  135.138124,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199964,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_tadewara',
  '大江町蓼原',
  'おおえちょうたでわら',
  '{"en":"Oecho-Tadewara"}'::jsonb,
  35.3890635,
  135.1336545,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_takatsue',
  '大江町高津江',
  'おおえちょうたかつえ',
  '{"en":"Oecho-Takatsue"}'::jsonb,
  35.4179003,
  135.1966898,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199966,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_sogo',
  '大江町三河',
  'おおえちょうそうご',
  '{"en":"Oecho-Sogo"}'::jsonb,
  35.4156099,
  135.1887613,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_senbara',
  '大江町千原',
  'おおえちょうせんばら',
  '{"en":"Oecho-Senbara"}'::jsonb,
  35.380659,
  135.148864,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_seki',
  '大江町関',
  'おおえちょうせき',
  '{"en":"Oecho-Seki"}'::jsonb,
  35.3940584,
  135.1499879,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199969,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_komori',
  '大江町河守',
  'おおえちょうこうもり',
  '{"en":"Oecho-Komori"}'::jsonb,
  35.3910147,
  135.1433223,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_kewara',
  '大江町毛原',
  'おおえちょうけわら',
  '{"en":"Oecho-Kewara"}'::jsonb,
  35.447663,
  135.164557,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_gujo',
  '大江町公庄',
  'おおえちょうぐじょう',
  '{"en":"Oecho-Gujo"}'::jsonb,
  35.378091,
  135.122007,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199972,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_kitabara',
  '大江町北原',
  'おおえちょうきたばら',
  '{"en":"Oecho-Kitabara"}'::jsonb,
  35.4384876,
  135.1224828,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_kitaariji',
  '大江町北有路',
  'おおえちょうきたありじ',
  '{"en":"Oecho-Kitaariji"}'::jsonb,
  35.3990986,
  135.1744584,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199974,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_kanaya',
  '大江町金屋',
  'おおえちょうかなや',
  '{"en":"Oecho-Kanaya"}'::jsonb,
  35.394311,
  135.155237,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199975,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_owarata',
  '大江町小原田',
  'おおえちょうおわらた',
  '{"en":"Oecho-Owarata"}'::jsonb,
  35.3936376,
  135.1169282,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199976,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_ueno',
  '大江町上野',
  'おおえちょううえの',
  '{"en":"Oecho-Ueno"}'::jsonb,
  35.3971026,
  135.1607638,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_ichiwaradani',
  '大江町市原谷',
  'おおえちょういちわらだに',
  '{"en":"Oecho-Ichiwaradani"}'::jsonb,
  35.399617,
  135.215476,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199978,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_arita',
  '大江町在田',
  'おおえちょうありた',
  '{"en":"Oecho-Arita"}'::jsonb,
  35.361698,
  135.131179,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oecho_amadauchi',
  '大江町天田内',
  'おおえちょうあまだうち',
  '{"en":"Oecho-Amadauchi"}'::jsonb,
  35.4050133,
  135.1415143,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oikezakacho',
  '大池坂町',
  'おおいけざかちょう',
  '{"en":"Oikezakacho"}'::jsonb,
  35.2933094,
  135.1659969,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199981,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yamanokuchi',
  '山野口',
  'やまのくち',
  '{"en":"Yamanokuchi"}'::jsonb,
  35.3402065,
  135.1642341,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199982,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hooji',
  '報恩寺',
  'ほおじ',
  '{"en":"Hooji"}'::jsonb,
  35.3317267,
  135.1753585,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kisaichi',
  '私市',
  'きさいち',
  '{"en":"Kisaichi"}'::jsonb,
  35.319462,
  135.184481,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_innai_quarter',
  '印内',
  'いんない',
  '{"en":"Innai"}'::jsonb,
  35.331165,
  135.156912,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ekimaecho',
  '駅前町',
  'えきまえちょう',
  '{"en":"Ekimaecho"}'::jsonb,
  35.2969451,
  135.1193544,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwaishinmachi',
  '岩井新町',
  'いわいしんまち',
  '{"en":"Iwaishinmachi"}'::jsonb,
  35.3184179,
  135.1014776,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_yasui_quarter',
  '安井',
  'やすい',
  '{"en":"Yasui"}'::jsonb,
  35.3372923,
  135.1176086,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_muro',
  '室',
  'むろ',
  '{"en":"Muro"}'::jsonb,
  35.2772133,
  135.106672,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miyagaki',
  '宮垣',
  'みやがき',
  '{"en":"Miyagaki"}'::jsonb,
  35.336946,
  135.027858,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_miya',
  '宮',
  'みや',
  '{"en":"Miya"}'::jsonb,
  35.260526,
  135.18098,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_mimata',
  '三俣',
  'みまた',
  '{"en":"Mimata"}'::jsonb,
  35.2528162,
  135.2175701,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maki',
  '牧',
  'まき',
  '{"en":"Maki"}'::jsonb,
  35.3344733,
  135.093948,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_maeda',
  '前田',
  'まえだ',
  '{"en":"Maeda"}'::jsonb,
  35.2976031,
  135.1541083,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874199999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_horikoshi',
  '堀越',
  'ほりこし',
  '{"en":"Horikoshi"}'::jsonb,
  35.2487876,
  135.2107704,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hinoo',
  '日尾',
  'ひのお',
  '{"en":"Hinoo"}'::jsonb,
  35.3536549,
  135.0618538,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hatakenaka',
  '畑中',
  'はたけなか',
  '{"en":"Hatakenaka"}'::jsonb,
  35.288315,
  135.047449,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_haze_quarter',
  '土師',
  'はぜ',
  '{"en":"Haze"}'::jsonb,
  35.292051,
  135.149626,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200003,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hazumaki',
  '筈巻',
  'はずまき',
  '{"en":"Hazumaki"}'::jsonb,
  35.3497208,
  135.1179142,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_hagiwara',
  '萩原',
  'はぎわら',
  '{"en":"Hagiwara"}'::jsonb,
  35.2456611,
  135.2221994,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200005,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nobana',
  '野花',
  'のばな',
  '{"en":"Nobana"}'::jsonb,
  35.334719,
  135.07661,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200006,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nakasasaki',
  '中佐々木',
  'なかささき',
  '{"en":"Nakasasaki"}'::jsonb,
  35.381763,
  135.03218,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_nagao',
  '長尾',
  'ながお',
  '{"en":"Nagao"}'::jsonb,
  35.381304,
  135.09248,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_naka_quarter_8874200009',
  '中',
  'なか',
  '{"en":"Naka"}'::jsonb,
  35.3155196,
  135.128658,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_toda',
  '戸田',
  'とだ',
  '{"en":"Toda"}'::jsonb,
  35.307229,
  135.173131,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tonoichi',
  '多保市',
  'とおのいち',
  '{"en":"Tonoichi"}'::jsonb,
  35.2670424,
  135.1835255,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tsuchi',
  '土',
  'つち',
  '{"en":"Tsuchi"}'::jsonb,
  35.302144,
  135.167515,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_dan',
  '談',
  'だん',
  '{"en":"Dan"}'::jsonb,
  35.2789194,
  135.0261096,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200013,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tawa',
  '田和',
  'たわ',
  '{"en":"Tawa"}'::jsonb,
  35.3364617,
  135.0448945,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tarumi',
  '樽水',
  'たるみ',
  '{"en":"Tarumi"}'::jsonb,
  35.2730485,
  135.0409289,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tano',
  '田野',
  'たの',
  '{"en":"Tano"}'::jsonb,
  35.2504292,
  135.1695683,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_tatsuwara',
  '立原',
  'たつわら',
  '{"en":"Tatsuwara"}'::jsonb,
  35.335811,
  135.085953,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shogoji',
  '正後寺',
  'しょうごじ',
  '{"en":"Shogoji"}'::jsonb,
  35.2474163,
  135.2035699,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_joganji',
  '常願寺',
  'じょうがんじ',
  '{"en":"Joganji"}'::jsonb,
  35.349615,
  135.044668,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_juni',
  '十二',
  'じゅうに',
  '{"en":"Juni"}'::jsonb,
  35.329292,
  135.083051,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimonojo',
  '下野条',
  'しものじょう',
  '{"en":"Shimonojo"}'::jsonb,
  35.4087744,
  135.0832079,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimosasaki',
  '下佐々木',
  'しもささき',
  '{"en":"Shimosasaki"}'::jsonb,
  35.376115,
  135.045566,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimooda',
  '下小田',
  'しもおだ',
  '{"en":"Shimooda"}'::jsonb,
  35.332177,
  135.066301,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoochi',
  '下大内',
  'しもおおち',
  '{"en":"Shimoochi"}'::jsonb,
  35.339325,
  135.084107,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_shimoamazu',
  '下天津',
  'しもあまづ',
  '{"en":"Shimoamazu"}'::jsonb,
  35.357769,
  135.1100598,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_sakamuro',
  '坂室',
  'さかむろ',
  '{"en":"Sakamuro"}'::jsonb,
  35.2511954,
  135.2001159,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_komaki',
  '小牧',
  'こまき',
  '{"en":"Komaki"}'::jsonb,
  35.292629,
  135.015684,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kobunoki',
  '瘤木',
  'こぶのき',
  '{"en":"Kobunoki"}'::jsonb,
  35.360111,
  135.101202,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200028,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kumohara',
  '雲原',
  'くもはら',
  '{"en":"Kumohara"}'::jsonb,
  35.4177946,
  135.0632833,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kitayama',
  '北山',
  'きたやま',
  '{"en":"Kitayama"}'::jsonb,
  35.295272,
  135.041203,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kita_quarter_8874200031',
  '喜多',
  'きた',
  '{"en":"Kita"}'::jsonb,
  35.379246,
  135.065741,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kannonji_quarter',
  '観音寺',
  'かんのんじ',
  '{"en":"Kannonji"}'::jsonb,
  35.301538,
  135.195029,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200032,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kawagita',
  '川北',
  'かわぎた',
  '{"en":"Kawagita"}'::jsonb,
  35.3144521,
  135.1608014,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200033,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kaminojo',
  '上野条',
  'かみのじょう',
  '{"en":"Kaminojo"}'::jsonb,
  35.392729,
  135.067408,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200034,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamisasaki',
  '上佐々木',
  'かみささき',
  '{"en":"Kamisasaki"}'::jsonb,
  35.3965748,
  135.042268,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamioda',
  '上小田',
  'かみおだ',
  '{"en":"Kamioda"}'::jsonb,
  35.3224361,
  135.0562649,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200036,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiochi',
  '上大内',
  'かみおおち',
  '{"en":"Kamiochi"}'::jsonb,
  35.345015,
  135.083087,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200037,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_kamiamazu',
  '上天津',
  'かみあまづ',
  '{"en":"Kamiamazu"}'::jsonb,
  35.3331911,
  135.1052076,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200038,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_osada',
  '長田',
  'おさだ',
  '{"en":"Osada"}'::jsonb,
  35.2756226,
  135.1709702,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200039,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oki',
  '興',
  'おき',
  '{"en":"Oki"}'::jsonb,
  35.306963,
  135.186245,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200040,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_oro',
  '大呂',
  'おおろ',
  '{"en":"Oro"}'::jsonb,
  35.369758,
  135.083576,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200041,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ochi',
  '大内',
  'おおち',
  '{"en":"Ochi"}'::jsonb,
  35.2540626,
  135.1800497,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ebisu_quarter',
  '夷',
  'えびす',
  '{"en":"Ebisu"}'::jsonb,
  35.341231,
  135.0720023,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ebara',
  '榎原',
  'えばら',
  '{"en":"Ebara"}'::jsonb,
  35.2759034,
  135.0704058,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200044,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_urushigahana',
  '漆端',
  'うるしがはな',
  '{"en":"Urushigahana"}'::jsonb,
  35.328635,
  135.111117,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200045,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_umedani_quarter',
  '梅谷',
  'うめだに',
  '{"en":"Umedani"}'::jsonb,
  35.324413,
  135.0243904,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200046,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ueno_quarter',
  '上野',
  'うえの',
  '{"en":"Ueno"}'::jsonb,
  35.2423806,
  135.2099469,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwama',
  '岩間',
  'いわま',
  '{"en":"Iwama"}'::jsonb,
  35.268148,
  135.1562419,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200048,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_iwasaki',
  '岩崎',
  'いわさき',
  '{"en":"Iwasaki"}'::jsonb,
  35.2628637,
  135.1889553,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200049,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_inono',
  '猪野々',
  'いのの',
  '{"en":"Inono"}'::jsonb,
  35.3230048,
  135.0380608,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200050,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_itsumori',
  '行積',
  'いつもり',
  '{"en":"Itsumori"}'::jsonb,
  35.398403,
  135.090263,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200051,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichinomiya',
  '一ノ宮',
  'いちのみや',
  '{"en":"Ichinomiya"}'::jsonb,
  35.366045,
  135.04699,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200052,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichidera',
  '市寺',
  'いちでら',
  '{"en":"Ichidera"}'::jsonb,
  35.2805404,
  135.1006711,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ichio',
  '一尾',
  'いちお',
  '{"en":"Ichio"}'::jsonb,
  35.3662073,
  135.1041972,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ishiba',
  '石場',
  'いしば',
  '{"en":"Ishiba"}'::jsonb,
  35.288622,
  135.057492,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_izaki',
  '猪崎',
  'いざき',
  '{"en":"Izaki"}'::jsonb,
  35.3095423,
  135.1332575,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_isa',
  '石原',
  'いさ',
  '{"en":"Isa"}'::jsonb,
  35.295743,
  135.185033,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikebe',
  '池部',
  'いけべ',
  '{"en":"Ikebe"}'::jsonb,
  35.3289813,
  135.1230846,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200058,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikeda',
  '池田',
  'いけだ',
  '{"en":"Ikeda"}'::jsonb,
  35.2601104,
  135.1980611,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_ikuno',
  '生野',
  'いくの',
  '{"en":"Ikuno"}'::jsonb,
  35.245784,
  135.211782,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_araga',
  '荒河',
  'あらが',
  '{"en":"Araga"}'::jsonb,
  35.319741,
  135.10935,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200061,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_amaza',
  '天座',
  'あまざ',
  '{"en":"Amaza"}'::jsonb,
  35.4297583,
  135.0991071,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8874200062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_keihoku',
  '京北',
  '京北',
  '{"en":"Keihoku"}'::jsonb,
  35.1551771,
  135.6334008,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  12260533747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_木屋',
  '木屋',
  '木屋',
  NULL,
  34.7674408,
  135.9101704,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  13061332429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_中',
  '中',
  '中',
  NULL,
  34.8025842,
  135.9118181,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  13061366156,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_田井漁港',
  '田井漁港',
  '田井漁港',
  NULL,
  35.5677027,
  135.4543722,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  843097703,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_daimonji',
  '大文字',
  'だいもんじ',
  '{"en":"Daimonji"}'::jsonb,
  35.0230647,
  135.8043711,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6392004465,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_matsugasaki_myoho',
  '松ヶ崎妙法',
  'まつがさきみょうほう',
  '{"en":"Matsugasaki Myoho"}'::jsonb,
  35.0547791,
  135.7860293,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6392004466,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_funagata_mantoro',
  '舟形万灯籠',
  'ふながたまんとうろう',
  '{"en":"Funagata Mantoro"}'::jsonb,
  35.0664872,
  135.7345974,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6392004468,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_left_daimonji',
  '左大文字',
  'ひだりだいもんじ',
  '{"en":"Left Daimonji"}'::jsonb,
  35.0431751,
  135.7313215,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6392004469,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_torigata_taimatsu',
  '鳥居形松明',
  'とりいがたたいまつ',
  '{"en":"Torigata Taimatsu"}'::jsonb,
  35.0277537,
  135.6678887,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6392004804,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_wall_rock',
  '壁岩',
  '壁岩',
  '{"en":"Wall rock"}'::jsonb,
  35.0243843,
  135.6410353,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6404546551,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_屏風岩',
  '屏風岩',
  '屏風岩',
  NULL,
  35.0223444,
  135.6402972,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6404546552,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_西山団地',
  '西山団地',
  '西山団地',
  NULL,
  34.9760477,
  135.646812,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  6913225361,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_umegahata',
  '梅ヶ畑',
  'うめがはた',
  '{"en":"Umegahata"}'::jsonb,
  35.050814,
  135.6829275,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  7424123339,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kyoto_unknown_seika_and_nishikizu_district',
  '精華・西木津地区',
  '精華・西木津地区',
  '{"en":"Seika and Nishikizu District"}'::jsonb,
  34.745339,
  135.7647259,
  NULL,
  'kyoto',
  NULL,
  'jp',
  '京都府',
  NULL,
  NULL,
  NULL,
  8041499269,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 15件, machi 1307件を挿入