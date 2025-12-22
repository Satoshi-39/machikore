# 型生成のベストプラクティス

## 基本原則

### ✅ データベーススキーマが真実の情報源（Single Source of Truth）

型定義は**データベーススキーマから自動生成**し、手動で無理やり変更しない。

```typescript
// ❌ 間違い: 型を無理やり変更
export type VisitRow = Omit<SupabaseVisitRow, 'visit_count'> & {
  visit_count: number; // NOT NULLでないのに強制
};

// ✅ 正しい: データベーススキーマをそのまま反映
export type VisitRow = ToSQLite<SupabaseVisitRow>; // visit_count: number | null
```

---

## 型と実態の乖離を防ぐ

### 問題のあるパターン

#### ❌ Omit/Pickで型を加工
```typescript
// スキーマ変更時に同期が取れなくなる
export type PostRow = Omit<SupabasePostRow, 'created_at'> & {
  created_at: string;
};
```

#### ❌ as/any で型アサーション
```typescript
// 型安全性を失う
const visit = data as VisitRow;
const count = (visit.visit_count as number) + 1;
```

#### ❌ 手書きで型を再定義
```typescript
// Supabaseスキーマと不一致が発生
export interface VisitRow {
  id: string;
  visit_count: number; // ← Supabaseは number | null
}
```

---

## 正しいアプローチ

### ✅ 1. スキーマを修正してから型を再生成

```sql
-- Supabaseで制約を変更
ALTER TABLE visits
ALTER COLUMN visit_count SET NOT NULL;

-- デフォルト値を設定
ALTER TABLE visits
ALTER COLUMN visit_count SET DEFAULT 1;
```

```bash
# 型を再生成（自動的に number になる）
npx supabase gen types typescript --project-id YOUR_ID > src/shared/types/supabase.generated.ts
```

### ✅ 2. アプリ側で適切にハンドリング

```typescript
// 型はそのまま使う
export type VisitRow = ToSQLite<SupabaseVisitRow>; // visit_count: number | null

// アプリ側で null チェック
const visitCount = visit.visit_count ?? 1;
const totalCount = visits.reduce((sum, v) => sum + (v.visit_count ?? 0), 0);
```

### ✅ 3. ローカル専用フィールドは拡張で追加

```typescript
// Supabaseにないフィールドをローカルで追加
export type PostRow = ToSQLite<SupabasePostRow> & {
  likes_count: number;      // ローカル専用
  comments_count: number;   // ローカル専用
  machi_id: string | null;  // ローカル専用
};
```

---

## 型生成のワークフロー

### 1. Supabaseスキーマを変更

```sql
ALTER TABLE visits ADD COLUMN new_field TEXT;
```

### 2. 型を自動生成

```bash
npm run types:generate
# または
npx supabase gen types typescript --project-id YOUR_ID > src/shared/types/supabase.generated.ts
```

### 3. SQLite用に変換（自動）

```typescript
// database.types.ts
export type VisitRow = ToSQLite<SupabaseVisitRow>;
//                     ^^^^^^^^
//                     boolean → 0 | 1 に自動変換
```

### 4. ローカル専用フィールドを追加（必要なら）

```typescript
export type PostRow = ToSQLite<SupabasePostRow> & {
  local_field: string; // ローカル専用
};
```

---

## チェックリスト

型定義を変更する前に：

- [ ] データベーススキーマで制約を変更できないか？
- [ ] NULL許容が必要な理由を説明できるか？
- [ ] 型アサーション（as, any）を使おうとしていないか？
- [ ] Omit/Pick を使って無理やり型を変更しようとしていないか？
- [ ] アプリ側でnullチェックする方が適切ではないか？

---

## まとめ

**原則**: 型を無理やり変えず、データベーススキーマを真実の情報源とする

- ✅ Supabaseスキーマから自動生成
- ✅ 変換ロジックは Utility Type で統一
- ✅ ローカル専用フィールドは `&` で拡張
- ❌ Omit/Pick/as で型を加工しない
- ❌ 手書きで型を再定義しない
