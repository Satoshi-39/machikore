/**
 * スポット記事編集画面
 *
 * スポットの記事をリッチエディタで編集
 */

import { useLocalSearchParams } from 'expo-router';
import { EditSpotArticlePage } from '@/pages/edit-spot-article';

export default function EditSpotArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <EditSpotArticlePage spotId={id} />;
}
