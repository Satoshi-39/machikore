# Machikore Row Level Security ポリシー

最終更新: 2025-12-21

Supabase の Row Level Security (RLS) ポリシー定義。

---

## RLS概要

### RLSが有効なテーブル

| テーブル | 説明 |
|---------|------|
| admin_boundaries | 行政境界 |
| bookmark_folders | ブックマークフォルダ |
| bookmarks | ブックマーク |
| categories | カテゴリ |
| category_featured_maps | カテゴリ注目マップ |
| category_featured_tags | カテゴリ注目タグ |
| collection_maps | コレクションマップ関連 |
| collections | コレクション |
| comment_likes | コメントいいね |
| comments | コメント |
| continents | 大陸 |
| countries | 国 |
| featured_carousel_items | カルーセル |
| follows | フォロー |
| images | 画像 |
| likes | いいね |
| map_labels | マップラベル |
| map_tags | マップタグ関連 |
| maps | マップ |
| master_spot_favorites | マスタースポットお気に入り |
| master_spots | マスタースポット |
| notifications | 通知 |
| prefectures | 都道府県 |
| regions | 地方 |
| reports | 通報 |
| schedules | 予定 |
| spot_tags | スポットタグ関連 |
| system_announcement_reads | お知らせ既読 |
| system_announcements | システムお知らせ |
| tags | タグ |
| terms_agreements | 規約同意 |
| transport_hubs | 交通拠点 |
| user_notification_settings | 通知設定 |
| user_spots | ユーザースポット |
| users | ユーザー |
| view_history | 閲覧履歴 |
| visits | 街訪問記録 |

---

## ポリシー詳細

### 公開データ（誰でも閲覧可能）

| テーブル | ポリシー | 条件 |
|---------|---------|------|
| admin_boundaries | SELECT | 無条件 |
| categories | SELECT | 無条件 |
| cities | SELECT | 無条件 |
| continents | SELECT | 無条件 |
| countries | SELECT | 無条件 |
| follows | SELECT | 無条件 |
| machi | SELECT | 無条件 |
| master_spots | SELECT | 無条件 |
| prefectures | SELECT | 無条件 |
| regions | SELECT | 無条件 |
| tags | SELECT | 無条件 |
| transport_hubs | SELECT | 無条件 |
| users | SELECT | 無条件 |

---

### 条件付き公開データ

#### system_announcements
```sql
SELECT: is_active = true AND (expires_at IS NULL OR expires_at > now())
```

#### featured_carousel_items
```sql
SELECT: is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at > now())
```

#### category_featured_maps / category_featured_tags
```sql
SELECT: is_active = true
```

#### maps
```sql
SELECT: is_public = true OR user_id = auth.uid()
```

#### collections
```sql
SELECT: is_public = true OR user_id = auth.uid()
```

#### collection_maps
```sql
SELECT: 親コレクションが公開または自分のもの
```

#### user_spots
```sql
SELECT: 親マップが公開または自分のもの
```

#### images
```sql
SELECT: 親スポットの親マップが公開または自分のもの
```

#### map_labels
```sql
SELECT: 親マップが公開または自分のもの
```

#### comments
```sql
SELECT: 認証済みユーザーは全て閲覧可
```

#### likes
```sql
SELECT: 無条件（認証済みユーザー）
```

#### comment_likes
```sql
SELECT: 無条件
```

---

### 自分のデータのみ

以下は `auth.uid() = user_id` または同等の条件で自分のデータのみアクセス可能：

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| bookmark_folders | ✅ | ✅ | ✅ | ✅ |
| bookmarks | ✅ | ✅ | - | ✅ |
| master_spot_favorites | ✅ | ✅ | - | ✅ |
| notifications | ✅ | - | ✅ | ✅ |
| reports | ✅ | ✅ | - | - |
| schedules | ✅ | ✅ | ✅ | ✅ |
| system_announcement_reads | ✅ | ✅ | - | ✅ |
| terms_agreements | ✅ | ✅ | - | - |
| user_notification_settings | ✅ | ✅ | ✅ | - |
| view_history | ✅ | ✅ | ✅ | ✅ |
| visits | ✅ | ✅ | ✅ | ✅ |

---

### 作成・編集権限

#### maps
```sql
INSERT: user_id = auth.uid()
UPDATE: user_id = auth.uid()
DELETE: user_id = auth.uid()
```

#### user_spots
```sql
INSERT: 親マップが自分のもの
UPDATE: user_id = auth.uid()
DELETE: user_id = auth.uid()
```

#### images
```sql
INSERT: 親スポットが自分のもの
DELETE: 親スポットが自分のもの
```

#### map_labels
```sql
INSERT: 親マップが自分のもの
UPDATE: 親マップが自分のもの
DELETE: 親マップが自分のもの
```

#### collections
```sql
ALL: user_id = auth.uid()
```

#### collection_maps
```sql
ALL: 親コレクションが自分のもの
```

#### comments
```sql
INSERT: user_id = auth.uid()
UPDATE: user_id = auth.uid()
DELETE: user_id = auth.uid()
```

#### likes
```sql
INSERT: user_id = auth.uid()
DELETE: user_id = auth.uid()
```

#### comment_likes
```sql
INSERT: user_id = auth.uid()
DELETE: user_id = auth.uid()
```

#### follows
```sql
INSERT: follower_id = auth.uid()
DELETE: follower_id = auth.uid()
```

#### users
```sql
INSERT: id = auth.uid()
UPDATE: id = auth.uid()
```

#### master_spots
```sql
INSERT: 認証済みユーザーは作成可
```

---

## 特殊なポリシー

### notifications
```sql
INSERT: 無条件（システムから作成可能）
```

### map_tags / spot_tags
```sql
INSERT: 親マップ/スポットが自分のもの
DELETE: 親マップ/スポットが自分のもの
SELECT: 無条件
```

---

## 設計方針

1. **マスターデータは公開** - 地理データ、カテゴリ、タグなどは誰でも閲覧可能
2. **ユーザーコンテンツは条件付き** - マップ、スポットは公開設定に応じてアクセス制御
3. **個人データは本人のみ** - ブックマーク、通知、履歴などは本人のみアクセス可能
4. **作成・編集は本人のみ** - 自分のデータのみ作成・編集・削除可能
5. **階層的な権限継承** - user_spots は親 maps の権限を継承
