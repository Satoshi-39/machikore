/**
 * 記事エディタ共通コンポーネント
 *
 * スポット記事の編集に使用するリッチテキストエディタ
 * - スポット作成時の記事編集
 * - スポット編集時の記事編集
 */

import { colors } from '@/shared/config';
import { EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader, PrivateBadge } from '@/shared/ui';
import { RichText, useKeyboard } from '@10play/tentap-editor';
import {
  useArticleEditor,
  useThumbnailTap,
  useEditorThumbnail,
  useInsertImage,
  useDescriptionProtection,
} from '../model';
import { EditorToolbar } from './EditorToolbar';
import { InsertMenu, type SpotImage } from './InsertMenu';
import { ThumbnailSelector } from './ThumbnailSelector';
import React, { useCallback, useState } from 'react';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface ArticleEditorProps {
  /** ページタイトル */
  title: string;
  /** 初期コンテンツ（ストアまたはAPIから取得） */
  initialArticleContent: ProseMirrorDoc | null;
  /** 保存時のコールバック（成功時にtrueを返すPromise） */
  onSave: (content: ProseMirrorDoc | null) => Promise<boolean>;
  /** 保存中かどうか */
  isSaving?: boolean;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** 保存ボタンのテキスト */
  saveButtonText?: string;
  /** スポットの公開状態（非公開の場合はタイトルに鍵マーク表示） */
  isPublic?: boolean;
  /** スポットID（画像アップロード用） */
  spotId?: string;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 新規画像アップロード時のコールバック（imageIdを返す） */
  onImageUploaded?: (imageUrl: string, imageId: string) => Promise<string | null>;
  /** 現在のサムネイル画像ID */
  thumbnailImageId?: string | null;
  /** サムネイル変更時のコールバック */
  onThumbnailChange?: (imageId: string | null) => void;
  /** 画像削除時のコールバック */
  onDeleteImage?: (imageId: string) => void;
  /** 初期description（スポットの一言） */
  initialDescription?: string;
  /** description変更時のコールバック */
  onDescriptionChange?: (description: string) => void;
}

export function ArticleEditor({
  title,
  initialArticleContent,
  onSave,
  isSaving = false,
  isLoading = false,
  saveButtonText,
  isPublic,
  spotId,
  spotImages = [],
  onImageUploaded,
  thumbnailImageId,
  onThumbnailChange,
  onDeleteImage,
  initialDescription = '',
  onDescriptionChange,
}: ArticleEditorProps) {
  const insets = useSafeAreaInsets();
  const { isKeyboardUp, keyboardHeight } = useKeyboard();

  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);

  // サムネイル機能が有効かどうか
  const isThumbnailEnabled = !!onThumbnailChange;

  // 現在のサムネイル画像URLを取得
  const thumbnailImageUrl = React.useMemo(() => {
    if (spotImages.length === 0) return null;
    if (thumbnailImageId) {
      const img = spotImages.find((img) => img.id === thumbnailImageId);
      return img?.cloud_path || null;
    }
    // order_indexが最小の画像を自動選択
    const sorted = [...spotImages].sort((a, b) => a.order_index - b.order_index);
    return sorted[0]?.cloud_path || null;
  }, [spotImages, thumbnailImageId]);

  // エディタのコアロジック
  const {
    editor,
    editorState,
    charCount,
    isDarkMode,
    initialContent,
    handleSave,
    handleBack,
  } = useArticleEditor({
    initialArticleContent,
    isLoading,
    onSave,
    // サムネイル情報を渡す
    thumbnailImageUrl: isThumbnailEnabled ? thumbnailImageUrl : undefined,
    isThumbnailEnabled,
    // description情報を渡す
    initialDescription: isThumbnailEnabled ? initialDescription : undefined,
    onDescriptionChange: isThumbnailEnabled ? onDescriptionChange : undefined,
  });

  // サムネイル管理（変更検知・更新のみ）
  const { updateThumbnailInEditor } = useEditorThumbnail({
    editor,
    editorState,
    spotImages,
    thumbnailImageId,
    isContentReady: initialContent !== null,
    isThumbnailEnabled,
  });

  // サムネイルタップ検知・削除防止
  const { handleWebViewMessage } = useThumbnailTap({
    editor,
    editorState,
    onThumbnailTap: useCallback(() => setShowThumbnailSelector(true), []),
  });

  // 画像挿入
  const { handleInsertImage } = useInsertImage({ editor, editorState });

  // description削除防止
  useDescriptionProtection({
    editor,
    editorState,
    isEnabled: isThumbnailEnabled,
  });

  // サムネイル変更ハンドラー
  const handleThumbnailChange = useCallback(async (imageId: string | null) => {
    onThumbnailChange?.(imageId);
    await updateThumbnailInEditor(imageId);
  }, [onThumbnailChange, updateThumbnailInEditor]);

  // ページ背景色
  const pageBgColor = isDarkMode ? EDITOR_DARK_BG_COLOR : colors.light.surface;

  // 非公開スポットの鍵マーク
  const privateBadge = isPublic === false ? <PrivateBadge size={16} className="ml-1" /> : undefined;

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: pageBgColor }}>
        <PageHeader title={title} titleSuffix={privateBadge} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  // 保存ボタン
  const saveButton = (
    <Pressable onPress={handleSave} disabled={isSaving} hitSlop={8}>
      {isSaving ? (
        <ActivityIndicator size="small" color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']} />
      ) : (
        <Text className="text-base font-semibold text-on-surface">
          {saveButtonText}
        </Text>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: pageBgColor }}>
      <PageHeader
        title={title}
        titleSuffix={privateBadge}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* エディタ */}
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View className="flex-1">
          <RichText
            editor={editor}
            onMessage={handleWebViewMessage}
            exclusivelyUseCustomOnMessage={false}
          />
          <View className="absolute right-6 bottom-2">
            <Text className="text-xs text-on-surface-variant">
              {charCount}文字
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ツールバー */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: isKeyboardUp ? keyboardHeight : insets.bottom,
        }}
      >
        <EditorToolbar
          editor={editor}
          onPlusPress={() => setShowInsertMenu(true)}
        />
      </View>

      {/* 挿入メニュー */}
      <InsertMenu
        visible={showInsertMenu}
        onClose={() => setShowInsertMenu(false)}
        onInsertImage={handleInsertImage}
        spotId={spotId}
        spotImages={spotImages}
        onImageUploaded={onImageUploaded}
        onDeleteImage={onDeleteImage}
      />

      {/* サムネイル選択モーダル */}
      <ThumbnailSelector
        visible={showThumbnailSelector}
        onClose={() => setShowThumbnailSelector(false)}
        onSelectThumbnail={handleThumbnailChange}
        spotId={spotId}
        spotImages={spotImages}
        currentThumbnailId={thumbnailImageId}
        onImageUploaded={onImageUploaded}
        onDeleteImage={onDeleteImage}
      />
    </View>
  );
}
