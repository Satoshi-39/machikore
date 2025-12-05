-- prefecturesテーブルに座標カラムを追加
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- citiesテーブルに座標カラムを追加
ALTER TABLE cities ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 都道府県の座標データを更新
UPDATE prefectures SET latitude = 43.0646, longitude = 141.3468 WHERE id = 'hokkaido';
UPDATE prefectures SET latitude = 40.8244, longitude = 140.7400 WHERE id = 'aomori';
UPDATE prefectures SET latitude = 39.7036, longitude = 141.1527 WHERE id = 'iwate';
UPDATE prefectures SET latitude = 38.2688, longitude = 140.8721 WHERE id = 'miyagi';
UPDATE prefectures SET latitude = 39.7186, longitude = 140.1024 WHERE id = 'akita';
UPDATE prefectures SET latitude = 38.2404, longitude = 140.3633 WHERE id = 'yamagata';
UPDATE prefectures SET latitude = 37.7500, longitude = 140.4678 WHERE id = 'fukushima';
UPDATE prefectures SET latitude = 36.3418, longitude = 140.4468 WHERE id = 'ibaraki';
UPDATE prefectures SET latitude = 36.5657, longitude = 139.8836 WHERE id = 'tochigi';
UPDATE prefectures SET latitude = 36.3912, longitude = 139.0608 WHERE id = 'gunma';
UPDATE prefectures SET latitude = 35.8569, longitude = 139.6489 WHERE id = 'saitama';
UPDATE prefectures SET latitude = 35.6047, longitude = 140.1233 WHERE id = 'chiba';
UPDATE prefectures SET latitude = 35.6895, longitude = 139.6917 WHERE id = 'tokyo';
UPDATE prefectures SET latitude = 35.4478, longitude = 139.6425 WHERE id = 'kanagawa';
UPDATE prefectures SET latitude = 37.9024, longitude = 139.0232 WHERE id = 'niigata';
UPDATE prefectures SET latitude = 36.6953, longitude = 137.2113 WHERE id = 'toyama';
UPDATE prefectures SET latitude = 36.5946, longitude = 136.6256 WHERE id = 'ishikawa';
UPDATE prefectures SET latitude = 36.0652, longitude = 136.2216 WHERE id = 'fukui';
UPDATE prefectures SET latitude = 35.6642, longitude = 138.5684 WHERE id = 'yamanashi';
UPDATE prefectures SET latitude = 36.6513, longitude = 138.1810 WHERE id = 'nagano';
UPDATE prefectures SET latitude = 35.3912, longitude = 136.7223 WHERE id = 'gifu';
UPDATE prefectures SET latitude = 34.9769, longitude = 138.3831 WHERE id = 'shizuoka';
UPDATE prefectures SET latitude = 35.1802, longitude = 136.9066 WHERE id = 'aichi';
UPDATE prefectures SET latitude = 34.7303, longitude = 136.5086 WHERE id = 'mie';
UPDATE prefectures SET latitude = 35.0045, longitude = 135.8686 WHERE id = 'shiga';
UPDATE prefectures SET latitude = 35.0116, longitude = 135.7681 WHERE id = 'kyoto';
UPDATE prefectures SET latitude = 34.6863, longitude = 135.5200 WHERE id = 'osaka';
UPDATE prefectures SET latitude = 34.6913, longitude = 135.1830 WHERE id = 'hyogo';
UPDATE prefectures SET latitude = 34.6851, longitude = 135.8329 WHERE id = 'nara';
UPDATE prefectures SET latitude = 34.2260, longitude = 135.1675 WHERE id = 'wakayama';
UPDATE prefectures SET latitude = 35.5039, longitude = 134.2378 WHERE id = 'tottori';
UPDATE prefectures SET latitude = 35.4723, longitude = 133.0505 WHERE id = 'shimane';
UPDATE prefectures SET latitude = 34.6618, longitude = 133.9344 WHERE id = 'okayama';
UPDATE prefectures SET latitude = 34.3963, longitude = 132.4596 WHERE id = 'hiroshima';
UPDATE prefectures SET latitude = 34.1859, longitude = 131.4714 WHERE id = 'yamaguchi';
UPDATE prefectures SET latitude = 34.0658, longitude = 134.5593 WHERE id = 'tokushima';
UPDATE prefectures SET latitude = 34.3401, longitude = 134.0434 WHERE id = 'kagawa';
UPDATE prefectures SET latitude = 33.8416, longitude = 132.7657 WHERE id = 'ehime';
UPDATE prefectures SET latitude = 33.5597, longitude = 133.5311 WHERE id = 'kochi';
UPDATE prefectures SET latitude = 33.6064, longitude = 130.4183 WHERE id = 'fukuoka';
UPDATE prefectures SET latitude = 33.2494, longitude = 130.2988 WHERE id = 'saga';
UPDATE prefectures SET latitude = 32.7448, longitude = 129.8737 WHERE id = 'nagasaki';
UPDATE prefectures SET latitude = 32.7898, longitude = 130.7417 WHERE id = 'kumamoto';
UPDATE prefectures SET latitude = 33.2382, longitude = 131.6126 WHERE id = 'oita';
UPDATE prefectures SET latitude = 31.9111, longitude = 131.4239 WHERE id = 'miyazaki';
UPDATE prefectures SET latitude = 31.5602, longitude = 130.5581 WHERE id = 'kagoshima';
UPDATE prefectures SET latitude = 26.2124, longitude = 127.6809 WHERE id = 'okinawa';

