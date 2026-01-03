# 結合テスト ガイド

このドキュメントでは、モバイルアプリの結合テスト環境について説明します。

## 概要

結合テストは、複数のモジュール（hooks、API、コンポーネントなど）が連携して正しく動作するかを検証します。単体テストと異なり、実際のデータフローに近い形でテストを行います。

## 技術スタック

| 項目 | 技術 | バージョン | 用途 |
|------|------|-----------|------|
| テストランナー | Jest | 29.7.0 | テスト実行・アサーション |
| RN 環境シミュレート | jest-expo/ios | 54.0.16 | React Native 環境の模擬 |
| テストユーティリティ | @testing-library/react-native | 13.3.3 | hooks/コンポーネントのテスト |
| HTTP モック | nock | 14.0.10 | API リクエストのインターセプト |
| レンダラー | react-test-renderer | 19.1.2 | React コンポーネントのレンダリング |

## ディレクトリ構成

```
apps/mobile/
├── jest.integration.config.js    # 結合テスト用 Jest 設定
├── jest.setup.js                 # 共通モック設定（Expo モジュール等）
└── src/
    ├── __integration__/          # 結合テストファイル
    │   ├── setup.ts              # nock 初期化・クリーンアップ
    │   └── maps/
    │       └── feed-maps.test.tsx
    └── shared/lib/test/
        ├── nock/                 # HTTP モックユーティリティ
        │   ├── setup.ts          # nock ヘルパー関数
        │   └── index.ts
        └── msw/fixtures/         # モックデータ（フィクスチャ）
            └── index.ts
```

## 実行方法

```bash
# 結合テストを実行
npm run test:integration -w @machikore/mobile

# ウォッチモードで実行
npm run test:integration:watch -w @machikore/mobile
```

## テストの書き方

### 基本的な構造

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { nockSupabase } from '@/shared/lib/test/nock';
import { mockMaps } from '@/shared/lib/test/msw/fixtures';
import { useFeedMaps } from '@/entities/map/api/use-feed-maps';

// QueryClient ラッパーを作成
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useFeedMaps 結合テスト', () => {
  it('公開マップ一覧を取得できる', async () => {
    // API モックを設定
    nockSupabase()
      .get('/rest/v1/maps')
      .query(true)
      .reply(200, mockMaps);

    // hooks をレンダリング
    const { result } = renderHook(() => useFeedMaps(), {
      wrapper: createWrapper(),
    });

    // 結果を検証
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toHaveLength(mockMaps.length);
  });
});
```

### nock を使った API モック

```typescript
import { nockSupabase } from '@/shared/lib/test/nock';

// 成功レスポンス
nockSupabase()
  .get('/rest/v1/maps')
  .query(true)  // クエリパラメータを無視
  .reply(200, mockData);

// エラーレスポンス
nockSupabase()
  .get('/rest/v1/maps')
  .query(true)
  .reply(500, { error: 'Internal Server Error' });

// POST リクエスト
nockSupabase()
  .post('/rest/v1/maps', { name: 'New Map' })
  .reply(201, { id: 'new-id', name: 'New Map' });
```

### フィクスチャ（モックデータ）の使用

```typescript
import {
  mockUsers,
  mockMaps,
  mockSpots,
  createMockUser,
  createMockMap,
} from '@/shared/lib/test/msw/fixtures';

// 既存のモックデータを使用
nockSupabase().get('/rest/v1/users').reply(200, mockUsers);

// カスタムモックデータを作成
const customUser = createMockUser({ display_name: 'カスタムユーザー' });
const customMap = createMockMap({ name: 'カスタムマップ', user_id: customUser.id });
```

## 設定ファイル

### jest.integration.config.js

```javascript
module.exports = {
  // jest-expo/ios プリセットで React Native iOS 環境をシミュレート
  preset: 'jest-expo/ios',

  // テスト対象ディレクトリ
  roots: ['<rootDir>/src'],

  // 結合テストのみを対象
  testMatch: ['<rootDir>/src/__integration__/**/*.test.ts?(x)'],

  // パスエイリアス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // ESM モジュールをトランスパイル対象に追加
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|...)',
  ],

  // セットアップファイル
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/__integration__/setup.ts',
  ],

  // タイムアウト延長（API モック含むため）
  testTimeout: 30000,
};
```

### src/__integration__/setup.ts

```typescript
import { enableNock, resetNock, disableNock } from '@/shared/lib/test/nock';

// テスト開始前に nock を有効化
beforeAll(() => {
  enableNock();
});

// 各テスト後にモックをリセット
afterEach(() => {
  resetNock();
});

// 全テスト終了後に nock を無効化
afterAll(() => {
  disableNock();
});
```

## 単体テストとの違い

| 観点 | 単体テスト | 結合テスト |
|------|-----------|-----------|
| スコープ | 単一関数/コンポーネント | 複数モジュールの連携 |
| 依存関係 | すべてモック | 一部のみモック（API等） |
| 実行速度 | 高速 | やや遅い |
| 設定ファイル | jest.config.js | jest.integration.config.js |
| テストディレクトリ | `__tests__/` | `__integration__/` |

## トラブルシューティング

### react-test-renderer バージョンエラー

```
Incorrect version of "react-test-renderer" detected.
```

**解決方法**: ルートの `package.json` に `overrides` を追加

```json
{
  "overrides": {
    "react-test-renderer": "19.1.2"
  }
}
```

その後、`node_modules` と `package-lock.json` を削除して再インストール。

### ESM import エラー

```
SyntaxError: Cannot use import statement outside a module
```

**解決方法**: `transformIgnorePatterns` に該当パッケージを追加

```javascript
transformIgnorePatterns: [
  'node_modules/(?!...該当パッケージ...)',
],
```

### nock が機能しない

```
Nock: No match for request
```

**解決方法**:
1. リクエスト URL とパスが正しいか確認
2. `query(true)` でクエリパラメータを無視するよう設定
3. `afterEach` で `resetNock()` が呼ばれているか確認

## 参考リンク

- [Jest 公式ドキュメント](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [nock GitHub](https://github.com/nock/nock)
- [jest-expo](https://docs.expo.dev/develop/unit-testing/)
