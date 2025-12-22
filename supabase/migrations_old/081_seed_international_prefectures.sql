-- ===============================
-- 各国の都道府県/州データを挿入
-- ===============================

-- アメリカの都道府県/州
INSERT INTO prefectures (id, name, name_en, name_kana, region_id, latitude, longitude) VALUES
  ('us_ar', 'アーカンソー州', 'Arkansas', '', 'us_south', 34.75037, -92.50044),
  ('us_dc', 'コロンビア特別区', 'District of Columbia', '', 'us_south', 38.91706, -77.00025),
  ('us_de', 'デラウェア州', 'Delaware', '', 'us_south', 39.00039, -75.49992),
  ('us_fl', 'フロリダ州', 'Florida', '', 'us_south', 28.75054, -82.5001),
  ('us_ga', 'ジョージア州', 'Georgia', '', 'us_south', 32.75042, -83.50018),
  ('us_ks', 'カンザス州', 'Kansas', '', 'us_midwest', 38.50029, -98.50063),
  ('us_la', 'ルイジアナ州', 'Louisiana', '', 'us_south', 31.00047, -92.0004),
  ('us_md', 'メリーランド州', 'Maryland', '', 'us_south', 39.00039, -76.74997),
  ('us_mo', 'ミズーリ州', 'Missouri', '', 'us_midwest', 38.25031, -92.50046),
  ('us_ms', 'ミシシッピ州', 'Mississippi', '', 'us_south', 32.75041, -89.75036),
  ('us_nc', 'ノースカロライナ州', 'North Carolina', '', 'us_south', 35.50069, -80.00032),
  ('us_ok', 'オクラホマ州', 'Oklahoma', '', 'us_south', 35.49209, -97.50328),
  ('us_sc', 'サウスカロライナ州', 'South Carolina', '', 'us_south', 34.00043, -81.00009),
  ('us_tn', 'テネシー州', 'Tennessee', '', 'us_south', 35.75035, -86.25027),
  ('us_tx', 'テキサス州', 'Texas', '', 'us_south', 31.25044, -99.25061),
  ('us_wv', 'ウェストバージニア州', 'West Virginia', '', 'us_south', 38.50038, -80.50009),
  ('us_al', 'アラバマ州', 'Alabama', '', 'us_south', 32.75041, -86.75026),
  ('us_ct', 'コネチカット州', 'Connecticut', '', 'us_northeast', 41.66704, -72.66648),
  ('us_ia', 'アイオワ州', 'Iowa', '', 'us_midwest', 42.00027, -93.50049),
  ('us_il', 'イリノイ州', 'Illinois', '', 'us_midwest', 40.00032, -89.25037),
  ('us_in', 'インディアナ州', 'Indiana', '', 'us_midwest', 40.00032, -86.25027),
  ('us_me', 'メイン州', 'Maine', '', 'us_northeast', 45.50032, -69.24977),
  ('us_mi', 'ミシガン州', 'Michigan', '', 'us_midwest', 44.25029, -85.50033),
  ('us_mn', 'ミネソタ州', 'Minnesota', '', 'us_midwest', 46.25024, -94.25055),
  ('us_ne', 'ネブラスカ州', 'Nebraska', '', 'us_midwest', 41.50028, -99.75067),
  ('us_nh', 'ニューハンプシャー州', 'New Hampshire', '', 'us_northeast', 43.66702, -71.4998),
  ('us_nj', 'ニュージャージー州', 'New Jersey', '', 'us_northeast', 40.16706, -74.49987),
  ('us_ny', 'ニューヨーク州', 'New York', '', 'us_northeast', 43.00035, -75.4999),
  ('us_oh', 'オハイオ州', 'Ohio', '', 'us_midwest', 40.25034, -83.00018),
  ('us_ri', 'ロードアイランド州', 'Rhode Island', '', 'us_northeast', 41.75038, -71.49978),
  ('us_vt', 'バーモント州', 'Vermont', '', 'us_northeast', 44.00034, -72.74983),
  ('us_wi', 'ウィスコンシン州', 'Wisconsin', '', 'us_midwest', 44.50024, -90.00041),
  ('us_ca', 'カリフォルニア州', 'California', '', 'us_west', 37.25022, -119.75126),
  ('us_co', 'コロラド州', 'Colorado', '', 'us_west', 39.00027, -105.50083),
  ('us_nm', 'ニューメキシコ州', 'New Mexico', '', 'us_west', 34.50034, -106.00085),
  ('us_nv', 'ネバダ州', 'Nevada', '', 'us_west', 39.25021, -116.75119),
  ('us_ut', 'ユタ州', 'Utah', '', 'us_west', 39.25024, -111.75103),
  ('us_az', 'アリゾナ州', 'Arizona', '', 'us_west', 34.5003, -111.50098),
  ('us_id', 'アイダホ州', 'Idaho', '', 'us_west', 44.5002, -114.25118),
  ('us_mt', 'モンタナ州', 'Montana', '', 'us_west', 47.00025, -109.75102),
  ('us_nd', 'ノースダコタ州', 'North Dakota', '', 'us_midwest', 47.50027, -100.00068),
  ('us_or', 'オレゴン州', 'Oregon', '', 'us_west', 44.00013, -120.50139),
  ('us_sd', 'サウスダコタ州', 'South Dakota', '', 'us_midwest', 44.50026, -100.25069),
  ('us_wa', 'ワシントン州', 'Washington', '', 'us_west', 47.50012, -120.50147),
  ('us_wy', 'ワイオミング州', 'Wyoming', '', 'us_west', 43.00024, -107.5009),
  ('us_hi', 'ハワイ州', 'Hawaii', '', 'us_west', 20.78785, -156.38612),
  ('us_ak', 'アラスカ州', 'Alaska', '', 'us_west', 64.00028, -150.00028),
  ('us_ky', 'ケンタッキー州', 'Kentucky', '', 'us_south', 38.20042, -84.87762),
  ('us_ma', 'マサチューセッツ州', 'Massachusetts', '', 'us_northeast', 42.36565, -71.10832),
  ('us_pa', 'ペンシルベニア州', 'Pennsylvania', '', 'us_northeast', 40.8, -77.7),
  ('us_va', 'バージニア州', 'Virginia', '', 'us_south', 37.54812, -77.44675)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  region_id = EXCLUDED.region_id,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 韓国の都道府県/州
