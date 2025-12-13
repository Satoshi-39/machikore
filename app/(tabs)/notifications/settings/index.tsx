/**
 * 設定画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/settings
 */

import { useRouter } from 'expo-router';
import { SettingsPage } from '@/pages/settings';

export default function SettingsScreen() {
  const router = useRouter();

  const handleSignOutSuccess = () => {
    router.back();
  };

  return <SettingsPage onSignOutSuccess={handleSignOutSuccess} />;
}
