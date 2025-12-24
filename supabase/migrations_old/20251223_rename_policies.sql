-- ============================================================
-- RLSポリシー名を統一形式に変更するマイグレーション
-- ============================================================
-- 全テーブルのRLSポリシー名を `{table}_{operation}_{condition}` 形式に統一
-- 実行日: 2025-12-23

-- ============================================================
-- users
-- ============================================================
ALTER POLICY "Anyone can view users" ON public.users RENAME TO users_select_all;
ALTER POLICY "Users can insert own profile" ON public.users RENAME TO users_insert_own;
ALTER POLICY "Users can update their own profile" ON public.users RENAME TO users_update_own;

-- ============================================================
-- follows
-- ============================================================
ALTER POLICY "Follows are viewable by everyone" ON public.follows RENAME TO follows_select_all;
ALTER POLICY "Users can create their own follows" ON public.follows RENAME TO follows_insert_own;
ALTER POLICY "Users can delete their own follows" ON public.follows RENAME TO follows_delete_own;

-- ============================================================
-- view_history
-- ============================================================
ALTER POLICY "Users can delete their own history" ON public.view_history RENAME TO view_history_delete_own;
ALTER POLICY "Users can insert their own history" ON public.view_history RENAME TO view_history_insert_own;
ALTER POLICY "Users can update their own history" ON public.view_history RENAME TO view_history_update_own;
ALTER POLICY "Users can view their own history" ON public.view_history RENAME TO view_history_select_own;

-- ============================================================
-- maps
-- ============================================================
ALTER POLICY "Public maps are viewable by anyone" ON public.maps RENAME TO maps_select_public_or_own;
ALTER POLICY "Users can create their own maps" ON public.maps RENAME TO maps_insert_own;
ALTER POLICY "Users can delete their own maps" ON public.maps RENAME TO maps_delete_own;
ALTER POLICY "Users can update their own maps" ON public.maps RENAME TO maps_update_own;

-- ============================================================
-- map_tags
-- ============================================================
ALTER POLICY map_tags_delete_policy ON public.map_tags RENAME TO map_tags_delete_own;
ALTER POLICY map_tags_insert_policy ON public.map_tags RENAME TO map_tags_insert_own;
ALTER POLICY map_tags_select_policy ON public.map_tags RENAME TO map_tags_select_all;

-- ============================================================
-- map_labels
-- ============================================================
ALTER POLICY "Map labels are viewable if map is viewable" ON public.map_labels RENAME TO map_labels_select_public_or_own;
ALTER POLICY "Users can create labels in their own maps" ON public.map_labels RENAME TO map_labels_insert_own;
ALTER POLICY "Users can delete labels in their own maps" ON public.map_labels RENAME TO map_labels_delete_own;
ALTER POLICY "Users can update labels in their own maps" ON public.map_labels RENAME TO map_labels_update_own;

-- ============================================================
-- master_spots
-- ============================================================
ALTER POLICY "Anyone can view master spots" ON public.master_spots RENAME TO master_spots_select_all;
ALTER POLICY "Authenticated users can create master spots" ON public.master_spots RENAME TO master_spots_insert_authenticated;

-- ============================================================
-- master_spot_favorites
-- ============================================================
ALTER POLICY "Users can delete own favorites" ON public.master_spot_favorites RENAME TO master_spot_favorites_delete_own;
ALTER POLICY "Users can insert own favorites" ON public.master_spot_favorites RENAME TO master_spot_favorites_insert_own;
ALTER POLICY "Users can view own favorites" ON public.master_spot_favorites RENAME TO master_spot_favorites_select_own;

-- ============================================================
-- user_spots（重複ポリシーがあるため削除して再作成）
-- ============================================================
DROP POLICY IF EXISTS "User spots are viewable if map is public or own" ON public.user_spots;
DROP POLICY IF EXISTS "Users can create spots in their own maps" ON public.user_spots;
DROP POLICY IF EXISTS "Users can delete their own spots" ON public.user_spots;
DROP POLICY IF EXISTS "Users can update their own spots" ON public.user_spots;
DROP POLICY IF EXISTS user_spots_insert_with_limit ON public.user_spots;

CREATE POLICY user_spots_select_public_or_own ON public.user_spots
    FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = user_spots.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));
CREATE POLICY user_spots_insert_own ON public.user_spots
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY user_spots_update_own ON public.user_spots
    FOR UPDATE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY user_spots_delete_own ON public.user_spots
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY user_spots_insert_with_limit ON public.user_spots
    FOR INSERT WITH CHECK (((auth.uid() = user_id) AND ((public.is_user_premium(auth.uid()) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 100)) OR ((NOT public.is_user_premium(auth.uid())) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 30)))));