INSERT INTO prefectures (id, name, name_en, name_kana, region_id, latitude, longitude) VALUES
  ('kr_21', '蔚山広域市', 'Ulsan', '', 'kr_yeongnam', 35.56667, 129.26667),
  ('kr_19', '大田広域市', 'Daejeon', '', 'kr_chungcheong', 36.33333, 127.41667),
  ('kr_15', '大邱広域市', 'Daegu', '', 'kr_yeongnam', 35.96667, 128.65),
  ('kr_11', 'ソウル特別市', 'Seoul', '', 'kr_capital', 37.58333, 127),
  ('kr_10', '釜山広域市', 'Busan', '', 'kr_yeongnam', 35.13333, 129.05),
  ('kr_14', '慶尚北道', 'Gyeongsangbuk-do', '', 'kr_yeongnam', 36.6, 128.86667),
  ('kr_13', '京畿道', 'Gyeonggi-do', '', 'kr_capital', 37.6, 127.25),
  ('kr_18', '光州広域市', 'Gwangju', '', 'kr_honam', 35.16667, 126.91667),
  ('kr_06', '江原特別自治道', 'Gangwon-do', '', 'kr_gangwon', 37.75, 128.25),
  ('kr_12', '仁川広域市', 'Incheon', '', 'kr_capital', 37.46178, 126.70017),
  ('kr_17', '忠清南道', 'Chungcheongnam-do', '', 'kr_chungcheong', 36.5, 127),
  ('kr_05', '忠清北道', 'Chungcheongbuk-do', '', 'kr_chungcheong', 36.82153, 127.65685),
  ('kr_16', '全羅南道', 'Jeollanam-do', '', 'kr_honam', 34.75, 127),
  ('kr_03', '全北特別自治道', 'Jeonbuk-do', '', 'kr_honam', 35.75, 127.25),
  ('kr_01', '済州特別自治道', 'Jeju-do', '', 'kr_jeju', 33.41667, 126.5),
  ('kr_20', '慶尚南道', 'Gyeongsangnam-do', '', 'kr_yeongnam', 35.25, 128.25),
  ('kr_22', '世宗特別自治市', 'Sejong-si', '', 'kr_chungcheong', 36.59296, 127.29239)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  region_id = EXCLUDED.region_id,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 台湾の都道府県/州
