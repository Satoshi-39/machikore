/**
 * TanStack Query 永続化設定
 *
 * AsyncStorageを使用してクエリキャッシュを永続化
 * アプリ再起動後もキャッシュを復元可能
 *
 * 2つの永続化戦略:
 * 1. 静的データ（マスタデータ）: 30日保持
 * 2. 動的データ（フィード、マップ等）: 1日保持
 *
 * サイズ制限:
 * - 静的データ: 1MB上限
 * - 動的データ: 2MB上限
 * - 上限を超える書き込みは破棄（読み取りは常に許可）
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
  PERSISTER_MAX_SIZE,
  log,
} from '@/shared/config';

// ===============================
// サイズ制限付きAsyncStorageラッパー
// ===============================

/**
 * サイズ制限付きのAsyncStorageラッパーを作成
 *
 * setItem時にデータサイズが上限を超える場合は書き込みをスキップし、
 * 既存のキャッシュを削除する（古い肥大化データの残留を防止）
 */
function createSizeLimitedStorage(maxSize: number) {
  return {
    getItem: (key: string) => AsyncStorage.getItem(key),
    setItem: async (key: string, value: string) => {
      if (value.length > maxSize) {
        log.warn(
          `[QueryPersister] キャッシュサイズ超過 (${(value.length / 1024).toFixed(0)}KB > ${(maxSize / 1024).toFixed(0)}KB)、書き込みスキップ`
        );
        // 肥大化したキャッシュが残留しないよう削除
        await AsyncStorage.removeItem(key);
        return;
      }
      await AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => AsyncStorage.removeItem(key),
  };
}

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
    storage: createSizeLimitedStorage(PERSISTER_MAX_SIZE.static),
    key: PERSISTER_STORAGE_KEY,
    throttleTime: 2000,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  const [unsubscribe] = persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: STATIC_DATA_CACHE_CONFIG.maxAge, // 30日
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        if (query.state.status !== 'success') return false;
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
    storage: createSizeLimitedStorage(PERSISTER_MAX_SIZE.dynamic),
    key: DYNAMIC_PERSISTER_STORAGE_KEY,
    throttleTime: 2000,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  const [unsubscribe] = persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: DYNAMIC_PERSISTER_CONFIG.maxAge, // 1日
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        if (query.state.status !== 'success') return false;
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
