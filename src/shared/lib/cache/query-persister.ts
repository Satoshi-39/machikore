/**
 * TanStack Query 永続化設定
 *
 * AsyncStorageを使用してクエリキャッシュを永続化
 * アプリ再起動後もキャッシュを復元可能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import {
  STATIC_DATA_CACHE_CONFIG,
  PERSISTER_STORAGE_KEY,
  PERSISTED_QUERY_PREFIXES,
  log,
} from '@/shared/config';

// ===============================
// 永続化セットアップ
// ===============================

/**
 * クエリキャッシュの永続化をセットアップ
 *
 * @returns クリーンアップ関数
 */
export function setupQueryPersister(queryClient: QueryClient): () => void {
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: PERSISTER_STORAGE_KEY,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  const [unsubscribe] = persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: STATIC_DATA_CACHE_CONFIG.maxAge, // 30日
    // 永続化するクエリをフィルタリング（静的データのみ）
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        const queryKey = query.queryKey as string[];
        return PERSISTED_QUERY_PREFIXES.some((prefix) => queryKey[0] === prefix);
      },
    },
  });

  log.debug('[QueryPersister] セットアップ完了');

  return unsubscribe;
}

/**
 * 永続化キャッシュをクリア
 */
export async function clearPersistedCache(): Promise<void> {
  await AsyncStorage.removeItem(PERSISTER_STORAGE_KEY);
  log.debug('[QueryPersister] キャッシュクリア完了');
}

/**
 * 永続化キャッシュのサイズを取得（デバッグ用）
 */
export async function getPersistedCacheSize(): Promise<number> {
  const data = await AsyncStorage.getItem(PERSISTER_STORAGE_KEY);
  return data ? data.length : 0;
}
