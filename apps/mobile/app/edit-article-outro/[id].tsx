/**
 * あとがき編集画面
 *
 * マップ記事のあとがきをリッチエディタで編集
 */

import { useLocalSearchParams } from 'expo-router';
import { EditArticleOutroPage } from '@/pages/edit-article-outro';

export default function EditArticleOutroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <EditArticleOutroPage mapId={id} />;
}
