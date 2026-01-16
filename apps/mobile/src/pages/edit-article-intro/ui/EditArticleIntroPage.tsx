/**
 * まえがき編集ページ
 *
 * マップ記事のまえがきをリッチエディタで編集する
 */

import { useCurrentUserId } from '@/entities/user';
import { useMap, useUpdateMap } from '@/entities/map';
import { colors } from '@/shared/config';
import { useEditorStyles } from '@/shared/lib/editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import {
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

interface EditArticleIntroPageProps {
  mapId: string;
}

// 空のドキュメント
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function EditArticleIntroPage({ mapId }: EditArticleIntroPageProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: map, isLoading } = useMap(mapId);
  const { mutate: updateMap, isPending: isSaving } = useUpdateMap();

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

  // CSSを注入（パディングとダークモード）
  useEditorStyles({ editor, editorState, isDarkMode });

  // マップデータが取得され、エディタが準備完了したらコンテンツを設定
  useEffect(() => {
    if (map && initialContent === null && editorState.isReady) {
      const content = map.article_intro || EMPTY_DOC;
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
  }, [map, initialContent, editor, editorState.isReady]);

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
    if (!map) return;

    try {
      const json = await editor.getJSON();
      // 空のドキュメントの場合はnullとして保存
      const content = isEmptyDoc(json as ProseMirrorDoc)
        ? null
        : (json as ProseMirrorDoc);

      updateMap(
        {
          id: map.id,
          article_intro: content,
        },
        {
          onSuccess: () => {
            // 保存成功後、正規化されたJSONを初期値として更新（変更検知用）
            setInitialContent(json as ProseMirrorDoc);
            Alert.alert(t('editArticle.saved'));
          },
          onError: () => {
            Alert.alert(t('common.error'), t('editArticle.saveError'));
          },
        }
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('editArticle.saveError'));
    }
  }, [editor, map, updateMap, isEmptyDoc]);

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
      Alert.alert(t('editArticle.discardTitle'), t('editArticle.discardMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('editArticle.discard'),
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
      Alert.alert(t('editArticle.discardTitle'), t('editArticle.discardMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('editArticle.discard'),
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
        <PageHeader title={t('editArticle.intro')} />
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
        <Text className="text-white font-semibold">{t('common.save')}</Text>
      )}
    </Pressable>
  );

  // マップが見つからない or 権限なし
  if (!map || map.user_id !== currentUserId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.intro')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={colors.gray[300]}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!map ? t('editArticle.mapNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader
        title={t('editArticle.intro')}
        onBack={handleBack}
        rightComponent={saveButton}
      />

      {/* エディタ */}
      <View className="flex-1">
        <RichText editor={editor} />
        {/* 文字数カウンター */}
        <View className={`absolute right-6 ${isKeyboardVisible ? 'bottom-2' : 'bottom-8'}`}>
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            {t('editArticle.charCount', { count: charCount })}
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
