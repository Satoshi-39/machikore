/**
 * マップ選択画面
 *
 * Expo Router: /select-map
 * スポット作成時にマップを選択するモーダル
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { SelectMapPage } from '@/pages/select-map';
import { useMapStore } from '@/entities/map';

export default function SelectMapScreen() {
  const router = useRouter();
  const sourceTab = useMapStore((state) => state.sourceTab);

  const handleClose = () => {
    // BottomSheetがアニメーション完了後にこのコールバックを呼ぶ
    router.dismiss();
  };

  const handleSelectMap = (mapId: string) => {
    console.log('マップ選択完了:', mapId, 'sourceTab:', sourceTab);
    // 元のタブ内のマップ画面に遷移（デフォルトはhomeタブ）
    const tab = sourceTab ?? 'home';
    router.push(`/(tabs)/${tab}/maps/${mapId}?addSpot=${Date.now()}`);
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
