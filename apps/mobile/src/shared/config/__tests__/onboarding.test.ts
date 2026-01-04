/**
 * onboarding.ts のテスト
 */

import {
  ONBOARDING_STEP_KEYS,
  getOnboardingSteps,
  getOnboardingStepIndex,
  type OnboardingStepKey,
} from '../onboarding';

describe('onboarding', () => {
  describe('ONBOARDING_STEP_KEYS', () => {
    it('PROFILEキーが定義されている', () => {
      expect(ONBOARDING_STEP_KEYS.PROFILE).toBe('profile');
    });

    it('DEMOGRAPHICSキーが定義されている', () => {
      expect(ONBOARDING_STEP_KEYS.DEMOGRAPHICS).toBe('demographics');
    });

    it('CATEGORIESキーが定義されている', () => {
      expect(ONBOARDING_STEP_KEYS.CATEGORIES).toBe('categories');
    });

    it('3つのステップが定義されている', () => {
      const keys = Object.keys(ONBOARDING_STEP_KEYS);
      expect(keys).toHaveLength(3);
    });
  });

  describe('getOnboardingSteps', () => {
    // モック翻訳関数
    const mockTranslate = (key: string) => `translated:${key}`;

    it('3つのステップを返す', () => {
      const steps = getOnboardingSteps(mockTranslate);
      expect(steps).toHaveLength(3);
    });

    it('各ステップにkeyとtitleが設定されている', () => {
      const steps = getOnboardingSteps(mockTranslate);
      steps.forEach((step) => {
        expect(step.key).toBeDefined();
        expect(step.title).toBeDefined();
      });
    });

    it('最初のステップはprofile', () => {
      const steps = getOnboardingSteps(mockTranslate);
      expect(steps[0]?.key).toBe('profile');
    });

    it('2番目のステップはdemographics', () => {
      const steps = getOnboardingSteps(mockTranslate);
      expect(steps[1]?.key).toBe('demographics');
    });

    it('3番目のステップはcategories', () => {
      const steps = getOnboardingSteps(mockTranslate);
      expect(steps[2]?.key).toBe('categories');
    });

    it('翻訳関数が正しく適用される', () => {
      const steps = getOnboardingSteps(mockTranslate);
      expect(steps[0]?.title).toBe('translated:onboarding.steps.profile');
      expect(steps[1]?.title).toBe('translated:onboarding.steps.demographics');
      expect(steps[2]?.title).toBe('translated:onboarding.steps.categories');
    });

    it('異なる翻訳関数でも動作する', () => {
      const japaneseTranslate = (key: string) => {
        const translations: Record<string, string> = {
          'onboarding.steps.profile': 'プロフィール',
          'onboarding.steps.demographics': '属性情報',
          'onboarding.steps.categories': 'カテゴリ',
        };
        return translations[key] || key;
      };

      const steps = getOnboardingSteps(japaneseTranslate);
      expect(steps[0]?.title).toBe('プロフィール');
      expect(steps[1]?.title).toBe('属性情報');
      expect(steps[2]?.title).toBe('カテゴリ');
    });
  });

  describe('getOnboardingStepIndex', () => {
    it('profileは0を返す', () => {
      expect(getOnboardingStepIndex('profile')).toBe(0);
    });

    it('demographicsは1を返す', () => {
      expect(getOnboardingStepIndex('demographics')).toBe(1);
    });

    it('categoriesは2を返す', () => {
      expect(getOnboardingStepIndex('categories')).toBe(2);
    });

    it('存在しないキーは-1を返す', () => {
      // TypeScriptの型チェックをバイパスしてテスト
      expect(getOnboardingStepIndex('invalid' as OnboardingStepKey)).toBe(-1);
    });

    it('ステップの順序が正しい', () => {
      const profileIndex = getOnboardingStepIndex('profile');
      const demographicsIndex = getOnboardingStepIndex('demographics');
      const categoriesIndex = getOnboardingStepIndex('categories');

      expect(profileIndex).toBeLessThan(demographicsIndex);
      expect(demographicsIndex).toBeLessThan(categoriesIndex);
    });
  });
});
