/**
 * React Query プロバイダー
 *
 * LRUキャッシュマネージャーと永続化をセットアップ
 */

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { setupLRUCacheManager, setupQueryPersister } from '@/shared/lib/cache';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider
 *
 * - LRUキャッシュマネージャー: 上限を超えたキャッシュを自動削除
 * - 永続化: AsyncStorageにキャッシュを保存し、アプリ再起動後も復元
 */
export function QueryProvider({ children }: QueryProviderProps) {
  useEffect(() => {
    // LRUキャッシュマネージャーをセットアップ
    const unsubscribeLRU = setupLRUCacheManager(queryClient);

    // 永続化をセットアップ
    let unsubscribePersister: (() => void) | undefined;
    try {
      unsubscribePersister = setupQueryPersister(queryClient);
    } catch (error) {
      console.warn('Query Persister のセットアップに失敗:', error);
    }

    return () => {
      unsubscribeLRU();
      unsubscribePersister?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
