/**
 * マップ記事画面（マップタブ内スタック）
 *
 * URL: /(tabs)/map/articles/maps/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { MapArticlePage } from '@/pages/map-article';

export default function MapArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapArticlePage mapId={id} />;
}
