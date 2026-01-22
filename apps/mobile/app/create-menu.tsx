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
    // マップ選択後にスポット追加（検索モード）へ遷移
    router.push('/select-map?mode=spot');
  };

  const handleCreateArticle = () => {
    // マップ選択後に記事編集画面へ遷移
    router.push('/select-map?mode=article');
  };

  return (
    <CreateMenuPage
      onCreateMap={handleCreateMap}
      onCreateSpot={handleCreateSpot}
      onCreateArticle={handleCreateArticle}
      onClose={handleClose}
    />
  );
}
