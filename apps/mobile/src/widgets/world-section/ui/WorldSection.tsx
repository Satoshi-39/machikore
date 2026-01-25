/**
 * 海外セクションWidget
 *
 * 主要国をグリッド形式で表示
 * タップでその国のスポット検索結果へ遷移
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useCountries } from '@/entities/country';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';

/**
 * 国コードから国旗絵文字を生成
 * 例: 'us' → '🇺🇸', 'jp' → '🇯🇵'
 */
function getCountryFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// 表示する国の最大数
const MAX_DISPLAY_COUNTRIES = 6;

export function WorldSection() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();

  const { data: allCountries } = useCountries();

  // 日本以外の国を最大6件取得（countries.idは国コード：jp, kr, cn...）
  const countries = useMemo(() => {
    if (!allCountries) return [];
    return allCountries
      .filter((c) => c.id !== 'jp')
      .slice(0, MAX_DISPLAY_COUNTRIES);
  }, [allCountries]);

  const handleCountryPress = useCallback(
    (countryName: string) => {
      router.push(`/(tabs)/discover/search?q=${encodeURIComponent(countryName)}` as Href);
    },
    [router]
  );

  const handleShowAllCountries = useCallback(() => {
    router.push('/(tabs)/discover/countries' as Href);
  }, [router]);

  // データがない場合は表示しない
  if (countries.length === 0) {
    return null;
  }

  return (
    <View className="py-4 px-4">
      {/* セクションタイトル */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-on-surface">
          🌏 {t('section.searchOverseas')}
        </Text>
        <Pressable
          onPress={handleShowAllCountries}
          className="active:opacity-70"
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
          />
        </Pressable>
      </View>

      {/* 2列グリッド */}
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
        {countries.map((country) => (
          <View key={country.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
            <Pressable
              onPress={() => handleCountryPress(country.name)}
              className="flex-row items-center bg-secondary rounded-xl px-4 py-3 active:opacity-70"
            >
              <Text style={{ fontSize: 24 }}>{getCountryFlagEmoji(country.id)}</Text>
              <Text className="text-base font-medium text-on-surface ml-3">
                {getTranslatedName(country.name, country.name_translations, locale)}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
