/**
 * 記事エディタ共通コンポーネント
 *
 * スポット記事の編集に使用するリッチテキストエディタ
 * - スポット作成時の記事編集
 * - スポット編集時の記事編集
 *
 * 注意: 画像のアップロード・削除はスポット作成/編集ページの責務。
 * 記事ページでは既存画像プールからの挿入・サムネイル選択のみを担当する。
 */

import { colors, iconSizeNum } from '@/shared/config';
import { EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader, PrivateBadge } from '@/shared/ui';
import { RichText, useKeyboard } from '@10play/tentap-editor';
import {
  useArticleEditor,
  useEditorThumbnail,
  useInsertImage,
} from '../model';
import { EditorToolbar } from './EditorToolbar';
import { InsertMenu, type SpotImage } from './InsertMenu';
import React, { useCallback, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 現在のサムネイル画像ID */
  thumbnailImageId?: string | null;
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
  spotImages = [],
  thumbnailImageId,
  initialDescription = '',
  onDescriptionChange,
}: ArticleEditorProps) {
  const insets = useSafeAreaInsets();
  const { isKeyboardUp, keyboardHeight } = useKeyboard();

  const [showInsertMenu, setShowInsertMenu] = useState(false);

  // サムネイル機能が有効かどうか（thumbnailImageIdが渡されていれば読み取り専用表示）
  const isThumbnailEnabled = spotImages.length > 0;

  // 現在のサムネイル画像URLを取得
  const thumbnailImageUrl = React.useMemo(() => {
    if (!thumbnailImageId || spotImages.length === 0) return null;
    const img = spotImages.find((img) => img.id === thumbnailImageId);
    return img?.cloud_path || null;
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
    // サムネイル情報を渡す（読み取り専用表示用）
    thumbnailImageUrl: isThumbnailEnabled ? thumbnailImageUrl : undefined,
    isThumbnailEnabled,
    // description情報を渡す
    initialDescription: isThumbnailEnabled ? initialDescription : undefined,
    onDescriptionChange: isThumbnailEnabled ? onDescriptionChange : undefined,
  });

  // ツールバーの高さ（h-11 = 44px）
  const TOOLBAR_HEIGHT = 44;
  // コンテンツ下部の追加余白
  const CONTENT_BOTTOM_PADDING = 24;
  // エディタ下部のマージン：常にツールバーの高さ分 + 余白 + キーボード非表示時はSafeArea分も追加
  const editorBottomMargin = isKeyboardUp
    ? TOOLBAR_HEIGHT + CONTENT_BOTTOM_PADDING
    : TOOLBAR_HEIGHT + CONTENT_BOTTOM_PADDING + insets.bottom;

  // サムネイル管理（読み取り専用表示の同期）
  useEditorThumbnail({
    editor,
    editorState,
    spotImages,
    thumbnailImageId,
    isContentReady: initialContent !== null,
    isThumbnailEnabled,
  });

  // 画像挿入
  const { handleInsertImage } = useInsertImage({ editor, editorState });

  // 埋め込みコンテンツ挿入（YouTube, X, Instagram等）
  const handleInsertEmbed = useCallback((url: string) => {
    if (editorState.isReady) {
      editor.setEmbed(url);
    }
  }, [editor, editorState.isReady]);


  // ページ背景色
  const pageBgColor = isDarkMode ? EDITOR_DARK_BG_COLOR : colors.light.surface;

  // 非公開スポットの鍵マーク
  const privateBadge = isPublic === false ? <PrivateBadge size={iconSizeNum.sm} className="mr-1" /> : undefined;

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: pageBgColor }}>
        <PageHeader title={title} titlePrefix={privateBadge} />
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
        titlePrefix={privateBadge}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* エディタ */}
      <View style={{ flex: 1, marginBottom: editorBottomMargin }}>
        <RichText
          editor={editor}
        />
      </View>

      {/* ツールバー */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: isKeyboardUp ? keyboardHeight : insets.bottom,
        }}
      >
        {/* 文字数カウンター（ツールバーの上に表示） */}
        <View className="flex-row justify-end px-4 pb-1">
          <View className="bg-surface/80 px-2 py-0.5 rounded-full">
            <Text className="text-xs text-on-surface-variant">
              {charCount}文字
            </Text>
          </View>
        </View>
        <EditorToolbar
          editor={editor}
          onPlusPress={() => setShowInsertMenu(true)}
          isPlusDisabled={editorState.isInDescription}
        />
      </View>

      {/* 挿入メニュー */}
      <InsertMenu
        visible={showInsertMenu}
        onClose={() => setShowInsertMenu(false)}
        onInsertImage={handleInsertImage}
        onInsertEmbed={handleInsertEmbed}
        spotImages={spotImages}
      />
    </View>
  );
}
