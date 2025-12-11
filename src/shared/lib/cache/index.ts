/**
 * キャッシュサービス エクスポート
 */

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

// タイルベースのキャッシュサービス
export {
  getMachiByTileId,
  getMachiByTileIds,
  getMachiByBounds,
  getCitiesByTileId,
  getCitiesByTileIds,
  getCitiesByBounds,
  getCachedTileIds,
  clearAllTileCache,
} from './tile-cache-service';