-- 東京23区の座標データを更新
UPDATE cities SET latitude = 35.6940, longitude = 139.7536 WHERE id = 'chiyoda';
UPDATE cities SET latitude = 35.6707, longitude = 139.7724 WHERE id = 'chuo';
UPDATE cities SET latitude = 35.6581, longitude = 139.7514 WHERE id = 'minato';
UPDATE cities SET latitude = 35.6938, longitude = 139.7034 WHERE id = 'shinjuku';
UPDATE cities SET latitude = 35.7081, longitude = 139.7522 WHERE id = 'bunkyo';
UPDATE cities SET latitude = 35.7126, longitude = 139.7801 WHERE id = 'taito';
UPDATE cities SET latitude = 35.7107, longitude = 139.8015 WHERE id = 'sumida';
UPDATE cities SET latitude = 35.6729, longitude = 139.8172 WHERE id = 'koto';
UPDATE cities SET latitude = 35.6090, longitude = 139.7302 WHERE id = 'shinagawa';
UPDATE cities SET latitude = 35.6414, longitude = 139.6982 WHERE id = 'meguro';
UPDATE cities SET latitude = 35.5613, longitude = 139.7160 WHERE id = 'ota';
UPDATE cities SET latitude = 35.6464, longitude = 139.6532 WHERE id = 'setagaya';
UPDATE cities SET latitude = 35.6640, longitude = 139.6982 WHERE id = 'shibuya';
UPDATE cities SET latitude = 35.7078, longitude = 139.6638 WHERE id = 'nakano';
UPDATE cities SET latitude = 35.6995, longitude = 139.6364 WHERE id = 'suginami';
UPDATE cities SET latitude = 35.7263, longitude = 139.7162 WHERE id = 'toshima';
UPDATE cities SET latitude = 35.7528, longitude = 139.7499 WHERE id = 'kita';
UPDATE cities SET latitude = 35.7364, longitude = 139.7834 WHERE id = 'arakawa';
UPDATE cities SET latitude = 35.7512, longitude = 139.7094 WHERE id = 'itabashi';
UPDATE cities SET latitude = 35.7356, longitude = 139.6516 WHERE id = 'nerima';
UPDATE cities SET latitude = 35.7752, longitude = 139.8045 WHERE id = 'adachi';
UPDATE cities SET latitude = 35.7436, longitude = 139.8474 WHERE id = 'katsushika';
UPDATE cities SET latitude = 35.7067, longitude = 139.8682 WHERE id = 'edogawa';

