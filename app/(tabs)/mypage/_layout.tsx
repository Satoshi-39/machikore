/**
 * マイページタブ - スタックナビゲーションレイアウト
 */

import { Stack } from 'expo-router';

export default function MypageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="likes" />
      <Stack.Screen name="bookmarks" />
      <Stack.Screen name="maps/[id]" />
      <Stack.Screen name="spots/[id]" />
      <Stack.Screen name="users/[id]" />
    </Stack>
  );
}
