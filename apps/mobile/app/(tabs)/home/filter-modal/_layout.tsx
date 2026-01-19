/**
 * フィルターモーダル用レイアウト（ホームタブ内）
 */

import { Stack } from 'expo-router';

export default function FilterModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
