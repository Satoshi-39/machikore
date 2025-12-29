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
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Localization from 'expo-localization';

import { useCurrentUser } from '@/entities/user';
import {
  getOnboardingSteps,
  ONBOARDING_STEP_KEYS,
  GENDERS,
  GENDER_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  type Gender,
  type AgeGroup,
} from '@/shared/config';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { getPrefecturesByCountry } from '@/shared/lib/utils/prefectures.utils';
import { updateUserDemographics } from '@/shared/api/supabase/users';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import {
  OnboardingProgress,
  SelectField,
  PickerSheet,
  PrimaryButton,
  type PickerOption,
} from '@/shared/ui';

interface DemographicsStepProps {
  onComplete: () => void;
}

type PickerType = 'gender' | 'ageGroup' | 'country' | 'prefecture' | null;

export function DemographicsStep({ onComplete }: DemographicsStepProps) {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const { t, locale } = useI18n();

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

  // ピッカー表示状態
  const [activePicker, setActivePicker] = useState<PickerType>(null);

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

  // 国名を取得（ローカライズ対応）
  const getCountryName = (countryId: string): string => {
    const country = countries.find((c) => c.id === countryId);
    if (!country) return '';
    if (locale === 'ja') return country.name;
    return country.name_translations?.en || country.name;
  };

  // 都道府県名を取得（ローカライズ対応）
  const getPrefectureName = (prefName: string): string => {
    const pref = prefectures.find((p) => p.name === prefName);
    if (!pref) return prefName;
    if (locale === 'ja') return pref.name;
    return pref.name_translations?.en || pref.name;
  };

  // ピッカーオプション生成
  const genderOptions: PickerOption<Gender>[] = GENDERS.map((g) => ({
    value: g,
    label: GENDER_LABELS[g],
  }));

  const ageGroupOptions: PickerOption<AgeGroup>[] = AGE_GROUPS.map((a) => ({
    value: a,
    label: AGE_GROUP_LABELS[a],
  }));

  const countryOptions: PickerOption<string>[] = countries.map((c) => ({
    value: c.id,
    label: locale === 'ja' ? c.name : c.name_translations?.en || c.name,
  }));

  const prefectureOptions: PickerOption<string>[] = prefectures.map((p) => ({
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
      className="flex-1 bg-surface dark:bg-dark-surface"
      style={{ paddingTop: insets.top }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-light dark:border-dark-border-light">
        <View className="w-16" />
        <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
          {t('onboarding.demographics.title')}
        </Text>
        <Pressable onPress={handleSkip} className="w-16 items-end">
          <Text className="text-base text-primary">{t('common.skip')}</Text>
        </Pressable>
      </View>

      {/* 進捗インジケーター */}
      <OnboardingProgress steps={onboardingSteps} currentStep={currentStepIndex} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* 説明 */}
        <View className="py-4">
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center leading-6">
            {t('onboarding.demographics.description')}
          </Text>
        </View>

        {/* 性別 */}
        <SelectField
          label={t('onboarding.demographics.gender')}
          value={selectedGender ? GENDER_LABELS[selectedGender] : null}
          placeholder={t('common.select')}
          onPress={() => setActivePicker('gender')}
        />

        {/* 年代 */}
        <SelectField
          label={t('onboarding.demographics.ageGroup')}
          value={selectedAgeGroup ? AGE_GROUP_LABELS[selectedAgeGroup] : null}
          placeholder={t('common.select')}
          onPress={() => setActivePicker('ageGroup')}
        />

        {/* 居住国 */}
        <SelectField
          label={t('onboarding.demographics.country')}
          value={selectedCountry ? getCountryName(selectedCountry) : null}
          placeholder={t('common.select')}
          onPress={() => setActivePicker('country')}
        />

        {/* 都道府県/州 */}
        <SelectField
          label={
            selectedCountry === 'jp'
              ? t('onboarding.demographics.prefecture')
              : t('onboarding.demographics.region')
          }
          value={selectedPrefecture ? getPrefectureName(selectedPrefecture) : null}
          placeholder={t('common.select')}
          onPress={() => setActivePicker('prefecture')}
          disabled={!selectedCountry || prefectures.length === 0}
        />

        <View className="h-24" />
      </ScrollView>

      {/* 保存ボタン */}
      <View
        className="px-4 pb-4 bg-surface dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton
          title={t('onboarding.demographics.continue')}
          onPress={handleSave}
          loading={isSubmitting}
        />
      </View>

      {/* ピッカーシート */}
      <PickerSheet
        visible={activePicker === 'gender'}
        onClose={() => setActivePicker(null)}
        title={t('onboarding.demographics.gender')}
        options={genderOptions}
        selectedValue={selectedGender}
        onSelect={(value) => setSelectedGender(value)}
      />

      <PickerSheet
        visible={activePicker === 'ageGroup'}
        onClose={() => setActivePicker(null)}
        title={t('onboarding.demographics.ageGroup')}
        options={ageGroupOptions}
        selectedValue={selectedAgeGroup}
        onSelect={(value) => setSelectedAgeGroup(value)}
      />

      <PickerSheet
        visible={activePicker === 'country'}
        onClose={() => setActivePicker(null)}
        title={t('onboarding.demographics.country')}
        options={countryOptions}
        selectedValue={selectedCountry}
        onSelect={(value) => setSelectedCountry(value)}
      />

      <PickerSheet
        visible={activePicker === 'prefecture'}
        onClose={() => setActivePicker(null)}
        title={
          selectedCountry === 'jp'
            ? t('onboarding.demographics.prefecture')
            : t('onboarding.demographics.region')
        }
        options={prefectureOptions}
        selectedValue={selectedPrefecture}
        onSelect={(value) => setSelectedPrefecture(value)}
      />
    </View>
  );
}