INSERT INTO prefectures (id, name, name_en, name_kana, region_id, latitude, longitude) VALUES
  ('tw_new_taipei_city', '新北市', 'New Taipei City', '', 'tw_north', 24.94702, 121.58175),
  ('tw_yunlin', '雲林県', 'Yunlin', '', 'tw_central', 23.70701, 120.38481),
  ('tw_taoyuan', '桃園市', 'Taoyuan', '', 'tw_north', 24.895, 121.24611),
  ('tw_taitung', '台東県', 'Taitung', '', 'tw_east', 22.88361, 121.04833),
  ('tw_taipei_city', '台北市', 'Taipei City', '', 'tw_north', 25.083, 121.55331),
  ('tw_tainan', '台南市', 'Tainan', '', 'tw_south', 23.00002, 120.18876),
  ('tw_pingtung', '屏東県', 'Pingtung', '', 'tw_south', 22.49555, 120.61444),
  ('tw_penghu_county', '澎湖県', 'Penghu County', '', 'tw_islands', 23.57111, 119.61138),
  ('tw_nantou', '南投県', 'Nantou', '', 'tw_central', 23.83419, 120.92704),
  ('tw_miaoli', '苗栗県', 'Miaoli', '', 'tw_central', 24.48972, 120.90638),
  ('tw_yilan', '宜蘭県', 'Yilan', '', 'tw_north', 24.5425, 121.63361),
  ('tw_hualien', '花蓮県', 'Hualien', '', 'tw_east', 23.78166, 121.39333),
  ('tw_hsinchu', '新竹市', 'Hsinchu', '', 'tw_north', 24.81472, 120.96722),
  ('tw_hsinchu_county', '新竹県', 'Hsinchu County', '', 'tw_north', 24.67416, 121.16111),
  ('tw_kinmen_county', '金門県', 'Kinmen County', '', 'tw_islands', 24.45333, 118.38861),
  ('tw_chiayi', '嘉義市', 'Chiayi', '', 'tw_south', 23.47722, 120.44527),
  ('tw_chiayi_county', '嘉義県', 'Chiayi County', '', 'tw_south', 23.46333, 120.58166),
  ('tw_changhua', '彰化県', 'Changhua', '', 'tw_central', 23.95361, 120.49083),
  ('tw_keelung', '基隆市', 'Keelung', '', 'tw_north', 25.11486, 121.68987),
  ('tw_lienchiang', '連江県', 'Lienchiang', '', 'tw_islands', 26.37004, 120.49545),
  ('tw_kaohsiung', '高雄市', 'Kaohsiung', '', 'tw_south', 22.6533, 120.33806),
  ('tw_taichung_city', '台中市', 'Taichung City', '', 'tw_central', 24.15472, 120.67297)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  region_id = EXCLUDED.region_id,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 中国の都道府県/州
