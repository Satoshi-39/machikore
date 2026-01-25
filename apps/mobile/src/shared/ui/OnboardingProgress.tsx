/**
 * オンボーディング進捗インジケーター
 *
 * ドット + 接続線 + 各ステップ名ラベル
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

export interface OnboardingStep {
  key: string;
  title: string;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep: number; // 0-indexed
}

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const { t } = useI18n();

  // 最終ステップ「完了」を追加
  const displaySteps = [
    ...steps,
    { key: 'complete', title: t('common.done') },
  ];

  return (
    <View className="items-center py-4">
      {/* ドット + 接続線 + ラベル */}
      <View className="flex-row items-start justify-center">
        {displaySteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === displaySteps.length - 1;

          return (
            <View key={step.key} className="flex-row items-start">
              {/* ドットとラベルのコンテナ */}
              <View className="items-center" style={{ width: 70 }}>
                {/* ドット */}
                <View
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: isCompleted || isCurrent
                      ? colors.light.primary
                      : colors.primitive.gray[300],
                  }}
                />
                {/* ラベル */}
                <Text
                  className="text-xs mt-2 text-center"
                  style={{
                    color: isCurrent
                      ? colors.light.primary
                      : isCompleted
                        ? colors.primitive.gray[500]
                        : colors.primitive.gray[400],
                    fontWeight: isCurrent ? '600' : '400',
                  }}
                  numberOfLines={1}
                >
                  {step.title}
                </Text>
              </View>

              {/* 接続線 */}
              {!isLast && (
                <View
                  className="h-0.5 mt-1.5"
                  style={{
                    width: 24,
                    marginHorizontal: -12,
                    backgroundColor: isCompleted
                      ? colors.light.primary
                      : colors.primitive.gray[300],
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
