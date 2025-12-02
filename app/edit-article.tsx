/**
 * 記事編集画面のルート
 */

import { Stack, useLocalSearchParams } from 'expo-router';
import { EditArticlePage } from '@/pages/edit-article';

export default function EditArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditArticlePage mapId={id} />
    </>
  );
}
