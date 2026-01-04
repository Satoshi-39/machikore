-- master_spots.name を TEXT から JSONB（多言語対応）に変更
-- 既存データは日本語として保持

-- 1. 既存データを一時的に保存
ALTER TABLE public.master_spots ADD COLUMN name_jsonb jsonb;

-- 2. 既存の name を JSONB 形式に変換（既存データは日本語として扱う）
UPDATE public.master_spots
SET name_jsonb = jsonb_build_object('ja', name)
WHERE name IS NOT NULL;

-- 3. 元の name カラムを削除
ALTER TABLE public.master_spots DROP COLUMN name;

-- 4. name_jsonb を name にリネーム
ALTER TABLE public.master_spots RENAME COLUMN name_jsonb TO name;

-- 5. NOT NULL 制約を追加
ALTER TABLE public.master_spots ALTER COLUMN name SET NOT NULL;

-- 6. インデックスを再作成（GINインデックスでJSONB検索に対応）
DROP INDEX IF EXISTS idx_master_spots_name;
CREATE INDEX idx_master_spots_name ON public.master_spots USING gin (name);

-- 7. コメント追加
COMMENT ON COLUMN public.master_spots.name IS '多言語スポット名: {"ja": "日本語名", "en": "English name"}';
