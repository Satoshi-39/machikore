/**
 * 設定画面ルート
 */

import { Stack } from 'expo-router';
import { SettingsPage } from '@/pages/settings';

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '設定',
          headerShown: true,
          headerBackTitle: '戻る',
        }}
      />
      <SettingsPage />
    </>
  );
}
