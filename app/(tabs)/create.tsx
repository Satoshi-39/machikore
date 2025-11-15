/**
 * 作成タブ
 *
 * 認証が必要な機能
 * タブレイアウトで未ログイン時のアクセスは制御される
 */

import { useRouter } from 'expo-router';
import { CreateMenuPage } from '@/pages/create';

export default function CreateTab() {
  const router = useRouter();

  const handleCreateMap = () => {
    // TODO: マップ作成画面への遷移を実装
    console.log('マップ作成');
  };

  const handleClose = () => {
    // タブなので閉じる動作は不要（何もしない）
  };

  return (
    <CreateMenuPage onCreateMap={handleCreateMap} onClose={handleClose} />
  );
}