INSERT INTO prefectures (id, name, name_en, name_kana, region_id, latitude, longitude) VALUES
  ('cn_14', 'チベット自治区', 'Tibet', '', 'cn_southwest', 31.66667, 88),
  ('cn_06', '青海省', 'Qinghai', '', 'cn_northwest', 36, 96),
  ('cn_13', '新疆ウイグル自治区', 'Xinjiang', '', 'cn_northwest', 41.5, 85.5),
  ('cn_02', '浙江省', 'Zhejiang', '', 'cn_east', 29.16667, 120),
  ('cn_29', '雲南省', 'Yunnan', '', 'cn_southwest', 25, 101.5),
  ('cn_28', '天津市', 'Tianjin', '', 'cn_north', 39.33333, 117.33333),
  ('cn_32', '四川省', 'Sichuan', '', 'cn_southwest', 30.5, 102.66667),
  ('cn_24', '山西省', 'Shanxi', '', 'cn_north', 37.66667, 112.25),
  ('cn_23', '上海市', 'Shanghai', '', 'cn_east', 31.16667, 121.41667),
  ('cn_25', '山東省', 'Shandong', '', 'cn_east', 36.33333, 118.25),
  ('cn_26', '陝西省', 'Shaanxi', '', 'cn_northwest', 36, 109),
  ('cn_21', '寧夏回族自治区', 'Ningxia', '', 'cn_northwest', 37.25, 106),
  ('cn_03', '江西省', 'Jiangxi', '', 'cn_east', 27.66667, 115.66667),
  ('cn_04', '江蘇省', 'Jiangsu', '', 'cn_east', 33, 119.83333),
  ('cn_11', '湖南省', 'Hunan', '', 'cn_central', 27.66667, 111.75),
  ('cn_12', '湖北省', 'Hubei', '', 'cn_central', 31, 112.25),
  ('cn_09', '河南省', 'Henan', '', 'cn_central', 34, 113.66667),
  ('cn_10', '河北省', 'Hebei', '', 'cn_north', 39, 115.66667),
  ('cn_31', '海南省', 'Hainan', '', 'cn_south', 19.25, 109.75),
  ('cn_18', '貴州省', 'Guizhou', '', 'cn_southwest', 27, 107),
  ('cn_16', '広西チワン族自治区', 'Guangxi', '', 'cn_south', 24, 109),
  ('cn_30', '広東省', 'Guangdong', '', 'cn_south', 23.5, 113.25),
  ('cn_15', '甘粛省', 'Gansu', '', 'cn_northwest', 37.75, 102.75),
  ('cn_07', '福建省', 'Fujian', '', 'cn_east', 26.25, 118),
  ('cn_33', '重慶市', 'Chongqing', '', 'cn_southwest', 30.08333, 107.83333),
  ('cn_01', '安徽省', 'Anhui', '', 'cn_east', 31.91667, 117.16667),
  ('cn_20', '内モンゴル自治区', 'Inner Mongolia', '', 'cn_north', 43.5, 114.75),
  ('cn_19', '遼寧省', 'Liaoning', '', 'cn_northeast', 41.25, 122.66667),
  ('cn_05', '吉林省', 'Jilin', '', 'cn_northeast', 43.58333, 126.16667),
  ('cn_08', '黒竜江省', 'Heilongjiang', '', 'cn_northeast', 47.75, 128),
  ('cn_22', '北京市', 'Beijing', '', 'cn_north', 39.91691, 116.39706)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  region_id = EXCLUDED.region_id,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- タイの都道府県/州
