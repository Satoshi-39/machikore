/**
 * アプリケーションプロバイダー
 */

import React from 'react';
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
 * 1. AuthProvider - 認証状態の初期化
 * 2. RepositoryProvider - データアクセス
 * 3. SyncProvider - データ同期
 * 4. QueryProvider - React Query
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <RepositoryProvider>
        <SyncProvider enabled={true} syncIntervalMs={0}>
          <QueryProvider>{children}</QueryProvider>
        </SyncProvider>
      </RepositoryProvider>
    </AuthProvider>
  );
}

// 個別エクスポート
export { QueryProvider } from './query-provider';
export { AuthProvider } from './auth-provider';
export { RepositoryProvider } from './repository-provider';
export { SyncProvider } from '@/shared/lib/sync';
