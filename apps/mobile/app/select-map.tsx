/**
 * マップ選択画面
 *
 * Expo Router: /select-map
 * スポット作成時/記事編集時にマップを選択するモーダル
 */

import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SelectMapPage } from '@/pages/select-map';
import { useMapStore } from '@/entities/map';
import { useCurrentTab } from '@/shared/lib';

export default function SelectMapScreen() {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const sourceTab = useMapStore((state) => state.sourceTab);
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const handleClose = () => {
    // BottomSheetがアニメーション完了後にこのコールバックを呼ぶ
    router.dismiss();
  };

  const handleSelectMap = (mapId: string) => {
    console.log('マップ選択完了:', mapId, 'sourceTab:', sourceTab, 'mode:', mode);
    const tab = sourceTab ?? currentTab ?? 'home';

    switch (mode) {
      case 'article':
        // 記事編集画面に遷移
        router.push(`/edit-article/${mapId}`);
        break;
      case 'spot':
        // スポット追加: マップ画面に遷移し、検索モードを開く
        router.push(`/(tabs)/${tab}/maps/${mapId}?openSearch=true`);
        break;
    }
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
