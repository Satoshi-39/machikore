/**
 * 発見タブ内のスタックナビゲーション
 *
 * タブ内でスタックを形成し、タブバーを維持したまま画面遷移を行う
 */

import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="default-map" />
      <Stack.Screen name="search" />
      <Stack.Screen name="prefectures" />
      <Stack.Screen name="countries" />
      <Stack.Screen name="view-history" />
      <Stack.Screen name="today-picks" />
      <Stack.Screen name="popular-maps" />
      <Stack.Screen name="category-maps/[categoryId]" />
      <Stack.Screen name="featured/[id]" />
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
