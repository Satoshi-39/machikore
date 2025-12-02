import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast, { BaseToast, type BaseToastProps } from 'react-native-toast-message';
import 'react-native-reanimated';
import '../global.css';

import { AppProviders } from '@/shared/lib/providers';
import { initDatabase, initMapbox } from '@/shared/lib/init';

// カスタムToast設定（successを青に統一）
const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#007AFF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
      }}
    />
  ),
};

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
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-base text-gray-600">初期化中...</Text>
      </View>
    );
  }

  // エラー
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Text className="text-xl font-bold text-red-500 mb-2">初期化エラー</Text>
        <Text className="text-sm text-gray-600 text-center">{error.message}</Text>
      </View>
    );
  }

  return (
    <AppProviders>
      <ThemeProvider value={DefaultTheme}>
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
            name="edit-spot"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit-map"
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
        </Stack>
        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </ThemeProvider>
    </AppProviders>
  );
}

