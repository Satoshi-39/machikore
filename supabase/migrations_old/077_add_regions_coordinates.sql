-- ===============================
-- regionsテーブルに座標カラムを追加
-- ===============================

ALTER TABLE regions ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 既存データに座標を設定
UPDATE regions SET latitude = 43.4316324, longitude = 142.4916576 WHERE id = 'hokkaido';
UPDATE regions SET latitude = 39.1126311, longitude = 140.5976819 WHERE id = 'tohoku';
UPDATE regions SET latitude = 35.9892697, longitude = 139.6537351 WHERE id = 'kanto';
UPDATE regions SET latitude = 36.1024806, longitude = 137.4944984 WHERE id = 'chubu';
UPDATE regions SET latitude = 34.6921073, longitude = 135.6939318 WHERE id = 'kinki';
UPDATE regions SET latitude = 34.9068220, longitude = 132.8874127 WHERE id = 'chugoku';
UPDATE regions SET latitude = 33.7139951, longitude = 133.6160565 WHERE id = 'shikoku';
UPDATE regions SET latitude = 32.7381926, longitude = 130.6260752 WHERE id = 'kyushu';
UPDATE regions SET latitude = 26.2124, longitude = 127.6809 WHERE id = 'okinawa';