-- 東京都下の主要市
UPDATE cities SET latitude = 35.6664, longitude = 139.3160 WHERE id = 'hachioji';
UPDATE cities SET latitude = 35.6979, longitude = 139.4147 WHERE id = 'tachikawa';
UPDATE cities SET latitude = 35.7177, longitude = 139.5661 WHERE id = 'musashino';
UPDATE cities SET latitude = 35.6836, longitude = 139.5596 WHERE id = 'mitaka';
UPDATE cities SET latitude = 35.6690, longitude = 139.4777 WHERE id = 'fuchu';
UPDATE cities SET latitude = 35.6505, longitude = 139.5405 WHERE id = 'chofu';
UPDATE cities SET latitude = 35.5489, longitude = 139.4462 WHERE id = 'machida';

-- 神奈川県の主要市区
UPDATE cities SET latitude = 35.4437, longitude = 139.6380 WHERE id = 'yokohama_naka';
UPDATE cities SET latitude = 35.4665, longitude = 139.6226 WHERE id = 'yokohama_nishi';
UPDATE cities SET latitude = 35.4390, longitude = 139.6043 WHERE id = 'yokohama_minami';
UPDATE cities SET latitude = 35.5316, longitude = 139.5996 WHERE id = 'yokohama_kohoku';
UPDATE cities SET latitude = 35.5308, longitude = 139.7030 WHERE id = 'kawasaki_kawasaki';
UPDATE cities SET latitude = 35.5701, longitude = 139.6563 WHERE id = 'kawasaki_nakahara';
UPDATE cities SET latitude = 35.5716, longitude = 139.3727 WHERE id = 'sagamihara_chuo';

-- 大阪府の主要市区
UPDATE cities SET latitude = 34.7055, longitude = 135.4983 WHERE id = 'osaka_kita';
UPDATE cities SET latitude = 34.6840, longitude = 135.5198 WHERE id = 'osaka_chuo';
UPDATE cities SET latitude = 34.6596, longitude = 135.5013 WHERE id = 'osaka_naniwa';
UPDATE cities SET latitude = 34.6532, longitude = 135.5185 WHERE id = 'osaka_tennoji';

-- 愛知県の主要市区
UPDATE cities SET latitude = 35.1715, longitude = 136.8816 WHERE id = 'nagoya_naka';
UPDATE cities SET latitude = 35.1716, longitude = 136.9232 WHERE id = 'nagoya_higashi';
UPDATE cities SET latitude = 35.1647, longitude = 136.9499 WHERE id = 'nagoya_chikusa';

-- 福岡県の主要市区
UPDATE cities SET latitude = 33.5903, longitude = 130.4017 WHERE id = 'fukuoka_hakata';
UPDATE cities SET latitude = 33.5903, longitude = 130.3920 WHERE id = 'fukuoka_chuo';
UPDATE cities SET latitude = 33.5838, longitude = 130.3481 WHERE id = 'fukuoka_nishi';
UPDATE cities SET latitude = 33.8833, longitude = 130.8753 WHERE id = 'kitakyushu_kokura_kita';

-- 北海道の主要市区
UPDATE cities SET latitude = 43.0553, longitude = 141.3411 WHERE id = 'sapporo_chuo';
UPDATE cities SET latitude = 43.0908, longitude = 141.3407 WHERE id = 'sapporo_kita';
UPDATE cities SET latitude = 43.0762, longitude = 141.3631 WHERE id = 'sapporo_higashi';

-- 宮城県の主要市区
UPDATE cities SET latitude = 38.2607, longitude = 140.8721 WHERE id = 'sendai_aoba';
UPDATE cities SET latitude = 38.2646, longitude = 140.9120 WHERE id = 'sendai_miyagino';

-- 広島県の主要市区
UPDATE cities SET latitude = 34.3853, longitude = 132.4553 WHERE id = 'hiroshima_naka';
UPDATE cities SET latitude = 34.3963, longitude = 132.4879 WHERE id = 'hiroshima_higashi';
