/**
 * ルートレイアウト
 *
 * アプリケーションのエントリーポイント
 * - 初期化処理（Sentry, Mapbox, Database等）
 * - プロバイダーの統合
 * - ルーティング設定
 */

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Linking } from 'react-native';
import { Stack, router, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from '@rn-primitives/portal';
import 'react-native-reanimated';
import '../global.css';

// NativeWind cssInterop 設定（Ionicons, ActivityIndicatorにclassNameでの色指定を可能にする）
import '@/shared/lib/nativewind-interop';

import { AppProviders, UIProviders, useIsDarkMode } from '@/shared/lib/providers';
import { initDatabase, initMapbox, initRevenueCat, initSentry, initAdMob, wrapWithSentry } from '@/shared/lib/init';
import { cleanupExpiredDraftImages } from '@/shared/lib/image';
import { rewriteDeepLinkPath } from '@/shared/lib/navigation';
import { AppToast } from '@/shared/ui';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { log } from '@/shared/config/logger';
import { usePushNotifications } from '@/features/notification-settings';

// Sentry初期化（最初に実行）
initSentry();

// コールドスタートのディープリンク時に(tabs)をスタック底に配置
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

/**
 * アプリコンテンツ
 *
 * AppProviders/UIProvidersの内側で使用
 * - usePushNotifications: features層に依存するためapp層で直接呼び出し
 * - useIsDarkMode: StatusBarのスタイル設定に使用
 */
function AppContent() {
  const isDarkMode = useIsDarkMode();
  const rootNavigationState = useRootNavigationState();
  const isRouterReady = rootNavigationState?.key != null;

  // プッシュ通知の初期化（認証済みユーザーのみ）
  usePushNotifications();

  // コールドスタート時のディープリンク処理
  // ルーター準備完了後にLinking.getInitialURL()でURLを取得し、router.pushする
  useEffect(() => {
    if (!isRouterReady) return;

    Linking.getInitialURL().then((url) => {
      if (!url) return;
      try {
        const urlObj = new URL(url);
        const fullPath = `/${urlObj.hostname}${urlObj.pathname}`;
        const rewritten = rewriteDeepLinkPath(fullPath);
        if (rewritten) {
          log.debug('[DeepLink] Cold start push:', rewritten);
          router.push(rewritten);
        }
      } catch (error) {
        log.error('[DeepLink] Failed to parse initial URL:', error);
      }
    });
  }, [isRouterReady]);

  // ウォームスタート時のディープリンク処理
  // +native-intent.tsxがfalseを返してExpo Routerの自動ナビゲーションを抑制した後、
  // ここでrouter.pushを使ってホームタブのスタック上に記事を積む
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      try {
        // カスタムスキームURL (machikore://spots/id) では
        // hostnameが"spots"、pathnameが"/id"になるため結合する
        const urlObj = new URL(url);
        const fullPath = `/${urlObj.hostname}${urlObj.pathname}`;
        const rewritten = rewriteDeepLinkPath(fullPath);
        if (rewritten) {
          log.debug('[DeepLink] Warm start push:', rewritten);
          router.push(rewritten);
        }
      } catch (error) {
        log.error('[DeepLink] Failed to handle warm start link:', error);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen
          name="settings"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="schedule"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="create-map"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="create-spot"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="machi/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="auth/sign-in"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="auth/sign-up"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="auth/verify"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="auth/auth-required"
          options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="create-spot-method"
          options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="create-menu"
          options={{ presentation: 'transparentModal', headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="select-map"
          options={{ presentation: 'transparentModal', headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="users/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="edit-spot/[id]"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="edit-spot-article/[id]"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="edit-map/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="bookmarks"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="likes"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="spots/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="maps/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="comments/spots/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="comments/maps/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="create-collection"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="edit-collection/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="edit-article/[id]"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="edit-article-intro/[id]"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="edit-article-outro/[id]"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="add-maps-to-collection"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="report"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="create-spot-article"
          options={{ presentation: 'card', headerShown: false, gestureEnabled: false }}
        />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppToast />
      <PortalHost />
    </>
  );
}

/**
 * ルートレイアウト
 *
 * 初期化処理とプロバイダーの統合を担当
 */
function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Mapbox初期化（同期処理）
    initMapbox();

    // 初期化処理（非同期）
    initDatabase()
      .then(() => {
        // RevenueCat初期化（非同期、失敗してもアプリは動作継続）
        initRevenueCat();
        // AdMob初期化（非同期、失敗してもアプリは動作継続）
        initAdMob();
        // 期限切れのドラフト画像をクリーンアップ（1日以上経過したもの）
        cleanupExpiredDraftImages().catch((err) => {
          log.warn('[App] ドラフト画像のクリーンアップに失敗:', err);
        });
        setIsReady(true);
      })
      .catch((err) => {
        log.error('[App] 初期化エラー:', err);
        setError(err);
      });
  }, []);

  // 初期化中
  if (!isReady && !error) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-base text-on-surface-variant">
          初期化中...
        </Text>
      </View>
    );
  }

  // エラー
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-surface p-5">
        <Text className="text-xl font-bold text-red-500 mb-2">初期化エラー</Text>
        <Text className="text-sm text-on-surface-variant text-center">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppProviders>
        <UIProviders>
          <AppContent />
        </UIProviders>
      </AppProviders>
    </ErrorBoundary>
  );
}

// Sentryでラップしてエクスポート
export default wrapWithSentry(RootLayout);
