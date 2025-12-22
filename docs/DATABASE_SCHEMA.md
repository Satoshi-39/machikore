# Machikore データベーススキーマ概要

最終更新: 2025-12-23

## 概要

Machikoreのデータベースは PostgreSQL (Supabase) を使用。全40テーブル、PostGIS拡張による地理空間データサポート。

**正式なスキーマ定義:**
- `supabase/migrations/000_initial_schema2.sql` - pg_dumpで生成された完全なスキーマ
- `supabase/schema/` - 可読性のためにテーブルごとに分割したDDL（参照用）

---

## 統計

| 項目 | 数 |
|-----|-----|
| テーブル数 | 40 |
| RLSポリシー数 | 94 |
| インデックス数 | 122 |
| Functions | 42 |
| Triggers | 37 |

---

## テーブル一覧

### 地理マスターデータ（8テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| continents | 大陸 | id, name, latitude, longitude |
| countries | 国 | id, name, continent_id |
| regions | 地方 | id, name, country_id |
| prefectures | 都道府県 | id, name, region_id |
| cities | 市区町村 | id, name, prefecture_id, type |
| machi | 街 | id, name, prefecture_id, city_id, tile_id |
| transport_hubs | 交通拠点 | id, name, type, subtype, tile_id |
| admin_boundaries | 行政境界(GIS) | id, geom, admin_level |

**階層構造:**
```
continents → countries → regions → prefectures → cities → machi
                                              ↓
                                        transport_hubs
```

### ユーザー関連（3テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| users | ユーザー | id, email, username, display_name, is_premium |
| follows | フォロー関係 | follower_id, followee_id |
| user_notification_settings | 通知設定 | user_id, push_enabled, email_enabled |

### マップ関連（5テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| categories | カテゴリ | id, slug, name, display_order |
| maps | マップ | id, user_id, name, category_id, is_public |
| map_labels | マップラベル | id, map_id, name, color |
| tags | タグ | id, name, slug, usage_count |
| map_tags | マップタグ関連 | map_id, tag_id |

### スポット関連（5テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| master_spots | マスタースポット | id, name, google_place_id, machi_id |
| master_spot_favorites | お気に入り | user_id, master_spot_id |
| user_spots | ユーザースポット | id, user_id, map_id, master_spot_id, custom_name |
| spot_tags | スポットタグ関連 | user_spot_id, tag_id |
| images | スポット画像 | id, user_spot_id, cloud_path |

### エンゲージメント（8テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| likes | いいね | user_id, map_id/user_spot_id |
| bookmarks | ブックマーク | user_id, map_id/user_spot_id, folder_id |
| bookmark_folders | フォルダ | user_id, name, folder_type |
| comments | コメント | user_id, map_id/user_spot_id, content |
| comment_likes | コメントいいね | user_id, comment_id |
| view_history | 閲覧履歴 | user_id, map_id, view_count |
| visits | 街訪問記録 | user_id, machi_id, visited_at |
| schedules | 訪問予定 | user_id, machi_id, scheduled_at |

### コレクション（2テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| collections | コレクション | id, user_id, name, is_public |
| collection_maps | マップ関連 | collection_id, map_id |

### 通知・システム（4テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| notifications | 通知 | user_id, actor_id, type |
| system_announcements | お知らせ | title, content, is_active |
| system_announcement_reads | 既読 | user_id, announcement_id |
| reports | 通報 | reporter_id, target_type, target_id |

### フィーチャー（3テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| featured_carousel_items | カルーセル | title, image_url, link_type |
| category_featured_maps | カテゴリ注目マップ | category_id, map_id |
| category_featured_tags | カテゴリ注目タグ | category_id, tag_id |

### 規約関連（2テーブル）

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| terms_versions | 規約バージョン | type, version, content, effective_at |
| terms_agreements | 同意履歴 | user_id, terms_version_id, agreed_at |

---

## 重要な外部キー制約

### ON DELETE CASCADE（親削除で子も削除）

| 子テーブル | 親テーブル | 説明 |
|-----------|-----------|------|
| user_spots | users | ユーザー削除でスポットも削除 |
| user_spots | maps | マップ削除でスポットも削除 |
| user_spots | master_spots | マスタースポット削除でスポットも削除 |
| images | user_spots | スポット削除で画像も削除 |
| likes | users/maps/user_spots | 親削除でいいねも削除 |
| comments | users/maps/user_spots | 親削除でコメントも削除 |
| bookmarks | users/maps/user_spots | 親削除でブックマークも削除 |

### ON DELETE SET NULL（親削除で参照をNULLに）

| 子テーブル | カラム | 親テーブル | 説明 |
|-----------|--------|-----------|------|
| master_spots | machi_id | machi | 街削除でもスポット保持 |
| user_spots | machi_id | machi | 街削除でもスポット保持 |
| user_spots | prefecture_id | prefectures | 都道府県削除でもスポット保持 |
| user_spots | label_id | map_labels | ラベル削除でもスポット保持 |

**注意:** `machi`や`prefectures`を削除しても、`user_spots`や`master_spots`のデータは失われません。

---

## RLSポリシー設計方針

1. **公開マスターデータ** - 誰でも閲覧可能
   - continents, countries, regions, prefectures, cities, machi, transport_hubs
   - categories, tags, admin_boundaries

