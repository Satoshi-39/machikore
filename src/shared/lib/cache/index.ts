/**
 * キャッシュサービス エクスポート
 */

// TanStack Query 永続化
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
  getTransportHubsByTileId,
  getTransportHubsByTileIds,
  getTransportHubsByBounds,
  getCachedTileIds,
  clearAllTileCache,
} from './tile-cache-service';
