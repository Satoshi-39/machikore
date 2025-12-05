import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast, { BaseToast, type BaseToastProps } from 'react-native-toast-message';
import 'react-native-reanimated';
import '../global.css';

import { AppProviders, useIsDarkMode } from '@/shared/lib/providers';
import { initDatabase, initMapbox } from '@/shared/lib/init';
import { colors } from '@/shared/config';

// カスタムToast設定（ダークモード対応）
const createToastConfig = (isDarkMode: boolean) => ({
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary.DEFAULT,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.danger,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.info,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
});

// AppProvidersの内側で使うためのコンポーネント
function RootNavigator() {
  const isDarkMode = useIsDarkMode();

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
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
        </Stack>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <Toast config={createToastConfig(isDarkMode)} />
      </ThemeProvider>
    );
  }

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Mapbox初期化（同期処理）
    initMapbox();

    // データベース初期化（非同期処理）
    initDatabase()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error('初期化エラー:', err);
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

