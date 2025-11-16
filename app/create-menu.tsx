/**
 * 作成メニュー
 *
 * Expo Router: /(tabs)/create
 * プラスボタンから開かれる作成メニュー
 */

import { useRouter } from 'expo-router';
import { CreateMenuPage } from '@/pages/create';

export default function CreateScreen() {
  const router = useRouter();

  const handleCreateMap = () => {
    // TODO: マップ作成画面への遷移を実装
    console.log('マップ作成');
    router.back();
  };

  const handleCreateSpot = () => {
    // TODO: スポット作成画面への遷移を実装
    console.log('スポット作成');
    router.back();
  };

  const handleCreatePost = () => {
    // TODO: 投稿作成画面への遷移を実装
    console.log('投稿作成');
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <CreateMenuPage
      onCreateMap={handleCreateMap}
      onCreateSpot={handleCreateSpot}
      onCreatePost={handleCreatePost}
      onClose={handleClose}
    />
  );
}