INSERT INTO prefectures (id, name, name_en, name_kana, region_id, latitude, longitude) VALUES
  ('th_15', 'Uthai Thani県', 'Uthai Thani', '', 'th_north', 15.38333, 99.55),
  ('th_65', 'Trang県', 'Trang', '', 'th_south', 7.50722, 99.59811),
  ('th_08', 'Tak県', 'Tak', '', 'th_north', 16.58333, 98.83333),
  ('th_60', 'スラートターニー県', 'Surat Thani', '', 'th_south', 9.0011, 99.0394),
  ('th_09', 'スコータイ県', 'Sukhothai', '', 'th_north', 17.25, 99.66667),
  ('th_52', 'Ratchaburi県', 'Ratchaburi', '', 'th_central', 13.58333, 99.53333),
  ('th_59', 'Ranong県', 'Ranong', '', 'th_south', 10.1, 98.75),
  ('th_57', 'Prachuap Khiri Khan県', 'Prachuap Khiri Khan', '', 'th_west', 12.21667, 99.75),
  ('th_62', 'プーケット県', 'Phuket', '', 'th_south', 7.97152, 98.35098),
  ('th_56', 'Phetchaburi県', 'Phetchaburi', '', 'th_west', 12.96667, 99.58333),
  ('th_61', 'Phangnga県', 'Phangnga', '', 'th_south', 8.63333, 98.41667),
  ('th_01', 'Mae Hong Son県', 'Mae Hong Son', '', 'th_north', 18.75, 97.91667),
  ('th_05', 'Lamphun県', 'Lamphun', '', 'th_north', 18.25, 98.91667),
  ('th_06', 'Lampang県', 'Lampang', '', 'th_north', 18.33333, 99.5),
  ('th_63', 'クラビー県', 'Krabi', '', 'th_south', 8.19793, 99.00859),
  ('th_50', 'カンチャナブリー県', 'Kanchanaburi', '', 'th_central', 14.63333, 99.1),
  ('th_11', 'Kamphaeng Phet県', 'Kamphaeng Phet', '', 'th_north', 16.25, 99.5),
  ('th_58', 'Chumphon県', 'Chumphon', '', 'th_south', 10.4, 99.06667),
  ('th_03', 'チェンライ県', 'Chiang Rai', '', 'th_north', 19.91667, 99.91667),
  ('th_02', 'チェンマイ県', 'Chiang Mai', '', 'th_north', 18.75, 99),
  ('th_72', 'Yasothon県', 'Yasothon', '', 'th_northeast', 15.85, 104.28333),
  ('th_70', 'Yala県', 'Yala', '', 'th_south', 6.33333, 101.25),
  ('th_10', 'Uttaradit県', 'Uttaradit', '', 'th_north', 17.66667, 100.5),
  ('th_49', 'Trat県', 'Trat', '', 'th_east', 12.5, 102.5),
  ('th_29', 'Surin県', 'Surin', '', 'th_northeast', 14.83333, 103.75),
  ('th_51', 'Suphan Buri県', 'Suphan Buri', '', 'th_central', 14.46667, 100.06667),
  ('th_68', 'ソンクラー県', 'Songkhla', '', 'th_south', 6.83333, 100.66667),
  ('th_30', 'Si Sa Ket県', 'Si Sa Ket', '', 'th_northeast', 14.83333, 104.33333),
  ('th_33', 'Sing Buri県', 'Sing Buri', '', 'th_central', 14.925, 100.33333),
  ('th_67', 'Satun県', 'Satun', '', 'th_south', 6.83333, 100),
  ('th_37', 'Saraburi県', 'Saraburi', '', 'th_central', 14.60838, 100.96822),
  ('th_54', 'Samut Songkhram県', 'Samut Songkhram', '', 'th_central', 13.4, 99.95833),
  ('th_55', 'Samut Sakhon県', 'Samut Sakhon', '', 'th_central', 13.56667, 100.21667),
  ('th_42', 'Samut Prakan県', 'Samut Prakan', '', 'th_central', 13.60442, 100.70531),
  ('th_20', 'Sakon Nakhon県', 'Sakon Nakhon', '', 'th_northeast', 17.33333, 103.83333),
  ('th_25', 'Roi Et県', 'Roi Et', '', 'th_northeast', 15.75, 103.75),
  ('th_47', 'Rayong県', 'Rayong', '', 'th_east', 12.83333, 101.43333),
  ('th_36', 'Phra Nakhon Si Ayutthaya県', 'Phra Nakhon Si Ayutthaya', '', 'th_central', 14.28333, 100.5),
  ('th_07', 'Phrae県', 'Phrae', '', 'th_north', 18.08333, 100),
  ('th_12', 'Phitsanulok県', 'Phitsanulok', '', 'th_north', 16.91667, 100.5),
  ('th_13', 'Phichit県', 'Phichit', '', 'th_north', 16.25, 100.41667),
  ('th_14', 'Phetchabun県', 'Phetchabun', '', 'th_north', 16.25, 101.08333),
  ('th_41', 'Phayao県', 'Phayao', '', 'th_north', 19.25, 100.25),
  ('th_66', 'Phatthalung県', 'Phatthalung', '', 'th_south', 7.5, 100.08333),
  ('th_69', 'パッターニー県', 'Pattani', '', 'th_south', 6.74722, 101.375),
  ('th_39', 'Pathum Thani県', 'Pathum Thani', '', 'th_central', 14.04554, 100.63955),
  ('th_38', 'Nonthaburi県', 'Nonthaburi', '', 'th_central', 13.90433, 100.40335),
  ('th_17', 'Nong Khai県', 'Nong Khai', '', 'th_northeast', 17.75, 102.75),
  ('th_31', 'Narathiwat県', 'Narathiwat', '', 'th_south', 6.20336, 101.72005),
  ('th_04', 'Nan県', 'Nan', '', 'th_north', 18.83333, 100.66667),
  ('th_64', 'ナコーンシータンマラート県', 'Nakhon Si Thammarat', '', 'th_south', 8.39102, 99.82203),
  ('th_16', 'Nakhon Sawan県', 'Nakhon Sawan', '', 'th_north', 15.7, 100.08333),
  ('th_27', 'ナコーンラーチャシーマー県', 'Nakhon Ratchasima', '', 'th_northeast', 15, 102.16667),
  ('th_73', 'Nakhon Phanom県', 'Nakhon Phanom', '', 'th_northeast', 17.48611, 104.48333),
  ('th_53', 'Nakhon Pathom県', 'Nakhon Pathom', '', 'th_central', 13.98333, 100.08333),
  ('th_43', 'Nakhon Nayok県', 'Nakhon Nayok', '', 'th_central', 14.16667, 101.1),
  ('th_78', 'Mukdahan県', 'Mukdahan', '', 'th_northeast', 16.58333, 104.5),
  ('th_24', 'Maha Sarakham県', 'Maha Sarakham', '', 'th_northeast', 16.00571, 103.17233),
  ('th_34', 'Lop Buri県', 'Lop Buri', '', 'th_central', 15.12191, 100.88605),
  ('th_18', 'Loei県', 'Loei', '', 'th_northeast', 17.41667, 101.5),
  ('th_40', 'バンコク', 'Bangkok', '', 'th_central', 13.87719, 100.71991),
  ('th_22', 'コーンケン県', 'Khon Kaen', '', 'th_northeast', 16.43056, 102.61667),
  ('th_23', 'Kalasin県', 'Kalasin', '', 'th_northeast', 16.5, 103.5),
  ('th_46', 'チョンブリー県', 'Chon Buri', '', 'th_east', 13.3, 101.3),
  ('th_48', 'Chanthaburi県', 'Chanthaburi', '', 'th_east', 12.85798, 102.15434),
  ('th_26', 'Chaiyaphum県', 'Chaiyaphum', '', 'th_northeast', 16.01804, 101.81249),
  ('th_32', 'Chai Nat県', 'Chai Nat', '', 'th_central', 15.11667, 100.1),
  ('th_44', 'Chachoengsao県', 'Chachoengsao', '', 'th_central', 13.63105, 101.41666),
  ('th_28', 'Buri Ram県', 'Buri Ram', '', 'th_northeast', 14.84823, 102.99332),
  ('th_35', 'Ang Thong県', 'Ang Thong', '', 'th_central', 14.6105, 100.35845),
  ('th_76', 'ウドーンターニー県', 'Udon Thani', '', 'th_northeast', 17.33333, 102.83333),
  ('th_74', 'Prachin Buri県', 'Prachin Buri', '', 'th_east', 14.08333, 101.66667),
  ('th_75', 'Ubon Ratchathani県', 'Ubon Ratchathani', '', 'th_northeast', 15.16667, 105.16667),
  ('th_77', 'Amnat Charoen県', 'Amnat Charoen', '', 'th_northeast', 15.91667, 104.75),
  ('th_79', 'Nong Bua Lamphu県', 'Nong Bua Lamphu', '', 'th_northeast', 17.25, 102.25),
  ('th_80', 'Sa Kaeo県', 'Sa Kaeo', '', 'th_east', 13.75, 102.33333),
  ('th_81', 'Bueng Kan県', 'Bueng Kan', '', 'th_northeast', 18.16228, 103.75085)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  region_id = EXCLUDED.region_id,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 日本の都道府県にname_enと座標を追加
