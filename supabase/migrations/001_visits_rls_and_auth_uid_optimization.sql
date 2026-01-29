-- Migration: auth.uid() → (select auth.uid()) 最適化
--
-- 全 RLS ポリシーの auth.uid() を (select auth.uid()) に最適化
-- Supabase公式推奨: クエリプランナーが一度だけ評価する定数として扱える
-- ※ visits テーブル RLS は本番適用済みのため、最適化のみ実施

BEGIN;

-- admin_users
DROP POLICY IF EXISTS admin_users_delete_owner ON public.admin_users;
CREATE POLICY admin_users_delete_owner ON public.admin_users FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = (select auth.uid())) AND (au.role = 'owner'::text)))));

DROP POLICY IF EXISTS admin_users_insert_owner ON public.admin_users;
CREATE POLICY admin_users_insert_owner ON public.admin_users FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = (select auth.uid())) AND (au.role = 'owner'::text)))));

DROP POLICY IF EXISTS admin_users_select_admin ON public.admin_users;
CREATE POLICY admin_users_select_admin ON public.admin_users FOR SELECT TO authenticated USING (public.is_admin_user((select auth.uid())));

DROP POLICY IF EXISTS admin_users_update_owner ON public.admin_users;
CREATE POLICY admin_users_update_owner ON public.admin_users FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = (select auth.uid())) AND (au.role = 'owner'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = (select auth.uid())) AND (au.role = 'owner'::text)))));

-- bookmark_folders
DROP POLICY IF EXISTS bookmark_folders_delete_own ON public.bookmark_folders;
CREATE POLICY bookmark_folders_delete_own ON public.bookmark_folders FOR DELETE TO authenticated USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS bookmark_folders_insert_own ON public.bookmark_folders;
CREATE POLICY bookmark_folders_insert_own ON public.bookmark_folders FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS bookmark_folders_select_own ON public.bookmark_folders;
CREATE POLICY bookmark_folders_select_own ON public.bookmark_folders FOR SELECT TO authenticated USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS bookmark_folders_update_own ON public.bookmark_folders;
CREATE POLICY bookmark_folders_update_own ON public.bookmark_folders FOR UPDATE TO authenticated USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));

-- bookmarks
DROP POLICY IF EXISTS bookmarks_delete_own ON public.bookmarks;
CREATE POLICY bookmarks_delete_own ON public.bookmarks FOR DELETE TO authenticated USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS bookmarks_insert_own ON public.bookmarks;
CREATE POLICY bookmarks_insert_own ON public.bookmarks FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS bookmarks_select_own ON public.bookmarks;
CREATE POLICY bookmarks_select_own ON public.bookmarks FOR SELECT TO authenticated USING ((user_id = (select auth.uid())));

-- collection_maps
DROP POLICY IF EXISTS collection_maps_delete_own ON public.collection_maps;
CREATE POLICY collection_maps_delete_own ON public.collection_maps FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS collection_maps_insert_own ON public.collection_maps;
CREATE POLICY collection_maps_insert_own ON public.collection_maps FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS collection_maps_select_public_or_own ON public.collection_maps;
CREATE POLICY collection_maps_select_public_or_own ON public.collection_maps FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND ((collections.is_public = true) OR (collections.user_id = (select auth.uid())))))));

DROP POLICY IF EXISTS collection_maps_update_own ON public.collection_maps;
CREATE POLICY collection_maps_update_own ON public.collection_maps FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = (select auth.uid()))))));

-- collections
DROP POLICY IF EXISTS collections_delete_own ON public.collections;
CREATE POLICY collections_delete_own ON public.collections FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS collections_insert_own ON public.collections;
CREATE POLICY collections_insert_own ON public.collections FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS collections_select_public_or_own ON public.collections;
CREATE POLICY collections_select_public_or_own ON public.collections FOR SELECT USING (((is_public = true) OR ((select auth.uid()) = user_id)));

