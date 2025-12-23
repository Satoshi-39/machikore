-- ============================================================
-- カウンター系RPC関数をトリガー関数に変換
-- ============================================================
-- 目的: INSERT/DELETE時に自動でカウンターを更新し、整合性を保証する
--
-- 対象テーブルとカウンター:
-- - user_spots → maps.spots_count
-- - likes (map_id) → maps.likes_count
-- - likes (user_spot_id) → user_spots.likes_count
-- - comments (map_id) → maps.comments_count
-- - comments (user_spot_id) → user_spots.comments_count
-- - bookmarks (map_id) → maps.bookmarks_count
-- - bookmarks (user_spot_id) → user_spots.bookmarks_count
-- - images → user_spots.images_count
-- - master_spot_favorites → master_spots.favorites_count

-- ============================================================
-- 1. user_spots → maps.spots_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_map_spots_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE maps SET spots_count = spots_count + 1 WHERE id = NEW.map_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE maps SET spots_count = GREATEST(0, spots_count - 1) WHERE id = OLD.map_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_map_spots_count ON user_spots;
CREATE TRIGGER trigger_update_map_spots_count
  AFTER INSERT OR DELETE ON user_spots
  FOR EACH ROW EXECUTE FUNCTION update_map_spots_count();

-- ============================================================
-- 2. likes → maps.likes_count / user_spots.likes_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = likes_count + 1 WHERE id = NEW.map_id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = likes_count + 1 WHERE id = NEW.user_spot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.map_id;
    ELSIF OLD.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.user_spot_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_likes_count ON likes;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- ============================================================
-- 3. comments → maps.comments_count / user_spots.comments_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  -- 返信コメント（parent_idがある）はカウントしない
  IF TG_OP = 'INSERT' THEN
    IF NEW.parent_id IS NULL THEN
      IF NEW.map_id IS NOT NULL THEN
        UPDATE maps SET comments_count = comments_count + 1 WHERE id = NEW.map_id;
      ELSIF NEW.user_spot_id IS NOT NULL THEN
        UPDATE user_spots SET comments_count = comments_count + 1 WHERE id = NEW.user_spot_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.parent_id IS NULL THEN
      IF OLD.map_id IS NOT NULL THEN
        UPDATE maps SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.map_id;
      ELSIF OLD.user_spot_id IS NOT NULL THEN
        UPDATE user_spots SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.user_spot_id;
      END IF;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_comments_count ON comments;
CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- ============================================================
-- 4. bookmarks → maps.bookmarks_count / user_spots.bookmarks_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_bookmarks_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.map_id IS NOT NULL THEN
      UPDATE maps SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.map_id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.user_spot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.map_id IS NOT NULL THEN
      UPDATE maps SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = OLD.map_id;
    ELSIF OLD.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = OLD.user_spot_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_bookmarks_count ON bookmarks;
CREATE TRIGGER trigger_update_bookmarks_count
  AFTER INSERT OR DELETE ON bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_bookmarks_count();

-- ============================================================
-- 5. images → user_spots.images_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_images_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_spots SET images_count = images_count + 1 WHERE id = NEW.user_spot_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_spots SET images_count = GREATEST(0, images_count - 1) WHERE id = OLD.user_spot_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_images_count ON images;
CREATE TRIGGER trigger_update_images_count
  AFTER INSERT OR DELETE ON images
  FOR EACH ROW EXECUTE FUNCTION update_images_count();

-- ============================================================
-- 6. master_spot_favorites → master_spots.favorites_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_master_spot_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE master_spots SET favorites_count = favorites_count + 1 WHERE id = NEW.master_spot_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE master_spots SET favorites_count = GREATEST(0, favorites_count - 1) WHERE id = OLD.master_spot_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_master_spot_favorites_count ON master_spot_favorites;
CREATE TRIGGER trigger_update_master_spot_favorites_count
  AFTER INSERT OR DELETE ON master_spot_favorites
  FOR EACH ROW EXECUTE FUNCTION update_master_spot_favorites_count();

-- ============================================================
-- 7. 旧RPC関数を削除（トリガーに置き換えたため不要）
-- ============================================================
-- user_spots関連
DROP FUNCTION IF EXISTS increment_user_spots_count(uuid);
DROP FUNCTION IF EXISTS decrement_user_spots_count(uuid);
DROP FUNCTION IF EXISTS increment_map_spots_count(uuid);
DROP FUNCTION IF EXISTS decrement_map_spots_count(uuid);

-- likes関連
DROP FUNCTION IF EXISTS increment_map_likes_count(uuid);
DROP FUNCTION IF EXISTS decrement_map_likes_count(uuid);
DROP FUNCTION IF EXISTS increment_user_spot_likes_count(uuid);
DROP FUNCTION IF EXISTS decrement_user_spot_likes_count(uuid);

-- comments関連
DROP FUNCTION IF EXISTS increment_map_comments_count(uuid);
DROP FUNCTION IF EXISTS decrement_map_comments_count(uuid);
DROP FUNCTION IF EXISTS increment_user_spot_comments_count(uuid);
DROP FUNCTION IF EXISTS decrement_user_spot_comments_count(uuid);

-- bookmarks関連
DROP FUNCTION IF EXISTS increment_map_bookmarks_count(uuid);
DROP FUNCTION IF EXISTS decrement_map_bookmarks_count(uuid);
DROP FUNCTION IF EXISTS increment_user_spot_bookmarks_count(uuid);
DROP FUNCTION IF EXISTS decrement_user_spot_bookmarks_count(uuid);

-- images関連
DROP FUNCTION IF EXISTS increment_user_spot_images_count(uuid);
DROP FUNCTION IF EXISTS decrement_user_spot_images_count(uuid);

-- master_spot_favorites関連
DROP FUNCTION IF EXISTS increment_master_spot_favorites_count(uuid);
DROP FUNCTION IF EXISTS decrement_master_spot_favorites_count(uuid);
