/**
 * マップタブ内のスタックナビゲーション
 *
 * タブ内でスタックを形成し、タブバーを維持したまま画面遷移を行う
 */

import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="spots/[id]" />
      <Stack.Screen name="users/[id]" />
    </Stack>
  );
}
