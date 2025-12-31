/**
 * オンボーディング完了ステップ
 *
 * 設定完了メッセージと「始める」ボタンを表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors } from '@/shared/config';
import { Button } from '@/shared/ui';

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();

  const iconColor = isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT;

  return (
    <View
      className="flex-1 bg-surface dark:bg-dark-surface"
      style={{ paddingTop: insets.top }}
    >
      {/* メインコンテンツ */}
      <View className="flex-1 justify-center items-center px-8">
        {/* チェックマークアイコン */}
        <View className="w-24 h-24 rounded-full bg-primary/10 dark:bg-dark-foreground/10 justify-center items-center mb-6">
          <Ionicons name="checkmark-circle" size={64} color={iconColor} />
        </View>

        {/* タイトル */}
        <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground text-center mb-3">
          {t('onboarding.completion.title')}
        </Text>

        {/* サブタイトル */}
        <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center leading-6">
          {t('onboarding.completion.subtitle')}
        </Text>
      </View>

      {/* ボタン */}
      <View
        className="px-4 pb-4 bg-surface dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          title={t('onboarding.completion.start')}
          onPress={onComplete}
        />
      </View>
    </View>
  );
}
