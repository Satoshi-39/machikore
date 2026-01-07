/**
 * マイページヘッダー
 *
 * マイページ専用のヘッダーバー（タイトル中央、右側にスケジュール・設定アイコン）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface MyPageHeaderProps {
  onSettingsPress: () => void;
  onSchedulePress?: () => void; // 将来リリース予定
}

export function MyPageHeader({ onSettingsPress, onSchedulePress: _onSchedulePress }: MyPageHeaderProps) {
  const { t } = useI18n();

  return (
    <View className="bg-surface dark:bg-dark-surface px-4 py-3 border-b border-border dark:border-dark-border flex-row items-center justify-center relative">
      <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('mypage.myPage')}</Text>

      {/* 右側アイコングループ */}
      <View className="absolute right-4 flex-row gap-2">
        {/* スケジュールアイコン（将来リリース予定）
        <Pressable
          onPress={onSchedulePress}
          className="w-10 h-10 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
        >
          <Ionicons name="calendar-outline" size={24} color={colors.text.secondary} />
        </Pressable>
        */}

        {/* 設定アイコン */}
        <Pressable
          onPress={onSettingsPress}
          className="w-10 h-10 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
        >
          <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
        </Pressable>
      </View>
    </View>
  );
}
