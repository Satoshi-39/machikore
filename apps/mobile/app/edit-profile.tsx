/**
 * プロフィール編集画面ルート
 *
 * クエリパラメータ:
 * - mode: 'simple' | 'full' （デフォルト: 'simple'）
 *   - simple: アイコン、表示名、自己紹介のみ（マイページから）
 *   - full: 全項目（設定から）
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { EditProfilePage } from '@/pages/edit-profile';

export default function EditProfileScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: 'simple' | 'full' }>();

  const handleSaveSuccess = () => {
    router.back();
  };

  return <EditProfilePage mode={mode || 'simple'} onSaveSuccess={handleSaveSuccess} />;
}
