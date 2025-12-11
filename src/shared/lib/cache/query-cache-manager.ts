/**
 * TanStack Query キャッシュマネージャー
 *
 * LRU (Least Recently Used) キャッシュ戦略を実装
 * 特定のクエリキーに対して上限数を設定し、超過した場合は古いものから削除
 */

import { QueryClient } from '@tanstack/react-query';
import { LRU_CACHE_LIMITS } from '@/shared/config';

// ===============================
// 型定義
// ===============================

interface CacheConfig {
  /** クエリキーのプレフィックス */
  queryKeyPrefix: readonly string[];
  /** 最大キャッシュエントリ数 */
  maxEntries: number;
}

// ===============================
// LRUキャッシュ設定
// ===============================

/**
 * LRUキャッシュの設定（shared/configから参照）
 *
 * Note:
 * - transport-hubsは動的に多くの場所を見るため、LRU管理対象外
 *   （gcTimeで自動的にメモリから解放される）
 * - machi/citiesはデフォルトマップでのみ表示されるため、LRU管理対象
 */
const LRU_CACHE_CONFIGS: CacheConfig[] = [
  {
    queryKeyPrefix: ['machi'],
    maxEntries: LRU_CACHE_LIMITS.machi,
  },
  {
    queryKeyPrefix: ['cities'],
    maxEntries: LRU_CACHE_LIMITS.cities,
  },
];

// ===============================
// LRUキャッシュマネージャー
// ===============================

/**
 * LRUキャッシュマネージャーをセットアップ
 *
 * キャッシュの追加・更新時に上限をチェックし、
 * 超過した場合は最も古いエントリを削除
 */
export function setupLRUCacheManager(queryClient: QueryClient): () => void {
  const queryCache = queryClient.getQueryCache();

  const unsubscribe = queryCache.subscribe((event) => {
    // 追加・更新イベントのみ処理
    if (event.type !== 'added' && event.type !== 'updated') {
      return;
    }

    // 各設定に対してキャッシュ上限をチェック
    for (const config of LRU_CACHE_CONFIGS) {
      enforceCacheLimit(queryClient, config);
    }
  });

  return unsubscribe;
}

/**
 * キャッシュ上限を強制
 */
function enforceCacheLimit(queryClient: QueryClient, config: CacheConfig): void {
  const queries = queryClient
    .getQueryCache()
    .findAll({ queryKey: config.queryKeyPrefix as string[] })
    .filter((q) => q.state.data !== undefined);

  if (queries.length <= config.maxEntries) {
    return;
  }

  // 最も古くアクセスされたものから削除（LRU）
  const sortedByAccess = queries.sort(
    (a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt
  );

  const toRemove = sortedByAccess.slice(0, queries.length - config.maxEntries);

  for (const query of toRemove) {
    console.log(`🗑️ LRU: キャッシュ削除 ${JSON.stringify(query.queryKey)}`);
    queryClient.removeQueries({ queryKey: query.queryKey });
  }
}

/**
 * 特定のクエリキーに対するキャッシュ統計を取得
 */
export function getCacheStats(
  queryClient: QueryClient,
  queryKeyPrefix: readonly string[]
): { count: number; keys: string[][] } {
  const queries = queryClient
    .getQueryCache()
    .findAll({ queryKey: queryKeyPrefix as string[] })
    .filter((q) => q.state.data !== undefined);

  return {
    count: queries.length,
    keys: queries.map((q) => q.queryKey as string[]),
  };
}

/**
 * キャッシュをクリア（特定のプレフィックス）
 */
export function clearCacheByPrefix(
  queryClient: QueryClient,
  queryKeyPrefix: readonly string[]
): void {
  queryClient.removeQueries({ queryKey: queryKeyPrefix as string[] });
}
