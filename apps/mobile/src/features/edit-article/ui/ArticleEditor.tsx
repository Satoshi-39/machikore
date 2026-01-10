/**
 * 記事エディタ共通コンポーネント
 *
 * スポット記事の編集に使用するリッチテキストエディタ
 * - スポット作成時の記事編集
 * - スポット編集時の記事編集
 */

import { colors } from '@/shared/config';
import { useEditorStyles } from '@/shared/lib/editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import {
  darkEditorTheme,
  RichText,
  Toolbar,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';

// 空のドキュメント
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

interface ArticleEditorProps {
  /** ページタイトル */
  title: string;
  /** 初期コンテンツ（ストアまたはAPIから取得） */
  initialArticleContent: ProseMirrorDoc | null;
  /** 保存時のコールバック */
  onSave: (content: ProseMirrorDoc | null) => void;
  /** 保存中かどうか */
  isSaving?: boolean;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** 保存ボタンのテキスト */
  saveButtonText?: string;
}

export function ArticleEditor({
  title,
  initialArticleContent,
  onSave,
  isSaving = false,
  isLoading = false,
  saveButtonText = '保存',
}: ArticleEditorProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();

  const [initialContent, setInitialContent] = useState<ProseMirrorDoc | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // キーボードの表示状態を監視
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // エディタの初期化（ダークモード対応）
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: EMPTY_DOC,
    theme: isDarkMode ? darkEditorTheme : undefined,
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

      onSave(content);
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [editor, onSave, isEmptyDoc]);

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

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={title} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  // 保存ボタン
  const saveButton = (
    <Button onPress={handleSave} disabled={isSaving} size="sm">
      {isSaving ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <ButtonText className={buttonTextVariants({ size: 'sm' })}>{saveButtonText}</ButtonText>
      )}
    </Button>
  );

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader
        title={title}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* エディタ */}
      <View className="flex-1">
        <RichText editor={editor} />
        {/* 文字数カウンター */}
        <View className={`absolute right-6 ${isKeyboardVisible ? 'bottom-2' : 'bottom-8'}`}>
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            {charCount}文字
          </Text>
        </View>
      </View>

      {/* ツールバー */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  );
}
