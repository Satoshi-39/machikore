/**
 * マップ詳細画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/maps/:id
 * マップIDをUserMapPageに渡して表示
 */

import { useLocalSearchParams } from 'expo-router';
import { UserMapPage } from '@/pages/user-map';

export default function MapDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;
  return <UserMapPage mapId={id} />;
}
