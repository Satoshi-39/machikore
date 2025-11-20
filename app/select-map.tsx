/**
 * マップ選択画面
 *
 * Expo Router: /select-map
 * スポット作成時にマップを選択するモーダル
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { SelectMapPage } from '@/pages/select-map';

export default function SelectMapScreen() {
  const router = useRouter();

  const handleClose = () => {
    // BottomSheetがアニメーション完了後にこのコールバックを呼ぶ
    router.dismiss();
  };

  const handleSelectMap = (mapId: string) => {
    console.log('マップ選択完了:', mapId);
    // スポット追加モードでマップページに遷移
    router.push(`/(tabs)/map?id=${mapId}&addSpot=true`);
  };

  const handleCreateNewMap = () => {
    // BottomSheetが閉じてから（close()内で処理）マップ作成ページを開く
    router.push('/create-map');
  };

  return (
    <SelectMapPage
      onSelectMap={handleSelectMap}
      onCreateNewMap={handleCreateNewMap}
      onClose={handleClose}
    />
  );
}