-- ============================================================
-- images
-- ============================================================
ALTER POLICY "Images are viewable if spot is public or own" ON public.images RENAME TO images_select_public_or_own;
ALTER POLICY "Users can create images in their own spots" ON public.images RENAME TO images_insert_own;
ALTER POLICY "Users can delete images in their own spots" ON public.images RENAME TO images_delete_own;

-- ============================================================
-- spot_tags
-- ============================================================
ALTER POLICY spot_tags_delete_policy ON public.spot_tags RENAME TO spot_tags_delete_own;
ALTER POLICY spot_tags_insert_policy ON public.spot_tags RENAME TO spot_tags_insert_own;
ALTER POLICY spot_tags_select_policy ON public.spot_tags RENAME TO spot_tags_select_all;

-- ============================================================
-- likes（重複ポリシーを削除してから統一）
-- ============================================================
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
DROP POLICY IF EXISTS "Users can create their own likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.likes;
DROP POLICY IF EXISTS likes_delete_policy ON public.likes;
DROP POLICY IF EXISTS likes_insert_policy ON public.likes;
DROP POLICY IF EXISTS likes_select_policy ON public.likes;

CREATE POLICY likes_select_all ON public.likes FOR SELECT USING (true);
CREATE POLICY likes_insert_own ON public.likes
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY likes_delete_own ON public.likes
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));

-- ============================================================
-- bookmark_folders
-- ============================================================
ALTER POLICY "Users can create their own bookmark folders" ON public.bookmark_folders RENAME TO bookmark_folders_insert_own;
ALTER POLICY "Users can delete their own bookmark folders" ON public.bookmark_folders RENAME TO bookmark_folders_delete_own;
ALTER POLICY "Users can update their own bookmark folders" ON public.bookmark_folders RENAME TO bookmark_folders_update_own;
ALTER POLICY "Users can view their own bookmark folders" ON public.bookmark_folders RENAME TO bookmark_folders_select_own;

-- ============================================================
-- bookmarks
-- ============================================================
ALTER POLICY "Users can create their own bookmarks" ON public.bookmarks RENAME TO bookmarks_insert_own;
ALTER POLICY "Users can delete their own bookmarks" ON public.bookmarks RENAME TO bookmarks_delete_own;
ALTER POLICY "Users can view their own bookmarks" ON public.bookmarks RENAME TO bookmarks_select_own;

-- ============================================================
-- comments
-- ============================================================
ALTER POLICY "Comments are viewable by everyone" ON public.comments RENAME TO comments_select_all;
ALTER POLICY "Users can create comments" ON public.comments RENAME TO comments_insert_own;
ALTER POLICY "Users can delete their own comments" ON public.comments RENAME TO comments_delete_own;
ALTER POLICY "Users can update their own comments" ON public.comments RENAME TO comments_update_own;

-- ============================================================
-- comment_likes（既に統一形式のためスキップ）
-- ============================================================

-- ============================================================
-- collections（汎用ポリシーを削除して個別に作成）
-- ============================================================
DROP POLICY IF EXISTS "Public collections are viewable by everyone" ON public.collections;
DROP POLICY IF EXISTS "Users can manage own collections" ON public.collections;

CREATE POLICY collections_select_public_or_own ON public.collections
    FOR SELECT USING (((is_public = true) OR (auth.uid() = user_id)));
CREATE POLICY collections_insert_own ON public.collections
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY collections_update_own ON public.collections
    FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY collections_delete_own ON public.collections
    FOR DELETE USING ((auth.uid() = user_id));

-- ============================================================
-- collection_maps（汎用ポリシーを削除して個別に作成）
-- ============================================================
DROP POLICY IF EXISTS "Collection maps viewable if collection is viewable" ON public.collection_maps;
DROP POLICY IF EXISTS "Users can manage maps in own collections" ON public.collection_maps;

CREATE POLICY collection_maps_select_public_or_own ON public.collection_maps
    FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND ((collections.is_public = true) OR (collections.user_id = auth.uid()))))));
CREATE POLICY collection_maps_insert_own ON public.collection_maps
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));
CREATE POLICY collection_maps_update_own ON public.collection_maps
    FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));
