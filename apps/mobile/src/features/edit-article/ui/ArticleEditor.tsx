/**
 * 記事エディタ共通コンポーネント
 *
 * スポット記事の編集に使用するリッチテキストエディタ
 * - スポット作成時の記事編集
 * - スポット編集時の記事編集
 */

import { colors } from '@/shared/config';
import { useEditorStyles, EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import {
  darkEditorTheme,
  RichText,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
  useKeyboard,
  type EditorTheme,
} from '@10play/tentap-editor';
import { EditorToolbar } from './EditorToolbar';
import { InsertMenu } from './InsertMenu';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';

// 空のドキュメント
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

// カスタムダークテーマ（背景色をツールバーと統一）
const customDarkEditorTheme: EditorTheme = {
  ...darkEditorTheme,
  webview: {
    backgroundColor: EDITOR_DARK_BG_COLOR,
  },
};

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
  /** 公開状態（指定するとステータスバッジを表示） */
  isPublished?: boolean;
  /** 公開ボタンのコールバック（指定すると公開ボタンを表示） */
  onPublish?: () => void;
  /** 非公開ボタンのコールバック */
  onUnpublish?: () => void;
  /** 公開処理中かどうか */
  isPublishing?: boolean;
  /** 公開ボタンのテキスト */
  publishButtonText?: string;
  /** 非公開ボタンのテキスト */
  unpublishButtonText?: string;
  /** 公開中ステータスのテキスト */
  publishedStatusText?: string;
  /** 下書きステータスのテキスト */
  draftStatusText?: string;
}

