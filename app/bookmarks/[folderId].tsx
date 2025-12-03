/**
 * ブックマークフォルダ詳細ページ
 */

import { BookmarkFolderPage } from '@/pages/bookmarks';
import { useLocalSearchParams } from 'expo-router';

export default function BookmarkFolderScreen() {
  const { folderId, tab } = useLocalSearchParams<{ folderId: string; tab?: string }>();

  if (!folderId) {
    return null;
  }

  return <BookmarkFolderPage folderId={folderId} tabMode={tab as 'spots' | 'maps' | undefined} />;
}
