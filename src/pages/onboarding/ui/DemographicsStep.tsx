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
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Localization from 'expo-localization';

import { useCurrentUser } from '@/entities/user';
import { colors } from '@/shared/config';
import {
  GENDERS,
  GENDER_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  type Gender,
  type AgeGroup,
} from '@/shared/config/demographics';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { getPrefecturesByCountry } from '@/shared/lib/utils/prefectures.utils';
import { updateUserDemographics } from '@/shared/api/supabase/users';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

interface DemographicsStepProps {
  onComplete: () => void;
}

export function DemographicsStep({ onComplete }: DemographicsStepProps) {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const { t, locale } = useI18n();

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

  // 国名を取得（ローカライズ対応）
  const getCountryName = (country: { id: string; name: string; name_translations?: Record<string, string> | null }) => {
    if (locale === 'ja') return country.name;
    return country.name_translations?.en || country.name;
  };

  // 都道府県名を取得（ローカライズ対応）
  const getPrefectureName = (pref: { name: string; name_translations?: Record<string, string> | null }) => {
    if (locale === 'ja') return pref.name;
    return pref.name_translations?.en || pref.name;
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
          <Text className="text-base text-primary">
            {t('common.skip')}
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* 説明 */}
        <View className="py-6">
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center leading-6">
            {t('onboarding.demographics.description')}
          </Text>
        </View>

        {/* 性別 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
            {t('onboarding.demographics.gender')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {GENDERS.map((gender) => (
              <Pressable
                key={gender}
                onPress={() => setSelectedGender(selectedGender === gender ? null : gender)}
                className={`px-4 py-2 rounded-full border ${
                  selectedGender === gender
                    ? 'bg-primary border-primary'
                    : 'border-border dark:border-dark-border'
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedGender === gender
                      ? 'text-white'
                      : 'text-foreground dark:text-dark-foreground'
                  }`}
                >
                  {GENDER_LABELS[gender]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 年代 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
            {t('onboarding.demographics.ageGroup')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {AGE_GROUPS.map((ageGroup) => (
              <Pressable
                key={ageGroup}
                onPress={() => setSelectedAgeGroup(selectedAgeGroup === ageGroup ? null : ageGroup)}
                className={`px-4 py-2 rounded-full border ${
                  selectedAgeGroup === ageGroup
                    ? 'bg-primary border-primary'
                    : 'border-border dark:border-dark-border'
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedAgeGroup === ageGroup
                      ? 'text-white'
                      : 'text-foreground dark:text-dark-foreground'
                  }`}
                >
                  {AGE_GROUP_LABELS[ageGroup]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 居住国 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
            {t('onboarding.demographics.country')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row gap-2">
              {countries.map((country) => (
                <Pressable
                  key={country.id}
                  onPress={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCountry === country.id
                      ? 'bg-primary border-primary'
                      : 'border-border dark:border-dark-border'
                  }`}
                >
                  <Text
                    className={`text-base ${
                      selectedCountry === country.id
                        ? 'text-white'
                        : 'text-foreground dark:text-dark-foreground'
                    }`}
                  >
                    {getCountryName(country)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 都道府県/州（国が選択されていて、データがある場合のみ表示） */}
        {selectedCountry && prefectures.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
              {selectedCountry === 'jp'
                ? t('onboarding.demographics.prefecture')
                : t('onboarding.demographics.region')}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {prefectures.map((pref) => (
                <Pressable
                  key={pref.id}
                  onPress={() => setSelectedPrefecture(selectedPrefecture === pref.name ? null : pref.name)}
                  className={`px-3 py-1.5 rounded-full border ${
                    selectedPrefecture === pref.name
                      ? 'bg-primary border-primary'
                      : 'border-border dark:border-dark-border'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedPrefecture === pref.name
                        ? 'text-white'
                        : 'text-foreground dark:text-dark-foreground'
                    }`}
                  >
                    {getPrefectureName(pref)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* 保存ボタン */}
      <View
        className="px-4 pb-4 bg-surface dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleSave}
          disabled={isSubmitting}
          className="py-4 rounded-full items-center bg-primary"
          style={{
            shadowColor: colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-base text-white">
              {t('onboarding.demographics.continue')}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
