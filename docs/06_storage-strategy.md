# 街コレ - ストレージ戦略ガイド

## 目次
- [1. ストレージ選択フローチャート](#1-ストレージ選択フローチャート)
- [2. データ分類表](#2-データ分類表)
- [3. 実装例](#3-実装例)
- [4. パフォーマンス最適化](#4-パフォーマンス最適化)
- [5. データマイグレーション](#5-データマイグレーション)
- [6. デバッグ・開発ツール](#6-デバッグ開発ツール)
- [7. エラーハンドリング](#7-エラーハンドリング)
- [8. ベストプラクティス](#8-ベストプラクティス)
- [9. チェックリスト](#9-チェックリスト)

---

## 1. ストレージ選択フローチャート

```
データを保存する必要がある
        │
        ▼
┌─────────────────────┐
│ 認証トークン or     │ YES
│ セキュリティ重要？  ├────────► SecureStore
└──────┬──────────────┘            (暗号化)
       │ NO
       ▼
┌─────────────────────┐
│ 大量の構造化データ？ │ YES
│ (リレーション有)    ├────────► SQLite
└──────┬──────────────┘            (高速クエリ)
       │ NO
       ▼
┌─────────────────────┐
│ UI状態 or 設定？    │ YES
│ (頻繁にアクセス)    ├────────► Zustand Persist
└──────┬──────────────┘            + AsyncStorage
       │ NO                        (最速)
       ▼
    メモリのみ
    (Zustand)
```

---

## 2. データ分類表

| データ種類 | ストレージ | 永続化 | 理由 |
|-----------|----------|--------|------|
| **認証トークン** | SecureStore | ✅ | セキュリティ必須 |
| **リフレッシュトークン** | SecureStore | ✅ | セキュリティ必須 |
| **訪問記録** | SQLite | ✅ | 大量データ、検索必要 |
| **投稿（テキスト）** | SQLite | ✅ | 大量データ、検索必要 |
| **画像パス** | SQLite | ✅ | リレーション有 |
| **画像ファイル** | FileSystem | ✅ | バイナリデータ |
| **下書き投稿** | Zustand Persist | ✅ | アプリ終了時も保持 |
| **ユーザー情報** | Zustand Persist | ✅ | 起動時すぐ表示 |
| **テーマ設定** | Zustand Persist | ✅ | UI状態 |
| **選択中タブ** | Zustand Persist | ✅ | UX向上 |
| **地図フィルター** | Zustand Persist | ✅ | UX向上 |
| **オンボーディング** | Zustand Persist | ✅ | 初回のみ表示 |
| **投稿一覧（キャッシュ）** | Zustand | ❌ | 起動時にSQLiteから読み込み |
| **訪問記録（キャッシュ）** | Zustand | ❌ | 起動時にSQLiteから読み込み |
| **同期キュー** | Zustand | ❌ | SQLiteで永続化済み |

---

## 3. 実装例

### 3.1 SecureStore（認証トークン）

**保存:**
```typescript
import * as SecureStore from 'expo-secure-store';

async function saveSession(session: Session) {
  await SecureStore.setItemAsync(
    'user_session',
    JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    })
  );
}
```

**読み込み:**
```typescript
async function loadSession(): Promise<Session | null> {
  const sessionStr = await SecureStore.getItemAsync('user_session');
  return sessionStr ? JSON.parse(sessionStr) : null;
}
```

**削除:**
```typescript
async function clearSession() {
  await SecureStore.deleteItemAsync('user_session');
}
```

---

### 3.2 SQLite（訪問記録・投稿）

**初期化:**
```typescript
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('machikore.db');

// テーブル作成
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    station_id TEXT NOT NULL,
    visit_count INTEGER DEFAULT 1,
    visited_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);
```

**データ保存:**
```typescript
async function saveVisit(visit: Visit) {
  await db.runAsync(
    'INSERT INTO visits (id, user_id, station_id, visit_count, visited_at) VALUES (?, ?, ?, ?, ?)',
    [visit.id, visit.user_id, visit.station_id, visit.visit_count, visit.visited_at]
  );
}
```

**データ読み込み:**
```typescript
async function loadVisits(userId: string): Promise<Visit[]> {
  const visits = await db.getAllAsync<Visit>(
    'SELECT * FROM visits WHERE user_id = ? ORDER BY visited_at DESC',
    [userId]
  );
  return visits;
}
```

---

### 3.3 FileSystem（画像ファイル）

**ディレクトリ作成:**
```typescript
import * as FileSystem from 'expo-file-system';

const IMAGE_DIR = `${FileSystem.documentDirectory}images/`;

async function ensureImageDirectory() {
  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
}
```

**画像保存:**
```typescript
async function saveImage(uri: string, postId: string): Promise<string> {
  await ensureImageDirectory();

  const fileName = `post_${postId}_${Date.now()}.jpg`;
  const destPath = `${IMAGE_DIR}${fileName}`;

  // カメラロールやギャラリーから選択した画像をコピー
  await FileSystem.copyAsync({
    from: uri,
    to: destPath,
  });

  // SQLiteに保存
  await db.runAsync(
    'INSERT INTO images (post_id, local_path) VALUES (?, ?)',
    [postId, destPath]
  );

  return destPath;
}
```

**画像読み込み:**
```typescript
async function loadImagePath(postId: string): Promise<string | null> {
  const result = await db.getFirstAsync<{ local_path: string }>(
    'SELECT local_path FROM images WHERE post_id = ?',
    [postId]
  );
  return result?.local_path || null;
}
```

**画像削除:**
```typescript
async function deleteImage(postId: string) {
  const imagePath = await loadImagePath(postId);

  if (imagePath) {
    // ファイルシステムから削除
    await FileSystem.deleteAsync(imagePath, { idempotent: true });

    // SQLiteから削除
    await db.runAsync('DELETE FROM images WHERE post_id = ?', [postId]);
  }
}
```

---

### 3.4 Zustand Persist（UI状態・設定）

**UIストア（全て永続化）:**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
  selectedTab: string;
  mapFilter: 'self' | 'friends' | 'all';
  theme: 'light' | 'dark';

  setSelectedTab: (tab: string) => void;
  setMapFilter: (filter: 'self' | 'friends' | 'all') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 初期値
      selectedTab: 'map',
      mapFilter: 'self',
      theme: 'light',

      // アクション
      setSelectedTab: (tab) => set({ selectedTab: tab }),
      setMapFilter: (filter) => set({ mapFilter: filter }),
      setTheme: (theme) => set({ theme: theme }),
    }),
    {
      name: 'ui-storage', // AsyncStorageのキー
      storage: createJSONStorage(() => AsyncStorage),
      // 全て永続化する場合、partializeは不要
    }
  )
);
```

**投稿ストア（下書きのみ永続化）:**
```typescript
interface PostState {
  posts: Post[];
  draftPosts: Post[];

  addPost: (post: Post) => void;
  saveDraft: (post: Post) => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set) => ({
      posts: [],
      draftPosts: [],

      addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
      saveDraft: (post) => set((state) => ({ draftPosts: [...state.draftPosts, post] })),
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        draftPosts: state.draftPosts, // 下書きのみ永続化
      }),
    }
  )
);
```

**使い方:**
```typescript
function MapScreen() {
  const { selectedTab, setSelectedTab } = useUIStore();

  // アプリ再起動時も前回の状態が復元される
  console.log('Selected tab:', selectedTab);

  return (
    <View>
      <Button onPress={() => setSelectedTab('map')}>Map</Button>
    </View>
  );
}
```

---

## 4. パフォーマンス最適化

### 4.1 SecureStoreの最適化

**❌ 悪い例:**
```typescript
// 大量のデータを保存（暗号化オーバーヘッド大）
await SecureStore.setItemAsync('all_data', JSON.stringify({
  user: largeUserObject,
  settings: settingsObject,
  posts: postsArray, // ❌ 大量データ
}));
```

**✅ 良い例:**
```typescript
// 必要最小限のデータのみ
await SecureStore.setItemAsync('session', JSON.stringify({
  access_token: session.access_token,
  refresh_token: session.refresh_token,
}));
```

---

### 4.2 Zustand Persistの最適化

**❌ 悪い例:**
```typescript
// 全てのデータを永続化（起動が遅くなる）
persist(
  (set) => ({
    posts: [], // 大量データ
    visits: [], // 大量データ
    theme: 'light',
  }),
  { name: 'store' } // 全て保存される
)
```

**✅ 良い例:**
```typescript
// 必要な部分のみ永続化
persist(
  (set) => ({
    posts: [], // SQLiteから読み込むので永続化不要
    visits: [], // SQLiteから読み込むので永続化不要
    theme: 'light',
  }),
  {
    name: 'store',
    partialize: (state) => ({ theme: state.theme }), // themeのみ永続化
  }
)
```

---

### 4.3 SQLiteの最適化

**インデックスを使用:**
```sql
-- 頻繁に検索するカラムにインデックス
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_station_id ON visits(station_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at DESC);
```

**バッチ挿入:**
```typescript
// ❌ 悪い例：1件ずつ挿入
for (const visit of visits) {
  await db.runAsync('INSERT INTO visits ...', [visit]);
}

// ✅ 良い例：トランザクションでバッチ挿入
await db.withTransactionAsync(async () => {
  for (const visit of visits) {
    await db.runAsync('INSERT INTO visits ...', [visit]);
  }
});
```

---

## 5. データマイグレーション

### 5.1 無料版→有料版移行

**画像のマイグレーション:**
```typescript
async function migrateImagesToSupabase(onProgress: (progress: number) => void) {
  // ローカルの画像一覧を取得
  const images = await db.getAllAsync<{ id: string; post_id: string; local_path: string }>(
    'SELECT * FROM images WHERE supabase_url IS NULL'
  );

  const total = images.length;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    try {
      // ローカル画像を読み込み
      const base64 = await FileSystem.readAsStringAsync(image.local_path, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Supabaseにアップロード
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(`${image.post_id}_${Date.now()}.jpg`, decode(base64), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      // 公開URLを取得
      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path);

      // SQLiteを更新
      await db.runAsync(
        'UPDATE images SET supabase_url = ? WHERE id = ?',
        [publicUrlData.publicUrl, image.id]
      );

      // 進捗を報告
      onProgress(((i + 1) / total) * 100);
    } catch (error) {
      console.error('Image migration failed:', image.id, error);
    }
  }
}
```

**使用例:**
```typescript
function UpgradeScreen() {
  const [progress, setProgress] = useState(0);

  const handleUpgrade = async () => {
    await migrateImagesToSupabase((p) => setProgress(p));
    alert('アップグレード完了！');
  };

  return (
    <View>
      <Button onPress={handleUpgrade}>有料版にアップグレード</Button>
      {progress > 0 && (
        <ProgressBar progress={progress / 100} />
      )}
    </View>
  );
}
```

---

## 6. デバッグ・開発ツール

### 6.1 SecureStoreのデバッグ

```typescript
// 開発環境でのみセッション情報を表示
if (__DEV__) {
  const session = await SecureStore.getItemAsync('user_session');
  console.log('Session:', session);
}
```

### 6.2 AsyncStorageのデバッグ

```typescript
// 全てのキーを表示
const keys = await AsyncStorage.getAllKeys();
console.log('AsyncStorage keys:', keys);

// 特定のキーの値を表示
const value = await AsyncStorage.getItem('ui-storage');
console.log('UI storage:', value);
```

### 6.3 SQLiteのデバッグ

```typescript
// 全テーブルを表示
const tables = await db.getAllAsync(
  "SELECT name FROM sqlite_master WHERE type='table'"
);
console.log('Tables:', tables);

// 特定テーブルのレコード数
const count = await db.getFirstAsync<{ count: number }>(
  'SELECT COUNT(*) as count FROM visits'
);
console.log('Visits count:', count?.count);
```

---

## 7. エラーハンドリング

### 7.1 SecureStore

```typescript
try {
  await SecureStore.setItemAsync('session', JSON.stringify(session));
} catch (error) {
  if (error.message.includes('Keychain')) {
    // キーチェーンへのアクセスエラー
    alert('セッションの保存に失敗しました。デバイスのロックを解除してください。');
  }
}
```

### 7.2 SQLite

```typescript
try {
  await db.runAsync('INSERT INTO visits ...');
} catch (error) {
  if (error.message.includes('UNIQUE constraint')) {
    // 重複エラー
    alert('既に訪問記録が存在します。');
  } else {
    console.error('Database error:', error);
  }
}
```

### 7.3 FileSystem

```typescript
try {
  await FileSystem.deleteAsync(imagePath);
} catch (error) {
  if (error.message.includes('not exist')) {
    // ファイルが存在しない（既に削除済み）
    console.warn('File already deleted:', imagePath);
  } else {
    throw error;
  }
}
```

---

## 8. ベストプラクティス

### 8.1 ストレージの使い分け

1. **認証情報は必ずSecureStore**
   - トークン、パスワードなど

2. **大量データはSQLite**
   - 訪問記録、投稿など

3. **UI状態はZustand Persist**
   - テーマ、選択中タブなど

4. **バイナリデータはFileSystem**
   - 画像、動画など

### 8.2 パフォーマンスのために

1. **必要最小限のデータのみ永続化**
2. **頻繁にアクセスするデータはメモリキャッシュ**
3. **バッチ処理でDB書き込みを減らす**
4. **適切なインデックス設定**

### 8.3 セキュリティのために

1. **機密情報は必ず暗号化**
2. **ローカルDBは定期的にバックアップ**
3. **ユーザーデータは削除可能に**

---

## 9. チェックリスト

実装時に以下を確認：

- [ ] 認証トークンはSecureStoreに保存している
- [ ] UI状態はZustand Persistで永続化している
- [ ] 大量データはSQLiteに保存している
- [ ] 画像はFileSystemに保存し、パスのみDBに記録している
- [ ] 不要なデータは永続化していない
- [ ] エラーハンドリングを実装している
- [ ] 開発環境でデバッグ情報を出力している
- [ ] 無料版→有料版の移行処理を実装している