CREATE POLICY collection_maps_delete_own ON public.collection_maps
    FOR DELETE USING ((EXISTS ( SELECT 1 FROM public.collections WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));

-- ============================================================
-- user_notification_settings
-- ============================================================
ALTER POLICY "Users can insert own notification settings" ON public.user_notification_settings RENAME TO user_notification_settings_insert_own;
ALTER POLICY "Users can update own notification settings" ON public.user_notification_settings RENAME TO user_notification_settings_update_own;
ALTER POLICY "Users can view own notification settings" ON public.user_notification_settings RENAME TO user_notification_settings_select_own;

-- ============================================================
-- notifications
-- ============================================================
ALTER POLICY "System can insert notifications" ON public.notifications RENAME TO notifications_insert_system;
ALTER POLICY "Users can delete own notifications" ON public.notifications RENAME TO notifications_delete_own;
ALTER POLICY "Users can update own notifications" ON public.notifications RENAME TO notifications_update_own;
ALTER POLICY "Users can view own notifications" ON public.notifications RENAME TO notifications_select_own;

-- ============================================================
-- featured_carousel_items
-- ============================================================
ALTER POLICY featured_carousel_items_select_policy ON public.featured_carousel_items RENAME TO featured_carousel_items_select_active;

-- ============================================================
-- category_featured_maps
-- ============================================================
ALTER POLICY category_featured_maps_select_policy ON public.category_featured_maps RENAME TO category_featured_maps_select_active;

-- ============================================================
-- category_featured_tags
-- ============================================================
ALTER POLICY category_featured_tags_select_policy ON public.category_featured_tags RENAME TO category_featured_tags_select_active;

-- ============================================================
-- system_announcements
-- ============================================================
ALTER POLICY "Anyone can view active announcements" ON public.system_announcements RENAME TO system_announcements_select_active;

-- ============================================================
-- system_announcement_reads
-- ============================================================
ALTER POLICY "Users can delete own announcement reads" ON public.system_announcement_reads RENAME TO system_announcement_reads_delete_own;
ALTER POLICY "Users can insert own announcement reads" ON public.system_announcement_reads RENAME TO system_announcement_reads_insert_own;
ALTER POLICY "Users can view own announcement reads" ON public.system_announcement_reads RENAME TO system_announcement_reads_select_own;

-- ============================================================
-- terms_versions
-- ============================================================
ALTER POLICY terms_versions_select_policy ON public.terms_versions RENAME TO terms_versions_select_all;

-- ============================================================
-- terms_agreements
-- ============================================================
ALTER POLICY terms_agreements_insert_own_policy ON public.terms_agreements RENAME TO terms_agreements_insert_own;
ALTER POLICY terms_agreements_select_own_policy ON public.terms_agreements RENAME TO terms_agreements_select_own;

-- ============================================================
-- reports
-- ============================================================
ALTER POLICY "Users can create reports" ON public.reports RENAME TO reports_insert_own;
ALTER POLICY "Users can view own reports" ON public.reports RENAME TO reports_select_own;

-- ============================================================
-- schedules（既に統一形式のためスキップ）
-- ============================================================

-- ============================================================
-- tags
-- ============================================================
ALTER POLICY tags_insert_policy ON public.tags RENAME TO tags_insert_authenticated;
ALTER POLICY tags_select_policy ON public.tags RENAME TO tags_select_all;

-- ============================================================
-- categories
-- ============================================================
ALTER POLICY categories_select_policy ON public.categories RENAME TO categories_select_all;

-- ============================================================
-- 地理テーブル（既に統一形式のためスキップ）
-- ============================================================
-- admin_boundaries_select_policy, cities_select_policy, continents_select_policy,
-- countries_select_policy, machi_select_policy, prefectures_select_policy,
-- regions_select_policy, transport_hubs_select_policy
-- これらは _select_all に変更するか検討
ALTER POLICY admin_boundaries_select_policy ON public.admin_boundaries RENAME TO admin_boundaries_select_all;
ALTER POLICY cities_select_policy ON public.cities RENAME TO cities_select_all;
ALTER POLICY continents_select_policy ON public.continents RENAME TO continents_select_all;
ALTER POLICY countries_select_policy ON public.countries RENAME TO countries_select_all;
ALTER POLICY machi_select_policy ON public.machi RENAME TO machi_select_all;
ALTER POLICY prefectures_select_policy ON public.prefectures RENAME TO prefectures_select_all;
ALTER POLICY regions_select_policy ON public.regions RENAME TO regions_select_all;
ALTER POLICY transport_hubs_select_policy ON public.transport_hubs RENAME TO transport_hubs_select_all;
