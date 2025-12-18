/**
 * スポット記事編集ページ
 *
 * 単一スポットの記事をリッチエディタで編集する
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  darkEditorTheme,
  darkEditorCss,
} from '@10play/tentap-editor';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSpotWithDetails, useUpdateSpot } from '@/entities/user-spot/api';
import { useCurrentUserId } from '@/entities/user';

interface EditSpotArticlePageProps {
  spotId: string;
}

export function EditSpotArticlePage({ spotId }: EditSpotArticlePageProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading } = useSpotWithDetails(spotId, currentUserId);
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  const [hasChanges, setHasChanges] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);

  // テーマカラー（ヘッダー用）
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // エディタの初期化（ダークモード対応）
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: spot?.article_content || '<p></p>',
    theme: isDarkMode ? darkEditorTheme : undefined,
  });

  // ダークモード時にCSSを注入
  useEffect(() => {
    if (isDarkMode) {
      editor.injectCSS(darkEditorCss, 'dark-mode-styles');
    }
  }, [editor, isDarkMode]);

  // 初期コンテンツを保存
  useEffect(() => {
    if (spot && initialContent === null) {
      setInitialContent(spot.article_content || '');
    }
  }, [spot, initialContent]);

  // 保存処理
  const handleSave = useCallback(async () => {
    if (!spot) return;

    try {
      const html = await editor.getHTML();
      // 空の段落のみの場合はnullとして保存
      const content = html === '<p></p>' || html === '' ? null : html;

      updateSpot(
        {
          spotId: spot.id,
          articleContent: content,
        },
        {
          onSuccess: () => {
            setHasChanges(false);
            Alert.alert('保存しました', '', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: () => {
            Alert.alert('エラー', '保存に失敗しました');
          },
        }
      );
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [editor, spot, updateSpot, router]);

  // 戻るボタン
  const handleBack = useCallback(async () => {
    if (hasChanges) {
      const html = await editor.getHTML();
      const currentContent = html === '<p></p>' ? '' : html;
      const originalContent = initialContent || '';

      if (currentContent !== originalContent) {
        Alert.alert(
          '変更を破棄しますか？',
          '保存していない変更があります。',
          [
            { text: 'キャンセル', style: 'cancel' },
            {
              text: '破棄',
              style: 'destructive',
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }
    }
    router.back();
  }, [hasChanges, editor, initialContent, router]);

  // コンテンツ変更を検出
  const handleContentChange = useCallback(() => {
    setHasChanges(true);
  }, []);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // スポットが見つからない or 権限なし
  if (!spot || spot.user_id !== currentUserId) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <View className="flex-row items-center px-4 py-3 border-b border-border dark:border-dark-border">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={themeColors.foreground} />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground ml-4">
            記事を編集
          </Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!spot ? 'スポットが見つかりません' : '編集権限がありません'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
        <View className="flex-row items-center flex-1">
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={themeColors.foreground} />
          </Pressable>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground" numberOfLines={1}>
              記事を編集
            </Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
              {spotName}
            </Text>
          </View>
        </View>
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
      </View>

      {/* エディタ */}
      <View className="flex-1">
        <RichText
          editor={editor}
          onBlur={handleContentChange}
        />
      </View>

      {/* ツールバー */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
