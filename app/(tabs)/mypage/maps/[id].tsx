/**
 * マップ詳細画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/maps/:id
 * マップIDをMapPageに渡して表示
 */

import { useLocalSearchParams } from 'expo-router';
import { MapPage } from '@/pages/map';

export default function MapDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapPage mapId={id} />;
}
