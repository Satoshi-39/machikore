# Machikore データベース設計書

最終更新: 2025-12-21

## 概要

Machikoreは地域情報を扱うアプリケーションです。

**関連ドキュメント:**
- [DATABASE_TABLES.md](./DATABASE_TABLES.md) - 全テーブル詳細定義
- [DATABASE_RLS.md](./DATABASE_RLS.md) - Row Level Security ポリシー
- [DATABASE_INDEXES.md](./DATABASE_INDEXES.md) - インデックス定義
- [DATABASE_FUNCTIONS.md](./DATABASE_FUNCTIONS.md) - Functions & Triggers

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

## ER図（簡易版）

```
continents
    └── countries
            └── regions
                    └── prefectures
                            └── cities
                                    └── machi
                                            ├── master_spots
                                            ├── user_spots
                                            └── visits
```

---

## テーブル一覧

### 地理マスターデータ（8テーブル）

| テーブル | 説明 |
|---------|------|
| continents | 大陸 |
| countries | 国 |
| regions | 地方 |
| prefectures | 都道府県 |
| cities | 市区町村 |
| machi | 街（駅周辺エリア） |
| transport_hubs | 交通拠点（駅・空港） |
| admin_boundaries | 行政境界（GIS） |

### ユーザー関連（3テーブル）

| テーブル | 説明 |
|---------|------|
| users | ユーザー |
| follows | フォロー関係 |
| user_notification_settings | 通知設定 |

### マップ関連（5テーブル）

| テーブル | 説明 |
|---------|------|
| maps | マップ |
| map_labels | マップラベル定義 |
| map_tags | マップとタグの関連 |
| tags | タグマスター |
| categories | カテゴリマスター |

### スポット関連（5テーブル）

| テーブル | 説明 |
|---------|------|
| master_spots | マスタースポット（Google Places連携） |
| master_spot_favorites | マスタースポットお気に入り |
| user_spots | ユーザースポット |
| spot_tags | スポットとタグの関連 |
| images | スポット画像 |

### エンゲージメント（9テーブル）

| テーブル | 説明 |
|---------|------|
| likes | いいね |
| bookmarks | ブックマーク |
| bookmark_folders | ブックマークフォルダ |
| comments | コメント |
| comment_likes | コメントへのいいね |
| view_history | 閲覧履歴 |
| visits | 街訪問記録 |
| schedules | 訪問予定 |

### コレクション（2テーブル）

| テーブル | 説明 |
|---------|------|
| collections | コレクション |
| collection_maps | コレクションとマップの関連 |

### 通知・システム（4テーブル）

| テーブル | 説明 |
|---------|------|
| notifications | 通知 |
| system_announcements | システムお知らせ |
| system_announcement_reads | お知らせ既読状態 |
| reports | 通報 |

### フィーチャー（3テーブル）

| テーブル | 説明 |
|---------|------|
| featured_carousel_items | カルーセル表示アイテム |
| category_featured_maps | カテゴリ注目マップ |
| category_featured_tags | カテゴリ注目タグ |

### 規約関連（2テーブル）

| テーブル | 説明 |
|---------|------|
| terms_versions | 利用規約バージョン管理 |
| terms_agreements | ユーザーの規約同意記録 |

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

### 非正規化の方針

JOINなしで表示するため、一部のテーブルで非正規化を採用：

| テーブル | 非正規化カラム | 理由 |
|---------|---------------|------|
| machi | prefecture_name, city_name | 詳細カード表示の高速化 |
| user_spots | prefecture_name, city_name, machi_name | 詳細カード表示の高速化 |

**原則:** 外部キーが NOT NULL の場合、対応する非正規化カラムも NOT NULL

---

## ID命名規則

### 地理データのID形式

すべての地理データのIDは `{country_code}_{name}` 形式で統一：

| テーブル | ID例 |
|---------|------|
| regions | `jp_kanto`, `kr_capital`, `th_central` |
| prefectures | `jp_tokyo`, `kr_seoul`, `th_bangkok` |
| cities | `jp_tokyo_shibuya`, `jp_osaka_naniwa` |
| machi | `jp_tokyo_shibuya_ebisu` |

### 翻訳データの形式

`name_translations` カラムのJSONB形式：

```json
{
  "en": "Tokyo",
  "cn": "东京",
  "tw": "東京"
}
```

- `en`: 英語
- `cn`: 簡体字（中国本土）
- `tw`: 繁体字（台湾）

---

## 外部キー関係図

```
users ─┬─< maps ─┬─< user_spots ─┬─> master_spots
       │         │               └─> machi
       │         ├─< map_labels
       │         ├─< map_tags ─> tags
       │         └─< likes
       │
       ├─< follows
       ├─< bookmarks
       ├─< comments ─< comment_likes
       ├─< notifications
       └─< visits ─> machi

continents ─< countries ─< regions ─< prefectures ─< cities ─< machi
```

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
