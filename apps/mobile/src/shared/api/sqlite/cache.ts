/**
 * キャッシュメタデータ管理のSQLite操作
 *
 * TTLベースのキャッシュ管理を行う
 */

import { queryOne, queryAll, execute } from './client';

// ===============================
// 型定義
// ===============================

export interface CacheMetadata {
  cache_key: string;
  entity_type: string;
  fetched_at: string;
  expires_at: string;
  record_count: number;
}

// キャッシュのTTL設定（ミリ秒）
export const CACHE_TTL = {
  MACHI: 7 * 24 * 60 * 60 * 1000, // 7日
  CITIES: 7 * 24 * 60 * 60 * 1000, // 7日
  PREFECTURES: 30 * 24 * 60 * 60 * 1000, // 30日
} as const;

// ===============================
// キャッシュメタデータ操作
// ===============================

/**
 * キャッシュメタデータを取得
 */
export function getCacheMetadata(cacheKey: string): CacheMetadata | null {
  return queryOne<CacheMetadata>(
    'SELECT * FROM cache_metadata WHERE cache_key = ?;',
    [cacheKey]
  );
}

/**
 * キャッシュが有効かチェック
 */
export function isCacheValid(cacheKey: string): boolean {
  const metadata = getCacheMetadata(cacheKey);
  if (!metadata) return false;

  const now = new Date();
  const expiresAt = new Date(metadata.expires_at);
  return now < expiresAt;
}

/**
 * キャッシュメタデータを保存/更新
 */
export function setCacheMetadata(
  cacheKey: string,
  entityType: string,
  recordCount: number,
  ttlMs: number
): void {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);

  execute(
    `
    INSERT OR REPLACE INTO cache_metadata (
      cache_key, entity_type, fetched_at, expires_at, record_count
    )
    VALUES (?, ?, ?, ?, ?);
    `,
    [
      cacheKey,
      entityType,
      now.toISOString(),
      expiresAt.toISOString(),
      recordCount,
    ]
  );
}

/**
 * キャッシュメタデータを削除
 */
export function deleteCacheMetadata(cacheKey: string): void {
  execute('DELETE FROM cache_metadata WHERE cache_key = ?;', [cacheKey]);
}

/**
 * 期限切れのキャッシュメタデータを取得
 */
export function getExpiredCacheKeys(): string[] {
  const now = new Date().toISOString();
  const results = queryAll<{ cache_key: string }>(
    'SELECT cache_key FROM cache_metadata WHERE expires_at < ?;',
    [now]
  );
  return results.map((r) => r.cache_key);
}

/**
 * 期限切れのキャッシュメタデータを削除
 */
export function deleteExpiredCacheMetadata(): number {
  const now = new Date().toISOString();
  execute('DELETE FROM cache_metadata WHERE expires_at < ?;', [now]);
  // 削除件数を返す（SQLiteのchangesを取得する方法がないため0を返す）
  return 0;
}

/**
 * 特定のエンティティタイプのキャッシュをすべて削除
 */
export function clearCacheByEntityType(entityType: string): void {
  execute('DELETE FROM cache_metadata WHERE entity_type = ?;', [entityType]);
}

/**
 * すべてのキャッシュメタデータを削除
 */
export function clearAllCacheMetadata(): void {
  execute('DELETE FROM cache_metadata;');
}

// ===============================
// ヘルパー関数
// ===============================

/**
 * 都道府県の街データ用キャッシュキーを生成
 */
export function getMachiCacheKey(prefectureId: string): string {
  return `machi:${prefectureId}`;
}

/**
 * 都道府県の市区町村データ用キャッシュキーを生成
 */
export function getCitiesCacheKey(prefectureId: string): string {
  return `cities:${prefectureId}`;
}
