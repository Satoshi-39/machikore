-- =============================================
-- 神奈川県の街データ（OSMから取得）
-- 生成日時: 2025-12-11T02:43:56.051Z
-- データ取得日時: 2025-12-10T12:35:32.194Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（神奈川県のみ）
-- =============================================

-- machiテーブルから神奈川県のデータを削除
DELETE FROM machi WHERE prefecture_id = 'kanagawa';

-- citiesテーブルから神奈川県のデータを削除
DELETE FROM cities WHERE prefecture_id = 'kanagawa';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

-- ⚠️ 以下の65件は正式な市区町村でないため除外:
--   - 綾西5-15 (type: null)
--   - 綾西5-14 (type: null)
--   - 綾西5-13 (type: null)
--   - 綾西5-9 (type: null)
--   - 綾西5-10 (type: null)
--   - 綾西5-11 (type: null)
--   - 綾西5-12 (type: null)
--   - 綾西5-5 (type: null)
--   - 綾西5-6 (type: null)
--   - 綾西5-8 (type: null)
--   - 綾西5-7 (type: null)
--   - 綾西5-1 (type: null)
--   - 綾西5-2 (type: null)
--   - 綾西5-3 (type: null)
--   - 4 (type: null)
--   - 綾西4-19 (type: null)
--   - 綾西4-18 (type: null)
--   - 綾西4-17 (type: null)
--   - 綾西4-16 (type: null)
--   - 綾西4-15 (type: null)
--   - 綾西4-14 (type: null)
--   - 綾西4-13 (type: null)
--   - 綾西4-12 (type: null)
--   - 綾西4-11 (type: null)
--   - 綾西4-10 (type: null)
--   - 綾西4-9 (type: null)
--   - 綾西4-8 (type: null)
--   - 綾西4-7 (type: null)
--   - 綾西4-6 (type: null)
--   - 綾西4-5 (type: null)
--   - 綾西4-4 (type: null)
--   - 綾西4-3 (type: null)
--   - 綾西4-2 (type: null)
--   - 綾西4-1 (type: null)
--   - 綾西3-17 (type: null)
--   - 綾西3-16 (type: null)
--   - 綾西3-15 (type: null)
--   - 綾西3-14 (type: null)
--   - 綾西3-13 (type: null)
--   - 綾西3-12 (type: null)
--   - 綾西3-11 (type: null)
--   - 綾西3-10 (type: null)
--   - 綾西3-9 (type: null)
--   - 綾西3-8 (type: null)
--   - 綾西3-7 (type: null)
--   - 綾西3-6 (type: null)
--   - 綾西3-5 (type: null)
--   - 綾西3-4 (type: null)
--   - 綾西3-3 (type: null)
--   - 綾西3-2 (type: null)
--   - 綾西3-1 (type: null)
--   - 綾西2-14 (type: null)
--   - 綾西2-13 (type: null)
--   - 綾西2-12 (type: null)
--   - 綾西2-11 (type: null)
--   - 綾西2-10 (type: null)
--   - 綾西2-9 (type: null)
--   - 綾西2-8 (type: null)
--   - 綾西2-7 (type: null)
--   - 綾西2-6 (type: null)
--   - 綾西2-5 (type: null)
--   - 綾西2-4 (type: null)
--   - 綾西2-3 (type: null)
--   - 綾西2-2 (type: null)
--   - 綾西2-1 (type: null)

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_kawasaki',
  'kanagawa',
  '川崎市',
  'かわさきし',
  '{"en":"Kawasaki"}'::jsonb,
  '市',
  'jp',
  35.5306639,
  139.7037668
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_yokohama',
  'kanagawa',
  '横浜市',
  'よこはまし',
  '{"en":"Yokohama"}'::jsonb,
  '市',
  'jp',
  35.4503381,
  139.6343802
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_miura',
  'kanagawa',
  '三浦市',
  '三浦市',
  '{"en":"Miura"}'::jsonb,
  '市',
  'jp',
  35.1441984,
  139.6207589
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_minamiashigara',
  'kanagawa',
  '南足柄市',
  'みなみあしがら',
  '{"en":"Minamiashigara"}'::jsonb,
  '市',
  'jp',
  35.3205738,
  139.0992405
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_atsugi',
  'kanagawa',
  '厚木市',
  'あつぎし',
  '{"en":"Atsugi"}'::jsonb,
  '市',
  'jp',
  35.4429646,
  139.3625125
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_yamato',
  'kanagawa',
  '大和市',
  '大和市',
  '{"en":"Yamato"}'::jsonb,
  '市',
  'jp',
  35.4874895,
  139.4578937
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_odawara',
  'kanagawa',
  '小田原市',
  'おだわらし',
  '{"en":"Odawara"}'::jsonb,
  '市',
  'jp',
  35.2645301,
  139.152246
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_hiratsuka',
  'kanagawa',
  '平塚市',
  'ひらつかし',
  '{"en":"Hiratsuka"}'::jsonb,
  '市',
  'jp',
  35.3350609,
  139.3494345
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_yokosuka',
  'kanagawa',
  '横須賀市',
  'よこすかし',
  '{"en":"Yokosuka"}'::jsonb,
  '市',
  'jp',
  35.2814779,
  139.6719597
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_ayase',
  'kanagawa',
  '綾瀬市',
  'あやせし',
  '{"en":"Ayase"}'::jsonb,
  '市',
  'jp',
  35.4372542,
  139.4267675
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_chigasaki',
  'kanagawa',
  '茅ヶ崎市',
  'ちがさきし',
  '{"en":"Chigasaki"}'::jsonb,
  '市',
  'jp',
  35.329479,
  139.405371
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_fujisawa',
  'kanagawa',
  '藤沢市',
  'ふじさわし',
  '{"en":"Fujisawa"}'::jsonb,
  '市',
  'jp',
  35.3388615,
  139.4909335
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_zushi',
  'kanagawa',
  '逗子市',
  '逗子市',
  '{"en":"Zushi"}'::jsonb,
  '市',
  'jp',
  35.2955518,
  139.5804007
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_kamakura',
  'kanagawa',
  '鎌倉市',
  'かまくらし',
  '{"en":"Kamakura"}'::jsonb,
  '市',
  'jp',
  35.3192808,
  139.5469627
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_zama',
  'kanagawa',
  '座間市',
  'ざまし',
  '{"en":"Zama"}'::jsonb,
  '市',
  'jp',
  35.4886835,
  139.407691
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_ebina',
  'kanagawa',
  '海老名市',
  '海老名市',
  '{"en":"Ebina"}'::jsonb,
  '市',
  'jp',
  35.4464147,
  139.3906427
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_sagamihara',
  'kanagawa',
  '相模原市',
  'さがみはらし',
  '{"en":"Sagamihara"}'::jsonb,
  '市',
  'jp',
  35.5714621,
  139.3731052
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_hadano',
  'kanagawa',
  '秦野市',
  'はだのし',
  '{"en":"Hadano"}'::jsonb,
  '市',
  'jp',
  35.3747319,
  139.2200144
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'kanagawa_isehara',
  'kanagawa',
  '伊勢原市',
  'いせはらし',
  '{"en":"Isehara"}'::jsonb,
  '市',
  'jp',
  35.4030614,
  139.3150172
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yoshioka',
  '吉岡',
  'よしおか',
  '{"en":"Yoshioka"}'::jsonb,
  35.4209862,
  139.4147443,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  1764839123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_鹿島田',
  '鹿島田',
  '鹿島田',
  NULL,
  35.5556465,
  139.6710082,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2466117352,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_iriya_higashi',
  '入谷東',
  'いりやひがし',
  '{"en":"Iriya-Higashi"}'::jsonb,
  35.4819166,
  139.405033,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2772678447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_寺尾',
  '寺尾',
  '寺尾',
  NULL,
  35.452149,
  139.425105,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2786794159,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamig',
  '上郷',
  'かみごう',
  '{"en":"Kamigō"}'::jsonb,
  35.4555919,
  139.3847149,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2839095903,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_imazato',
  '今里',
  'いまざと',
  '{"en":"Imazato"}'::jsonb,
  35.4287611,
  139.3883639,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2839095928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kashiwagaya',
  '柏ケ谷',
  'かしわがや',
  '{"en":"Kashiwagaya"}'::jsonb,
  35.462821,
  139.412084,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2839095976,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kawaraguchi',
  '河原口',
  'かわらぐち',
  '{"en":"Kawaraguchi"}'::jsonb,
  35.447922,
  139.374916,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2839095977,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shake',
  '社家',
  'しゃけ',
  '{"en":"Shake"}'::jsonb,
  35.4209763,
  139.3798602,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2839095979,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minami_maioka',
  '南舞岡',
  '南舞岡',
  '{"en":"Minami-Maioka"}'::jsonb,
  35.3936809,
  139.5558855,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2849135213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_gumizawa',
  '汲沢',
  'ぐみざわ',
  '{"en":"Gumizawa"}'::jsonb,
  35.4004486,
  139.5150511,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2849135214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_harajuku',
  '原宿',
  'はらじゅく',
  '{"en":"Harajuku"}'::jsonb,
  35.3768859,
  139.5075462,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2857106987,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hirado',
  '平戸',
  'ひらど',
  '{"en":"Hirado"}'::jsonb,
  35.4299878,
  139.5688669,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2865614100,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakataminami',
  '中田南',
  'なかたみなみ',
  '{"en":"Nakataminami"}'::jsonb,
  35.4062993,
  139.5085347,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2903626178,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakatahigashi',
  '中田東',
  'なかたひがし',
  '{"en":"Nakatahigashi"}'::jsonb,
  35.4129097,
  139.5143214,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2903651845,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shirayuri',
  '白百合',
  'しらゆり',
  '{"en":"Shirayuri"}'::jsonb,
  35.4152229,
  139.5180847,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2903700670,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ryouke',
  '領家',
  'りょうけ',
  '{"en":"Ryouke"}'::jsonb,
  35.41867,
  139.5222936,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2903746834,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shimoizumi',
  '下和泉',
  'しもいずみ',
  '{"en":"Shimoizumi"}'::jsonb,
  35.3954465,
  139.4925944,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2915268579,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakata_nishi',
  '中田西',
  'なかたにし',
  '{"en":"Nakata-nishi"}'::jsonb,
  35.4066856,
  139.5036697,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2924166650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakatakita',
  '中田北',
  'なかたきた',
  '{"en":"Nakatakita"}'::jsonb,
  35.4164617,
  139.5074112,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2926775840,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kasama',
  '笠間',
  'かさま',
  '{"en":"Kasama"}'::jsonb,
  35.3605947,
  139.5358696,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2928702309,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hongodai',
  '本郷台',
  'ほんごうだい',
  '{"en":"Hongodai"}'::jsonb,
  35.3760147,
  139.5473621,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2932032061,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_koyamadai',
  '小山台',
  'こやまだい',
  '{"en":"Koyamadai"}'::jsonb,
  35.3778245,
  139.5571073,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2935025117,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nishigaoka',
  '西が岡',
  'にしがおか',
  '{"en":"Nishigaoka"}'::jsonb,
  35.4228042,
  139.5140719,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2935185506,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ryokuen',
  '緑園',
  'りょくえん',
  '{"en":"Ryokuen"}'::jsonb,
  35.4414879,
  139.5246108,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2938431169,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_higiriyama',
  '日限山',
  'ひぎりやま',
  '{"en":"Higiriyama"}'::jsonb,
  35.3949506,
  139.5600567,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2950103667,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shimonagaya',
  '下永谷',
  'しもながや',
  '{"en":"Shimonagaya"}'::jsonb,
  35.4109462,
  139.5591439,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2950155684,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_serigaya',
  '芹が谷',
  'せりがや',
  '{"en":"Serigaya"}'::jsonb,
  35.4158154,
  139.5712914,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2950422994,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mutsukawa',
  '六ツ川',
  'むつかわ',
  '{"en":"Mutsukawa"}'::jsonb,
  35.4253611,
  139.5823105,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2951627464,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_akuwa_minami',
  '阿久和南',
  '阿久和南',
  '{"en":"Akuwa-Minami"}'::jsonb,
  35.4419358,
  139.5043491,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2960584474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_maruyamadai',
  '丸山台',
  'まるやまだい',
  '{"en":"Maruyamadai"}'::jsonb,
  35.3976773,
  139.5681115,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2980381938,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kaminagaya',
  '上永谷',
  'かみながや',
  '{"en":"Kaminagaya"}'::jsonb,
  35.4053408,
  139.5713447,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2981949630,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_higashinagaya',
  '東永谷',
  'ひがしながや',
  '{"en":"Higashinagaya"}'::jsonb,
  35.4087985,
  139.5788242,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2982030799,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_okubo',
  '大久保',
  'おおくぼ',
  '{"en":"Okubo"}'::jsonb,
  35.4086118,
  139.5877302,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2988727038,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_bessho',
  '別所',
  'べっしょ',
  '{"en":"Bessho"}'::jsonb,
  35.4131333,
  139.5881533,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2988853638,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_saido',
  '最戸',
  'さいど',
  '{"en":"Saido"}'::jsonb,
  35.4135255,
  139.5931383,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2988993683,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakazato',
  '中里',
  'なかざと',
  '{"en":"Nakazato"}'::jsonb,
  35.419852,
  139.593407,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2996941179,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hosen',
  '法泉',
  '法泉',
  '{"en":"Hosen"}'::jsonb,
  35.4462486,
  139.5705968,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3001734062,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shin_sakuragaoka',
  '新桜ケ丘',
  '新桜ケ丘',
  '{"en":"Shin-Sakuragaoka"}'::jsonb,
  35.451105,
  139.5650751,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3003760612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_akuwa_higashi',
  '阿久和東',
  '阿久和東',
  '{"en":"Akuwa-Higashi"}'::jsonb,
  35.4527096,
  139.5052292,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3008308008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kajigaya',
  '鍛冶ケ谷',
  'かじがや',
  '{"en":"Kajigaya"}'::jsonb,
  35.3681802,
  139.5620033,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3017407659,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hino_minami',
  '日野南',
  'ひのみなみ',
  '{"en":"Hino-minami"}'::jsonb,
  35.3782124,
  139.5676563,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3019366573,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hino',
  '日野',
  'ひの',
  '{"en":"Hino"}'::jsonb,
  35.3922011,
  139.580287,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3026542295,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_konan',
  '港南',
  'こうなん',
  '{"en":"Konan"}'::jsonb,
  35.4037012,
  139.5877268,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3029571206,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamiooka_nishi',
  '上大岡西',
  'かみおおおかにし',
  '{"en":"Kamiooka-nishi"}'::jsonb,
  35.4057452,
  139.5953781,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3036617224,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sugekitaura',
  '菅北浦',
  'すげきたうら',
  '{"en":"Sugekitaura"}'::jsonb,
  35.6290906,
  139.5373122,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382296236,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sugebanba',
  '菅馬場',
  'すげばんば',
  '{"en":"Sugebanba"}'::jsonb,
  35.62871,
  139.5415147,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382296589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_higashiikuta',
  '東生田',
  'ひがしいくた',
  '{"en":"Higashiikuta"}'::jsonb,
  35.6147325,
  139.5639118,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382299385,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_teraodai',
  '寺尾台',
  'てらおだい',
  '{"en":"Teraodai"}'::jsonb,
  35.6189298,
  139.5335011,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382299529,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_suge_inadazutsumi',
  '菅稲田堤',
  'すげいなだづつみ',
  '{"en":"Suge-inadazutsumi"}'::jsonb,
  35.6353598,
  139.5401581,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382299640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_suge',
  '菅',
  'すげ',
  '{"en":"Suge"}'::jsonb,
  35.6330777,
  139.5349134,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382302581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sugesengoku',
  '菅仙谷',
  'すげせんごく',
  '{"en":"Sugesengoku"}'::jsonb,
  35.6290202,
  139.5240567,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382303594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_masugata',
  '枡形',
  'ますがた',
  '{"en":"Masugata"}'::jsonb,
  35.6168561,
  139.5604153,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3382303612,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_katasekaigan',
  '片瀬海岸',
  'かたせかいがん',
  '{"en":"Katasekaigan"}'::jsonb,
  35.3107494,
  139.4818431,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3735603787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_megumicho',
  'めぐみ町',
  'めぐみちょう',
  '{"en":"Megumicho"}'::jsonb,
  35.4531195,
  139.3890648,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4864629672,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_上麻生',
  '上麻生',
  '上麻生',
  NULL,
  35.5920986,
  139.5001888,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4867386588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ryosei',
  '綾西',
  'りょうせい',
  '{"en":"Ryosei"}'::jsonb,
  35.4326661,
  139.41365,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4869724566,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_izumi',
  '泉',
  'いずみ',
  '{"en":"Izumi"}'::jsonb,
  35.4597859,
  139.3906923,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5281680494,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kokubunjidai',
  '国分寺台',
  'こくぶんじだい',
  '{"en":"Kokubunjidai"}'::jsonb,
  35.4405135,
  139.4045065,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5328577942,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tsumada',
  '妻田',
  'つまだ',
  '{"en":"Tsumada"}'::jsonb,
  35.4611724,
  139.3645168,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701444014,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tsumadahigashi',
  '妻田東',
  'つまだひがし',
  '{"en":"Tsumadahigashi"}'::jsonb,
  35.4586662,
  139.3627357,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701444016,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tsumada_nishi',
  '妻田西',
  'つまだにし',
  '{"en":"Tsumada-nishi"}'::jsonb,
  35.4622174,
  139.3545275,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701444017,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_okata',
  '岡田',
  'おかた',
  '{"en":"Okata"}'::jsonb,
  35.4249367,
  139.366043,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701446063,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hase',
  '長谷',
  'はせ',
  '{"en":"Hase"}'::jsonb,
  35.4321111,
  139.3366118,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701446068,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_toda',
  '戸田',
  'とだ',
  '{"en":"Toda"}'::jsonb,
  35.4012548,
  139.3622339,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701446074,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ono',
  '小野',
  'おの',
  '{"en":"Ono"}'::jsonb,
  35.4349587,
  139.3168207,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586148,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_毛利台',
  '毛利台',
  'もうりだい',
  NULL,
  35.441242,
  139.3294466,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586149,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_aina',
  '愛名',
  'あいな',
  '{"en":"Aina"}'::jsonb,
  35.4424702,
  139.3250366,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586151,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nanasawa',
  '七沢',
  'ななさわ',
  '{"en":"Nanasawa"}'::jsonb,
  35.4502598,
  139.2809666,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586160,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shimofurusawa',
  '下古沢',
  'しもふるさわ',
  '{"en":"Shimofurusawa"}'::jsonb,
  35.4534497,
  139.3197027,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586172,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_miyanosato',
  '宮の里',
  'みやのさと',
  '{"en":"Miyanosato"}'::jsonb,
  35.4787789,
  139.3140159,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586344,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakaogino',
  '中荻野',
  'なかおぎの',
  '{"en":"Nakaogino"}'::jsonb,
  35.482888,
  139.3213699,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586345,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tobio',
  '鳶尾',
  'とびお',
  '{"en":"Tobio"}'::jsonb,
  35.491283,
  139.3296378,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586346,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shimoogino',
  '下荻野',
  'しもおぎの',
  '{"en":"Shimoogino"}'::jsonb,
  35.4825939,
  139.3366581,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586347,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_miharuno',
  'みはる野',
  'みはる野',
  '{"en":"Miharuno"}'::jsonb,
  35.5006884,
  139.3212389,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tanazawa',
  '棚沢',
  'たなざわ',
  '{"en":"Tanazawa"}'::jsonb,
  35.4991283,
  139.3334177,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5701586358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_桂台',
  '桂台',
  '桂台',
  NULL,
  35.5509482,
  139.5046842,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6023893257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_akanedai',
  'あかね台',
  'あかね台',
  '{"en":"Akanedai"}'::jsonb,
  35.5418439,
  139.4880072,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6023895967,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nara',
  '奈良',
  '奈良',
  '{"en":"Nara"}'::jsonb,
  35.5547981,
  139.4861786,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6023898901,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_aobadai',
  '青葉台',
  '青葉台',
  '{"en":"Aobadai"}'::jsonb,
  35.5470009,
  139.5158075,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6026163876,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_たちばな台',
  'たちばな台',
  'たちばな台',
  NULL,
  35.5558454,
  139.5129178,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6027126730,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_藤が丘',
  '藤が丘',
  '藤が丘',
  NULL,
  35.5441603,
  139.5292145,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6028561720,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ch',
  '中央',
  '中央',
  '{"en":"Chūō"}'::jsonb,
  35.4509964,
  139.3942505,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245836704,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kokubu_minami',
  '国分南',
  'こくぶみなみ',
  '{"en":"Kokubu-Minami"}'::jsonb,
  35.4529435,
  139.4005691,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245836705,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kokubu_kita',
  '国分北',
  'こくぶきた',
  '{"en":"Kokubu-Kita"}'::jsonb,
  35.4613865,
  139.4005377,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245836706,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ya_kita',
  '大谷北',
  'おおやきた',
  '{"en":"Ōya Kita"}'::jsonb,
  35.4409982,
  139.3979348,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245836707,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ya_minami',
  '大谷南',
  'おおやみなみ',
  '{"en":"Ōya Minami"}'::jsonb,
  35.4351446,
  139.3994552,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245836708,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sugikubo_kita',
  '杉久保北',
  '杉久保北',
  '{"en":"Sugikubo-Kita"}'::jsonb,
  35.4276328,
  139.4016533,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245849213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sugikubo_minami',
  '杉久保南',
  '杉久保南',
  '{"en":"Sugikubo-Minami"}'::jsonb,
  35.42108,
  139.4012756,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245849214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_higashi_kashiwagaya',
  '東柏ケ谷',
  'ひがしかしわがや',
  '{"en":"Higashi-Kashiwagaya"}'::jsonb,
  35.470926,
  139.4304862,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6245849215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hayakawa_shiroyama',
  '早川城山',
  'はやかわしろやま',
  '{"en":"Hayakawa-Shiroyama"}'::jsonb,
  35.440203,
  139.4215397,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6246012118,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sagamino',
  'さがみ野',
  'さがみの',
  '{"en":"Sagamino"}'::jsonb,
  35.4723328,
  139.424759,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6259119189,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minami_kurihara',
  '南栗原',
  'みなみくりはら',
  '{"en":"Minami-Kurihara"}'::jsonb,
  35.4742664,
  139.4191893,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6259119190,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_m_chi',
  '望地',
  'もうち',
  '{"en":"Mōchi"}'::jsonb,
  35.453886,
  139.4049167,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6307533611,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ozenjihigashi',
  '王禅寺東',
  'おうぜんじひがし',
  '{"en":"Ozenjihigashi"}'::jsonb,
  35.5850979,
  139.5139833,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7238569360,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ozenjinishi',
  '王禅寺西',
  'おうぜんじにし',
  '{"en":"Ozenjinishi"}'::jsonb,
  35.5957964,
  139.5120423,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7238569361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tsurugamine',
  '鶴ケ峰',
  'つるがみね',
  '{"en":"Tsurugamine"}'::jsonb,
  35.4733242,
  139.5499815,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7243888393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hayabuchi',
  '早渕',
  'はやぶち',
  '{"en":"Hayabuchi"}'::jsonb,
  35.5464169,
  139.600044,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7294124168,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shindenjuku',
  '新田宿',
  'しんでんじゅく',
  '{"en":"Shindenjuku"}'::jsonb,
  35.4823784,
  139.380588,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7550293305,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kurihara',
  '栗原',
  'くりはら',
  '{"en":"Kurihara"}'::jsonb,
  35.4925604,
  139.4196659,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7550293306,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_midorigaoka',
  '緑ケ丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  35.4931912,
  139.4090956,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7550293307,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shiroganecho',
  '白金町',
  'しろがねちょう',
  '{"en":"Shiroganecho"}'::jsonb,
  35.4388848,
  139.6203796,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7551745900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kominatoch',
  '小港町',
  'こみなとちょう',
  '{"en":"Kominatochō"}'::jsonb,
  35.4322569,
  139.6637876,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7608170762,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kitagatacho',
  '北方町',
  'きたがたちょう',
  '{"en":"Kitagatacho"}'::jsonb,
  35.4317702,
  139.6604975,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7608170769,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_honmokucho',
  '本牧町',
  'ほんもくちょう',
  '{"en":"Honmokucho"}'::jsonb,
  35.4299197,
  139.6601914,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7608170775,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_suehirocho',
  '末広町',
  'すえひろちょう',
  '{"en":"Suehirocho"}'::jsonb,
  35.4440224,
  139.6328009,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7619128470,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hong_cho',
  '本郷町',
  'ほんごうちょう',
  '{"en":"Hongōcho"}'::jsonb,
  35.4305102,
  139.6550704,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7627621353,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_magino',
  '牧野',
  'まぎの',
  '{"en":"Magino"}'::jsonb,
  35.5887981,
  139.155795,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7631282131,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_magino_quarter',
  '牧野',
  'まぎの',
  '{"en":"Magino"}'::jsonb,
  35.5751483,
  139.1640121,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7631282132,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_magino_quarter_7631282133',
  '牧野',
  'まぎの',
  '{"en":"Magino"}'::jsonb,
  35.5817624,
  139.1324404,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7631282133,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_magino_quarter_7631282135',
  '牧野',
  'まぎの',
  '{"en":"Magino"}'::jsonb,
  35.5481901,
  139.1190638,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7631282135,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_aone',
  '青根',
  'あおね',
  '{"en":"Aone"}'::jsonb,
  35.5358643,
  139.1275733,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7631282137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kugenuma_ishigami',
  '鵠沼石上',
  'くげぬまいしがみ',
  '{"en":"Kugenuma-Ishigami"}'::jsonb,
  35.3325865,
  139.4873907,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7636575944,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kozono_minami',
  '小園南',
  'こぞのみなみ',
  '{"en":"Kozono-Minami"}'::jsonb,
  35.4476288,
  139.411527,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7639986367,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_nishi',
  '寺尾西',
  'てらおにし',
  '{"en":"Terao-Nishi"}'::jsonb,
  35.4528716,
  139.4200316,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7639986370,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_honch',
  '寺尾本町',
  'てらおほんちょう',
  '{"en":"Terao-Honchō"}'::jsonb,
  35.4543697,
  139.4247663,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7639986372,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_susugaya',
  '煤ヶ谷',
  'すすがや',
  '{"en":"Susugaya"}'::jsonb,
  35.4858019,
  139.2768316,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7653240869,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_miyagase',
  '宮ヶ瀬',
  'みやがせ',
  '{"en":"Miyagase"}'::jsonb,
  35.5227702,
  139.2272796,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7653240871,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_susugaya_quarter',
  '煤ヶ谷',
  'すすがや',
  '{"en":"Susugaya"}'::jsonb,
  35.462357,
  139.2105264,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7653240873,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_takashima',
  '高島',
  'たかしま',
  '{"en":"Takashima"}'::jsonb,
  35.4622243,
  139.6227788,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7681935034,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minami_saiwai',
  '南幸',
  'みなみさいわい',
  '{"en":"Minami-Saiwai"}'::jsonb,
  35.4650943,
  139.6192504,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7681935056,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kita_saiwai',
  '北幸',
  'きたさいわい',
  '{"en":"Kita-Saiwai"}'::jsonb,
  35.4675485,
  139.6170444,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7681935060,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_okano',
  '岡野',
  'おかの',
  '{"en":"Okano"}'::jsonb,
  35.4618375,
  139.6137521,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7681935066,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_koyato',
  '小谷',
  'こやと',
  '{"en":"Koyato"}'::jsonb,
  35.3811003,
  139.3957835,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7702823637,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_iriya_nishi',
  '入谷西',
  'いりやにし',
  '{"en":"Iriya-Nishi"}'::jsonb,
  35.4832683,
  139.3952171,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7729576413,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tatsunodai',
  '立野台',
  'たつのだい',
  '{"en":"Tatsunodai"}'::jsonb,
  35.4793052,
  139.4096784,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7732441436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamitsuchidana_naka',
  '上土棚中',
  'かみつちだななか',
  '{"en":"Kamitsuchidana-Naka"}'::jsonb,
  35.4169256,
  139.4512847,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7782984358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yoshioka_higashi',
  '吉岡東',
  'よしおかひがし',
  '{"en":"Yoshioka-Higashi"}'::jsonb,
  35.4248806,
  139.4248123,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7795656973,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_zama',
  '座間',
  'ざま',
  '{"en":"Zama"}'::jsonb,
  35.4865288,
  139.3877657,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7814374096,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nishi_kurihara',
  '西栗原',
  'にしくりはら',
  '{"en":"Nishi-Kurihara"}'::jsonb,
  35.4744396,
  139.4119413,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7816120487,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_okada',
  '岡田',
  'おかだ',
  '{"en":"Okada"}'::jsonb,
  35.3704328,
  139.3929584,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7821367450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_fukaya_naka',
  '深谷中',
  'ふかやなか',
  '{"en":"Fukaya-Naka"}'::jsonb,
  35.4360686,
  139.4368226,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7823249852,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_fukaya_kami',
  '深谷上',
  'ふかやかみ',
  '{"en":"Fukaya-Kami"}'::jsonb,
  35.4431637,
  139.4310589,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7823249855,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_fukaya_minami',
  '深谷南',
  'ふかやみなみ',
  '{"en":"Fukaya-Minami"}'::jsonb,
  35.4317284,
  139.4423701,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7823249857,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kurihara_ch',
  '栗原中央',
  'くりはらちゅうおう',
  '{"en":"Kurihara-Chūō"}'::jsonb,
  35.4826104,
  139.4160824,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7831049602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_higashihara',
  '東原',
  'ひがしはら',
  '{"en":"Higashihara"}'::jsonb,
  35.4790224,
  139.4269356,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7831049603,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hibarigaoka',
  'ひばりが丘',
  'ひばりがおか',
  '{"en":"Hibarigaoka"}'::jsonb,
  35.4857938,
  139.4322319,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7833191152,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_komatsubara',
  '小松原',
  'こまつばら',
  '{"en":"Komatsubara"}'::jsonb,
  35.4970265,
  139.4300753,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7833191153,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hironodai',
  '広野台',
  'ひろのだい',
  '{"en":"Hironodai"}'::jsonb,
  35.5022689,
  139.4217749,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7833191154,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sagamigaoka',
  '相模が丘',
  'さがみがおか',
  '{"en":"Sagamigaoka"}'::jsonb,
  35.508875,
  139.4229866,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7833970044,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_osogo',
  '獺郷',
  'おそごう',
  '{"en":"Osogo"}'::jsonb,
  35.388757,
  139.406502,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7847905858,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_miyabara',
  '宮原',
  'みやばら',
  '{"en":"Miyabara"}'::jsonb,
  35.39871,
  139.4065664,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7847905859,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_teraodai_quarter',
  '寺尾台',
  'てらおだい',
  '{"en":"Teraodai"}'::jsonb,
  35.4586395,
  139.4179534,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7858055789,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_kita',
  '寺尾北',
  'てらおきた',
  '{"en":"Terao-Kita"}'::jsonb,
  35.4648045,
  139.4201533,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7858055790,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_naka',
  '寺尾中',
  'てらおなか',
  '{"en":"Terao-Naka"}'::jsonb,
  35.4597927,
  139.4221293,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7859858809,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_kamata',
  '寺尾釜田',
  'てらおかまた',
  '{"en":"Terao-Kamata"}'::jsonb,
  35.4475657,
  139.4235762,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7870742928,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ichinomiya',
  '一之宮',
  'いちのみや',
  '{"en":"Ichinomiya"}'::jsonb,
  35.3657822,
  139.378888,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7878400393,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_magari',
  '大曲',
  'おおまがり',
  '{"en":"Ōmagari"}'::jsonb,
  35.3574633,
  139.3936535,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7878400398,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_gami',
  '大上',
  'おおがみ',
  '{"en":"Ōgami"}'::jsonb,
  35.4607459,
  139.4291195,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7891998847,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ochiai_minami',
  '落合南',
  'おちあいみなみ',
  '{"en":"Ochiai-Minami"}'::jsonb,
  35.4182928,
  139.4421105,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7931603059,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamitsuchidana_kita',
  '上土棚北',
  'かみつちだなきた',
  '{"en":"Kamitsuchidana-Kita"}'::jsonb,
  35.4229842,
  139.4477087,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8080543402,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ochiai_kita',
  '落合北',
  'おちあいきた',
  '{"en":"Ochiai-Kita"}'::jsonb,
  35.4238767,
  139.4353962,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8080543403,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kugenuma_tachibana',
  '鵠沼橘',
  'くげぬまたちばな',
  '{"en":"Kugenuma-Tachibana"}'::jsonb,
  35.3340472,
  139.4835242,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8286784137,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_fukami_nishi',
  '深見西',
  'ふかみにし',
  '{"en":"Fukami-Nishi"}'::jsonb,
  35.4802124,
  139.4611723,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8354100328,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sakuramori',
  '桜森',
  'さくらもり',
  '{"en":"Sakuramori"}'::jsonb,
  35.4706715,
  139.4396649,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8354100330,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misakimachi_koajiro',
  '三崎町小網代',
  'みさきまちこあじろ',
  '{"en":"Misakimachi-Koajiro"}'::jsonb,
  35.1605078,
  139.6287364,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8370725931,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misakimachi_moroiso',
  '三崎町諸磯',
  'みさきまちもろいそ',
  '{"en":"Misakimachi-Moroiso"}'::jsonb,
  35.1527317,
  139.6212852,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8370725932,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misakimachi_mutsuai',
  '三崎町六合',
  'みさきまちむつあい',
  '{"en":"Misakimachi-Mutsuai"}'::jsonb,
  35.1497096,
  139.637121,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8370725946,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misakimachi_jogashima',
  '三崎町城ヶ島',
  'みさきまちじょうがしま',
  '{"en":"Misakimachi-Jogashima"}'::jsonb,
  35.1334834,
  139.6200192,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8370725952,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yokodai',
  '洋光台',
  'ようこうだい',
  '{"en":"Yokodai"}'::jsonb,
  35.3775554,
  139.594484,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8389925552,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tanazawa_quarter',
  '棚澤',
  'たなざわ',
  '{"en":"Tanazawa"}'::jsonb,
  35.5087189,
  139.3271112,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397090213,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hanbara',
  '半原',
  'はんばら',
  '{"en":"Hanbara"}'::jsonb,
  35.5450598,
  139.2574811,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397090214,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hanbara_quarter',
  '半原',
  'はんばら',
  '{"en":"Hanbara"}'::jsonb,
  35.5372901,
  139.2718685,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397090215,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tashiro',
  '田代',
  'たしろ',
  '{"en":"Tashiro"}'::jsonb,
  35.5263326,
  139.2865455,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397090216,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mimase',
  '三増',
  'みませ',
  '{"en":"Mimase"}'::jsonb,
  35.5396909,
  139.3014693,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397103817,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sumida',
  '角田',
  'すみだ',
  '{"en":"Sumida"}'::jsonb,
  35.5300958,
  139.3153953,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397103818,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakatsu',
  '中津',
  'なかつ',
  '{"en":"Nakatsu"}'::jsonb,
  35.5165089,
  139.33725,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397103819,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hasugesan',
  '八菅山',
  'はすげさん',
  '{"en":"Hasugesan"}'::jsonb,
  35.5132515,
  139.3247187,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397103820,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakatsu_quarter',
  '中津',
  'なかつ',
  '{"en":"Nakatsu"}'::jsonb,
  35.5024742,
  139.3417132,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8397103821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_toya',
  '鳥屋',
  'とや',
  '{"en":"Toya"}'::jsonb,
  35.5494521,
  139.2269944,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8414017646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_aoyama',
  '青山',
  'あおやま',
  '{"en":"Aoyama"}'::jsonb,
  35.5634985,
  139.24237,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8414017648,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nagatake',
  '長竹',
  'ながたけ',
  '{"en":"Nagatake"}'::jsonb,
  35.5657787,
  139.2608634,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8414017650,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_oppama_higashi_cho',
  '追浜東町',
  'おっぱまひがしちょう',
  '{"en":"Oppama-higashi-cho"}'::jsonb,
  35.3110454,
  139.6305281,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423077984,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_oppama_honcho',
  '追浜本町',
  'おっぱまほんちょう',
  '{"en":"Oppama-honcho"}'::jsonb,
  35.3195527,
  139.6292433,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423077985,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_oppama_cho',
  '追浜町',
  'おっぱまちょう',
  '{"en":"Oppama-cho"}'::jsonb,
  35.3096271,
  139.6256626,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423077988,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hamamidai',
  '浜見台',
  'はまみだい',
  '{"en":"Hamamidai"}'::jsonb,
  35.3080862,
  139.6285379,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423077989,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shonan_katori',
  '湘南鷹取',
  'しょうなんかとり',
  '{"en":"Shonan Katori"}'::jsonb,
  35.3079987,
  139.6178251,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423077997,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_katori',
  '鷹取',
  'かとり',
  '{"en":"Katori"}'::jsonb,
  35.3161101,
  139.620907,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8423078004,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_k_kand_ri',
  '鋼管通',
  '鋼管通',
  '{"en":"Kōkandōri"}'::jsonb,
  35.5160295,
  139.7137889,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8600828257,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_東淵野辺',
  '東淵野辺',
  '東淵野辺',
  NULL,
  35.5632664,
  139.411822,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662896,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_淵野辺本',
  '淵野辺本町',
  '淵野辺本町',
  NULL,
  35.571206,
  139.4069377,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662897,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_共和',
  '共和',
  '共和',
  NULL,
  35.5632638,
  139.4010537,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662898,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_由野台',
  '由野台',
  '由野台',
  NULL,
  35.5587233,
  139.3978568,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662899,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_松が丘',
  '松が丘',
  '松が丘',
  NULL,
  35.5528971,
  139.3943806,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662900,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_田名塩田',
  '田名塩田',
  '田名塩田',
  NULL,
  35.5360532,
  139.3574878,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662902,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_陽光台',
  '陽光台',
  '陽光台',
  NULL,
  35.5519937,
  139.3745467,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662904,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_緑が丘',
  '緑が丘',
  '緑が丘',
  NULL,
  35.5488861,
  139.3833872,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662905,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_青葉',
  '青葉',
  '青葉',
  NULL,
  35.5503657,
  139.3881186,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662906,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_南橋本',
  '南橋本',
  '南橋本',
  NULL,
  35.5777017,
  139.3510851,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662909,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_東橋本',
  '東橋本',
  '東橋本',
  NULL,
  35.5925147,
  139.3545321,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662911,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_橋本',
  '橋本',
  '橋本',
  NULL,
  35.5987778,
  139.3417369,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662912,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮下',
  '宮下',
  '宮下',
  NULL,
  35.5909479,
  139.3616209,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662914,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮下本',
  '宮下本町',
  '宮下本町',
  NULL,
  35.5946143,
  139.367664,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620662915,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_清新',
  '清新',
  '清新',
  NULL,
  35.5761824,
  139.3602374,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701419,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_小町通',
  '小町通',
  '小町通',
  NULL,
  35.5711404,
  139.3587558,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701420,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_横山台',
  '横山台',
  '横山台',
  NULL,
  35.5667013,
  139.3561126,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701421,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_横山',
  '横山',
  '横山',
  NULL,
  35.5634858,
  139.3648132,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701422,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_星が丘',
  '星が丘',
  '星が丘',
  NULL,
  35.5614031,
  139.3695755,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701423,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_千代田',
  '千代田',
  '千代田',
  NULL,
  35.5636368,
  139.3764943,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701424,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_富士見',
  '富士見',
  '富士見',
  NULL,
  35.567605,
  139.3763032,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701425,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_中央',
  '中央',
  '中央',
  NULL,
  35.5713646,
  139.3691997,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701426,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_相模原',
  '相模原',
  '相模原',
  NULL,
  35.5791991,
  139.3719976,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701427,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_矢部',
  '矢部',
  '矢部',
  NULL,
  35.5719311,
  139.3844236,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701428,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_鹿沼台',
  '鹿沼台',
  '鹿沼台',
  NULL,
  35.567892,
  139.389077,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701429,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_相生',
  '相生',
  '相生',
  NULL,
  35.5641667,
  139.3860408,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701430,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_弥栄',
  '弥栄',
  '弥栄',
  NULL,
  35.5572208,
  139.3899068,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701431,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_並木',
  '並木',
  '並木',
  NULL,
  35.5563994,
  139.3821526,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701432,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_光が丘',
  '光が丘',
  '光が丘',
  NULL,
  35.5539465,
  139.3781989,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701433,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_高根',
  '高根',
  '高根',
  NULL,
  35.5612364,
  139.3920554,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701434,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_相原',
  '相原',
  '相原',
  NULL,
  35.601895,
  139.31831,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701439,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_町屋',
  '町屋',
  '町屋',
  NULL,
  35.6020825,
  139.3082796,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701440,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_原宿',
  '原宿',
  '原宿',
  NULL,
  35.5984638,
  139.3125322,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_久保沢',
  '久保沢',
  '久保沢',
  NULL,
  35.5982157,
  139.3021508,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701442,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_若葉台',
  '若葉台',
  '若葉台',
  NULL,
  35.5960095,
  139.290687,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701443,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kawashiri',
  '川尻',
  'かわしり',
  '{"en":"Kawashiri"}'::jsonb,
  35.6058212,
  139.2854611,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701444,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_城山',
  '城山',
  '城山',
  NULL,
  35.5901347,
  139.2870768,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701445,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_谷ヶ原',
  '谷ヶ原',
  '谷ヶ原',
  NULL,
  35.5913597,
  139.2942322,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701446,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_向原',
  '向原',
  '向原',
  NULL,
  35.5894802,
  139.3035121,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701448,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_川尻',
  '川尻',
  '川尻',
  NULL,
  35.5887548,
  139.308473,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_原宿南',
  '原宿南',
  '原宿南',
  NULL,
  35.5942143,
  139.3126999,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701450,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_二本松',
  '二本松',
  '二本松',
  NULL,
  35.5939874,
  139.3210641,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701451,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_橋本台',
  '橋本台',
  '橋本台',
  NULL,
  35.5873118,
  139.3311703,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8620701453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yak',
  '夜光',
  'やこう',
  '{"en":"Yakō"}'::jsonb,
  35.5210906,
  139.7460807,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8630711105,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terayama',
  '寺山',
  'てらやま',
  '{"en":"Terayama"}'::jsonb,
  35.421937,
  139.217407,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906255,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_horiyamashita',
  '堀山下',
  'ほりやました',
  '{"en":"Horiyamashita"}'::jsonb,
  35.41712,
  139.163272,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906277,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tanzawa_terayama',
  '丹沢寺山',
  'たんざわてらやま',
  '{"en":"Tanzawa-terayama"}'::jsonb,
  35.447476,
  139.204977,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906287,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kominoge',
  '小蓑毛',
  'こみのげ',
  '{"en":"Kominoge"}'::jsonb,
  35.410602,
  139.238525,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906291,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tokawa',
  '戸川',
  'とかわ',
  '{"en":"Tokawa"}'::jsonb,
  35.419913,
  139.174456,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906296,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minoge',
  '蓑毛',
  'みのげ',
  '{"en":"Minoge"}'::jsonb,
  35.419514,
  139.232032,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670906300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_松根',
  '松根',
  '松根',
  NULL,
  35.311877,
  139.259111,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670908646,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_寄',
  '寄',
  '寄',
  NULL,
  35.405665,
  139.124082,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670911008,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_松田庶子',
  '松田庶子',
  '松田庶子',
  NULL,
  35.359809,
  139.127527,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670911009,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_松田惣領',
  '松田惣領',
  '松田惣領',
  NULL,
  35.353277,
  139.144412,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670911010,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_神山',
  '神山',
  '神山',
  NULL,
  35.350289,
  139.157257,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670911011,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yokono',
  '横野',
  'よこの',
  '{"en":"Yokono"}'::jsonb,
  35.417396,
  139.179203,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670919620,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mikurube',
  '三廻部',
  'みくるべ',
  '{"en":"Mikurube"}'::jsonb,
  35.419959,
  139.152384,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670919636,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_bodai',
  '菩提',
  'ぼだい',
  '{"en":"Bodai"}'::jsonb,
  35.411543,
  139.199063,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670919640,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮下_quarter',
  '宮下',
  '宮下',
  NULL,
  35.148898,
  139.090838,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928351,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_吉浜',
  '吉浜',
  '吉浜',
  NULL,
  35.171964,
  139.101959,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928354,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_城堀',
  '城堀',
  '城堀',
  NULL,
  35.151958,
  139.098208,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928355,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_鍛冶屋',
  '鍛冶屋',
  '鍛冶屋',
  NULL,
  35.170764,
  139.075554,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928358,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_門川',
  '門川',
  '門川',
  NULL,
  35.143506,
  139.111718,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928359,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮上',
  '宮上',
  '宮上',
  NULL,
  35.162054,
  139.053297,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928361,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_福浦',
  '福浦',
  '福浦',
  NULL,
  35.151977,
  139.131938,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670928363,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_中川',
  '中川',
  '中川',
  NULL,
  35.438548,
  139.045638,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938580,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_皆瀬川',
  '皆瀬川',
  '皆瀬川',
  NULL,
  35.372118,
  139.06368,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938581,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_岸',
  '岸',
  '岸',
  NULL,
  35.353049,
  139.089439,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938582,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_神縄',
  '神縄',
  '神縄',
  NULL,
  35.402622,
  139.045952,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938583,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_谷ケ',
  '谷ケ',
  '谷ケ',
  NULL,
  35.366077,
  139.037632,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938584,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_平山',
  '平山',
  '平山',
  NULL,
  35.35414,
  139.068131,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938585,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_山市場',
  '山市場',
  '山市場',
  NULL,
  35.395065,
  139.040959,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938586,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_向原_quarter',
  '向原',
  '向原',
  NULL,
  35.359697,
  139.103054,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938587,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_山北',
  '山北',
  '山北',
  NULL,
  35.3612682,
  139.0808142,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938588,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_世附',
  '世附',
  '世附',
  NULL,
  35.411019,
  139.008718,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938589,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tsuburano',
  '都夫良野',
  'つぶらの',
  '{"en":"Tsuburano"}'::jsonb,
  35.367827,
  139.055306,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938590,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kurokura',
  '玄倉',
  'くろくら',
  '{"en":"Kurokura"}'::jsonb,
  35.418153,
  139.070084,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938591,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yubure',
  '湯触',
  '湯触',
  '{"en":"Yubure"}'::jsonb,
  35.378767,
  139.034666,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938592,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_神尾田',
  '神尾田',
  '神尾田',
  NULL,
  35.413404,
  139.042582,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938593,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kawanishi',
  '川西',
  '川西',
  '{"en":"Kawanishi"}'::jsonb,
  35.3734719,
  139.0310355,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_畑宿',
  '畑宿',
  '畑宿',
  NULL,
  35.205265,
  139.056263,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938734,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_須雲川',
  '須雲川',
  '須雲川',
  NULL,
  35.213108,
  139.07492,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938735,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_小涌谷',
  '小涌谷',
  '小涌谷',
  NULL,
  35.232252,
  139.052384,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938736,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sengokuhara',
  '仙石原',
  'せんごくはら',
  '{"en":"Sengokuhara"}'::jsonb,
  35.2606,
  139.004544,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938737,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_湯本茶屋',
  '湯本茶屋',
  '湯本茶屋',
  NULL,
  35.222086,
  139.089696,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938738,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_芦之湯',
  '芦之湯',
  '芦之湯',
  NULL,
  35.219776,
  139.043487,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938739,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_箱根',
  '箱根',
  '箱根',
  NULL,
  35.189737,
  139.037778,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938740,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_t_nosawa',
  '塔之澤',
  'とうのさわ',
  '{"en":"Tōnosawa"}'::jsonb,
  35.236584,
  139.093501,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938741,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ninotaira',
  '二ノ平',
  'にのたいら',
  '{"en":"Ninotaira"}'::jsonb,
  35.2423589,
  139.0468904,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938742,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_元箱根',
  '元箱根',
  '元箱根',
  NULL,
  35.216444,
  139.010472,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938743,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_底倉',
  '底倉',
  '底倉',
  NULL,
  35.244144,
  139.056258,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938745,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_木賀',
  '木賀',
  '木賀',
  NULL,
  35.248418,
  139.052072,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938746,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_大平台',
  '大平台',
  '大平台',
  NULL,
  35.234907,
  139.072294,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938747,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_g_ra',
  '強羅',
  'ごうら',
  '{"en":"Gōra"}'::jsonb,
  35.24864,
  139.039085,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938748,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮ノ下',
  '宮ノ下',
  '宮ノ下',
  NULL,
  35.240245,
  139.061394,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938749,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_宮城野',
  '宮城野',
  '宮城野',
  NULL,
  35.263846,
  139.048586,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8670938750,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nagura',
  '名倉',
  'なぐら',
  '{"en":"Nagura"}'::jsonb,
  35.605801,
  139.1421706,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8700706753,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_konandai',
  '港南台',
  'こうなんだい',
  '{"en":"Konandai"}'::jsonb,
  35.3732068,
  139.5779497,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8756787726,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamishitauramachi_matsuwa',
  '南下浦町松輪',
  'みなみしたうらまちまつわ',
  '{"en":"Minamishitauramachi-Matsuwa"}'::jsonb,
  35.146428,
  139.674138,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847332,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamishitauramachi_kikuna',
  '南下浦町菊名',
  'みなみしたうらまちきくな',
  '{"en":"Minamishitauramachi-Kikuna"}'::jsonb,
  35.172526,
  139.648245,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847333,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamishitauramachi_kaneda',
  '南下浦町金田',
  'みなみしたうらまちかねだ',
  '{"en":"Minamishitauramachi-Kaneda"}'::jsonb,
  35.162896,
  139.651037,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847334,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamishitauramachi_kamimiyada',
  '南下浦町上宮田',
  'みなみしたうらまちかみみやだ',
  '{"en":"Minamishitauramachi-Kamimiyada"}'::jsonb,
  35.19202,
  139.652383,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847335,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamishitauramachi_bishamon',
  '南下浦町毘沙門',
  'みなみしたうらまちびしゃもん',
  '{"en":"Minamishitauramachi-Bishamon"}'::jsonb,
  35.146532,
  139.649469,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847336,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hassemachi_wada',
  '初声町和田',
  'はっせまちわだ',
  '{"en":"Hassemachi-Wada"}'::jsonb,
  35.195718,
  139.630122,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847337,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hassemachi_shimomiyada',
  '初声町下宮田',
  'はっせまちしもみやだ',
  '{"en":"Hassemachi-Shimomiyada"}'::jsonb,
  35.1793981,
  139.6372194,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847338,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hassemachi_mito',
  '初声町三戸',
  'はっせまちみと',
  '{"en":"Hassemachi-Mito"}'::jsonb,
  35.172833,
  139.628053,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847339,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hassemachi_koenbo',
  '初声町高円坊',
  'はっせまちこうえんぼう',
  '{"en":"Hassemachi-Koenbo"}'::jsonb,
  35.201348,
  139.647031,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847340,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hassemachi_irie',
  '初声町入江',
  'はっせまちいりえ',
  '{"en":"Hassemachi-Irie"}'::jsonb,
  35.1864736,
  139.6263547,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8776847341,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hizure',
  '日連',
  'ひづれ',
  '{"en":"Hizure"}'::jsonb,
  35.607578,
  139.170395,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803436,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ogura',
  '小倉',
  'おぐら',
  '{"en":"Ogura"}'::jsonb,
  35.5825925,
  139.2950229,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803437,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hirota',
  '広田',
  'ひろた',
  '{"en":"Hirota"}'::jsonb,
  35.6036259,
  139.301301,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803438,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yosehoncho',
  '与瀬本町',
  'よせほんちょう',
  '{"en":"Yosehoncho"}'::jsonb,
  35.615764,
  139.188882,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803441,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_suwarashi',
  '寸沢嵐',
  'すわらし',
  '{"en":"Suwarashi"}'::jsonb,
  35.5864955,
  139.2124979,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803447,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hayamajima',
  '葉山島',
  'はやまじま',
  '{"en":"Hayamajima"}'::jsonb,
  35.557768,
  139.315008,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803449,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yose',
  '与瀬',
  'よせ',
  '{"en":"Yose"}'::jsonb,
  35.6210798,
  139.1853572,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803453,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mii',
  '三井',
  'みい',
  '{"en":"Mii"}'::jsonb,
  35.598002,
  139.259054,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803454,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_obuchi',
  '小渕',
  'おぶち',
  '{"en":"Obuchi"}'::jsonb,
  35.623453,
  139.137423,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803459,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_aonohara',
  '青野原',
  'あおのはら',
  '{"en":"Aonohara"}'::jsonb,
  35.559565,
  139.1897401,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803460,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mikage',
  '三ケ木',
  'みかげ',
  '{"en":"Mikage"}'::jsonb,
  35.5907161,
  139.2291335,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803466,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_chigira',
  '千木良',
  'ちぎら',
  '{"en":"Chigira"}'::jsonb,
  35.6195894,
  139.2123117,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803469,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakazawa',
  '中沢',
  'なかざわ',
  '{"en":"Nakazawa"}'::jsonb,
  35.595703,
  139.277514,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803474,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sawai',
  '澤井',
  'さわい',
  '{"en":"Sawai"}'::jsonb,
  35.635385,
  139.148584,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803477,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_negoya',
  '根小屋',
  'ねごや',
  '{"en":"Negoya"}'::jsonb,
  35.5721038,
  139.2732967,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803483,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_wakayanagi',
  '若柳',
  'わかやなぎ',
  '{"en":"Wakayanagi"}'::jsonb,
  35.607171,
  139.205709,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803488,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_oi',
  '太井',
  'おおい',
  '{"en":"Oi"}'::jsonb,
  35.585065,
  139.273573,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803489,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakano',
  '中野',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  35.583885,
  139.249382,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803491,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_matano',
  '又野',
  'またの',
  '{"en":"Matano"}'::jsonb,
  35.594432,
  139.246832,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803500,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_obara',
  '小原',
  'おばら',
  '{"en":"Obara"}'::jsonb,
  35.630452,
  139.2005639,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803507,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yoshino',
  '吉野',
  'よしの',
  '{"en":"Yoshino"}'::jsonb,
  35.6198991,
  139.1669912,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778803512,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sanogawa',
  '佐野川',
  'さのがわ',
  '{"en":"Sanogawa"}'::jsonb,
  35.651835,
  139.141826,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8778820019,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_fujitsukacho',
  '藤塚町',
  'ふじつかちょう',
  '{"en":"Fujitsukacho"}'::jsonb,
  35.4500166,
  139.572468,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8780474787,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kofudai',
  '光風台',
  'こうふうだい',
  '{"en":"Kofudai"}'::jsonb,
  35.2387013,
  139.7110509,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8837224301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_yoda',
  '用田',
  'ようだ',
  '{"en":"Yoda"}'::jsonb,
  35.410387,
  139.416146,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8837233299,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shobusawa',
  '菖蒲沢',
  'しょうぶさわ',
  '{"en":"Shobusawa"}'::jsonb,
  35.398711,
  139.441176,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8837233300,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_uchimodori',
  '打戻',
  'うちもどり',
  '{"en":"Uchimodori"}'::jsonb,
  35.391157,
  139.416991,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8837233301,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kuzuhara',
  '葛原',
  'くずはら',
  '{"en":"Kuzuhara"}'::jsonb,
  35.407353,
  139.432605,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8837233302,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_motoohashi',
  '元大橋',
  'もとおおはし',
  '{"en":"Motoohashi"}'::jsonb,
  35.3703432,
  139.566711,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8844323965,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hinochuo',
  '日野中央',
  'ひのちゅうおう',
  '{"en":"Hinochuo"}'::jsonb,
  35.3844766,
  139.5844585,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8906190471,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kami_tammachi',
  '上反町',
  'かみたんまち',
  '{"en":"Kami-Tammachi"}'::jsonb,
  35.4740236,
  139.6237843,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9055076851,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_根岸',
  '根岸町',
  'ねぎしちょう',
  NULL,
  35.4193309,
  139.64325,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9280639265,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hakusan',
  '白山',
  'はくさん',
  '{"en":"Hakusan"}'::jsonb,
  35.5892084,
  139.5105554,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9348774821,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakajima',
  '中島',
  '中島',
  '{"en":"Nakajima"}'::jsonb,
  35.528131,
  139.7162613,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9366509145,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sakuramoto',
  '桜本',
  'さくらもと',
  '{"en":"Sakuramoto"}'::jsonb,
  35.5206245,
  139.7239445,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9470323557,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_komukai_nishimachi',
  '小向西町',
  'こむかいにしまち',
  '{"en":"Komukai-nishimachi"}'::jsonb,
  35.5469405,
  139.6889495,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9544205089,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shodo',
  '庄戸',
  'しょうど',
  '{"en":"Shodo"}'::jsonb,
  35.3518839,
  139.5847105,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9960907127,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_港',
  '港町',
  '港町',
  NULL,
  35.4444896,
  139.6360541,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9982836318,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_真砂',
  '真砂町',
  '真砂町',
  NULL,
  35.4458289,
  139.6352448,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9982836319,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sanada',
  '真田',
  'さなだ',
  '{"en":"Sanada"}'::jsonb,
  35.3709808,
  139.2769657,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10072764128,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sasage',
  '笹下',
  'ささげ',
  '{"en":"Sasage"}'::jsonb,
  35.389809,
  139.5967219,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10091412123,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_mori',
  '森',
  'もり',
  '{"en":"Mori"}'::jsonb,
  35.3932747,
  139.6078813,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10159138685,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tanaka',
  '田中',
  'たなか',
  '{"en":"Tanaka"}'::jsonb,
  35.3834996,
  139.6026353,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10166345764,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_izumichuo_minami',
  '和泉中央南',
  'いずみがおかちゅうおうみなみ',
  '{"en":"Izumichuo-minami"}'::jsonb,
  35.4128741,
  139.4917791,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10859943602,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_izumigaoka',
  '和泉が丘',
  'いずみがおか',
  '{"en":"Izumigaoka"}'::jsonb,
  35.404337,
  139.4967224,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10859963526,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_izumichuo_kita',
  '和泉中央北',
  'いずみちゅうおうきた',
  '{"en":"Izumichuo-kita"}'::jsonb,
  35.4205707,
  139.4928246,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10859977594,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamiooka_higashi',
  '上大岡東',
  'かみおおおかひがし',
  '{"en":"Kamiooka-higashi"}'::jsonb,
  35.4073226,
  139.6003053,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10867549532,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hiyoshi',
  '日吉',
  'ひよし',
  '{"en":"Hiyoshi"}'::jsonb,
  35.5505579,
  139.6513678,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10870405119,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_susukino',
  'すすき野',
  'すすきの',
  '{"en":"Susukino"}'::jsonb,
  35.5770229,
  139.5276162,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11010435416,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ekoda',
  '荏子田',
  'えこだ',
  '{"en":"Ekoda"}'::jsonb,
  35.5780701,
  139.5371652,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11010513288,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tono_machi',
  '殿町',
  'とのまち',
  '{"en":"Tono-machi"}'::jsonb,
  35.5391663,
  139.7512524,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11027538803,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_suehirocho_quarter',
  '末広町',
  'すえひろちょう',
  '{"en":"Suehirocho"}'::jsonb,
  35.4907264,
  139.6898174,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11029538409,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_asada',
  '浅田',
  'あさだ',
  '{"en":"Asada"}'::jsonb,
  35.5068538,
  139.7023902,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11029739198,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_egawa',
  '江川',
  '江川',
  '{"en":"Egawa"}'::jsonb,
  35.5361783,
  139.7458675,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11033600327,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_tamachi',
  '田町',
  '田町',
  '{"en":"Tamachi"}'::jsonb,
  35.5344126,
  139.7465557,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11034284853,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_hinode',
  '日ノ出',
  '日ノ出',
  '{"en":"Hinode"}'::jsonb,
  35.5326533,
  139.7433805,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11034313826,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_shiohama',
  '塩浜',
  '塩浜',
  '{"en":"Shiohama"}'::jsonb,
  35.5262511,
  139.743404,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11039308783,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ikegami_shincho',
  '池上新町',
  '池上新町',
  '{"en":"Ikegami shincho"}'::jsonb,
  35.5239619,
  139.7317697,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11039451827,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_minamidai',
  '南台',
  'みなみだい',
  '{"en":"Minamidai"}'::jsonb,
  35.5215221,
  139.4242461,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11091956953,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_富士見が丘',
  '富士見が丘',
  '富士見が丘',
  NULL,
  35.3074413,
  139.2617149,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11459553849,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_平安',
  '平安町',
  '平安町',
  NULL,
  35.5149553,
  139.691716,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11491411666,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nurumizu',
  '温水',
  'ぬるみず',
  '{"en":"Nurumizu"}'::jsonb,
  35.4476823,
  139.3352451,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  11960771862,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamifurusawa',
  '上古沢',
  'かみふるさわ',
  '{"en":"Kamifurusawa"}'::jsonb,
  35.4569067,
  139.3088007,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  12119159002,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamiogino',
  '上荻野',
  'かみおぎの',
  '{"en":"Kamiogino"}'::jsonb,
  35.5035662,
  139.3045216,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  12184245268,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_terao_minami',
  '寺尾南',
  'てらおみなみ',
  '{"en":"Terao-Minami"}'::jsonb,
  35.4499033,
  139.4276087,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  12369301757,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kamitsuchidana_minami',
  '上土棚南',
  'かみつちだなみなみ',
  '{"en":"Kamitsuchidana-Minami"}'::jsonb,
  35.4109369,
  139.4462015,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  12644364175,
  'quarter'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_kinhiyashi_junction',
  '金冷シ',
  '金冷シ',
  '{"en":"Kinhiyashi Junction"}'::jsonb,
  35.4498225,
  139.1609247,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  357754839,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ゴーラ出合',
  'ゴーラ出合',
  'ゴーラ出合',
  NULL,
  35.477531,
  139.078273,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  1512983033,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ヘッドランド',
  'ヘッドランド',
  'ヘッドランド',
  NULL,
  35.3151843,
  139.414224,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2052214726,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misawa_pass',
  '関東ふれあいの道;三沢峠',
  '関東ふれあいの道;三沢峠',
  '{"en":"Misawa Pass"}'::jsonb,
  35.6021612,
  139.2634341,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  2977479380,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_見晴らしの丘',
  '見晴らしの丘',
  '見晴らしの丘',
  NULL,
  35.4368197,
  139.3195768,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  3202549326,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_どんぐりの丘',
  'どんぐりの丘',
  'どんぐりの丘',
  NULL,
  35.4256521,
  139.6566897,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4045500057,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_まきばの丘',
  'まきばの丘',
  'まきばの丘',
  NULL,
  35.4277241,
  139.6591359,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4045500058,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_wadayama_no_oka',
  '和田山の丘',
  '和田山の丘',
  '{"en":"Wadayama no Oka"}'::jsonb,
  35.4272148,
  139.6627058,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4045500066,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_本牧荒井の丘',
  '本牧荒井の丘',
  '本牧荒井の丘',
  NULL,
  35.4224473,
  139.6530514,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4402084646,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_大山',
  '大山',
  '大山',
  NULL,
  35.2818232,
  139.590464,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4501559982,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_大桜',
  '大桜',
  '大桜',
  NULL,
  35.2776736,
  139.6138199,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4501560028,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_前田の丘',
  '前田の丘',
  '前田の丘',
  NULL,
  35.3921985,
  139.5495191,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4621866986,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_狐久保',
  '狐久保',
  '狐久保',
  NULL,
  35.3890569,
  139.5482055,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4621866991,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_中丸の丘',
  '中丸の丘',
  '中丸の丘',
  NULL,
  35.388543,
  139.5493159,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4621866992,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ばらの丸の丘',
  'ばらの丸の丘',
  'ばらの丸の丘',
  NULL,
  35.3867084,
  139.5509085,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4621867009,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_おおなばの丘',
  'おおなばの丘',
  'おおなばの丘',
  NULL,
  35.385169,
  139.5539259,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4621867010,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_まさかりが淵',
  'まさかりが淵',
  'まさかりが淵',
  NULL,
  35.3878451,
  139.5082023,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  4641744506,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_とおやぎの坂',
  'とおやぎの坂',
  'とおやぎの坂',
  NULL,
  35.421814,
  139.4089359,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5328424370,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_地蔵坂',
  '地蔵坂',
  '地蔵坂',
  NULL,
  35.4297875,
  139.3928983,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5328509861,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_平島',
  '平島',
  '平島',
  NULL,
  35.3126972,
  139.3988606,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5416957608,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ローラー 滑り台',
  'ローラー 滑り台',
  'ローラー 滑り台',
  NULL,
  35.5595937,
  139.4814977,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5500338625,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_千代ケ崎',
  '千代ケ崎',
  '千代ケ崎',
  NULL,
  35.229274,
  139.7290751,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5913691940,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_燈明崎',
  '燈明崎',
  '燈明崎',
  NULL,
  35.2328243,
  139.7292911,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  5913691941,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_地蔵平',
  '地蔵平',
  '地蔵平',
  NULL,
  35.4972944,
  139.1323659,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6017164568,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_きはちの窪',
  'きはちの窪',
  'きはちの窪',
  NULL,
  35.3124287,
  139.5098662,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6985857307,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_小竹ヶ谷',
  '小竹ヶ谷',
  '小竹ヶ谷',
  NULL,
  35.3131926,
  139.5067388,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6985857308,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_室ヶ谷',
  '室ヶ谷',
  '室ヶ谷',
  NULL,
  35.3101612,
  139.5038393,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6985857309,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_竹ヶ谷',
  '竹ヶ谷',
  '竹ヶ谷',
  NULL,
  35.3124889,
  139.5093821,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6985857311,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_御所谷',
  '御所谷',
  '御所谷',
  NULL,
  35.3152171,
  139.5096034,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  6985857315,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_間口漁港',
  '間口漁港',
  '間口漁港',
  NULL,
  35.1444855,
  139.6772897,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7023072138,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_こもれびの丘',
  'こもれびの丘',
  'こもれびの丘',
  NULL,
  35.4461317,
  139.3030947,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7275623157,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_sh_nan',
  '湘南',
  '湘南',
  '{"en":"Shōnan"}'::jsonb,
  35.3071468,
  139.4850343,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7601340495,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_honmoku_wharf',
  '本牧ふ頭',
  'ほんもくふとう',
  '{"en":"Honmoku Wharf"}'::jsonb,
  35.4393309,
  139.6768974,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  7809056768,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_uchidach',
  '内田町',
  '内田町',
  '{"en":"Uchidachō"}'::jsonb,
  35.4555606,
  139.6270208,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  8544194550,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_小段谷戸',
  '小段谷戸',
  '小段谷戸',
  NULL,
  35.3345033,
  139.5318684,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9383247503,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nakazawa_pass',
  '中沢峠',
  '中沢峠',
  '{"en":"Nakazawa Pass"}'::jsonb,
  35.6090808,
  139.2379275,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9384728290,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_nishiyama_pass',
  '西山峠',
  '西山峠',
  '{"en":"Nishiyama Pass"}'::jsonb,
  35.6018059,
  139.2527172,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9384767386,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_misawa_pass_locality',
  '三沢峠',
  '三沢峠',
  '{"en":"Misawa Pass"}'::jsonb,
  35.602151,
  139.2633682,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9402135246,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_ミズキの谷',
  'ミズキの谷',
  'ミズキの谷',
  NULL,
  35.3412517,
  139.5866773,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  9562398083,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_福門寺',
  '福門寺',
  '福門寺',
  NULL,
  35.2562767,
  139.1699439,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  10827463177,
  'locality'
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)
VALUES (
  'kanagawa_unknown_村岡新駅（仮称）',
  '村岡新駅（仮称）',
  '村岡新駅（仮称）',
  NULL,
  35.3384806,
  139.5078116,
  NULL,
  'kanagawa',
  NULL,
  'jp',
  '神奈川県',
  NULL,
  NULL,
  NULL,
  12877086197,
  'locality'
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 19件, machi 394件を挿入
-- (cities 65件は正式な市区町村でないため除外)