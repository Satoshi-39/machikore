/**
 * React Query プロバイダー
 *
 * 永続化をセットアップ
 */

import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { setupStaticQueryPersister, setupDynamicQueryPersister } from '@/shared/lib/cache';
import { log } from '@/shared/config/logger';

/**
 * AppState変化時にfocusManagerへ通知
 * React Native では window.focus イベントがないため、
 * AppState を使って refetchOnWindowFocus を動作させる（TanStack Query公式推奨パターン）
 */
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

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
    // AppState リスナーで focusManager を連携
    const appStateSubscription = AppState.addEventListener('change', onAppStateChange);

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
      appStateSubscription.remove();
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
