/**
 * ページヘッダーコンポーネント
 *
 * 全画面で統一されたカスタムヘッダーを提供
 * ネイティブヘッダーの代わりに使用（ナビゲーションフリーズ回避）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors } from '@/shared/config';

interface PageHeaderProps {
  /** ヘッダータイトル */
  title: string;
  /** 戻るボタンを表示するか（デフォルト: true） */
  showBackButton?: boolean;
  /** カスタム戻る処理 */
  onBack?: () => void;
  /** 右側に表示するコンポーネント */
  rightComponent?: React.ReactNode;
  /** SafeAreaViewでラップするか（デフォルト: true） */
  useSafeArea?: boolean;
}

export function PageHeader({
  title,
  showBackButton = true,
  onBack,
  rightComponent,
  useSafeArea = true,
}: PageHeaderProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      // 戻れない場合はスタックを閉じる（タブ内スタックの場合）
      router.dismiss();
    }
  };

  const headerContent = (
    <View className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
      {/* 左側：戻るボタン（固定幅） */}
      <View className="w-10">
        {showBackButton && (
          <Pressable onPress={handleBack} className="-ml-1 p-1">
            <Ionicons name="chevron-back" size={28} color={isDarkMode ? colors.dark.foreground : '#007AFF'} />
          </Pressable>
        )}
      </View>

      {/* 中央：タイトル */}
      <View className="flex-1 items-center">
        <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 右側：カスタムコンポーネント */}
      <View className="min-w-10 items-end">
        {rightComponent}
      </View>
    </View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView edges={['top']} className="bg-surface dark:bg-dark-surface">
        {headerContent}
      </SafeAreaView>
    );
  }

  return headerContent;
}
