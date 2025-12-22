-- transport_hubsテーブルからcountry_codeカラムを削除
-- 他のテーブル（prefectures, cities, machi）と整合性を取るため

ALTER TABLE transport_hubs DROP COLUMN IF EXISTS country_code;

COMMENT ON TABLE transport_hubs IS '交通機関データ（駅、空港、フェリーターミナル、バスターミナル）';
