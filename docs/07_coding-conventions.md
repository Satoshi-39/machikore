# 街コレ - コーディング規約

## 目次
- [1. 概要](#1-概要)
- [2. ファイル命名規則](#2-ファイル命名規則)
- [3. 変数・関数の命名規則](#3-変数関数の命名規則)
- [4. TypeScript規約](#4-typescript規約)
- [5. React/React Native規約](#5-reactreact-native規約)
- [6. Hooks規約](#6-hooks規約)
- [7. インポート順序](#7-インポート順序)
- [8. コメント・ドキュメント](#8-コメントドキュメント)
- [9. エラーハンドリング](#9-エラーハンドリング)
- [10. テスト規約](#10-テスト規約)
- [11. ESLint/Prettier設定](#11-eslintprettier設定)
- [12. パフォーマンス](#12-パフォーマンス)

---

## 1. 概要

このドキュメントは、街コレプロジェクトにおけるコーディング規約を定義します。
統一されたコーディングスタイルにより、コードの可読性・保守性を向上させます。

### 1.1 基本方針

- **一貫性**: チーム全体で統一されたスタイル
- **可読性**: 誰が読んでも理解しやすいコード
- **保守性**: 変更・拡張しやすい設計
- **型安全性**: TypeScriptの型システムを最大限活用

---

## 2. ファイル命名規則

### 2.1 FSDに基づくファイル命名

#### コンポーネントファイル（UI）
- **形式**: PascalCase
- **拡張子**: `.tsx`

```
✅ 良い例:
src/entities/post/ui/PostCard.tsx
src/features/create-post/ui/PostForm.tsx
src/shared/ui/Button/Button.tsx

❌ 悪い例:
src/entities/post/ui/post-card.tsx      # kebab-caseは使わない
src/entities/post/ui/postCard.tsx       # camelCaseは使わない
```

#### ロジック・ユーティリティファイル
- **形式**: kebab-case
- **拡張子**: `.ts` または `.tsx`

```
✅ 良い例:
src/entities/visit/api/visit.query.ts
src/entities/visit/api/get-visits.ts
src/entities/visit/model/use-visit-store.ts
src/shared/lib/date-utils.ts

❌ 悪い例:
src/entities/visit/api/visitQuery.ts    # camelCaseは使わない
src/entities/visit/api/GetVisits.ts     # PascalCaseは使わない
```

#### 型定義ファイル
- **形式**: kebab-case
- **拡張子**: `.ts`

```
✅ 良い例:
src/shared/types/database.ts
src/shared/types/sqlite.ts
src/entities/visit/model/types.ts
```

#### テストファイル
- **形式**: 元のファイル名 + `.test.ts(x)`

```
✅ 良い例:
src/entities/visit/api/get-visits.test.ts
src/shared/lib/date-utils.test.ts
src/entities/post/ui/PostCard.test.tsx
```

### 2.2 ディレクトリ命名

#### FSD スライス（機能単位）
- **形式**: kebab-case
- **命名**: 目的を示す名前

```
✅ 良い例:
src/features/visit-station/         # 「街訪問」機能
src/features/create-post/           # 「投稿作成」機能
src/entities/visit/                 # 「訪問記録」エンティティ
src/widgets/post-timeline/          # 「投稿タイムライン」ウィジェット

❌ 悪い例:
src/features/visitStation/          # camelCaseは使わない
src/features/hooks/                 # 技術的な名前は避ける
src/features/components/            # 技術的な名前は避ける
```

#### FSD セグメント（技術的な分類）
- **形式**: 小文字（単語）
- **固定名**: `ui`, `model`, `api`, `lib`

```
✅ 良い例:
src/entities/visit/ui/
src/entities/visit/model/
src/entities/visit/api/
src/shared/lib/

❌ 悪い例:
src/entities/visit/UI/              # 大文字は使わない
src/entities/visit/components/      # componentsは使わない
src/entities/visit/hooks/           # hooksは使わない（modelを使う）
```

---

## 3. 変数・関数の命名規則

### 3.1 変数名

#### 通常の変数
- **形式**: camelCase
- **命名**: 意味のある名前

```typescript
✅ 良い例:
const userName = 'John';
const visitCount = 10;
const isSubscribed = true;
const stationList = [];

❌ 悪い例:
const name = 'John';                 // 曖昧
const n = 'John';                    // 短すぎる
const UserName = 'John';             // PascalCase（型名と混同）
const is_subscribed = true;          // snake_case
```

#### 定数
- **形式**: UPPER_SNAKE_CASE（グローバル定数）
- **形式**: camelCase（ローカル定数）

```typescript
✅ 良い例:
// グローバル定数（設定値）
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// ローカル定数（関数内）
function calculateTotal() {
  const taxRate = 0.1;
  const basePrice = 1000;
  return basePrice * (1 + taxRate);
}

❌ 悪い例:
const maxImageSize = 5 * 1024 * 1024;  // グローバルは大文字
const TAX_RATE = 0.1;                  // ローカルは小文字
```

#### Boolean変数
- **プレフィックス**: `is`, `has`, `should`, `can`

```typescript
✅ 良い例:
const isLoading = false;
const hasError = false;
const shouldShowModal = true;
const canEdit = true;

❌ 悪い例:
const loading = false;               // 状態が不明確
const error = false;                 // Boolean型が不明確
```

### 3.2 関数名

#### 通常の関数
- **形式**: camelCase
- **命名**: 動詞 + 名詞

```typescript
✅ 良い例:
function fetchVisits() {}
function createPost() {}
function deleteVisit(id: string) {}
function calculateTotalVisits() {}
function validateEmail(email: string) {}

❌ 悪い例:
function visits() {}                 // 動詞がない
function post() {}                   // 曖昧
function doIt() {}                   // 不明確
```

#### イベントハンドラー
- **プレフィックス**: `handle` + イベント名

```typescript
✅ 良い例:
function handleSubmit() {}
function handlePress() {}
function handleChange(value: string) {}
function handleDeleteVisit(id: string) {}

❌ 悪い例:
function onSubmit() {}               // onはProps用
function submit() {}                 // ハンドラー関数と不明確
```

#### コンポーネントProps のコールバック
- **プレフィックス**: `on` + イベント名

```typescript
✅ 良い例:
interface PostCardProps {
  onPress: () => void;
  onDelete: (id: string) => void;
  onLike: () => void;
}

❌ 悪い例:
interface PostCardProps {
  handlePress: () => void;           // handleは内部実装用
  press: () => void;                 // 曖昧
}
```

### 3.3 型・インターフェース名

#### インターフェース・型エイリアス
- **形式**: PascalCase
- **サフィックス**: 用途に応じて

```typescript
✅ 良い例:
interface User {
  id: string;
  name: string;
}

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

type VisitStatus = 'pending' | 'completed' | 'cancelled';

// Zustand Store
interface VisitStore {
  visits: Visit[];
  addVisit: (visit: Visit) => void;
}

❌ 悪い例:
interface IUser {}                   // Iプレフィックスは不要
interface userProps {}               // camelCase
type visitStatus = string;           // camelCase + 型が曖昧
```

#### ジェネリック型パラメータ
- **形式**: 大文字1文字 または 説明的な名前

```typescript
✅ 良い例:
function identity<T>(value: T): T {
  return value;
}

interface ApiResponse<TData> {
  data: TData;
  error: string | null;
}

❌ 悪い例:
function identity<t>(value: t): t {}  // 小文字
interface ApiResponse<data> {}        // 小文字
```

### 3.4 React コンポーネント名

- **形式**: PascalCase
- **命名**: 役割を明確に

```typescript
✅ 良い例:
function PostCard() {}
function VisitStationButton() {}
function UserAvatar() {}
function MonthCalendar() {}

❌ 悪い例:
function postCard() {}               // camelCase
function Card() {}                   // 汎用的すぎる
function Component1() {}             // 意味不明
```

---

## 4. TypeScript規約

### 4.1 型アノテーション

#### 明示的な型定義が必要なケース

```typescript
✅ 良い例:
// 関数の引数・戻り値は必ず型定義
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// 複雑なオブジェクトは型定義
interface CreatePostParams {
  content: string;
  stationId?: string;
  images: string[];
}

function createPost(params: CreatePostParams): Promise<Post> {
  // ...
}

❌ 悪い例:
// 型がない
function calculateTotal(price, quantity) {
  return price * quantity;
}

// any型
function createPost(params: any): any {
  // ...
}
```

#### 型推論に任せて良いケース

```typescript
✅ 良い例:
// 型推論が効くので不要
const userName = 'John';            // string
const age = 30;                     // number
const items = [1, 2, 3];           // number[]

// 戻り値の型は推論される
const getFullName = (first: string, last: string) => {
  return `${first} ${last}`;       // string と推論される
};

❌ 悪い例（冗長）:
const userName: string = 'John';
const age: number = 30;
const items: number[] = [1, 2, 3];
```

### 4.2 `any` の禁止

- **原則**: `any` 型は使用禁止
- **代替**: `unknown`、ジェネリクス、ユニオン型を使用

```typescript
✅ 良い例:
// unknown を使用
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

// ジェネリクスを使用
function identity<T>(value: T): T {
  return value;
}

// ユニオン型を使用
type ApiResponse =
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

❌ 悪い例:
function parseJSON(json: string): any {
  return JSON.parse(json);
}

function doSomething(data: any): any {
  // ...
}
```

### 4.3 `!` (Non-null assertion) の使用制限

- **原則**: できるだけ使用しない
- **代替**: Optional chaining `?.` や Nullish coalescing `??` を使用

```typescript
✅ 良い例:
const userName = user?.name ?? 'Guest';
const firstVisit = visits?.[0] ?? null;

if (user) {
  console.log(user.name);          // user がnullでないことを確認
}

❌ 悪い例:
const userName = user!.name;       // userがnullの可能性
const firstVisit = visits![0];     // visitsがundefinedの可能性
```

### 4.4 インターフェース vs 型エイリアス

**使い分けルール**:
- **インターフェース**: オブジェクトの形状定義（拡張可能）
- **型エイリアス**: ユニオン型、プリミティブ型、タプル

```typescript
✅ 良い例:
// オブジェクト → インターフェース
interface User {
  id: string;
  name: string;
}

// ユニオン型 → 型エイリアス
type Status = 'idle' | 'loading' | 'success' | 'error';

// タプル → 型エイリアス
type Coordinates = [number, number];

// 関数型 → 型エイリアス
type OnPress = () => void;

❌ 悪い例:
// ユニオン型をインターフェースで表現できない
interface Status {              // エラー
  status: 'idle' | 'loading';
}
```

---

## 5. React/React Native規約

### 5.1 コンポーネント定義

#### 関数コンポーネントの定義

```typescript
✅ 良い例:
// アロー関数 + 型定義
interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Text>{post.content}</Text>
    </Pressable>
  );
}

❌ 悪い例:
// FC型は使わない（推奨されなくなった）
export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  // ...
};

// propsの型定義がない
export function PostCard({ post, onPress }) {
  // ...
}
```

#### デフォルトProps

```typescript
✅ 良い例:
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  text,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  // ...
}

❌ 悪い例:
// defaultProps は使わない（非推奨）
Button.defaultProps = {
  variant: 'primary',
  disabled: false,
};
```

### 5.2 JSX記法

#### 条件分岐

```typescript
✅ 良い例:
// 条件付きレンダリング
{isLoading && <Loading />}
{error ? <ErrorMessage error={error} /> : <Content />}

// 複雑な条件は関数化
function renderContent() {
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return <Content data={data} />;
}

❌ 悪い例:
// 三項演算子のネスト（読みにくい）
{isLoading ? <Loading /> : error ? <Error /> : <Content />}

// Boolean変換が不明確
{posts.length && <PostList posts={posts} />}  // 0の時に0が表示される
```

#### スタイル指定

```typescript
✅ 良い例:
// StyleSheetを使用
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

❌ 悪い例:
// インラインスタイル（パフォーマンス低下）
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Title</Text>
</View>
```

---

## 6. Hooks規約

### 6.1 Hooks の命名

- **プレフィックス**: `use` + 機能名
- **形式**: camelCase

```typescript
✅ 良い例:
function useVisitStore() {}
function useVisits() {}
function useCreatePost() {}
function useDeleteVisit(visitId: string) {}

❌ 悪い例:
function getVisits() {}              // useプレフィックスがない
function UseVisits() {}              // PascalCase
function visits() {}                 // useプレフィックスがない
```

### 6.2 カスタムHooksの作成

```typescript
✅ 良い例:
// src/entities/visit/model/use-visit-store.ts
import { create } from 'zustand';

interface VisitStore {
  visits: Visit[];
  addVisit: (visit: Visit) => void;
  deleteVisit: (id: string) => void;
}

export const useVisitStore = create<VisitStore>((set) => ({
  visits: [],
  addVisit: (visit) => set((state) => ({
    visits: [...state.visits, visit]
  })),
  deleteVisit: (id) => set((state) => ({
    visits: state.visits.filter(v => v.id !== id)
  })),
}));

// src/entities/visit/api/use-visits.ts
import { useQuery } from '@tanstack/react-query';
import { visitQueries } from './visit.query';

export function useVisits() {
  return useQuery(visitQueries.all);
}
```

### 6.3 Hooks の呼び出し順序

```typescript
✅ 良い例:
function PostCard({ postId }: PostCardProps) {
  // 1. State hooks
  const [isLiked, setIsLiked] = useState(false);

  // 2. Context hooks
  const { user } = useUser();

  // 3. Custom hooks
  const { data: post } = usePost(postId);
  const { mutate: likePost } = useLikePost();

  // 4. Effects
  useEffect(() => {
    // ...
  }, []);

  // 5. Event handlers
  const handleLike = () => {
    likePost(postId);
    setIsLiked(true);
  };

  // 6. Render
  return <View>...</View>;
}

❌ 悪い例:
function PostCard({ postId }: PostCardProps) {
  const handleLike = () => {};       // ハンドラーが先

  const [isLiked, setIsLiked] = useState(false);  // hooksが後

  if (!postId) return null;          // 早期リターン（hooksの前）

  const { data } = usePost(postId);  // 条件付きhooks
}
```

### 6.4 useEffect の依存配列

```typescript
✅ 良い例:
// 依存配列を正しく指定
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 依存なし（マウント時のみ）
useEffect(() => {
  initializeApp();
}, []);

// クリーンアップ関数
useEffect(() => {
  const subscription = subscribeToUpdates();
  return () => {
    subscription.unsubscribe();
  };
}, []);

❌ 悪い例:
// 依存配列を省略（警告が出る）
useEffect(() => {
  fetchData(userId);
});

// 依存配列が不完全
useEffect(() => {
  fetchData(userId, stationId);
}, [userId]);                        // stationIdが抜けている

// eslint-disableで警告を無視
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

## 7. インポート順序

### 7.1 インポートのグループ化

```typescript
✅ 良い例:
// 1. React/React Native
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. 外部ライブラリ
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

// 3. 内部モジュール（絶対パス）
import { useUserStore } from '@/entities/user';
import { visitQueries } from '@/entities/visit/api';
import { Button } from '@/shared/ui/Button';

// 4. 相対パス
import { PostCard } from './PostCard';
import styles from './styles';

// 5. 型定義（type-only imports）
import type { Post, Visit } from '@/shared/types';

❌ 悪い例:
// 順序がバラバラ
import { Button } from '@/shared/ui/Button';
import { View } from 'react-native';
import type { Post } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
```

### 7.2 エイリアスパス

```typescript
✅ 良い例:
// tsconfig.jsonで設定したエイリアスを使用
import { useVisitStore } from '@/entities/visit';
import { Button } from '@/shared/ui/Button';
import { formatDate } from '@/shared/lib/date-utils';

❌ 悪い例:
// 相対パスの連続（可読性低下）
import { useVisitStore } from '../../../entities/visit';
import { Button } from '../../../shared/ui/Button';
```

---

## 8. コメント・ドキュメント

### 8.1 コメントの原則

- **コードで表現できることはコードで書く**
- コメントは「なぜ」を説明する（「何を」ではない）

```typescript
✅ 良い例:
// 訪問記録削除時、関連する投稿も連鎖削除される
// これはON DELETE CASCADEで自動的に行われる
async function deleteVisit(visitId: string) {
  await db.runAsync('DELETE FROM visits WHERE id = ?', [visitId]);
}

// ユーザー体験向上のため、オフライン時は同期キューに追加
if (!isOnline()) {
  addToSyncQueue({ type: 'delete_visit', id: visitId });
}

❌ 悪い例:
// 訪問を削除する
async function deleteVisit(visitId: string) {
  // SQLを実行
  await db.runAsync('DELETE FROM visits WHERE id = ?', [visitId]);
}
```

### 8.2 JSDoc

#### 公開API・複雑な関数には JSDoc を追加

```typescript
✅ 良い例:
/**
 * 訪問記録を作成し、自動生成投稿をタイムラインに追加する
 *
 * @param stationId - 訪問する街のID
 * @param visitedAt - 訪問日時（ISO8601形式）
 * @returns 作成された訪問記録
 * @throws {Error} 街が存在しない場合
 *
 * @example
 * ```ts
 * const visit = await createVisit('st_tokyo_001', new Date().toISOString());
 * ```
 */
async function createVisit(
  stationId: string,
  visitedAt: string
): Promise<Visit> {
  // ...
}

❌ 悪い例（不要なJSDoc）:
/**
 * ユーザー名を取得する
 * @param user - ユーザーオブジェクト
 * @returns ユーザー名
 */
function getUserName(user: User): string {
  return user.name;                  // 自明なので不要
}
```

### 8.3 TODOコメント

```typescript
✅ 良い例:
// TODO(yamada): サブスクリプション有効期限のチェックを追加 #123
// FIXME: オフライン時の同期処理で重複が発生する可能性
// HACK: react-queryのバグ回避のための一時的な処理

❌ 悪い例:
// TODO: あとで直す
// XXX
// 要修正
```

---

## 9. エラーハンドリング

### 9.1 エラーの型定義

```typescript
✅ 良い例:
// カスタムエラークラス
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// エラー型のユニオン
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

❌ 悪い例:
// エラーをanyで扱う
try {
  // ...
} catch (error: any) {
  console.log(error.message);
}
```

### 9.2 try-catch

```typescript
✅ 良い例:
async function createPost(content: string) {
  try {
    const post = await db.runAsync(
      'INSERT INTO posts (content) VALUES (?)',
      [content]
    );
    return { success: true, data: post };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create post:', error.message);
      return { success: false, error };
    }
    throw error;
  }
}

❌ 悪い例:
async function createPost(content: string) {
  try {
    const post = await db.runAsync(
      'INSERT INTO posts (content) VALUES (?)',
      [content]
    );
    return post;
  } catch (error) {
    console.log(error);                // エラー処理なし
  }
}
```

---

## 10. テスト規約

### 10.1 テストファイルの配置

```
✅ 良い例:
src/entities/visit/api/get-visits.ts
src/entities/visit/api/get-visits.test.ts

src/shared/lib/date-utils.ts
src/shared/lib/date-utils.test.ts
```

### 10.2 テストの構造

```typescript
✅ 良い例:
// AAA パターン (Arrange, Act, Assert)
describe('createVisit', () => {
  it('should create a visit record', async () => {
    // Arrange
    const stationId = 'st_tokyo_001';
    const visitedAt = new Date().toISOString();

    // Act
    const visit = await createVisit(stationId, visitedAt);

    // Assert
    expect(visit).toBeDefined();
    expect(visit.station_id).toBe(stationId);
  });

  it('should throw error if station does not exist', async () => {
    // Arrange
    const invalidStationId = 'invalid';

    // Act & Assert
    await expect(
      createVisit(invalidStationId, new Date().toISOString())
    ).rejects.toThrow('Station not found');
  });
});

❌ 悪い例:
test('visit', async () => {
  const visit = await createVisit('st_tokyo_001', new Date().toISOString());
  expect(visit).toBeDefined();
  const visit2 = await createVisit('invalid', new Date().toISOString());
  // 複数のテストケースを1つに詰め込んでいる
});
```

---

## 11. ESLint/Prettier設定

### 11.1 推奨設定

```json
// .eslintrc.json
{
  "extends": [
    "expo",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "error",
    "react/jsx-curly-brace-presence": ["error", {
      "props": "never",
      "children": "never"
    }],
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling"],
        "index",
        "type"
      ],
      "pathGroups": [
        {
          "pattern": "@/**",
          "group": "internal"
        }
      ],
      "alphabetize": {
        "order": "asc"
      }
    }]
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

---

## 12. パフォーマンス

### 12.1 React.memoの使用

```typescript
✅ 良い例:
// 再レンダリングを防ぐ
export const PostCard = React.memo(function PostCard({ post }: PostCardProps) {
  return <View>...</View>;
});

// 比較関数を指定
export const PostCard = React.memo(
  PostCard,
  (prevProps, nextProps) => prevProps.post.id === nextProps.post.id
);

❌ 悪い例:
// 全てをmemo化（過剰最適化）
export const SimpleText = React.memo(({ text }: { text: string }) => {
  return <Text>{text}</Text>;
});
```

### 12.2 useCallbackとuseMemo

```typescript
✅ 良い例:
function PostList({ posts }: PostListProps) {
  // コールバックをメモ化
  const handlePress = useCallback((id: string) => {
    navigation.navigate('PostDetail', { id });
  }, [navigation]);

  // 重い計算をメモ化
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [posts]);

  return (
    <FlatList
      data={sortedPosts}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={handlePress} />
      )}
    />
  );
}

❌ 悪い例:
// 毎回新しい関数を作成（再レンダリングの原因）
function PostList({ posts }: PostListProps) {
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onPress={() => navigation.navigate('PostDetail', { id: item.id })}
        />
      )}
    />
  );
}
```

---

## まとめ

このコーディング規約に従うことで：
- ✅ チーム全体で統一されたコードスタイル
- ✅ 可読性・保守性の向上
- ✅ バグの早期発見
- ✅ レビュー効率の向上

規約は必要に応じてチーム全体で議論し、更新していきます。
