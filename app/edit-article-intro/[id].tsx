/**
 * まえがき編集画面
 *
 * マップ記事のまえがきをリッチエディタで編集
 */

import { useLocalSearchParams } from 'expo-router';
import { EditArticleIntroPage } from '@/pages/edit-article-intro';

export default function EditArticleIntroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <EditArticleIntroPage mapId={id} />;
}
