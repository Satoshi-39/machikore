/**
 * アプリケーションプロバイダー
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { RepositoryProvider } from './repository-provider';
import { ThemeProvider } from './ThemeProvider';
import { ConsentProvider } from './consent-provider';
import { SyncProvider } from '@/shared/lib/sync';
import { PushNotificationInitializer } from '@/features/push-notifications';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * すべてのプロバイダーを統合
 *
 * 順序が重要：
 * 1. GestureHandlerRootView - ジェスチャー処理（Bottom Sheetなど）
 * 2. MenuProvider - ポップアップメニュー
 * 3. AuthProvider - 認証状態の初期化
 * 4. RepositoryProvider - データアクセス
 * 5. SyncProvider - データ同期
 * 6. QueryProvider - React Query
 * 7. ThemeProvider - テーマ管理（NativeWindのcolorScheme設定）
 * 8. ConsentProvider - 利用規約同意チェック
 * 9. PushNotificationInitializer - プッシュ通知初期化
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <AuthProvider>
          <RepositoryProvider>
            <SyncProvider enabled={true} syncIntervalMs={0}>
              <QueryProvider>
                <ThemeProvider>
                  <ConsentProvider>
                    <PushNotificationInitializer />
                    {children}
                  </ConsentProvider>
                </ThemeProvider>
              </QueryProvider>
            </SyncProvider>
          </RepositoryProvider>
        </AuthProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}

// 個別エクスポート
export { QueryProvider } from './query-provider';
export { AuthProvider } from './auth-provider';
export { RepositoryProvider } from './repository-provider';
export { ThemeProvider, useIsDarkMode, useNavigationTheme } from './ThemeProvider';
export { ConsentProvider } from './consent-provider';
export { SyncProvider } from '@/shared/lib/sync';
