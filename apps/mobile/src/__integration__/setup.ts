/**
 * 結合テスト用セットアップ
 *
 * MSW を使用して HTTP リクエストをモック
 */

import { server } from '@/shared/lib/test/msw/server';

// 全テスト開始前に MSW サーバーを起動
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// 各テスト後にハンドラーをリセット
afterEach(() => {
  server.resetHandlers();
});

// 全テスト終了後に MSW サーバーを停止
afterAll(() => {
  server.close();
});
