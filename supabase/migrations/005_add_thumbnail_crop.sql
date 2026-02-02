-- サムネイルの非破壊クロップ座標カラムを追加
-- クロップ済み画像ではなく元画像を保持し、表示時にクライアント側でクロップを適用する

ALTER TABLE "public"."user_spots"
ADD COLUMN "thumbnail_crop" jsonb;

COMMENT ON COLUMN "public"."user_spots"."thumbnail_crop" IS
  'サムネイルのクロップ座標。{originX, originY, width, height, imageWidth, imageHeight}';

ALTER TABLE "public"."maps"
ADD COLUMN "thumbnail_crop" jsonb;

COMMENT ON COLUMN "public"."maps"."thumbnail_crop" IS
  'サムネイルのクロップ座標。{originX, originY, width, height, imageWidth, imageHeight}';
