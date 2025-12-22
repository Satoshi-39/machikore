# Machikore テーブル定義書

最終更新: 2025-12-23

全40テーブルの詳細定義。

---

## 目次

### 地理マスターデータ
- [continents](#continents) - 大陸
- [countries](#countries) - 国
- [regions](#regions) - 地方
- [prefectures](#prefectures) - 都道府県
- [cities](#cities) - 市区町村
- [machi](#machi) - 街
- [transport_hubs](#transport_hubs) - 交通拠点
- [admin_boundaries](#admin_boundaries) - 行政境界（GIS）

### ユーザー関連
- [users](#users) - ユーザー
- [follows](#follows) - フォロー
- [user_notification_settings](#user_notification_settings) - 通知設定

### マップ関連
- [maps](#maps) - マップ
- [map_labels](#map_labels) - マップラベル
- [map_tags](#map_tags) - マップタグ関連
- [tags](#tags) - タグ
- [categories](#categories) - カテゴリ

### スポット関連
- [master_spots](#master_spots) - マスタースポット
- [master_spot_favorites](#master_spot_favorites) - マスタースポットお気に入り
- [user_spots](#user_spots) - ユーザースポット
- [spot_tags](#spot_tags) - スポットタグ関連
- [images](#images) - スポット画像

### エンゲージメント
- [likes](#likes) - いいね
- [bookmarks](#bookmarks) - ブックマーク
- [bookmark_folders](#bookmark_folders) - ブックマークフォルダ
- [comments](#comments) - コメント
- [comment_likes](#comment_likes) - コメントいいね
- [view_history](#view_history) - 閲覧履歴
- [visits](#visits) - 街訪問記録
- [schedules](#schedules) - 訪問予定

### コレクション
- [collections](#collections) - コレクション
- [collection_maps](#collection_maps) - コレクションマップ関連

### 通知・システム
- [notifications](#notifications) - 通知
- [system_announcements](#system_announcements) - システムお知らせ
- [system_announcement_reads](#system_announcement_reads) - お知らせ既読
- [reports](#reports) - 通報

### フィーチャー
- [featured_carousel_items](#featured_carousel_items) - カルーセル
- [category_featured_maps](#category_featured_maps) - カテゴリ注目マップ
- [category_featured_tags](#category_featured_tags) - カテゴリ注目タグ

### 規約関連
- [terms_versions](#terms_versions) - 規約バージョン
- [terms_agreements](#terms_agreements) - 規約同意

---

## 地理マスターデータ

### continents

大陸マスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 大陸ID (例: east_asia, europe) |
| name | text | NO | - | 大陸名（日本語） |
| name_kana | text | YES | - | 読み仮名 |
| display_order | integer | NO | 0 | 表示順序 |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### countries

国マスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 国コード (ISO 3166-1 alpha-2) |
| name | text | NO | - | 国名（日本語） |
| name_kana | text | YES | - | 読み仮名 |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| continent_id | text | NO | - | 大陸ID → continents.id |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### regions

地方マスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 地方ID |
| name | text | NO | - | 地方名（日本語） |
| name_kana | text | YES | - | 読み仮名 |
| display_order | integer | NO | - | 表示順序 |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| country_id | text | NO | - | 国コード → countries.id |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### prefectures

都道府県マスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 都道府県ID |
| name | text | NO | - | 都道府県名 |
| name_kana | text | YES | - | 読み仮名 |
| region_id | text | NO | - | 地方ID → regions.id |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### cities

市区町村マスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 市区町村ID |
| prefecture_id | text | NO | - | 都道府県ID → prefectures.id |
| name | text | NO | - | 市区町村名 |
| name_kana | text | YES | - | 読み仮名 |
| type | text | NO | - | 種別 ('区', '市', '町', '村') |
| latitude | double | YES | - | 緯度 |
| longitude | double | YES | - | 経度 |
| tile_id | text | YES | - | 地図タイルID |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**CHECK制約:** type は '区', '市', '町', '村' のいずれか

---

### machi

街マスターテーブル（駅周辺エリア）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 街ID |
| name | text | NO | - | 街名 |
| name_kana | text | YES | - | 読み仮名 |
| latitude | double | YES | - | 緯度 |
| longitude | double | YES | - | 経度 |
| prefecture_id | text | NO | - | 都道府県ID → prefectures.id |
| prefecture_name | text | NO | - | 都道府県名（非正規化） |
| prefecture_name_translations | jsonb | YES | - | 都道府県名の翻訳 |
| city_id | text | YES | - | 市区町村ID → cities.id |
| city_name | text | YES | - | 市区町村名（非正規化） |
| city_name_translations | jsonb | YES | - | 市区町村名の翻訳 |
| name_translations | jsonb | YES | - | 街名の翻訳 |
| osm_id | bigint | YES | - | OpenStreetMap ID |
| place_type | text | YES | - | 場所タイプ |
| tile_id | text | YES | - | 地図タイルID |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### transport_hubs

交通拠点テーブル（駅・空港・フェリー・バスターミナル）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | 交通拠点ID |
| osm_id | bigint | YES | - | OpenStreetMap ID |
| osm_type | text | YES | - | OSMタイプ (node/way/relation) |
| prefecture_id | text | NO | - | 都道府県ID → prefectures.id |
| city_id | text | YES | - | 市区町村ID → cities.id |
| type | text | NO | - | 種別 (station/airport/ferry_terminal/bus_terminal) |
| subtype | text | YES | - | サブタイプ (駅: jr/metro/toei/subway/private、空港: international/domestic/military/heliport) |
| name | text | NO | - | 名称 |
| name_kana | text | YES | - | 読み仮名 |
| name_translations | jsonb | YES | - | 多言語翻訳 {"en": "..."} |
| operator | text | YES | - | 運営会社 |
| network | text | YES | - | 路線網 |
| ref | text | YES | - | 参照コード（路線コード/空港コード） |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| tile_id | text | NO | - | 地図タイルID (0.25度グリッド、例: "559_142") |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

**CHECK制約:** type は 'station', 'airport', 'ferry_terminal', 'bus_terminal' のいずれか

---

### admin_boundaries

行政境界テーブル（GISデータ）。座標から行政区画を判定するためのポリゴンデータ。

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | integer | NO | - | ID |
| country_id | text | YES | - | 国ID → countries.id |
| admin_level | integer | YES | - | OSM admin_level (4=都道府県, 7=市区町村) |
| prefecture_id | text | YES | - | 都道府県ID → prefectures.id |
| city_id | text | YES | - | 市区町村ID → cities.id |
| geom | geometry | YES | - | ジオメトリ（PostGIS MultiPolygon） |
| created_at | timestamptz | NO | now() | 作成日時 |

**RPC関数:** `get_city_by_coordinate(lng, lat)` で座標からこのテーブルを検索

---

## ユーザー関連

### users

ユーザーテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ユーザーID |
| email | text | NO | - | メールアドレス |
| username | text | NO | - | ユーザー名（@識別子） |
| display_name | text | NO | - | 表示名 |
| avatar_url | text | YES | - | アバター画像URL |
| bio | text | YES | - | 自己紹介 |
| is_premium | boolean | YES | false | プレミアム会員フラグ |
| premium_started_at | timestamptz | YES | - | プレミアム開始日時 |
| premium_expires_at | timestamptz | YES | - | プレミアム終了日時 |
| push_token | text | YES | - | プッシュ通知トークン |
| push_token_updated_at | timestamptz | YES | - | トークン更新日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### follows

フォロー関係テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| follower_id | uuid | NO | - | フォローする側 → users.id |
| followee_id | uuid | NO | - | フォローされる側 → users.id |
| created_at | timestamptz | NO | now() | 作成日時 |

---

### user_notification_settings

ユーザー通知設定テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| likes_enabled | boolean | NO | true | いいね通知 |
| comments_enabled | boolean | NO | true | コメント通知 |
| follows_enabled | boolean | NO | true | フォロー通知 |
| system_enabled | boolean | NO | true | システム通知 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

## マップ関連

### maps

マップテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | マップID |
| user_id | uuid | NO | - | 作成者ID → users.id |
| name | text | NO | - | マップ名 |
| description | text | YES | - | 説明 |
| category_id | text | YES | - | カテゴリID → categories.id |
| is_public | boolean | NO | false | 公開フラグ |
| is_default | boolean | NO | false | デフォルトマップフラグ |
| is_official | boolean | NO | false | 公式マップフラグ |
| is_article_public | boolean | NO | false | 記事公開フラグ |
| thumbnail_url | text | YES | - | サムネイルURL |
| spots_count | integer | NO | 0 | スポット数 |
| likes_count | integer | NO | 0 | いいね数 |
| comments_count | integer | NO | 0 | コメント数 |
| bookmarks_count | integer | NO | 0 | ブックマーク数 |
| article_intro | jsonb | YES | - | 記事イントロ（ProseMirror JSON） |
| article_outro | jsonb | YES | - | 記事アウトロ（ProseMirror JSON） |
| show_label_chips | boolean | YES | false | ラベルチップ表示 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### map_labels

マップラベル定義テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ラベルID |
| map_id | uuid | NO | - | マップID → maps.id |
| name | text | NO | - | ラベル名 |
| color | text | NO | 'blue' | ラベル色 |
| sort_order | integer | NO | 0 | 表示順序 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### map_tags

マップとタグの関連テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| map_id | uuid | NO | - | マップID → maps.id |
| tag_id | uuid | NO | - | タグID → tags.id |
| created_at | timestamptz | NO | now() | 作成日時 |

---

### tags

タグマスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | タグID |
| name | text | NO | - | タグ名 |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| slug | text | NO | - | スラッグ（URL用） |
| usage_count | integer | NO | 0 | 使用回数 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### categories

カテゴリマスターテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | text | NO | - | カテゴリID |
| slug | text | NO | - | スラッグ |
| name | text | NO | - | カテゴリ名 |
| name_translations | jsonb | YES | - | 多言語翻訳 |
| icon | text | NO | - | アイコン |
| display_order | integer | NO | 0 | 表示順序 |
| is_active | boolean | NO | true | 有効フラグ |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

## スポット関連

### master_spots

マスタースポットテーブル（Google Places連携）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | スポットID |
| name | text | NO | - | スポット名 |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| machi_id | text | YES | - | 街ID → machi.id |
| google_place_id | text | YES | - | Google Place ID |
| google_formatted_address | text | YES | - | 完全住所 |
| google_short_address | text | YES | - | 短縮住所 |
| google_types | text[] | YES | - | Googleタイプ |
| google_phone_number | text | YES | - | 電話番号 |
| google_website_uri | text | YES | - | WebサイトURL |
| google_rating | double | YES | - | Google評価 |
| google_user_rating_count | integer | YES | - | 評価数 |
| favorites_count | integer | NO | 0 | お気に入り数 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**外部キー制約:**
- `machi_id` → machi.id **ON DELETE SET NULL** （machiが削除されてもmaster_spotsは保持）

---

### master_spot_favorites

マスタースポットお気に入りテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | uuid_generate_v4() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| master_spot_id | uuid | NO | - | マスタースポットID → master_spots.id |
| created_at | timestamptz | YES | now() | 作成日時 |

---

### user_spots

ユーザースポットテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | スポットID |
| user_id | uuid | NO | - | 作成者ID → users.id |
| map_id | uuid | NO | - | マップID → maps.id |
| master_spot_id | uuid | YES | - | マスタースポットID → master_spots.id |
| machi_id | text | YES | - | 街ID → machi.id |
| machi_name | text | YES | - | 街名（非正規化） |
| city_id | text | YES | - | 市区町村ID → cities.id |
| city_name | text | YES | - | 市区町村名（非正規化） |
| prefecture_id | text | YES | - | 都道府県ID → prefectures.id |
| prefecture_name | text | YES | - | 都道府県名（非正規化） |
| custom_name | text | NO | - | カスタム名 |
| description | text | YES | - | 説明 |
| latitude | double | NO | - | 緯度 |
| longitude | double | NO | - | 経度 |
| google_formatted_address | text | YES | - | 完全住所 |
| google_short_address | text | YES | - | 短縮住所 |
| images_count | integer | NO | 0 | 画像数 |
| likes_count | integer | NO | 0 | いいね数 |
| comments_count | integer | NO | 0 | コメント数 |
| bookmarks_count | integer | NO | 0 | ブックマーク数 |
| order_index | integer | NO | 0 | 表示順序 |
| color | text | YES | - | スポット色（非推奨） |
| spot_color | text | YES | 'blue' | スポット色 |
| label_id | uuid | YES | - | ラベルID → map_labels.id |
| article_content | jsonb | YES | - | 記事コンテンツ（ProseMirror JSON） |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**外部キー制約:**
- `user_id` → users.id **ON DELETE CASCADE**
- `map_id` → maps.id **ON DELETE CASCADE**
- `master_spot_id` → master_spots.id **ON DELETE CASCADE**
- `machi_id` → machi.id **ON DELETE SET NULL** （machiが削除されてもuser_spotsは保持）
- `prefecture_id` → prefectures.id **ON DELETE SET NULL**
- `label_id` → map_labels.id **ON DELETE SET NULL**

---

### spot_tags

スポットとタグの関連テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_spot_id | uuid | NO | - | スポットID → user_spots.id |
| tag_id | uuid | NO | - | タグID → tags.id |
| created_at | timestamptz | NO | now() | 作成日時 |

---

### images

スポット画像テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | 画像ID |
| user_spot_id | uuid | NO | - | スポットID → user_spots.id |
| local_path | text | YES | - | ローカルパス |
| cloud_path | text | YES | - | クラウドパス |
| width | integer | YES | - | 幅 |
| height | integer | YES | - | 高さ |
| file_size | integer | YES | - | ファイルサイズ |
| order_index | integer | YES | 0 | 表示順序 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

## エンゲージメント

### likes

いいねテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| map_id | uuid | YES | - | マップID → maps.id |
| user_spot_id | uuid | YES | - | スポットID → user_spots.id |
| created_at | timestamptz | NO | now() | 作成日時 |

**CHECK制約:** map_id または user_spot_id のどちらか一方のみ NOT NULL

---

### bookmarks

ブックマークテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| map_id | uuid | YES | - | マップID → maps.id |
| user_spot_id | uuid | YES | - | スポットID → user_spots.id |
| folder_id | uuid | YES | - | フォルダID → bookmark_folders.id |
| created_at | timestamptz | NO | now() | 作成日時 |

**CHECK制約:** map_id または user_spot_id のどちらか一方のみ NOT NULL

---

### bookmark_folders

ブックマークフォルダテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | フォルダID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| name | text | NO | - | フォルダ名 |
| order_index | integer | YES | 0 | 表示順序 |
| folder_type | text | NO | 'spots' | フォルダ種別 ('spots', 'maps') |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**CHECK制約:** folder_type は 'spots' または 'maps' のみ

---

### comments

コメントテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | コメントID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| map_id | uuid | YES | - | マップID → maps.id |
| user_spot_id | uuid | YES | - | スポットID → user_spots.id |
| content | text | NO | - | コメント内容 |
| parent_id | uuid | YES | - | 親コメントID（返信用） |
| root_id | uuid | YES | - | ルートコメントID（スレッド用） |
| depth | integer | NO | 0 | ネスト深度 |
| likes_count | integer | NO | 0 | いいね数 |
| replies_count | integer | NO | 0 | 返信数 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**CHECK制約:** map_id または user_spot_id のどちらか一方のみ NOT NULL

---

### comment_likes

コメントいいねテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| comment_id | uuid | NO | - | コメントID → comments.id |
| created_at | timestamptz | NO | now() | 作成日時 |

---

### view_history

マップ閲覧履歴テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| map_id | uuid | NO | - | マップID → maps.id |
| viewed_at | timestamptz | NO | now() | 最終閲覧日時 |
| view_count | integer | NO | 1 | 閲覧回数 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### visits

街訪問記録テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| machi_id | text | NO | - | 街ID → machi.id |
| visited_at | timestamptz | NO | - | 訪問日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### schedules

訪問予定テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | 予定ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| machi_id | text | NO | - | 街ID → machi.id |
| scheduled_at | timestamptz | NO | - | 予定日時 |
| title | text | NO | - | 予定タイトル |
| memo | text | YES | - | メモ |
| is_completed | boolean | NO | false | 完了フラグ |
| completed_at | timestamptz | YES | - | 完了日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

## コレクション

### collections

コレクションテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | コレクションID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| name | text | NO | - | コレクション名 |
| description | text | YES | - | 説明 |
| thumbnail_url | text | YES | - | サムネイルURL |
| is_public | boolean | NO | false | 公開フラグ |
| maps_count | integer | NO | 0 | マップ数 |
| order_index | integer | YES | 0 | 表示順序 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### collection_maps

コレクションとマップの関連テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| collection_id | uuid | NO | - | コレクションID → collections.id |
| map_id | uuid | NO | - | マップID → maps.id |
| order_index | integer | YES | 0 | 表示順序 |
| created_at | timestamptz | NO | now() | 作成日時 |

---

## 通知・システム

### notifications

通知テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | uuid_generate_v4() | 通知ID |
| user_id | uuid | NO | - | 受信ユーザーID → users.id |
| actor_id | uuid | YES | - | 実行ユーザーID → users.id |
| type | text | NO | - | 通知種別 |
| user_spot_id | uuid | YES | - | 関連スポットID |
| map_id | uuid | YES | - | 関連マップID |
| comment_id | uuid | YES | - | 関連コメントID |
| content | text | YES | - | 通知内容 |
| is_read | boolean | YES | false | 既読フラグ |
| created_at | timestamptz | YES | now() | 作成日時 |

**CHECK制約:**
- type は 'like_spot', 'like_map', 'comment_spot', 'comment_map', 'follow', 'system' のいずれか
- type と ID カラムの整合性:
  - like_spot, comment_spot → user_spot_id 必須
  - like_map, comment_map → map_id 必須
  - follow → actor_id 必須
  - system → ID不要

---

### system_announcements

システムお知らせテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | uuid_generate_v4() | お知らせID |
| title | text | NO | - | タイトル |
| content | text | NO | - | 内容 |
| type | text | YES | 'info' | 種別 |
| is_active | boolean | YES | true | 有効フラグ |
| published_at | timestamptz | YES | now() | 公開日時 |
| expires_at | timestamptz | YES | - | 有効期限 |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

---

### system_announcement_reads

お知らせ既読テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| announcement_id | uuid | NO | - | お知らせID → system_announcements.id |
| read_at | timestamptz | YES | now() | 既読日時 |

---

### reports

通報テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | 通報ID |
| reporter_id | uuid | NO | - | 通報者ID → users.id |
| target_type | report_target_type | NO | - | 対象種別 (map/spot/user/comment) |
| target_id | uuid | NO | - | 対象ID |
| reason | report_reason | NO | 'other' | 理由 |
| description | text | YES | - | 詳細説明 |
| status | report_status | NO | 'pending' | ステータス |
| admin_notes | text | YES | - | 管理者メモ |
| resolved_at | timestamptz | YES | - | 解決日時 |
| resolved_by | uuid | YES | - | 解決者ID |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**ENUM report_reason:** spam, inappropriate, harassment, misinformation, copyright, other
**ENUM report_status:** pending, reviewing, resolved, dismissed
**ENUM report_target_type:** map, spot, user, comment

---

## フィーチャー

### featured_carousel_items

発見タブカルーセルテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| title | text | NO | - | 表示タイトル |
| description | text | YES | - | サブタイトル |
| content | text | YES | - | 詳細ページ用本文 |
| image_url | text | NO | - | バナー画像URL |
| link_type | text | NO | 'tag' | リンク種別 (tag/map/user/url) |
| link_value | text | YES | - | リンク先の値 |
| category_id | text | YES | - | カテゴリID（NULLで全カテゴリ表示） |
| display_order | integer | NO | 0 | 表示順序 |
| is_active | boolean | NO | true | 公開フラグ |
| starts_at | timestamptz | YES | - | 表示開始日時 |
| ends_at | timestamptz | YES | - | 表示終了日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### category_featured_maps

カテゴリ別おすすめマップテーブル（運営選定）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| category_id | text | NO | - | カテゴリID → categories.id |
| map_id | uuid | NO | - | マップID → maps.id |
| display_order | integer | NO | 0 | 表示順序 |
| is_active | boolean | NO | true | 有効フラグ |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

### category_featured_tags

カテゴリ別おすすめタグテーブル（運営選定）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| category_id | text | NO | - | カテゴリID → categories.id |
| tag_id | uuid | NO | - | タグID → tags.id |
| display_order | integer | NO | 0 | 表示順序 |
| is_active | boolean | NO | true | 有効フラグ |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

---

## 規約関連

### terms_versions

利用規約バージョンテーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | バージョンID |
| type | text | NO | - | 種別 ('terms_of_service', 'privacy_policy') |
| version | text | NO | - | バージョン番号 |
| content | text | NO | - | 規約内容 |
| summary | text | YES | - | 変更概要 |
| effective_at | timestamptz | NO | - | 発効日 |
| is_current | boolean | NO | false | 現行バージョンフラグ |
| created_at | timestamptz | NO | now() | 作成日時 |

**CHECK制約:** type は 'terms_of_service' または 'privacy_policy' のみ

---

### terms_agreements

ユーザー規約同意テーブル

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | ID |
| user_id | uuid | NO | - | ユーザーID → users.id |
| terms_version_id | uuid | NO | - | 利用規約バージョンID → terms_versions.id |
| privacy_version_id | uuid | NO | - | プライバシーポリシーバージョンID → terms_versions.id |
| agreed_at | timestamptz | NO | now() | 同意日時 |
| ip_address | inet | YES | - | IPアドレス（法的証跡） |
| user_agent | text | YES | - | ユーザーエージェント（法的証跡） |
| created_at | timestamptz | NO | now() | 作成日時 |