DROP POLICY IF EXISTS collections_update_own ON public.collections;
CREATE POLICY collections_update_own ON public.collections FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- comment_likes
DROP POLICY IF EXISTS comment_likes_delete_own ON public.comment_likes;
CREATE POLICY comment_likes_delete_own ON public.comment_likes FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS comment_likes_insert_own ON public.comment_likes;
CREATE POLICY comment_likes_insert_own ON public.comment_likes FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

-- comments
DROP POLICY IF EXISTS comments_delete_own ON public.comments;
CREATE POLICY comments_delete_own ON public.comments FOR DELETE TO authenticated USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS comments_insert_own ON public.comments;
CREATE POLICY comments_insert_own ON public.comments FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS comments_update_own ON public.comments;
CREATE POLICY comments_update_own ON public.comments FOR UPDATE TO authenticated USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));

-- follows
DROP POLICY IF EXISTS follows_delete_own ON public.follows;
CREATE POLICY follows_delete_own ON public.follows FOR DELETE TO authenticated USING ((follower_id = (select auth.uid())));

DROP POLICY IF EXISTS follows_insert_own ON public.follows;
CREATE POLICY follows_insert_own ON public.follows FOR INSERT TO authenticated WITH CHECK ((follower_id = (select auth.uid())));

-- images
DROP POLICY IF EXISTS images_delete_own ON public.images;
CREATE POLICY images_delete_own ON public.images FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = images.user_spot_id) AND (user_spots.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS images_insert_own_with_limit ON public.images;
CREATE POLICY images_insert_own_with_limit ON public.images FOR INSERT TO authenticated WITH CHECK (((EXISTS ( SELECT 1
   FROM public.user_spots us
  WHERE ((us.id = images.user_spot_id) AND (us.user_id = (select auth.uid()))))) AND (public.count_images_in_spot(user_spot_id) < 4)));

DROP POLICY IF EXISTS images_select_public_or_own ON public.images;
CREATE POLICY images_select_public_or_own ON public.images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.user_spots
     JOIN public.maps ON ((maps.id = user_spots.map_id)))
  WHERE ((user_spots.id = images.user_spot_id) AND ((maps.is_public = true) OR (((select auth.uid()) IS NOT NULL) AND (maps.user_id = (select auth.uid()))))))));

-- likes
DROP POLICY IF EXISTS likes_delete_own ON public.likes;
CREATE POLICY likes_delete_own ON public.likes FOR DELETE TO authenticated USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS likes_insert_own ON public.likes;
CREATE POLICY likes_insert_own ON public.likes FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())));

-- map_labels
DROP POLICY IF EXISTS map_labels_delete_own ON public.map_labels;
CREATE POLICY map_labels_delete_own ON public.map_labels FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS map_labels_insert_own ON public.map_labels;
CREATE POLICY map_labels_insert_own ON public.map_labels FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS map_labels_select_public_or_own ON public.map_labels;
CREATE POLICY map_labels_select_public_or_own ON public.map_labels FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND ((maps.is_public = true) OR (maps.user_id = (select auth.uid())))))));

DROP POLICY IF EXISTS map_labels_update_own ON public.map_labels;
CREATE POLICY map_labels_update_own ON public.map_labels FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = (select auth.uid()))))));

-- map_tags
DROP POLICY IF EXISTS map_tags_delete_own ON public.map_tags;
CREATE POLICY map_tags_delete_own ON public.map_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS map_tags_insert_own ON public.map_tags;
CREATE POLICY map_tags_insert_own ON public.map_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = (select auth.uid()))))));

-- maps
DROP POLICY IF EXISTS maps_delete_own ON public.maps;
CREATE POLICY maps_delete_own ON public.maps FOR DELETE TO authenticated USING (((user_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text))))));

DROP POLICY IF EXISTS maps_insert_own ON public.maps;
CREATE POLICY maps_insert_own ON public.maps FOR INSERT TO authenticated WITH CHECK (((user_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text))))));

DROP POLICY IF EXISTS maps_select_public_or_own ON public.maps;
CREATE POLICY maps_select_public_or_own ON public.maps FOR SELECT USING (((is_public = true) OR (((select auth.uid()) IS NOT NULL) AND (user_id = (select auth.uid())))));

