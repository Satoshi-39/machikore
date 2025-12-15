/**
 * マップ詳細画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/:id
 * マップIDをMapPageに渡して表示
 */

import { useLocalSearchParams } from 'expo-router';
import { MapPage } from '@/pages/map';

export default function MapDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapPage mapId={id} />;
}
