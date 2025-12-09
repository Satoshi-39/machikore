-- =============================================
-- 東京都の街データ（OSMから取得）
-- 生成日時: 2025-12-09T05:51:24.292Z
-- データ取得日時: 2025-12-09T05:44:22.742Z
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 既存データの削除（東京都のみ）
-- =============================================

-- 外部キー制約で参照されているデータを先に削除/更新
-- visitsテーブルから東京都の街を参照するレコードを削除
DELETE FROM visits WHERE machi_id IN (SELECT id FROM machi WHERE prefecture_id = 'tokyo');

-- user_spotsテーブルのNOT NULL制約を一時的に外す
ALTER TABLE user_spots ALTER COLUMN machi_id DROP NOT NULL;

-- user_spotsテーブルから東京都の街を参照するレコードのmachi_idをNULLに
UPDATE user_spots SET machi_id = NULL WHERE machi_id IN (SELECT id FROM machi WHERE prefecture_id = 'tokyo');

-- master_spotsテーブルから東京都の街を参照するレコードのmachi_idをNULLに
UPDATE master_spots SET machi_id = NULL WHERE machi_id IN (SELECT id FROM machi WHERE prefecture_id = 'tokyo');

-- machiテーブルから東京都のデータを削除
DELETE FROM machi WHERE prefecture_id = 'tokyo';

-- citiesテーブルから東京都のデータを削除
DELETE FROM cities WHERE prefecture_id = 'tokyo';

-- =============================================
-- 2. citiesデータの挿入
-- =============================================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_meguro',
  'tokyo',
  '目黒区',
  'めぐろく',
  '{"en":"Meguro"}'::jsonb,
  '区',
  'jp',
  35.6412891,
  139.6983834
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_musashino',
  'tokyo',
  '武蔵野市',
  '武蔵野市',
  '{"en":"Musashino"}'::jsonb,
  '市',
  'jp',
  35.7177239,
  139.5659802
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_mitaka',
  'tokyo',
  '三鷹市',
  '三鷹市',
  '{"en":"Mitaka"}'::jsonb,
  '市',
  'jp',
  35.6833926,
  139.5592421
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_komae',
  'tokyo',
  '狛江市',
  '狛江市',
  '{"en":"Komae"}'::jsonb,
  '市',
  'jp',
  35.6347642,
  139.5787343
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_chofu',
  'tokyo',
  '調布市',
  '調布市',
  '{"en":"Chofu"}'::jsonb,
  '市',
  'jp',
  35.6506036,
  139.5407066
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_fuchu',
  'tokyo',
  '府中市',
  '府中市',
  '{"en":"Fuchu"}'::jsonb,
  '市',
  'jp',
  35.6693751,
  139.4774094
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_hachioji',
  'tokyo',
  '八王子市',
  'はちおうじし',
  '{"en":"Hachioji"}'::jsonb,
  '市',
  'jp',
  35.6663595,
  139.3163653
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_hino',
  'tokyo',
  '日野市',
  '日野市',
  '{"en":"Hino"}'::jsonb,
  '市',
  'jp',
  35.6713394,
  139.3949801
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_inagi',
  'tokyo',
  '稲城市',
  'いなぎし',
  '{"en":"Inagi"}'::jsonb,
  '市',
  'jp',
  35.6379674,
  139.5046754
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_tama',
  'tokyo',
  '多摩市',
  '多摩市',
  '{"en":"Tama"}'::jsonb,
  '市',
  'jp',
  35.6370223,
  139.4463569
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_nakano',
  'tokyo',
  '中野区',
  'なかのく',
  '{"en":"Nakano"}'::jsonb,
  '区',
  'jp',
  35.7086179,
  139.6629399
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_nerima',
  'tokyo',
  '練馬区',
  'ねりまく',
  '{"en":"Nerima"}'::jsonb,
  '区',
  'jp',
  35.7357808,
  139.6521325
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_machida',
  'tokyo',
  '町田市',
  '町田市',
  '{"en":"Machida"}'::jsonb,
  '市',
  'jp',
  35.5466803,
  139.4386999
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_kokubunji',
  'tokyo',
  '国分寺市',
  '国分寺市',
  '{"en":"Kokubunji"}'::jsonb,
  '市',
  'jp',
  35.709674,
  139.454224
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_kunitachi',
  'tokyo',
  '国立市',
  '国立市',
  '{"en":"Kunitachi"}'::jsonb,
  '市',
  'jp',
  35.681991,
  139.43624
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_toshima',
  'tokyo',
  '豊島区',
  'としまく',
  '{"en":"Toshima"}'::jsonb,
  '区',
  'jp',
  35.725913,
  139.7166365
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_bunkyo',
  'tokyo',
  '文京区',
  'ぶんきょうく',
  '{"en":"Bunkyo"}'::jsonb,
  '区',
  'jp',
  35.7080255,
  139.7523066
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_itabashi',
  'tokyo',
  '板橋区',
  'いたばしく',
  '{"en":"Itabashi"}'::jsonb,
  '区',
  'jp',
  35.7512814,
  139.7087794
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_suginami',
  'tokyo',
  '杉並区',
  'すぎなみく',
  '{"en":"Suginami"}'::jsonb,
  '区',
  'jp',
  35.6994929,
  139.6362876
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_sumida',
  'tokyo',
  '墨田区',
  'すみだく',
  '{"en":"Sumida"}'::jsonb,
  '区',
  'jp',
  35.7104196,
  139.8017421
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_edogawa',
  'tokyo',
  '江戸川区',
  'えどがわく',
  '{"en":"Edogawa"}'::jsonb,
  '区',
  'jp',
  35.7066318,
  139.868677
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_katsushika',
  'tokyo',
  '葛飾区',
  'かつしかく',
  '{"en":"Katsushika"}'::jsonb,
  '区',
  'jp',
  35.7433912,
  139.8473472
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_koto',
  'tokyo',
  '江東区',
  'こうとうく',
  '{"en":"Koto"}'::jsonb,
  '区',
  'jp',
  35.6727747,
  139.8169621
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_kita',
  'tokyo',
  '北区',
  'きたく',
  '{"en":"Kita"}'::jsonb,
  '区',
  'jp',
  35.7528821,
  139.7338331
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_kodaira',
  'tokyo',
  '小平市',
  '小平市',
  '{"en":"Kodaira"}'::jsonb,
  '市',
  'jp',
  35.72522,
  139.476606
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_taito',
  'tokyo',
  '台東区',
  'たいとうく',
  '{"en":"Taito"}'::jsonb,
  '区',
  'jp',
  35.7125805,
  139.7800712
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_chiyoda',
  'tokyo',
  '千代田区',
  'ちよだく',
  '{"en":"Chiyoda"}'::jsonb,
  '区',
  'jp',
  35.6938097,
  139.7532163
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_akishima',
  'tokyo',
  '昭島市',
  '昭島市',
  '{"en":"Akishima"}'::jsonb,
  '市',
  'jp',
  35.7058081,
  139.3536109
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_chuo',
  'tokyo',
  '中央区',
  'ちゅうおうく',
  '{"en":"Chuo"}'::jsonb,
  '区',
  'jp',
  35.6706436,
  139.7719923
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_arakawa',
  'tokyo',
  '荒川区',
  'あらかわく',
  '{"en":"Arakawa"}'::jsonb,
  '区',
  'jp',
  35.737529,
  139.78131
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_ota',
  'tokyo',
  '大田区',
  'おおたく',
  '{"en":"Ota"}'::jsonb,
  '区',
  'jp',
  35.561206,
  139.715843
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_adachi',
  'tokyo',
  '足立区',
  'あだちく',
  '{"en":"Adachi"}'::jsonb,
  '区',
  'jp',
  35.7746029,
  139.8045163
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_minato',
  'tokyo',
  '港区',
  'みなとく',
  '{"en":"Minato"}'::jsonb,
  '区',
  'jp',
  35.6580089,
  139.7515137
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_setagaya',
  'tokyo',
  '世田谷区',
  'せたがやく',
  '{"en":"Setagaya"}'::jsonb,
  '区',
  'jp',
  35.6469025,
  139.652531
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_shinagawa',
  'tokyo',
  '品川区',
  'しながわく',
  '{"en":"Shinagawa"}'::jsonb,
  '区',
  'jp',
  35.6092008,
  139.7301982
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_shibuya',
  'tokyo',
  '渋谷区',
  'しぶやく',
  '{"en":"Shibuya"}'::jsonb,
  '区',
  'jp',
  35.6633709,
  139.6964952
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_tachikawa',
  'tokyo',
  '立川市',
  '立川市',
  '{"en":"Tachikawa"}'::jsonb,
  '市',
  'jp',
  35.7139057,
  139.4077701
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_ome',
  'tokyo',
  '青梅市',
  'おうめし',
  '{"en":"Ome"}'::jsonb,
  '市',
  'jp',
  35.7880531,
  139.2753553
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_musashimurayama',
  'tokyo',
  '武蔵村山市',
  'むさしむらやまし',
  '{"en":"Musashimurayama"}'::jsonb,
  '市',
  'jp',
  35.756509,
  139.385637
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_akiruno',
  'tokyo',
  'あきる野市',
  'あきる野市',
  '{"en":"Akiruno"}'::jsonb,
  '市',
  'jp',
  35.7289031,
  139.2941912
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_fussa',
  'tokyo',
  '福生市',
  '福生市',
  '{"en":"Fussa"}'::jsonb,
  '市',
  'jp',
  35.7386772,
  139.3267856
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_hamura',
  'tokyo',
  '羽村市',
  '羽村市',
  '{"en":"Hamura"}'::jsonb,
  '市',
  'jp',
  35.764833,
  139.307862
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_koganei',
  'tokyo',
  '小金井市',
  '小金井市',
  '{"en":"Koganei"}'::jsonb,
  '市',
  'jp',
  35.7041083,
  139.5106759
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_higashikurume',
  'tokyo',
  '東久留米市',
  '東久留米市',
  '{"en":"Higashikurume"}'::jsonb,
  '市',
  'jp',
  35.752546,
  139.519089
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_higashimurayama',
  'tokyo',
  '東村山市',
  '東村山市',
  '{"en":"Higashimurayama"}'::jsonb,
  '市',
  'jp',
  35.768929,
  139.484539
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_kiyose',
  'tokyo',
  '清瀬市',
  'きよせし',
  '{"en":"Kiyose"}'::jsonb,
  '市',
  'jp',
  35.785483,
  139.531253
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_higashiyamato',
  'tokyo',
  '東大和市',
  '東大和市',
  '{"en":"Higashiyamato"}'::jsonb,
  '市',
  'jp',
  35.740869,
  139.428831
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_akihabara_crossfield',
  'tokyo',
  '秋葉原クロスフィールド',
  '秋葉原クロスフィールド',
  '{"en":"Akihabara Crossfield"}'::jsonb,
  '市',
  'jp',
  35.7004109,
  139.7725311
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_nishitokyo',
  'tokyo',
  '西東京市',
  '西東京市',
  '{"en":"Nishitokyo"}'::jsonb,
  '市',
  'jp',
  35.7261366,
  139.5380347
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_shinjuku',
  'tokyo',
  '新宿区',
  'しんじゅくく',
  '{"en":"Shinjuku"}'::jsonb,
  '区',
  'jp',
  35.6937632,
  139.7036319
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_canal_court',
  'tokyo',
  'キャナルコート',
  'きゃなるこーと',
  '{"en":"Canal court"}'::jsonb,
  '市',
  'jp',
  35.6476905,
  139.8035878
);

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)
VALUES (
  'tokyo_大むさし',
  'tokyo',
  '大むさし',
  '大むさし',
  NULL,
  '市',
  'jp',
  35.7530566,
  139.7156865
);

