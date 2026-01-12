/**
 * コメントモーダル用レイアウト（ホームタブ内）
 *
 * モーダルの上にユーザープロフィール画面などをスタックで重ねられるようにする
 */

import { Stack } from 'expo-router';

export default function CommentModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="spots/[id]" />
      <Stack.Screen name="maps/[id]" />
    </Stack>
  );
}
