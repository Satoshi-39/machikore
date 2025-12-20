/**
 * スポット作成時の記事編集ページ
 *
 * スポット作成前の記事をリッチエディタで編集する
 * 編集内容はZustandストアに一時保存される
 */

import { useRouter } from 'expo-router';
import { useSelectedPlaceStore } from '@/features/search-places';
import { ArticleEditor } from '@/features/edit-article';
import type { ProseMirrorDoc } from '@/shared/types';
import { useCallback } from 'react';

export function CreateSpotArticlePage() {
  const router = useRouter();
  const draftArticleContent = useSelectedPlaceStore((state) => state.draftArticleContent);
  const setDraftArticleContent = useSelectedPlaceStore((state) => state.setDraftArticleContent);

  const handleSave = useCallback((content: ProseMirrorDoc | null) => {
    setDraftArticleContent(content);
    router.back();
  }, [setDraftArticleContent, router]);

  return (
    <ArticleEditor
      title="記事を書く"
      initialArticleContent={draftArticleContent}
      onSave={handleSave}
      saveButtonText="完了"
    />
  );
}
