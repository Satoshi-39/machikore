/**
 * 作成メニュー
 *
 * Expo Router: /(tabs)/create
 * プラスボタンから開かれる作成メニュー
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { CreateMenuPage } from '@/pages/create-menu';

export default function CreateScreen() {
  const router = useRouter();

  const handleClose = () => {
    // BottomSheetがアニメーション完了後にこのコールバックを呼ぶ
    router.dismiss();
  };

  const handleCreateMap = () => {
    // BottomSheetが閉じてから（close()内で処理）マップ作成ページを開く
    router.push('/create-map');
  };

  const handleCreateSpot = () => {
    // スポット追加方法選択ページへ遷移
    router.push('/create-spot-method');
  };

  const handleCreateCollection = () => {
    // コレクション作成画面へ遷移
    router.push('/create-collection');
  };

  return (
    <CreateMenuPage
      onCreateMap={handleCreateMap}
      onCreateSpot={handleCreateSpot}
      onCreateCollection={handleCreateCollection}
      onClose={handleClose}
    />
  );
}
