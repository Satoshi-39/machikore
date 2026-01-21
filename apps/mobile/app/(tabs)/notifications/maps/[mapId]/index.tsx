/**
 * マップ詳細画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/maps/:mapId
 * マップIDをUserMapPageに渡して表示
 */

import { useLocalSearchParams } from 'expo-router';
import { UserMapPage } from '@/pages/user-map';

export default function MapDetailScreen() {
  const { mapId } = useLocalSearchParams<{ mapId: string }>();

  if (!mapId) return null;
  return <UserMapPage mapId={mapId} />;
}
