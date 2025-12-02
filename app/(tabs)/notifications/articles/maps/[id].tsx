/**
 * マップ記事画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/articles/maps/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { MapArticlePage } from '@/pages/map-article';

export default function MapArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapArticlePage mapId={id} />;
}
