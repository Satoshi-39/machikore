/**
 * マップ記事画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/articles/maps/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { MapArticlePage } from '@/pages/map-article';

export default function MapArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MapArticlePage mapId={id} />;
}
