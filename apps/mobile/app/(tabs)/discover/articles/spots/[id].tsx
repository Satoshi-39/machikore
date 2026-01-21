/**
 * スポット記事画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/articles/spots/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { SpotArticlePage } from '@/pages/spot-article';

export default function SpotArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SpotArticlePage spotId={id} />;
}
