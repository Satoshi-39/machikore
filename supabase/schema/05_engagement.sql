-- ============================================================
-- エンゲージメント（likes, bookmarks, bookmark_folders, comments, comment_likes）
-- ============================================================
-- いいね、ブックマーク、コメント機能
-- 最終更新: 2025-12-23

-- ============================================================
-- likes（いいね）
-- ============================================================

CREATE TABLE public.likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT likes_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);

ALTER TABLE ONLY public.likes ADD CONSTRAINT likes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.likes ADD CONSTRAINT likes_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.likes ADD CONSTRAINT likes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.likes ADD CONSTRAINT likes_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_likes_map_id ON public.likes USING btree (map_id);
CREATE INDEX idx_likes_user_id ON public.likes USING btree (user_id);
CREATE INDEX idx_likes_user_spot_id ON public.likes USING btree (user_spot_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own likes" ON public.likes
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY likes_delete_policy ON public.likes FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY likes_insert_policy ON public.likes FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY likes_select_policy ON public.likes FOR SELECT USING (true);

-- ============================================================
-- bookmark_folders（ブックマークフォルダ）
-- ============================================================

CREATE TABLE public.bookmark_folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    folder_type text DEFAULT 'spots'::text NOT NULL,
    CONSTRAINT bookmark_folders_folder_type_check CHECK ((folder_type = ANY (ARRAY['spots'::text, 'maps'::text])))
);

ALTER TABLE ONLY public.bookmark_folders ADD CONSTRAINT bookmark_folders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bookmark_folders ADD CONSTRAINT bookmark_folders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_bookmark_folders_type ON public.bookmark_folders USING btree (folder_type);
CREATE INDEX idx_bookmark_folders_user_id ON public.bookmark_folders USING btree (user_id);

CREATE TRIGGER update_bookmark_folders_updated_at
    BEFORE UPDATE ON public.bookmark_folders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own bookmark folders" ON public.bookmark_folders
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Users can delete their own bookmark folders" ON public.bookmark_folders
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY "Users can update their own bookmark folders" ON public.bookmark_folders
    FOR UPDATE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY "Users can view their own bookmark folders" ON public.bookmark_folders
    FOR SELECT TO authenticated USING ((user_id = auth.uid()));

-- ============================================================
-- bookmarks（ブックマーク）
-- ============================================================

CREATE TABLE public.bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    folder_id uuid,
    CONSTRAINT bookmarks_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);

ALTER TABLE ONLY public.bookmarks ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bookmarks ADD CONSTRAINT bookmarks_folder_id_fkey
    FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.bookmarks ADD CONSTRAINT bookmarks_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookmarks ADD CONSTRAINT bookmarks_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookmarks ADD CONSTRAINT bookmarks_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_bookmarks_folder_id ON public.bookmarks USING btree (folder_id);
CREATE INDEX idx_bookmarks_map_id ON public.bookmarks USING btree (map_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks USING btree (user_id);
CREATE INDEX idx_bookmarks_user_spot_id ON public.bookmarks USING btree (user_spot_id);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own bookmarks" ON public.bookmarks
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
    FOR SELECT TO authenticated USING ((user_id = auth.uid()));

-- ============================================================
-- comments（コメント）
-- ============================================================

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id uuid,
    root_id uuid,
    depth integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    replies_count integer DEFAULT 0 NOT NULL,
    CONSTRAINT comments_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);

ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_root_id_fkey
    FOREIGN KEY (root_id) REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.comments ADD CONSTRAINT comments_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_comments_created_at ON public.comments USING btree (created_at DESC);
CREATE INDEX idx_comments_depth ON public.comments USING btree (depth);
CREATE INDEX idx_comments_map_id ON public.comments USING btree (map_id);
CREATE INDEX idx_comments_parent_id ON public.comments USING btree (parent_id);
CREATE INDEX idx_comments_root_id ON public.comments USING btree (root_id);
CREATE INDEX idx_comments_user_id ON public.comments USING btree (user_id);
CREATE INDEX idx_comments_user_spot_id ON public.comments USING btree (user_spot_id);

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON public.comments
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE TO authenticated USING ((user_id = auth.uid()));

-- ============================================================
-- comment_likes（コメントいいね）
-- ============================================================

CREATE TABLE public.comment_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    comment_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.comment_likes ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.comment_likes ADD CONSTRAINT comment_likes_user_id_comment_id_key UNIQUE (user_id, comment_id);
ALTER TABLE ONLY public.comment_likes ADD CONSTRAINT comment_likes_comment_id_fkey
    FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.comment_likes ADD CONSTRAINT comment_likes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes USING btree (comment_id);
CREATE INDEX idx_comment_likes_user_id ON public.comment_likes USING btree (user_id);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY comment_likes_delete_own ON public.comment_likes FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY comment_likes_insert_own ON public.comment_likes FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY comment_likes_select_all ON public.comment_likes FOR SELECT USING (true);

-- ============================================================
-- カウンター更新トリガー関数
-- ============================================================

-- いいね数を更新
CREATE FUNCTION public.update_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;

-- ブックマーク数を更新
CREATE FUNCTION public.update_bookmarks_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;

-- コメント数を更新（返信コメントはカウントしない）
CREATE FUNCTION public.update_comments_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;

-- コメントのいいね数を増加
CREATE FUNCTION public.increment_comment_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$;

-- コメントのいいね数を減少
CREATE FUNCTION public.decrement_comment_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE comments
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$;

-- コメントの返信数を増加
CREATE FUNCTION public.increment_comment_replies_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = replies_count + 1
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$;

-- コメントの返信数を減少
CREATE FUNCTION public.decrement_comment_replies_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = GREATEST(0, replies_count - 1)
    WHERE id = OLD.parent_id;
  END IF;
  RETURN OLD;
END;
$$;

-- ============================================================
-- トリガー
-- ============================================================

CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

CREATE TRIGGER trigger_update_bookmarks_count
    AFTER INSERT OR DELETE ON public.bookmarks
    FOR EACH ROW EXECUTE FUNCTION public.update_bookmarks_count();

CREATE TRIGGER trigger_update_comments_count
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

CREATE TRIGGER trigger_increment_comment_likes
    AFTER INSERT ON public.comment_likes
    FOR EACH ROW EXECUTE FUNCTION public.increment_comment_likes_count();

CREATE TRIGGER trigger_decrement_comment_likes
    AFTER DELETE ON public.comment_likes
    FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_likes_count();

CREATE TRIGGER trigger_increment_comment_replies
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.increment_comment_replies_count();

CREATE TRIGGER trigger_decrement_comment_replies
    AFTER DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_replies_count();
