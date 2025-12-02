/**
 * マップ記事画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/articles/maps/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { MapArticlePage } from '@/pages/map-article';

export default function MapArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapArticlePage mapId={id} />;
}
