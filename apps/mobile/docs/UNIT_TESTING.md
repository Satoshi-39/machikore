# 単体テスト ガイド

このドキュメントでは、モバイルアプリの単体テスト環境について説明します。

## 概要

単体テストは、個々の関数やコンポーネントが正しく動作するかを独立して検証します。外部依存（API、データベース等）はすべてモック化して、純粋なロジックのみをテストします。

## 技術スタック

| 項目 | 技術 | バージョン | 用途 |
|------|------|-----------|------|
| テストランナー | Jest | 29.7.0 | テスト実行・アサーション |
| テスト環境 | Node.js | - | 軽量なテスト実行環境 |
| TypeScript 変換 | babel-jest | - | TS/TSX ファイルのトランスパイル |
| React Native モック | - | - | RN モジュールの自動モック |

## ディレクトリ構成

```
apps/mobile/
├── jest.config.js           # 単体テスト用 Jest 設定
├── jest.setup.js            # グローバルモック設定
└── src/
    ├── entities/
    │   └── machi/
    │       └── model/
    │           ├── helpers.ts
    │           └── __tests__/
    │               └── helpers.test.ts
    ├── shared/
    │   └── lib/
    │       └── utils/
    │           ├── theme.utils.ts
    │           └── __tests__/
    │               └── theme.utils.test.ts
    └── ...
```

### FSD に基づくテストファイル配置

各レイヤーのモジュール直下に `__tests__/` ディレクトリを作成し、対応するテストファイルを配置します：

```
src/{layer}/{slice}/model/
├── helpers.ts
├── types.ts
└── __tests__/
    ├── helpers.test.ts
    └── types.test.ts
```

## 実行方法

```bash
# 単体テストを実行
npm test -w @machikore/mobile

# ウォッチモードで実行
npm run test:watch -w @machikore/mobile

# カバレッジ付きで実行
npm run test:coverage -w @machikore/mobile

# 特定ファイルのテスト
npm test -w @machikore/mobile -- src/entities/machi/model/__tests__/helpers.test.ts
```

## テストの書き方

### 基本的な構造

```typescript
/**
 * helpers.ts のテスト
 */

import { myFunction, anotherFunction } from '../helpers';

describe('helpers', () => {
  describe('myFunction', () => {
    it('正常な入力で期待される結果を返す', () => {
      const result = myFunction('input');
      expect(result).toBe('expected');
    });

    it('境界値でも正しく動作する', () => {
      expect(myFunction('')).toBe('default');
      expect(myFunction(null)).toBe('default');
    });

    it('エラーケースを適切に処理する', () => {
      expect(() => myFunction(undefined)).toThrow('Invalid input');
    });
  });
});
```

### 純粋関数のテスト

外部依存がない純粋関数は、そのまま import してテストできます：

```typescript
import { sortSpotsByDate, formatDate } from '../helpers';
import type { SpotRow } from '@/shared/types/database.types';

describe('sortSpotsByDate', () => {
  it('新しい順にソートする', () => {
    const spots: SpotRow[] = [
      createMockSpot('1', '2024-01-01'),
      createMockSpot('2', '2024-01-03'),
      createMockSpot('3', '2024-01-02'),
    ];
    const sorted = sortSpotsByDate(spots);
    expect(sorted.map(s => s.id)).toEqual(['2', '3', '1']);
  });

  it('元の配列を変更しない（イミュータブル）', () => {
    const original = [createMockSpot('1', '2024-01-01')];
    const copy = [...original];
    sortSpotsByDate(original);
    expect(original).toEqual(copy);
  });
});
```

### 日付・時間関連のテスト

日付関連の関数は、テスト実行時刻に依存しないようにテストします：

```typescript
describe('isToday', () => {
  it('今日の日付は true を返す', () => {
    const today = new Date();
    expect(isToday(today.toISOString())).toBe(true);
  });

  it('昨日の日付は false を返す', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday.toISOString())).toBe(false);
  });
});

describe('getRelativeTime', () => {
  it('1分未満は「たった今」を返す', () => {
    const now = new Date();
    expect(getRelativeTime(now.toISOString())).toBe('たった今');
  });

  it('5分前は「5分前」を返す', () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    expect(getRelativeTime(date.toISOString())).toBe('5分前');
  });
});
```

### Intl.DateTimeFormat を使用する関数のテスト

環境によって出力が異なる可能性があるため、部分一致でテストします：

```typescript
describe('formatScheduleDate', () => {
  it('日本語フォーマットで日時を返す', () => {
    const result = formatScheduleDate('2025-01-15T10:30:00Z');
    // Intl.DateTimeFormat は環境によって微妙に異なる可能性があるので
    // 基本的な形式が含まれることを確認
    expect(result).toContain('2025');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });
});
```

### バリデーション関数のテスト

```typescript
describe('validateCreateSpotParams', () => {
  const validParams = {
    userId: 'user-123',
    mapId: 'map-456',
    name: 'テストスポット',
    latitude: 35.6812,
    longitude: 139.7671,
  };

  it('有効なパラメータは valid を返す', () => {
    const result = validateCreateSpotParams(validParams);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('userId が空ならエラー', () => {
    const result = validateCreateSpotParams({
      ...validParams,
      userId: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('ユーザーIDが必要です');
  });

  it('name が100文字を超えるとエラー', () => {
    const result = validateCreateSpotParams({
      ...validParams,
      name: 'あ'.repeat(101),
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('スポット名は100文字以内にしてください');
  });
});
```

