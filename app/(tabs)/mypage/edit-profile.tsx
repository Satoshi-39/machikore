/**
 * プロフィール編集画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/edit-profile
 */

import { useRouter } from 'expo-router';
import { EditProfilePage } from '@/pages/edit-profile';

export default function EditProfileScreen() {
  const router = useRouter();

  const handleSaveSuccess = () => {
    router.back();
  };

  return <EditProfilePage onSaveSuccess={handleSaveSuccess} />;
}
