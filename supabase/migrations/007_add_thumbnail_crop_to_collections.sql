-- collectionsテーブルにthumbnail_cropカラムを追加
-- 非破壊クロップ対応（マップ・スポットと同様）

ALTER TABLE "public"."collections"
ADD COLUMN IF NOT EXISTS "thumbnail_crop" jsonb;

COMMENT ON COLUMN "public"."collections"."thumbnail_crop" IS
  'サムネイルのクロップ座標。{originX, originY, width, height, imageWidth, imageHeight}';
