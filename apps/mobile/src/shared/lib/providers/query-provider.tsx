/**
 * React Query プロバイダー
 *
 * 永続化をセットアップ
 */

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { setupQueryPersister } from '@/shared/lib/cache';
import { log } from '@/shared/config/logger';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider
 *
 * - 永続化: AsyncStorageにキャッシュを保存し、アプリ再起動後も復元
 * - メモリキャッシュはgcTimeで自動解放
 * - タイルベースデータはSQLiteでLRU管理
 */
export function QueryProvider({ children }: QueryProviderProps) {
  useEffect(() => {
    // 永続化をセットアップ
    let unsubscribePersister: (() => void) | undefined;
    try {
      unsubscribePersister = setupQueryPersister(queryClient);
    } catch (error) {
      log.warn('[QueryProvider] Persisterのセットアップに失敗:', error);
    }

    return () => {
      unsubscribePersister?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
