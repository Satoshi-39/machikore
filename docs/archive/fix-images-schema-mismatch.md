# Imagesスキーマ乖離の修正手順

## 問題

Supabaseとローカルでimagesテーブルのスキーマが乖離している：

### Supabase（現状）
```
cloud_path, local_path, post_id, is_synced, synced_at, created_at, updated_at
❌ width, height, file_size, order_index が存在しない
```

### SQLite（ローカル）
```
cloud_path, local_path, post_id, is_synced, synced_at, created_at, updated_at
✅ width, height, file_size, order_index が存在する
```

## 修正手順

### 1. Supabaseにカラムを追加

Supabase Dashboard → SQL Editor で以下を実行：

```sql
-- docs/supabase-images-migration.sql を実行
ALTER TABLE images ADD COLUMN IF NOT EXISTS width INTEGER;
ALTER TABLE images ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE images ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE images ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;
```

### 2. 型定義を再生成

```bash
npm run types:generate
```

### 3. database.types.ts を修正

```typescript
// Before（拡張が必要だった）
export type ImageRow = ToSQLite<SupabaseImageRow> & {
  supabase_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  order_index: number;
};

// After（シンプルに！）
export type ImageRow = ToSQLite<SupabaseImageRow>;
export type ImageInsert = ToSQLite<SupabaseImageInsert>;
export type ImageUpdate = ToSQLite<SupabaseImageUpdate>;
```

### 4. posts.ts の修正

`supabase_url` を `cloud_path` に統一：

```typescript
// Before
image.supabase_url

// After
image.cloud_path
```

### 5. SQLite migrations.ts の修正

カラム名を統一：

```sql
-- Before
supabase_url TEXT,

-- After
cloud_path TEXT,
```

### 6. テスト

```bash
npm run typecheck
```

## 注意事項

- `supabase_url` → `cloud_path` へのリネームは既存データへの影響を確認してください
- ローカルデータベースの再構築が必要な場合があります
