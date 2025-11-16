/**
 * 作成メニュー
 *
 * Expo Router: /(tabs)/create
 * プラスボタンから開かれる作成メニュー
 */

import { useRouter } from 'expo-router';
import { CreateMenuPage } from '@/pages/create-menu';

export default function CreateScreen() {
  const router = useRouter();

  const handleClose = () => {
    router.dismiss();
  };

  const handleCreateMap = () => {
    router.push('/create-map');
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
