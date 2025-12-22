-- ===============================
-- countriesテーブルに name_translations カラムを追加
-- ===============================
-- 注意: name_enカラムは115で既に削除済み
-- regions, prefecturesは001で既にname_translationsを持っている

ALTER TABLE countries ADD COLUMN IF NOT EXISTS name_translations JSONB;
