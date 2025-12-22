-- =============================================
-- 大阪府の街データ（OSMから取得）
-- 生成日時: 2025-12-11T02:43:56.074Z
-- データ取得日時: 2025-12-11T00:54:21.903Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（大阪府のみ）
-- =============================================

-- machiテーブルから大阪府のデータを削除
DELETE FROM machi WHERE prefecture_id = 'osaka';

-- citiesテーブルから大阪府のデータを削除
DELETE FROM cities WHERE prefecture_id = 'osaka';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_osaka',
  'osaka',
  '大阪市',
  'おおさかし',
  '{"en":"Osaka"}'::jsonb,
  '市',
  'jp',
  34.6937569,
  135.5014539
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_kishiwada',
  'osaka',
  '岸和田市',
  '岸和田市',
  '{"en":"Kishiwada"}'::jsonb,
  '市',
  'jp',
  34.4644,
  135.385237
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_izumisano',
  'osaka',
  '泉佐野市',
  '泉佐野市',
  '{"en":"Izumisano"}'::jsonb,
  '市',
  'jp',
  34.394629,
  135.322725
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_kawachinagano',
  'osaka',
  '河内長野市',
  '河内長野市',
  '{"en":"Kawachinagano"}'::jsonb,
  '市',
  'jp',
  34.4575979,
  135.5643131
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_hannan',
  'osaka',
  '阪南市',
  '阪南市',
  '{"en":"Hannan"}'::jsonb,
  '市',
  'jp',
  34.3595067,
  135.2398397
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_sennan',
  'osaka',
  '泉南市',
  '泉南市',
  '{"en":"Sennan"}'::jsonb,
  '市',
  'jp',
  34.3657277,
  135.2739742
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_izumi',
  'osaka',
  '和泉市',
  '和泉市',
  '{"en":"Izumi"}'::jsonb,
  '市',
  'jp',
  34.4831932,
  135.4232139
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_kaizuka',
  'osaka',
  '貝塚市',
  '貝塚市',
  '{"en":"Kaizuka"}'::jsonb,
  '市',
  'jp',
  34.4374998,
  135.3581719
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_izumiotsu',
  'osaka',
  '泉大津市',
  '泉大津市',
  '{"en":"Izumiotsu"}'::jsonb,
  '市',
  'jp',
  34.5043442,
  135.4104345
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_takaishi',
  'osaka',
  '高石市',
  '高石市',
  '{"en":"Takaishi"}'::jsonb,
  '市',
  'jp',
  34.5207361,
  135.4424339
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_sakai',
  'osaka',
  '堺市',
  'さかいし',
  '{"en":"Sakai"}'::jsonb,
  '市',
  'jp',
  34.5737364,
  135.4828866
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_osakasayama',
  'osaka',
  '大阪狭山市',
  '大阪狭山市',
  '{"en":"Osakasayama"}'::jsonb,
  '市',
  'jp',
  34.5036668,
  135.5556737
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_tondabayashi',
  'osaka',
  '富田林市',
  '富田林市',
  '{"en":"Tondabayashi"}'::jsonb,
  '市',
  'jp',
  34.4998098,
  135.5972946
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_fujiidera',
  'osaka',
  '藤井寺市',
  '藤井寺市',
  '{"en":"Fujiidera"}'::jsonb,
  '市',
  'jp',
  34.5743612,
  135.5974874
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_kashiwara',
  'osaka',
  '柏原市',
  'かしわらし',
  '{"en":"Kashiwara"}'::jsonb,
  '市',
  'jp',
  34.578373,
  135.6291878
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_habikino',
  'osaka',
  '羽曳野市',
  '羽曳野市',
  '{"en":"Habikino"}'::jsonb,
  '市',
  'jp',
  34.5581531,
  135.6061619
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_matsubara',
  'osaka',
  '松原市',
  '松原市',
  '{"en":"Matsubara"}'::jsonb,
  '市',
  'jp',
  34.5780936,
  135.5517555
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_yao',
  'osaka',
  '八尾市',
  '八尾市',
  '{"en":"Yao"}'::jsonb,
  '市',
  'jp',
  34.6269018,
  135.6008668
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_toyonaka',
  'osaka',
  '豊中市',
  '豊中市',
  '{"en":"Toyonaka"}'::jsonb,
  '市',
  'jp',
  34.7811578,
  135.4699059
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_suita',
  'osaka',
  '吹田市',
  'すいたし',
  '{"en":"Suita"}'::jsonb,
  '市',
  'jp',
  34.7594193,
  135.516835
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_higashiosaka',
  'osaka',
  '東大阪市',
  '東大阪市',
  '{"en":"Higashiosaka"}'::jsonb,
  '市',
  'jp',
  34.679391,
  135.6009037
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_daito',
  'osaka',
  '大東市',
  '大東市',
  '{"en":"Daito"}'::jsonb,
  '市',
  'jp',
  34.7120151,
  135.6235341
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_settsu',
  'osaka',
  '摂津市',
  '摂津市',
  '{"en":"Settsu"}'::jsonb,
  '市',
  'jp',
  34.7772953,
  135.5617138
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_moriguchi',
  'osaka',
  '守口市',
  '守口市',
  '{"en":"Moriguchi"}'::jsonb,
  '市',
  'jp',
  34.735816,
  135.5617277
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_kadoma',
  'osaka',
  '門真市',
  '門真市',
  '{"en":"Kadoma"}'::jsonb,
  '市',
  'jp',
  34.739496,
  135.5869107
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_katano',
  'osaka',
  '交野市',
  '交野市',
  '{"en":"Katano"}'::jsonb,
  '市',
  'jp',
  34.7879544,
  135.6799638
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_shijonawate',
  'osaka',
  '四條畷市',
  '四條畷市',
  '{"en":"Shijonawate"}'::jsonb,
  '市',
  'jp',
  34.730447,
  135.674005
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_neyagawa',
  'osaka',
  '寝屋川市',
  '寝屋川市',
  '{"en":"Neyagawa"}'::jsonb,
  '市',
  'jp',
  34.7660998,
  135.6278989
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_minoh',
  'osaka',
  '箕面市',
  'みのおし',
  '{"en":"Minoh"}'::jsonb,
  '市',
  'jp',
  34.8269554,
  135.4704617
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_hirakata',
  'osaka',
  '枚方市',
  '枚方市',
  '{"en":"Hirakata"}'::jsonb,
  '市',
  'jp',
  34.8144363,
  135.6507278
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_ikeda',
  'osaka',
  '池田市',
  'いけだし',
  '{"en":"Ikeda"}'::jsonb,
  '市',
  'jp',
  34.8217095,
  135.4284236
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_takatsuki',
  'osaka',
  '高槻市',
  '高槻市',
  '{"en":"Takatsuki"}'::jsonb,
  '市',
  'jp',
  34.8464785,
  135.6172204
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_ibaraki',
  'osaka',
  '茨木市',
  'いばらきし',
  '{"en":"Ibaraki"}'::jsonb,
  '市',
  'jp',
  34.8161302,
  135.5685528
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'osaka_shimamoto',
  'osaka',
  '島本町',
  '島本町',
  '{"en":"Shimamoto"}'::jsonb,
  '町',
  'jp',
  34.8837129,
  135.6630537
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_北条',
  '北条',
  '北条',
  NULL,
  34.540299,
  135.483195,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1422991841,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_niryo',
  '二料',
  'にりょう',
  '{"en":"Niryo"}'::jsonb,
  34.9447977,
  135.572776,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748841262,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_tano',
  '田能',
  'たのう',
  '{"en":"Tano"}'::jsonb,
  34.9511591,
  135.5895307,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748841263,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_sugio',
  '杉生',
  'すぎお',
  '{"en":"Sugio"}'::jsonb,
  34.9686192,
  135.579725,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748841265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_sugihara',
  '杉原',
  'すぎはら',
  '{"en":"Sugihara"}'::jsonb,
  34.9699067,
  135.4862679,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748841271,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_takayama',
  '高山',
  'たかやま',
  '{"en":"Takayama"}'::jsonb,
  34.8901401,
  135.4876954,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kawashiri',
  '川尻',
  'かわしり',
  '{"en":"Kawashiri"}'::jsonb,
  34.9138823,
  135.4837281,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891986,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kishiro',
  '木代',
  'きしろ',
  '{"en":"Kishiro"}'::jsonb,
  34.9159849,
  135.4988493,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yono',
  '余野',
  'よの',
  '{"en":"Yono"}'::jsonb,
  34.9221592,
  135.4968643,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kirihata',
  '切畑',
  'きりはた',
  '{"en":"Kirihata"}'::jsonb,
  34.9220302,
  135.5157074,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_terada',
  '寺田',
  'てらだ',
  '{"en":"Terada"}'::jsonb,
  34.9382682,
  135.50616,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891991,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_nomaguchi',
  '野間口',
  'のまぐち',
  '{"en":"Nomaguchi"}'::jsonb,
  34.9324691,
  135.4875186,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891992,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_maki',
  '牧',
  'まき',
  '{"en":"Maki"}'::jsonb,
  34.939715,
  135.4970794,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891993,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_noma_ohara',
  '野間大原',
  'のまおおはら',
  '{"en":"Noma-ohara"}'::jsonb,
  34.9473413,
  135.4679107,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_nomanaka',
  '野間中',
  'のまなか',
  '{"en":"Nomanaka"}'::jsonb,
  34.9462095,
  135.4594746,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891995,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_noma_inaji',
  '野間稲地',
  'のまいなじ',
  '{"en":"Noma-inaji"}'::jsonb,
  34.9446424,
  135.4543158,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891996,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_noma_shutsuno',
  '野間出野',
  'のましゅつの',
  '{"en":"Noma-shutsuno"}'::jsonb,
  34.9469884,
  135.4397218,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_noma_nishiyama',
  '野間西山',
  'のまにしやま',
  '{"en":"Noma-nishiyama"}'::jsonb,
  34.9527461,
  135.4493867,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891998,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_jio',
  '地黄',
  'じおう',
  '{"en":"Jio"}'::jsonb,
  34.956602,
  135.4612224,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748891999,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kamitajiri',
  '上田尻',
  'かみたじり',
  '{"en":"Kamitajiri"}'::jsonb,
  34.9682185,
  135.4445057,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892000,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yamauchi',
  '山内',
  'やまうち',
  '{"en":"Yamauchi"}'::jsonb,
  34.9740764,
  135.4477593,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892001,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kuragaki',
  '倉垣',
  'くらがき',
  '{"en":"Kuragaki"}'::jsonb,
  34.9769987,
  135.4634832,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yoshino',
  '吉野',
  'よしの',
  '{"en":"Yoshino"}'::jsonb,
  34.9881937,
  135.4772439,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892003,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_shukuno',
  '宿野',
  'しゅくの',
  '{"en":"Shukuno"}'::jsonb,
  34.9992133,
  135.4317037,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892006,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_shukuno_quarter',
  '宿野',
  'しゅくの',
  '{"en":"Shukuno"}'::jsonb,
  34.9803368,
  135.4282665,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892007,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_shukuno_quarter_6748892008',
  '宿野',
  'しゅくの',
  '{"en":"Shukuno"}'::jsonb,
  35.0069296,
  135.4099819,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_ozato',
  '大里',
  'おおざと',
  '{"en":"Ozato"}'::jsonb,
  34.9709857,
  135.4102738,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kurusu',
  '栗栖',
  'くるす',
  '{"en":"Kurusu"}'::jsonb,
  34.9682337,
  135.4042048,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kashihara',
  '柏原',
  'かしはら',
  '{"en":"Kashihara"}'::jsonb,
  34.9619389,
  135.4112545,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_katayama',
  '片山',
  'かたやま',
  '{"en":"Katayama"}'::jsonb,
  34.95934,
  135.4080379,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892012,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_shimoda',
  '下田',
  'しもだ',
  '{"en":"Shimoda"}'::jsonb,
  34.9511781,
  135.406813,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892013,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_hiradori',
  '平通',
  'ひらどおり',
  '{"en":"Hiradori"}'::jsonb,
  34.9561359,
  135.4141789,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_hirano',
  '平野',
  'ひらの',
  '{"en":"Hirano"}'::jsonb,
  34.9590302,
  135.3970047,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892015,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_uesugi',
  '上杉',
  'うえすぎ',
  '{"en":"Uesugi"}'::jsonb,
  34.9537814,
  135.3909644,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_morigami',
  '森上',
  'もりがみ',
  '{"en":"Morigami"}'::jsonb,
  34.9656116,
  135.3964317,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_inaji',
  '稲地',
  'いなじ',
  '{"en":"Inaji"}'::jsonb,
  34.9649315,
  135.3937612,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892018,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_koyama',
  '神山',
  'こやま',
  '{"en":"Koyama"}'::jsonb,
  34.9635311,
  135.3808568,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_nagatani',
  '長谷',
  'ながたに',
  '{"en":"Nagatani"}'::jsonb,
  34.9668028,
  135.3723903,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892020,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_tarumi',
  '垂水',
  'たるみ',
  '{"en":"Tarumi"}'::jsonb,
  34.9695974,
  135.3811956,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892021,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_imanishi',
  '今西',
  'いまにし',
  '{"en":"Imanishi"}'::jsonb,
  34.9716526,
  135.3903437,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892022,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yamada',
  '山田',
  'やまだ',
  '{"en":"Yamada"}'::jsonb,
  34.9813366,
  135.3714701,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892023,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yamabe',
  '山辺',
  'やまべ',
  '{"en":"Yamabe"}'::jsonb,
  34.9853965,
  135.3931566,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892024,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yamabe_quarter',
  '山辺',
  'やまべ',
  '{"en":"Yamabe"}'::jsonb,
  35.0006567,
  135.3792485,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892025,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_tenno',
  '天王',
  'てんのう',
  '{"en":"Tenno"}'::jsonb,
  35.0292495,
  135.3784332,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892026,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_tenno_quarter',
  '天王',
  'てんのう',
  '{"en":"Tenno"}'::jsonb,
  35.037682,
  135.3575117,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6748892027,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_yoshikawa',
  '吉川',
  'よしかわ',
  '{"en":"Yoshikawa"}'::jsonb,
  34.9131662,
  135.4413145,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  7389056485,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_nakahata',
  '中畑',
  'なかはた',
  '{"en":"Nakahata"}'::jsonb,
  34.9607655,
  135.6087116,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  8095903517,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_izuriha',
  '出灰',
  'いずりは',
  '{"en":"Izuriha"}'::jsonb,
  34.9415946,
  135.6090653,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  8118027137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_shimotajiri',
  '下田尻',
  'しもたじり',
  '{"en":"Shimotajiri"}'::jsonb,
  34.9556036,
  135.4310846,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  8625913983,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_kisabe',
  '私部',
  'きさべ',
  '{"en":"Kisabe"}'::jsonb,
  34.7882704,
  135.6823834,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  12339799638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_abenosuji',
  '阿倍野筋',
  'あべのすじ',
  '{"en":"Abenosuji"}'::jsonb,
  34.6419999,
  135.5119586,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  13354419891,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_豊野浄水場南',
  '豊野浄水場南',
  '豊野浄水場南',
  NULL,
  34.7585257,
  135.6408466,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155635928,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_逢合橋東',
  '逢合橋東',
  '逢合橋東',
  NULL,
  34.7838586,
  135.6734801,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155662579,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_交野駅前',
  '交野駅前',
  '交野駅前',
  NULL,
  34.7870608,
  135.6748179,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155662585,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_逢合橋西',
  '逢合橋西',
  '逢合橋西',
  NULL,
  34.7837432,
  135.6721348,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155662594,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_太秦交番前',
  '太秦交番前',
  '太秦交番前',
  NULL,
  34.7595025,
  135.6347194,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155669490,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_香里南口',
  '香里南口',
  '香里南口',
  NULL,
  34.7800506,
  135.6320601,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155674575,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_木屋',
  '木屋',
  '木屋',
  NULL,
  34.7876448,
  135.6237657,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155677120,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_石津元',
  '石津元町',
  '石津元町',
  NULL,
  34.7782965,
  135.6165763,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155677122,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_木屋南',
  '木屋南',
  '木屋南',
  NULL,
  34.7856385,
  135.6227297,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155677129,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_大平ポンプ場前',
  '大平ポンプ場前',
  '大平ポンプ場前',
  NULL,
  34.7438275,
  135.6204783,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155731855,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_萱嶋駅前',
  '萱嶋駅前',
  '萱嶋駅前',
  NULL,
  34.7474712,
  135.6119086,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155737987,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_上馬伏北',
  '上馬伏北',
  '上馬伏北',
  NULL,
  34.7370287,
  135.6116414,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155737989,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_上馬伏',
  '上馬伏',
  '上馬伏',
  NULL,
  34.7366995,
  135.6120333,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155738001,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_下島頭北',
  '下島頭北',
  '下島頭北',
  NULL,
  34.7334976,
  135.6085093,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1155738010,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_楠公里',
  '楠公里',
  '楠公里',
  NULL,
  34.7385426,
  135.6533526,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1157335166,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_蔀屋',
  '蔀屋',
  '蔀屋',
  NULL,
  34.740016,
  135.6319676,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1157335177,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_下田原西',
  '下田原西',
  '下田原西',
  NULL,
  34.7333103,
  135.6937591,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  1164711471,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_d_tonbori',
  '道頓堀',
  'どうとんぼり',
  '{"en":"Dōtonbori"}'::jsonb,
  34.6690306,
  135.5015715,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4029007869,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_den_den_town',
  'でんでんタウン',
  'でんでんタウン',
  '{"en":"Den Den Town"}'::jsonb,
  34.6592152,
  135.5058245,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4584822193,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_日本庭園',
  '日本庭園',
  '日本庭園',
  NULL,
  34.8143248,
  135.5317183,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4819900496,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_自然文化園',
  '自然文化園',
  '自然文化園',
  NULL,
  34.8101685,
  135.5272912,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4819900497,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_本坊庭園',
  '本坊庭園',
  '本坊庭園',
  NULL,
  34.6559907,
  135.5180964,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4830104944,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_中心伽藍',
  '中心伽藍',
  '中心伽藍',
  NULL,
  34.6540782,
  135.5164397,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  4830104945,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_あいりん地',
  'あいりん地区',
  'あいりん地区',
  NULL,
  34.6449527,
  135.5014212,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  6163717693,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_生活環境保全林',
  '生活環境保全林',
  '生活環境保全林',
  NULL,
  34.8504991,
  135.4764757,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  11035174641,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_下赤阪の棚田',
  '下赤阪の棚田',
  '下赤阪の棚田',
  NULL,
  34.4588772,
  135.6181415,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  11147706502,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_泉佐野漁港',
  '泉佐野漁港',
  '泉佐野漁港',
  NULL,
  34.421235,
  135.3167903,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  11709779539,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'osaka_unknown_泉佐野港',
  '泉佐野港',
  '泉佐野港',
  NULL,
  34.4202394,
  135.3093767,
  NULL,
  'osaka',
  NULL,
  'jp',
  '大阪府',
  NULL,
  NULL,
  NULL,
  11709779540,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 34件, machi 79件を挿入