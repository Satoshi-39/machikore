# Machikore インデックス定義書

最終更新: 2025-12-21

全122インデックスの定義。

---

## 目次

- [ユニークインデックス](#ユニークインデックス)
- [テーブル別インデックス](#テーブル別インデックス)

---

## ユニークインデックス

重複を防ぐためのユニーク制約。

| テーブル | インデックス名 | カラム | 条件 |
|---------|---------------|--------|------|
| bookmarks | bookmarks_user_map_folder_unique | user_id, map_id, folder_id | map_id IS NOT NULL |
| bookmarks | bookmarks_user_spot_folder_unique | user_id, user_spot_id, folder_id | user_spot_id IS NOT NULL |
| likes | likes_user_map_unique | user_id, map_id | map_id IS NOT NULL |
| likes | likes_user_spot_unique | user_id, user_spot_id | user_spot_id IS NOT NULL |
| reports | idx_reports_unique_report | reporter_id, target_type, target_id | status IN ('pending', 'reviewing') |
| users | users_username_idx | username | - |

---

## テーブル別インデックス

### admin_boundaries

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_admin_boundaries_geom | geom | gist |
| idx_admin_boundaries_country_id | country_id | btree |
| idx_admin_boundaries_admin_level | admin_level | btree |
| idx_admin_boundaries_prefecture_id | prefecture_id | btree |
| idx_admin_boundaries_city_id | city_id | btree |
| idx_admin_boundaries_country_level | country_id, admin_level | btree |

### bookmark_folders

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_bookmark_folders_type | folder_type | btree |
| idx_bookmark_folders_user_id | user_id | btree |

### bookmarks

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_bookmarks_folder_id | folder_id | btree |
| idx_bookmarks_map_id | map_id | btree |
| idx_bookmarks_user_id | user_id | btree |
| idx_bookmarks_user_spot_id | user_spot_id | btree |

### categories

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_categories_display_order | display_order | btree |
| idx_categories_is_active | is_active | btree |

### category_featured_maps

| インデックス名 | カラム | 種別 | 条件 |
|---------------|--------|------|------|
| idx_category_featured_maps_active | is_active | btree | is_active = true |
| idx_category_featured_maps_category | category_id | btree | - |

### category_featured_tags

| インデックス名 | カラム | 種別 | 条件 |
|---------------|--------|------|------|
| idx_category_featured_tags_active | is_active | btree | is_active = true |
| idx_category_featured_tags_category | category_id | btree | - |

### cities

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_cities_prefecture_id | prefecture_id | btree |
| idx_cities_tile_id | tile_id | btree |

### collection_maps

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_collection_maps_collection_id | collection_id | btree |
| idx_collection_maps_map_id | map_id | btree |

### collections

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_collections_is_public | is_public | btree |
| idx_collections_user_id | user_id | btree |

### comment_likes

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_comment_likes_comment_id | comment_id | btree |
| idx_comment_likes_user_id | user_id | btree |

### comments

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_comments_created_at | created_at DESC | btree |
| idx_comments_depth | depth | btree |
| idx_comments_map_id | map_id | btree |
| idx_comments_parent_id | parent_id | btree |
| idx_comments_root_id | root_id | btree |
| idx_comments_user_id | user_id | btree |
| idx_comments_user_spot_id | user_spot_id | btree |

### featured_carousel_items

| インデックス名 | カラム | 種別 | 条件 |
|---------------|--------|------|------|
| idx_featured_carousel_items_active_order | is_active, display_order | btree | is_active = true |
| idx_featured_carousel_items_category | category_id | btree | - |

### follows

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_follows_followee_id | followee_id | btree |
| idx_follows_follower_id | follower_id | btree |

### images

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_images_user_spot_id | user_spot_id | btree |

### likes

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_likes_map_id | map_id | btree |
| idx_likes_user_id | user_id | btree |
| idx_likes_user_spot_id | user_spot_id | btree |

### machi

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_machi_city_id | city_id | btree |
| idx_machi_name | name | btree |
| idx_machi_osm_id | osm_id | btree |
| idx_machi_place_type | place_type | btree |
| idx_machi_prefecture_id | prefecture_id | btree |
| idx_machi_tile_id | tile_id | btree |

### map_labels

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_map_labels_map_id | map_id | btree |

### map_tags

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_map_tags_map_id | map_id | btree |
| idx_map_tags_tag_id | tag_id | btree |

### maps

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_maps_bookmarks_count | bookmarks_count DESC | btree |
| idx_maps_category_id | category_id | btree |
| idx_maps_created_at | created_at DESC | btree |
| idx_maps_is_article_public | is_article_public | btree |
| idx_maps_is_public | is_public | btree |
| idx_maps_user_id | user_id | btree |

### master_spot_favorites

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_master_spot_favorites_master_spot_id | master_spot_id | btree |
| idx_master_spot_favorites_user_id | user_id | btree |

### master_spots

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_master_spots_google_place_id | google_place_id | btree |
| idx_master_spots_location | latitude, longitude | btree |
| idx_master_spots_machi_id | machi_id | btree |
| idx_master_spots_name | name | btree |

### notifications

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_notifications_actor_id | actor_id | btree |
| idx_notifications_created_at | user_id, created_at DESC | btree |
| idx_notifications_is_read | user_id, is_read | btree |
| idx_notifications_type | type | btree |
| idx_notifications_user_id | user_id | btree |
| idx_notifications_user_spot_id | user_spot_id | btree |

### reports

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_reports_created_at | created_at DESC | btree |
| idx_reports_reporter_id | reporter_id | btree |
| idx_reports_status | status | btree |
| idx_reports_target | target_type, target_id | btree |

### schedules

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_schedules_machi_id | machi_id | btree |
| idx_schedules_scheduled_at | scheduled_at | btree |
| idx_schedules_user_id | user_id | btree |
| idx_schedules_user_scheduled | user_id, scheduled_at | btree |

### spot_tags

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_spot_tags_tag_id | tag_id | btree |
| idx_spot_tags_user_spot_id | user_spot_id | btree |

### system_announcement_reads

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_user_announcement_reads_announcement_id | announcement_id | btree |
| idx_user_announcement_reads_user_id | user_id | btree |

### system_announcements

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_system_announcements_published | is_active, published_at DESC | btree |

### tags

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_tags_name | name | btree |
| idx_tags_slug | slug | btree |
| idx_tags_usage_count | usage_count DESC | btree |

### terms_agreements

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_terms_agreements_agreed_at | agreed_at DESC | btree |
| idx_terms_agreements_user_agreed | user_id, agreed_at DESC | btree |
| idx_terms_agreements_user_id | user_id | btree |

### terms_versions

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_terms_versions_effective_at | effective_at DESC | btree |
| idx_terms_versions_type | type | btree |
| idx_terms_versions_type_effective | type, effective_at DESC | btree |

### transport_hubs

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_transport_hubs_location | latitude, longitude | btree |
| idx_transport_hubs_name | name | btree |
| idx_transport_hubs_osm_id | osm_id | btree |
| idx_transport_hubs_prefecture_id | prefecture_id | btree |
| idx_transport_hubs_tile_id | tile_id | btree |
| idx_transport_hubs_type | type | btree |
| idx_transport_hubs_type_subtype | type, subtype | btree |

### user_notification_settings

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_user_notification_settings_user_id | user_id | btree |

### user_spots

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_user_spots_bookmarks_count | bookmarks_count DESC | btree |
| idx_user_spots_created_at | created_at DESC | btree |
| idx_user_spots_label_id | label_id | btree |
| idx_user_spots_machi_id | machi_id | btree |
| idx_user_spots_map_id | map_id | btree |
| idx_user_spots_master_spot_id | master_spot_id | btree |
| idx_user_spots_prefecture_id | prefecture_id | btree |
| idx_user_spots_prefecture_map | prefecture_id, map_id | btree |
| idx_user_spots_user_id | user_id | btree |

### users

| インデックス名 | カラム | 種別 | 条件 |
|---------------|--------|------|------|
| idx_users_email | email | btree | - |
| idx_users_is_premium | is_premium | btree | - |
| idx_users_push_token | push_token | btree | push_token IS NOT NULL |
| idx_users_username | username | btree | - |

### view_history

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_view_history_map_id | map_id | btree |
| idx_view_history_user_id | user_id | btree |
| idx_view_history_user_viewed | user_id, viewed_at DESC | btree |
| idx_view_history_viewed_at | viewed_at DESC | btree |

### visits

| インデックス名 | カラム | 種別 |
|---------------|--------|------|
| idx_visits_machi_id | machi_id | btree |
| idx_visits_user_id | user_id | btree |
| idx_visits_user_machi | user_id, machi_id | btree |
| idx_visits_visited_at | visited_at DESC | btree |

---

## インデックス設計方針

1. **外部キーには必ずインデックス** - JOIN性能のため
2. **検索条件にはインデックス** - WHERE句で頻繁に使用されるカラム
3. **ソート順にはDESCインデックス** - created_at, visited_at など
4. **複合インデックス** - 複数カラムの組み合わせ検索用
5. **部分インデックス** - 特定条件のみ対象（WHERE句付き）
6. **GiSTインデックス** - 空間データ（PostGIS）用
