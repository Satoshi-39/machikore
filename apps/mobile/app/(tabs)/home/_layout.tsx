/**
 * ホームタブ内のスタックナビゲーション
 *
 * タブ内でスタックを形成し、タブバーを維持したまま画面遷移を行う
 */

import { Stack } from 'expo-router';

// ディープリンクで直接ネストされた画面に遷移した場合、
// indexをスタックの底に配置してバックボタンを有効にする
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="maps/[mapId]" />
      <Stack.Screen name="maps/[mapId]/spots/[spotId]" />
      <Stack.Screen name="spots/[id]" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="comments/spots/[id]" />
      <Stack.Screen name="comments/maps/[id]" />
      <Stack.Screen name="articles/maps/[id]" />
      <Stack.Screen name="articles/spots/[id]" />
      <Stack.Screen name="bookmarks/index" />
      <Stack.Screen name="bookmarks/[folderId]" />
      <Stack.Screen name="collections/[id]" />
      <Stack.Screen name="search" />
      <Stack.Screen
        name="filter-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
