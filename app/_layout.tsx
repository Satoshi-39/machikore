import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import 'react-native-reanimated';
import '../global.css';

import { AppProviders, useIsDarkMode } from '@/shared/lib/providers';
import { initDatabase, initMapbox, initRevenueCat, initSentry, wrapWithSentry } from '@/shared/lib/init';
import { initializeI18n } from '@/shared/lib/i18n';
import { AppToast } from '@/shared/ui';
import { log } from '@/shared/config/logger';

// Sentry初期化（最初に実行）
initSentry();

// AppProvidersの内側で使うためのコンポーネント
function RootNavigator() {
  const isDarkMode = useIsDarkMode();

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <BottomSheetModalProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="schedule"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-map"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-spot"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="machi/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/sign-in"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/sign-up"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/auth-required"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="create-menu"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="select-map"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="users/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-spot/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-spot-article/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-map/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="bookmarks"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="likes"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="spots/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="maps/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="comments/spots/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="comments/maps/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-collection"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-collection/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-article/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-article-intro/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-article-outro/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add-maps-to-collection"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="report"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-spot-article"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <AppToast />
      </BottomSheetModalProvider>
      </ThemeProvider>
    );
  }

function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Mapbox初期化（同期処理）
    initMapbox();

    // 初期化処理（非同期）
    Promise.all([
      initDatabase(),
      initializeI18n(),
    ])
      .then(() => {
        // RevenueCat初期化（非同期、失敗してもアプリは動作継続）
        initRevenueCat();
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
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-base text-foreground-secondary dark:text-dark-foreground-secondary">初期化中...</Text>
      </View>
    );
  }

  // エラー
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background p-5">
        <Text className="text-xl font-bold text-red-500 mb-2">初期化エラー</Text>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center">{error.message}</Text>
      </View>
    );
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

// Sentryでラップしてエクスポート
export default wrapWithSentry(RootLayout);

