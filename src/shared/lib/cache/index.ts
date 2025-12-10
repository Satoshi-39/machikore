/**
 * キャッシュサービス エクスポート
 */

export {
  getMachiByPrefecture,
  getMachiByPrefectures,
  getMachiByLocation,
  refreshMachiCache,
  prefetchMachiData,
} from './machi-cache-service';

// Note: cities-cache-serviceは廃止
// citiesはReact Queryメモリキャッシュのみ使用（use-cities.ts参照）

// TanStack Query キャッシュ管理
export {
  setupLRUCacheManager,
  getCacheStats,
  clearCacheByPrefix,
} from './query-cache-manager';

export {
  setupQueryPersister,
  clearPersistedCache,
  getPersistedCacheSize,
} from './query-persister';
