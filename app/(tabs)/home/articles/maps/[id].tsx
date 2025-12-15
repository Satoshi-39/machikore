/**
 * マップ記事画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/articles/maps/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { MapArticlePage } from '@/pages/map-article';

export default function MapArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapArticlePage mapId={id} />;
}