UPDATE prefectures SET name_en = '北海', latitude = 43.4316324, longitude = 142.4916576 WHERE id = 'hokkaido';
UPDATE prefectures SET name_en = '青森', latitude = 40.9118853, longitude = 140.5690398 WHERE id = 'aomori';
UPDATE prefectures SET name_en = '岩手', latitude = 39.6539952, longitude = 141.4923162 WHERE id = 'iwate';
UPDATE prefectures SET name_en = '宮城', latitude = 38.3880155, longitude = 141.1631147 WHERE id = 'miyagi';
UPDATE prefectures SET name_en = '秋田', latitude = 39.6920715, longitude = 140.1692751 WHERE id = 'akita';
UPDATE prefectures SET name_en = '山形', latitude = 38.6633517, longitude = 139.8923423 WHERE id = 'yamagata';
UPDATE prefectures SET name_en = '福島', latitude = 37.3664672, longitude = 140.3012033 WHERE id = 'fukushima';
UPDATE prefectures SET name_en = '茨城', latitude = 36.34222, longitude = 140.3592463 WHERE id = 'ibaraki';
UPDATE prefectures SET name_en = '栃木', latitude = 36.6773725, longitude = 139.809403 WHERE id = 'tochigi';
UPDATE prefectures SET name_en = '群馬', latitude = 36.5219801, longitude = 139.033483 WHERE id = 'gunma';
UPDATE prefectures SET name_en = '埼玉', latitude = 36.0184661, longitude = 139.3058455 WHERE id = 'saitama';
UPDATE prefectures SET name_en = '千葉', latitude = 35.360459, longitude = 140.3217107 WHERE id = 'chiba';
UPDATE prefectures SET name_en = '東京', latitude = 35.6895, longitude = 139.6917 WHERE id = 'tokyo';
UPDATE prefectures SET name_en = '神奈川', latitude = 35.3150313, longitude = 139.386759 WHERE id = 'kanagawa';
UPDATE prefectures SET name_en = '新潟', latitude = 37.8169186, longitude = 138.7157609 WHERE id = 'niigata';
UPDATE prefectures SET name_en = '富山', latitude = 36.7635807, longitude = 137.2658665 WHERE id = 'toyama';
UPDATE prefectures SET name_en = '石川', latitude = 37.1010934, longitude = 136.9734267 WHERE id = 'ishikawa';
UPDATE prefectures SET name_en = '福井', latitude = 35.8975675, longitude = 136.1408505 WHERE id = 'fukui';
UPDATE prefectures SET name_en = '山梨', latitude = 35.5700465, longitude = 138.657249 WHERE id = 'yamanashi';
UPDATE prefectures SET name_en = '長野', latitude = 36.1143945, longitude = 138.0319015 WHERE id = 'nagano';
UPDATE prefectures SET name_en = '岐阜', latitude = 35.7993975, longitude = 136.964635 WHERE id = 'gifu';
UPDATE prefectures SET name_en = '静岡', latitude = 35.0092013, longitude = 138.4474315 WHERE id = 'shizuoka';
UPDATE prefectures SET name_en = '愛知', latitude = 34.8505462, longitude = 137.254574 WHERE id = 'aichi';
UPDATE prefectures SET name_en = '三重', latitude = 34.4355564, longitude = 136.5893802 WHERE id = 'mie';
UPDATE prefectures SET name_en = '滋賀', latitude = 35.247154, longitude = 136.1093852 WHERE id = 'shiga';
UPDATE prefectures SET name_en = '京', latitude = 35.427891, longitude = 135.4534093 WHERE id = 'kyoto';
UPDATE prefectures SET name_en = '大阪', latitude = 34.661557, longitude = 135.3862454 WHERE id = 'osaka';
UPDATE prefectures SET name_en = '兵庫', latitude = 34.9433662, longitude = 134.860666 WHERE id = 'hyogo';
UPDATE prefectures SET name_en = '奈良', latitude = 34.320156, longitude = 135.884773 WHERE id = 'nara';
UPDATE prefectures SET name_en = '和歌山', latitude = 33.8136796, longitude = 135.6013633 WHERE id = 'wakayama';
UPDATE prefectures SET name_en = '鳥取', latitude = 35.4303659, longitude = 133.8256435 WHERE id = 'tottori';
UPDATE prefectures SET name_en = '島根', latitude = 35.4291024, longitude = 132.5501852 WHERE id = 'shimane';
UPDATE prefectures SET name_en = '岡山', latitude = 34.8023747, longitude = 133.839977 WHERE id = 'okayama';
UPDATE prefectures SET name_en = '広島', latitude = 34.5566578, longitude = 132.7669051 WHERE id = 'hiroshima';
UPDATE prefectures SET name_en = '山口', latitude = 34.3156093, longitude = 131.4545526 WHERE id = 'yamaguchi';
UPDATE prefectures SET name_en = '徳島', latitude = 33.8485454, longitude = 134.3238008 WHERE id = 'tokushima';
UPDATE prefectures SET name_en = '香川', latitude = 34.3204428, longitude = 133.9765295 WHERE id = 'kagawa';
UPDATE prefectures SET name_en = '愛媛', latitude = 33.5530829, longitude = 132.7865786 WHERE id = 'ehime';
UPDATE prefectures SET name_en = '高知', latitude = 33.1339092, longitude = 133.377517 WHERE id = 'kochi';
UPDATE prefectures SET name_en = '福岡', latitude = 33.7936104, longitude = 130.5314035 WHERE id = 'fukuoka';
UPDATE prefectures SET name_en = '佐賀', latitude = 33.3114894, longitude = 130.0910709 WHERE id = 'saga';
UPDATE prefectures SET name_en = '長崎', latitude = 32.7448, longitude = 129.8737 WHERE id = 'nagasaki';
UPDATE prefectures SET name_en = '熊本', latitude = 32.6022056, longitude = 130.3255497 WHERE id = 'kumamoto';
UPDATE prefectures SET name_en = '大分', latitude = 33.1122524, longitude = 131.5504224 WHERE id = 'oita';
UPDATE prefectures SET name_en = '宮崎', latitude = 32.0452902, longitude = 131.4547797 WHERE id = 'miyazaki';
UPDATE prefectures SET name_en = '鹿児島', latitude = 31.5602, longitude = 130.5581 WHERE id = 'kagoshima';
UPDATE prefectures SET name_en = '沖縄', latitude = 26.2124, longitude = 127.6809 WHERE id = 'okinawa';

