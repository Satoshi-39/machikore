/**
 * ページヘッダーコンポーネント
 *
 * 全画面で統一されたカスタムヘッダーを提供
 * ネイティブヘッダーの代わりに使用（ナビゲーションフリーズ回避）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSafeBack } from '@/shared/lib/navigation';

interface PageHeaderProps {
  /** ヘッダータイトル */
  title: string;
  /** タイトルの前に表示するコンポーネント（鍵マークなど） */
  titlePrefix?: React.ReactNode;
  /** タイトルの後に表示するコンポーネント（鍵マークなど） */
  titleSuffix?: React.ReactNode;
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
  titlePrefix,
  titleSuffix,
  showBackButton = true,
  onBack,
  rightComponent,
  useSafeArea = true,
}: PageHeaderProps) {
  const isDarkMode = useIsDarkMode();
  const { goBack } = useSafeBack();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  const headerContent = (
    <View className="flex-row items-center px-4 py-3 bg-surface border-b-thin border-outline">
      {/* 左側：戻るボタン（固定幅） */}
      <View className="w-10">
        {showBackButton && (
          <Pressable onPress={handleBack} className="-ml-1 p-1">
            <Ionicons name="chevron-back" size={iconSizeNum.xl} color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']} />
          </Pressable>
        )}
      </View>

      {/* 中央：タイトル */}
      <View className="flex-1 items-center">
        <View className="flex-row items-center">
          {titlePrefix}
          <Text className="text-lg font-semibold text-on-surface" numberOfLines={1}>
            {title}
          </Text>
          {titleSuffix}
        </View>
      </View>

      {/* 右側：カスタムコンポーネント */}
      <View className="min-w-10 items-end">
        {rightComponent}
      </View>
    </View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView edges={['top']} className="bg-surface">
        {headerContent}
      </SafeAreaView>
    );
  }

  return headerContent;
}
