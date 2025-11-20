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
    // BottomSheetが閉じてから（close()内で処理）マップ選択ページを開く
    router.push('/select-map');
  };

  const handleCreateBlog = () => {
    // TODO: ブログ作成画面への遷移を実装
    console.log('ブログ作成');
  };

  return (
    <CreateMenuPage
      onCreateMap={handleCreateMap}
      onCreateSpot={handleCreateSpot}
      onCreateBlog={handleCreateBlog}
      onClose={handleClose}
    />
  );
}
