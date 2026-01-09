/**
 * アプリケーションプロバイダー
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { PostHogProvider } from 'posthog-react-native';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './ThemeProvider';
import { ConsentProvider } from './consent-provider';
import { PushNotificationProvider } from './push-notification-provider';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '@/shared/lib/init/posthog';
import { I18nProvider } from './I18nProvider';

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
 * 4. QueryProvider - React Query
 * 5. I18nProvider - 多言語対応（AuthProviderより前に配置）
 * 6. AuthProvider - 認証状態の初期化（デモグラフィック画面でuseI18nを使用）
 * 7. ThemeProvider - テーマ管理（NativeWindのcolorScheme設定）
 * 8. ConsentProvider - 利用規約同意チェック
 * 9. PushNotificationProvider - プッシュ通知初期化（認証済みユーザーのみ）
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider
        apiKey={POSTHOG_API_KEY}
        options={{
          host: POSTHOG_HOST,
        }}
        autocapture={{
          captureScreens: true,
          captureTouches: false,
        }}
        debug={__DEV__}
      >
        <MenuProvider>
          <QueryProvider>
            <I18nProvider>
              <AuthProvider>
                <ThemeProvider>
                  <ConsentProvider>
                    <PushNotificationProvider>
                      {children}
                    </PushNotificationProvider>
                  </ConsentProvider>
                </ThemeProvider>
              </AuthProvider>
            </I18nProvider>
          </QueryProvider>
        </MenuProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}

// 個別エクスポート
export { QueryProvider } from './query-provider';
export { AuthProvider } from './auth-provider';
export { ThemeProvider, useIsDarkMode, useNavigationTheme } from './ThemeProvider';
export { ConsentProvider } from './consent-provider';
export { I18nProvider, useI18n } from './I18nProvider';
