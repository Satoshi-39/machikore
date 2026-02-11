/**
 * キャッシュクリア機能
 *
 * 以下のキャッシュをすべてクリアする:
 * 1. React Query メモリキャッシュ
 * 2. AsyncStorage 永続化キャッシュ（静的・動的）
 * 3. expo-image ディスク・メモリキャッシュ
 * 4. SQLite タイルキャッシュ（machi/cities/transport_hubs + メタデータ）
 * 5. Mapbox 地図タイルキャッシュ
 * 6. ドラフト画像（一時ファイル）
 */

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import Mapbox from '@rnmapbox/maps';
import { clearPersistedCache } from '@/shared/lib/cache/query-persister';
import { getDatabase } from '@/shared/api/sqlite/client';
import { clearAllDraftImages } from '@/shared/lib/image/local-storage';
import { log } from '@/shared/config/logger';

interface UseClearCacheReturn {
  clearCache: () => Promise<void>;
  isClearing: boolean;
}

/**
 * SQLiteのキャッシュデータをクリア（テーブルは維持、データのみ削除）
 */
function clearSQLiteCacheData(): void {
  const db = getDatabase();
  db.execSync('BEGIN TRANSACTION;');
  try {
    // タイルキャッシュのデータ
    db.execSync('DELETE FROM machi;');
    db.execSync('DELETE FROM cities;');
    db.execSync('DELETE FROM transport_hubs;');
    // キャッシュメタデータ
    db.execSync('DELETE FROM cache_metadata;');
    db.execSync('COMMIT;');
    log.debug('[ClearCache] SQLiteキャッシュデータをクリア');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[ClearCache] SQLiteキャッシュクリアエラー:', error);
  }
}

/**
 * キャッシュをクリアするhook
 */
export function useClearCache(): UseClearCacheReturn {
  const queryClient = useQueryClient();
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = useCallback(async () => {
    setIsClearing(true);
    try {
      // 1. React Queryのメモリキャッシュをクリア
      queryClient.clear();

      // 2. AsyncStorage永続化キャッシュをクリア
      await clearPersistedCache();

      // 3. expo-imageのキャッシュをクリア
      await Image.clearDiskCache();
      await Image.clearMemoryCache();

      // 4. SQLiteタイルキャッシュをクリア
      clearSQLiteCacheData();

      // 5. Mapbox地図タイルキャッシュをクリア
      await Mapbox.offlineManager.clearAmbientCache();

      // 6. ドラフト画像をクリア
      await clearAllDraftImages();

      log.info('[ClearCache] 全キャッシュクリア完了');
    } finally {
      setIsClearing(false);
    }
  }, [queryClient]);

  return { clearCache, isClearing };
}
