/**
 * nock セットアップ
 * Jest 結合テスト用の HTTP モック
 */

import nock from 'nock';

// Supabase API のベース URL
export const SUPABASE_URL = 'https://test.supabase.co';

/**
 * nock を有効化（テスト開始前に呼び出し）
 */
export function enableNock() {
  nock.disableNetConnect();
}

/**
 * nock をリセット（各テスト後に呼び出し）
 */
export function resetNock() {
  nock.cleanAll();
}

/**
 * nock を無効化（テスト終了後に呼び出し）
 */
export function disableNock() {
  nock.enableNetConnect();
  nock.restore();
}

/**
 * Supabase REST API の nock スコープを作成
 */
export function nockSupabase() {
  return nock(SUPABASE_URL);
}
