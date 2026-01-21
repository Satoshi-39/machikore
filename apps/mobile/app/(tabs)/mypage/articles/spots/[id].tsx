/**
 * スポット記事画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/articles/spots/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { SpotArticlePage } from '@/pages/spot-article';

export default function SpotArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SpotArticlePage spotId={id} />;
}
