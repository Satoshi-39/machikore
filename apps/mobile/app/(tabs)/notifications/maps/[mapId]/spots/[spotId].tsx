/**
 * スポット詳細画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/maps/:mapId/spots/:spotId
 * マップID内の特定スポットにフォーカスして表示
 */

import { useLocalSearchParams } from 'expo-router';
import { UserMapPage } from '@/pages/user-map';

export default function SpotDetailScreen() {
  const { mapId, spotId } = useLocalSearchParams<{ mapId: string; spotId: string }>();

  if (!mapId || !spotId) return null;
  return <UserMapPage mapId={mapId} initialSpotId={spotId} />;
}
