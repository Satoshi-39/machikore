/**
 * 海外の国一覧ページ
 *
 * 大陸ごとにグループ化して国を表示
 * 国旗絵文字付きグリッド形式で表示
 * タップでタグ検索結果へ遷移
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useContinents } from '@/entities/continent';
import { useCountries } from '@/entities/country';
import type { CountryRow } from '@/shared/types/database.types';
import { PageHeader, AsyncBoundary } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib';

/**
 * 国コードから国旗絵文字を生成
 * 例: 'us' → '🇺🇸', 'jp' → '🇯🇵'
 */
function getCountryFlagEmoji(countryCode: string): string {
  // ハワイなど特殊なケースは国旗がないのでフォールバック
  if (countryCode.includes('-')) {
    return '🏝️';
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface SectionData {
  title: string;
  countries: CountryRow[];
}

export function CountriesPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();

  const { data: continents, isLoading: isContinentsLoading, error: continentsError } = useContinents();
  const { data: allCountries, isLoading: isCountriesLoading, error: countriesError } = useCountries();

  // 日本以外の国を大陸ごとにグループ化
  const sections = useMemo((): SectionData[] => {
    if (!continents || !allCountries) return [];

    // 日本以外の国
    const countries = allCountries.filter((c) => c.country_code !== 'jp');

    // 国を大陸ごとにグループ化
    const groupedByContinent = new Map<string, CountryRow[]>();
    countries.forEach((country) => {
      const continentId = country.continent_id;
      if (!continentId) return; // 大陸IDがない国はスキップ
      const existing = groupedByContinent.get(continentId) ?? [];
      existing.push(country);
      groupedByContinent.set(continentId, existing);
    });

    // セクションデータに変換（display_order順）
    const sortedContinents = [...continents].sort((a, b) => a.display_order - b.display_order);

    return sortedContinents
      .filter((continent) => groupedByContinent.has(continent.id))
      .map((continent) => ({
        title: continent.name,
        countries: groupedByContinent.get(continent.id) ?? [],
      }));
  }, [continents, allCountries]);

  const handleCountryPress = useCallback(
    (countryName: string) => {
      router.push(`/(tabs)/discover/tag-results?tag=${encodeURIComponent(countryName)}` as Href);
    },
    [router]
  );

  const isLoading = isContinentsLoading || isCountriesLoading;
  const error = continentsError || countriesError;

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-dark-background"
      edges={['top']}
    >
      <PageHeader title="海外から探す" onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={sections.length > 0 ? sections : null}
        emptyMessage="国データがありません"
        emptyIonIcon="globe-outline"
      >
        {(data) => (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {data.map((section) => (
              <View key={section.title} className="mt-4">
                {/* 大陸名ヘッダー */}
                <Text className="text-lg font-bold text-foreground dark:text-dark-foreground px-4 mb-3">
                  {section.title}
                </Text>

                {/* 2列グリッド */}
                <View className="flex-row flex-wrap px-4" style={{ marginHorizontal: -6 }}>
                  {section.countries.map((country) => (
                    <View key={country.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
                      <Pressable
                        onPress={() => handleCountryPress(country.name)}
                        className="flex-row items-center bg-muted dark:bg-dark-muted rounded-xl px-4 py-3 active:opacity-70"
                      >
                        <Text style={{ fontSize: 24 }}>
                          {getCountryFlagEmoji(country.country_code)}
                        </Text>
                        <Text className="text-base font-medium text-foreground dark:text-dark-foreground ml-3 flex-1" numberOfLines={1}>
                          {country.name}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </AsyncBoundary>
    </SafeAreaView>
  );
}