DROP POLICY IF EXISTS maps_update_own ON public.maps;
CREATE POLICY maps_update_own ON public.maps FOR UPDATE TO authenticated USING ((user_id = (select auth.uid()))) WITH CHECK (((user_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text))))));

-- master_spot_favorites
DROP POLICY IF EXISTS master_spot_favorites_delete_own ON public.master_spot_favorites;
CREATE POLICY master_spot_favorites_delete_own ON public.master_spot_favorites FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS master_spot_favorites_insert_own ON public.master_spot_favorites;
CREATE POLICY master_spot_favorites_insert_own ON public.master_spot_favorites FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS master_spot_favorites_select_own ON public.master_spot_favorites;
CREATE POLICY master_spot_favorites_select_own ON public.master_spot_favorites FOR SELECT USING (((select auth.uid()) = user_id));

-- notifications
DROP POLICY IF EXISTS notifications_delete_own ON public.notifications;
CREATE POLICY notifications_delete_own ON public.notifications FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
CREATE POLICY notifications_select_own ON public.notifications FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
CREATE POLICY notifications_update_own ON public.notifications FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- reports
DROP POLICY IF EXISTS reports_insert_own ON public.reports;
CREATE POLICY reports_insert_own ON public.reports FOR INSERT TO authenticated WITH CHECK (((select auth.uid()) = reporter_id));

DROP POLICY IF EXISTS reports_select_own ON public.reports;
CREATE POLICY reports_select_own ON public.reports FOR SELECT TO authenticated USING (((select auth.uid()) = reporter_id));

-- schedules
DROP POLICY IF EXISTS schedules_delete_own ON public.schedules;
CREATE POLICY schedules_delete_own ON public.schedules FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS schedules_insert_own ON public.schedules;
CREATE POLICY schedules_insert_own ON public.schedules FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS schedules_select_own ON public.schedules;
CREATE POLICY schedules_select_own ON public.schedules FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS schedules_update_own ON public.schedules;
CREATE POLICY schedules_update_own ON public.schedules FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- search_history
DROP POLICY IF EXISTS search_history_delete_own ON public.search_history;
CREATE POLICY search_history_delete_own ON public.search_history FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS search_history_insert_own ON public.search_history;
CREATE POLICY search_history_insert_own ON public.search_history FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS search_history_select_own ON public.search_history;
CREATE POLICY search_history_select_own ON public.search_history FOR SELECT USING (((select auth.uid()) = user_id));

-- spot_shorts
DROP POLICY IF EXISTS spot_shorts_delete_own ON public.spot_shorts;
CREATE POLICY spot_shorts_delete_own ON public.spot_shorts FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS spot_shorts_insert_own ON public.spot_shorts;
CREATE POLICY spot_shorts_insert_own ON public.spot_shorts FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS spot_shorts_select_own ON public.spot_shorts;
CREATE POLICY spot_shorts_select_own ON public.spot_shorts FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS spot_shorts_update_own ON public.spot_shorts;
CREATE POLICY spot_shorts_update_own ON public.spot_shorts FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- spot_tags
DROP POLICY IF EXISTS spot_tags_delete_own ON public.spot_tags;
CREATE POLICY spot_tags_delete_own ON public.spot_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = (select auth.uid()))))));

DROP POLICY IF EXISTS spot_tags_insert_own ON public.spot_tags;
CREATE POLICY spot_tags_insert_own ON public.spot_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = (select auth.uid()))))));

-- system_announcement_reads
DROP POLICY IF EXISTS system_announcement_reads_delete_own ON public.system_announcement_reads;
CREATE POLICY system_announcement_reads_delete_own ON public.system_announcement_reads FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS system_announcement_reads_insert_own ON public.system_announcement_reads;
CREATE POLICY system_announcement_reads_insert_own ON public.system_announcement_reads FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS system_announcement_reads_select_own ON public.system_announcement_reads;
CREATE POLICY system_announcement_reads_select_own ON public.system_announcement_reads FOR SELECT USING (((select auth.uid()) = user_id));

