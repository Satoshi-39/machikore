/**
 * TanStack Query 永続化設定
 *
 * AsyncStorageを使用してクエリキャッシュを永続化
 * アプリ再起動後もキャッシュを復元可能
 *
 * 2つの永続化戦略:
 * 1. 静的データ（マスタデータ）: 30日保持
 * 2. 動的データ（フィード、マップ等）: 1日保持
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import {
  STATIC_DATA_CACHE_CONFIG,
  PERSISTER_STORAGE_KEY,
  PERSISTED_QUERY_PREFIXES,
  DYNAMIC_PERSISTER_STORAGE_KEY,
  DYNAMIC_PERSISTED_QUERY_PREFIXES,
  DYNAMIC_PERSISTER_CONFIG,
  log,
} from '@/shared/config';

// ===============================
// 永続化セットアップ
// ===============================

/**
 * 静的データのクエリキャッシュ永続化をセットアップ（30日保持）
 *
 * @returns クリーンアップ関数
 */
export function setupStaticQueryPersister(queryClient: QueryClient): () => void {
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
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        const queryKey = query.queryKey as string[];
        return PERSISTED_QUERY_PREFIXES.some((prefix) => queryKey[0] === prefix);
      },
    },
  });

  log.debug('[QueryPersister] 静的データ永続化セットアップ完了');

  return unsubscribe;
}

/**
 * 動的データのクエリキャッシュ永続化をセットアップ（1日保持）
 *
 * オフライン時に前回のデータを表示するため
 *
 * @returns クリーンアップ関数
 */
export function setupDynamicQueryPersister(queryClient: QueryClient): () => void {
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: DYNAMIC_PERSISTER_STORAGE_KEY,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  const [unsubscribe] = persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: DYNAMIC_PERSISTER_CONFIG.maxAge, // 1日
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        const queryKey = query.queryKey as string[];
        return DYNAMIC_PERSISTED_QUERY_PREFIXES.some((prefix) => queryKey[0] === prefix);
      },
    },
  });

  log.debug('[QueryPersister] 動的データ永続化セットアップ完了');

  return unsubscribe;
}

/**
 * 永続化キャッシュをクリア（静的・動的両方）
 */
export async function clearPersistedCache(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(PERSISTER_STORAGE_KEY),
    AsyncStorage.removeItem(DYNAMIC_PERSISTER_STORAGE_KEY),
  ]);
  log.debug('[QueryPersister] キャッシュクリア完了');
}

/**
 * 永続化キャッシュのサイズを取得（デバッグ用）
 */
export async function getPersistedCacheSize(): Promise<{ static: number; dynamic: number }> {
  const [staticData, dynamicData] = await Promise.all([
    AsyncStorage.getItem(PERSISTER_STORAGE_KEY),
    AsyncStorage.getItem(DYNAMIC_PERSISTER_STORAGE_KEY),
  ]);
  return {
    static: staticData ? staticData.length : 0,
    dynamic: dynamicData ? dynamicData.length : 0,
  };
}
