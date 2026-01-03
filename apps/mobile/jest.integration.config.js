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

  // パスエイリアス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // nock をトランスパイル対象に追加
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uuid|react-native-get-random-values|nock)',
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
