-- コレクションいいね機能の追加

-- 1. likes テーブルに collection_id カラムを追加
ALTER TABLE "public"."likes" ADD COLUMN "collection_id" uuid;

-- 2. collections テーブルに likes_count カラムを追加
ALTER TABLE "public"."collections" ADD COLUMN "likes_count" integer DEFAULT 0 NOT NULL;

-- 3. CHECK制約を更新（3つのうち1つだけNOT NULL）
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_check";
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_check" CHECK (
  (
    ("map_id" IS NOT NULL) AND ("user_spot_id" IS NULL) AND ("collection_id" IS NULL)
  ) OR (
    ("map_id" IS NULL) AND ("user_spot_id" IS NOT NULL) AND ("collection_id" IS NULL)
  ) OR (
    ("map_id" IS NULL) AND ("user_spot_id" IS NULL) AND ("collection_id" IS NOT NULL)
  )
);

-- 4. 外部キー制約（ON DELETE CASCADE）
ALTER TABLE "public"."likes"
  ADD CONSTRAINT "likes_collection_id_fkey"
  FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;

-- 5. ユニーク制約（重複いいね防止）
CREATE UNIQUE INDEX "likes_user_collection_unique" ON "public"."likes" ("user_id", "collection_id")
  WHERE "collection_id" IS NOT NULL;

-- 6. update_likes_count() トリガー関数を拡張（collection_id対応）
CREATE OR REPLACE FUNCTION "public"."update_likes_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = likes_count + 1 WHERE id = NEW.map_id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = likes_count + 1 WHERE id = NEW.user_spot_id;
    ELSIF NEW.collection_id IS NOT NULL THEN
      UPDATE collections SET likes_count = likes_count + 1 WHERE id = NEW.collection_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.map_id;
    ELSIF OLD.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.user_spot_id;
    ELSIF OLD.collection_id IS NOT NULL THEN
      UPDATE collections SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.collection_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
