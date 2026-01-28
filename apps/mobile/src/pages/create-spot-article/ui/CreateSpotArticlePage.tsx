/**
 * スポット作成時の記事編集ページ
 *
 * スポット作成前の記事をリッチエディタで編集する
 * 編集内容はZustandストアに一時保存される
 * - サムネイル選択（ドラフト画像から）
 * - 一言説明文
 * - 記事本文
 */

import { useCallback } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { useSelectedPlaceStore } from '@/features/search-places';
import { ArticleEditor } from '@/features/edit-article';
import { useDraftImagesForEditor } from '@/features/create-article';
import { useI18n } from '@/shared/lib/i18n';
import type { ProseMirrorDoc } from '@/shared/types';

export function CreateSpotArticlePage() {
  const { t } = useI18n();

  // ストアから状態を取得
  const draftArticleContent = useSelectedPlaceStore((state) => state.draftArticleContent);
  const setDraftArticleContent = useSelectedPlaceStore((state) => state.setDraftArticleContent);
  const draftDescription = useSelectedPlaceStore((state) => state.draftDescription);
  const setDraftDescription = useSelectedPlaceStore((state) => state.setDraftDescription);
  const draftImages = useSelectedPlaceStore((state) => state.draftImages);
  const draftThumbnailIndex = useSelectedPlaceStore((state) => state.draftThumbnailIndex);
  const setDraftThumbnailIndex = useSelectedPlaceStore((state) => state.setDraftThumbnailIndex);

  // ドラフト画像をBase64 data URIに変換（WebView内で表示するため）
  const { spotImages, isConverting } = useDraftImagesForEditor(draftImages);

  // 現在のサムネイル画像ID（インデックスを文字列に変換）
  const thumbnailImageId = draftThumbnailIndex !== null ? String(draftThumbnailIndex) : null;

  // サムネイル変更ハンドラー
  const handleThumbnailChange = useCallback((imageId: string | null) => {
    if (imageId === null) {
      setDraftThumbnailIndex(null);
    } else {
      setDraftThumbnailIndex(parseInt(imageId, 10));
    }
  }, [setDraftThumbnailIndex]);

  // 一言説明文変更ハンドラー
  const handleDescriptionChange = useCallback((description: string) => {
    setDraftDescription(description);
  }, [setDraftDescription]);

  // 保存ハンドラー
  const handleSave = useCallback(async (content: ProseMirrorDoc | null): Promise<boolean> => {
    setDraftArticleContent(content);
    Alert.alert(t('editArticle.saved'));
    return true;
  }, [setDraftArticleContent, t]);

  // Base64変換中はローディング表示
  if (isConverting) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <ArticleEditor
      title={t('spot.articleWrite')}
      initialArticleContent={draftArticleContent}
      onSave={handleSave}
      saveButtonText={t('common.save')}
      // サムネイル・一言機能を有効化（Base64変換済み画像を渡す）
      spotImages={spotImages}
      thumbnailImageId={thumbnailImageId}
      onThumbnailChange={handleThumbnailChange}
      initialDescription={draftDescription}
      onDescriptionChange={handleDescriptionChange}
      // スポット作成時はspotIdがないため、新規アップロード機能は無効
      // （InsertMenu/ThumbnailSelectorでspotIdがないと新規アップロードできない設計）
    />
  );
}