export function ArticleEditor({
  title,
  initialArticleContent,
  onSave,
  isSaving = false,
  isLoading = false,
  saveButtonText,
  isPublished,
  onPublish,
  onUnpublish,
  isPublishing = false,
  publishButtonText,
  unpublishButtonText,
  publishedStatusText,
  draftStatusText,
}: ArticleEditorProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const insets = useSafeAreaInsets();
  const { isKeyboardUp } = useKeyboard();

  const [initialContent, setInitialContent] = useState<ProseMirrorDoc | null>(null);
  const [showInsertMenu, setShowInsertMenu] = useState(false);

  // エディタの初期化（ダークモード対応）
  // avoidIosKeyboard: true でWebView内スクロールを有効化
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: EMPTY_DOC,
    theme: isDarkMode ? customDarkEditorTheme : undefined,
  });

  // エディタの状態を監視
  const editorState = useBridgeState(editor);

  // エディタのコンテンツをリアルタイムで取得（文字数カウント用）
  const editorContent = useEditorContent(editor, { type: 'text', debounceInterval: 100 });
  // 改行を除外した文字数をカウント
  const charCount = editorContent?.replace(/\n/g, '').length ?? 0;

  // CSSを注入（パディングとダークモード）
  useEditorStyles({ editor, editorState, isDarkMode });

  // コンテンツをエディタに設定
  useEffect(() => {
    if (!isLoading && initialContent === null && editorState.isReady) {
      const content = initialArticleContent || EMPTY_DOC;
      // エディタにコンテンツを設定
      editor.setContent(content);

      // エディタが正規化した後のJSONを初期値として保存
      const saveInitialContent = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const normalizedJson = await editor.getJSON();
        setInitialContent(normalizedJson as ProseMirrorDoc);
      };
      saveInitialContent();
    }
  }, [isLoading, initialArticleContent, initialContent, editor, editorState.isReady]);

  // JSONが空かどうかを判定
  const isEmptyDoc = useCallback((doc: ProseMirrorDoc): boolean => {
    if (!doc.content || doc.content.length === 0) return true;
    if (doc.content.length === 1) {
      const firstNode = doc.content[0];
      if (!firstNode) return true;
      if (
        firstNode.type === 'paragraph' &&
        (!firstNode.content || firstNode.content.length === 0)
      ) {
        return true;
      }
    }
    return false;
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    try {
      const json = await editor.getJSON();
      // 空のドキュメントの場合はnullとして保存
      const content = isEmptyDoc(json as ProseMirrorDoc)
        ? null
        : (json as ProseMirrorDoc);

      const success = await onSave(content);
      if (success) {
        // 保存成功後、現在の内容を初期値として更新（変更検知用）
        setInitialContent(json as ProseMirrorDoc);
      }
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [editor, onSave, isEmptyDoc]);

  // 画像挿入ハンドラー（TODO: 実際の画像アップロード処理を実装）
  const handleInsertImage = useCallback(() => {
    // TODO: expo-image-pickerで画像を選択し、Supabaseにアップロード
    Alert.alert('画像挿入', '画像挿入機能は近日実装予定です');
  }, []);

  // 戻るボタン
  const handleBack = useCallback(async () => {
    const json = await editor.getJSON();
    const currentIsEmpty = isEmptyDoc(json as ProseMirrorDoc);
    const originalIsEmpty = !initialContent || isEmptyDoc(initialContent);

    // 両方空なら変更なし
    if (currentIsEmpty && originalIsEmpty) {
      router.back();
      return;
    }

    // どちらかが空でどちらかが空でない場合は変更あり
    if (currentIsEmpty !== originalIsEmpty) {
      Alert.alert('変更を破棄しますか？', '保存していない変更があります。', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    // 両方空でない場合は内容を比較
    const currentStr = JSON.stringify(json);
    const originalStr = JSON.stringify(initialContent);

    if (currentStr !== originalStr) {
      Alert.alert('変更を破棄しますか？', '保存していない変更があります。', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    router.back();
  }, [editor, initialContent, router, isEmptyDoc]);

  // ページ背景色（ダークモードではツールバーと統一）
  const pageBgColor = isDarkMode ? EDITOR_DARK_BG_COLOR : colors.light.surface;

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: pageBgColor }}>
        <PageHeader title={title} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  // 保存ボタン（テキストリンク風）
  const saveButton = (
    <Pressable onPress={handleSave} disabled={isSaving} hitSlop={8}>
      {isSaving ? (
        <ActivityIndicator size="small" color={isDarkMode ? colors.dark.foreground : colors.light.foreground} />
      ) : (
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
          {saveButtonText}
        </Text>
      )}
    </Pressable>
  );

  // 公開ボタンの表示判定（onPublishが渡されていて、かつ未公開の場合のみ）
  const showPublishButton = onPublish && isPublished === false;
  // 非公開ボタンの表示判定（onUnpublishが渡されていて、かつ公開中の場合のみ）
  const showUnpublishButton = onUnpublish && isPublished === true;

  return (
    <View className="flex-1" style={{ backgroundColor: pageBgColor }}>
      <PageHeader
        title={title}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* 公開ステータスバー（isPublishedが定義されている場合のみ表示） */}
      {isPublished !== undefined && (
        <View className="flex-row items-center justify-between px-4 py-3 bg-background-secondary dark:bg-dark-background-secondary border-b border-border-light dark:border-dark-border-light">
          {/* ステータスバッジ */}
          <View className="flex-row items-center">
            <View
              className={`px-2 py-1 rounded-full ${
                isPublished
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isPublished
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {isPublished ? publishedStatusText : draftStatusText}
              </Text>
            </View>
          </View>

          {/* 公開/非公開ボタン */}
          {showPublishButton && (
            <Button
              onPress={onPublish}
              disabled={isPublishing || charCount === 0}
              size="sm"
              variant={charCount === 0 ? 'outline' : 'default'}
            >
              {isPublishing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ButtonText className={buttonTextVariants({ size: 'sm' })}>
                  {publishButtonText}
                </ButtonText>
              )}
            </Button>
          )}
          {showUnpublishButton && (
            <Button
              onPress={onUnpublish}
              disabled={isPublishing}
              size="sm"
              variant="outline"
            >
              {isPublishing ? (
                <ActivityIndicator size="small" color={colors.gray[500]} />
              ) : (
                <ButtonText className={buttonTextVariants({ size: 'sm', variant: 'outline' })}>
                  {unpublishButtonText}
                </ButtonText>
              )}
            </Button>
          )}
        </View>
      )}

      {/* エディタ */}
      <View className="flex-1">
        <RichText editor={editor} />
        {/* 文字数カウンター */}
        <View className="absolute right-6 bottom-2">
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            {charCount}文字
          </Text>
        </View>
      </View>

      {/* ツールバー */}
      <View style={{ paddingBottom: isKeyboardUp ? 0 : insets.bottom }}>
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
      />
    </View>
  );
}
