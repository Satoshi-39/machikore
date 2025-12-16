/**
 * アプリケーションプロバイダー
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { PostHogProvider } from 'posthog-react-native';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { RepositoryProvider } from './repository-provider';
import { ThemeProvider } from './ThemeProvider';
import { ConsentProvider } from './consent-provider';
import { SyncProvider } from '@/shared/lib/sync';
import { PushNotificationInitializer } from '@/features/push-notifications';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '@/shared/lib/init/posthog';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * すべてのプロバイダーを統合
 *
 * 順序が重要：
 * 1. GestureHandlerRootView - ジェスチャー処理（Bottom Sheetなど）
 * 2. PostHogProvider - アナリティクス（早い段階で初期化）
 * 3. MenuProvider - ポップアップメニュー
 * 4. AuthProvider - 認証状態の初期化
 * 5. RepositoryProvider - データアクセス
 * 6. SyncProvider - データ同期
 * 7. QueryProvider - React Query
 * 8. ThemeProvider - テーマ管理（NativeWindのcolorScheme設定）
 * 9. ConsentProvider - 利用規約同意チェック
 * 10. PushNotificationInitializer - プッシュ通知初期化
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider
        apiKey={POSTHOG_API_KEY}
        options={{ host: POSTHOG_HOST }}
      >
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
      </PostHogProvider>
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
