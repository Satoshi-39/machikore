/**
 * 設定画面ルート
 */

import { useRouter } from 'expo-router';
import { SettingsPage } from '@/pages/settings';

export default function SettingsScreen() {
  const router = useRouter();

  const handleSignOutSuccess = () => {
    // サインアウト成功後、設定画面を閉じてマイページに戻る
    router.back();
  };

  return <SettingsPage onSignOutSuccess={handleSignOutSuccess} />;
}
