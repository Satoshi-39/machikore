-- Supabase images テーブルに不足カラムを追加
-- 実行場所: Supabase Dashboard > SQL Editor

-- 1. width カラムを追加（画像の幅）
ALTER TABLE images ADD COLUMN IF NOT EXISTS width INTEGER;

-- 2. height カラムを追加（画像の高さ）
ALTER TABLE images ADD COLUMN IF NOT EXISTS height INTEGER;

-- 3. file_size カラムを追加（ファイルサイズ: バイト数）
ALTER TABLE images ADD COLUMN IF NOT EXISTS file_size INTEGER;

-- 4. order_index カラムを追加（表示順序: デフォルト0）
ALTER TABLE images ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- 確認用クエリ
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'images'
ORDER BY ordinal_position;
