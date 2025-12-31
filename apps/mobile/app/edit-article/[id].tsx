/**
 * 記事編集画面のルート
 */

import { useLocalSearchParams } from 'expo-router';
import { EditArticlePage } from '@/pages/edit-article';

export default function EditArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <EditArticlePage mapId={id} />;
}
