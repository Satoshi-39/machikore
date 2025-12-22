-- =============================================
-- 山口県の街データ（OSMから取得）
-- 生成日時: 2025-12-09T12:25:59.082Z
-- データ取得日時: 2025-12-09T12:22:46.304Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（山口県のみ）
-- =============================================

-- machiテーブルから山口県のデータを削除
DELETE FROM machi WHERE prefecture_id = 'yamaguchi';

-- citiesテーブルから山口県のデータを削除
DELETE FROM cities WHERE prefecture_id = 'yamaguchi';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_nagato',
  'yamaguchi',
  '長門市',
  'ながとし',
  '{"en":"Nagato"}'::jsonb,
  '市',
  'jp',
  34.3708941,
  131.1821587
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_hagi',
  'yamaguchi',
  '萩市',
  'はぎし',
  '{"en":"Hagi"}'::jsonb,
  '市',
  'jp',
  34.4074815,
  131.399194
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_shimonoseki',
  'yamaguchi',
  '下関市',
  'しものせきし',
  '{"en":"Shimonoseki"}'::jsonb,
  '市',
  'jp',
  33.9577116,
  130.9415455
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_ube',
  'yamaguchi',
  '宇部市',
  'うべし',
  '{"en":"Ube"}'::jsonb,
  '市',
  'jp',
  33.9518498,
  131.2472243
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_hofu',
  'yamaguchi',
  '防府市',
  'ほうふし',
  '{"en":"Hofu"}'::jsonb,
  '市',
  'jp',
  34.0517226,
  131.5629141
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_yamaguchi',
  'yamaguchi',
  '山口市',
  'やまぐちし',
  '{"en":"Yamaguchi"}'::jsonb,
  '市',
  'jp',
  34.1781317,
  131.4737077
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_shunan',
  'yamaguchi',
  '周南市',
  'しゅうなんし',
  '{"en":"Shunan"}'::jsonb,
  '市',
  'jp',
  34.0550595,
  131.8064092
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_kudamatsu',
  'yamaguchi',
  '下松市',
  'くだまつし',
  '{"en":"Kudamatsu"}'::jsonb,
  '市',
  'jp',
  34.0149872,
  131.8704567
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_hikari',
  'yamaguchi',
  '光市',
  'ひかりし',
  '{"en":"Hikari"}'::jsonb,
  '市',
  'jp',
  33.9615807,
  131.9425203
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_yanai',
  'yamaguchi',
  '柳井市',
  'やないし',
  '{"en":"Yanai"}'::jsonb,
  '市',
  'jp',
  33.9640825,
  132.101193
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_mine',
  'yamaguchi',
  '美祢市',
  'みねし',
  '{"en":"Mine"}'::jsonb,
  '市',
  'jp',
  34.1667992,
  131.2062283
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_sanyo_onoda',
  'yamaguchi',
  '山陽小野田市',
  'さんようおのだし',
  '{"en":"Sanyo-Onoda"}'::jsonb,
  '市',
  'jp',
  34.0030045,
  131.1819289
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'yamaguchi_iwakuni',
  'yamaguchi',
  '岩国市',
  'いわくにし',
  '{"en":"Iwakuni"}'::jsonb,
  '市',
  'jp',
  34.1664995,
  132.2191163
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町中ノ瀬',
  '錦町中ノ瀬',
  '錦町中ノ瀬',
  NULL,
  34.278548,
  131.9644276,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2782719145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_徳山',
  '徳山',
  '徳山',
  NULL,
  34.087517,
  131.8365598,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784745935,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_扇',
  '扇町',
  '扇町',
  NULL,
  34.0553058,
  131.8237328,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784751897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_江の宮',
  '江の宮町',
  '江の宮町',
  NULL,
  34.0513477,
  131.8288007,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784752251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_瀬戸見',
  '瀬戸見町',
  '瀬戸見町',
  NULL,
  34.0505919,
  131.8314316,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784752288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大内',
  '大内町',
  '大内町',
  NULL,
  34.0495309,
  131.8247679,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784755395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_辻',
  '辻町',
  '辻町',
  NULL,
  34.0576001,
  131.8152235,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784756777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岐南',
  '岐南町',
  '岐南町',
  NULL,
  34.0585853,
  131.8136128,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784758307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_一番',
  '一番町',
  '一番町',
  NULL,
  34.054444,
  131.8128051,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784758659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_二番',
  '二番町',
  '二番町',
  NULL,
  34.0549242,
  131.8118999,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784758727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_三番',
  '三番町',
  '三番町',
  NULL,
  34.0553105,
  131.8110742,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784758880,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_花畠',
  '花畠町',
  '花畠町',
  NULL,
  34.0596742,
  131.8107515,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784758934,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岡田',
  '岡田町',
  '岡田町',
  NULL,
  34.0610541,
  131.8062774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784759248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_弥生',
  '弥生町',
  '弥生町',
  NULL,
  34.0574022,
  131.8060741,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784801282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_栄',
  '栄町',
  '栄町',
  NULL,
  34.0542,
  131.8056212,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784802502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_若宮',
  '若宮町',
  '若宮町',
  NULL,
  34.0528502,
  131.8062932,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784802990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_飯島',
  '飯島町',
  '飯島町',
  NULL,
  34.0514453,
  131.8083565,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2784803428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_蓮ヶ浴',
  '蓮ヶ浴',
  '蓮ヶ浴',
  NULL,
  34.0657889,
  131.8081296,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785285953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東北山',
  '東北山',
  '東北山',
  NULL,
  34.0660198,
  131.8061849,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785286931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_住吉',
  '住吉町',
  '住吉町',
  NULL,
  34.0649191,
  131.8034761,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785287660,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_今住',
  '今住町',
  '今住町',
  NULL,
  34.0630007,
  131.8018516,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785288855,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_原宿',
  '原宿町',
  '原宿町',
  NULL,
  34.0619438,
  131.8043787,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785292641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_今宿',
  '今宿町',
  '今宿町',
  NULL,
  34.0566591,
  131.8031289,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785298134,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本',
  '本町',
  '本町',
  NULL,
  34.0526609,
  131.803431,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2785306441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_千代田',
  '千代田町',
  '千代田町',
  NULL,
  34.0536702,
  131.7996354,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786983498,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_築港',
  '築港町',
  '築港町',
  NULL,
  34.0503906,
  131.8008304,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786983769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_住崎',
  '住崎町',
  '住崎町',
  NULL,
  34.0481663,
  131.8031018,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786984007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_徳山港',
  '徳山港町',
  '徳山港町',
  NULL,
  34.0518568,
  131.7956947,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786984293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_入船',
  '入船町',
  '入船町',
  NULL,
  34.0562492,
  131.7974816,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786984343,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_権現',
  '権現町',
  '権現町',
  NULL,
  34.0562369,
  131.7984915,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2786984669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_都',
  '都町',
  '都町',
  NULL,
  34.0553746,
  131.8003199,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787710547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_野上',
  '野上町',
  '野上町',
  NULL,
  34.0556889,
  131.8013088,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787714486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_初音',
  '初音町',
  '初音町',
  NULL,
  34.0591367,
  131.8006315,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787727902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_相生',
  '相生町',
  '相生町',
  NULL,
  34.0598256,
  131.7994373,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787731000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_沖見',
  '沖見町',
  '沖見町',
  NULL,
  34.0589622,
  131.7989211,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787733740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_御影',
  '御影町',
  '御影町',
  NULL,
  34.0614829,
  131.7921399,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787736432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西千代田',
  '西千代田町',
  '西千代田町',
  NULL,
  34.0687666,
  131.7846124,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787741555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_浦山',
  '浦山',
  '浦山',
  NULL,
  34.0714397,
  131.7927057,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787754029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_南浦山',
  '南浦山町',
  '南浦山町',
  NULL,
  34.0690705,
  131.7919142,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787755922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_道源',
  '道源町',
  '道源町',
  NULL,
  34.0655842,
  131.7848084,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787763691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_三笹',
  '三笹町',
  '三笹町',
  NULL,
  34.0623892,
  131.7854837,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2787764498,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_野村南',
  '野村南町',
  '野村南町',
  NULL,
  34.0594241,
  131.7719357,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2789443408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_古川',
  '古川町',
  '古川町',
  NULL,
  34.0701461,
  131.7755498,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2789456538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_桶川',
  '桶川町',
  '桶川町',
  NULL,
  34.0713339,
  131.7754123,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2789459878,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_土井',
  '土井',
  '土井',
  NULL,
  34.0823211,
  131.7737028,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2789483949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新堤',
  '新堤町',
  '新堤町',
  NULL,
  34.0778237,
  131.7607401,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2790195661,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_坂根',
  '坂根町',
  '坂根町',
  NULL,
  34.0808824,
  131.7573312,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2790196340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長田',
  '長田町',
  '長田町',
  NULL,
  34.0620606,
  131.7235018,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791869789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_かせ河原',
  'かせ河原町',
  'かせ河原町',
  NULL,
  34.0699222,
  131.7265536,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791870627,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_港',
  '港町',
  '港町',
  NULL,
  34.0680336,
  131.7475939,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791964954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_日地',
  '日地町',
  '日地町',
  NULL,
  34.0764997,
  131.7548015,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791966647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_皿山',
  '皿山町',
  '皿山町',
  NULL,
  34.078789,
  131.7375875,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791970443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_福川南',
  '福川南町',
  '福川南町',
  NULL,
  34.0673365,
  131.7398068,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791979482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_社地',
  '社地町',
  '社地町',
  NULL,
  34.0714145,
  131.7384304,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791981156,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西桝',
  '西桝町',
  '西桝町',
  NULL,
  34.0698908,
  131.7336369,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2791983669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新地',
  '新地町',
  '新地町',
  NULL,
  34.0714946,
  131.7323709,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2792077600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本陣',
  '本陣町',
  '本陣町',
  NULL,
  34.0744976,
  131.7321412,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2792079022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_福川中市',
  '福川中市町',
  '福川中市町',
  NULL,
  34.0742125,
  131.735653,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2792079384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_戸田',
  '戸田',
  '戸田',
  NULL,
  34.0801201,
  131.6850575,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2793812424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_湯野',
  '湯野',
  '湯野',
  NULL,
  34.1127743,
  131.6682162,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2793859888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_莇地',
  '莇地',
  '莇地',
  NULL,
  34.1114402,
  131.839651,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2794241713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美川町添谷',
  '美川町添谷',
  '美川町添谷',
  NULL,
  34.2535063,
  131.9938069,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2798176702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美川町四馬神',
  '美川町四馬神',
  '美川町四馬神',
  NULL,
  34.2599256,
  131.9800333,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2798197701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町野谷',
  '錦町野谷',
  '錦町野谷',
  NULL,
  34.2230883,
  131.95754,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2802689110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町三瀬川',
  '周東町三瀬川',
  '周東町三瀬川',
  NULL,
  34.1478393,
  131.9715959,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2802897907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町樋余地',
  '周東町樋余地',
  '周東町樋余地',
  NULL,
  34.1041322,
  131.9729426,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2803413723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町上須通',
  '周東町上須通',
  '周東町上須通',
  NULL,
  34.0983184,
  131.9968236,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2803430301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町下須通',
  '周東町下須通',
  '周東町下須通',
  NULL,
  34.0964177,
  132.0158537,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2803441501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町下長野',
  '周東町下長野',
  '周東町下長野',
  NULL,
  34.0887796,
  132.0190284,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2803441502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町下久原',
  '周東町下久原',
  '周東町下久原',
  NULL,
  34.0961718,
  132.0495901,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2804979401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町上久原',
  '周東町上久原',
  '周東町上久原',
  NULL,
  34.0729047,
  132.0559971,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2804996701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_玖珂',
  '玖珂町',
  '玖珂町',
  NULL,
  34.0968689,
  132.0927593,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805325801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_廿木',
  '廿木',
  '廿木',
  NULL,
  34.1254243,
  132.1044014,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805355401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_入野',
  '入野',
  '入野',
  NULL,
  34.1419272,
  132.1014938,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805542507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大山',
  '大山',
  '大山',
  NULL,
  34.139353,
  132.0903919,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805580401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竹安',
  '竹安',
  '竹安',
  NULL,
  34.1495257,
  132.0910823,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805610801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊房',
  '伊房',
  '伊房',
  NULL,
  34.142876,
  132.0776389,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2805615901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_角',
  '角',
  '角',
  NULL,
  34.1621409,
  132.1015235,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807605701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_瓦谷',
  '瓦谷',
  '瓦谷',
  NULL,
  34.1761991,
  132.1170648,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807606601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_保木',
  '保木',
  '保木',
  NULL,
  34.1684777,
  132.1105397,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807607701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上田',
  '上田',
  '上田',
  NULL,
  34.1542618,
  132.1083731,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807609501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_杭名',
  '杭名',
  '杭名',
  NULL,
  34.1728364,
  132.1105835,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807615701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_下',
  '下',
  '下',
  NULL,
  34.1684299,
  132.094046,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807615702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_行波',
  '行波',
  '行波',
  NULL,
  34.1619274,
  132.08685,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807667701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_天尾',
  '天尾',
  '天尾',
  NULL,
  34.1799359,
  132.0625366,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807678401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美川町南桑',
  '美川町南桑',
  '美川町南桑',
  NULL,
  34.1937164,
  132.0323629,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2807915802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町府谷',
  '錦町府谷',
  '錦町府谷',
  NULL,
  34.2717367,
  131.9854549,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2822091601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町深川',
  '錦町深川',
  '錦町深川',
  NULL,
  34.3151791,
  131.9847841,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2825419502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町宇佐郷',
  '錦町宇佐郷',
  '錦町宇佐郷',
  NULL,
  34.3742662,
  132.0258022,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2825977901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町大原',
  '錦町大原',
  '錦町大原',
  NULL,
  34.3663093,
  132.0426441,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2827901602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町宇佐',
  '錦町宇佐',
  '錦町宇佐',
  NULL,
  34.422004,
  132.0522369,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2828620210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柳',
  '柳町',
  '柳町',
  NULL,
  34.049219,
  131.8098288,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863527202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_那智',
  '那智町',
  '那智町',
  NULL,
  34.0453415,
  131.803891,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863528102,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_若草',
  '若草町',
  '若草町',
  NULL,
  34.0470559,
  131.8185069,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863528103,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_橋本',
  '橋本町',
  '橋本町',
  NULL,
  34.0470518,
  131.8081366,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863528901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_慶万',
  '慶万町',
  '慶万町',
  NULL,
  34.0494943,
  131.8134679,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863531001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_泉原',
  '泉原町',
  '泉原町',
  NULL,
  34.0539144,
  131.8217925,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863531002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東山',
  '東山町',
  '東山町',
  NULL,
  34.0475349,
  131.8157405,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863531003,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_舞車',
  '舞車町',
  '舞車町',
  NULL,
  34.0520132,
  131.8154104,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863533001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清水',
  '清水町',
  '清水町',
  NULL,
  34.0549219,
  131.8193295,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863534201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_晴海',
  '晴海町',
  '晴海町',
  NULL,
  34.042542,
  131.7940225,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863541001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_青山',
  '青山町',
  '青山町',
  NULL,
  34.0442324,
  131.8177455,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863545001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_松保',
  '松保町',
  '松保町',
  NULL,
  34.0444924,
  131.8133094,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863547302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_速玉',
  '速玉町',
  '速玉町',
  NULL,
  34.0460247,
  131.8119221,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863549801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_河東',
  '河東町',
  '河東町',
  NULL,
  34.0479925,
  131.8117584,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863551001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_五月',
  '五月町',
  '五月町',
  NULL,
  34.0371908,
  131.8278838,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863570610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上遠石',
  '上遠石町',
  '上遠石町',
  NULL,
  34.0449245,
  131.8223463,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863578201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宮前',
  '宮前町',
  '宮前町',
  NULL,
  34.0327251,
  131.8234931,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863588201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_由加',
  '由加町',
  '由加町',
  NULL,
  34.0299537,
  131.8240759,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  2863593401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_横浜',
  '横浜町',
  '横浜町',
  NULL,
  34.0347148,
  131.8298158,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3385396493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_平原',
  '平原町',
  '平原町',
  NULL,
  34.0490621,
  131.8425238,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3385438693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yoshida',
  '吉田',
  'よしだ',
  '{"en":"Yoshida"}'::jsonb,
  34.141918,
  131.4673829,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4407575391,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字蓋井島',
  '大字蓋井島',
  '大字蓋井島',
  NULL,
  34.1052744,
  130.7867387,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4563334458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字野島',
  '大字野島',
  '大字野島',
  NULL,
  33.9414217,
  131.6927576,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4852670477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牛島',
  '牛島',
  '牛島',
  NULL,
  33.8573107,
  132.0082855,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4855633592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_umashima',
  '馬島',
  'うましま',
  '{"en":"Umashima"}'::jsonb,
  33.8966995,
  132.0497954,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4859787222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_下関市豊田',
  '下関市豊田町',
  '下関市豊田町',
  NULL,
  34.202042,
  131.0756707,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5455830712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竹島',
  '竹島町',
  '竹島町',
  NULL,
  34.0511305,
  131.7608678,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6339756943,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hitsushima',
  '櫃島',
  'ひつしま',
  '{"en":"Hitsushima"}'::jsonb,
  34.5145228,
  131.3861284,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6751629455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_oshima',
  '大島',
  'おおしま',
  '{"en":"Oshima"}'::jsonb,
  34.4951411,
  131.410394,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6751631426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aio_nishi',
  '秋穂西',
  'あいおにし',
  '{"en":"Aio-Nishi"}'::jsonb,
  34.0265978,
  131.4274935,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7593810411,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aio_futajima',
  '秋穂二島',
  'あいおふたじま',
  '{"en":"Aio-Futajima"}'::jsonb,
  34.0442099,
  131.4145028,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7593810412,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aio_higashi',
  '秋穂東',
  'あいおひがし',
  '{"en":"Aio-Higashi"}'::jsonb,
  34.0221326,
  131.4541465,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7593810421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamitengemachi',
  '上天花町',
  'かみてんげまち',
  '{"en":"Kamitengemachi"}'::jsonb,
  34.2121216,
  131.46487,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kimachi',
  '木町',
  'きまち',
  '{"en":"Kimachi"}'::jsonb,
  34.1913577,
  131.4743784,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kozancho',
  '香山町',
  'こうざんちょう',
  '{"en":"Kozancho"}'::jsonb,
  34.1891735,
  131.4733297,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_takimachi',
  '滝町',
  'たきまち',
  '{"en":"Takimachi"}'::jsonb,
  34.188225,
  131.465967,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamitatekoji',
  '上竪小路',
  'かみたてこうじ',
  '{"en":"Kamitatekoji"}'::jsonb,
  34.1872155,
  131.4773449,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mizunouecho',
  '水の上町',
  'みずのうえちょう',
  '{"en":"Mizunouecho"}'::jsonb,
  34.186734,
  131.4735818,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kasugacho',
  '春日町',
  'かすがちょう',
  '{"en":"Kasugacho"}'::jsonb,
  34.1821987,
  131.4719376,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kameyamacho',
  '亀山町',
  'かめやまちょう',
  '{"en":"Kameyamacho"}'::jsonb,
  34.1798778,
  131.4734584,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakagawara',
  '中河原',
  'なかがわら',
  '{"en":"Nakagawara"}'::jsonb,
  34.1794101,
  131.4782113,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_komeyacho',
  '米屋町',
  'こめやちょう',
  '{"en":"Komeyacho"}'::jsonb,
  34.1769349,
  131.4775025,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_waniishicho',
  '鰐石町',
  'わにいしちょう',
  '{"en":"Waniishicho"}'::jsonb,
  34.1695713,
  131.4780624,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sodayucho',
  '惣太夫町',
  'そうだゆうちょう',
  '{"en":"Sodayucho"}'::jsonb,
  34.1721422,
  131.4813656,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakagawaracho',
  '中河原町',
  'なかがわらちょう',
  '{"en":"Nakagawaracho"}'::jsonb,
  34.1788371,
  131.4763096,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sentoshoji',
  '銭湯小路',
  'せんとうしょうじ',
  '{"en":"Sentoshoji"}'::jsonb,
  34.1799266,
  131.4790079,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shoganshoji',
  '諸願小路',
  'しょがんしょうじ',
  '{"en":"Shoganshoji"}'::jsonb,
  34.180216,
  131.4793088,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shinbaba',
  '新馬場',
  'しんばば',
  '{"en":"Shinbaba"}'::jsonb,
  34.180488,
  131.4784232,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kuboshoji',
  '久保小路',
  'くぼしょうじ',
  '{"en":"Kuboshoji"}'::jsonb,
  34.1807786,
  131.4792842,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_otemachi',
  '大手町',
  'おおてまち',
  '{"en":"Otemachi"}'::jsonb,
  34.1832283,
  131.4743274,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ushirogawara',
  '後河原',
  'うしろがわら',
  '{"en":"Ushirogawara"}'::jsonb,
  34.1841613,
  131.4766315,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimotatekoji',
  '下竪小路',
  'しもたてこうじ',
  '{"en":"Shimotatekoji"}'::jsonb,
  34.1827468,
  131.4794075,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_odonooji',
  '大殿大路',
  '大殿大路',
  '{"en":"Odonooji"}'::jsonb,
  34.1836565,
  131.4808559,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_noda',
  '野田',
  'のだ',
  '{"en":"Noda"}'::jsonb,
  34.1855469,
  131.47994,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yawatanobaba',
  '八幡馬場',
  'やわたのばば',
  '{"en":"Yawatanobaba"}'::jsonb,
  34.1854471,
  131.4825404,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kanakosocho',
  '金古曽町',
  'かなこそちょう',
  '{"en":"Kanakosocho"}'::jsonb,
  34.1856246,
  131.4854801,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ishigannoncho',
  '石観音町',
  'いしがんのんちょう',
  '{"en":"Ishigannoncho"}'::jsonb,
  34.1834324,
  131.4832163,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_dosocho',
  '道祖町',
  'どうそちょう',
  '{"en":"Dosocho"}'::jsonb,
  34.1826625,
  131.4842436,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_enseijicho',
  '円政寺町',
  'えんせいじちょう',
  '{"en":"Enseijicho"}'::jsonb,
  34.181096,
  131.4829186,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_donomaecho',
  '堂の前町',
  'どうのまえちょう',
  '{"en":"Donomaecho"}'::jsonb,
  34.1798733,
  131.4817759,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_oichicho',
  '大市町',
  'おおいちちょう',
  '{"en":"Oichicho"}'::jsonb,
  34.1790967,
  131.4803678,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakaichicho',
  '中市町',
  'なかいちちょう',
  '{"en":"Nakaichicho"}'::jsonb,
  34.1780793,
  131.4787745,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  7637351458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sujikawacho',
  '筋川町',
  'すじかわちょう',
  '{"en":"Sujikawacho"}'::jsonb,
  33.9653948,
  130.9159613,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046399279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sujigahamacho',
  '筋ケ浜町',
  'すじがはまちょう',
  '{"en":"Sujigahamacho"}'::jsonb,
  33.9615907,
  130.9132683,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046399280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishiotsubocho',
  '西大坪町',
  'にしおおつぼちょう',
  '{"en":"Nishiotsubocho"}'::jsonb,
  33.9625963,
  130.9170556,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046399281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_minamiotsubocho',
  '南大坪町',
  'みなみおおつぼちょう',
  '{"en":"Minamiotsubocho"}'::jsonb,
  33.9599623,
  130.9164065,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046399282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shinchinishimachi',
  '新地西町',
  'しんちにしまち',
  '{"en":"Shinchinishimachi"}'::jsonb,
  33.9566341,
  130.9202689,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_uejocho',
  '上条町',
  'うえじょうちょう',
  '{"en":"Uejocho"}'::jsonb,
  33.9556151,
  130.9238845,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shinchicho',
  '新地町',
  'しんちちょう',
  '{"en":"Shinchicho"}'::jsonb,
  33.9556952,
  130.9215027,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_imauracho',
  '今浦町',
  'いまうらちょう',
  '{"en":"Imauracho"}'::jsonb,
  33.9545917,
  130.9224254,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nagasakichuocho',
  '長崎中央町',
  'ながさきちゅうおうちょう',
  '{"en":"Nagasakichuocho"}'::jsonb,
  33.9559666,
  130.9296298,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kanseicho',
  '関西町',
  'かんせいちょう',
  '{"en":"Kanseicho"}'::jsonb,
  33.9578132,
  130.9281599,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kanseihonmachi',
  '関西本町',
  'かんせいほんまち',
  '{"en":"Kanseihonmachi"}'::jsonb,
  33.9564917,
  130.9267652,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nagasakihonmachi',
  '長崎本町',
  'ながさきほんまち',
  '{"en":"Nagasakihonmachi"}'::jsonb,
  33.956683,
  130.9250969,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nagasakishinmachi',
  '長崎新町',
  'ながさきしんまち',
  '{"en":"Nagasakishinmachi"}'::jsonb,
  33.9549032,
  130.9260946,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nagatomachi',
  '長門町',
  'ながとまち',
  '{"en":"Nagatomachi"}'::jsonb,
  33.9540933,
  130.9254187,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hosoeshinmachi',
  '細江新町',
  'ほそえしんまち',
  '{"en":"Hosoeshinmachi"}'::jsonb,
  33.948442,
  130.9296888,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8046408800,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_chinto',
  '椿東',
  'ちんとう',
  '{"en":"Chinto"}'::jsonb,
  34.4339647,
  131.4225108,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_horiuchi',
  '堀内',
  'ほりうち',
  '{"en":"Horiuchi"}'::jsonb,
  34.4145431,
  131.3849586,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_taruyacho',
  '樽屋町',
  'たるやちょう',
  '{"en":"Taruyacho"}'::jsonb,
  34.4160488,
  131.394903,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shibuki',
  '紫福',
  'しぶき',
  '{"en":"Shibuki"}'::jsonb,
  34.4706076,
  131.5271153,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kawakami',
  '川上',
  'かわかみ',
  '{"en":"Kawakami"}'::jsonb,
  34.3667454,
  131.4594473,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamigokenmachi',
  '上五間町',
  'かみごけんまち',
  '{"en":"Kamigokenmachi"}'::jsonb,
  34.4136011,
  131.4004871,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukuishimo',
  '福井下',
  'ふくいしも',
  '{"en":"Fukuishimo"}'::jsonb,
  34.4219141,
  131.4820991,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011091,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_suzunogawa',
  '鈴野川',
  'すずのがわ',
  '{"en":"Suzunogawa"}'::jsonb,
  34.5392271,
  131.6893972,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011092,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_saikumachi',
  '細工町',
  'さいくまち',
  '{"en":"Saikumachi"}'::jsonb,
  34.414787,
  131.395708,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashihamasakimachi',
  '東浜崎町',
  'ひがしはまさきまち',
  '{"en":"Higashihamasakimachi"}'::jsonb,
  34.4196474,
  131.4026853,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011094,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_katamata',
  '片俣',
  'かたまた',
  '{"en":"Katamata"}'::jsonb,
  34.4860249,
  131.6367837,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011095,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yadomishimo',
  '弥富下',
  'やどみしも',
  '{"en":"Yadomishimo"}'::jsonb,
  34.543168,
  131.6543421,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011096,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakaogawa',
  '中小川',
  'なかおがわ',
  '{"en":"Nakaogawa"}'::jsonb,
  34.5965392,
  131.6804319,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011097,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kibeshimo',
  '吉部下',
  'きべしも',
  '{"en":"Kibeshimo"}'::jsonb,
  34.4399176,
  131.5625749,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011098,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aburayacho',
  '油屋町',
  'あぶらやちょう',
  '{"en":"Aburayacho"}'::jsonb,
  34.413746,
  131.394264,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011099,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kawaramachi',
  '瓦町',
  'かわらまち',
  '{"en":"Kawaramachi"}'::jsonb,
  34.4121689,
  131.3969057,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011100,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_minamikatakawamachi',
  '南片河町',
  'みなみかたかわまち',
  '{"en":"Minamikatakawamachi"}'::jsonb,
  34.4120332,
  131.3924553,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011101,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_chinto_quarter',
  '椿東',
  'ちんとう',
  '{"en":"Chinto"}'::jsonb,
  34.4096067,
  131.4235223,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011102,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimoogawa',
  '下小川',
  'しもおがわ',
  '{"en":"Shimoogawa"}'::jsonb,
  34.6013923,
  131.704486,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011103,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sanmi',
  '三見',
  'さんみ',
  '{"en":"Sanmi"}'::jsonb,
  34.3866786,
  131.3295894,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011104,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamitama',
  '上田万',
  'かみたま',
  '{"en":"Kamitama"}'::jsonb,
  34.6275114,
  131.671016,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011105,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hijiwara',
  '土原',
  'ひじわら',
  '{"en":"Hijiwara"}'::jsonb,
  34.4125136,
  131.4073642,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011106,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hamasakimachi',
  '浜崎町',
  'はまさきまち',
  '{"en":"Hamasakimachi"}'::jsonb,
  34.4209271,
  131.4006141,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011107,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ebisucho',
  '恵美須町',
  'えびすちょう',
  '{"en":"Ebisucho"}'::jsonb,
  34.4137261,
  131.3963065,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yamada',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  34.32742,
  131.3692706,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishitamachi',
  '西田町',
  'にしたまち',
  '{"en":"Nishitamachi"}'::jsonb,
  34.4122823,
  131.3991826,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kumagayacho',
  '熊谷町',
  'くまがやちょう',
  '{"en":"Kumagayacho"}'::jsonb,
  34.4159376,
  131.4006481,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011112,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_imauonotanamachi',
  '今魚店町',
  'いまうおのたなまち',
  '{"en":"Imauonotanamachi"}'::jsonb,
  34.4177453,
  131.3938134,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011113,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mishima',
  '見島',
  'みしま',
  '{"en":"Mishima"}'::jsonb,
  34.7742474,
  131.147437,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_furuuonotanamachi',
  '古魚店町',
  'ふるうおのたなまち',
  '{"en":"Furuuonotanamachi"}'::jsonb,
  34.41395,
  131.392929,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kitakatakawamachi',
  '北片河町',
  'きたかたかわまち',
  '{"en":"Kitakatakawamachi"}'::jsonb,
  34.4153569,
  131.3928525,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479011116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aishima',
  '相島',
  'あいしま',
  '{"en":"Aishima"}'::jsonb,
  34.503889,
  131.2776479,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_takasakami',
  '高佐上',
  'たかさかみ',
  '{"en":"Takasakami"}'::jsonb,
  34.482875,
  131.6058442,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sasanami',
  '佐々並',
  'ささなみ',
  '{"en":"Sasanami"}'::jsonb,
  34.2859286,
  131.4537932,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamiogawa_nishibun',
  '上小川西分',
  'かみおがわにしぶん',
  '{"en":"Kamiogawa-nishibun"}'::jsonb,
  34.5735436,
  131.6460254,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hiyakimachi',
  '平安古町',
  'ひやこまち',
  '{"en":"Hiyakimachi"}'::jsonb,
  34.4064384,
  131.3886555,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_haruwakacho',
  '春若町',
  'はるわかちょう',
  '{"en":"Haruwakacho"}'::jsonb,
  34.4147634,
  131.3937497,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_emukai',
  '江向',
  'えむかい',
  '{"en":"Emukai"}'::jsonb,
  34.4065086,
  131.3987082,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_minamifuruhagimachi',
  '南古萩町',
  'みなみふるはぎまち',
  '{"en":"Minamifuruhagimachi"}'::jsonb,
  34.411095,
  131.393499,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kitafuruhagimachi',
  '北古萩町',
  'きたふるはぎまち',
  '{"en":"Kitafuruhagimachi"}'::jsonb,
  34.418335,
  131.396893,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tsubaki',
  '椿',
  'つばき',
  '{"en":"Tsubaki"}'::jsonb,
  34.3892548,
  131.4029162,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimogokenmachi',
  '下五間町',
  'しもごけんまち',
  '{"en":"Shimogokenmachi"}'::jsonb,
  34.4137191,
  131.4022512,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_furuhagimachi',
  '古萩町',
  'ふるはぎまち',
  '{"en":"Furuhagimachi"}'::jsonb,
  34.4157194,
  131.4042647,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_karahimachi',
  '唐樋町',
  'からひまち',
  '{"en":"Karahimachi"}'::jsonb,
  34.410016,
  131.4023814,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_akiragi',
  '明木',
  'あきらぎ',
  '{"en":"Akiragi"}'::jsonb,
  34.3444277,
  131.4084967,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yamada_quarter',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  34.3922692,
  131.3699544,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_takasashimo',
  '高佐下',
  'たかさしも',
  '{"en":"Takasashimo"}'::jsonb,
  34.4655901,
  131.6087224,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shioyacho',
  '塩屋町',
  'しおやちょう',
  '{"en":"Shioyacho"}'::jsonb,
  34.4146821,
  131.397104,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049134,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamiogawa_higashibun',
  '上小川東分',
  'かみおがわひがしぶん',
  '{"en":"Kamiogawa-higashibun"}'::jsonb,
  34.5852533,
  131.6698085,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yoshidacho',
  '吉田町',
  'よしだちょう',
  '{"en":"Yoshidacho"}'::jsonb,
  34.4142986,
  131.4034058,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kurogawa',
  '黒川',
  'くろがわ',
  '{"en":"Kurogawa"}'::jsonb,
  34.4431218,
  131.4641661,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hashimotomachi',
  '橋本町',
  'はしもとまち',
  '{"en":"Hashimotomachi"}'::jsonb,
  34.4028781,
  131.4018911,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_imafuruhagimachi',
  '今古萩町',
  'いまふるはぎまち',
  '{"en":"Imafuruhagimachi"}'::jsonb,
  34.4157705,
  131.4019868,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049139,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yadomikami',
  '弥富上',
  'やどみかみ',
  '{"en":"Yadomikami"}'::jsonb,
  34.5572534,
  131.6175565,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kibekami',
  '吉部上',
  'きべかみ',
  '{"en":"Kibekami"}'::jsonb,
  34.4491619,
  131.5883815,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049141,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tsumoricho',
  '津守町',
  'つもりちょう',
  '{"en":"Tsumoricho"}'::jsonb,
  34.4138053,
  131.3991438,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049142,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimotama',
  '下田万',
  'しもたま',
  '{"en":"Shimotama"}'::jsonb,
  34.6401146,
  131.668654,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049143,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kawashima',
  '川島',
  'かわしま',
  '{"en":"Kawashima"}'::jsonb,
  34.3998866,
  131.4086587,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukuikami',
  '福井上',
  'ふくいかみ',
  '{"en":"Fukuikami"}'::jsonb,
  34.4055866,
  131.5232817,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_susa',
  '須佐',
  'すさ',
  '{"en":"Susa"}'::jsonb,
  34.6205342,
  131.618109,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_komeyacho_quarter',
  '米屋町',
  'こめやちょう',
  '{"en":"Komeyacho"}'::jsonb,
  34.413429,
  131.3983271,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashitamachi',
  '東田町',
  'ひがしたまち',
  '{"en":"Higashitamachi"}'::jsonb,
  34.412127,
  131.402231,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_omotomachi',
  '御許町',
  'おもとまち',
  '{"en":"Omotomachi"}'::jsonb,
  34.4065097,
  131.4023236,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_oi',
  '大井',
  'おおい',
  '{"en":"Oi"}'::jsonb,
  34.4661419,
  131.4565119,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kozoe',
  '河添',
  'こうぞえ',
  '{"en":"Kozoe"}'::jsonb,
  34.4011132,
  131.3928815,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hamasakishincho',
  '浜崎新町',
  'はまさきしんちょう',
  '{"en":"Hamasakishincho"}'::jsonb,
  34.4187821,
  131.3993416,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_esaki',
  '江崎',
  'えさき',
  '{"en":"Esaki"}'::jsonb,
  34.64204,
  131.6511002,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479049153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ubuka',
  '宇生賀',
  'うぶか',
  '{"en":"Ubuka"}'::jsonb,
  34.4946331,
  131.5761248,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nago',
  '奈古',
  'なご',
  '{"en":"Nago"}'::jsonb,
  34.5047318,
  131.466711,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kiyo',
  '木与',
  'きよ',
  '{"en":"Kiyo"}'::jsonb,
  34.5334493,
  131.5068723,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukudakami',
  '福田上',
  'ふくだかみ',
  '{"en":"Fukudakami"}'::jsonb,
  34.5255656,
  131.6251827,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192950,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nago_quarter',
  '奈古',
  'なご',
  '{"en":"Nago"}'::jsonb,
  34.520719,
  131.5215196,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ubuka_quarter',
  '宇生賀',
  'うぶか',
  '{"en":"Ubuka"}'::jsonb,
  34.5182459,
  131.5682548,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_uta',
  '宇田',
  'うた',
  '{"en":"Uta"}'::jsonb,
  34.5637149,
  131.5472148,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukudashimo',
  '福田下',
  'ふくだしも',
  '{"en":"Fukudashimo"}'::jsonb,
  34.5225567,
  131.5945157,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sogo',
  '惣郷',
  'そうごう',
  '{"en":"Sogo"}'::jsonb,
  34.587282,
  131.5644455,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479192955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_kawara',
  '油谷河原',
  'ゆやかわら',
  '{"en":"Yuya-Kawara"}'::jsonb,
  34.364019,
  131.0494639,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hekikami',
  '日置上',
  'へきかみ',
  '{"en":"Hekikami"}'::jsonb,
  34.3936464,
  131.131972,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_maki',
  '真木',
  'まき',
  '{"en":"Maki"}'::jsonb,
  34.3160213,
  131.2281018,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tawarayama',
  '俵山',
  'たわらやま',
  '{"en":"Tawarayama"}'::jsonb,
  34.3027628,
  131.1033397,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_shinbetsumyo',
  '油谷新別名',
  'ゆやしんべつみょう',
  '{"en":"Yuya-Shinbetsumyo"}'::jsonb,
  34.3700371,
  131.0615787,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hekishimo',
  '日置下',
  'へきしも',
  '{"en":"Hekishimo"}'::jsonb,
  34.3862228,
  131.0767305,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253710,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_misumishimo',
  '三隅下',
  'みすみしも',
  '{"en":"Misumishimo"}'::jsonb,
  34.3644886,
  131.2275666,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_hisadomi',
  '油谷久富',
  'ゆやひさどみ',
  '{"en":"Yuya-Hisadomi"}'::jsonb,
  34.3642949,
  131.0807677,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hekinoda',
  '日置野田',
  'へきのだ',
  '{"en":"Hekinoda"}'::jsonb,
  34.4041507,
  131.0746741,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_igami',
  '油谷伊上',
  'ゆやいがみ',
  '{"en":"Yuya-Igami"}'::jsonb,
  34.3689589,
  131.0070768,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_mukatsukushimo',
  '油谷向津具下',
  'ゆやむかつくしも',
  '{"en":"Yuya-Mukatsukushimo"}'::jsonb,
  34.4116619,
  130.9603801,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_kuraoda',
  '油谷蔵小田',
  'ゆやくらおだ',
  '{"en":"Yuya-Kuraoda"}'::jsonb,
  34.387713,
  131.0520795,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479253716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishifukawa',
  '西深川',
  'にしふかわ',
  '{"en":"Nishifukawa"}'::jsonb,
  34.3640547,
  131.1601843,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_misumikami',
  '三隅上',
  'みすみかみ',
  '{"en":"Misumikami"}'::jsonb,
  34.3546984,
  131.2900578,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_kadoyama',
  '油谷角山',
  'ゆやかどやま',
  '{"en":"Yuya-Kadoyama"}'::jsonb,
  34.3943723,
  131.0314709,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kayoi',
  '通',
  'かよい',
  '{"en":"Kayoi"}'::jsonb,
  34.4257064,
  131.2507242,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tawarayama_quarter',
  '俵山',
  'たわらやま',
  '{"en":"Tawarayama"}'::jsonb,
  34.301195,
  131.1408186,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_tsuo',
  '油谷津黄',
  'ゆやつおう',
  '{"en":"Yuya-Tsuo"}'::jsonb,
  34.4160988,
  131.0733841,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukawayumoto',
  '深川湯本',
  'ふかわゆもと',
  '{"en":"Fukawayumoto"}'::jsonb,
  34.3283587,
  131.1697073,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_misuminaka',
  '三隅中',
  'みすみなか',
  '{"en":"Misuminaka"}'::jsonb,
  34.3612092,
  131.2546254,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_senzaki',
  '仙崎',
  'せんざき',
  '{"en":"Senzaki"}'::jsonb,
  34.4019603,
  131.1998231,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_misumikami_quarter',
  '三隅上',
  'みすみかみ',
  '{"en":"Misumikami"}'::jsonb,
  34.3337021,
  131.3215309,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_mukatsukukami',
  '油谷向津具上',
  'ゆやむかつくかみ',
  '{"en":"Yuya-Mukatsukukami"}'::jsonb,
  34.4159178,
  130.9969229,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hekikuraoda',
  '日置蔵小田',
  'へきくらおだ',
  '{"en":"Hekikuraoda"}'::jsonb,
  34.3984819,
  131.061754,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_ushirobata',
  '油谷後畑',
  'ゆやうしろばた',
  '{"en":"Yuya-Ushirobata"}'::jsonb,
  34.4062255,
  131.0313979,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashifukawa',
  '東深川',
  'ひがしふかわ',
  '{"en":"Higashifukawa"}'::jsonb,
  34.3698989,
  131.190109,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_misumishimo_quarter',
  '三隅下',
  'みすみしも',
  '{"en":"Misumishimo"}'::jsonb,
  34.3773408,
  131.248365,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hekinaka',
  '日置中',
  'へきなか',
  '{"en":"Hekinaka"}'::jsonb,
  34.3816493,
  131.0981088,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuya_kawashiri',
  '油谷川尻',
  'ゆやかわしり',
  '{"en":"Yuya-Kawashiri"}'::jsonb,
  34.4230203,
  130.9993121,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shibuki_quarter',
  '渋木',
  'しぶき',
  '{"en":"Shibuki"}'::jsonb,
  34.3036962,
  131.2039446,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8479281734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogodanchi',
  '麻郷団地',
  'おごうだんち',
  '{"en":"Ogodanchi"}'::jsonb,
  33.9363345,
  132.0499223,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570766515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mori',
  '森',
  'もり',
  '{"en":"Mori"}'::jsonb,
  33.9124132,
  132.3597885,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570766516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kawanishi',
  '川西',
  'かわにし',
  '{"en":"Kawanishi"}'::jsonb,
  33.9621041,
  132.0125202,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hikuma',
  '日前',
  'ひくま',
  '{"en":"Hikuma"}'::jsonb,
  33.9216236,
  132.2955817,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_iwaishima',
  '祝島',
  'いわいしま',
  '{"en":"Iwaishima"}'::jsonb,
  33.7857734,
  131.985979,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashiyashiro',
  '東屋代',
  'ひがしやしろ',
  '{"en":"Higashiyashiro"}'::jsonb,
  33.9111349,
  132.2184688,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishigata',
  '西方',
  'にしがた',
  '{"en":"Nishigata"}'::jsonb,
  33.896127,
  132.337666,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_doi',
  '土居',
  'どい',
  '{"en":"Doi"}'::jsonb,
  33.9142976,
  132.3046394,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sagojima',
  '佐合島',
  'さごうじま',
  '{"en":"Sagojima"}'::jsonb,
  33.8755448,
  132.0640956,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kodomari',
  '小泊',
  'こどまり',
  '{"en":"Kodomari"}'::jsonb,
  33.9164939,
  132.3905161,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_saga',
  '佐賀',
  'さが',
  '{"en":"Saga"}'::jsonb,
  33.8977947,
  132.083604,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_izui',
  '出井',
  'いずい',
  '{"en":"Izui"}'::jsonb,
  33.8749825,
  132.2190954,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_usanagi',
  '宇佐木',
  'うさなぎ',
  '{"en":"Usanagi"}'::jsonb,
  33.9508046,
  132.0927039,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yokomi',
  '横見',
  'よこみ',
  '{"en":"Yokomi"}'::jsonb,
  33.8950862,
  132.1936605,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamitabuse',
  '上田布施',
  'かみたぶせ',
  '{"en":"Kamitabuse"}'::jsonb,
  33.9408874,
  132.0047537,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yura',
  '油良',
  'ゆら',
  '{"en":"Yura"}'::jsonb,
  33.9040186,
  132.3155766,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yashima',
  '八島',
  'やしま',
  '{"en":"Yashima"}'::jsonb,
  33.7333544,
  132.1464795,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hirano',
  '平野',
  'ひらの',
  '{"en":"Hirano"}'::jsonb,
  33.9060379,
  132.3570919,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_murotsu',
  '室津',
  'むろつ',
  '{"en":"Murotsu"}'::jsonb,
  33.8409105,
  132.1358827,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishi_agenosho',
  '西安下庄',
  'にしあげのしょう',
  '{"en":"Nishi-Agenosho"}'::jsonb,
  33.8963289,
  132.266331,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_konoura',
  '神浦',
  'こうのうら',
  '{"en":"Konoura"}'::jsonb,
  33.9242465,
  132.3771059,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tategahama',
  '竪ケ浜',
  'たてがはま',
  '{"en":"Tategahama"}'::jsonb,
  33.946238,
  132.0631845,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_uchinonyu',
  '内入',
  'うちのにゅう',
  '{"en":"Uchinonyu"}'::jsonb,
  33.9251393,
  132.3969746,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_chuominami',
  '中央南',
  'ちゅうおうみなみ',
  '{"en":"Chuominami"}'::jsonb,
  33.951641,
  132.0438464,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ukashima',
  '浮島',
  'うかしま',
  '{"en":"Ukashima"}'::jsonb,
  33.9510304,
  132.3496617,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shukui',
  '宿井',
  'しゅくい',
  '{"en":"Shukui"}'::jsonb,
  33.9739852,
  132.0218763,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_wada',
  '和田',
  'わだ',
  '{"en":"Wada"}'::jsonb,
  33.9292688,
  132.407659,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimotabuse',
  '下田布施',
  'しもたぶせ',
  '{"en":"Shimotabuse"}'::jsonb,
  33.9507587,
  132.0356998,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_himi',
  '日見',
  'ひみ',
  '{"en":"Himi"}'::jsonb,
  33.9017679,
  132.1829468,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ohano',
  '大波野',
  'おおはの',
  '{"en":"Ohano"}'::jsonb,
  33.9768277,
  132.0578533,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishiyashiro',
  '西屋代',
  'にしやしろ',
  '{"en":"Nishiyashiro"}'::jsonb,
  33.9207626,
  132.2015871,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishimigama',
  '西三蒲',
  'にしみがま',
  '{"en":"Nishimigama"}'::jsonb,
  33.9395006,
  132.2105236,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_komatsu_kaisaku',
  '小松開作',
  'こまつかいさく',
  '{"en":"Komatsu-kaisaku"}'::jsonb,
  33.9283228,
  132.1833079,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sone',
  '曽根',
  'そね',
  '{"en":"Sone"}'::jsonb,
  33.9209635,
  132.0706699,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_komatsu',
  '小松',
  'こまつ',
  '{"en":"Komatsu"}'::jsonb,
  33.9381224,
  132.1949344,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_onominami',
  '大野南',
  'おおのみなみ',
  '{"en":"Onominami"}'::jsonb,
  33.9282362,
  132.0875821,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kasasajima',
  '笠佐島',
  'かささじま',
  '{"en":"Kasasajima"}'::jsonb,
  33.9440607,
  132.1642427,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_onokita',
  '大野北',
  'おおのきた',
  '{"en":"Onokita"}'::jsonb,
  33.9362812,
  132.0941481,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_wasa',
  '和佐',
  'わさ',
  '{"en":"Wasa"}'::jsonb,
  33.9165897,
  132.3801616,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_befu',
  '別府',
  'べふ',
  '{"en":"Befu"}'::jsonb,
  33.9189667,
  132.0292751,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mukuno',
  '椋野',
  'むくの',
  '{"en":"Mukuno"}'::jsonb,
  33.9561877,
  132.2283513,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_heta',
  '戸田',
  'へた',
  '{"en":"Heta"}'::jsonb,
  33.8895698,
  132.2038292,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashimigama',
  '東三蒲',
  'ひがしみがま',
  '{"en":"Higashimigama"}'::jsonb,
  33.9458625,
  132.2198196,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hiraomura',
  '平生村',
  'ひらおむら',
  '{"en":"Hiraomura"}'::jsonb,
  33.9451678,
  132.0761095,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shisa',
  '志佐',
  'しさ',
  '{"en":"Shisa"}'::jsonb,
  33.9202153,
  132.180936,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hiraomachi',
  '平生町',
  'ひらおまち',
  '{"en":"Hiraomachi"}'::jsonb,
  33.9364465,
  132.0676583,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_okikamurojima',
  '沖家室島',
  'おきかむろじま',
  '{"en":"Okikamurojima"}'::jsonb,
  33.8527727,
  132.3620968,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_oguni',
  '小郡',
  'おぐに',
  '{"en":"Oguni"}'::jsonb,
  33.8826128,
  132.1183,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sekigahama',
  '関ケ浜',
  'せきがはま',
  '{"en":"Sekigahama"}'::jsonb,
  34.2031556,
  132.2021761,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aki',
  '秋',
  'あき',
  '{"en":"Aki"}'::jsonb,
  33.8828189,
  132.2558119,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hano',
  '波野',
  'はの',
  '{"en":"Hano"}'::jsonb,
  33.9656079,
  132.045828,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_seta',
  '瀬田',
  'せた',
  '{"en":"Seta"}'::jsonb,
  34.1838091,
  132.2050668,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogooku',
  '麻郷奥',
  'おごうおく',
  '{"en":"Ogooku"}'::jsonb,
  33.9426194,
  132.0366168,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yuu',
  '油宇',
  'ゆう',
  '{"en":"Yuu"}'::jsonb,
  33.9341838,
  132.4398912,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ihota',
  '伊保田',
  'いほた',
  '{"en":"Ihota"}'::jsonb,
  33.9427903,
  132.453103,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogo',
  '麻郷',
  'おごう',
  '{"en":"Ogo"}'::jsonb,
  33.9382644,
  132.0520172,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashi_agenosho',
  '東安下庄',
  'ひがしあげのしょう',
  '{"en":"Higashi-Agenosho"}'::jsonb,
  33.9048694,
  132.2896263,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nagashima',
  '長島',
  'ながしま',
  '{"en":"Nagashima"}'::jsonb,
  33.8184449,
  132.0728027,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tononyu',
  '外入',
  'とのにゅう',
  '{"en":"Tononyu"}'::jsonb,
  33.8753037,
  132.3361608,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_jikamuro',
  '地家室',
  'じかむろ',
  '{"en":"Jikamuro"}'::jsonb,
  33.8684362,
  132.3530438,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kuka',
  '久賀',
  'くか',
  '{"en":"Kuka"}'::jsonb,
  33.9466795,
  132.2529257,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_okuni',
  '尾国',
  'おくに',
  '{"en":"Okuni"}'::jsonb,
  33.8723516,
  132.1229072,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kabo',
  '家房',
  'かぼう',
  '{"en":"Kabo"}'::jsonb,
  33.8804599,
  132.2342833,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kusunoki',
  '楠',
  'くすのき',
  '{"en":"Kusunoki"}'::jsonb,
  33.9359116,
  132.0264843,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8570793793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamonosho',
  '鴨庄',
  'かものしょう',
  '{"en":"Kamonosho"}'::jsonb,
  34.0703341,
  131.1666647,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532161,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_hoho',
  '豊田前町保々',
  'とよたまえちょうほうほう',
  '{"en":"Toyotamaecho-Hoho"}'::jsonb,
  34.1554602,
  131.1099487,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shin_arihocho',
  '新有帆町',
  'しんありほちょう',
  '{"en":"Shin-Arihocho"}'::jsonb,
  34.0195161,
  131.2025924,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_minatomachi',
  '港町',
  'みなとまち',
  '{"en":"Minatomachi"}'::jsonb,
  33.9740189,
  131.176314,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_asokami',
  '豊田前町麻生上',
  'とよたまえちょうあそうかみ',
  '{"en":"Toyotamaecho-Asokami"}'::jsonb,
  34.207715,
  131.1274905,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_jiyugaoka',
  '自由ヶ丘',
  'じゆうがおか',
  '{"en":"Jiyugaoka"}'::jsonb,
  33.9840573,
  131.1860757,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532167,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_beppu',
  '秋芳町別府',
  'しゅうほうちょうべっぷ',
  '{"en":"Shuhocho-Beppu"}'::jsonb,
  34.2577954,
  131.2403858,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532169,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ofukucho_kami',
  '於福町上',
  'おふくちょうかみ',
  '{"en":"Ofukucho-kami"}'::jsonb,
  34.2401998,
  131.1859673,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532171,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ariho',
  '有帆',
  'ありほ',
  '{"en":"Ariho"}'::jsonb,
  34.0169673,
  131.2091477,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532172,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ominecho_higashibun',
  '大嶺町東分',
  'おおみねちょうひがしぶん',
  '{"en":"Ominecho-Higashibun"}'::jsonb,
  34.170725,
  131.1988765,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532174,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_isacho_kawara',
  '伊佐町河原',
  'いさちょうかわら',
  '{"en":"Isacho-Kawara"}'::jsonb,
  34.1969183,
  131.2497177,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_marugochi',
  '丸河内',
  'まるごうち',
  '{"en":"Marugochi"}'::jsonb,
  33.9800224,
  131.1859168,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_oda',
  '美東町大田',
  'みとうちょうおおだ',
  '{"en":"Mitocho-Oda"}'::jsonb,
  34.2280657,
  131.340578,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532182,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_fukuda',
  '福田',
  'ふくだ',
  '{"en":"Fukuda"}'::jsonb,
  34.0676925,
  131.1059429,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532183,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_minami_ryuocho',
  '南竜王町',
  'みなみりゅうおうちょう',
  '{"en":"Minami-Ryuocho"}'::jsonb,
  33.9663791,
  131.1762481,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532184,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashiatsucho_kawahigashi',
  '東厚保町川東',
  'ひがしあつちょうかわひがし',
  '{"en":"Higashiatsucho-Kawahigashi"}'::jsonb,
  34.1370727,
  131.154243,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532186,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_takahata',
  '高畑',
  'たかはた',
  '{"en":"Takahata"}'::jsonb,
  34.0292921,
  131.1905939,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishiatsucho_hongo',
  '西厚保町本郷',
  'にしあつちょうほんごう',
  '{"en":"Nishiatsucho-Hongo"}'::jsonb,
  34.1036132,
  131.1474457,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_imayama',
  '豊田前町今山',
  'とよたまえちょういまやま',
  '{"en":"Toyotamaecho-Imayama"}'::jsonb,
  34.1701753,
  131.1238399,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_aokage',
  '秋芳町青景',
  'しゅうほうちょうあおかげ',
  '{"en":"Shuhocho-Aokage"}'::jsonb,
  34.2741995,
  131.2861647,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532194,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kita_ryuocho',
  '北竜王町',
  'きたりゅうおうちょう',
  '{"en":"Kita-Ryuocho"}'::jsonb,
  33.9709381,
  131.1764491,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532195,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_isacho_okumagura',
  '伊佐町奥万倉',
  'いさちょうおくまぐら',
  '{"en":"Isacho-Okumagura"}'::jsonb,
  34.1331135,
  131.226536,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_naganobori',
  '美東町長登',
  'みとうちょうながのぼり',
  '{"en":"Mitocho-Naganobori"}'::jsonb,
  34.2493059,
  131.3370432,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yamanoi',
  '山野井',
  'やまのい',
  '{"en":"Yamanoi"}'::jsonb,
  34.0624256,
  131.1289683,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_nagata',
  '美東町長田',
  'みとうちょうながた',
  '{"en":"Mitocho-Nagata"}'::jsonb,
  34.1745047,
  131.364952,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532203,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kori',
  '郡',
  'こおり',
  '{"en":"Kori"}'::jsonb,
  34.0149336,
  131.1399107,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_aka',
  '美東町赤',
  'みとうちょうあか',
  '{"en":"Mitocho-Aka"}'::jsonb,
  34.2919079,
  131.3354361,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_asoshimo',
  '豊田前町麻生下',
  'とよたまえちょうあそうしも',
  '{"en":"Toyotamaecho-Asoshimo"}'::jsonb,
  34.1904226,
  131.1253661,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532211,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sakaemachi',
  '栄町',
  'さかえまち',
  '{"en":"Sakaemachi"}'::jsonb,
  33.9915019,
  131.1774923,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_iwanagashimogo',
  '秋芳町岩永下郷',
  'しゅうほうちょういわながしもごう',
  '{"en":"Shuhocho-Iwanagashimogo"}'::jsonb,
  34.1896287,
  131.2999875,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ofukucho_shimo',
  '於福町下',
  'おふくちょうしも',
  '{"en":"Ofukucho-shimo"}'::jsonb,
  34.2282364,
  131.2047934,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571532216,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ominecho_okubun',
  '大嶺町奥分',
  'おおみねちょうおくぶん',
  '{"en":"Ominecho-Okubun"}'::jsonb,
  34.1905056,
  131.1644194,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_isacho_horikoshi',
  '伊佐町堀越',
  'いさちょうほりこし',
  '{"en":"Isacho-Horikoshi"}'::jsonb,
  34.1379148,
  131.2204812,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553923,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yamakawa',
  '山川',
  'やまかわ',
  '{"en":"Yamakawa"}'::jsonb,
  34.0549831,
  131.1510774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aobadai',
  '青葉台',
  'あおばだい',
  '{"en":"Aobadai"}'::jsonb,
  34.0103597,
  131.161935,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553925,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sementomachi',
  'セメント町',
  'せめんとまち',
  '{"en":"Sementomachi"}'::jsonb,
  33.9778674,
  131.1759459,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tsubuta',
  '津布田',
  'つぶた',
  '{"en":"Tsubuta"}'::jsonb,
  34.0209569,
  131.1183274,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashi_takadomari',
  '東高泊',
  'ひがしたかどまり',
  '{"en":"Higashi-Takadomari"}'::jsonb,
  34.0109385,
  131.1798139,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashiatsucho_yamanaka',
  '東厚保町山中',
  'ひがしあつちょうやまなか',
  '{"en":"Higashiatsucho-Yamanaka"}'::jsonb,
  34.1294432,
  131.1865664,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553930,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_chizaki',
  '千崎',
  'ちざき',
  '{"en":"Chizaki"}'::jsonb,
  34.0256,
  131.1818809,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_furueboshi',
  '豊田前町古烏帽子',
  'とよたまえちょうふるえぼし',
  '{"en":"Toyotamaecho-Furueboshi"}'::jsonb,
  34.1479041,
  131.0959308,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553933,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_midorigaoka',
  '緑が丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  34.0162213,
  131.1723337,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553935,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_toyotamaecho_dake',
  '豊田前町嶽',
  'とよたまえちょうだけ',
  '{"en":"Toyotamaecho-Dake"}'::jsonb,
  34.1542921,
  131.0960757,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_kama',
  '秋芳町嘉万',
  'しゅうほうちょうかま',
  '{"en":"Shuhocho-Kama"}'::jsonb,
  34.2898169,
  131.2600407,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553939,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_akiyoshi',
  '秋芳町秋吉',
  'しゅうほうちょうあきよし',
  '{"en":"Shuhocho-Akiyoshi"}'::jsonb,
  34.2165399,
  131.3088618,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kyowadai',
  '共和台',
  'きょうわだい',
  '{"en":"Kyowadai"}'::jsonb,
  34.0090363,
  131.2043837,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_asa',
  '厚狭',
  'あさ',
  '{"en":"Asa"}'::jsonb,
  34.0680668,
  131.1829439,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ominecho_nishibun',
  '大嶺町西分',
  'おおみねちょうにしぶん',
  '{"en":"Ominecho-Nishibun"}'::jsonb,
  34.1550311,
  131.1652868,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_mana',
  '美東町真名',
  'みとうちょうまな',
  '{"en":"Mitocho-Mana"}'::jsonb,
  34.1610766,
  131.3438016,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_edo',
  '美東町絵堂',
  'みとうちょうえどう',
  '{"en":"Mitocho-Edo"}'::jsonb,
  34.281542,
  131.3704506,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_habu',
  '埴生',
  'はぶ',
  '{"en":"Habu"}'::jsonb,
  34.0452612,
  131.0875011,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_onoda',
  '小野田',
  'おのだ',
  '{"en":"Onoda"}'::jsonb,
  33.9525122,
  131.1735844,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_ayagi',
  '美東町綾木',
  'みとうちょうあやぎ',
  '{"en":"Mitocho-Ayagi"}'::jsonb,
  34.1959189,
  131.3537338,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_heiseicho',
  '平成町',
  'へいせいちょう',
  '{"en":"Heiseicho"}'::jsonb,
  33.9789326,
  131.1744647,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishiatsucho_hara',
  '西厚保町原',
  'にしあつちょうはら',
  '{"en":"Nishiatsucho-Hara"}'::jsonb,
  34.127263,
  131.1203736,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shuhocho_iwanagahongo',
  '秋芳町岩永本郷',
  'しゅうほうちょういわながほんごう',
  '{"en":"Shuhocho-Iwanagahongo"}'::jsonb,
  34.208301,
  131.2828438,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_inarimachi',
  '稲荷町',
  'いなりまち',
  '{"en":"Inarimachi"}'::jsonb,
  33.9845852,
  131.1794076,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553963,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ominecho_kitabun',
  '大嶺町北分',
  'おおみねちょうきたぶん',
  '{"en":"Ominecho-Kitabun"}'::jsonb,
  34.2076317,
  131.2189912,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_isacho_isa',
  '伊佐町伊佐',
  'いさちょういさ',
  '{"en":"Isacho-Isa"}'::jsonb,
  34.1662398,
  131.2360687,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553969,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_taikyudanchi',
  '大休団地',
  'たいきゅうだんち',
  '{"en":"Taikyudanchi"}'::jsonb,
  34.033365,
  131.20775,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishi_takadomari',
  '西高泊',
  'にしたかどまり',
  '{"en":"Nishi-Takadomari"}'::jsonb,
  34.0048123,
  131.1655582,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishioki',
  '西沖',
  'にしおき',
  '{"en":"Nishioki"}'::jsonb,
  33.9486278,
  131.1892609,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553974,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mitocho_ono',
  '美東町小野',
  'みとうちょうおの',
  '{"en":"Mitocho-Ono"}'::jsonb,
  34.1703639,
  131.3158062,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571553975,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_heigun',
  '平郡',
  'へいぐん',
  '{"en":"Heigun"}'::jsonb,
  33.7877291,
  132.2438857,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atsuki',
  '阿月',
  'あつき',
  '{"en":"Atsuki"}'::jsonb,
  33.8609724,
  132.1486187,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atsuki_quarter',
  '阿月',
  'あつき',
  '{"en":"Atsuki"}'::jsonb,
  33.8878719,
  132.1239981,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ihonosho',
  '伊保庄',
  'いほのしょう',
  '{"en":"Ihonosho"}'::jsonb,
  33.9269023,
  132.1198453,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_asahigaoka',
  '旭ヶ丘',
  'あさひがおか',
  '{"en":"Asahigaoka"}'::jsonb,
  33.9552348,
  132.102591,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_newtown_minamimachi',
  'ニュータウン南町',
  'にゅーたうんみなみまち',
  '{"en":"Newtown-minamimachi"}'::jsonb,
  33.9667558,
  132.0972413,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yota',
  '余田',
  'よた',
  '{"en":"Yota"}'::jsonb,
  33.9794536,
  132.0701196,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shin_ichi_oki',
  '新市沖',
  'しんいちおき',
  '{"en":"Shin-ichi-oki"}'::jsonb,
  33.9632679,
  132.1175913,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kitahama',
  '北浜',
  'きたはま',
  '{"en":"Kitahama"}'::jsonb,
  33.9629396,
  132.1155274,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shin_ichi_kita',
  '新市北',
  'しんいちきた',
  '{"en":"Shin-ichi-kita"}'::jsonb,
  33.9653668,
  132.118673,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shin_ichi_minami',
  '新市南',
  'しんいちみなみ',
  '{"en":"Shin-ichi-minami"}'::jsonb,
  33.9640658,
  132.117978,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_higashidote',
  '東土手',
  'ひがしどて',
  '{"en":"Higashidote"}'::jsonb,
  33.9669424,
  132.1175976,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yanai',
  '柳井',
  'やない',
  '{"en":"Yanai"}'::jsonb,
  33.9835086,
  132.1063584,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kogaisaku',
  '古開作',
  'こがいさく',
  '{"en":"Kogaisaku"}'::jsonb,
  33.9676304,
  132.0967914,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tenjin',
  '天神',
  'てんじん',
  '{"en":"Tenjin"}'::jsonb,
  33.9661572,
  132.1143403,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shinjo',
  '新庄',
  'しんじょう',
  '{"en":"Shinjo"}'::jsonb,
  33.9720297,
  132.0864527,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ekinan',
  '駅南',
  'えきなん',
  '{"en":"Ekinan"}'::jsonb,
  33.9662528,
  132.103129,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_himeda',
  '姫田',
  'ひめだ',
  '{"en":"Himeda"}'::jsonb,
  33.9699935,
  132.112809,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shin_ichi',
  '新市',
  'しんいち',
  '{"en":"Shin-ichi"}'::jsonb,
  33.9649903,
  132.1177102,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yanaitsu',
  '柳井津',
  'やないつ',
  '{"en":"Yanaitsu"}'::jsonb,
  33.9678815,
  132.1103333,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_dotemachi',
  '土手町',
  'どてまち',
  '{"en":"Dotemachi"}'::jsonb,
  33.9667162,
  132.1124102,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_katanonishi',
  '片野西',
  'かたのにし',
  '{"en":"Katanonishi"}'::jsonb,
  33.9705941,
  132.1210911,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shintenchi',
  '新天地',
  'しんてんち',
  '{"en":"Shintenchi"}'::jsonb,
  33.9672995,
  132.1147884,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635782,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yamane',
  '山根',
  'やまね',
  '{"en":"Yamane"}'::jsonb,
  33.9700889,
  132.115659,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tozaki',
  '遠崎',
  'とおざき',
  '{"en":"Tozaki"}'::jsonb,
  33.9601228,
  132.1453709,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_obatake',
  '大畠',
  'おおばたけ',
  '{"en":"Obatake"}'::jsonb,
  33.9670975,
  132.1653775,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kojiro',
  '神代',
  'こうじろ',
  '{"en":"Kojiro"}'::jsonb,
  33.9802658,
  132.183757,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hizumi',
  '日積',
  'ひづみ',
  '{"en":"Hizumi"}'::jsonb,
  33.9948673,
  132.1619358,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ikachi',
  '伊陸',
  'いかち',
  '{"en":"Ikachi"}'::jsonb,
  34.0259829,
  132.109628,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8571635789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atoikumonishibun',
  '阿東生雲西分',
  '阿東生雲西分',
  '{"en":"Atoikumonishibun"}'::jsonb,
  34.3996952,
  131.6186893,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8633732472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atoikumonaka',
  '阿東生雲中',
  '阿東生雲中',
  '{"en":"Atoikumonaka"}'::jsonb,
  34.3874336,
  131.5939807,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8634347124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atozomeki',
  '阿東蔵目喜',
  '阿東蔵目喜',
  '{"en":"Atozomeki"}'::jsonb,
  34.3892662,
  131.5645087,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8634347130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atokaneshimo',
  '阿東嘉年下',
  '阿東嘉年下',
  '{"en":"Atokaneshimo"}'::jsonb,
  34.4552441,
  131.6736316,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8645534135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atokanekami',
  '阿東嘉年上',
  '阿東嘉年上',
  '{"en":"Atokanekami"}'::jsonb,
  34.483876,
  131.662849,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8645605596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字荒瀬',
  '大字荒瀬',
  '大字荒瀬',
  NULL,
  34.066206,
  131.293439,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岩鼻',
  '岩鼻町',
  '岩鼻町',
  NULL,
  33.980532,
  131.222809,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_琴崎',
  '琴崎町',
  '琴崎町',
  NULL,
  33.971027,
  131.268052,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上野中',
  '上野中町',
  '上野中町',
  NULL,
  33.952902,
  131.272725,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西万倉',
  '大字西万倉',
  '大字西万倉',
  NULL,
  34.082934,
  131.225778,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中宇部',
  '大字中宇部',
  '大字中宇部',
  NULL,
  33.972162,
  131.258169,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_常藤',
  '常藤町',
  '常藤町',
  NULL,
  33.949451,
  131.254426,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字善和',
  '大字善和',
  '大字善和',
  NULL,
  34.016707,
  131.287257,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の手',
  '山の手町',
  '山の手町',
  NULL,
  34.006842,
  131.231605,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_末広',
  '末広町',
  '末広町',
  NULL,
  33.935842,
  131.263617,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字木田',
  '大字木田',
  '大字木田',
  NULL,
  34.064101,
  131.281027,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字藤曲',
  '大字藤曲',
  '大字藤曲',
  NULL,
  33.959983,
  131.221147,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字沖ノ旦',
  '大字沖ノ旦',
  '大字沖ノ旦',
  NULL,
  33.995635,
  131.238831,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字櫟原',
  '大字櫟原',
  '大字櫟原',
  NULL,
  34.090505,
  131.30016,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_芝中',
  '芝中町',
  '芝中町',
  NULL,
  33.943813,
  131.25761,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東見初',
  '東見初町',
  '東見初町',
  NULL,
  33.934758,
  131.255185,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東芝中',
  '東芝中町',
  '東芝中町',
  NULL,
  33.939776,
  131.259013,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字妻崎開作',
  '大字妻崎開作',
  '大字妻崎開作',
  NULL,
  33.972759,
  131.209858,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678745515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字山田',
  '大字山田',
  '大字山田',
  NULL,
  34.047008,
  131.90626,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中須南',
  '大字中須南',
  '大字中須南',
  NULL,
  34.086169,
  131.895498,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字河内',
  '大字河内',
  '大字河内',
  NULL,
  34.012997,
  131.897707,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752181,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大藤谷',
  '大字大藤谷',
  '大字大藤谷',
  NULL,
  34.071901,
  131.917152,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752185,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東豊井',
  '大字東豊井',
  '大字東豊井',
  NULL,
  33.995495,
  131.88306,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752200,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東海岸通り',
  '東海岸通り',
  '東海岸通り',
  NULL,
  33.9854033,
  131.8841763,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字末武中',
  '大字末武中',
  '大字末武中',
  NULL,
  34.025145,
  131.842818,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752203,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字下谷',
  '大字下谷',
  '大字下谷',
  NULL,
  34.089304,
  131.872165,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_桃山',
  '桃山町',
  '桃山町',
  NULL,
  34.026851,
  131.917925,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678752207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_阿月',
  '阿月',
  '阿月',
  NULL,
  33.878375,
  132.132144,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758633,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新天地',
  '新天地',
  '新天地',
  NULL,
  33.967314,
  132.11483,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758634,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新',
  '新市',
  '新市',
  NULL,
  33.964977,
  132.11768,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758637,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_余田',
  '余田',
  '余田',
  NULL,
  33.985839,
  132.067086,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大畠',
  '大畠',
  '大畠',
  NULL,
  33.968519,
  132.163213,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758639,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ニュータウン南',
  'ニュータウン南町',
  'ニュータウン南町',
  NULL,
  33.966807,
  132.097134,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_旭ケ丘',
  '旭ケ丘',
  '旭ケ丘',
  NULL,
  33.955286,
  132.102583,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新庄',
  '新庄',
  '新庄',
  NULL,
  33.976316,
  132.086509,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758644,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_古開作',
  '古開作',
  '古開作',
  NULL,
  33.96406,
  132.096601,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_平郡',
  '平郡',
  '平郡',
  NULL,
  33.792524,
  132.226969,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山根',
  '山根',
  '山根',
  NULL,
  33.969822,
  132.115667,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_駅南',
  '駅南',
  '駅南',
  NULL,
  33.966304,
  132.103121,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_土手',
  '土手町',
  '土手町',
  NULL,
  33.966744,
  132.112382,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758649,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新市南',
  '新市南',
  '新市南',
  NULL,
  33.964117,
  132.11797,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_神代',
  '神代',
  '神代',
  NULL,
  33.980317,
  132.183749,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_姫田',
  '姫田',
  '姫田',
  NULL,
  33.969899,
  132.112746,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758655,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柳井津',
  '柳井津',
  '柳井津',
  NULL,
  33.967807,
  132.11034,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊保庄',
  '伊保庄',
  '伊保庄',
  NULL,
  33.930087,
  132.116168,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_遠崎',
  '遠崎',
  '遠崎',
  NULL,
  33.962541,
  132.148839,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新市北',
  '新市北',
  '新市北',
  NULL,
  33.965418,
  132.118665,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758661,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_北浜',
  '北浜',
  '北浜',
  NULL,
  33.960428,
  132.117708,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758663,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_日積',
  '日積',
  '日積',
  NULL,
  34.002141,
  132.161799,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758664,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柳井',
  '柳井',
  '柳井',
  NULL,
  33.983453,
  132.112852,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758665,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_天神',
  '天神',
  '天神',
  NULL,
  33.966135,
  132.114339,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊陸',
  '伊陸',
  '伊陸',
  NULL,
  34.026034,
  132.10962,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758667,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新市沖',
  '新市沖',
  '新市沖',
  NULL,
  33.96318,
  132.11749,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758670,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東土手',
  '東土手',
  '東土手',
  NULL,
  33.966978,
  132.11767,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_片野西',
  '片野西',
  '片野西',
  NULL,
  33.97093,
  132.121362,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678758673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字如意寺',
  '大字如意寺',
  '大字如意寺',
  NULL,
  34.096925,
  131.290791,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_寺の前',
  '寺の前町',
  '寺の前町',
  NULL,
  33.962727,
  131.268642,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中山',
  '大字中山',
  '大字中山',
  NULL,
  33.985444,
  131.245747,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_若松',
  '若松町',
  '若松町',
  NULL,
  33.959502,
  131.242291,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字車地',
  '大字車地',
  '大字車地',
  NULL,
  34.04434,
  131.296209,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_助田',
  '助田町',
  '助田町',
  NULL,
  33.962901,
  131.230727,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字船木',
  '大字船木',
  '大字船木',
  NULL,
  34.052167,
  131.207209,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字奥万倉',
  '大字奥万倉',
  '大字奥万倉',
  NULL,
  34.106693,
  131.23704,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字今富',
  '大字今富',
  '大字今富',
  NULL,
  34.091092,
  131.254143,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_文京',
  '文京町',
  '文京町',
  NULL,
  33.972589,
  131.230925,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鍋倉',
  '鍋倉町',
  '鍋倉町',
  NULL,
  33.96791,
  131.233126,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東新川',
  '東新川町',
  '東新川町',
  NULL,
  33.947429,
  131.256067,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中野開作',
  '大字中野開作',
  '大字中野開作',
  NULL,
  33.987053,
  131.216857,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東吉部',
  '大字東吉部',
  '大字東吉部',
  NULL,
  34.14217,
  131.291333,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西沖の山',
  '大字西沖の山',
  '大字西沖の山',
  NULL,
  33.951356,
  131.203145,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小串',
  '大字小串',
  '大字小串',
  NULL,
  33.949139,
  131.232534,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字矢矯',
  '大字矢矯',
  '大字矢矯',
  NULL,
  34.077203,
  131.250256,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_八王子',
  '八王子町',
  '八王子町',
  NULL,
  33.927806,
  131.26519,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小野',
  '大字小野',
  '大字小野',
  NULL,
  34.117241,
  131.334786,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東万倉',
  '大字東万倉',
  '大字東万倉',
  NULL,
  34.056758,
  131.243347,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字棯小野',
  '大字棯小野',
  '大字棯小野',
  NULL,
  34.08924,
  131.342438,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鵜の島',
  '鵜の島町',
  '鵜の島町',
  NULL,
  33.961628,
  131.238159,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_幸',
  '幸町',
  '幸町',
  NULL,
  33.939091,
  131.253441,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西中',
  '西中町',
  '西中町',
  NULL,
  33.961099,
  131.234078,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_松崎',
  '松崎町',
  '松崎町',
  NULL,
  33.982571,
  131.225345,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦',
  '錦町',
  '錦町',
  NULL,
  33.945745,
  131.251843,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_風呂ヶ迫',
  '風呂ヶ迫町',
  '風呂ヶ迫町',
  NULL,
  33.96681,
  131.277722,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_相生_quarter',
  '相生町',
  '相生町',
  NULL,
  33.953657,
  131.245356,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東須恵',
  '大字東須恵',
  '大字東須恵',
  NULL,
  33.979279,
  131.195274,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763623,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東岐波',
  '大字東岐波',
  '大字東岐波',
  NULL,
  33.980255,
  131.331788,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西吉部',
  '大字西吉部',
  '大字西吉部',
  NULL,
  34.118625,
  131.258063,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字末信',
  '大字末信',
  '大字末信',
  NULL,
  34.012354,
  131.248358,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字山中',
  '大字山中',
  '大字山中',
  NULL,
  34.058123,
  131.315884,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字上宇部',
  '大字上宇部',
  '大字上宇部',
  NULL,
  33.992852,
  131.258064,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字広瀬',
  '大字広瀬',
  '大字広瀬',
  NULL,
  34.002407,
  131.2384,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字瓜生野',
  '大字瓜生野',
  '大字瓜生野',
  NULL,
  34.049656,
  131.281696,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字芦河内',
  '大字芦河内',
  '大字芦河内',
  NULL,
  34.087076,
  131.271661,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763655,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_五十目山',
  '五十目山町',
  '五十目山町',
  NULL,
  33.936767,
  131.267896,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763664,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_松島',
  '松島町',
  '松島町',
  NULL,
  33.956322,
  131.244993,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_朝日',
  '朝日町',
  '朝日町',
  NULL,
  33.957225,
  131.246604,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_海南',
  '海南町',
  '海南町',
  NULL,
  33.958115,
  131.262737,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763687,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字際波',
  '大字際波',
  '大字際波',
  NULL,
  34.00695,
  131.213125,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763688,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西岐波',
  '大字西岐波',
  '大字西岐波',
  NULL,
  33.969316,
  131.30799,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字棚井',
  '大字棚井',
  '大字棚井',
  NULL,
  34.024616,
  131.23878,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763696,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉見',
  '大字吉見',
  '大字吉見',
  NULL,
  34.042592,
  131.257078,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新_quarter',
  '新町',
  '新町',
  NULL,
  33.949276,
  131.243712,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763700,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字川上',
  '大字川上',
  '大字川上',
  NULL,
  33.993031,
  131.273006,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字藤河内',
  '大字藤河内',
  '大字藤河内',
  NULL,
  34.074138,
  131.324226,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字沖宇部',
  '大字沖宇部',
  '大字沖宇部',
  NULL,
  33.930178,
  131.276265,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宮地',
  '宮地町',
  '宮地町',
  NULL,
  33.963311,
  131.255658,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_南中山',
  '南中山町',
  '南中山町',
  NULL,
  33.982254,
  131.237155,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678763709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中央',
  '中央町',
  '中央町',
  NULL,
  34.017719,
  131.862645,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西豊井',
  '大字西豊井',
  '大字西豊井',
  NULL,
  34.01401,
  131.873761,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字末武上',
  '大字末武上',
  '大字末武上',
  NULL,
  34.043716,
  131.869753,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字笠戸島',
  '大字笠戸島',
  '大字笠戸島',
  NULL,
  33.960021,
  131.854722,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字平田',
  '大字平田',
  '大字平田',
  NULL,
  34.01268,
  131.846881,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字瀬戸',
  '大字瀬戸',
  '大字瀬戸',
  NULL,
  34.0679,
  131.888941,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字来巻',
  '大字来巻',
  '大字来巻',
  NULL,
  34.01456,
  131.923474,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_若宮_quarter',
  '若宮町',
  '若宮町',
  NULL,
  34.022699,
  131.881784,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字生野屋',
  '大字生野屋',
  '大字生野屋',
  NULL,
  34.047097,
  131.887271,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_北斗',
  '北斗町',
  '北斗町',
  NULL,
  34.009986,
  131.869296,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字温見',
  '大字温見',
  '大字温見',
  NULL,
  34.078174,
  131.903288,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字末武下',
  '大字末武下',
  '大字末武下',
  NULL,
  34.012311,
  131.85747,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字切山',
  '大字切山',
  '大字切山',
  NULL,
  34.047705,
  131.923769,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8678765279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atojifukukami',
  '阿東地福上',
  '阿東地福上',
  '{"en":"Atojifukukami"}'::jsonb,
  34.3701313,
  131.6717863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8727014380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atotokusanaka',
  '阿東徳佐中',
  '阿東徳佐中',
  '{"en":"Atotokusanaka"}'::jsonb,
  34.4059714,
  131.7332089,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8738285154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atotokusakami',
  '阿東徳佐上',
  '阿東徳佐上',
  '{"en":"Atotokusakami"}'::jsonb,
  34.4165575,
  131.7445493,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8738517229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorienzanishicho',
  '小郡円座西町',
  '小郡円座西町',
  '{"en":"Ogorienzanishicho"}'::jsonb,
  34.114727,
  131.3872737,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8770652886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorienzahigashicho',
  '小郡円座東町',
  '小郡円座東町',
  '{"en":"Ogorienzahigashicho"}'::jsonb,
  34.1136389,
  131.3900457,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8770652887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorikamigo',
  '小郡上郷',
  '小郡上郷',
  '{"en":"Ogorikamigo"}'::jsonb,
  34.1336625,
  131.3986194,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8770667236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorihikarigaoka',
  '小郡光が丘',
  '小郡光が丘',
  '{"en":"Ogorihikarigaoka"}'::jsonb,
  34.1244617,
  131.3976753,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8770667238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorikazenooka',
  '小郡かぜの丘',
  '小郡かぜの丘',
  '{"en":"Ogorikazenooka"}'::jsonb,
  34.1235514,
  131.4026105,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8770667239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorimana',
  '小郡真名',
  '小郡真名',
  '{"en":"Ogorimana"}'::jsonb,
  34.1330764,
  131.3755846,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8787693731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hishima',
  '肥島',
  'ひしま',
  '{"en":"Hishima"}'::jsonb,
  34.48473,
  131.379666,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8851952894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hajima',
  '羽島',
  'はじま',
  '{"en":"Hajima"}'::jsonb,
  34.464396,
  131.377007,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8851952895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_oshima_quarter',
  '尾島',
  'おしま',
  '{"en":"Oshima"}'::jsonb,
  34.500906,
  131.342181,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8851952896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorishimogo',
  '小郡下郷',
  '小郡下郷',
  '{"en":"Ogorishimogo"}'::jsonb,
  34.1067145,
  131.3871503,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  8864951111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_幡生本',
  '幡生本町',
  '幡生本町',
  NULL,
  33.975313,
  130.926164,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_幡生新',
  '幡生新町',
  '幡生新町',
  NULL,
  33.976316,
  130.923058,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_羽山',
  '羽山町',
  '羽山町',
  NULL,
  33.970266,
  130.924029,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大坪本',
  '大坪本町',
  '大坪本町',
  NULL,
  33.97006,
  130.921118,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_幡生宮の下',
  '幡生宮の下町',
  '幡生宮の下町',
  NULL,
  33.98336,
  130.930931,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新垢田北',
  '新垢田北町',
  '新垢田北町',
  NULL,
  33.990987,
  130.912067,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田東',
  '山の田東町',
  '山の田東町',
  NULL,
  33.985626,
  130.928865,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ゆめタウン',
  'ゆめタウン',
  'ゆめタウン',
  NULL,
  34.029143,
  131.013051,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_武久西原台',
  '武久西原台',
  '武久西原台',
  NULL,
  33.986274,
  130.921509,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田南',
  '山の田南町',
  '山の田南町',
  NULL,
  33.985332,
  130.925779,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長州出島',
  '長州出島',
  '長州出島',
  NULL,
  33.989636,
  130.898124,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字阿内',
  '大字阿内',
  '大字阿内',
  NULL,
  34.088652,
  131.004323,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_吉見竜王',
  '吉見竜王町',
  '吉見竜王町',
  NULL,
  34.068596,
  130.905784,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_吉見古宿',
  '吉見古宿町',
  '吉見古宿町',
  NULL,
  34.06284,
  130.903147,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120495813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田本',
  '山の田本町',
  '山の田本町',
  NULL,
  33.98933,
  130.928548,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田西',
  '山の田西町',
  '山の田西町',
  NULL,
  33.988234,
  130.923345,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田中央',
  '山の田中央町',
  '山の田中央町',
  NULL,
  33.987575,
  130.926673,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の田北',
  '山の田北町',
  '山の田北町',
  NULL,
  33.991697,
  130.932559,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山の口',
  '山の口町',
  '山の口町',
  NULL,
  33.969731,
  130.936256,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_山手',
  '山手町',
  '山手町',
  NULL,
  33.959061,
  130.925333,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_元',
  '元町',
  '元町',
  NULL,
  33.965877,
  130.924646,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_名池',
  '名池町',
  '名池町',
  NULL,
  33.958222,
  130.937796,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_椋野上',
  '椋野上町',
  '椋野上町',
  NULL,
  33.975673,
  130.953599,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534141,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_向山',
  '向山町',
  '向山町',
  NULL,
  33.967099,
  130.926199,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534142,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_みもすそ川',
  'みもすそ川町',
  'みもすそ川町',
  NULL,
  33.968491,
  130.956992,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_三河',
  '三河町',
  '三河町',
  NULL,
  33.987193,
  130.942195,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_前勝谷',
  '前勝谷町',
  '前勝谷町',
  NULL,
  34.00649,
  130.964929,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字矢玉',
  '豊北町大字矢玉',
  '豊北町大字矢玉',
  NULL,
  34.274918,
  130.888522,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534173,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字角島',
  '豊北町大字角島',
  '豊北町大字角島',
  NULL,
  34.354968,
  130.859718,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534174,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字田耕',
  '豊北町大字田耕',
  '豊北町大字田耕',
  NULL,
  34.269528,
  130.988175,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字滝部',
  '豊北町大字滝部',
  '豊北町大字滝部',
  NULL,
  34.295853,
  130.946241,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字北宇賀',
  '豊北町大字北宇賀',
  '豊北町大字北宇賀',
  NULL,
  34.243118,
  130.951938,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534177,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字神田上',
  '豊北町大字神田上',
  '豊北町大字神田上',
  NULL,
  34.281659,
  130.900956,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字神田',
  '豊北町大字神田',
  '豊北町大字神田',
  NULL,
  34.328149,
  130.901143,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字粟野',
  '豊北町大字粟野',
  '豊北町大字粟野',
  NULL,
  34.330068,
  130.986765,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊北町大字阿川',
  '豊北町大字阿川',
  '豊北町大字阿川',
  NULL,
  34.32949,
  130.929704,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534181,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_藤附',
  '藤附町',
  '藤附町',
  NULL,
  33.965495,
  130.921521,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_藤ケ谷',
  '藤ケ谷町',
  '藤ケ谷町',
  NULL,
  33.98127,
  130.955738,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島緑',
  '彦島緑町',
  '彦島緑町',
  NULL,
  33.932047,
  130.908657,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534193,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島弟子待東',
  '彦島弟子待東町',
  '彦島弟子待東町',
  NULL,
  33.928566,
  130.924307,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島竹ノ子島',
  '彦島竹ノ子島町',
  '彦島竹ノ子島町',
  NULL,
  33.951386,
  130.877496,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島桜ケ丘',
  '彦島桜ケ丘町',
  '彦島桜ケ丘町',
  NULL,
  33.921496,
  130.922829,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島老の山公園',
  '彦島老の山公園',
  '彦島老の山公園',
  NULL,
  33.947957,
  130.903536,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_彦島海士郷',
  '彦島海士郷町',
  '彦島海士郷町',
  NULL,
  33.95157,
  130.914974,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東向山',
  '東向山町',
  '東向山町',
  NULL,
  33.966114,
  130.927644,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東勝谷',
  '東勝谷',
  '東勝谷',
  NULL,
  34.001784,
  130.97307,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東観音',
  '東観音町',
  '東観音町',
  NULL,
  34.047152,
  131.008571,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東神田',
  '東神田町',
  '東神田町',
  NULL,
  33.961011,
  130.926601,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_稗田南',
  '稗田南町',
  '稗田南町',
  NULL,
  33.991449,
  130.929655,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_稗田西',
  '稗田西町',
  '稗田西町',
  NULL,
  33.999156,
  130.927424,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_稗田中',
  '稗田中町',
  '稗田中町',
  NULL,
  33.995481,
  130.927827,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_稗田',
  '稗田町',
  '稗田町',
  NULL,
  33.994535,
  130.931114,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534255,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_稗田北',
  '稗田北町',
  '稗田北町',
  NULL,
  33.996452,
  130.931754,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534256,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岬之',
  '岬之町',
  '岬之町',
  NULL,
  33.951571,
  130.935162,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西観音',
  '西観音町',
  '西観音町',
  NULL,
  34.04736,
  131.003055,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西神田',
  '西神田町',
  '西神田町',
  NULL,
  33.960129,
  130.923608,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_南部',
  '南部町',
  '南部町',
  NULL,
  33.955763,
  130.940383,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中之',
  '中之町',
  '中之町',
  NULL,
  33.958166,
  130.945306,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字矢田',
  '豊田町大字矢田',
  '豊田町大字矢田',
  NULL,
  34.202244,
  131.070797,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字八道',
  '豊田町大字八道',
  '豊田町大字八道',
  NULL,
  34.218344,
  131.059997,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字杢路子',
  '豊田町大字杢路子',
  '豊田町大字杢路子',
  NULL,
  34.216146,
  131.001653,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字日野',
  '豊田町大字日野',
  '豊田町大字日野',
  NULL,
  34.174688,
  131.081706,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字東長野',
  '豊田町大字東長野',
  '豊田町大字東長野',
  NULL,
  34.168274,
  131.061996,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字萩原',
  '豊田町大字萩原',
  '豊田町大字萩原',
  NULL,
  34.159533,
  131.083488,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字庭田',
  '豊田町大字庭田',
  '豊田町大字庭田',
  NULL,
  34.201046,
  131.057897,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字西長野',
  '豊田町大字西長野',
  '豊田町大字西長野',
  NULL,
  34.171474,
  131.055081,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字西',
  '豊田町大字西市',
  '豊田町大字西市',
  NULL,
  34.202335,
  131.075424,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字楢原',
  '豊田町大字楢原',
  '豊田町大字楢原',
  NULL,
  34.21306,
  131.089122,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字中',
  '豊田町大字中村',
  '豊田町大字中村',
  NULL,
  34.191704,
  131.07184,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字殿敷',
  '豊田町大字殿敷',
  '豊田町大字殿敷',
  NULL,
  34.19371,
  131.091911,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字殿居',
  '豊田町大字殿居',
  '豊田町大字殿居',
  NULL,
  34.266252,
  131.029833,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字手洗',
  '豊田町大字手洗',
  '豊田町大字手洗',
  NULL,
  34.178894,
  131.06687,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字高山',
  '豊田町大字高山',
  '豊田町大字高山',
  NULL,
  34.16947,
  131.073104,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字鷹子',
  '豊田町大字鷹子',
  '豊田町大字鷹子',
  NULL,
  34.206037,
  131.03923,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字地吉',
  '豊田町大字地吉',
  '豊田町大字地吉',
  NULL,
  34.25156,
  131.118632,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字佐野',
  '豊田町大字佐野',
  '豊田町大字佐野',
  NULL,
  34.264336,
  131.046997,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字金道',
  '豊田町大字金道',
  '豊田町大字金道',
  NULL,
  34.226804,
  131.068506,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字城戸',
  '豊田町大字城戸',
  '豊田町大字城戸',
  NULL,
  34.156304,
  131.065395,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字大河内',
  '豊田町大字大河内',
  '豊田町大字大河内',
  NULL,
  34.225927,
  131.121628,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字江良',
  '豊田町大字江良',
  '豊田町大字江良',
  NULL,
  34.180025,
  131.04404,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534294,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字宇内',
  '豊田町大字宇内',
  '豊田町大字宇内',
  NULL,
  34.239545,
  131.076311,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字浮石',
  '豊田町大字浮石',
  '豊田町大字浮石',
  NULL,
  34.241202,
  131.049311,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字今出',
  '豊田町大字今出',
  '豊田町大字今出',
  NULL,
  34.248732,
  131.149384,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字稲光',
  '豊田町大字稲光',
  '豊田町大字稲光',
  NULL,
  34.182599,
  131.083458,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字稲見',
  '豊田町大字稲見',
  '豊田町大字稲見',
  NULL,
  34.24648,
  131.092779,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字一ノ俣',
  '豊田町大字一ノ俣',
  '豊田町大字一ノ俣',
  NULL,
  34.283486,
  131.05762,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字荒木',
  '豊田町大字荒木',
  '豊田町大字荒木',
  NULL,
  34.254291,
  131.047742,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊田町大字阿座上',
  '豊田町大字阿座上',
  '豊田町大字阿座上',
  NULL,
  34.193085,
  131.056749,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町豊洋台新',
  '豊浦町豊洋台新町',
  '豊浦町豊洋台新町',
  NULL,
  34.118957,
  130.910983,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字涌田後地',
  '豊浦町大字涌田後地',
  '豊浦町大字涌田後地',
  NULL,
  34.148394,
  130.907792,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字吉永',
  '豊浦町大字吉永',
  '豊浦町大字吉永',
  NULL,
  34.129701,
  130.925863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字室津下',
  '豊浦町大字室津下',
  '豊浦町大字室津下',
  NULL,
  34.13243,
  130.881898,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字室津上',
  '豊浦町大字室津上',
  '豊浦町大字室津上',
  NULL,
  34.117468,
  130.880802,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字小串',
  '豊浦町大字小串',
  '豊浦町大字小串',
  NULL,
  34.176768,
  130.937634,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字黒井',
  '豊浦町大字黒井',
  '豊浦町大字黒井',
  NULL,
  34.119259,
  130.920681,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字川棚',
  '豊浦町大字川棚',
  '豊浦町大字川棚',
  NULL,
  34.16809,
  130.957235,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字宇賀',
  '豊浦町大字宇賀',
  '豊浦町大字宇賀',
  NULL,
  34.217779,
  130.938231,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_豊浦町大字厚母郷',
  '豊浦町大字厚母郷',
  '豊浦町大字厚母郷',
  NULL,
  34.110442,
  130.903197,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府八幡',
  '長府八幡町',
  '長府八幡町',
  NULL,
  34.009341,
  130.993877,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府向田',
  '長府向田町',
  '長府向田町',
  NULL,
  33.981857,
  130.975537,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府宮の内',
  '長府宮の内町',
  '長府宮の内町',
  NULL,
  33.999635,
  130.98573,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534323,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府宮崎',
  '長府宮崎町',
  '長府宮崎町',
  NULL,
  33.991375,
  130.993487,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府南之',
  '長府南之町',
  '長府南之町',
  NULL,
  33.997144,
  130.989286,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534325,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府港',
  '長府港町',
  '長府港町',
  NULL,
  34.006675,
  130.997714,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534326,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府三島',
  '長府三島町',
  '長府三島町',
  NULL,
  34.005674,
  130.985816,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534327,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府満珠',
  '長府満珠町',
  '長府満珠町',
  NULL,
  34.013787,
  130.988386,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534328,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府満珠新',
  '長府満珠新町',
  '長府満珠新町',
  NULL,
  34.012783,
  130.98418,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534329,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松原',
  '長府松原町',
  '長府松原町',
  NULL,
  33.993247,
  130.990134,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田南',
  '長府松小田南町',
  '長府松小田南町',
  NULL,
  34.016016,
  130.996408,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田本',
  '長府松小田本町',
  '長府松小田本町',
  NULL,
  34.017585,
  130.999499,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田東',
  '長府松小田東町',
  '長府松小田東町',
  NULL,
  34.019205,
  131.00314,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田西',
  '長府松小田西町',
  '長府松小田西町',
  NULL,
  34.01749,
  130.988973,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田中',
  '長府松小田中町',
  '長府松小田中町',
  NULL,
  34.019068,
  130.99433,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534335,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府松小田北',
  '長府松小田北町',
  '長府松小田北町',
  NULL,
  34.022134,
  130.997916,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府前八幡',
  '長府前八幡町',
  '長府前八幡町',
  NULL,
  34.007643,
  130.993414,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府豊城',
  '長府豊城町',
  '長府豊城町',
  NULL,
  34.01443,
  130.989947,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府古江小路',
  '長府古江小路町',
  '長府古江小路町',
  NULL,
  33.99825,
  130.985662,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534339,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府日の出',
  '長府日の出町',
  '長府日の出町',
  NULL,
  34.015127,
  130.993785,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府東侍',
  '長府東侍町',
  '長府東侍町',
  NULL,
  33.994879,
  130.992249,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534341,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府浜浦南',
  '長府浜浦南町',
  '長府浜浦南町',
  NULL,
  33.980383,
  130.977591,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534342,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府浜浦西',
  '長府浜浦西町',
  '長府浜浦西町',
  NULL,
  33.986509,
  130.978416,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534343,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府浜浦',
  '長府浜浦町',
  '長府浜浦町',
  NULL,
  33.983308,
  130.979879,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534344,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府羽衣南',
  '長府羽衣南町',
  '長府羽衣南町',
  NULL,
  33.989244,
  130.985296,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府羽衣',
  '長府羽衣町',
  '長府羽衣町',
  NULL,
  33.989683,
  130.987105,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府野久留米',
  '長府野久留米町',
  '長府野久留米町',
  NULL,
  33.990859,
  130.979734,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534347,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中六波',
  '長府中六波町',
  '長府中六波町',
  NULL,
  34.012739,
  130.992212,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534348,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中浜',
  '長府中浜町',
  '長府中浜町',
  NULL,
  33.998228,
  130.989329,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中之',
  '長府中之町',
  '長府中之町',
  NULL,
  34.000363,
  130.990061,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中土居本',
  '長府中土居本町',
  '長府中土居本町',
  NULL,
  34.006158,
  130.989871,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中土居北',
  '長府中土居北町',
  '長府中土居北町',
  NULL,
  34.007614,
  130.987849,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534352,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府中尾',
  '長府中尾町',
  '長府中尾町',
  NULL,
  34.009277,
  130.986403,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府豊浦',
  '長府豊浦町',
  '長府豊浦町',
  NULL,
  34.010314,
  130.989083,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府土居の内',
  '長府土居の内町',
  '長府土居の内町',
  NULL,
  33.999194,
  130.989662,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府珠の浦',
  '長府珠の浦町',
  '長府珠の浦町',
  NULL,
  34.007502,
  130.978398,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府高場',
  '長府高場町',
  '長府高場町',
  NULL,
  33.978772,
  130.976913,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府外浦',
  '長府外浦町',
  '長府外浦町',
  NULL,
  33.987832,
  130.991804,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府惣社',
  '長府惣社町',
  '長府惣社町',
  NULL,
  33.997194,
  130.985528,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府新松原',
  '長府新松原町',
  '長府新松原町',
  NULL,
  33.992316,
  130.988805,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府新四王司',
  '長府新四王司町',
  '長府新四王司町',
  NULL,
  34.018854,
  130.983673,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府四王司',
  '長府四王司町',
  '長府四王司町',
  NULL,
  34.018754,
  130.985998,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府紺屋',
  '長府紺屋町',
  '長府紺屋町',
  NULL,
  34.001666,
  130.986024,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534366,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府古城',
  '長府古城町',
  '長府古城町',
  NULL,
  34.011045,
  130.992795,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府黒門南',
  '長府黒門南町',
  '長府黒門南町',
  NULL,
  33.986133,
  130.986815,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534368,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府黒門東',
  '長府黒門東町',
  '長府黒門東町',
  NULL,
  33.989998,
  130.989613,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534369,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府黒門',
  '長府黒門町',
  '長府黒門町',
  NULL,
  33.984613,
  130.9841,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534370,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府金屋浜',
  '長府金屋浜町',
  '長府金屋浜町',
  NULL,
  34.001945,
  130.99128,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府金屋',
  '長府金屋町',
  '長府金屋町',
  NULL,
  34.002332,
  130.989994,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府逢坂',
  '長府逢坂町',
  '長府逢坂町',
  NULL,
  33.998544,
  130.979805,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534377,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府扇',
  '長府扇町',
  '長府扇町',
  NULL,
  34.018592,
  131.013276,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府江下',
  '長府江下町',
  '長府江下町',
  NULL,
  34.012376,
  130.996005,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長府印内',
  '長府印内町',
  '長府印内町',
  NULL,
  34.004839,
  130.992081,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中央_quarter',
  '中央町',
  '中央町',
  NULL,
  33.961432,
  130.928602,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_千鳥浜',
  '千鳥浜町',
  '千鳥浜町',
  NULL,
  34.036162,
  131.02016,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_千鳥ケ丘',
  '千鳥ケ丘町',
  '千鳥ケ丘町',
  NULL,
  34.032695,
  131.006576,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_壇之浦',
  '壇之浦町',
  '壇之浦町',
  NULL,
  33.962798,
  130.953519,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_田中',
  '田中町',
  '田中町',
  NULL,
  33.959754,
  130.941045,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宝',
  '宝町',
  '宝町',
  NULL,
  33.982176,
  130.939673,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大平',
  '大平町',
  '大平町',
  NULL,
  33.963947,
  130.918878,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_汐入',
  '汐入町',
  '汐入町',
  NULL,
  33.973522,
  130.916926,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534414,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_笹山',
  '笹山町',
  '笹山町',
  NULL,
  33.953424,
  130.927526,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534415,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_桜山',
  '桜山町',
  '桜山町',
  NULL,
  33.960753,
  130.922,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_栄_quarter',
  '栄町',
  '栄町',
  NULL,
  33.965799,
  130.928728,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_幸_quarter',
  '幸町',
  '幸町',
  NULL,
  33.961889,
  130.94355,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_金比羅',
  '金比羅町',
  '金比羅町',
  NULL,
  33.968884,
  130.916361,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_工領開作',
  '工領開作',
  '工領開作',
  NULL,
  34.041596,
  131.064788,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_熊野西',
  '熊野西町',
  '熊野西町',
  NULL,
  33.995416,
  130.942971,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清末本',
  '清末本町',
  '清末本町',
  NULL,
  34.059595,
  131.022475,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清末大門',
  '清末大門',
  '清末大門',
  NULL,
  34.061714,
  131.015663,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清末陣屋',
  '清末陣屋',
  '清末陣屋',
  NULL,
  34.066396,
  131.021315,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字吉賀',
  '菊川町大字吉賀',
  '菊川町大字吉賀',
  NULL,
  34.129854,
  131.015007,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字樅ノ木',
  '菊川町大字樅ノ木',
  '菊川町大字樅ノ木',
  NULL,
  34.143677,
  131.076441,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字道',
  '菊川町大字道市',
  '菊川町大字道市',
  NULL,
  34.133282,
  131.076197,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字東中山',
  '菊川町大字東中山',
  '菊川町大字東中山',
  NULL,
  34.146178,
  131.058509,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字日新',
  '菊川町大字日新',
  '菊川町大字日新',
  NULL,
  34.126773,
  130.981489,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字西中山',
  '菊川町大字西中山',
  '菊川町大字西中山',
  NULL,
  34.15204,
  131.03656,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字楢崎',
  '菊川町大字楢崎',
  '菊川町大字楢崎',
  NULL,
  34.137213,
  130.995167,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字七見',
  '菊川町大字七見',
  '菊川町大字七見',
  NULL,
  34.109898,
  131.006642,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字田部',
  '菊川町大字田部',
  '菊川町大字田部',
  NULL,
  34.108873,
  131.038406,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字下保木',
  '菊川町大字下保木',
  '菊川町大字下保木',
  NULL,
  34.116826,
  131.060799,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字下岡枝',
  '菊川町大字下岡枝',
  '菊川町大字下岡枝',
  NULL,
  34.133573,
  131.036055,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字下大野',
  '菊川町大字下大野',
  '菊川町大字下大野',
  NULL,
  34.097025,
  131.051483,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字久野',
  '菊川町大字久野',
  '菊川町大字久野',
  NULL,
  34.149458,
  130.967415,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字轡井',
  '菊川町大字轡井',
  '菊川町大字轡井',
  NULL,
  34.118687,
  131.081307,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字貴飯',
  '菊川町大字貴飯',
  '菊川町大字貴飯',
  NULL,
  34.160489,
  130.998257,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字上保木',
  '菊川町大字上保木',
  '菊川町大字上保木',
  NULL,
  34.132077,
  131.047478,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字上田部',
  '菊川町大字上田部',
  '菊川町大字上田部',
  NULL,
  34.102438,
  131.023622,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字上岡枝',
  '菊川町大字上岡枝',
  '菊川町大字上岡枝',
  NULL,
  34.158269,
  131.020741,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_菊川町大字上大野',
  '菊川町大字上大野',
  '菊川町大字上大野',
  NULL,
  34.111851,
  131.05039,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_観音崎',
  '観音崎町',
  '観音崎町',
  NULL,
  33.952984,
  130.938233,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_川中本',
  '川中本町',
  '川中本町',
  NULL,
  34.000331,
  130.930689,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_唐戸',
  '唐戸町',
  '唐戸町',
  NULL,
  33.957118,
  130.943434,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_亀浜',
  '亀浜町',
  '亀浜町',
  NULL,
  34.032161,
  131.016094,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_形山みどり',
  '形山みどり町',
  '形山みどり町',
  NULL,
  34.01589,
  130.955159,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_形山',
  '形山町',
  '形山町',
  NULL,
  34.016068,
  130.958643,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_春日',
  '春日町',
  '春日町',
  NULL,
  33.959495,
  130.929237,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_卸新',
  '卸新町',
  '卸新町',
  NULL,
  33.98549,
  130.949681,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月宮の',
  '小月宮の町',
  '小月宮の町',
  NULL,
  34.073291,
  131.039566,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月南',
  '小月南町',
  '小月南町',
  NULL,
  34.060246,
  131.037634,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月西の台',
  '小月西の台',
  '小月西の台',
  NULL,
  34.069285,
  131.043223,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月高雄',
  '小月高雄町',
  '小月高雄町',
  NULL,
  34.073858,
  131.043282,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月幸',
  '小月幸町',
  '小月幸町',
  NULL,
  34.077841,
  131.034953,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月公園',
  '小月公園町',
  '小月公園町',
  NULL,
  34.072466,
  131.031601,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月京泊',
  '小月京泊',
  '小月京泊',
  NULL,
  34.070465,
  131.045542,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小月市原',
  '小月市原町',
  '小月市原町',
  NULL,
  34.076297,
  131.032053,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉母',
  '大字吉母',
  '大字吉母',
  NULL,
  34.100339,
  130.881069,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉見下',
  '大字吉見下',
  '大字吉見下',
  NULL,
  34.066345,
  130.921249,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉見上',
  '大字吉見上',
  '大字吉見上',
  NULL,
  34.088929,
  130.920117,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉田地方',
  '大字吉田地方',
  '大字吉田地方',
  NULL,
  34.092837,
  131.088183,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字吉田',
  '大字吉田',
  '大字吉田',
  NULL,
  34.088898,
  131.063247,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字横野',
  '大字横野',
  '大字横野',
  NULL,
  34.03598,
  130.916415,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字山田_quarter',
  '大字山田',
  '大字山田',
  NULL,
  34.059711,
  130.993167,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字安岡',
  '大字安岡',
  '大字安岡',
  NULL,
  34.035868,
  130.930696,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字六連島',
  '大字六連島',
  '大字六連島',
  NULL,
  33.975601,
  130.863248,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字椋野',
  '大字椋野',
  '大字椋野',
  NULL,
  33.974734,
  130.957802,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字松屋',
  '大字松屋',
  '大字松屋',
  NULL,
  34.059119,
  131.071199,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字松小田',
  '大字松小田',
  '大字松小田',
  NULL,
  34.024734,
  130.991319,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字前田',
  '大字前田',
  '大字前田',
  NULL,
  33.976876,
  130.971041,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字藤ケ谷',
  '大字藤ケ谷',
  '大字藤ケ谷',
  NULL,
  33.982615,
  130.959557,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字福江',
  '大字福江',
  '大字福江',
  NULL,
  34.048143,
  130.924378,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字彦島',
  '大字彦島',
  '大字彦島',
  NULL,
  33.933414,
  130.929827,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字延行',
  '大字延行',
  '大字延行',
  NULL,
  34.013435,
  130.939793,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字永田郷',
  '大字永田郷',
  '大字永田郷',
  NULL,
  34.088144,
  130.896624,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字豊浦',
  '大字豊浦村',
  '大字豊浦村',
  NULL,
  33.995586,
  130.977073,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字冨任',
  '大字冨任',
  '大字冨任',
  NULL,
  34.019385,
  130.931107,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字田倉',
  '大字田倉',
  '大字田倉',
  NULL,
  34.021546,
  130.971838,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字高畑',
  '大字高畑',
  '大字高畑',
  NULL,
  33.98653,
  130.968113,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字勝谷',
  '大字勝谷',
  '大字勝谷',
  NULL,
  34.016531,
  130.979955,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字才川',
  '大字才川',
  '大字才川',
  NULL,
  34.030964,
  130.997334,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字楠乃',
  '大字楠乃',
  '大字楠乃',
  NULL,
  33.992229,
  130.961852,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字清末',
  '大字清末',
  '大字清末',
  NULL,
  34.073196,
  131.018278,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字蒲生野',
  '大字蒲生野',
  '大字蒲生野',
  NULL,
  34.0427,
  130.941012,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字形山',
  '大字形山',
  '大字形山',
  NULL,
  34.019507,
  130.960422,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字員光',
  '大字員光',
  '大字員光',
  NULL,
  34.043077,
  130.992189,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小野_quarter',
  '大字小野',
  '大字小野',
  NULL,
  34.044049,
  130.956432,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小月',
  '大字小月町',
  '大字小月町',
  NULL,
  34.087323,
  131.035756,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字宇部',
  '大字宇部',
  '大字宇部',
  NULL,
  34.04041,
  131.005774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534576,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字内日下',
  '大字内日下',
  '大字内日下',
  NULL,
  34.10275,
  130.967504,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字内日上',
  '大字内日上',
  '大字内日上',
  NULL,
  34.08919,
  130.948705,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字宇津井',
  '大字宇津井',
  '大字宇津井',
  NULL,
  34.070321,
  131.0686,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字植田',
  '大字植田',
  '大字植田',
  NULL,
  34.103908,
  130.981743,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字井田',
  '大字井田',
  '大字井田',
  NULL,
  34.056287,
  130.971907,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字石原',
  '大字石原',
  '大字石原',
  NULL,
  34.020677,
  130.952103,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字伊倉',
  '大字伊倉',
  '大字伊倉',
  NULL,
  34.001163,
  130.94103,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字有冨',
  '大字有冨',
  '大字有冨',
  NULL,
  34.018245,
  130.945502,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字綾羅木',
  '大字綾羅木',
  '大字綾羅木',
  NULL,
  34.013146,
  130.930164,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字秋根',
  '大字秋根',
  '大字秋根',
  NULL,
  34.011666,
  130.963179,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字垢田',
  '大字垢田',
  '大字垢田',
  NULL,
  33.996817,
  130.91325,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_王司南',
  '王司南町',
  '王司南町',
  NULL,
  34.032505,
  131.012571,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_入江',
  '入江町',
  '入江町',
  NULL,
  33.95403,
  130.93523,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_一の宮学園',
  '一の宮学園町',
  '一の宮学園町',
  NULL,
  33.999491,
  130.947946,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_一の宮卸本',
  '一の宮卸本町',
  '一の宮卸本町',
  NULL,
  33.989077,
  130.94863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534637,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_石神',
  '石神町',
  '石神町',
  NULL,
  33.97386,
  130.938465,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊倉本',
  '伊倉本町',
  '伊倉本町',
  NULL,
  34.00342,
  130.93568,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534639,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊倉東',
  '伊倉東町',
  '伊倉東町',
  NULL,
  34.005495,
  130.943731,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_あるかぽーと',
  'あるかぽーと',
  'あるかぽーと',
  NULL,
  33.95349,
  130.941213,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534651,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_阿弥陀寺',
  '阿弥陀寺町',
  '阿弥陀寺町',
  NULL,
  33.959369,
  130.948383,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534668,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_秋根東',
  '秋根東町',
  '秋根東町',
  NULL,
  34.010726,
  130.954617,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_秋根新',
  '秋根新町',
  '秋根新町',
  NULL,
  34.011829,
  130.948328,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_秋根北',
  '秋根北町',
  '秋根北町',
  NULL,
  34.01412,
  130.95219,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534677,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_赤間',
  '赤間町',
  '赤間町',
  NULL,
  33.959339,
  130.943753,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534681,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_赤池',
  '赤池町',
  '赤池町',
  NULL,
  34.059673,
  131.011382,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9120534684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_六呂師',
  '六呂師',
  '六呂師',
  NULL,
  34.102397,
  132.163904,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_行正',
  '行正',
  '行正',
  NULL,
  34.148771,
  132.108972,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_由宇町由宇崎',
  '由宇町由宇崎',
  '由宇町由宇崎',
  NULL,
  34.036742,
  132.216357,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_由宇町神東',
  '由宇町神東',
  '由宇町神東',
  NULL,
  34.002798,
  132.203967,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_由宇',
  '由宇町',
  '由宇町',
  NULL,
  34.035921,
  132.176929,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_持国',
  '持国',
  '持国',
  NULL,
  34.167764,
  132.138725,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町百合谷',
  '美和町百合谷',
  '美和町百合谷',
  NULL,
  34.230203,
  132.145191,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町日宛',
  '美和町日宛',
  '美和町日宛',
  NULL,
  34.20884,
  132.118468,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町西畑',
  '美和町西畑',
  '美和町西畑',
  NULL,
  34.211612,
  132.066131,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町滑',
  '美和町滑',
  '美和町滑',
  NULL,
  34.235242,
  132.123134,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町長谷',
  '美和町長谷',
  '美和町長谷',
  NULL,
  34.212478,
  132.144388,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町中垣内',
  '美和町中垣内',
  '美和町中垣内',
  NULL,
  34.240746,
  132.123916,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町田ノ口',
  '美和町田ノ口',
  '美和町田ノ口',
  NULL,
  34.242661,
  132.103028,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353811,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町瀬戸ノ内',
  '美和町瀬戸ノ内',
  '美和町瀬戸ノ内',
  NULL,
  34.249995,
  132.115304,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町下畑',
  '美和町下畑',
  '美和町下畑',
  NULL,
  34.234772,
  132.057829,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町渋前',
  '美和町渋前',
  '美和町渋前',
  NULL,
  34.218583,
  132.093811,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353814,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町佐坂',
  '美和町佐坂',
  '美和町佐坂',
  NULL,
  34.228626,
  132.113425,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町黒沢',
  '美和町黒沢',
  '美和町黒沢',
  NULL,
  34.240267,
  132.128947,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128353816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_和田',
  '和田町',
  '和田町',
  NULL,
  33.983793,
  131.927408,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積松原',
  '室積松原',
  '室積松原',
  NULL,
  33.936261,
  131.968803,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積正木',
  '室積正木',
  '室積正木',
  NULL,
  33.936857,
  131.971242,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積東ノ庄',
  '室積東ノ庄',
  '室積東ノ庄',
  NULL,
  33.930261,
  131.981661,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積西ノ庄',
  '室積西ノ庄',
  '室積西ノ庄',
  NULL,
  33.936783,
  131.976231,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積中央',
  '室積中央町',
  '室積中央町',
  NULL,
  33.934142,
  131.972337,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積神田',
  '室積神田',
  '室積神田',
  NULL,
  33.931978,
  131.976964,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積沖田',
  '室積沖田',
  '室積沖田',
  NULL,
  33.933649,
  131.975636,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積大',
  '室積大町',
  '室積大町',
  NULL,
  33.939206,
  131.970662,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_室積市延',
  '室積市延',
  '室積市延',
  NULL,
  33.934514,
  131.979073,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宮ノ下',
  '宮ノ下町',
  '宮ノ下町',
  NULL,
  33.981841,
  131.930209,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_丸山',
  '丸山町',
  '丸山町',
  NULL,
  33.988351,
  131.925073,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_光ケ丘',
  '光ケ丘',
  '光ケ丘',
  NULL,
  33.97974,
  131.921803,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中',
  '中村町',
  '中村町',
  NULL,
  33.977414,
  131.918478,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宝_quarter',
  '宝町',
  '宝町',
  NULL,
  33.987412,
  131.928297,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128383512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町北中山',
  '美和町北中山',
  '美和町北中山',
  NULL,
  34.296122,
  132.099857,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町岸根',
  '美和町岸根',
  '美和町岸根',
  NULL,
  34.247914,
  132.134554,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町上駄床',
  '美和町上駄床',
  '美和町上駄床',
  NULL,
  34.264207,
  132.112668,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町釜ヶ原',
  '美和町釜ヶ原',
  '美和町釜ヶ原',
  NULL,
  34.294384,
  132.122103,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町大根川',
  '美和町大根川',
  '美和町大根川',
  NULL,
  34.229029,
  132.127614,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町生見',
  '美和町生見',
  '美和町生見',
  NULL,
  34.247898,
  132.086368,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町秋掛',
  '美和町秋掛',
  '美和町秋掛',
  NULL,
  34.321894,
  132.084251,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和町阿賀',
  '美和町阿賀',
  '美和町阿賀',
  NULL,
  34.2893,
  132.068508,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_御庄',
  '御庄',
  '御庄',
  NULL,
  34.159892,
  132.155697,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388040,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美川町根笠',
  '美川町根笠',
  '美川町根笠',
  NULL,
  34.178858,
  131.997547,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388041,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美川町小川',
  '美川町小川',
  '美川町小川',
  NULL,
  34.2422,
  132.007372,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本郷町本谷',
  '本郷町本谷',
  '本郷町本谷',
  NULL,
  34.328038,
  132.044808,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本郷町本郷',
  '本郷町本郷',
  '本郷町本郷',
  NULL,
  34.290528,
  132.043276,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本郷町波野',
  '本郷町波野',
  '本郷町波野',
  NULL,
  34.258759,
  132.032052,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本郷町西黒沢',
  '本郷町西黒沢',
  '本郷町西黒沢',
  NULL,
  34.320306,
  132.016077,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本郷町宇塚',
  '本郷町宇塚',
  '本郷町宇塚',
  NULL,
  34.304814,
  132.023092,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_二鹿',
  '二鹿',
  '二鹿',
  NULL,
  34.158367,
  132.044036,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_日の出',
  '日の出町',
  '日の出町',
  NULL,
  34.166803,
  132.238598,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_土生',
  '土生',
  '土生',
  NULL,
  34.152525,
  132.099399,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柱野',
  '柱野',
  '柱野',
  NULL,
  34.131181,
  132.150615,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柱島',
  '柱島',
  '柱島',
  NULL,
  34.020553,
  132.412355,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388075,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町広瀬',
  '錦町広瀬',
  '錦町広瀬',
  NULL,
  34.274346,
  131.92182,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町須川',
  '錦町須川',
  '錦町須川',
  NULL,
  34.34438,
  132.005457,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_錦町大野',
  '錦町大野',
  '錦町大野',
  NULL,
  34.311036,
  131.932794,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_灘',
  '灘町',
  '灘町',
  NULL,
  34.128961,
  132.206488,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長野',
  '長野',
  '長野',
  NULL,
  34.056336,
  132.194303,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_寺山',
  '寺山',
  '寺山',
  NULL,
  34.156191,
  132.120481,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388092,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_通津',
  '通津',
  '通津',
  NULL,
  34.073696,
  132.182036,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_近延',
  '近延',
  '近延',
  NULL,
  34.139661,
  132.119879,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388094,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_田原',
  '田原',
  '田原',
  NULL,
  34.173211,
  132.143347,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388095,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_多田',
  '多田',
  '多田',
  NULL,
  34.182306,
  132.155499,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388103,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_関戸',
  '関戸',
  '関戸',
  NULL,
  34.18707,
  132.178119,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388105,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町用田',
  '周東町用田',
  '周東町用田',
  NULL,
  34.068144,
  132.059926,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町西長野',
  '周東町西長野',
  '周東町西長野',
  NULL,
  34.091099,
  132.00167,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町中山',
  '周東町中山',
  '周東町中山',
  NULL,
  34.034722,
  132.039206,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町田尻',
  '周東町田尻',
  '周東町田尻',
  NULL,
  34.034431,
  132.070974,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町祖生',
  '周東町祖生',
  '周東町祖生',
  NULL,
  34.068265,
  132.115627,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町差川',
  '周東町差川',
  '周東町差川',
  NULL,
  34.075877,
  132.016284,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町川上',
  '周東町川上',
  '周東町川上',
  NULL,
  34.1168,
  132.045342,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町上久原_quarter',
  '周東町上久原',
  '周東町上久原',
  NULL,
  34.071692,
  132.071373,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_周東町明見谷',
  '周東町明見谷',
  '周東町明見谷',
  NULL,
  34.13417,
  132.035921,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_守内',
  '守内',
  '守内',
  NULL,
  34.172086,
  132.133193,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_叶木',
  '叶木',
  '叶木',
  NULL,
  34.100648,
  132.138546,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小瀬',
  '小瀬',
  '小瀬',
  NULL,
  34.212512,
  132.177558,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388158,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大谷',
  '大谷',
  '大谷',
  NULL,
  34.15641,
  132.135364,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388159,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_阿品',
  '阿品',
  '阿品',
  NULL,
  34.190326,
  132.136023,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388184,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_相ノ谷',
  '相ノ谷',
  '相ノ谷',
  NULL,
  34.130808,
  132.064813,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_協和',
  '協和町',
  '協和町',
  NULL,
  33.984749,
  131.92891,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388823,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字室積',
  '大字室積村',
  '大字室積村',
  NULL,
  33.930718,
  131.992409,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字三輪',
  '大字三輪',
  '大字三輪',
  NULL,
  33.974776,
  132.00269,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字光井',
  '大字光井',
  '大字光井',
  NULL,
  33.964789,
  131.969663,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字三井',
  '大字三井',
  '大字三井',
  NULL,
  33.998071,
  131.944115,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字束荷',
  '大字束荷',
  '大字束荷',
  NULL,
  34.011847,
  132.009973,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字立野',
  '大字立野',
  '大字立野',
  NULL,
  33.999272,
  131.974781,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字島田',
  '大字島田',
  '大字島田',
  NULL,
  33.97877,
  131.963299,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字塩田',
  '大字塩田',
  '大字塩田',
  NULL,
  33.998239,
  132.037231,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小周防',
  '大字小周防',
  '大字小周防',
  NULL,
  34.020056,
  131.981583,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字岩田立野',
  '大字岩田立野',
  '大字岩田立野',
  NULL,
  33.993447,
  131.982729,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字岩田',
  '大字岩田',
  '大字岩田',
  NULL,
  33.982563,
  131.988393,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字浅江',
  '大字浅江',
  '大字浅江',
  NULL,
  33.989029,
  131.911032,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128388845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_御山',
  '御山町',
  '御山町',
  NULL,
  34.067268,
  131.799314,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_臨海',
  '臨海町',
  '臨海町',
  NULL,
  34.057918,
  131.744025,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_呼坂本',
  '呼坂本町',
  '呼坂本町',
  NULL,
  34.050449,
  131.967841,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_有楽',
  '有楽町',
  '有楽町',
  NULL,
  34.052397,
  131.802333,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_丸山_quarter',
  '丸山町',
  '丸山町',
  NULL,
  34.076215,
  131.750955,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_花園',
  '花園町',
  '花園町',
  NULL,
  34.066983,
  131.7755,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128596807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_開出',
  '開出',
  '開出',
  NULL,
  34.056979,
  131.553572,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128601004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中泉',
  '中泉町',
  '中泉町',
  NULL,
  34.056044,
  131.547263,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128601005,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_車塚',
  '車塚町',
  '車塚町',
  NULL,
  34.051505,
  131.573441,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128601012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鋳物師',
  '鋳物師町',
  '鋳物師町',
  NULL,
  34.051393,
  131.57675,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128601014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中央_quarter_9128601015',
  '中央町',
  '中央町',
  NULL,
  34.050803,
  131.570154,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128601015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_渚',
  '渚町',
  '渚町',
  NULL,
  34.057656,
  131.785298,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中畷',
  '中畷町',
  '中畷町',
  NULL,
  34.071214,
  131.728174,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清光台',
  '清光台町',
  '清光台町',
  NULL,
  34.031427,
  131.950967,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新宮',
  '新宮町',
  '新宮町',
  NULL,
  34.040622,
  131.812416,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鐘楼',
  '鐘楼町',
  '鐘楼町',
  NULL,
  34.060606,
  131.808714,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_椎木',
  '椎木町',
  '椎木町',
  NULL,
  34.066507,
  131.781345,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_河内',
  '河内町',
  '河内町',
  NULL,
  34.078264,
  131.757005,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_孝田',
  '孝田町',
  '孝田町',
  NULL,
  34.04828,
  131.834859,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_熊毛中央',
  '熊毛中央町',
  '熊毛中央町',
  NULL,
  34.049017,
  131.968931,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_銀南街',
  '銀南街',
  '銀南街',
  NULL,
  34.05091,
  131.805483,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上迫',
  '上迫町',
  '上迫町',
  NULL,
  34.079667,
  131.733009,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_学園台',
  '学園台',
  '学園台',
  NULL,
  34.051805,
  131.847677,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_開成',
  '開成町',
  '開成町',
  NULL,
  34.057162,
  131.75586,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_御姫',
  '御姫町',
  '御姫町',
  NULL,
  34.075162,
  131.727349,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小川屋',
  '小川屋町',
  '小川屋町',
  NULL,
  34.067158,
  131.754138,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字呼坂',
  '大字呼坂',
  '大字呼坂',
  NULL,
  34.051235,
  131.941423,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字米光',
  '大字米光',
  '大字米光',
  NULL,
  34.124906,
  131.734828,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字譲羽',
  '大字譲羽',
  '大字譲羽',
  NULL,
  34.068454,
  131.862849,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字安田',
  '大字安田',
  '大字安田',
  NULL,
  34.039784,
  131.973002,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字八代',
  '大字八代',
  '大字八代',
  NULL,
  34.094254,
  131.945093,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字夜',
  '大字夜市',
  '大字夜市',
  NULL,
  34.089616,
  131.715469,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_金峰',
  '金峰',
  '金峰',
  NULL,
  34.17155,
  131.906878,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字福川',
  '大字福川',
  '大字福川',
  NULL,
  34.083533,
  131.729318,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字樋口',
  '大字樋口',
  '大字樋口',
  NULL,
  34.071497,
  131.978305,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字原',
  '大字原',
  '大字原',
  NULL,
  34.066977,
  131.960969,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字夏切',
  '大字夏切',
  '大字夏切',
  NULL,
  34.164523,
  131.739125,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中',
  '大字中村',
  '大字中村',
  NULL,
  34.033109,
  131.960989,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字長穂',
  '大字長穂',
  '大字長穂',
  NULL,
  34.137912,
  131.840316,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中野',
  '大字中野',
  '大字中野',
  NULL,
  34.135744,
  131.774384,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中須南_quarter',
  '大字中須南',
  '大字中須南',
  NULL,
  34.107217,
  131.916415,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中須北',
  '大字中須北',
  '大字中須北',
  NULL,
  34.144593,
  131.935069,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字富田',
  '大字富田',
  '大字富田',
  NULL,
  34.039097,
  131.761824,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字高瀬',
  '大字高瀬',
  '大字高瀬',
  NULL,
  34.173936,
  131.767935,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字垰',
  '大字垰',
  '大字垰',
  NULL,
  34.143536,
  131.734763,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字清尾',
  '大字清尾',
  '大字清尾',
  NULL,
  34.055169,
  131.985298,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字巣山',
  '大字巣山',
  '大字巣山',
  NULL,
  34.231477,
  131.767573,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字須万',
  '大字須万',
  '大字須万',
  NULL,
  34.216508,
  131.890137,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字須々万本郷',
  '大字須々万本郷',
  '大字須々万本郷',
  NULL,
  34.112503,
  131.864157,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字須々万奥',
  '大字須々万奥',
  '大字須々万奥',
  NULL,
  34.149957,
  131.870244,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字粭島',
  '大字粭島',
  '大字粭島',
  NULL,
  33.978949,
  131.763546,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字上',
  '大字上村',
  '大字上村',
  NULL,
  34.091043,
  131.800614,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字下上',
  '大字下上',
  '大字下上',
  NULL,
  34.086124,
  131.77899,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字四熊',
  '大字四熊',
  '大字四熊',
  NULL,
  34.113721,
  131.764039,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小松原',
  '大字小松原',
  '大字小松原',
  NULL,
  34.04736,
  132.010775,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字栗屋',
  '大字栗屋',
  '大字栗屋',
  NULL,
  34.013334,
  131.813358,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字久米',
  '大字久米',
  '大字久米',
  NULL,
  34.051854,
  131.856113,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字櫛ヶ浜',
  '大字櫛ヶ浜',
  '大字櫛ヶ浜',
  NULL,
  34.026097,
  131.829796,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字川曲',
  '大字川曲',
  '大字川曲',
  NULL,
  34.103642,
  131.817184,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608617,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字川上_quarter',
  '大字川上',
  '大字川上',
  NULL,
  34.121886,
  131.794881,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608618,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字鹿野中',
  '大字鹿野中',
  '大字鹿野中',
  NULL,
  34.228467,
  131.798298,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字鹿野下',
  '大字鹿野下',
  '大字鹿野下',
  NULL,
  34.210497,
  131.825372,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字鹿野上',
  '大字鹿野上',
  '大字鹿野上',
  NULL,
  34.253082,
  131.85329,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608621,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字小畑',
  '大字小畑',
  '大字小畑',
  NULL,
  34.102062,
  131.738956,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字奥関屋',
  '大字奥関屋',
  '大字奥関屋',
  NULL,
  34.066862,
  131.944865,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608623,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大向',
  '大字大向',
  '大字大向',
  NULL,
  34.177865,
  131.831732,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608624,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大道理',
  '大字大道理',
  '大字大道理',
  NULL,
  34.166865,
  131.798434,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608625,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大津島',
  '大字大津島',
  '大字大津島',
  NULL,
  34.007275,
  131.697587,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大島',
  '大字大島',
  '大字大島',
  NULL,
  33.991656,
  131.799316,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608627,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大潮',
  '大字大潮',
  '大字大潮',
  NULL,
  34.298281,
  131.814394,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608628,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大河内',
  '大字大河内',
  '大字大河内',
  NULL,
  34.023734,
  131.948157,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字馬神',
  '大字馬神',
  '大字馬神',
  NULL,
  34.123507,
  131.710832,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128608630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_惣社',
  '惣社町',
  '惣社町',
  NULL,
  34.061986,
  131.581391,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字東佐波令',
  '大字東佐波令',
  '大字東佐波令',
  NULL,
  34.073427,
  131.58141,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_迫戸',
  '迫戸町',
  '迫戸町',
  NULL,
  34.066627,
  131.569074,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字上右田',
  '大字上右田',
  '大字上右田',
  NULL,
  34.096364,
  131.567973,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新橋',
  '新橋町',
  '新橋町',
  NULL,
  34.063343,
  131.559538,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_泉',
  '泉町',
  '泉町',
  NULL,
  34.060923,
  131.55506,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字高井',
  '大字高井',
  '大字高井',
  NULL,
  34.078851,
  131.546984,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本橋',
  '本橋町',
  '本橋町',
  NULL,
  34.066423,
  131.564626,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字下右田',
  '大字下右田',
  '大字下右田',
  NULL,
  34.082198,
  131.556276,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_今市',
  '今市町',
  '今市町',
  NULL,
  34.061846,
  131.566206,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_平和',
  '平和町',
  '平和町',
  NULL,
  34.058187,
  131.563411,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_古祖原',
  '古祖原',
  '古祖原',
  NULL,
  34.059023,
  131.550174,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_開出本',
  '開出本町',
  '開出本町',
  NULL,
  34.053324,
  131.551034,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_開出西',
  '開出西町',
  '開出西町',
  NULL,
  34.052878,
  131.546123,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614036,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字大崎',
  '大字大崎',
  '大字大崎',
  NULL,
  34.072057,
  131.543914,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614037,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西佐波令',
  '大字西佐波令',
  '大字西佐波令',
  NULL,
  34.053627,
  131.543057,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614038,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牟礼柳',
  '牟礼柳',
  '牟礼柳',
  NULL,
  34.0579948,
  131.6023866,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614039,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_美和',
  '美和町',
  '美和町',
  NULL,
  34.057477,
  131.580654,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宮市',
  '宮市町',
  '宮市町',
  NULL,
  34.061095,
  131.570878,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_南松崎',
  '南松崎町',
  '南松崎町',
  NULL,
  34.057642,
  131.577816,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614044,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_三田尻本',
  '三田尻本町',
  '三田尻本町',
  NULL,
  34.043556,
  131.573103,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614046,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鞠生',
  '鞠生町',
  '鞠生町',
  NULL,
  34.040112,
  131.565772,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614050,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_松原',
  '松原町',
  '松原町',
  NULL,
  34.0423,
  131.568129,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614051,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_松崎_quarter',
  '松崎町',
  '松崎町',
  NULL,
  34.063344,
  131.575254,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614052,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東松崎',
  '東松崎町',
  '東松崎町',
  NULL,
  34.059612,
  131.577454,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_東仁井令',
  '東仁井令町',
  '東仁井令町',
  NULL,
  34.047478,
  131.556052,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_華園',
  '華園町',
  '華園町',
  NULL,
  34.043961,
  131.555896,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_仁井令',
  '仁井令町',
  '仁井令町',
  NULL,
  34.050697,
  131.555381,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614064,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中西',
  '中西',
  '中西',
  NULL,
  34.062927,
  131.601811,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614065,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_酢貝',
  '酢貝',
  '酢貝',
  NULL,
  34.058262,
  131.598834,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_新築地',
  '新築地町',
  '新築地町',
  NULL,
  34.041631,
  131.59221,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_自力',
  '自力町',
  '自力町',
  NULL,
  34.042441,
  131.574989,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_清水_quarter',
  '清水町',
  '清水町',
  NULL,
  34.047624,
  131.551773,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_敷山',
  '敷山町',
  '敷山町',
  NULL,
  34.067038,
  131.598571,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614077,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_寿',
  '寿町',
  '寿町',
  NULL,
  34.051295,
  131.561137,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614079,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_国分寺',
  '国分寺町',
  '国分寺町',
  NULL,
  34.064666,
  131.579477,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_協和_quarter',
  '協和町',
  '協和町',
  NULL,
  34.038898,
  131.576776,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上天神',
  '上天神町',
  '上天神町',
  NULL,
  34.059758,
  131.573883,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鐘紡',
  '鐘紡町',
  '鐘紡町',
  NULL,
  34.044706,
  131.585973,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614096,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_お茶屋',
  'お茶屋町',
  'お茶屋町',
  NULL,
  34.045653,
  131.572747,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614100,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岡',
  '岡村町',
  '岡村町',
  NULL,
  34.04611,
  131.570025,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614103,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字和字',
  '大字和字',
  '大字和字',
  NULL,
  34.120023,
  131.614323,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614104,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字牟礼',
  '大字牟礼',
  '大字牟礼',
  NULL,
  34.070195,
  131.6106,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614105,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字向島',
  '大字向島',
  '大字向島',
  NULL,
  34.005026,
  131.580689,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614106,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字三田尻',
  '大字三田尻村',
  '大字三田尻村',
  NULL,
  34.038272,
  131.57161,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614107,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字真尾',
  '大字真尾',
  '大字真尾',
  NULL,
  34.095797,
  131.604705,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614108,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字久兼',
  '大字久兼',
  '大字久兼',
  NULL,
  34.110882,
  131.635598,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字浜方',
  '大字浜方',
  '大字浜方',
  NULL,
  34.01645,
  131.557279,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字西浦',
  '大字西浦',
  '大字西浦',
  NULL,
  34.023198,
  131.52139,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字仁井令',
  '大字仁井令',
  '大字仁井令',
  NULL,
  34.037713,
  131.556812,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614112,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字奈美',
  '大字奈美',
  '大字奈美',
  NULL,
  34.133392,
  131.587485,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614113,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字中山_quarter',
  '大字中山',
  '大字中山',
  NULL,
  34.13973,
  131.609275,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字富海',
  '大字富海',
  '大字富海',
  NULL,
  34.057678,
  131.645588,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字田島',
  '大字田島',
  '大字田島',
  NULL,
  34.014605,
  131.530924,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字台道',
  '大字台道',
  '大字台道',
  NULL,
  34.052521,
  131.480863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字鈴屋',
  '大字鈴屋',
  '大字鈴屋',
  NULL,
  34.11517,
  131.583237,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字新田',
  '大字新田',
  '大字新田',
  NULL,
  34.029526,
  131.56774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字佐野',
  '大字佐野',
  '大字佐野',
  NULL,
  34.057477,
  131.518451,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字切畑',
  '大字切畑',
  '大字切畑',
  NULL,
  34.083874,
  131.501542,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字奥畑',
  '大字奥畑',
  '大字奥畑',
  NULL,
  34.146268,
  131.643444,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字江泊',
  '大字江泊',
  '大字江泊',
  NULL,
  34.038073,
  131.612949,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字植松',
  '大字植松',
  '大字植松',
  NULL,
  34.045599,
  131.528473,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大字伊佐江',
  '大字伊佐江',
  '大字伊佐江',
  NULL,
  34.038054,
  131.554074,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_駅南_quarter',
  '駅南町',
  '駅南町',
  NULL,
  34.051254,
  131.565769,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_伊佐江',
  '伊佐江町',
  '伊佐江町',
  NULL,
  34.044443,
  131.550385,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9128614133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujifukadani',
  '徳地深谷',
  '徳地深谷',
  '{"en":"Tokujifukadani"}'::jsonb,
  34.2133638,
  131.6831588,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9136458073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujiyasaka',
  '徳地八坂',
  '徳地八坂',
  '{"en":"Tokujiyasaka"}'::jsonb,
  34.2200354,
  131.6699409,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9136458074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujinotani',
  '徳地野谷',
  '徳地野谷',
  '{"en":"Tokujinotani"}'::jsonb,
  34.2765367,
  131.6315746,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9147041669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujifunaji',
  '徳地船路',
  '徳地船路',
  '{"en":"Tokujifunaji"}'::jsonb,
  34.252286,
  131.6666793,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9154027983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nihokamigo',
  '仁保上郷',
  '仁保上郷',
  '{"en":"Nihokamigo"}'::jsonb,
  34.2565071,
  131.5895175,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9154050394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujiyunoki',
  '徳地柚木',
  '徳地柚木',
  '{"en":"Tokujiyunoki"}'::jsonb,
  34.313303,
  131.7233813,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9154062674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atoikumohigashibun',
  '阿東生雲東分',
  '阿東生雲東分',
  '{"en":"Atoikumohigashibun"}'::jsonb,
  34.3198072,
  131.5956223,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9166179558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atojifukushimo',
  '阿東地福下',
  '阿東地福下',
  '{"en":"Atojifukushimo"}'::jsonb,
  34.3372349,
  131.624043,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9166179559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujiogoso',
  '徳地小古祖',
  '徳地小古祖',
  '{"en":"Tokujiogoso"}'::jsonb,
  34.2093178,
  131.6606498,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujihori',
  '徳地堀',
  '徳地堀',
  '{"en":"Tokujihori"}'::jsonb,
  34.1942685,
  131.648891,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujifujiki',
  '徳地藤木',
  '徳地藤木',
  '{"en":"Tokujifujiki"}'::jsonb,
  34.1457215,
  131.678921,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujiyamahata',
  '徳地山畑',
  '徳地山畑',
  '{"en":"Tokujiyamahata"}'::jsonb,
  34.1718937,
  131.6949284,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujishimaji',
  '徳地島地',
  '徳地島地',
  '{"en":"Tokujishimaji"}'::jsonb,
  34.1642684,
  131.6979647,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujiikaji',
  '徳地伊賀地',
  '徳地伊賀地',
  '{"en":"Tokujiikaji"}'::jsonb,
  34.1734204,
  131.6470992,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujikishimi',
  '徳地岸見',
  '徳地岸見',
  '{"en":"Tokujikishimi"}'::jsonb,
  34.1546625,
  131.624794,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181763810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujisabagouchi',
  '徳地鯖河内',
  '徳地鯖河内',
  '{"en":"Tokujisabagouchi"}'::jsonb,
  34.2030358,
  131.743927,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181847110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujikushi',
  '徳地串',
  '徳地串',
  '{"en":"Tokujikushi"}'::jsonb,
  34.1902929,
  131.7276191,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9181847115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ouchimihori',
  '大内御堀',
  '大内御堀',
  '{"en":"Ouchimihori"}'::jsonb,
  34.138813,
  131.497377,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kamiunorei',
  '上宇野令',
  '上宇野令',
  '{"en":"Kamiunorei"}'::jsonb,
  34.207599,
  131.46137,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogicho',
  '荻町',
  '荻町',
  '{"en":"Ogicho"}'::jsonb,
  34.173078,
  131.458657,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_midoricho',
  '緑町',
  '緑町',
  '{"en":"Midoricho"}'::jsonb,
  34.171021,
  131.464772,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_佐山',
  '佐山',
  '佐山',
  NULL,
  34.042114,
  131.346696,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338082,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_深溝',
  '深溝',
  '深溝',
  NULL,
  34.046693,
  131.37302,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ouchihimeyamadai',
  '大内姫山台',
  '大内姫山台',
  '{"en":"Ouchihimeyamadai"}'::jsonb,
  34.157699,
  131.477763,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ouchishokyoto',
  '大内小京都',
  '大内小京都',
  '{"en":"Ouchishokyoto"}'::jsonb,
  34.152645,
  131.479741,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_wakamiyacho',
  '若宮町',
  '若宮町',
  '{"en":"Wakamiyacho"}'::jsonb,
  34.158729,
  131.455863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_吉敷',
  '吉敷',
  '吉敷',
  NULL,
  34.183545,
  131.41196,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218338116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yabaracho',
  '矢原町',
  '矢原町',
  '{"en":"Yabaracho"}'::jsonb,
  34.156503,
  131.452513,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_yabara',
  '矢原',
  '矢原',
  '{"en":"Yabara"}'::jsonb,
  34.150672,
  131.445939,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_motomachi',
  '元町',
  '元町',
  '{"en":"Motomachi"}'::jsonb,
  34.170314,
  131.458428,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_miyanoshimo',
  '宮野下',
  '宮野下',
  '{"en":"Miyanoshimo"}'::jsonb,
  34.200894,
  131.502974,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_miyanokami',
  '宮野上',
  '宮野上',
  '{"en":"Miyanokami"}'::jsonb,
  34.216981,
  131.51365,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_miyajimacho',
  '宮島町',
  '宮島町',
  '{"en":"Miyajimacho"}'::jsonb,
  34.166775,
  131.479026,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_midorigaoka_quarter',
  '緑ヶ丘',
  '緑ヶ丘',
  '{"en":"Midorigaoka"}'::jsonb,
  34.195524,
  131.488054,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_matsumicho',
  '松美町',
  '松美町',
  '{"en":"Matsumicho"}'::jsonb,
  34.164484,
  131.464716,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_maemachi',
  '前町',
  '前町',
  '{"en":"Maemachi"}'::jsonb,
  34.162737,
  131.462359,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hozumicho',
  '穂積町',
  '穂積町',
  '{"en":"Hozumicho"}'::jsonb,
  34.155127,
  131.455595,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_hirai',
  '平井',
  '平井',
  '{"en":"Hirai"}'::jsonb,
  34.153714,
  131.463727,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_仁保中郷',
  '仁保中郷',
  '仁保中郷',
  NULL,
  34.199314,
  131.576548,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_仁保下郷',
  '仁保下郷',
  '仁保下郷',
  NULL,
  34.190408,
  131.542502,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nanaodai',
  '七尾台',
  '七尾台',
  '{"en":"Nanaodai"}'::jsonb,
  34.192279,
  131.482221,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_名田島',
  '名田島',
  '名田島',
  NULL,
  34.068819,
  131.414722,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakazonocho',
  '中園町',
  '中園町',
  '{"en":"Nakazonocho"}'::jsonb,
  34.169043,
  131.46676,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nakao',
  '中尾',
  '中尾',
  '{"en":"Nakao"}'::jsonb,
  34.201876,
  131.439961,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tomitabaracho',
  '富田原町',
  '富田原町',
  '{"en":"Tomitabaracho"}'::jsonb,
  34.1607,
  131.46399,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujimitani',
  '徳地三谷',
  '徳地三谷',
  '{"en":"Tokujimitani"}'::jsonb,
  34.256,
  131.72347,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujihikutani',
  '徳地引谷',
  '徳地引谷',
  '{"en":"Tokujihikutani"}'::jsonb,
  34.221623,
  131.614918,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_tokujikamimura',
  '徳地上村',
  '徳地上村',
  '{"en":"Tokujikamimura"}'::jsonb,
  34.14921,
  131.71084,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_takaracho',
  '宝町',
  '宝町',
  '{"en":"Takaracho"}'::jsonb,
  34.157343,
  131.447282,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sentocho',
  '泉都町',
  '泉都町',
  '{"en":"Sentocho"}'::jsonb,
  34.166746,
  131.463266,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sufucho',
  '周布町',
  '周布町',
  '{"en":"Sufucho"}'::jsonb,
  34.160619,
  131.453825,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鋳銭司',
  '鋳銭司',
  '鋳銭司',
  NULL,
  34.086682,
  131.464519,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_陶',
  '陶',
  '陶',
  NULL,
  34.094675,
  131.428515,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimoosaba',
  '下小鯖',
  '下小鯖',
  '{"en":"Shimoosaba"}'::jsonb,
  34.128129,
  131.546041,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimounorei',
  '下宇野令',
  '下宇野令',
  '{"en":"Shimounorei"}'::jsonb,
  34.177421,
  131.446226,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shimoichicho',
  '下市町',
  '下市町',
  '{"en":"Shimoichicho"}'::jsonb,
  34.161994,
  131.459826,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shibasakicho',
  '芝崎町',
  '芝崎町',
  '{"en":"Shibasakicho"}'::jsonb,
  34.189274,
  131.488318,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_sanwacho',
  '三和町',
  '三和町',
  '{"en":"Sanwacho"}'::jsonb,
  34.165971,
  131.468645,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_saiwaicho',
  '幸町',
  '幸町',
  '{"en":"Saiwaicho"}'::jsonb,
  34.158695,
  131.450974,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_koganecho',
  '黄金町',
  '黄金町',
  '{"en":"Koganecho"}'::jsonb,
  34.171499,
  131.476774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kurokawa',
  '黒川',
  '黒川',
  '{"en":"Kurokawa"}'::jsonb,
  34.129471,
  131.450791,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kumanocho',
  '熊野町',
  '熊野町',
  '{"en":"Kumanocho"}'::jsonb,
  34.168792,
  131.461261,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352782,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kusunokicho',
  '楠木町',
  '楠木町',
  '{"en":"Kusunokicho"}'::jsonb,
  34.170923,
  131.4533,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kandacho',
  '神田町',
  '神田町',
  '{"en":"Kandacho"}'::jsonb,
  34.172889,
  131.45585,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_上小鯖',
  '上小鯖',
  '上小鯖',
  NULL,
  34.107999,
  131.504974,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_嘉川',
  '嘉川',
  '嘉川',
  NULL,
  34.085941,
  131.369837,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoriwakakusamachi',
  '小郡若草町',
  '小郡若草町',
  '{"en":"Ogoriwakakusamachi"}'::jsonb,
  34.085394,
  131.394907,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoriyamate_kamimachi',
  '小郡山手上町',
  '小郡山手上町',
  '{"en":"Ogoriyamate Kamimachi"}'::jsonb,
  34.106609,
  131.392742,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorimiyukimachi',
  '小郡御幸町',
  '小郡御幸町',
  '{"en":"Ogorimiyukimachi"}'::jsonb,
  34.09339,
  131.398447,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorimidorimachi',
  '小郡緑町',
  '小郡緑町',
  '{"en":"Ogorimidorimachi"}'::jsonb,
  34.090864,
  131.401714,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorimaedamachi',
  '小郡前田町',
  '小郡前田町',
  '{"en":"Ogorimaedamachi"}'::jsonb,
  34.086147,
  131.397809,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoriheiseimachi',
  '小郡平成町',
  '小郡平成町',
  '{"en":"Ogoriheiseimachi"}'::jsonb,
  34.088321,
  131.401033,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorifunakuramachi',
  '小郡船倉町',
  '小郡船倉町',
  '{"en":"Ogorifunakuramachi"}'::jsonb,
  34.092793,
  131.404764,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorihirasamachi',
  '小郡平砂町',
  '小郡平砂町',
  '{"en":"Ogorihirasamachi"}'::jsonb,
  34.088383,
  131.393445,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorihanazonomachi',
  '小郡花園町',
  '小郡花園町',
  '{"en":"Ogorihanazonomachi"}'::jsonb,
  34.088912,
  131.39612,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoritakasagomachi',
  '小郡高砂町',
  '小郡高砂町',
  '{"en":"Ogoritakasagomachi"}'::jsonb,
  34.092605,
  131.400285,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorisangenyamachi',
  '小郡三軒屋町',
  '小郡三軒屋町',
  '{"en":"Ogorisangenyamachi"}'::jsonb,
  34.087695,
  131.4039,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorisakaemachi',
  '小郡栄町',
  '小郡栄町',
  '{"en":"Ogorisakaemachi"}'::jsonb,
  34.088741,
  131.402883,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorikoganemachi',
  '小郡黄金町',
  '小郡黄金町',
  '{"en":"Ogorikoganemachi"}'::jsonb,
  34.090418,
  131.398007,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352800,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorikyuryomachi',
  '小郡給領町',
  '小郡給領町',
  '{"en":"Ogorikyuryomachi"}'::jsonb,
  34.086366,
  131.402244,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorikanahoricho',
  '小郡金堀町',
  '小郡金堀町',
  '{"en":"Ogorikanahoricho"}'::jsonb,
  34.109953,
  131.390313,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoriozakicho',
  '小郡尾崎町',
  '小郡尾崎町',
  '{"en":"Ogoriozakicho"}'::jsonb,
  34.109141,
  131.395061,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogorioemachi',
  '小郡大江町',
  '小郡大江町',
  '{"en":"Ogorioemachi"}'::jsonb,
  34.093419,
  131.402951,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ogoriishinmachi',
  '小郡維新町',
  '小郡維新町',
  '{"en":"Ogoriishinmachi"}'::jsonb,
  34.087362,
  131.399626,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ouchiyata',
  '大内矢田',
  '大内矢田',
  '{"en":"Ouchiyata"}'::jsonb,
  34.145569,
  131.507015,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_ouchinagano',
  '大内長野',
  '大内長野',
  '{"en":"Ouchinagano"}'::jsonb,
  34.160596,
  131.526461,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_enseiji',
  '円政寺',
  '円政寺',
  '{"en":"Enseiji"}'::jsonb,
  34.182045,
  131.481878,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_江崎',
  '江崎',
  '江崎',
  NULL,
  34.061834,
  131.354067,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352822,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_imiacho',
  '今井町',
  '今井町',
  '{"en":"Imiacho"}'::jsonb,
  34.160731,
  131.458025,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_izumicho',
  '泉町',
  '泉町',
  '{"en":"Izumicho"}'::jsonb,
  34.16769,
  131.450946,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atotokusashimo',
  '阿東徳佐下',
  '阿東徳佐下',
  '{"en":"Atotokusashimo"}'::jsonb,
  34.400992,
  131.693032,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_atoshinome',
  '阿東篠目',
  '阿東篠目',
  '{"en":"Atoshinome"}'::jsonb,
  34.280764,
  131.554278,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_阿知須',
  '阿知須',
  '阿知須',
  NULL,
  34.016356,
  131.343505,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_asada',
  '朝田',
  '朝田',
  '{"en":"Asada"}'::jsonb,
  34.149879,
  131.41732,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_asakuracho',
  '朝倉町',
  '朝倉町',
  '{"en":"Asakuracho"}'::jsonb,
  34.179891,
  131.448259,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_akazumacho',
  '赤妻町',
  '赤妻町',
  '{"en":"Akazumacho"}'::jsonb,
  34.171304,
  131.446816,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_aobadai_quarter',
  '青葉台',
  '青葉台',
  '{"en":"Aobadai"}'::jsonb,
  34.206388,
  131.504495,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9218352841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_kaminogo',
  '上の郷',
  'かみのごう',
  '{"en":"Kaminogo"}'::jsonb,
  34.0054007,
  131.1615121,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  9364946948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_nishikicho',
  '錦町',
  '錦町',
  '{"en":"Nishikicho"}'::jsonb,
  34.1757041,
  131.4494362,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  11225989895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_mishima_3412041400',
  '三島',
  '三島',
  '{"en":"Mishima"}'::jsonb,
  33.7669121,
  132.2571176,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041400,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_houkinohana',
  '保木鼻',
  '保木鼻',
  '{"en":"Houkinohana"}'::jsonb,
  33.9296516,
  132.441188,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041411,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_厨子ヶ鼻',
  '厨子ヶ鼻',
  '厨子ヶ鼻',
  NULL,
  33.9407823,
  132.4024507,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041415,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大三郎鼻',
  '大三郎鼻',
  '大三郎鼻',
  NULL,
  33.8830883,
  132.3272702,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041419,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大崎鼻',
  '大崎鼻',
  '大崎鼻',
  NULL,
  33.9558938,
  132.2836078,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041421,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_安下崎',
  '安下崎',
  '安下崎',
  NULL,
  33.8715493,
  132.2766496,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041427,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_家房崎',
  '家房崎',
  '家房崎',
  NULL,
  33.8747005,
  132.2412455,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041428,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_押前鼻',
  '押前鼻',
  '押前鼻',
  NULL,
  33.8711826,
  132.1998638,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041441,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_shinguubana',
  '新宮鼻',
  '新宮鼻',
  '{"en":"Shinguubana"}'::jsonb,
  34.0155282,
  132.4291547,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041444,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_日見崎',
  '日見崎',
  '日見崎',
  NULL,
  33.8945778,
  132.1768774,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041445,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_matsugahana',
  '松ヶ鼻',
  '松ヶ鼻',
  '{"en":"Matsugahana"}'::jsonb,
  33.9513935,
  132.4381843,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041446,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_津長鼻',
  '津長鼻',
  '津長鼻',
  NULL,
  33.9304901,
  132.1765466,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041452,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_洲首崎',
  '洲首崎',
  '洲首崎',
  NULL,
  33.8143563,
  132.4009008,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041453,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_setogahana',
  '瀬戸ヶ鼻',
  '瀬戸ヶ鼻',
  '{"en":"Setogahana"}'::jsonb,
  33.9499365,
  132.4711063,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041458,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牛ヶ首',
  '牛ヶ首',
  '牛ヶ首',
  NULL,
  33.8628226,
  132.3716604,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041460,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_田ノ尻鼻',
  '田ノ尻鼻',
  '田ノ尻鼻',
  NULL,
  33.9650322,
  132.2152551,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041462,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竜崎',
  '竜崎',
  '竜崎',
  NULL,
  33.8916925,
  132.2908768,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041474,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_符崎の鼻',
  '符崎の鼻',
  '符崎の鼻',
  NULL,
  33.9207301,
  132.3197232,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041477,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_筆崎',
  '筆崎',
  '筆崎',
  NULL,
  33.9545565,
  132.1934966,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041479,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_脇ガ鼻',
  '脇ガ鼻',
  '脇ガ鼻',
  NULL,
  33.9236115,
  132.1729597,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041483,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_雨が浦鼻',
  '雨が浦鼻',
  '雨が浦鼻',
  NULL,
  33.8657061,
  132.216036,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  3412041498,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_象鼻ヶ岬',
  '象鼻ヶ岬',
  '象鼻ヶ岬',
  NULL,
  33.9221376,
  131.9763164,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4367216989,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鼓ヶ浦',
  '鼓ヶ浦',
  '鼓ヶ浦',
  NULL,
  33.9176256,
  131.9759258,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4367217089,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_杵崎',
  '杵崎',
  '杵崎',
  NULL,
  33.9208079,
  131.9621131,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4367217189,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竜ヶ崎',
  '竜ヶ崎',
  '竜ヶ崎',
  NULL,
  34.020673,
  131.6098258,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4452855598,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_酒ノ瀬',
  '酒ノ瀬',
  '酒ノ瀬',
  NULL,
  34.0922612,
  130.7951421,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4563334460,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_夢ヶ崎',
  '夢ヶ崎',
  '夢ヶ崎',
  NULL,
  34.3555282,
  130.8401097,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686743058,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_通瀬岬',
  '通瀬岬',
  '通瀬岬',
  NULL,
  34.3409782,
  130.8462627,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686743059,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_金山岬',
  '金山岬',
  '金山岬',
  NULL,
  34.3524105,
  130.9383746,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686743599,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_神宮崎',
  '神宮崎',
  '神宮崎',
  NULL,
  34.3529646,
  130.9218526,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686744176,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本場鼻',
  '本場鼻',
  '本場鼻',
  NULL,
  34.3634286,
  130.9017501,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686746912,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_折紙鼻',
  '折紙鼻',
  '折紙鼻',
  NULL,
  34.3642757,
  130.9057068,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686746913,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牧崎',
  '牧崎',
  '牧崎',
  NULL,
  34.3740235,
  130.8670459,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686746967,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_瀬崎',
  '瀬崎',
  '瀬崎',
  NULL,
  34.353327,
  130.8776332,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4686746968,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_犬鳴岬',
  '犬鳴岬',
  '犬鳴岬',
  NULL,
  34.2044405,
  130.9290454,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4702847103,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_大崎鼻_locality',
  '大崎鼻',
  '大崎鼻',
  NULL,
  34.2153496,
  130.9158064,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4702860517,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_笠松ノ鼻',
  '笠松ノ鼻',
  '笠松ノ鼻',
  NULL,
  34.1792176,
  130.9252177,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4703447603,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_真崎',
  '真崎',
  '真崎',
  NULL,
  34.1529075,
  130.8956543,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4711008641,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_泊ヶ鼻',
  '泊ヶ鼻',
  '泊ヶ鼻',
  NULL,
  34.1425485,
  130.8857732,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4716613718,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_柱島港',
  '柱島港',
  '柱島港',
  NULL,
  34.0205586,
  132.4223467,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4761805907,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岩国港',
  '岩国港',
  '岩国港',
  NULL,
  34.190478,
  132.2340564,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4768504602,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_定兼鼻',
  '定兼鼻',
  '定兼鼻',
  NULL,
  33.9350731,
  131.695025,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4852670474,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_天石鼻',
  '天石鼻',
  '天石鼻',
  NULL,
  33.9424966,
  131.6888291,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4852670475,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_野島漁港',
  '野島漁港',
  '野島漁港',
  NULL,
  33.944873,
  131.6941345,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4852670476,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_海附岬',
  '海附岬',
  '海附岬',
  NULL,
  33.8710302,
  132.0169973,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4855633588,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_平茂岬',
  '平茂岬',
  '平茂岬',
  NULL,
  33.8532924,
  132.0241857,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4855633589,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竜尾岬',
  '竜尾岬',
  '竜尾岬',
  NULL,
  33.8606828,
  131.9979858,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4855633590,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牛島漁港',
  '牛島漁港',
  '牛島漁港',
  NULL,
  33.8598677,
  132.0088863,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4855633594,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_才塩ケ鼻',
  '才塩ケ鼻',
  '才塩ケ鼻',
  NULL,
  33.9007068,
  132.0439589,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4859787221,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_笠佐港',
  '笠佐港',
  '笠佐港',
  NULL,
  33.9472227,
  132.168113,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4914802500,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_通ケ鼻',
  '通ケ鼻',
  '通ケ鼻',
  NULL,
  34.5179036,
  131.277566,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4946815930,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_椎木岩',
  '椎木岩',
  '椎木岩',
  NULL,
  34.5128513,
  131.2866425,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4946815931,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_唐鳩',
  '唐鳩',
  '唐鳩',
  NULL,
  34.5052923,
  131.2920392,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4946815932,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_火崎',
  '火崎',
  '火崎',
  NULL,
  34.497264,
  131.2783813,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  4946815933,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_丸山岬',
  '丸山岬',
  '丸山岬',
  NULL,
  34.0356239,
  131.7088668,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224569155,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_亀ヶ崎',
  '亀ヶ崎',
  '亀ヶ崎',
  NULL,
  34.0317674,
  131.7157282,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224569160,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_帝岬',
  '帝岬',
  '帝岬',
  NULL,
  34.0204884,
  131.7136329,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224569314,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_水尻岬',
  '水尻岬',
  '水尻岬',
  NULL,
  34.0082395,
  131.6907445,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224573433,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_金崎',
  '金崎',
  '金崎',
  NULL,
  33.9791818,
  131.718983,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224573496,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_水揚鼻',
  '水揚鼻',
  '水揚鼻',
  NULL,
  33.9825293,
  131.733336,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224575653,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_銭橘ノ岬',
  '銭橘ノ岬',
  '銭橘ノ岬',
  NULL,
  34.013328,
  131.7154677,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224581936,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_宮ノ鼻',
  '宮ノ鼻',
  '宮ノ鼻',
  NULL,
  33.9835905,
  131.7602758,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224593616,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_三ツ石鼻',
  '三ツ石鼻',
  '三ツ石鼻',
  NULL,
  33.9740699,
  131.7630979,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224595165,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_竜宮岬',
  '竜宮岬',
  '竜宮岬',
  NULL,
  33.9736647,
  131.7779788,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224607385,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_コベ鼻',
  'コベ鼻',
  'コベ鼻',
  NULL,
  33.9760958,
  131.8220584,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5224619593,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_漁人鼻',
  '漁人鼻',
  '漁人鼻',
  NULL,
  33.9946568,
  131.7817846,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228175350,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_瀬戸岬',
  '瀬戸岬',
  '瀬戸岬',
  NULL,
  33.9904804,
  131.8581156,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228191126,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_四十鼻',
  '四十鼻',
  '四十鼻',
  NULL,
  34.0536465,
  131.7071586,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228260460,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_八崎岬',
  '八崎岬',
  '八崎岬',
  NULL,
  34.0368697,
  131.6444612,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228262457,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_推木岬',
  '推木岬',
  '推木岬',
  NULL,
  34.0475153,
  131.6881043,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228266349,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_赤崎',
  '赤崎',
  '赤崎',
  NULL,
  34.0432997,
  131.6780306,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5228268032,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_扇崎',
  '扇崎',
  '扇崎',
  NULL,
  34.0149359,
  131.6018832,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230168017,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_赤崎_locality',
  '赤崎',
  '赤崎',
  NULL,
  33.9994265,
  131.5919047,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230181697,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_牛ヶ類',
  '牛ヶ類',
  '牛ヶ類',
  NULL,
  33.9890807,
  131.556341,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230192544,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_タズノ鼻',
  'タズノ鼻',
  'タズノ鼻',
  NULL,
  33.9859873,
  131.5670756,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230192545,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西泊崎',
  '西泊崎',
  '西泊崎',
  NULL,
  33.9989879,
  131.5458459,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230199365,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_地蔵鼻',
  '地蔵鼻',
  '地蔵鼻',
  NULL,
  34.0036465,
  131.5088604,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230208339,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_小磯崎',
  '小磯崎',
  '小磯崎',
  NULL,
  34.0119192,
  131.4806417,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230212798,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_赤石鼻',
  '赤石鼻',
  '赤石鼻',
  NULL,
  33.9865577,
  131.4572561,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230226777,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_草山崎',
  '草山崎',
  '草山崎',
  NULL,
  33.9827372,
  131.4420589,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230228953,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_岩屋の鼻',
  '岩屋の鼻',
  '岩屋の鼻',
  NULL,
  33.9836116,
  131.3966126,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5230235949,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_月崎',
  '月崎',
  '月崎',
  NULL,
  33.9853661,
  131.3603435,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244093053,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_本山岬',
  '本山岬',
  '本山岬',
  NULL,
  33.9304046,
  131.1807881,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244093068,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_黒崎',
  '黒崎',
  '黒崎',
  NULL,
  33.9404432,
  131.3000549,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244095416,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_串本岬',
  '串本岬',
  '串本岬',
  NULL,
  34.0614805,
  130.9036193,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244184006,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_村崎ノ鼻',
  '村崎ノ鼻',
  '村崎ノ鼻',
  NULL,
  34.024446,
  130.9038204,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244193747,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_綱代ノ鼻',
  '綱代ノ鼻',
  '綱代ノ鼻',
  NULL,
  34.0643185,
  130.8898125,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244209215,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_眼ノ崎',
  '眼ノ崎',
  '眼ノ崎',
  NULL,
  34.0809325,
  130.8752027,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244209844,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_毘沙ノ鼻',
  '毘沙ノ鼻',
  '毘沙ノ鼻',
  NULL,
  34.1110256,
  130.8601204,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244210886,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_戸屋ノ鼻',
  '戸屋ノ鼻',
  '戸屋ノ鼻',
  NULL,
  34.1043342,
  130.8612476,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244210887,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_観音崎_5244218852',
  '観音崎',
  '観音崎',
  NULL,
  34.137019,
  130.8667923,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5244218852,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_帰水',
  '帰水',
  '帰水',
  NULL,
  34.2677239,
  131.3140654,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5694070012,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_馬ころび',
  '馬ころび',
  '馬ころび',
  NULL,
  34.2483218,
  131.3138509,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5694152327,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_長者ヶ森',
  '長者ヶ森',
  '長者ヶ森',
  NULL,
  34.2550771,
  131.3151946,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  5694152328,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_西ノ島',
  '西ノ島',
  '西ノ島',
  NULL,
  34.0498415,
  131.743294,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6339756940,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_中ノ島',
  '中ノ島',
  '中ノ島',
  NULL,
  34.0472725,
  131.7484224,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6339756941,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'yamaguchi_unknown_鍋島',
  '鍋島',
  '鍋島',
  NULL,
  34.0467169,
  131.7505681,
  NULL,
  'yamaguchi',
  NULL,
  'jp',
  '山口県',
  NULL,
  NULL,
  NULL,
  6339756942,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 13件, machi 1254件を挿入