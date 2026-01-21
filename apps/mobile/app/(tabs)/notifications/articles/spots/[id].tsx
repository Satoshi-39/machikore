/**
 * スポット記事画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/articles/spots/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { SpotArticlePage } from '@/pages/spot-article';

export default function SpotArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SpotArticlePage spotId={id} />;
}
