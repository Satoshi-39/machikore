/**
 * アプリケーションプロバイダー
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { RepositoryProvider } from './repository-provider';
import { SyncProvider } from '@/shared/lib/sync';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * すべてのプロバイダーを統合
 *
 * 順序が重要：
 * 1. GestureHandlerRootView - ジェスチャー処理（Bottom Sheetなど）
 * 2. AuthProvider - 認証状態の初期化
 * 3. RepositoryProvider - データアクセス
 * 4. SyncProvider - データ同期
 * 5. QueryProvider - React Query
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RepositoryProvider>
          <SyncProvider enabled={true} syncIntervalMs={0}>
            <QueryProvider>{children}</QueryProvider>
          </SyncProvider>
        </RepositoryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// 個別エクスポート
export { QueryProvider } from './query-provider';
export { AuthProvider } from './auth-provider';
export { RepositoryProvider } from './repository-provider';
export { SyncProvider } from '@/shared/lib/sync';
