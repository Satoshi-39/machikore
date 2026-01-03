/**
 * テストユーティリティ
 *
 * 結合テスト用のヘルパー関数とモックをエクスポート
 */

// カスタム render（プロバイダーラップ済み）
export { render, createTestQueryClient } from './render';

// MSW サーバー
export { server } from './msw/server';

// MSW ハンドラー
export { handlers } from './msw/handlers/index';

// フィクスチャ（モックデータ）
export {
  mockUsers,
  mockMaps,
  mockSpots,
  mockMasterSpots,
  createMockUser,
  createMockMap,
  createMockSpot,
} from './msw/fixtures/index';
