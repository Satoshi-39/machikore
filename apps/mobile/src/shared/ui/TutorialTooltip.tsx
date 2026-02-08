/**
 * カスタムツールチップ（react-native-copilot用）
 *
 * コーチマークのステップ説明を表示する
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useCopilot, type TooltipProps } from 'react-native-copilot';
import { useI18n } from '@/shared/lib/i18n';

export function TutorialTooltip(_props: TooltipProps) {
  const { currentStep, isLastStep, goToNext, stop, currentStepNumber, totalStepsNumber } = useCopilot();
  const { t } = useI18n();

  const handleNext = async () => {
    if (isLastStep) {
      await stop();
    } else {
      await goToNext();
    }
  };

  return (
    <View className="bg-surface rounded-xl px-4 py-3 max-w-[280px]">
      {/* ステップインジケーター */}
      <Text className="text-xs text-on-surface-variant mb-1">
        {currentStepNumber} / {totalStepsNumber}
      </Text>

      {/* ステップ説明 */}
      <Text className="text-sm text-on-surface leading-5 mb-3">
        {currentStep?.text ?? ''}
      </Text>

      {/* ボタン */}
      <Pressable
        onPress={handleNext}
        className="bg-primary rounded-lg py-2 px-4 items-center active:opacity-80"
      >
        <Text className="text-on-primary text-sm font-semibold">
          {isLastStep ? t('tutorial.finish') : t('tutorial.next')}
        </Text>
      </Pressable>
    </View>
  );
}
