-- =============================================
-- 埼玉県の街データ（OSMから取得）
-- 生成日時: 2025-12-11T02:42:44.729Z
-- データ取得日時: 2025-12-10T12:33:27.942Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（埼玉県のみ）
-- =============================================

-- machiテーブルから埼玉県のデータを削除
DELETE FROM machi WHERE prefecture_id = 'saitama';

-- citiesテーブルから埼玉県のデータを削除
DELETE FROM cities WHERE prefecture_id = 'saitama';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_saitama',
  'saitama',
  'さいたま市',
  'さいたま市',
  '{"en":"Saitama"}'::jsonb,
  '市',
  'jp',
  35.8616402,
  139.6457957
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_hanno',
  'saitama',
  '飯能市',
  'はんのうし',
  '{"en":"Hanno"}'::jsonb,
  '市',
  'jp',
  35.8556902,
  139.3276436
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_chichibu',
  'saitama',
  '秩父市',
  'ちちぶし',
  '{"en":"Chichibu"}'::jsonb,
  '市',
  'jp',
  35.9914509,
  139.0857612
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kumagaya',
  'saitama',
  '熊谷市',
  '熊谷市',
  '{"en":"Kumagaya"}'::jsonb,
  '市',
  'jp',
  36.1472472,
  139.3886141
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_gyoda',
  'saitama',
  '行田市',
  'ぎょうだし',
  '{"en":"Gyoda"}'::jsonb,
  '市',
  'jp',
  36.1386052,
  139.4559001
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_hidaka',
  'saitama',
  '日高市',
  'ひだかし',
  '{"en":"Hidaka"}'::jsonb,
  '市',
  'jp',
  35.9077667,
  139.3390385
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kawagoe',
  'saitama',
  '川越市',
  '川越市',
  '{"en":"Kawagoe"}'::jsonb,
  '市',
  'jp',
  35.9251145,
  139.4856927
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kuki',
  'saitama',
  '久喜市',
  '久喜市',
  '{"en":"Kuki"}'::jsonb,
  '市',
  'jp',
  36.0617964,
  139.6671445
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_wako',
  'saitama',
  '和光市',
  'わこうし',
  '{"en":"Wako"}'::jsonb,
  '市',
  'jp',
  35.7817053,
  139.6058692
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_asaka',
  'saitama',
  '朝霞市',
  'あさかし',
  '{"en":"Asaka"}'::jsonb,
  '市',
  'jp',
  35.7970861,
  139.593733
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_niiza',
  'saitama',
  '新座市',
  'にいざし',
  '{"en":"Niiza"}'::jsonb,
  '市',
  'jp',
  35.7931194,
  139.5657258
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_ageo',
  'saitama',
  '上尾市',
  'あげおし',
  '{"en":"Ageo"}'::jsonb,
  '市',
  'jp',
  35.9774082,
  139.5930504
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_konosu',
  'saitama',
  '鴻巣市',
  'こうのすし',
  '{"en":"Konosu"}'::jsonb,
  '市',
  'jp',
  36.0657583,
  139.5221055
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kazo',
  'saitama',
  '加須市',
  '加須市',
  '{"en":"Kazo"}'::jsonb,
  '市',
  'jp',
  36.1308572,
  139.603225
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_okegawa',
  'saitama',
  '桶川市',
  'おけがわし',
  '{"en":"Okegawa"}'::jsonb,
  '市',
  'jp',
  36.0028937,
  139.5583422
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kitamoto',
  'saitama',
  '北本市',
  'きたもとし',
  '{"en":"Kitamoto"}'::jsonb,
  '市',
  'jp',
  36.0268711,
  139.5301389
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_fukaya',
  'saitama',
  '深谷市',
  '深谷市',
  '{"en":"Fukaya"}'::jsonb,
  '市',
  'jp',
  36.1974016,
  139.2816997
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_honjo',
  'saitama',
  '本庄市',
  'ほんじょうし',
  '{"en":"Honjo"}'::jsonb,
  '市',
  'jp',
  36.2435937,
  139.1916278
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_higashimatsuyama',
  'saitama',
  '東松山市',
  '東松山市',
  '{"en":"Higashimatsuyama"}'::jsonb,
  '市',
  'jp',
  36.0421523,
  139.399796
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_misato',
  'saitama',
  '三郷市',
  '三郷市',
  '{"en":"Misato"}'::jsonb,
  '市',
  'jp',
  35.8289993,
  139.8726811
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_tsurugashima',
  'saitama',
  '鶴ヶ島市',
  '鶴ヶ島市',
  '{"en":"Tsurugashima"}'::jsonb,
  '市',
  'jp',
  35.9346812,
  139.3929735
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_sayama',
  'saitama',
  '狭山市',
  '狭山市',
  '{"en":"Sayama"}'::jsonb,
  '市',
  'jp',
  35.8528971,
  139.4122999
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_tokorozawa',
  'saitama',
  '所沢市',
  '所沢市',
  '{"en":"Tokorozawa"}'::jsonb,
  '市',
  'jp',
  35.7987179,
  139.4696758
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_iruma',
  'saitama',
  '入間市',
  '入間市',
  '{"en":"Iruma"}'::jsonb,
  '市',
  'jp',
  35.8358142,
  139.3909293
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_fujimino',
  'saitama',
  'ふじみ野市',
  'ふじみ野市',
  '{"en":"Fujimino"}'::jsonb,
  '市',
  'jp',
  35.8794749,
  139.5195441
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_fujimi',
  'saitama',
  '富士見市',
  '富士見市',
  '{"en":"Fujimi"}'::jsonb,
  '市',
  'jp',
  35.8565545,
  139.5490731
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_shiki',
  'saitama',
  '志木市',
  '志木市',
  '{"en":"Shiki"}'::jsonb,
  '市',
  'jp',
  35.8373892,
  139.5795684
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_satte',
  'saitama',
  '幸手市',
  'さってし',
  '{"en":"Satte"}'::jsonb,
  '市',
  'jp',
  36.0778827,
  139.7254086
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kasukabe',
  'saitama',
  '春日部市',
  '春日部市',
  '{"en":"Kasukabe"}'::jsonb,
  '市',
  'jp',
  35.9757957,
  139.752019
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_hasuda',
  'saitama',
  '蓮田市',
  'はすだし',
  '{"en":"Hasuda"}'::jsonb,
  '市',
  'jp',
  35.994092,
  139.6632547
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_yoshikawa',
  'saitama',
  '吉川市',
  'よしかわし',
  '{"en":"Yoshikawa"}'::jsonb,
  '市',
  'jp',
  35.8962831,
  139.854504
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_soka',
  'saitama',
  '草加市',
  'そうかし',
  '{"en":"Soka"}'::jsonb,
  '市',
  'jp',
  35.8262233,
  139.8061784
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_yashio',
  'saitama',
  '八潮市',
  '八潮市',
  '{"en":"Yashio"}'::jsonb,
  '市',
  'jp',
  35.8226404,
  139.8386867
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_koshigaya',
  'saitama',
  '越谷市',
  '越谷市',
  '{"en":"Koshigaya"}'::jsonb,
  '市',
  'jp',
  35.8903993,
  139.7908633
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_kawaguchi',
  'saitama',
  '川口市',
  '川口市',
  '{"en":"Kawaguchi"}'::jsonb,
  '市',
  'jp',
  35.8078228,
  139.7241054
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_toda',
  'saitama',
  '戸田市',
  '戸田市',
  '{"en":"Toda"}'::jsonb,
  '市',
  'jp',
  35.8175874,
  139.6778944
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_warabi',
  'saitama',
  '蕨市',
  '蕨市',
  '{"en":"Warabi"}'::jsonb,
  '市',
  'jp',
  35.8263705,
  139.6791302
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_shiraoka',
  'saitama',
  '白岡市',
  'しらおかし',
  '{"en":"Shiraoka"}'::jsonb,
  '市',
  'jp',
  36.0186181,
  139.677099
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_sakado',
  'saitama',
  '坂戸市',
  'さかどし',
  '{"en":"Sakado"}'::jsonb,
  '市',
  'jp',
  35.9572312,
  139.4029048
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'saitama_hanyu',
  'saitama',
  '羽生市',
  'はにゅうし',
  '{"en":"Hanyu"}'::jsonb,
  '市',
  'jp',
  36.1724023,
  139.5484797
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_羽生',
  '羽生',
  '羽生',
  NULL,
  36.1766055,
  139.5292987,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877904137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_稲子',
  '稲子',
  '稲子',
  NULL,
  36.1866693,
  139.5444569,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877913158,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今泉',
  '今泉',
  '今泉',
  NULL,
  36.1812993,
  139.571093,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877921026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大沼',
  '大沼',
  '大沼',
  NULL,
  36.1679229,
  139.566452,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877937199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_尾崎',
  '尾崎',
  '尾崎',
  NULL,
  36.1877543,
  139.5532353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877947282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_加羽ケ崎',
  '加羽ケ崎',
  '加羽ケ崎',
  NULL,
  36.1552187,
  139.5420207,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877963657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kami_iwase',
  '上岩瀬',
  '上岩瀬',
  '{"en":"Kami-iwase"}'::jsonb,
  36.1635418,
  139.5154019,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  877985754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上川崎',
  '上川崎',
  '上川崎',
  NULL,
  36.1429794,
  139.5341534,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878023837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上新郷',
  '上新郷',
  '上新郷',
  NULL,
  36.1703374,
  139.5029124,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878047356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上川俣',
  '上川俣',
  '上川俣',
  NULL,
  36.1865406,
  139.5222344,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878047360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上手子林',
  '上手子林',
  '上手子林',
  NULL,
  36.1570195,
  139.5602577,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878118922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上羽生',
  '上羽生',
  '上羽生',
  NULL,
  36.1688588,
  139.5493774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878121031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上村君',
  '上村君',
  '上村君',
  NULL,
  36.1926555,
  139.5735597,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878122147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川崎',
  '川崎',
  '川崎',
  NULL,
  36.1435135,
  139.5458596,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878122225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_喜右エ門新田',
  '喜右エ門新田',
  '喜右エ門新田',
  NULL,
  36.1758596,
  139.5800084,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878124180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北',
  '北',
  '北',
  NULL,
  36.1755445,
  139.5342801,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878127381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北荻島',
  '北荻島',
  '北荻島',
  NULL,
  36.1680891,
  139.5803616,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878131027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北袋',
  '北袋',
  '北袋',
  NULL,
  36.1679692,
  139.5585177,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878135773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_桑崎',
  '桑崎',
  '桑崎',
  NULL,
  36.1738682,
  139.5223041,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878138852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小須賀',
  '小須賀',
  '小須賀',
  NULL,
  36.1819385,
  139.5133326,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878151570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小松',
  '小松',
  '小松',
  NULL,
  36.1560122,
  139.5278249,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878152387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小松台',
  '小松台',
  '小松台',
  NULL,
  36.1536839,
  139.5342578,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878152412,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_神戸',
  '神戸',
  '神戸',
  NULL,
  36.1423583,
  139.5598128,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878153117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimo_iwase',
  '下岩瀬',
  '下岩瀬',
  '{"en":"Shimo-iwase"}'::jsonb,
  36.1594198,
  139.5234846,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878155820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下川崎',
  '下川崎',
  '下川崎',
  NULL,
  36.1385905,
  139.5445117,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878159133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下新郷',
  '下新郷',
  '下新郷',
  NULL,
  36.1444487,
  139.5184246,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878161957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下新田',
  '下新田',
  '下新田',
  NULL,
  36.1566003,
  139.5120983,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878165331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下手子林',
  '下手子林',
  '下手子林',
  NULL,
  36.1549591,
  139.575466,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878167267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下羽生',
  '下羽生',
  '下羽生',
  NULL,
  36.1649032,
  139.5523623,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878169360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下村君',
  '下村君',
  '下村君',
  NULL,
  36.2015067,
  139.5847348,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878180171,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_須影',
  '須影',
  '須影',
  NULL,
  36.1491369,
  139.5463768,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878187552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_砂山',
  '砂山',
  '砂山',
  NULL,
  36.1473475,
  139.5304184,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878189236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中央',
  '中央',
  '中央',
  NULL,
  36.172734,
  139.5382976,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878191140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_堤',
  '堤',
  '堤',
  NULL,
  36.2020864,
  139.5920156,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878219206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_常木',
  '常木',
  '常木',
  NULL,
  36.1918457,
  139.5975148,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878219335,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中岩瀬',
  '中岩瀬',
  '中岩瀬',
  NULL,
  36.1626544,
  139.5342888,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878219538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日野手新田',
  '日野手新田',
  '日野手新田',
  NULL,
  36.1679138,
  139.5975335,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878224160,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西',
  '西',
  '西',
  NULL,
  36.1693425,
  139.5309826,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878224163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東',
  '東',
  '東',
  NULL,
  36.1732416,
  139.5467755,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878224164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_秀安',
  '秀安',
  '秀安',
  NULL,
  36.1584783,
  139.5494897,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878224166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中手子林',
  '中手子林',
  '中手子林',
  NULL,
  36.162854,
  139.5770674,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878224167,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_発戸',
  '発戸',
  '発戸',
  NULL,
  36.1905833,
  139.5640017,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878234557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤井上組',
  '藤井上組',
  '藤井上組',
  NULL,
  36.1809847,
  139.5504661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878234558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤井下組',
  '藤井下組',
  '藤井下組',
  NULL,
  36.1765888,
  139.5587155,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878234559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_町屋',
  '町屋',
  '町屋',
  NULL,
  36.1428357,
  139.567955,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本川俣',
  '本川俣',
  '本川俣',
  NULL,
  36.1863563,
  139.5346349,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238649,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_名',
  '名',
  '名',
  NULL,
  36.1986686,
  139.5994492,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_弥勒',
  '弥勒',
  '弥勒',
  NULL,
  36.1829384,
  139.5876112,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238651,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_与兵エ新田',
  '与兵エ新田',
  '与兵エ新田',
  NULL,
  36.1777545,
  139.5955732,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南羽生',
  '南羽生',
  '南羽生',
  NULL,
  36.1505553,
  139.5582993,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238653,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三田ケ谷',
  '三田ケ谷',
  '三田ケ谷',
  NULL,
  36.1758996,
  139.6029645,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  878238654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_chichibu_otaki',
  '大滝',
  '大滝',
  '{"en":"Otaki"}'::jsonb,
  35.9525367,
  138.9371768,
  NULL,
  'saitama',
  'saitama_chichibu',
  'jp',
  '埼玉県',
  NULL,
  '秩父市',
  NULL,
  2502721768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_chichibu_mitsumine',
  '三峰',
  '三峰',
  '{"en":"Mitsumine"}'::jsonb,
  35.9267142,
  138.9267752,
  NULL,
  'saitama',
  'saitama_chichibu',
  'jp',
  '埼玉県',
  NULL,
  '秩父市',
  NULL,
  2502724962,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_chichibu_arakawashiroku',
  '荒川白久',
  '荒川白久',
  '{"en":"Arakawashiroku"}'::jsonb,
  35.9592432,
  138.9793109,
  NULL,
  'saitama',
  'saitama_chichibu',
  'jp',
  '埼玉県',
  NULL,
  '秩父市',
  NULL,
  2502727606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_chichibu_arakawaniegawa',
  '荒川贄川',
  '荒川贄川',
  '{"en":"Arakawaniegawa"}'::jsonb,
  35.9658652,
  138.9774495,
  NULL,
  'saitama',
  'saitama_chichibu',
  'jp',
  '埼玉県',
  NULL,
  '秩父市',
  NULL,
  2502731486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamikocho',
  '上小町',
  'かみこちょう',
  '{"en":"Kamikocho"}'::jsonb,
  35.900605,
  139.6112282,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  2816157189,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kobushicho',
  'こぶし町',
  'こぶし町',
  '{"en":"Kobushicho"}'::jsonb,
  35.799888,
  139.48466,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_namiki_7_chome',
  '並木7',
  '並木7',
  '{"en":"Namiki 7-chome"}'::jsonb,
  35.8079204,
  139.4784515,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360077,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_元',
  '元町',
  '元町',
  NULL,
  35.789561,
  139.464911,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360093,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北所沢',
  '北所沢町',
  '北所沢町',
  NULL,
  35.811009,
  139.453573,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360099,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kita_yurakucho',
  '北有楽町',
  '北有楽町',
  '{"en":"Kita Yurakucho"}'::jsonb,
  35.795863,
  139.465918,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360100,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minami_sumiyoshi',
  '南住吉',
  '南住吉',
  '{"en":"Minami Sumiyoshi"}'::jsonb,
  35.78231,
  139.469301,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_向陽',
  '向陽町',
  '向陽町',
  NULL,
  35.811108,
  139.44759,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_喜多',
  '喜多町',
  '喜多町',
  NULL,
  35.799009,
  139.463179,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_堀之内',
  '堀之内',
  '堀之内',
  NULL,
  35.787023,
  139.394528,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上安松',
  '大字上安松',
  '大字上安松',
  NULL,
  35.787329,
  139.489907,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上山口',
  '大字上山口',
  '大字上山口',
  NULL,
  35.777297,
  139.423138,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下安松',
  '大字下安松',
  '大字下安松',
  NULL,
  35.787367,
  139.504722,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下富',
  '大字下富',
  '大字下富',
  NULL,
  35.833412,
  139.46153,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下新井',
  '下新井',
  '下新井',
  NULL,
  35.8087757,
  139.4946183,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中富',
  '大字中富',
  '大字中富',
  NULL,
  35.819263,
  139.486973,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中新井',
  '大字中新井',
  '大字中新井',
  NULL,
  35.8192088,
  139.4716727,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字久米',
  '大字久米',
  '大字久米',
  NULL,
  35.779447,
  139.46281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamegaya',
  '亀ケ谷',
  '亀ケ谷',
  '{"en":"Kamegaya"}'::jsonb,
  35.8082683,
  139.5178944,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字勝楽寺',
  '大字勝楽寺',
  '大字勝楽寺',
  NULL,
  35.7732336,
  139.3980264,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北岩岡',
  '大字北岩岡',
  '大字北岩岡',
  NULL,
  35.821219,
  139.447259,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北秋津',
  '大字北秋津',
  '大字北秋津',
  NULL,
  35.78164,
  139.47989,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南永井',
  '南永井',
  '南永井',
  NULL,
  35.8156718,
  139.52205,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakanoshita',
  '坂之下',
  '坂之下',
  '{"en":"Sakanoshita"}'::jsonb,
  35.8089068,
  139.5355483,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiro',
  '城',
  '城',
  '{"en":"Shiro"}'::jsonb,
  35.8028142,
  139.527495,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字山口',
  '大字山口',
  '大字山口',
  NULL,
  35.776053,
  139.435475,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitaharacho',
  '北原町',
  '北原町',
  '{"en":"Kitaharacho"}'::jsonb,
  35.8075173,
  139.4855865,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shingo',
  '新郷',
  '新郷',
  '{"en":"Shingo"}'::jsonb,
  35.8026655,
  139.5063888,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oaza_hongo',
  '大字本郷',
  '大字本郷',
  '{"en":"Oaza Hongo"}'::jsonb,
  35.793162,
  139.517461,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360190,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsugo',
  '松郷',
  'まつごう',
  '{"en":"Matsugo"}'::jsonb,
  35.797507,
  139.5012631,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oaza_ushinuma',
  '大字牛沼',
  '大字牛沼',
  '{"en":"Oaza Ushinuma"}'::jsonb,
  35.796419,
  139.490866,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360192,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字神米金',
  '大字神米金',
  '大字神米金',
  NULL,
  35.824418,
  139.466936,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360193,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字荒幡',
  '大字荒幡',
  '大字荒幡',
  NULL,
  35.777709,
  139.447383,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360194,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_寿',
  '寿町',
  '寿町',
  NULL,
  35.790022,
  139.467343,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360197,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小手指台',
  '小手指台',
  '小手指台',
  NULL,
  35.791411,
  139.441696,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岩岡',
  '岩岡町',
  '岩岡町',
  NULL,
  35.8169918,
  139.4424661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yayoicho',
  '弥生町',
  '弥生町',
  '{"en":"Yayoicho"}'::jsonb,
  35.80384,
  139.46153,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_御幸',
  '御幸町',
  '御幸町',
  NULL,
  35.792257,
  139.470319,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_所沢新',
  '所沢新町',
  '所沢新町',
  NULL,
  35.820167,
  139.460137,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360216,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日吉',
  '日吉町',
  '日吉町',
  NULL,
  35.787702,
  139.469482,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360217,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_旭',
  '旭町',
  '旭町',
  NULL,
  35.7913167,
  139.4750895,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yurakucho',
  '有楽町',
  '有楽町',
  '{"en":"Yurakucho"}'::jsonb,
  35.792564,
  139.4666,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashi_sumiyoshi',
  '東住吉',
  '東住吉',
  '{"en":"Higashi-Sumiyoshi"}'::jsonb,
  35.785204,
  139.470605,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東新井',
  '東新井町',
  '東新井町',
  NULL,
  35.797141,
  139.481416,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東_quarter',
  '東町',
  '東町',
  NULL,
  35.790288,
  139.471765,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsuba_ch',
  '松葉町',
  '松葉町',
  '{"en":"Matsuba-chō"}'::jsonb,
  35.8075448,
  139.4577187,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_enokicho',
  '榎町',
  '榎町',
  '{"en":"Enokicho"}'::jsonb,
  35.805518,
  139.444324,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_泉',
  '泉町',
  '泉町',
  NULL,
  35.80179,
  139.459114,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_糀谷',
  '糀谷',
  '糀谷',
  NULL,
  35.793077,
  139.391476,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_wakamatsucho',
  '若松町',
  '若松町',
  '{"en":"Wakamatsucho"}'::jsonb,
  35.802648,
  139.484424,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西住吉',
  '西住吉',
  '西住吉',
  NULL,
  35.785615,
  139.46702,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西新井',
  '西新井町',
  '西新井町',
  NULL,
  35.794448,
  139.476517,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_金山',
  '金山町',
  '金山町',
  NULL,
  35.790874,
  139.461657,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_aobadai',
  '青葉台',
  '青葉台',
  '{"en":"Aobadai"}'::jsonb,
  35.80752,
  139.441822,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日比田',
  '日比田',
  '日比田',
  NULL,
  35.8087033,
  139.5050058,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3048360333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otaarai',
  '太田新井',
  'おおたあらい',
  '{"en":"Otaarai"}'::jsonb,
  36.0047581,
  139.7056186,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4787860267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_maegoya',
  '前小屋',
  '前小屋',
  '{"en":"Maegoya"}'::jsonb,
  36.2318842,
  139.3217581,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4805473296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okaizumi',
  '岡泉',
  'おかいずみ',
  '{"en":"Okaizumi"}'::jsonb,
  36.007949,
  139.691118,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4805647898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sanagaya',
  '実ヶ谷',
  'さながや',
  '{"en":"Sanagaya"}'::jsonb,
  36.0050692,
  139.6752161,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4815460447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sendano',
  '千駄野',
  'せんだの',
  '{"en":"Sendano"}'::jsonb,
  36.0121297,
  139.6760633,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4819913323,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikobee',
  '彦兵衛',
  'ひこべえ',
  '{"en":"Hikobee"}'::jsonb,
  36.0130985,
  139.6997304,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4822242877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsumetagaya',
  '爪田ヶ谷',
  'つめたがや',
  '{"en":"Tsumetagaya"}'::jsonb,
  36.0212058,
  139.7005927,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4845583852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shibayama',
  '柴山',
  'しばやま',
  '{"en":"Shibayama"}'::jsonb,
  36.0366415,
  139.6143329,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4873985138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_araishinden',
  '荒井新田',
  'あらいしんでん',
  '{"en":"Araishinden"}'::jsonb,
  36.0366544,
  139.6273879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4901662647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koguki',
  '小久喜',
  'こぐき',
  '{"en":"Koguki"}'::jsonb,
  36.0130963,
  139.6670464,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  4910548427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoosaki',
  '下大崎',
  'しもおおさき',
  '{"en":"Shimoosaki"}'::jsonb,
  36.0409663,
  139.6305925,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5177953486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_monma',
  '百間',
  'もんま',
  '{"en":"Monma"}'::jsonb,
  36.0197867,
  139.722477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5275052419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashikumehara',
  '東粂原',
  'ひがしくめはら',
  '{"en":"Higashikumehara"}'::jsonb,
  36.029843,
  139.7031377,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5276805921,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamazaki',
  '山崎',
  'やまざき',
  '{"en":"Yamazaki"}'::jsonb,
  36.0148885,
  139.7189572,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5289365796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiraokahigashi',
  '白岡東',
  'しらおかひがし',
  '{"en":"Shiraokahigashi"}'::jsonb,
  36.022067,
  139.6611536,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5694595221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsurugaoka',
  '鶴ヶ丘',
  'つるがおか',
  '{"en":"Tsurugaoka"}'::jsonb,
  35.9328821,
  139.4161951,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鯨井新田',
  '鯨井新田',
  '鯨井新田',
  NULL,
  35.9342224,
  139.4236145,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_天沼新田',
  '天沼新田',
  '天沼新田',
  NULL,
  35.9363098,
  139.4266805,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihiroya',
  '上広谷',
  'かみひろや',
  '{"en":"Kamihiroya"}'::jsonb,
  35.941091,
  139.4171856,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_富士見',
  '富士見',
  '富士見',
  NULL,
  35.9510726,
  139.41618,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gomigaya',
  '五味ヶ谷',
  'ごみがや',
  '{"en":"Gomigaya"}'::jsonb,
  35.946283,
  139.4201302,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fujigane',
  '藤金',
  'ふじがね',
  '{"en":"Fujigane"}'::jsonb,
  35.9401807,
  139.406281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_関間',
  '関間',
  '関間',
  NULL,
  35.9514711,
  139.4015124,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_千代田',
  '千代田',
  '千代田',
  NULL,
  35.9562073,
  139.4066847,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_脚折',
  '脚折町',
  '脚折町',
  NULL,
  35.9458115,
  139.3909465,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_haneoricho',
  '羽折町',
  'はねおりちょう',
  '{"en":"Haneoricho"}'::jsonb,
  35.9502078,
  139.3817454,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoshinden',
  '下新田',
  'しもしんでん',
  '{"en":"Shimoshinden"}'::jsonb,
  35.944766,
  139.3806035,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_浅羽',
  '浅羽',
  '浅羽',
  NULL,
  35.9469285,
  139.3771125,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakashinden',
  '中新田',
  'なかしんでん',
  '{"en":"Nakashinden"}'::jsonb,
  35.9381792,
  139.3683436,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新',
  '新町',
  '新町',
  NULL,
  35.9350209,
  139.3724491,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamishinden',
  '上新田',
  'かみしんでん',
  '{"en":"Kamishinden"}'::jsonb,
  35.9315246,
  139.364074,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takakura',
  '高倉',
  'たかくら',
  '{"en":"Takakura"}'::jsonb,
  35.9343379,
  139.379896,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800617752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mitsugi',
  '三ツ木',
  'みつぎ',
  '{"en":"Mitsugi"}'::jsonb,
  35.9291626,
  139.3916436,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三ツ木新',
  '三ツ木新町',
  '三ツ木新町',
  NULL,
  35.923997,
  139.3896603,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanagidocho',
  '柳戸町',
  'やなぎどちょう',
  '{"en":"Yanagidocho"}'::jsonb,
  35.9221279,
  139.3920851,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621155,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otagaya',
  '太田ヶ谷',
  'おおたがや',
  '{"en":"Otagaya"}'::jsonb,
  35.9242943,
  139.400089,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621156,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南',
  '南町',
  '南町',
  NULL,
  35.9243831,
  139.4071734,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621157,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川鶴',
  '川鶴',
  '川鶴',
  NULL,
  35.9224478,
  139.4127326,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621158,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_松ヶ丘',
  '松ヶ丘',
  '松ヶ丘',
  NULL,
  35.9274047,
  139.4155797,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621159,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_吉田新',
  '吉田新町',
  '吉田新町',
  NULL,
  35.9276481,
  139.4193759,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621160,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_吉田',
  '吉田',
  '吉田',
  NULL,
  35.9304274,
  139.4275692,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621161,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_竹野',
  '竹野',
  '竹野',
  NULL,
  35.9549471,
  139.4248138,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621162,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_machiya',
  '町屋',
  'まちや',
  '{"en":"Machiya"}'::jsonb,
  35.9287251,
  139.3585585,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5800621166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_双柳',
  '双柳',
  '双柳',
  NULL,
  35.8556619,
  139.3415949,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6346292059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岩沢',
  '岩沢',
  '岩沢',
  NULL,
  35.8416122,
  139.3402684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6346334768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新光',
  '新光',
  '新光',
  NULL,
  35.8517031,
  139.3447308,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6346334770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oaza_nishimotojyuku',
  '大字西本宿',
  '大字西本宿',
  '{"en":"Oaza-Nishimotojyuku"}'::jsonb,
  36.0003637,
  139.3910709,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6399590828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ketsuka',
  '毛塚',
  '毛塚',
  '{"en":"Ketsuka"}'::jsonb,
  35.9955637,
  139.3964287,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6399590829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tagi',
  '田木',
  '田木',
  '{"en":"Tagi"}'::jsonb,
  35.989461,
  139.3886579,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6400642333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_正代',
  '正代',
  '正代',
  NULL,
  36.0006114,
  139.4116795,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6400642338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮鼻',
  '宮鼻',
  '宮鼻',
  NULL,
  35.9970718,
  139.4080808,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  6400642339,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oaza_iwadono',
  '大字岩殿',
  '大字岩殿',
  '{"en":"Oaza-Iwadono"}'::jsonb,
  36.0005445,
  139.3803856,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7247220029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hosoma',
  '細間',
  '細間',
  '{"en":"Hosoma"}'::jsonb,
  36.1575409,
  139.6463799,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimohiyarikawa',
  '下樋遣川',
  '下樋遣川',
  '{"en":"Shimohiyarikawa"}'::jsonb,
  36.1502122,
  139.625566,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakahiyarikawa',
  '中樋遣川',
  '中樋遣川',
  '{"en":"Nakahiyarikawa"}'::jsonb,
  36.1598711,
  139.6252334,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001617,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihiyarikawa',
  '上樋遣川',
  '上樋遣川',
  '{"en":"Kamihiyarikawa"}'::jsonb,
  36.1617248,
  139.630276,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001618,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_goe',
  '大越',
  '大越',
  '{"en":"Ōgoe"}'::jsonb,
  36.175678,
  139.6223152,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yahee',
  '弥兵衛',
  '弥兵衛',
  '{"en":"Yahee"}'::jsonb,
  36.1676958,
  139.6559393,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_zawa',
  '佐波',
  '佐波',
  '{"en":"Zawa"}'::jsonb,
  36.1721012,
  139.6435707,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sunahara',
  '砂原',
  '砂原',
  '{"en":"Sunahara"}'::jsonb,
  36.1636131,
  139.6458757,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sotono',
  '外野',
  '外野',
  '{"en":"Sotono"}'::jsonb,
  36.1754701,
  139.6320355,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296001722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitakobama',
  '北小浜',
  '北小浜',
  '{"en":"Kitakobama"}'::jsonb,
  36.1334816,
  139.6158349,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296140206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsunagashinden',
  '松永新田',
  '松永新田',
  '{"en":"Matsunagashinden"}'::jsonb,
  36.1411152,
  139.6369171,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296140210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimomitsumata',
  '下三俣',
  '下三俣',
  '{"en":"Shimomitsumata"}'::jsonb,
  36.1470327,
  139.6074986,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296140211,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamimitsumata',
  '上三俣',
  '上三俣',
  '{"en":"Kamimitsumata"}'::jsonb,
  36.1367916,
  139.6076059,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7296140212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_早俣',
  '早俣',
  '早俣',
  NULL,
  36.0055201,
  139.4190882,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7304548514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitahirano',
  '北平野',
  '北平野',
  '{"en":"Kitahirano"}'::jsonb,
  36.1464262,
  139.6533322,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7310839931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_d_me',
  '道目',
  '道目',
  '{"en":"Dōme"}'::jsonb,
  36.1492245,
  139.6477961,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7310839932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hideyasu',
  '日出安',
  '日出安',
  '{"en":"Hideyasu"}'::jsonb,
  36.1098093,
  139.5863414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7310839952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsunaga',
  '松永',
  '松永',
  '{"en":"Matsunaga"}'::jsonb,
  36.1277538,
  139.6896922,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340032178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_magama',
  '間鎌',
  '間鎌',
  '{"en":"Magama"}'::jsonb,
  36.1233038,
  139.6961939,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340032180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kurihashi',
  '栗橋',
  '栗橋',
  '{"en":"Kurihashi"}'::jsonb,
  36.1277148,
  139.705072,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340032181,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takayanagi',
  '高柳',
  '高柳',
  '{"en":"Takayanagi"}'::jsonb,
  36.1136014,
  139.6791458,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sama',
  '佐間',
  '佐間',
  '{"en":"Sama"}'::jsonb,
  36.1218176,
  139.6849823,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169919,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shakushigi',
  '杓子木',
  '杓子木',
  '{"en":"Shakushigi"}'::jsonb,
  36.1394257,
  139.6483326,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oide',
  '生出',
  '生出',
  '{"en":"Oide"}'::jsonb,
  36.1358472,
  139.6515834,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169923,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitaokuwa',
  '北大桑',
  '北大桑',
  '{"en":"Kitaokuwa"}'::jsonb,
  36.1265406,
  139.6456933,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_azama',
  '阿佐間',
  '阿佐間',
  '{"en":"Azama"}'::jsonb,
  36.1330397,
  139.6610999,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169925,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_makuchi',
  '間口',
  '間口',
  '{"en":"Makuchi"}'::jsonb,
  36.1275198,
  139.6677732,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_araishinden_quarter',
  '新井新田',
  '新井新田',
  '{"en":"Araishinden"}'::jsonb,
  36.1209856,
  139.6631169,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340169927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tajima',
  '田島',
  '田島',
  '{"en":"Tajima"}'::jsonb,
  36.2032479,
  139.379189,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340338726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yat_go',
  '弥藤吾',
  '弥藤吾',
  '{"en":"Yatōgo"}'::jsonb,
  36.2198684,
  139.372344,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340338740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamine',
  '上根',
  '上根',
  '{"en":"Kamine"}'::jsonb,
  36.2101476,
  139.381485,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340338760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_menuma',
  '妻沼',
  '妻沼',
  '{"en":"Menuma"}'::jsonb,
  36.2248884,
  139.3753374,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7340338761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakanara',
  '中奈良',
  '中奈良',
  '{"en":"Nakanara"}'::jsonb,
  36.1855502,
  139.3715608,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7341817281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_dai',
  '代',
  '代',
  '{"en":"Dai"}'::jsonb,
  36.1754182,
  139.3738675,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7341817284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_harajima',
  '原島',
  '原島',
  '{"en":"Harajima"}'::jsonb,
  36.1664887,
  139.3715715,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7342242385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_menuma_ch',
  '妻沼中央',
  '妻沼中央',
  '{"en":"Menuma Chūō"}'::jsonb,
  36.223694,
  139.3717754,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7342716047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_並木8',
  '並木8',
  '並木8',
  NULL,
  35.8105948,
  139.476961,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7376313731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_washinomiya',
  '鷲宮',
  '鷲宮',
  '{"en":"Washinomiya"}'::jsonb,
  36.1042575,
  139.6638358,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7468769472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawaguchi',
  '川口',
  '川口',
  '{"en":"Kawaguchi"}'::jsonb,
  36.1152395,
  139.6567118,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7468769477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下野本',
  '下野本',
  '下野本',
  NULL,
  36.0206843,
  139.4166774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野本',
  '上野本',
  '上野本',
  NULL,
  36.0249901,
  139.3990435,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下青鳥',
  '下青鳥',
  '下青鳥',
  NULL,
  36.0195756,
  139.3960436,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上押垂',
  '上押垂',
  'かみおしだり',
  NULL,
  36.0146281,
  139.3983041,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_石橋',
  '石橋',
  '石橋',
  NULL,
  36.0264772,
  139.3756293,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_葛袋',
  '葛袋',
  'くずぶくろ',
  NULL,
  36.0207025,
  139.3801397,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025958,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_godo',
  '神戸',
  '神戸',
  '{"en":"Godo"}'::jsonb,
  36.0173025,
  139.3517162,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025959,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高坂',
  '高坂',
  '高坂',
  NULL,
  36.000136,
  139.4048751,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大黒部',
  '大黒部',
  '大黒部',
  NULL,
  35.9967967,
  139.4039642,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7518025961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上中条',
  '上中条',
  '上中条',
  NULL,
  36.1796627,
  139.4097067,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7728509138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今井',
  '今井',
  '今井',
  NULL,
  36.1792978,
  139.3993917,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7728509208,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小曽根',
  '小曽根',
  '小曽根',
  NULL,
  36.1766046,
  139.3868065,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7728509209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_肥塚',
  '肥塚',
  '肥塚',
  NULL,
  36.1653454,
  139.3927342,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7728509265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下川上',
  '下川上',
  '下川上',
  NULL,
  36.1614736,
  139.4279623,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746068684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上川上',
  '上川上',
  '上川上',
  NULL,
  36.1645875,
  139.4037849,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746093185,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸出',
  '戸出',
  '戸出',
  NULL,
  36.1376321,
  139.404375,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746093186,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平戸',
  '平戸',
  '平戸',
  NULL,
  36.1415571,
  139.4093478,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746093187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上之',
  '上之',
  '上之',
  NULL,
  36.1509399,
  139.41284,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746093290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_箱田',
  '箱田',
  '箱田',
  NULL,
  36.1472883,
  139.4028729,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746093297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大塚',
  '大塚',
  '大塚',
  NULL,
  36.1677576,
  139.4208598,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746175346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_池上',
  '池上',
  '池上',
  NULL,
  36.1542145,
  139.4274473,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7746449246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新堀',
  '新堀',
  '新堀',
  NULL,
  36.1730192,
  139.3352222,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748204470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高柳',
  '高柳',
  '高柳',
  NULL,
  36.1738463,
  139.3422979,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748204484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久保島',
  '久保島',
  '久保島',
  NULL,
  36.1629981,
  139.3444061,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_玉井',
  '玉井',
  '玉井',
  NULL,
  36.1756174,
  139.3548238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_石原',
  '石原',
  '石原',
  NULL,
  36.1550115,
  139.365558,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新島',
  '新島',
  '新島',
  NULL,
  36.1638642,
  139.3593836,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_見晴',
  '見晴町',
  '見晴町',
  NULL,
  36.1422849,
  139.3730628,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榎',
  '榎町',
  '榎町',
  NULL,
  36.1402358,
  139.3777031,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205621,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮本',
  '宮本町',
  '宮本町',
  NULL,
  36.1425318,
  139.378615,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_伊勢',
  '伊勢町',
  '伊勢町',
  NULL,
  36.1439592,
  139.3748733,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205628,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_仲',
  '仲町',
  '仲町',
  NULL,
  36.1468767,
  139.3828744,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鎌倉',
  '鎌倉町',
  '鎌倉町',
  NULL,
  36.1439181,
  139.3815708,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7748205630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東別府',
  '東別府',
  '東別府',
  NULL,
  36.1949018,
  139.3506932,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7750123372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西別府',
  '西別府',
  '西別府',
  NULL,
  36.1907024,
  139.3336236,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7750123373,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_拾六間',
  '拾六間',
  '拾六間',
  NULL,
  36.1673029,
  139.3224817,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7750138392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新堀新田',
  '新堀新田',
  '新堀新田',
  NULL,
  36.1671513,
  139.3342298,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7750138393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_弥十郎',
  '弥十郎',
  '弥十郎',
  NULL,
  35.9200397,
  139.7932684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7797778221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大里',
  '大里',
  '大里',
  NULL,
  35.9186365,
  139.7854418,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7797778226,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大房',
  '大房',
  '大房',
  NULL,
  35.9098126,
  139.7831297,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7797778249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_御正新田',
  '御正新田',
  '御正新田',
  NULL,
  36.1213929,
  139.3564009,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_万吉',
  '万吉',
  '万吉',
  NULL,
  36.1290883,
  139.3726659,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平塚新田',
  '平塚新田',
  '平塚新田',
  NULL,
  36.1148755,
  139.3739319,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamata',
  '山田',
  'やまた',
  '{"en":"Yamata"}'::jsonb,
  36.0786038,
  139.3722368,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakao',
  '中尾',
  'なかお',
  '{"en":"Nakao"}'::jsonb,
  36.0656913,
  139.3487835,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukuda',
  '福田',
  'ふくだ',
  '{"en":"Fukuda"}'::jsonb,
  36.0866675,
  139.3510687,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_haneo',
  '羽尾',
  'はねお',
  '{"en":"Haneo"}'::jsonb,
  36.0515104,
  139.37258,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsuchishio',
  '土塩',
  'つちしお',
  '{"en":"Tsuchishio"}'::jsonb,
  36.0967851,
  139.3683529,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_野原',
  '野原',
  '野原',
  NULL,
  36.1030266,
  139.365896,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_村岡',
  '村岡',
  '村岡',
  NULL,
  36.1238628,
  139.3793821,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7798387834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_串作',
  '串作',
  '串作',
  NULL,
  36.1366963,
  139.5264745,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7802700595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_袋山',
  '袋山',
  '袋山',
  NULL,
  35.9227853,
  139.775877,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7814297146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大竹',
  '大竹',
  '大竹',
  NULL,
  35.9203438,
  139.765867,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7814297147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大道',
  '大道',
  '大道',
  NULL,
  35.9212474,
  139.7596872,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7814297148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_恩間',
  '恩間',
  '恩間',
  NULL,
  35.9248096,
  139.770062,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7814297149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大林',
  '大林',
  '大林',
  NULL,
  35.9117504,
  139.7782695,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816481408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小曽川',
  '小曽川',
  '小曽川',
  NULL,
  35.9189102,
  139.7539043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816481409,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_砂原',
  '砂原',
  '砂原',
  NULL,
  35.9135578,
  139.7566294,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816481410,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南荻島',
  '南荻島',
  '南荻島',
  NULL,
  35.9115244,
  139.7667146,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816481411,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niigatasuka',
  '新方須賀',
  'にいがたすか',
  '{"en":"Niigatasuka"}'::jsonb,
  35.9307867,
  139.7400964,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816496658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omori',
  '大森',
  'おおもり',
  '{"en":"Omori"}'::jsonb,
  35.9301179,
  139.7488618,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816496659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nojima',
  '野島',
  'のじま',
  '{"en":"Nojima"}'::jsonb,
  35.9242014,
  139.7492695,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816496660,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三野宮',
  '三野宮',
  '三野宮',
  NULL,
  35.9281892,
  139.7538185,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816496661,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下忍',
  '下忍',
  '下忍',
  NULL,
  36.1053844,
  139.4647622,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816551129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_広田',
  '広田',
  '広田',
  NULL,
  36.1105158,
  139.5092333,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7816551135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鴻巣',
  '鴻巣',
  '鴻巣',
  NULL,
  36.0693424,
  139.5165503,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817092027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_市ノ縄',
  '市ノ縄',
  '市ノ縄',
  NULL,
  36.0774505,
  139.5081711,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817092028,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安養寺',
  '安養寺',
  '安養寺',
  NULL,
  36.0760371,
  139.5190286,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817092029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_屈巣',
  '屈巣',
  '屈巣',
  NULL,
  36.0927278,
  139.5035684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817136628,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_関新田',
  '関新田',
  '関新田',
  NULL,
  36.104977,
  139.5306158,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817136629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北根',
  '北根',
  '北根',
  NULL,
  36.1144595,
  139.5228481,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817136634,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤城',
  '赤城',
  '赤城',
  NULL,
  36.1186716,
  139.5136213,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7817136635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤沼',
  '赤沼',
  '赤沼',
  NULL,
  35.9534317,
  139.7972917,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843277247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大泊',
  '大泊',
  '大泊',
  NULL,
  35.9384487,
  139.7852862,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843277272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平方',
  '平方',
  '平方',
  NULL,
  35.9487416,
  139.7844922,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843294087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平方南',
  '平方南町',
  '平方南町',
  NULL,
  35.9429309,
  139.7816813,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843294088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大畑',
  '大畑',
  '大畑',
  NULL,
  35.9479252,
  139.7732806,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843294089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大枝',
  '大枝',
  '大枝',
  NULL,
  35.9421752,
  139.7754264,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7843294090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishi_miya',
  '西大宮',
  'にしおおみや',
  '{"en":"Nishi-Ōmiya"}'::jsonb,
  35.9261469,
  139.5761273,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7868917594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiuchikawa',
  '上内川',
  'かみうちかわ',
  '{"en":"Kamiuchikawa"}'::jsonb,
  35.9310235,
  139.8462796,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7872545021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_蒲生',
  '蒲生',
  '蒲生',
  NULL,
  35.8602743,
  139.7916162,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7877862146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamihiroshima',
  '南広島',
  'みなみひろしま',
  '{"en":"Minamihiroshima"}'::jsonb,
  35.9172246,
  139.8460006,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880293385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_juikken',
  '拾壱軒',
  'じゅういっけん',
  '{"en":"Juikken"}'::jsonb,
  35.9218448,
  139.8382115,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880293386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_asahi',
  '旭',
  'あさひ',
  '{"en":"Asahi"}'::jsonb,
  35.9312212,
  139.8425674,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880293389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大杉',
  '大杉',
  '大杉',
  NULL,
  35.9324548,
  139.8040295,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880322631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下間久里',
  '下間久里',
  '下間久里',
  NULL,
  35.9250181,
  139.7878879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880345321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上間久里',
  '上間久里',
  '上間久里',
  NULL,
  35.9298051,
  139.7858548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7880345322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirasuka',
  '平須賀',
  'ひらすか',
  '{"en":"Hirasuka"}'::jsonb,
  36.066706,
  139.7478318,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890009581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiogi',
  '神扇',
  'かみおうぎ',
  '{"en":"Kamiogi"}'::jsonb,
  36.0607305,
  139.7457075,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890009582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tono',
  '遠野',
  'とおの',
  '{"en":"Tono"}'::jsonb,
  36.0533493,
  139.751147,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890009583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_motojima',
  '本島',
  'もとじま',
  '{"en":"Motojima"}'::jsonb,
  36.0460802,
  139.7484326,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890009584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuramatsu',
  '倉松',
  'くらまつ',
  '{"en":"Kuramatsu"}'::jsonb,
  36.0359995,
  139.7408366,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_seiji',
  '清地',
  'せいじ',
  '{"en":"Seiji"}'::jsonb,
  36.0327721,
  139.7494197,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_芦橋',
  '芦橋',
  '芦橋',
  NULL,
  36.0279826,
  139.7926998,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukawa',
  '深輪',
  'ふかわ',
  '{"en":"Fukawa"}'::jsonb,
  36.0354096,
  139.7899103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsubaki',
  '椿',
  'つばき',
  '{"en":"Tsubaki"}'::jsonb,
  36.0358607,
  139.7789883,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_倉常',
  '倉常',
  '倉常',
  NULL,
  36.0222037,
  139.7845888,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榎_quarter',
  '榎',
  '榎',
  NULL,
  36.0135953,
  139.7888803,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_立野',
  '立野',
  '立野',
  NULL,
  36.0079369,
  139.7872925,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上柳',
  '上柳',
  '上柳',
  NULL,
  35.9973305,
  139.7891593,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsutsumine',
  '堤根',
  'つつみね',
  '{"en":"Tsutsumine"}'::jsonb,
  36.017943,
  139.7567904,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055294,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otsuka',
  '大塚',
  'おおつか',
  '{"en":"Otsuka"}'::jsonb,
  36.0125626,
  139.7783661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_不動院野',
  '不動院野',
  '不動院野',
  NULL,
  36.0030071,
  139.7722077,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitahasunuma',
  '北蓮沼',
  'きたはすぬま',
  '{"en":"Kitahasunuma"}'::jsonb,
  36.0162855,
  139.7733235,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_saiba',
  '才羽',
  'さいば',
  '{"en":"Saiba"}'::jsonb,
  36.0269761,
  139.7677231,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sazaemon',
  '佐左ヱ門',
  'さざえもん',
  '{"en":"Sazaemon"}'::jsonb,
  36.0410661,
  139.7557711,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_narabitsuka',
  '並塚',
  'ならびつか',
  '{"en":"Narabitsuka"}'::jsonb,
  36.0356352,
  139.7675299,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagama',
  '長間',
  'ながま',
  '{"en":"Nagama"}'::jsonb,
  36.0487954,
  139.7662532,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakano',
  '中野',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  36.0548065,
  139.7577667,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirano',
  '平野',
  'ひらの',
  '{"en":"Hirano"}'::jsonb,
  36.0612595,
  139.7573161,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoyoshiba',
  '下吉羽',
  'しもよしば',
  '{"en":"Shimoyoshiba"}'::jsonb,
  36.0673652,
  139.7603845,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kidachi',
  '木立',
  'きだち',
  '{"en":"Kidachi"}'::jsonb,
  36.0779448,
  139.7551274,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinmeiuchi',
  '神明内',
  'しんめいうち',
  '{"en":"Shinmeiuchi"}'::jsonb,
  36.0743287,
  139.7442162,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_satte',
  '幸手',
  'さって',
  '{"en":"Satte"}'::jsonb,
  36.0742334,
  139.7296572,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gongendo',
  '権現堂',
  'ごんげんどう',
  '{"en":"Gongendo"}'::jsonb,
  36.0813611,
  139.7326183,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyoshiba',
  '上吉羽',
  'かみよしば',
  '{"en":"Kamiyoshiba"}'::jsonb,
  36.0784303,
  139.7376823,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7890055311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行北谷',
  '安行北谷',
  '安行北谷',
  NULL,
  35.8408817,
  139.7759253,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7899134562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新善',
  '新善町',
  '新善町',
  NULL,
  35.8493133,
  139.7839934,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7899134606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_金明',
  '金明町',
  '金明町',
  NULL,
  35.8552049,
  139.7892666,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7899134607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_学園',
  '学園町',
  '学園町',
  NULL,
  35.840399,
  139.7962779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7899134613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北谷',
  '北谷町',
  '北谷町',
  NULL,
  35.8464717,
  139.7867292,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7899604652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_青柳',
  '青柳町',
  '青柳町',
  NULL,
  35.8501351,
  139.8154825,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7927116304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柿木',
  '柿木町',
  '柿木町',
  NULL,
  35.8634393,
  139.8314094,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7927116392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八幡',
  '八幡町',
  '八幡町',
  NULL,
  35.8530483,
  139.806776,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7927116444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihikokawado',
  '上彦川戸',
  'かみひこかわど',
  '{"en":"Kamihikokawado"}'::jsonb,
  35.8491916,
  139.8633546,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下彦川戸',
  '下彦川戸',
  '下彦川戸',
  NULL,
  35.8458651,
  139.8612678,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikono',
  '彦野',
  'ひこの',
  '{"en":"Hikono"}'::jsonb,
  35.844865,
  139.8629093,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308892,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikokura',
  '彦倉',
  'ひこくら',
  '{"en":"Hikokura"}'::jsonb,
  35.8434517,
  139.8650604,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sasazuka',
  '笹塚',
  'ささづか',
  '{"en":"Sasazuka"}'::jsonb,
  35.8428299,
  139.8712993,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiguchi',
  '上口',
  'かみぐち',
  '{"en":"Kamiguchi"}'::jsonb,
  35.8413166,
  139.8690033,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_banshomen',
  '番匠免',
  'ばんしょうめん',
  '{"en":"Banshomen"}'::jsonb,
  35.8386291,
  139.87234,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yaguchi',
  '谷口',
  'やぐち',
  '{"en":"Yaguchi"}'::jsonb,
  35.8264081,
  139.8712992,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hanawada',
  '花和田',
  'はなわだ',
  '{"en":"Hanawada"}'::jsonb,
  35.8261559,
  139.8598301,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南蓮沼',
  '南蓮沼',
  '南蓮沼',
  NULL,
  35.8461782,
  139.8688209,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kiuri',
  '木売',
  'きうり',
  '{"en":"Kiuri"}'::jsonb,
  35.8774193,
  139.8501205,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308934,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平沼',
  '平沼',
  '平沼',
  NULL,
  35.8832784,
  139.8403251,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakagawadai',
  '中川台',
  'なかがわだい',
  '{"en":"Nakagawadai"}'::jsonb,
  35.8783756,
  139.8414946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308937,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ho',
  '保',
  'ほ',
  '{"en":"Ho"}'::jsonb,
  35.8805315,
  139.8424494,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_komagata',
  '駒形',
  'こまがた',
  '{"en":"Komagata"}'::jsonb,
  35.8485524,
  139.8606777,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308962,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihikona',
  '上彦名',
  'かみひこな',
  '{"en":"Kamihikona"}'::jsonb,
  35.8500916,
  139.8485219,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308982,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hachijo',
  '八條',
  'はちじょう',
  '{"en":"Hachijo"}'::jsonb,
  35.8504308,
  139.8361087,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7928308983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_遊馬',
  '遊馬町',
  '遊馬町',
  NULL,
  35.8196445,
  139.7774541,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7944621138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柳島',
  '柳島町',
  '柳島町',
  NULL,
  35.8222891,
  139.7860533,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7944621140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西_quarter',
  '西町',
  '西町',
  NULL,
  35.8298528,
  139.7909295,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7944621179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_氷川',
  '氷川町',
  '氷川町',
  NULL,
  35.8270039,
  139.7996813,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7944624999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_不動岡',
  '不動岡',
  '不動岡',
  NULL,
  36.1389838,
  139.5907831,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947063133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_馬内',
  '馬内',
  '馬内',
  NULL,
  36.1330078,
  139.5761746,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947063135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_礼羽',
  '礼羽',
  '礼羽',
  NULL,
  36.125674,
  139.5887124,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947063136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北堀',
  '北堀',
  '北堀',
  NULL,
  36.2225256,
  139.1918099,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947210465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山王堂',
  '山王堂',
  '山王堂',
  NULL,
  36.2605821,
  139.1855872,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947366337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_田中',
  '田中',
  '田中',
  NULL,
  36.2539465,
  139.1910696,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947366338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_jinboharamachi',
  '神保原町',
  'じんぼはらまち',
  '{"en":"Jinboharamachi"}'::jsonb,
  36.2550885,
  139.1524887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947366386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_都島',
  '都島',
  '都島',
  NULL,
  36.2585837,
  139.1775727,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947366387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_沼和田',
  '沼和田',
  '沼和田',
  NULL,
  36.2537734,
  139.1820145,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7947366394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鎌塚',
  '鎌塚',
  '鎌塚',
  NULL,
  36.1111832,
  139.4557071,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7972694363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三本',
  '三本',
  '三本',
  NULL,
  36.1297989,
  139.3221116,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_塩',
  '塩',
  '塩',
  NULL,
  36.1028446,
  139.320631,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_板井',
  '板井',
  '板井',
  NULL,
  36.1093457,
  139.3111682,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_須賀広',
  '須賀広',
  '須賀広',
  NULL,
  36.1075254,
  139.3388486,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小江川',
  '小江川',
  '小江川',
  NULL,
  36.1042488,
  139.3351793,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柴',
  '柴',
  '柴',
  NULL,
  36.1162622,
  139.3247509,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_千代',
  '千代',
  '千代',
  NULL,
  36.1208383,
  139.3277764,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_成沢',
  '成沢',
  '成沢',
  NULL,
  36.1254314,
  139.3472171,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_押切',
  '押切',
  '押切',
  NULL,
  36.1121713,
  139.3469596,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_樋春',
  '樋春',
  '樋春',
  NULL,
  36.1329704,
  139.3499422,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7993967363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_naranashi',
  '奈良梨',
  'ならなし',
  '{"en":"Naranashi"}'::jsonb,
  36.0845086,
  139.2886591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994078228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoyokota',
  '下横田',
  'しもよこた',
  '{"en":"Shimoyokota"}'::jsonb,
  36.0723429,
  139.2917275,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994078229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyokota',
  '上横田',
  'かみよこた',
  '{"en":"Kamiyokota"}'::jsonb,
  36.0761238,
  139.2859769,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994078230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otsubata',
  '越畑',
  'おつばた',
  '{"en":"Otsubata"}'::jsonb,
  36.0795576,
  139.3016195,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994091799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshida',
  '吉田',
  'よしだ',
  '{"en":"Yoshida"}'::jsonb,
  36.0865461,
  139.3141722,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994091800,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_furusato',
  '古里',
  'ふるさと',
  '{"en":"Furusato"}'::jsonb,
  36.103278,
  139.2982399,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994091801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishifurusato',
  '西古里',
  'にしふるさと',
  '{"en":"Nishifurusato"}'::jsonb,
  36.0959268,
  139.2958367,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994091802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koya',
  '高谷',
  'こうや',
  '{"en":"Koya"}'::jsonb,
  36.0748664,
  139.2730378,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  7994148640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinmachi',
  '新町',
  'しんまち',
  '{"en":"Shinmachi"}'::jsonb,
  35.8382029,
  139.8317528,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kosakuda',
  '小作田',
  'こさくだ',
  '{"en":"Kosakuda"}'::jsonb,
  35.8301402,
  139.8335913,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsurugasone',
  '鶴ケ曽根',
  'つるがそね',
  '{"en":"Tsurugasone"}'::jsonb,
  35.8318534,
  139.8382115,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_igusa',
  '伊草',
  'いぐさ',
  '{"en":"Igusa"}'::jsonb,
  35.8304965,
  139.8286521,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamiushiroya',
  '南後谷',
  'みなみうしろや',
  '{"en":"Minamiushiroya"}'::jsonb,
  35.8266691,
  139.8194361,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanaginomiya',
  '柳之宮',
  'やなぎのみや',
  '{"en":"Yanaginomiya"}'::jsonb,
  35.8228415,
  139.8235881,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishibukuro',
  '西袋',
  'にしぶくろ',
  '{"en":"Nishibukuro"}'::jsonb,
  35.8178654,
  139.8205304,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8016064503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行藤八',
  '安行藤八',
  '安行藤八',
  NULL,
  35.8569005,
  139.7625142,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017877652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行吉蔵',
  '安行吉蔵',
  '安行吉蔵',
  NULL,
  35.8512961,
  139.7720146,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017877661,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行',
  '安行',
  '安行',
  NULL,
  35.8539538,
  139.7572865,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017877666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行原',
  '安行原',
  '安行原',
  NULL,
  35.8404817,
  139.769783,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017891076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行小山',
  '安行小山',
  '安行小山',
  NULL,
  35.8370113,
  139.7761559,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017891077,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_苗塚',
  '苗塚町',
  '苗塚町',
  NULL,
  35.8338888,
  139.7836661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8017891080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下大増新田',
  '下大増新田',
  '下大増新田',
  NULL,
  35.9560892,
  139.7416305,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043624774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷原新田',
  '谷原新田',
  '谷原新田',
  NULL,
  35.9624635,
  139.7440982,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043624775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上大増新田',
  '上大増新田',
  '上大増新田',
  NULL,
  35.9634013,
  139.7386908,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043624776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koguki_quarter',
  '古久喜',
  'こぐき',
  '{"en":"Koguki"}'::jsonb,
  36.0781789,
  139.6751654,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043686953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_noguki',
  '野久喜',
  'のぐき',
  '{"en":"Noguki"}'::jsonb,
  36.0727809,
  139.6842903,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043686954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshiba',
  '吉羽',
  'よしば',
  '{"en":"Yoshiba"}'::jsonb,
  36.059178,
  139.6941018,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8043686957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増田新田',
  '増田新田',
  '増田新田',
  NULL,
  35.9488285,
  139.7491193,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067480898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_一ノ割',
  '一ノ割',
  '一ノ割',
  NULL,
  35.961074,
  139.7547412,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067480903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_薄谷',
  '薄谷',
  '薄谷',
  NULL,
  35.9572182,
  139.7530353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067480904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_武里中野',
  '武里中野',
  '武里中野',
  NULL,
  35.9514949,
  139.7551381,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067480905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_osone',
  '大曽根',
  'おおそね',
  '{"en":"Osone"}'::jsonb,
  35.8045535,
  139.8277402,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067757386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daibara',
  '大原',
  'だいばら',
  '{"en":"Daibara"}'::jsonb,
  35.8074075,
  139.8344779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067757387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsunoki',
  '松之木',
  'まつのき',
  '{"en":"Matsunoki"}'::jsonb,
  35.8271193,
  139.8274157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8067757408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tomida',
  '富田',
  '富田',
  '{"en":"Tomida"}'::jsonb,
  36.1052023,
  139.2450142,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8074681597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東富田',
  '東富田',
  '東富田',
  NULL,
  36.2248538,
  139.1767573,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090146608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西富田',
  '西富田',
  '西富田',
  NULL,
  36.2302543,
  139.164741,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090146612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_四方田',
  '四方田',
  '四方田',
  NULL,
  36.2233824,
  139.1677236,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090146613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字広木',
  '大字広木',
  '大字広木',
  NULL,
  36.1725082,
  139.1570806,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町秋山',
  '児玉町秋山',
  '児玉町秋山',
  NULL,
  36.1754528,
  139.1384554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町上真下',
  '児玉町上真下',
  '児玉町上真下',
  NULL,
  36.2066935,
  139.1297865,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町金屋',
  '児玉町金屋',
  '児玉町金屋',
  NULL,
  36.1841128,
  139.1210317,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町児玉',
  '児玉町児玉',
  '児玉町児玉',
  NULL,
  36.1883385,
  139.1374683,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215414,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町八幡山',
  '児玉町八幡山',
  '児玉町八幡山',
  NULL,
  36.1940533,
  139.1309452,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215415,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町吉田林',
  '児玉町吉田林',
  '児玉町吉田林',
  NULL,
  36.1990317,
  139.1359663,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町下真下',
  '児玉町下真下',
  '児玉町下真下',
  NULL,
  36.2179987,
  139.1469311,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町蛭川',
  '児玉町蛭川',
  '児玉町蛭川',
  NULL,
  36.2073688,
  139.1477251,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町入浅見',
  '児玉町入浅見',
  '児玉町入浅見',
  NULL,
  36.205343,
  139.1557717,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町下浅見',
  '児玉町下浅見',
  '児玉町下浅見',
  NULL,
  36.2140862,
  139.166007,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町高関',
  '児玉町高関',
  '児玉町高関',
  NULL,
  36.2173928,
  139.159441,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今井_quarter',
  '今井',
  '今井',
  NULL,
  36.2264463,
  139.154098,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8090215468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西方',
  '西方',
  '西方',
  NULL,
  35.881166,
  139.7983217,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8092486014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小曽川_quarter',
  '小曽川',
  '小曽川',
  NULL,
  35.900627,
  139.7536951,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8092811492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北後谷',
  '北後谷',
  '北後谷',
  NULL,
  35.8957253,
  139.754591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8092811493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_長島',
  '長島',
  '長島',
  NULL,
  35.8852777,
  139.7507071,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8092811494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西新井_quarter',
  '西新井',
  '西新井',
  NULL,
  35.8897107,
  139.7562217,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8092811503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitahara',
  '北原',
  'きたはら',
  '{"en":"Kitahara"}'::jsonb,
  35.8842867,
  139.7191,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8093025196,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mamiya',
  '間宮',
  'まみや',
  '{"en":"Mamiya"}'::jsonb,
  35.8822179,
  139.7236705,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8093025197,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daimon',
  '大門',
  'だいもん',
  '{"en":"Daimon"}'::jsonb,
  35.884917,
  139.7303653,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8093025198,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kagiage_shinden',
  '釣上新田',
  'かぎあげしんでん',
  '{"en":"Kagiage-shinden"}'::jsonb,
  35.8908059,
  139.740901,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8093067531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kagiage',
  '釣上',
  'かぎあげ',
  '{"en":"Kagiage"}'::jsonb,
  35.8972028,
  139.747982,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8093067532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawafuji',
  '川藤',
  'かわふじ',
  '{"en":"Kawafuji"}'::jsonb,
  35.9038773,
  139.8412585,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8117715199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_suka',
  '須賀',
  'すか',
  '{"en":"Suka"}'::jsonb,
  35.8976895,
  139.8352289,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8117715200,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増森',
  '増森',
  '増森',
  NULL,
  35.9051634,
  139.8299718,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8117715201,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増林',
  '増林',
  '増林',
  NULL,
  35.9131581,
  139.8066044,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8117715217,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_越ヶ谷',
  '越ヶ谷',
  '越ヶ谷',
  NULL,
  35.9022087,
  139.791702,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8117715229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omagi',
  '大間木',
  'おおまぎ',
  '{"en":"Omagi"}'::jsonb,
  35.8732551,
  139.6945846,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8120104767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakao_quarter',
  '中尾',
  'なかお',
  '{"en":"Nakao"}'::jsonb,
  35.8724814,
  139.6844378,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8120104768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_芝',
  '芝',
  '芝',
  NULL,
  35.8396033,
  139.6909046,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8120104769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hasumishinden',
  '蓮見新田',
  'はすみしんでん',
  '{"en":"Hasumishinden"}'::jsonb,
  35.8701688,
  139.7112089,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8120171653,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minuma',
  '見沼',
  'みぬま',
  '{"en":"Minuma"}'::jsonb,
  35.882583,
  139.7003353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8120171656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行領家',
  '安行領家',
  '安行領家',
  NULL,
  35.8460304,
  139.7567582,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤山',
  '赤山',
  '赤山',
  NULL,
  35.848448,
  139.7449994,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新井宿',
  '新井宿',
  '新井宿',
  NULL,
  35.8458217,
  139.7372532,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大竹_quarter',
  '大竹',
  '大竹',
  NULL,
  35.8319752,
  139.7636676,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東貝塚',
  '東貝塚',
  '東貝塚',
  NULL,
  35.8352631,
  139.7627127,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_前野宿',
  '前野宿',
  '前野宿',
  NULL,
  35.8321492,
  139.7584533,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行慈林',
  '安行慈林',
  '安行慈林',
  NULL,
  35.8387248,
  139.7500205,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行吉岡',
  '安行吉岡',
  '安行吉岡',
  NULL,
  35.8370114,
  139.7539044,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤井',
  '赤井',
  '赤井',
  NULL,
  35.83201,
  139.7519946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153434513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東本郷',
  '東本郷',
  '東本郷',
  NULL,
  35.8249032,
  139.7646868,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153454428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榛松',
  '榛松',
  '榛松',
  NULL,
  35.8251207,
  139.7737956,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8153454429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_永沼',
  '永沼',
  '永沼',
  NULL,
  35.9746374,
  139.7906184,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154293906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小渕',
  '小渕',
  '小渕',
  NULL,
  35.9949695,
  139.7497415,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154293912,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_樋堀',
  '樋堀',
  '樋堀',
  NULL,
  35.9851774,
  139.7640538,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154293913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_牛島',
  '牛島',
  '牛島',
  NULL,
  35.9852989,
  139.7746968,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154293914,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤塚',
  '藤塚',
  '藤塚',
  NULL,
  35.9725015,
  139.7776043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154293915,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_粕壁',
  '粕壁',
  '粕壁',
  NULL,
  35.9825382,
  139.7448706,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8154299032,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ukizuka',
  '浮塚',
  'うきづか',
  '{"en":"Ukizuka"}'::jsonb,
  35.7990181,
  139.8246729,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8184801698,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gake',
  '垳',
  'がけ',
  '{"en":"Gake"}'::jsonb,
  35.8022679,
  139.8420376,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8184801699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuroya',
  '黒谷',
  'くろや',
  '{"en":"Kuroya"}'::jsonb,
  35.9207174,
  139.7270608,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204016126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takasone',
  '高曽根',
  'たかそね',
  '{"en":"Takasone"}'::jsonb,
  35.9192577,
  139.7393131,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204016127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sasakubo',
  '笹久保',
  'ささくぼ',
  '{"en":"Sasakubo"}'::jsonb,
  35.9183715,
  139.7186279,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ogasaki',
  '尾ケ崎',
  'おがさき',
  '{"en":"Ogasaki"}'::jsonb,
  35.9112638,
  139.7288847,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamishimoarai',
  '南下新井',
  'みなみしもあらい',
  '{"en":"Minamishimoarai"}'::jsonb,
  35.9329326,
  139.720087,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_murakuni',
  '村国',
  'むらくに',
  '{"en":"Murakuni"}'::jsonb,
  35.9428874,
  139.7212887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_onojima',
  '大野島',
  'おおのじま',
  '{"en":"Onojima"}'::jsonb,
  35.9423532,
  139.7323554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oto',
  '大戸',
  'おおと',
  '{"en":"Oto"}'::jsonb,
  35.9334798,
  139.7373605,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iizuka',
  '飯塚',
  'いいづか',
  '{"en":"Iizuka"}'::jsonb,
  35.9373108,
  139.7215462,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8204059743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_六軒',
  '六軒町',
  '六軒町',
  NULL,
  35.9669964,
  139.7836769,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208717849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_銚子口',
  '銚子口',
  '銚子口',
  NULL,
  35.9578782,
  139.7861337,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208717920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤崎',
  '赤崎',
  '赤崎',
  NULL,
  35.9630713,
  139.803772,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_飯沼',
  '飯沼',
  '飯沼',
  NULL,
  35.968351,
  139.8126983,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_suikaku',
  '水角',
  '水角',
  '{"en":"Suikaku"}'::jsonb,
  35.9691672,
  139.7954678,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_米崎',
  '米崎',
  '米崎',
  NULL,
  35.9711817,
  139.8061323,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_米島',
  '米島',
  '米島',
  NULL,
  35.9785445,
  139.8080742,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大衾',
  '大衾',
  '大衾',
  NULL,
  35.9819305,
  139.8039329,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西金野井',
  '西金野井',
  '西金野井',
  NULL,
  35.9872609,
  139.811604,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_金崎',
  '金崎',
  '金崎',
  NULL,
  35.9890145,
  139.8010683,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上金崎',
  '上金崎',
  '上金崎',
  NULL,
  36.0000907,
  139.8011541,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新川',
  '新川',
  '新川',
  NULL,
  35.9876429,
  139.7806191,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_樋籠',
  '樋籠',
  '樋籠',
  NULL,
  35.9910458,
  139.7709846,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8208718151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_梅田',
  '梅田',
  '梅田',
  NULL,
  35.9935806,
  139.7389054,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242070994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omotejionji',
  '表慈恩寺',
  'おもてじおんじ',
  '{"en":"Omotejionji"}'::jsonb,
  35.9752626,
  139.7059035,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_jionji',
  '慈恩寺',
  'じおんじ',
  '{"en":"Jionji"}'::jsonb,
  35.9814269,
  139.7109675,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_urajionji',
  '裏慈恩寺',
  'うらじおんじ',
  '{"en":"Urajionji"}'::jsonb,
  35.9871372,
  139.7096425,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_komizo',
  '小溝',
  'こみぞ',
  '{"en":"Komizo"}'::jsonb,
  35.9819695,
  139.721353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_内牧',
  '内牧',
  '内牧',
  NULL,
  35.9954035,
  139.724915,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南栄',
  '南栄町',
  '南栄町',
  NULL,
  35.98055,
  139.733026,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増戸',
  '増戸',
  '増戸',
  NULL,
  35.9575221,
  139.7247326,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tokuriki',
  '徳力',
  'とくりき',
  '{"en":"Tokuriki"}'::jsonb,
  35.9714943,
  139.7181773,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_花積',
  '花積',
  '花積',
  NULL,
  35.966484,
  139.7175336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下蛭田',
  '下蛭田',
  '下蛭田',
  NULL,
  35.9625851,
  139.7218466,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_道口蛭田',
  '道口蛭田',
  '道口蛭田',
  NULL,
  35.9686288,
  139.7225332,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上蛭田',
  '上蛭田',
  '上蛭田',
  NULL,
  35.9651555,
  139.727726,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増富',
  '増富',
  '増富',
  NULL,
  35.9639918,
  139.733541,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南中曽根',
  '南中曽根',
  '南中曽根',
  NULL,
  35.9726751,
  139.7303867,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新方袋',
  '新方袋',
  '新方袋',
  NULL,
  35.9778846,
  139.7297859,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八木崎',
  '八木崎町',
  '八木崎町',
  NULL,
  35.9781798,
  139.7388625,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8242093318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_峯',
  '峯',
  '峯',
  NULL,
  35.8329146,
  139.772079,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新堀_quarter',
  '新堀',
  '新堀',
  NULL,
  35.8297136,
  139.782207,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷塚上',
  '谷塚上町',
  '谷塚上町',
  NULL,
  35.8159166,
  139.7897494,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新里',
  '新里町',
  '新里町',
  NULL,
  35.8132021,
  139.7779477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_両新田東',
  '両新田東町',
  '両新田東町',
  NULL,
  35.8126279,
  139.7870994,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_両新田西',
  '両新田西町',
  '両新田西町',
  NULL,
  35.8137415,
  139.7841167,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷塚',
  '谷塚町',
  '谷塚町',
  NULL,
  35.8164212,
  139.7975707,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷塚仲',
  '谷塚仲町',
  '谷塚仲町',
  NULL,
  35.8122451,
  139.792217,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8260956790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_前田',
  '前田',
  '前田',
  NULL,
  35.8148117,
  139.7298074,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261073961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久左衛門新田',
  '久左衛門新田',
  '久左衛門新田',
  NULL,
  35.8658651,
  139.7630453,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤兵衛新田',
  '藤兵衛新田',
  '藤兵衛新田',
  NULL,
  35.8673519,
  139.7657275,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤芝新田',
  '赤芝新田',
  '赤芝新田',
  NULL,
  35.8539961,
  139.7459006,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_石神',
  '石神',
  '石神',
  NULL,
  35.8587787,
  139.7354078,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西立野',
  '西立野',
  '西立野',
  NULL,
  35.8577875,
  139.7450852,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行西立野',
  '安行西立野',
  '安行西立野',
  NULL,
  35.8564179,
  139.7549236,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8261580504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大場',
  '大場',
  '大場',
  NULL,
  35.9483248,
  139.7653198,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8270089116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagamiya',
  '長宮',
  'ながみや',
  '{"en":"Nagamiya"}'::jsonb,
  35.9503224,
  139.7282195,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272819559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mashinaga',
  '増長',
  'ましなが',
  '{"en":"Mashinaga"}'::jsonb,
  35.94796,
  139.7389269,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272819560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oguchi',
  '大口',
  'おおぐち',
  '{"en":"Oguchi"}'::jsonb,
  35.9427832,
  139.7433579,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272819561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oya',
  '大谷',
  'おおや',
  '{"en":"Oya"}'::jsonb,
  35.9377712,
  139.740268,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272819562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_恩間新田',
  '恩間新田',
  '恩間新田',
  NULL,
  35.9408722,
  139.7567582,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272819563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_osaki',
  '大崎',
  'おおさき',
  '{"en":"Osaki"}'::jsonb,
  35.8873464,
  139.7084141,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_genbashinden',
  '玄蕃新田',
  'げんばしんでん',
  '{"en":"Genbashinden"}'::jsonb,
  35.8913621,
  139.7141003,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nanburyotsuji',
  '南部領辻',
  'なんぶりょうつじ',
  '{"en":"Nanburyotsuji"}'::jsonb,
  35.8959599,
  139.7131776,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_terayama',
  '寺山',
  'てらやま',
  '{"en":"Terayama"}'::jsonb,
  35.9058587,
  139.7062468,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takabatake',
  '高畑',
  'たかばたけ',
  '{"en":"Takabatake"}'::jsonb,
  35.9149828,
  139.7024274,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kaminoda',
  '上野田',
  'かみのだ',
  '{"en":"Kaminoda"}'::jsonb,
  35.9082745,
  139.6988225,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daiyama',
  '代山',
  'だいやま',
  '{"en":"Daiyama"}'::jsonb,
  35.9022261,
  139.7075557,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sasakubo_shinden',
  '笹久保新田',
  'ささくぼしんでん',
  '{"en":"Sasakubo-shinden"}'::jsonb,
  35.9130147,
  139.7127056,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ogasaki_shinden',
  '尾ケ崎新田',
  'おがさきしんでん',
  '{"en":"Ogasaki-shinden"}'::jsonb,
  35.9061715,
  139.722898,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimonoda',
  '下野田',
  'しものだ',
  '{"en":"Shimonoda"}'::jsonb,
  35.8930309,
  139.723928,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakanoda',
  '中野田',
  'なかのだ',
  '{"en":"Nakanoda"}'::jsonb,
  35.8999144,
  139.7179198,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8272991594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新井',
  '新井',
  '新井',
  NULL,
  36.2642241,
  139.1702986,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8274232656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shichihongi',
  '七本木',
  'しちほんぎ',
  '{"en":"Shichihongi"}'::jsonb,
  36.2447838,
  139.1460835,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8274232657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下野堂',
  '下野堂',
  '下野堂',
  NULL,
  36.246471,
  139.1610825,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8274232662,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_杉山',
  '杉山',
  '杉山',
  NULL,
  36.2587394,
  139.1687751,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8274232669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小島',
  '小島',
  '小島',
  NULL,
  36.2568707,
  139.1658139,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8274232670,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町塩谷',
  '児玉町塩谷',
  '児玉町塩谷',
  NULL,
  36.188148,
  139.107213,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町宮内',
  '児玉町宮内',
  '児玉町宮内',
  NULL,
  36.1864162,
  139.0886736,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808950,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町飯倉',
  '児玉町飯倉',
  '児玉町飯倉',
  NULL,
  36.1850827,
  139.0992307,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町保木野',
  '児玉町保木野',
  '児玉町保木野',
  NULL,
  36.2011702,
  139.1159248,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町田端',
  '児玉町田端',
  '児玉町田端',
  NULL,
  36.1958023,
  139.1098737,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_wataruse',
  '渡瀬',
  'わたるせ',
  '{"en":"Wataruse"}'::jsonb,
  36.1712957,
  139.0629029,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808963,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinshuku',
  '新宿',
  'しんしゅく',
  '{"en":"Shinshuku"}'::jsonb,
  36.1900616,
  139.069072,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808964,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ikeda',
  '池田',
  'いけだ',
  '{"en":"Ikeda"}'::jsonb,
  36.193603,
  139.0788031,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ninomiya',
  '二ノ宮',
  'にのみや',
  '{"en":"Ninomiya"}'::jsonb,
  36.1917501,
  139.0828157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808966,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kobama',
  '小浜',
  'こばま',
  '{"en":"Kobama"}'::jsonb,
  36.2067187,
  139.0812058,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nukui',
  '貫井',
  'ぬくい',
  '{"en":"Nukui"}'::jsonb,
  36.2104505,
  139.0888667,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niisato',
  '新里',
  'にいさと',
  '{"en":"Niisato"}'::jsonb,
  36.1991442,
  139.0981257,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808969,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakaniisato',
  '中新里',
  'なかにいさと',
  '{"en":"Nakaniisato"}'::jsonb,
  36.2090136,
  139.0953254,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kumanodo',
  '熊野堂',
  'くまのどう',
  '{"en":"Kumanodo"}'::jsonb,
  36.2140862,
  139.1242933,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yokaichi',
  '八日市',
  'ようかいち',
  '{"en":"Yokaichi"}'::jsonb,
  36.2092214,
  139.1169977,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uetake',
  '植竹',
  'うえたけ',
  '{"en":"Uetake"}'::jsonb,
  36.2153024,
  139.1001588,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sekiguchi',
  '関口',
  'せきぐち',
  '{"en":"Sekiguchi"}'::jsonb,
  36.2210109,
  139.1008401,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hido',
  '肥土',
  'ひど',
  '{"en":"Hido"}'::jsonb,
  36.222931,
  139.0936785,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shikenzaike',
  '四軒在家',
  'しけんざいけ',
  '{"en":"Shikenzaike"}'::jsonb,
  36.2304274,
  139.1018271,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280808998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_motoabo',
  '元阿保',
  'もとあぼ',
  '{"en":"Motoabo"}'::jsonb,
  36.2258924,
  139.1053033,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280809016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_harashinden',
  '原新田',
  'はらしんでん',
  '{"en":"Harashinden"}'::jsonb,
  36.2185873,
  139.1180062,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_motohara',
  '元原',
  'もとはら',
  '{"en":"Motohara"}'::jsonb,
  36.2197126,
  139.126718,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町共栄',
  '児玉町共栄',
  '児玉町共栄',
  NULL,
  36.2165792,
  139.1360736,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_共栄',
  '共栄',
  '共栄',
  NULL,
  36.2215821,
  139.1423178,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fujikido',
  '藤木戸',
  'ふじきど',
  '{"en":"Fujikido"}'::jsonb,
  36.2394101,
  139.1226196,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagahama',
  '長浜',
  'ながはま',
  '{"en":"Nagahama"}'::jsonb,
  36.2379737,
  139.1059685,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gomyo',
  '五明',
  'ごみょう',
  '{"en":"Gomyo"}'::jsonb,
  36.2468171,
  139.1155386,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tatewaki',
  '帯刀',
  'たてわき',
  '{"en":"Tatewaki"}'::jsonb,
  36.2494993,
  139.1233921,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsutsumi',
  '堤',
  'つつみ',
  '{"en":"Tsutsumi"}'::jsonb,
  36.2427503,
  139.1346574,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omido',
  '大御堂',
  'おおみどう',
  '{"en":"Omido"}'::jsonb,
  36.228359,
  139.1236817,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mimachi',
  '三町',
  'みまち',
  '{"en":"Mimachi"}'::jsonb,
  36.2356026,
  139.1307521,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kami',
  '嘉美',
  'かみ',
  '{"en":"Kami"}'::jsonb,
  36.2301505,
  139.1459656,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8280817282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町長沖',
  '児玉町長沖',
  '児玉町長沖',
  NULL,
  36.1799042,
  139.1259026,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町小平',
  '児玉町小平',
  '児玉町小平',
  NULL,
  36.1683509,
  139.1183066,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町太駄',
  '児玉町太駄',
  '児玉町太駄',
  NULL,
  36.1350154,
  139.0764212,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町高柳',
  '児玉町高柳',
  '児玉町高柳',
  NULL,
  36.1747383,
  139.1130307,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町稲沢',
  '児玉町稲沢',
  '児玉町稲沢',
  NULL,
  36.1623398,
  139.0858626,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町元田',
  '児玉町元田',
  '児玉町元田',
  NULL,
  36.1651635,
  139.0991878,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_児玉町河内',
  '児玉町河内',
  '児玉町河内',
  NULL,
  36.1551847,
  139.096806,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiaguhara',
  '上阿久原',
  'かみあぐはら',
  '{"en":"Kamiaguhara"}'::jsonb,
  36.1440957,
  139.0485048,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yano',
  '矢納',
  'やのう',
  '{"en":"Yano"}'::jsonb,
  36.119365,
  139.026103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoaguhara',
  '下阿久原',
  'しもあぐはら',
  '{"en":"Shimoaguhara"}'::jsonb,
  36.1470587,
  139.0613365,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8282250797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ukiya',
  '浮谷',
  'うきや',
  '{"en":"Ukiya"}'::jsonb,
  35.9289885,
  139.7125554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinpukuji',
  '真福寺',
  'しんぷくじ',
  '{"en":"Shinpukuji"}'::jsonb,
  35.9364247,
  139.7068476,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kashiwazaki',
  '柏崎',
  'かしわざき',
  '{"en":"Kashiwazaki"}'::jsonb,
  35.9362857,
  139.6979427,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ueno',
  '上野',
  'うえの',
  '{"en":"Ueno"}'::jsonb,
  35.9663343,
  139.702237,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_magome',
  '馬込',
  'まごめ',
  '{"en":"Magome"}'::jsonb,
  35.9688372,
  139.6641683,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_heirinji',
  '平林寺',
  'へいりんじ',
  '{"en":"Heirinji"}'::jsonb,
  35.9666664,
  139.6760988,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kake',
  '掛',
  'かけ',
  '{"en":"Kake"}'::jsonb,
  35.9719285,
  139.6855402,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanashige',
  '金重',
  'かなしげ',
  '{"en":"Kanashige"}'::jsonb,
  35.9664754,
  139.6835661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minowa',
  '箕輪',
  'みのわ',
  '{"en":"Minowa"}'::jsonb,
  35.9589529,
  139.6829331,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_honjuku',
  '本宿',
  'ほんじゅく',
  '{"en":"Honjuku"}'::jsonb,
  35.9653378,
  139.6915483,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamitsuji',
  '南辻',
  'みなみつじ',
  '{"en":"Minamitsuji"}'::jsonb,
  35.9625091,
  139.7019151,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285627307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanamuro',
  '鹿室',
  'かなむろ',
  '{"en":"Kanamuro"}'::jsonb,
  35.9956508,
  139.699906,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285673148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ainohara',
  '相野原',
  'あいのはら',
  '{"en":"Ainohara"}'::jsonb,
  35.9872088,
  139.6969771,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285673149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kokaba',
  '古ケ場',
  'こかば',
  '{"en":"Kokaba"}'::jsonb,
  35.9830244,
  139.6960759,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8285673180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nomago',
  '野孫',
  'のまご',
  '{"en":"Nomago"}'::jsonb,
  35.909352,
  139.7402573,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8304889402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新郷',
  '新郷',
  '新郷',
  NULL,
  36.0350434,
  139.3605721,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313646193,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下唐子',
  '下唐子',
  '下唐子',
  NULL,
  36.0313062,
  139.3565213,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313646194,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上唐子',
  '上唐子',
  '上唐子',
  NULL,
  36.0378168,
  139.3390555,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313646195,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_青鳥',
  '青鳥',
  '青鳥',
  NULL,
  36.0356221,
  139.3821536,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313646196,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柏崎',
  '柏崎',
  '柏崎',
  NULL,
  36.0259093,
  139.4205012,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665629,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今泉_quarter',
  '今泉',
  '今泉',
  NULL,
  36.0111733,
  139.4331271,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_古凍',
  '古凍',
  '古凍',
  NULL,
  36.0136497,
  139.4368026,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_松山',
  '松山',
  '松山',
  NULL,
  36.0519749,
  139.4052166,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_市ノ川',
  '市ノ川',
  '市ノ川',
  NULL,
  36.0507059,
  139.3916864,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_野田',
  '野田',
  '野田',
  NULL,
  36.0575831,
  139.3900133,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665637,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東平',
  '東平',
  '東平',
  NULL,
  36.0682536,
  139.4086926,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大谷',
  '大谷',
  '大谷',
  NULL,
  36.0747675,
  139.3944615,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡',
  '岡',
  '岡',
  NULL,
  36.0912572,
  139.4048357,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8313665642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町台',
  '菖蒲町台',
  '菖蒲町台',
  NULL,
  36.0527942,
  139.6265101,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8329221288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町河原井',
  '菖蒲町河原井',
  '菖蒲町河原井',
  NULL,
  36.0440069,
  139.6322071,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8329221299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町上大崎',
  '菖蒲町上大崎',
  '菖蒲町上大崎',
  NULL,
  36.052135,
  139.6114898,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8329247035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町三箇',
  '菖蒲町三箇',
  '菖蒲町三箇',
  NULL,
  36.061936,
  139.6202016,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8329247036,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_除堀',
  '除堀',
  '除堀',
  NULL,
  36.0484397,
  139.6413803,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354376905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鴻茎',
  '鴻茎',
  '鴻茎',
  NULL,
  36.092355,
  139.5864272,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354376906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_芋茎',
  '芋茎',
  '芋茎',
  NULL,
  36.0815519,
  139.594624,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町下栢間',
  '菖蒲町下栢間',
  '菖蒲町下栢間',
  NULL,
  36.0350799,
  139.5820283,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町上栢間',
  '菖蒲町上栢間',
  '菖蒲町上栢間',
  NULL,
  36.0476417,
  139.5691108,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町柴山枝郷',
  '菖蒲町柴山枝郷',
  '菖蒲町柴山枝郷',
  NULL,
  36.0486479,
  139.5991087,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町小林',
  '菖蒲町小林',
  '菖蒲町小林',
  NULL,
  36.0533667,
  139.5842599,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町菖蒲',
  '菖蒲町菖蒲',
  '菖蒲町菖蒲',
  NULL,
  36.0716839,
  139.6046447,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町新堀',
  '菖蒲町新堀',
  '菖蒲町新堀',
  NULL,
  36.0678335,
  139.5909977,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8354402526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yajita',
  '谷下',
  'やじた',
  '{"en":"Yajita"}'::jsonb,
  35.9329847,
  139.6882009,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kofukasaku',
  '小深作',
  'こふかさく',
  '{"en":"Kofukasaku"}'::jsonb,
  35.9413695,
  139.6669793,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781177,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyagayato',
  '宮ヶ谷塔',
  'みやがやとう',
  '{"en":"Miyagayato"}'::jsonb,
  35.939135,
  139.6794462,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781182,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashimiyashita',
  '東宮下',
  'ひがしみやした',
  '{"en":"Higashimiyashita"}'::jsonb,
  35.9344789,
  139.6768713,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781186,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiyamamura_shinden',
  '西山村新田',
  'にしやまむらしんでん',
  '{"en":"Nishiyamamura-shinden"}'::jsonb,
  35.8993581,
  139.6686852,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiyama_shinden',
  '西山新田',
  'にしやましんでん',
  '{"en":"Nishiyama-shinden"}'::jsonb,
  35.8986976,
  139.6734166,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyama',
  '見山',
  'みやま',
  '{"en":"Miyama"}'::jsonb,
  35.8959512,
  139.6821284,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781189,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_katayanagi_higashi',
  '片柳東',
  'かたやなぎひがし',
  '{"en":"Katayanagi-higashi"}'::jsonb,
  35.9049027,
  139.6937799,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781192,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_katayanagi',
  '片柳',
  'かたやなぎ',
  '{"en":"Katayanagi"}'::jsonb,
  35.9021044,
  139.6853041,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781193,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yama',
  '山',
  'やま',
  '{"en":"Yama"}'::jsonb,
  35.9047115,
  139.6784913,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781195,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_someya',
  '染谷',
  'そめや',
  '{"en":"Someya"}'::jsonb,
  35.9116635,
  139.6793818,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781196,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hizako',
  '膝子',
  'ひざこ',
  '{"en":"Hizako"}'::jsonb,
  35.9213082,
  139.6896386,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oya_quarter',
  '大谷',
  'おおや',
  '{"en":"Oya"}'::jsonb,
  35.9200919,
  139.6735668,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781203,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niizutsumi',
  '新堤',
  'にいづつみ',
  '{"en":"Niizutsumi"}'::jsonb,
  35.929058,
  139.672451,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781204,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_futtono',
  '風渡野',
  'ふっとの',
  '{"en":"Futtono"}'::jsonb,
  35.9349827,
  139.6675801,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashimonzen',
  '東門前',
  'ひがしもんぜん',
  '{"en":"Higashimonzen"}'::jsonb,
  35.931573,
  139.6687388,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hasunuma',
  '蓮沼',
  'はすぬま',
  '{"en":"Hasunuma"}'::jsonb,
  35.9275463,
  139.6635782,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781207,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minaminakamaru',
  '南中丸',
  'みなみなかまる',
  '{"en":"Minaminakamaru"}'::jsonb,
  35.9175721,
  139.653697,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781208,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shin_uemonshinden',
  '新右ェ門新田',
  'しんうえもんしんでん',
  '{"en":"Shin-Uemonshinden"}'::jsonb,
  35.9051504,
  139.6497139,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyamaguchi_shinden',
  '上山口新田',
  'かみやまぐちしんでん',
  '{"en":"Kamiyamaguchi-shinden"}'::jsonb,
  35.8977764,
  139.6528172,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakagawa',
  '中川',
  'なかがわ',
  '{"en":"Nakagawa"}'::jsonb,
  35.9032341,
  139.6557355,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781211,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minaminakano',
  '南中野',
  'みなみなかの',
  '{"en":"Minaminakano"}'::jsonb,
  35.910612,
  139.6562183,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mikura',
  '御蔵',
  'みくら',
  '{"en":"Mikura"}'::jsonb,
  35.9041684,
  139.6694845,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashiarai',
  '東新井',
  'ひがしあらい',
  '{"en":"Higashiarai"}'::jsonb,
  35.909969,
  139.6700692,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8360781214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_horisakicho',
  '堀崎町',
  'ほりさきちょう',
  '{"en":"Horisakicho"}'::jsonb,
  35.939135,
  139.6537614,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8378244047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mimuro',
  '三室',
  'みむろ',
  '{"en":"Mimuro"}'::jsonb,
  35.8851646,
  139.6762275,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8420075144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_misaki',
  '三崎',
  'みさき',
  '{"en":"Misaki"}'::jsonb,
  35.8922574,
  139.6598017,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8420075146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukasaku',
  '深作',
  'ふかさく',
  '{"en":"Fukasaku"}'::jsonb,
  35.9527542,
  139.6546035,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8439994209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_marugasaki',
  '丸ヶ崎',
  'まるがさき',
  '{"en":"Marugasaki"}'::jsonb,
  35.9627587,
  139.661454,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8440005222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_marugasakicho',
  '丸ヶ崎町',
  'まるがさきちょう',
  '{"en":"Marugasakicho"}'::jsonb,
  35.9559329,
  139.6503281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8440005223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimacho',
  '島町',
  'しまちょう',
  '{"en":"Shimacho"}'::jsonb,
  35.9443554,
  139.6524954,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8440005233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上尾下',
  '上尾下',
  '上尾下',
  NULL,
  35.9721889,
  139.6122837,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441508247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_瓦葺',
  '瓦葺',
  '瓦葺',
  NULL,
  35.9600319,
  139.6383977,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441508248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_五番',
  '五番町',
  '五番町',
  NULL,
  35.9663191,
  139.6200728,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441508250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原',
  '原市',
  '原市',
  NULL,
  35.9590419,
  139.627465,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441508253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上尾',
  '上尾村',
  '上尾村',
  NULL,
  35.9874693,
  139.5970058,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441748320,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平塚',
  '平塚',
  '平塚',
  NULL,
  35.9878512,
  139.604516,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441748321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_二ツ宮',
  '二ツ宮',
  '二ツ宮',
  NULL,
  35.9798219,
  139.6013157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8441748322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kasahara',
  '笠原',
  'かさはら',
  '{"en":"Kasahara"}'::jsonb,
  36.0670514,
  139.2366157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sugiyama',
  '杉山',
  'すぎやま',
  '{"en":"Sugiyama"}'::jsonb,
  36.0621098,
  139.3175035,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_taguro',
  '田黒',
  'たぐろ',
  '{"en":"Taguro"}'::jsonb,
  36.0251305,
  139.2995103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nomasu',
  '能増',
  'のうます',
  '{"en":"Nomasu"}'::jsonb,
  36.0871814,
  139.2790524,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawashima',
  '川島',
  'かわしま',
  '{"en":"Kawashima"}'::jsonb,
  36.0500948,
  139.3353918,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_banjo',
  '番匠',
  'ばんじょう',
  '{"en":"Banjo"}'::jsonb,
  36.0021855,
  139.2909217,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_negishi',
  '根岸',
  'ねぎし',
  '{"en":"Negishi"}'::jsonb,
  36.0262421,
  139.3357414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_setomotokami',
  '瀬戸元上',
  'せともとかみ',
  '{"en":"Setomotokami"}'::jsonb,
  35.9971917,
  139.2735748,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ogawa',
  '小川',
  'おがわ',
  '{"en":"Ogawa"}'::jsonb,
  36.0573372,
  139.2722196,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otsuka_quarter',
  '大塚',
  'おおつか',
  '{"en":"Otsuka"}'::jsonb,
  36.0582687,
  139.2554874,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishidaira',
  '西平',
  'にしだいら',
  '{"en":"Nishidaira"}'::jsonb,
  36.0058327,
  139.2474953,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shogunsawa',
  '将軍澤',
  'しょうぐんさわ',
  '{"en":"Shogunsawa"}'::jsonb,
  36.0204318,
  139.3307628,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_senjudo',
  '千手堂',
  'せんじゅどう',
  '{"en":"Senjudo"}'::jsonb,
  36.0378721,
  139.311857,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kumogawara',
  '雲河原',
  'くもがわら',
  '{"en":"Kumogawara"}'::jsonb,
  36.0127099,
  139.2467019,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_masuo',
  '増尾',
  'ますお',
  '{"en":"Masuo"}'::jsonb,
  36.0551208,
  139.2493004,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kachida',
  '勝田',
  'かちだ',
  '{"en":"Kachida"}'::jsonb,
  36.0819375,
  139.3249867,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_bessho',
  '別所',
  'べっしょ',
  '{"en":"Bessho"}'::jsonb,
  36.0086823,
  139.2615147,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sekibori',
  '関堀',
  'せきぼり',
  '{"en":"Sekibori"}'::jsonb,
  36.0007914,
  139.2761823,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kiroko',
  '木呂子',
  'きろこ',
  '{"en":"Kiroko"}'::jsonb,
  36.0800715,
  139.2122863,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakatsume',
  '中爪',
  'なかつめ',
  '{"en":"Nakatsume"}'::jsonb,
  36.0643542,
  139.2984904,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461347516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiga',
  '志賀',
  'しが',
  '{"en":"Shiga"}'::jsonb,
  36.0538041,
  139.3168708,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361317,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirono',
  '廣野',
  'ひろの',
  '{"en":"Hirono"}'::jsonb,
  36.0639483,
  139.3232654,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kunugidaira',
  '椚平',
  'くぬぎだいら',
  '{"en":"Kunugidaira"}'::jsonb,
  35.9785449,
  139.2246863,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361319,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okura',
  '大蔵',
  'おおくら',
  '{"en":"Okura"}'::jsonb,
  36.0305257,
  139.3297677,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361320,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hongo',
  '本郷',
  'ほんごう',
  '{"en":"Hongo"}'::jsonb,
  36.0092054,
  139.2744035,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimofurutera',
  '下古寺',
  'しもふるてら',
  '{"en":"Shimofurutera"}'::jsonb,
  36.0417736,
  139.2428483,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_setomotoshimo',
  '瀬戸元下',
  'せともとしも',
  '{"en":"Setomotoshimo"}'::jsonb,
  35.9922811,
  139.272488,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimozato',
  '下里',
  'しもざと',
  '{"en":"Shimozato"}'::jsonb,
  36.0429085,
  139.2852388,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361326,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yukie',
  '靭負',
  'ゆきえ',
  '{"en":"Yukie"}'::jsonb,
  36.0744862,
  139.2420023,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361328,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tamagawa',
  '玉川',
  'たまがわ',
  '{"en":"Tamagawa"}'::jsonb,
  36.0108626,
  139.2978809,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirasawa',
  '平澤',
  'ひらさわ',
  '{"en":"Hirasawa"}'::jsonb,
  36.0461197,
  139.3121426,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takami',
  '高見',
  'たかみ',
  '{"en":"Takami"}'::jsonb,
  36.093306,
  139.2718779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sugaya',
  '菅谷',
  'すがや',
  '{"en":"Sugaya"}'::jsonb,
  36.0402418,
  139.3245946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gomyo_quarter',
  '五明',
  'ごみょう',
  '{"en":"Gomyo"}'::jsonb,
  36.0200383,
  139.2757662,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_haragawa',
  '原川',
  'はらがわ',
  '{"en":"Haragawa"}'::jsonb,
  36.0703534,
  139.2437364,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361335,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hanamidai',
  '花見台',
  'はなみだい',
  '{"en":"Hanamidai"}'::jsonb,
  36.0776704,
  139.3189528,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_momonoki',
  '桃木',
  'もものき',
  '{"en":"Momonoki"}'::jsonb,
  36.0018331,
  139.262667,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takanosu',
  '鷹巣',
  'たかのす',
  '{"en":"Takanosu"}'::jsonb,
  36.0915966,
  139.2849362,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tanaka',
  '田中',
  'たなか',
  '{"en":"Tanaka"}'::jsonb,
  36.0060735,
  139.2708533,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koshigoe',
  '腰越',
  'こしごえ',
  '{"en":"Koshigoe"}'::jsonb,
  36.0453928,
  139.2324659,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361341,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamifurutera',
  '上古寺',
  'かみふるてら',
  '{"en":"Kamifurutera"}'::jsonb,
  36.0339187,
  139.2353259,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361343,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kakuyama',
  '角山',
  'かくやま',
  '{"en":"Kakuyama"}'::jsonb,
  36.067263,
  139.2564101,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ono',
  '大野',
  'おおの',
  '{"en":"Ono"}'::jsonb,
  35.9973779,
  139.2014444,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kibe',
  '木部',
  'きべ',
  '{"en":"Kibe"}'::jsonb,
  36.0732202,
  139.2321944,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361347,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikage',
  '日影',
  'ひかげ',
  '{"en":"Hikage"}'::jsonb,
  36.024113,
  139.2597398,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361348,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_toyama',
  '遠山',
  'とおやま',
  '{"en":"Toyama"}'::jsonb,
  36.037735,
  139.2954665,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otsuki',
  '大附',
  'おおつき',
  '{"en":"Otsuki"}'::jsonb,
  35.9886427,
  139.2567318,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_isene',
  '伊勢根',
  'いせね',
  '{"en":"Isene"}'::jsonb,
  36.0834402,
  139.277548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_taromaru',
  '太郎丸',
  'たろうまる',
  '{"en":"Taromaru"}'::jsonb,
  36.0573002,
  139.3310038,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361352,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_banba',
  '馬場',
  'ばんば',
  '{"en":"Banba"}'::jsonb,
  35.9986526,
  139.2812859,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_aoyama',
  '青山',
  'あおやま',
  '{"en":"Aoyama"}'::jsonb,
  36.0453419,
  139.2529397,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_suguro',
  '勝呂',
  'すぐろ',
  '{"en":"Suguro"}'::jsonb,
  36.0747572,
  139.2221983,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamagata',
  '鎌形',
  'かまがた',
  '{"en":"Kamagata"}'::jsonb,
  36.0229102,
  139.3106593,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iida',
  '飯田',
  'いいだ',
  '{"en":"Iida"}'::jsonb,
  36.0621206,
  139.2455638,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8461361359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamada',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  36.0150095,
  139.1181696,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_onobara',
  '荒川小野原',
  'あらかわおのばら',
  '{"en":"Arakawa-Onobara"}'::jsonb,
  35.9644292,
  139.0124706,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakuragimachi',
  '桜木町',
  'さくらぎまち',
  '{"en":"Sakuragimachi"}'::jsonb,
  36.0034067,
  139.0833902,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883811,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uenomachi',
  '上野町',
  'うえのまち',
  '{"en":"Uenomachi"}'::jsonb,
  35.995089,
  139.08658,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sadamine',
  '定峰',
  'さだみね',
  '{"en":"Sadamine"}'::jsonb,
  36.0214744,
  139.1407857,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ikota',
  '伊古田',
  'いこた',
  '{"en":"Ikota"}'::jsonb,
  36.0422206,
  139.0598298,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883814,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakatsugawa',
  '中津川',
  'なかつがわ',
  '{"en":"Nakatsugawa"}'::jsonb,
  36.0026366,
  138.8095365,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takinouemachi',
  '滝の上町',
  'たきのうえまち',
  '{"en":"Takinouemachi"}'::jsonb,
  36.0107625,
  139.088394,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462883816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_aioicho',
  '相生町',
  'あいおいちょう',
  '{"en":"Aioicho"}'::jsonb,
  36.0062901,
  139.0869508,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_obashira',
  '小柱',
  'おばしら',
  '{"en":"Obashira"}'::jsonb,
  36.0613082,
  139.0878679,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoyoshida',
  '下吉田',
  'しもよしだ',
  '{"en":"Shimoyoshida"}'::jsonb,
  36.0371579,
  139.0262656,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimokagemori',
  '下影森',
  'しもかげもり',
  '{"en":"Shimokagemori"}'::jsonb,
  35.9840443,
  139.0711443,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kumagimachi',
  '熊木町',
  'くまぎまち',
  '{"en":"Kumagimachi"}'::jsonb,
  35.9911271,
  139.088232,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_niegawa',
  '荒川贄川',
  'あらかわにえがわ',
  '{"en":"Arakawa-Niegawa"}'::jsonb,
  35.969439,
  138.9811461,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896823,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_izumicho',
  '和泉町',
  'いずみちょう',
  '{"en":"Izumicho"}'::jsonb,
  35.983634,
  139.06624,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896824,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinazawa',
  '品沢',
  'しなざわ',
  '{"en":"Shinazawa"}'::jsonb,
  36.0361231,
  139.0637015,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_obatakemachi',
  '大畑町',
  'おおばたけまち',
  '{"en":"Obatakemachi"}'::jsonb,
  36.0161374,
  139.0901546,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagatamachi',
  '永田町',
  'ながたまち',
  '{"en":"Nagatamachi"}'::jsonb,
  36.0082314,
  139.085582,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshida_aguma',
  '吉田阿熊',
  'よしだあぐま',
  '{"en":"Yoshida-Aguma"}'::jsonb,
  36.0606584,
  139.0235798,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omiya',
  '大宮',
  'おおみや',
  '{"en":"Omiya"}'::jsonb,
  36.0107792,
  139.0963603,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_otaki',
  '大滝',
  'おおたき',
  '{"en":"Otaki"}'::jsonb,
  35.9444271,
  138.8506642,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuna',
  '久那',
  'くな',
  '{"en":"Kuna"}'::jsonb,
  35.9730623,
  139.049394,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanamuromachi',
  '金室町',
  'かなむろまち',
  '{"en":"Kanamuromachi"}'::jsonb,
  36.0089381,
  139.0803846,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshida_isama',
  '吉田石間',
  'よしだいさま',
  '{"en":"Yoshida-Isama"}'::jsonb,
  36.0799731,
  138.9924274,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshida_hisanaga',
  '吉田久長',
  'よしだひさなが',
  '{"en":"Yoshida-Hisanaga"}'::jsonb,
  36.0590884,
  139.048221,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_chikatomachi',
  '近戸町',
  'ちかとまち',
  '{"en":"Chikatomachi"}'::jsonb,
  35.9937844,
  139.0732203,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_shiroku',
  '荒川白久',
  'あらかわしろく',
  '{"en":"Arakawa-Shiroku"}'::jsonb,
  35.9573288,
  138.9930222,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashimachi',
  '東町',
  'ひがしまち',
  '{"en":"Higashimachi"}'::jsonb,
  35.9928214,
  139.0827013,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tochiya',
  '栃谷',
  'とちや',
  '{"en":"Tochiya"}'::jsonb,
  36.026228,
  139.120613,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakamachi',
  '中町',
  'なかまち',
  '{"en":"Nakamachi"}'::jsonb,
  35.9946043,
  139.0793877,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_kuna',
  '荒川久那',
  'あらかわくな',
  '{"en":"Arakawa-Kuna"}'::jsonb,
  35.9612049,
  139.0566399,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyoshida',
  '上吉田',
  'かみよしだ',
  '{"en":"Kamiyoshida"}'::jsonb,
  36.0632262,
  138.9725593,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_terao',
  '寺尾',
  'てらお',
  '{"en":"Terao"}'::jsonb,
  36.0165575,
  139.0749101,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_midorigaoka',
  'みどりが丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  36.0465229,
  139.0530564,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_banbamachi',
  '番場町',
  'ばんばまち',
  '{"en":"Banbamachi"}'::jsonb,
  35.9961559,
  139.084461,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_kamitano',
  '荒川上田野',
  'あらかわかみたの',
  '{"en":"Arakawa-Kamitano"}'::jsonb,
  35.9621441,
  139.0370179,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896848,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tamura',
  '田村',
  'たむら',
  '{"en":"Tamura"}'::jsonb,
  36.0042445,
  139.0532768,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimomiyajimachi',
  '下宮地町',
  'しもみやじまち',
  '{"en":"Shimomiyajimachi"}'::jsonb,
  36.0113036,
  139.0929791,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanagidamachi',
  '柳田町',
  'やなぎだまち',
  '{"en":"Yanagidamachi"}'::jsonb,
  36.0120636,
  139.0841657,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshida_otabu',
  '吉田太田部',
  'よしだおおたぶ',
  '{"en":"Yoshida-Otabu"}'::jsonb,
  36.1137324,
  138.9742394,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ota',
  '太田',
  'おおた',
  '{"en":"Ota"}'::jsonb,
  36.0554826,
  139.0620987,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyakawacho',
  '宮側町',
  'みやかわちょう',
  '{"en":"Miyakawacho"}'::jsonb,
  35.999956,
  139.0854017,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896857,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_urayama',
  '浦山',
  'うらやま',
  '{"en":"Urayama"}'::jsonb,
  35.9300804,
  139.0718487,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896858,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuroya_quarter',
  '黒谷',
  'くろや',
  '{"en":"Kuroya"}'::jsonb,
  36.044461,
  139.1073793,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896859,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakamiyajimachi',
  '中宮地町',
  'なかみやじまち',
  '{"en":"Nakamiyajimachi"}'::jsonb,
  36.0062282,
  139.0911263,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896861,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mitsumine',
  '三峰',
  'みつみね',
  '{"en":"Mitsumine"}'::jsonb,
  35.9279115,
  138.9285234,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_onohara',
  '大野原',
  'おおのはら',
  '{"en":"Onohara"}'::jsonb,
  36.0296186,
  139.0977889,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896863,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_abomachi',
  '阿保町',
  'あぼまち',
  '{"en":"Abomachi"}'::jsonb,
  36.0155271,
  139.0858912,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896865,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_motomachi',
  '本町',
  'もとまち',
  '{"en":"Motomachi"}'::jsonb,
  35.9964642,
  139.0815342,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896867,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamikagemori',
  '上影森',
  'かみかげもり',
  '{"en":"Kamikagemori"}'::jsonb,
  35.9753661,
  139.0664909,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896868,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_bessho_quarter',
  '別所',
  'べっしょ',
  '{"en":"Bessho"}'::jsonb,
  35.9904007,
  139.0634931,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_dojomachi',
  '道生町',
  'どうじょうまち',
  '{"en":"Dojomachi"}'::jsonb,
  35.9994121,
  139.0813109,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896871,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_horikiri',
  '堀切',
  'ほりきり',
  '{"en":"Horikiri"}'::jsonb,
  36.0597872,
  139.0785007,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896872,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arakawa_hino',
  '荒川日野',
  'あらかわひの',
  '{"en":"Arakawa-Hino"}'::jsonb,
  35.9526094,
  139.0181139,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_maita',
  '蒔田',
  'まいた',
  '{"en":"Maita"}'::jsonb,
  36.0354849,
  139.0750464,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896874,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamimiyajimachi',
  '上宮地町',
  'かみみやじまち',
  '{"en":"Kamimiyajimachi"}'::jsonb,
  36.0021432,
  139.090037,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462896876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nomaki',
  '野巻',
  'のまき',
  '{"en":"Nomaki"}'::jsonb,
  36.0678746,
  139.0659391,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ouchizawa',
  '大内沢',
  'おおうちざわ',
  '{"en":"Ouchizawa"}'::jsonb,
  36.0802742,
  139.1716268,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagatoro',
  '長瀞',
  'ながとろ',
  '{"en":"Nagatoro"}'::jsonb,
  36.0981736,
  139.1078305,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fupu',
  '風布',
  'ふうぷ',
  '{"en":"Fupu"}'::jsonb,
  36.0982181,
  139.1293883,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_san_yama',
  '三山',
  'さんやま',
  '{"en":"San-yama"}'::jsonb,
  36.0366802,
  138.927471,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimohinozawa',
  '下日野沢',
  'しもひのざわ',
  '{"en":"Shimohinozawa"}'::jsonb,
  36.0861265,
  139.0589558,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakamoto',
  '坂本',
  'さかもと',
  '{"en":"Sakamoto"}'::jsonb,
  36.0588309,
  139.1771879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ogano',
  '小鹿野',
  'おがの',
  '{"en":"Ogano"}'::jsonb,
  36.0228715,
  138.9967334,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanasaki',
  '金崎',
  'かなさき',
  '{"en":"Kanasaki"}'::jsonb,
  36.0847258,
  139.1071419,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ryokamisusuki',
  '両神薄',
  'りょうかみすすき',
  '{"en":"Ryokamisusuki"}'::jsonb,
  36.0188174,
  138.928802,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ido',
  '井戸',
  'いど',
  '{"en":"Ido"}'::jsonb,
  36.1102223,
  139.1225718,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_izusawa',
  '伊豆沢',
  'いずさわ',
  '{"en":"Izusawa"}'::jsonb,
  36.0067686,
  138.9932497,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimotano',
  '下田野',
  'しもたの',
  '{"en":"Shimotano"}'::jsonb,
  36.0831515,
  139.1218238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kaiya',
  '皆谷',
  'かいや',
  '{"en":"Kaiya"}'::jsonb,
  36.0398558,
  139.1747594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hannya',
  '般若',
  'はんにゃ',
  '{"en":"Hannya"}'::jsonb,
  35.9988865,
  139.0204073,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kunikami',
  '国神',
  'くにかみ',
  '{"en":"Kunikami"}'::jsonb,
  36.0846504,
  139.0897788,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908800,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ryokamikomori',
  '両神小森',
  'りょうかみこもり',
  '{"en":"Ryokamikomori"}'::jsonb,
  35.988828,
  138.9042634,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_honnogami',
  '本野上',
  'ほんのがみ',
  '{"en":"Honnogami"}'::jsonb,
  36.1100913,
  139.1039665,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanezawa',
  '金沢',
  'かねざわ',
  '{"en":"Kanezawa"}'::jsonb,
  36.1094039,
  139.0729255,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiroishi',
  '白石',
  'しろいし',
  '{"en":"Shiroishi"}'::jsonb,
  36.0211002,
  139.1730156,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iida_quarter',
  '飯田',
  'いいだ',
  '{"en":"Iida"}'::jsonb,
  36.0329305,
  138.9785541,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minano',
  '皆野',
  'みなの',
  '{"en":"Minano"}'::jsonb,
  36.0729208,
  139.1008012,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yasudo',
  '安戸',
  'やすど',
  '{"en":"Yasudo"}'::jsonb,
  36.0486486,
  139.2150904,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iwata',
  '岩田',
  'いわた',
  '{"en":"Iwata"}'::jsonb,
  36.1274367,
  139.1247894,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ashigakubo',
  '芦ケ久保',
  'あしがくぼ',
  '{"en":"Ashigakubo"}'::jsonb,
  35.972465,
  139.1476684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawarasawa',
  '河原沢',
  'かわらさわ',
  '{"en":"Kawarasawa"}'::jsonb,
  36.0535055,
  138.8732571,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanase',
  '矢那瀬',
  'やなせ',
  '{"en":"Yanase"}'::jsonb,
  36.1347719,
  139.1458164,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908811,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_misawa',
  '三沢',
  'みさわ',
  '{"en":"Misawa"}'::jsonb,
  36.0583415,
  139.1331189,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoogano',
  '下小鹿野',
  'しもおがの',
  '{"en":"Shimoogano"}'::jsonb,
  36.0112133,
  139.0275779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ofuchi',
  '大渕',
  'おおふち',
  '{"en":"Ofuchi"}'::jsonb,
  36.0727938,
  139.0889737,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908814,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okusawa',
  '奥沢',
  'おくさわ',
  '{"en":"Okusawa"}'::jsonb,
  36.0583319,
  139.1982595,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nogamishimogo',
  '野上下郷',
  'のがみしもごう',
  '{"en":"Nogamishimogo"}'::jsonb,
  36.1305199,
  139.116846,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462908816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yokoze',
  '横瀬',
  'よこぜ',
  '{"en":"Yokoze"}'::jsonb,
  35.9786358,
  139.0999022,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924217,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fujikura',
  '藤倉',
  'ふじくら',
  '{"en":"Fujikura"}'::jsonb,
  36.0749864,
  138.9100453,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakanogami',
  '中野上',
  'なかのがみ',
  '{"en":"Nakanogami"}'::jsonb,
  36.1157008,
  139.1014734,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagaru',
  '長留',
  'ながる',
  '{"en":"Nagaru"}'::jsonb,
  36.0048028,
  139.0401026,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihinozawa',
  '上日野沢',
  'かみひのざわ',
  '{"en":"Kamihinozawa"}'::jsonb,
  36.0831526,
  139.0336601,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mido',
  '御堂',
  'みどう',
  '{"en":"Mido"}'::jsonb,
  36.0522797,
  139.2074622,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hio',
  '日尾',
  'ひお',
  '{"en":"Hio"}'::jsonb,
  36.0553945,
  138.9529007,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8462924223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitayoshimi',
  '北吉見',
  'きたよしみ',
  '{"en":"Kitayoshimi"}'::jsonb,
  36.0468132,
  139.4261413,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimomujina',
  '下狢',
  'しもむじな',
  '{"en":"Shimomujina"}'::jsonb,
  35.966442,
  139.4961625,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takaoshinden',
  '高尾新田',
  'たかおしんでん',
  '{"en":"Takaoshinden"}'::jsonb,
  36.0319156,
  139.494198,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_etsuna',
  '江綱',
  'えつな',
  '{"en":"Etsuna"}'::jsonb,
  36.0228243,
  139.4472908,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koarai',
  '小新井',
  'こあらい',
  '{"en":"Koarai"}'::jsonb,
  36.055396,
  139.4538515,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kumai',
  '熊井',
  'くまい',
  '{"en":"Kumai"}'::jsonb,
  35.9866907,
  139.3186941,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sue',
  '須江',
  'すえ',
  '{"en":"Sue"}'::jsonb,
  36.0031479,
  139.327336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyamae',
  '宮前',
  'みやまえ',
  '{"en":"Miyamae"}'::jsonb,
  35.9754129,
  139.4874912,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_maegochi',
  '前河内',
  'まえごうち',
  '{"en":"Maegochi"}'::jsonb,
  36.0274381,
  139.4548914,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamisonobe',
  '南園部',
  'みなみそのべ',
  '{"en":"Minamisonobe"}'::jsonb,
  35.9946776,
  139.4483744,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_demarunakago',
  '出丸中郷',
  'でまるなかごう',
  '{"en":"Demarunakago"}'::jsonb,
  35.957908,
  139.5225799,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_imajuku',
  '今宿',
  'いまじゅく',
  '{"en":"Imajuku"}'::jsonb,
  35.9691532,
  139.3435114,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kakusen',
  '角泉',
  'かくせん',
  '{"en":"Kakusen"}'::jsonb,
  35.9615158,
  139.4827639,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463014316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_imaizumi',
  '今泉',
  'いまいずみ',
  '{"en":"Imaizumi"}'::jsonb,
  36.0554307,
  139.4626901,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tobaishinden',
  '鳥羽井新田',
  'とばいしんでん',
  '{"en":"Tobaishinden"}'::jsonb,
  36.0030044,
  139.4862664,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mushizuka',
  '虫塚',
  'むしづか',
  '{"en":"Mushizuka"}'::jsonb,
  36.0010573,
  139.4626083,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoginya',
  '下銀谷',
  'しもぎんや',
  '{"en":"Shimoginya"}'::jsonb,
  36.0322391,
  139.4682066,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mihoyajuku',
  '三保谷宿',
  'みほやじゅく',
  '{"en":"Mihoyajuku"}'::jsonb,
  35.9885624,
  139.4997926,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yasuzuka',
  '安塚',
  'やすづか',
  '{"en":"Yasuzuka"}'::jsonb,
  35.9675955,
  139.4815086,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hatanaka',
  '畑中',
  'はたなか',
  '{"en":"Hatanaka"}'::jsonb,
  35.9919312,
  139.4946442,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kubotashinden',
  '久保田新田',
  'くぼたしんでん',
  '{"en":"Kubotashinden"}'::jsonb,
  36.0284448,
  139.4964169,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagayatsu',
  '長谷',
  'ながやつ',
  '{"en":"Nagayatsu"}'::jsonb,
  36.0617874,
  139.4227104,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ishizaka',
  '石坂',
  'いしざか',
  '{"en":"Ishizaka"}'::jsonb,
  35.9809472,
  139.3692824,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ushigayato',
  '牛ヶ谷戸',
  'うしがやと',
  '{"en":"Ushigayato"}'::jsonb,
  35.9825685,
  139.4978737,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_meishu',
  '明秋',
  'めいしゅう',
  '{"en":"Meishu"}'::jsonb,
  36.0544565,
  139.4790563,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiginya',
  '上銀谷',
  'かみぎんや',
  '{"en":"Kamiginya"}'::jsonb,
  36.0346352,
  139.4690665,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ohashi',
  '大橋',
  'おおはし',
  '{"en":"Ohashi"}'::jsonb,
  35.9927507,
  139.3377635,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ippongi',
  '一本木',
  'いっぽんぎ',
  '{"en":"Ippongi"}'::jsonb,
  35.9984898,
  139.4666113,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuroiwa',
  '黒岩',
  'くろいわ',
  '{"en":"Kuroiwa"}'::jsonb,
  36.054377,
  139.444685,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okuda',
  '奥田',
  'おくだ',
  '{"en":"Okuda"}'::jsonb,
  36.0038525,
  139.3367439,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_demarushimogo',
  '出丸下郷',
  'でまるしもごう',
  '{"en":"Demarushimogo"}'::jsonb,
  35.9726599,
  139.5126,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_wana',
  '和名',
  'わな',
  '{"en":"Wana"}'::jsonb,
  36.0458951,
  139.4405985,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanaka',
  '谷中',
  'やなか',
  '{"en":"Yanaka"}'::jsonb,
  36.0050278,
  139.4736924,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiigusa',
  '上伊草',
  'かみいぐさ',
  '{"en":"Kamiigusa"}'::jsonb,
  35.9743366,
  139.4647586,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoyatubayashi',
  '下八ツ林',
  'しもやつばやし',
  '{"en":"Shimoyatubayashi"}'::jsonb,
  35.9981772,
  139.4828674,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niibori',
  '新堀',
  'にいぼり',
  '{"en":"Niibori"}'::jsonb,
  35.9714937,
  139.499041,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakaarai',
  '中新井',
  'なかあらい',
  '{"en":"Nakaarai"}'::jsonb,
  36.0513176,
  139.4517424,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiroinuma',
  '白井沼',
  'しろいぬま',
  '{"en":"Shiroinuma"}'::jsonb,
  35.9832385,
  139.4869164,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamihosoya',
  '上細谷',
  'かみほそや',
  '{"en":"Kamihosoya"}'::jsonb,
  36.0567556,
  139.4490351,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okushi',
  '大串',
  'おおくし',
  '{"en":"Okushi"}'::jsonb,
  36.0225985,
  139.4651302,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamimujina',
  '上狢',
  'かみむじな',
  '{"en":"Kamimujina"}'::jsonb,
  35.9703129,
  139.4897548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_marunuki',
  '丸貫',
  'まるぬき',
  '{"en":"Marunuki"}'::jsonb,
  36.0452387,
  139.4695129,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kubota',
  '久保田',
  'くぼた',
  '{"en":"Kubota"}'::jsonb,
  36.0322758,
  139.4502979,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hasunuma_shinden',
  '蓮沼新田',
  'はすぬましんでん',
  '{"en":"Hasunuma-shinden"}'::jsonb,
  36.0353084,
  139.4899216,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_akanuma',
  '赤沼',
  'あかぬま',
  '{"en":"Akanuma"}'::jsonb,
  35.9760545,
  139.3422992,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mageshi',
  '曲師',
  'まげし',
  '{"en":"Mageshi"}'::jsonb,
  35.9631943,
  139.5072948,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ewai',
  '江和井',
  'えわい',
  '{"en":"Ewai"}'::jsonb,
  36.0235698,
  139.4971503,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koyo',
  '小用',
  'こよう',
  '{"en":"Koyo"}'::jsonb,
  35.9664726,
  139.3338459,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iijima',
  '飯島',
  'いいじま',
  '{"en":"Iijima"}'::jsonb,
  35.9734663,
  139.478507,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ijimasinden',
  '飯島新田',
  'いいじましんでん',
  '{"en":"Ijimasinden"}'::jsonb,
  36.0245069,
  139.4841444,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyatsubayashi',
  '上八ツ林',
  'かみやつばやし',
  '{"en":"Kamiyatsubayashi"}'::jsonb,
  35.9925919,
  139.4738115,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kumeda',
  '久米田',
  'くめだ',
  '{"en":"Kumeda"}'::jsonb,
  36.037435,
  139.4413938,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshiwara',
  '吉原',
  'よしわら',
  '{"en":"Yoshiwara"}'::jsonb,
  35.9766436,
  139.4955591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_arako',
  '荒子',
  'あらこ',
  '{"en":"Arako"}'::jsonb,
  36.0234639,
  139.4733331,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tomori',
  '戸守',
  'ともり',
  '{"en":"Tomori"}'::jsonb,
  35.9960953,
  139.4372664,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_umenoki',
  '梅ノ木',
  'うめのき',
  '{"en":"Umenoki"}'::jsonb,
  36.00766,
  139.456716,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_komyoshinden',
  '古名新田',
  'こみょうしんでん',
  '{"en":"Komyoshinden"}'::jsonb,
  36.045082,
  139.485796,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagaraku',
  '長楽',
  'ながらく',
  '{"en":"Nagaraku"}'::jsonb,
  36.0024052,
  139.4284145,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shojiki',
  '正直',
  'しょうじき',
  '{"en":"Shojiki"}'::jsonb,
  36.002732,
  139.4415061,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamanoshita',
  '山ノ下',
  'やまのした',
  '{"en":"Yamanoshita"}'::jsonb,
  36.0675009,
  139.44158,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tako',
  '田甲',
  'たこう',
  '{"en":"Tako"}'::jsonb,
  36.0696901,
  139.4306185,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoigusa',
  '下伊草',
  'しもいぐさ',
  '{"en":"Shimoigusa"}'::jsonb,
  35.9635166,
  139.4692689,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_honzawa',
  '本沢',
  'ほんざわ',
  '{"en":"Honzawa"}'::jsonb,
  36.0630753,
  139.4541076,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimohosoya',
  '下細谷',
  'しもほそや',
  '{"en":"Shimohosoya"}'::jsonb,
  36.041645,
  139.4521157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mankoji',
  '万光寺',
  'まんこうじ',
  '{"en":"Mankoji"}'::jsonb,
  36.0319381,
  139.4749719,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_izui',
  '泉井',
  'いずい',
  '{"en":"Izui"}'::jsonb,
  35.9965381,
  139.3210703,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitasonobe',
  '北園部',
  'きたそのべ',
  '{"en":"Kitasonobe"}'::jsonb,
  36.000289,
  139.4582234,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamizuna',
  '上砂',
  'かみずな',
  '{"en":"Kamizuna"}'::jsonb,
  36.0741867,
  139.4506927,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takemoto',
  '竹本',
  'たけもと',
  '{"en":"Takemoto"}'::jsonb,
  36.0024249,
  139.3122019,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hiranuma',
  '平沼',
  'ひらぬま',
  '{"en":"Hiranuma"}'::jsonb,
  35.9825438,
  139.4739807,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamiyoshimi',
  '南吉見',
  'みなみよしみ',
  '{"en":"Minamiyoshimi"}'::jsonb,
  36.0349987,
  139.4303317,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tobai',
  '鳥羽井',
  'とばい',
  '{"en":"Tobai"}'::jsonb,
  36.0021624,
  139.4772746,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sunokoshinden',
  '須野子新田',
  'すのこしんでん',
  '{"en":"Sunokoshinden"}'::jsonb,
  36.0280003,
  139.498884,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamagayato',
  '山ヶ谷戸',
  'やまがやと',
  '{"en":"Yamagayato"}'::jsonb,
  35.9811311,
  139.5021422,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimooyashiki',
  '下大屋敷',
  'しもおおやしき',
  '{"en":"Shimooyashiki"}'::jsonb,
  35.9589247,
  139.5155677,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakazone',
  '中曽根',
  'なかぞね',
  '{"en":"Nakazone"}'::jsonb,
  36.0758357,
  139.4434185,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_demaruhon',
  '出丸本',
  'でまるほん',
  '{"en":"Demaruhon"}'::jsonb,
  35.9654528,
  139.5114093,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035499,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsuzaki',
  '松崎',
  'まつざき',
  '{"en":"Matsuzaki"}'::jsonb,
  36.0637079,
  139.4468822,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukizuka',
  '吹塚',
  'ふきづか',
  '{"en":"Fukizuka"}'::jsonb,
  35.997369,
  139.4611983,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuginashi',
  '釘無',
  'くぎなし',
  '{"en":"Kuginashi"}'::jsonb,
  35.9631734,
  139.4946428,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitashimozuna',
  '北下砂',
  'きたしもずな',
  '{"en":"Kitashimozuna"}'::jsonb,
  36.0495952,
  139.4686045,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kabakariya',
  '蚊斗谷',
  'かばかりや',
  '{"en":"Kabakariya"}'::jsonb,
  36.0359018,
  139.4844575,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omote',
  '表',
  'おもて',
  '{"en":"Omote"}'::jsonb,
  35.9791938,
  139.5044303,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_jitoho',
  '地頭方',
  'じとうほう',
  '{"en":"Jitoho"}'::jsonb,
  36.0604759,
  139.4586279,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_komyo',
  '古名',
  'こみょう',
  '{"en":"Komyo"}'::jsonb,
  36.0417543,
  139.4738081,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mamedo',
  '大豆戸',
  'まめど',
  '{"en":"Mamedo"}'::jsonb,
  35.977338,
  139.3302554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035510,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamioyashiki',
  '上大屋敷',
  'かみおおやしき',
  '{"en":"Kamioyashiki"}'::jsonb,
  35.963105,
  139.514431,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035511,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hitotsugi',
  '一ツ木',
  'ひとつぎ',
  '{"en":"Hitotsugi"}'::jsonb,
  36.0655607,
  139.4646753,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takanokura',
  '高野倉',
  'たかのくら',
  '{"en":"Takanokura"}'::jsonb,
  35.9928614,
  139.2977226,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiomino',
  '上小見野',
  'かみおみの',
  '{"en":"Kamiomino"}'::jsonb,
  36.0055192,
  139.4627021,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_owada',
  '大和田',
  'おおわだ',
  '{"en":"Owada"}'::jsonb,
  36.0369979,
  139.4758766,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashiozuka',
  '東大塚',
  'ひがしおおづか',
  '{"en":"Higashiozuka"}'::jsonb,
  35.9975427,
  139.493091,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakayama',
  '中山',
  'なかやま',
  '{"en":"Nakayama"}'::jsonb,
  35.9866529,
  139.4522152,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoomino',
  '下小見野',
  'しもおみの',
  '{"en":"Shimoomino"}'::jsonb,
  36.0134732,
  139.4680557,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiya',
  '西谷',
  'にしや',
  '{"en":"Nishiya"}'::jsonb,
  35.9684842,
  139.5085993,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yaguchi_quarter',
  '谷口',
  'やぐち',
  '{"en":"Yaguchi"}'::jsonb,
  36.0409747,
  139.4639214,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shibanuma',
  '芝沼',
  'しばぬま',
  '{"en":"Shibanuma"}'::jsonb,
  36.0144591,
  139.4922095,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shichiku',
  '紫竹',
  'しちく',
  '{"en":"Shichiku"}'::jsonb,
  35.9802243,
  139.4896977,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_igusa_quarter',
  '伊草',
  'いぐさ',
  '{"en":"Igusa"}'::jsonb,
  35.9694567,
  139.4679985,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_gosho',
  '御所',
  'ごしょ',
  '{"en":"Gosho"}'::jsonb,
  36.0490743,
  139.4454139,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8463035527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_樋ノ口',
  '樋ノ口',
  '樋ノ口',
  NULL,
  36.0400597,
  139.6517658,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8493099741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原_quarter',
  '原',
  '原',
  NULL,
  36.044779,
  139.6484399,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8493099742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miura',
  '三浦',
  'みうら',
  '{"en":"Miura"}'::jsonb,
  35.8969768,
  139.6660781,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8515177619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daido',
  '大道',
  'だいどう',
  '{"en":"Daido"}'::jsonb,
  35.8937524,
  139.6720272,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8515177620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyaushiro',
  '宮後',
  'みやうしろ',
  '{"en":"Miyaushiro"}'::jsonb,
  35.8927267,
  139.6952069,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8515177625,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinjuku',
  '新宿',
  'しんじゅく',
  '{"en":"Shinjuku"}'::jsonb,
  35.8922487,
  139.6842152,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8515177626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirogayato',
  '広ヶ谷戸',
  'ひろがやと',
  '{"en":"Hirogayato"}'::jsonb,
  35.8624655,
  139.6860874,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541586329,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oyaguchi',
  '大谷口',
  'おおやぐち',
  '{"en":"Oyaguchi"}'::jsonb,
  35.8588135,
  139.6863985,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541586330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_enshoji',
  '円正寺',
  'えんしょうじ',
  '{"en":"Enshoji"}'::jsonb,
  35.8509091,
  139.6896145,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541586331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daitakubo',
  '太田窪',
  'だいたくぼ',
  '{"en":"Daitakubo"}'::jsonb,
  35.8522048,
  139.6826005,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541586332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小谷場',
  '小谷場',
  '小谷場',
  NULL,
  35.8456999,
  139.6797037,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541586333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行領在家',
  '安行領在家',
  '安行領在家',
  NULL,
  35.8554571,
  139.7125232,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541905212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安行領根岸',
  '安行領根岸',
  '安行領根岸',
  NULL,
  35.8437257,
  139.7180941,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8541906730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮本_quarter',
  '宮本町',
  '宮本町',
  NULL,
  35.9752278,
  139.5918238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8542112947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栄',
  '栄町',
  '栄町',
  NULL,
  35.962915,
  139.6011794,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8542112957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_河原井',
  '河原井町',
  '河原井町',
  NULL,
  36.0537136,
  139.6433973,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菖蒲町昭和沼',
  '菖蒲町昭和沼',
  '菖蒲町昭和沼',
  NULL,
  36.0594208,
  139.6339988,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_清久',
  '清久町',
  '清久町',
  NULL,
  36.0724644,
  139.6305012,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北中曽根',
  '北中曽根',
  '北中曽根',
  NULL,
  36.0791067,
  139.6251797,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_所久喜',
  '所久喜',
  '所久喜',
  NULL,
  36.0634451,
  139.6470237,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_六万部',
  '六万部',
  '六万部',
  NULL,
  36.0720308,
  139.6426892,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上清久',
  '上清久',
  '上清久',
  NULL,
  36.0801645,
  139.6442664,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久本寺',
  '久本寺',
  '久本寺',
  NULL,
  36.0819508,
  139.6573233,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久喜新',
  '久喜新',
  '久喜新',
  NULL,
  36.0760631,
  139.6647048,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久喜本',
  '久喜本',
  '久喜本',
  NULL,
  36.0750398,
  139.6618402,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上',
  '上町',
  '上町',
  NULL,
  36.0725511,
  139.6597481,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下清久',
  '下清久',
  '下清久',
  NULL,
  36.0730887,
  139.6500385,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上早見',
  '上早見',
  '上早見',
  NULL,
  36.0682844,
  139.6569156,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8568578373,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_江面',
  '江面',
  '江面',
  NULL,
  36.0604269,
  139.6558857,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8637591338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_里',
  '里',
  '里',
  NULL,
  35.8344498,
  139.7298396,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8663576862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_伊刈',
  '伊刈',
  '伊刈',
  NULL,
  35.8466783,
  139.699477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8678259296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字台',
  '大字台',
  '大字台',
  NULL,
  35.808986,
  139.613429,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682341395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字宮戸',
  '大字宮戸',
  '大字宮戸',
  NULL,
  35.8236672,
  139.5990874,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682341397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下奥富',
  '大字下奥富',
  '大字下奥富',
  NULL,
  35.882991,
  139.423375,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字東三ツ木',
  '大字東三ツ木',
  '大字東三ツ木',
  NULL,
  35.8704106,
  139.4340482,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字堀兼',
  '大字堀兼',
  '大字堀兼',
  NULL,
  35.8512665,
  139.443295,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上赤坂',
  '大字上赤坂',
  '大字上赤坂',
  NULL,
  35.8491963,
  139.4610348,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中新田',
  '大字中新田',
  '大字中新田',
  NULL,
  35.870441,
  139.458082,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_水野',
  '水野',
  '水野',
  NULL,
  35.8323282,
  139.4343553,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_つつじ野',
  'つつじ野',
  'つつじ野',
  NULL,
  35.8617538,
  139.3936168,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字根岸',
  '大字根岸',
  '大字根岸',
  NULL,
  35.866683,
  139.376994,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字青柳',
  '大字青柳',
  '大字青柳',
  NULL,
  35.875049,
  139.448817,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_祇園',
  '祇園',
  '祇園',
  NULL,
  35.8573742,
  139.4162272,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字加佐志',
  '大字加佐志',
  '大字加佐志',
  NULL,
  35.864656,
  139.440013,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_入間川',
  '入間川',
  '入間川',
  NULL,
  35.842359,
  139.411611,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_沢',
  '沢',
  '沢',
  NULL,
  35.8656889,
  139.4268224,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字柏原新田',
  '大字柏原新田',
  '大字柏原新田',
  NULL,
  35.890283,
  139.420747,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北入曽',
  '大字北入曽',
  '大字北入曽',
  NULL,
  35.842141,
  139.429579,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上広瀬',
  '大字上広瀬',
  '大字上広瀬',
  NULL,
  35.865002,
  139.383399,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鵜ノ木',
  '鵜ノ木',
  '鵜ノ木',
  NULL,
  35.850251,
  139.393757,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字笹井',
  '大字笹井',
  '大字笹井',
  NULL,
  35.853329,
  139.367148,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上奥富',
  '大字上奥富',
  '大字上奥富',
  NULL,
  35.87172,
  139.418126,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_狭山',
  '狭山',
  '狭山',
  NULL,
  35.86627,
  139.417344,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柏原',
  '柏原',
  '柏原',
  NULL,
  35.88148,
  139.401623,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下広瀬',
  '大字下広瀬',
  '大字下広瀬',
  NULL,
  35.872875,
  139.386349,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682343482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字花ノ木',
  '大字花ノ木',
  '大字花ノ木',
  NULL,
  35.821359,
  139.348399,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字黒須',
  '大字黒須',
  '大字黒須',
  NULL,
  35.835964,
  139.409347,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字二本木',
  '大字二本木',
  '大字二本木',
  NULL,
  35.797215,
  139.357993,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字野田',
  '大字野田',
  '大字野田',
  NULL,
  35.844261,
  139.35454,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345964,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字新久',
  '大字新久',
  '大字新久',
  NULL,
  35.824599,
  139.360277,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上谷ケ貫',
  '大字上谷ケ貫',
  '大字上谷ケ貫',
  NULL,
  35.813533,
  139.342354,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字根岸_quarter',
  '大字根岸',
  '大字根岸',
  NULL,
  35.81849,
  139.358526,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮寺',
  '宮寺',
  '宮寺',
  NULL,
  35.794927,
  139.376559,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字南峯',
  '大字南峯',
  '大字南峯',
  NULL,
  35.809404,
  139.32766,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下谷ケ貫',
  '大字下谷ケ貫',
  '大字下谷ケ貫',
  NULL,
  35.814608,
  139.348802,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字新光',
  '大字新光',
  '大字新光',
  NULL,
  35.8558715,
  139.356531,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字狭山台',
  '大字狭山台',
  '大字狭山台',
  NULL,
  35.8018539,
  139.3605389,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_金子中央',
  '金子中央',
  '金子中央',
  NULL,
  35.814346,
  139.328619,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682345993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小谷田',
  '大字小谷田',
  '大字小谷田',
  NULL,
  35.8219232,
  139.3741477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682346001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中神',
  '大字中神',
  '大字中神',
  NULL,
  35.818486,
  139.353916,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682346004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字狭山ケ原',
  '大字狭山ケ原',
  '大字狭山ケ原',
  NULL,
  35.812287,
  139.367416,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682346008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字仏子',
  '大字仏子',
  '大字仏子',
  NULL,
  35.836021,
  139.354493,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347320,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下藤沢',
  '大字下藤沢',
  '大字下藤沢',
  NULL,
  35.8246331,
  139.4060534,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字寺竹',
  '大字寺竹',
  '大字寺竹',
  NULL,
  35.804661,
  139.33548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347325,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三ツ木台',
  '三ツ木台',
  '三ツ木台',
  NULL,
  35.813642,
  139.335339,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347326,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字扇町屋',
  '大字扇町屋',
  '大字扇町屋',
  NULL,
  35.815172,
  139.37865,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347329,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字高倉',
  '大字高倉',
  '大字高倉',
  NULL,
  35.818466,
  139.382091,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字善蔵新田',
  '大字善蔵新田',
  '大字善蔵新田',
  NULL,
  35.819473,
  139.386842,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上藤沢',
  '大字上藤沢',
  '大字上藤沢',
  NULL,
  35.8133687,
  139.3911418,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字木蓮寺',
  '大字木蓮寺',
  '大字木蓮寺',
  NULL,
  35.806678,
  139.32313,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字西三ツ木',
  '大字西三ツ木',
  '大字西三ツ木',
  NULL,
  35.813635,
  139.338136,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682347345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本',
  '本町',
  '本町',
  NULL,
  35.787518,
  139.60631,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下新倉',
  '大字下新倉',
  '大字下新倉',
  NULL,
  35.8024123,
  139.6374946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_諏訪原団地',
  '諏訪原団地',
  '諏訪原団地',
  NULL,
  35.775198,
  139.616835,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西大和団地',
  '西大和団地',
  '西大和団地',
  NULL,
  35.779018,
  139.6077472,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_諏訪',
  '諏訪',
  '諏訪',
  NULL,
  35.776412,
  139.618469,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字新倉',
  '大字新倉',
  '大字新倉',
  NULL,
  35.8064,
  139.626856,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_広沢',
  '広沢',
  '広沢',
  NULL,
  35.779974,
  139.60131,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682348368,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下内間木',
  '大字下内間木',
  '大字下内間木',
  NULL,
  35.81727,
  139.616852,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字膝折',
  '大字膝折',
  '大字膝折',
  NULL,
  35.784367,
  139.583857,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字岡',
  '大字岡',
  '大字岡',
  NULL,
  35.814439,
  139.598031,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350632,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字田島',
  '大字田島',
  '大字田島',
  NULL,
  35.816341,
  139.603411,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字溝沼',
  '大字溝沼',
  '大字溝沼',
  NULL,
  35.808236,
  139.586583,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_陸上自衛隊朝霞駐屯地',
  '陸上自衛隊朝霞駐屯地',
  '陸上自衛隊朝霞駐屯地',
  NULL,
  35.782788,
  139.59416,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350643,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上内間木',
  '大字上内間木',
  '大字上内間木',
  NULL,
  35.8264531,
  139.6121217,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字浜崎',
  '大字浜崎',
  '大字浜崎',
  NULL,
  35.820472,
  139.604172,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682350659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_みよし台',
  'みよし台',
  'みよし台',
  NULL,
  35.83243,
  139.544689,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682468412,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_竹間沢東',
  '竹間沢東',
  '竹間沢東',
  NULL,
  35.825326,
  139.553067,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682468413,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_竹間沢',
  '竹間沢',
  '竹間沢',
  NULL,
  35.8282877,
  139.5421765,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682468414,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字藤久保',
  '大字藤久保',
  '大字藤久保',
  NULL,
  35.83725,
  139.531206,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682468416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新塚',
  '新塚',
  '新塚',
  NULL,
  35.78184,
  139.586779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682468443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字水子',
  '大字水子',
  '大字水子',
  NULL,
  35.8408,
  139.564345,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_勝瀬',
  '勝瀬',
  '勝瀬',
  NULL,
  35.8651006,
  139.5376423,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東大久保',
  '東大久保',
  '東大久保',
  NULL,
  35.876614,
  139.5559422,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_みどり野東',
  'みどり野東',
  'みどり野東',
  NULL,
  35.868204,
  139.568844,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上南畑',
  '上南畑',
  '上南畑',
  NULL,
  35.8650363,
  139.558517,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_針ケ谷',
  '針ケ谷',
  '針ケ谷',
  NULL,
  35.829657,
  139.556489,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473390,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_みどり野南',
  'みどり野南',
  'みどり野南',
  NULL,
  35.865288,
  139.565594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_みどり野西',
  'みどり野西',
  'みどり野西',
  NULL,
  35.86796,
  139.5549615,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鶴馬',
  '鶴馬',
  '鶴馬',
  NULL,
  35.853204,
  139.5549951,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_みどり野北',
  'みどり野北',
  'みどり野北',
  NULL,
  35.868336,
  139.562584,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473404,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下南畑',
  '下南畑',
  '下南畑',
  NULL,
  35.8568964,
  139.5704079,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473412,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榎_quarter_8682473413',
  '榎町',
  '榎町',
  NULL,
  35.832518,
  139.560506,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473413,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南畑新田',
  '南畑新田',
  '南畑新田',
  NULL,
  35.8635123,
  139.575833,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682473416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下石戸下',
  '大字下石戸下',
  '大字下石戸下',
  NULL,
  36.015369,
  139.539505,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682474980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下石戸上',
  '大字下石戸上',
  '大字下石戸上',
  NULL,
  36.012849,
  139.535408,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682474989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字石戸宿',
  '大字石戸宿',
  '大字石戸宿',
  NULL,
  36.005094,
  139.5042,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682475014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字荒井',
  '大字荒井',
  '大字荒井',
  NULL,
  36.020298,
  139.50233,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字高尾',
  '大字高尾',
  '大字高尾',
  NULL,
  36.031029,
  139.502667,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栄_quarter',
  '栄',
  '栄',
  NULL,
  36.015866,
  139.533847,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tagi_quarter',
  '田木',
  '田木',
  '{"en":"Tagi"}'::jsonb,
  35.8761357,
  139.3799524,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南平沢',
  '南平沢',
  '南平沢',
  NULL,
  35.9118096,
  139.3360796,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491694,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_駒寺野新田',
  '駒寺野新田',
  '駒寺野新田',
  NULL,
  35.9187662,
  139.3555411,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_猿田上ノ台',
  '猿田上ノ台',
  '猿田上ノ台',
  NULL,
  35.892491,
  139.333933,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_onakage',
  '女影',
  '女影',
  '{"en":"Onakage"}'::jsonb,
  35.8919621,
  139.3584642,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niregi',
  '楡木',
  '楡木',
  '{"en":"Niregi"}'::jsonb,
  35.8896145,
  139.3277699,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原宿',
  '原宿',
  '原宿',
  NULL,
  35.9041015,
  139.3424369,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下高萩新田',
  '下高萩新田',
  '下高萩新田',
  NULL,
  35.91615,
  139.380885,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ooyazawa',
  '大谷沢',
  '大谷沢',
  '{"en":"Ooyazawa"}'::jsonb,
  35.8847075,
  139.3772719,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高萩',
  '高萩',
  '高萩',
  NULL,
  35.9055725,
  139.3788986,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_森戸新田',
  '森戸新田',
  '森戸新田',
  NULL,
  35.9177016,
  139.3747293,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新堀_quarter_8682491712',
  '新堀',
  '新堀',
  NULL,
  35.8988443,
  139.326121,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_馬引沢',
  '馬引沢',
  '馬引沢',
  NULL,
  35.8756766,
  139.369765,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_田波目',
  '田波目',
  '田波目',
  NULL,
  35.9167497,
  139.3446099,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682491715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_前久保',
  '前久保',
  '前久保',
  NULL,
  35.9510625,
  139.3235878,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682495807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_滝ノ入',
  '滝ノ入',
  '滝ノ入',
  NULL,
  35.9420294,
  139.2818524,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682495808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsuzuranuki',
  '葛貫',
  '葛貫',
  '{"en":"Tsuzuranuki"}'::jsonb,
  35.9281197,
  139.3190376,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682495812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西戸',
  '西戸',
  '西戸',
  NULL,
  35.9592147,
  139.3342968,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682495813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_毛呂本郷',
  '毛呂本郷',
  '毛呂本郷',
  NULL,
  35.941011,
  139.305575,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682495816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栗坪',
  '栗坪',
  '栗坪',
  NULL,
  35.8885354,
  139.3186189,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_横手',
  '横手',
  '横手',
  NULL,
  35.8929921,
  139.2853548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中鹿山',
  '中鹿山',
  '中鹿山',
  NULL,
  35.8948597,
  139.3473439,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoooyazawa',
  '下大谷沢',
  '下大谷沢',
  '{"en":"Shimoooyazawa"}'::jsonb,
  35.8963218,
  139.3918856,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中沢',
  '中沢',
  '中沢',
  NULL,
  35.8875561,
  139.3696526,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496226,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_野々宮',
  '野々宮',
  '野々宮',
  NULL,
  35.8944534,
  139.3310939,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高岡',
  '高岡',
  '高岡',
  NULL,
  35.8935921,
  139.3153829,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下鹿山',
  '下鹿山',
  '下鹿山',
  NULL,
  35.8966712,
  139.3556381,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高麗本郷',
  '高麗本郷',
  '高麗本郷',
  NULL,
  35.8915431,
  139.300591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山根',
  '山根',
  '山根',
  NULL,
  35.9193005,
  139.3228886,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_旭ケ丘',
  '旭ケ丘',
  '旭ケ丘',
  NULL,
  35.9112118,
  139.3620431,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新堀新田_quarter',
  '新堀新田',
  '新堀新田',
  NULL,
  35.9061469,
  139.3482674,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高富',
  '高富',
  '高富',
  NULL,
  35.8781914,
  139.3853221,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上鹿山',
  '上鹿山',
  '上鹿山',
  NULL,
  35.8907324,
  139.3400477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_女影新田',
  '女影新田',
  '女影新田',
  NULL,
  35.9045915,
  139.3608518,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久保',
  '久保',
  '久保',
  NULL,
  35.8854129,
  139.3025532,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鹿山',
  '鹿山',
  '鹿山',
  NULL,
  35.8987702,
  139.3486843,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_台',
  '台',
  '台',
  NULL,
  35.879212,
  139.306957,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496243,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北平沢',
  '北平沢',
  '北平沢',
  NULL,
  35.9123777,
  139.3233969,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682496244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小室',
  '大字小室',
  '大字小室',
  NULL,
  35.987115,
  139.627672,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682497230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小針内宿',
  '大字小針内宿',
  '大字小針内宿',
  NULL,
  36.021205,
  139.608327,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682497239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大針',
  '大字大針',
  '大字大針',
  NULL,
  36.007291,
  139.619257,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682497245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字羽貫',
  '大字羽貫',
  '大字羽貫',
  NULL,
  36.011839,
  139.608778,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682497253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小針新宿',
  '大字小針新宿',
  '大字小針新宿',
  NULL,
  36.010149,
  139.597125,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682497261,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanoshita',
  '鹿下',
  '鹿下',
  '{"en":"Kanoshita"}'::jsonb,
  35.9826337,
  139.2853452,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_古池',
  '古池',
  '古池',
  NULL,
  35.9843775,
  139.2757137,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_麦原',
  '麦原',
  '麦原',
  NULL,
  35.9714585,
  139.2432924,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_doyama',
  '堂山',
  '堂山',
  '{"en":"Doyama"}'::jsonb,
  35.9720331,
  139.2656233,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大谷_quarter',
  '大谷',
  '大谷',
  NULL,
  35.9794111,
  139.2946774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tatsugaya',
  '龍ケ谷',
  '龍ケ谷',
  '{"en":"Tatsugaya"}'::jsonb,
  35.9566357,
  139.2469995,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ogose',
  '越生',
  '越生',
  '{"en":"Ogose"}'::jsonb,
  35.9622262,
  139.2961435,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小杉',
  '小杉',
  '小杉',
  NULL,
  35.9679064,
  139.2626704,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西和田',
  '西和田',
  '西和田',
  NULL,
  35.9683211,
  139.2995324,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_daima',
  '大満',
  '大満',
  '{"en":"Daima"}'::jsonb,
  35.9575227,
  139.2624246,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukune',
  '津久根',
  '津久根',
  '{"en":"Tsukune"}'::jsonb,
  35.9706183,
  139.2804887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kuroiwa_quarter',
  '黒岩',
  '黒岩',
  '{"en":"Kuroiwa"}'::jsonb,
  35.9672552,
  139.2907914,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野',
  '上野',
  '上野',
  NULL,
  35.9536182,
  139.3015396,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_naruse',
  '成瀬',
  '成瀬',
  '{"en":"Naruse"}'::jsonb,
  35.9757714,
  139.2831693,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_neoi',
  '如意',
  '如意',
  '{"en":"Neoi"}'::jsonb,
  35.9635789,
  139.311628,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_黒山',
  '黒山',
  '黒山',
  NULL,
  35.9386741,
  139.2528928,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682504298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_苦林',
  '苦林',
  '苦林',
  NULL,
  35.9661722,
  139.3455597,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_阿諏訪',
  '阿諏訪',
  '阿諏訪',
  NULL,
  35.9282804,
  139.2873895,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川角',
  '川角',
  '川角',
  NULL,
  35.9511245,
  139.3338442,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西大久保',
  '西大久保',
  '西大久保',
  NULL,
  35.9523314,
  139.3537352,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_箕和田',
  '箕和田',
  '箕和田',
  NULL,
  35.9604208,
  139.3179409,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508028,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_旭台',
  '旭台',
  '旭台',
  NULL,
  35.9394064,
  139.3341591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大谷木',
  '大谷木',
  '大谷木',
  NULL,
  35.9257973,
  139.3058243,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大類',
  '大類',
  '大類',
  NULL,
  35.9575031,
  139.3474744,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岩井',
  '岩井',
  '岩井',
  NULL,
  35.9518286,
  139.3167723,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508038,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字権現堂',
  '大字権現堂',
  '大字権現堂',
  NULL,
  35.909423,
  139.281664,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508041,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下川原',
  '下川原',
  '下川原',
  NULL,
  35.9332886,
  139.345745,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508044,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kodaya',
  '小田谷',
  '小田谷',
  '{"en":"Kodaya"}'::jsonb,
  35.935799,
  139.308273,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宿谷',
  '宿谷',
  '宿谷',
  NULL,
  35.9144565,
  139.3040332,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508050,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_市場',
  '市場',
  '市場',
  NULL,
  35.9427468,
  139.3459447,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508051,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_長瀬',
  '長瀬',
  '長瀬',
  NULL,
  35.935323,
  139.316892,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8682508054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_差間',
  '差間',
  '差間',
  NULL,
  35.8672997,
  139.7273826,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8683370941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_源左衛門新田',
  '源左衛門新田',
  '源左衛門新田',
  NULL,
  35.8627481,
  139.7297859,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8683370942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_辻',
  '辻',
  '辻',
  NULL,
  35.8264603,
  139.7319746,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8684280813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上_quarter',
  '上',
  '上',
  NULL,
  35.9991706,
  139.5784879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8699909487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菅谷',
  '菅谷',
  '菅谷',
  NULL,
  35.9963236,
  139.5911264,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8699909490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南_quarter',
  '南',
  '南',
  NULL,
  36.0015836,
  139.5851183,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8699909497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_畔吉',
  '畔吉',
  '畔吉',
  NULL,
  35.9637313,
  139.5455503,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_地頭方',
  '地頭方',
  '地頭方',
  NULL,
  35.951712,
  139.5721578,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328168,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小敷谷',
  '小敷谷',
  '小敷谷',
  NULL,
  35.9614214,
  139.5582318,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328169,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西貝塚',
  '西貝塚',
  '西貝塚',
  NULL,
  35.9369416,
  139.5546698,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328170,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野本郷',
  '上野本郷',
  '上野本郷',
  NULL,
  35.9351912,
  139.5604419,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328171,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野_quarter',
  '上野',
  '上野',
  NULL,
  35.9446246,
  139.5578885,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328172,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平方_quarter',
  '平方',
  '平方',
  NULL,
  35.9498881,
  139.5502496,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328173,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平方領々家',
  '平方領々家',
  '平方領々家',
  NULL,
  35.9453716,
  139.567759,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328174,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyamaecho',
  '宮前町',
  'みやまえちょう',
  '{"en":"Miyamaecho"}'::jsonb,
  35.9266515,
  139.5857513,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uchinohongo',
  '内野本郷',
  'うちのほんごう',
  '{"en":"Uchinohongo"}'::jsonb,
  35.9359209,
  139.5921778,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_seiganji',
  '清河寺',
  'せいがんじ',
  '{"en":"Seiganji"}'::jsonb,
  35.9363804,
  139.5827848,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328177,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takagi',
  '高木',
  'たかぎ',
  '{"en":"Takagi"}'::jsonb,
  35.9396735,
  139.5768571,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakakugi',
  '中釘',
  'なかくぎ',
  '{"en":"Nakakugi"}'::jsonb,
  35.9348611,
  139.5677376,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711328179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸崎',
  '戸崎',
  '戸崎',
  NULL,
  35.9452848,
  139.5949459,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8711390284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimookubo',
  '大字下大久保',
  'しもおおくぼ',
  '{"en":"Shimookubo"}'::jsonb,
  35.853483,
  139.593387,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831373,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shuku',
  '大字宿',
  'しゅく',
  '{"en":"Shuku"}'::jsonb,
  35.8737835,
  139.5948573,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831374,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukamoto',
  '大字塚本',
  'つかもと',
  '{"en":"Tsukamoto"}'::jsonb,
  35.86719,
  139.587572,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_dojo',
  '大字道場',
  'どうじょう',
  '{"en":"Dojo"}'::jsonb,
  35.846744,
  139.606953,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shirakuwa',
  '大字白鍬',
  'しらくわ',
  '{"en":"Shirakuwa"}'::jsonb,
  35.8812223,
  139.6032329,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831377,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_zaike',
  '大字在家',
  'ざいけ',
  '{"en":"Zaike"}'::jsonb,
  35.87922,
  139.590916,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_goseki',
  '大字五関',
  'ごせき',
  '{"en":"Goseki"}'::jsonb,
  35.8687928,
  139.5984804,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiokubo',
  '大字上大久保',
  'かみおおくぼ',
  '{"en":"Kamiokubo"}'::jsonb,
  35.8680428,
  139.6108095,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_okuboryoke',
  '大字大久保領家',
  'おおくぼりょうけ',
  '{"en":"Okuboryoke"}'::jsonb,
  35.869195,
  139.604482,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_jinde',
  '大字神田',
  'じんで',
  '{"en":"Jinde"}'::jsonb,
  35.8738796,
  139.6089464,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tajima_quarter',
  '大字田島',
  'たじま',
  '{"en":"Tajima"}'::jsonb,
  35.838676,
  139.618621,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831383,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_showa',
  '大字昭和',
  'しょうわ',
  '{"en":"Showa"}'::jsonb,
  35.878129,
  139.577467,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakawa',
  '大字栄和',
  'さかわ',
  '{"en":"Sakawa"}'::jsonb,
  35.850661,
  139.602706,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishibori',
  '大字西堀',
  'にしぼり',
  '{"en":"Nishibori"}'::jsonb,
  35.841354,
  139.615961,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726831387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本田',
  '本田',
  '本田',
  NULL,
  36.122153,
  139.28942,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_武蔵野',
  '武蔵野',
  '武蔵野',
  NULL,
  36.142082,
  139.22469,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832643,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡_quarter',
  '岡',
  '岡',
  NULL,
  36.213848,
  139.236121,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832644,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本郷',
  '本郷',
  '本郷',
  NULL,
  36.172207,
  139.213374,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_人見',
  '人見',
  '人見',
  NULL,
  36.168892,
  139.272168,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡部',
  '岡部',
  '岡部',
  NULL,
  36.194953,
  139.246472,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東方',
  '東方',
  '東方',
  NULL,
  36.194306,
  139.319848,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大谷_quarter_8726832649',
  '大谷',
  '大谷',
  NULL,
  36.157043,
  139.247024,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832649,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小前田',
  '小前田',
  '小前田',
  NULL,
  36.129018,
  139.225525,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_畠山',
  '畠山',
  '畠山',
  NULL,
  36.12527,
  139.268576,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832651,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野台',
  '上野台',
  '上野台',
  NULL,
  36.184155,
  139.278303,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中瀬',
  '中瀬',
  '中瀬',
  NULL,
  36.242025,
  139.282269,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832653,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_折之口',
  '折之口',
  '折之口',
  NULL,
  36.163209,
  139.2862,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_針ヶ谷',
  '針ヶ谷',
  '針ヶ谷',
  NULL,
  36.182604,
  139.233105,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832655,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_長在家',
  '長在家',
  '長在家',
  NULL,
  36.148965,
  139.291813,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_田中_quarter',
  '田中',
  '田中',
  NULL,
  36.141004,
  139.277187,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832657,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新戒',
  '新戒',
  '新戒',
  NULL,
  36.228144,
  139.285754,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_櫛引',
  '櫛引',
  '櫛引',
  NULL,
  36.165986,
  139.2387,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_普済寺',
  '普済寺',
  '普済寺',
  NULL,
  36.20609,
  139.246052,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832660,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榛沢',
  '榛沢',
  '榛沢',
  NULL,
  36.216056,
  139.205989,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832661,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_荒川',
  '荒川',
  '荒川',
  NULL,
  36.129251,
  139.240169,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832662,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宿根',
  '宿根',
  '宿根',
  NULL,
  36.191021,
  139.257578,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832663,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原郷',
  '原郷',
  '原郷',
  NULL,
  36.199835,
  139.301999,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832664,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_黒田',
  '黒田',
  '黒田',
  NULL,
  36.125998,
  139.251724,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832665,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_櫛挽',
  '櫛挽',
  '櫛挽',
  NULL,
  36.170064,
  139.229055,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山河',
  '山河',
  '山河',
  NULL,
  36.197247,
  139.231072,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832667,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_境',
  '境',
  '境',
  NULL,
  36.153304,
  139.263069,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832668,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_永田',
  '永田',
  '永田',
  NULL,
  36.137531,
  139.253437,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_後榛沢',
  '後榛沢',
  '後榛沢',
  NULL,
  36.203434,
  139.204543,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832670,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下手計',
  '下手計',
  '下手計',
  NULL,
  36.232761,
  139.270972,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832671,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_明戸',
  '明戸',
  '明戸',
  NULL,
  36.208989,
  139.303739,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山崎',
  '山崎',
  '山崎',
  NULL,
  36.195503,
  139.215184,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榛沢新田',
  '榛沢新田',
  '榛沢新田',
  NULL,
  36.202527,
  139.220043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_矢島',
  '矢島',
  '矢島',
  NULL,
  36.218921,
  139.257113,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柏合',
  '柏合',
  '柏合',
  NULL,
  36.180018,
  139.2584,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今泉_quarter_8726832677',
  '今泉',
  '今泉',
  NULL,
  36.181714,
  139.210731,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832677,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_樫合',
  '樫合',
  '樫合',
  NULL,
  36.172454,
  139.255139,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832678,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高島',
  '高島',
  '高島',
  NULL,
  36.2339187,
  139.3016845,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832679,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上敷免',
  '上敷免',
  '上敷免',
  NULL,
  36.214221,
  139.293233,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832680,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_横瀬',
  '横瀬',
  '横瀬',
  NULL,
  36.240681,
  139.254908,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832681,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上原',
  '上原',
  '上原',
  NULL,
  36.150276,
  139.273851,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菅沼',
  '菅沼',
  '菅沼',
  NULL,
  36.139559,
  139.291806,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832683,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_江原',
  '江原',
  '江原',
  NULL,
  36.230417,
  139.330883,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_瀬山',
  '瀬山',
  '瀬山',
  NULL,
  36.147644,
  139.308244,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832686,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_蓮沼',
  '蓮沼',
  '蓮沼',
  NULL,
  36.219772,
  139.319414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832687,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_石塚',
  '石塚',
  '石塚',
  NULL,
  36.228313,
  139.316268,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832688,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新井_quarter',
  '新井',
  '新井',
  NULL,
  36.218508,
  139.306284,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832689,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西田',
  '西田',
  '西田',
  NULL,
  36.22408,
  139.221726,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832690,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北根_quarter',
  '北根',
  '北根',
  NULL,
  36.143954,
  139.251378,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上増田',
  '上増田',
  '上増田',
  NULL,
  36.211305,
  139.322069,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高畑',
  '高畑',
  '高畑',
  NULL,
  36.217416,
  139.284429,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_内ケ島',
  '内ケ島',
  '内ケ島',
  NULL,
  36.220184,
  139.270124,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832694,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_堀米',
  '堀米',
  '堀米',
  NULL,
  36.217631,
  139.331361,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832695,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_成塚',
  '成塚',
  '成塚',
  NULL,
  36.223014,
  139.294055,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832696,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸森',
  '戸森',
  '戸森',
  NULL,
  36.212803,
  139.277763,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_町田',
  '町田',
  '町田',
  NULL,
  36.2268406,
  139.250062,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832698,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_国済寺',
  '国済寺',
  '国済寺',
  NULL,
  36.190811,
  139.298134,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮ケ谷戸',
  '宮ケ谷戸',
  '宮ケ谷戸',
  NULL,
  36.205912,
  139.318336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832700,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_血洗島',
  '血洗島',
  '血洗島',
  NULL,
  36.2334856,
  139.2567604,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上手計',
  '上手計',
  '上手計',
  NULL,
  36.2278785,
  139.2632999,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832703,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_白草台',
  '白草台',
  '白草台',
  NULL,
  36.121568,
  139.300713,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_沼尻',
  '沼尻',
  '沼尻',
  NULL,
  36.224675,
  139.309559,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_常盤',
  '常盤町',
  '常盤町',
  NULL,
  36.196908,
  139.299605,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_沓掛',
  '沓掛',
  '沓掛',
  NULL,
  36.21372,
  139.219719,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_起会',
  '起会',
  '起会',
  NULL,
  36.211393,
  139.271484,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西大沼',
  '西大沼',
  '西大沼',
  NULL,
  36.201974,
  139.273943,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大塚_quarter',
  '大塚',
  '大塚',
  NULL,
  36.226024,
  139.272826,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832710,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東大沼',
  '東大沼',
  '東大沼',
  NULL,
  36.202629,
  139.278774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川本明戸',
  '川本明戸',
  '川本明戸',
  NULL,
  36.139783,
  139.304083,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_二ツ小屋',
  '二ツ小屋',
  '二ツ小屋',
  NULL,
  36.2335979,
  139.3116918,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_伊勢方',
  '伊勢方',
  '伊勢方',
  NULL,
  36.207159,
  139.262861,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_曲田',
  '曲田',
  '曲田',
  NULL,
  36.203371,
  139.269136,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_田谷',
  '田谷',
  '田谷',
  NULL,
  36.2032087,
  139.2835486,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726832716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_machiya_quarter',
  '大字町谷',
  'まちや',
  '{"en":"Machiya"}'::jsonb,
  35.847623,
  139.611954,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833921,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shibiraki',
  '大字新開',
  'しびらき',
  '{"en":"Shibiraki"}'::jsonb,
  35.84522,
  139.612636,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833937,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakajima',
  '大字中島',
  'なかじま',
  '{"en":"Nakajima"}'::jsonb,
  35.849373,
  139.607017,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833938,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamimotojuku',
  '大字南元宿',
  'みなみもとじゅく',
  '{"en":"Minamimotojuku"}'::jsonb,
  35.845881,
  139.611974,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833939,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yamakubo',
  '大字山久保',
  'やまくぼ',
  '{"en":"Yamakubo"}'::jsonb,
  35.851137,
  139.606238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_seki',
  '大字関',
  'せき',
  '{"en":"Seki"}'::jsonb,
  35.837422,
  139.614145,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726833941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字白石',
  '大字白石',
  '大字白石',
  NULL,
  36.15547,
  139.167508,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字猪俣',
  '大字猪俣',
  '大字猪俣',
  NULL,
  36.152135,
  139.185065,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字円良田',
  '大字円良田',
  '大字円良田',
  NULL,
  36.140308,
  139.165553,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字関',
  '大字関',
  '大字関',
  NULL,
  36.1935995,
  139.1939494,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字駒衣',
  '大字駒衣',
  '大字駒衣',
  NULL,
  36.176845,
  139.169195,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字甘粕',
  '大字甘粕',
  '大字甘粕',
  NULL,
  36.168817,
  139.185671,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下児玉',
  '大字下児玉',
  '大字下児玉',
  NULL,
  36.203345,
  139.166767,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字沼上',
  '大字沼上',
  '大字沼上',
  NULL,
  36.18858,
  139.165715,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字古郡',
  '大字古郡',
  '大字古郡',
  NULL,
  36.180867,
  139.187103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小茂田',
  '大字小茂田',
  '大字小茂田',
  NULL,
  36.204087,
  139.191965,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字阿那志',
  '大字阿那志',
  '大字阿那志',
  NULL,
  36.187948,
  139.188679,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北十条',
  '大字北十条',
  '大字北十条',
  NULL,
  36.201052,
  139.173626,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字木部',
  '大字木部',
  '大字木部',
  NULL,
  36.171489,
  139.175108,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字南十条',
  '大字南十条',
  '大字南十条',
  NULL,
  36.19454,
  139.164222,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中里',
  '大字中里',
  '大字中里',
  NULL,
  36.163992,
  139.176566,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字根木',
  '大字根木',
  '大字根木',
  NULL,
  36.192154,
  139.181177,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726834277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南阿賀野',
  '南阿賀野',
  '南阿賀野',
  NULL,
  36.2327431,
  139.2525642,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北阿賀野',
  '北阿賀野',
  '北阿賀野',
  NULL,
  36.2361678,
  139.2547565,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本田ケ谷',
  '本田ケ谷',
  '本田ケ谷',
  NULL,
  36.208509,
  139.32978,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大塚島',
  '大塚島',
  '大塚島',
  NULL,
  36.214019,
  139.266462,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷之',
  '谷之',
  '谷之',
  NULL,
  36.206267,
  139.266478,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西島',
  '西島',
  '西島',
  NULL,
  36.203734,
  139.286152,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤野木',
  '藤野木',
  '藤野木',
  NULL,
  36.214768,
  139.324817,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_国済寺_quarter',
  '国済寺町',
  '国済寺町',
  NULL,
  36.190898,
  139.30725,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_武川',
  '武川',
  '武川',
  NULL,
  36.144872,
  139.283186,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_緑台',
  '緑台',
  '緑台',
  NULL,
  36.130107,
  139.217082,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡里',
  '岡里',
  '岡里',
  NULL,
  36.211391,
  139.242638,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_見晴_quarter',
  '見晴町',
  '見晴町',
  NULL,
  36.193109,
  139.266003,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_深谷',
  '深谷',
  '深谷',
  NULL,
  36.201451,
  139.285414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726842463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字用土',
  '大字用土',
  '大字用土',
  NULL,
  36.156287,
  139.214121,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西ノ入',
  '西ノ入',
  '西ノ入',
  NULL,
  36.0866812,
  139.196425,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_桜沢',
  '桜沢',
  '桜沢',
  NULL,
  36.1299867,
  139.197099,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fuupu',
  '風布',
  '風布',
  '{"en":"Fuupu"}'::jsonb,
  36.1048705,
  139.1500212,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_折原',
  '折原',
  '折原',
  NULL,
  36.1108055,
  139.1763873,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤浜',
  '赤浜',
  '赤浜',
  NULL,
  36.1146525,
  139.2494365,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860058,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_末野',
  '末野',
  '末野',
  NULL,
  36.1221259,
  139.1690258,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鉢形',
  '鉢形',
  '鉢形',
  NULL,
  36.1125106,
  139.2022656,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_牟礼',
  '牟礼',
  '牟礼',
  NULL,
  36.0982567,
  139.2523652,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860061,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_金尾',
  '金尾',
  '金尾',
  NULL,
  36.1214224,
  139.1495324,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今',
  '今市',
  '今市',
  NULL,
  36.1024719,
  139.2712611,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860063,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_秋山',
  '秋山',
  '秋山',
  NULL,
  36.0998077,
  139.1695459,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860064,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_寄居',
  '寄居',
  '寄居',
  NULL,
  36.1157607,
  139.196369,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860065,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三ケ山',
  '三ケ山',
  '三ケ山',
  NULL,
  36.1018429,
  139.2186884,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860066,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_立原',
  '立原',
  '立原',
  NULL,
  36.1054544,
  139.1887165,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860067,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三品',
  '三品',
  '三品',
  NULL,
  36.0949645,
  139.1832975,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takanosu_quarter',
  '鷹巣',
  '鷹巣',
  '{"en":"Takanosu"}'::jsonb,
  36.1016045,
  139.2827831,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860069,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小園',
  '小園',
  '小園',
  NULL,
  36.1166634,
  139.2273266,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsuyunashi',
  '露梨子',
  '露梨子',
  '{"en":"Tsuyunashi"}'::jsonb,
  36.1108904,
  139.2155688,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hodawara',
  '保田原',
  '保田原',
  '{"en":"Hodawara"}'::jsonb,
  36.1150736,
  139.2133155,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤田',
  '藤田',
  '藤田',
  NULL,
  36.1168979,
  139.1841344,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8726860073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koshinden',
  '古新田',
  'こしんでん',
  '{"en":"Koshinden"}'::jsonb,
  35.7979838,
  139.8503378,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8733934422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oze',
  '大瀬',
  'おおぜ',
  '{"en":"Oze"}'::jsonb,
  35.8028394,
  139.8511934,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8733934427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamikawasaki',
  '南川崎',
  'みなみかわさき',
  '{"en":"Minamikawasaki"}'::jsonb,
  35.8132544,
  139.8586929,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8733934428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kizone',
  '木曽根',
  'きぞね',
  '{"en":"Kizone"}'::jsonb,
  35.8171346,
  139.850893,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8733934429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iseno',
  '伊勢野',
  'いせの',
  '{"en":"Iseno"}'::jsonb,
  35.8096871,
  139.8546695,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8733934430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_togasaki',
  '戸ヶ崎',
  'とがさき',
  '{"en":"Togasaki"}'::jsonb,
  35.8043447,
  139.858489,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8735469756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimotakano',
  '下高野',
  'しもたかの',
  '{"en":"Shimotakano"}'::jsonb,
  36.044023,
  139.707485,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sugito',
  '杉戸',
  'すぎと',
  '{"en":"Sugito"}'::jsonb,
  36.03907,
  139.727484,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hongo_quarter',
  '本郷',
  'ほんごう',
  '{"en":"Hongo"}'::jsonb,
  36.004517,
  139.7524311,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_washinosu',
  '鷲巣',
  'わしのす',
  '{"en":"Washinosu"}'::jsonb,
  36.044446,
  139.798463,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyamae_quarter',
  '宮前',
  'みやまえ',
  '{"en":"Miyamae"}'::jsonb,
  36.046979,
  139.791388,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kizuuchi',
  '木津内',
  'きづうち',
  '{"en":"Kizuuchi"}'::jsonb,
  36.0546951,
  139.7888357,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimono',
  '下野',
  'しもの',
  '{"en":"Shimono"}'::jsonb,
  36.0564852,
  139.7026594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kinokawa',
  '木野川',
  'きのかわ',
  '{"en":"Kinokawa"}'::jsonb,
  36.038287,
  139.801612,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_byobu',
  '屏風',
  'びょうぶ',
  '{"en":"Byobu"}'::jsonb,
  36.046846,
  139.783221,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ojima',
  '大島',
  'おおじま',
  '{"en":"Ojima"}'::jsonb,
  36.0480684,
  139.7220916,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_menuma_quarter',
  '目沼',
  'めぬま',
  '{"en":"Menuma"}'::jsonb,
  36.05294,
  139.783532,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirotonuma',
  '広戸沼',
  'ひろとぬま',
  '{"en":"Hirotonuma"}'::jsonb,
  36.046676,
  139.76244,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_barajima',
  '茨島',
  'ばらじま',
  '{"en":"Barajima"}'::jsonb,
  36.0512721,
  139.718915,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794014532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_wado',
  '和戸',
  'わど',
  '{"en":"Wado"}'::jsonb,
  36.049817,
  139.691265,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishikumehara',
  '西粂原',
  'にしくめはら',
  '{"en":"Nishikumehara"}'::jsonb,
  36.0336702,
  139.6915435,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_suka_quarter',
  '須賀',
  'すか',
  '{"en":"Suka"}'::jsonb,
  36.032378,
  139.709091,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyahigashi',
  '宮東',
  'みやひがし',
  '{"en":"Miyahigashi"}'::jsonb,
  36.011753,
  139.7454392,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakajima_quarter',
  '中島',
  'なかじま',
  '{"en":"Nakajima"}'::jsonb,
  36.016494,
  139.738853,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_naka',
  '中',
  'なか',
  '{"en":"Naka"}'::jsonb,
  36.003505,
  139.723327,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashi',
  '東',
  'ひがし',
  '{"en":"Higashi"}'::jsonb,
  36.002327,
  139.731548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056243,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanehara',
  '金原',
  'かねはら',
  '{"en":"Kanehara"}'::jsonb,
  36.008023,
  139.715003,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishibara',
  '西原',
  'にしばら',
  '{"en":"Nishibara"}'::jsonb,
  36.0107842,
  139.7189362,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakasai',
  '逆井',
  'さかさい',
  '{"en":"Sakasai"}'::jsonb,
  36.015704,
  139.709799,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_himemiya',
  '姫宮',
  'ひめみや',
  '{"en":"Himemiya"}'::jsonb,
  36.009964,
  139.73429,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_dobutsu',
  '道佛',
  'どうぶつ',
  '{"en":"Dobutsu"}'::jsonb,
  36.0195195,
  139.731514,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kokuno',
  '国納',
  'こくのう',
  '{"en":"Kokuno"}'::jsonb,
  36.03897,
  139.6974941,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawabata',
  '川端',
  'かわばた',
  '{"en":"Kawabata"}'::jsonb,
  36.006237,
  139.745288,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_teshigawara',
  '勅使河原',
  'てしがわら',
  '{"en":"Teshigawara"}'::jsonb,
  36.2616024,
  139.1233822,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hacchogawara',
  '八町河原',
  'はっちょうがわら',
  '{"en":"Hacchogawara"}'::jsonb,
  36.2716334,
  139.1627979,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oshibo',
  '忍保',
  'おしぼ',
  '{"en":"Oshibo"}'::jsonb,
  36.2686528,
  139.1513657,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kanakubo',
  '金久保',
  'かなくぼ',
  '{"en":"Kanakubo"}'::jsonb,
  36.2659506,
  139.1366963,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mayuzumi',
  '黛',
  'まゆずみ',
  '{"en":"Mayuzumi"}'::jsonb,
  36.270958,
  139.141362,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_bishado',
  '毘沙吐',
  'びしゃど',
  '{"en":"Bishado"}'::jsonb,
  36.280547,
  139.129175,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794056276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tobu',
  '東部',
  'とうぶ',
  '{"en":"Tobu"}'::jsonb,
  36.0102907,
  139.4906691,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794143448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashino',
  '東野',
  'ひがしの',
  '{"en":"Higashino"}'::jsonb,
  35.9896784,
  139.506564,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794143449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsunaga_quarter',
  '松永',
  'まつなが',
  '{"en":"Matsunaga"}'::jsonb,
  36.016559,
  139.479597,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794143450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omino',
  '小見野',
  'おみの',
  '{"en":"Omino"}'::jsonb,
  36.012023,
  139.486221,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794143451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiyoshimi',
  '西吉見',
  'にしよしみ',
  '{"en":"Nishiyoshimi"}'::jsonb,
  36.028966,
  139.434273,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794151023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iko',
  '伊古',
  'いこ',
  '{"en":"Iko"}'::jsonb,
  36.0717668,
  139.3376631,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153688,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_izumi',
  '和泉',
  'いずみ',
  '{"en":"Izumi"}'::jsonb,
  36.0873177,
  139.327787,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153689,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukinowa',
  '月輪',
  'つきのわ',
  '{"en":"Tsukinowa"}'::jsonb,
  36.045591,
  139.358236,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153690,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mizufusa',
  '水房',
  'みずふさ',
  '{"en":"Mizufusa"}'::jsonb,
  36.056667,
  139.341351,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miyako',
  '都',
  'みやこ',
  '{"en":"Miyako"}'::jsonb,
  36.0406208,
  139.3659456,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sugada',
  '菅田',
  'すがだ',
  '{"en":"Sugada"}'::jsonb,
  36.0863315,
  139.3408077,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794153693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_内谷',
  '内谷',
  '内谷',
  NULL,
  35.8146357,
  139.6356762,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794191645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_重瀬',
  '重瀬',
  '重瀬',
  NULL,
  35.824334,
  139.626518,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794191646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_曲本',
  '曲本',
  'まがもと',
  NULL,
  35.83048,
  139.623151,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8794191647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yagyu',
  '野牛',
  'やぎゅう',
  '{"en":"Yagyu"}'::jsonb,
  36.039175,
  139.667633,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796844112,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shinozu',
  '篠津',
  'しのづ',
  '{"en":"Shinozu"}'::jsonb,
  36.0316589,
  139.6585842,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796844113,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kaminoda_quarter',
  '上野田',
  'かみのだ',
  '{"en":"Kaminoda"}'::jsonb,
  36.0239457,
  139.6857287,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796844114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shiraoka',
  '白岡',
  'しらおか',
  '{"en":"Shiraoka"}'::jsonb,
  36.0184706,
  139.6590883,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796844115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takaiwa',
  '高岩',
  'たかいわ',
  '{"en":"Takaiwa"}'::jsonb,
  36.036313,
  139.68166,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796844116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_suneori',
  '脚折',
  'すねおり',
  '{"en":"Suneori"}'::jsonb,
  35.9426246,
  139.4005081,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796867332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mitsugi_shinden',
  '三ツ木新田',
  'みつぎしんでん',
  '{"en":"Mitsugi-shinden"}'::jsonb,
  35.9231049,
  139.3825034,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796867356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kyoeicho',
  '共栄町',
  'きょうえいちょう',
  '{"en":"Kyoeicho"}'::jsonb,
  35.9471605,
  139.3996713,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796867357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fujimi',
  '富士見',
  'ふじみ',
  '{"en":"Fujimi"}'::jsonb,
  35.947686,
  139.415127,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796867360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimonoda_quarter',
  '下野田',
  'しものだ',
  '{"en":"Shimonoda"}'::jsonb,
  36.0172637,
  139.6933661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796870717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_teratsuka',
  '寺塚',
  'てらつか',
  '{"en":"Teratsuka"}'::jsonb,
  36.024438,
  139.672197,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796870718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukuoka_shinden',
  '福岡新田',
  'ふくおかしんでん',
  '{"en":"Fukuoka-shinden"}'::jsonb,
  35.8750158,
  139.5419672,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796883688,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kyoho',
  '共保',
  'きょうほ',
  '{"en":"Kyoho"}'::jsonb,
  35.879254,
  139.840591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796921996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_miwanoe',
  '三輪野江',
  'みわのえ',
  '{"en":"Miwanoe"}'::jsonb,
  35.872971,
  139.887343,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796921997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimouchikawa',
  '下内川',
  'しもうちかわ',
  '{"en":"Shimouchikawa"}'::jsonb,
  35.923443,
  139.8591179,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796921998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukaishinden',
  '深井新田',
  'ふかいしんでん',
  '{"en":"Fukaishinden"}'::jsonb,
  35.906899,
  139.873666,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796921999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hachikoshinden',
  '八子新田',
  'はちこしんでん',
  '{"en":"Hachikoshinden"}'::jsonb,
  35.916086,
  139.864978,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kato',
  '加藤',
  'かとう',
  '{"en":"Kato"}'::jsonb,
  35.8873125,
  139.8830984,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirakatashinden',
  '平方新田',
  'ひらかたしんでん',
  '{"en":"Hirakatashinden"}'::jsonb,
  35.898895,
  139.878836,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshiya',
  '吉屋',
  'よしや',
  '{"en":"Yoshiya"}'::jsonb,
  35.891825,
  139.885439,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922003,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takahisa',
  '高久',
  'たかひさ',
  '{"en":"Takahisa"}'::jsonb,
  35.871797,
  139.862021,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hanwari',
  '半割',
  'はんわり',
  '{"en":"Hanwari"}'::jsonb,
  35.883403,
  139.885708,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922005,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ho_quarter',
  '保',
  'ほ',
  '{"en":"Ho"}'::jsonb,
  35.8818789,
  139.8496905,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922006,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakazone_quarter',
  '中曽根',
  'なかぞね',
  '{"en":"Nakazone"}'::jsonb,
  35.868651,
  139.864247,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kiurishinden',
  '木売新田',
  'きうりしんでん',
  '{"en":"Kiurishinden"}'::jsonb,
  35.878143,
  139.860769,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakaecho',
  '栄町',
  'さかえちょう',
  '{"en":"Sakaecho"}'::jsonb,
  35.887247,
  139.8544247,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshikawa',
  '吉川',
  'よしかわ',
  '{"en":"Yoshikawa"}'::jsonb,
  35.8875809,
  139.840228,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakano_quarter',
  '中野',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  35.8828179,
  139.8593747,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iijima_quarter',
  '飯島',
  'いいじま',
  '{"en":"Iijima"}'::jsonb,
  35.88003,
  139.882949,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hiranuma_quarter',
  '平沼',
  'ひらぬま',
  '{"en":"Hiranuma"}'::jsonb,
  35.889099,
  139.857109,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922013,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nabekoji',
  '鍋小路',
  'なべこうじ',
  '{"en":"Nabekoji"}'::jsonb,
  35.910465,
  139.866692,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_dojo_quarter',
  '土場',
  'どじょう',
  '{"en":"Dojo"}'::jsonb,
  35.8774155,
  139.883007,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takadomi',
  '高富',
  'たかどみ',
  '{"en":"Takadomi"}'::jsonb,
  35.873659,
  139.855528,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796922016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawano',
  '川野',
  'かわの',
  '{"en":"Kawano"}'::jsonb,
  35.8995069,
  139.8478892,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tomishinden',
  '富新田',
  'とみしんでん',
  '{"en":"Tomishinden"}'::jsonb,
  35.875781,
  139.862627,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamisasazuka',
  '上笹塚',
  'かみささづか',
  '{"en":"Kamisasazuka"}'::jsonb,
  35.90338,
  139.869494,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshikawa_danchi',
  '吉川団地',
  'よしかわだんち',
  '{"en":"Yoshikawa-danchi"}'::jsonb,
  35.8922102,
  139.8483294,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_komatsugawa',
  '小松川',
  'こまつがわ',
  '{"en":"Komatsugawa"}'::jsonb,
  35.883885,
  139.862766,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shishimizuka',
  '鹿見塚',
  'ししみづか',
  '{"en":"Shishimizuka"}'::jsonb,
  35.889388,
  139.872697,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923134,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_seki_quarter',
  '関',
  'せき',
  '{"en":"Seki"}'::jsonb,
  35.894932,
  139.847334,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923139,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sekishinden',
  '関新田',
  'せきしんでん',
  '{"en":"Sekishinden"}'::jsonb,
  35.89765,
  139.873581,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kawadomi',
  '川富',
  'かわどみ',
  '{"en":"Kawadomi"}'::jsonb,
  35.896723,
  139.846766,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakai',
  '中井',
  'なかい',
  '{"en":"Nakai"}'::jsonb,
  35.885835,
  139.8643342,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923157,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_saranuma',
  '皿沼',
  'さらぬま',
  '{"en":"Saranuma"}'::jsonb,
  35.884208,
  139.876875,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923158,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_doniwa',
  '道庭',
  'どうにわ',
  '{"en":"Doniwa"}'::jsonb,
  35.865983,
  139.862083,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ainoya',
  '会野谷',
  'あいのや',
  '{"en":"Ainoya"}'::jsonb,
  35.897431,
  139.859801,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_futatsunuma',
  '二ツ沼',
  'ふたつぬま',
  '{"en":"Futatsunuma"}'::jsonb,
  35.874504,
  139.869626,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakajima_quarter_8796923166',
  '中島',
  'なかじま',
  '{"en":"Nakajima"}'::jsonb,
  35.878188,
  139.866809,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796923166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_soshinden',
  '惣新田',
  'そうしんでん',
  '{"en":"Soshinden"}'::jsonb,
  36.060365,
  139.771209,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamitakano',
  '上高野',
  'かみたかの',
  '{"en":"Kamitakano"}'::jsonb,
  36.06042,
  139.713703,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_chizuka',
  '千塚',
  'ちづか',
  '{"en":"Chizuka"}'::jsonb,
  36.0906802,
  139.7022156,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_toshima',
  '戸島',
  'としま',
  '{"en":"Toshima"}'::jsonb,
  36.04725,
  139.735717,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sotogoma',
  '外国府間',
  'そとごうま',
  '{"en":"Sotogoma"}'::jsonb,
  36.1035791,
  139.7239562,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakakawasaki',
  '中川崎',
  'なかかわさき',
  '{"en":"Nakakawasaki"}'::jsonb,
  36.080917,
  139.697997,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiuwada',
  '上宇和田',
  'かみうわだ',
  '{"en":"Kamiuwada"}'::jsonb,
  36.075835,
  139.764238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimokawasaki',
  '下川崎',
  'しもかわさき',
  '{"en":"Shimokawasaki"}'::jsonb,
  36.082599,
  139.706038,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takasuka',
  '高須賀',
  'たかすか',
  '{"en":"Takasuka"}'::jsonb,
  36.0955512,
  139.7180667,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_makinoji',
  '槙野地',
  'まきのじ',
  '{"en":"Makinoji"}'::jsonb,
  36.0611033,
  139.7839716,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tenjinshima',
  '天神島',
  'てんじんしま',
  '{"en":"Tenjinshima"}'::jsonb,
  36.0667522,
  139.7318928,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_endouchi',
  '円藤内',
  'えんどううち',
  '{"en":"Endouchi"}'::jsonb,
  36.091543,
  139.7127121,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yoshino',
  '吉野',
  'よしの',
  '{"en":"Yoshino"}'::jsonb,
  36.0534212,
  139.7268176,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uchigoma',
  '内国府間',
  'うちごうま',
  '{"en":"Uchigoma"}'::jsonb,
  36.090528,
  139.721829,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishisekiyado',
  '西関宿',
  'にしせきやど',
  '{"en":"Nishisekiyado"}'::jsonb,
  36.08599,
  139.775174,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hanajima',
  '花島',
  'はなじま',
  '{"en":"Hanajima"}'::jsonb,
  36.0670591,
  139.7809526,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955848,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakajima_quarter_8796955849',
  '中島',
  'なかじま',
  '{"en":"Nakajima"}'::jsonb,
  36.0788268,
  139.7764869,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_matsuishi',
  '松石',
  'まついし',
  '{"en":"Matsuishi"}'::jsonb,
  36.09826,
  139.710824,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955850,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakae',
  '栄',
  'さかえ',
  '{"en":"Sakae"}'::jsonb,
  36.057007,
  139.720884,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimouwada',
  '下宇和田',
  'しもうわだ',
  '{"en":"Shimouwada"}'::jsonb,
  36.070045,
  139.767365,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hosono',
  '細野',
  'ほその',
  '{"en":"Hosono"}'::jsonb,
  36.0553037,
  139.77912,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8796955853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ishii',
  '石井',
  'いしい',
  '{"en":"Ishii"}'::jsonb,
  35.9742644,
  139.4161755,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_akao',
  '赤尾',
  'あかお',
  '{"en":"Akao"}'::jsonb,
  35.9900817,
  139.4315178,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_konuma',
  '小沼',
  'こぬま',
  '{"en":"Konuma"}'::jsonb,
  35.9714896,
  139.4417436,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tawame',
  '多和目',
  'たわめ',
  '{"en":"Tawame"}'::jsonb,
  35.9212158,
  139.3388138,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yokonuma',
  '横沼',
  'よこぬま',
  '{"en":"Yokonuma"}'::jsonb,
  35.96567,
  139.4458858,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koya_quarter',
  '紺屋',
  'こうや',
  '{"en":"Koya"}'::jsonb,
  35.9595254,
  139.4492516,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukagoshi',
  '塚越',
  'つかごし',
  '{"en":"Tsukagoshi"}'::jsonb,
  35.9701448,
  139.4225738,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255013,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_morido',
  '森戸',
  'もりど',
  '{"en":"Morido"}'::jsonb,
  35.9361679,
  139.3574426,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_katayanagi_quarter',
  '片柳',
  'かたやなぎ',
  '{"en":"Katayanagi"}'::jsonb,
  35.976796,
  139.405452,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimada',
  '島田',
  'しまだ',
  '{"en":"Shimada"}'::jsonb,
  35.989113,
  139.417487,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797255016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_asaba',
  '浅羽',
  'あさば',
  '{"en":"Asaba"}'::jsonb,
  35.950968,
  139.375549,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328217,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakaosaka',
  '中小坂',
  'なかおさか',
  '{"en":"Nakaosaka"}'::jsonb,
  35.9480255,
  139.441261,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_toguchi',
  '戸口',
  'とぐち',
  '{"en":"Toguchi"}'::jsonb,
  35.974776,
  139.382969,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_aoki',
  '青木',
  'あおき',
  '{"en":"Aoki"}'::jsonb,
  35.9674265,
  139.4335189,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yokkaichiba',
  '四日市場',
  'よっかいちば',
  '{"en":"Yokkaichiba"}'::jsonb,
  35.9294598,
  139.349622,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitaasaba',
  '北浅羽',
  'きたあさば',
  '{"en":"Kitaasaba"}'::jsonb,
  35.9747931,
  139.3589962,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitaotsuka',
  '北大塚',
  'きたおおつか',
  '{"en":"Kitaotsuka"}'::jsonb,
  35.956999,
  139.371414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_zennoji',
  '善能寺',
  'ぜんのうじ',
  '{"en":"Zennoji"}'::jsonb,
  35.9626034,
  139.3555671,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyoshida_quarter',
  '上吉田',
  'かみよしだ',
  '{"en":"Kamiyoshida"}'::jsonb,
  35.98081,
  139.394855,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_joganji',
  '成願寺',
  'じょうがんじ',
  '{"en":"Joganji"}'::jsonb,
  35.956433,
  139.36324,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328226,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukasaki',
  '塚崎',
  'つかさき',
  '{"en":"Tsukasaki"}'::jsonb,
  35.964706,
  139.375554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328227,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kayagata',
  '萱方',
  'かやがた',
  '{"en":"Kayagata"}'::jsonb,
  35.9441572,
  139.3622368,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tomiya',
  '戸宮',
  'とみや',
  '{"en":"Tomiya"}'::jsonb,
  35.9610249,
  139.4267512,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_atsugawa',
  '厚川',
  'あつがわ',
  '{"en":"Atsugawa"}'::jsonb,
  35.9440333,
  139.3691398,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_higashiwada',
  '東和田',
  'ひがしわだ',
  '{"en":"Higashiwada"}'::jsonb,
  35.9816561,
  139.385882,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakazato',
  '中里',
  'なかざと',
  '{"en":"Nakazato"}'::jsonb,
  35.9619274,
  139.3799695,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sawaki',
  '沢木',
  'さわき',
  '{"en":"Sawaki"}'::jsonb,
  35.978058,
  139.377467,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_niihori',
  '新堀',
  'にいほり',
  '{"en":"Niihori"}'::jsonb,
  35.9667731,
  139.3703149,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kakenoue',
  '欠ノ上',
  'かけのうえ',
  '{"en":"Kakenoue"}'::jsonb,
  35.951125,
  139.359683,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kitamine',
  '北峰',
  'きたみね',
  '{"en":"Kitamine"}'::jsonb,
  35.9615086,
  139.3671017,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shingaya',
  '新ケ谷',
  'しんがや',
  '{"en":"Shingaya"}'::jsonb,
  35.980413,
  139.389947,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_horigome',
  '堀込',
  'ほりごめ',
  '{"en":"Horigome"}'::jsonb,
  35.9653288,
  139.3655247,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koyama',
  '小山',
  'こやま',
  '{"en":"Koyama"}'::jsonb,
  35.965362,
  139.356885,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_aota',
  '粟生田',
  'あおた',
  '{"en":"Aota"}'::jsonb,
  35.960012,
  139.384181,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kaneda',
  '金田',
  'かねだ',
  '{"en":"Kaneda"}'::jsonb,
  35.9765714,
  139.3716913,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nagaoka',
  '長岡',
  'ながおか',
  '{"en":"Nagaoka"}'::jsonb,
  35.9695963,
  139.3532021,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328259,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_imanishi',
  '今西',
  'いまにし',
  '{"en":"Imanishi"}'::jsonb,
  35.97534,
  139.366572,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328260,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_takenouchi',
  '竹之内',
  'たけのうち',
  '{"en":"Takenouchi"}'::jsonb,
  35.9680299,
  139.357398,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sakado',
  '坂戸',
  'さかど',
  '{"en":"Sakado"}'::jsonb,
  35.9685872,
  139.4021968,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_katayanagi_shinden',
  '片柳新田',
  'かたやなぎしんでん',
  '{"en":"Katayanagi-shinden"}'::jsonb,
  35.9692245,
  139.4075103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797328298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ichisuke',
  '市助',
  'いちすけ',
  '{"en":"Ichisuke"}'::jsonb,
  35.826236,
  139.88473,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yanaka_quarter',
  '谷中',
  'やなか',
  '{"en":"Yanaka"}'::jsonb,
  35.8260937,
  139.8819353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikoe',
  '彦江',
  'ひこえ',
  '{"en":"Hikoe"}'::jsonb,
  35.834089,
  139.873136,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kobo',
  '幸房',
  'こうぼう',
  '{"en":"Kobo"}'::jsonb,
  35.8361122,
  139.88108,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427352,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hanta',
  '半田',
  'はんた',
  '{"en":"Hanta"}'::jsonb,
  35.862884,
  139.870835,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_azumacho',
  '東町',
  'あずまちょう',
  '{"en":"Azumacho"}'::jsonb,
  35.790474,
  139.88611,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tanakashinden',
  '田中新田',
  'たなかしんでん',
  '{"en":"Tanakashinden"}'::jsonb,
  35.862391,
  139.89387,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamihasunuma',
  '南蓮沼',
  'みなみはすぬま',
  '{"en":"Minamihasunuma"}'::jsonb,
  35.84553,
  139.864613,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_motai',
  '茂田井',
  'もたい',
  '{"en":"Motai"}'::jsonb,
  35.8403481,
  139.8763195,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ohiroto',
  '大広戸',
  'おおひろと',
  '{"en":"Ohiroto"}'::jsonb,
  35.8453635,
  139.8769938,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_koyabori',
  '小谷堀',
  'こやぼり',
  '{"en":"Koyabori"}'::jsonb,
  35.865164,
  139.88645,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ushiroya',
  '後谷',
  'うしろや',
  '{"en":"Ushiroya"}'::jsonb,
  35.862373,
  139.883208,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iwanoki',
  '岩野木',
  'いわのき',
  '{"en":"Iwanoki"}'::jsonb,
  35.8330389,
  139.8860337,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_zemma',
  '前間',
  'ぜんま',
  '{"en":"Zemma"}'::jsonb,
  35.863376,
  139.891281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427368,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nizo',
  '仁蔵',
  'にぞう',
  '{"en":"Nizo"}'::jsonb,
  35.847365,
  139.877886,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yomaki',
  '寄巻',
  'よまき',
  '{"en":"Yomaki"}'::jsonb,
  35.796381,
  139.865061,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimohikokawado',
  '下彦川戸',
  'しもひこかわど',
  '{"en":"Shimohikokawado"}'::jsonb,
  35.8491026,
  139.8648706,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikonari',
  '彦成',
  'ひこなり',
  '{"en":"Hikonari"}'::jsonb,
  35.8594829,
  139.8799516,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_unemeshinden',
  '采女新田',
  'うねめしんでん',
  '{"en":"Unemeshinden"}'::jsonb,
  35.864129,
  139.863698,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427390,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tango',
  '丹後',
  'たんご',
  '{"en":"Tango"}'::jsonb,
  35.859198,
  139.891073,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikosawa',
  '彦沢',
  'ひこさわ',
  '{"en":"Hikosawa"}'::jsonb,
  35.8345155,
  139.8730631,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamakura',
  '鎌倉',
  'かまくら',
  '{"en":"Kamakura"}'::jsonb,
  35.7950788,
  139.8639365,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797427394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamibanba',
  '上馬場',
  'かみばんば',
  '{"en":"Kamibanba"}'::jsonb,
  35.820584,
  139.824916,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797463595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakabanba',
  '中馬場',
  'なかばんば',
  '{"en":"Nakabanba"}'::jsonb,
  35.8221741,
  139.8434228,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797463596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_muneoka',
  '宗岡',
  'むねおか',
  '{"en":"Muneoka"}'::jsonb,
  35.846371,
  139.594839,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8797486631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sueda',
  '末田',
  'すえだ',
  '{"en":"Sueda"}'::jsonb,
  35.915669,
  139.744774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yokone',
  '横根',
  'よこね',
  '{"en":"Yokone"}'::jsonb,
  35.922466,
  139.700829,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iwatsuki',
  '岩槻',
  'いわつき',
  '{"en":"Iwatsuki"}'::jsonb,
  35.957834,
  139.686404,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kakura',
  '加倉',
  'かくら',
  '{"en":"Kakura"}'::jsonb,
  35.937002,
  139.6901336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minamihirano',
  '南平野',
  'みなみひらの',
  '{"en":"Minamihirano"}'::jsonb,
  35.962673,
  139.7047,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_ota_quarter',
  '太田',
  'おおた',
  '{"en":"Ota"}'::jsonb,
  35.9597717,
  139.6987725,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8802116363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omagi_quarter',
  '大間木',
  'おおまぎ',
  '{"en":"Omagi"}'::jsonb,
  35.864834,
  139.711109,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8803553069,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimoyamaguchi_shinden',
  '下山口新田',
  'しもやまぐちしんでん',
  '{"en":"Shimoyamaguchi-shinden"}'::jsonb,
  35.865657,
  139.7164281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8803553070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omaki',
  '大牧',
  'おおまき',
  '{"en":"Omaki"}'::jsonb,
  35.875004,
  139.70928,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8803553071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oyaguchi_quarter',
  '大谷口',
  'おおやぐち',
  '{"en":"Oyaguchi"}'::jsonb,
  35.8647918,
  139.6925277,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8803553072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_teigai',
  '堤外',
  'ていがい',
  '{"en":"Teigai"}'::jsonb,
  35.832876,
  139.619656,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8803987887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sasamaru',
  '笹丸',
  'ささまる',
  '{"en":"Sasamaru"}'::jsonb,
  35.9122117,
  139.6744531,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804295575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_katayashinden',
  '加田屋新田',
  'かたやしんでん',
  '{"en":"Katayashinden"}'::jsonb,
  35.915847,
  139.679831,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804295579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamika',
  '上加',
  'かみか',
  '{"en":"Kamika"}'::jsonb,
  35.931542,
  139.605794,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804476224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiasuma',
  '西遊馬',
  'にしあすま',
  '{"en":"Nishiasuma"}'::jsonb,
  35.9088167,
  139.5669576,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500665,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_futatsumiya',
  '二ツ宮',
  'ふたつみや',
  '{"en":"Futatsumiya"}'::jsonb,
  35.890494,
  139.569985,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sashiogi',
  '指扇',
  'さしおうぎ',
  '{"en":"Sashiogi"}'::jsonb,
  35.9140475,
  139.5796148,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500667,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_horai',
  '宝来',
  'ほうらい',
  '{"en":"Horai"}'::jsonb,
  35.925786,
  139.555998,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500668,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_shimane',
  '島根',
  'しまね',
  '{"en":"Shimane"}'::jsonb,
  35.883134,
  139.591895,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500669,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sajikawa',
  '佐知川',
  'さじかわ',
  '{"en":"Sajikawa"}'::jsonb,
  35.9029229,
  139.5834111,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iidashinden',
  '飯田新田',
  'いいだしんでん',
  '{"en":"Iidashinden"}'::jsonb,
  35.886947,
  139.555376,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakanobayashi',
  '中野林',
  'なかのばやし',
  '{"en":"Nakanobayashi"}'::jsonb,
  35.892519,
  139.588012,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uetayahon',
  '植田谷本',
  'うえたやほん',
  '{"en":"Uetayahon"}'::jsonb,
  35.89044,
  139.591449,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nishiarai',
  '西新井',
  'にしあらい',
  '{"en":"Nishiarai"}'::jsonb,
  35.941418,
  139.586906,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_showa_quarter',
  '昭和',
  'しょうわ',
  '{"en":"Showa"}'::jsonb,
  35.883919,
  139.576179,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500677,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sanjomachi',
  '三条町',
  'さんじょうまち',
  '{"en":"Sanjomachi"}'::jsonb,
  35.887092,
  139.586951,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500678,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsuchiya',
  '土屋',
  'つちや',
  '{"en":"Tsuchiya"}'::jsonb,
  35.910981,
  139.5702441,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500679,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_tsukamoto_quarter',
  '塚本',
  'つかもと',
  '{"en":"Tsukamoto"}'::jsonb,
  35.87697,
  139.5705378,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500680,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_iida_quarter_8804500681',
  '飯田',
  'いいだ',
  '{"en":"Iida"}'::jsonb,
  35.8965557,
  139.5866043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500681,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_mizuhata',
  '水判土',
  'みずはた',
  '{"en":"Mizuhata"}'::jsonb,
  35.899736,
  139.593336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sashiogiryo_bessho',
  '指扇領別所',
  'さしおうぎりょうべっしょ',
  '{"en":"Sashiogiryo-bessho"}'::jsonb,
  35.9210399,
  139.5680206,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uetayahonmura_shinden',
  '植田谷本村新田',
  'うえたやほんむらしんでん',
  '{"en":"Uetayahonmura-shinden"}'::jsonb,
  35.892473,
  139.561824,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500688,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_sashiogiryo_tsuji',
  '指扇領辻',
  'さしおうぎりょうつじ',
  '{"en":"Sashiogiryo-tsuji"}'::jsonb,
  35.9297337,
  139.5589919,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_minegishi',
  '峰岸',
  'みねぎし',
  '{"en":"Minegishi"}'::jsonb,
  35.930675,
  139.55671,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hirakataryo_ryoke',
  '平方領々家',
  'ひらかたりょうりょうけ',
  '{"en":"Hirakataryo-ryoke"}'::jsonb,
  35.9246652,
  139.5622187,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8804500693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小右衛門',
  '小右衛門',
  '小右衛門',
  NULL,
  36.118336,
  139.717009,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855939,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上内',
  '上内',
  '上内',
  NULL,
  36.0873,
  139.661561,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北青柳',
  '北青柳',
  '北青柳',
  NULL,
  36.05138,
  139.669606,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中妻',
  '中妻',
  '中妻',
  NULL,
  36.090413,
  139.646043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東大輪',
  '東大輪',
  '東大輪',
  NULL,
  36.094333,
  139.686535,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855943,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鷲宮',
  '鷲宮',
  '鷲宮',
  NULL,
  36.102592,
  139.653519,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下早見',
  '下早見',
  '下早見',
  NULL,
  36.056214,
  139.670946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855945,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西大輪',
  '西大輪',
  '西大輪',
  NULL,
  36.088905,
  139.67427,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855946,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_太田袋',
  '太田袋',
  '太田袋',
  NULL,
  36.045366,
  139.68051,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_伊坂',
  '伊坂',
  '伊坂',
  NULL,
  36.1336809,
  139.6932836,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新井_quarter_8840855949',
  '新井',
  '新井',
  NULL,
  36.103921,
  139.697243,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_河原代',
  '河原代',
  '河原代',
  NULL,
  36.10981,
  139.698785,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855950,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中里',
  '中里',
  '中里',
  NULL,
  36.10596,
  139.716548,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_狐塚',
  '狐塚',
  '狐塚',
  NULL,
  36.101763,
  139.709752,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北広島',
  '北広島',
  '北広島',
  NULL,
  36.116986,
  139.703336,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八甫',
  '八甫',
  '八甫',
  NULL,
  36.103093,
  139.676157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上川崎_quarter',
  '上川崎',
  '上川崎',
  NULL,
  36.078712,
  139.689122,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_島川',
  '島川',
  '島川',
  NULL,
  36.110547,
  139.687192,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855958,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_青毛',
  '青毛',
  '青毛',
  NULL,
  36.074759,
  139.695474,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_外野',
  '外野',
  '外野',
  NULL,
  36.083455,
  139.683705,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855966,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栗原',
  '栗原',
  '栗原',
  NULL,
  36.067232,
  139.703999,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840855984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_葛梅',
  '葛梅',
  '葛梅',
  NULL,
  36.094022,
  139.658194,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840856824,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西_quarter_8840856832',
  '西',
  '西',
  NULL,
  36.059818,
  139.685594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840856832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字船渡',
  '大字船渡',
  '大字船渡',
  NULL,
  35.936047,
  139.797954,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字増森',
  '大字増森',
  '大字増森',
  NULL,
  35.895595,
  139.824111,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字向畑',
  '大字向畑',
  '大字向畑',
  NULL,
  35.927024,
  139.80753,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北川崎',
  '大字北川崎',
  '大字北川崎',
  NULL,
  35.929463,
  139.80029,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北後谷',
  '大字北後谷',
  '大字北後谷',
  NULL,
  35.886497,
  139.763073,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大吉',
  '大字大吉',
  '大字大吉',
  NULL,
  35.918668,
  139.801554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大松',
  '大字大松',
  '大字大松',
  NULL,
  35.935488,
  139.808684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中島',
  '大字中島',
  '大字中島',
  NULL,
  35.890648,
  139.831461,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大沢',
  '大沢',
  '大沢',
  NULL,
  35.914809,
  139.78943,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字登戸',
  '大字登戸',
  '大字登戸',
  NULL,
  35.87609,
  139.802684,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字花田',
  '大字花田',
  '大字花田',
  NULL,
  35.903954,
  139.79159,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840920435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小泉',
  '大字小泉',
  '大字小泉',
  NULL,
  35.981805,
  139.559323,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字西門前',
  '大字西門前',
  '大字西門前',
  NULL,
  35.99507,
  139.583307,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字久保',
  '大字久保',
  '大字久保',
  NULL,
  35.993358,
  139.579058,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字領家',
  '大字領家',
  '大字領家',
  NULL,
  35.971776,
  139.544504,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990404,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大谷本郷',
  '大字大谷本郷',
  '大字大谷本郷',
  NULL,
  35.9558,
  139.583933,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990405,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中新井_quarter',
  '大字中新井',
  '大字中新井',
  NULL,
  35.948921,
  139.587001,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990406,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字堤崎',
  '大字堤崎',
  '大字堤崎',
  NULL,
  35.94699,
  139.579574,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8840990408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字向山',
  '大字向山',
  '大字向山',
  NULL,
  35.955655,
  139.577088,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841007638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_錦',
  '錦町',
  '錦町',
  NULL,
  35.988549,
  139.587851,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841007642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原新',
  '原新町',
  '原新町',
  NULL,
  35.98557,
  139.578372,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841007652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上尾宿',
  '大字上尾宿',
  '大字上尾宿',
  NULL,
  35.9860478,
  139.6002694,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841007659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原馬室',
  '原馬室',
  '原馬室',
  NULL,
  36.038701,
  139.508325,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_氷川_quarter',
  '氷川町',
  '氷川町',
  NULL,
  36.0505,
  139.512761,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_滝馬室',
  '滝馬室',
  '滝馬室',
  NULL,
  36.048476,
  139.500937,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_笠原',
  '笠原',
  '笠原',
  NULL,
  36.067455,
  139.55289,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小谷',
  '小谷',
  '小谷',
  NULL,
  36.074042,
  139.469166,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_糠田',
  '糠田',
  '糠田',
  NULL,
  36.063041,
  139.482033,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_郷地',
  '郷地',
  '郷地',
  NULL,
  36.074457,
  139.536537,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大芦',
  '大芦',
  '大芦',
  NULL,
  36.091246,
  139.443945,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_箕田',
  '箕田',
  '箕田',
  NULL,
  36.079867,
  139.478585,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上谷',
  '上谷',
  '上谷',
  NULL,
  36.057652,
  139.533227,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_常光',
  '常光',
  '常光',
  NULL,
  36.046037,
  139.557973,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下谷',
  '下谷',
  '下谷',
  NULL,
  36.048905,
  139.548201,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_境_quarter',
  '境',
  '境',
  NULL,
  36.096524,
  139.543007,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_袋',
  '袋',
  '袋',
  NULL,
  36.098568,
  139.471921,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新井_quarter_8841016597',
  '新井',
  '新井',
  NULL,
  36.095992,
  139.532496,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_寺谷',
  '寺谷',
  '寺谷',
  NULL,
  36.084302,
  139.496616,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_前砂',
  '前砂',
  '前砂',
  NULL,
  36.092934,
  139.463554,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八幡田',
  '八幡田',
  '八幡田',
  NULL,
  36.075742,
  139.498628,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大間',
  '大間',
  '大間',
  NULL,
  36.057264,
  139.499546,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_荊原',
  '荊原',
  '荊原',
  NULL,
  36.098346,
  139.435093,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北新宿',
  '北新宿',
  '北新宿',
  NULL,
  36.109631,
  139.438793,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_明用',
  '明用',
  '明用',
  NULL,
  36.090278,
  139.456037,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川面',
  '川面',
  '川面',
  NULL,
  36.094176,
  139.480256,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮前',
  '宮前',
  '宮前',
  NULL,
  36.070852,
  139.488904,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上会下',
  '上会下',
  '上会下',
  NULL,
  36.098544,
  139.54788,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三町免',
  '三町免',
  '三町免',
  NULL,
  36.084646,
  139.45927,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_登戸',
  '登戸',
  '登戸',
  NULL,
  36.066976,
  139.493367,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北中野',
  '北中野',
  '北中野',
  NULL,
  36.058004,
  139.49085,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西中曽根',
  '西中曽根',
  '西中曽根',
  NULL,
  36.057936,
  139.542019,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三ツ木',
  '三ツ木',
  '三ツ木',
  NULL,
  36.092521,
  139.471537,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_赤城台',
  '赤城台',
  '赤城台',
  NULL,
  36.118796,
  139.50927,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841016613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_榎戸',
  '榎戸',
  '榎戸',
  NULL,
  36.101531,
  139.442504,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_愛の',
  '愛の町',
  '愛の町',
  NULL,
  36.091063,
  139.472129,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中井',
  '中井',
  '中井',
  NULL,
  36.088764,
  139.471879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_吹上',
  '吹上',
  '吹上',
  NULL,
  36.093286,
  139.454708,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_すみれ野',
  'すみれ野',
  'すみれ野',
  NULL,
  36.084088,
  139.476935,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上生出塚',
  '上生出塚',
  '上生出塚',
  NULL,
  36.059084,
  139.528933,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_幸',
  '幸町',
  '幸町',
  NULL,
  36.060484,
  139.497358,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下生出塚',
  '下生出塚',
  '下生出塚',
  NULL,
  36.059595,
  139.527377,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8841020492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字今福',
  '大字今福',
  '大字今福',
  NULL,
  35.880888,
  139.473591,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大塚新',
  '大塚新町',
  '大塚新町',
  NULL,
  35.89534,
  139.463345,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大塚新田',
  '大塚新田',
  '大塚新田',
  NULL,
  35.897999,
  139.464973,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大仙波',
  '大仙波',
  '大仙波',
  NULL,
  35.9100233,
  139.4991943,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大仙波新田',
  '大字大仙波新田',
  '大字大仙波新田',
  NULL,
  35.9012769,
  139.494432,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小室',
  '小室',
  '小室',
  NULL,
  35.91631,
  139.463163,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_豊田本',
  '豊田本',
  '豊田本',
  NULL,
  35.898308,
  139.456998,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山城',
  '山城',
  '山城',
  NULL,
  35.8905511,
  139.4425545,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_増形',
  '増形',
  '増形',
  NULL,
  35.8920253,
  139.430666,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_古谷上',
  '古谷上',
  '古谷上',
  NULL,
  35.9191251,
  139.5238322,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_古谷本郷',
  '古谷本郷',
  '古谷本郷',
  NULL,
  35.9052476,
  139.5393167,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_的場',
  '的場',
  '的場',
  NULL,
  35.9172276,
  139.4397513,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kukedo',
  '久下戸',
  '久下戸',
  '{"en":"Kukedo"}'::jsonb,
  35.8959269,
  139.5392056,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鴨田',
  '鴨田',
  '鴨田',
  NULL,
  35.935397,
  139.517297,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鯨井',
  '鯨井',
  '鯨井',
  NULL,
  35.9341321,
  139.4476769,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下広谷',
  '下広谷',
  '下広谷',
  NULL,
  35.9506337,
  139.4321291,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字藤間',
  '大字藤間',
  '大字藤間',
  NULL,
  35.88006,
  139.496716,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字山田',
  '大字山田',
  '大字山田',
  NULL,
  35.9444421,
  139.4785262,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_池辺',
  '池辺',
  '池辺',
  NULL,
  35.9065385,
  139.4465368,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下松原',
  '大字下松原',
  '大字下松原',
  NULL,
  35.869043,
  139.488442,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中福',
  '大字中福',
  '大字中福',
  NULL,
  35.86165,
  139.46532,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下小坂',
  '下小坂',
  '下小坂',
  NULL,
  35.9499364,
  139.4535609,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字菅間',
  '大字菅間',
  '大字菅間',
  NULL,
  35.951834,
  139.496928,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下赤坂',
  '大字下赤坂',
  '大字下赤坂',
  NULL,
  35.860134,
  139.478455,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小堤',
  '小堤',
  '小堤',
  NULL,
  35.9426493,
  139.4398047,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字府川',
  '大字府川',
  '大字府川',
  NULL,
  35.948391,
  139.484735,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小ケ谷',
  '小ケ谷',
  '小ケ谷',
  NULL,
  35.921487,
  139.457673,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_寺尾',
  '寺尾',
  '寺尾',
  NULL,
  35.8879169,
  139.5077973,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字福田',
  '大字福田',
  '大字福田',
  NULL,
  35.954312,
  139.473247,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611576,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_松郷',
  '松郷',
  '松郷',
  NULL,
  35.92408,
  139.501777,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_砂新田',
  '砂新田',
  '砂新田',
  NULL,
  35.8908494,
  139.4938688,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南田島',
  '南田島',
  '南田島',
  NULL,
  35.9015852,
  139.5060536,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_安比奈新田',
  '安比奈新田',
  '安比奈新田',
  NULL,
  35.9039017,
  139.4225513,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上寺山',
  '上寺山',
  '上寺山',
  NULL,
  35.933132,
  139.466622,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下老袋',
  '大字下老袋',
  '大字下老袋',
  NULL,
  35.930566,
  139.531116,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字伊佐沼',
  '大字伊佐沼',
  '大字伊佐沼',
  NULL,
  35.926899,
  139.512927,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字寺山',
  '大字寺山',
  '大字寺山',
  NULL,
  35.941363,
  139.469764,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大袋',
  '大袋',
  '大袋',
  NULL,
  35.8999906,
  139.4437862,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_渋井',
  '渋井',
  '渋井',
  NULL,
  35.8815691,
  139.5368363,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北田島',
  '北田島',
  '北田島',
  NULL,
  35.9366726,
  139.5020027,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_木野目',
  '木野目',
  '木野目',
  NULL,
  35.8947101,
  139.5158489,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平塚_quarter',
  '平塚',
  '平塚',
  NULL,
  35.9462121,
  139.4624293,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_石田本郷',
  '石田本郷',
  '石田本郷',
  NULL,
  35.944096,
  139.504614,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小中居',
  '小中居',
  '小中居',
  NULL,
  35.9086602,
  139.5279849,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中老袋',
  '大字中老袋',
  '大字中老袋',
  NULL,
  35.94232,
  139.535609,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_古市場',
  '古市場',
  '古市場',
  NULL,
  35.8869918,
  139.5278151,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上老袋',
  '大字上老袋',
  '大字上老袋',
  NULL,
  35.946445,
  139.530417,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上松原',
  '大字上松原',
  '大字上松原',
  NULL,
  35.865571,
  139.476914,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_uwado',
  '上戸',
  '上戸',
  '{"en":"Uwado"}'::jsonb,
  35.9303332,
  139.446358,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大中居',
  '大中居',
  '大中居',
  NULL,
  35.9105658,
  139.5142213,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字石田',
  '大字石田',
  '大字石田',
  NULL,
  35.940979,
  139.487559,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_萱沼',
  '萱沼',
  '萱沼',
  NULL,
  35.890892,
  139.551584,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字東本宿',
  '大字東本宿',
  '大字東本宿',
  NULL,
  35.935372,
  139.53609,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_並木',
  '並木',
  '並木',
  NULL,
  35.90207,
  139.523316,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_御成',
  '御成町',
  '御成町',
  NULL,
  35.935719,
  139.491354,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今泉_quarter_8843611604',
  '今泉',
  '今泉',
  NULL,
  35.8953641,
  139.5263779,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字鹿飼',
  '大字鹿飼',
  '大字鹿飼',
  NULL,
  35.946918,
  139.516144,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小仙波',
  '小仙波',
  '小仙波',
  NULL,
  35.917308,
  139.502212,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷中',
  '谷中',
  '谷中',
  NULL,
  35.9430932,
  139.4942425,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_牛子',
  '牛子',
  '牛子',
  NULL,
  35.8922051,
  139.5099396,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮元',
  '宮元町',
  '宮元町',
  NULL,
  35.932692,
  139.484581,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_砂久保',
  '砂久保',
  '砂久保',
  NULL,
  35.886991,
  139.4832429,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_氷川_quarter_8843611613',
  '氷川町',
  '氷川町',
  NULL,
  35.9300327,
  139.4910458,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上野田',
  '上野田町',
  '上野田町',
  NULL,
  35.913291,
  139.470099,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_神明',
  '神明町',
  '神明町',
  NULL,
  35.930981,
  139.479174,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843611615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_的場新',
  '的場新町',
  '的場新町',
  NULL,
  35.918391,
  139.426977,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_城下',
  '城下町',
  '城下町',
  NULL,
  35.928342,
  139.49403,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八ツ島',
  '八ツ島',
  '八ツ島',
  NULL,
  35.916573,
  139.509887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_脇田本',
  '脇田本町',
  '脇田本町',
  NULL,
  35.907469,
  139.480144,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高島_quarter',
  '高島',
  '高島',
  NULL,
  35.9149344,
  139.5090561,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東田',
  '東田町',
  '東田町',
  NULL,
  35.909461,
  139.477043,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_月吉',
  '月吉町',
  '月吉町',
  NULL,
  35.920487,
  139.473453,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_広栄',
  '広栄町',
  '広栄町',
  NULL,
  35.9018909,
  139.4666151,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_富士見_quarter',
  '富士見町',
  '富士見町',
  NULL,
  35.903453,
  139.488421,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_稲荷',
  '稲荷町',
  '稲荷町',
  NULL,
  35.881332,
  139.503039,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_泉_quarter',
  '泉町',
  '泉町',
  NULL,
  35.904778,
  139.512687,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤原',
  '藤原町',
  '藤原町',
  NULL,
  35.883064,
  139.499508,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_広谷新',
  '広谷新町',
  '広谷新町',
  NULL,
  35.946863,
  139.42891,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_田',
  '田町',
  '田町',
  NULL,
  35.914121,
  139.475836,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_脇田新',
  '脇田新町',
  '脇田新町',
  NULL,
  35.9057673,
  139.4721899,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_諏訪_quarter',
  '諏訪町',
  '諏訪町',
  NULL,
  35.879495,
  139.499986,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_問屋',
  '問屋町',
  '問屋町',
  NULL,
  35.922883,
  139.511314,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中福東',
  '中福東',
  '中福東',
  NULL,
  35.868184,
  139.474143,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_寺井',
  '寺井',
  '寺井',
  NULL,
  35.9346143,
  139.5078036,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平塚新田_quarter',
  '平塚新田',
  '平塚新田',
  NULL,
  35.9525568,
  139.4669897,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_脇田',
  '脇田町',
  '脇田町',
  NULL,
  35.908277,
  139.483291,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_熊野',
  '熊野町',
  '熊野町',
  NULL,
  35.875894,
  139.503234,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上戸新',
  '上戸新町',
  '上戸新町',
  NULL,
  35.925821,
  139.449784,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川越',
  '川越',
  '川越',
  NULL,
  35.93036,
  139.501678,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤木',
  '藤木町',
  '藤木町',
  NULL,
  35.8973518,
  139.5115135,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_清水',
  '清水町',
  '清水町',
  NULL,
  35.877976,
  139.505819,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_四都野台',
  '四都野台',
  '四都野台',
  NULL,
  35.894733,
  139.4661,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三光',
  '三光町',
  '三光町',
  NULL,
  35.918563,
  139.47639,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下新河岸',
  '下新河岸',
  '下新河岸',
  NULL,
  35.880605,
  139.490485,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_菅原',
  '菅原町',
  '菅原町',
  NULL,
  35.906839,
  139.486042,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_並木西',
  '並木西町',
  '並木西町',
  NULL,
  35.900667,
  139.514316,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南通',
  '南通町',
  '南通町',
  NULL,
  35.910642,
  139.485988,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三久保',
  '三久保町',
  '三久保町',
  NULL,
  35.920807,
  139.488197,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_並木新',
  '並木新町',
  '並木新町',
  NULL,
  35.901397,
  139.517608,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_連雀',
  '連雀町',
  '連雀町',
  NULL,
  35.918918,
  139.482637,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_むさし野南',
  'むさし野南',
  'むさし野南',
  NULL,
  35.888072,
  139.466887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682822,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日東',
  '日東町',
  '日東町',
  NULL,
  35.894482,
  139.438014,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_通',
  '通町',
  '通町',
  NULL,
  35.914181,
  139.485164,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_志多',
  '志多町',
  '志多町',
  NULL,
  35.928636,
  139.484022,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_仲_quarter',
  '仲町',
  '仲町',
  NULL,
  35.920911,
  139.481886,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_かわつる三芳野',
  'かわつる三芳野',
  'かわつる三芳野',
  NULL,
  35.921996,
  139.409627,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大手',
  '大手町',
  '大手町',
  NULL,
  35.923124,
  139.485245,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682850,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_喜多_quarter',
  '喜多町',
  '喜多町',
  NULL,
  35.926575,
  139.482477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_幸_quarter',
  '幸町',
  '幸町',
  NULL,
  35.923048,
  139.48262,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_野田_quarter',
  '野田',
  '野田',
  NULL,
  35.918313,
  139.4709,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_扇河岸',
  '扇河岸',
  '扇河岸',
  NULL,
  35.8987049,
  139.4956974,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久保_quarter',
  '久保町',
  '久保町',
  NULL,
  35.9199673,
  139.4888946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682856,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大袋新田',
  '大袋新田',
  '大袋新田',
  NULL,
  35.8933183,
  139.4480421,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682864,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_砂',
  '砂',
  '砂',
  NULL,
  35.8929585,
  139.4995429,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682865,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栄_quarter_8843682866',
  '栄',
  '栄',
  NULL,
  35.95724,
  139.424367,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682866,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字岸',
  '大字岸',
  '大字岸',
  NULL,
  35.891774,
  139.483761,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843682869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_旗井',
  '旗井',
  '旗井',
  NULL,
  36.146838,
  139.691783,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北下新井',
  '北下新井',
  '北下新井',
  NULL,
  36.140186,
  139.668453,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_麦倉',
  '麦倉',
  '麦倉',
  NULL,
  36.185146,
  139.651742,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栄_quarter_8843860608',
  '栄',
  '栄',
  NULL,
  36.175642,
  139.667323,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上種足',
  '上種足',
  '上種足',
  NULL,
  36.08468,
  139.553485,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南大桑',
  '南大桑',
  '南大桑',
  NULL,
  36.114913,
  139.644148,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_志多見',
  '志多見',
  '志多見',
  NULL,
  36.132951,
  139.553598,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下谷_quarter',
  '下谷',
  '下谷',
  NULL,
  36.148388,
  139.590594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北篠崎',
  '北篠崎',
  '北篠崎',
  NULL,
  36.13493,
  139.634998,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_水深',
  '水深',
  '水深',
  NULL,
  36.096184,
  139.63763,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柏戸',
  '柏戸',
  '柏戸',
  NULL,
  36.197152,
  139.678375,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_向古河',
  '向古河',
  '向古河',
  NULL,
  36.188308,
  139.682961,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843860616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_仁手',
  '仁手',
  '仁手',
  NULL,
  36.248813,
  139.214459,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869106,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_牧西',
  '牧西',
  '牧西',
  NULL,
  36.234986,
  139.227329,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869107,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栗崎',
  '栗崎',
  '栗崎',
  NULL,
  36.212266,
  139.18377,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869108,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小和瀬',
  '小和瀬',
  '小和瀬',
  NULL,
  36.245998,
  139.230385,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869109,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久々宇',
  '久々宇',
  '久々宇',
  NULL,
  36.254144,
  139.202623,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869110,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下仁手',
  '下仁手',
  '下仁手',
  NULL,
  36.2499444,
  139.2202434,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869111,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_宮戸',
  '宮戸',
  '宮戸',
  NULL,
  36.240362,
  139.239453,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869112,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_堀田',
  '堀田',
  '堀田',
  NULL,
  36.228788,
  139.233536,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869113,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西五十子',
  '西五十子',
  '西五十子',
  NULL,
  36.223059,
  139.203786,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869114,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_傍示堂',
  '傍示堂',
  '傍示堂',
  NULL,
  36.240344,
  139.21229,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東五十子',
  '東五十子',
  '東五十子',
  NULL,
  36.226387,
  139.213191,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843869116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_神間',
  '神間',
  '神間',
  NULL,
  36.018377,
  139.79774,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下柳',
  '下柳',
  '下柳',
  NULL,
  35.986949,
  139.788979,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小平',
  '小平',
  '小平',
  NULL,
  36.005063,
  139.811291,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東中野',
  '東中野',
  '東中野',
  NULL,
  35.970709,
  139.819623,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_椚',
  '椚',
  '椚',
  NULL,
  36.006081,
  139.800157,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上吉妻',
  '上吉妻',
  '上吉妻',
  NULL,
  36.023796,
  139.807634,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新宿新田',
  '新宿新田',
  '新宿新田',
  NULL,
  35.974117,
  139.824121,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下吉妻',
  '下吉妻',
  '下吉妻',
  NULL,
  36.016588,
  139.80974,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西宝珠花',
  '西宝珠花',
  '西宝珠花',
  NULL,
  36.030407,
  139.813044,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881991,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西親野井',
  '西親野井',
  '西親野井',
  NULL,
  36.038223,
  139.809366,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_木崎',
  '木崎',
  '木崎',
  NULL,
  36.031391,
  139.797268,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_塚崎',
  '塚崎',
  '塚崎',
  NULL,
  36.032266,
  139.804394,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_道順川戸',
  '道順川戸',
  '道順川戸',
  NULL,
  35.969288,
  139.729167,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843881995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_滝瀬',
  '滝瀬',
  '滝瀬',
  NULL,
  36.2312777,
  139.2422197,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843923317,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鵜森',
  '鵜森',
  '鵜森',
  NULL,
  36.232858,
  139.215805,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843923318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上仁手',
  '上仁手',
  '上仁手',
  NULL,
  36.261383,
  139.207072,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843923324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中種足',
  '中種足',
  '中種足',
  NULL,
  36.079405,
  139.570218,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柳生',
  '柳生',
  '柳生',
  NULL,
  36.2032405,
  139.6577473,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上崎',
  '上崎',
  '上崎',
  NULL,
  36.107115,
  139.546407,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_飯積',
  '飯積',
  '飯積',
  NULL,
  36.1898962,
  139.6331366,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸崎_quarter',
  '戸崎',
  '戸崎',
  NULL,
  36.117324,
  139.569868,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上高柳',
  '上高柳',
  '上高柳',
  NULL,
  36.115406,
  139.591839,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本郷_quarter',
  '本郷',
  '本郷',
  NULL,
  36.1652183,
  139.687953,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_牛重',
  '牛重',
  '牛重',
  NULL,
  36.095691,
  139.596983,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新川通',
  '新川通',
  '新川通',
  NULL,
  36.1611017,
  139.6657731,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下崎',
  '下崎',
  '下崎',
  NULL,
  36.101809,
  139.563133,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小野袋',
  '小野袋',
  '小野袋',
  NULL,
  36.2054522,
  139.6638116,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平永',
  '平永',
  '平永',
  NULL,
  36.126098,
  139.560705,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_琴寄',
  '琴寄',
  '琴寄',
  NULL,
  36.130567,
  139.672407,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_阿良川',
  '阿良川',
  '阿良川',
  NULL,
  36.126081,
  139.542559,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_多門寺',
  '多門寺',
  '多門寺',
  NULL,
  36.13472,
  139.623037,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下高柳',
  '下高柳',
  '下高柳',
  NULL,
  36.109754,
  139.604614,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡古井',
  '岡古井',
  '岡古井',
  NULL,
  36.142999,
  139.579884,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸川',
  '戸川',
  '戸川',
  NULL,
  36.158856,
  139.596445,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南篠崎',
  '南篠崎',
  '南篠崎',
  NULL,
  36.115903,
  139.634373,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_町屋新田',
  '町屋新田',
  '町屋新田',
  NULL,
  36.153568,
  139.608845,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_戸室',
  '戸室',
  '戸室',
  NULL,
  36.089032,
  139.571539,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_油井ケ島',
  '油井ケ島',
  '油井ケ島',
  NULL,
  36.093142,
  139.610961,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_道地',
  '道地',
  '道地',
  NULL,
  36.117648,
  139.55485,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_外田ケ谷',
  '外田ケ谷',
  '外田ケ谷',
  NULL,
  36.115246,
  139.537946,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_騎西',
  '騎西',
  '騎西',
  NULL,
  36.103916,
  139.572188,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大室',
  '大室',
  '大室',
  NULL,
  36.096764,
  139.620188,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_内田ケ谷',
  '内田ケ谷',
  '内田ケ谷',
  NULL,
  36.113646,
  139.55211,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_伊賀袋',
  '伊賀袋',
  '伊賀袋',
  NULL,
  36.177857,
  139.685994,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北辻',
  '北辻',
  '北辻',
  NULL,
  36.092419,
  139.630042,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中ノ目',
  '中ノ目',
  '中ノ目',
  NULL,
  36.094245,
  139.55887,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_正能',
  '正能',
  '正能',
  NULL,
  36.111244,
  139.574229,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_割目',
  '割目',
  '割目',
  NULL,
  36.084152,
  139.619153,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中渡',
  '中渡',
  '中渡',
  NULL,
  36.1548889,
  139.6867794,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_今鉾',
  '今鉾',
  '今鉾',
  NULL,
  36.086635,
  139.627922,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_花崎',
  '花崎',
  '花崎',
  NULL,
  36.108353,
  139.624598,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_常泉',
  '常泉',
  '常泉',
  NULL,
  36.102493,
  139.602452,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_船越',
  '船越',
  '船越',
  NULL,
  36.103059,
  139.622834,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_外記新田',
  '外記新田',
  '外記新田',
  NULL,
  36.156023,
  139.672757,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下種足',
  '下種足',
  '下種足',
  NULL,
  36.076504,
  139.579256,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_根古屋',
  '根古屋',
  '根古屋',
  NULL,
  36.103594,
  139.587092,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南小浜',
  '南小浜',
  '南小浜',
  NULL,
  36.101546,
  139.612324,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西ノ谷',
  '西ノ谷',
  '西ノ谷',
  NULL,
  36.09612,
  139.575198,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_駒場',
  '駒場',
  '駒場',
  NULL,
  36.1810552,
  139.6774818,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_外川',
  '外川',
  '外川',
  NULL,
  36.105829,
  139.580346,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久下',
  '久下',
  '久下',
  NULL,
  36.117144,
  139.608393,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鳩山',
  '鳩山町',
  '鳩山町',
  NULL,
  36.107501,
  139.655958,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843931490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上名栗',
  '大字上名栗',
  '大字上名栗',
  NULL,
  35.910127,
  139.146502,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下名栗',
  '大字下名栗',
  '大字下名栗',
  NULL,
  35.868258,
  139.149707,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933863,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字南川',
  '大字南川',
  '大字南川',
  NULL,
  35.928581,
  139.17905,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933864,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字北川',
  '大字北川',
  '大字北川',
  NULL,
  35.949813,
  139.197997,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933865,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字南',
  '大字南',
  '大字南',
  NULL,
  35.892264,
  139.200915,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933866,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字長沢',
  '大字長沢',
  '大字長沢',
  NULL,
  35.926549,
  139.232869,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933867,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字原市場',
  '大字原市場',
  '大字原市場',
  NULL,
  35.866643,
  139.226072,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933868,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字井上',
  '大字井上',
  '大字井上',
  NULL,
  35.902496,
  139.246876,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字赤沢',
  '大字赤沢',
  '大字赤沢',
  NULL,
  35.858488,
  139.211837,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933870,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上直竹下分',
  '大字上直竹下分',
  '大字上直竹下分',
  NULL,
  35.848407,
  139.246346,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933871,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中藤上郷',
  '大字中藤上郷',
  '大字中藤上郷',
  NULL,
  35.887592,
  139.220513,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933872,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字坂石',
  '大字坂石',
  '大字坂石',
  NULL,
  35.911866,
  139.212694,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字虎秀',
  '大字虎秀',
  '大字虎秀',
  NULL,
  35.906194,
  139.262487,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933874,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字坂元',
  '大字坂元',
  '大字坂元',
  NULL,
  35.949902,
  139.175875,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933875,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字吾野',
  '大字吾野',
  '大字吾野',
  NULL,
  35.919689,
  139.202652,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字白子',
  '大字白子',
  '大字白子',
  NULL,
  35.888237,
  139.274904,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高山',
  '高山',
  '高山',
  NULL,
  35.940931,
  139.2180868,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933878,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_oaza_azu',
  '大字阿須',
  'おおあざあず',
  '{"en":"Oaza Azu"}'::jsonb,
  35.828873,
  139.333024,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933879,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字飯能',
  '大字飯能',
  '大字飯能',
  NULL,
  35.864509,
  139.305402,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933880,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小岩井',
  '大字小岩井',
  '大字小岩井',
  NULL,
  35.862367,
  139.27256,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933881,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中藤下郷',
  '大字中藤下郷',
  '大字中藤下郷',
  NULL,
  35.879952,
  139.247921,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933882,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下直竹',
  '大字下直竹',
  '大字下直竹',
  NULL,
  35.844988,
  139.267809,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933883,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字宮沢',
  '大字宮沢',
  '大字宮沢',
  NULL,
  35.875145,
  139.32656,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933884,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字岩渕',
  '大字岩渕',
  '大字岩渕',
  NULL,
  35.83265,
  139.308978,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933885,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字苅生',
  '大字苅生',
  '大字苅生',
  NULL,
  35.851166,
  139.274643,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上直竹上分',
  '大字上直竹上分',
  '大字上直竹上分',
  NULL,
  35.844148,
  139.2276,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中藤中郷',
  '大字中藤中郷',
  '大字中藤中郷',
  NULL,
  35.884174,
  139.234814,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字坂石町分',
  '大字坂石町分',
  '大字坂石町分',
  NULL,
  35.904751,
  139.230759,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933889,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字芦苅場',
  '大字芦苅場',
  '大字芦苅場',
  NULL,
  35.865324,
  139.362798,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字平戸',
  '大字平戸',
  '大字平戸',
  NULL,
  35.890226,
  139.26028,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字小瀬戸',
  '大字小瀬戸',
  '大字小瀬戸',
  NULL,
  35.874386,
  139.264583,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933892,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下赤工',
  '大字下赤工',
  '大字下赤工',
  NULL,
  35.863845,
  139.251876,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字唐竹',
  '大字唐竹',
  '大字唐竹',
  NULL,
  35.854767,
  139.22584,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下畑',
  '大字下畑',
  '大字下畑',
  NULL,
  35.841745,
  139.294576,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_平松',
  '平松',
  '平松',
  NULL,
  35.8695541,
  139.351349,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小久保',
  '小久保',
  '小久保',
  NULL,
  35.870623,
  139.338148,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字大河原',
  '大字大河原',
  '大字大河原',
  NULL,
  35.854021,
  139.301082,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上長沢',
  '大字上長沢',
  '大字上長沢',
  NULL,
  35.927436,
  139.214454,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933899,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中山',
  '大字中山',
  '大字中山',
  NULL,
  35.865751,
  139.31995,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字落合',
  '大字落合',
  '大字落合',
  NULL,
  35.831647,
  139.319692,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字川寺',
  '大字川寺',
  '大字川寺',
  NULL,
  35.844034,
  139.324232,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下川崎',
  '大字下川崎',
  '大字下川崎',
  NULL,
  35.877375,
  139.363441,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上畑',
  '大字上畑',
  '大字上畑',
  NULL,
  35.843471,
  139.284477,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川崎_quarter',
  '川崎',
  '川崎',
  NULL,
  35.8760709,
  139.3556187,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字永田',
  '大字永田',
  '大字永田',
  NULL,
  35.864499,
  139.291243,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字笠縫',
  '大字笠縫',
  '大字笠縫',
  NULL,
  35.842551,
  139.331352,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字久須美',
  '大字久須美',
  '大字久須美',
  NULL,
  35.870188,
  139.276143,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字下加治',
  '大字下加治',
  '大字下加治',
  NULL,
  35.8641751,
  139.337394,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933911,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字上赤工',
  '大字上赤工',
  '大字上赤工',
  NULL,
  35.869133,
  139.238689,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933912,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字中居',
  '大字中居',
  '大字中居',
  NULL,
  35.864655,
  139.329093,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字矢颪',
  '大字矢颪',
  '大字矢颪',
  NULL,
  35.84614,
  139.315013,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933915,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字青木',
  '大字青木',
  '大字青木',
  NULL,
  35.861692,
  139.331249,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843933916,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_征矢',
  '征矢町',
  '征矢町',
  NULL,
  35.840772,
  139.320144,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843937220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字前ヶ貫',
  '大字前ヶ貫',
  '大字前ヶ貫',
  NULL,
  35.839047,
  139.314337,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843937223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字原',
  '大字原町',
  '大字原町',
  NULL,
  35.859901,
  139.319257,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843937237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字久下',
  '大字久下',
  '大字久下',
  NULL,
  35.854403,
  139.312461,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8843937240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字三ツ和',
  '大字三ツ和',
  '大字三ツ和',
  NULL,
  35.824012,
  139.737699,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字木曽呂',
  '大字木曽呂',
  '大字木曽呂',
  NULL,
  35.85907,
  139.721183,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字西新井宿',
  '大字西新井宿',
  '大字西新井宿',
  NULL,
  35.846833,
  139.732173,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字道合',
  '大字道合',
  '大字道合',
  NULL,
  35.850842,
  139.717674,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字神戸',
  '大字神戸',
  '大字神戸',
  NULL,
  35.852169,
  139.726578,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東内野',
  '東内野',
  '東内野',
  NULL,
  35.867899,
  139.721422,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字行衛',
  '大字行衛',
  '大字行衛',
  NULL,
  35.876518,
  139.71782,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字蓮沼',
  '大字蓮沼',
  '大字蓮沼',
  NULL,
  35.824133,
  139.761786,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大字長蔵新田',
  '大字長蔵新田',
  '大字長蔵新田',
  NULL,
  35.8595309,
  139.751885,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844312775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_熊谷',
  '熊谷',
  '熊谷',
  NULL,
  36.1358603,
  139.3825965,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_三ケ尻',
  '三ケ尻',
  '三ケ尻',
  NULL,
  36.158467,
  139.323092,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_佐谷田',
  '佐谷田',
  '佐谷田',
  NULL,
  36.129568,
  139.413328,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_妻沼小島',
  '妻沼小島',
  '妻沼小島',
  NULL,
  36.2508738,
  139.3570071,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_久下_quarter',
  '久下',
  '久下',
  NULL,
  36.121351,
  139.414944,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下奈良',
  '下奈良',
  '下奈良',
  NULL,
  36.189536,
  139.38784,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_葛和田',
  '葛和田',
  '葛和田',
  NULL,
  36.20336,
  139.417501,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_押切_quarter',
  '押切',
  '押切',
  NULL,
  36.134723,
  139.333096,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大麻生',
  '大麻生',
  '大麻生',
  NULL,
  36.146581,
  139.334881,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_善ケ島',
  '善ケ島',
  '善ケ島',
  NULL,
  36.217229,
  139.400959,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_永井太田',
  '永井太田',
  '永井太田',
  NULL,
  36.22355,
  139.340861,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_飯塚',
  '飯塚',
  '飯塚',
  NULL,
  36.215954,
  139.348092,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小八林',
  '小八林',
  '小八林',
  NULL,
  36.078434,
  139.434085,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_楊井',
  '楊井',
  '楊井',
  NULL,
  36.104255,
  139.379649,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日向',
  '日向',
  '日向',
  NULL,
  36.19382,
  139.415571,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上奈良',
  '上奈良',
  '上奈良',
  NULL,
  36.186846,
  139.358235,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西城',
  '西城',
  '西城',
  NULL,
  36.199647,
  139.389519,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小泉',
  '小泉',
  '小泉',
  NULL,
  36.117484,
  139.399238,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_間々田',
  '間々田',
  '間々田',
  NULL,
  36.23525,
  139.339498,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上須戸',
  '上須戸',
  '上須戸',
  NULL,
  36.203641,
  139.399583,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_津田',
  '津田',
  '津田',
  NULL,
  36.1005705,
  139.4176521,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_俵瀬',
  '俵瀬',
  '俵瀬',
  NULL,
  36.199365,
  139.430425,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339757,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_妻沼台',
  '妻沼台',
  '妻沼台',
  NULL,
  36.234701,
  139.36575,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_手島',
  '手島',
  '手島',
  NULL,
  36.1236174,
  139.3873992,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柿沼',
  '柿沼',
  '柿沼',
  NULL,
  36.168696,
  139.380482,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下増田',
  '下増田',
  '下増田',
  NULL,
  36.206175,
  139.34005,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_小島_quarter',
  '小島',
  '小島',
  NULL,
  36.155857,
  139.346403,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_玉作',
  '玉作',
  '玉作',
  NULL,
  36.089098,
  139.425864,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_御稜威ケ原',
  '御稜威ケ原',
  '御稜威ケ原',
  NULL,
  36.159801,
  139.298662,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八木田',
  '八木田',
  '八木田',
  NULL,
  36.216755,
  139.362592,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_広瀬',
  '広瀬',
  '広瀬',
  NULL,
  36.148549,
  139.352758,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_太井',
  '太井',
  '太井',
  NULL,
  36.125354,
  139.42784,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上江袋',
  '上江袋',
  '上江袋',
  NULL,
  36.204965,
  139.361384,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大野',
  '大野',
  '大野',
  NULL,
  36.215424,
  139.410131,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_男沼',
  '男沼',
  '男沼',
  NULL,
  36.23225,
  139.359251,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_箕輪',
  '箕輪',
  '箕輪',
  NULL,
  36.084197,
  139.419102,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_津田新田',
  '津田新田',
  '津田新田',
  NULL,
  36.108944,
  139.410923,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339772,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_出来島',
  '出来島',
  '出来島',
  NULL,
  36.239986,
  139.352679,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_新川_quarter',
  '新川',
  '新川',
  NULL,
  36.109762,
  139.424345,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中曽根',
  '中曽根',
  '中曽根',
  NULL,
  36.104881,
  139.404236,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_屈戸',
  '屈戸',
  '屈戸',
  NULL,
  36.10567,
  139.423951,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339776,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川原明戸',
  '川原明戸',
  '川原明戸',
  NULL,
  36.142228,
  139.315395,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上新田',
  '上新田',
  '上新田',
  NULL,
  36.131063,
  139.316995,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_八ツ口',
  '八ツ口',
  '八ツ口',
  NULL,
  36.21518,
  139.391418,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下恩田',
  '下恩田',
  '下恩田',
  NULL,
  36.107918,
  139.387859,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西野',
  '西野',
  '西野',
  NULL,
  36.204636,
  139.372776,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339781,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_中恩田',
  '中恩田',
  '中恩田',
  NULL,
  36.108235,
  139.393527,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339782,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_四方寺',
  '四方寺',
  '四方寺',
  NULL,
  36.189009,
  139.396231,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_江波',
  '江波',
  '江波',
  NULL,
  36.209716,
  139.391914,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_道ケ谷戸',
  '道ケ谷戸',
  '道ケ谷戸',
  NULL,
  36.210918,
  139.35581,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_冑山',
  '冑山',
  '冑山',
  NULL,
  36.0789895,
  139.4099926,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上恩田',
  '上恩田',
  '上恩田',
  NULL,
  36.117143,
  139.382076,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_市ノ坪',
  '市ノ坪',
  '市ノ坪',
  NULL,
  36.213681,
  139.34023,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_相上',
  '相上',
  '相上',
  NULL,
  36.090405,
  139.415292,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_奈良新田',
  '奈良新田',
  '奈良新田',
  NULL,
  36.196158,
  139.365518,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高本',
  '高本',
  '高本',
  NULL,
  36.0980215,
  139.406256,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_沼黒',
  '沼黒',
  '沼黒',
  NULL,
  36.1008051,
  139.4029902,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_弁財',
  '弁財',
  '弁財',
  NULL,
  36.207624,
  139.406322,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_原井',
  '原井',
  '原井',
  NULL,
  36.204349,
  139.350781,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_向谷',
  '向谷',
  '向谷',
  NULL,
  36.1006234,
  139.4116079,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_武体',
  '武体',
  '武体',
  NULL,
  36.148728,
  139.325853,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_吉所敷',
  '吉所敷',
  '吉所敷',
  NULL,
  36.104072,
  139.39743,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_瀬南',
  '瀬南',
  '瀬南',
  NULL,
  36.145966,
  139.354092,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8844339816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岩殿',
  '岩殿',
  '岩殿',
  NULL,
  36.001268,
  139.371069,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8956297508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西本宿',
  '西本宿',
  '西本宿',
  NULL,
  36.0093113,
  139.3904206,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8956297509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_下押垂',
  '下押垂',
  '下押垂',
  NULL,
  36.009095,
  139.423433,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  8956297511,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_hikoe_quarter',
  '彦江',
  'ひこえ',
  '{"en":"Hikoe"}'::jsonb,
  35.8288236,
  139.8558799,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  9517362225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_芝峯',
  '芝峯町',
  '芝峯町',
  NULL,
  35.8422168,
  139.6912533,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  9937280949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上谷沼',
  '上谷沼',
  '上谷沼',
  NULL,
  35.8459086,
  139.6857119,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  9948840685,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鶴ケ丸',
  '鶴ケ丸',
  '鶴ケ丸',
  NULL,
  35.8470653,
  139.6886516,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  9964837938,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukiduka',
  '吹塚',
  'ふきづか',
  '{"en":"Fukiduka"}'::jsonb,
  35.9908505,
  139.4421672,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10024157575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kago',
  '加胡',
  'かご',
  '{"en":"Kago"}'::jsonb,
  36.0160512,
  139.4732594,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10088030284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kamiyatsu',
  '上谷',
  '上谷',
  '{"en":"Kamiyatsu"}'::jsonb,
  35.9798989,
  139.2667937,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10127985443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_鎌形',
  '鎌形',
  '鎌形',
  NULL,
  36.0233318,
  139.3105888,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10754556491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_akanecho',
  '茜町',
  'あかねちょう',
  '{"en":"Akanecho"}'::jsonb,
  35.8055031,
  139.8417103,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10809035858,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_大谷_quarter_10906046307',
  '大谷',
  '大谷',
  NULL,
  36.0937941,
  139.3956041,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10906046307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_岡_quarter_10906047240',
  '岡',
  '岡',
  NULL,
  36.0844739,
  139.4070732,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  10906047240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yaenda',
  '猿田',
  '猿田',
  '{"en":"Yaenda"}'::jsonb,
  35.8917141,
  139.3319553,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11096788349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_仲_quarter_11119111491',
  '仲町',
  '仲町',
  NULL,
  35.9734881,
  139.5940778,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11119111491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_愛宕',
  '愛宕',
  '愛宕',
  NULL,
  35.9692829,
  139.5965714,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11119111492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_umehara',
  '梅原',
  'うめはら',
  '{"en":"Umehara"}'::jsonb,
  35.8843215,
  139.3166184,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11154619400,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_清流',
  '清流',
  '清流',
  NULL,
  35.894213,
  139.3091297,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11162535358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_谷津',
  '谷津',
  '谷津',
  NULL,
  35.9705847,
  139.5886929,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11244887428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西宮下',
  '西宮下',
  '西宮下',
  NULL,
  35.9652092,
  139.5900141,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11244887429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_高坂_quarter',
  '高坂',
  '高坂',
  NULL,
  36.0069132,
  139.3954344,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11276242794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_柏座',
  '柏座',
  '柏座',
  NULL,
  35.9756,
  139.5832353,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278591438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_富士見_quarter_11357316442',
  '富士見',
  '富士見',
  NULL,
  35.9675149,
  139.5845374,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11357316442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_レイクタウン',
  'レイクタウン',
  'レイクタウン',
  NULL,
  35.8797701,
  139.8206356,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11434959566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上_quarter_11438564552',
  '上町',
  '上町',
  NULL,
  35.9780566,
  139.5887519,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11438564552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_日の出',
  '日の出',
  '日の出',
  NULL,
  35.9659447,
  139.6041618,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11481473386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_東_quarter_11482362115',
  '東町',
  '東町',
  NULL,
  35.9726652,
  139.6037291,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11482362115,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_別所',
  '別所',
  '別所',
  NULL,
  35.9032418,
  139.3658879,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11530009390,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_弁財_quarter',
  '弁財',
  '弁財',
  NULL,
  35.9716071,
  139.5750285,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11715237424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_向山',
  '向山',
  '向山',
  NULL,
  35.9631676,
  139.5822604,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11715237425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_川',
  '川',
  '川',
  NULL,
  35.9655094,
  139.5799457,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11715237426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_本_quarter',
  '本町',
  '本町',
  NULL,
  35.9819314,
  139.5922112,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11834730613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_togasaki_quarter',
  '戸ヶ崎',
  '戸ヶ崎',
  '{"en":"Togasaki"}'::jsonb,
  35.795639,
  139.8644261,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12022133866,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_藤間',
  '藤間',
  '藤間',
  NULL,
  35.8863294,
  139.4975281,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12070723002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_fukuoka',
  '福岡',
  'ふくおか',
  '{"en":"Fukuoka"}'::jsonb,
  35.876976,
  139.5449388,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12173828852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_駒林',
  '駒林',
  '駒林',
  NULL,
  35.8695515,
  139.5407116,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12193492001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_栄_quarter_12254073297',
  '栄',
  '栄',
  NULL,
  35.9602143,
  139.4115472,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12254073297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_西平',
  '西平',
  '西平',
  NULL,
  35.9955336,
  139.2438551,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  12955929765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北永井',
  '北永井',
  '北永井',
  NULL,
  35.8371679,
  139.5194471,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  13012074973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_上富',
  '上富',
  '上富',
  NULL,
  35.8353327,
  139.502635,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  13036297722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南入曽',
  '南入曽',
  '南入曽',
  NULL,
  35.824129,
  139.4330263,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  13256868065,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_南入曽_quarter',
  '南入曽',
  '南入曽',
  NULL,
  35.8338801,
  139.4220936,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  13300565269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_北入曽',
  '北入曽',
  '北入曽',
  NULL,
  35.8291569,
  139.442414,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  13343599743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_nakasori_trailhead',
  '中双里登山口',
  '中双里登山口',
  '{"en":"Nakasori Trailhead"}'::jsonb,
  35.9863881,
  138.8353765,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  1516621734,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_横瀬町寺坂棚田',
  '横瀬町寺坂棚田',
  '横瀬町寺坂棚田',
  NULL,
  35.9899563,
  139.108055,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  2385059767,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_kinchakuda',
  '巾着田',
  'きんちゃくだ',
  '{"en":"Kinchakuda"}'::jsonb,
  35.8831866,
  139.3110516,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  3914881285,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_塩地平',
  '塩地平',
  '塩地平',
  NULL,
  35.9051909,
  139.0159683,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  5197421298,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_山の神土',
  '山の神土',
  '山の神土',
  NULL,
  35.8613547,
  138.857325,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  9315108430,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_omata',
  '大又',
  '大又',
  '{"en":"Omata"}'::jsonb,
  36.0124351,
  138.8502105,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278974416,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_オオドリ河原',
  'オオドリ河原',
  'オオドリ河原',
  NULL,
  36.0147674,
  138.8464373,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278974422,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_水晶坂',
  '水晶坂',
  '水晶坂',
  NULL,
  36.0149949,
  138.8451387,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278974424,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_bunadaira',
  'ブナ平',
  'ブナ平',
  '{"en":"Bunadaira"}'::jsonb,
  36.0167899,
  138.8431381,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278974425,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'saitama_unknown_yumemidaira',
  '夢見平',
  '夢見平',
  '{"en":"Yumemidaira"}'::jsonb,
  36.017399,
  138.8426533,
  NULL,
  'saitama',
  NULL,
  'jp',
  '埼玉県',
  NULL,
  NULL,
  NULL,
  11278974426,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 40件, machi 1948件を挿入