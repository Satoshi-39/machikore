/**
 * Jest 結合テスト用設定
 *
 * 使用方法:
 *   npm run test:integration
 */

/** @type {import('jest').Config} */
module.exports = {
  // jest-expo プリセットを使用（React Native 環境をシミュレート）
  preset: 'jest-expo/ios',

  // テスト対象ディレクトリ
  roots: ['<rootDir>/src'],

  // 結合テストのみを対象
  testMatch: ['<rootDir>/src/__integration__/**/*.test.ts?(x)'],

  // パスエイリアス + MSW の React Native 環境制限を回避
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^msw/node$': '<rootDir>/../../node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/../../node_modules/msw/lib/core/index.js',
  },

  // MSW とその ESM 依存パッケージをトランスパイル対象に追加
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|msw|@mswjs|until-async|@open-draft|outvariant|strict-event-emitter|is-node-process|headers-polyfill|rettime|path-to-regexp|type-fest|statuses|uuid|react-native-get-random-values|i18n-js|make-plural))',
    '/node_modules/react-native-reanimated/plugin/',
  ],

  // 結合テスト用セットアップ
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/__integration__/setup.ts',
  ],

  // テスト実行のタイムアウトを延長（API モック含むため）
  testTimeout: 30000,

  // カバレッジ収集対象
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/__tests__/**',
    '!src/__integration__/**',
    '!src/shared/lib/test/**',
  ],
};
