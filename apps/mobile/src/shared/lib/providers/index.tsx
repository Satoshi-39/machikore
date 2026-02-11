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
import { POSTHOG_API_KEY, POSTHOG_HOST } from '@/shared/lib/init/posthog';
import { DEBUG_DISABLE_POSTHOG } from '@/shared/config';
import { I18nProvider } from './I18nProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * ビジネスロジック系プロバイダーを統合
 *
 * 順序が重要：
 * 1. GestureHandlerRootView - ジェスチャー処理（Bottom Sheetなど）
 * 2. PostHogProvider - アナリティクス（早い段階で初期化）
 * 3. MenuProvider - ポップアップメニュー
 * 4. QueryProvider - React Query
 * 5. I18nProvider - 多言語対応（AuthProviderより前に配置）
 * 6. ThemeProvider - テーマ管理（AuthProviderより前に配置。オンボーディング画面でもCSS変数が必要）
 * 7. AuthProvider - 認証状態の初期化（オンボーディング画面をearly returnで表示）
 * 8. ConsentProvider - 利用規約同意チェック
 *
 * ※ PushNotificationProviderはfeatures層に依存するため、app層（_layout.tsx）で直接hookを呼び出す
 * ※ UI系Provider（NavigationTheme, Keyboard, BottomSheet）はUIProvidersで管理
 */
export function AppProviders({ children }: AppProvidersProps) {
  const innerContent = (
    <MenuProvider>
      <QueryProvider>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <ConsentProvider>
                {children}
              </ConsentProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </QueryProvider>
    </MenuProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {DEBUG_DISABLE_POSTHOG ? (
        innerContent
      ) : (
        <PostHogProvider
          apiKey={POSTHOG_API_KEY}
          options={{
            host: POSTHOG_HOST,
            flushInterval: 60000,  // 60秒（デフォルト10秒からEnergy Impact削減）
            flushAt: 30,           // 30イベント蓄積後にフラッシュ（デフォルト20）
          }}
          autocapture={{
            captureScreens: true,
            captureTouches: false,
          }}
          debug={__DEV__}
        >
          {innerContent}
        </PostHogProvider>
      )}
    </GestureHandlerRootView>
  );
}

// 個別エクスポート
export { QueryProvider } from './query-provider';
export { AuthProvider } from './auth-provider';
export { ThemeProvider, useIsDarkMode, useNavigationTheme } from './ThemeProvider';
export { ConsentProvider } from './consent-provider';
export { I18nProvider, useI18n } from './I18nProvider';
export { UIProviders } from './ui-providers';