2. **条件付き公開データ** - 公開設定に応じてアクセス制御
   - maps: `is_public = true OR user_id = auth.uid()`
   - user_spots: 親マップの公開設定を継承
   - collections: `is_public = true OR user_id = auth.uid()`

3. **個人データ** - 本人のみアクセス可能
   - notifications, bookmarks, bookmark_folders, view_history, visits, schedules

4. **作成・編集権限** - 本人のみ
   - 自分のマップ、スポット、コメントなどは本人のみ編集・削除可能

---

## 主要なRPC関数

### カウンター操作

| 関数名 | 説明 |
|--------|------|
| increment_map_spots_count | マップのスポット数+1 |
| increment_map_likes_count | マップのいいね数+1 |
| increment_user_spot_likes_count | スポットのいいね数+1 |
| record_map_view | マップ閲覧記録 |

### ユーザー管理

| 関数名 | 説明 |
|--------|------|
| is_user_premium | プレミアム会員判定 |
| update_user_premium_status | プレミアム状態更新 |
| get_notification_settings | 通知設定取得 |
| update_push_token | プッシュトークン更新 |

### 地理情報

| 関数名 | 説明 |
|--------|------|
| get_city_by_coordinate | 座標から行政区画特定（PostGIS使用） |
| get_popular_tags_by_category | カテゴリ別人気タグ取得 |

---

## トリガー

### 通知自動作成

| トリガー | テーブル | 説明 |
|---------|---------|------|
| on_map_like_create_notification | likes | マップいいねで通知作成 |
| on_user_spot_like_create_notification | likes | スポットいいねで通知作成 |
| on_map_comment_create_notification | comments | マップコメントで通知作成 |
| on_follow_create_notification | follows | フォローで通知作成 |

### カウンター自動更新

| トリガー | テーブル | 説明 |
|---------|---------|------|
| trigger_increment_comment_likes | comment_likes | コメントいいね数更新 |
| update_tag_usage_count_trigger | map_tags | タグ使用回数更新 |
| trigger_update_collection_maps_count | collection_maps | コレクションマップ数更新 |

### 制限・検証

| トリガー | テーブル | 説明 |
|---------|---------|------|
| enforce_spots_limit | user_spots | マップあたりスポット数100件制限 |
| trigger_cleanup_view_history | view_history | 閲覧履歴100件制限 |

### タイムスタンプ自動更新

全テーブルに `update_updated_at_column` トリガーが設定済み。

---

## インデックス設計方針

1. **外部キーには必ずインデックス** - JOIN性能のため
2. **検索条件にはインデックス** - WHERE句で頻繁に使用されるカラム
3. **ソート順にはDESCインデックス** - created_at, viewed_at など
4. **複合インデックス** - 複数カラムの組み合わせ検索用
5. **部分インデックス** - 特定条件のみ対象（WHERE句付き）
6. **GiSTインデックス** - 空間データ（PostGIS）用

---

## 設計方針

### NULL許容の基準

| カラム種別 | NULL | 理由 |
|-----------|------|------|
| 必須項目（name, custom_name等） | NO | ユーザーが必ず入力すべき値 |
| オプション項目（description, bio等） | YES | 「値がない」はNULLで表現 |
| 読み仮名（name_kana） | YES | 未入力の場合がある |
| 緯度経度（マスターデータ） | YES | 段階的データ取得に対応 |
| 緯度経度（スポット） | NO | 地図表示に必須 |
| 翻訳（name_translations） | YES | 翻訳がない場合はNULL |

### デフォルト値

- 空文字 `''` はデフォルトとして使用しない
- 「値がない」= NULL で統一
- カウンター系（likes_count等）のみ `0` をデフォルト

### ID命名規則

地理データのIDは `{country_code}_{name}` 形式：

| テーブル | ID例 |
|---------|------|
| regions | `jp_kanto`, `kr_capital` |
| prefectures | `jp_tokyo`, `kr_seoul` |
| cities | `jp_tokyo_shibuya` |
| machi | `jp_tokyo_shibuya_ebisu` |

---

## Enum型

### report_reason
- `spam`: スパム
- `inappropriate`: 不適切なコンテンツ
- `harassment`: 嫌がらせ
- `misinformation`: 誤情報
- `copyright`: 著作権侵害
- `other`: その他

### report_status
- `pending`: 保留中
- `reviewing`: 審査中
- `resolved`: 解決済み
- `dismissed`: 却下

### report_target_type
- `map`: マップ
- `spot`: スポット
- `user`: ユーザー
- `comment`: コメント

---

## ファイル構成

```
supabase/
├── migrations/
│   ├── 000_initial_schema2.sql    # 完全なスキーマ（pg_dump生成）
│   ├── 001_*.sql                  # 追加マイグレーション
│   └── 002_*.sql
└── schema/                        # 可読性のための分割DDL（参照用）
    ├── 00_common.sql              # 共通関数・拡張
    ├── 01_geography.sql           # 地理マスターデータ
    ├── 02_users.sql               # ユーザー関連
    ├── 03_maps.sql                # マップ関連
    ├── 04_spots.sql               # スポット関連
    ├── 05_engagement.sql          # エンゲージメント
    ├── 06_collections.sql         # コレクション
    ├── 07_notifications.sql       # 通知・システム
    ├── 08_featured.sql            # フィーチャー
    └── 09_terms.sql               # 規約関連
```

**注意:** `supabase/schema/`のファイルは参照用です。実際のマイグレーション適用には`migrations/`を使用してください。
