/**
 * 設定画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/settings
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