-- terms_agreements
DROP POLICY IF EXISTS terms_agreements_insert_own ON public.terms_agreements;
CREATE POLICY terms_agreements_insert_own ON public.terms_agreements FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS terms_agreements_select_own ON public.terms_agreements;
CREATE POLICY terms_agreements_select_own ON public.terms_agreements FOR SELECT USING (((select auth.uid()) = user_id));

-- user_notification_settings
DROP POLICY IF EXISTS user_notification_settings_insert_own ON public.user_notification_settings;
CREATE POLICY user_notification_settings_insert_own ON public.user_notification_settings FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS user_notification_settings_select_own ON public.user_notification_settings;
CREATE POLICY user_notification_settings_select_own ON public.user_notification_settings FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS user_notification_settings_update_own ON public.user_notification_settings;
CREATE POLICY user_notification_settings_update_own ON public.user_notification_settings FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- user_preferences
DROP POLICY IF EXISTS user_preferences_insert_own ON public.user_preferences;
CREATE POLICY user_preferences_insert_own ON public.user_preferences FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS user_preferences_select_own ON public.user_preferences;
CREATE POLICY user_preferences_select_own ON public.user_preferences FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS user_preferences_update_own ON public.user_preferences;
CREATE POLICY user_preferences_update_own ON public.user_preferences FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- user_spots
DROP POLICY IF EXISTS user_spots_delete_own ON public.user_spots;
CREATE POLICY user_spots_delete_own ON public.user_spots FOR DELETE TO authenticated USING (((user_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text))))));

DROP POLICY IF EXISTS user_spots_insert_own_with_limit ON public.user_spots;
CREATE POLICY user_spots_insert_own_with_limit ON public.user_spots FOR INSERT TO authenticated WITH CHECK (((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = (select auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text)))) AND ((public.is_user_premium((select auth.uid())) AND (public.count_user_spots_in_map((select auth.uid()), map_id) < 100)) OR ((NOT public.is_user_premium((select auth.uid()))) AND (public.count_user_spots_in_map((select auth.uid()), map_id) < 30)))));

DROP POLICY IF EXISTS user_spots_select_public_or_own ON public.user_spots;
CREATE POLICY user_spots_select_public_or_own ON public.user_spots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND ((maps.is_public = true) OR (maps.user_id = (select auth.uid())))))));

DROP POLICY IF EXISTS user_spots_update_own ON public.user_spots;
CREATE POLICY user_spots_update_own ON public.user_spots FOR UPDATE TO authenticated USING ((user_id = (select auth.uid()))) WITH CHECK (((user_id = (select auth.uid())) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = (select auth.uid())) AND (users.status = 'active'::text))))));

-- users
DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users FOR INSERT TO authenticated WITH CHECK (((select auth.uid()) = id));

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING ((((select auth.uid()) = id) AND (status = 'active'::text))) WITH CHECK ((((select auth.uid()) = id) AND (status = 'active'::text)));

-- view_history
DROP POLICY IF EXISTS view_history_delete_own ON public.view_history;
CREATE POLICY view_history_delete_own ON public.view_history FOR DELETE USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS view_history_insert_own ON public.view_history;
CREATE POLICY view_history_insert_own ON public.view_history FOR INSERT WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS view_history_select_own ON public.view_history;
CREATE POLICY view_history_select_own ON public.view_history FOR SELECT USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS view_history_update_own ON public.view_history;
CREATE POLICY view_history_update_own ON public.view_history FOR UPDATE USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- visits
DROP POLICY IF EXISTS visits_select_own ON public.visits;
CREATE POLICY visits_select_own ON public.visits FOR SELECT USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS visits_insert_own ON public.visits;
CREATE POLICY visits_insert_own ON public.visits FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS visits_update_own ON public.visits;
CREATE POLICY visits_update_own ON public.visits FOR UPDATE TO authenticated USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS visits_delete_own ON public.visits;
CREATE POLICY visits_delete_own ON public.visits FOR DELETE TO authenticated USING ((user_id = (select auth.uid())));

COMMIT;
