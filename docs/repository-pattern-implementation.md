# Repository Pattern & Offline-First Sync 実装サマリー

## 📋 実装完了内容

### ✅ 1. Repository Pattern（型安全なデータアクセス層）

**場所**: `src/shared/api/repositories/`

- **SQLite実装**: `sqlite/visit.repository.ts`
- **Supabase実装**: `supabase/visit.repository.ts`
- **インターフェース**: `src/entities/visit/model/repository.ts`

**特徴**:
- 統一されたエラーハンドリング（`RepositoryResult<T>`）
- 同期フラグの自動管理（`is_synced`）
- デフォルト値の自動設定
- インターフェースによる抽象化

### ✅ 2. Dependency Injection (DI)

**場所**: `src/shared/lib/repositories/repository-provider.tsx`

**役割**:
- リポジトリインスタンスをアプリ全体で利用可能に
- Singleton パターンでメモリ効率化
- `useVisitRepository()` でローカルリポジトリを取得

### ✅ 3. 同期ロジック

**場所**: `src/shared/lib/sync/`

**コンポーネント**:
- **SyncService**: バッチ処理による同期
- **SyncQueue**: 操作のキュー管理
- **Network Monitor**: ネットワーク状態の監視

**自動同期トリガー**:
- アプリ起動時
- ネットワーク復帰時
- アプリがフォアグラウンドに戻った時

### ✅ 4. バックグラウンド同期

**場所**: `src/shared/lib/sync/sync-provider.tsx`

**機能**:
- `useSync()` フックで同期状態を取得
- `triggerSync()` で手動同期
- 自動同期の管理

---

## 🧪 テスト方法

### 方法1: テストコンポーネントを使用

1. **テストページを追加**:

```bash
# app/(tabs)/test.tsx を作成
```

```tsx
import { RepositoryTest } from '@/features/dev/ui/RepositoryTest';

export default function TestPage() {
  return <RepositoryTest />;
}
```

2. **タブバーに追加** (`app/(tabs)/_layout.tsx`):

```tsx
<Tabs.Screen
  name="test"
  options={{
    title: 'Test',
    tabBarIcon: ({ color }) => <Icon name="flask" size={28} color={color} />,
  }}
/>
```

3. **アプリを起動してTestタブを開く**

### 方法2: コードで直接テスト

```tsx
import { useVisitRepository } from '@/shared/lib/repositories';
import { useSync } from '@/shared/lib/sync';

function MyComponent() {
  const visitRepo = useVisitRepository();
  const { isSyncing, triggerSync } = useSync();

  const testCreate = async () => {
    const result = await visitRepo.create({
      user_id: 'test-user',
      machi_id: 'test-machi',
      // visit_count, visited_at は省略可能
    });

    if (result.success) {
      console.log('✅ Created:', result.data.id);
      console.log('   is_synced:', result.data.is_synced); // 0 = 同期待ち
    } else {
      console.error('❌ Error:', result.error.message);
    }
  };

  const testFindAll = async () => {
    const result = await visitRepo.findAll({ limit: 10 });
    if (result.success) {
      console.log('✅ Found:', result.data.length, 'visits');
    }
  };

  const testSync = async () => {
    await triggerSync();
    console.log('✅ Sync triggered');
  };

  return (
    <View>
      <Button title="Create Visit" onPress={testCreate} />
      <Button title="Find All" onPress={testFindAll} />
      <Button title="Sync" onPress={testSync} />
      <Text>Syncing: {isSyncing ? 'Yes' : 'No'}</Text>
    </View>
  );
}
```

---

## 📊 アーキテクチャフロー

```
┌─────────────────────────────────────────────────────┐
│              User Action (Create Visit)              │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│          useVisitRepository() Hook                   │
│       (returns SQLite repository)                    │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│        SQLiteVisitRepository.create()                │
│  • Write to SQLite immediately                       │
│  • Set is_synced = 0 (pending)                       │
│  • User sees instant feedback                        │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼ (Background)
┌─────────────────────────────────────────────────────┐
│            Background Sync Service                   │
│  Triggers:                                           │
│  • Network restored                                  │
│  • App foregrounded                                  │
│  • Manual trigger                                    │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   Find unsynced records (is_synced = 0)             │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│     Upload to SupabaseVisitRepository                │
│  • Create/Update/Delete on Supabase                  │
│  • Set is_synced = 1 on success                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 使用例

### 例1: 訪問記録を作成

```tsx
const visitRepo = useVisitRepository();

const result = await visitRepo.create({
  user_id: 'user-123',
  machi_id: 'machi-456',
  // オプション（デフォルト値あり）:
  // visit_count: 1,
  // visited_at: new Date().toISOString(),
});

if (result.success) {
  console.log('Created:', result.data);
  // data.is_synced === 0 (同期待ち)
} else {
  console.error('Error:', result.error);
}
```

### 例2: 訪問記録を検索

```tsx
// すべての訪問記録
const all = await visitRepo.findAll();

// フィルター付き
const filtered = await visitRepo.findAll({
  userId: 'user-123',
  limit: 10,
});

// ユーザーと街で検索
const visit = await visitRepo.findByUserAndMachi('user-123', 'machi-456');
```

### 例3: 未同期レコードを確認

```tsx
const unsynced = await visitRepo.findUnsyncedRecords();

if (unsynced.success) {
  console.log(`${unsynced.data.length} records pending sync`);
}
```

### 例4: 手動同期

```tsx
const { isSyncing, triggerSync } = useSync();

const handleSync = async () => {
  if (!isSyncing) {
    await triggerSync();
  }
};
```

---

## 🔍 確認ポイント

### ✅ 1. データが即座にSQLiteに書き込まれる
```sql
SELECT * FROM visits WHERE is_synced = 0;
-- 未同期のレコードが表示される
```

### ✅ 2. ネットワーク復帰時に自動同期される
- 機内モードON → データ作成 → 機内モードOFF
- コンソールに「📶 Network restored, triggering sync...」が表示される

### ✅ 3. 同期後に `is_synced` が 1 になる
```sql
SELECT * FROM visits WHERE is_synced = 1;
-- 同期済みのレコードが表示される
```

### ✅ 4. Supabaseにデータが存在する
- Supabase Dashboard → Table Editor → visits
- 同期されたデータが表示される

---

## 📝 Next Steps

1. ✅ **現在**: Visit エンティティのみ実装完了
2. ⏳ **次**: Post, User, Schedule エンティティにも適用
3. ⏳ **将来**: 競合解決ロジックの改善
4. ⏳ **将来**: リアルタイム同期（Supabase Realtime）

---

## 🐛 トラブルシューティング

### 問題: 同期されない

**確認**:
```tsx
const { isSyncing, lastSyncTime } = useSync();
console.log('Syncing:', isSyncing);
console.log('Last sync:', lastSyncTime);
```

**解決策**:
1. ネットワーク接続を確認
2. Supabase設定を確認 (.env)
3. `triggerSync()` を手動で実行

### 問題: TypeScriptエラー

```bash
npx tsc --noEmit
```

で型エラーを確認し、修正してください。

---

## 📚 参考資料

- [Repository Pattern - FSD](https://feature-sliced.design/docs/reference/layers#infrastructure-layer)
- [React Query - Data Synchronization](https://tanstack.com/query/latest)
- [Offline-First Architecture](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
