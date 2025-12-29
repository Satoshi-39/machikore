/**
 * オンボーディング進捗インジケーター
 *
 * ハイブリッド形式：ドット + 接続線 + ステップ番号/タイトル
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/shared/config';

export interface OnboardingStep {
  key: string;
  title: string;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep: number; // 0-indexed
}

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  return (
    <View className="items-center py-6">
      {/* ドット + 接続線 */}
      <View className="flex-row items-center mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === totalSteps - 1;

          return (
            <View key={step.key} className="flex-row items-center">
              {/* ドット */}
              <View
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isCompleted || isCurrent
                    ? colors.primary.DEFAULT
                    : colors.gray[300],
                }}
              />

              {/* 接続線 */}
              {!isLast && (
                <View
                  className="h-0.5 mx-1"
                  style={{
                    width: 40,
                    backgroundColor: isCompleted
                      ? colors.primary.DEFAULT
                      : colors.gray[300],
                  }}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* ステップ番号とタイトル */}
      <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
        {currentStep + 1} / {totalSteps}
      </Text>
      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mt-1">
        {currentStepData?.title}
      </Text>
    </View>
  );
}
