# Machikore Database Functions & Triggers

最終更新: 2025-12-21

PostgreSQL Functions と Triggers の定義。

---

## 目次

- [RPC Functions（クライアント呼び出し可能）](#rpc-functions)
- [Trigger Functions](#trigger-functions)
- [Triggers](#triggers)

---

## RPC Functions

クライアント（Supabase SDK）から `supabase.rpc()` で呼び出せる関数。

### 地理・位置情報

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| `get_city_by_coordinate` | lng, lat | TABLE(country_id, admin_level, prefecture_id, city_id) | 座標から行政区画を特定（PostGIS） |

### ユーザー・認証

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| `is_user_premium` | p_user_id | boolean | プレミアム会員かどうか |
| `update_user_premium_status` | p_user_id, p_is_premium, p_expires_at | void | プレミアム状態を更新 |
| `expire_premium_subscriptions` | - | integer | 期限切れのプレミアムを無効化 |
| `get_notification_settings` | - | user_notification_settings | 現在ユーザーの通知設定を取得 |
| `update_push_token` | token | void | プッシュ通知トークンを更新 |
| `clear_push_token` | - | void | プッシュ通知トークンをクリア |

### マップ・スポット

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| `count_user_spots_in_map` | p_user_id, p_map_id | integer | マップ内のスポット数を取得 |
| `record_map_view` | p_user_id, p_map_id | void | マップ閲覧を記録 |

### カウンター操作（increment/decrement）

| 関数名 | 引数 | 説明 |
|--------|------|------|
| `increment_map_spots_count` | map_id | マップのスポット数+1 |
| `decrement_map_spots_count` | map_id | マップのスポット数-1 |
| `increment_map_likes_count` | map_id | マップのいいね数+1 |
| `decrement_map_likes_count` | map_id | マップのいいね数-1 |
| `increment_map_comments_count` | map_id | マップのコメント数+1 |
| `decrement_map_comments_count` | map_id | マップのコメント数-1 |
| `increment_map_bookmarks_count` | p_map_id | マップのブックマーク数+1 |
| `decrement_map_bookmarks_count` | p_map_id | マップのブックマーク数-1 |
| `increment_user_spot_likes_count` | user_spot_id | スポットのいいね数+1 |
| `decrement_user_spot_likes_count` | user_spot_id | スポットのいいね数-1 |
| `increment_user_spot_comments_count` | user_spot_id | スポットのコメント数+1 |
| `decrement_user_spot_comments_count` | user_spot_id | スポットのコメント数-1 |
| `increment_user_spot_bookmarks_count` | user_spot_id | スポットのブックマーク数+1 |
| `decrement_user_spot_bookmarks_count` | user_spot_id | スポットのブックマーク数-1 |
| `increment_user_spot_images_count` | user_spot_id | スポットの画像数+1 |
| `decrement_user_spot_images_count` | user_spot_id | スポットの画像数-1 |
| `increment_master_spot_favorites_count` | master_spot_id | マスタースポットのお気に入り数+1 |
| `decrement_master_spot_favorites_count` | master_spot_id | マスタースポットのお気に入り数-1 |

### タグ

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| `get_popular_tags_by_category` | p_category_id, p_limit | TABLE | カテゴリ別人気タグを取得 |

### マイグレーション用（一時的）

| 関数名 | 説明 |
|--------|------|
| `migrate_maps_tags_to_table` | maps.tags を map_tags テーブルに移行 |
| `migrate_spots_tags_to_table` | user_spots.tags を spot_tags テーブルに移行 |

---

## Trigger Functions

トリガーから呼び出される関数。直接呼び出しは不可。

### タイムスタンプ更新

| 関数名 | 説明 |
|--------|------|
| `update_updated_at_column` | updated_at を現在時刻に更新 |
| `update_notification_settings_updated_at` | 通知設定の updated_at を更新 |
| `update_view_history_updated_at` | 閲覧履歴の updated_at を更新 |

### 通知作成

| 関数名 | 説明 |
|--------|------|
| `create_like_map_notification` | マップへのいいね通知を作成 |
| `create_like_spot_notification` | スポットへのいいね通知を作成 |
| `create_comment_map_notification` | マップへのコメント通知を作成 |
| `create_comment_spot_notification` | スポットへのコメント通知を作成 |
| `create_follow_notification` | フォロー通知を作成 |
| `send_push_notification` | プッシュ通知を送信（pg_net使用） |

### カウンター更新（自動）

| 関数名 | 説明 |
|--------|------|
| `increment_comment_likes_count` | コメントのいいね数+1 |
| `decrement_comment_likes_count` | コメントのいいね数-1 |
| `increment_comment_replies_count` | コメントの返信数+1 |
| `decrement_comment_replies_count` | コメントの返信数-1 |
| `update_collection_maps_count` | コレクションのマップ数を更新 |
| `update_tag_usage_count` | タグの使用回数を更新（map_tags） |
| `update_tag_usage_count_for_spots` | タグの使用回数を更新（spot_tags） |

### 制限チェック

| 関数名 | 説明 |
|--------|------|
| `check_spots_limit` | スポット数制限をチェック（INSERT時） |
| `check_spots_limit_on_update` | スポット数制限をチェック（UPDATE時） |

### クリーンアップ

| 関数名 | 説明 |
|--------|------|
| `cleanup_old_view_history` | 古い閲覧履歴を削除（100件超過分） |
| `create_default_notification_settings` | ユーザー作成時にデフォルト通知設定を作成 |

---

## Triggers

### 通知トリガー

| トリガー名 | テーブル | イベント | 条件 | 関数 |
|-----------|---------|---------|------|------|
| on_map_like_create_notification | likes | AFTER INSERT | map_id IS NOT NULL | create_like_map_notification |
| on_user_spot_like_create_notification | likes | AFTER INSERT | user_spot_id IS NOT NULL | create_like_spot_notification |
| on_map_comment_create_notification | comments | AFTER INSERT | map_id IS NOT NULL | create_comment_map_notification |
| on_user_spot_comment_create_notification | comments | AFTER INSERT | user_spot_id IS NOT NULL | create_comment_spot_notification |
| on_follow_create_notification | follows | AFTER INSERT | - | create_follow_notification |

### カウンタートリガー

| トリガー名 | テーブル | イベント | 関数 |
|-----------|---------|---------|------|
| trigger_increment_comment_likes | comment_likes | AFTER INSERT | increment_comment_likes_count |
| trigger_decrement_comment_likes | comment_likes | AFTER DELETE | decrement_comment_likes_count |
| trigger_increment_comment_replies | comments | AFTER INSERT | increment_comment_replies_count |
| trigger_decrement_comment_replies | comments | AFTER DELETE | decrement_comment_replies_count |
| trigger_update_collection_maps_count | collection_maps | AFTER INSERT/DELETE | update_collection_maps_count |
| update_tag_usage_count_trigger | map_tags | AFTER INSERT/DELETE | update_tag_usage_count |
| update_tag_usage_count_for_spots_trigger | spot_tags | AFTER INSERT/DELETE | update_tag_usage_count_for_spots |

### 制限・検証トリガー

| トリガー名 | テーブル | イベント | 関数 |
|-----------|---------|---------|------|
| enforce_spots_limit | user_spots | BEFORE INSERT | check_spots_limit |
| enforce_spots_limit_on_update | user_spots | BEFORE UPDATE | check_spots_limit_on_update |

### タイムスタンプトリガー

以下のテーブルに `update_updated_at_column` トリガーが設定済み：

- bookmark_folders
- categories
- category_featured_maps
- category_featured_tags
- cities
- collections
- comments
- countries
- featured_carousel_items
- images
- machi
- map_labels
- maps
- master_spots
- prefectures
- reports
- tags
- user_spots
- users

### その他

| トリガー名 | テーブル | イベント | 関数 |
|-----------|---------|---------|------|
| trigger_cleanup_view_history | view_history | AFTER INSERT/UPDATE | cleanup_old_view_history |
| trigger_create_default_notification_settings | users | AFTER INSERT | create_default_notification_settings |
| trigger_update_notification_settings_updated_at | user_notification_settings | BEFORE UPDATE | update_notification_settings_updated_at |
| trigger_update_view_history_updated_at | view_history | BEFORE UPDATE | update_view_history_updated_at |

---

## 設計方針

1. **カウンターは非正規化** - likes_count, comments_count などは集計ではなくカウンター管理
2. **increment/decrement は RPC** - アプリからは RPC 関数を呼び出してカウンター操作
3. **通知はトリガーで自動作成** - いいね、コメント、フォロー時に自動で通知レコード作成
4. **updated_at は自動更新** - 全テーブルでトリガーによる自動更新
5. **スポット数制限** - 無料ユーザーはマップあたりのスポット数に制限あり
