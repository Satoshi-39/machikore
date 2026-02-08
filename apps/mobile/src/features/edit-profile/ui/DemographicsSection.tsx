/**
 * 属性情報セクション
 *
 * 性別、年代、居住国、都道府県の編集UI
 */

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { DropdownField, type DropdownOption } from '@/shared/ui';
import {
  GENDERS,
  GENDER_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  type Gender,
  type AgeGroup,
} from '@/shared/config';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { getPrefecturesByCountry } from '@/shared/lib/utils/prefectures.utils';
import { useI18n } from '@/shared/lib/i18n';

interface DemographicsSectionProps {
  /** 選択された性別 */
  selectedGender: Gender | null;
  /** 性別変更時のコールバック */
  onGenderChange: (value: Gender | null) => void;
  /** 選択された年代 */
  selectedAgeGroup: AgeGroup | null;
  /** 年代変更時のコールバック */
  onAgeGroupChange: (value: AgeGroup | null) => void;
  /** 選択された国 */
  selectedCountry: string | null;
  /** 国変更時のコールバック */
  onCountryChange: (value: string | null) => void;
  /** 選択された都道府県 */
  selectedPrefecture: string | null;
  /** 都道府県変更時のコールバック */
  onPrefectureChange: (value: string | null) => void;
}

export function DemographicsSection({
  selectedGender,
  onGenderChange,
  selectedAgeGroup,
  onAgeGroupChange,
  selectedCountry,
  onCountryChange,
  selectedPrefecture,
  onPrefectureChange,
}: DemographicsSectionProps) {
  const { t, locale } = useI18n();

  // 国リスト
  const countries = useMemo(() => getCountriesData(), []);

  // 選択された国の都道府県/州
  const prefectures = useMemo(() => {
    if (!selectedCountry) return [];
    return getPrefecturesByCountry(selectedCountry);
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

  return (
    <View className="bg-surface px-4 py-4 border-t-hairline border-outline-variant">
      <Text className="text-sm font-medium text-on-surface-variant mb-4">
        {t('profile.demographicInfo')}
      </Text>

      {/* 性別 */}
      <DropdownField
        label={t('profile.gender')}
        value={selectedGender}
        placeholder={t('common.select')}
        options={genderOptions}
        onSelect={onGenderChange}
        zIndex={4000}
        zIndexInverse={1000}
      />

      {/* 年代 */}
      <DropdownField
        label={t('profile.ageGroup')}
        value={selectedAgeGroup}
        placeholder={t('common.select')}
        options={ageGroupOptions}
        onSelect={onAgeGroupChange}
        zIndex={3000}
        zIndexInverse={2000}
      />

      {/* 居住国 */}
      <DropdownField
        label={t('profile.country')}
        value={selectedCountry}
        placeholder={t('common.select')}
        options={countryOptions}
        onSelect={onCountryChange}
        zIndex={2000}
        zIndexInverse={3000}
      />

      {/* 都道府県/州 */}
      <DropdownField
        label={
          selectedCountry === 'jp'
            ? t('profile.prefecture')
            : t('profile.region')
        }
        value={selectedPrefecture}
        placeholder={t('common.select')}
        options={prefectureOptions}
        onSelect={onPrefectureChange}
        disabled={!selectedCountry || prefectures.length === 0}
        zIndex={1000}
        zIndexInverse={4000}
      />
    </View>
  );
}
