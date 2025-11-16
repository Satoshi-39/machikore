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
    router.dismiss();
  };

  const handleCreateMap = () => {
    // CreateMenuPage側でアニメーションが完了してからこのコールバックが呼ばれる
    // アニメーション完了後にマップ作成ページを開く
    setTimeout(() => {
      router.push('/create-map');
    }, 350); // アニメーション250ms + モーダル閉じる100ms
  };

  const handleCreateSpot = () => {
    // TODO: スポット作成画面への遷移を実装
    console.log('スポット作成');
    // アニメーション完了後に閉じるため、CreateMenuPage側のhandleCloseを使う
  };

  const handleCreateBlog = () => {
    // TODO: ブログ作成画面への遷移を実装
    console.log('ブログ作成');
    // アニメーション完了後に閉じるため、CreateMenuPage側のhandleCloseを使う
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
