-- =============================================
-- 福岡県の街データ（OSMから取得）
-- 生成日時: 2025-12-11T02:45:17.146Z
-- データ取得日時: 2025-12-11T00:56:28.943Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（福岡県のみ）
-- =============================================

-- machiテーブルから福岡県のデータを削除
DELETE FROM machi WHERE prefecture_id = 'fukuoka';

-- citiesテーブルから福岡県のデータを削除
DELETE FROM cities WHERE prefecture_id = 'fukuoka';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_kasuga',
  'fukuoka',
  '春日市',
  'かすがし',
  '{"en":"Kasuga"}'::jsonb,
  '市',
  'jp',
  33.5326401,
  130.4699924
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_fukutsu',
  'fukuoka',
  '福津市',
  'ふくつし',
  '{"en":"Fukutsu"}'::jsonb,
  '市',
  'jp',
  33.7668264,
  130.4913329
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_nogata',
  'fukuoka',
  '直方市',
  'のおがたし',
  '{"en":"Nogata"}'::jsonb,
  '市',
  'jp',
  33.743936,
  130.7297462
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_kama',
  'fukuoka',
  '嘉麻市',
  'かまし',
  '{"en":"Kama"}'::jsonb,
  '市',
  'jp',
  33.5632103,
  130.7118029
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_iizuka',
  'fukuoka',
  '飯塚市',
  'いいづかし',
  '{"en":"Iizuka"}'::jsonb,
  '市',
  'jp',
  33.646594,
  130.6911579
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_asakura',
  'fukuoka',
  '朝倉市',
  'あさくらし',
  '{"en":"Asakura"}'::jsonb,
  '市',
  'jp',
  33.4234248,
  130.6657037
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_ogori',
  'fukuoka',
  '小郡市',
  'おごおりし',
  '{"en":"Ogori"}'::jsonb,
  '市',
  'jp',
  33.3963946,
  130.5554371
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_yukuhashi',
  'fukuoka',
  '行橋市',
  'ゆくはしし',
  '{"en":"Yukuhashi"}'::jsonb,
  '市',
  'jp',
  33.7292049,
  130.9831626
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_buzen',
  'fukuoka',
  '豊前市',
  'ぶぜんし',
  '{"en":"Buzen"}'::jsonb,
  '市',
  'jp',
  33.6114994,
  131.1304409
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_tagawa',
  'fukuoka',
  '田川市',
  'たがわし',
  '{"en":"Tagawa"}'::jsonb,
  '市',
  'jp',
  33.6387807,
  130.8063352
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_ukiha',
  'fukuoka',
  'うきは市',
  'うきはし',
  '{"en":"Ukiha"}'::jsonb,
  '市',
  'jp',
  33.3473997,
  130.7552293
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_miyama',
  'fukuoka',
  'みやま市',
  'みやまし',
  '{"en":"Miyama"}'::jsonb,
  '市',
  'jp',
  33.1523675,
  130.4746267
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_omuta',
  'fukuoka',
  '大牟田市',
  'おおむたし',
  '{"en":"Omuta"}'::jsonb,
  '市',
  'jp',
  33.047013,
  130.464155
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_okawa',
  'fukuoka',
  '大川市',
  'おおかわし',
  '{"en":"Okawa"}'::jsonb,
  '市',
  'jp',
  33.2061857,
  130.3835746
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_yanagawa',
  'fukuoka',
  '柳川市',
  'やながわし',
  '{"en":"Yanagawa"}'::jsonb,
  '市',
  'jp',
  33.1630969,
  130.4058091
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_nakama',
  'fukuoka',
  '中間市',
  'なかまし',
  '{"en":"Nakama"}'::jsonb,
  '市',
  'jp',
  33.8164202,
  130.7090761
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_miyawaka',
  'fukuoka',
  '宮若市',
  'みやわかし',
  '{"en":"Miyawaka"}'::jsonb,
  '市',
  'jp',
  33.7235894,
  130.6667511
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_munakata',
  'fukuoka',
  '宗像市',
  'むなかたし',
  '{"en":"Munakata"}'::jsonb,
  '市',
  'jp',
  33.8055642,
  130.5406875
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_koga',
  'fukuoka',
  '古賀市',
  'こがし',
  '{"en":"Koga"}'::jsonb,
  '市',
  'jp',
  33.728578,
  130.4701731
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_dazaifu',
  'fukuoka',
  '太宰府市',
  'だざいふし',
  '{"en":"Dazaifu"}'::jsonb,
  '市',
  'jp',
  33.5129189,
  130.5242217
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_onojo',
  'fukuoka',
  '大野城市',
  'おおのじょうし',
  '{"en":"Onojo"}'::jsonb,
  '市',
  'jp',
  33.536239,
  130.478658
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_chikushino',
  'fukuoka',
  '筑紫野市',
  'ちくしのし',
  '{"en":"Chikushino"}'::jsonb,
  '市',
  'jp',
  33.4874888,
  130.5258812
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_fukuoka',
  'fukuoka',
  '福岡市',
  'ふくおかし',
  '{"en":"Fukuoka"}'::jsonb,
  '市',
  'jp',
  33.5898988,
  130.4017509
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_itoshima',
  'fukuoka',
  '糸島市',
  'いとしまし',
  '{"en":"Itoshima"}'::jsonb,
  '市',
  'jp',
  33.5571816,
  130.196231
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_kurume',
  'fukuoka',
  '久留米市',
  'くるめし',
  '{"en":"Kurume"}'::jsonb,
  '市',
  'jp',
  33.3196545,
  130.5080625
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_yame',
  'fukuoka',
  '八女市',
  'やめし',
  '{"en":"Yame"}'::jsonb,
  '市',
  'jp',
  33.2116721,
  130.5579706
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_kitakyushu',
  'fukuoka',
  '北九州市',
  'きたきゅうしゅうし',
  '{"en":"Kitakyushu"}'::jsonb,
  '市',
  'jp',
  33.8829996,
  130.8749015
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_nakagawa',
  'fukuoka',
  '那珂川市',
  'なかがわし',
  '{"en":"Nakagawa"}'::jsonb,
  '市',
  'jp',
  33.4994449,
  130.4216086
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'fukuoka_chikugo',
  'fukuoka',
  '筑後市',
  'ちくごし',
  '{"en":"Chikugo"}'::jsonb,
  '市',
  'jp',
  33.2123783,
  130.5017727
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_fukutsu_wakagidai',
  '若木台',
  '若木台',
  '{"en":"Wakagidai"}'::jsonb,
  33.7745281,
  130.5170854,
  NULL,
  'fukuoka',
  'fukuoka_fukutsu',
  'jp',
  '福岡県',
  NULL,
  '福津市',
  NULL,
  346580360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akebono',
  'あけぼの',
  'あけぼの',
  '{"en":"Akebono"}'::jsonb,
  33.771325,
  130.5115125,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  346582907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakuragawa',
  '桜川',
  '桜川',
  '{"en":"Sakuragawa"}'::jsonb,
  33.7708217,
  130.5074781,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  346583076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_fukutsu_higashi_fukuma',
  '東福間',
  '東福間',
  '{"en":"Higashi-Fukuma"}'::jsonb,
  33.777018,
  130.508365,
  NULL,
  'fukuoka',
  'fukuoka_fukutsu',
  'jp',
  '福岡県',
  NULL,
  '福津市',
  NULL,
  346590026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hinosato',
  '日の里',
  '日の里',
  '{"en":"Hinosato"}'::jsonb,
  33.7892348,
  130.535576,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  390310990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsuyazaki',
  '津屋崎',
  '津屋崎',
  '{"en":"Tsuyazaki"}'::jsonb,
  33.7875223,
  130.4673578,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  539457053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sohara',
  '祖原',
  'そはら',
  '{"en":"Sohara"}'::jsonb,
  33.5792207,
  130.3572141,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  1783264164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashiidanchi',
  '香椎団地',
  'かしいだんち',
  '{"en":"Kashiidanchi"}'::jsonb,
  33.6538777,
  130.437076,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  1784473843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nozomigaoka',
  '希みが丘',
  'のぞみがおか',
  '{"en":"Nozomigaoka"}'::jsonb,
  33.4369848,
  130.5411775,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  1845420353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_onoshima',
  '大野島',
  'おおのしま',
  '{"en":"Onoshima"}'::jsonb,
  33.1982609,
  130.3501853,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  1957891341,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字原田',
  '大字原田',
  '大字原田',
  NULL,
  33.4429189,
  130.5334118,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  1971249144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字甘木',
  '大字甘木',
  '大字甘木',
  NULL,
  33.42049,
  130.6543399,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2002424248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miimachi',
  '御井町',
  'みいまち',
  '{"en":"Miimachi"}'::jsonb,
  33.301189,
  130.5517877,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2002427293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_namazuta',
  '鯰田',
  'なまずた',
  '{"en":"Namazuta"}'::jsonb,
  33.6705394,
  130.7091296,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2160984528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oritatemachi',
  '折立町',
  'おりたてまち',
  '{"en":"Oritatemachi"}'::jsonb,
  33.5530966,
  130.4375123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2192482289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimonofu',
  '下府',
  '下府',
  '{"en":"Shimonofu"}'::jsonb,
  33.7106299,
  130.4393706,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2312982548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiohama',
  '塩浜',
  'しおはま',
  '{"en":"Shiohama"}'::jsonb,
  33.6916895,
  130.4245991,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2313022416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hakataeki_chuogai',
  '博多駅中央街',
  'はかたえきちゅうおうがい',
  '{"en":"Hakataeki-Chuogai"}'::jsonb,
  33.5896962,
  130.4213185,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2319138572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakurayamate',
  '桜山手',
  '桜山手',
  '{"en":"Sakurayamate"}'::jsonb,
  33.7050241,
  130.4387935,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2321387995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wajirogaoka',
  '和白丘',
  'わじろがおか',
  '{"en":"Wajirogaoka"}'::jsonb,
  33.6984391,
  130.4364629,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882917,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wajirohigashi',
  '和白東',
  'わじろひがし',
  '{"en":"Wajirohigashi"}'::jsonb,
  33.6944771,
  130.4420979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yuusu',
  '夜臼',
  '夜臼',
  '{"en":"Yuusu"}'::jsonb,
  33.7009791,
  130.4470042,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882945,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shingu',
  '新宮',
  'しんぐう',
  '{"en":"Shingu"}'::jsonb,
  33.7139551,
  130.4320308,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miwadai',
  '美和台',
  '美和台',
  '{"en":"Miwadai"}'::jsonb,
  33.7032547,
  130.4291206,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takamidai',
  '高美台',
  '高美台',
  '{"en":"Takamidai"}'::jsonb,
  33.6893588,
  130.4458929,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345882977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mitoma',
  '三苫',
  '三苫',
  '{"en":"Mitoma"}'::jsonb,
  33.7031316,
  130.421961,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345916309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kaminofu',
  '上府',
  'かみのふ',
  '{"en":"Kaminofu"}'::jsonb,
  33.7108684,
  130.4593613,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345916313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wajiro',
  '和白',
  'わじろ',
  '{"en":"Wajiro"}'::jsonb,
  33.6879471,
  130.4316397,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345916316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nata',
  '奈多',
  'なた',
  '{"en":"Nata"}'::jsonb,
  33.6876883,
  130.4155427,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345916320,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_midorigahama',
  '緑ケ浜',
  '緑ケ浜',
  '{"en":"Midorigahama"}'::jsonb,
  33.7181029,
  130.4502822,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345916325,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tachibanaguchi',
  '立花口',
  'たちばなぐち',
  '{"en":"Tachibanaguchi"}'::jsonb,
  33.6844378,
  130.4837258,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2345941417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashii_teriha',
  '香椎照葉',
  'かしいてりは',
  '{"en":"Kashii-teriha"}'::jsonb,
  33.6657296,
  130.4234504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2625671598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_saitozaki',
  '西戸崎',
  'さいとざき',
  '{"en":"Saitozaki"}'::jsonb,
  33.6619932,
  130.3560614,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2639001918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gannosu',
  '雁ノ巣',
  'がんのす',
  '{"en":"Gannosu"}'::jsonb,
  33.6834138,
  130.4031322,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695547469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miwadai_shinmachi',
  '美和台新町',
  'みわだいしんまち',
  '{"en":"Miwadai-shinmachi"}'::jsonb,
  33.7079422,
  130.4266836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695553199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_morinomiya',
  '杜の宮',
  '杜の宮',
  '{"en":"Morinomiya"}'::jsonb,
  33.7129736,
  130.4415237,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695571358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minatozaka',
  '湊坂',
  '湊坂',
  '{"en":"Minatozaka"}'::jsonb,
  33.7077033,
  130.4340559,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695571364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chuoekimae',
  '中央駅前',
  '中央駅前',
  '{"en":"Chuoekimae"}'::jsonb,
  33.7108897,
  130.4505726,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695585712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mishiro',
  '三代',
  'みしろ',
  '{"en":"Mishiro"}'::jsonb,
  33.6985903,
  130.456838,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695601972,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_harugami',
  '原上',
  'はるがみ',
  '{"en":"Harugami"}'::jsonb,
  33.6889009,
  130.4585926,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695601980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_misaki',
  '美咲',
  '美咲',
  '{"en":"Misaki"}'::jsonb,
  33.7033547,
  130.4415917,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2695601989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenyamachi',
  '店屋町',
  'てんやまち',
  '{"en":"Tenyamachi"}'::jsonb,
  33.595953,
  130.4098949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2782497903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashiihamafuto',
  '香椎浜ふ頭',
  'かしいはまふとう',
  '{"en":"Kashiihamafuto"}'::jsonb,
  33.6530332,
  130.4178714,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2923920622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shirohamadanchi',
  '城浜団地',
  'しろはまだんち',
  '{"en":"Shirohamadanchi"}'::jsonb,
  33.6497611,
  130.4240896,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2956271195,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashihama',
  '香椎浜',
  'かしいはま',
  '{"en":"Kashihama"}'::jsonb,
  33.6567294,
  130.433654,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2956271196,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashiidai',
  '香椎台',
  'かしいだい',
  '{"en":"Kashiidai"}'::jsonb,
  33.6528397,
  130.4592716,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  3082453845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koyoudai',
  '光陽台',
  '光陽台',
  '{"en":"Koyoudai"}'::jsonb,
  33.7663102,
  130.4950837,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  3266888271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenjin',
  '天神',
  'てんじん',
  '{"en":"Tenjin"}'::jsonb,
  33.5903225,
  130.3998391,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  3555317380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chuomachi',
  '中央町',
  'ちゅうおうまち',
  '{"en":"Chuomachi"}'::jsonb,
  33.3175664,
  130.5048329,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4368911225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_teramachi',
  '寺町',
  'てらまち',
  '{"en":"Teramachi"}'::jsonb,
  33.3178285,
  130.5207327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4370537673,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiyoshimachi',
  '日吉町',
  'ひよしまち',
  '{"en":"Hiyoshimachi"}'::jsonb,
  33.3156863,
  130.5136685,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4370537674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kushiharamachi',
  '櫛原町',
  'くしはらまち',
  '{"en":"Kushiharamachi"}'::jsonb,
  33.3192425,
  130.5150897,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4370537675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hotarugawamachi',
  '螢川町',
  'ほたるがわまち',
  '{"en":"Hotarugawamachi"}'::jsonb,
  33.3172626,
  130.5179754,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4370537676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_torihigashimachi',
  '通東町',
  'とおりひがしまち',
  '{"en":"Torihigashimachi"}'::jsonb,
  33.3147282,
  130.52239,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4370670439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shojimamachi',
  '荘島町',
  'しょうじままち',
  '{"en":"Shojimamachi"}'::jsonb,
  33.3147719,
  130.5056497,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4381816301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mutsumonmachi',
  '六ツ門町',
  'むつもんまち',
  '{"en":"Mutsumonmachi"}'::jsonb,
  33.3131174,
  130.513069,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4405414046,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aikawamachi',
  '合川町',
  'あいかわまち',
  '{"en":"Aikawamachi"}'::jsonb,
  33.3154893,
  130.5356017,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4407594817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asazumamachi',
  '朝妻町',
  'あさづままち',
  '{"en":"Asazumamachi"}'::jsonb,
  33.3121491,
  130.5468015,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4407594818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiaikawamachi',
  '東合川町',
  'ひがしあいかわまち',
  '{"en":"Higashiaikawamachi"}'::jsonb,
  33.3157578,
  130.5471582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4407594819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_torimachi',
  '通町',
  'とおりまち',
  '{"en":"Torimachi"}'::jsonb,
  33.3169687,
  130.5150528,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4407772102,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katsuma',
  '勝馬',
  'かつま',
  '{"en":"Katsuma"}'::jsonb,
  33.6838371,
  130.2965578,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918515041,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiro',
  '弘',
  'ひろ',
  '{"en":"Hiro"}'::jsonb,
  33.6704625,
  130.2938327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918515042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shikashima',
  '志賀島',
  'しかしま',
  '{"en":"Shikashima"}'::jsonb,
  33.6645246,
  130.3077587,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918515043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩姫島',
  '志摩姫島',
  '志摩姫島',
  NULL,
  33.5687271,
  130.0501013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  5167038054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_地島',
  '地島',
  '地島',
  NULL,
  33.9014994,
  130.4999614,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  5172907918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_折尾',
  '折尾',
  '折尾',
  NULL,
  33.868823,
  130.7194236,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336736850,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakasu',
  '中洲',
  'なかす',
  '{"en":"Nakasu"}'::jsonb,
  33.5934757,
  130.4056216,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6610603685,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagahama',
  '長浜',
  'ながはま',
  '{"en":"Nagahama"}'::jsonb,
  33.208063,
  130.5124387,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142691,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kue',
  '久恵',
  'くえ',
  '{"en":"Kue"}'::jsonb,
  33.1904038,
  130.5149463,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizokuchi',
  '溝口',
  'みぞくち',
  '{"en":"Mizokuchi"}'::jsonb,
  33.1854259,
  130.5238805,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanagata',
  '北長田',
  'きたながた',
  '{"en":"Kitanagata"}'::jsonb,
  33.1854394,
  130.5109817,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142694,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinmizo',
  '新溝',
  'しんみぞ',
  '{"en":"Shinmizo"}'::jsonb,
  33.1975494,
  130.5195906,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142695,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsushima',
  '津島',
  'つしま',
  '{"en":"Tsushima"}'::jsonb,
  33.1798512,
  130.4948507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142696,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimotsuma',
  '下妻',
  'しもつま',
  '{"en":"Shimotsuma"}'::jsonb,
  33.175449,
  130.4712328,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tomiyasu',
  '富安',
  'とみやす',
  '{"en":"Tomiyasu"}'::jsonb,
  33.1751368,
  130.4571699,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142698,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mamada',
  '馬間田',
  'ままだ',
  '{"en":"Mamada"}'::jsonb,
  33.1836598,
  130.4685519,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakaoriji',
  '中折地',
  'なかおりじ',
  '{"en":"Nakaoriji"}'::jsonb,
  33.1879141,
  130.4740726,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142700,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakamuta',
  '中牟田',
  'なかむた',
  '{"en":"Nakamuta"}'::jsonb,
  33.1878033,
  130.4632293,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oriji',
  '折地',
  'おりじ',
  '{"en":"Oriji"}'::jsonb,
  33.1938581,
  130.4768884,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kojima',
  '古島',
  'こじま',
  '{"en":"Kojima"}'::jsonb,
  33.1998575,
  130.4765531,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142703,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimokitajima',
  '下北島',
  'しもきたじま',
  '{"en":"Shimokitajima"}'::jsonb,
  33.2008202,
  130.483293,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizuta',
  '水田',
  'みずた',
  '{"en":"Mizuta"}'::jsonb,
  33.1947583,
  130.4832984,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsunemochi',
  '常用',
  'つねもち',
  '{"en":"Tsunemochi"}'::jsonb,
  33.1878097,
  130.4865417,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamikitajima',
  '上北島',
  'かみきたじま',
  '{"en":"Kamikitajima"}'::jsonb,
  33.1968759,
  130.4910868,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nomachi',
  '野町',
  'のまち',
  '{"en":"Nomachi"}'::jsonb,
  33.199022,
  130.5009876,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsuruda',
  '鶴田',
  'つるだ',
  '{"en":"Tsuruda"}'::jsonb,
  33.1949976,
  130.5107474,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamanoi',
  '山ノ井',
  'やまのい',
  '{"en":"Yamanoi"}'::jsonb,
  33.2074589,
  130.5044164,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142710,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_izumi',
  '和泉',
  'いずみ',
  '{"en":"Izumi"}'::jsonb,
  33.2070849,
  130.4942266,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagasaki',
  '長崎',
  'ながさき',
  '{"en":"Nagasaki"}'::jsonb,
  33.2069658,
  130.48415,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shojima',
  '庄島',
  'しょうじま',
  '{"en":"Shojima"}'::jsonb,
  33.2096912,
  130.4803247,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimada',
  '島田',
  'しまだ',
  '{"en":"Shimada"}'::jsonb,
  33.2047866,
  130.4725267,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_seiden',
  '井田',
  'せいでん',
  '{"en":"Seiden"}'::jsonb,
  33.1997166,
  130.4581612,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tomihisa',
  '富久',
  'とみひさ',
  '{"en":"Tomihisa"}'::jsonb,
  33.2108153,
  130.4709377,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shikasho',
  '四ケ所',
  'しかしょ',
  '{"en":"Shikasho"}'::jsonb,
  33.2114402,
  130.4608371,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_eguchi',
  '江口',
  'えぐち',
  '{"en":"Eguchi"}'::jsonb,
  33.2175567,
  130.4668306,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tomishige',
  '富重',
  'とみしげ',
  '{"en":"Tomishige"}'::jsonb,
  33.216022,
  130.4878127,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hainuzuka',
  '羽犬塚',
  'はいぬづか',
  '{"en":"Hainuzuka"}'::jsonb,
  33.2180656,
  130.5009726,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokuhisa',
  '徳久',
  'とくひさ',
  '{"en":"Tokuhisa"}'::jsonb,
  33.214491,
  130.5048829,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_maezu',
  '前津',
  'まえづ',
  '{"en":"Maezu"}'::jsonb,
  33.2239276,
  130.5165562,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hisadomi',
  '久富',
  'ひさどみ',
  '{"en":"Hisadomi"}'::jsonb,
  33.2242535,
  130.4874281,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimuta',
  '西牟田',
  'にしむた',
  '{"en":"Nishimuta"}'::jsonb,
  33.2355333,
  130.4849628,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kurakazu',
  '蔵数',
  'くらかず',
  '{"en":"Kurakazu"}'::jsonb,
  33.237696,
  130.4988702,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimuta_quarter',
  '西牟田',
  'にしむた',
  '{"en":"Nishimuta"}'::jsonb,
  33.242917,
  130.5031881,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakana',
  '若菜',
  'わかな',
  '{"en":"Wakana"}'::jsonb,
  33.2143634,
  130.49029,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takae',
  '高江',
  'たかえ',
  '{"en":"Takae"}'::jsonb,
  33.22558,
  130.4789673,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kumano',
  '熊野',
  'くまの',
  '{"en":"Kumano"}'::jsonb,
  33.2293879,
  130.5023054,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236142729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oshima',
  '尾島',
  'おしま',
  '{"en":"Oshima"}'::jsonb,
  33.1883049,
  130.5016801,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236149797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimura',
  '志',
  'しむら',
  '{"en":"Shimura"}'::jsonb,
  33.1880836,
  130.4983939,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236149798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ichijo',
  '一条',
  'いちじょう',
  '{"en":"Ichijo"}'::jsonb,
  33.2471416,
  130.510434,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7236205248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_samuraijima',
  '侍島',
  'さむらいじま',
  '{"en":"Samuraijima"}'::jsonb,
  33.2091056,
  130.4499831,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7495810076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jonanmachi',
  '城南町',
  'じょうなんまち',
  '{"en":"Jonanmachi"}'::jsonb,
  33.3209429,
  130.5065878,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7638183150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kandamachi',
  '神田町',
  'かんだまち',
  '{"en":"Kandamachi"}'::jsonb,
  33.0051906,
  130.4541922,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7678775721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fujitamachi',
  '藤田町',
  'ふじたまち',
  '{"en":"Fujitamachi"}'::jsonb,
  33.0041199,
  130.4435706,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7678775723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_funatsumachi',
  '船津町',
  'ふなつまち',
  '{"en":"Funatsumachi"}'::jsonb,
  33.010058,
  130.4374552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7678775724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yotsuyamamachi',
  '四山町',
  'よつやままち',
  '{"en":"Yotsuyamamachi"}'::jsonb,
  33.0057484,
  130.4129505,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7678775754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kifunemachi',
  '貴船町',
  'きふねまち',
  '{"en":"Kifunemachi"}'::jsonb,
  33.8698254,
  130.8718979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshinomachi',
  '吉野町',
  'よしのまち',
  '{"en":"Yoshinomachi"}'::jsonb,
  33.8737193,
  130.8765891,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_showamachi',
  '昭和町',
  'しょうわまち',
  '{"en":"Showamachi"}'::jsonb,
  33.8743696,
  130.8782427,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_enamicho',
  '江南町',
  'えなみちょう',
  '{"en":"Enamicho"}'::jsonb,
  33.875718,
  130.8833563,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hagizakimachi',
  '萩崎町',
  'はぎざきまち',
  '{"en":"Hagizakimachi"}'::jsonb,
  33.874148,
  130.8855236,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_meiwamachi',
  '明和町',
  'めいわまち',
  '{"en":"Meiwamachi"}'::jsonb,
  33.874943,
  130.888828,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otamachi',
  '大田町',
  'おおたまち',
  '{"en":"Otamachi"}'::jsonb,
  33.8788378,
  130.8912554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagahamamachi',
  '長浜町',
  'ながはままち',
  '{"en":"Nagahamamachi"}'::jsonb,
  33.8856605,
  130.8912554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_konyamachi',
  '紺屋町',
  'こんやまち',
  '{"en":"Konyamachi"}'::jsonb,
  33.8805792,
  130.8841664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_furusenbamachi',
  '古船場町',
  'ふるせんばまち',
  '{"en":"Furusenbamachi"}'::jsonb,
  33.8789848,
  130.8830613,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002923,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_senbamachi',
  '船場町',
  'せんばまち',
  '{"en":"Senbamachi"}'::jsonb,
  33.8838936,
  130.878464,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sendomachi',
  '船頭町',
  'せんどうまち',
  '{"en":"Sendomachi"}'::jsonb,
  33.887247,
  130.8792619,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7713002932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_maidashi',
  '馬出',
  'まいだし',
  '{"en":"Maidashi"}'::jsonb,
  33.6116127,
  130.4212493,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7787521694,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千代',
  '千代',
  '千代',
  NULL,
  33.6030525,
  130.4128486,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  7787521699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akamabunkyomachi',
  '赤間文教町',
  'あかまぶんきょうまち',
  '{"en":"Akamabunkyomachi"}'::jsonb,
  33.8139192,
  130.5938923,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8047250204,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenpyodai',
  '天平台',
  'てんぴょうだい',
  '{"en":"Tenpyodai"}'::jsonb,
  33.8214802,
  130.5596727,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8047250211,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakaemachi',
  '栄町',
  'さかえまち',
  '{"en":"Sakaemachi"}'::jsonb,
  33.8070685,
  130.5696773,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8047250232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_horiike',
  '堀池',
  'ほりいけ',
  '{"en":"Horiike"}'::jsonb,
  33.6275067,
  130.6839502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tadakuma',
  '忠隈',
  'ただくま',
  '{"en":"Tadakuma"}'::jsonb,
  33.6221041,
  130.6858626,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komoda',
  '菰田',
  'こもだ',
  '{"en":"Komoda"}'::jsonb,
  33.6252957,
  130.691911,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokuzen',
  '徳前',
  'とくぜん',
  '{"en":"Tokuzen"}'::jsonb,
  33.6319778,
  130.6818366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632370,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakana_quarter',
  '若菜',
  'わかな',
  '{"en":"Wakana"}'::jsonb,
  33.6287261,
  130.6748307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632371,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_edakuni',
  '枝国',
  'えだくに',
  '{"en":"Edakuni"}'::jsonb,
  33.633684,
  130.671891,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokota',
  '横田',
  'よこた',
  '{"en":"Yokota"}'::jsonb,
  33.6429021,
  130.6703567,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632374,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashitokuzen',
  '東徳前',
  'ひがしとくぜん',
  '{"en":"Higashitokuzen"}'::jsonb,
  33.6354124,
  130.6798571,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishitokuzen',
  '西徳前',
  'にしとくぜん',
  '{"en":"Nishitokuzen"}'::jsonb,
  33.637717,
  130.6793582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimachi',
  '西町',
  'にしまち',
  '{"en":"Nishimachi"}'::jsonb,
  33.6407584,
  130.6793207,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632377,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyamachi',
  '宮町',
  'みやまち',
  '{"en":"Miyamachi"}'::jsonb,
  33.6417454,
  130.6831804,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshiharamachi',
  '吉原町',
  'よしはらまち',
  '{"en":"Yoshiharamachi"}'::jsonb,
  33.6412609,
  130.68656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_honmachi',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  33.6390368,
  130.6847468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iizuka',
  '飯塚',
  'いいづか',
  '{"en":"Iizuka"}'::jsonb,
  33.6362476,
  130.6860235,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kawashima',
  '川島',
  'かわしま',
  '{"en":"Kawashima"}'::jsonb,
  33.658768,
  130.6927317,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tateiwa',
  '立岩',
  'たていわ',
  '{"en":"Tateiwa"}'::jsonb,
  33.6513244,
  130.6934506,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shin_tateiwa',
  '新立岩',
  'しんたていわ',
  '{"en":"Shin-Tateiwa"}'::jsonb,
  33.646774,
  130.6892502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shin_iizuka',
  '新飯塚',
  'しんいいづか',
  '{"en":"Shin-Iizuka"}'::jsonb,
  33.6442396,
  130.6904572,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshiomachi',
  '芳雄町',
  'よしおまち',
  '{"en":"Yoshiomachi"}'::jsonb,
  33.6405441,
  130.6925493,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kayanomori',
  '柏の森',
  'かやのもり',
  '{"en":"Kayanomori"}'::jsonb,
  33.6430361,
  130.6988954,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382632388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takasagomachi',
  '高砂町',
  'たかさごまち',
  '{"en":"Takasagomachi"}'::jsonb,
  33.0133823,
  130.4263428,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_irifunemachi',
  '入船町',
  'いりふねまち',
  '{"en":"Irifunemachi"}'::jsonb,
  33.0166615,
  130.4269731,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yatsuemachi',
  '八江町',
  'やつえまち',
  '{"en":"Yatsuemachi"}'::jsonb,
  33.0158384,
  130.4395366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ukyomachi',
  '右京町',
  'うきょうまち',
  '{"en":"Ukyomachi"}'::jsonb,
  33.0184068,
  130.4399711,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shozanmachi',
  '正山町',
  'しょうざんまち',
  '{"en":"Shozanmachi"}'::jsonb,
  33.0213485,
  130.4397029,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamashitamachi',
  '山下町',
  'やましたまち',
  '{"en":"Yamashitamachi"}'::jsonb,
  33.0206873,
  130.4358727,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chiyomachi',
  '千代町',
  'ちよまち',
  '{"en":"Chiyomachi"}'::jsonb,
  33.0231071,
  130.4343438,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiraganemachi',
  '白金町',
  'しらがねまち',
  '{"en":"Shiraganemachi"}'::jsonb,
  33.022374,
  130.4366398,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ogawamachi',
  '小川町',
  'おがわまち',
  '{"en":"Ogawamachi"}'::jsonb,
  33.0227879,
  130.4306668,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinkomachi',
  '新港町',
  'しんこうまち',
  '{"en":"Shinkomachi"}'::jsonb,
  33.0239662,
  130.4185939,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_misakimachi',
  '岬町',
  'みさきまち',
  '{"en":"Misakimachi"}'::jsonb,
  33.0291025,
  130.428223,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kohamamachi',
  '小浜町',
  'こはままち',
  '{"en":"Kohamamachi"}'::jsonb,
  33.0282839,
  130.4346818,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683243,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsubaramachi',
  '松原町',
  'まつばらまち',
  '{"en":"Matsubaramachi"}'::jsonb,
  33.0320303,
  130.4405022,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinchimachi',
  '新地町',
  'しんちまち',
  '{"en":"Shinchimachi"}'::jsonb,
  33.0332086,
  130.436967,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakatomomachi',
  '中友町',
  'なかともまち',
  '{"en":"Nakatomomachi"}'::jsonb,
  33.0344184,
  130.4416287,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakashimamachi',
  '中島町',
  'なかしままち',
  '{"en":"Nakashimamachi"}'::jsonb,
  33.0364736,
  130.4440695,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hamamachi',
  '浜町',
  'はままち',
  '{"en":"Hamamachi"}'::jsonb,
  33.0383016,
  130.4441982,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minatomachi',
  '港町',
  'みなとまち',
  '{"en":"Minatomachi"}'::jsonb,
  33.0373842,
  130.4440601,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sumiyoshimachi',
  '住吉町',
  'すみよしまち',
  '{"en":"Sumiyoshimachi"}'::jsonb,
  33.0367254,
  130.4421866,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hamadamachi',
  '浜田町',
  'はまだまち',
  '{"en":"Hamadamachi"}'::jsonb,
  33.0365837,
  130.4384476,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishihamadamachi',
  '西浜田町',
  'にしはまだまち',
  '{"en":"Nishihamadamachi"}'::jsonb,
  33.0350277,
  130.4378012,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishishinmachi',
  '西新町',
  'にししんまち',
  '{"en":"Nishishinmachi"}'::jsonb,
  33.0353111,
  130.4303688,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382683253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimotsukiguma',
  '下月隈',
  'しもつきぐま',
  '{"en":"Shimotsukiguma"}'::jsonb,
  33.5819923,
  130.4661548,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382974191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sasai',
  '雀居',
  'ささい',
  '{"en":"Sasai"}'::jsonb,
  33.5807633,
  130.4465049,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382974210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiemachi',
  '比恵町',
  'ひえまち',
  '{"en":"Hiemachi"}'::jsonb,
  33.5854491,
  130.4294166,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983039,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ryugeji',
  '立花寺',
  'りゅうげじ',
  '{"en":"Ryugeji"}'::jsonb,
  33.5685885,
  130.4736596,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983064,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kanenokuma',
  '金隈',
  'かねのくま',
  '{"en":"Kanenokuma"}'::jsonb,
  33.5618121,
  130.4796249,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983065,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimotsukiguma_quarter',
  '下月隈',
  'しもつきぐま',
  '{"en":"Shimotsukiguma"}'::jsonb,
  33.5765131,
  130.4563969,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983066,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashihirao',
  '東平尾',
  'ひがしひらお',
  '{"en":"Higashihirao"}'::jsonb,
  33.583695,
  130.4514188,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983067,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aoki',
  '青木',
  'あおき',
  '{"en":"Aoki"}'::jsonb,
  33.5868054,
  130.4465371,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiusui',
  '上臼井',
  'かみうすい',
  '{"en":"Kamiusui"}'::jsonb,
  33.5908764,
  130.4455393,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983069,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katakasu',
  '堅粕',
  'かたかす',
  '{"en":"Katakasu"}'::jsonb,
  33.5995406,
  130.4388606,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimousui',
  '下臼井',
  'しもうすい',
  '{"en":"Shimousui"}'::jsonb,
  33.5984682,
  130.445196,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshizukahonmachi',
  '吉塚本町',
  'よしづかほんまち',
  '{"en":"Yoshizukahonmachi"}'::jsonb,
  33.6072813,
  130.4242265,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gionmachi',
  '祇園町',
  'ぎおんまち',
  '{"en":"Gionmachi"}'::jsonb,
  33.5919533,
  130.4128003,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gokusho',
  '御供所町',
  'ごくしょまち',
  '{"en":"Gokusho"}'::jsonb,
  33.5964083,
  130.4148334,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_reisenmachi',
  '冷泉町',
  'れいせんまち',
  '{"en":"Reisenmachi"}'::jsonb,
  33.5943238,
  130.4122263,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983075,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamigofukumachi',
  '上呉服町',
  'かみごふくまち',
  '{"en":"Kamigofukumachi"}'::jsonb,
  33.5982515,
  130.4120949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakagofukumachi',
  '中呉服町',
  'なかごふくまち',
  '{"en":"Nakagofukumachi"}'::jsonb,
  33.5997305,
  130.4104185,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983077,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsunabamachi',
  '綱場町',
  'つなばまち',
  '{"en":"Tsunabamachi"}'::jsonb,
  33.5975254,
  130.4079938,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983078,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamikawabatamachi',
  '上川端町',
  'かみかわばたまち',
  '{"en":"Kamikawabatamachi"}'::jsonb,
  33.593906,
  130.4089554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983079,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimokawabatamachi',
  '下川端町',
  'しもかわばたまち',
  '{"en":"Shimokawabatamachi"}'::jsonb,
  33.5959034,
  130.4060438,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakasu_nakashimamachi',
  '中洲中島町',
  'なかすなかしままち',
  '{"en":"Nakasu-Nakashimamachi"}'::jsonb,
  33.5951449,
  130.4027501,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983081,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_susakimachi',
  '須崎町',
  'すさきまち',
  '{"en":"Susakimachi"}'::jsonb,
  33.5969401,
  130.4024631,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983082,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komondomachi',
  '古門戸町',
  'こもんどまち',
  '{"en":"Komondomachi"}'::jsonb,
  33.5978136,
  130.4044667,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_narayamachi',
  '奈良屋町',
  'ならやまち',
  '{"en":"Narayamachi"}'::jsonb,
  33.5991719,
  130.4059875,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimogofukumachi',
  '下呉服町',
  'しもごふくまち',
  '{"en":"Shimogofukumachi"}'::jsonb,
  33.6014954,
  130.4082513,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_taihakumachi',
  '大博町',
  'たいはくまち',
  '{"en":"Taihakumachi"}'::jsonb,
  33.6027464,
  130.4058936,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiyamachi',
  '神屋町',
  'かみやまち',
  '{"en":"Kamiyamachi"}'::jsonb,
  33.6008966,
  130.4039034,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsumashoji',
  '対馬小路',
  'つましょうじ',
  '{"en":"Tsumashoji"}'::jsonb,
  33.5990089,
  130.4017335,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chikkohonmachi',
  '築港本町',
  'ちっこうほんまち',
  '{"en":"Chikkohonmachi"}'::jsonb,
  33.6027218,
  130.4003307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sekijomachi',
  '石城町',
  'せきじょうまち',
  '{"en":"Sekijomachi"}'::jsonb,
  33.6052507,
  130.4057729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okihamamachi',
  '沖浜町',
  'おきはままち',
  '{"en":"Okihamamachi"}'::jsonb,
  33.6090706,
  130.4014653,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8382983091,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashi_koen',
  '東公園',
  'ひがしこうえん',
  '{"en":"Higashi-koen"}'::jsonb,
  33.6056394,
  130.419479,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383056041,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_itazuke',
  '板付',
  'いたづけ',
  '{"en":"Itazuke"}'::jsonb,
  33.5677169,
  130.4543504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383056042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imatobaru',
  '今任原',
  'いまとうばる',
  '{"en":"Imatobaru"}'::jsonb,
  33.6298428,
  130.850054,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daigyoji',
  '大行事',
  'だいぎょうじ',
  '{"en":"Daigyoji"}'::jsonb,
  33.5979276,
  130.8519959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_uchida',
  '内田',
  'うちだ',
  '{"en":"Uchida"}'::jsonb,
  33.6298428,
  130.8797407,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_uchida_quarter',
  '内田',
  'うちだ',
  '{"en":"Uchida"}'::jsonb,
  33.6263945,
  130.8657396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aka',
  '赤',
  'あか',
  '{"en":"Aka"}'::jsonb,
  33.5811432,
  130.9063482,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aka_quarter',
  '赤',
  'あか',
  '{"en":"Aka"}'::jsonb,
  33.5984995,
  130.8746123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8383078568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_goguchimachi',
  '郷口町',
  'ごうぐちまち',
  '{"en":"Goguchimachi"}'::jsonb,
  33.6148062,
  130.4291914,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481913071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kaizukadanchi',
  '貝塚団地',
  'かいづかだんち',
  '{"en":"Kaizukadanchi"}'::jsonb,
  33.6322077,
  130.422462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481913099,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mitoma_quarter',
  '三苫',
  'みとま',
  '{"en":"Mitoma"}'::jsonb,
  33.6981463,
  130.4131713,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481930525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_natadanchi',
  '奈多団地',
  'なただんち',
  '{"en":"Natadanchi"}'::jsonb,
  33.6858437,
  130.413961,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481930534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nago',
  '名子',
  'なご',
  '{"en":"Nago"}'::jsonb,
  33.6443535,
  130.4786852,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481993675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futamatase_shinmachi',
  '二又瀬新町',
  'ふたまたせしんまち',
  '{"en":"Futamatase-shinmachi"}'::jsonb,
  33.6108389,
  130.4406461,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481993687,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hakomatsu_shinmachi',
  '筥松新町',
  'はこまつしんまち',
  '{"en":"Hakomatsu-shinmachi"}'::jsonb,
  33.6119654,
  130.4372324,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481993695,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiwajiro',
  '上和白',
  'かみわじろ',
  '{"en":"Kamiwajiro"}'::jsonb,
  33.6857981,
  130.4398382,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8481993698,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimobaru',
  '下原',
  'しもばる',
  '{"en":"Shimobaru"}'::jsonb,
  33.6784426,
  130.4619087,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8482010118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashii',
  '香椎',
  'かしい',
  '{"en":"Kashii"}'::jsonb,
  33.6670941,
  130.4639537,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8482010143,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futamatase',
  '二又瀬',
  'ふたまたせ',
  '{"en":"Futamatase"}'::jsonb,
  33.6082262,
  130.4396339,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8482010176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_izaki',
  '伊崎',
  'いざき',
  '{"en":"Izaki"}'::jsonb,
  33.5970883,
  130.3720055,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186671,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hirao_josuimachi',
  '平尾浄水町',
  'ひらおじょうすいまち',
  '{"en":"Hirao-josuimachi"}'::jsonb,
  33.5721521,
  130.3938991,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_baikoendanchi',
  '梅光園団地',
  'ばいこうえんだんち',
  '{"en":"Baikoendanchi"}'::jsonb,
  33.5736071,
  130.3769021,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_furukogarasumachi',
  '古小烏町',
  'ふるこがらすまち',
  '{"en":"Furukogarasumachi"}'::jsonb,
  33.5778326,
  130.3921879,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186703,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hori_park',
  '大濠公園',
  'おおほりこうえん',
  '{"en":"Ōhori Park"}'::jsonb,
  33.5861263,
  130.3763271,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_josuidori',
  '浄水通',
  'じょうすいどおり',
  '{"en":"Josuidori"}'::jsonb,
  33.5758012,
  130.3938153,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484186713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishinakasu',
  '西中洲',
  'にしなかす',
  '{"en":"Nishinakasu"}'::jsonb,
  33.5912898,
  130.4053432,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minamikoen',
  '南公園',
  'みなみこうえん',
  '{"en":"Minamikoen"}'::jsonb,
  33.5729402,
  130.3887946,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236643,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuromon',
  '黒門',
  'くろもん',
  '{"en":"Kuromon"}'::jsonb,
  33.5893995,
  130.3716337,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yakuin_ifukumachi',
  '薬院伊福町',
  'やくいんいふくまち',
  '{"en":"Yakuin-ifukumachi"}'::jsonb,
  33.5785701,
  130.3928611,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236665,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_goshogadani',
  '御所ヶ谷',
  'ごしょがだに',
  '{"en":"Goshogadani"}'::jsonb,
  33.576083,
  130.3921966,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiraokamachi',
  '平丘町',
  'ひらおかまち',
  '{"en":"Hiraokamachi"}'::jsonb,
  33.5745771,
  130.3953211,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jonai',
  '城内',
  'じょうない',
  '{"en":"Jonai"}'::jsonb,
  33.5855683,
  130.3813147,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236683,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishikoen',
  '西公園',
  'にしこうえん',
  '{"en":"Nishikoen"}'::jsonb,
  33.5971891,
  130.3756441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484236685,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohashidanchi',
  '大橋団地',
  'おおはしだんち',
  '{"en":"Ohashidanchi"}'::jsonb,
  33.5574019,
  130.432416,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484239213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokoteminamimachi',
  '横手南町',
  'よこてみなみまち',
  '{"en":"Yokoteminamimachi"}'::jsonb,
  33.5454797,
  130.4409808,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254677,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tamagawamachi',
  '玉川町',
  'たまがわまち',
  '{"en":"Tamagawamachi"}'::jsonb,
  33.567311,
  130.4177737,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254685,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hibaru',
  '桧原',
  'ひばる',
  '{"en":"Hibaru"}'::jsonb,
  33.5364613,
  130.3924613,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yanagadanchi',
  '弥永団地',
  'やながだんち',
  '{"en":"Yanagadanchi"}'::jsonb,
  33.5314702,
  130.438256,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakahisadanchi',
  '若久団地',
  'わかひさだんち',
  '{"en":"Wakahisadanchi"}'::jsonb,
  33.5544148,
  130.4192962,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kashiwara',
  '柏原',
  'かしわら',
  '{"en":"Kashiwara"}'::jsonb,
  33.5257778,
  130.3996301,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484254755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jurokucho',
  '拾六町',
  'じゅうろくちょう',
  '{"en":"Jurokucho"}'::jsonb,
  33.5665736,
  130.310241,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_genkaishima',
  '玄界島',
  'げんかいしま',
  '{"en":"Genkaishima"}'::jsonb,
  33.688372,
  130.2319274,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288697,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iiji',
  '飯氏',
  'いいじ',
  '{"en":"Iiji"}'::jsonb,
  33.5669167,
  130.2520764,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288702,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imajuku_aoki',
  '今宿青木',
  'いまじゅくあおき',
  '{"en":"Imajuku-aoki"}'::jsonb,
  33.5707297,
  130.2853571,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyanoura',
  '宮浦',
  'みやのうら',
  '{"en":"Miyanoura"}'::jsonb,
  33.6466767,
  130.2285863,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fukushige_danchi',
  '福重団地',
  'ふくしげだんち',
  '{"en":"Fukushige-danchi"}'::jsonb,
  33.5699519,
  130.3252027,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jurokucho_danchi',
  '拾六町団地',
  'じゅうろくちょうだんち',
  '{"en":"Jurokucho-danchi"}'::jsonb,
  33.5637759,
  130.3069827,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nokata',
  '野方',
  'のかた',
  '{"en":"Nokata"}'::jsonb,
  33.5513721,
  130.3075822,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484288716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_taromaru',
  '太郎丸',
  'たろうまる',
  '{"en":"Taromaru"}'::jsonb,
  33.5952812,
  130.2413078,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoyamato_danchi',
  '下山門団地',
  'しもやまとだんち',
  '{"en":"Shimoyamato-danchi"}'::jsonb,
  33.5782153,
  130.3066736,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kota',
  '小田',
  'こた',
  '{"en":"Kota"}'::jsonb,
  33.6339715,
  130.2169576,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kyudai_shinmachi',
  '九大新町',
  'きゅうだいしんまち',
  '{"en":"Kyudai-shinmachi"}'::jsonb,
  33.5941079,
  130.2303447,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296227,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusaba',
  '草場',
  'くさば',
  '{"en":"Kusaba"}'::jsonb,
  33.6158668,
  130.2173499,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imazu',
  '今津',
  'いまづ',
  '{"en":"Imazu"}'::jsonb,
  33.6066691,
  130.2571973,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hashimoto',
  '橋本',
  'はしもと',
  '{"en":"Hashimoto"}'::jsonb,
  33.5484421,
  130.3218886,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishiirube',
  '西入部',
  'にしいるべ',
  '{"en":"Nishiirube"}'::jsonb,
  33.5107553,
  130.3191267,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jurogawa_danchi',
  '十郎川団地',
  'じゅうろうがわだんち',
  '{"en":"Jurogawa-danchi"}'::jsonb,
  33.5699959,
  130.3117591,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ta',
  '田',
  'た',
  '{"en":"Ta"}'::jsonb,
  33.5391395,
  130.3229507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuwabara',
  '桑原',
  'くわばら',
  '{"en":"Kuwabara"}'::jsonb,
  33.6058902,
  130.2260069,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oronoshima',
  '小呂島',
  'おろのしま',
  '{"en":"Oronoshima"}'::jsonb,
  33.8682609,
  130.0363455,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokunagakita',
  '徳永北',
  'とくながきた',
  '{"en":"Tokunagakita"}'::jsonb,
  33.575146,
  130.2576643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshitake',
  '吉武',
  'よしたけ',
  '{"en":"Yoshitake"}'::jsonb,
  33.5358428,
  130.3154259,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishinoura',
  '西浦',
  'にしのうら',
  '{"en":"Nishinoura"}'::jsonb,
  33.6526427,
  130.2153143,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_noko',
  '能古',
  'のこ',
  '{"en":"Noko"}'::jsonb,
  33.6189343,
  130.3067582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_susenji',
  '周船寺',
  'すせんじ',
  '{"en":"Susenji"}'::jsonb,
  33.574295,
  130.2538622,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ikidanchi',
  '壱岐団地',
  'いきだんち',
  '{"en":"Ikidanchi"}'::jsonb,
  33.5598812,
  130.3154339,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kanatake',
  '金武',
  'かなたけ',
  '{"en":"Kanatake"}'::jsonb,
  33.5266618,
  130.3144346,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imajukumachi',
  '今宿町',
  'いまじゅくまち',
  '{"en":"Imajukumachi"}'::jsonb,
  33.5697985,
  130.2701648,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iimori',
  '飯盛',
  'いいもり',
  '{"en":"Iimori"}'::jsonb,
  33.5403358,
  130.3110216,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296294,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_omachidanchi',
  '大町団地',
  'おおまちだんち',
  '{"en":"Omachidanchi"}'::jsonb,
  33.5769176,
  130.3191804,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_myobarukita',
  '女原北',
  'みょうばるきた',
  '{"en":"Myobarukita"}'::jsonb,
  33.5756788,
  130.2639648,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_myobaru',
  '女原',
  'みょうばる',
  '{"en":"Myobaru"}'::jsonb,
  33.5708785,
  130.2647202,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jonoharu_danchi',
  '城の原団地',
  'じょうのはるだんち',
  '{"en":"Jonoharu-danchi"}'::jsonb,
  33.5732362,
  130.3092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokunaga',
  '徳永',
  'とくなが',
  '{"en":"Tokunaga"}'::jsonb,
  33.5673832,
  130.2573594,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_senri',
  '千里',
  'せんり',
  '{"en":"Senri"}'::jsonb,
  33.5621601,
  130.2423423,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoyamato',
  '下山門',
  'しもやまと',
  '{"en":"Shimoyamato"}'::jsonb,
  33.5749979,
  130.2942717,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_udagawara',
  '宇田川原',
  'うだがわら',
  '{"en":"Udagawara"}'::jsonb,
  33.5575761,
  130.2391403,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imajuku_kaminoharu',
  '今宿上ノ原',
  'いまじゅくかみのはる',
  '{"en":"Imajuku-kaminoharu"}'::jsonb,
  33.5588734,
  130.2801024,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296329,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_motooka',
  '元岡',
  'もとおか',
  '{"en":"Motooka"}'::jsonb,
  33.5880335,
  130.2167611,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hanedo',
  '羽根戸',
  'はねど',
  '{"en":"Hanedo"}'::jsonb,
  33.5457385,
  130.3106426,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484296336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yusentei',
  '友泉亭',
  'ゆうせんてい',
  '{"en":"Yusentei"}'::jsonb,
  33.5615159,
  130.378598,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kanayamadanchi',
  '金山団地',
  'かなやまだんち',
  '{"en":"Kanayamadanchi"}'::jsonb,
  33.5579684,
  130.3645975,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665343,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katae',
  '片江',
  'かたえ',
  '{"en":"Katae"}'::jsonb,
  33.5500743,
  130.3729651,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_joseidanchi',
  '城西団地',
  'じょうせいだんち',
  '{"en":"Joseidanchi"}'::jsonb,
  33.5737779,
  130.3656061,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_befudanchi',
  '別府団地',
  'べふだんち',
  '{"en":"Befudanchi"}'::jsonb,
  33.5736346,
  130.3748659,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_araedanchi',
  '荒江団地',
  'あらえだんち',
  '{"en":"Araedanchi"}'::jsonb,
  33.5719332,
  130.3603347,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takaradai_danchi',
  '宝台団地',
  'たからだいだんち',
  '{"en":"Takaradai-danchi"}'::jsonb,
  33.5450994,
  130.3855325,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665399,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashi_aburayama',
  '東油山',
  'ひがしあぶらやま',
  '{"en":"Higashi-Aburayama"}'::jsonb,
  33.5273521,
  130.3749272,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsutsumidanchi',
  '堤団地',
  'つつみだんち',
  '{"en":"Tsutsumidanchi"}'::jsonb,
  33.545679,
  130.3822354,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484665409,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umebayashi',
  '梅林',
  'うめばやし',
  '{"en":"Umebayashi"}'::jsonb,
  33.543286,
  130.3550792,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484706222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_itaya',
  '板屋',
  'いたや',
  '{"en":"Itaya"}'::jsonb,
  33.443757,
  130.3835315,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484826885,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_murozumi_danchi',
  '室住団地',
  'むろずみだんち',
  '{"en":"Murozumi-danchi"}'::jsonb,
  33.5624309,
  130.3281418,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484826893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_magaribuchi',
  '曲渕',
  'まがりぶち',
  '{"en":"Magaribuchi"}'::jsonb,
  33.4948788,
  130.3005331,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484826896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okasagi',
  '小笠木',
  'おかさぎ',
  '{"en":"Okasagi"}'::jsonb,
  33.4908273,
  130.3702,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiirube',
  '東入部',
  'ひがしいるべ',
  '{"en":"Higashiirube"}'::jsonb,
  33.5133859,
  130.3450685,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishi_aburayama',
  '西油山',
  'にしあぶらやま',
  '{"en":"Nishi-Aburayama"}'::jsonb,
  33.5311565,
  130.353159,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hoshinohara_danchi',
  '星の原団地',
  'ほしのはらだんち',
  '{"en":"Hoshinohara-danchi"}'::jsonb,
  33.5575876,
  130.3438076,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aritadanchi',
  '有田団地',
  'ありただんち',
  '{"en":"Aritadanchi"}'::jsonb,
  33.5578724,
  130.3319354,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ishigama',
  '石釜',
  'いしがま',
  '{"en":"Ishigama"}'::jsonb,
  33.4939986,
  130.3167208,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishi',
  '西',
  'にし',
  '{"en":"Nishi"}'::jsonb,
  33.4903521,
  130.3423085,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shigedome',
  '重留',
  'しげどめ',
  '{"en":"Shigedome"}'::jsonb,
  33.5237469,
  130.3485714,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iiba',
  '飯場',
  'いいば',
  '{"en":"Iiba"}'::jsonb,
  33.4976231,
  130.2896465,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakiyama',
  '脇山',
  'わきやま',
  '{"en":"Wakiyama"}'::jsonb,
  33.4925898,
  130.3532392,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_noke',
  '野芥',
  'のけ',
  '{"en":"Noke"}'::jsonb,
  33.5309811,
  130.3591383,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_haradanchi',
  '原団地',
  'はらだんち',
  '{"en":"Haradanchi"}'::jsonb,
  33.5718891,
  130.3410057,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830804,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiiba',
  '椎原',
  'しいば',
  '{"en":"Shiiba"}'::jsonb,
  33.4678735,
  130.3561294,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_uchino',
  '内野',
  'うちの',
  '{"en":"Uchino"}'::jsonb,
  33.5064377,
  130.34813,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shikatadanchi',
  '四箇田団地',
  'しかただんち',
  '{"en":"Shikatadanchi"}'::jsonb,
  33.53481,
  130.3316593,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8484830831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hata',
  '畑',
  'はた',
  '{"en":"Hata"}'::jsonb,
  33.8823819,
  130.9731725,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_sakuragaoka',
  '大里桜ケ丘',
  'だいりさくらがおか',
  '{"en":"Dairi-sakuragaoka"}'::jsonb,
  33.8985232,
  130.957576,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiroyamacho',
  '城山町',
  'しろやまちょう',
  '{"en":"Shiroyamacho"}'::jsonb,
  33.9028803,
  130.95284,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minamihonmachi',
  '南本町',
  'みなみほんまち',
  '{"en":"Minamihonmachi"}'::jsonb,
  33.9166561,
  130.9422403,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_maruyama_yoshinomachi',
  '丸山吉野町',
  'まるやまよしのまち',
  '{"en":"Maruyama-yoshinomachi"}'::jsonb,
  33.9373737,
  130.9725104,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komatsucho',
  '小松町',
  'こまつちょう',
  '{"en":"Komatsucho"}'::jsonb,
  33.8952048,
  130.9360515,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_higashiguchi',
  '大里東口',
  'だいりひがしぐち',
  '{"en":"Dairi-higashiguchi"}'::jsonb,
  33.9126106,
  130.9377425,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komorie',
  '小森江',
  'こもりえ',
  '{"en":"Komorie"}'::jsonb,
  33.9244672,
  130.950612,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485058613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kishi',
  '吉志',
  'きし',
  '{"en":"Kishi"}'::jsonb,
  33.8758575,
  130.9626436,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kiyomi_sayamachi',
  '清見佐夜町',
  'きよみさやまち',
  '{"en":"Kiyomi-sayamachi"}'::jsonb,
  33.9447952,
  130.988071,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_setomachi',
  '瀬戸町',
  'せとまち',
  '{"en":"Setomachi"}'::jsonb,
  33.9593842,
  130.9732269,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katagami_kaigan',
  '片上海岸',
  'かたがみかいがん',
  '{"en":"Katagami-kaigan"}'::jsonb,
  33.9309405,
  130.9431243,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yanagiharamachi',
  '柳原町',
  'やなぎはらまち',
  '{"en":"Yanagiharamachi"}'::jsonb,
  33.8968197,
  130.9341108,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takasagomachi_quarter',
  '高砂町',
  'たかさごまち',
  '{"en":"Takasagomachi"}'::jsonb,
  33.9256783,
  130.9765269,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi',
  '大里',
  'だいり',
  '{"en":"Dairi"}'::jsonb,
  33.8986025,
  130.9537739,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otsumi',
  '大積',
  'おおつみ',
  '{"en":"Otsumi"}'::jsonb,
  33.9291824,
  130.995483,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oimatsucho',
  '老松町',
  'おいまつちょう',
  '{"en":"Oimatsucho"}'::jsonb,
  33.9463889,
  130.9693465,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_haramachi_betsuin',
  '原町別院',
  'はらまちべついん',
  '{"en":"Haramachi-betsuin"}'::jsonb,
  33.8980497,
  130.9303784,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_moji',
  '門司',
  'もじ',
  '{"en":"Moji"}'::jsonb,
  33.9352572,
  130.958284,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hamamachi_quarter',
  '浜町',
  'はままち',
  '{"en":"Hamamachi"}'::jsonb,
  33.9494105,
  130.9664624,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066770,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsunemi',
  '恒見',
  'つねみ',
  '{"en":"Tsunemi"}'::jsonb,
  33.8541999,
  130.9836845,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066771,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hoshian',
  '法師庵',
  'ほうしあん',
  '{"en":"Hoshian"}'::jsonb,
  33.9488656,
  130.9767128,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066774,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamihonmachi',
  '上本町',
  'かみほんまち',
  '{"en":"Kamihonmachi"}'::jsonb,
  33.9462108,
  130.9803944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kasugamachi',
  '春日町',
  'かすがまち',
  '{"en":"Kasugamachi"}'::jsonb,
  33.9309094,
  130.9712861,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066778,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hishakudamachi',
  '柄杓田町',
  'ひしゃくだまち',
  '{"en":"Hishakudamachi"}'::jsonb,
  33.9067713,
  130.9922915,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinharamachi',
  '新原町',
  'しんはらまち',
  '{"en":"Shinharamachi"}'::jsonb,
  33.8925082,
  130.9321804,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066782,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_momoyamadai',
  '桃山台',
  'ももやまだい',
  '{"en":"Momoyamadai"}'::jsonb,
  33.8898252,
  130.936711,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitagawamachi',
  '北川町',
  'きたがわまち',
  '{"en":"Kitagawamachi"}'::jsonb,
  33.921993,
  130.944716,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066784,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_momoyamacho',
  '大里桃山町',
  'だいりももやまちょう',
  '{"en":"Dairi-momoyamacho"}'::jsonb,
  33.8930416,
  130.9375976,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066785,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minatomachi_quarter',
  '港町',
  'みなとまち',
  '{"en":"Minatomachi"}'::jsonb,
  33.946235,
  130.9642439,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066786,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiranoe',
  '白野江',
  'しらのえ',
  '{"en":"Shiranoe"}'::jsonb,
  33.9530551,
  131.0159654,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koganemachi',
  '黄金町',
  'こがねまち',
  '{"en":"Koganemachi"}'::jsonb,
  33.9086024,
  130.938951,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsuzakicho',
  '松崎町',
  'まつざきちょう',
  '{"en":"Matsuzakicho"}'::jsonb,
  33.9066969,
  130.9528878,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kurogawa',
  '黒川',
  'くろがわ',
  '{"en":"Kurogawa"}'::jsonb,
  33.9251014,
  130.9681891,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umenokicho',
  '梅ノ木町',
  'うめのきちょう',
  '{"en":"Umenokicho"}'::jsonb,
  33.9084828,
  130.9357149,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsunemimachi',
  '恒見町',
  'つねみまち',
  '{"en":"Tsunemimachi"}'::jsonb,
  33.8643626,
  130.9743573,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_izumigaoka',
  '泉ケ丘',
  'いずみがおか',
  '{"en":"Izumigaoka"}'::jsonb,
  33.8912834,
  130.9351677,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shojimachi',
  '庄司町',
  'しょうじまち',
  '{"en":"Shojimachi"}'::jsonb,
  33.9451365,
  130.9709837,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tachinoura_kaigan',
  '太刀浦海岸',
  'たちのうらかいがん',
  '{"en":"Tachinoura-kaigan"}'::jsonb,
  33.9644041,
  131.0097993,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimomaiso',
  '下馬寄',
  'しもまいそう',
  '{"en":"Shimomaiso"}'::jsonb,
  33.8960047,
  130.9284844,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066805,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakaemachi_quarter',
  '栄町',
  'さかえまち',
  '{"en":"Sakaemachi"}'::jsonb,
  33.9454787,
  130.9660847,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatakedamachi',
  '畑田町',
  'はたけだまち',
  '{"en":"Hatakedamachi"}'::jsonb,
  33.9518843,
  130.9712648,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanoura',
  '田野浦',
  'たのうら',
  '{"en":"Tanoura"}'::jsonb,
  33.9590921,
  131.0037731,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066810,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishikimachi',
  '錦町',
  'にしきまち',
  '{"en":"Nishikimachi"}'::jsonb,
  33.9438223,
  130.9673231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_betsuin',
  '別院',
  'べついん',
  '{"en":"Betsuin"}'::jsonb,
  33.894127,
  130.9337389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066813,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_shinmachi',
  '大里新町',
  'だいりしんまち',
  '{"en":"Dairi-shinmachi"}'::jsonb,
  33.8962622,
  130.923807,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futamatsucho',
  '二タ松町',
  'ふたまつちょう',
  '{"en":"Futamatsucho"}'::jsonb,
  33.9278991,
  130.9457013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kaminijitcho',
  '上二十町',
  'かみにじっちょう',
  '{"en":"Kaminijitcho"}'::jsonb,
  33.9093034,
  130.9451188,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinkai',
  '新開',
  'しんかい',
  '{"en":"Shinkai"}'::jsonb,
  33.9563673,
  130.985583,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_midorigaoka',
  '緑ケ丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  33.8842667,
  130.9309369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_honmachi_quarter',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  33.9437295,
  130.9641485,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitaku',
  '喜多久',
  'きたく',
  '{"en":"Kitaku"}'::jsonb,
  33.9161664,
  131.0013975,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakamachi',
  '中町',
  'なかまち',
  '{"en":"Nakamachi"}'::jsonb,
  33.9025198,
  130.9308087,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imazu_quarter',
  '今津',
  'いまづ',
  '{"en":"Imazu"}'::jsonb,
  33.8820547,
  130.9824351,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanoura_kaigan',
  '田野浦海岸',
  'たのうらかいがん',
  '{"en":"Tanoura-kaigan"}'::jsonb,
  33.9596152,
  130.984138,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aobadai',
  '青葉台',
  'あおばだい',
  '{"en":"Aobadai"}'::jsonb,
  33.8850449,
  130.920741,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kagetsuen',
  '花月園',
  'かげつえん',
  '{"en":"Kagetsuen"}'::jsonb,
  33.9480572,
  130.9786,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimonijitcho',
  '下二十町',
  'しもにじっちょう',
  '{"en":"Shimonijitcho"}'::jsonb,
  33.9115708,
  130.9398248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hishakuda',
  '柄杓田',
  'ひしゃくだ',
  '{"en":"Hishakuda"}'::jsonb,
  33.9091665,
  130.9933406,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066848,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katagamimachi',
  '片上町',
  'かたがみまち',
  '{"en":"Katagamimachi"}'::jsonb,
  33.9247217,
  130.9454372,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiminatomachi',
  '東港町',
  'ひがしみなとまち',
  '{"en":"Higashiminatomachi"}'::jsonb,
  33.9504525,
  130.9640119,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066859,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_motokiyotaki',
  '元清滝',
  'もときよたき',
  '{"en":"Motokiyotaki"}'::jsonb,
  33.9375185,
  130.9614068,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_motomachi',
  '大里元町',
  'だいりもとまち',
  '{"en":"Dairi-motomachi"}'::jsonb,
  33.9182093,
  130.9389415,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066864,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_saruhami',
  '猿喰',
  'さるはみ',
  '{"en":"Saruhami"}'::jsonb,
  33.8945419,
  130.9778571,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066870,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairi_haramachi',
  '大里原町',
  'だいりはらまち',
  '{"en":"Dairi-haramachi"}'::jsonb,
  33.8996427,
  130.9321943,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066872,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakanijitcho',
  '中二十町',
  'なかにじっちょう',
  '{"en":"Nakanijitcho"}'::jsonb,
  33.9098092,
  130.942597,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ikawa',
  '伊川',
  'いかわ',
  '{"en":"Ikawa"}'::jsonb,
  33.9063533,
  130.9778353,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066874,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yahazumachi',
  '矢筈町',
  'やはずまち',
  '{"en":"Yahazumachi"}'::jsonb,
  33.9177152,
  130.943453,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashimaiso',
  '東馬寄',
  'ひがしまいそう',
  '{"en":"Higashimaiso"}'::jsonb,
  33.8945283,
  130.930452,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485066884,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsuchitorimachi',
  '土取町',
  'つちとりまち',
  '{"en":"Tsuchitorimachi"}'::jsonb,
  33.8898333,
  130.8423349,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sensuicho',
  '仙水町',
  'せんすいちょう',
  '{"en":"Sensuicho"}'::jsonb,
  33.8915071,
  130.8398915,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107625,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tobata',
  '戸畑',
  'とばた',
  '{"en":"Tobata"}'::jsonb,
  33.9147169,
  130.8319468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashi_sayagatanimachi',
  '東鞘ケ谷町',
  'ひがしさやがたにまち',
  '{"en":"Higashi-Sayagatanimachi"}'::jsonb,
  33.8757093,
  130.8347417,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107627,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shozumachi',
  '正津町',
  'しょうづまち',
  '{"en":"Shozumachi"}'::jsonb,
  33.8899442,
  130.8299108,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_meijimachi',
  '明治町',
  'めいじまち',
  '{"en":"Meijimachi"}'::jsonb,
  33.8998823,
  130.8228199,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakabaru',
  '中原',
  'なかばる',
  '{"en":"Nakabaru"}'::jsonb,
  33.9103208,
  130.8462437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107641,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asahimachi',
  '旭町',
  'あさひまち',
  '{"en":"Asahimachi"}'::jsonb,
  33.8976333,
  130.8244536,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiinokicho',
  '椎ノ木町',
  'しいのきちょう',
  '{"en":"Shiinokicho"}'::jsonb,
  33.8829493,
  130.8248909,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_motomiyamachi',
  '元宮町',
  'もとみやまち',
  '{"en":"Motomiyamachi"}'::jsonb,
  33.900147,
  130.8247582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107652,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_konpiracho',
  '金比羅町',
  'こんぴらちょう',
  '{"en":"Konpiracho"}'::jsonb,
  33.8779581,
  130.8396028,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107653,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakabaru_shinmachi',
  '中原新町',
  'なかばるしんまち',
  '{"en":"Nakabaru-shinmachi"}'::jsonb,
  33.9017403,
  130.8410529,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kannonjicho',
  '観音寺町',
  'かんのんじちょう',
  '{"en":"Kannonjicho"}'::jsonb,
  33.8838103,
  130.8309921,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatsunecho',
  '初音町',
  'はつねちょう',
  '{"en":"Hatsunecho"}'::jsonb,
  33.8938317,
  130.8208493,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shioimachi',
  '汐井町',
  'しおいまち',
  '{"en":"Shioimachi"}'::jsonb,
  33.8959366,
  130.8196907,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107667,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minamitorihatamachi',
  '南鳥旗町',
  'みなみとりはたまち',
  '{"en":"Minamitorihatamachi"}'::jsonb,
  33.8988673,
  130.8210159,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitatorihatamachi',
  '北鳥旗町',
  'きたとりはたまち',
  '{"en":"Kitatorihatamachi"}'::jsonb,
  33.9005439,
  130.8204577,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107674,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinkawamachi',
  '新川町',
  'しんかわまち',
  '{"en":"Shinkawamachi"}'::jsonb,
  33.8912271,
  130.8226459,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sanrokumachi',
  '三六町',
  'さんろくまち',
  '{"en":"Sanrokumachi"}'::jsonb,
  33.8994713,
  130.8350599,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tobihatacho',
  '飛幡町',
  'とびはたちょう',
  '{"en":"Tobihatacho"}'::jsonb,
  33.9044052,
  130.8269616,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107687,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_makiyama_kaigan',
  '牧山海岸',
  'まきやまかいがん',
  '{"en":"Makiyama-kaigan"}'::jsonb,
  33.8945559,
  130.8113069,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107692,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishi_sayagatanimachi',
  '西鞘ケ谷町',
  'にしさやがたにまち',
  '{"en":"Nishi-Sayagatanimachi"}'::jsonb,
  33.8747901,
  130.8300917,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakahonmachi',
  '中本町',
  'なかほんまち',
  '{"en":"Nakahonmachi"}'::jsonb,
  33.8963308,
  130.8233472,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107701,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_saiwaimachi',
  '幸町',
  'さいわいまち',
  '{"en":"Saiwaimachi"}'::jsonb,
  33.8987234,
  130.8257812,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_makiyama_shinmachi',
  '牧山新町',
  'まきやましんまち',
  '{"en":"Makiyama-shinmachi"}'::jsonb,
  33.8934673,
  130.8156549,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8485107708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_namiuchimachi',
  '波打町',
  'なみうちまち',
  '{"en":"Namiuchimachi"}'::jsonb,
  33.9126613,
  130.8014832,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otorii',
  '大鳥居',
  'おおとりい',
  '{"en":"Otorii"}'::jsonb,
  33.8997515,
  130.699851,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wadamachi',
  '和田町',
  'わだまち',
  '{"en":"Wadamachi"}'::jsonb,
  33.8938652,
  130.7924318,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishitenjinmachi',
  '西天神町',
  'にしてんじんまち',
  '{"en":"Nishitenjinmachi"}'::jsonb,
  33.8907852,
  130.7608441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fujinoki',
  '藤木',
  'ふじのき',
  '{"en":"Fujinoki"}'::jsonb,
  33.8992635,
  130.7710593,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oidomachi',
  '大井戸町',
  'おおいどまち',
  '{"en":"Oidomachi"}'::jsonb,
  33.9071935,
  130.8049921,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashihatamachi',
  '東畑町',
  'ひがしはたまち',
  '{"en":"Higashihatamachi"}'::jsonb,
  33.9086656,
  130.7966152,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koitomachi',
  '小糸町',
  'こいとまち',
  '{"en":"Koitomachi"}'::jsonb,
  33.9092802,
  130.7889065,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hibikino',
  'ひびきの',
  'ひびきの',
  '{"en":"Hibikino"}'::jsonb,
  33.8884603,
  130.711724,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakodamachi',
  '迫田町',
  'さこだまち',
  '{"en":"Sakodamachi"}'::jsonb,
  33.9141069,
  130.7869694,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_anse',
  '安瀬',
  'あんせ',
  '{"en":"Anse"}'::jsonb,
  33.9229901,
  130.8104562,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yurinomachi',
  '百合野町',
  'ゆりのまち',
  '{"en":"Yurinomachi"}'::jsonb,
  33.8978301,
  130.7838126,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_odake',
  '小竹',
  'おだけ',
  '{"en":"Odake"}'::jsonb,
  33.9168759,
  130.7529798,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishihatamachi',
  '西畑町',
  'にしはたまち',
  '{"en":"Nishihatamachi"}'::jsonb,
  33.9095285,
  130.7933928,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koshiki',
  '小敷',
  'こしき',
  '{"en":"Koshiki"}'::jsonb,
  33.8912094,
  130.702104,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otanimachi',
  '大谷町',
  'おおたにまち',
  '{"en":"Otanimachi"}'::jsonb,
  33.906055,
  130.7906944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tonda',
  '頓田',
  'とんだ',
  '{"en":"Tonda"}'::jsonb,
  33.9012678,
  130.7317686,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hibikino_kita',
  'ひびきの北',
  'ひびきのきた',
  '{"en":"Hibikino-kita"}'::jsonb,
  33.8915995,
  130.709864,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akasakimachi',
  '赤崎町',
  'あかさきまち',
  '{"en":"Akasakimachi"}'::jsonb,
  33.9192302,
  130.7872375,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_anya',
  '安屋',
  'あんや',
  '{"en":"Anya"}'::jsonb,
  33.929122,
  130.7149856,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanadamachi',
  '棚田町',
  'たなだまち',
  '{"en":"Tanadamachi"}'::jsonb,
  33.9131664,
  130.7902211,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460495,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otomaru',
  '乙丸',
  'おとまる',
  '{"en":"Otomaru"}'::jsonb,
  33.9080994,
  130.6916854,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dojimarumachi',
  '童子丸町',
  'どうじまるまち',
  '{"en":"Dojimarumachi"}'::jsonb,
  33.8923015,
  130.764183,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sutara',
  '修多羅',
  'すたら',
  '{"en":"Sutara"}'::jsonb,
  33.9012592,
  130.7957663,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460498,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tonda_quarter',
  '頓田',
  'とんだ',
  '{"en":"Tonda"}'::jsonb,
  33.9237296,
  130.7385064,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatadanimachi',
  '畑谷町',
  'はただにまち',
  '{"en":"Hatadanimachi"}'::jsonb,
  33.9029657,
  130.7931444,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460501,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiharamachi',
  '上原町',
  'かみはらまち',
  '{"en":"Kamiharamachi"}'::jsonb,
  33.9133949,
  130.7928842,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kukinoumi_chuo',
  'くきのうみ中央',
  'くきのうみちゅうおう',
  '{"en":"Kukinoumi-chuo"}'::jsonb,
  33.8913165,
  130.79342,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoharamachi',
  '下原町',
  'しもはらまち',
  '{"en":"Shimoharamachi"}'::jsonb,
  33.9167655,
  130.790667,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akashimamachi',
  '赤島町',
  'あかしままち',
  '{"en":"Akashimamachi"}'::jsonb,
  33.895467,
  130.7803013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyamaemachi',
  '宮前町',
  'みやまえまち',
  '{"en":"Miyamaemachi"}'::jsonb,
  33.9164971,
  130.7876262,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460823,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koishi',
  '小石',
  'こいし',
  '{"en":"Koishi"}'::jsonb,
  33.9102534,
  130.7750755,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yanagaskimachi',
  '柳崎町',
  'やながさきまち',
  '{"en":"Yanagaskimachi"}'::jsonb,
  33.9274021,
  130.7470116,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakagawamachi',
  '中川町',
  'なかがわまち',
  '{"en":"Nakagawamachi"}'::jsonb,
  33.9058105,
  130.807057,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takasu',
  '高須',
  'たかす',
  '{"en":"Takasu"}'::jsonb,
  33.8952387,
  130.6851603,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishikoishimachi',
  '西小石町',
  'にしこいしまち',
  '{"en":"Nishikoishimachi"}'::jsonb,
  33.9194665,
  130.791443,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatakeda',
  '畠田',
  'はたけだ',
  '{"en":"Hatakeda"}'::jsonb,
  33.9024665,
  130.752076,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futajima',
  '二島',
  'ふたじま',
  '{"en":"Futajima"}'::jsonb,
  33.8983484,
  130.7502474,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_haramachi',
  '原町',
  'はらまち',
  '{"en":"Haramachi"}'::jsonb,
  33.915837,
  130.7948243,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitaminatomachi',
  '北湊町',
  'きたみなとまち',
  '{"en":"Kitaminatomachi"}'::jsonb,
  33.9170835,
  130.805734,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kukinohama',
  '久岐の浜',
  'くきのはま',
  '{"en":"Kukinohama"}'::jsonb,
  33.8977339,
  130.8048409,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koyomachi',
  '向洋町',
  'こうようまち',
  '{"en":"Koyomachi"}'::jsonb,
  33.9261465,
  130.785301,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shin_otanimachi',
  '新大谷町',
  'しんおおたにまち',
  '{"en":"Shin-otanimachi"}'::jsonb,
  33.9048235,
  130.794491,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akaiwamachi',
  '赤岩町',
  'あかいわまち',
  '{"en":"Akaiwamachi"}'::jsonb,
  33.8885535,
  130.765653,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_eiseigawamachi',
  '栄盛川町',
  'えいせいがわまち',
  '{"en":"Eiseigawamachi"}'::jsonb,
  33.910852,
  130.8004627,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_amasumi',
  '蜑住',
  'あますみ',
  '{"en":"Amasumi"}'::jsonb,
  33.9040046,
  130.7087009,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460855,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamatemachi',
  '山手町',
  'やまてまち',
  '{"en":"Yamatemachi"}'::jsonb,
  33.9040915,
  130.8019597,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460856,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakahatamachi',
  '中畑町',
  'なかはたまち',
  '{"en":"Nakahatamachi"}'::jsonb,
  33.9105833,
  130.7851856,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460857,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takenami',
  '竹並',
  'たけなみ',
  '{"en":"Takenami"}'::jsonb,
  33.9109003,
  130.7218773,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460858,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yojakumachi',
  '用勺町',
  'ようじゃくまち',
  '{"en":"Yojakumachi"}'::jsonb,
  33.8939689,
  130.7695297,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460859,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishizonomachi',
  '西園町',
  'にしぞのまち',
  '{"en":"Nishizonomachi"}'::jsonb,
  33.9094407,
  130.8008969,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460860,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_haraigawa',
  '払川',
  'はらいがわ',
  '{"en":"Haraigawa"}'::jsonb,
  33.9001754,
  130.7199105,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460861,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oikemachi',
  '大池町',
  'おおいけまち',
  '{"en":"Oikemachi"}'::jsonb,
  33.895504,
  130.7935856,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460863,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashikoishimachi',
  '東小石町',
  'ひがしこいしまち',
  '{"en":"Higashikoishimachi"}'::jsonb,
  33.9188385,
  130.795886,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460866,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kyonanmachi',
  '響南町',
  'きょうなんまち',
  '{"en":"Kyonanmachi"}'::jsonb,
  33.9197335,
  130.79912,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460867,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koishihonmuramachi',
  '小石本村町',
  'こいしほんむらまち',
  '{"en":"Koishihonmuramachi"}'::jsonb,
  33.9172535,
  130.7824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakuramachi',
  '桜町',
  'さくらまち',
  '{"en":"Sakuramachi"}'::jsonb,
  33.9099437,
  130.8068527,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arige',
  '有毛',
  'ありげ',
  '{"en":"Arige"}'::jsonb,
  33.9216634,
  130.6943327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamanodomachi',
  '山ノ堂町',
  'やまのどうまち',
  '{"en":"Yamanodomachi"}'::jsonb,
  33.906204,
  130.7975232,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487460887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kinkeicho',
  '金鶏町',
  'きんけいちょう',
  '{"en":"Kinkeicho"}'::jsonb,
  33.8711925,
  130.850099,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamadamachi',
  '山田町',
  'やまだまち',
  '{"en":"Yamadamachi"}'::jsonb,
  33.8505044,
  130.850674,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashijonomachi',
  '東城野町',
  'ひがしじょうのまち',
  '{"en":"Higashijonomachi"}'::jsonb,
  33.8602213,
  130.8899939,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tatebayashimachi',
  '竪林町',
  'たてばやしまち',
  '{"en":"Tatebayashimachi"}'::jsonb,
  33.8689815,
  130.861962,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tamachi',
  '田町',
  'たまち',
  '{"en":"Tamachi"}'::jsonb,
  33.8818449,
  130.8683676,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501929,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_bentenmachi',
  '弁天町',
  'べんてんまち',
  '{"en":"Bentenmachi"}'::jsonb,
  33.8707086,
  130.8623148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinkocho',
  '神幸町',
  'しんこうちょう',
  '{"en":"Shinkocho"}'::jsonb,
  33.8816113,
  130.9032462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinwamachi',
  '親和町',
  'しんわまち',
  '{"en":"Shinwamachi"}'::jsonb,
  33.9022525,
  130.851112,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_itabitsumachi',
  '板櫃町',
  'いたびつまち',
  '{"en":"Itabitsumachi"}'::jsonb,
  33.8841492,
  130.8590176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sugamachi',
  '須賀町',
  'すがまち',
  '{"en":"Sugamachi"}'::jsonb,
  33.8815928,
  130.9087162,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takamidai_quarter',
  '高見台',
  'たかみだい',
  '{"en":"Takamidai"}'::jsonb,
  33.8946722,
  130.855575,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ainoshima',
  '藍島',
  'あいのしま',
  '{"en":"Ainoshima"}'::jsonb,
  33.9915054,
  130.8189959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501963,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tomino',
  '富野',
  'とみの',
  '{"en":"Tomino"}'::jsonb,
  33.8767985,
  130.913445,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokiwamachi',
  '常盤町',
  'ときわまち',
  '{"en":"Tokiwamachi"}'::jsonb,
  33.8800528,
  130.9066316,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishiminatomachi',
  '西港町',
  'にしみなとまち',
  '{"en":"Nishiminatomachi"}'::jsonb,
  33.9041544,
  130.8704705,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501972,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akasaka_kaigan',
  '赤坂海岸',
  'あかさかかいがん',
  '{"en":"Akasaka-kaigan"}'::jsonb,
  33.8939221,
  130.9108511,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_juzancho',
  '寿山町',
  'じゅざんちょう',
  '{"en":"Juzancho"}'::jsonb,
  33.8703318,
  130.9030246,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakafujicho',
  '若富士町',
  'わかふじちょう',
  '{"en":"Wakafujicho"}'::jsonb,
  33.8587445,
  130.886292,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ashihara',
  '足原',
  'あしはら',
  '{"en":"Ashihara"}'::jsonb,
  33.8634855,
  130.914502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487501999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tominodai',
  '富野台',
  'とみのだい',
  '{"en":"Tominodai"}'::jsonb,
  33.8862267,
  130.9136822,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487502002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakaiguchi',
  '中井口',
  'なかいぐち',
  '{"en":"Nakaiguchi"}'::jsonb,
  33.8970439,
  130.8532357,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487502008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asahigaoka',
  '朝日ケ丘',
  'あさひがおか',
  '{"en":"Asahigaoka"}'::jsonb,
  33.8890666,
  130.8530943,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jonai_quarter',
  '城内',
  'じょうない',
  '{"en":"Jonai"}'::jsonb,
  33.8817391,
  130.8709308,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503621,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_myokencho',
  '妙見町',
  'みょうけんちょう',
  '{"en":"Myokencho"}'::jsonb,
  33.8654478,
  130.9049699,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503632,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umashima',
  '馬島',
  'うましま',
  '{"en":"Umashima"}'::jsonb,
  33.9677872,
  130.855853,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otemachi',
  '大手町',
  'おおてまち',
  '{"en":"Otemachi"}'::jsonb,
  33.8773906,
  130.871935,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakaihama',
  '中井浜',
  'なかいはま',
  '{"en":"Nakaihama"}'::jsonb,
  33.8996574,
  130.8503785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503644,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sarayamamachi',
  '皿山町',
  'さらやままち',
  '{"en":"Sarayamamachi"}'::jsonb,
  33.8681352,
  130.8569682,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503645,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jonodanchi',
  '城野団地',
  'じょうのだんち',
  '{"en":"Jonodanchi"}'::jsonb,
  33.8623639,
  130.8913421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503656,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiramatsumachi',
  '平松町',
  'ひらまつまち',
  '{"en":"Hiramatsumachi"}'::jsonb,
  33.8915159,
  130.8648333,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imojimachi',
  '鋳物師町',
  'いもじまち',
  '{"en":"Imojimachi"}'::jsonb,
  33.8891809,
  130.8690729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503668,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kurozumicho',
  '黒住町',
  'くろずみちょう',
  '{"en":"Kurozumicho"}'::jsonb,
  33.8617472,
  130.8938595,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503671,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takaminecho',
  '高峰町',
  'たかみねちょう',
  '{"en":"Takaminecho"}'::jsonb,
  33.8880835,
  130.85498,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_konomimachi',
  '許斐町',
  'このみまち',
  '{"en":"Konomimachi"}'::jsonb,
  33.8945707,
  130.8787785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sanmoncho',
  '山門町',
  'さんもんちょう',
  '{"en":"Sanmoncho"}'::jsonb,
  33.8740667,
  130.9029001,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503682,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shirahagimachi',
  '白萩町',
  'しらはぎまち',
  '{"en":"Shirahagimachi"}'::jsonb,
  33.8838275,
  130.8549892,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487503693,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuzuhara',
  '葛原',
  'くずはら',
  '{"en":"Kuzuhara"}'::jsonb,
  33.857332,
  130.918584,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takatsuo',
  '高津尾',
  'たかつお',
  '{"en":"Takatsuo"}'::jsonb,
  33.8035817,
  130.8597706,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokoshiro',
  '横代',
  'よこしろ',
  '{"en":"Yokoshiro"}'::jsonb,
  33.8200544,
  130.8986863,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komori',
  '小森',
  'こもり',
  '{"en":"Komori"}'::jsonb,
  33.759666,
  130.8680686,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tashiro',
  '田代',
  'たしろ',
  '{"en":"Tashiro"}'::jsonb,
  33.8095192,
  130.8054566,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshida',
  '吉田',
  'よしだ',
  '{"en":"Yoshida"}'::jsonb,
  33.8425549,
  130.9740015,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487507602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_osayuki',
  '長行',
  'おさゆき',
  '{"en":"Osayuki"}'::jsonb,
  33.821806,
  130.8441616,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hachimancho',
  '八幡町',
  'はちまんちょう',
  '{"en":"Hachimancho"}'::jsonb,
  33.8615117,
  130.8775133,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sonekitamachi',
  '曽根北町',
  'そねきたまち',
  '{"en":"Sonekitamachi"}'::jsonb,
  33.8359111,
  130.9456593,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsujimitsu',
  '辻三',
  'つじみつ',
  '{"en":"Tsujimitsu"}'::jsonb,
  33.814664,
  130.8240868,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_haruyoshi',
  '春吉',
  'はるよし',
  '{"en":"Haruyoshi"}'::jsonb,
  33.7909767,
  130.847924,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakanuki_hinmachi',
  '中貫本町',
  'なかぬきほんまち',
  '{"en":"Nakanuki-hinmachi"}'::jsonb,
  33.8103181,
  130.9307204,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ishida',
  '石田',
  'いしだ',
  '{"en":"Ishida"}'::jsonb,
  33.8188675,
  130.8842396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kagumeyoshi',
  '頂吉',
  'かぐめよし',
  '{"en":"Kagumeyoshi"}'::jsonb,
  33.7392307,
  130.8445995,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dobaru',
  '道原',
  'どうばる',
  '{"en":"Dobaru"}'::jsonb,
  33.7793737,
  130.8385307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_horikoshi',
  '堀越',
  'ほりこし',
  '{"en":"Horikoshi"}'::jsonb,
  33.8136552,
  130.8870533,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokoshiro_hayama',
  '横代葉山',
  'よこしろはやま',
  '{"en":"Yokoshiro-hayama"}'::jsonb,
  33.8235081,
  130.8943315,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuko_kitamachi',
  '空港北町',
  'くうこうきたまち',
  '{"en":"Kuko-kitamachi"}'::jsonb,
  33.8464003,
  131.034146,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541498,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shii',
  '志井',
  'しい',
  '{"en":"Shii"}'::jsonb,
  33.8098924,
  130.8745965,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541499,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashimizumachi',
  '東水町',
  'ひがしみずまち',
  '{"en":"Higashimizumachi"}'::jsonb,
  33.8511969,
  130.8948423,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minamigata',
  '南方',
  'みなみがた',
  '{"en":"Minamigata"}'::jsonb,
  33.8340681,
  130.8557664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yobuno',
  '呼野',
  'よぶの',
  '{"en":"Yobuno"}'::jsonb,
  33.7503958,
  130.8577134,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minami_wakazonomachi',
  '南若園町',
  'みなみわかぞのまち',
  '{"en":"Minami-Wakazonomachi"}'::jsonb,
  33.8420544,
  130.8870949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541510,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gamo',
  '蒲生',
  'がもう',
  '{"en":"Gamo"}'::jsonb,
  33.8357771,
  130.8542878,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shindoji',
  '新道寺',
  'しんどうじ',
  '{"en":"Shindoji"}'::jsonb,
  33.7550396,
  130.884117,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mohara',
  '母原',
  'もはら',
  '{"en":"Mohara"}'::jsonb,
  33.7922855,
  130.8751263,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsuda_minamimachi',
  '津田南町',
  'つだみなみまち',
  '{"en":"Tsuda-minamimachi"}'::jsonb,
  33.8236476,
  130.9175513,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamisone_shinmachi',
  '上曽根新町',
  'かみそねしんまち',
  '{"en":"Kamisone-shinmachi"}'::jsonb,
  33.8182671,
  130.9487052,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_abeyama',
  '安部山',
  'あべやま',
  '{"en":"Abeyama"}'::jsonb,
  33.85048,
  130.9070778,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimosone_shinmachi',
  '下曽根新町',
  'しもそねしんまち',
  '{"en":"Shimosone-shinmachi"}'::jsonb,
  33.832189,
  130.9325763,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ishiharamachi',
  '石原町',
  'いしはらまち',
  '{"en":"Ishiharamachi"}'::jsonb,
  33.7887357,
  130.863548,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sone',
  '曽根',
  'そね',
  '{"en":"Sone"}'::jsonb,
  33.8346041,
  130.9579504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokuyoshi',
  '徳吉',
  'とくよし',
  '{"en":"Tokuyoshi"}'::jsonb,
  33.8093401,
  130.8636714,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ishidamachi',
  '石田町',
  'いしだまち',
  '{"en":"Ishidamachi"}'::jsonb,
  33.8391535,
  130.886994,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ichimaru',
  '市丸',
  'いちまる',
  '{"en":"Ichimaru"}'::jsonb,
  33.7671448,
  130.8707036,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinsone',
  '新曽根',
  'しんそね',
  '{"en":"Shinsone"}'::jsonb,
  33.8389273,
  130.9537474,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_soneshinden',
  '曽根新田',
  'そねしんでん',
  '{"en":"Soneshinden"}'::jsonb,
  33.8154151,
  130.9618224,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagano',
  '長野',
  'ながの',
  '{"en":"Nagano"}'::jsonb,
  33.8188731,
  130.9096808,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kakuremino',
  '隠蓑',
  'かくれみの',
  '{"en":"Kakuremino"}'::jsonb,
  33.8229034,
  130.8869586,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541618,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yaesumachi',
  '八重洲町',
  'やえすまち',
  '{"en":"Yaesumachi"}'::jsonb,
  33.8408741,
  130.8914254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimizumachi',
  '西水町',
  'にしみずまち',
  '{"en":"Nishimizumachi"}'::jsonb,
  33.8524191,
  130.8929434,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiikoen',
  '志井公園',
  'しいこうえん',
  '{"en":"Shiikoen"}'::jsonb,
  33.8188101,
  130.8810174,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541628,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ideura',
  '井手浦',
  'いでうら',
  '{"en":"Ideura"}'::jsonb,
  33.7792257,
  130.8855617,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokuriki_danchi',
  '徳力団地',
  'とくりきだんち',
  '{"en":"Tokuriki-danchi"}'::jsonb,
  33.8313961,
  130.8651034,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541633,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kinoshita',
  '木下',
  'きのした',
  '{"en":"Kinoshita"}'::jsonb,
  33.7770228,
  130.8695408,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_harugaoka',
  '春ケ丘',
  'はるがおか',
  '{"en":"Harugaoka"}'::jsonb,
  33.8499745,
  130.8842902,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nuki',
  '貫',
  'ぬき',
  '{"en":"Nuki"}'::jsonb,
  33.8042341,
  130.9228864,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541642,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamamoto',
  '山本',
  'やまもと',
  '{"en":"Yamamoto"}'::jsonb,
  33.8008738,
  130.8499897,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541647,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagano_higashimachi',
  '長野東町',
  'ながのひがしまち',
  '{"en":"Nagano-higashimachi"}'::jsonb,
  33.8222133,
  130.9158275,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541649,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiitakahadai',
  '志井鷹羽台',
  'しいたかはだい',
  '{"en":"Shiitakahadai"}'::jsonb,
  33.8062641,
  130.8725404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541662,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ouma',
  '合馬',
  'おうま',
  '{"en":"Ouma"}'::jsonb,
  33.8095422,
  130.8295664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541664,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusami',
  '朽網',
  'くさみ',
  '{"en":"Kusami"}'::jsonb,
  33.7939085,
  130.9464389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541670,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_numa',
  '沼',
  'ぬま',
  '{"en":"Numa"}'::jsonb,
  33.8555421,
  130.9313124,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakasone_shinmachi',
  '中曽根新町',
  'なかそねしんまち',
  '{"en":"Nakasone-shinmachi"}'::jsonb,
  33.8242317,
  130.9459179,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541678,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yugawa',
  '湯川',
  'ゆがわ',
  '{"en":"Yugawa"}'::jsonb,
  33.8543931,
  130.9087934,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487541681,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenjinmachi',
  '天神町',
  'てんじんまち',
  '{"en":"Tenjinmachi"}'::jsonb,
  33.8616783,
  130.8037736,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_keishomachi',
  '景勝町',
  'けいしょうまち',
  '{"en":"Keishomachi"}'::jsonb,
  33.8534343,
  130.8116109,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishi_maruyamamachi',
  '西丸山町',
  'にしまるやままち',
  '{"en":"Nishi-Maruyamamachi"}'::jsonb,
  33.8610295,
  130.809765,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542182,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shirakawamachi',
  '白川町',
  'しらかわまち',
  '{"en":"Shirakawamachi"}'::jsonb,
  33.873706,
  130.8197379,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542184,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hanaomachi',
  '花尾町',
  'はなおまち',
  '{"en":"Hanaomachi"}'::jsonb,
  33.8537525,
  130.788689,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542185,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ishitsubomachi',
  '石坪町',
  'いしつぼまち',
  '{"en":"Ishitsubomachi"}'::jsonb,
  33.8651042,
  130.8405649,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542189,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiyamamachi',
  '神山町',
  'かみやままち',
  '{"en":"Kamiyamamachi"}'::jsonb,
  33.8571496,
  130.803183,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takeshitamachi',
  '竹下町',
  'たけしたまち',
  '{"en":"Takeshitamachi"}'::jsonb,
  33.8639696,
  130.8378765,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542197,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_edamitsu_honmachi',
  '枝光本町',
  'えだみつほんまち',
  '{"en":"Edamitsu-honmachi"}'::jsonb,
  33.8724158,
  130.8157556,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542204,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sanji_matsuomachi',
  '山路松尾町',
  'さんじまつおまち',
  '{"en":"Sanji-matsuomachi"}'::jsonb,
  33.8584124,
  130.8439641,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishidairamachi',
  '西台良町',
  'にしだいらまち',
  '{"en":"Nishidairamachi"}'::jsonb,
  33.8568265,
  130.789279,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_omiyamachi',
  '大宮町',
  'おおみやまち',
  '{"en":"Omiyamachi"}'::jsonb,
  33.8786731,
  130.8201741,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542210,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hagoromomachi',
  '羽衣町',
  'はごろもまち',
  '{"en":"Hagoromomachi"}'::jsonb,
  33.85862,
  130.8230591,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_suehiromachi',
  '末広町',
  'すえひろまち',
  '{"en":"Suehiromachi"}'::jsonb,
  33.8626366,
  130.8165656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487542215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fujimimachi',
  '藤見町',
  'ふじみまち',
  '{"en":"Fujimimachi"}'::jsonb,
  33.8707635,
  130.823877,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_inokuramachi',
  '猪倉町',
  'いのくらまち',
  '{"en":"Inokuramachi"}'::jsonb,
  33.8477297,
  130.8238065,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashitetsumachi',
  '東鉄町',
  'ひがしてつまち',
  '{"en":"Higashitetsumachi"}'::jsonb,
  33.8642297,
  130.8345385,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gionbaramachi',
  '祇園原町',
  'ぎおんばらまち',
  '{"en":"Gionbaramachi"}'::jsonb,
  33.8575283,
  130.7876127,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ogura',
  '尾倉',
  'おぐら',
  '{"en":"Ogura"}'::jsonb,
  33.8451455,
  130.80368,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_maeda',
  '前田',
  'まえだ',
  '{"en":"Maeda"}'::jsonb,
  33.873974,
  130.7914962,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yutakamachi',
  '豊町',
  'ゆたかまち',
  '{"en":"Yutakamachi"}'::jsonb,
  33.8478337,
  130.813578,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kawabuchimachi',
  '川淵町',
  'かわぶちまち',
  '{"en":"Kawabuchimachi"}'::jsonb,
  33.8683044,
  130.8390283,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tashiromachi',
  '田代町',
  'たしろまち',
  '{"en":"Tashiromachi"}'::jsonb,
  33.8072206,
  130.7966701,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsuomachi',
  '松尾町',
  'まつおまち',
  '{"en":"Matsuomachi"}'::jsonb,
  33.8622072,
  130.8429148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_edamitsu',
  '枝光',
  'えだみつ',
  '{"en":"Edamitsu"}'::jsonb,
  33.8788348,
  130.8125176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555155,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kogumano',
  '小熊野',
  'こぐまの',
  '{"en":"Kogumano"}'::jsonb,
  33.8434163,
  130.8339106,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555159,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hachiojimachi',
  '八王寺町',
  'はちおうじまち',
  '{"en":"Hachiojimachi"}'::jsonb,
  33.872086,
  130.8413884,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashi_maruyamamachi',
  '東丸山町',
  'ひがしまるやままち',
  '{"en":"Higashi-Maruyamamachi"}'::jsonb,
  33.8609797,
  130.8132898,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakamatsu',
  '若松',
  'わかまつ',
  '{"en":"Wakamatsu"}'::jsonb,
  33.8885725,
  130.801709,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555184,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohiramachi',
  '大平町',
  'おおひらまち',
  '{"en":"Ohiramachi"}'::jsonb,
  33.8527606,
  130.8292994,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555190,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chhayamachi',
  '茶屋町',
  'ちゃやまち',
  '{"en":"Chhayamachi"}'::jsonb,
  33.8669119,
  130.8431935,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashidairamachi',
  '東台良町',
  'ひがしだいらまち',
  '{"en":"Higashidairamachi"}'::jsonb,
  33.8583949,
  130.792712,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyatamachi',
  '宮田町',
  'みやたまち',
  '{"en":"Miyatamachi"}'::jsonb,
  33.8774086,
  130.816542,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okura',
  '大蔵',
  'おおくら',
  '{"en":"Okura"}'::jsonb,
  33.8380045,
  130.816635,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487555206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_anoo',
  '大字穴生',
  'おおあざあのお',
  '{"en":"Oaza-Anoo"}'::jsonb,
  33.8509751,
  130.738069,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487631731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_kumade',
  '大字熊手',
  'おおあざくまで',
  '{"en":"Oaza-Kumade"}'::jsonb,
  33.8713137,
  130.7561656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487631738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_ichinose',
  '大字市瀬',
  'おおあざいちのせ',
  '{"en":"Oaza-Ichinose"}'::jsonb,
  33.8376017,
  130.7772083,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487631773,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_komine',
  '大字小嶺',
  'おおあざこみね',
  '{"en":"Oaza-Komine"}'::jsonb,
  33.8123644,
  130.7590777,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487631779,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_kongo',
  '大字金剛',
  'おおあざこんごう',
  '{"en":"Oaza-Kongo"}'::jsonb,
  33.7863981,
  130.7514799,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487635920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_hata',
  '大字畑',
  'おおあざはた',
  '{"en":"Oaza-Hata"}'::jsonb,
  33.8018515,
  130.7747753,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487635927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nobu',
  '大字野面',
  'おおあざのぶ',
  '{"en":"Nobu"}'::jsonb,
  33.7762669,
  130.7371437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487635936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_sasada',
  '大字笹田',
  'おおあざささだ',
  '{"en":"Oaza-Sasada"}'::jsonb,
  33.7781646,
  130.7533044,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487635960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_babayama',
  '大字馬場山',
  'おおあざばばやま',
  '{"en":"Oaza-Babayama"}'::jsonb,
  33.7954419,
  130.756591,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487635967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_einomaru',
  '大字永犬丸',
  'おおあざえいのまる',
  '{"en":"Oaza-Einomaru"}'::jsonb,
  33.8379253,
  130.7221003,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_fujita',
  '大字藤田',
  'おおあざふじた',
  '{"en":"Oaza-Fujita"}'::jsonb,
  33.8744568,
  130.765807,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_katsuki',
  '大字香月',
  'おおあざかつき',
  '{"en":"Oaza-Katsuki"}'::jsonb,
  33.7984505,
  130.7278023,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636040,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_honjo',
  '大字本城',
  'おおあざほんじょう',
  '{"en":"Oaza-Honjo"}'::jsonb,
  33.8888967,
  130.7253737,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_kamikojaku',
  '大字上上津役',
  'おおあざかみこうじゃく',
  '{"en":"Oaza-Kamikojaku"}'::jsonb,
  33.826166,
  130.7721636,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_kusubashi',
  '大字楠橋',
  'おおあざくすばし',
  '{"en":"Oaza-Kusubashi"}'::jsonb,
  33.7964466,
  130.7129099,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_narumizu',
  '大字鳴水',
  'おおあざなるみず',
  '{"en":"Oaza-Narumizu"}'::jsonb,
  33.849701,
  130.781274,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_nobu',
  '大字野面',
  'おおあざのぶ',
  '{"en":"Oaza-Nobu"}'::jsonb,
  33.7774057,
  130.7438379,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_asakawa',
  '大字浅川',
  'おおあざあさかわ',
  '{"en":"Oaza-Asakawa"}'::jsonb,
  33.8672115,
  130.7004818,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636198,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_norimatsu',
  '大字則松',
  'おおあざのりまつ',
  '{"en":"Oaza-Norimatsu"}'::jsonb,
  33.8527247,
  130.727642,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8487636205,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_金生',
  '金生',
  '金生',
  NULL,
  33.710631,
  130.627862,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490510,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_原田',
  '原田',
  '原田',
  NULL,
  33.72405,
  130.638787,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490511,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下',
  '下',
  '下',
  NULL,
  33.693518,
  130.618741,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山口',
  '山口',
  '山口',
  NULL,
  33.7408,
  130.57424,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_磯光',
  '磯光',
  '磯光',
  NULL,
  33.70774,
  130.678811,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上大隈',
  '上大隈',
  '上大隈',
  NULL,
  33.714719,
  130.671959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_縁山畑',
  '縁山畑',
  '縁山畑',
  NULL,
  33.664039,
  130.5755,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681490516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町山崎',
  '立花町山崎',
  '立花町山崎',
  NULL,
  33.194072,
  130.581386,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_柳島',
  '柳島',
  '柳島',
  NULL,
  33.21381,
  130.600106,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_祈祷院',
  '祈祷院',
  '祈祷院',
  NULL,
  33.213727,
  130.587102,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_酒井田',
  '酒井田',
  '酒井田',
  NULL,
  33.195653,
  130.556821,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_前古賀',
  '前古賀',
  '前古賀',
  NULL,
  33.203442,
  130.532346,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町白木',
  '立花町白木',
  '立花町白木',
  NULL,
  33.140882,
  130.574795,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町田本',
  '黒木町田本',
  '黒木町田本',
  NULL,
  33.210355,
  130.640501,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_緒玉',
  '緒玉',
  '緒玉',
  NULL,
  33.199266,
  130.549507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町桑原',
  '黒木町桑原',
  '黒木町桑原',
  NULL,
  33.209617,
  130.665198,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_忠見',
  '忠見',
  '忠見',
  NULL,
  33.223485,
  130.594887,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_豊福',
  '豊福',
  '豊福',
  NULL,
  33.23227,
  130.577235,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢部村矢部',
  '矢部村矢部',
  '矢部村矢部',
  NULL,
  33.139261,
  130.803791,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_今福',
  '今福',
  '今福',
  NULL,
  33.228701,
  130.535466,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町鹿子生',
  '黒木町鹿子生',
  '黒木町鹿子生',
  NULL,
  33.176888,
  130.6433,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上陽町下横山',
  '上陽町下横山',
  '上陽町下横山',
  NULL,
  33.267707,
  130.639318,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本',
  '本村',
  '本村',
  NULL,
  33.216575,
  130.55516,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町原島',
  '立花町原島',
  '立花町原島',
  NULL,
  33.206581,
  130.590496,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒土',
  '黒土',
  '黒土',
  NULL,
  33.22212,
  130.58722,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_北田形',
  '北田形',
  '北田形',
  NULL,
  33.212584,
  130.614358,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町下辺春',
  '立花町下辺春',
  '立花町下辺春',
  NULL,
  33.169908,
  130.616153,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本_quarter',
  '本',
  '本',
  NULL,
  33.232937,
  130.5938053,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大島',
  '大島',
  '大島',
  NULL,
  33.219825,
  130.562655,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町黒木',
  '黒木町黒木',
  '黒木町黒木',
  NULL,
  33.212344,
  130.671383,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宅間田',
  '宅間田',
  '宅間田',
  NULL,
  33.228062,
  130.567675,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津江',
  '津江',
  '津江',
  NULL,
  33.211894,
  130.578546,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢部村北矢部',
  '矢部村北矢部',
  '矢部村北矢部',
  NULL,
  33.1626,
  130.83596,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_井延',
  '井延',
  '井延',
  NULL,
  33.219271,
  130.587508,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上陽町久木原',
  '上陽町久木原',
  '上陽町久木原',
  NULL,
  33.257973,
  130.689425,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町大淵',
  '黒木町大淵',
  '黒木町大淵',
  NULL,
  33.161857,
  130.734923,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町遠久谷',
  '立花町遠久谷',
  '立花町遠久谷',
  NULL,
  33.189273,
  130.624822,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本_quarter_8681515616',
  '本町',
  '本町',
  NULL,
  33.209529,
  130.558273,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681515616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字奈良',
  '大字奈良',
  '大字奈良',
  NULL,
  33.625347,
  130.808725,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桜',
  '桜町',
  '桜町',
  NULL,
  33.636351,
  130.795719,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_番田',
  '番田町',
  '番田町',
  NULL,
  33.6453,
  130.814593,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字伊田',
  '大字伊田',
  '大字伊田',
  NULL,
  33.642788,
  130.831945,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字弓削田',
  '大字弓削田',
  '大字弓削田',
  NULL,
  33.628829,
  130.772336,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_伊田',
  '伊田町',
  '伊田町',
  NULL,
  33.643903,
  130.814115,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新',
  '新町',
  '新町',
  NULL,
  33.643898,
  130.807354,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平松',
  '平松町',
  '平松町',
  NULL,
  33.633325,
  130.801159,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字猪国',
  '大字猪国',
  '大字猪国',
  NULL,
  33.586402,
  130.779824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上本',
  '上本町',
  '上本町',
  NULL,
  33.625376,
  130.799739,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中央',
  '中央町',
  '中央町',
  NULL,
  33.640129,
  130.806447,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_丸山',
  '丸山町',
  '丸山町',
  NULL,
  33.625866,
  130.802781,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字夏吉',
  '大字夏吉',
  '大字夏吉',
  NULL,
  33.67416,
  130.816018,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_栄',
  '栄町',
  '栄町',
  NULL,
  33.638584,
  130.808579,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西本',
  '西本町',
  '西本町',
  NULL,
  33.625207,
  130.795818,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字伊加利',
  '大字伊加利',
  '大字伊加利',
  NULL,
  33.62166,
  130.831691,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字糒',
  '大字糒',
  '大字糒',
  NULL,
  33.661576,
  130.800618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白鳥',
  '白鳥町',
  '白鳥町',
  NULL,
  33.63954,
  130.822219,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_日の出',
  '日の出町',
  '日の出町',
  NULL,
  33.643257,
  130.812238,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_魚',
  '魚町',
  '魚町',
  NULL,
  33.643514,
  130.818389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字位登',
  '大字位登',
  '大字位登',
  NULL,
  33.611631,
  130.78641,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_春日',
  '春日町',
  '春日町',
  NULL,
  33.629802,
  130.795911,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大黒',
  '大黒町',
  '大黒町',
  NULL,
  33.627926,
  130.79584,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本_quarter_8681519285',
  '本町',
  '本町',
  NULL,
  33.630135,
  130.799736,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字川宮',
  '大字川宮',
  '大字川宮',
  NULL,
  33.642695,
  130.793785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_寿',
  '寿町',
  '寿町',
  NULL,
  33.64781,
  130.811807,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千代_quarter',
  '千代町',
  '千代町',
  NULL,
  33.637169,
  130.803715,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮尾',
  '宮尾町',
  '宮尾町',
  NULL,
  33.632173,
  130.79589,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681519289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町桜井',
  '吉井町桜井',
  '吉井町桜井',
  NULL,
  33.345534,
  130.786142,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町朝田',
  '浮羽町朝田',
  '浮羽町朝田',
  NULL,
  33.330546,
  130.792127,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町新川',
  '浮羽町新川',
  '浮羽町新川',
  NULL,
  33.282363,
  130.802072,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町新治',
  '吉井町新治',
  '吉井町新治',
  NULL,
  33.351409,
  130.749945,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町生葉',
  '吉井町生葉',
  '吉井町生葉',
  NULL,
  33.347664,
  130.73797,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523710,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町橘田',
  '吉井町橘田',
  '吉井町橘田',
  NULL,
  33.357629,
  130.760547,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町浮羽',
  '浮羽町浮羽',
  '浮羽町浮羽',
  NULL,
  33.334317,
  130.778502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町東隈上',
  '浮羽町東隈上',
  '浮羽町東隈上',
  NULL,
  33.33804,
  130.801552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町福益',
  '吉井町福益',
  '吉井町福益',
  NULL,
  33.322627,
  130.749963,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町徳丸',
  '吉井町徳丸',
  '吉井町徳丸',
  NULL,
  33.341479,
  130.781491,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町高見',
  '浮羽町高見',
  '浮羽町高見',
  NULL,
  33.347719,
  130.806773,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681523716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上白水',
  '大字上白水',
  '大字上白水',
  NULL,
  33.50351,
  130.449437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681524942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_丸山_quarter',
  '丸山町',
  '丸山町',
  NULL,
  33.733421,
  130.725186,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字知古',
  '大字知古',
  '大字知古',
  NULL,
  33.759305,
  130.72788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新知',
  '新知町',
  '新知町',
  NULL,
  33.757675,
  130.720944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字植木',
  '大字植木',
  '大字植木',
  NULL,
  33.779172,
  130.707618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中泉',
  '大字中泉',
  '大字中泉',
  NULL,
  33.712862,
  130.737788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_殿',
  '殿町',
  '殿町',
  NULL,
  33.74417,
  130.729409,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字感田',
  '大字感田',
  '大字感田',
  NULL,
  33.764472,
  130.737746,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上境',
  '大字上境',
  '大字上境',
  NULL,
  33.730633,
  130.757183,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字畑',
  '大字畑',
  '大字畑',
  NULL,
  33.74601,
  130.77397,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_須崎',
  '須崎町',
  '須崎町',
  NULL,
  33.750839,
  130.725791,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_古',
  '古町',
  '古町',
  NULL,
  33.7473,
  130.727153,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上頓野',
  '大字上頓野',
  '大字上頓野',
  NULL,
  33.76959,
  130.779623,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下新入',
  '大字下新入',
  '大字下新入',
  NULL,
  33.761219,
  130.699456,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_神正',
  '神正町',
  '神正町',
  NULL,
  33.753709,
  130.724433,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字頓野',
  '大字頓野',
  '大字頓野',
  NULL,
  33.752084,
  130.766981,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字赤地',
  '大字赤地',
  '大字赤地',
  NULL,
  33.728356,
  130.728331,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津田',
  '津田町',
  '津田町',
  NULL,
  33.747921,
  130.730523,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字永満寺',
  '大字永満寺',
  '大字永満寺',
  NULL,
  33.734551,
  130.773632,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字直方',
  '大字直方',
  '大字直方',
  NULL,
  33.740356,
  130.724868,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_日吉',
  '日吉町',
  '日吉町',
  NULL,
  33.752013,
  130.729077,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下境',
  '大字下境',
  '大字下境',
  NULL,
  33.729828,
  130.742529,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山部',
  '大字山部',
  '大字山部',
  NULL,
  33.743612,
  130.720643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上新入',
  '大字上新入',
  '大字上新入',
  NULL,
  33.748776,
  130.704176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681534483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字篠瀬',
  '大字篠瀬',
  '大字篠瀬',
  NULL,
  33.550849,
  131.036043,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大河内',
  '大字大河内',
  '大字大河内',
  NULL,
  33.554534,
  131.073835,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字永久',
  '大字永久',
  '大字永久',
  NULL,
  33.582989,
  131.124392,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_青豊',
  '青豊',
  '青豊',
  NULL,
  33.61477,
  131.132525,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540226,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字荒堀',
  '大字荒堀',
  '大字荒堀',
  NULL,
  33.597775,
  131.118291,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540227,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字岸井',
  '大字岸井',
  '大字岸井',
  NULL,
  33.595051,
  131.137493,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字天和',
  '大字天和',
  '大字天和',
  NULL,
  33.564596,
  131.081681,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字広瀬',
  '大字広瀬',
  '大字広瀬',
  NULL,
  33.587123,
  131.142895,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字清水',
  '大字清水町',
  '大字清水町',
  NULL,
  33.61132,
  131.13779,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字皆毛',
  '大字皆毛',
  '大字皆毛',
  NULL,
  33.593347,
  131.148767,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字畑_quarter',
  '大字畑',
  '大字畑',
  NULL,
  33.586637,
  131.055141,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宇島',
  '大字宇島',
  '大字宇島',
  NULL,
  33.626455,
  131.133468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字三楽',
  '大字三楽',
  '大字三楽',
  NULL,
  33.606269,
  131.151441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中川底',
  '大字中川底',
  '大字中川底',
  NULL,
  33.537478,
  131.085945,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字六郎',
  '大字六郎',
  '大字六郎',
  NULL,
  33.599014,
  131.149256,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字薬師寺',
  '大字薬師寺',
  '大字薬師寺',
  NULL,
  33.575492,
  131.122004,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字赤熊',
  '大字赤熊',
  '大字赤熊',
  NULL,
  33.618359,
  131.135799,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字恒富',
  '大字恒富',
  '大字恒富',
  NULL,
  33.61308,
  131.146519,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字川内',
  '大字川内',
  '大字川内',
  NULL,
  33.583252,
  131.080256,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字久松',
  '大字久松',
  '大字久松',
  NULL,
  33.617033,
  131.148283,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鬼木',
  '大字鬼木',
  '大字鬼木',
  NULL,
  33.580588,
  131.129586,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540243,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字松江',
  '大字松江',
  '大字松江',
  NULL,
  33.618154,
  131.09126,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540244,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字挾間',
  '大字挾間',
  '大字挾間',
  NULL,
  33.560687,
  131.117025,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540245,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字岩屋',
  '大字岩屋',
  '大字岩屋',
  NULL,
  33.541639,
  131.05044,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540246,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字才尾',
  '大字才尾',
  '大字才尾',
  NULL,
  33.57788,
  131.112012,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540247,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字求菩提',
  '大字求菩提',
  '大字求菩提',
  NULL,
  33.52834,
  131.01233,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鳥越',
  '大字鳥越',
  '大字鳥越',
  NULL,
  33.601125,
  131.100963,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉木',
  '大字吉木',
  '大字吉木',
  NULL,
  33.608797,
  131.132234,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字森久',
  '大字森久',
  '大字森久',
  NULL,
  33.602628,
  131.14684,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字青畑',
  '大字青畑',
  '大字青畑',
  NULL,
  33.586274,
  131.105541,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540252,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上川底',
  '大字上川底',
  '大字上川底',
  NULL,
  33.529145,
  131.057033,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540253,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字千束',
  '大字千束',
  '大字千束',
  NULL,
  33.600972,
  131.127266,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540254,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字馬場',
  '大字馬場',
  '大字馬場',
  NULL,
  33.603884,
  131.063118,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540255,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大',
  '大字大村',
  '大字大村',
  NULL,
  33.596405,
  131.108438,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540256,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下河内',
  '大字下河内',
  '大字下河内',
  NULL,
  33.564877,
  131.095844,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字野田',
  '大字野田',
  '大字野田',
  NULL,
  33.598817,
  131.12302,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540258,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字今',
  '大字今市',
  '大字今市',
  NULL,
  33.607965,
  131.124275,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540259,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小犬丸',
  '大字小犬丸',
  '大字小犬丸',
  NULL,
  33.61097,
  131.143144,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540260,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山内',
  '大字山内',
  '大字山内',
  NULL,
  33.573873,
  131.100187,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540261,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字沓川',
  '大字沓川',
  '大字沓川',
  NULL,
  33.617505,
  131.14369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鳥井畑',
  '大字鳥井畑',
  '大字鳥井畑',
  NULL,
  33.548993,
  131.021257,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字三毛門',
  '大字三毛門',
  '大字三毛門',
  NULL,
  33.612814,
  131.157525,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字河原田',
  '大字河原田',
  '大字河原田',
  NULL,
  33.578443,
  131.123193,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高田',
  '大字高田',
  '大字高田',
  NULL,
  33.590353,
  131.147535,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540266,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字八屋',
  '大字八屋',
  '大字八屋',
  NULL,
  33.618825,
  131.122652,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540267,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大西',
  '大字大西',
  '大字大西',
  NULL,
  33.587323,
  131.11836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下川底',
  '大字下川底',
  '大字下川底',
  NULL,
  33.549678,
  131.101363,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540269,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中',
  '大字中村',
  '大字中村',
  NULL,
  33.620867,
  131.080485,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小石原',
  '大字小石原',
  '大字小石原',
  NULL,
  33.597155,
  131.153426,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字市丸',
  '大字市丸',
  '大字市丸',
  NULL,
  33.607758,
  131.145176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540272,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字久路土',
  '大字久路土',
  '大字久路土',
  NULL,
  33.589004,
  131.132725,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540273,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字塔田',
  '大字塔田',
  '大字塔田',
  NULL,
  33.597099,
  131.129843,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540274,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字堀立',
  '大字堀立',
  '大字堀立',
  NULL,
  33.598782,
  131.14123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540275,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字梶屋',
  '大字梶屋',
  '大字梶屋',
  NULL,
  33.605528,
  131.141013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540276,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字四郎丸',
  '大字四郎丸',
  '大字四郎丸',
  NULL,
  33.600541,
  131.08284,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字畠中',
  '大字畠中',
  '大字畠中',
  NULL,
  33.630295,
  131.087228,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681540278,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_蟹',
  '蟹町',
  '蟹町',
  NULL,
  33.169887,
  130.406039,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542823,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鬼童',
  '鬼童町',
  '鬼童町',
  NULL,
  33.160933,
  130.396464,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542824,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中',
  '中町',
  '中町',
  NULL,
  33.169353,
  130.407555,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_椿原',
  '椿原町',
  '椿原町',
  NULL,
  33.165396,
  130.412486,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町正行',
  '三橋町正行',
  '三橋町正行',
  NULL,
  33.169618,
  130.431703,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町久末',
  '三橋町久末',
  '三橋町久末',
  NULL,
  33.16778,
  130.448093,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_稲荷',
  '稲荷町',
  '稲荷町',
  NULL,
  33.159873,
  130.393718,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_横山',
  '横山町',
  '横山町',
  NULL,
  33.169908,
  130.411146,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立石',
  '立石',
  '立石',
  NULL,
  33.184733,
  130.425079,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町白鳥',
  '三橋町白鳥',
  '三橋町白鳥',
  NULL,
  33.15977,
  130.448618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町徳益',
  '大和町徳益',
  '大和町徳益',
  NULL,
  33.155436,
  130.42228,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新船津',
  '新船津町',
  '新船津町',
  NULL,
  33.171805,
  130.40381,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町起田',
  '三橋町起田',
  '三橋町起田',
  NULL,
  33.183234,
  130.44815,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町栄',
  '大和町栄',
  '大和町栄',
  NULL,
  33.12652,
  130.424637,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542836,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_坂本',
  '坂本町',
  '坂本町',
  NULL,
  33.163489,
  130.403481,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本_quarter_8681542838',
  '本町',
  '本町',
  NULL,
  33.1628,
  130.406684,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢留本',
  '矢留本町',
  '矢留本町',
  NULL,
  33.151971,
  130.388391,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_糀屋',
  '糀屋町',
  '糀屋町',
  NULL,
  33.170233,
  130.404315,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東魚屋',
  '東魚屋町',
  '東魚屋町',
  NULL,
  33.165893,
  130.409952,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本船津',
  '本船津町',
  '本船津町',
  NULL,
  33.171823,
  130.406218,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_蒲生',
  '蒲生',
  '蒲生',
  NULL,
  33.192373,
  130.426869,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西蒲池',
  '西蒲池',
  '西蒲池',
  NULL,
  33.185965,
  130.400952,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町吉開',
  '三橋町吉開',
  '三橋町吉開',
  NULL,
  33.18049,
  130.455335,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鍛冶屋',
  '鍛冶屋町',
  '鍛冶屋町',
  NULL,
  33.167772,
  130.404359,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大浜',
  '大浜町',
  '大浜町',
  NULL,
  33.129354,
  130.383741,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_佃',
  '佃町',
  '佃町',
  NULL,
  33.13531,
  130.4092409,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542848,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町垂見',
  '三橋町垂見',
  '三橋町垂見',
  NULL,
  33.155824,
  130.436057,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_有明',
  '有明町',
  '有明町',
  NULL,
  33.129617,
  130.398656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542850,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町永田開',
  '大和町永田開',
  '大和町永田開',
  NULL,
  33.103264,
  130.419223,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_隅',
  '隅町',
  '隅町',
  NULL,
  33.167584,
  130.413925,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町五拾',
  '三橋町五拾町',
  '三橋町五拾町',
  NULL,
  33.157409,
  130.45369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町鷹ノ尾',
  '大和町鷹ノ尾',
  '大和町鷹ノ尾',
  NULL,
  33.129215,
  130.439468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_昭南',
  '昭南町',
  '昭南町',
  NULL,
  33.146615,
  130.363787,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542855,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町枝光',
  '三橋町枝光',
  '三橋町枝光',
  NULL,
  33.173614,
  130.397682,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542856,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町明野',
  '大和町明野',
  '大和町明野',
  NULL,
  33.131143,
  130.414748,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542857,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_細工',
  '細工町',
  '細工町',
  NULL,
  33.164594,
  130.411008,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542858,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_保加',
  '保加町',
  '保加町',
  NULL,
  33.172218,
  130.407925,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542859,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢加部',
  '矢加部',
  '矢加部',
  NULL,
  33.182566,
  130.416494,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542860,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_京',
  '京町',
  '京町',
  NULL,
  33.167298,
  130.409716,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542861,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_橋本',
  '橋本町',
  '橋本町',
  NULL,
  33.118304,
  130.383163,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮永',
  '宮永町',
  '宮永町',
  NULL,
  33.157738,
  130.402752,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542863,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上',
  '上町',
  '上町',
  NULL,
  33.170511,
  130.408077,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542864,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_七ツ家',
  '七ツ家',
  '七ツ家',
  NULL,
  33.16391,
  130.362978,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542865,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_出来',
  '出来町',
  '出来町',
  NULL,
  33.161705,
  130.410224,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542866,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町新',
  '三橋町新村',
  '三橋町新村',
  NULL,
  33.173612,
  130.455808,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542867,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町百',
  '三橋町百町',
  '三橋町百町',
  NULL,
  33.171367,
  130.441151,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542868,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_恵美須',
  '恵美須町',
  '恵美須町',
  NULL,
  33.168418,
  130.408746,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉富',
  '吉富町',
  '吉富町',
  NULL,
  33.146003,
  130.388133,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542870,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田脇',
  '田脇',
  '田脇',
  NULL,
  33.177164,
  130.383003,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542871,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町高畑',
  '三橋町高畑',
  '三橋町高畑',
  NULL,
  33.169877,
  130.417856,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542872,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_曙',
  '曙町',
  '曙町',
  NULL,
  33.168448,
  130.410958,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町豊原',
  '大和町豊原',
  '大和町豊原',
  NULL,
  33.146333,
  130.422846,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542874,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新外',
  '新外町',
  '新外町',
  NULL,
  33.161866,
  130.398058,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542875,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町蒲船津',
  '三橋町蒲船津',
  '三橋町蒲船津',
  NULL,
  33.167578,
  130.425455,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町皿垣開',
  '大和町皿垣開',
  '大和町皿垣開',
  NULL,
  33.116178,
  130.413935,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下宮永',
  '下宮永町',
  '下宮永町',
  NULL,
  33.141667,
  130.400724,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542878,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町磯鳥',
  '三橋町磯鳥',
  '三橋町磯鳥',
  NULL,
  33.178274,
  130.42917,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542879,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢留',
  '矢留町',
  '矢留町',
  NULL,
  33.158539,
  130.391406,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542880,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_古賀',
  '古賀',
  '古賀',
  NULL,
  33.160506,
  130.387815,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542881,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東蒲池',
  '東蒲池',
  '東蒲池',
  NULL,
  33.186371,
  130.409113,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542882,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_元',
  '元町',
  '元町',
  NULL,
  33.168083,
  130.403298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542883,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_金納',
  '金納',
  '金納',
  NULL,
  33.189346,
  130.418652,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542884,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西浜武',
  '西浜武',
  '西浜武',
  NULL,
  33.171576,
  130.389234,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542885,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_南長柄',
  '南長柄町',
  '南長柄町',
  NULL,
  33.163213,
  130.409853,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_片原',
  '片原町',
  '片原町',
  NULL,
  33.166853,
  130.405088,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_沖端',
  '沖端町',
  '沖端町',
  NULL,
  33.15858,
  130.394709,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_常盤',
  '常盤町',
  '常盤町',
  NULL,
  33.170193,
  130.409777,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542889,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_辻',
  '辻町',
  '辻町',
  NULL,
  33.168022,
  130.407271,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町中山',
  '三橋町中山',
  '三橋町中山',
  NULL,
  33.169278,
  130.464664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_一新',
  '一新町',
  '一新町',
  NULL,
  33.16463,
  130.408287,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542892,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町六合',
  '大和町六合',
  '大和町六合',
  NULL,
  33.142018,
  130.445976,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高島',
  '高島',
  '高島',
  NULL,
  33.183606,
  130.431462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町下百',
  '三橋町下百町',
  '三橋町下百町',
  NULL,
  33.164268,
  130.421532,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町谷垣',
  '大和町谷垣',
  '大和町谷垣',
  NULL,
  33.107744,
  130.40321,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_城南',
  '城南町',
  '城南町',
  NULL,
  33.159444,
  130.402965,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町江曲',
  '三橋町江曲',
  '三橋町江曲',
  NULL,
  33.154671,
  130.410437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町大坪',
  '大和町大坪',
  '大和町大坪',
  NULL,
  33.095781,
  130.40494,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542899,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_材木',
  '材木町',
  '材木町',
  NULL,
  33.170743,
  130.406322,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本城',
  '本城町',
  '本城町',
  NULL,
  33.161046,
  130.401604,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_弥四郎',
  '弥四郎町',
  '弥四郎町',
  NULL,
  33.150057,
  130.39481,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久々原',
  '久々原',
  '久々原',
  NULL,
  33.16177,
  130.374276,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八軒',
  '八軒町',
  '八軒町',
  NULL,
  33.168391,
  130.409796,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_茂庵',
  '茂庵町',
  '茂庵町',
  NULL,
  33.158584,
  130.402537,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上宮永',
  '上宮永町',
  '上宮永町',
  NULL,
  33.147949,
  130.39785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西魚屋',
  '西魚屋町',
  '西魚屋町',
  NULL,
  33.168313,
  130.405221,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町柳河',
  '三橋町柳河',
  '三橋町柳河',
  NULL,
  33.175424,
  130.413428,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542908,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町藤吉',
  '三橋町藤吉',
  '三橋町藤吉',
  NULL,
  33.157606,
  130.412818,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_奥州',
  '奥州町',
  '奥州町',
  NULL,
  33.15944,
  130.408029,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542910,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉原',
  '吉原',
  '吉原',
  NULL,
  33.156757,
  130.37582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542911,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_筑紫',
  '筑紫町',
  '筑紫町',
  NULL,
  33.165501,
  130.394964,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542912,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町棚',
  '三橋町棚町',
  '三橋町棚町',
  NULL,
  33.151855,
  130.449959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542913,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_旭',
  '旭町',
  '旭町',
  NULL,
  33.16785,
  130.41274,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542914,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町中島',
  '大和町中島',
  '大和町中島',
  NULL,
  33.115995,
  130.430148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542915,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新_quarter',
  '新町',
  '新町',
  NULL,
  33.163208,
  130.41247,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681542916,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_牛隈',
  '牛隈',
  '牛隈',
  NULL,
  33.565181,
  130.736734,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543502,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上_quarter',
  '上',
  '上',
  NULL,
  33.528153,
  130.764371,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西郷',
  '西郷',
  '西郷',
  NULL,
  33.557032,
  130.719986,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下臼井',
  '下臼井',
  '下臼井',
  NULL,
  33.574976,
  130.709285,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_飯田',
  '飯田',
  '飯田',
  NULL,
  33.569553,
  130.701762,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_口春',
  '口春',
  '口春',
  NULL,
  33.604869,
  130.71307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_漆生',
  '漆生',
  '漆生',
  NULL,
  33.585748,
  130.717195,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543508,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上西郷',
  '上西郷',
  '上西郷',
  NULL,
  33.544745,
  130.73177,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平',
  '平',
  '平',
  NULL,
  33.588011,
  130.740695,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543510,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_稲築才田',
  '稲築才田',
  '稲築才田',
  NULL,
  33.577609,
  130.733196,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543511,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_九郎原',
  '九郎原',
  '九郎原',
  NULL,
  33.547643,
  130.703691,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大隈',
  '大隈町',
  '大隈町',
  NULL,
  33.541776,
  130.74036,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千手',
  '千手',
  '千手',
  NULL,
  33.510694,
  130.723729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543514,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_屏',
  '屏',
  '屏',
  NULL,
  33.50503,
  130.742688,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543515,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_岩崎',
  '岩崎',
  '岩崎',
  NULL,
  33.596589,
  130.716052,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543516,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町木元',
  '三橋町木元',
  '三橋町木元',
  NULL,
  33.179123,
  130.441284,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543617,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大和町塩塚',
  '大和町塩塚',
  '大和町塩塚',
  NULL,
  33.143309,
  130.434867,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543618,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_城隅',
  '城隅町',
  '城隅町',
  NULL,
  33.160207,
  130.398389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543619,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三橋町今古賀',
  '三橋町今古賀',
  '三橋町今古賀',
  NULL,
  33.160248,
  130.419801,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_柳',
  '柳町',
  '柳町',
  NULL,
  33.165228,
  130.402955,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543621,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小道具',
  '小道具町',
  '小道具町',
  NULL,
  33.166017,
  130.408688,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543622,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_袋',
  '袋町',
  '袋町',
  NULL,
  33.162648,
  130.408271,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543623,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八百屋',
  '八百屋町',
  '八百屋町',
  NULL,
  33.168306,
  130.406298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543624,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_北長柄',
  '北長柄町',
  '北長柄町',
  NULL,
  33.164757,
  130.409918,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543625,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_間',
  '間',
  '間',
  NULL,
  33.178914,
  130.374056,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543626,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_南浜武',
  '南浜武',
  '南浜武',
  NULL,
  33.154135,
  130.381624,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681543627,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川犬',
  '川犬',
  '川犬',
  NULL,
  33.188025,
  130.53893,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町湯辺田',
  '黒木町湯辺田',
  '黒木町湯辺田',
  NULL,
  33.211948,
  130.631909,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町北山',
  '立花町北山',
  '立花町北山',
  NULL,
  33.175206,
  130.573799,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_星野',
  '星野村',
  '星野村',
  NULL,
  33.249598,
  130.761118,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544120,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_馬場',
  '馬場',
  '馬場',
  NULL,
  33.208579,
  130.568646,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544121,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大籠',
  '大籠',
  '大籠',
  NULL,
  33.223067,
  130.602113,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544122,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町北木屋',
  '黒木町北木屋',
  '黒木町北木屋',
  NULL,
  33.205149,
  130.718595,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高塚',
  '高塚',
  '高塚',
  NULL,
  33.203766,
  130.55872,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立野',
  '立野',
  '立野',
  NULL,
  33.206815,
  130.540009,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢原',
  '矢原',
  '矢原',
  NULL,
  33.186064,
  130.548192,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_稲富',
  '稲富',
  '稲富',
  NULL,
  33.207555,
  130.549345,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町今',
  '黒木町今',
  '黒木町今',
  NULL,
  33.221815,
  130.671099,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上陽町北川内',
  '上陽町北川内',
  '上陽町北川内',
  NULL,
  33.236688,
  130.657721,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町谷川',
  '立花町谷川',
  '立花町谷川',
  NULL,
  33.203543,
  130.603176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_室岡',
  '室岡',
  '室岡',
  NULL,
  33.217471,
  130.527158,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_亀甲',
  '亀甲',
  '亀甲',
  NULL,
  33.21713,
  130.533694,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町本分',
  '黒木町本分',
  '黒木町本分',
  NULL,
  33.216959,
  130.644322,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町田代',
  '黒木町田代',
  '黒木町田代',
  NULL,
  33.155035,
  130.650527,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544134,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町上辺春',
  '立花町上辺春',
  '立花町上辺春',
  NULL,
  33.131847,
  130.619663,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平田',
  '平田',
  '平田',
  NULL,
  33.219022,
  130.579149,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_納楚',
  '納楚',
  '納楚',
  NULL,
  33.21691,
  130.570748,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉田',
  '吉田',
  '吉田',
  NULL,
  33.226978,
  130.557492,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鵜池',
  '鵜池',
  '鵜池',
  NULL,
  33.205915,
  130.526495,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544139,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町北大淵',
  '黒木町北大淵',
  '黒木町北大淵',
  NULL,
  33.186294,
  130.761062,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平_quarter',
  '平',
  '平',
  NULL,
  33.193779,
  130.543568,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544141,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_龍ケ原',
  '龍ケ原',
  '龍ケ原',
  NULL,
  33.223442,
  130.53265,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544142,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_柳瀬',
  '柳瀬',
  '柳瀬',
  NULL,
  33.19229,
  130.562455,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544143,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_国武',
  '国武',
  '国武',
  NULL,
  33.201061,
  130.544339,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上陽町上横山',
  '上陽町上横山',
  '上陽町上横山',
  NULL,
  33.275146,
  130.680249,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町田形',
  '立花町田形',
  '立花町田形',
  NULL,
  33.206863,
  130.62097,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮野',
  '宮野',
  '宮野',
  NULL,
  33.200095,
  130.564904,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_蒲原',
  '蒲原',
  '蒲原',
  NULL,
  33.216936,
  130.543699,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町土窪',
  '黒木町土窪',
  '黒木町土窪',
  NULL,
  33.194341,
  130.642019,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_光',
  '光',
  '光',
  NULL,
  33.192348,
  130.550525,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町木屋',
  '黒木町木屋',
  '黒木町木屋',
  NULL,
  33.183846,
  130.68274,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_立花町兼松',
  '立花町兼松',
  '立花町兼松',
  NULL,
  33.182567,
  130.597269,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長野',
  '長野',
  '長野',
  NULL,
  33.230106,
  130.625594,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山内',
  '山内',
  '山内',
  NULL,
  33.225157,
  130.610639,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_岩崎_quarter',
  '岩崎',
  '岩崎',
  NULL,
  33.222308,
  130.547252,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544155,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒木町笠原',
  '黒木町笠原',
  '黒木町笠原',
  NULL,
  33.218513,
  130.741788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544156,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新庄',
  '新庄',
  '新庄',
  NULL,
  33.198586,
  130.535949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544157,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字津積',
  '大字津積',
  '大字津積',
  NULL,
  33.680857,
  130.933257,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544319,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高瀬',
  '大字高瀬',
  '大字高瀬',
  NULL,
  33.703934,
  131.00811,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544323,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字矢留',
  '大字矢留',
  '大字矢留',
  NULL,
  33.693333,
  130.96667,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下崎',
  '大字下崎',
  '大字下崎',
  NULL,
  33.728456,
  130.927586,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544327,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字真菰',
  '大字真菰',
  '大字真菰',
  NULL,
  33.722141,
  131.000606,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544328,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上津熊',
  '大字上津熊',
  '大字上津熊',
  NULL,
  33.7277175,
  130.9524404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字福原',
  '大字福原',
  '大字福原',
  NULL,
  33.703241,
  130.96865,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大野井',
  '大字大野井',
  '大字大野井',
  NULL,
  33.71746,
  130.9623321,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字入覚',
  '大字入覚',
  '大字入覚',
  NULL,
  33.72439,
  130.909635,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_内蔵',
  '内蔵',
  '内蔵',
  NULL,
  33.741448,
  130.899365,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字寺畔',
  '大字寺畔',
  '大字寺畔',
  NULL,
  33.710328,
  130.961085,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長音寺',
  '大字長音寺',
  '大字長音寺',
  NULL,
  33.7329993,
  130.9536231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字流末',
  '大字流末',
  '大字流末',
  NULL,
  33.702676,
  130.962286,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字須磨園',
  '大字須磨園',
  '大字須磨園',
  NULL,
  33.74038,
  130.927405,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宮',
  '大字宮市',
  '大字宮市',
  NULL,
  33.7232375,
  130.9567063,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字沓尾',
  '大字沓尾',
  '大字沓尾',
  NULL,
  33.727888,
  131.016298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字二塚',
  '大字二塚',
  '大字二塚',
  NULL,
  33.723837,
  130.941361,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字金屋',
  '大字金屋',
  '大字金屋',
  NULL,
  33.728934,
  130.99266,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字馬場_quarter',
  '大字馬場',
  '大字馬場',
  NULL,
  33.710054,
  131.009292,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544357,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千仏',
  '千仏',
  '千仏',
  NULL,
  33.748959,
  130.902285,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字今井',
  '大字今井',
  '大字今井',
  NULL,
  33.726638,
  131.001961,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中津熊',
  '大字中津熊',
  '大字中津熊',
  NULL,
  33.7306899,
  130.9582557,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長井',
  '大字長井',
  '大字長井',
  NULL,
  33.716242,
  131.019738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字常松',
  '大字常松',
  '大字常松',
  NULL,
  33.737544,
  130.92535,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宝山',
  '大字宝山',
  '大字宝山',
  NULL,
  33.704592,
  130.955938,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544371,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字矢山',
  '大字矢山',
  '大字矢山',
  NULL,
  33.743267,
  130.9068,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下津熊',
  '大字下津熊',
  '大字下津熊',
  NULL,
  33.731506,
  130.962963,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字松原',
  '大字松原',
  '大字松原',
  NULL,
  33.686105,
  131.036471,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上稗田',
  '大字上稗田',
  '大字上稗田',
  NULL,
  33.697994,
  130.934674,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字福丸',
  '大字福丸',
  '大字福丸',
  NULL,
  33.740907,
  130.918688,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大橋',
  '大字大橋',
  '大字大橋',
  NULL,
  33.73025,
  130.988376,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字延永',
  '大字延永',
  '大字延永',
  NULL,
  33.735112,
  130.94502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字天生田',
  '大字天生田',
  '大字天生田',
  NULL,
  33.689182,
  130.95631,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長尾',
  '大字長尾',
  '大字長尾',
  NULL,
  33.734166,
  130.927626,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字道場寺',
  '大字道場寺',
  '大字道場寺',
  NULL,
  33.693657,
  131.005579,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_門樋',
  '門樋町',
  '門樋町',
  NULL,
  33.724832,
  130.9762789,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544391,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字辻垣',
  '大字辻垣',
  '大字辻垣',
  NULL,
  33.704886,
  130.999641,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高来',
  '大字高来',
  '大字高来',
  NULL,
  33.739207,
  130.916379,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字元永',
  '大字元永',
  '大字元永',
  NULL,
  33.719215,
  131.011416,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下検地',
  '大字下検地',
  '大字下検地',
  NULL,
  33.7210931,
  130.9510217,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544401,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字前田',
  '大字前田',
  '大字前田',
  NULL,
  33.710363,
  130.943641,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上検地',
  '大字上検地',
  '大字上検地',
  NULL,
  33.717955,
  130.9519857,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544404,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東徳永',
  '大字東徳永',
  '大字東徳永',
  NULL,
  33.686157,
  131.010367,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544405,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大谷',
  '大字大谷',
  '大字大谷',
  NULL,
  33.688252,
  130.947389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544407,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西谷',
  '大字西谷',
  '大字西谷',
  NULL,
  33.68507,
  130.939572,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮市',
  '宮市町',
  '宮市町',
  NULL,
  33.7305881,
  130.972025,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544413,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字津留',
  '大字津留',
  '大字津留',
  NULL,
  33.715201,
  131.001041,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544414,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字竹田',
  '大字竹田',
  '大字竹田',
  NULL,
  33.708695,
  130.996026,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉国',
  '大字吉国',
  '大字吉国',
  NULL,
  33.7258168,
  130.9486159,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下稗田',
  '大字下稗田',
  '大字下稗田',
  NULL,
  33.703536,
  130.94471,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字蓑島',
  '大字蓑島',
  '大字蓑島',
  NULL,
  33.745149,
  131.014901,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字草野',
  '大字草野',
  '大字草野',
  NULL,
  33.7349108,
  130.9577376,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字袋迫',
  '大字袋迫',
  '大字袋迫',
  NULL,
  33.680233,
  131.012062,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長木',
  '大字長木',
  '大字長木',
  NULL,
  33.719354,
  130.936503,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字羽根木',
  '大字羽根木',
  '大字羽根木',
  NULL,
  33.717665,
  130.988458,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_神田',
  '神田町',
  '神田町',
  NULL,
  33.7249512,
  130.9736896,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字稲童',
  '大字稲童',
  '大字稲童',
  NULL,
  33.696947,
  131.025369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中川',
  '大字中川',
  '大字中川',
  NULL,
  33.710148,
  130.9507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字徳永',
  '大字徳永',
  '大字徳永',
  NULL,
  33.742866,
  130.925717,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字金出',
  '大字金出',
  '大字金出',
  NULL,
  33.632424,
  130.545538,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544885,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字若杉',
  '大字若杉',
  '大字若杉',
  NULL,
  33.607004,
  130.524221,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544886,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字篠栗',
  '大字篠栗',
  '大字篠栗',
  NULL,
  33.622748,
  130.568817,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544887,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字和田',
  '大字和田',
  '大字和田',
  NULL,
  33.6315661,
  130.5046501,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高田_quarter',
  '大字高田',
  '大字高田',
  NULL,
  33.636222,
  130.534888,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544889,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsubakuro',
  '大字津波黒',
  'つばくろ',
  '{"en":"Tsubakuro"}'::jsonb,
  33.6261707,
  130.5115944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字乙犬',
  '大字乙犬',
  '大字乙犬',
  NULL,
  33.615605,
  130.507212,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544892,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字内住',
  '大字内住',
  '大字内住',
  NULL,
  33.610407,
  130.586419,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544893,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字尾仲',
  '大字尾仲',
  '大字尾仲',
  NULL,
  33.619326,
  130.515656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544894,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字萩尾',
  '大字萩尾',
  '大字萩尾',
  NULL,
  33.653685,
  130.560375,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681544895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字春日',
  '大字春日',
  '大字春日',
  NULL,
  33.517486,
  130.461824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681545362,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下白水',
  '大字下白水',
  '大字下白水',
  NULL,
  33.506125,
  130.45939,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681545408,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_庄',
  '庄',
  '庄',
  NULL,
  33.727837,
  130.48179,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_美郷',
  '美郷',
  '美郷',
  NULL,
  33.741714,
  130.483849,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555801,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_今在家',
  '今在家',
  '今在家',
  NULL,
  33.720404,
  130.477005,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555802,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川原',
  '川原',
  '川原',
  NULL,
  33.717222,
  130.487446,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小竹',
  '小竹',
  '小竹',
  NULL,
  33.698426,
  130.473842,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_谷山',
  '谷山',
  '谷山',
  NULL,
  33.701936,
  130.511608,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555808,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鹿部',
  '鹿部',
  '鹿部',
  NULL,
  33.716112,
  130.463991,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555812,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_薬王寺',
  '薬王寺',
  '薬王寺',
  NULL,
  33.713889,
  130.519668,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555815,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_糸ケ浦',
  '糸ケ浦',
  '糸ケ浦',
  NULL,
  33.714979,
  130.469923,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681555816,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字内山',
  '大字内山',
  '大字内山',
  NULL,
  33.529587,
  130.553469,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字水城',
  '大字水城',
  '大字水城',
  NULL,
  33.531678,
  130.507513,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字北谷',
  '大字北谷',
  '大字北谷',
  NULL,
  33.546478,
  130.550904,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白川',
  '白川',
  '白川',
  NULL,
  33.517813,
  130.525823,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566142,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_石穴',
  '石穴',
  '石穴',
  NULL,
  33.508867,
  130.544942,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字太宰府',
  '大字太宰府',
  '大字太宰府',
  NULL,
  33.533305,
  130.529349,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大佐野',
  '大字大佐野',
  '大字大佐野',
  NULL,
  33.485918,
  130.490163,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字向佐野',
  '大字向佐野',
  '大字向佐野',
  NULL,
  33.509966,
  130.500279,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566183,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字国分',
  '大字国分',
  '大字国分',
  NULL,
  33.52703,
  130.509297,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字通古賀',
  '大字通古賀',
  '大字通古賀',
  NULL,
  33.513524,
  130.500499,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566209,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字観世音寺',
  '大字観世音寺',
  '大字観世音寺',
  NULL,
  33.523383,
  130.519196,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681566212,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町黒崎開',
  '高田町黒崎開',
  '高田町黒崎開',
  NULL,
  33.089935,
  130.440708,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町清水',
  '山川町清水',
  '山川町清水',
  NULL,
  33.138285,
  130.502686,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町泰仙寺',
  '瀬高町泰仙寺',
  '瀬高町泰仙寺',
  NULL,
  33.130267,
  130.450536,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572709,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町江浦',
  '高田町江浦町',
  '高田町江浦町',
  NULL,
  33.113457,
  130.444307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572710,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町尾野',
  '山川町尾野',
  '山川町尾野',
  NULL,
  33.128984,
  130.507031,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572711,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町小田',
  '瀬高町小田',
  '瀬高町小田',
  NULL,
  33.169498,
  130.52987,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572712,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町大草',
  '瀬高町大草',
  '瀬高町大草',
  NULL,
  33.159122,
  130.514958,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572713,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町山門',
  '瀬高町山門',
  '瀬高町山門',
  NULL,
  33.151882,
  130.498219,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572714,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町田尻',
  '高田町田尻',
  '高田町田尻',
  NULL,
  33.111346,
  130.485809,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572715,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町東津留',
  '瀬高町東津留',
  '瀬高町東津留',
  NULL,
  33.137772,
  130.457227,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572716,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉松',
  '大字吉松',
  '大字吉松',
  NULL,
  33.515072,
  130.497212,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字坂本',
  '大字坂本',
  '大字坂本',
  NULL,
  33.524024,
  130.515572,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681572833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新原',
  '新原',
  '新原',
  NULL,
  33.722813,
  130.488662,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_薦野',
  '薦野',
  '薦野',
  NULL,
  33.72526,
  130.545307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_筵内',
  '筵内',
  '筵内',
  NULL,
  33.734428,
  130.502344,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_青柳',
  '青柳町',
  '青柳町',
  NULL,
  33.708067,
  130.496861,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_米多比',
  '米多比',
  '米多比',
  NULL,
  33.720489,
  130.52712,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_古賀_quarter',
  '古賀',
  '古賀',
  NULL,
  33.732869,
  130.457231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_青柳_quarter',
  '青柳',
  '青柳',
  NULL,
  33.70597,
  130.48004,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久保',
  '久保',
  '久保',
  NULL,
  33.737252,
  130.48725,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小山田',
  '小山田',
  '小山田',
  NULL,
  33.715764,
  130.507048,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681573063,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町三春',
  '浮羽町三春',
  '浮羽町三春',
  NULL,
  33.346219,
  130.824663,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576317,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町屋部',
  '吉井町屋部',
  '吉井町屋部',
  NULL,
  33.325235,
  130.762341,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町長栖',
  '吉井町長栖',
  '吉井町長栖',
  NULL,
  33.367273,
  130.727368,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576319,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町清瀬',
  '吉井町清瀬',
  '吉井町清瀬',
  NULL,
  33.337749,
  130.765656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576320,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町流川',
  '浮羽町流川',
  '浮羽町流川',
  NULL,
  33.325059,
  130.780794,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井',
  '吉井町',
  '吉井町',
  NULL,
  33.342521,
  130.751243,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576322,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町若宮',
  '吉井町若宮',
  '吉井町若宮',
  NULL,
  33.343284,
  130.765592,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576323,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町妹川',
  '浮羽町妹川',
  '浮羽町妹川',
  NULL,
  33.299594,
  130.758914,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576324,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町鷹取',
  '吉井町鷹取',
  '吉井町鷹取',
  NULL,
  33.322275,
  130.729183,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576325,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町西隈上',
  '浮羽町西隈上',
  '浮羽町西隈上',
  NULL,
  33.339202,
  130.794246,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576326,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町福永',
  '吉井町福永',
  '吉井町福永',
  NULL,
  33.351681,
  130.764019,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576327,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町江南',
  '吉井町江南',
  '吉井町江南',
  NULL,
  33.362807,
  130.735757,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576328,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町小塩',
  '浮羽町小塩',
  '浮羽町小塩',
  NULL,
  33.304194,
  130.848285,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576329,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町千年',
  '吉井町千年',
  '吉井町千年',
  NULL,
  33.354414,
  130.772707,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町古川',
  '浮羽町古川',
  '浮羽町古川',
  NULL,
  33.353418,
  130.799586,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町宮田',
  '吉井町宮田',
  '吉井町宮田',
  NULL,
  33.342888,
  130.773245,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町田篭',
  '浮羽町田篭',
  '浮羽町田篭',
  NULL,
  33.273123,
  130.841605,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町富永',
  '吉井町富永',
  '吉井町富永',
  NULL,
  33.324315,
  130.738748,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浮羽町山北',
  '浮羽町山北',
  '浮羽町山北',
  NULL,
  33.334218,
  130.820625,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576335,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉井町八和田',
  '吉井町八和田',
  '吉井町八和田',
  NULL,
  33.358788,
  130.74829,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681576336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_四郎丸',
  '四郎丸',
  '四郎丸',
  NULL,
  33.75527,
  130.645919,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577217,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_龍徳',
  '龍徳',
  '龍徳',
  NULL,
  33.737702,
  130.69768,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577218,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鶴田',
  '鶴田',
  '鶴田',
  NULL,
  33.716174,
  130.693148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577219,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犬鳴',
  '犬鳴',
  '犬鳴',
  NULL,
  33.697763,
  130.554009,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577220,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒丸',
  '黒丸',
  '黒丸',
  NULL,
  33.719609,
  130.577277,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577221,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_水原',
  '水原',
  '水原',
  NULL,
  33.741172,
  130.622036,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577222,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平_quarter_8681577223',
  '平',
  '平',
  NULL,
  33.733767,
  130.601058,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577223,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_沼口',
  '沼口',
  '沼口',
  NULL,
  33.741733,
  130.604979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_金丸',
  '金丸',
  '金丸',
  NULL,
  33.735189,
  130.631182,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577225,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三ケ畑',
  '三ケ畑',
  '三ケ畑',
  NULL,
  33.659892,
  130.600608,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577226,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮永_quarter',
  '宮永',
  '宮永',
  NULL,
  33.729816,
  130.586674,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577227,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_福丸',
  '福丸',
  '福丸',
  NULL,
  33.727514,
  130.62462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577228,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上有木',
  '上有木',
  '上有木',
  NULL,
  33.762602,
  130.616238,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577229,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下有木',
  '下有木',
  '下有木',
  NULL,
  33.752232,
  130.630083,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577230,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_湯原',
  '湯原',
  '湯原',
  NULL,
  33.689089,
  130.596615,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577231,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本城_quarter',
  '本城',
  '本城',
  NULL,
  33.733168,
  130.673042,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577232,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_稲光',
  '稲光',
  '稲光',
  NULL,
  33.72832,
  130.600551,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577233,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_竹原',
  '竹原',
  '竹原',
  NULL,
  33.731718,
  130.617867,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577234,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_倉久',
  '倉久',
  '倉久',
  NULL,
  33.77688,
  130.630478,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577235,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_芹田',
  '芹田',
  '芹田',
  NULL,
  33.741691,
  130.635618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_脇田',
  '脇田',
  '脇田',
  NULL,
  33.685482,
  130.57569,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577237,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_乙野',
  '乙野',
  '乙野',
  NULL,
  33.7064,
  130.578442,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577238,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長井鶴',
  '長井鶴',
  '長井鶴',
  NULL,
  33.731712,
  130.65086,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577239,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小伏',
  '小伏',
  '小伏',
  NULL,
  33.712328,
  130.59905,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577240,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮田',
  '宮田',
  '宮田',
  NULL,
  33.703942,
  130.652051,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577241,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高野',
  '高野',
  '高野',
  NULL,
  33.726301,
  130.612123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681577242,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_光代',
  '光代',
  '光代',
  NULL,
  33.566807,
  130.720177,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585917,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_嘉穂才田',
  '嘉穂才田',
  '嘉穂才田',
  NULL,
  33.541945,
  130.700018,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中益',
  '中益',
  '中益',
  NULL,
  33.540362,
  130.747857,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585919,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山野',
  '山野',
  '山野',
  NULL,
  33.6101,
  130.706749,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鴨生',
  '鴨生',
  '鴨生',
  NULL,
  33.607769,
  130.730433,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585921,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_芥田',
  '芥田',
  '芥田',
  NULL,
  33.543253,
  130.719609,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_馬見',
  '馬見',
  '馬見',
  NULL,
  33.509861,
  130.758231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585923,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_椎木',
  '椎木',
  '椎木',
  NULL,
  33.529708,
  130.745214,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上臼井',
  '上臼井',
  '上臼井',
  NULL,
  33.560463,
  130.708598,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585925,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東畑',
  '東畑',
  '東畑',
  NULL,
  33.522001,
  130.668757,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_熊ヶ畑',
  '熊ヶ畑',
  '熊ヶ畑',
  NULL,
  33.537641,
  130.786907,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_泉河内',
  '泉河内',
  '泉河内',
  NULL,
  33.515575,
  130.686704,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大隈_quarter',
  '大隈',
  '大隈',
  NULL,
  33.539067,
  130.760448,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585929,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下山田',
  '下山田',
  '下山田',
  NULL,
  33.574623,
  130.755303,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585930,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平山',
  '平山',
  '平山',
  NULL,
  33.559699,
  130.69836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桑野',
  '桑野',
  '桑野',
  NULL,
  33.498888,
  130.795134,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_猪国',
  '猪国',
  '猪国',
  NULL,
  33.574853,
  130.773502,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585933,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小野谷',
  '小野谷',
  '小野谷',
  NULL,
  33.504653,
  130.771971,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585934,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大力',
  '大力',
  '大力',
  NULL,
  33.522699,
  130.704508,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585935,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮吉',
  '宮吉',
  '宮吉',
  NULL,
  33.523565,
  130.775189,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585936,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_貞月',
  '貞月',
  '貞月',
  NULL,
  33.5553,
  130.732824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585937,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上山田',
  '上山田',
  '上山田',
  NULL,
  33.563082,
  130.774092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585938,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字志免',
  '大字志免',
  '大字志免',
  NULL,
  33.591471,
  130.485951,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585941,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_石橋台',
  '石橋台',
  '石橋台',
  NULL,
  33.576877,
  130.479575,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉原',
  '大字吉原',
  '大字吉原',
  NULL,
  33.573384,
  130.488277,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_坂瀬',
  '坂瀬',
  '坂瀬',
  NULL,
  33.579745,
  130.476801,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字南里',
  '大字南里',
  '大字南里',
  NULL,
  33.595361,
  130.47634,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_松ケ丘',
  '松ケ丘',
  '松ケ丘',
  NULL,
  33.585487,
  130.489687,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字別府',
  '大字別府',
  '大字別府',
  NULL,
  33.592756,
  130.464458,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字田富',
  '大字田富',
  '大字田富',
  NULL,
  33.574775,
  130.496053,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681585994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町北新開',
  '高田町北新開',
  '高田町北新開',
  NULL,
  33.099217,
  130.447533,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町重冨',
  '山川町重冨',
  '山川町重冨',
  NULL,
  33.106465,
  130.534834,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586518,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町下庄',
  '瀬高町下庄',
  '瀬高町下庄',
  NULL,
  33.150357,
  130.471558,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586519,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町江浦_quarter',
  '高田町江浦',
  '高田町江浦',
  NULL,
  33.107739,
  130.444788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町南新開',
  '高田町南新開',
  '高田町南新開',
  NULL,
  33.092378,
  130.451327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町太神',
  '瀬高町太神',
  '瀬高町太神',
  NULL,
  33.126393,
  130.475093,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町本吉',
  '瀬高町本吉',
  '瀬高町本吉',
  NULL,
  33.149179,
  130.516063,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町真弓',
  '山川町真弓',
  '山川町真弓',
  NULL,
  33.095048,
  130.555781,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町竹飯',
  '高田町竹飯',
  '高田町竹飯',
  NULL,
  33.120436,
  130.496495,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町濱田',
  '瀬高町濱田',
  '瀬高町濱田',
  NULL,
  33.131628,
  130.463304,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町亀谷',
  '高田町亀谷',
  '高田町亀谷',
  NULL,
  33.096776,
  130.52647,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町甲田',
  '山川町甲田',
  '山川町甲田',
  NULL,
  33.119695,
  130.543757,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町坂田',
  '瀬高町坂田',
  '瀬高町坂田',
  NULL,
  33.16325,
  130.496317,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町永治',
  '高田町永治',
  '高田町永治',
  NULL,
  33.090062,
  130.432317,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町舞鶴',
  '高田町舞鶴',
  '高田町舞鶴',
  NULL,
  33.114571,
  130.519191,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町濃施',
  '高田町濃施',
  '高田町濃施',
  NULL,
  33.100605,
  130.458637,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町大江',
  '瀬高町大江',
  '瀬高町大江',
  NULL,
  33.142985,
  130.478943,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町松田',
  '瀬高町松田',
  '瀬高町松田',
  NULL,
  33.143689,
  130.493254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町昭和開',
  '高田町昭和開',
  '高田町昭和開',
  NULL,
  33.08475,
  130.421163,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町原',
  '山川町原町',
  '山川町原町',
  NULL,
  33.11793,
  130.52522,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町長田',
  '瀬高町長田',
  '瀬高町長田',
  NULL,
  33.172774,
  130.50552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町上楠田',
  '高田町上楠田',
  '高田町上楠田',
  NULL,
  33.094506,
  130.489198,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町北関',
  '山川町北関',
  '山川町北関',
  NULL,
  33.092853,
  130.544041,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586539,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町河内',
  '瀬高町河内',
  '瀬高町河内',
  NULL,
  33.121179,
  130.45628,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町小川',
  '瀬高町小川',
  '瀬高町小川',
  NULL,
  33.152687,
  130.483717,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町岩津',
  '高田町岩津',
  '高田町岩津',
  NULL,
  33.114515,
  130.47068,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町原',
  '高田町原',
  '高田町原',
  NULL,
  33.107485,
  130.475092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586543,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町徳島',
  '高田町徳島',
  '高田町徳島',
  NULL,
  33.11423,
  130.437694,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町文廣',
  '瀬高町文廣',
  '瀬高町文廣',
  NULL,
  33.163429,
  130.481244,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町本郷',
  '瀬高町本郷',
  '瀬高町本郷',
  NULL,
  33.175192,
  130.481076,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町下楠田',
  '高田町下楠田',
  '高田町下楠田',
  NULL,
  33.096523,
  130.467148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町立山',
  '山川町立山',
  '山川町立山',
  NULL,
  33.130968,
  130.526033,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町高柳',
  '瀬高町高柳',
  '瀬高町高柳',
  NULL,
  33.146324,
  130.459802,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町海津',
  '高田町海津',
  '高田町海津',
  NULL,
  33.12532,
  130.480536,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山川町河原内',
  '山川町河原内',
  '山川町河原内',
  NULL,
  33.14628,
  130.537507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町上庄',
  '瀬高町上庄',
  '瀬高町上庄',
  NULL,
  33.16142,
  130.462257,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町今福',
  '高田町今福',
  '高田町今福',
  NULL,
  33.110409,
  130.461254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町大廣園',
  '瀬高町大廣園',
  '瀬高町大廣園',
  NULL,
  33.13648,
  130.490979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町飯江',
  '高田町飯江',
  '高田町飯江',
  NULL,
  33.115181,
  130.507761,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田町田浦',
  '高田町田浦',
  '高田町田浦',
  NULL,
  33.106462,
  130.505554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬高町廣瀬',
  '瀬高町廣瀬',
  '瀬高町廣瀬',
  NULL,
  33.177694,
  130.536082,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681586557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山田',
  '大字山田',
  '大字山田',
  NULL,
  33.484521,
  130.423194,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627631,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_観晴が丘',
  '観晴が丘',
  '観晴が丘',
  NULL,
  33.50883,
  130.444792,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627634,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西畑',
  '大字西畑',
  '大字西畑',
  NULL,
  33.488443,
  130.390894,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627635,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字道善',
  '大字道善',
  '大字道善',
  NULL,
  33.511696,
  130.420527,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627639,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字五郎丸',
  '大字五郎丸',
  '大字五郎丸',
  NULL,
  33.506624,
  130.432255,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字埋金',
  '大字埋金',
  '大字埋金',
  NULL,
  33.459785,
  130.445807,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627644,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字別所',
  '大字別所',
  '大字別所',
  NULL,
  33.485469,
  130.408051,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627654,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字成竹',
  '大字成竹',
  '大字成竹',
  NULL,
  33.454954,
  130.412194,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627658,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上梶原',
  '大字上梶原',
  '大字上梶原',
  NULL,
  33.481925,
  130.443092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627663,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字市ノ瀬',
  '大字市ノ瀬',
  '大字市ノ瀬',
  NULL,
  33.439673,
  130.436644,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東隈',
  '大字東隈',
  '大字東隈',
  NULL,
  33.503447,
  130.425921,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627676,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中原',
  '大字中原',
  '大字中原',
  NULL,
  33.506021,
  130.444957,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627680,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下梶原',
  '大字下梶原',
  '大字下梶原',
  NULL,
  33.499005,
  130.441123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627681,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字恵子',
  '大字恵子',
  '大字恵子',
  NULL,
  33.510335,
  130.419002,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627686,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字松木',
  '大字松木',
  '大字松木',
  NULL,
  33.502568,
  130.442959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627696,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_松原',
  '松原',
  '松原',
  NULL,
  33.507512,
  130.438404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627699,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西隈',
  '大字西隈',
  '大字西隈',
  NULL,
  33.498512,
  130.416585,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627700,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字仲',
  '大字仲',
  '大字仲',
  NULL,
  33.503926,
  130.43023,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字五ケ山',
  '大字五ケ山',
  '大字五ケ山',
  NULL,
  33.417864,
  130.423756,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字後野',
  '大字後野',
  '大字後野',
  NULL,
  33.504454,
  130.40012,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681627708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字不入道',
  '大字不入道',
  '大字不入道',
  NULL,
  33.472268,
  130.428092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681630718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字南面里',
  '大字南面里',
  '大字南面里',
  NULL,
  33.462565,
  130.396442,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681630722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字片縄',
  '大字片縄',
  '大字片縄',
  NULL,
  33.517261,
  130.408284,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681630727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字安徳',
  '大字安徳',
  '大字安徳',
  NULL,
  33.496774,
  130.426114,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681630730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_正門',
  '正門町',
  '正門町',
  NULL,
  33.889761,
  130.661709,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_緑ヶ丘',
  '緑ヶ丘',
  '緑ヶ丘',
  NULL,
  33.884792,
  130.668171,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_江川台',
  '江川台',
  '江川台',
  NULL,
  33.891672,
  130.682298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_船頭',
  '船頭町',
  '船頭町',
  NULL,
  33.892409,
  130.670248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山鹿',
  '山鹿',
  '山鹿',
  NULL,
  33.897973,
  130.668609,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字芦屋',
  '大字芦屋',
  '大字芦屋',
  NULL,
  33.884201,
  130.651902,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高浜',
  '高浜町',
  '高浜町',
  NULL,
  33.887923,
  130.670444,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山鹿',
  '大字山鹿',
  '大字山鹿',
  NULL,
  33.905809,
  130.667375,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中ノ浜',
  '中ノ浜',
  '中ノ浜',
  NULL,
  33.893511,
  130.666507,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691292,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_祇園',
  '祇園町',
  '祇園町',
  NULL,
  33.890127,
  130.674527,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691293,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西浜',
  '西浜町',
  '西浜町',
  NULL,
  33.897011,
  130.662874,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691294,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_幸',
  '幸町',
  '幸町',
  NULL,
  33.894591,
  130.661196,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_花美坂',
  '花美坂',
  '花美坂',
  NULL,
  33.904002,
  130.675181,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白浜',
  '白浜町',
  '白浜町',
  NULL,
  33.892672,
  130.660248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浜口',
  '浜口町',
  '浜口町',
  NULL,
  33.882507,
  130.671003,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681691298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字須惠',
  '大字須惠',
  '大字須惠',
  NULL,
  33.592831,
  130.506311,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字旅石',
  '大字旅石',
  '大字旅石',
  NULL,
  33.588244,
  130.497551,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字佐谷',
  '大字佐谷',
  '大字佐谷',
  NULL,
  33.587571,
  130.536078,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字植木_quarter',
  '大字植木',
  '大字植木',
  NULL,
  33.603921,
  130.502167,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上須惠',
  '大字上須惠',
  '大字上須惠',
  NULL,
  33.588338,
  130.516712,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新原',
  '大字新原',
  '大字新原',
  NULL,
  33.580985,
  130.509707,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681694483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字九郎丸',
  '大字九郎丸',
  '大字九郎丸',
  NULL,
  33.570661,
  130.666414,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉隈',
  '大字吉隈',
  '大字吉隈',
  NULL,
  33.591638,
  130.691515,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字寿命',
  '大字寿命',
  '大字寿命',
  NULL,
  33.59192,
  130.668865,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字瀬戸',
  '大字瀬戸',
  '大字瀬戸',
  NULL,
  33.596945,
  130.675475,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中屋',
  '大字中屋',
  '大字中屋',
  NULL,
  33.592852,
  130.65805,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字土居',
  '大字土居',
  '大字土居',
  NULL,
  33.587069,
  130.675753,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字土師',
  '大字土師',
  '大字土師',
  NULL,
  33.567032,
  130.682028,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字内山田',
  '大字内山田',
  '大字内山田',
  NULL,
  33.540182,
  130.676222,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字豆田',
  '大字豆田',
  '大字豆田',
  NULL,
  33.58472,
  130.66253,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681711490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東下',
  '大字東下',
  '大字東下',
  NULL,
  33.547592,
  131.159482,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713978,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字土佐井',
  '大字土佐井',
  '大字土佐井',
  NULL,
  33.560334,
  131.150618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字百留',
  '大字百留',
  '大字百留',
  NULL,
  33.542087,
  131.180247,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713980,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字緒方',
  '大字緒方',
  '大字緒方',
  NULL,
  33.579155,
  131.136488,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713981,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中_quarter',
  '大字中村',
  '大字中村',
  NULL,
  33.593731,
  131.157554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713982,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字矢方',
  '大字矢方',
  '大字矢方',
  NULL,
  33.568055,
  131.127265,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上唐原',
  '大字上唐原',
  '大字上唐原',
  NULL,
  33.547583,
  131.180899,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字成恒',
  '大字成恒',
  '大字成恒',
  NULL,
  33.583375,
  131.145588,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字安雲',
  '大字安雲',
  '大字安雲',
  NULL,
  33.574508,
  131.147191,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字八ツ並',
  '大字八ツ並',
  '大字八ツ並',
  NULL,
  33.583953,
  131.155524,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉岡',
  '大字吉岡',
  '大字吉岡',
  NULL,
  33.590024,
  131.161185,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字尻高',
  '大字尻高',
  '大字尻高',
  NULL,
  33.560171,
  131.130855,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西友枝',
  '大字西友枝',
  '大字西友枝',
  NULL,
  33.529376,
  131.109738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713990,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宇野',
  '大字宇野',
  '大字宇野',
  NULL,
  33.574854,
  131.156947,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713991,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下唐原',
  '大字下唐原',
  '大字下唐原',
  NULL,
  33.557904,
  131.169434,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字原井',
  '大字原井',
  '大字原井',
  NULL,
  33.522102,
  131.164604,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大ノ瀬',
  '大字大ノ瀬',
  '大字大ノ瀬',
  NULL,
  33.588746,
  131.152775,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東上',
  '大字東上',
  '大字東上',
  NULL,
  33.522109,
  131.138451,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字垂水',
  '大字垂水',
  '大字垂水',
  NULL,
  33.580482,
  131.168893,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681713996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字福井',
  '大字福井',
  '大字福井',
  NULL,
  33.393317,
  130.87128,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681716042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宝珠山',
  '大字宝珠山',
  '大字宝珠山',
  NULL,
  33.423417,
  130.87836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681716043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小石原_quarter',
  '大字小石原',
  '大字小石原',
  NULL,
  33.46975,
  130.812582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681716044,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小石原鼓',
  '大字小石原鼓',
  '大字小石原鼓',
  NULL,
  33.430371,
  130.846595,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681716045,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大隈',
  '大字大隈',
  '大字大隈',
  NULL,
  33.61894,
  130.491486,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681716999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字仲原',
  '大字仲原',
  '大字仲原',
  NULL,
  33.610123,
  130.460471,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681717007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字内橋',
  '大字内橋',
  '大字内橋',
  NULL,
  33.6173708,
  130.4539131,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681717010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小牧',
  '大字小牧',
  '大字小牧',
  NULL,
  33.796378,
  130.697049,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長谷',
  '大字長谷',
  '大字長谷',
  NULL,
  33.756504,
  130.676357,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上木月',
  '大字上木月',
  '大字上木月',
  NULL,
  33.806394,
  130.68769,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字古門',
  '大字古門',
  '大字古門',
  NULL,
  33.807992,
  130.652692,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字木月',
  '大字木月',
  '大字木月',
  NULL,
  33.808976,
  130.675583,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字室木',
  '大字室木',
  '大字室木',
  NULL,
  33.750544,
  130.664086,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山田_quarter',
  '大字山田',
  '大字山田',
  NULL,
  33.663439,
  130.488139,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字猪野',
  '大字猪野',
  '大字猪野',
  NULL,
  33.683109,
  130.521948,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字久原',
  '大字久原',
  '大字久原',
  NULL,
  33.65525,
  130.529634,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681722793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下片島',
  '大字下片島',
  '大字下片島',
  NULL,
  33.752297,
  130.955983,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上片島',
  '大字上片島',
  '大字上片島',
  NULL,
  33.7412882,
  130.9550477,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724030,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字光国',
  '大字光国',
  '大字光国',
  NULL,
  33.781674,
  130.966385,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724031,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字雨窪',
  '大字雨窪',
  '大字雨窪',
  NULL,
  33.791334,
  130.966519,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724034,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字浜',
  '大字浜町',
  '大字浜町',
  NULL,
  33.766874,
  130.982149,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_空港南',
  '空港南町',
  '空港南町',
  NULL,
  33.827802,
  131.035274,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724036,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_港',
  '港町',
  '港町',
  NULL,
  33.789228,
  130.992804,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724037,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下新津',
  '大字下新津',
  '大字下新津',
  NULL,
  33.754321,
  130.981729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724039,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字尾倉',
  '大字尾倉',
  '大字尾倉',
  NULL,
  33.761909,
  130.966352,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724042,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字松山',
  '大字松山',
  '大字松山',
  NULL,
  33.803741,
  130.985412,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724043,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字集',
  '大字集',
  '大字集',
  NULL,
  33.76814,
  130.964421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724046,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字馬場_quarter_8681724047',
  '大字馬場',
  '大字馬場',
  NULL,
  33.779078,
  130.972679,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724047,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_松原_quarter',
  '松原町',
  '松原町',
  NULL,
  33.799002,
  130.98479,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724049,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字黒添',
  '大字黒添',
  '大字黒添',
  NULL,
  33.747354,
  130.928882,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724051,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字与原',
  '大字与原',
  '大字与原',
  NULL,
  33.754034,
  130.99236,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_殿川',
  '殿川町',
  '殿川町',
  NULL,
  33.772389,
  130.986106,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字岡崎',
  '大字岡崎',
  '大字岡崎',
  NULL,
  33.740274,
  130.945686,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字法正寺',
  '大字法正寺',
  '大字法正寺',
  NULL,
  33.751242,
  130.917948,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桜ヶ丘',
  '桜ヶ丘',
  '桜ヶ丘',
  NULL,
  33.757663,
  130.97385,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字谷',
  '大字谷',
  '大字谷',
  NULL,
  33.758551,
  130.921835,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長浜',
  '長浜町',
  '長浜町',
  NULL,
  33.782072,
  130.995314,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字葛川',
  '大字葛川',
  '大字葛川',
  NULL,
  33.751399,
  130.947849,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724064,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山口',
  '大字山口',
  '大字山口',
  NULL,
  33.768421,
  130.936141,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724066,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新浜',
  '新浜町',
  '新浜町',
  NULL,
  33.767125,
  131.00061,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724067,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字稲光',
  '大字稲光',
  '大字稲光',
  NULL,
  33.752698,
  130.938254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字二崎',
  '大字二崎',
  '大字二崎',
  NULL,
  33.746133,
  130.987197,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724069,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_幸_quarter',
  '幸町',
  '幸町',
  NULL,
  33.791659,
  130.984213,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鋤崎',
  '大字鋤崎',
  '大字鋤崎',
  NULL,
  33.744348,
  130.938615,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鳥越',
  '鳥越町',
  '鳥越町',
  NULL,
  33.8120121,
  130.9981025,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724075,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字苅田',
  '大字苅田',
  '大字苅田',
  NULL,
  33.805785,
  130.980271,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字南原',
  '大字南原',
  '大字南原',
  NULL,
  33.775794,
  130.964109,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724078,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新津',
  '大字新津',
  '大字新津',
  NULL,
  33.750547,
  130.966476,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724081,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字提',
  '大字提',
  '大字提',
  NULL,
  33.788255,
  130.972767,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724082,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_近衛ヶ丘',
  '近衛ヶ丘',
  '近衛ヶ丘',
  NULL,
  33.766106,
  130.976894,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681724083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字赤地_quarter',
  '大字赤地',
  '大字赤地',
  NULL,
  33.724843,
  130.720624,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726343,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字勝野',
  '大字勝野',
  '大字勝野',
  NULL,
  33.695323,
  130.705405,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726344,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字御徳',
  '大字御徳',
  '大字御徳',
  NULL,
  33.71122,
  130.716876,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新山崎',
  '大字新山崎',
  '大字新山崎',
  NULL,
  33.713249,
  130.69944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字南良津',
  '大字南良津',
  '大字南良津',
  NULL,
  33.716818,
  130.705793,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726347,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新多',
  '大字新多',
  '大字新多',
  NULL,
  33.693383,
  130.685862,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681726348,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_砥上',
  '砥上',
  '砥上',
  NULL,
  33.478756,
  130.600043,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728365,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吹田',
  '吹田',
  '吹田',
  NULL,
  33.470836,
  130.590266,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728366,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_朝園',
  '朝園',
  '朝園',
  NULL,
  33.426049,
  130.635384,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_曽根田',
  '曽根田',
  '曽根田',
  NULL,
  33.482357,
  130.614448,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728368,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_櫛木',
  '櫛木',
  '櫛木',
  NULL,
  33.499582,
  130.660591,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728369,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_野',
  '野町',
  '野町',
  NULL,
  33.423152,
  130.62361,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728370,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_森山',
  '森山',
  '森山',
  NULL,
  33.455747,
  130.629721,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728371,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_松延',
  '松延',
  '松延',
  NULL,
  33.463259,
  130.587469,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_石櫃',
  '石櫃',
  '石櫃',
  NULL,
  33.465286,
  130.580915,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728373,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三箇山',
  '三箇山',
  '三箇山',
  NULL,
  33.488374,
  130.647857,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728374,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高上',
  '高上',
  '高上',
  NULL,
  33.426716,
  130.620295,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山隈',
  '山隈',
  '山隈',
  NULL,
  33.420314,
  130.609787,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728376,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_原地蔵',
  '原地蔵',
  '原地蔵',
  NULL,
  33.409459,
  130.616381,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728377,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大久保',
  '大久保',
  '大久保',
  NULL,
  33.429975,
  130.613421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_篠隈',
  '篠隈',
  '篠隈',
  NULL,
  33.457824,
  130.600221,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728379,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_当所',
  '当所',
  '当所',
  NULL,
  33.451244,
  130.618309,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久光',
  '久光',
  '久光',
  NULL,
  33.438994,
  130.634828,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_赤坂',
  '赤坂',
  '赤坂',
  NULL,
  33.480188,
  130.589599,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上高場',
  '上高場',
  '上高場',
  NULL,
  33.437291,
  130.619674,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728383,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新_quarter_8681728384',
  '新町',
  '新町',
  NULL,
  33.43368,
  130.638157,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三牟田',
  '三牟田',
  '三牟田',
  NULL,
  33.472773,
  130.607045,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中牟田',
  '中牟田',
  '中牟田',
  NULL,
  33.466618,
  130.575483,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728386,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二',
  '二',
  '二',
  NULL,
  33.476485,
  130.564312,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728387,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_朝日',
  '朝日',
  '朝日',
  NULL,
  33.466769,
  130.566979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728388,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_畑嶋',
  '畑嶋',
  '畑嶋',
  NULL,
  33.462333,
  130.629801,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728389,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_栗田',
  '栗田',
  '栗田',
  NULL,
  33.453848,
  130.636006,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728390,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田',
  '高田',
  '高田',
  NULL,
  33.419065,
  130.630201,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728391,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_安野',
  '安野',
  '安野',
  NULL,
  33.443417,
  130.595108,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728392,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_弥永',
  '弥永',
  '弥永',
  NULL,
  33.442405,
  130.649567,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_四三嶋',
  '四三嶋',
  '四三嶋',
  NULL,
  33.432575,
  130.592451,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長者',
  '長者町',
  '長者町',
  NULL,
  33.45427,
  130.609547,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_依井',
  '依井',
  '依井',
  NULL,
  33.429917,
  130.643468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728396,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東小田',
  '東小田',
  '東小田',
  NULL,
  33.451421,
  130.57931,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728397,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大塚',
  '大塚',
  '大塚',
  NULL,
  33.435008,
  130.653425,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下高場',
  '下高場',
  '下高場',
  NULL,
  33.440834,
  130.604669,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728399,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三並',
  '三並',
  '三並',
  NULL,
  33.474469,
  130.625972,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728400,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長者原',
  '大字長者原',
  '大字長者原',
  NULL,
  33.612622,
  130.482344,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字阿惠',
  '大字阿惠',
  '大字阿惠',
  NULL,
  33.615429,
  130.458298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字戸原',
  '大字戸原',
  '大字戸原',
  NULL,
  33.6310437,
  130.4686658,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字酒殿',
  '大字酒殿',
  '大字酒殿',
  NULL,
  33.599381,
  130.481582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字柚須',
  '大字柚須',
  '大字柚須',
  NULL,
  33.614368,
  130.445591,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上大隈',
  '大字上大隈',
  '大字上大隈',
  NULL,
  33.62869,
  130.492193,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字江辻',
  '大字江辻',
  '大字江辻',
  NULL,
  33.62895,
  130.475973,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字原',
  '大字原町',
  '大字原町',
  NULL,
  33.613224,
  130.462546,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681728446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字永谷',
  '大字永谷',
  '大字永谷',
  NULL,
  33.798622,
  130.641967,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745918,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字八尋',
  '大字八尋',
  '大字八尋',
  NULL,
  33.766788,
  130.660837,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745919,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中山',
  '大字中山',
  '大字中山',
  NULL,
  33.782242,
  130.688328,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745920,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新北',
  '大字新北',
  '大字新北',
  NULL,
  33.775057,
  130.676378,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745922,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字猪倉',
  '大字猪倉',
  '大字猪倉',
  NULL,
  33.799315,
  130.684535,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新延',
  '大字新延',
  '大字新延',
  NULL,
  33.787687,
  130.657323,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681745925,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_糸田',
  '糸田',
  '糸田',
  NULL,
  33.655374,
  130.772925,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681748895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川宮',
  '川宮',
  '川宮',
  NULL,
  33.655489,
  130.789424,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681748896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鵜木',
  '大字鵜木',
  '大字鵜木',
  NULL,
  33.387019,
  130.592755,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高樋',
  '大字高樋',
  '大字高樋',
  NULL,
  33.394043,
  130.597714,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字春日_quarter',
  '大字春日',
  '大字春日',
  NULL,
  33.376995,
  130.610636,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字冨多',
  '大字冨多',
  '大字冨多',
  NULL,
  33.371196,
  130.617298,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上高橋',
  '大字上高橋',
  '大字上高橋',
  NULL,
  33.375526,
  130.600515,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中川_quarter',
  '大字中川',
  '大字中川',
  NULL,
  33.366652,
  130.607972,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字守部',
  '大字守部',
  '大字守部',
  NULL,
  33.358754,
  130.631019,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字甲条',
  '大字甲条',
  '大字甲条',
  NULL,
  33.39048,
  130.611481,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681749999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西原',
  '大字西原',
  '大字西原',
  NULL,
  33.36215,
  130.636463,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山隈',
  '大字山隈',
  '大字山隈',
  NULL,
  33.401934,
  130.609581,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字栄田',
  '大字栄田',
  '大字栄田',
  NULL,
  33.380626,
  130.635478,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字本郷',
  '大字本郷',
  '大字本郷',
  NULL,
  33.384045,
  130.622887,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750003,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下高橋',
  '大字下高橋',
  '大字下高橋',
  NULL,
  33.382099,
  130.586831,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字三川',
  '大字三川',
  '大字三川',
  NULL,
  33.366895,
  130.646345,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750005,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字今_quarter',
  '大字今',
  '大字今',
  NULL,
  33.369491,
  130.598186,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750006,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字菅野',
  '大字菅野',
  '大字菅野',
  NULL,
  33.368754,
  130.631936,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字野田_quarter',
  '大字野田',
  '大字野田',
  NULL,
  33.551656,
  130.86269,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字英彦山',
  '大字英彦山',
  '大字英彦山',
  NULL,
  33.475905,
  130.907053,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字落合',
  '大字落合',
  '大字落合',
  NULL,
  33.489634,
  130.862296,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字桝田',
  '大字桝田',
  '大字桝田',
  NULL,
  33.521138,
  130.876404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字庄',
  '大字庄',
  '大字庄',
  NULL,
  33.572631,
  130.8451,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字添田',
  '大字添田',
  '大字添田',
  NULL,
  33.561985,
  130.868137,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750013,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中元寺',
  '大字中元寺',
  '大字中元寺',
  NULL,
  33.528365,
  130.840741,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字津野',
  '大字津野',
  '大字津野',
  NULL,
  33.534824,
  130.907415,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681750015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字久泉',
  '大字久泉',
  '大字久泉',
  NULL,
  33.244033,
  130.560071,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字一條',
  '大字一條',
  '大字一條',
  NULL,
  33.244761,
  130.516567,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759788,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字日吉',
  '大字日吉',
  '大字日吉',
  NULL,
  33.255423,
  130.550256,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字太田',
  '大字太田',
  '大字太田',
  NULL,
  33.235079,
  130.541619,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字広川',
  '大字広川',
  '大字広川',
  NULL,
  33.242664,
  130.531224,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759791,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字川上',
  '大字川上',
  '大字川上',
  NULL,
  33.236021,
  130.560195,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759792,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字藤田',
  '大字藤田',
  '大字藤田',
  NULL,
  33.255727,
  130.525634,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759793,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小椎尾',
  '大字小椎尾',
  '大字小椎尾',
  NULL,
  33.270773,
  130.606806,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759794,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字水原',
  '大字水原',
  '大字水原',
  NULL,
  33.253533,
  130.605286,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759795,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字長延',
  '大字長延',
  '大字長延',
  NULL,
  33.259434,
  130.57007,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759796,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉常',
  '大字吉常',
  '大字吉常',
  NULL,
  33.249929,
  130.576775,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759797,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字新代',
  '大字新代',
  '大字新代',
  NULL,
  33.247847,
  130.540095,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759798,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字六田',
  '大字六田',
  '大字六田',
  NULL,
  33.236476,
  130.568398,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681759799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高野',
  '大字高野',
  '大字高野',
  NULL,
  33.665901,
  130.857343,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762927,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中津原',
  '大字中津原',
  '大字中津原',
  NULL,
  33.653982,
  130.848893,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鏡山',
  '大字鏡山',
  '大字鏡山',
  NULL,
  33.673191,
  130.873871,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762929,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字柿下',
  '大字柿下',
  '大字柿下',
  NULL,
  33.648663,
  130.874054,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762930,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字香春',
  '大字香春',
  '大字香春',
  NULL,
  33.677806,
  130.838506,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字採銅所',
  '大字採銅所',
  '大字採銅所',
  NULL,
  33.709403,
  130.851176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681762932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字川崎',
  '大字川崎',
  '大字川崎',
  NULL,
  33.59093,
  130.816851,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681764421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字田原',
  '大字田原',
  '大字田原',
  NULL,
  33.606443,
  130.814,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681764422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字安眞木',
  '大字安眞木',
  '大字安眞木',
  NULL,
  33.546305,
  130.816949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681764423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字池尻',
  '大字池尻',
  '大字池尻',
  NULL,
  33.616643,
  130.804821,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681764424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上野',
  '上野',
  '上野',
  NULL,
  33.720068,
  130.780427,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_伊方',
  '伊方',
  '伊方',
  NULL,
  33.695734,
  130.810369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_市場',
  '市場',
  '市場',
  NULL,
  33.706027,
  130.757047,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_金田',
  '金田',
  '金田',
  NULL,
  33.679605,
  130.779845,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_神崎',
  '神崎',
  '神崎',
  NULL,
  33.675371,
  130.764628,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_弁城',
  '弁城',
  '弁城',
  NULL,
  33.708255,
  130.797624,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_赤池',
  '赤池',
  '赤池',
  NULL,
  33.693175,
  130.762115,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字鈴熊',
  '大字鈴熊',
  '大字鈴熊',
  NULL,
  33.603667,
  131.165934,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字土屋',
  '大字土屋',
  '大字土屋',
  NULL,
  33.606197,
  131.161039,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字直江',
  '大字直江',
  '大字直江',
  NULL,
  33.609036,
  131.16624,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字今吉',
  '大字今吉',
  '大字今吉',
  NULL,
  33.599343,
  131.168148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字楡生',
  '大字楡生',
  '大字楡生',
  NULL,
  33.600913,
  131.163944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小犬丸_quarter',
  '大字小犬丸',
  '大字小犬丸',
  NULL,
  33.613194,
  131.17643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字別府_quarter',
  '大字別府',
  '大字別府',
  NULL,
  33.600479,
  131.159778,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小祝',
  '大字小祝',
  '大字小祝',
  NULL,
  33.617903,
  131.179906,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字広津',
  '大字広津',
  '大字広津',
  NULL,
  33.605613,
  131.172867,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字幸子',
  '大字幸子',
  '大字幸子',
  NULL,
  33.594192,
  131.170688,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681766611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山矢山',
  '勝山矢山',
  '勝山矢山',
  NULL,
  33.717342,
  130.889478,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川上伊良原',
  '犀川上伊良原',
  '犀川上伊良原',
  NULL,
  33.551137,
  130.945022,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川柳瀬',
  '犀川柳瀬',
  '犀川柳瀬',
  NULL,
  33.6439273,
  130.9221698,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山黒田',
  '勝山黒田',
  '勝山黒田',
  NULL,
  33.709554,
  130.924571,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川生立',
  '犀川生立',
  '犀川生立',
  NULL,
  33.6555558,
  130.9377782,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山浦河内',
  '勝山浦河内',
  '勝山浦河内',
  NULL,
  33.718743,
  130.876597,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川久富',
  '犀川久富',
  '犀川久富',
  NULL,
  33.6594934,
  130.958498,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川続命院',
  '犀川続命院',
  '犀川続命院',
  NULL,
  33.6616821,
  130.952875,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_豊津',
  '豊津',
  '豊津',
  NULL,
  33.673691,
  130.972126,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_綾野',
  '綾野',
  '綾野',
  NULL,
  33.671516,
  130.989195,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_国作',
  '国作',
  '国作',
  NULL,
  33.687229,
  130.987334,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川木山',
  '犀川木山',
  '犀川木山',
  NULL,
  33.6630251,
  130.9400552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_節丸',
  '節丸',
  '節丸',
  NULL,
  33.643037,
  130.978264,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山宮原',
  '勝山宮原',
  '勝山宮原',
  NULL,
  33.704506,
  130.890609,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川大',
  '犀川大村',
  '犀川大村',
  NULL,
  33.6501454,
  130.9251377,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川八ツ溝',
  '犀川八ツ溝',
  '犀川八ツ溝',
  NULL,
  33.656281,
  130.9440306,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山上矢山',
  '勝山上矢山',
  '勝山上矢山',
  NULL,
  33.732659,
  130.886739,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山上田',
  '勝山上田',
  '勝山上田',
  NULL,
  33.695922,
  130.92329,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川内垣',
  '犀川内垣',
  '犀川内垣',
  NULL,
  33.637987,
  130.965981,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川末江',
  '犀川末江',
  '犀川末江',
  NULL,
  33.644818,
  130.957723,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_徳永',
  '徳永',
  '徳永',
  NULL,
  33.686474,
  130.998785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_呰見',
  '呰見',
  '呰見',
  NULL,
  33.678306,
  130.997909,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_彦徳',
  '彦徳',
  '彦徳',
  NULL,
  33.680938,
  130.963671,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川喜多良',
  '犀川喜多良',
  '犀川喜多良',
  NULL,
  33.6156158,
  130.9233073,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下原',
  '下原',
  '下原',
  NULL,
  33.672317,
  130.997712,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山箕田',
  '勝山箕田',
  '勝山箕田',
  NULL,
  33.697812,
  130.891869,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川大坂',
  '犀川大坂',
  '犀川大坂',
  NULL,
  33.653811,
  130.899771,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川本庄',
  '犀川本庄',
  '犀川本庄',
  NULL,
  33.6474705,
  130.939632,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山岩熊',
  '勝山岩熊',
  '勝山岩熊',
  NULL,
  33.709625,
  130.891423,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川犬丸',
  '犀川犬丸',
  '犀川犬丸',
  NULL,
  33.623749,
  130.974478,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_徳政',
  '徳政',
  '徳政',
  NULL,
  33.677869,
  130.986707,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川下高屋',
  '犀川下高屋',
  '犀川下高屋',
  NULL,
  33.639185,
  130.94806,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上原',
  '上原',
  '上原',
  NULL,
  33.663459,
  130.983528,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川木井馬場',
  '犀川木井馬場',
  '犀川木井馬場',
  NULL,
  33.620542,
  130.963332,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川横瀬',
  '犀川横瀬',
  '犀川横瀬',
  NULL,
  33.597383,
  130.95639,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山松田',
  '勝山松田',
  '勝山松田',
  NULL,
  33.680064,
  130.893742,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川大熊',
  '犀川大熊',
  '犀川大熊',
  NULL,
  33.6367572,
  130.9333396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川帆柱',
  '犀川帆柱',
  '犀川帆柱',
  NULL,
  33.510431,
  130.958446,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉岡',
  '吉岡',
  '吉岡',
  NULL,
  33.662468,
  130.989831,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川花熊',
  '犀川花熊',
  '犀川花熊',
  NULL,
  33.6723006,
  130.9527673,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川鐙畑',
  '犀川鐙畑',
  '犀川鐙畑',
  NULL,
  33.587902,
  130.923057,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山池田',
  '勝山池田',
  '勝山池田',
  NULL,
  33.715603,
  130.901532,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川下伊良原',
  '犀川下伊良原',
  '犀川下伊良原',
  NULL,
  33.578404,
  130.944352,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田中',
  '田中',
  '田中',
  NULL,
  33.688671,
  130.993423,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上坂',
  '上坂',
  '上坂',
  NULL,
  33.66811,
  130.978733,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川上高屋',
  '犀川上高屋',
  '犀川上高屋',
  NULL,
  33.6233209,
  130.9459229,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川山鹿',
  '犀川山鹿',
  '犀川山鹿',
  NULL,
  33.6480713,
  130.9308525,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山長川',
  '勝山長川',
  '勝山長川',
  NULL,
  33.710189,
  130.898942,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川扇谷',
  '犀川扇谷',
  '犀川扇谷',
  NULL,
  33.534388,
  130.949919,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝山大久保',
  '勝山大久保',
  '勝山大久保',
  NULL,
  33.679992,
  130.915204,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川古川',
  '犀川古川',
  '犀川古川',
  NULL,
  33.652907,
  130.9487643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川谷口',
  '犀川谷口',
  '犀川谷口',
  NULL,
  33.6590768,
  130.9328832,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_光冨',
  '光冨',
  '光冨',
  NULL,
  33.6554767,
  130.9785203,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_有久',
  '有久',
  '有久',
  NULL,
  33.680957,
  130.990738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_国分',
  '国分',
  '国分',
  NULL,
  33.679934,
  130.978372,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_犀川崎山',
  '犀川崎山',
  '犀川崎山',
  NULL,
  33.628612,
  130.913177,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_惣社',
  '惣社',
  '惣社',
  NULL,
  33.686239,
  130.981513,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681772478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字臼田',
  '大字臼田',
  '大字臼田',
  NULL,
  33.651159,
  131.053044,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795052,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下深野',
  '大字下深野',
  '大字下深野',
  NULL,
  33.643348,
  130.996144,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795053,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字安武',
  '大字安武',
  '大字安武',
  NULL,
  33.658254,
  131.008926,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795054,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字有安',
  '大字有安',
  '大字有安',
  NULL,
  33.631306,
  131.08261,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795055,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字極楽寺',
  '大字極楽寺',
  '大字極楽寺',
  NULL,
  33.59476,
  131.028847,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字船迫',
  '大字船迫',
  '大字船迫',
  NULL,
  33.658105,
  130.997421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795057,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上香楽',
  '大字上香楽',
  '大字上香楽',
  NULL,
  33.628739,
  131.00015,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795058,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西八田',
  '大字西八田',
  '大字西八田',
  NULL,
  33.681623,
  131.047013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字築城',
  '大字築城',
  '大字築城',
  NULL,
  33.665003,
  131.037009,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上ノ河内',
  '大字上ノ河内',
  '大字上ノ河内',
  NULL,
  33.610386,
  131.060194,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795061,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下香楽',
  '大字下香楽',
  '大字下香楽',
  NULL,
  33.640381,
  131.006606,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字湊',
  '大字湊',
  '大字湊',
  NULL,
  33.646134,
  131.070484,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795063,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上り松',
  '大字上り松',
  '大字上り松',
  NULL,
  33.624757,
  131.055116,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795064,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字越路',
  '大字越路',
  '大字越路',
  NULL,
  33.654332,
  131.041546,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795065,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字広末',
  '大字広末',
  '大字広末',
  NULL,
  33.653898,
  131.027742,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795066,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小山田',
  '大字小山田',
  '大字小山田',
  NULL,
  33.622518,
  131.010581,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795067,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字高塚',
  '大字高塚',
  '大字高塚',
  NULL,
  33.66133,
  131.056703,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字岩丸',
  '大字岩丸',
  '大字岩丸',
  NULL,
  33.598738,
  131.014249,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795069,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字椎田',
  '大字椎田',
  '大字椎田',
  NULL,
  33.648915,
  131.057149,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795070,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字水原_quarter',
  '大字水原',
  '大字水原',
  NULL,
  33.644657,
  131.038369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795071,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字赤幡',
  '大字赤幡',
  '大字赤幡',
  NULL,
  33.655445,
  131.017801,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795072,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字袈裟丸',
  '大字袈裟丸',
  '大字袈裟丸',
  NULL,
  33.647281,
  131.001851,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795073,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字日奈古',
  '大字日奈古',
  '大字日奈古',
  NULL,
  33.632461,
  131.03967,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字小原',
  '大字小原',
  '大字小原',
  NULL,
  33.630812,
  131.052332,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795075,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字真如寺',
  '大字真如寺',
  '大字真如寺',
  NULL,
  33.591024,
  131.03735,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795076,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字弓の師',
  '大字弓の師',
  '大字弓の師',
  NULL,
  33.675098,
  131.014619,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795077,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字櫟原',
  '大字櫟原',
  '大字櫟原',
  NULL,
  33.582174,
  130.996435,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795078,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字寒田',
  '大字寒田',
  '大字寒田',
  NULL,
  33.541058,
  130.987615,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795079,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字松丸',
  '大字松丸',
  '大字松丸',
  NULL,
  33.628052,
  130.987959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795080,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上別府',
  '大字上別府',
  '大字上別府',
  NULL,
  33.669556,
  131.023244,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795081,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東八田',
  '大字東八田',
  '大字東八田',
  NULL,
  33.671637,
  131.046066,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795082,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字奈古',
  '大字奈古',
  '大字奈古',
  NULL,
  33.636933,
  131.030277,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字宇留津',
  '大字宇留津',
  '大字宇留津',
  NULL,
  33.672261,
  131.055975,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下別府',
  '大字下別府',
  '大字下別府',
  NULL,
  33.676076,
  131.027119,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山本',
  '大字山本',
  '大字山本',
  NULL,
  33.635632,
  131.048115,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字石堂',
  '大字石堂',
  '大字石堂',
  NULL,
  33.623422,
  131.060405,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795087,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字坂本_quarter',
  '大字坂本',
  '大字坂本',
  NULL,
  33.649634,
  131.047457,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795088,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字本庄',
  '大字本庄',
  '大字本庄',
  NULL,
  33.585809,
  130.975485,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上深野',
  '大字上深野',
  '大字上深野',
  NULL,
  33.63571,
  130.990796,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795090,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字東築城',
  '大字東築城',
  '大字東築城',
  NULL,
  33.671937,
  131.037779,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795091,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字伝法寺',
  '大字伝法寺',
  '大字伝法寺',
  NULL,
  33.617691,
  130.986305,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8681795092,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokomizo',
  '横溝',
  'よこみぞ',
  '{"en":"Yokomizo"}'::jsonb,
  33.223417,
  130.428019,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takahashi',
  '高橋',
  'たかはし',
  '{"en":"Takahashi"}'::jsonb,
  33.1898577,
  130.4545873,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sasabuchi',
  '笹渕',
  'ささぶち',
  '{"en":"Sasabuchi"}'::jsonb,
  33.241337,
  130.4457877,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ozumi',
  '大角',
  'おおずみ',
  '{"en":"Ozumi"}'::jsonb,
  33.226092,
  130.449737,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oyabu',
  '大藪',
  'おおやぶ',
  '{"en":"Oyabu"}'::jsonb,
  33.1913548,
  130.4454575,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okumuta',
  '奥牟田',
  'おくむた',
  '{"en":"Okumuta"}'::jsonb,
  33.1985561,
  130.4470414,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyamatsu',
  '三八松',
  'みやまつ',
  '{"en":"Miyamatsu"}'::jsonb,
  33.189894,
  130.437617,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721923316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_maemuta',
  '前牟田',
  'まえむた',
  '{"en":"Maemuta"}'::jsonb,
  33.2302063,
  130.4405052,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamishirakaki',
  '上白垣',
  'かみしらかき',
  '{"en":"Kamishirakaki"}'::jsonb,
  33.218153,
  130.425858,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamimutaguchi',
  '上牟田口',
  'かみむたぐち',
  '{"en":"Kamimutaguchi"}'::jsonb,
  33.1991891,
  130.4260993,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamikisaki',
  '上木佐木',
  'かみきさき',
  '{"en":"Kamikisaki"}'::jsonb,
  33.2029004,
  130.4355276,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamihachiin',
  '上八院',
  'かみはちいん',
  '{"en":"Kamihachiin"}'::jsonb,
  33.2133939,
  130.4297498,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ikadamizo',
  '筏溝',
  'いかだみぞ',
  '{"en":"Ikadamizo"}'::jsonb,
  33.197394,
  130.434366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hiruike',
  '蛭池',
  'ひるいけ',
  '{"en":"Hiruike"}'::jsonb,
  33.2160579,
  130.4543635,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatchomuta',
  '八町牟田',
  'はっちょうむた',
  '{"en":"Hatchomuta"}'::jsonb,
  33.2114156,
  130.4340077,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fukudo',
  '福土',
  'ふくど',
  '{"en":"Fukudo"}'::jsonb,
  33.2310086,
  130.456278,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_egekoga',
  '絵下古賀',
  'えげこが',
  '{"en":"Egekoga"}'::jsonb,
  33.2063108,
  130.4366462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8721969026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakabadai',
  '若葉台',
  'わかばだい',
  '{"en":"Wakabadai"}'::jsonb,
  33.824683,
  130.652738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300924,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_rengaku',
  '蓮角',
  'れんがく',
  '{"en":"Rengaku"}'::jsonb,
  33.8369988,
  130.6653951,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300925,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mushozu_minami',
  '虫生津南',
  'むしょうづみなみ',
  '{"en":"Mushozu-minami"}'::jsonb,
  33.8209077,
  130.6664128,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300926,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimado',
  '島門',
  'しまど',
  '{"en":"Shimado"}'::jsonb,
  33.8568129,
  130.6637228,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300940,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakamatsu_quarter',
  '若松',
  'わかまつ',
  '{"en":"Wakamatsu"}'::jsonb,
  33.8686757,
  130.6691647,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300946,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mushozu',
  '虫生津',
  'むしょうづ',
  '{"en":"Mushozu"}'::jsonb,
  33.8235329,
  130.6565969,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300947,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_befu',
  '別府',
  'べふ',
  '{"en":"Befu"}'::jsonb,
  33.8478414,
  130.6581399,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300948,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hirowatari',
  '広渡',
  'ひろわたり',
  '{"en":"Hirowatari"}'::jsonb,
  33.8591773,
  130.675813,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300949,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimazu',
  '島津',
  'しまづ',
  '{"en":"Shimazu"}'::jsonb,
  33.878017,
  130.674239,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300950,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kimori',
  '木守',
  'きもり',
  '{"en":"Kimori"}'::jsonb,
  33.839933,
  130.671564,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300951,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamibefu',
  '上別府',
  'かみべふ',
  '{"en":"Kamibefu"}'::jsonb,
  33.8321596,
  130.6542933,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_onizu',
  '鬼津',
  'おにづ',
  '{"en":"Onizu"}'::jsonb,
  33.8670471,
  130.6579152,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ozaki',
  '尾崎',
  'おざき',
  '{"en":"Ozaki"}'::jsonb,
  33.8594308,
  130.6484872,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300954,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oira',
  '老良',
  'おいら',
  '{"en":"Oira"}'::jsonb,
  33.837713,
  130.685308,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300955,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imakoga',
  '今古賀',
  'いまこが',
  '{"en":"Imakoga"}'::jsonb,
  33.8468549,
  130.6635268,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300956,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asagi',
  '浅木',
  'あさぎ',
  '{"en":"Asagi"}'::jsonb,
  33.8323701,
  130.6761412,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723300957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamada',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  33.856792,
  130.631371,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723313199,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_noma',
  '野間',
  'のま',
  '{"en":"Noma"}'::jsonb,
  33.83889,
  130.610268,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723313202,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asahiminami',
  '旭南',
  'あさひみなみ',
  '{"en":"Asahiminami"}'::jsonb,
  33.8518675,
  130.6259032,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723313208,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minamikoyo',
  '南高陽',
  'みなみこうよう',
  '{"en":"Minamikoyo"}'::jsonb,
  33.842711,
  130.6346094,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723313213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jobata',
  '上畑',
  'じょうばた',
  '{"en":"Jobata"}'::jsonb,
  33.827059,
  130.598608,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723313216,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umi',
  '宇美',
  'うみ',
  '{"en":"Umi"}'::jsonb,
  33.5732802,
  130.5546854,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723316265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sumiyaki',
  '炭焼',
  'すみやき',
  '{"en":"Sumiyaki"}'::jsonb,
  33.5532997,
  130.5178939,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723316270,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shioji',
  '四王寺',
  'しおうじ',
  '{"en":"Shioji"}'::jsonb,
  33.534426,
  130.521371,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723316286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ino',
  '井野',
  'いの',
  '{"en":"Ino"}'::jsonb,
  33.5674945,
  130.4955618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723316307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshida_danchi',
  '吉田団地',
  'よしだだんち',
  '{"en":"Yoshida-danchi"}'::jsonb,
  33.842868,
  130.706404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323863,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umenoki_danchi',
  '梅ノ木団地',
  'うめのきだんち',
  '{"en":"Umenoki-danchi"}'::jsonb,
  33.868199,
  130.689086,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323864,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takao',
  '高尾',
  'たかお',
  '{"en":"Takao"}'::jsonb,
  33.8612754,
  130.6975548,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323868,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takamatsu',
  '高松',
  'たかまつ',
  '{"en":"Takamatsu"}'::jsonb,
  33.8704356,
  130.6926565,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okanodai',
  'おかの台',
  'おかのだい',
  '{"en":"Okanodai"}'::jsonb,
  33.8747888,
  130.691656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_muta',
  '牟田',
  'むた',
  '{"en":"Muta"}'::jsonb,
  33.867368,
  130.69312,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323877,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyoshino',
  '美吉野',
  'みよしの',
  '{"en":"Miyoshino"}'::jsonb,
  33.8539727,
  130.7030577,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323878,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyaodai',
  '宮尾台',
  'みやおだい',
  '{"en":"Miyaodai"}'::jsonb,
  33.8475091,
  130.7122892,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323879,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koiguchi',
  '鯉口',
  'こいぐち',
  '{"en":"Koiguchi"}'::jsonb,
  33.8534437,
  130.7010402,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higuchi_higashi',
  '樋口東',
  'ひぐちひがし',
  '{"en":"Higuchi-higashi"}'::jsonb,
  33.8730156,
  130.6948439,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higuchi',
  '樋口',
  'ひぐち',
  '{"en":"Higuchi"}'::jsonb,
  33.8734517,
  130.689233,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723323908,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nomaminami',
  '野間南',
  'のまみなみ',
  '{"en":"Nomaminami"}'::jsonb,
  33.844377,
  130.614374,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_teno',
  '手野',
  'ての',
  '{"en":"Teno"}'::jsonb,
  33.8684455,
  130.5843129,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyoshi',
  '三吉',
  'みよし',
  '{"en":"Miyoshi"}'::jsonb,
  33.8618,
  130.592183,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hara',
  '原',
  'はら',
  '{"en":"Hara"}'::jsonb,
  33.8766539,
  130.5713363,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nukazuka',
  '糠塚',
  'ぬかづか',
  '{"en":"Nukazuka"}'::jsonb,
  33.8699603,
  130.6390633,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_togiri',
  '戸切',
  'とぎり',
  '{"en":"Togiri"}'::jsonb,
  33.8358689,
  130.637718,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshiki',
  '吉木',
  'よしき',
  '{"en":"Yoshiki"}'::jsonb,
  33.866297,
  130.607559,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ebitsu_ekimae',
  '海老津駅前',
  'えびつえきまえ',
  '{"en":"Ebitsu-ekimae"}'::jsonb,
  33.8421663,
  130.6230587,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatsu',
  '波津',
  'はつ',
  '{"en":"Hatsu"}'::jsonb,
  33.8836472,
  130.5637011,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuroyama',
  '黒山',
  'くろやま',
  '{"en":"Kuroyama"}'::jsonb,
  33.870183,
  130.623755,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakuradai',
  '桜台',
  'さくらだい',
  '{"en":"Sakuradai"}'::jsonb,
  33.849259,
  130.624064,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_utsura',
  '内浦',
  'うつら',
  '{"en":"Utsura"}'::jsonb,
  33.8704831,
  130.5719248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ebitsu',
  '海老津',
  'えびつ',
  '{"en":"Ebitsu"}'::jsonb,
  33.8338751,
  130.6210141,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takakura',
  '高倉',
  'たかくら',
  '{"en":"Takakura"}'::jsonb,
  33.8473953,
  130.5939872,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723336568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yokoguma',
  '横隈',
  'よこぐま',
  '{"en":"Yokoguma"}'::jsonb,
  33.4259293,
  130.5693366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352279,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yasaka',
  '八坂',
  'やさか',
  '{"en":"Yasaka"}'::jsonb,
  33.364815,
  130.5622716,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352280,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamaguma',
  '山隈',
  'やまぐま',
  '{"en":"Yamaguma"}'::jsonb,
  33.411982,
  130.600722,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352281,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsuko',
  '津古',
  'つこ',
  '{"en":"Tsuko"}'::jsonb,
  33.4470484,
  130.563112,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352282,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_terafukudo',
  '寺福童',
  'てらふくどう',
  '{"en":"Terafukudo"}'::jsonb,
  33.3869308,
  130.5501051,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352283,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimo_nishiajisaka',
  '下西鰺坂',
  'しもにしあじさか',
  '{"en":"Shimo-Nishiajisaka"}'::jsonb,
  33.3610621,
  130.5541992,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352284,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoiwata',
  '下岩田',
  'しもいわた',
  '{"en":"Shimoiwata"}'::jsonb,
  33.388178,
  130.578952,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_rikitake',
  '力武',
  'りきたけ',
  '{"en":"Rikitake"}'::jsonb,
  33.4205289,
  130.5686087,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ozaki_quarter',
  '大崎',
  'おおざき',
  '{"en":"Ozaki"}'::jsonb,
  33.3863504,
  130.559305,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otoguma',
  '乙隈',
  'おとぐま',
  '{"en":"Otoguma"}'::jsonb,
  33.431883,
  130.580614,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oitai',
  '大板井',
  'おおいたい',
  '{"en":"Oitai"}'::jsonb,
  33.4007479,
  130.5618974,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352289,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oho',
  '大保',
  'おおほ',
  '{"en":"Oho"}'::jsonb,
  33.4099969,
  130.5573512,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352290,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ogori',
  '小郡',
  'おごおり',
  '{"en":"Ogori"}'::jsonb,
  33.3988394,
  130.5501951,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mitsuyuki',
  '光行',
  'みつゆき',
  '{"en":"Mitsuyuki"}'::jsonb,
  33.3662065,
  130.5701626,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mitsusawa',
  '三沢',
  'みつさわ',
  '{"en":"Mitsusawa"}'::jsonb,
  33.427498,
  130.551589,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsuzaki',
  '松崎',
  'まつざき',
  '{"en":"Matsuzaki"}'::jsonb,
  33.396583,
  130.587504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_koitai',
  '小板井',
  'こいたい',
  '{"en":"Koitai"}'::jsonb,
  33.3931625,
  130.5590068,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kami_nishiajisaka',
  '上西鰺坂',
  'かみにしあじさか',
  '{"en":"Kami-Nishiajisaka"}'::jsonb,
  33.3692083,
  130.5529676,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chuo',
  '中央',
  'ちゅうおう',
  '{"en":"Chuo"}'::jsonb,
  33.8626353,
  130.6949224,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723352318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimonofu_quarter',
  '下府',
  'しものふ',
  '{"en":"Shimonofu"}'::jsonb,
  33.708197,
  130.436972,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723383131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_minato',
  '湊',
  'みなと',
  '{"en":"Minato"}'::jsonb,
  33.7138712,
  130.4245061,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723383148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matono',
  '的野',
  'まとの',
  '{"en":"Matono"}'::jsonb,
  33.691151,
  130.494887,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723383153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ainoshima_quarter',
  '相島',
  'あいのしま',
  '{"en":"Ainoshima"}'::jsonb,
  33.7604096,
  130.3643219,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723383163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiiwata',
  '上岩田',
  'かみいわた',
  '{"en":"Kamiiwata"}'::jsonb,
  33.4000269,
  130.5763224,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_inoue',
  '井上',
  'いのうえ',
  '{"en":"Inoue"}'::jsonb,
  33.404813,
  130.577702,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_inayoshi',
  '稲吉',
  'いなよし',
  '{"en":"Inayoshi"}'::jsonb,
  33.389408,
  130.5703816,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hirakata',
  '平方',
  'ひらかた',
  '{"en":"Hirakata"}'::jsonb,
  33.3714619,
  130.5725626,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hikata',
  '干潟',
  'ひかた',
  '{"en":"Hikata"}'::jsonb,
  33.425458,
  130.5845924,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futamori',
  '二森',
  'ふたもり',
  '{"en":"Futamori"}'::jsonb,
  33.3796047,
  130.5588692,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_futa',
  '二夕',
  'ふた',
  '{"en":"Futa"}'::jsonb,
  33.3770937,
  130.5699477,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_furue',
  '古飯',
  'ふるえ',
  '{"en":"Furue"}'::jsonb,
  33.3782808,
  130.5769048,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fukudo_quarter',
  '福童',
  'ふくどう',
  '{"en":"Fukudo"}'::jsonb,
  33.3816218,
  130.5456151,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fukiage',
  '吹上',
  'ふきあげ',
  '{"en":"Fukiage"}'::jsonb,
  33.417643,
  130.580991,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397028,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akagawa',
  '赤川',
  'あかがわ',
  '{"en":"Akagawa"}'::jsonb,
  33.348583,
  130.5435567,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723397029,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hoshigaoka',
  '星ヶ丘',
  'ほしがおか',
  '{"en":"Hoshigaoka"}'::jsonb,
  33.821183,
  130.734916,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otsujimachi',
  '大辻町',
  'おおつじまち',
  '{"en":"Otsujimachi"}'::jsonb,
  33.8085,
  130.725338,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413777,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsugaoka',
  '松ヶ岡',
  'まつがおか',
  '{"en":"Matsugaoka"}'::jsonb,
  33.8162378,
  130.7206188,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413780,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oneto',
  '大根土',
  'おおねと',
  '{"en":"Oneto"}'::jsonb,
  33.822766,
  130.717337,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413806,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jokamachi',
  '浄花町',
  'じょうかまち',
  '{"en":"Jokamachi"}'::jsonb,
  33.8292212,
  130.699241,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413807,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamisokoino',
  '上底井野',
  'かみそこいの',
  '{"en":"Kamisokoino"}'::jsonb,
  33.8157656,
  130.6877746,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723413809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakasokoino',
  '中底井野',
  'なかそこいの',
  '{"en":"Nakasokoino"}'::jsonb,
  33.8233438,
  130.6809548,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_habu',
  '垣生',
  'はぶ',
  '{"en":"Habu"}'::jsonb,
  33.8277456,
  130.6928012,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nanaemachi',
  '七重町',
  'ななえまち',
  '{"en":"Nanaemachi"}'::jsonb,
  33.8049021,
  130.7234637,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimookuma',
  '下大隈',
  'しもおおくま',
  '{"en":"Shimookuma"}'::jsonb,
  33.808391,
  130.698983,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nabeyamamachi',
  '鍋山町',
  'なべやままち',
  '{"en":"Nabeyamamachi"}'::jsonb,
  33.8208921,
  130.7261543,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iwase_nishimachi',
  '岩瀬西町',
  'いわせにしまち',
  '{"en":"Iwase-nishimachi"}'::jsonb,
  33.837445,
  130.704979,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723423439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_morodomi',
  '諸富',
  'もろどみ',
  '{"en":"Morodomi"}'::jsonb,
  33.2227079,
  130.3930125,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamishirakaki_quarter',
  '上白垣',
  'かみしらかき',
  '{"en":"Kamishirakaki"}'::jsonb,
  33.2223102,
  130.4120617,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dokaijima',
  '道海島',
  'どうかいじま',
  '{"en":"Dokaijima"}'::jsonb,
  33.2384744,
  130.3758852,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimohachiin',
  '下八院',
  'しもはちいん',
  '{"en":"Shimohachiin"}'::jsonb,
  33.2224,
  130.4023742,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ogishima',
  '荻島',
  'おぎしま',
  '{"en":"Ogishima"}'::jsonb,
  33.2028848,
  130.3995437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuami',
  '九網',
  'くあみ',
  '{"en":"Kuami"}'::jsonb,
  33.199189,
  130.364607,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinden',
  '新田',
  'しんでん',
  '{"en":"Shinden"}'::jsonb,
  33.1857917,
  130.3607174,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hitotsuki',
  '一木',
  'ひとつき',
  '{"en":"Hitotsuki"}'::jsonb,
  33.1927824,
  130.3698739,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_agemaki',
  '上巻',
  'あげまき',
  '{"en":"Agemaki"}'::jsonb,
  33.200967,
  130.3837,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakemi',
  '酒見',
  'さけみ',
  '{"en":"Sakemi"}'::jsonb,
  33.2265477,
  130.387889,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakakimuro',
  '中木室',
  'なかきむろ',
  '{"en":"Nakakimuro"}'::jsonb,
  33.2137696,
  130.4099834,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimomutaguchi',
  '下牟田口',
  'しもむたぐち',
  '{"en":"Shimomutaguchi"}'::jsonb,
  33.201117,
  130.414872,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723434316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gobaru',
  '郷原',
  'ごうばる',
  '{"en":"Gobaru"}'::jsonb,
  33.2076054,
  130.3918775,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mukaijima',
  '向島',
  'むかいじま',
  '{"en":"Mukaijima"}'::jsonb,
  33.215643,
  130.375068,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kanegae',
  '鐘ケ江',
  'かねがえ',
  '{"en":"Kanegae"}'::jsonb,
  33.2349912,
  130.3889353,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_enokizu',
  '榎津',
  'えのきづ',
  '{"en":"Enokizu"}'::jsonb,
  33.2030488,
  130.3784847,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohashi',
  '大橋',
  'おおはし',
  '{"en":"Ohashi"}'::jsonb,
  33.2087598,
  130.4007803,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mitsumaru',
  '三丸',
  'みつまる',
  '{"en":"Mitsumaru"}'::jsonb,
  33.190404,
  130.387145,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsu',
  '津',
  'つ',
  '{"en":"Tsu"}'::jsonb,
  33.199156,
  130.374071,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hongimuro',
  '本木室',
  'ほんぎむろ',
  '{"en":"Hongimuro"}'::jsonb,
  33.2180933,
  130.3987701,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_beniya',
  '紅粉屋',
  'べにや',
  '{"en":"Beniya"}'::jsonb,
  33.176306,
  130.359643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoaoki',
  '下青木',
  'しもあおき',
  '{"en":"Shimoaoki"}'::jsonb,
  33.229099,
  130.398368,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakakoga',
  '中古賀',
  'なかこが',
  '{"en":"Nakakoga"}'::jsonb,
  33.2298658,
  130.3900075,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kobo',
  '小保',
  'こぼ',
  '{"en":"Kobo"}'::jsonb,
  33.205331,
  130.365421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoshirakaki',
  '下白垣',
  'しもしらかき',
  '{"en":"Shimoshirakaki"}'::jsonb,
  33.2240413,
  130.4029986,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hataho',
  '幡保',
  'はたほ',
  '{"en":"Hataho"}'::jsonb,
  33.194647,
  130.379731,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakai',
  '坂井',
  'さかい',
  '{"en":"Sakai"}'::jsonb,
  33.1863429,
  130.3940141,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nakahachiin',
  '中八院',
  'なかはちいん',
  '{"en":"Nakahachiin"}'::jsonb,
  33.2186147,
  130.4127576,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimokisaki',
  '下木佐木',
  'しもきさき',
  '{"en":"Shimokisaki"}'::jsonb,
  33.2010215,
  130.4038253,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitakoga',
  '北古賀',
  'きたこが',
  '{"en":"Kitakoga"}'::jsonb,
  33.200205,
  130.390178,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gebayashi',
  '下林',
  'げばやし',
  '{"en":"Gebayashi"}'::jsonb,
  33.2274587,
  130.4070566,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_onikoga',
  '鬼古賀',
  'おにこが',
  '{"en":"Onikoga"}'::jsonb,
  33.1967742,
  130.3980062,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8723436736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_雷山',
  '雷山',
  '雷山',
  NULL,
  33.496589,
  130.228404,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423248,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_油比',
  '油比',
  '油比',
  NULL,
  33.577866,
  130.19814,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423249,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山北',
  '山北',
  '山北',
  NULL,
  33.514528,
  130.237148,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423250,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八島',
  '八島',
  '八島',
  NULL,
  33.529794,
  130.225379,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423251,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三坂',
  '三坂',
  '三坂',
  NULL,
  33.520749,
  130.224152,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423264,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三雲',
  '三雲',
  '三雲',
  NULL,
  33.539247,
  130.240656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_前原',
  '前原',
  '前原',
  NULL,
  33.56011,
  130.18819,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423286,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本_quarter_8735423287',
  '本',
  '本',
  NULL,
  33.52308,
  130.199877,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東',
  '東',
  '東',
  NULL,
  33.530799,
  130.186352,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_波多江',
  '波多江',
  '波多江',
  NULL,
  33.556435,
  130.226488,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈吉井',
  '二丈吉井',
  '二丈吉井',
  NULL,
  33.487896,
  130.078077,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈満吉',
  '二丈満吉',
  '二丈満吉',
  NULL,
  33.501838,
  130.158632,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423297,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈松国',
  '二丈松国',
  '二丈松国',
  NULL,
  33.520064,
  130.177505,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423298,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈松末',
  '二丈松末',
  '二丈松末',
  NULL,
  33.529084,
  130.142948,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈福井',
  '二丈福井',
  '二丈福井',
  NULL,
  33.495394,
  130.104097,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈深江',
  '二丈深江',
  '二丈深江',
  NULL,
  33.506658,
  130.135552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈波呂',
  '二丈波呂',
  '二丈波呂',
  NULL,
  33.506048,
  130.174286,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈浜窪',
  '二丈浜窪',
  '二丈浜窪',
  NULL,
  33.537976,
  130.157638,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423303,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈長石',
  '二丈長石',
  '二丈長石',
  NULL,
  33.50455,
  130.166273,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423304,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈田中',
  '二丈田中',
  '二丈田中',
  NULL,
  33.5385675,
  130.1665098,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈武',
  '二丈武',
  '二丈武',
  NULL,
  33.527642,
  130.169521,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈鹿家',
  '二丈鹿家',
  '二丈鹿家',
  NULL,
  33.482425,
  130.056456,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈上深江',
  '二丈上深江',
  '二丈上深江',
  NULL,
  33.513285,
  130.157292,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423308,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈片山',
  '二丈片山',
  '二丈片山',
  NULL,
  33.526196,
  130.15085,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈石崎',
  '二丈石崎',
  '二丈石崎',
  NULL,
  33.519489,
  130.162785,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423310,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_二丈一貴山',
  '二丈一貴山',
  '二丈一貴山',
  NULL,
  33.489135,
  130.141286,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423311,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_西堂',
  '西堂',
  '西堂',
  NULL,
  33.519904,
  130.260463,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423312,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長野_quarter',
  '長野',
  '長野',
  NULL,
  33.495425,
  130.198435,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423313,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_富',
  '富',
  '富',
  NULL,
  33.538558,
  130.208883,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423314,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_泊',
  '泊',
  '泊',
  NULL,
  33.578154,
  130.213011,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423315,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千早新田',
  '千早新田',
  '千早新田',
  NULL,
  33.553524,
  130.171395,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735423316,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_来春',
  '来春',
  '来春',
  NULL,
  33.413023,
  130.663509,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山見',
  '山見',
  '山見',
  NULL,
  33.446937,
  130.70454,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山田',
  '山田',
  '山田',
  NULL,
  33.37768,
  130.759413,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_矢野竹',
  '矢野竹',
  '矢野竹',
  NULL,
  33.441144,
  130.732803,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_屋永',
  '屋永',
  '屋永',
  NULL,
  33.397275,
  130.676606,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_屋形原',
  '屋形原',
  '屋形原',
  NULL,
  33.429835,
  130.700396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八重津',
  '八重津',
  '八重津',
  NULL,
  33.37268,
  130.662255,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_持丸',
  '持丸',
  '持丸',
  NULL,
  33.434572,
  130.667339,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮野_quarter',
  '宮野',
  '宮野',
  NULL,
  33.396139,
  130.728061,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三奈木',
  '三奈木',
  '三奈木',
  NULL,
  33.411276,
  130.703973,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_馬田',
  '馬田',
  '馬田',
  NULL,
  33.40772,
  130.636504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_菩提寺',
  '菩提寺',
  '菩提寺',
  NULL,
  33.425262,
  130.664043,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_福光',
  '福光',
  '福光',
  NULL,
  33.375347,
  130.681579,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_比良松',
  '比良松',
  '比良松',
  NULL,
  33.384049,
  130.727027,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平塚',
  '平塚',
  '平塚',
  NULL,
  33.394328,
  130.651983,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477598,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_日向石',
  '日向石',
  '日向石',
  NULL,
  33.445208,
  130.688109,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477599,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_一木',
  '一木',
  '一木',
  NULL,
  33.406056,
  130.660452,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477600,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_菱野',
  '菱野',
  '菱野',
  NULL,
  33.382444,
  130.752427,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477601,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_林田',
  '林田',
  '林田',
  NULL,
  33.375924,
  130.67025,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長谷山',
  '長谷山',
  '長谷山',
  NULL,
  33.470004,
  130.680916,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木若',
  '杷木若市',
  '杷木若市',
  NULL,
  33.365822,
  130.793188,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477604,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木松末',
  '杷木松末',
  '杷木松末',
  NULL,
  33.393205,
  130.835345,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477605,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木星丸',
  '杷木星丸',
  '杷木星丸',
  NULL,
  33.375,
  130.836438,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477606,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木穂坂',
  '杷木穂坂',
  '杷木穂坂',
  NULL,
  33.352471,
  130.837681,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木林田',
  '杷木林田',
  '杷木林田',
  NULL,
  33.360804,
  130.824933,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木寒水',
  '杷木寒水',
  '杷木寒水',
  NULL,
  33.376399,
  130.808565,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477609,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木志波',
  '杷木志波',
  '杷木志波',
  NULL,
  33.372522,
  130.778762,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477610,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木白木',
  '杷木白木',
  '杷木白木',
  NULL,
  33.380533,
  130.817924,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木古賀',
  '杷木古賀',
  '杷木古賀',
  NULL,
  33.373874,
  130.802339,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木久喜宮',
  '杷木久喜宮',
  '杷木久喜宮',
  NULL,
  33.366786,
  130.800353,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木大山',
  '杷木大山',
  '杷木大山',
  NULL,
  33.367649,
  130.845882,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木池田',
  '杷木池田',
  '杷木池田',
  NULL,
  33.370252,
  130.815254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477615,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_杷木赤谷',
  '杷木赤谷',
  '杷木赤谷',
  NULL,
  33.406286,
  130.842729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735477616,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_楢原',
  '楢原',
  '楢原',
  NULL,
  33.45629,
  130.664308,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513717,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長渕',
  '長渕',
  '長渕',
  NULL,
  33.36666,
  130.702963,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513718,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中原',
  '中原',
  '中原',
  NULL,
  33.403711,
  130.621478,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513719,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長田',
  '長田',
  '長田',
  NULL,
  33.367074,
  130.664628,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中寒水',
  '中寒水',
  '中寒水',
  NULL,
  33.3875,
  130.650701,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513721,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中島田',
  '中島田',
  '中島田',
  NULL,
  33.388846,
  130.688387,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513722,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中_quarter',
  '中',
  '中',
  NULL,
  33.364931,
  130.677136,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513723,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_頓田',
  '頓田',
  '頓田',
  NULL,
  33.412071,
  130.671379,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513724,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_徳渕',
  '徳渕',
  '徳渕',
  NULL,
  33.376577,
  130.663153,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513725,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_堤',
  '堤',
  '堤',
  NULL,
  33.422368,
  130.674959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千代丸',
  '千代丸',
  '千代丸',
  NULL,
  33.410761,
  130.648464,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513727,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田中_quarter',
  '田中',
  '田中',
  NULL,
  33.368928,
  130.718268,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513728,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_多々連',
  '多々連',
  '多々連',
  NULL,
  33.37695,
  130.718556,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513729,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田代',
  '田代',
  '田代',
  NULL,
  33.441012,
  130.709617,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田島',
  '田島',
  '田島',
  NULL,
  33.385216,
  130.683946,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513731,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_草水',
  '草水',
  '草水',
  NULL,
  33.388106,
  130.64322,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513732,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_千手_quarter',
  '千手',
  '千手',
  NULL,
  33.465074,
  130.673202,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513733,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_須川',
  '須川',
  '須川',
  NULL,
  33.39512,
  130.751138,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_城',
  '城',
  '城',
  NULL,
  33.413194,
  130.739592,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白鳥_quarter',
  '白鳥',
  '白鳥',
  NULL,
  33.376348,
  130.651643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下浦',
  '下浦',
  '下浦',
  NULL,
  33.39767,
  130.630615,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下渕',
  '下渕',
  '下渕',
  NULL,
  33.440561,
  130.676756,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_佐田',
  '佐田',
  '佐田',
  NULL,
  33.433499,
  130.806013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_古毛',
  '古毛',
  '古毛',
  NULL,
  33.371638,
  130.73788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_古賀_quarter_8735513741',
  '古賀',
  '古賀',
  NULL,
  33.409999,
  130.677869,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桑原',
  '桑原',
  '桑原',
  NULL,
  33.386085,
  130.677703,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒川',
  '黒川',
  '黒川',
  NULL,
  33.415101,
  130.787018,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_倉吉',
  '倉吉',
  '倉吉',
  NULL,
  33.376815,
  130.64483,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513744,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_隈江',
  '隈江',
  '隈江',
  NULL,
  33.453534,
  130.654157,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上寺',
  '上寺',
  '上寺',
  NULL,
  33.363934,
  130.718512,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上浦',
  '上浦',
  '上浦',
  NULL,
  33.398455,
  130.64245,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上秋月',
  '上秋月',
  '上秋月',
  NULL,
  33.460913,
  130.705683,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鎌崎',
  '鎌崎',
  '鎌崎',
  NULL,
  33.383273,
  130.668626,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_金丸_quarter',
  '金丸',
  '金丸',
  NULL,
  33.380124,
  130.665199,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_片延',
  '片延',
  '片延',
  NULL,
  33.367031,
  130.683092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513751,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_柿原',
  '柿原',
  '柿原',
  NULL,
  33.42074,
  130.687644,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513752,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小田',
  '小田',
  '小田',
  NULL,
  33.392947,
  130.664332,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小隈',
  '小隈',
  '小隈',
  NULL,
  33.384218,
  130.65576,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513754,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大庭',
  '大庭',
  '大庭',
  NULL,
  33.38201,
  130.701932,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513755,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_江川',
  '江川',
  '江川',
  NULL,
  33.467982,
  130.752578,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513756,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鵜木',
  '鵜木',
  '鵜木',
  NULL,
  33.370126,
  130.681825,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513757,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_烏集院',
  '烏集院',
  '烏集院',
  NULL,
  33.400567,
  130.724476,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513758,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_牛鶴',
  '牛鶴',
  '牛鶴',
  NULL,
  33.401363,
  130.691428,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513759,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_牛木',
  '牛木',
  '牛木',
  NULL,
  33.419074,
  130.646239,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513760,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上畑',
  '上畑',
  '上畑',
  NULL,
  33.369308,
  130.675057,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513761,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_入地',
  '入地',
  '入地',
  NULL,
  33.389371,
  130.717977,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_荷原',
  '荷原',
  '荷原',
  NULL,
  33.424415,
  130.733563,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513763,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_板屋',
  '板屋',
  '板屋',
  NULL,
  33.421185,
  130.698178,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_石成',
  '石成',
  '石成',
  NULL,
  33.389915,
  130.69434,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513765,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_甘水',
  '甘水',
  '甘水',
  NULL,
  33.476672,
  130.666845,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513766,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_秋月野鳥',
  '秋月野鳥',
  '秋月野鳥',
  NULL,
  33.47802,
  130.709686,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513767,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_秋月',
  '秋月',
  '秋月',
  NULL,
  33.478576,
  130.6873,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513768,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_相窪',
  '相窪',
  '相窪',
  NULL,
  33.409771,
  130.685034,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735513769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_多久',
  '多久',
  '多久',
  NULL,
  33.543054,
  130.194529,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田_quarter',
  '高田',
  '高田',
  NULL,
  33.566633,
  130.236566,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高祖',
  '高祖',
  '高祖',
  NULL,
  33.539845,
  130.266292,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515124,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高上_quarter',
  '高上',
  '高上',
  NULL,
  33.517665,
  130.23082,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515125,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大門',
  '大門',
  '大門',
  NULL,
  33.549453,
  130.247636,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515126,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_曽根',
  '曽根',
  '曽根',
  NULL,
  33.537234,
  130.231079,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瀬戸',
  '瀬戸',
  '瀬戸',
  NULL,
  33.509287,
  130.182989,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_末永',
  '末永',
  '末永',
  NULL,
  33.52701,
  130.275472,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515129,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_瑞梅寺',
  '瑞梅寺',
  '瑞梅寺',
  NULL,
  33.496024,
  130.250396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515130,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_新田',
  '新田',
  '新田',
  NULL,
  33.56888,
  130.194927,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白糸',
  '白糸',
  '白糸',
  NULL,
  33.481179,
  130.176451,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩吉田',
  '志摩吉田',
  '志摩吉田',
  NULL,
  33.603278,
  130.184869,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩師吉',
  '志摩師吉',
  '志摩師吉',
  NULL,
  33.573615,
  130.173474,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515134,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩御床',
  '志摩御床',
  '志摩御床',
  NULL,
  33.567883,
  130.145292,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩松隈',
  '志摩松隈',
  '志摩松隈',
  NULL,
  33.589229,
  130.198361,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515136,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimafunakoshi',
  '志摩船越',
  '志摩船越',
  '{"en":"Shimafunakoshi"}'::jsonb,
  33.554001,
  130.120437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩東貝塚',
  '志摩東貝塚',
  '志摩東貝塚',
  NULL,
  33.579124,
  130.14995,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515138,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩馬場',
  '志摩馬場',
  '志摩馬場',
  NULL,
  33.593165,
  130.207589,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515139,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩初',
  '志摩初',
  '志摩初',
  NULL,
  33.58233,
  130.179352,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515140,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩野北',
  '志摩野北',
  '志摩野北',
  NULL,
  33.614485,
  130.169574,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515141,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩西貝塚',
  '志摩西貝塚',
  '志摩西貝塚',
  NULL,
  33.578883,
  130.141427,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515142,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩津和崎',
  '志摩津和崎',
  '志摩津和崎',
  NULL,
  33.578898,
  130.190192,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515143,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩新',
  '志摩新町',
  '志摩新町',
  NULL,
  33.57171,
  130.134287,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515144,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩桜井',
  '志摩桜井',
  '志摩桜井',
  NULL,
  33.620101,
  130.190956,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩小富士',
  '志摩小富士',
  '志摩小富士',
  NULL,
  33.564222,
  130.170987,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515146,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩小金丸',
  '志摩小金丸',
  '志摩小金丸',
  NULL,
  33.585759,
  130.160947,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515147,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩芥屋',
  '志摩芥屋',
  '志摩芥屋',
  NULL,
  33.58041,
  130.104763,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩久家',
  '志摩久家',
  '志摩久家',
  NULL,
  33.557347,
  130.140596,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩岐志',
  '志摩岐志',
  '志摩岐志',
  NULL,
  33.578086,
  130.127209,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515150,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩稲葉',
  '志摩稲葉',
  '志摩稲葉',
  NULL,
  33.574334,
  130.185013,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩稲留',
  '志摩稲留',
  '志摩稲留',
  NULL,
  33.59116,
  130.173174,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志摩井田原',
  '志摩井田原',
  '志摩井田原',
  NULL,
  33.592769,
  130.185578,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_篠原',
  '篠原',
  '篠原',
  NULL,
  33.555492,
  130.215075,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515160,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志登',
  '志登',
  '志登',
  NULL,
  33.570548,
  130.221398,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515161,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_香力',
  '香力',
  '香力',
  NULL,
  33.526893,
  130.214772,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515162,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高来寺',
  '高来寺',
  '高来寺',
  NULL,
  33.5547,
  130.247612,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515163,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_蔵持',
  '蔵持',
  '蔵持',
  NULL,
  33.537302,
  130.223302,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515164,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川原_quarter',
  '川原',
  '川原',
  NULL,
  33.507382,
  130.274784,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川付',
  '川付',
  '川付',
  NULL,
  33.502853,
  130.18712,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515166,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_神在',
  '神在',
  '神在',
  NULL,
  33.541082,
  130.174972,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515167,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_加布里',
  '加布里',
  '加布里',
  NULL,
  33.5432771,
  130.1619748,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515168,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_荻浦',
  '荻浦',
  '荻浦',
  NULL,
  33.553123,
  130.186014,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515169,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大浦',
  '大浦',
  '大浦',
  NULL,
  33.546834,
  130.192231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515170,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_王丸',
  '王丸',
  '王丸',
  NULL,
  33.519597,
  130.28137,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515171,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_潤',
  '潤',
  '潤',
  NULL,
  33.56848,
  130.214345,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515176,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浦志',
  '浦志',
  '浦志',
  NULL,
  33.566696,
  130.207466,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515180,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_井原',
  '井原',
  '井原',
  NULL,
  33.519892,
  130.248756,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515181,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_岩本',
  '岩本',
  '岩本',
  NULL,
  33.551015,
  130.173512,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515182,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_板持',
  '板持',
  '板持',
  NULL,
  33.574673,
  130.228139,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515185,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_井田',
  '井田',
  '井田',
  NULL,
  33.547874,
  130.235005,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515186,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_池田',
  '池田',
  '池田',
  NULL,
  33.562667,
  130.235335,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515187,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_飯原',
  '飯原',
  '飯原',
  NULL,
  33.502543,
  130.213128,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515188,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_有田',
  '有田',
  '有田',
  NULL,
  33.544417,
  130.222544,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8735515191,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_手光',
  '手光',
  '手光',
  NULL,
  33.7758745,
  130.4957342,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8752386096,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮司元',
  '宮司元町',
  '宮司元町',
  NULL,
  33.7801451,
  130.4867045,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8752386097,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮司ヶ丘',
  '宮司ヶ丘',
  '宮司ヶ丘',
  NULL,
  33.7837929,
  130.4818856,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8752386108,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_星ヶ丘',
  '星ヶ丘',
  '星ヶ丘',
  NULL,
  33.7884414,
  130.482746,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8752386116,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_在自',
  '在自',
  '在自',
  NULL,
  33.7928488,
  130.4833564,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8752408417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上西郷_quarter',
  '上西郷',
  '上西郷',
  NULL,
  33.7524704,
  130.4969787,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8754558998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umebayashi_quarter',
  '梅林',
  'うめばやし',
  '{"en":"Umebayashi"}'::jsonb,
  33.536428,
  130.357546,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8868020675,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nata_quarter',
  '奈多',
  'なた',
  '{"en":"Nata"}'::jsonb,
  33.681977,
  130.395484,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8868052659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hamao',
  '浜男',
  'はまお',
  '{"en":"Hamao"}'::jsonb,
  33.671342,
  130.461596,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8868052660,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_jinnoharu',
  '大字陣原',
  'おおあざじんのはる',
  '{"en":"Oaza-Jinnoharu"}'::jsonb,
  33.858204,
  130.730374,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8868091035,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kakuremino_quarter',
  '隠蓑',
  'かくれみの',
  '{"en":"Kakuremino"}'::jsonb,
  33.820653,
  130.890618,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  8868109285,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_wakamiyamachi',
  '若宮町',
  'わかみやまち',
  '{"en":"Wakamiyamachi"}'::jsonb,
  33.016151,
  130.446105,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013175607,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ryugozemachi',
  '龍湖瀬町',
  'りゅうごぜまち',
  '{"en":"Ryugozemachi"}'::jsonb,
  33.033985,
  130.468192,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013175608,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamanoemachi',
  '山上町',
  'やまのうえまち',
  '{"en":"Yamanoemachi"}'::jsonb,
  33.033608,
  130.449887,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013175613,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yakeishimachi',
  '焼石町',
  'やけいしまち',
  '{"en":"Yakeishimachi"}'::jsonb,
  33.031,
  130.457511,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013175614,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字乙金',
  '大字乙金',
  '大字乙金',
  NULL,
  33.545354,
  130.50327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013180160,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字瓦田',
  '大字瓦田',
  '大字瓦田',
  NULL,
  33.53576,
  130.510215,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013180161,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_紫台',
  '紫台',
  '紫台',
  NULL,
  33.506607,
  130.47966,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013180177,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮野台',
  '宮野台',
  '宮野台',
  NULL,
  33.498048,
  130.475922,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013180178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyayamamachi',
  '宮山町',
  'みややままち',
  '{"en":"Miyayamamachi"}'::jsonb,
  33.0257,
  130.455468,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyasakamachi',
  '宮坂町',
  'みやさかまち',
  '{"en":"Miyasakamachi"}'::jsonb,
  33.026571,
  130.452494,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189321,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miikejima',
  '三池島',
  'みいけじま',
  '{"en":"Miikejima"}'::jsonb,
  33.0397237,
  130.3539728,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189331,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mawatarimachi',
  '馬渡町',
  'まわたりまち',
  '{"en":"Mawatarimachi"}'::jsonb,
  33.013093,
  130.466235,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsuuramachi',
  '松浦町',
  'まつうらまち',
  '{"en":"Matsuuramachi"}'::jsonb,
  33.029231,
  130.451206,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_furumachi',
  '古町',
  'ふるまち',
  '{"en":"Furumachi"}'::jsonb,
  33.033134,
  130.445529,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hirabarumachi',
  '平原町',
  'ひらばるまち',
  '{"en":"Hirabarumachi"}'::jsonb,
  33.038276,
  130.465122,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189339,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_himeshimamachi',
  '姫島町',
  'ひめしままち',
  '{"en":"Himeshimamachi"}'::jsonb,
  33.013901,
  130.42861,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higuchimachi',
  '樋口町',
  'ひぐちまち',
  '{"en":"Higuchimachi"}'::jsonb,
  33.013993,
  130.430876,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189344,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashimiyauramachi',
  '東宮浦町',
  'ひがしみやうらまち',
  '{"en":"Higashimiyauramachi"}'::jsonb,
  33.029465,
  130.455099,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashihagiomachi',
  '東萩尾町',
  'ひがしはぎおまち',
  '{"en":"Higashihagiomachi"}'::jsonb,
  33.004368,
  130.473565,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiizumimachi',
  '東泉町',
  'ひがしいずみまち',
  '{"en":"Higashiizumimachi"}'::jsonb,
  33.033271,
  130.453698,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189349,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_harayamamachi',
  '原山町',
  'はらやままち',
  '{"en":"Harayamamachi"}'::jsonb,
  33.02478,
  130.447133,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189350,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hayamemachi',
  '駛馬町',
  'はやめまち',
  '{"en":"Hayamemachi"}'::jsonb,
  33.018359,
  130.452285,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hayaganemachi',
  '早鐘町',
  'はやがねまち',
  '{"en":"Hayaganemachi"}'::jsonb,
  33.021307,
  130.474316,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189352,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_babamachi',
  '馬場町',
  'ばばまち',
  '{"en":"Babamachi"}'::jsonb,
  33.013085,
  130.446239,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hanazonomachi',
  '花園町',
  'はなぞのまち',
  '{"en":"Hanazonomachi"}'::jsonb,
  33.021614,
  130.451296,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hatsushima',
  '初島',
  'はつしま',
  '{"en":"Hatsushima"}'::jsonb,
  33.053221,
  130.404501,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hachihonmachi',
  '八本町',
  'はちほんまち',
  '{"en":"Hachihonmachi"}'::jsonb,
  33.037147,
  130.460962,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189356,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hashiguchimachi',
  '橋口町',
  'はしぐちまち',
  '{"en":"Hashiguchimachi"}'::jsonb,
  33.03469,
  130.446841,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nozoemachi',
  '野添町',
  'のぞえまち',
  '{"en":"Nozoemachi"}'::jsonb,
  33.007442,
  130.462104,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimiyauramachi',
  '西宮浦町',
  'にしみやうらまち',
  '{"en":"Nishimiyauramachi"}'::jsonb,
  33.029634,
  130.453534,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189364,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_naniwamachi',
  '浪花町',
  'なにわまち',
  '{"en":"Naniwamachi"}'::jsonb,
  33.008068,
  130.425055,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189365,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nanauramachi',
  '七浦町',
  'ななうらまち',
  '{"en":"Nanauramachi"}'::jsonb,
  33.021954,
  130.456925,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189366,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagamizomachi',
  '長溝町',
  'ながみぞまち',
  '{"en":"Nagamizomachi"}'::jsonb,
  33.042234,
  130.463174,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagatamachi',
  '長田町',
  'ながたまち',
  '{"en":"Nagatamachi"}'::jsonb,
  33.012835,
  130.440394,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189370,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_toritsukamachi',
  '鳥塚町',
  'とりつかまち',
  '{"en":"Toritsukamachi"}'::jsonb,
  33.04104,
  130.459205,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189374,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokiwamachi_quarter',
  '常盤町',
  'ときわまち',
  '{"en":"Tokiwamachi"}'::jsonb,
  33.03355,
  130.448706,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189375,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tokamachi',
  '稲荷町',
  'とうかまち',
  '{"en":"Tokamachi"}'::jsonb,
  33.032085,
  130.459265,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189378,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tendomachi',
  '天道町',
  'てんどうまち',
  '{"en":"Tendomachi"}'::jsonb,
  33.016151,
  130.464777,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189380,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenjinmachi_quarter',
  '天神町',
  'てんじんまち',
  '{"en":"Tenjinmachi"}'::jsonb,
  33.040204,
  130.442694,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189381,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsubakuromachi',
  '椿黒町',
  'つばくろまち',
  '{"en":"Tsubakuromachi"}'::jsonb,
  33.043173,
  130.451627,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189382,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_chikumachi',
  '築町',
  'ちくまち',
  '{"en":"Chikumachi"}'::jsonb,
  33.034009,
  130.447719,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189383,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tabatamachi',
  '田端町',
  'たばたまち',
  '{"en":"Tabatamachi"}'::jsonb,
  33.015328,
  130.441112,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189384,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanimachi',
  '谷町',
  'たにまち',
  '{"en":"Tanimachi"}'::jsonb,
  33.0321,
  130.449241,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_suehiromachi_quarter',
  '末広町',
  'すえひろまち',
  '{"en":"Suehiromachi"}'::jsonb,
  33.019614,
  130.458254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189394,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shindojimachi',
  '真道寺町',
  'しんどうじまち',
  '{"en":"Shindojimachi"}'::jsonb,
  33.024998,
  130.45335,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189395,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinsakaemachi',
  '新栄町',
  'しんさかえまち',
  '{"en":"Shinsakaemachi"}'::jsonb,
  33.03798,
  130.448277,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189396,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinkaimachi',
  '新開町',
  'しんかいまち',
  '{"en":"Shinkaimachi"}'::jsonb,
  33.039953,
  130.429625,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_showamachi_quarter',
  '昭和町',
  'しょうわまち',
  '{"en":"Showamachi"}'::jsonb,
  33.01983,
  130.444009,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189409,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_showabiraki',
  '昭和開',
  'しょうわびらき',
  '{"en":"Showabiraki"}'::jsonb,
  33.061612,
  130.428524,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189410,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_joshinmachi',
  '浄真町',
  'じょうしんまち',
  '{"en":"Joshinmachi"}'::jsonb,
  33.021149,
  130.441949,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189411,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shimoikemachi',
  '下池町',
  'しもいけまち',
  '{"en":"Shimoikemachi"}'::jsonb,
  33.009129,
  130.472601,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shioyamachi',
  '汐屋町',
  'しおやまち',
  '{"en":"Shioyamachi"}'::jsonb,
  33.016075,
  130.429916,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sankomachi',
  '三坑町',
  'さんこうまち',
  '{"en":"Sankomachi"}'::jsonb,
  33.026159,
  130.457348,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakomachi',
  '左古町',
  'さこまち',
  '{"en":"Sakomachi"}'::jsonb,
  33.032068,
  130.45059,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sakuramachi_quarter',
  '桜町',
  'さくらまち',
  '{"en":"Sakuramachi"}'::jsonb,
  33.004868,
  130.449455,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_goseimachi',
  '合成町',
  'ごうせいまち',
  '{"en":"Goseimachi"}'::jsonb,
  33.023275,
  130.4613,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kenromachi',
  '健老町',
  'けんろうまち',
  '{"en":"Kenromachi"}'::jsonb,
  33.047744,
  130.433037,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitaisomachi',
  '北磯町',
  'きたいそまち',
  '{"en":"Kitaisomachi"}'::jsonb,
  33.040753,
  130.440583,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kawaramachi',
  '瓦町',
  'かわらまち',
  '{"en":"Kawaramachi"}'::jsonb,
  33.035183,
  130.463491,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamenokomachi',
  '亀甲町',
  'かめのこまち',
  '{"en":"Kamenokomachi"}'::jsonb,
  33.038601,
  130.460756,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kametanimachi',
  '亀谷町',
  'かめたにまち',
  '{"en":"Kametanimachi"}'::jsonb,
  33.033583,
  130.462805,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katahiramachi',
  '片平町',
  'かたひらまち',
  '{"en":"Katahiramachi"}'::jsonb,
  33.015117,
  130.443778,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_okitamachi',
  '沖田町',
  'おきたまち',
  '{"en":"Okitamachi"}'::jsonb,
  33.009474,
  130.449135,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ouramachi',
  '大浦町',
  'おおうらまち',
  '{"en":"Ouramachi"}'::jsonb,
  33.026079,
  130.474322,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yoshino',
  '大字吉野',
  'よしの',
  '{"en":"Yoshino"}'::jsonb,
  33.073553,
  130.471402,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189455,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyabe',
  '大字宮部',
  'みやべ',
  '{"en":"Miyabe"}'::jsonb,
  33.057577,
  130.494441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189456,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyazaki',
  '大字宮崎',
  'みやざき',
  '{"en":"Miyazaki"}'::jsonb,
  33.082065,
  130.477191,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189457,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_misaki_quarter',
  '大字岬',
  'みさき',
  '{"en":"Misaki"}'::jsonb,
  33.069336,
  130.444207,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miike',
  '大字三池',
  'みいけ',
  '{"en":"Miike"}'::jsonb,
  33.049455,
  130.483104,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tosen',
  '大字唐船',
  'とうせん',
  '{"en":"Tosen"}'::jsonb,
  33.061302,
  130.444715,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tegama',
  '大字手鎌',
  'てがま',
  '{"en":"Tegama"}'::jsonb,
  33.051944,
  130.446749,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tachibana',
  '大字橘',
  'たちばな',
  '{"en":"Tachibana"}'::jsonb,
  33.06598,
  130.475061,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_takuma',
  '大字田隈',
  'たくま',
  '{"en":"Takuma"}'::jsonb,
  33.056307,
  130.469865,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinmachi',
  '大字新町',
  'しんまち',
  '{"en":"Shinmachi"}'::jsonb,
  33.042746,
  130.481199,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shiragane',
  '大字白銀',
  'しらがね',
  '{"en":"Shiragane"}'::jsonb,
  33.068529,
  130.483848,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shika',
  '大字四ケ',
  'しか',
  '{"en":"Shika"}'::jsonb,
  33.074559,
  130.519186,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kuranaga',
  '大字倉永',
  'くらなが',
  '{"en":"Kuranaga"}'::jsonb,
  33.07894,
  130.455278,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kubuki',
  '大字久福木',
  'くぶき',
  '{"en":"Kubuki"}'::jsonb,
  33.055167,
  130.484441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kunugi',
  '大字歴木',
  'くぬぎ',
  '{"en":"Kunugi"}'::jsonb,
  33.036657,
  130.476901,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusagi',
  '大字草木',
  'くさぎ',
  '{"en":"Kusagi"}'::jsonb,
  33.052824,
  130.462803,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kyoragi',
  '大字教楽来',
  'きょうらぎ',
  '{"en":"Kyoragi"}'::jsonb,
  33.013124,
  130.509724,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamiuchi',
  '大字上内',
  'かみうち',
  '{"en":"Kamiuchi"}'::jsonb,
  33.082065,
  130.504815,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_katsudachi',
  '大字勝立',
  'かつだち',
  '{"en":"Katsudachi"}'::jsonb,
  33.009585,
  130.481084,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iwamoto',
  '大字岩本',
  'いわもと',
  '{"en":"Iwamoto"}'::jsonb,
  33.066897,
  130.495538,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_imayama',
  '大字今山',
  'いまやま',
  '{"en":"Imayama"}'::jsonb,
  33.03492,
  130.494582,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ichino',
  '大字櫟野',
  'いちの',
  '{"en":"Ichino"}'::jsonb,
  33.014674,
  130.495562,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_amagi',
  '大字甘木',
  'あまぎ',
  '{"en":"Amagi"}'::jsonb,
  33.064074,
  130.461097,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_enmeijimachi',
  '延命寺町',
  'えんめいじまち',
  '{"en":"Enmeijimachi"}'::jsonb,
  33.017335,
  130.442254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ebisumachi',
  '恵比須町',
  'えびすまち',
  '{"en":"Ebisumachi"}'::jsonb,
  33.042051,
  130.44318,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_usuimachi',
  '臼井町',
  'うすいまち',
  '{"en":"Usuimachi"}'::jsonb,
  33.006507,
  130.458682,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ipponmachi',
  '一本町',
  'いっぽんまち',
  '{"en":"Ipponmachi"}'::jsonb,
  33.033138,
  130.451254,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ichibumachi',
  '一部町',
  'いちぶまち',
  '{"en":"Ichibumachi"}'::jsonb,
  33.013013,
  130.450902,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ichinouramachi',
  '一浦町',
  'いちのうらまち',
  '{"en":"Ichinouramachi"}'::jsonb,
  33.024332,
  130.449836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_izumomachi',
  '出雲町',
  'いずもまち',
  '{"en":"Izumomachi"}'::jsonb,
  33.030693,
  130.4505,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_izumimachi',
  '泉町',
  'いずみまち',
  '{"en":"Izumimachi"}'::jsonb,
  33.03455,
  130.451409,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_iidamachi',
  '飯田町',
  'いいだまち',
  '{"en":"Iidamachi"}'::jsonb,
  33.009322,
  130.457014,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asamutamachi',
  '浅牟田町',
  'あさむたまち',
  '{"en":"Asamutamachi"}'::jsonb,
  33.035617,
  130.456557,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_akebonomachi',
  '曙町',
  'あけぼのまち',
  '{"en":"Akebonomachi"}'::jsonb,
  33.0295227,
  130.4482828,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_aobamachi',
  '青葉町',
  'あおばまち',
  '{"en":"Aobamachi"}'::jsonb,
  33.017146,
  130.460387,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013189497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamamotomachi_mino',
  '山本町耳納',
  'やまもとまちみのう',
  '{"en":"Yamamotomachi-Mino"}'::jsonb,
  33.304759,
  130.608015,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193888,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamamotomachi_toyoda',
  '山本町豊田',
  'やまもとまちとよだ',
  '{"en":"Yamamotomachi-Toyoda"}'::jsonb,
  33.304882,
  130.587251,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193889,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamakawamachi',
  '山川町',
  'やまかわまち',
  '{"en":"Yamakawamachi"}'::jsonb,
  33.307513,
  130.565795,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamakawa_noguchimachi',
  '山川野口町',
  'やまかわのぐちまち',
  '{"en":"Yamakawa-Noguchimachi"}'::jsonb,
  33.319262,
  130.56462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamakawa_kutsugatamachi',
  '山川沓形町',
  'やまかわくつがたまち',
  '{"en":"Yamakawa-Kutsugatamachi"}'::jsonb,
  33.31913,
  130.56168,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193895,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yamakawa_ichinouemachi',
  '山川市ノ上町',
  'やまかわいちのうえまち',
  '{"en":"Yamakawa-Ichinouemachi"}'::jsonb,
  33.316966,
  130.574449,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yasutakemachi_yasutakehon',
  '安武町安武本',
  'やすたけまちやすたけほん',
  '{"en":"Yasutakemachi-Yasutakehon"}'::jsonb,
  33.293296,
  130.485898,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yasutakemachi_takeshima',
  '安武町武島',
  'やすたけまちたけしま',
  '{"en":"Yasutakemachi-Takeshima"}'::jsonb,
  33.297998,
  130.467287,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_yasutakemachi_sumiyoshi',
  '安武町住吉',
  'やすたけまちすみよし',
  '{"en":"Yasutakemachi-Sumiyoshi"}'::jsonb,
  33.287573,
  130.473306,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyanojinmachi_wakamatsu',
  '宮ノ陣町若松',
  'みやのじんまちわかまつ',
  '{"en":"Miyanojinmachi-Wakamatsu"}'::jsonb,
  33.340723,
  130.554711,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyanojinmachi_hatchojima',
  '宮ノ陣町八丁島',
  'みやのじんまちはっちょうじま',
  '{"en":"Miyanojinmachi-Hatchojima"}'::jsonb,
  33.349253,
  130.562092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193907,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyanojinmachi_goromaru',
  '宮ノ陣町五郎丸',
  'みやのじんまちごろうまる',
  '{"en":"Miyanojinmachi-Goromaru"}'::jsonb,
  33.339787,
  130.539983,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193908,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_miyanojinmachi_oto',
  '宮ノ陣町大杜',
  'みやのじんまちおおと',
  '{"en":"Miyanojinmachi-Oto"}'::jsonb,
  33.336879,
  130.546997,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013193909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_fukumitsu',
  '三潴町福光',
  'みづままちふくみつ',
  '{"en":"Mizumamachi-Fukumitsu"}'::jsonb,
  33.244113,
  130.45091,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196417,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_haruda',
  '三潴町原田',
  'みづままちはるだ',
  '{"en":"Mizumamachi-Haruda"}'::jsonb,
  33.257638,
  130.447328,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196418,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_hayatsuzaki',
  '三潴町早津崎',
  'みづままちはやつざき',
  '{"en":"Mizumamachi-Hayatsuzaki"}'::jsonb,
  33.265198,
  130.474857,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_nishimuta',
  '三潴町西牟田',
  'みづままちにしむた',
  '{"en":"Mizumamachi-Nishimuta"}'::jsonb,
  33.243294,
  130.479963,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_tamamitsu',
  '三潴町玉満',
  'みづままちたまみつ',
  '{"en":"Mizumamachi-Tamamitsu"}'::jsonb,
  33.247531,
  130.466349,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_tagawa',
  '三潴町田川',
  'みづままちたがわ',
  '{"en":"Mizumamachi-Tagawa"}'::jsonb,
  33.257862,
  130.480732,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_takamizuma',
  '三潴町高三潴',
  'みづままちたかみずま',
  '{"en":"Mizumamachi-Takamizuma"}'::jsonb,
  33.256616,
  130.453879,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_kusaba',
  '三潴町草場',
  'みづままちくさば',
  '{"en":"Mizumamachi-Kusaba"}'::jsonb,
  33.261002,
  130.442683,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_kiyomatsu',
  '三潴町清松',
  'みづままちきよまつ',
  '{"en":"Mizumamachi-Kiyomatsu"}'::jsonb,
  33.25097,
  130.442398,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_itchobaru',
  '三潴町壱町原',
  'みづままちいっちょうばる',
  '{"en":"Mizumamachi-Itchobaru"}'::jsonb,
  33.250487,
  130.448343,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_mizumamachi_ikiiwa',
  '三潴町生岩',
  'みづままちいきいわ',
  '{"en":"Mizumamachi-Ikiiwa"}'::jsonb,
  33.233485,
  130.462368,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_matsugaemachi',
  '松ケ枝町',
  'まつがえまち',
  '{"en":"Matsugaemachi"}'::jsonb,
  33.31111,
  130.506115,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_honmachi_quarter_9013196434',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  33.311432,
  130.507605,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fujiyamamachi',
  '藤山町',
  'ふじやままち',
  '{"en":"Fujiyamamachi"}'::jsonb,
  33.270954,
  130.554282,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196435,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_fujimitsumachi',
  '藤光町',
  'ふじみつまち',
  '{"en":"Fujimitsumachi"}'::jsonb,
  33.271769,
  130.518729,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hyakunenkoen',
  '百年公園',
  'ひゃくねんこうえん',
  '{"en":"Hyakunenkoen"}'::jsonb,
  33.322145,
  130.53334,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_hinodemachi',
  '日ノ出町',
  'ひのでまち',
  '{"en":"Hinodemachi"}'::jsonb,
  33.322328,
  130.512867,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashimachi',
  '東町',
  'ひがしまち',
  '{"en":"Higashimachi"}'::jsonb,
  33.311437,
  130.518123,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashikushiharamachi',
  '東櫛原町',
  'ひがしくしはらまち',
  '{"en":"Higashikushiharamachi"}'::jsonb,
  33.323521,
  130.521087,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiaikawa_hiidemachi',
  '東合川干出町',
  'ひがしあいかわひいでまち',
  '{"en":"Higashiaikawa-Hiidemachi"}'::jsonb,
  33.324931,
  130.547528,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_higashiaikawa_shinmachi',
  '東合川新町',
  'ひがしあいかわしんまち',
  '{"en":"Higashiaikawa-Shinmachi"}'::jsonb,
  33.322847,
  130.557579,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_harankogamachi',
  '原古賀町',
  'はらんこがまち',
  '{"en":"Harankogamachi"}'::jsonb,
  33.309742,
  130.510296,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nonakamachi',
  '野中町',
  'のなかまち',
  '{"en":"Nonakamachi"}'::jsonb,
  33.307018,
  130.534955,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196458,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nishimachi_quarter',
  '西町',
  'にしまち',
  '{"en":"Nishimachi"}'::jsonb,
  33.302493,
  130.517368,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nankunmachi',
  '南薫町',
  'なんくんまち',
  '{"en":"Nankunmachi"}'::jsonb,
  33.319638,
  130.525846,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nankun_nishimachi',
  '南薫西町',
  'なんくんにしまち',
  '{"en":"Nankun-nishimachi"}'::jsonb,
  33.318087,
  130.523129,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nawatemachi',
  '縄手町',
  'なわてまち',
  '{"en":"Nawatemachi"}'::jsonb,
  33.318886,
  130.501202,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196462,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_nagatoishimachi',
  '長門石町',
  'ながといしまち',
  '{"en":"Nagatoishimachi"}'::jsonb,
  33.32487,
  130.484554,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196463,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_torihokamachi',
  '通外町',
  'とおりほかまち',
  '{"en":"Torihokamachi"}'::jsonb,
  33.316652,
  130.525441,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_towamachi',
  '東和町',
  'とうわまち',
  '{"en":"Towamachi"}'::jsonb,
  33.312036,
  130.523827,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tenjinmachi_quarter_9013196471',
  '天神町',
  'てんじんまち',
  '{"en":"Tenjinmachi"}'::jsonb,
  33.311293,
  130.521713,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsubuku_honmachi',
  '津福本町',
  'つぶくほんまち',
  '{"en":"Tsubuku-honmachi"}'::jsonb,
  33.298169,
  130.50531,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tsubuku_imamachi',
  '津福今町',
  'つぶくいままち',
  '{"en":"Tsubuku-imamachi"}'::jsonb,
  33.29252,
  130.505188,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_yoshimoto',
  '田主丸町吉本',
  'たぬしまるまちよしもと',
  '{"en":"Tanushimarumachi-Yoshimoto"}'::jsonb,
  33.339029,
  130.72059,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_yahata',
  '田主丸町八幡',
  'たぬしまるまちやはた',
  '{"en":"Tanushimarumachi-Yahata"}'::jsonb,
  33.35636,
  130.653972,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_moribe',
  '田主丸町森部',
  'たぬしまるまちもりべ',
  '{"en":"Tanushimarumachi-Moribe"}'::jsonb,
  33.32136,
  130.719738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_masuoda',
  '田主丸町益生田',
  'たぬしまるまちますおだ',
  '{"en":"Tanushimarumachi-Masuoda"}'::jsonb,
  33.321172,
  130.68887,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_maki',
  '田主丸町牧',
  'たぬしまるまちまき',
  '{"en":"Tanushimarumachi-Maki"}'::jsonb,
  33.342106,
  130.645648,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196478,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_funagoshi',
  '田主丸町船越',
  'たぬしまるまちふなごし',
  '{"en":"Tanushimarumachi-Funagoshi"}'::jsonb,
  33.355907,
  130.709369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196479,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_fueki',
  '田主丸町殖木',
  'たぬしまるまちふえき',
  '{"en":"Tanushimarumachi-Fueki"}'::jsonb,
  33.343788,
  130.705666,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196480,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_noda',
  '田主丸町野田',
  'たぬしまるまちのだ',
  '{"en":"Tanushimarumachi-Noda"}'::jsonb,
  33.356706,
  130.68824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196481,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_nagasu',
  '田主丸町長栖',
  'たぬしまるまちながす',
  '{"en":"Tanushimarumachi-Nagasu"}'::jsonb,
  33.357239,
  130.719133,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196482,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_nakao',
  '田主丸町中尾',
  'たぬしまるまちなかお',
  '{"en":"Tanushimarumachi-Nakao"}'::jsonb,
  33.318686,
  130.649738,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_toyoki',
  '田主丸町豊城',
  'たぬしまるまちとよき',
  '{"en":"Tanushimarumachi-Toyoki"}'::jsonb,
  33.346627,
  130.682656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196484,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_tokiwa',
  '田主丸町常盤',
  'たぬしまるまちときわ',
  '{"en":"Tanushimarumachi-Tokiwa"}'::jsonb,
  33.350553,
  130.699634,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_chitoku',
  '田主丸町地徳',
  'たぬしまるまちちとく',
  '{"en":"Tanushimarumachi-Chitoku"}'::jsonb,
  33.319891,
  130.672924,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_tanushimaru',
  '田主丸町田主丸',
  'たぬしまるまちたぬしまる',
  '{"en":"Tanushimarumachi-Tanushimaru"}'::jsonb,
  33.342607,
  130.693516,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_takeno',
  '田主丸町竹野',
  'たぬしまるまちたけの',
  '{"en":"Tanushimarumachi-Takeno"}'::jsonb,
  33.318795,
  130.660111,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_takatori',
  '田主丸町鷹取',
  'たぬしまるまちたかとり',
  '{"en":"Tanushimarumachi-Takatori"}'::jsonb,
  33.344998,
  130.727025,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_sugahara',
  '田主丸町菅原',
  'たぬしまるまちすがはら',
  '{"en":"Tanushimarumachi-Sugahara"}'::jsonb,
  33.353449,
  130.640795,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196490,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_shitsukashima',
  '田主丸町志塚島',
  'たぬしまるまちしつかしま',
  '{"en":"Tanushimarumachi-Shitsukashima"}'::jsonb,
  33.343673,
  130.664248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_kamiharu',
  '田主丸町上原',
  'たぬしまるまちかみはる',
  '{"en":"Tanushimarumachi-Kamiharu"}'::jsonb,
  33.344515,
  130.672519,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_eri',
  '田主丸町恵利',
  'たぬしまるまちえり',
  '{"en":"Tanushimarumachi-Eri"}'::jsonb,
  33.356816,
  130.669553,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196493,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_imae',
  '田主丸町以真恵',
  'たぬしまるまちいまえ',
  '{"en":"Tanushimarumachi-Imae"}'::jsonb,
  33.34294,
  130.656614,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_ishikaki',
  '田主丸町石垣',
  'たぬしまるまちいしかき',
  '{"en":"Tanushimarumachi-Ishikaki"}'::jsonb,
  33.322035,
  130.705791,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196495,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_asamori',
  '田主丸町朝森',
  'たぬしまるまちあさもり',
  '{"en":"Tanushimarumachi-Asamori"}'::jsonb,
  33.352413,
  130.671238,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196496,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_tanushimarumachi_akinari',
  '田主丸町秋成',
  'たぬしまるまちあきなり',
  '{"en":"Tanushimarumachi-Akinari"}'::jsonb,
  33.345158,
  130.716904,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196497,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_dairobarumachi',
  '太郎原町',
  'だいろばるまち',
  '{"en":"Dairobarumachi"}'::jsonb,
  33.322124,
  130.579146,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daizenjimachi_yoake',
  '大善寺町夜明',
  'だいぜんじまちよあけ',
  '{"en":"Daizenjimachi-Yoake"}'::jsonb,
  33.270435,
  130.466289,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196503,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daizenjimachi_miyamoto',
  '大善寺町宮本',
  'だいぜんじまちみやもと',
  '{"en":"Daizenjimachi-Miyamoto"}'::jsonb,
  33.278859,
  130.479976,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196504,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daizenjimachi_fujiyoshi',
  '大善寺町藤吉',
  'だいぜんじまちふじよし',
  '{"en":"Daizenjimachi-Fujiyoshi"}'::jsonb,
  33.272139,
  130.458724,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196505,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daizenjimachi_nakatsu',
  '大善寺町中津',
  'だいぜんじまちなかつ',
  '{"en":"Daizenjimachi-Nakatsu"}'::jsonb,
  33.277247,
  130.450635,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_daizenjimachi_kuroda',
  '大善寺町黒田',
  'だいぜんじまちくろだ',
  '{"en":"Daizenjimachi-Kuroda"}'::jsonb,
  33.269057,
  130.453592,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_zendojimachi_yoda',
  '善導寺町与田',
  'ぜんどうじまちよだ',
  '{"en":"Zendojimachi-Yoda"}'::jsonb,
  33.330301,
  130.59935,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196509,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_zendojimachi_shima',
  '善導寺町島',
  'ぜんどうじまちしま',
  '{"en":"Zendojimachi-Shima"}'::jsonb,
  33.327278,
  130.622568,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196510,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_zendojimachi_kizuka',
  '善導寺町木塚',
  'ぜんどうじまちきづか',
  '{"en":"Zendojimachi-Kizuka"}'::jsonb,
  33.327826,
  130.590987,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196511,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_zendojimachi_iida',
  '善導寺町飯田',
  'ぜんどうじまちいいだ',
  '{"en":"Zendojimachi-Iida"}'::jsonb,
  33.331112,
  130.607469,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_senoshitamachi',
  '瀬下町',
  'せのしたまち',
  '{"en":"Senoshitamachi"}'::jsonb,
  33.317577,
  130.492888,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196513,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_suwanomachi',
  '諏訪野町',
  'すわのまち',
  '{"en":"Suwanomachi"}'::jsonb,
  33.3065,
  130.524725,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shirayamamachi',
  '白山町',
  'しらやままち',
  '{"en":"Shirayamamachi"}'::jsonb,
  33.314707,
  130.499843,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196520,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_rokuchobaru',
  '城島町六町原',
  'じょうじままちろくちょうばる',
  '{"en":"Jojimamachi-Rokuchobaru"}'::jsonb,
  33.248246,
  130.434706,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196521,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_haranakamuta',
  '城島町原中牟田',
  'じょうじままちはらなかむた',
  '{"en":"Jojimamachi-Haranakamuta"}'::jsonb,
  33.243281,
  130.424234,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196522,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_hama',
  '城島町浜',
  'じょうじままちはま',
  '{"en":"Jojimamachi-Hama"}'::jsonb,
  33.266889,
  130.42944,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196523,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_nishiaoki',
  '城島町西青木',
  'じょうじままちにしあおき',
  '{"en":"Jojimamachi-Nishiaoki"}'::jsonb,
  33.237372,
  130.395024,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196524,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_naratsu',
  '城島町楢津',
  'じょうじままちならつ',
  '{"en":"Jojimamachi-Naratsu"}'::jsonb,
  33.25278,
  130.421494,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196525,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_shiromaru',
  '城島町四郎丸',
  'じょうじままちしろうまる',
  '{"en":"Jojimamachi-Shiromaru"}'::jsonb,
  33.244128,
  130.406131,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_jojima',
  '城島町城島',
  'じょうじままちじょうじま',
  '{"en":"Jojimamachi-Jojima"}'::jsonb,
  33.257725,
  130.428996,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196527,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_shimoda',
  '城島町下田',
  'じょうじままちしもだ',
  '{"en":"Jojimamachi-Shimoda"}'::jsonb,
  33.270511,
  130.42411,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196528,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_shimoaoki',
  '城島町下青木',
  'じょうじままちしもあおき',
  '{"en":"Jojimamachi-Shimoaoki"}'::jsonb,
  33.234927,
  130.405674,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_kamiaoki',
  '城島町上青木',
  'じょうじままちかみあおき',
  '{"en":"Jojimamachi-Kamiaoki"}'::jsonb,
  33.242409,
  130.41075,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196530,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_oyori',
  '城島町大依',
  'じょうじままちおおより',
  '{"en":"Jojimamachi-Oyori"}'::jsonb,
  33.251592,
  130.438664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_eshima',
  '城島町江島',
  'じょうじままちえしま',
  '{"en":"Jojimamachi-Eshima"}'::jsonb,
  33.247752,
  130.413159,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_egamihon',
  '城島町江上本',
  'じょうじままちえがみほん',
  '{"en":"Jojimamachi-Egamihon"}'::jsonb,
  33.233651,
  130.421651,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_egamikami',
  '城島町江上上',
  'じょうじままちえがみかみ',
  '{"en":"Jojimamachi-Egamikami"}'::jsonb,
  33.242026,
  130.436437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_egami',
  '城島町江上',
  'じょうじままちえがみ',
  '{"en":"Jojimamachi-Egami"}'::jsonb,
  33.234046,
  130.432056,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_uchino',
  '城島町内野',
  'じょうじままちうちの',
  '{"en":"Jojimamachi-Uchino"}'::jsonb,
  33.261974,
  130.433647,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_ukishima',
  '城島町浮島',
  'じょうじままちうきしま',
  '{"en":"Jojimamachi-Ukishima"}'::jsonb,
  33.252991,
  130.395336,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_ashizuka',
  '城島町芦塚',
  'じょうじままちあしづか',
  '{"en":"Jojimamachi-Ashizuka"}'::jsonb,
  33.285696,
  130.433721,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_jojimamachi_aokishima',
  '城島町青木島',
  'じょうじままちあおきしま',
  '{"en":"Jojimamachi-Aokishima"}'::jsonb,
  33.244908,
  130.396367,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196539,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_shinoharamachi',
  '篠原町',
  'しのはらまち',
  '{"en":"Shinoharamachi"}'::jsonb,
  33.312463,
  130.525417,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_sasayamamachi',
  '篠山町',
  'ささやままち',
  '{"en":"Sasayamamachi"}'::jsonb,
  33.324572,
  130.506367,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_komorinomachi',
  '小森野町',
  'こもりのまち',
  '{"en":"Komorinomachi"}'::jsonb,
  33.330769,
  130.509454,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kokubumachi',
  '国分町',
  'こくぶまち',
  '{"en":"Kokubumachi"}'::jsonb,
  33.294703,
  130.53665,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kogashiramachi',
  '小頭町',
  'こがしらまち',
  '{"en":"Kogashiramachi"}'::jsonb,
  33.311235,
  130.511283,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_korauchimachi',
  '高良内町',
  'こうらうちまち',
  '{"en":"Korauchimachi"}'::jsonb,
  33.284109,
  130.589883,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusanomachi_yoshiki',
  '草野町吉木',
  'くさのまちよしき',
  '{"en":"Kusanomachi-Yoshiki"}'::jsonb,
  33.307507,
  130.622589,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusanomachi_yahagi',
  '草野町矢作',
  'くさのまちやはぎ',
  '{"en":"Kusanomachi-Yahagi"}'::jsonb,
  33.315292,
  130.627392,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusanomachi_kotobayashi',
  '草野町紅桃林',
  'くさのまちことばやし',
  '{"en":"Kusanomachi-Kotobayashi"}'::jsonb,
  33.321767,
  130.640921,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kusanomachi_kusano',
  '草野町草野',
  'くさのまちくさの',
  '{"en":"Kusanomachi-Kusano"}'::jsonb,
  33.312298,
  130.638482,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kyomachi',
  '京町',
  'きょうまち',
  '{"en":"Kyomachi"}'::jsonb,
  33.322024,
  130.498496,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_yaegame',
  '北野町八重亀',
  'きたのまちやえがめ',
  '{"en":"Kitanomachi-Yaegame"}'::jsonb,
  33.35486,
  130.621925,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_moribe',
  '北野町守部',
  'きたのまちもりべ',
  '{"en":"Kitanomachi-Moribe"}'::jsonb,
  33.359985,
  130.618066,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_niomaru',
  '北野町仁王丸',
  'きたのまちにおうまる',
  '{"en":"Kitanomachi-Niomaru"}'::jsonb,
  33.350731,
  130.600096,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_nakashima',
  '北野町中島',
  'きたのまちなかしま',
  '{"en":"Kitanomachi-Nakashima"}'::jsonb,
  33.340394,
  130.594101,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_nakagawa',
  '北野町中川',
  'きたのまちなかがわ',
  '{"en":"Kitanomachi-Nakagawa"}'::jsonb,
  33.361367,
  130.624687,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_naka',
  '北野町中',
  'きたのまちなか',
  '{"en":"Kitanomachi-Naka"}'::jsonb,
  33.354916,
  130.587281,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_torisu',
  '北野町鳥巣',
  'きたのまちとりす',
  '{"en":"Kitanomachi-Torisu"}'::jsonb,
  33.332923,
  130.583764,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_tomita',
  '北野町冨多',
  'きたのまちとみた',
  '{"en":"Kitanomachi-Tomita"}'::jsonb,
  33.364422,
  130.611836,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_tsukajima',
  '北野町塚島',
  'きたのまちつかじま',
  '{"en":"Kitanomachi-Tsukajima"}'::jsonb,
  33.345907,
  130.603416,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_chiyojima',
  '北野町千代島',
  'きたのまちちよじま',
  '{"en":"Kitanomachi-Chiyojima"}'::jsonb,
  33.343447,
  130.592416,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_jinya',
  '北野町陣屋',
  'きたのまちじんや',
  '{"en":"Kitanomachi-Jinya"}'::jsonb,
  33.357745,
  130.592819,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_juromaru',
  '北野町十郎丸',
  'きたのまちじゅうろうまる',
  '{"en":"Kitanomachi-Juromaru"}'::jsonb,
  33.348325,
  130.572694,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_kora',
  '北野町高良',
  'きたのまちこうら',
  '{"en":"Kitanomachi-Kora"}'::jsonb,
  33.335191,
  130.57407,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_kamiyuge',
  '北野町上弓削',
  'きたのまちかみゆげ',
  '{"en":"Kitanomachi-Kamiyuge"}'::jsonb,
  33.335777,
  130.560773,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_kaneshima',
  '北野町金島',
  'きたのまちかねしま',
  '{"en":"Kitanomachi-Kaneshima"}'::jsonb,
  33.347551,
  130.616421,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_otoyoshi',
  '北野町乙吉',
  'きたのまちおとよし',
  '{"en":"Kitanomachi-Otoyoshi"}'::jsonb,
  33.35244,
  130.610824,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_otomaru',
  '北野町乙丸',
  'きたのまちおとまる',
  '{"en":"Kitanomachi-Otomaru"}'::jsonb,
  33.358147,
  130.610825,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_oki',
  '北野町大城',
  'きたのまちおおき',
  '{"en":"Kitanomachi-Oki"}'::jsonb,
  33.339496,
  130.619772,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_imayama',
  '北野町今山',
  'きたのまちいまやま',
  '{"en":"Kitanomachi-Imayama"}'::jsonb,
  33.353287,
  130.581395,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196576,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_inakazu',
  '北野町稲数',
  'きたのまちいなかず',
  '{"en":"Kitanomachi-Inakazu"}'::jsonb,
  33.364959,
  130.599178,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_ishizaki',
  '北野町石崎',
  'きたのまちいしざき',
  '{"en":"Kitanomachi-Ishizaki"}'::jsonb,
  33.332397,
  130.565133,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kitanomachi_akashi',
  '北野町赤司',
  'きたのまちあかし',
  '{"en":"Kitanomachi-Akashi"}'::jsonb,
  33.360346,
  130.601839,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_kamitsumachi',
  '上津町',
  'かみつまち',
  '{"en":"Kamitsumachi"}'::jsonb,
  33.2811,
  130.532463,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohashimachi_ninagawa',
  '大橋町蜷川',
  'おおはしまちにながわ',
  '{"en":"Ohashimachi-Ninagawa"}'::jsonb,
  33.343644,
  130.629147,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohashimachi_tsunemochi',
  '大橋町常持',
  'おおはしまちつねもち',
  '{"en":"Ohashimachi-Tsunemochi"}'::jsonb,
  33.332164,
  130.631437,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ohashimachi_airaku',
  '大橋町合楽',
  'おおはしまちあいらく',
  '{"en":"Ohashimachi-Airaku"}'::jsonb,
  33.335087,
  130.636108,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_otemachi_quarter',
  '大手町',
  'おおてまち',
  '{"en":"Otemachi"}'::jsonb,
  33.313554,
  130.524422,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oishimachi',
  '大石町',
  'おおいしまち',
  '{"en":"Oishimachi"}'::jsonb,
  33.314534,
  130.493616,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_umemitsumachi',
  '梅満町',
  'うめみつまち',
  '{"en":"Umemitsumachi"}'::jsonb,
  33.308174,
  130.495508,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arakimachi_fujita',
  '荒木町藤田',
  'あらきまちふじた',
  '{"en":"Arakimachi-Fujita"}'::jsonb,
  33.26054,
  130.533656,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arakimachi_shirakuchi',
  '荒木町白口',
  'あらきまちしらくち',
  '{"en":"Arakimachi-Shirakuchi"}'::jsonb,
  33.282383,
  130.500411,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arakimachi_shimoaraki',
  '荒木町下荒木',
  'あらきまちしもあらき',
  '{"en":"Arakimachi-Shimoaraki"}'::jsonb,
  33.269319,
  130.48971,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arakimachi_ima',
  '荒木町今',
  'あらきまちいま',
  '{"en":"Arakimachi-Ima"}'::jsonb,
  33.254349,
  130.494259,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_arakimachi_araki',
  '荒木町荒木',
  'あらきまちあらき',
  '{"en":"Arakimachi-Araki"}'::jsonb,
  33.262928,
  130.499834,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_araimachi',
  '洗町',
  'あらいまち',
  '{"en":"Araimachi"}'::jsonb,
  33.325286,
  130.502135,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_asahimachi_quarter',
  '旭町',
  'あさひまち',
  '{"en":"Asahimachi"}'::jsonb,
  33.326481,
  130.510382,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013196596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字立明寺',
  '大字立明寺',
  '大字立明寺',
  NULL,
  33.480168,
  130.526483,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013202825,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_美咲',
  '美咲',
  '美咲',
  NULL,
  33.463344,
  130.558355,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013202844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_針摺北',
  '針摺北',
  '針摺北',
  NULL,
  33.487637,
  130.532095,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013202890,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字若江',
  '大字若江',
  '大字若江',
  NULL,
  33.458323,
  130.55506,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206828,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字下見',
  '大字下見',
  '大字下見',
  NULL,
  33.463217,
  130.560984,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206829,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字吉木_quarter',
  '大字吉木',
  '大字吉木',
  NULL,
  33.511485,
  130.566762,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206830,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字柚須原',
  '大字柚須原',
  '大字柚須原',
  NULL,
  33.540167,
  130.589135,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206831,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山口_quarter',
  '大字山口',
  '大字山口',
  NULL,
  33.461552,
  130.496905,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206832,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字山家',
  '大字山家',
  '大字山家',
  NULL,
  33.496949,
  130.590664,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206833,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字諸田',
  '大字諸田',
  '大字諸田',
  NULL,
  33.469461,
  130.539469,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字武藏',
  '大字武藏',
  '大字武藏',
  NULL,
  33.484292,
  130.509176,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206835,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字本道寺',
  '大字本道寺',
  '大字本道寺',
  NULL,
  33.53236,
  130.575524,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206837,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字平等寺',
  '大字平等寺',
  '大字平等寺',
  NULL,
  33.447229,
  130.472497,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206838,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字原_quarter',
  '大字原',
  '大字原',
  NULL,
  33.516545,
  130.548531,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206839,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字萩原',
  '大字萩原',
  '大字萩原',
  NULL,
  33.460042,
  130.519362,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字西小田',
  '大字西小田',
  '大字西小田',
  NULL,
  33.445766,
  130.570643,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字永岡',
  '大字永岡',
  '大字永岡',
  NULL,
  33.474437,
  130.536645,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206842,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字塔原',
  '大字塔原',
  '大字塔原',
  NULL,
  33.484618,
  130.499886,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206843,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字常松_quarter',
  '大字常松',
  '大字常松',
  NULL,
  33.476561,
  130.549237,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206844,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字筑紫',
  '大字筑紫',
  '大字筑紫',
  NULL,
  33.461014,
  130.539927,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字俗明院',
  '大字俗明院',
  '大字俗明院',
  NULL,
  33.478013,
  130.53309,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206846,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字古賀',
  '大字古賀',
  '大字古賀',
  NULL,
  33.475503,
  130.515366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字香園',
  '大字香園',
  '大字香園',
  NULL,
  33.523617,
  130.597954,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206848,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字隈',
  '大字隈',
  '大字隈',
  NULL,
  33.454317,
  130.561251,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上古賀',
  '大字上古賀',
  '大字上古賀',
  NULL,
  33.478403,
  130.522631,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206850,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字岡田',
  '大字岡田',
  '大字岡田',
  NULL,
  33.476471,
  130.55529,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字大石',
  '大字大石',
  '大字大石',
  NULL,
  33.523522,
  130.565079,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字牛島',
  '大字牛島',
  '大字牛島',
  NULL,
  33.487034,
  130.545279,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字石崎',
  '大字石崎',
  '大字石崎',
  NULL,
  33.484686,
  130.525435,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206854,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字天山',
  '大字天山',
  '大字天山',
  NULL,
  33.479646,
  130.558266,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206855,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字阿志岐',
  '大字阿志岐',
  '大字阿志岐',
  NULL,
  33.495682,
  130.558139,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013206856,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下大利団地',
  '下大利団地',
  '下大利団地',
  NULL,
  33.523502,
  130.491813,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013210046,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字中_quarter_9013210083',
  '大字中',
  '大字中',
  NULL,
  33.556189,
  130.485645,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013210083,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字白木原',
  '大字白木原',
  '大字白木原',
  NULL,
  33.524642,
  130.479192,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013210084,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字上大利',
  '大字上大利',
  '大字上大利',
  NULL,
  33.520825,
  130.478669,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013210085,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大字牛頸',
  '大字牛頸',
  '大字牛頸',
  NULL,
  33.483132,
  130.469965,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013210086,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_渡',
  '渡',
  '渡',
  NULL,
  33.801404,
  130.455221,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_生家',
  '生家',
  '生家',
  NULL,
  33.811607,
  130.487658,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八並',
  '八並',
  '八並',
  NULL,
  33.772277,
  130.534768,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_本木',
  '本木',
  '本木',
  NULL,
  33.747262,
  130.540777,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_村山田',
  '村山田',
  '村山田',
  NULL,
  33.775015,
  130.521806,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_宮司',
  '宮司',
  '宮司',
  NULL,
  33.784456,
  130.489491,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久末',
  '久末',
  '久末',
  NULL,
  33.76401,
  130.515462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_奴山',
  '奴山',
  '奴山',
  NULL,
  33.813048,
  130.496458,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津屋崎',
  '津屋崎',
  '津屋崎',
  NULL,
  33.802873,
  130.4697,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津丸',
  '津丸',
  '津丸',
  NULL,
  33.767216,
  130.509811,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高平',
  '高平',
  '高平',
  NULL,
  33.773374,
  130.5067,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_須多田',
  '須多田',
  '須多田',
  NULL,
  33.799488,
  130.48726,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_舎利蔵',
  '舎利蔵',
  '舎利蔵',
  NULL,
  33.742081,
  130.530697,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_光陽台南',
  '光陽台南',
  '光陽台南',
  NULL,
  33.767823,
  130.499243,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勝浦',
  '勝浦',
  '勝浦',
  NULL,
  33.828677,
  130.489197,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小竹_quarter',
  '小竹',
  '小竹',
  NULL,
  33.781452,
  130.514954,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大石',
  '大石',
  '大石',
  NULL,
  33.806379,
  130.485516,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_内殿',
  '内殿',
  '内殿',
  NULL,
  33.749563,
  130.516494,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_畦',
  '畦町',
  '畦町',
  NULL,
  33.764027,
  130.536064,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9013227586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_蓮台寺',
  '蓮台寺',
  '蓮台寺',
  NULL,
  33.649336,
  130.631651,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617531,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_楽',
  '楽市',
  '楽市',
  NULL,
  33.610213,
  130.677143,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉北',
  '吉北',
  '吉北',
  NULL,
  33.683095,
  130.686486,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617533,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_弥山',
  '弥山',
  '弥山',
  NULL,
  33.529166,
  130.663399,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617534,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山倉',
  '山倉',
  '山倉',
  NULL,
  33.625231,
  130.744869,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617535,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山口_quarter',
  '山口',
  '山口',
  NULL,
  33.547409,
  130.609559,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617536,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_柳橋',
  '柳橋',
  '柳橋',
  NULL,
  33.673692,
  130.690092,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617537,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_安恒',
  '安恒',
  '安恒',
  NULL,
  33.611425,
  130.658717,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617538,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_八木山',
  '八木山',
  '八木山',
  NULL,
  33.633712,
  130.602091,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617539,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_椋本',
  '椋本',
  '椋本',
  NULL,
  33.603699,
  130.660719,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617540,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_明星寺',
  '明星寺',
  '明星寺',
  NULL,
  33.624844,
  130.635588,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617541,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_南尾',
  '南尾',
  '南尾',
  NULL,
  33.616682,
  130.69001,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617542,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_馬敷',
  '馬敷',
  '馬敷',
  NULL,
  33.564979,
  130.608807,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617543,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_弁分',
  '弁分',
  '弁分',
  NULL,
  33.621379,
  130.662235,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617544,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平恒',
  '平恒',
  '平恒',
  NULL,
  33.606502,
  130.690307,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617545,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平塚_quarter',
  '平塚',
  '平塚',
  NULL,
  33.568016,
  130.65639,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617546,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_花瀬',
  '花瀬',
  '花瀬',
  NULL,
  33.643213,
  130.656328,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617547,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_仁保',
  '仁保',
  '仁保',
  NULL,
  33.65315,
  130.738851,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617548,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長尾',
  '長尾',
  '長尾',
  NULL,
  33.57461,
  130.649331,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617549,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_中_quarter_9128617550',
  '中',
  '中',
  NULL,
  33.669251,
  130.675714,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617550,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_内住',
  '内住',
  '内住',
  NULL,
  33.59009,
  130.588744,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617551,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_天道',
  '天道',
  '天道',
  NULL,
  33.603626,
  130.677344,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鶴三緒',
  '鶴三緒',
  '鶴三緒',
  NULL,
  33.624682,
  130.699169,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617553,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津原',
  '津原',
  '津原',
  NULL,
  33.609111,
  130.647113,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617554,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_椿',
  '椿',
  '椿',
  NULL,
  33.616886,
  130.658727,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617555,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_綱分',
  '綱分',
  '綱分',
  NULL,
  33.631359,
  130.733878,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617556,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_筒野',
  '筒野',
  '筒野',
  NULL,
  33.601517,
  130.750054,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_津島',
  '津島',
  '津島',
  NULL,
  33.676086,
  130.680866,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617558,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_筑穂元吉',
  '筑穂元吉',
  '筑穂元吉',
  NULL,
  33.57258,
  130.636109,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617559,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_太郎丸',
  '太郎丸',
  '太郎丸',
  NULL,
  33.606679,
  130.671504,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617560,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_多田',
  '多田',
  '多田',
  NULL,
  33.643713,
  130.743246,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617561,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高田_quarter_9128617562',
  '高田',
  '高田',
  NULL,
  33.599203,
  130.632871,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617562,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_高倉',
  '高倉',
  '高倉',
  NULL,
  33.60299,
  130.764387,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617563,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大分',
  '大分',
  '大分',
  NULL,
  33.584459,
  130.62472,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617564,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大日寺',
  '大日寺',
  '大日寺',
  NULL,
  33.636454,
  130.637484,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617565,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_勢田',
  '勢田',
  '勢田',
  NULL,
  33.692897,
  130.734442,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_庄内元吉',
  '庄内元吉',
  '庄内元吉',
  NULL,
  33.663759,
  130.732722,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617567,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_庄司',
  '庄司',
  '庄司',
  NULL,
  33.680965,
  130.661448,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617568,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_舎利蔵_quarter',
  '舎利蔵',
  '舎利蔵',
  NULL,
  33.61201,
  130.62519,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617569,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_目尾',
  '目尾',
  '目尾',
  NULL,
  33.677247,
  130.701197,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617570,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_下三緒',
  '下三緒',
  '下三緒',
  NULL,
  33.633287,
  130.705253,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617571,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_佐與',
  '佐與',
  '佐與',
  NULL,
  33.668642,
  130.722249,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617572,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_幸袋',
  '幸袋',
  '幸袋',
  NULL,
  33.660476,
  130.680928,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_建花寺',
  '建花寺',
  '建花寺',
  NULL,
  33.662295,
  130.633976,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617574,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桑曲',
  '桑曲',
  '桑曲',
  NULL,
  33.512141,
  130.638569,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617575,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久保白',
  '久保白',
  '久保白',
  NULL,
  33.597542,
  130.651366,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617576,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_口原',
  '口原',
  '口原',
  NULL,
  33.689374,
  130.716765,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617577,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_北古賀',
  '北古賀',
  '北古賀',
  NULL,
  33.583812,
  130.650793,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617578,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_川津',
  '川津',
  '川津',
  NULL,
  33.652158,
  130.676384,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上三緒',
  '上三緒',
  '上三緒',
  NULL,
  33.624578,
  130.711967,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鹿毛馬',
  '鹿毛馬',
  '鹿毛馬',
  NULL,
  33.66937,
  130.741669,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小正',
  '小正',
  '小正',
  NULL,
  33.626113,
  130.662816,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大門_quarter',
  '大門',
  '大門',
  NULL,
  33.657714,
  130.73182,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_潤野',
  '潤野',
  '潤野',
  NULL,
  33.632388,
  130.656672,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_内野',
  '内野',
  '内野',
  NULL,
  33.533075,
  130.637679,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_入水',
  '入水',
  '入水',
  NULL,
  33.619581,
  130.750999,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_伊岐須',
  '伊岐須',
  '伊岐須',
  NULL,
  33.653164,
  130.662295,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_伊川',
  '伊川',
  '伊川',
  NULL,
  33.65363,
  130.64959,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_有安',
  '有安',
  '有安',
  NULL,
  33.64276,
  130.724552,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_有井',
  '有井',
  '有井',
  NULL,
  33.651494,
  130.720942,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_秋松',
  '秋松',
  '秋松',
  NULL,
  33.621822,
  130.676401,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_赤坂_quarter',
  '赤坂',
  '赤坂',
  NULL,
  33.620002,
  130.731438,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617595,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_阿恵',
  '阿恵',
  '阿恵',
  NULL,
  33.556776,
  130.642567,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617596,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_相田',
  '相田',
  '相田',
  NULL,
  33.670933,
  130.649704,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128617597,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_和歌美台',
  '和歌美台',
  '和歌美台',
  NULL,
  33.80268,
  130.525627,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618957,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_陵厳寺',
  '陵厳寺',
  '陵厳寺',
  NULL,
  33.817221,
  130.593926,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618958,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉留',
  '吉留',
  '吉留',
  NULL,
  33.801199,
  130.624353,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618959,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_吉田_quarter',
  '吉田',
  '吉田',
  NULL,
  33.837248,
  130.524239,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618960,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_山田_quarter',
  '山田',
  '山田',
  NULL,
  33.833626,
  130.56394,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618961,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_用山',
  '用山',
  '用山',
  NULL,
  33.801291,
  130.506248,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618962,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_村山田_quarter',
  '村山田',
  '村山田',
  NULL,
  33.782916,
  130.522108,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618963,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_牟田尻',
  '牟田尻',
  '牟田尻',
  NULL,
  33.839788,
  130.500071,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618964,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_緑',
  '緑町',
  '緑町',
  NULL,
  33.796449,
  130.586784,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_光岡',
  '光岡',
  '光岡',
  NULL,
  33.788699,
  130.556305,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618968,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三倉',
  '三倉',
  '三倉',
  NULL,
  33.802564,
  130.528858,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618969,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_曲',
  '曲',
  '曲',
  NULL,
  33.797426,
  130.556161,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618970,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_冨地原',
  '冨地原',
  '冨地原',
  NULL,
  33.790857,
  130.606547,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618971,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_深田',
  '深田',
  '深田',
  NULL,
  33.832635,
  130.507756,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618972,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_平等寺',
  '平等寺',
  '平等寺',
  NULL,
  33.82524,
  130.575425,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618976,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_原',
  '原町',
  '原町',
  NULL,
  33.78264,
  130.557087,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_野坂',
  '野坂',
  '野坂',
  NULL,
  33.772846,
  130.565408,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_名残',
  '名残',
  '名残',
  NULL,
  33.782414,
  130.595445,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128618997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_徳重',
  '徳重',
  '徳重',
  NULL,
  33.79738,
  130.592242,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東郷',
  '東郷',
  '東郷',
  NULL,
  33.800799,
  130.545355,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_土穴',
  '土穴',
  '土穴',
  NULL,
  33.817352,
  130.570661,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_多禮',
  '多禮',
  '多禮',
  NULL,
  33.824483,
  130.526154,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田野',
  '田野',
  '田野',
  NULL,
  33.854076,
  130.527607,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田島_quarter',
  '田島',
  '田島',
  NULL,
  33.819351,
  130.509439,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_武丸',
  '武丸',
  '武丸',
  NULL,
  33.80232,
  130.608588,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128619012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田熊',
  '田熊',
  '田熊',
  NULL,
  33.806613,
  130.535623,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_田久',
  '田久',
  '田久',
  NULL,
  33.80522,
  130.576327,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_須恵',
  '須恵',
  '須恵',
  NULL,
  33.823074,
  130.564483,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_自由ヶ丘西',
  '自由ヶ丘西町',
  '自由ヶ丘西町',
  NULL,
  33.799814,
  130.57005,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_自由ヶ丘',
  '自由ヶ丘',
  '自由ヶ丘',
  NULL,
  33.79772,
  130.57056,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628452,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_三郎丸',
  '三郎丸',
  '三郎丸',
  NULL,
  33.820029,
  130.583027,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_神湊',
  '神湊',
  '神湊',
  NULL,
  33.849467,
  130.495043,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_上八',
  '上八',
  '上八',
  NULL,
  33.874445,
  130.538908,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628461,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_久原',
  '久原',
  '久原',
  NULL,
  33.792736,
  130.546532,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628465,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_鐘崎',
  '鐘崎',
  '鐘崎',
  NULL,
  33.883237,
  130.533734,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_河東',
  '河東',
  '河東',
  NULL,
  33.821686,
  130.544986,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628467,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大穂',
  '大穂町',
  '大穂町',
  NULL,
  33.776052,
  130.553834,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628468,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大穂_quarter',
  '大穂',
  '大穂',
  NULL,
  33.765241,
  130.548297,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大谷',
  '大谷',
  '大谷',
  NULL,
  33.815989,
  130.569563,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大島_quarter',
  '大島',
  '大島',
  NULL,
  33.901233,
  130.422649,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大井南',
  '大井南',
  '大井南',
  NULL,
  33.805394,
  130.528553,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628472,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大井台',
  '大井台',
  '大井台',
  NULL,
  33.800685,
  130.523568,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628473,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大井',
  '大井',
  '大井',
  NULL,
  33.798981,
  130.517919,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_王丸_quarter',
  '王丸',
  '王丸',
  NULL,
  33.782063,
  130.544229,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628475,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_桜美台',
  '桜美台',
  '桜美台',
  NULL,
  33.79972,
  130.578799,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628476,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_江口',
  '江口',
  '江口',
  NULL,
  33.847857,
  130.512231,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_稲元',
  '稲元',
  '稲元',
  NULL,
  33.805973,
  130.555155,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_石丸',
  '石丸',
  '石丸',
  NULL,
  33.81071,
  130.600587,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628486,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_池田_quarter',
  '池田',
  '池田',
  NULL,
  33.8496,
  130.549605,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_池浦',
  '池浦',
  '池浦',
  NULL,
  33.833172,
  130.539297,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_朝',
  '朝町',
  '朝町',
  NULL,
  33.774643,
  130.588458,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_朝野',
  '朝野',
  '朝野',
  NULL,
  33.783145,
  130.568067,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9128628492,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_玄望園',
  '玄望園',
  '玄望園',
  NULL,
  33.7382456,
  130.5121547,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  9395764165,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_東田',
  '東田',
  '東田',
  NULL,
  33.8710131,
  130.8091342,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  12776843167,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_oaza_einomaru_quarter',
  '大字永犬丸',
  'おおあざえいのまる',
  '{"en":"Oaza-Einomaru"}'::jsonb,
  33.8492039,
  130.7288071,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  12805153973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_gan_nosu_hana',
  '雁ノ巣鼻',
  '雁ノ巣鼻',
  '{"en":"Gan''nosu Hana"}'::jsonb,
  33.6763635,
  130.406983,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  2687170827,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_所属未定地',
  '所属未定地',
  '所属未定地',
  NULL,
  33.8278345,
  131.0086877,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  3056779694,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_木村漁港',
  '木村漁港',
  '木村漁港',
  NULL,
  33.9886249,
  130.8172023,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4851161997,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_黒瀬',
  '黒瀬',
  '黒瀬',
  NULL,
  33.6879437,
  130.3039822,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918472202,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_白瀬',
  '白瀬',
  '白瀬',
  NULL,
  33.6816944,
  130.3089389,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918472203,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_赤瀬',
  '赤瀬',
  '赤瀬',
  NULL,
  33.6908717,
  130.2998409,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918472205,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大崎',
  '大崎',
  '大崎',
  NULL,
  33.6793375,
  130.2853891,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4918472209,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_志賀島漁港',
  '志賀島漁港',
  '志賀島漁港',
  NULL,
  33.6614676,
  130.3127709,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  4934936468,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_ノリ瀬',
  'ノリ瀬',
  'のりぜ',
  NULL,
  34.2498738,
  130.1036543,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  5174757074,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_小呂島漁港',
  '小呂島漁港',
  '小呂島漁港',
  NULL,
  33.8610258,
  130.0362396,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  5756041175,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_水巻',
  '水巻',
  '水巻',
  NULL,
  33.854674,
  130.6947168,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336730479,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_島門',
  '島門',
  '島門',
  NULL,
  33.8484839,
  130.6686168,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336730481,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_島郷',
  '島郷',
  '島郷',
  NULL,
  33.8933825,
  130.7364386,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336733172,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_浅木',
  '浅木',
  '浅木',
  NULL,
  33.8328583,
  130.6654769,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336745411,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_岡垣',
  '岡垣',
  '岡垣',
  NULL,
  33.853336,
  130.6113863,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336752248,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_長津',
  '長津',
  '長津',
  NULL,
  33.8167786,
  130.7089195,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336755218,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_底井野',
  '底井野',
  '底井野',
  NULL,
  33.8177658,
  130.699462,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  6336755219,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_大泊漁港',
  '大泊漁港',
  '大泊漁港',
  NULL,
  33.9922365,
  130.8195788,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  12022535859,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'fukuoka_unknown_寄瀬浦漁港',
  '寄瀬浦漁港',
  '寄瀬浦漁港',
  NULL,
  33.9972178,
  130.812369,
  NULL,
  'fukuoka',
  NULL,
  'jp',
  '福岡県',
  NULL,
  NULL,
  NULL,
  12022535860,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 29件, machi 2267件を挿入