### モックヘルパー関数の作成

テストで繰り返し使うモックデータは、ヘルパー関数として定義します：

```typescript
function createMockSpot(id: string, createdAt: string): SpotRow {
  return {
    id,
    map_id: 'map-123',
    user_id: 'user-123',
    machi_id: 'sta_tokyo',
    machi_name: null,
    master_spot_id: 'master-123',
    description: 'テストスポット',
    // ... 他のフィールド
    created_at: createdAt,
    updated_at: createdAt,
  };
}
```

## 設定ファイル

### jest.config.js

```javascript
/** @type {import('jest').Config} */
module.exports = {
  // Node.js 環境（軽量で高速）
  testEnvironment: 'node',

  // テスト対象ディレクトリ
  roots: ['<rootDir>/src'],

  // 単体テストのみを対象
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/*.test.ts?(x)'],

  // パスエイリアス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // TypeScript 変換
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },

  // ESM モジュールをトランスパイル対象に追加
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|...)',
  ],

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### jest.setup.js

グローバルなモック設定を配置します：

```javascript
/**
 * Jest セットアップファイル
 * テスト実行前のグローバル設定
 */

// React Native グローバル変数
global.__DEV__ = true;

// AsyncStorage のモック
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// expo-secure-store のモック
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// expo-constants のモック（環境変数）
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      // ... 他の環境変数
    },
  },
}));

// uuid のモック（固定値を返す）
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678-9012-345678901234',
}));

// react-native-get-random-values のモック
jest.mock('react-native-get-random-values', () => ({}));
```

## ESM モジュールのエラー対処

React Native や Expo のパッケージは ESM 形式のため、Jest でインポートするとエラーになることがあります。

### 解決方法 1: transformIgnorePatterns に追加

```javascript
// jest.config.js
transformIgnorePatterns: [
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|問題のパッケージ)',
],
```

### 解決方法 2: モジュールをモック

```javascript
// jest.setup.js
jest.mock('問題のパッケージ', () => ({
  someFunction: jest.fn(),
}));
```

### 解決方法 3: 関数を再定義してテスト

外部依存が複雑な場合、純粋なロジック部分だけをテストファイル内で再定義することも有効です：

```typescript
// 元の関数が外部依存を持つ場合、テスト用に純粋なロジックを再定義
function getCategoryName(category: Category, locale: string = 'ja'): string {
  if (locale === 'ja') {
    return category.name;
  }
  if (category.name_translations && category.name_translations[locale]) {
    return category.name_translations[locale];
  }
  return category.name;
}

describe('getCategoryName', () => {
  it('日本語ロケールでは name を返す', () => {
    const category = { id: '1', name: '食事', name_translations: { en: 'Food' } };
    expect(getCategoryName(category, 'ja')).toBe('食事');
  });
});
```

## 結合テストとの違い

| 観点 | 単体テスト | 結合テスト |
|------|-----------|-----------|
| スコープ | 単一関数/コンポーネント | 複数モジュールの連携 |
| 依存関係 | すべてモック | 一部のみモック（API等） |
| 実行速度 | 高速 | やや遅い |
| 設定ファイル | jest.config.js | jest.integration.config.js |
| テストディレクトリ | `__tests__/` | `__integration__/` |
| テスト環境 | node | jest-expo/ios |

## ベストプラクティス

### 1. 純粋関数を優先的にテスト

副作用のない純粋関数は、テストが容易で信頼性が高いです：
- バリデーション関数
- データ変換関数
- ソート・フィルタ関数
- フォーマット関数

### 2. エッジケースを網羅

```typescript
it('空配列は空配列を返す', () => {
  expect(sortItems([])).toEqual([]);
});

it('null/undefined を適切に処理する', () => {
  expect(formatValue(null)).toBe('');
  expect(formatValue(undefined)).toBe('');
});

it('境界値でも正しく動作する', () => {
  expect(validateLength('a'.repeat(100))).toBe(true);   // 境界値
  expect(validateLength('a'.repeat(101))).toBe(false);  // 超過
});
```

### 3. イミュータビリティを検証

```typescript
it('元の配列を変更しない', () => {
  const original = [1, 2, 3];
  const copy = [...original];
  sortItems(original);
  expect(original).toEqual(copy);
});
```

### 4. テストの独立性を保つ

各テストは他のテストに依存せず、独立して実行できるようにします。共有状態を避け、必要なモックデータは各テスト内で作成します。

## トラブルシューティング

### Cannot find module 'xxx'

パスエイリアス `@/` が解決できない場合、`moduleNameMapper` を確認：

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
},
```

### SyntaxError: Cannot use import statement outside a module

`transformIgnorePatterns` に該当パッケージを追加するか、モックを作成します。

### タイムアウトエラー

デフォルトのタイムアウト（5秒）を超える場合：

```javascript
// jest.config.js
testTimeout: 10000,

// または個別テスト
it('長時間処理', async () => {
  // ...
}, 30000);
```

## 参考リンク

- [Jest 公式ドキュメント](https://jestjs.io/docs/getting-started)
- [jest-expo](https://docs.expo.dev/develop/unit-testing/)
- [Testing Library](https://testing-library.com/docs/)
