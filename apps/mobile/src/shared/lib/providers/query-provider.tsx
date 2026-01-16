/**
 * React Query プロバイダー
 *
 * 永続化をセットアップ
 */

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { setupStaticQueryPersister, setupDynamicQueryPersister } from '@/shared/lib/cache';
import { log } from '@/shared/config/logger';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider
 *
 * 2つの永続化戦略:
 * - 静的データ（マスタデータ）: 30日保持
 * - 動的データ（フィード、マップ等）: 1日保持（オフライン対応）
 */
export function QueryProvider({ children }: QueryProviderProps) {
  useEffect(() => {
    let unsubscribeStatic: (() => void) | undefined;
    let unsubscribeDynamic: (() => void) | undefined;

    try {
      // 静的データの永続化（30日保持）
      unsubscribeStatic = setupStaticQueryPersister(queryClient);
      // 動的データの永続化（1日保持）
      unsubscribeDynamic = setupDynamicQueryPersister(queryClient);
    } catch (error) {
      log.warn('[QueryProvider] Persisterのセットアップに失敗:', error);
    }

    return () => {
      unsubscribeStatic?.();
      unsubscribeDynamic?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
