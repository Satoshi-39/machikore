/**
 * React Query プロバイダー
 *
 * 永続化をセットアップ
 */

import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { queryClient } from '@/shared/api/query-client';
import { setupStaticQueryPersister, setupDynamicQueryPersister } from '@/shared/lib/cache';
import { cleanupExpiredDraftImages } from '@/shared/lib/image';
import { log } from '@/shared/config/logger';
import { reduceMemoryUse } from 'map-memory-manager';

/**
 * AppState変化時の統合ハンドラ
 *
 * - focusManager連携（TanStack Query公式推奨パターン）
 * - バックグラウンド遷移時の画像メモリキャッシュクリア
 *
 * 複数のAppState.addEventListenerを1つに統合してイベントハンドラ負荷を削減
 */
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');

    if (status === 'background') {
      // 画像のデコード済みメモリキャッシュを解放
      Image.clearMemoryCache();
      // Mapboxタイルキャッシュの非必須リソースを解放
      reduceMemoryUse();
      // 画面に表示されていないReact Queryキャッシュを解放（復帰時に再取得）
      queryClient.removeQueries({ type: 'inactive' });
      log.debug('[QueryProvider] バックグラウンド移行: メモリ解放完了');
    }
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
    // AppState リスナー（focusManager連携 + バックグラウンド時キャッシュクリア）
    const appStateSubscription = AppState.addEventListener('change', onAppStateChange);

    // メモリ警告時に積極的にメモリを解放
    const memoryWarningSubscription = AppState.addEventListener('memoryWarning', () => {
      log.warn('[QueryProvider] メモリ警告を受信、積極的メモリ解放');
      Image.clearMemoryCache();
      reduceMemoryUse();
      queryClient.removeQueries({ type: 'inactive' });
    });

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

    // 期限切れの下書き画像をバックグラウンドでクリーンアップ
    cleanupExpiredDraftImages().catch((err) =>
      log.warn('[QueryProvider] 下書き画像クリーンアップエラー:', err)
    );

    return () => {
      appStateSubscription.remove();
      memoryWarningSubscription.remove();
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
