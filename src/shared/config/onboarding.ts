/**
 * オンボーディング設定
 *
 * オンボーディングフローのステップ定義
 */

import type { OnboardingStep } from '@/shared/ui';

/**
 * オンボーディングステップのキー
 */
export const ONBOARDING_STEP_KEYS = {
  PROFILE: 'profile',
  DEMOGRAPHICS: 'demographics',
  CATEGORIES: 'categories',
} as const;

export type OnboardingStepKey =
  (typeof ONBOARDING_STEP_KEYS)[keyof typeof ONBOARDING_STEP_KEYS];

/**
 * オンボーディングステップの定義を取得
 * @param t - 翻訳関数
 */
export function getOnboardingSteps(
  t: (key: string) => string
): OnboardingStep[] {
  return [
    { key: ONBOARDING_STEP_KEYS.PROFILE, title: t('onboarding.steps.profile') },
    {
      key: ONBOARDING_STEP_KEYS.DEMOGRAPHICS,
      title: t('onboarding.steps.demographics'),
    },
    {
      key: ONBOARDING_STEP_KEYS.CATEGORIES,
      title: t('onboarding.steps.categories'),
    },
  ];
}

/**
 * ステップキーからインデックスを取得
 */
export function getOnboardingStepIndex(stepKey: OnboardingStepKey): number {
  const steps = Object.values(ONBOARDING_STEP_KEYS);
  return steps.indexOf(stepKey);
}
