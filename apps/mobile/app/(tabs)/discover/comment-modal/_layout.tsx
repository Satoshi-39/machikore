/**
 * コメントモーダル用レイアウト（発見タブ内）
 */

import { Stack } from 'expo-router';

export default function CommentModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="spots/[id]" />
      <Stack.Screen name="maps/[id]" />
    </Stack>
  );
}
