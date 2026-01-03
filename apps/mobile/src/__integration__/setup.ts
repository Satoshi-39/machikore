/**
 * 結合テスト用セットアップ
 *
 * nock を使用して HTTP リクエストをモック
 */

import { enableNock, resetNock, disableNock } from '@/shared/lib/test/nock';

// 全テスト開始前に nock を有効化
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
