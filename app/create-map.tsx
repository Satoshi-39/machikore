/**
 * マップ作成画面
 *
 * 新しいマップを作成するページ
 */

import { Stack } from 'expo-router';
import { CreateMapPage } from '@/pages/create-map';

export default function CreateMapScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'マップ作成',
          headerShown: true,
        }}
      />
      <CreateMapPage />
    </>
  );
}
