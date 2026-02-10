/**
 * デモグラフィック情報収集ステップ
 *
 * オンボーディングの一部として表示（任意、スキップ可能）
 * - 性別
 * - 年代
 * - 居住国
 * - 居住地域（都道府県・州）
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';

import { useCurrentUser } from '@/entities/user';
import {
  getOnboardingSteps,
  ONBOARDING_STEP_KEYS,
  GENDERS,
  GENDER_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  colors,
  iconSizeNum,
  type Gender,
  type AgeGroup,
} from '@/shared/config';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { getPrefecturesByCountry } from '@/shared/lib/utils/prefectures.utils';
import { updateUserDemographics } from '@/shared/api/supabase/users';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  OnboardingProgress,
  DropdownField,
  Button,
  Text as ButtonText,
  buttonTextVariants,
  type DropdownOption,
} from '@/shared/ui';

interface DemographicsStepProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function DemographicsStep({ onComplete, onBack }: DemographicsStepProps) {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();

  // オンボーディングステップ定義（共通化）
  const onboardingSteps = getOnboardingSteps(t);
  const currentStepIndex = Object.values(ONBOARDING_STEP_KEYS).indexOf(
    ONBOARDING_STEP_KEYS.DEMOGRAPHICS
  );

  // 選択状態
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 国リスト
  const countries = useMemo(() => getCountriesData(), []);

  // 選択された国の都道府県/州
  const prefectures = useMemo(() => {
    if (!selectedCountry) return [];
    return getPrefecturesByCountry(selectedCountry);
  }, [selectedCountry]);

  // デバイスのロケールから初期国を推定
  useEffect(() => {
    const regionCode = Localization.getLocales()[0]?.regionCode?.toLowerCase();
    if (regionCode) {
      const matchedCountry = countries.find((c) => c.id === regionCode);
      if (matchedCountry) {
        setSelectedCountry(regionCode);
      }
    }
  }, [countries]);

  // 国が変更されたら都道府県をリセット
  useEffect(() => {
    setSelectedPrefecture(null);
  }, [selectedCountry]);

  // ドロップダウンオプション生成
  const genderOptions: DropdownOption<Gender>[] = GENDERS.map((g) => ({
    value: g,
    label: t(GENDER_LABELS[g]),
  }));

  const ageGroupOptions: DropdownOption<AgeGroup>[] = AGE_GROUPS.map((a) => ({
    value: a,
    label: t(AGE_GROUP_LABELS[a]),
  }));

  const countryOptions: DropdownOption<string>[] = countries.map((c) => ({
    value: c.id,
    label: locale === 'ja' ? c.name : c.name_translations?.en || c.name,
  }));

  const prefectureOptions: DropdownOption<string>[] = prefectures.map((p) => ({
    value: p.name,
    label: locale === 'ja' ? p.name : p.name_translations?.en || p.name,
  }));

  // 保存
  const handleSave = async () => {
    if (!user?.id) {
      onComplete();
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserDemographics(user.id, {
        gender: selectedGender,
        age_group: selectedAgeGroup,
        country: selectedCountry,
        prefecture: selectedPrefecture,
      });
    } catch (err) {
      log.error('[DemographicsStep] 保存に失敗:', err);
      // エラーでも続行（任意項目のため）
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  // スキップ
  const handleSkip = () => {
    onComplete();
  };

  return (
    <View
      className="flex-1 bg-surface"
      style={{ paddingTop: insets.top }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline-variant">
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          className="w-10 -ml-1 p-1"
          style={{ opacity: onBack ? 1 : 0 }}
        >
          <Ionicons name="chevron-back" size={iconSizeNum.lg} color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']} />
        </Pressable>
        <Text className="text-lg font-semibold text-on-surface">
          {t('onboarding.demographics.title')}
        </Text>
        <Pressable onPress={handleSkip}>
          <Text className="text-sm text-on-surface-variant">{t('common.skip')}</Text>
        </Pressable>
      </View>

      {/* 進捗インジケーター */}
      <OnboardingProgress steps={onboardingSteps} currentStep={currentStepIndex} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* 説明 */}
        <View className="py-4">
          <Text className="text-base text-on-surface-variant text-center leading-6">
            {t('onboarding.demographics.description')}
          </Text>
        </View>

        {/* 性別 */}
        <DropdownField
          label={t('onboarding.demographics.gender')}
          value={selectedGender}
          placeholder={t('common.select')}
          options={genderOptions}
          onSelect={setSelectedGender}
          zIndex={4000}
          zIndexInverse={1000}
        />

        {/* 年代 */}
        <DropdownField
          label={t('onboarding.demographics.ageGroup')}
          value={selectedAgeGroup}
          placeholder={t('common.select')}
          options={ageGroupOptions}
          onSelect={setSelectedAgeGroup}
          zIndex={3000}
          zIndexInverse={2000}
        />

        {/* 居住国 */}
        <DropdownField
          label={t('onboarding.demographics.country')}
          value={selectedCountry}
          placeholder={t('common.select')}
          options={countryOptions}
          onSelect={setSelectedCountry}
          zIndex={2000}
          zIndexInverse={3000}
        />

        {/* 都道府県/州 */}
        <DropdownField
          label={
            selectedCountry === 'jp'
              ? t('onboarding.demographics.prefecture')
              : t('onboarding.demographics.region')
          }
          value={selectedPrefecture}
          placeholder={t('common.select')}
          options={prefectureOptions}
          onSelect={setSelectedPrefecture}
          disabled={!selectedCountry || prefectures.length === 0}
          zIndex={1000}
          zIndexInverse={4000}
        />

        {/* ナビゲーションボタン */}
        <View className="mt-2 mb-8">
          <Button testID="demographics-continue-button" onPress={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('common.next')}
              </ButtonText>
            )}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
