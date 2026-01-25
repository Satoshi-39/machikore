/**
 * オンボーディング完了ステップ
 *
 * 設定完了メッセージと「始める」ボタンを表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();

  const iconColor = isDarkMode ? colors.dark['on-surface'] : colors.light.primary;

  return (
    <View
      className="flex-1 bg-surface"
      style={{ paddingTop: insets.top }}
    >
      {/* メインコンテンツ */}
      <View className="flex-1 justify-center items-center px-8">
        {/* チェックマークアイコン */}
        <View className="w-24 h-24 rounded-full bg-primary/10/10 justify-center items-center mb-6">
          <Ionicons name="checkmark-circle" size={64} color={iconColor} />
        </View>

        {/* タイトル */}
        <Text className="text-2xl font-bold text-on-surface text-center mb-3">
          {t('onboarding.completion.title')}
        </Text>

        {/* サブタイトル */}
        <Text className="text-base text-on-surface-variant text-center leading-6">
          {t('onboarding.completion.subtitle')}
        </Text>
      </View>

      {/* ボタン */}
      <View
        className="px-4 pb-4 bg-surface"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button onPress={onComplete}>
          <ButtonText className={buttonTextVariants()}>
            {t('onboarding.completion.start')}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
