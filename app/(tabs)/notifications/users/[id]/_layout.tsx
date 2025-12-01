/**
 * ユーザー関連画面 - スタックナビゲーションレイアウト（通知タブ）
 */

import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="likes" />
    </Stack>
  );
}
