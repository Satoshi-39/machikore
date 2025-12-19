/**
 * スポット記事編集ページ
 *
 * 単一スポットの記事をリッチエディタで編集する
 */

import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails, useUpdateSpot } from '@/entities/user-spot/api';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader } from '@/shared/ui';
import {
  darkEditorCss,
  darkEditorTheme,
  RichText,
  Toolbar,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

interface EditSpotArticlePageProps {
  spotId: string;
}

// 空のドキュメント
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function EditSpotArticlePage({ spotId }: EditSpotArticlePageProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading } = useSpotWithDetails(spotId, currentUserId);
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  const [initialContent, setInitialContent] = useState<ProseMirrorDoc | null>(
    null
  );
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

  // ダークモード時にCSSを注入
  useEffect(() => {
    if (isDarkMode && editorState.isReady) {
      editor.injectCSS(darkEditorCss, 'dark-mode-styles');
    }
  }, [editor, isDarkMode, editorState.isReady]);

  // スポットデータが取得され、エディタが準備完了したらコンテンツを設定
  useEffect(() => {
    if (spot && initialContent === null && editorState.isReady) {
      const content = spot.article_content || EMPTY_DOC;
      // エディタにコンテンツを設定
      editor.setContent(content);

      // エディタが正規化した後のJSONを初期値として保存
      // これにより比較時に同じ形式で比較できる
      const saveInitialContent = async () => {
        // エディタが内容を処理する時間を待つ
        await new Promise((resolve) => setTimeout(resolve, 50));
        const normalizedJson = await editor.getJSON();
        setInitialContent(normalizedJson as ProseMirrorDoc);
      };
      saveInitialContent();
    }
  }, [spot, initialContent, editor, editorState.isReady]);

  // JSONが空かどうかを判定
  const isEmptyDoc = useCallback((doc: ProseMirrorDoc): boolean => {
    if (!doc.content || doc.content.length === 0) return true;
    if (doc.content.length === 1) {
      const firstNode = doc.content[0];
      if (!firstNode) return true;
      // 空の段落のみの場合
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
    if (!spot) return;

    try {
      const json = await editor.getJSON();
      // 空のドキュメントの場合はnullとして保存
      const content = isEmptyDoc(json as ProseMirrorDoc)
        ? null
        : (json as ProseMirrorDoc);

      updateSpot(
        {
          spotId: spot.id,
          articleContent: content,
          mapId: spot.map_id,
        },
        {
          onSuccess: () => {
            // 保存後は現在の内容を初期コンテンツとして更新（変更検出用）
            setInitialContent(content || EMPTY_DOC);
            Alert.alert('保存しました');
          },
          onError: () => {
            Alert.alert('エラー', '保存に失敗しました');
          },
        }
      );
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [editor, spot, updateSpot, router, isEmptyDoc]);

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
        <PageHeader title="記事を編集" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  // 保存ボタン
  const saveButton = (
    <Pressable
      onPress={handleSave}
      disabled={isSaving}
      className="bg-primary px-4 py-2 rounded-lg"
    >
      {isSaving ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className="text-white font-semibold">保存</Text>
      )}
    </Pressable>
  );

  // スポットが見つからない or 権限なし
  if (!spot || spot.user_id !== currentUserId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="記事を編集" />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={colors.gray[300]}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!spot ? 'スポットが見つかりません' : '編集権限がありません'}
          </Text>
        </View>
      </View>
    );
  }

  const spotName =
    spot.master_spot?.name || spot.custom_name || '不明なスポット';

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader
        title={spotName}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* エディタ */}
      <View className="flex-1 px-4">
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
