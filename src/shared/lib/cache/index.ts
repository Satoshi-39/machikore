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

export {
  getCitiesByPrefecture,
  getCitiesByLocation,
  getAllCachedCities,
} from './cities-cache-service';

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
