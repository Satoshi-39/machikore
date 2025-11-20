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
    // TODO: マップ選択後、QuickAddSpotModalを表示（ステップ3で実装予定）
    console.log('マップ選択完了:', mapId);
    // 現在地を使ってスポット作成モーダルを表示
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