-- =============================================
-- 3. machiデータの挿入
-- =============================================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_kagurazaka',
  '神楽坂',
  'かぐらざか',
  '{"en":"Kagurazaka"}'::jsonb,
  35.7010851,
  139.7412287,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_ebisu',
  '恵比寿',
  'えびす',
  '{"en":"Ebisu"}'::jsonb,
  35.6462954,
  139.714385,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_hiroo',
  '広尾',
  'ひろお',
  '{"en":"Hiroo"}'::jsonb,
  35.6522569,
  139.7175844,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_shinbashi',
  '新橋',
  'しんばし',
  '{"en":"Shinbashi"}'::jsonb,
  35.6651059,
  139.7561163,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_gotanda',
  '五反田',
  'ごたんだ',
  '{"en":"Gotanda"}'::jsonb,
  35.6283773,
  139.721783,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_uehara',
  '上原',
  'うえはら',
  '{"en":"Uehara"}'::jsonb,
  35.6669782,
  139.6806824,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_higashi_nakano',
  '東中野',
  'ひがしなかの',
  '{"en":"Higashi-Nakano"}'::jsonb,
  35.7044839,
  139.6832333,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_旭',
  '旭町',
  '旭町',
  NULL,
  35.7698455,
  139.6250974,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_shoto',
  '松濤',
  'しょうとう',
  '{"en":"Shoto"}'::jsonb,
  35.6607632,
  139.6920068,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_arai',
  '新井',
  'あらい',
  '{"en":"Arai"}'::jsonb,
  35.7133664,
  139.66418,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_takamatsu',
  '高松',
  '高松',
  '{"en":"Takamatsu"}'::jsonb,
  35.7504853,
  139.6298966,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_kami_ochiai',
  '上落合',
  '上落合',
  '{"en":"Kami-ochiai"}'::jsonb,
  35.7114276,
  139.6836606,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_honcho',
  '本町',
  'ほんちょう',
  '{"en":"Honcho"}'::jsonb,
  35.6959247,
  139.6742379,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_yayoicho',
  '弥生町',
  'やよいちょう',
  '{"en":"Yayoicho"}'::jsonb,
  35.6908488,
  139.6755198,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_wakamiya',
  '若宮',
  'わかみや',
  '{"en":"Wakamiya"}'::jsonb,
  35.7185235,
  139.6456514,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_k_enji_north',
  '高円寺北',
  'こうえんじきた',
  '{"en":"Kōenji-north"}'::jsonb,
  35.7073164,
  139.6548546,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_kamitakada',
  '上高田',
  'かみたかだ',
  '{"en":"Kamitakada"}'::jsonb,
  35.712836,
  139.6747493,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_kami_saginomiya',
  '上鷺宮',
  'かみさぎのみや',
  '{"en":"Kami-Saginomiya"}'::jsonb,
  35.731639,
  139.6317433,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_minamidai',
  '南台',
  'みなみだい',
  '{"en":"Minamidai"}'::jsonb,
  35.683521,
  139.667254,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_honmachi',
  '本町',
  'ほんまち',
  '{"en":"Honmachi"}'::jsonb,
  35.6841449,
  139.6806558,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nakamura_minami',
  '中村南',
  '中村南',
  '{"en":"Nakamura Minami"}'::jsonb,
  35.7280632,
  139.6441963,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_yamato_cho',
  '大和町',
  '大和町',
  '{"en":"Yamato-cho"}'::jsonb,
  35.7125295,
  139.6494199,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_funabashi',
  '船橋',
  '船橋',
  '{"en":"Funabashi"}'::jsonb,
  35.6485548,
  139.6207921,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_izumi',
  '泉町',
  '泉町',
  '{"en":"Izumi"}'::jsonb,
  35.7411935,
  139.55359,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_kitahara',
  '北原町',
  '北原町',
  '{"en":"Kitahara"}'::jsonb,
  35.7333391,
  139.5462707,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_kitamachi',
  '北町',
  '北町',
  '{"en":"Kitamachi"}'::jsonb,
  35.75626,
  139.5599647,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_sakae',
  '栄町',
  '栄町',
  '{"en":"Sakae"}'::jsonb,
  35.7502928,
  139.5542775,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_shibakubo',
  '芝久保町',
  '芝久保町',
  '{"en":"Shibakubo"}'::jsonb,
  35.7291771,
  139.5257955,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_shimohoya',
  '下保谷',
  '下保谷',
  '{"en":"Shimohoya"}'::jsonb,
  35.7510848,
  139.5635879,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_shinmachi',
  '新町',
  '新町',
  '{"en":"Shinmachi"}'::jsonb,
  35.7151418,
  139.5411434,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_sumiyoshi',
  '住吉町',
  '住吉町',
  '{"en":"Sumiyoshi"}'::jsonb,
  35.7464544,
  139.5501347,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_tanashi_cho',
  '田無町',
  'たなしちょう',
  '{"en":"Tanashi-cho"}'::jsonb,
  35.7287951,
  139.5400411,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_nakamachi',
  '中町',
  '中町',
  '{"en":"Nakamachi"}'::jsonb,
  35.7390056,
  139.559644,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_nishihara',
  '西原町',
  '西原町',
  '{"en":"Nishihara"}'::jsonb,
  35.7387192,
  139.5312468,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_higashicho',
  '東町',
  '東町',
  '{"en":"Higashicho"}'::jsonb,
  35.7431347,
  139.5651766,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_higashifushimi',
  '東伏見',
  '東伏見',
  '{"en":"Higashifushimi"}'::jsonb,
  35.7243928,
  139.5625199,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_hibarigaokakita',
  'ひばりが丘北',
  'ひばりが丘北',
  '{"en":"Hibarigaokakita"}'::jsonb,
  35.7527695,
  139.5483811,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_fujimachi',
  '富士町',
  '富士町',
  '{"en":"Fujimachi"}'::jsonb,
  35.7308267,
  139.5638206,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_hoya',
  '保谷町',
  '保谷町',
  '{"en":"Hoya"}'::jsonb,
  35.7322182,
  139.5532586,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_midoricho',
  '緑町',
  '緑町',
  '{"en":"Midoricho"}'::jsonb,
  35.7409491,
  139.5357447,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_minamicho',
  '南町',
  '南町',
  '{"en":"Minamicho"}'::jsonb,
  35.7260261,
  139.5434353,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_mukodaicho',
  '向台町',
  '向台町',
  '{"en":"Mukodaicho"}'::jsonb,
  35.7210462,
  139.5358856,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_yagisawa',
  '柳沢',
  '柳沢',
  '{"en":"Yagisawa"}'::jsonb,
  35.7229618,
  139.5529357,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_yatocho',
  '谷戸町',
  '谷戸町',
  '{"en":"Yatocho"}'::jsonb,
  35.7399323,
  139.545304,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_kichijoji_kitamachi',
  '吉祥寺北町',
  '吉祥寺北町',
  '{"en":"Kichijoji Kitamachi"}'::jsonb,
  35.712295,
  139.5757678,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_kichijoji_higashicho',
  '吉祥寺東町',
  '吉祥寺東町',
  '{"en":"Kichijoji Higashicho"}'::jsonb,
  35.7088234,
  139.586782,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_kichijoji_honcho',
  '吉祥寺本町',
  '吉祥寺本町',
  '{"en":"Kichijoji Honcho"}'::jsonb,
  35.7043267,
  139.5775409,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_kichijoji_minamicho',
  '吉祥寺南町',
  '吉祥寺南町',
  '{"en":"Kichijoji Minamicho"}'::jsonb,
  35.6996526,
  139.5852469,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_kyonancho',
  '境南町',
  '境南町',
  '{"en":"Kyonancho"}'::jsonb,
  35.6989464,
  139.5411554,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_gotenyama',
  '御殿山',
  '御殿山',
  '{"en":"Gotenyama"}'::jsonb,
  35.7023931,
  139.575435,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_sakai',
  '境',
  '境',
  '{"en":"Sakai"}'::jsonb,
  35.7066696,
  139.543343,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nishitokyo_sakurazutsumi',
  '桜堤',
  '桜堤',
  '{"en":"Sakurazutsumi"}'::jsonb,
  35.711329,
  139.5319693,
  NULL,
  'tokyo',
  'tokyo_nishitokyo',
  'jp',
  '東京都',
  NULL,
  '西東京市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_sekimae',
  '関前',
  '関前',
  '{"en":"Sekimae"}'::jsonb,
  35.7122046,
  139.5518286,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_nakacho',
  '中町',
  '中町',
  '{"en":"Nakacho"}'::jsonb,
  35.7037986,
  139.5662633,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_nishikubo',
  '西久保',
  '西久保',
  '{"en":"Nishikubo"}'::jsonb,
  35.710347,
  139.5579926,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_midoricho',
  '緑町',
  '緑町',
  '{"en":"Midoricho"}'::jsonb,
  35.7175922,
  139.562909,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_yahatacho',
  '八幡町',
  '八幡町',
  '{"en":"Yahatacho"}'::jsonb,
  35.7170546,
  139.5555091,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_kajinocho',
  '梶野町',
  '梶野町',
  '{"en":"Kajinocho"}'::jsonb,
  35.7084743,
  139.5294849,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_sakuracho',
  '桜町',
  '桜町',
  '{"en":"Sakuracho"}'::jsonb,
  35.71189,
  139.5090665,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_sekinocho',
  '関野町',
  '関野町',
  '{"en":"Sekinocho"}'::jsonb,
  35.7132624,
  139.5225557,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_nakacho',
  '中町',
  '中町',
  '{"en":"Nakacho"}'::jsonb,
  35.6962208,
  139.5163007,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_nukuikitamachi',
  '貫井北町',
  '貫井北町',
  '{"en":"Nukuikitamachi"}'::jsonb,
  35.7070284,
  139.4963703,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_nukuiminamicho',
  '貫井南町',
  '貫井南町',
  '{"en":"Nukuiminamicho"}'::jsonb,
  35.6918669,
  139.4945842,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_higashicho',
  '東町',
  '東町',
  '{"en":"Higashicho"}'::jsonb,
  35.6957178,
  139.5292798,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_honcho',
  '本町',
  '本町',
  '{"en":"Honcho"}'::jsonb,
  35.7002737,
  139.5064494,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_maeharacho',
  '前原町',
  '前原町',
  '{"en":"Maeharacho"}'::jsonb,
  35.6919631,
  139.5075641,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_midoricho',
  '緑町',
  '緑町',
  '{"en":"Midoricho"}'::jsonb,
  35.7072249,
  139.5171598,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koganei_iguchi',
  '井口',
  '井口',
  '{"en":"Iguchi"}'::jsonb,
  35.6953563,
  139.5350195,
  NULL,
  'tokyo',
  'tokyo_koganei',
  'jp',
  '東京都',
  NULL,
  '小金井市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_inokashira',
  '井の頭',
  '井の頭',
  '{"en":"Inokashira"}'::jsonb,
  35.6936527,
  139.583691,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chofu_osawa',
  '大沢',
  '大沢',
  '{"en":"Osawa"}'::jsonb,
  35.6731969,
  139.5387495,
  NULL,
  'tokyo',
  'tokyo_chofu',
  'jp',
  '東京都',
  NULL,
  '調布市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_kamirenjaku',
  '上連雀',
  '上連雀',
  '{"en":"Kamirenjaku"}'::jsonb,
  35.6987444,
  139.5548857,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_kitano',
  '北野',
  'きたの',
  '{"en":"Kitano"}'::jsonb,
  35.6791407,
  139.5850745,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_shimorenjaku',
  '下連雀',
  '下連雀',
  '{"en":"Shimorenjaku"}'::jsonb,
  35.6964799,
  139.565496,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_shinkawa',
  '新川',
  '新川',
  '{"en":"Shinkawa"}'::jsonb,
  35.681551,
  139.5686095,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_jindaiji',
  '深大寺',
  '深大寺',
  '{"en":"Jindaiji"}'::jsonb,
  35.6884547,
  139.5442341,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_nakahara',
  '中原',
  '中原',
  '{"en":"Nakahara"}'::jsonb,
  35.6648817,
  139.5746696,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_nozaki',
  '野崎',
  '野崎',
  '{"en":"Nozaki"}'::jsonb,
  35.6822597,
  139.5441568,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_mure',
  '牟礼',
  '牟礼',
  '{"en":"Mure"}'::jsonb,
  35.6871232,
  139.5800341,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_asagayakita',
  '阿佐谷北',
  'あさがやきた',
  '{"en":"Asagayakita"}'::jsonb,
  35.7105571,
  139.636261,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_asagaya_minami',
  '阿佐谷南',
  'あさがやみなみ',
  '{"en":"Asagaya-minami"}'::jsonb,
  35.7020498,
  139.6373057,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_amanuma',
  '天沼',
  'あまぬま',
  '{"en":"Amanuma"}'::jsonb,
  35.7081696,
  139.624042,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_igusa',
  '井草',
  'いぐさ',
  '{"en":"Igusa"}'::jsonb,
  35.7268135,
  139.6140079,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_imagawa',
  '今川',
  'いまがわ',
  '{"en":"Imagawa"}'::jsonb,
  35.7167433,
  139.6078269,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_umezato',
  '梅里',
  '梅里',
  '{"en":"Umezato"}'::jsonb,
  35.6969116,
  139.6457468,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_eifuku',
  '永福',
  'えいふく',
  '{"en":"Eifuku"}'::jsonb,
  35.6769648,
  139.641321,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_omiya',
  '大宮',
  '大宮',
  '{"en":"Omiya"}'::jsonb,
  35.6836579,
  139.6460631,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_ogikubo',
  '荻窪',
  'おぎくぼ',
  '{"en":"Ogikubo"}'::jsonb,
  35.6996931,
  139.6227802,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_shimizu',
  '清水',
  'しみず',
  '{"en":"Shimizu"}'::jsonb,
  35.7126525,
  139.6169502,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_shimoigusa',
  '下井草',
  '下井草',
  '{"en":"Shimoigusa"}'::jsonb,
  35.7205501,
  139.6260159,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_shoan',
  '松庵',
  'しょうあん',
  '{"en":"Shoan"}'::jsonb,
  35.6977161,
  139.5947802,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_zenbukuji',
  '善福寺',
  'ぜんぶくじ',
  '{"en":"Zenbukuji"}'::jsonb,
  35.7143948,
  139.590818,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_wada',
  '和田',
  'わだ',
  '{"en":"Wada"}'::jsonb,
  35.6935241,
  139.6576038,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_okata',
  '岡田',
  'おかた',
  '{"en":"Okata"}'::jsonb,
  34.7890866,
  139.3762361,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_sashikiji',
  '差木地',
  'さしきじ',
  '{"en":"Sashikiji"}'::jsonb,
  34.6880017,
  139.4241934,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_senzu',
  '泉津',
  'せんづ',
  '{"en":"Senzu"}'::jsonb,
  34.7769563,
  139.4099946,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_nomashi',
  '野増',
  'のまし',
  '{"en":"Nomashi"}'::jsonb,
  34.7150808,
  139.3753014,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_habuminato',
  '波浮港',
  'はぶみなと',
  '{"en":"Habuminato"}'::jsonb,
  34.6935748,
  139.439821,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_motomachi',
  '元町',
  'もとまち',
  '{"en":"Motomachi"}'::jsonb,
  34.7516178,
  139.3570205,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_egota',
  '江古田',
  'えごた',
  '{"en":"Egota"}'::jsonb,
  35.7256208,
  139.6679693,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fuchu_hachimancho',
  '八幡町',
  '八幡町',
  '{"en":"Hachimancho"}'::jsonb,
  35.6678257,
  139.4896683,
  NULL,
  'tokyo',
  'tokyo_fuchu',
  'jp',
  '東京都',
  NULL,
  '府中市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kodaira_higashi_koigakubo',
  '東恋ケ窪',
  '東恋ケ窪',
  '{"en":"Higashi Koigakubo"}'::jsonb,
  35.7093966,
  139.4747003,
  NULL,
  'tokyo',
  'tokyo_kodaira',
  'jp',
  '東京都',
  NULL,
  '小平市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kodaira_honda',
  '本多',
  '本多',
  '{"en":"Honda"}'::jsonb,
  35.7071175,
  139.4815393,
  NULL,
  'tokyo',
  'tokyo_kodaira',
  'jp',
  '東京都',
  NULL,
  '小平市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_hanakoganei',
  '花小金井',
  '花小金井',
  '{"en":"Hanakoganei"}'::jsonb,
  35.7334962,
  139.5134338,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_sangenjaya',
  '三軒茶屋',
  'さんげんじゃや',
  '{"en":"Sangenjaya"}'::jsonb,
  35.6420125,
  139.6692341,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_kitazawa',
  '北沢',
  'きたざわ',
  '{"en":"Kitazawa"}'::jsonb,
  35.6634677,
  139.668154,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_daizawa',
  '代沢',
  'だいざわ',
  '{"en":"Daizawa"}'::jsonb,
  35.6566718,
  139.6705979,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_taishido',
  '太子堂',
  'たいしどう',
  '{"en":"Taishido"}'::jsonb,
  35.6475328,
  139.671095,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_kabukicho',
  '歌舞伎町',
  'かぶきちょう',
  '{"en":"Kabukicho"}'::jsonb,
  35.6945429,
  139.7027105,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_musashinodai',
  '武蔵野台',
  '武蔵野台',
  '{"en":"Musashinodai"}'::jsonb,
  35.7483148,
  139.3313869,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_kita_denen',
  '北田園',
  '北田園',
  '{"en":"Kita denen"}'::jsonb,
  35.7339041,
  139.3225092,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_minami_denen',
  '南田園',
  '南田園',
  '{"en":"Minami Denen"}'::jsonb,
  35.724761,
  139.3317819,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_kamidaira',
  '加美平',
  '加美平',
  '{"en":"Kamidaira"}'::jsonb,
  35.7497024,
  139.3225223,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_haijimacho',
  '拝島町',
  '拝島町',
  '{"en":"Haijimacho"}'::jsonb,
  35.7078587,
  139.3396641,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_showacho',
  '昭和町',
  '昭和町',
  '{"en":"Showacho"}'::jsonb,
  35.7113405,
  139.36326,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_nakagamicho',
  '中神町',
  '中神町',
  '{"en":"Nakagamicho"}'::jsonb,
  35.7001891,
  139.3720683,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_田中',
  '田中町',
  '田中町',
  NULL,
  35.7010211,
  139.3519249,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_matsubaracho',
  '松原町',
  '松原町',
  '{"en":"Matsubaracho"}'::jsonb,
  35.7176691,
  139.3434057,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_midoricho',
  '緑町',
  '緑町',
  '{"en":"Midoricho"}'::jsonb,
  35.7114542,
  139.3452109,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_大神',
  '大神町',
  '大神町',
  NULL,
  35.702805,
  139.3586755,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_miyazawacho',
  '宮沢町',
  '宮沢町',
  '{"en":"Miyazawacho"}'::jsonb,
  35.7000519,
  139.3647606,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_gochicho',
  '郷地町',
  '郷地町',
  '{"en":"Gochicho"}'::jsonb,
  35.6955058,
  139.3872711,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_fukujimacho',
  '福島町',
  '福島町',
  '{"en":"Fukujimacho"}'::jsonb,
  35.6976057,
  139.3802061,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_musashino',
  '武蔵野',
  '武蔵野',
  '{"en":"Musashino"}'::jsonb,
  35.7202101,
  139.3767428,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_fukujimacho',
  'もくせいの杜',
  'もくせいの杜',
  '{"en":"Fukujimacho"}'::jsonb,
  35.7122778,
  139.3886551,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_asahicho',
  '朝日町',
  '朝日町',
  '{"en":"Asahicho"}'::jsonb,
  35.7055088,
  139.3711735,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_tamagawacho',
  '玉川町',
  '玉川町',
  '{"en":"Tamagawacho"}'::jsonb,
  35.705264,
  139.3771388,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_mihoricho',
  '美堀町',
  '美堀町',
  '{"en":"Mihoricho"}'::jsonb,
  35.7209095,
  139.3540492,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_tsutsujigaoka',
  'つつじが丘',
  'つつじが丘',
  '{"en":"Tsutsujigaoka"}'::jsonb,
  35.7173294,
  139.3694666,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_azumacho',
  '東町',
  '東町',
  '{"en":"Azumacho"}'::jsonb,
  35.7019708,
  139.3882538,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_haneda',
  '羽田',
  'はねだ',
  '{"en":"Haneda"}'::jsonb,
  35.5479444,
  139.7466458,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_south_ikebukuro',
  '南池袋',
  '南池袋',
  '{"en":"South Ikebukuro"}'::jsonb,
  35.7247203,
  139.7147332,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_haginaka',
  '萩中',
  'はぎなか',
  '{"en":"Haginaka"}'::jsonb,
  35.5511001,
  139.7317797,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_honhaneda',
  '本羽田',
  'ほんはねだ',
  '{"en":"Honhaneda"}'::jsonb,
  35.5457031,
  139.7316232,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hikawa',
  '氷川',
  'ひかわ',
  '{"en":"Hikawa"}'::jsonb,
  35.8095934,
  139.0928219,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_shiromaru',
  '白丸',
  'しろまる',
  '{"en":"Shiromaru"}'::jsonb,
  35.8131714,
  139.1127004,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_unazawa',
  '海澤',
  'うなざわ',
  '{"en":"Unazawa"}'::jsonb,
  35.8036302,
  139.1137461,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_sakai',
  '境',
  'さかい',
  '{"en":"Sakai"}'::jsonb,
  35.7987724,
  139.0674955,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kotaba',
  '小丹波',
  'こたば',
  '{"en":"Kotaba"}'::jsonb,
  35.8182815,
  139.1516798,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_hibarigaoka',
  'ひばりヶ丘',
  'ひばりヶ丘',
  '{"en":"Hibarigaoka"}'::jsonb,
  35.7462782,
  139.5378682,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_asahigaoka',
  '旭丘',
  '旭丘',
  '{"en":"Asahigaoka"}'::jsonb,
  35.7350726,
  139.6765561,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_azabudai',
  '麻布台',
  'あざぶだい',
  '{"en":"Azabudai"}'::jsonb,
  35.6596917,
  139.7412077,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_azabu_juban',
  '麻布十番',
  'あざぶじゅうばん',
  '{"en":"Azabu-Juban"}'::jsonb,
  35.6542621,
  139.7366855,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_oguno',
  '大久野',
  'おおぐの',
  '{"en":"Oguno"}'::jsonb,
  35.7536986,
  139.2326459,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_hirai',
  '平井',
  'ひらい',
  '{"en":"Hirai"}'::jsonb,
  35.738788,
  139.266575,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_mitsugo',
  '三都郷',
  'みつご',
  '{"en":"Mitsugo"}'::jsonb,
  35.7433702,
  139.13741,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kamimotogo',
  '上元郷',
  'かみもとごう',
  '{"en":"Kamimotogo"}'::jsonb,
  35.7275295,
  139.151921,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_shimomotogo',
  '下元郷',
  'しももとごう',
  '{"en":"Shimomotogo"}'::jsonb,
  35.7234023,
  139.1599514,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_henbori',
  '人里',
  'へんぼり',
  '{"en":"Henbori"}'::jsonb,
  35.7105633,
  139.0846352,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kurakake',
  '倉掛',
  'くらかけ',
  '{"en":"Kurakake"}'::jsonb,
  35.742229,
  139.0659498,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_nango',
  '南郷',
  'なんごう',
  '{"en":"Nango"}'::jsonb,
  35.7055571,
  139.1218856,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_大嶽',
  '大嶽',
  '大嶽',
  NULL,
  35.762803,
  139.137024,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_ozawa',
  '小沢',
  'おざわ',
  '{"en":"Ozawa"}'::jsonb,
  35.7399136,
  139.1229436,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kazuma',
  '数馬',
  'かずま',
  '{"en":"Kazuma"}'::jsonb,
  35.7269678,
  139.0571236,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_motoshuku',
  '本宿',
  'もとしゅく',
  '{"en":"Motoshuku"}'::jsonb,
  35.7194915,
  139.146758,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hizato',
  '樋里',
  'ひざと',
  '{"en":"Hizato"}'::jsonb,
  35.7341872,
  139.1071941,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kanoto',
  '神戸',
  'かのと',
  '{"en":"Kanoto"}'::jsonb,
  35.7478365,
  139.1214116,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_fujiwara',
  '藤原',
  'ふじわら',
  '{"en":"Fujiwara"}'::jsonb,
  35.7435089,
  139.0790389,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_misono',
  '三園',
  '三園',
  '{"en":"Misono"}'::jsonb,
  35.7918914,
  139.6407924,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_tokumaru',
  '徳丸',
  '徳丸',
  '{"en":"Tokumaru"}'::jsonb,
  35.775789,
  139.6598681,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_narimasu',
  '成増',
  '成増',
  '{"en":"Narimasu"}'::jsonb,
  35.7817326,
  139.6324824,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_hasune',
  '蓮根',
  '蓮根',
  '{"en":"Hasune"}'::jsonb,
  35.7845059,
  139.676781,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nishidai',
  '西台',
  '西台',
  '{"en":"Nishidai"}'::jsonb,
  35.77443,
  139.6702602,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_akatsuka',
  '赤塚',
  '赤塚',
  '{"en":"Akatsuka"}'::jsonb,
  35.7788033,
  139.6434642,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_takashimadaira',
  '高島平',
  '高島平',
  '{"en":"Takashimadaira"}'::jsonb,
  35.7883692,
  139.6589375,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_hikarigaoka',
  '光が丘',
  '光が丘',
  '{"en":"Hikarigaoka"}'::jsonb,
  35.758805,
  139.6277446,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_yotsuba',
  '四葉',
  '四葉',
  '{"en":"Yotsuba"}'::jsonb,
  35.7799122,
  139.6520556,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_shingashi',
  '新河岸',
  '新河岸',
  '{"en":"Shingashi"}'::jsonb,
  35.7946237,
  139.6581151,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_ukima',
  '浮間',
  'うきま',
  '{"en":"Ukima"}'::jsonb,
  35.7905901,
  139.7004698,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_funado',
  '舟渡',
  '舟渡',
  '{"en":"Funado"}'::jsonb,
  35.7941546,
  139.6837601,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_akikawa',
  '秋川',
  '秋川',
  '{"en":"Akikawa"}'::jsonb,
  35.731457,
  139.2884047,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_akiru',
  '秋留',
  '秋留',
  '{"en":"Akiru"}'::jsonb,
  35.7246294,
  139.2990851,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_ogawahigashi',
  '小川東',
  '小川東',
  '{"en":"Ogawahigashi"}'::jsonb,
  35.7187369,
  139.3241402,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_ninomiyahigashi',
  '二宮東',
  '二宮東',
  '{"en":"Ninomiyahigashi"}'::jsonb,
  35.7245255,
  139.3219016,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_kami_itabashi',
  '上板橋',
  '上板橋',
  '{"en":"Kami-itabashi"}'::jsonb,
  35.7634804,
  139.6743427,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_nakadai',
  '中台',
  '中台',
  '{"en":"Nakadai"}'::jsonb,
  35.7703802,
  139.6799156,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_maenocho',
  '前野町',
  '前野町',
  '{"en":"Maenocho"}'::jsonb,
  35.7687915,
  139.6902076,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_sakashita',
  '坂下',
  '坂下',
  '{"en":"Sakashita"}'::jsonb,
  35.7852052,
  139.6821549,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_azusawa',
  '小豆沢',
  '小豆沢',
  '{"en":"Azusawa"}'::jsonb,
  35.7779319,
  139.697781,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_tokiwadai',
  '常盤台',
  '常盤台',
  '{"en":"Tokiwadai"}'::jsonb,
  35.761537,
  139.6855991,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_shimura',
  '志村',
  '志村',
  '{"en":"Shimura"}'::jsonb,
  35.7752578,
  139.6908861,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_higashi_sakashita',
  '東坂下',
  '東坂下',
  '{"en":"Higashi-sakashita"}'::jsonb,
  35.7843119,
  139.6891321,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_wakagi',
  '若木',
  '若木',
  '{"en":"Wakagi"}'::jsonb,
  35.7696134,
  139.6730933,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_akatsuka_shimmachi',
  '赤塚新町',
  '赤塚新町',
  '{"en":"Akatsuka-shimmachi"}'::jsonb,
  35.7712588,
  139.6398705,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_ikebukuro',
  '池袋',
  'いけぶくろ',
  '{"en":"Ikebukuro"}'::jsonb,
  35.7358426,
  139.7084043,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_南郷',
  '南郷',
  '南郷',
  NULL,
  33.8663561,
  139.6261816,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_wakago',
  '若郷',
  'わかごう',
  '{"en":"Wakago"}'::jsonb,
  34.4218683,
  139.2842778,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_igaya',
  '伊ヶ谷',
  'いがや',
  '{"en":"Igaya"}'::jsonb,
  34.0973267,
  139.4937975,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_izu',
  '伊豆',
  'いず',
  '{"en":"Izu"}'::jsonb,
  34.1173454,
  139.5064361,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_mitsune_sho_mae',
  '三根',
  'みつね',
  '{"en":"Mitsune Sho Mae"}'::jsonb,
  33.1245017,
  139.798257,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_okago',
  '大賀郷',
  'おおかごう',
  '{"en":"Okago"}'::jsonb,
  33.1082852,
  139.7727795,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_nakanogo',
  '中ノ郷',
  'なかのごう',
  '{"en":"Nakanogo"}'::jsonb,
  33.0705225,
  139.8101026,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kashitate',
  '樫立',
  'かしたて',
  '{"en":"Kashitate"}'::jsonb,
  33.0718487,
  139.79354,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_sueyoshi',
  '末吉',
  'すえよし',
  '{"en":"Sueyoshi"}'::jsonb,
  33.0842301,
  139.8475618,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_tomodamachi',
  '友田町',
  '友田町',
  '{"en":"Tomodamachi"}'::jsonb,
  35.7686496,
  139.2868567,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kabemachi',
  '河辺町',
  '河辺町',
  '{"en":"Kabemachi"}'::jsonb,
  35.7810198,
  139.2880925,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_morookacho',
  '師岡町',
  '師岡町',
  '{"en":"Morookacho"}'::jsonb,
  35.7914942,
  139.2840772,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nogamicho',
  '野上町',
  '野上町',
  '{"en":"Nogamicho"}'::jsonb,
  35.7920381,
  139.2904609,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_daimon',
  '大門',
  '大門',
  '{"en":"Daimon"}'::jsonb,
  35.7961761,
  139.2940899,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_suehirocho',
  '末広町',
  '末広町',
  '{"en":"Suehirocho"}'::jsonb,
  35.7796033,
  139.3134072,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_shinmachi',
  '新町',
  '新町',
  '{"en":"Shinmachi"}'::jsonb,
  35.7871101,
  139.3078161,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_imai',
  '今井',
  '今井',
  '{"en":"Imai"}'::jsonb,
  35.8015409,
  139.3134528,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_imadera',
  '今寺',
  '今寺',
  '{"en":"Imadera"}'::jsonb,
  35.7976859,
  139.2993283,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_fujihashi',
  '藤橋',
  '藤橋',
  '{"en":"Fujihashi"}'::jsonb,
  35.801828,
  139.3035661,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kinoshita',
  '木野下',
  '木野下',
  '{"en":"Kinoshita"}'::jsonb,
  35.8072957,
  139.2958903,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_osogi',
  '小曾木',
  '小曾木',
  '{"en":"Osogi"}'::jsonb,
  35.8196631,
  139.2871356,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_tomioka',
  '富岡',
  '富岡',
  '{"en":"Tomioka"}'::jsonb,
  35.8305652,
  139.2930626,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nagabuchi',
  '長淵',
  '長淵',
  '{"en":"Nagabuchi"}'::jsonb,
  35.7756017,
  139.2695076,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hatanaka',
  '畑中',
  '畑中',
  '{"en":"Hatanaka"}'::jsonb,
  35.7780912,
  139.240951,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_komakicho',
  '駒木町',
  '駒木町',
  '{"en":"Komakicho"}'::jsonb,
  35.780092,
  139.2528824,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hinatawada',
  '日向和田',
  '日向和田',
  '{"en":"Hinatawada"}'::jsonb,
  35.7882863,
  139.2331467,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nariki',
  '成木',
  '成木',
  '{"en":"Nariki"}'::jsonb,
  35.8268837,
  139.2400131,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kurosawa',
  '黒沢',
  '黒沢',
  '{"en":"Kurosawa"}'::jsonb,
  35.810389,
  139.2546044,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_higashiome',
  '東青梅',
  '東青梅',
  '{"en":"Higashiome"}'::jsonb,
  35.790771,
  139.2755524,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_chigasemachi',
  '千ヶ瀬町',
  '千ヶ瀬町',
  '{"en":"Chigasemachi"}'::jsonb,
  35.7859476,
  139.270187,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_wadamachi',
  '和田町',
  '和田町',
  '{"en":"Wadamachi"}'::jsonb,
  35.7753358,
  139.2273679,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_baigo',
  '梅郷',
  '梅郷',
  '{"en":"Baigo"}'::jsonb,
  35.7841965,
  139.2148581,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_mitake',
  '御岳',
  '御岳',
  '{"en":"Mitake"}'::jsonb,
  35.7914549,
  139.1739383,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_sawai',
  '沢井',
  '沢井',
  '{"en":"Sawai"}'::jsonb,
  35.8103549,
  139.1924563,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_yugimachi',
  '柚木町',
  '柚木町',
  '{"en":"Yugimachi"}'::jsonb,
  35.7980077,
  139.2068436,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_futamatao',
  '二俣尾',
  '二俣尾',
  '{"en":"Futamatao"}'::jsonb,
  35.805378,
  139.2219176,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nekabu',
  '根ヶ布',
  '根ヶ布',
  '{"en":"Nekabu"}'::jsonb,
  35.8013079,
  139.2639184,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_桜丘',
  '桜丘',
  '桜丘',
  NULL,
  35.6430072,
  139.6247828,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_shibuya',
  '渋谷',
  'しぶや',
  '{"en":"Shibuya"}'::jsonb,
  35.6610748,
  139.7037525,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_roppongi',
  '六本木',
  'ろっぽんぎ',
  '{"en":"Roppongi"}'::jsonb,
  35.6624568,
  139.7334981,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_akasaka',
  '赤坂',
  'あかさか',
  '{"en":"Akasaka"}'::jsonb,
  35.6716786,
  139.7356224,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_shimomeguro',
  '下目黒',
  'しもめぐろ',
  '{"en":"Shimomeguro"}'::jsonb,
  35.6300236,
  139.7058982,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_okinotori_island',
  '沖ノ鳥島',
  'おきのとりしま',
  '{"en":"Okinotori island"}'::jsonb,
  20.424931,
  136.0756861,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_成瀬',
  '成瀬',
  '成瀬',
  NULL,
  35.5473119,
  139.4753765,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_成瀬台',
  '成瀬台',
  '成瀬台',
  NULL,
  35.5555716,
  139.4773051,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_higashi_tamagawagakuen',
  '東玉川学園',
  'ひがしたまがわがくえん',
  '{"en":"Higashi-Tamagawagakuen"}'::jsonb,
  35.5563303,
  139.4690689,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_asakusa',
  '浅草',
  'あさくさ',
  '{"en":"Asakusa"}'::jsonb,
  35.7175966,
  139.7975626,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_南成瀬',
  '南成瀬',
  '南成瀬',
  NULL,
  35.5389362,
  139.4724842,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_西成瀬',
  '西成瀬',
  '西成瀬',
  NULL,
  35.5454946,
  139.4695784,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_つくし野',
  'つくし野',
  'つくし野',
  NULL,
  35.5264256,
  139.4821904,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_tanazawa',
  '棚澤',
  'たなざわ',
  '{"en":"Tanazawa"}'::jsonb,
  35.8184049,
  139.1288885,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kawano',
  '川野',
  'かわの',
  '{"en":"Kawano"}'::jsonb,
  35.7793383,
  139.0041171,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_yanaka',
  '谷中',
  'やなか',
  '{"en":"Yanaka"}'::jsonb,
  35.7247892,
  139.7685576,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_asahimachi',
  '旭町',
  'あさひまち',
  '{"en":"Asahimachi"}'::jsonb,
  35.555695,
  139.4396548,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_morino',
  '森野',
  'もりの',
  '{"en":"Morino"}'::jsonb,
  35.5506935,
  139.4376577,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_nakamachi',
  '中町',
  'なかまち',
  '{"en":"Nakamachi"}'::jsonb,
  35.5515141,
  139.4472453,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_adachi_nishi_ayase',
  '西綾瀬',
  '西綾瀬',
  '{"en":"Nishi-Ayase"}'::jsonb,
  35.7624847,
  139.8165787,
  NULL,
  'tokyo',
  'tokyo_adachi',
  'jp',
  '東京都',
  NULL,
  '足立区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_minamioya',
  '南大谷',
  'みなみおおや',
  '{"en":"Minamioya"}'::jsonb,
  35.5529566,
  139.4593666,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kanaigaoka',
  '金井ヶ丘',
  'かないがおか',
  '{"en":"Kanaigaoka"}'::jsonb,
  35.5714305,
  139.4651543,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_fujinodai',
  '藤の台',
  'ふじのだい',
  '{"en":"Fujinodai"}'::jsonb,
  35.5708546,
  139.4498818,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_氷川台',
  '氷川台',
  '氷川台',
  NULL,
  35.7547144,
  139.6687978,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kiso_higashi',
  '木曽東',
  'きそひがし',
  '{"en":"Kiso-Higashi"}'::jsonb,
  35.560866,
  139.4275643,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_tamagawagakuen',
  '玉川学園',
  'たまがわがくえん',
  '{"en":"Tamagawagakuen"}'::jsonb,
  35.564671,
  139.4628312,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kanai',
  '金井',
  'かない',
  '{"en":"Kanai"}'::jsonb,
  35.5766543,
  139.4606403,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_yakushidai',
  '薬師台',
  'やくしだい',
  '{"en":"Yakushidai"}'::jsonb,
  35.5804025,
  139.4542569,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_negishi',
  '根岸',
  'ねぎし',
  '{"en":"Negishi"}'::jsonb,
  35.5752717,
  139.4116855,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_yamazaki',
  '山崎',
  'やまざき',
  '{"en":"Yamazaki"}'::jsonb,
  35.5687718,
  139.4288388,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kogasaka',
  '高ヶ坂',
  'こがさか',
  '{"en":"Kogasaka"}'::jsonb,
  35.544692,
  139.460359,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_minami_karasuyama',
  '南烏山',
  'みなみからすやま',
  '{"en":"Minami-Karasuyama"}'::jsonb,
  35.6689793,
  139.6007466,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_hama_rikyu_gardens',
  '浜離宮庭園',
  'はまりきゅうていえん',
  '{"en":"Hama-rikyu Gardens"}'::jsonb,
  35.6595485,
  139.7636247,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_tsubota',
  '坪田',
  'つぼた',
  '{"en":"Tsubota"}'::jsonb,
  34.0694848,
  139.5538223,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kamitsuki',
  '神着',
  'かみつき',
  '{"en":"Kamitsuki"}'::jsonb,
  34.1179691,
  139.5388448,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_oyama',
  '雄山',
  'おやま',
  '{"en":"Oyama"}'::jsonb,
  34.0857781,
  139.5270538,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ako',
  '阿古',
  'あこ',
  '{"en":"Ako"}'::jsonb,
  34.0660987,
  139.484868,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_honson',
  '本村',
  'ほんそん',
  '{"en":"Honson"}'::jsonb,
  34.3755464,
  139.2556894,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_式根島',
  '式根島',
  'しきねじま',
  NULL,
  34.3273209,
  139.2189324,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_shinsencho',
  '神泉町',
  'しんせんちょう',
  '{"en":"Shinsencho"}'::jsonb,
  35.6563738,
  139.6925133,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nippara',
  '日原',
  'にっぱら',
  '{"en":"Nippara"}'::jsonb,
  35.8260689,
  139.0721619,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_otaba',
  '大丹波',
  'おおたば',
  '{"en":"Otaba"}'::jsonb,
  35.8305487,
  139.1621017,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_tanzaburo',
  '丹三郎',
  'たんざぶろう',
  '{"en":"Tanzaburo"}'::jsonb,
  35.8104963,
  139.1538298,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kawai',
  '川井',
  'かわい',
  '{"en":"Kawai"}'::jsonb,
  35.8143158,
  139.1622412,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_umezawa',
  '梅澤',
  'うめざわ',
  '{"en":"Umezawa"}'::jsonb,
  35.8074858,
  139.1665971,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_tozura',
  '留浦',
  'とずら',
  '{"en":"Tozura"}'::jsonb,
  35.7896817,
  138.9997959,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_chichijima',
  '父島',
  'ちちじま',
  '{"en":"Chichijima"}'::jsonb,
  27.0712034,
  142.209608,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_hahajima',
  '母島',
  'ははじま',
  '{"en":"Hahajima"}'::jsonb,
  26.6600873,
  142.155764,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_ioto',
  '硫黄島',
  'いおうとう',
  '{"en":"Ioto"}'::jsonb,
  24.7849423,
  141.3167953,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_minamitorishima',
  '南鳥島',
  'みなみとりしま',
  '{"en":"Minamitorishima"}'::jsonb,
  24.2892394,
  153.9805716,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chofu_tobitakyu',
  '飛田給',
  'とびたきゅう',
  '{"en":"Tobitakyu"}'::jsonb,
  35.6600603,
  139.5226789,
  NULL,
  'tokyo',
  'tokyo_chofu',
  'jp',
  '東京都',
  NULL,
  '調布市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_高根',
  '高根',
  '高根',
  NULL,
  35.7835969,
  139.3648395,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_駒形富士山',
  '駒形富士山',
  '駒形富士山',
  NULL,
  35.790402,
  139.3654675,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_入かねが沢',
  '入かねが沢',
  '入かねが沢',
  NULL,
  33.897291,
  139.595894,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_mukojima',
  '聟島',
  'むこじま',
  '{"en":"Mukojima"}'::jsonb,
  27.680008,
  142.142874,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_toriuchi',
  '鳥打',
  'とりうち',
  '{"en":"Toriuchi"}'::jsonb,
  33.128788,
  139.685299,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_utsuki',
  '宇津木',
  'うつき',
  '{"en":"Utsuki"}'::jsonb,
  33.122039,
  139.692944,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_kochi',
  '河内',
  'こうち',
  '{"en":"Kochi"}'::jsonb,
  35.749685,
  139.022509,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hara',
  '原',
  'はら',
  '{"en":"Hara"}'::jsonb,
  35.776808,
  139.049665,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_hane',
  '羽',
  'はね',
  '{"en":"Hane"}'::jsonb,
  35.758253,
  139.298892,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_honcho',
  '本町',
  'ほんちょう',
  '{"en":"Honcho"}'::jsonb,
  35.7598471,
  139.5315502,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_minamisawa',
  '南沢',
  'みなみさわ',
  '{"en":"Minamisawa"}'::jsonb,
  35.750195,
  139.529763,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_chuo',
  '中央',
  'ちゅうおう',
  '{"en":"Chuo"}'::jsonb,
  35.745163,
  139.4286729,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_sakuragaoka',
  '桜が丘',
  'さくらがおか',
  '{"en":"Sakuragaoka"}'::jsonb,
  35.7341935,
  139.4230889,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kanaimachi',
  '金井町',
  'かないまち',
  '{"en":"Kanaimachi"}'::jsonb,
  35.5761733,
  139.4482072,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_okubo',
  '大久保',
  '大久保',
  '{"en":"Okubo"}'::jsonb,
  35.7046389,
  139.7052761,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kodaira_misonoch',
  '美園町',
  'みそのちょう',
  '{"en":"Misonochō"}'::jsonb,
  35.7387551,
  139.4893276,
  NULL,
  'tokyo',
  'tokyo_kodaira',
  'jp',
  '東京都',
  NULL,
  '小平市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_nishikojiya',
  '西糀谷',
  '西糀谷',
  '{"en":"Nishikojiya"}'::jsonb,
  35.5572648,
  139.7331679,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_higashikojiya',
  '東糀谷',
  '東糀谷',
  '{"en":"Higashikojiya"}'::jsonb,
  35.5573381,
  139.7438994,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_k_enji_south',
  '高円寺南',
  'こうえんじみなみ',
  '{"en":"Kōenji-south"}'::jsonb,
  35.7000231,
  139.6549094,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_honan',
  '方南',
  'ほうなん',
  '{"en":"Honan"}'::jsonb,
  35.680503,
  139.6582853,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_izumi',
  '和泉',
  'いずみ',
  '{"en":"Izumi"}'::jsonb,
  35.6782189,
  139.6503888,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_horinouchi',
  '堀ノ内',
  'ほりのうち',
  '{"en":"Horinouchi"}'::jsonb,
  35.6865625,
  139.650863,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_matsunoki',
  '松ノ木',
  'まつのき',
  '{"en":"Matsunoki"}'::jsonb,
  35.6909497,
  139.6429255,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_shimo_takaido',
  '下高井戸',
  'しもたかいど',
  '{"en":"Shimo Takaido"}'::jsonb,
  35.6731043,
  139.6314056,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_kami_takaido',
  '上高井戸',
  'かみたかいど',
  '{"en":"Kami Takaido"}'::jsonb,
  35.6760997,
  139.6136914,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_momoi',
  '桃井',
  'ももい',
  '{"en":"Momoi"}'::jsonb,
  35.7134088,
  139.6086647,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_hon_amanuma',
  '本天沼',
  '本天沼',
  '{"en":"Hon Amanuma"}'::jsonb,
  35.7145402,
  139.6261006,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_narita_higashi',
  '成田東',
  'なりたひがし',
  '{"en":"Narita-higashi"}'::jsonb,
  35.6929233,
  139.6367011,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_narita_nishi',
  '成田西',
  'なりたにし',
  '{"en":"Narita-nishi"}'::jsonb,
  35.6903369,
  139.6299418,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_hamadayama',
  '浜田山',
  'はまだやま',
  '{"en":"Hamadayama"}'::jsonb,
  35.6813295,
  139.6292715,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_miyamae',
  '宮前',
  'みやまえ',
  '{"en":"Miyamae"}'::jsonb,
  35.6937952,
  139.6068856,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_kami_igusa',
  '上井草',
  'かみいぐさ',
  '{"en":"Kami Igusa"}'::jsonb,
  35.7212283,
  139.6058275,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_minami_ogikubo',
  '南荻窪',
  'みなみおぎくぼ',
  '{"en":"Minami Ogikubo"}'::jsonb,
  35.7005095,
  139.6127907,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_kugayama',
  '久我山',
  'くがやま',
  '{"en":"Kugayama"}'::jsonb,
  35.6862106,
  139.5985006,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_takaido_nishi',
  '高井戸西',
  'たかいどにし',
  '{"en":"Takaido Nishi"}'::jsonb,
  35.6847034,
  139.6121869,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_nishiogi_minami',
  '西荻南',
  'にしおぎみなみ',
  '{"en":"Nishiogi Minami"}'::jsonb,
  35.7010053,
  139.6030934,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_takaido_higashi',
  '高井戸東',
  'たかいどひがし',
  '{"en":"Takaido-higashi"}'::jsonb,
  35.6822563,
  139.6213132,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_nishiogi_kita',
  '西荻北',
  'にしおぎきた',
  '{"en":"Nishiogi kita"}'::jsonb,
  35.7065034,
  139.6017866,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_kamiogi',
  '上荻',
  'かみおぎ',
  '{"en":"Kamiogi"}'::jsonb,
  35.7077759,
  139.610824,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_muk_jima',
  '向島',
  'むこうじま',
  '{"en":"Mukōjima"}'::jsonb,
  35.7159673,
  139.8093821,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_higashi_mukojima',
  '東向島',
  'ひがしむこうじま',
  '{"en":"Higashi Mukojima"}'::jsonb,
  35.7231961,
  139.8184066,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_tsutsumi_dori',
  '堤通',
  'つつみどおり',
  '{"en":"Tsutsumi Dori"}'::jsonb,
  35.7316247,
  139.813188,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_sumida',
  '墨田',
  'すみだ',
  '{"en":"Sumida"}'::jsonb,
  35.7355627,
  139.820369,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_oshiage',
  '押上',
  'おしあげ',
  '{"en":"Oshiage"}'::jsonb,
  35.7125387,
  139.8148147,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_sendagaya',
  '千駄ヶ谷',
  'せんだがや',
  '{"en":"Sendagaya"}'::jsonb,
  35.6818379,
  139.7074785,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_jingumae',
  '神宮前',
  'じんぐうまえ',
  '{"en":"Jingumae"}'::jsonb,
  35.6692039,
  139.7072847,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_nishi_shinjuku',
  '西新宿',
  'にししんじゅく',
  '{"en":"Nishi-Shinjuku"}'::jsonb,
  35.690719,
  139.6941527,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_yoyogi',
  '代々木',
  'よよぎ',
  '{"en":"Yoyogi"}'::jsonb,
  35.682304,
  139.6917362,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_shinjuku',
  '新宿',
  'しんじゅく',
  '{"en":"Shinjuku"}'::jsonb,
  35.6942679,
  139.7086541,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_higashi',
  '東',
  'ひがし',
  '{"en":"Higashi"}'::jsonb,
  35.6531376,
  139.7114585,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_kitasuna',
  '北砂',
  'きたすな',
  '{"en":"Kitasuna"}'::jsonb,
  35.6812221,
  139.8308372,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_bunka',
  '文花',
  'ぶんか',
  '{"en":"Bunka"}'::jsonb,
  35.7093979,
  139.8241097,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_tachibana',
  '立花',
  'たちばな',
  '{"en":"Tachibana"}'::jsonb,
  35.7106072,
  139.8322279,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_toyosu',
  '豊洲',
  'とよす',
  '{"en":"Toyosu"}'::jsonb,
  35.6501423,
  139.7931179,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_minamisuna',
  '南砂',
  'みなみすな',
  '{"en":"Minamisuna"}'::jsonb,
  35.6743164,
  139.8262215,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_oshima',
  '大島',
  'おおしま',
  '{"en":"Oshima"}'::jsonb,
  35.690322,
  139.8327205,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_kameido',
  '亀戸',
  'かめいど',
  '{"en":"Kameido"}'::jsonb,
  35.697902,
  139.83253,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_higashisuna',
  '東砂',
  'ひがしすな',
  '{"en":"Higashisuna"}'::jsonb,
  35.6760119,
  139.8406184,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_shinsuna',
  '新砂',
  'しんすな',
  '{"en":"Shinsuna"}'::jsonb,
  35.6615806,
  139.8317778,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_yahiro',
  '八広',
  'やひろ',
  '{"en":"Yahiro"}'::jsonb,
  35.7226532,
  139.8270846,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_kyojima',
  '京島',
  'きょうじま',
  '{"en":"Kyojima"}'::jsonb,
  35.7156541,
  139.820884,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_sumida',
  '東墨田',
  'ひがしすみだ',
  '{"en":"Higashi-Sumida"}'::jsonb,
  35.7214866,
  139.834493,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_ohara',
  '大原',
  'おおはら',
  '{"en":"Ohara"}'::jsonb,
  35.6695696,
  139.6618404,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_hanegi',
  '羽根木',
  'はねぎ',
  '{"en":"Hanegi"}'::jsonb,
  35.665532,
  139.6577681,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_komatsugawa',
  '小松川',
  'こまつがわ',
  '{"en":"Komatsugawa"}'::jsonb,
  35.695241,
  139.85134,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_hirai',
  '平井',
  'ひらい',
  '{"en":"Hirai"}'::jsonb,
  35.7089402,
  139.8435521,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_matsushima',
  '松島',
  'まつしま',
  '{"en":"Matsushima"}'::jsonb,
  35.7077082,
  139.8589732,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_chuo',
  '中央',
  'ちゅうおう',
  '{"en":"Chuo"}'::jsonb,
  35.7097839,
  139.8702235,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_osugi',
  '大杉',
  'おおすぎ',
  '{"en":"Osugi"}'::jsonb,
  35.7075252,
  139.8799628,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_matsumoto',
  '松本',
  'まつもと',
  '{"en":"Matsumoto"}'::jsonb,
  35.7166709,
  139.8783199,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nishi_koiwa',
  '西小岩',
  'にしこいわ',
  '{"en":"Nishi koiwa"}'::jsonb,
  35.7364029,
  139.8786008,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_honisshiki',
  '本一色',
  'ほんいっしき',
  '{"en":"Honisshiki"}'::jsonb,
  35.7183384,
  139.8713092,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_kamiisshiki',
  '上一色',
  'かみいっしき',
  '{"en":"Kamiisshiki"}'::jsonb,
  35.7272158,
  139.8727715,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_kita_koiwa',
  '北小岩',
  'きたこいわ',
  '{"en":"Kita koiwa"}'::jsonb,
  35.7420662,
  139.891105,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_koiwa',
  '東小岩',
  'ひがしこいわ',
  '{"en":"Higashi koiwa"}'::jsonb,
  35.7266033,
  139.8929123,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_minami_koiwa',
  '南小岩',
  'みなみこいわ',
  '{"en":"Minami koiwa"}'::jsonb,
  35.7260236,
  139.883879,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_matsumoto',
  '東松本',
  'ひがしまつもと',
  '{"en":"Higashi matsumoto"}'::jsonb,
  35.7191259,
  139.8833813,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_shishibone',
  '鹿骨',
  'ししぼね',
  '{"en":"Shishibone"}'::jsonb,
  35.7126463,
  139.8897347,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nihori',
  '新堀',
  'にいほり',
  '{"en":"Nihori"}'::jsonb,
  35.7047963,
  139.8889677,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_yagouchi',
  '谷河内',
  'やごうち',
  '{"en":"Yagouchi"}'::jsonb,
  35.7020899,
  139.8964815,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_haruecho',
  '春江町',
  'はるえちょう',
  '{"en":"Haruecho"}'::jsonb,
  35.6967121,
  139.8885247,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_kita_shinozaki',
  '北篠崎',
  'きたしのざき',
  '{"en":"Kita shinozaki"}'::jsonb,
  35.7195526,
  139.8961748,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nishi_shinozaki',
  '西篠崎',
  'にししのざき',
  '{"en":"Nishi shinozaki"}'::jsonb,
  35.7134917,
  139.8945681,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_kami_shinozaki',
  '上篠崎',
  'かみしのざき',
  '{"en":"Kami shinozaki"}'::jsonb,
  35.713261,
  139.9017015,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_shinozakimachi',
  '篠崎町',
  'しのざきまち',
  '{"en":"Shinozakimachi"}'::jsonb,
  35.7046995,
  139.9062828,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_shinozaki',
  '東篠崎',
  'ひがししのざき',
  '{"en":"Higashi Shinozaki"}'::jsonb,
  35.6946113,
  139.9132742,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_minami_shinozakimachi',
  '南篠崎町',
  'みなみしのざきまち',
  '{"en":"Minami Shinozakimachi"}'::jsonb,
  35.694852,
  139.904389,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_mizue',
  '瑞江',
  'みずえ',
  '{"en":"Mizue"}'::jsonb,
  35.6967152,
  139.8953931,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_mizue',
  '東瑞江',
  'ひがしみずえ',
  '{"en":"Higashi Mizue"}'::jsonb,
  35.6889373,
  139.8968556,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nishi_mizue',
  '西瑞江',
  'にしみずえ',
  '{"en":"Nishi Mizue"}'::jsonb,
  35.6835221,
  139.885834,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_edogawa',
  '江戸川',
  'えどがわ',
  '{"en":"Edogawa"}'::jsonb,
  35.6824477,
  139.8896464,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_komatsugawa',
  '東小松川',
  'ひがしこまつがわ',
  '{"en":"Higashi Komatsugawa"}'::jsonb,
  35.693776,
  139.864866,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_matsue',
  '松江',
  'まつえ',
  '{"en":"Matsue"}'::jsonb,
  35.6937469,
  139.8718694,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nishi_ichinoe',
  '西一之江',
  'にしいちのえ',
  '{"en":"Nishi Ichinoe"}'::jsonb,
  35.6976522,
  139.8772371,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_ichinoe',
  '一之江',
  'いちのえ',
  '{"en":"Ichinoe"}'::jsonb,
  35.6926393,
  139.8829149,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_fubabori',
  '船堀',
  'ふなぼり',
  '{"en":"Fubabori"}'::jsonb,
  35.6823249,
  139.8633109,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_ecchujima',
  '越中島',
  'えっちゅうじま',
  '{"en":"Ecchujima"}'::jsonb,
  35.6684177,
  139.791768,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_ariake',
  '有明',
  'ありあけ',
  '{"en":"Ariake"}'::jsonb,
  35.6337517,
  139.7902031,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_sumiyoshi',
  '住吉',
  'すみよし',
  '{"en":"Sumiyoshi"}'::jsonb,
  35.6890802,
  139.814512,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_eitai',
  '永代',
  'えいたい',
  '{"en":"Eitai"}'::jsonb,
  35.6741434,
  139.7907503,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_kiyosumi',
  '清澄',
  'きよすみ',
  '{"en":"Kiyosumi"}'::jsonb,
  35.6826914,
  139.7960478,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_ogibashi',
  '扇橋',
  'おうぎばし',
  '{"en":"Ogibashi"}'::jsonb,
  35.6840871,
  139.8171261,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_edagawa',
  '枝川',
  'えだがわ',
  '{"en":"Edagawa"}'::jsonb,
  35.6580584,
  139.8090649,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_aomi',
  '青海',
  'あおみ',
  '{"en":"Aomi"}'::jsonb,
  35.6137752,
  139.7814016,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_saga',
  '佐賀',
  'さが',
  '{"en":"Saga"}'::jsonb,
  35.6781595,
  139.7907312,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_kiba',
  '木場',
  'きば',
  '{"en":"Kiba"}'::jsonb,
  35.6714772,
  139.8057495,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_shirakawa',
  '白河',
  'しらかわ',
  '{"en":"Shirakawa"}'::jsonb,
  35.6828746,
  139.8037452,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_sarue',
  '猿江',
  'さるえ',
  '{"en":"Sarue"}'::jsonb,
  35.6861541,
  139.8149685,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_shinonome',
  '東雲',
  'しののめ',
  '{"en":"Shinonome"}'::jsonb,
  35.6441411,
  139.8022923,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_shinohashi',
  '新大橋',
  'しんおおはし',
  '{"en":"Shinohashi"}'::jsonb,
  35.6890786,
  139.7938061,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_shiohama',
  '塩浜',
  'しおはま',
  '{"en":"Shiohama"}'::jsonb,
  35.6634824,
  139.8077876,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_sengoku',
  '千石',
  'せんごく',
  '{"en":"Sengoku"}'::jsonb,
  35.6790309,
  139.8155777,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_shiomi',
  '潮見',
  'しおみ',
  '{"en":"Shiomi"}'::jsonb,
  35.6573359,
  139.8159093,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_canal_court_tatsumi',
  '辰巳',
  'たつみ',
  '{"en":"Tatsumi"}'::jsonb,
  35.6485139,
  139.8119175,
  NULL,
  'tokyo',
  'tokyo_canal_court',
  'jp',
  '東京都',
  NULL,
  'キャナルコート',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_tokiwa',
  '常盤',
  'ときわ',
  '{"en":"Tokiwa"}'::jsonb,
  35.6846428,
  139.7960892,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_tomioka',
  '富岡',
  'とみおか',
  '{"en":"Tomioka"}'::jsonb,
  35.671289,
  139.7995633,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_morishita',
  '森下',
  'もりした',
  '{"en":"Morishita"}'::jsonb,
  35.6867282,
  139.8043483,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_toyo',
  '東陽',
  'とうよう',
  '{"en":"Toyo"}'::jsonb,
  35.6706676,
  139.8141034,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_furuishiba',
  '古石場',
  'ふるいしば',
  '{"en":"Furuishiba"}'::jsonb,
  35.6680295,
  139.7968481,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_hirano',
  '平野',
  'ひらの',
  '{"en":"Hirano"}'::jsonb,
  35.6777246,
  139.8043094,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_fukagawa',
  '深川',
  'ふかがわ',
  '{"en":"Fukagawa"}'::jsonb,
  35.6768254,
  139.7972635,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_botan',
  '牡丹',
  'ぼたん',
  '{"en":"Botan"}'::jsonb,
  35.6694399,
  139.7977158,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_monzennakacho',
  '門前仲町',
  'もんぜんなかちょう',
  '{"en":"Monzennakacho"}'::jsonb,
  35.6734513,
  139.7956639,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_fukuzumi',
  '福住',
  'ふくずみ',
  '{"en":"Fukuzumi"}'::jsonb,
  35.6771737,
  139.7935599,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_miyoshi',
  '三好',
  'みよし',
  '{"en":"Miyoshi"}'::jsonb,
  35.6800594,
  139.8039413,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_mori',
  '毛利',
  'もうり',
  '{"en":"Mori"}'::jsonb,
  35.6918189,
  139.8160147,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_kasai',
  '東葛西',
  'ひがしかさい',
  '{"en":"Higashi Kasai"}'::jsonb,
  35.6621415,
  139.8801543,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_minami_kasai',
  '南葛西',
  'みなみかさい',
  '{"en":"Minami Kasai"}'::jsonb,
  35.648195,
  139.8735315,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_naka_kasai',
  '中葛西',
  'なかかさい',
  '{"en":"Naka Kasai"}'::jsonb,
  35.6638877,
  139.8687474,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_kita_kasai',
  '北葛西',
  'きたかさい',
  '{"en":"Kita Kasai"}'::jsonb,
  35.6770502,
  139.8565578,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_nishi_kasai',
  '西葛西',
  'にしかさい',
  '{"en":"Nishi Kasai"}'::jsonb,
  35.6660446,
  139.8552713,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_seishincho',
  '清新町',
  'せいしんちょう',
  '{"en":"Seishincho"}'::jsonb,
  35.6586332,
  139.8528124,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_koto_rinkaicho',
  '臨海町',
  'りんかいちょう',
  '{"en":"Rinkaicho"}'::jsonb,
  35.64762,
  139.8579782,
  NULL,
  'tokyo',
  'tokyo_koto',
  'jp',
  '東京都',
  NULL,
  '江東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_omori_minami',
  '大森南',
  'おおもりみなみ',
  '{"en":"Omori minami"}'::jsonb,
  35.5652451,
  139.7447965,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_omori_higashi',
  '大森東',
  'おおもりひがし',
  '{"en":"Omori Higashi"}'::jsonb,
  35.5722504,
  139.7384572,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_naka_rokugo',
  '仲六郷',
  'なかろくごう',
  '{"en":"Naka Rokugo"}'::jsonb,
  35.5460518,
  139.7107572,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_minami_rokugo',
  '南六郷',
  'みなみろくごう',
  '{"en":"Minami Rokugo"}'::jsonb,
  35.5435161,
  139.7196773,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_higashi_rokugo',
  '東六郷',
  'ひがしろくごう',
  '{"en":"Higashi Rokugo"}'::jsonb,
  35.5465706,
  139.7148809,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kamata_honcho',
  '蒲田本町',
  'かまたほんちょう',
  '{"en":"Kamata honcho"}'::jsonb,
  35.5571834,
  139.7174305,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kamata',
  '蒲田',
  'かまた',
  '{"en":"Kamata"}'::jsonb,
  35.5637235,
  139.7216959,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_nishi_rokugo',
  '西六郷',
  'にしろくごう',
  '{"en":"Nishi Rokugo"}'::jsonb,
  35.5466705,
  139.7057661,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_minami_kamata',
  '南蒲田',
  'みなみかまた',
  '{"en":"Minami Kamata"}'::jsonb,
  35.5569613,
  139.7248808,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_omori_honcho',
  '大森本町',
  'おおもりほんちょう',
  '{"en":"Omori honcho"}'::jsonb,
  35.5828893,
  139.7373,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kita_kojiya',
  '北糀谷',
  'きたこうじや',
  '{"en":"Kita Kojiya"}'::jsonb,
  35.5625885,
  139.7344491,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_nishi_kamata',
  '西蒲田',
  'にしかまた',
  '{"en":"Nishi Kamata"}'::jsonb,
  35.5665816,
  139.7126792,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_higashi_kamata',
  '東蒲田',
  'ひがしかまた',
  '{"en":"Higashi Kamata"}'::jsonb,
  35.5629681,
  139.7282855,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_higashi_yaguchi',
  '東矢口',
  'ひがしやぐち',
  '{"en":"Higashi Yaguchi"}'::jsonb,
  35.5642119,
  139.7022299,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_omori_nishi',
  '大森西',
  'おおもりにし',
  '{"en":"Omori Nishi"}'::jsonb,
  35.5740483,
  139.7269748,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_omori_naka',
  '大森中',
  'おおもりなか',
  '{"en":"Omori Naka"}'::jsonb,
  35.5687257,
  139.73284,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_omori_kita',
  '大森北',
  'おおもりきた',
  '{"en":"Omori Kita"}'::jsonb,
  35.5833459,
  139.7298435,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_shin_kamata',
  '新蒲田',
  'しんかまた',
  '{"en":"Shin Kamata"}'::jsonb,
  35.5579836,
  139.7087,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_tamagawa',
  '多摩川',
  'たまがわ',
  '{"en":"Tamagawa"}'::jsonb,
  35.5597078,
  139.7001747,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_sanno',
  '山王',
  'さんのう',
  '{"en":"Sanno"}'::jsonb,
  35.5876111,
  139.7238897,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_chuo',
  '中央',
  'ちゅうおう',
  '{"en":"Chuo"}'::jsonb,
  35.5767633,
  139.7151304,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_ikegami',
  '池上',
  'いけがみ',
  '{"en":"Ikegami"}'::jsonb,
  35.5744251,
  139.7041622,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_minami_magome',
  '南馬込',
  'みなみまごめ',
  '{"en":"Minami Magome"}'::jsonb,
  35.5881179,
  139.7123265,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_higashi_magome',
  '東馬込',
  'ひがしまごめ',
  '{"en":"Higashi Magome"}'::jsonb,
  35.5961963,
  139.7154876,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_kita_magome',
  '北馬込',
  'きたまごめ',
  '{"en":"Kita Magome"}'::jsonb,
  35.5997702,
  139.7077863,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_naka_magome',
  '中馬込',
  'なかまごめ',
  '{"en":"Naka Magome"}'::jsonb,
  35.5949455,
  139.706635,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_nishi_magome',
  '西馬込',
  'にしまごめ',
  '{"en":"Nishi Magome"}'::jsonb,
  35.5887932,
  139.7043421,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_naka_ikegami',
  '仲池上',
  'なかいけがみ',
  '{"en":"Naka Ikegami"}'::jsonb,
  35.5856105,
  139.6985045,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kugahara',
  '久が原',
  'くがはら',
  '{"en":"Kugahara"}'::jsonb,
  35.5803856,
  139.6932265,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_minami_kugahara',
  '南久が原',
  'みなみくがはら',
  '{"en":"Minami Kugahara"}'::jsonb,
  35.576679,
  139.6873872,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_chidori',
  '千鳥',
  'ちどり',
  '{"en":"Chidori"}'::jsonb,
  35.5706647,
  139.6923407,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_yaguchi',
  '矢口',
  'やぐち',
  '{"en":"Yaguchi"}'::jsonb,
  35.5639836,
  139.6932882,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_shimomaruko',
  '下丸子',
  'しもまるこ',
  '{"en":"Shimomaruko"}'::jsonb,
  35.5660505,
  139.6820651,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_unoki',
  '鵜の木',
  'うのき',
  '{"en":"Unoki"}'::jsonb,
  35.5756425,
  139.6790224,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_denenchofu',
  '田園調布',
  'でんえんちょうふ',
  '{"en":"Denenchofu"}'::jsonb,
  35.5933549,
  139.6655655,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_kamiikedai',
  '上池台',
  'かみいけだい',
  '{"en":"Kamiikedai"}'::jsonb,
  35.5964965,
  139.6974208,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_higashi_yukigaya',
  '東雪谷',
  'ひがしゆきがや',
  '{"en":"Higashi Yukigaya"}'::jsonb,
  35.5953436,
  139.6906433,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_minami_yukigaya',
  '南雪谷',
  'みなみゆきがや',
  '{"en":"Minami Yukigaya"}'::jsonb,
  35.5916071,
  139.6842421,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_ishikawacho',
  '石川町',
  'いしかわちょう',
  '{"en":"Ishikawacho"}'::jsonb,
  35.5997015,
  139.6826319,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_minami_senzoku',
  '南千束',
  'みなみせんぞく',
  '{"en":"Minami Senzoku"}'::jsonb,
  35.6019962,
  139.6914609,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_kita_senzoku',
  '北千束',
  'きたせんぞく',
  '{"en":"Kita Senzoku"}'::jsonb,
  35.6085774,
  139.6893869,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_okudo',
  '奥戸',
  'おくど',
  '{"en":"Okudo"}'::jsonb,
  35.7343663,
  139.8636746,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_shinkoiwa',
  '新小岩',
  'しんこいわ',
  '{"en":"Shinkoiwa"}'::jsonb,
  35.7177335,
  139.8642696,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_nishi_shinkoiwa',
  '西新小岩',
  'にししんこいわ',
  '{"en":"Nishi Shinkoiwa"}'::jsonb,
  35.7198521,
  139.8494453,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_higashi_shinkoiwa',
  '東新小岩',
  'ひがししんこいわ',
  '{"en":"Higashi Shinkoiwa"}'::jsonb,
  35.723947,
  139.859121,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_hosoda',
  '細田',
  'ほそだ',
  '{"en":"Hosoda"}'::jsonb,
  35.7411062,
  139.8708628,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_kamakura',
  '鎌倉',
  'かまくら',
  '{"en":"Kamakura"}'::jsonb,
  35.7459954,
  139.8787501,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_takasago',
  '高砂',
  'たかさご',
  '{"en":"Takasago"}'::jsonb,
  35.7491173,
  139.8662271,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_shibamata',
  '柴又',
  'しばまた',
  '{"en":"Shibamata"}'::jsonb,
  35.7563821,
  139.8770799,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_niijuku',
  '新宿',
  'にいじゅく',
  '{"en":"Niijuku"}'::jsonb,
  35.7681272,
  139.8618804,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_kanamachi',
  '金町',
  'かなまち',
  '{"en":"Kanamachi"}'::jsonb,
  35.7666976,
  139.8710689,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_kanamachi',
  '東金町',
  'ひがしかなまち',
  '{"en":"Higashi Kanamachi"}'::jsonb,
  35.7762982,
  139.8791437,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_mizumoto',
  '東水元',
  'ひがしみずもと',
  '{"en":"Higashi Mizumoto"}'::jsonb,
  35.7867123,
  139.8670357,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_minami_mizumoto',
  '南水元',
  'みなみみずもと',
  '{"en":"Minami Mizumoto"}'::jsonb,
  35.7776152,
  139.8607906,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_mizumoto',
  '水元',
  'みずもと',
  '{"en":"Mizumoto"}'::jsonb,
  35.7844846,
  139.8604831,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_nishi_mizumoto',
  '西水元',
  'にしみずもと',
  '{"en":"Nishi Mizumoto"}'::jsonb,
  35.787324,
  139.8518675,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_ontacho',
  '恩多町',
  'おんたちょう',
  '{"en":"Ontacho"}'::jsonb,
  35.7533697,
  139.4844735,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_yotsugi',
  '東四つ木',
  'ひがしよつぎ',
  '{"en":"Higashi Yotsugi"}'::jsonb,
  35.7291102,
  139.8403364,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_yotsugi',
  '四つ木',
  'よつぎ',
  '{"en":"Yotsugi"}'::jsonb,
  35.7357221,
  139.8342105,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_aoto',
  '青戸',
  'あおと',
  '{"en":"Aoto"}'::jsonb,
  35.7504293,
  139.8541318,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_tateishi',
  '東立石',
  'ひがしたていし',
  '{"en":"Higashi Tateishi"}'::jsonb,
  35.7329088,
  139.8490434,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_tateishi',
  '立石',
  'たていし',
  '{"en":"Tateishi"}'::jsonb,
  35.7416796,
  139.8495356,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_shiratori',
  '白鳥',
  'しらとり',
  '{"en":"Shiratori"}'::jsonb,
  35.749885,
  139.8446139,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_kameari',
  '亀有',
  'かめあり',
  '{"en":"Kameari"}'::jsonb,
  35.7625903,
  139.8473483,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_nishi_kameari',
  '西亀有',
  'にしかめあり',
  '{"en":"Nishi Kameari"}'::jsonb,
  35.7613063,
  139.83748,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_ohanajaya',
  'お花茶屋',
  'おはなぢゃや',
  '{"en":"Ohanajaya"}'::jsonb,
  35.7531013,
  139.8410888,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_takaramachi',
  '宝町',
  'たからまち',
  '{"en":"Takaramachi"}'::jsonb,
  35.7443438,
  139.8374458,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_higashi_horikiri',
  '東堀切',
  'ひがしほりきり',
  '{"en":"Higashi Horikiri"}'::jsonb,
  35.7536508,
  139.8364038,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_katsushika_horikiri',
  '堀切',
  'ほりきり',
  '{"en":"Horikiri"}'::jsonb,
  35.7464692,
  139.8270423,
  NULL,
  'tokyo',
  'tokyo_katsushika',
  'jp',
  '東京都',
  NULL,
  '葛飾区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_adachi_kosuge',
  '小菅',
  'こすげ',
  '{"en":"Kosuge"}'::jsonb,
  35.7551572,
  139.8202754,
  NULL,
  'tokyo',
  'tokyo_adachi',
  'jp',
  '東京都',
  NULL,
  '足立区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_minami_senju',
  '南千住',
  'みなみせんじゅ',
  '{"en":"Minami Senju"}'::jsonb,
  35.7357935,
  139.8000711,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_higashi_nippori',
  '東日暮里',
  'ひがしにっぽり',
  '{"en":"Higashi-Nippori"}'::jsonb,
  35.7294836,
  139.7817646,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_nishi_nippori',
  '西日暮里',
  'にしにっぽり',
  '{"en":"Nishi-Nippori"}'::jsonb,
  35.7325615,
  139.7703179,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_arakawa',
  '荒川',
  'あらかわ',
  '{"en":"Arakawa"}'::jsonb,
  35.7390532,
  139.7813524,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_machiya',
  '町屋',
  'まちや',
  '{"en":"Machiya"}'::jsonb,
  35.7494932,
  139.7831056,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_higashi_ogu',
  '東尾久',
  'ひがしおぐ',
  '{"en":"Higashi Ogu"}'::jsonb,
  35.7449152,
  139.7696223,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_nishi_ogu',
  '西尾久',
  'にしおぐ',
  '{"en":"Nishi Ogu"}'::jsonb,
  35.750299,
  139.7580339,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_higashi_jujo',
  '東十条',
  'ひがしじゅうじょう',
  '{"en":"Higashi Jujo"}'::jsonb,
  35.7658363,
  139.7272025,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_toshima',
  '豊島',
  'としま',
  '{"en":"Toshima"}'::jsonb,
  35.7630169,
  139.7488159,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_ji',
  '王子',
  'おうじ',
  '{"en":"Ōji"}'::jsonb,
  35.7599287,
  139.7365951,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_kamiya',
  '神谷',
  'かみや',
  '{"en":"Kamiya"}'::jsonb,
  35.7711695,
  139.7312601,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_shimo',
  '志茂',
  'しも',
  '{"en":"Shimo"}'::jsonb,
  35.7824772,
  139.7320654,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_akabane',
  '赤羽',
  'あかばね',
  '{"en":"Akabane"}'::jsonb,
  35.7831564,
  139.7207636,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_akabane_minami',
  '赤羽南',
  'あかばねみなみ',
  '{"en":"Akabane minami"}'::jsonb,
  35.7750826,
  139.723931,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_akabane_kita',
  '赤羽北',
  'あかばねきた',
  '{"en":"Akabane kita"}'::jsonb,
  35.7862869,
  139.7103797,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_kirigaoka',
  '桐ケ丘',
  'きりがおか',
  '{"en":"Kirigaoka"}'::jsonb,
  35.7786868,
  139.7090534,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_akabanedai',
  '赤羽台',
  'あかばねだい',
  '{"en":"Akabanedai"}'::jsonb,
  35.7805029,
  139.7163839,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_akabane_nishi',
  '赤羽西',
  'あかばねにし',
  '{"en":"Akabane nishi"}'::jsonb,
  35.7733906,
  139.7136748,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_nishigaoka',
  '西が丘',
  'にしがおか',
  '{"en":"Nishigaoka"}'::jsonb,
  35.7679833,
  139.7115692,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_kishimachi',
  '岸町',
  'きしまち',
  '{"en":"Kishimachi"}'::jsonb,
  35.7581173,
  139.7321942,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_ji_honch',
  '王子本町',
  'おうじほんちょう',
  '{"en":"Ōji-Honchō"}'::jsonb,
  35.7540583,
  139.7308564,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_naka_jujo',
  '中十条',
  'なかじゅうじょう',
  '{"en":"Naka jujo"}'::jsonb,
  35.7630902,
  139.7236608,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_jujo_nakahara',
  '十条仲原',
  'じゅうじょうなかはら',
  '{"en":"Jujo Nakahara"}'::jsonb,
  35.7660297,
  139.7210195,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_kami_jujo',
  '上十条',
  'かみじゅうじょう',
  '{"en":"Kami jujo"}'::jsonb,
  35.7629881,
  139.7180209,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_大むさし_jujodai',
  '十条台',
  'じゅうじょうだい',
  '{"en":"Jujodai"}'::jsonb,
  35.7555887,
  139.7224434,
  NULL,
  'tokyo',
  'tokyo_大むさし',
  'jp',
  '東京都',
  NULL,
  '大むさし',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_takinogawa',
  '滝野川',
  'たきのがわ',
  '{"en":"Takinogawa"}'::jsonb,
  35.7478346,
  139.7268411,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_horifune',
  '堀船',
  'ほりふね',
  '{"en":"Horifune"}'::jsonb,
  35.7544046,
  139.7473296,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_nishigahara',
  '西ケ原',
  'にしがはら',
  '{"en":"Nishigahara"}'::jsonb,
  35.7432985,
  139.7421535,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_showamachi',
  '昭和町',
  'しょうわまち',
  '{"en":"Showamachi"}'::jsonb,
  35.7473342,
  139.7544266,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_kami_nakazato',
  '上中里',
  'かみなかざと',
  '{"en":"Kami-Nakazato"}'::jsonb,
  35.7466653,
  139.7496234,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_nakazato',
  '中里',
  'なかざと',
  '{"en":"Nakazato"}'::jsonb,
  35.739541,
  139.7522185,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_tabata',
  '田端',
  'たばた',
  '{"en":"Tabata"}'::jsonb,
  35.7368318,
  139.7574864,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_higashi_tabata',
  '東田端',
  'ひがしたばた',
  '{"en":"Higashi Tabata"}'::jsonb,
  35.7395979,
  139.7611709,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_tabata_shimachi',
  '田端新町',
  'たばたしんまち',
  '{"en":"Tabata shimachi"}'::jsonb,
  35.7414456,
  139.7644714,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_matsubara',
  '松原',
  'まつばら',
  '{"en":"Matsubara"}'::jsonb,
  35.6633686,
  139.6492965,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_akatsutsumi',
  '赤堤',
  'あかつつみ',
  '{"en":"Akatsutsumi"}'::jsonb,
  35.6600329,
  139.6387897,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_sakurajosui',
  '桜上水',
  'さくらじょうすい',
  '{"en":"Sakurajosui"}'::jsonb,
  35.6622214,
  139.6310557,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_umegaoka',
  '梅丘',
  'うめがおか',
  '{"en":"Umegaoka"}'::jsonb,
  35.6523766,
  139.6530459,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_g_tokuji',
  '豪徳寺',
  'ごうとくじ',
  '{"en":"Gōtokuji"}'::jsonb,
  35.6504114,
  139.647322,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_ikejiri',
  '池尻',
  'いけじり',
  '{"en":"Ikejiri"}'::jsonb,
  35.6490094,
  139.680715,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_mishuku',
  '三宿',
  'みしゅく',
  '{"en":"Mishuku"}'::jsonb,
  35.6500875,
  139.6750067,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_shimouma',
  '下馬',
  'しもうま',
  '{"en":"Shimouma"}'::jsonb,
  35.6346312,
  139.679197,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_nozawa',
  '野沢',
  'のざわ',
  '{"en":"Nozawa"}'::jsonb,
  35.6335651,
  139.6715038,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_kamiuma',
  '上馬',
  'かみうま',
  '{"en":"Kamiuma"}'::jsonb,
  35.6372239,
  139.6625859,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_komazawa',
  '駒沢',
  'こまざわ',
  '{"en":"Komazawa"}'::jsonb,
  35.6313334,
  139.6562555,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_wakabayashi',
  '若林',
  'わかばやし',
  '{"en":"Wakabayashi"}'::jsonb,
  35.6476078,
  139.6602321,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_setagaya',
  '世田谷',
  'せたがや',
  '{"en":"Setagaya"}'::jsonb,
  35.6442148,
  139.6482554,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_miyasaka',
  '宮坂',
  'みやさか',
  '{"en":"Miyasaka"}'::jsonb,
  35.6520437,
  139.6405299,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_kyodo',
  '経堂',
  'きょうどう',
  '{"en":"Kyodo"}'::jsonb,
  35.6499894,
  139.6317129,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_sakura',
  '桜',
  'さくら',
  '{"en":"Sakura"}'::jsonb,
  35.6440435,
  139.6398674,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_tsurumaki',
  '弦巻',
  'つるまき',
  '{"en":"Tsurumaki"}'::jsonb,
  35.6365215,
  139.6483471,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_kami_kitazawa',
  '上北沢',
  'かみきたざわ',
  '{"en":"Kami Kitazawa"}'::jsonb,
  35.6664639,
  139.6220906,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_hachimanyama',
  '八幡山',
  'はちまんやま',
  '{"en":"Hachimanyama"}'::jsonb,
  35.6640372,
  139.6169744,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kasuya',
  '粕谷',
  'かすや',
  '{"en":"Kasuya"}'::jsonb,
  35.6628538,
  139.6075808,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_mitaka_kita_karasuyama',
  '北烏山',
  'きたからすやま',
  '{"en":"Kita Karasuyama"}'::jsonb,
  35.676579,
  139.5976078,
  NULL,
  'tokyo',
  'tokyo_mitaka',
  'jp',
  '東京都',
  NULL,
  '三鷹市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kyuden',
  '給田',
  'きゅうでん',
  '{"en":"Kyuden"}'::jsonb,
  35.6681356,
  139.5921635,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kitami',
  '喜多見',
  'きたみ',
  '{"en":"Kitami"}'::jsonb,
  35.6304381,
  139.5984953,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_seijo',
  '成城',
  'せいじょう',
  '{"en":"Seijo"}'::jsonb,
  35.6417081,
  139.5969089,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kami_soshigaya',
  '上祖師谷',
  'かみそしがや',
  '{"en":"Kami Soshigaya"}'::jsonb,
  35.65779,
  139.5960149,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_soshigaya',
  '祖師谷',
  'そしがや',
  '{"en":"Soshigaya"}'::jsonb,
  35.6505326,
  139.6055915,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kinuta',
  '砧',
  'きぬた',
  '{"en":"Kinuta"}'::jsonb,
  35.6397064,
  139.6115512,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_chitosedai',
  '千歳台',
  'ちとせだい',
  '{"en":"Chitosedai"}'::jsonb,
  35.652865,
  139.6122145,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_unane',
  '宇奈根',
  'うなね',
  '{"en":"Unane"}'::jsonb,
  35.6210337,
  139.6030406,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_okura',
  '大蔵',
  'おおくら',
  '{"en":"Okura"}'::jsonb,
  35.631861,
  139.6123003,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_okamoto',
  '岡本',
  'おかもと',
  '{"en":"Okamoto"}'::jsonb,
  35.6246619,
  139.6184472,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_komae_kamata',
  '鎌田',
  'かまた',
  '{"en":"Kamata"}'::jsonb,
  35.6186819,
  139.61357,
  NULL,
  'tokyo',
  'tokyo_komae',
  'jp',
  '東京都',
  NULL,
  '狛江市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_kami_yoga',
  '上用賀',
  'かみようが',
  '{"en":"Kami Yoga"}'::jsonb,
  35.63352,
  139.6302503,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_yoga',
  '用賀',
  'ようが',
  '{"en":"Yoga"}'::jsonb,
  35.6271878,
  139.6359349,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_tamagawadai',
  '玉川台',
  'たまがわだい',
  '{"en":"Tamagawadai"}'::jsonb,
  35.6240066,
  139.6323338,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_tamagawa',
  '玉川',
  'たまがわ',
  '{"en":"Tamagawa"}'::jsonb,
  35.6148068,
  139.6267055,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_seta',
  '瀬田',
  'せた',
  '{"en":"Seta"}'::jsonb,
  35.6199238,
  139.6294944,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_kami_noge',
  '上野毛',
  'かみのげ',
  '{"en":"Kami noge"}'::jsonb,
  35.6131974,
  139.6372476,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_noge',
  '野毛',
  'のげ',
  '{"en":"Noge"}'::jsonb,
  35.6044166,
  139.6406343,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_nakamachi',
  '中町',
  'なかまち',
  '{"en":"Nakamachi"}'::jsonb,
  35.6164135,
  139.6442497,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_sakurashinmachi',
  '桜新町',
  'さくらしんまち',
  '{"en":"Sakurashinmachi"}'::jsonb,
  35.6304482,
  139.6423714,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_shinmachi',
  '新町',
  'しんまち',
  '{"en":"Shinmachi"}'::jsonb,
  35.6311681,
  139.64853,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_fukasawa',
  '深沢',
  'ふかさわ',
  '{"en":"Fukasawa"}'::jsonb,
  35.6213336,
  139.6513838,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_todoroki',
  '等々力',
  'とどろき',
  '{"en":"Todoroki"}'::jsonb,
  35.6084839,
  139.6541168,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_tamazutsumi',
  '玉堤',
  'たまづつみ',
  '{"en":"Tamazutsumi"}'::jsonb,
  35.5962676,
  139.650861,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_oyamadai',
  '尾山台',
  'おやまだい',
  '{"en":"Oyamadai"}'::jsonb,
  35.6020863,
  139.6548109,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_tamagawa_denenchofu',
  '玉川田園調布',
  'たまがわでんえんちょうふ',
  '{"en":"Tamagawa Denenchofu"}'::jsonb,
  35.6006955,
  139.6647068,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_higashi_tamagawa',
  '東玉川',
  'ひがしたまがわ',
  '{"en":"Higashi Tamagawa"}'::jsonb,
  35.5959383,
  139.6768228,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_okusawa',
  '奥沢',
  'おくさわ',
  '{"en":"Okusawa"}'::jsonb,
  35.6052056,
  139.6662933,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_meguro_honcho',
  '目黒本町',
  'めぐろほんちょう',
  '{"en":"Meguro honcho"}'::jsonb,
  35.6219682,
  139.6962753,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_meguro',
  '目黒',
  'めぐろ',
  '{"en":"Meguro"}'::jsonb,
  35.6339231,
  139.7072864,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_mita',
  '三田',
  'みた',
  '{"en":"Mita"}'::jsonb,
  35.6401343,
  139.7121573,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_naka_meguro',
  '中目黒',
  'なかめぐろ',
  '{"en":"Naka Meguro"}'::jsonb,
  35.6403507,
  139.7034599,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_kami_meguro',
  '上目黒',
  'かみめぐろ',
  '{"en":"Kami-Meguro"}'::jsonb,
  35.6428011,
  139.6930849,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_aobadai',
  '青葉台',
  'あおばだい',
  '{"en":"Aobadai"}'::jsonb,
  35.6513684,
  139.6934004,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_higashiyama',
  '東山',
  'ひがしやま',
  '{"en":"Higashiyama"}'::jsonb,
  35.6472236,
  139.6898194,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_ohashi',
  '大橋',
  'おおはし',
  '{"en":"Ohashi"}'::jsonb,
  35.6522218,
  139.6856436,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_komaba',
  '駒場',
  'こまば',
  '{"en":"Komaba"}'::jsonb,
  35.6593621,
  139.6827141,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_gobongi',
  '五本木',
  'ごほんぎ',
  '{"en":"Gobongi"}'::jsonb,
  35.6355011,
  139.6871893,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_yutenji',
  '祐天寺',
  'ゆうてんじ',
  '{"en":"Yutenji"}'::jsonb,
  35.6381201,
  139.6935573,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_nakacho',
  '中町',
  'なかちょう',
  '{"en":"Nakacho"}'::jsonb,
  35.6323271,
  139.6959081,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_chuo_cho',
  '中央町',
  'ちゅうおうちょう',
  '{"en":"Chuo cho"}'::jsonb,
  35.6303197,
  139.6914353,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_takaban',
  '鷹番',
  'たかばん',
  '{"en":"Takaban"}'::jsonb,
  35.6278194,
  139.6855823,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_himonya',
  '碑文谷',
  'ひもんや',
  '{"en":"Himonya"}'::jsonb,
  35.6220438,
  139.6855136,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_haramachi',
  '原町',
  'はらまち',
  '{"en":"Haramachi"}'::jsonb,
  35.6172757,
  139.6932536,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_senzoku',
  '洗足',
  'せんぞく',
  '{"en":"Senzoku"}'::jsonb,
  35.6127195,
  139.6944579,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_minami',
  '南',
  'みなみ',
  '{"en":"Minami"}'::jsonb,
  35.6140788,
  139.6872945,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_kakinokizaka',
  '柿の木坂',
  'かきのきざか',
  '{"en":"Kakinokizaka"}'::jsonb,
  35.6237238,
  139.6756671,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_higashigaoka',
  '東が丘',
  'ひがしがおか',
  '{"en":"Higashigaoka"}'::jsonb,
  35.628122,
  139.6673813,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_yakumo',
  '八雲',
  'やくも',
  '{"en":"Yakumo"}'::jsonb,
  35.6203425,
  139.6690718,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_nakane',
  '中根',
  'なかね',
  '{"en":"Nakane"}'::jsonb,
  35.615509,
  139.674159,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_tairamachi',
  '平町',
  'たいらまち',
  '{"en":"Tairamachi"}'::jsonb,
  35.6164098,
  139.6803867,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_ookayama',
  '大岡山',
  'おおおかやま',
  '{"en":"Ookayama"}'::jsonb,
  35.6088096,
  139.6827405,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_midorigaoka',
  '緑が丘',
  'みどりがおか',
  '{"en":"Midorigaoka"}'::jsonb,
  35.6105308,
  139.6758726,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_jiyugaoka',
  '自由が丘',
  'じゆうがおか',
  '{"en":"Jiyugaoka"}'::jsonb,
  35.6114502,
  139.6675812,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_kotake_cho',
  '小竹町',
  'こたけちょう',
  '{"en":"Kotake cho"}'::jsonb,
  35.7416147,
  139.6760684,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_toyotama_kami',
  '豊玉上',
  'とよたまかみ',
  '{"en":"Toyotama kami"}'::jsonb,
  35.7370942,
  139.6653736,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_toyotama_kita',
  '豊玉北',
  'とよたまきた',
  '{"en":"Toyotama kita"}'::jsonb,
  35.7348831,
  139.6602943,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_toyotama_naka',
  '豊玉中',
  'とよたまなか',
  '{"en":"Toyotama naka"}'::jsonb,
  35.7315159,
  139.6570743,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_toyotama_minami',
  '豊玉南',
  'とよたまみなみ',
  '{"en":"Toyotama minami"}'::jsonb,
  35.7281946,
  139.6543265,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nakamura',
  '中村',
  'なかむら',
  '{"en":"Nakamura"}'::jsonb,
  35.7326347,
  139.6418449,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nakamura_kita',
  '中村北',
  'なかむらきた',
  '{"en":"Nakamura kita"}'::jsonb,
  35.7355613,
  139.6412751,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_hazawa',
  '羽沢',
  'はざわ',
  '{"en":"Hazawa"}'::jsonb,
  35.7473822,
  139.6712258,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_sakuradai',
  '桜台',
  'さくらだい',
  '{"en":"Sakuradai"}'::jsonb,
  35.7439991,
  139.6625599,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nerima',
  '練馬',
  'ねりま',
  '{"en":"Nerima"}'::jsonb,
  35.7421582,
  139.6524859,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_heiwadai',
  '平和台',
  'へいわだい',
  '{"en":"Heiwadai"}'::jsonb,
  35.7582771,
  139.6608375,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nishiki',
  '錦',
  'にしき',
  '{"en":"Nishiki"}'::jsonb,
  35.7609705,
  139.668056,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_hayamiya',
  '早宮',
  'はやみや',
  '{"en":"Hayamiya"}'::jsonb,
  35.7520223,
  139.6549439,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_kitamachi',
  '北町',
  'きたまち',
  '{"en":"Kitamachi"}'::jsonb,
  35.7655918,
  139.6570357,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_tagara',
  '田柄',
  'たがら',
  '{"en":"Tagara"}'::jsonb,
  35.7627233,
  139.6406856,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_kasugacho',
  '春日町',
  'かすがちょう',
  '{"en":"Kasugacho"}'::jsonb,
  35.7517409,
  139.6413347,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_koyama',
  '向山',
  'こうやま',
  '{"en":"Koyama"}'::jsonb,
  35.74217,
  139.64139,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_nukui',
  '貫井',
  'ぬくい',
  '{"en":"Nukui"}'::jsonb,
  35.7400718,
  139.6319688,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_doshida',
  '土支田',
  'どしだ',
  '{"en":"Doshida"}'::jsonb,
  35.7644244,
  139.6145267,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_yahara',
  '谷原',
  'やはら',
  '{"en":"Yahara"}'::jsonb,
  35.7533018,
  139.6150872,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_miharadai',
  '三原台',
  'みはらだい',
  '{"en":"Miharadai"}'::jsonb,
  35.7541122,
  139.6036841,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_takanodai',
  '高野台',
  'たかのだい',
  '{"en":"Takanodai"}'::jsonb,
  35.7455378,
  139.6162274,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_fujimidai',
  '富士見台',
  'ふじみだい',
  '{"en":"Fujimidai"}'::jsonb,
  35.7367091,
  139.6235163,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_minami_tanaka',
  '南田中',
  'みなみたなか',
  '{"en":"Minami Tanaka"}'::jsonb,
  35.7350514,
  139.6150321,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_shimo_shakujii',
  '下石神井',
  'しもしゃくじい',
  '{"en":"Shimo Shakujii"}'::jsonb,
  35.7317147,
  139.6048749,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_shakujii_machi',
  '石神井町',
  'しゃくじいまち',
  '{"en":"Shakujii machi"}'::jsonb,
  35.7436117,
  139.6043049,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_kami_shakujii',
  '上石神井',
  'かみしゃくじい',
  '{"en":"Kami Shakujii"}'::jsonb,
  35.7286801,
  139.5907338,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_shakujiidai',
  '石神井台',
  'しゃくじいだい',
  '{"en":"Shakujiidai"}'::jsonb,
  35.7370076,
  139.588461,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_sekimachi_minami',
  '関町南',
  'せきまちみなみ',
  '{"en":"Sekimachi minami"}'::jsonb,
  35.7216016,
  139.5786182,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_sekimachi_higashi',
  '関町東',
  'せきまちひがし',
  '{"en":"Sekimachi higashi"}'::jsonb,
  35.7268388,
  139.5822574,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_sekimachi_kita',
  '関町北',
  'せきまちきた',
  '{"en":"Sekimachi kita"}'::jsonb,
  35.7277517,
  139.5729792,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_minami_oizumi',
  '南大泉',
  'みなみおおいずみ',
  '{"en":"Minami Oizumi"}'::jsonb,
  35.7448245,
  139.5728931,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_nishi_oizumi',
  '西大泉',
  'にしおおいずみ',
  '{"en":"Nishi Oizumi"}'::jsonb,
  35.7594647,
  139.5728745,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_higashi_oizumi',
  '東大泉',
  'ひがしおおいずみ',
  '{"en":"Higashi Oizumi"}'::jsonb,
  35.7480017,
  139.5885504,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_oizumi_machi',
  '大泉町',
  'おおいずみまち',
  '{"en":"Oizumi machi"}'::jsonb,
  35.7634647,
  139.6007154,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashino_oizumi_gakuen_cho',
  '大泉学園町',
  'おおいずみがくえんちょう',
  '{"en":"Oizumi gakuen cho"}'::jsonb,
  35.7663852,
  139.5881897,
  NULL,
  'tokyo',
  'tokyo_musashino',
  'jp',
  '東京都',
  NULL,
  '武蔵野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_chuo',
  '中央',
  'ちゅうおう',
  '{"en":"Chuo"}'::jsonb,
  35.6997511,
  139.6750207,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_nakano',
  '中野',
  'なかの',
  '{"en":"Nakano"}'::jsonb,
  35.7058283,
  139.6709357,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_matsugaoka',
  '松が丘',
  'まつがおか',
  '{"en":"Matsugaoka"}'::jsonb,
  35.7219132,
  139.672447,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_numabukuro',
  '沼袋',
  'ぬまぶくろ',
  '{"en":"Numabukuro"}'::jsonb,
  35.720935,
  139.6635395,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_eharacho',
  '江原町',
  'えはらちょう',
  '{"en":"Eharacho"}'::jsonb,
  35.7305452,
  139.6724727,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_nogata',
  '野方',
  'のがた',
  '{"en":"Nogata"}'::jsonb,
  35.7138444,
  139.6554215,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_maruyama',
  '丸山',
  'まるやま',
  '{"en":"Maruyama"}'::jsonb,
  35.7246512,
  139.6539931,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_suginami_shirasagi',
  '白鷺',
  'しらさぎ',
  '{"en":"Shirasagi"}'::jsonb,
  35.720639,
  139.6359464,
  NULL,
  'tokyo',
  'tokyo_suginami',
  'jp',
  '東京都',
  NULL,
  '杉並区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nerima_saginomiya',
  '鷺宮',
  'さぎのみや',
  '{"en":"Saginomiya"}'::jsonb,
  35.7244779,
  139.6378083,
  NULL,
  'tokyo',
  'tokyo_nerima',
  'jp',
  '東京都',
  NULL,
  '練馬区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_akabane',
  '高松',
  'たかまつ',
  '{"en":"Akabane"}'::jsonb,
  35.7377689,
  139.6976272,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_kanamecho',
  '要町',
  'かなめちょう',
  '{"en":"Kanamecho"}'::jsonb,
  35.7365989,
  139.6931594,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_chihaya',
  '千早',
  'ちはや',
  '{"en":"Chihaya"}'::jsonb,
  35.7339531,
  139.6891843,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_senkawa',
  '千川',
  'せんかわ',
  '{"en":"Senkawa"}'::jsonb,
  35.7401188,
  139.6927038,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_nakano_minami_nagasaki',
  '南長崎',
  'みなみながさき',
  '{"en":"Minami-Nagasaki"}'::jsonb,
  35.7262074,
  139.6864893,
  NULL,
  'tokyo',
  'tokyo_nakano',
  'jp',
  '東京都',
  NULL,
  '中野区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_nagasaki',
  '長崎',
  'ながさき',
  '{"en":"Nagasaki"}'::jsonb,
  35.7315657,
  139.6846593,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_takada',
  '高田',
  'たかだ',
  '{"en":"Takada"}'::jsonb,
  35.7157717,
  139.712324,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_zoshigaya',
  '雑司が谷',
  'ぞうしがや',
  '{"en":"Zoshigaya"}'::jsonb,
  35.7195684,
  139.7177949,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_mejiro',
  '目白',
  'めじろ',
  '{"en":"Mejiro"}'::jsonb,
  35.7242907,
  139.7028671,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_nishi_ikebukuro',
  '西池袋',
  'にしいけぶくろ',
  '{"en":"Nishi Ikebukuro"}'::jsonb,
  35.7284313,
  139.7017131,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_higashi_ikebukuro',
  '東池袋',
  'ひがしいけぶくろ',
  '{"en":"Higashi Ikebukuro"}'::jsonb,
  35.7290721,
  139.7209701,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_itabashi_ikebukuro_honcho',
  '池袋本町',
  'いけぶくろほんちょう',
  '{"en":"Ikebukuro honcho"}'::jsonb,
  35.7422596,
  139.7126929,
  NULL,
  'tokyo',
  'tokyo_itabashi',
  'jp',
  '東京都',
  NULL,
  '板橋区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_kami_ikebukuro',
  '上池袋',
  'かみいけぶくろ',
  '{"en":"Kami Ikebukuro"}'::jsonb,
  35.7384949,
  139.7185451,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_minami_otsuka',
  '南大塚',
  'みなみおおつか',
  '{"en":"Minami Otsuka"}'::jsonb,
  35.7293181,
  139.72957,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_kita_otsuka',
  '北大塚',
  'きたおおつか',
  '{"en":"Kita Otsuka"}'::jsonb,
  35.7339779,
  139.7292492,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_nishi_sugamo',
  '西巣鴨',
  'にしすがも',
  '{"en":"Nishi Sugamo"}'::jsonb,
  35.7400681,
  139.7278786,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_sugamo',
  '巣鴨',
  'すがも',
  '{"en":"Sugamo"}'::jsonb,
  35.7364837,
  139.7344705,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kita_komagome',
  '駒込',
  'こまごめ',
  '{"en":"Komagome"}'::jsonb,
  35.7377051,
  139.7423727,
  NULL,
  'tokyo',
  'tokyo_kita',
  'jp',
  '東京都',
  NULL,
  '北区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akihabara_crossfield_yamagibashi',
  '柳橋',
  'やなぎばし',
  '{"en":"Yamagibashi"}'::jsonb,
  35.6980391,
  139.7882835,
  NULL,
  'tokyo',
  'tokyo_akihabara_crossfield',
  'jp',
  '東京都',
  NULL,
  '秋葉原クロスフィールド',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akihabara_crossfield_asakusabashi',
  '浅草橋',
  'あさくさばし',
  '{"en":"Asakusabashi"}'::jsonb,
  35.6997758,
  139.7835525,
  NULL,
  'tokyo',
  'tokyo_akihabara_crossfield',
  'jp',
  '東京都',
  NULL,
  '秋葉原クロスフィールド',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_torigoe',
  '鳥越',
  'とりごえ',
  '{"en":"Torigoe"}'::jsonb,
  35.7025484,
  139.784445,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_misuji',
  '三筋',
  'みすじ',
  '{"en":"Misuji"}'::jsonb,
  35.7049215,
  139.7864058,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_kuramae',
  '蔵前',
  'くらまえ',
  '{"en":"Kuramae"}'::jsonb,
  35.7026209,
  139.7910027,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_komagata',
  '駒形',
  'こまがた',
  '{"en":"Komagata"}'::jsonb,
  35.7060393,
  139.7945589,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akihabara_crossfield_taito',
  '台東',
  'たいとう',
  '{"en":"Taito"}'::jsonb,
  35.7042507,
  139.7783633,
  NULL,
  'tokyo',
  'tokyo_akihabara_crossfield',
  'jp',
  '東京都',
  NULL,
  '秋葉原クロスフィールド',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_kojima',
  '小島',
  'こじま',
  '{"en":"Kojima"}'::jsonb,
  35.7049576,
  139.7831804,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_kotobuki',
  '寿',
  'ことぶき',
  '{"en":"Kotobuki"}'::jsonb,
  35.7081099,
  139.7907949,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_nishi_asakusa',
  '西浅草',
  'にしあさくさ',
  '{"en":"Nishi Asakusa"}'::jsonb,
  35.7144096,
  139.7903283,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_kaminarimon',
  '雷門',
  'かみなりもん',
  '{"en":"Kaminarimon"}'::jsonb,
  35.7102151,
  139.7947242,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_moto_asakusa',
  '元浅草',
  'もとあさくさ',
  '{"en":"Moto Asakusa"}'::jsonb,
  35.7089213,
  139.7848462,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_higashi_ueno',
  '東上野',
  'ひがしうえの',
  '{"en":"Higashi Ueno"}'::jsonb,
  35.7123827,
  139.7810384,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_matsugaya',
  '松が谷',
  'まつがや',
  '{"en":"Matsugaya"}'::jsonb,
  35.7152237,
  139.7868927,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_hanakawado',
  '花川戸',
  'はなかわど',
  '{"en":"Hanakawado"}'::jsonb,
  35.7137898,
  139.7993636,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_kita_ueno',
  '北上野',
  'きたうえの',
  '{"en":"Kita Ueno"}'::jsonb,
  35.7174765,
  139.7835597,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_imado',
  '今戸',
  'いまど',
  '{"en":"Imado"}'::jsonb,
  35.7201954,
  139.8044266,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_hashiba',
  '橋場',
  'はしば',
  '{"en":"Hashiba"}'::jsonb,
  35.725733,
  139.8067405,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_kiyokawa',
  '清川',
  'きよかわ',
  '{"en":"Kiyokawa"}'::jsonb,
  35.725935,
  139.8026561,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_higashi_asakusa',
  '東浅草',
  'ひがしあさくさ',
  '{"en":"Higashi-Asakusa"}'::jsonb,
  35.7231129,
  139.8006027,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_nihonzutsumi',
  '日本堤',
  'にほんづつみ',
  '{"en":"Nihonzutsumi"}'::jsonb,
  35.7269213,
  139.7980059,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_senzoku',
  '千束',
  'せんぞく',
  '{"en":"Senzoku"}'::jsonb,
  35.7218507,
  139.7906806,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_iriya',
  '入谷',
  'いりや',
  '{"en":"Iriya"}'::jsonb,
  35.7207616,
  139.787268,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_ryusen',
  '竜泉',
  'りゅうせん',
  '{"en":"Ryusen"}'::jsonb,
  35.7253594,
  139.7908443,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_minowa',
  '三ノ輪',
  'みのわ',
  '{"en":"Minowa"}'::jsonb,
  35.7290471,
  139.7931582,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_shitaya',
  '下谷',
  'したや',
  '{"en":"Shitaya"}'::jsonb,
  35.7236866,
  139.7851231,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_negishi',
  '根岸',
  'ねぎし',
  '{"en":"Negishi"}'::jsonb,
  35.7250249,
  139.7826839,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_ueno_sakuragi',
  '上野桜木',
  'うえのさくらぎ',
  '{"en":"Ueno-Sakuragi"}'::jsonb,
  35.7215016,
  139.7737857,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_taito_ikenohata',
  '池之端',
  'いけのはた',
  '{"en":"Ikenohata"}'::jsonb,
  35.7164064,
  139.7687671,
  NULL,
  'tokyo',
  'tokyo_taito',
  'jp',
  '東京都',
  NULL,
  '台東区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_ginza',
  '銀座',
  'ぎんざ',
  '{"en":"Ginza"}'::jsonb,
  35.6720135,
  139.7647202,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_yaesu',
  '八重洲',
  'やえす',
  '{"en":"Yaesu"}'::jsonb,
  35.6799658,
  139.7696846,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_tsukiji',
  '築地',
  'つきじ',
  '{"en":"Tsukiji"}'::jsonb,
  35.6650914,
  139.7708281,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_harumi',
  '晴海',
  'はるみ',
  '{"en":"Harumi"}'::jsonb,
  35.6527208,
  139.7785896,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_kachidoki',
  '勝どき',
  'かちどき',
  '{"en":"Kachidoki"}'::jsonb,
  35.658244,
  139.7749921,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_tsukishima',
  '月島',
  'つきしま',
  '{"en":"Tsukishima"}'::jsonb,
  35.6632293,
  139.7822568,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_tsukuda',
  '佃',
  'つくだ',
  '{"en":"Tsukuda"}'::jsonb,
  35.6668345,
  139.7856803,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_shinkawa',
  '新川',
  'しんかわ',
  '{"en":"Shinkawa"}'::jsonb,
  35.6760564,
  139.7831285,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_hacch_bori',
  '八丁堀',
  'はっちょうぼり',
  '{"en":"Hacchōbori"}'::jsonb,
  35.67563,
  139.7775882,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_ky_bashi',
  '京橋',
  'きょうばし',
  '{"en":"Kyōbashi"}'::jsonb,
  35.6758835,
  139.7717019,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_nihonbashi',
  '日本橋',
  'にほんばし',
  '{"en":"Nihonbashi"}'::jsonb,
  35.6812562,
  139.7730907,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akihabara_crossfield_soto_kanda',
  '外神田',
  'そとかんだ',
  '{"en":"Soto-Kanda"}'::jsonb,
  35.7025506,
  139.7706069,
  NULL,
  'tokyo',
  'tokyo_akihabara_crossfield',
  'jp',
  '東京都',
  NULL,
  '秋葉原クロスフィールド',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chiyoda_temachi',
  '大手町',
  'おおてまち',
  '{"en":"Ōtemachi"}'::jsonb,
  35.6868132,
  139.76608,
  NULL,
  'tokyo',
  'tokyo_chiyoda',
  'jp',
  '東京都',
  NULL,
  '千代田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_marunouchi',
  '丸の内',
  'まるのうち',
  '{"en":"Marunouchi"}'::jsonb,
  35.6790703,
  139.7652988,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chuo_yurakucho',
  '有楽町',
  'ゆうらくちょう',
  '{"en":"Yurakucho"}'::jsonb,
  35.6736817,
  139.7611853,
  NULL,
  'tokyo',
  'tokyo_chuo',
  'jp',
  '東京都',
  NULL,
  '中央区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_uchisaiwaicho',
  '内幸町',
  'うちさいわいちょう',
  '{"en":"Uchisaiwaicho"}'::jsonb,
  35.6699956,
  139.7570758,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_kasumigaseki',
  '霞が関',
  'かすみがせき',
  '{"en":"Kasumigaseki"}'::jsonb,
  35.6734887,
  139.7501817,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chiyoda_nagatacho',
  '永田町',
  'ながたちょう',
  '{"en":"Nagatacho"}'::jsonb,
  35.6768717,
  139.7431557,
  NULL,
  'tokyo',
  'tokyo_chiyoda',
  'jp',
  '東京都',
  NULL,
  '千代田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chiyoda_kojimachi',
  '麹町',
  'こうじまち',
  '{"en":"Kojimachi"}'::jsonb,
  35.6838064,
  139.7379229,
  NULL,
  'tokyo',
  'tokyo_chiyoda',
  'jp',
  '東京都',
  NULL,
  '千代田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_konan',
  '港南',
  'こうなん',
  '{"en":"Konan"}'::jsonb,
  35.6301291,
  139.7507521,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_nishi_shinbashi',
  '西新橋',
  'にししんばし',
  '{"en":"Nishi Shinbashi"}'::jsonb,
  35.6675521,
  139.752114,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_higashi_shinbashi',
  '東新橋',
  'ひがししんばし',
  '{"en":"Higashi Shinbashi"}'::jsonb,
  35.6631257,
  139.7589757,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_hamamatsuch',
  '浜松町',
  'はままつちょう',
  '{"en":"Hamamatsuchō"}'::jsonb,
  35.656521,
  139.7558718,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_shiba_daimon',
  '芝大門',
  'しばだいもん',
  '{"en":"Shiba Daimon"}'::jsonb,
  35.6567524,
  139.7537021,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_shiba',
  '芝',
  'しば',
  '{"en":"Shiba"}'::jsonb,
  35.6505871,
  139.7495267,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_shiba_park',
  '芝公園',
  'しばこうえん',
  '{"en":"Shiba Park"}'::jsonb,
  35.6582563,
  139.7466728,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_toranomon',
  '虎ノ門',
  'とらのもん',
  '{"en":"Toranomon"}'::jsonb,
  35.6670276,
  139.7460078,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_higashi_azabu',
  '東麻布',
  'ひがしあざぶ',
  '{"en":"Higashi Azabu"}'::jsonb,
  35.656266,
  139.7401686,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinjuku_moto_akasaka',
  '元赤坂',
  'もとあかさか',
  '{"en":"Moto-Akasaka"}'::jsonb,
  35.6785313,
  139.7284293,
  NULL,
  'tokyo',
  'tokyo_shinjuku',
  'jp',
  '東京都',
  NULL,
  '新宿区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_kita_aoyama',
  '北青山',
  'きたあおやま',
  '{"en":"Kita Aoyama"}'::jsonb,
  35.6705999,
  139.7159289,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_minami_aoyama',
  '南青山',
  'みなみあおやま',
  '{"en":"Minami-Aoyama"}'::jsonb,
  35.6667236,
  139.7188607,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_nishi_azabu',
  '西麻布',
  'にしあざぶ',
  '{"en":"Nishi-Azabu"}'::jsonb,
  35.6600266,
  139.7238075,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_moto_azabu',
  '元麻布',
  'もとあざぶ',
  '{"en":"Moto Azabu"}'::jsonb,
  35.6555514,
  139.729634,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_mita',
  '三田',
  'みた',
  '{"en":"Mita"}'::jsonb,
  35.6467874,
  139.7414307,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_minami_azabu',
  '南麻布',
  'みなみあざぶ',
  '{"en":"Minami Azabu"}'::jsonb,
  35.6515204,
  139.728716,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_takanawa',
  '高輪',
  'たかなわ',
  '{"en":"Takanawa"}'::jsonb,
  35.6349739,
  139.7357164,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_shirokane',
  '白金',
  'しろかね',
  '{"en":"Shirokane"}'::jsonb,
  35.6438973,
  139.7277018,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_shirokanedai',
  '白金台',
  'しろかねだい',
  '{"en":"Shirokanedai"}'::jsonb,
  35.6375308,
  139.7244945,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akihabara_crossfield_yushima',
  '湯島',
  'ゆしま',
  '{"en":"Yushima"}'::jsonb,
  35.7073938,
  139.7678135,
  NULL,
  'tokyo',
  'tokyo_akihabara_crossfield',
  'jp',
  '東京都',
  NULL,
  '秋葉原クロスフィールド',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_hong',
  '本郷',
  'ほんごう',
  '{"en":"Hongō"}'::jsonb,
  35.7077379,
  139.760167,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_yayoi',
  '弥生',
  'やよい',
  '{"en":"Yayoi"}'::jsonb,
  35.7165889,
  139.7620787,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_nezu',
  '根津',
  'ねづ',
  '{"en":"Nezu"}'::jsonb,
  35.7198456,
  139.763863,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_sendagi',
  '千駄木',
  'せんだぎ',
  '{"en":"Sendagi"}'::jsonb,
  35.7261771,
  139.7607174,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_mukogaoka',
  '向丘',
  'むこうがおか',
  '{"en":"Mukogaoka"}'::jsonb,
  35.7210419,
  139.7551745,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_honkomagome',
  '本駒込',
  'ほんこまごめ',
  '{"en":"Honkomagome"}'::jsonb,
  35.7302853,
  139.751492,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_nishikata',
  '西片',
  'にしかた',
  '{"en":"Nishikata"}'::jsonb,
  35.7149455,
  139.7546856,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_k_raku',
  '後楽',
  'こうらく',
  '{"en":"Kōraku"}'::jsonb,
  35.7050451,
  139.7478428,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_suid',
  '水道',
  'すいどう',
  '{"en":"Suidō"}'::jsonb,
  35.7096282,
  139.7397745,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_sekiguchi',
  '関口',
  'せきぐち',
  '{"en":"Sekiguchi"}'::jsonb,
  35.7115354,
  139.7284224,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_mejirodai',
  '目白台',
  'めじろだい',
  '{"en":"Mejirodai"}'::jsonb,
  35.7160076,
  139.72296,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_kasuga',
  '春日',
  'かすが',
  '{"en":"Kasuga"}'::jsonb,
  35.7094398,
  139.7464096,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_koishikawa',
  '小石川',
  'こいしかわ',
  '{"en":"Koishikawa"}'::jsonb,
  35.7131491,
  139.7460916,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_hakusan',
  '白山',
  'はくさん',
  '{"en":"Hakusan"}'::jsonb,
  35.7198179,
  139.7493913,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_sengoku',
  '千石',
  'せんごく',
  '{"en":"Sengoku"}'::jsonb,
  35.7259144,
  139.7411272,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_kohinata',
  '小日向',
  'こひなた',
  '{"en":"Kohinata"}'::jsonb,
  35.7139362,
  139.7366541,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_otowa',
  '音羽',
  'おとわ',
  '{"en":"Otowa"}'::jsonb,
  35.71617,
  139.728532,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_otsuka',
  '大塚',
  'おおつか',
  '{"en":"Otsuka"}'::jsonb,
  35.7225683,
  139.7324987,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chiyoda_kitanomaru_park',
  '北の丸公園',
  'きたのまるこうえん',
  '{"en":"Kitanomaru Park"}'::jsonb,
  35.6920362,
  139.7508573,
  NULL,
  'tokyo',
  'tokyo_chiyoda',
  'jp',
  '東京都',
  NULL,
  '千代田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_taihei',
  '太平',
  'たいへい',
  '{"en":"Taihei"}'::jsonb,
  35.7010978,
  139.8130524,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_harakomiya',
  '原小宮',
  'はらこみや',
  '{"en":"Harakomiya"}'::jsonb,
  35.7355902,
  139.3010717,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_daikanyama',
  '代官山',
  'だいかんやま',
  '{"en":"Daikanyama"}'::jsonb,
  35.7177308,
  139.3587786,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akishima_jogawaracho',
  '上川原町',
  'じょうがわらちょう',
  '{"en":"Jogawaracho"}'::jsonb,
  35.7080958,
  139.3605992,
  NULL,
  'tokyo',
  'tokyo_akishima',
  'jp',
  '東京都',
  NULL,
  '昭島市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_futabacho',
  '双葉町',
  '双葉町',
  '{"en":"Futabacho"}'::jsonb,
  35.759078,
  139.3352968,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_shinmeidai',
  '神明台',
  '神明台',
  '{"en":"Shinmeidai"}'::jsonb,
  35.7591464,
  139.3254891,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_kawasaki',
  '川崎',
  '川崎',
  '{"en":"Kawasaki"}'::jsonb,
  35.7530437,
  139.3172959,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_tamagawa',
  '玉川',
  '玉川',
  '{"en":"Tamagawa"}'::jsonb,
  35.7522156,
  139.3125854,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_fujimidaira',
  '富士見平',
  '富士見平',
  '{"en":"Fujimidaira"}'::jsonb,
  35.7649691,
  139.3260356,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_gonokami',
  '五ノ神',
  '五ノ神',
  '{"en":"Gonokami"}'::jsonb,
  35.7609839,
  139.3185501,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_midorigaoka',
  '緑ケ丘',
  '緑ケ丘',
  '{"en":"Midorigaoka"}'::jsonb,
  35.7695305,
  139.3182639,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_sakaecho',
  '栄町',
  '栄町',
  '{"en":"Sakaecho"}'::jsonb,
  35.7732992,
  139.3104484,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_ozakudai',
  '小作台',
  '小作台',
  '{"en":"Ozakudai"}'::jsonb,
  35.7768071,
  139.2976199,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_hane_higashi',
  '羽東',
  '羽東',
  '{"en":"Hane higashi"}'::jsonb,
  35.7588352,
  139.3108248,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_hane_naka',
  '羽中',
  '羽中',
  '{"en":"Hane naka"}'::jsonb,
  35.7630848,
  139.3052305,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_hane_kami',
  '羽加美',
  '羽加美',
  '{"en":"Hane kami"}'::jsonb,
  35.7655197,
  139.302638,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_hane_nishi',
  '羽西',
  '羽西',
  '{"en":"Hane nishi"}'::jsonb,
  35.7710174,
  139.2975922,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_musashino',
  'むさし野',
  'むさし野',
  '{"en":"Musashino"}'::jsonb,
  35.7602734,
  139.3394061,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_minamidaira',
  '南平',
  '南平',
  '{"en":"Minamidaira"}'::jsonb,
  35.7667212,
  139.3389608,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_nagaoka',
  '長岡',
  '長岡',
  '{"en":"Nagaoka"}'::jsonb,
  35.7759594,
  139.3284942,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_katsunuma',
  '勝沼',
  'かつぬま',
  '{"en":"Katsunuma"}'::jsonb,
  35.7929395,
  139.2659077,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_nishiwakecho',
  '西分町',
  'にしわけちょう',
  '{"en":"Nishiwakecho"}'::jsonb,
  35.7887,
  139.2648865,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_nakahara',
  '中原',
  '中原',
  '{"en":"Nakahara"}'::jsonb,
  35.7548743,
  139.3614969,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_kishi',
  '岸',
  '岸',
  '{"en":"Kishi"}'::jsonb,
  35.7662687,
  139.3690505,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_mitsugi',
  '三ツ木',
  '三ツ木',
  '{"en":"Mitsugi"}'::jsonb,
  35.7600929,
  139.3743066,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_mitsufuji',
  '三ツ藤',
  '三ツ藤',
  '{"en":"Mitsufuji"}'::jsonb,
  35.7535103,
  139.374484,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_zanbori',
  '残堀',
  '残堀',
  '{"en":"Zanbori"}'::jsonb,
  35.7500658,
  139.3715589,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_inadaira',
  '伊奈平',
  '伊奈平',
  '{"en":"Inadaira"}'::jsonb,
  35.7409989,
  139.3763425,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_enoki',
  '榎',
  '榎',
  '{"en":"Enoki"}'::jsonb,
  35.7425175,
  139.3877619,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_sumida_narihira',
  '業平',
  'なりひら',
  '{"en":"Narihira"}'::jsonb,
  35.7074925,
  139.8132133,
  NULL,
  'tokyo',
  'tokyo_sumida',
  'jp',
  '東京都',
  NULL,
  '墨田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_ominami',
  '大南',
  '大南',
  '{"en":"Ominami"}'::jsonb,
  35.736876,
  139.404362,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_gakuen',
  '学園',
  '学園',
  '{"en":"Gakuen"}'::jsonb,
  35.7460449,
  139.3979928,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_honmachi',
  '本町',
  '本町',
  '{"en":"Honmachi"}'::jsonb,
  35.7580954,
  139.3831382,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_chuo',
  '中央',
  '中央',
  '{"en":"Chuo"}'::jsonb,
  35.7550705,
  139.3924728,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_shinmei',
  '神明',
  '神明',
  '{"en":"Shinmei"}'::jsonb,
  35.7530666,
  139.403175,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_musashimurayama_nakato',
  '中藤',
  '中藤',
  '{"en":"Nakato"}'::jsonb,
  35.7587784,
  139.400732,
  NULL,
  'tokyo',
  'tokyo_musashimurayama',
  'jp',
  '東京都',
  NULL,
  '武蔵村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_tamako',
  '多摩湖',
  '多摩湖',
  '{"en":"Tamako"}'::jsonb,
  35.7631906,
  139.4194491,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_imokubo',
  '芋窪',
  '芋窪',
  '{"en":"Imokubo"}'::jsonb,
  35.7554419,
  139.4121287,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_zoshiki',
  '蔵敷',
  '蔵敷',
  '{"en":"Zoshiki"}'::jsonb,
  35.7508361,
  139.4196783,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_narahashi',
  '奈良橋',
  '奈良橋',
  '{"en":"Narahashi"}'::jsonb,
  35.7530682,
  139.4265755,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_kohan',
  '湖畔',
  '湖畔',
  '{"en":"Kohan"}'::jsonb,
  35.7585147,
  139.4307483,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_takagi',
  '高木',
  '高木',
  '{"en":"Takagi"}'::jsonb,
  35.7512033,
  139.4351495,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_sayama',
  '狭山',
  '狭山',
  '{"en":"Sayama"}'::jsonb,
  35.7539325,
  139.4402477,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_shimizu',
  '清水',
  '清水',
  '{"en":"Shimizu"}'::jsonb,
  35.7510926,
  139.4441365,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_kamikitadai',
  '上北台',
  '上北台',
  '{"en":"Kamikitadai"}'::jsonb,
  35.7424228,
  139.4129955,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_tateno',
  '立野',
  '立野',
  '{"en":"Tateno"}'::jsonb,
  35.7427665,
  139.4199556,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_nangai',
  '南街',
  '南街',
  '{"en":"Nangai"}'::jsonb,
  35.7388607,
  139.4293687,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_nakahara',
  '仲原',
  '仲原',
  '{"en":"Nakahara"}'::jsonb,
  35.7452277,
  139.4400054,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_mukohara',
  '向原',
  '向原',
  '{"en":"Mukohara"}'::jsonb,
  35.7391533,
  139.4400442,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_kiyohara',
  '清原',
  '清原',
  '{"en":"Kiyohara"}'::jsonb,
  35.742755,
  139.4461663,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_shinbori',
  '新堀',
  '新堀',
  '{"en":"Shinbori"}'::jsonb,
  35.7390758,
  139.4485956,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_sakaemachi',
  '栄町',
  '栄町',
  '{"en":"Sakaemachi"}'::jsonb,
  35.6861362,
  139.3865549,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_shinmachi',
  '新町',
  '新町',
  '{"en":"Shinmachi"}'::jsonb,
  35.681353,
  139.3845749,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_hinodai',
  '日野台',
  '日野台',
  '{"en":"Hinodai"}'::jsonb,
  35.6767319,
  139.3804981,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_hino_honcho',
  '日野本町',
  '日野本町',
  '{"en":"Hino honcho"}'::jsonb,
  35.6817306,
  139.4000822,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_osakaue',
  '大坂上',
  '大坂上',
  '{"en":"Osakaue"}'::jsonb,
  35.6751712,
  139.3882444,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_tamadaira',
  '多摩平',
  '多摩平',
  '{"en":"Tamadaira"}'::jsonb,
  35.6676778,
  139.3809912,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_asahigaoka',
  '旭が丘',
  '旭が丘',
  '{"en":"Asahigaoka"}'::jsonb,
  35.6589239,
  139.3684946,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_nishi_hirayama',
  '西平山',
  '西平山',
  '{"en":"Nishi Hirayama"}'::jsonb,
  35.651833,
  139.36365,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_higashi_hirayama',
  '東平山',
  '東平山',
  '{"en":"Higashi Hirayama"}'::jsonb,
  35.6515724,
  139.3752636,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_toyoda',
  '豊田',
  '豊田',
  '{"en":"Toyoda"}'::jsonb,
  35.6569277,
  139.384049,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_higashi_toyoda',
  '東豊田',
  '東豊田',
  '{"en":"Higashi Toyoda"}'::jsonb,
  35.6642148,
  139.3908113,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_shinmei',
  '神明',
  '神明',
  '{"en":"Shinmei"}'::jsonb,
  35.6727872,
  139.3957177,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_manganji',
  '万願寺',
  '万願寺',
  '{"en":"Manganji"}'::jsonb,
  35.6727821,
  139.4149509,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kunitachi_ishida',
  '石田',
  '石田',
  '{"en":"Ishida"}'::jsonb,
  35.6693168,
  139.4216266,
  NULL,
  'tokyo',
  'tokyo_kunitachi',
  'jp',
  '東京都',
  NULL,
  '国立市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_hatagaya',
  '幡ヶ谷',
  'はたがや',
  '{"en":"Hatagaya"}'::jsonb,
  35.677903,
  139.6740463,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_sasazuka',
  '笹塚',
  'ささずか',
  '{"en":"Sasazuka"}'::jsonb,
  35.6748043,
  139.666403,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kunitachi_arai',
  '新井',
  '新井',
  '{"en":"Arai"}'::jsonb,
  35.6656452,
  139.420532,
  NULL,
  'tokyo',
  'tokyo_kunitachi',
  'jp',
  '東京都',
  NULL,
  '国立市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_misawa',
  '三沢',
  '三沢',
  '{"en":"Misawa"}'::jsonb,
  35.6575876,
  139.4202867,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_minamidaira',
  '南平',
  '南平',
  '{"en":"Minamidaira"}'::jsonb,
  35.6585249,
  139.3973141,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_hodokubo',
  '程久保',
  '程久保',
  '{"en":"Hodokubo"}'::jsonb,
  35.6470298,
  139.4047931,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hino_hirayama',
  '平山',
  '平山',
  '{"en":"Hirayama"}'::jsonb,
  35.6466075,
  139.3840968,
  NULL,
  'tokyo',
  'tokyo_hino',
  'jp',
  '東京都',
  NULL,
  '日野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_meguro_ebisu_nishi',
  '猿楽町',
  'えびすにし',
  '{"en":"Ebisu-Nishi"}'::jsonb,
  35.6483517,
  139.7065258,
  NULL,
  'tokyo',
  'tokyo_meguro',
  'jp',
  '東京都',
  NULL,
  '目黒区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shinagawa_yashio',
  '八潮',
  'やしお',
  '{"en":"Yashio"}'::jsonb,
  35.6051145,
  139.761114,
  NULL,
  'tokyo',
  'tokyo_shinagawa',
  'jp',
  '東京都',
  NULL,
  '品川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_tamakocho',
  '多摩湖町',
  '多摩湖町',
  '{"en":"Tamakocho"}'::jsonb,
  35.7644014,
  139.4471862,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashiyamato_meguritacho',
  '廻田町',
  '廻田町',
  '{"en":"Meguritacho"}'::jsonb,
  35.757245,
  139.4506405,
  NULL,
  'tokyo',
  'tokyo_higashiyamato',
  'jp',
  '東京都',
  NULL,
  '東大和市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_suwacho',
  '諏訪町',
  '諏訪町',
  '{"en":"Suwacho"}'::jsonb,
  35.7708311,
  139.4626755,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_noguchicho',
  '野口町',
  '野口町',
  '{"en":"Noguchicho"}'::jsonb,
  35.762467,
  139.4596641,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_misumicho',
  '美住町',
  '美住町',
  '{"en":"Misumicho"}'::jsonb,
  35.7523922,
  139.4602445,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kodaira_fujimicho',
  '富士見町',
  '富士見町',
  '{"en":"Fujimicho"}'::jsonb,
  35.7452033,
  139.4568016,
  NULL,
  'tokyo',
  'tokyo_kodaira',
  'jp',
  '東京都',
  NULL,
  '小平市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kodaira_hagiyamacho',
  '萩山町',
  '萩山町',
  '{"en":"Hagiyamacho"}'::jsonb,
  35.7427904,
  139.4779242,
  NULL,
  'tokyo',
  'tokyo_kodaira',
  'jp',
  '東京都',
  NULL,
  '小平市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_sakaecho',
  '栄町',
  '栄町',
  '{"en":"Sakaecho"}'::jsonb,
  35.7498713,
  139.4704685,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_honcho',
  '本町',
  '本町',
  '{"en":"Honcho"}'::jsonb,
  35.7569349,
  139.4686505,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_aobacho',
  '青葉町',
  '青葉町',
  '{"en":"Aobacho"}'::jsonb,
  35.7646286,
  139.4939256,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_kumegawacho',
  '久米川町',
  '久米川町',
  '{"en":"Kumegawacho"}'::jsonb,
  35.7669458,
  139.4761961,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_akitsucho',
  '秋津町',
  '秋津町',
  '{"en":"Akitsucho"}'::jsonb,
  35.7761229,
  139.4863751,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_noshio',
  '野塩',
  '野塩',
  '{"en":"Noshio"}'::jsonb,
  35.7779861,
  139.5037573,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_umezono',
  '梅園',
  '梅園',
  '{"en":"Umezono"}'::jsonb,
  35.7726234,
  139.5053996,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_takeoka',
  '竹丘',
  '竹丘',
  '{"en":"Takeoka"}'::jsonb,
  35.7665583,
  139.5065592,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_matsuyama',
  '松山',
  '松山',
  '{"en":"Matsuyama"}'::jsonb,
  35.7702957,
  139.5154526,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_motomachi',
  '元町',
  '元町',
  '{"en":"Motomachi"}'::jsonb,
  35.7752954,
  139.5164465,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_nakazato',
  '中里',
  '中里',
  '{"en":"Nakazato"}'::jsonb,
  35.7852795,
  139.5208651,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_shitajuku',
  '下宿',
  '下宿',
  '{"en":"Shitajuku"}'::jsonb,
  35.8008246,
  139.5380832,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_asahigaoka',
  '旭が丘',
  'あさひがおか',
  '{"en":"Asahigaoka"}'::jsonb,
  35.7978331,
  139.540496,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_toshima_nishi_waseda',
  '西早稲田',
  'にしわせだ',
  '{"en":"Nishi-Waseda"}'::jsonb,
  35.7101584,
  139.7153878,
  NULL,
  'tokyo',
  'tokyo_toshima',
  'jp',
  '東京都',
  NULL,
  '豊島区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_kaigan',
  '海岸',
  'かいがん',
  '{"en":"Kaigan"}'::jsonb,
  35.6452654,
  139.7573804,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_kami_kiyoto',
  '上清戸',
  '上清戸',
  '{"en":"Kami-kiyoto"}'::jsonb,
  35.7774033,
  139.5228832,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_naka_kiyoto',
  '中清戸',
  '中清戸',
  '{"en":"Naka kiyoto"}'::jsonb,
  35.7801154,
  139.5306711,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_shimo_kiyoto',
  '下清戸',
  '下清戸',
  '{"en":"Shimo kiyoto"}'::jsonb,
  35.7849597,
  139.5383064,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_uenohara',
  '上の原',
  '上の原',
  '{"en":"Uenohara"}'::jsonb,
  35.7711677,
  139.5441242,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_shinhocho',
  '神宝町',
  '神宝町',
  '{"en":"Shinhocho"}'::jsonb,
  35.7664816,
  139.5452056,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_kanayamacho',
  '金山町',
  '金山町',
  '{"en":"Kanayamacho"}'::jsonb,
  35.7681783,
  139.5384087,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_hikawadai',
  '氷川台',
  '氷川台',
  '{"en":"Hikawadai"}'::jsonb,
  35.7670333,
  139.5315074,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_kiyose_daimoncho',
  '大門町',
  '大門町',
  '{"en":"Daimoncho"}'::jsonb,
  35.764213,
  139.5397248,
  NULL,
  'tokyo',
  'tokyo_kiyose',
  'jp',
  '東京都',
  NULL,
  '清瀬市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_shinkawamachi',
  '新川町',
  '新川町',
  '{"en":"Shinkawamachi"}'::jsonb,
  35.7610859,
  139.5385238,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_sengencho',
  '浅間町',
  '浅間町',
  '{"en":"Sengencho"}'::jsonb,
  35.7575538,
  139.5422712,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_daiba',
  '台場',
  'だいば',
  '{"en":"Daiba"}'::jsonb,
  35.6333245,
  139.7708923,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_koyama',
  '小山',
  '小山',
  '{"en":"Koyama"}'::jsonb,
  35.7655272,
  139.5229312,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_saiwaicho',
  '幸町',
  '幸町',
  '{"en":"Saiwaicho"}'::jsonb,
  35.760126,
  139.5210536,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_chuocho',
  '中央町',
  '中央町',
  '{"en":"Chuocho"}'::jsonb,
  35.7528326,
  139.5198539,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_gakuencho',
  '学園町',
  '学園町',
  '{"en":"Gakuencho"}'::jsonb,
  35.7525935,
  139.5368249,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_chiyoda_kanda_misakich',
  '神田三崎町',
  'かんだみさきちょう',
  '{"en":"Kanda-Misakichō"}'::jsonb,
  35.700896,
  139.7540135,
  NULL,
  'tokyo',
  'tokyo_chiyoda',
  'jp',
  '東京都',
  NULL,
  '千代田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_bunkyo_iidabashi',
  '飯田橋',
  'いいだばし',
  '{"en":"Iidabashi"}'::jsonb,
  35.700781,
  139.7486156,
  NULL,
  'tokyo',
  'tokyo_bunkyo',
  'jp',
  '東京都',
  NULL,
  '文京区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_minamicho',
  '南町',
  '南町',
  '{"en":"Minamicho"}'::jsonb,
  35.7403141,
  139.5249295,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_maesawa',
  '前沢',
  '前沢',
  '{"en":"Maesawa"}'::jsonb,
  35.7433534,
  139.513935,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_takiyama',
  '滝山',
  '滝山',
  '{"en":"Takiyama"}'::jsonb,
  35.7464648,
  139.503856,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_yayoi',
  '弥生',
  '弥生',
  '{"en":"Yayoi"}'::jsonb,
  35.7369022,
  139.5053374,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_hachimancho',
  '八幡町',
  '八幡町',
  '{"en":"Hachimancho"}'::jsonb,
  35.7533516,
  139.5123854,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_nobidome',
  '野火止',
  '野火止',
  '{"en":"Nobidome"}'::jsonb,
  35.7615159,
  139.5106,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashikurume_shimosato',
  '下里',
  '下里',
  '{"en":"Shimosato"}'::jsonb,
  35.7558852,
  139.5026727,
  NULL,
  'tokyo',
  'tokyo_higashikurume',
  'jp',
  '東京都',
  NULL,
  '東久留米市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_higashimurayama_yanagikubo',
  '柳窪',
  '柳窪',
  '{"en":"Yanagikubo"}'::jsonb,
  35.7472115,
  139.492107,
  NULL,
  'tokyo',
  'tokyo_higashimurayama',
  'jp',
  '東京都',
  NULL,
  '東村山市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_minato_tamachi',
  '田町',
  '田町',
  '{"en":"Tamachi"}'::jsonb,
  35.6455451,
  139.7485367,
  NULL,
  'tokyo',
  'tokyo_minato',
  'jp',
  '東京都',
  NULL,
  '港区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_izu_islands',
  '伊豆諸島',
  '伊豆諸島',
  '{"en":"Izu Islands"}'::jsonb,
  31.9999272,
  139.9992275,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_yoshino_baigo',
  '吉野梅郷',
  '吉野梅郷',
  '{"en":"Yoshino Baigo"}'::jsonb,
  35.7854075,
  139.2209435,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_iwakura_onsen_kyo',
  '岩蔵温泉郷',
  '岩蔵温泉郷',
  '{"en":"Iwakura Onsen-kyo"}'::jsonb,
  35.8255643,
  139.2904807,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_fudeshima',
  '筆島',
  '筆島',
  '{"en":"Fudeshima"}'::jsonb,
  34.7063929,
  139.4451299,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_toushiki_no_hana',
  'トウシキの鼻',
  'トウシキの鼻',
  '{"en":"Toushiki no hana"}'::jsonb,
  34.678789,
  139.4306663,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_龍王崎',
  '龍王崎',
  '龍王崎',
  NULL,
  34.6854407,
  139.4437289,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kakihara_iso',
  'カキハラ磯',
  'カキハラ磯',
  '{"en":"Kakihara iso"}'::jsonb,
  34.6996977,
  139.4485392,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_千波崎',
  '千波崎',
  '千波崎',
  NULL,
  34.7020491,
  139.3589327,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ryunokuchi',
  '龍の口',
  '龍の口',
  '{"en":"Ryunokuchi"}'::jsonb,
  34.7209793,
  139.3525821,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ounohama',
  '王の浜',
  '王の浜',
  '{"en":"Ounohama"}'::jsonb,
  34.7260854,
  139.3530423,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_前浜',
  '前浜',
  '前浜',
  NULL,
  34.7327955,
  139.3551248,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_kohohama',
  '弘法浜',
  '弘法浜',
  '{"en":"Kohohama"}'::jsonb,
  34.7459228,
  139.353773,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_yunohama',
  '湯の浜',
  '湯の浜',
  '{"en":"Yunohama"}'::jsonb,
  34.7436025,
  139.356085,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_nagane',
  '長根',
  '長根',
  '{"en":"Nagane"}'::jsonb,
  34.7557829,
  139.3502325,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_泉浜',
  '泉浜',
  '泉浜',
  NULL,
  34.7694839,
  139.3520563,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_akappage',
  '赤禿',
  '赤禿',
  '{"en":"Akappage"}'::jsonb,
  34.7749652,
  139.3495785,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_万立',
  '万立',
  '万立',
  NULL,
  34.7844082,
  139.3526354,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_乳が崎',
  '乳が崎',
  '乳が崎',
  NULL,
  34.7987638,
  139.3609994,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_野田浜',
  '野田浜',
  '野田浜',
  NULL,
  34.7970907,
  139.3609329,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_碁石浜',
  '碁石浜',
  '碁石浜',
  NULL,
  34.7965486,
  139.3663527,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_小口崎',
  '小口崎',
  '小口崎',
  NULL,
  34.7937692,
  139.3801986,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_風早崎',
  '風早崎',
  '風早崎',
  NULL,
  34.7980158,
  139.3719374,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_万根崎',
  '万根崎',
  '万根崎',
  NULL,
  34.7866851,
  139.4126426,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_松崎',
  '松崎',
  '松崎',
  NULL,
  34.7813981,
  139.4222557,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_潮吹',
  '潮吹',
  '潮吹',
  NULL,
  34.781169,
  139.4210755,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_gyoja_hama_gyoja_beach',
  '行者浜',
  '行者浜',
  '{"en":"Gyoja hama (Gyoja beach)"}'::jsonb,
  34.7542705,
  139.4404915,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_nagane_misaki_nagane_cape',
  '長根岬',
  '長根岬',
  '{"en":"Nagane misaki (Nagane cape)"}'::jsonb,
  34.7403982,
  139.4489749,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_黒崎',
  '黒崎',
  '黒崎',
  NULL,
  34.7154063,
  139.4492247,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_okuyamasabaku_okuyama_desert',
  '奥山砂漠',
  '奥山砂漠',
  '{"en":"Okuyamasabaku (Okuyama desert)"}'::jsonb,
  34.7443587,
  139.4276561,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_惣兵衛越し',
  '惣兵衛越し',
  '惣兵衛越し',
  NULL,
  34.7487316,
  139.3536909,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_サンカク',
  'サンカク',
  'サンカク',
  NULL,
  34.7447974,
  139.3541263,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_為朝の刀研ぎ場',
  '為朝の刀研ぎ場',
  '為朝の刀研ぎ場',
  NULL,
  34.7425558,
  139.3575973,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hachioji_ひよどり沢',
  'ひよどり沢',
  'ひよどり沢',
  NULL,
  35.6739993,
  139.339559,
  NULL,
  'tokyo',
  'tokyo_hachioji',
  'jp',
  '東京都',
  NULL,
  '八王子市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hachioji_くぬぎ平',
  'くぬぎ平',
  'くぬぎ平',
  NULL,
  35.6722713,
  139.3418311,
  NULL,
  'tokyo',
  'tokyo_hachioji',
  'jp',
  '東京都',
  NULL,
  '八王子市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hachioji_みずき平',
  'みずき平',
  'みずき平',
  NULL,
  35.6736309,
  139.341123,
  NULL,
  'tokyo',
  'tokyo_hachioji',
  'jp',
  '東京都',
  NULL,
  '八王子市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hachioji_ひよどり山',
  'ひよどり山',
  'ひよどり山',
  NULL,
  35.6755705,
  139.3424731,
  NULL,
  'tokyo',
  'tokyo_hachioji',
  'jp',
  '東京都',
  NULL,
  '八王子市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hachioji_水源涵養林',
  '水源涵養林',
  '水源涵養林',
  NULL,
  35.6744613,
  139.3388885,
  NULL,
  'tokyo',
  'tokyo_hachioji',
  'jp',
  '東京都',
  NULL,
  '八王子市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_草堂ノ入',
  '草堂ノ入',
  '草堂ノ入',
  NULL,
  35.7341494,
  139.2396981,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_中央湿地',
  '中央湿地',
  '中央湿地',
  NULL,
  35.7354965,
  139.2417527,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_富田ノ入',
  '富田ノ入',
  '富田ノ入',
  NULL,
  35.7352309,
  139.2393177,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_下ノ川',
  '下ノ川',
  '下ノ川',
  NULL,
  35.7357852,
  139.2438581,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_宮田西沢',
  '宮田西沢',
  '宮田西沢',
  NULL,
  35.7367723,
  139.2409265,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_宮田東沢',
  '宮田東沢',
  '宮田東沢',
  NULL,
  35.7365437,
  139.2419243,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_akiruno_荒田ノ入',
  '荒田ノ入',
  '荒田ノ入',
  NULL,
  35.7370771,
  139.2396074,
  NULL,
  'tokyo',
  'tokyo_akiruno',
  'jp',
  '東京都',
  NULL,
  'あきる野市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_hatonosu_valley',
  '鳩ノ巣渓谷',
  '鳩ノ巣渓谷',
  '{"en":"Hatonosu Valley"}'::jsonb,
  35.8131774,
  139.1291762,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_arakawa_imosaka',
  '芋坂',
  '芋坂',
  '{"en":"Imosaka"}'::jsonb,
  35.7266876,
  139.7735296,
  NULL,
  'tokyo',
  'tokyo_arakawa',
  'jp',
  '東京都',
  NULL,
  '荒川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_大字五ノ神字武蔵野',
  '大字五ノ神字武蔵野',
  '大字五ノ神字武蔵野',
  NULL,
  35.769146,
  139.3303125,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_fussa_oaza_kawasaki_aza_musashino',
  '大字川崎字武蔵野',
  '大字川崎字武蔵野',
  '{"en":"Oaza Kawasaki-aza Musashino"}'::jsonb,
  35.7625232,
  139.3345781,
  NULL,
  'tokyo',
  'tokyo_fussa',
  'jp',
  '東京都',
  NULL,
  '福生市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_大字羽字武蔵野',
  '大字羽字武蔵野',
  '大字羽字武蔵野',
  NULL,
  35.7668401,
  139.3309346,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_大字羽字玉川附',
  '大字羽字玉川附',
  '大字羽字玉川附',
  NULL,
  35.7551111,
  139.3029956,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_hamura_大字羽字羽ケ上',
  '大字羽字羽ケ上',
  '大字羽字羽ケ上',
  NULL,
  35.7689124,
  139.3057722,
  NULL,
  'tokyo',
  'tokyo_hamura',
  'jp',
  '東京都',
  NULL,
  '羽村市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_地鉈温泉',
  '地鉈温泉',
  '地鉈温泉',
  NULL,
  34.3178786,
  139.2160101,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ome_mitake_gorge',
  '御岳渓谷',
  '御岳渓谷',
  '{"en":"Mitake Gorge"}'::jsonb,
  35.8009016,
  139.1848433,
  NULL,
  'tokyo',
  'tokyo_ome',
  'jp',
  '東京都',
  NULL,
  '青梅市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_大千代港',
  '大千代港',
  '大千代港',
  NULL,
  32.4572392,
  139.7812589,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_大名子',
  '大名子',
  '大名子',
  NULL,
  32.4619321,
  139.7774544,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_三宝港',
  '三宝港',
  '三宝港',
  NULL,
  32.4467665,
  139.7589463,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_式根島港',
  '式根島港',
  '式根島港',
  NULL,
  34.3196482,
  139.2184653,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_袴ヶ崎',
  '袴ヶ崎',
  '袴ヶ崎',
  NULL,
  34.3294846,
  139.2007031,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_足付温泉',
  '足付温泉',
  '足付温泉',
  NULL,
  34.3198614,
  139.2175764,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_コシダ崩れ',
  'コシダ崩れ',
  'コシダ崩れ',
  NULL,
  34.5121165,
  139.2716934,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ツムギ根',
  'ツムギ根',
  'ツムギ根',
  NULL,
  34.5319643,
  139.2847376,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ナズカタ',
  'ナズカタ',
  'ナズカタ',
  NULL,
  34.5197251,
  139.2900012,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_亀石',
  '亀石',
  '亀石',
  NULL,
  34.5171156,
  139.2683757,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_利島港',
  '利島港',
  '利島港',
  NULL,
  34.5323982,
  139.2810088,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_大根',
  '大根',
  '大根',
  NULL,
  34.5305849,
  139.2720572,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_橋',
  '橋',
  '橋',
  NULL,
  34.5285706,
  139.2904128,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_大和田',
  '大和田',
  '大和田',
  NULL,
  34.3755434,
  139.2243463,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_里',
  '里',
  '里',
  NULL,
  33.8950581,
  139.5941242,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_新澪池跡',
  '新澪池跡',
  '新澪池跡',
  NULL,
  34.0506576,
  139.5024097,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_ミノワ',
  'ミノワ',
  'ミノワ',
  NULL,
  34.1173245,
  139.5492069,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_六双根',
  '六双根',
  '六双根',
  NULL,
  34.0907722,
  139.4823703,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_湯ノ浜',
  '湯ノ浜',
  '湯ノ浜',
  NULL,
  34.1246277,
  139.5339853,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_赤場暁',
  '赤場暁',
  '赤場暁',
  NULL,
  34.1052038,
  139.5602361,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_senryo_pond',
  '千両池',
  'せんりょういけ',
  '{"en":"Senryo Pond"}'::jsonb,
  34.1896899,
  139.1210909,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_神木島',
  '神木島',
  'かんきじま',
  NULL,
  34.2086491,
  139.1309238,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_アジア磯',
  'アジア磯',
  'アジア磯',
  NULL,
  34.4060931,
  139.2621067,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_高根',
  '高根',
  '高根',
  NULL,
  34.3965282,
  139.2550471,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_湯の浜漁港',
  '湯の浜漁港',
  '湯の浜漁港',
  NULL,
  34.1240286,
  139.5314054,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_gihei_rock',
  '儀兵岩',
  'ぎへい いわ',
  '{"en":"Gihei Rock"}'::jsonb,
  27.1003084,
  142.1816202,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_futami_rock',
  '二見岩',
  'ふたみ いわ',
  '{"en":"Futami Rock"}'::jsonb,
  27.0954484,
  142.1995631,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_宮之浜',
  '宮之浜',
  '宮之浜',
  NULL,
  27.1035619,
  142.1944341,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_屏風谷',
  '屏風谷',
  '屏風谷',
  NULL,
  27.0928581,
  142.205925,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_釣浜',
  '釣浜',
  '釣浜',
  NULL,
  27.1036527,
  142.2050476,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_ウグイス浜',
  'ウグイス浜',
  'ウグイス浜',
  NULL,
  27.1248834,
  142.190955,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_二俣岬',
  '二俣岬',
  '二俣岬',
  NULL,
  27.1440686,
  142.1914913,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_兄島瀬戸',
  '兄島瀬戸',
  '兄島瀬戸',
  NULL,
  27.1078637,
  142.2021076,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_吐出鼻',
  '吐出鼻',
  '吐出鼻',
  NULL,
  27.1099361,
  142.2009462,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_家内見崎',
  '家内見崎',
  '家内見崎',
  NULL,
  27.1100253,
  142.2355895,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_弟島瀬戸',
  '弟島瀬戸',
  '弟島瀬戸',
  NULL,
  27.1441975,
  142.189654,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_挙崎',
  '挙崎',
  '挙崎',
  NULL,
  27.1324109,
  142.2194855,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_滝之浦',
  '滝之浦',
  '滝之浦',
  NULL,
  27.117595,
  142.2058976,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_立神崎',
  '立神崎',
  '立神崎',
  NULL,
  27.1304153,
  142.1871407,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_筋岩岬',
  '筋岩岬',
  '筋岩岬',
  NULL,
  27.1218349,
  142.1872589,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_神湊漁港',
  '神湊漁港',
  '神湊漁港',
  NULL,
  33.1314054,
  139.8057692,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_大平潟',
  '大平潟',
  '大平潟',
  NULL,
  33.1303756,
  139.815106,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_神湊 (底土) 港',
  '神湊 (底土) 港',
  '神湊 (底土) 港',
  NULL,
  33.1214624,
  139.8190113,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_ウロウ根',
  'ウロウ根',
  'ウロウ根',
  NULL,
  33.0673685,
  139.8425586,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_エイガ浦',
  'エイガ浦',
  'エイガ浦',
  NULL,
  33.1335001,
  139.7379994,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_オアサ根',
  'オアサ根',
  'オアサ根',
  NULL,
  33.1544804,
  139.7780756,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_ナズマド',
  'ナズマド',
  'ナズマド',
  NULL,
  33.1449992,
  139.7393995,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_乙千代ケ浜',
  '乙千代ケ浜',
  '乙千代ケ浜',
  NULL,
  33.0655658,
  139.7941347,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_亀トド',
  '亀トド',
  '亀トド',
  NULL,
  33.0561829,
  139.8215321,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_八重根港',
  '八重根港',
  '八重根港',
  NULL,
  33.0978745,
  139.7696951,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_八重根漁港',
  '八重根漁港',
  '八重根漁港',
  NULL,
  33.0998878,
  139.7777417,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_南原千畳敷',
  '南原千畳敷',
  '南原千畳敷',
  NULL,
  33.1061295,
  139.7541704,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_大ヶ根',
  '大ヶ根',
  '大ヶ根',
  NULL,
  33.0842544,
  139.8603054,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_屋けんケ浜',
  '屋けんケ浜',
  '屋けんケ浜',
  NULL,
  33.1007191,
  139.7696226,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_火潟',
  '火潟',
  '火潟',
  NULL,
  33.1401078,
  139.7378519,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_白ママ',
  '白ママ',
  '白ママ',
  NULL,
  33.1106657,
  139.8492413,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_赤崎',
  '赤崎',
  '赤崎',
  NULL,
  33.1576129,
  139.7745257,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_鮫切',
  '鮫切',
  '鮫切',
  NULL,
  33.1583023,
  139.7565415,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_初寝崎',
  '初寝崎',
  '初寝崎',
  NULL,
  30.4835391,
  140.2867748,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_小島',
  '小島',
  '小島',
  NULL,
  30.4852634,
  140.2866849,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_四本岩',
  '四本岩',
  '四本岩',
  NULL,
  26.6478574,
  142.1435602,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_大瀬戸',
  '大瀬戸',
  '大瀬戸',
  NULL,
  26.6067698,
  142.1777235,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_母島漁港',
  '母島漁港',
  '母島漁港',
  NULL,
  26.6930281,
  142.147432,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_沖ノ浅根',
  '沖ノ浅根',
  'おきの あさね',
  NULL,
  26.6303365,
  142.1567902,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_西浦',
  '西浦',
  'にしうら',
  NULL,
  26.6536563,
  142.14911,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_針ノ岩',
  '針ノ岩',
  '針ノ岩',
  NULL,
  26.6807676,
  142.1623263,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_伊ヶ谷漁港',
  '伊ヶ谷漁港',
  '伊ヶ谷漁港',
  NULL,
  34.1008528,
  139.4886399,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_阿古漁港',
  '阿古漁港',
  '阿古漁港',
  NULL,
  34.066655,
  139.4804182,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_松が下雅湯',
  '松が下雅湯',
  '松が下雅湯',
  NULL,
  34.3205906,
  139.2182186,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_唐人津城',
  '唐人津城',
  '唐人津城',
  NULL,
  34.3211407,
  139.1960987,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_隈の井',
  '隈の井',
  '隈の井',
  NULL,
  34.3180793,
  139.1985154,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_小浜漁港',
  '小浜漁港',
  '小浜漁港',
  NULL,
  34.330453,
  139.2228967,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_三原山',
  '三原山',
  '三原山',
  NULL,
  33.0942561,
  139.8134708,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_八丈富士',
  '八丈富士',
  '八丈富士',
  NULL,
  33.1388089,
  139.7644615,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_edogawa_Taka Bureau Board',
  'Taka Bureau Board',
  'Taka Bureau Board',
  NULL,
  24.2956006,
  153.9837112,
  NULL,
  'tokyo',
  'tokyo_edogawa',
  'jp',
  '東京都',
  NULL,
  '江戸川区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_鎧端',
  '鎧端',
  '鎧端',
  NULL,
  34.7428468,
  139.3875789,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_滑台',
  '滑台',
  '滑台',
  NULL,
  34.7206978,
  139.385004,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_鏡端',
  '鏡端',
  '鏡端',
  NULL,
  34.7322668,
  139.3798542,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_harajuku',
  '原宿',
  '原宿',
  '{"en":"Harajuku"}'::jsonb,
  35.6687049,
  139.7053357,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_takasagodai',
  '高砂台',
  '高砂台',
  '{"en":"Takasagodai"}'::jsonb,
  24.7626474,
  141.3011271,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_chidorigahara',
  '千鳥ヶ原',
  '千鳥ヶ原',
  '{"en":"Chidorigahara"}'::jsonb,
  24.7606404,
  141.2946469,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_鶯',
  '鶯',
  '鶯',
  NULL,
  24.7703765,
  141.2992549,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_azuma',
  '東',
  '東',
  '{"en":"Azuma"}'::jsonb,
  24.7811559,
  141.3392856,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_玉名山',
  '玉名山',
  '玉名山',
  NULL,
  24.784939,
  141.3323157,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_kong_iwa',
  '金剛岩',
  '金剛岩',
  '{"en":"Kongō iwa"}'::jsonb,
  24.7928739,
  141.3431774,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_古山',
  '古山',
  '古山',
  NULL,
  24.7956294,
  141.3328731,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_東山',
  '東山',
  '東山',
  NULL,
  24.7924363,
  141.334762,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_三軒家',
  '三軒家',
  '三軒家',
  NULL,
  24.7969447,
  141.3174895,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_元山',
  '元山',
  '元山',
  NULL,
  24.7868805,
  141.3217443,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_aso_dai',
  '阿蘇台',
  '阿蘇台',
  '{"en":"Aso-dai"}'::jsonb,
  24.7848029,
  141.3026265,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_西',
  '西',
  '西',
  NULL,
  24.7973444,
  141.3086689,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_漂流木',
  '漂流木',
  '漂流木',
  NULL,
  24.803489,
  141.3168892,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_北',
  '北',
  '北',
  NULL,
  24.8024207,
  141.3216526,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_南',
  '南',
  '南',
  NULL,
  24.7777526,
  141.3234961,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_霧島',
  '霧島',
  '霧島',
  NULL,
  24.7931954,
  141.3081295,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_漂流木海岸',
  '漂流木海岸',
  '漂流木海岸',
  NULL,
  24.801637,
  141.3092999,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_石野',
  '石野村',
  '石野村',
  NULL,
  25.4375895,
  141.2919707,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_姪島瀬戸',
  '姪島瀬戸',
  '姪島瀬戸',
  NULL,
  26.5640804,
  142.2226453,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_北浦',
  '北浦',
  '北浦',
  NULL,
  26.5617066,
  142.1575281,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_姉島瀬戸',
  '姉島瀬戸',
  '姉島瀬戸',
  NULL,
  26.5675251,
  142.148247,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_丸島瀬戸',
  '丸島瀬戸',
  '丸島瀬戸',
  NULL,
  26.5968797,
  142.1720342,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_向島瀬戸',
  '向島瀬戸',
  '向島瀬戸',
  NULL,
  26.5913292,
  142.1359336,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_安井海岸',
  '安井海岸',
  '安井海岸',
  NULL,
  26.6067558,
  142.1333246,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_石浜',
  '石浜',
  '石浜',
  NULL,
  26.6035403,
  142.1348621,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_コペペ浜',
  'コペペ浜',
  'コペペ浜',
  NULL,
  26.5998382,
  142.1278163,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_shibuya_hyakkendana',
  '渋谷百軒店',
  'しぶやひゃっけんだな',
  '{"en":"Hyakkendana"}'::jsonb,
  35.6589174,
  139.6964855,
  NULL,
  'tokyo',
  'tokyo_shibuya',
  'jp',
  '東京都',
  NULL,
  '渋谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_大黒根海岸',
  '大黒根海岸',
  '大黒根海岸',
  NULL,
  34.2430049,
  139.1397428,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_水がしり海岸',
  '水がしり海岸',
  '水がしり海岸',
  NULL,
  34.2421446,
  139.1386056,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_沢尻海岸',
  '沢尻海岸',
  '沢尻海岸',
  NULL,
  34.2175823,
  139.1339225,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_小浜',
  '小浜',
  '小浜',
  NULL,
  34.2235351,
  139.134534,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_うらん根海岸',
  'うらん根海岸',
  'うらん根海岸',
  NULL,
  34.2319179,
  139.1354728,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_たたみが鼻',
  'たたみが鼻',
  'たたみが鼻',
  NULL,
  34.2349869,
  139.1344428,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_おおだちの入り江',
  'おおだちの入り江',
  'おおだちの入り江',
  NULL,
  34.2365923,
  139.1353011,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_setagaya_shimokitazawa',
  '下北沢',
  'しもきたざわ',
  '{"en":"Shimokitazawa"}'::jsonb,
  35.6616779,
  139.6663345,
  NULL,
  'tokyo',
  'tokyo_setagaya',
  'jp',
  '東京都',
  NULL,
  '世田谷区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_そよぎの丘',
  'そよぎの丘',
  'そよぎの丘',
  NULL,
  35.7025005,
  139.4074903,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_小さな池の間',
  '小さな池の間',
  '小さな池の間',
  NULL,
  35.7041471,
  139.4081227,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_シンボルツリーの間',
  'シンボルツリーの間',
  'シンボルツリーの間',
  NULL,
  35.7040551,
  139.4079316,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_エクボの間',
  'エクボの間',
  'エクボの間',
  NULL,
  35.7038438,
  139.407898,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_実りの間',
  '実りの間',
  '実りの間',
  NULL,
  35.7035481,
  139.407898,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_小さな丘の間',
  '小さな丘の間',
  '小さな丘の間',
  NULL,
  35.7034136,
  139.4079544,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_花と香りの間',
  '花と香りの間',
  '花と香りの間',
  NULL,
  35.7034125,
  139.4078082,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_大広間',
  '大広間',
  '大広間',
  NULL,
  35.7033173,
  139.4079296,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_tachikawa_エントランス(出会いの間)',
  'エントランス(出会いの間)',
  'エントランス(出会いの間)',
  NULL,
  35.7029587,
  139.4079299,
  NULL,
  'tokyo',
  'tokyo_tachikawa',
  'jp',
  '東京都',
  NULL,
  '立川市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_horaine_coast',
  '蓬莱根海岸',
  'ほうらい ね かいがん',
  '{"en":"Horaine coast"}'::jsonb,
  26.6154405,
  142.1782619,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_四ッ海岸',
  '四ッ海岸',
  '四ッ海岸',
  NULL,
  26.6215024,
  142.1763843,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_1945_us_military_landing_nitonehama',
  '二ッ根浜',
  '二ッ根浜',
  '{"en":"1945 US military landing Nitonehama"}'::jsonb,
  24.75588,
  141.3013586,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_tamehachi_coast',
  '為八海岸',
  '為八海岸',
  '{"en":"Tamehachi coast"}'::jsonb,
  24.8083477,
  141.3215495,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_ota_fuel_tanks',
  'ジェット燃料タンク',
  'ジェット燃料タンク',
  '{"en":"Fuel tanks"}'::jsonb,
  24.7848047,
  141.3042864,
  NULL,
  'tokyo',
  'tokyo_ota',
  'jp',
  '東京都',
  NULL,
  '大田区',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_坪田漁港',
  '坪田漁港',
  '坪田漁港',
  NULL,
  34.0572216,
  139.5442817,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)
VALUES (
  'tokyo_machida_大久保漁港',
  '大久保漁港',
  '大久保漁港',
  NULL,
  34.1221702,
  139.508442,
  NULL,
  'tokyo',
  'tokyo_machida',
  'jp',
  '東京都',
  NULL,
  '町田市',
  NULL
);

-- トランザクションコミット
COMMIT;

-- 完了: cities 52件, machi 1039件を挿入