/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/*.test.ts?(x)'],
  // 結合テストは除外（jest.integration.config.js で実行）
  testPathIgnorePatterns: ['/node_modules/', '/__integration__/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // MSW の React Native 環境制限を回避（Jest は Node.js で実行されるため安全）
    '^msw/node$': '<rootDir>/../../node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/../../node_modules/msw/lib/core/index.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uuid|react-native-get-random-values|i18n-js|make-plural|msw|@mswjs|until-async|@open-draft|outvariant|strict-event-emitter|is-node-process|headers-polyfill|rettime|path-to-regexp|type-fest|statuses)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
