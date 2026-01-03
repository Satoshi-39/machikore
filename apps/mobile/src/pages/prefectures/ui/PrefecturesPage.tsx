/**
 * 全都道府県一覧ページ
 *
 * 地方ごとにグループ化して47都道府県を表示
 * 絵文字付きグリッド形式で可愛く表示
 * タップでタグ検索結果へ遷移
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useRegions } from '@/entities/region';
import { usePrefectures } from '@/entities/prefecture';
import type { PrefectureRow } from '@/shared/types/database.types';
import { PageHeader, AsyncBoundary } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import type { RegionRow } from '@/shared/types/database.types';

// 都道府県の絵文字マッピング
const PREFECTURE_EMOJIS: Record<string, string> = {
  // 北海道
  hokkaido: '❄️',
  // 東北
  aomori: '🍎',
  iwate: '🐴',
  miyagi: '🐮',
  akita: '🐕',
  yamagata: '🍒',
  fukushima: '🍑',
  // 関東
  ibaraki: '🥬',
  tochigi: '🍓',
  gunma: '♨️',
  saitama: '🏮',
  chiba: '🥜',
  tokyo: '🗼',
  kanagawa: '🌊',
  // 中部
  niigata: '🍚',
  toyama: '🦑',
  ishikawa: '🦀',
  fukui: '🦖',
  yamanashi: '🍇',
  nagano: '🍎',
  gifu: '🏔️',
  shizuoka: '🗻',
  aichi: '🏰',
  // 近畿
  mie: '🦐',
  shiga: '🌾',
  kyoto: '⛩️',
  osaka: '🏯',
  hyogo: '🐄',
  nara: '🦌',
  wakayama: '🍊',
  // 中国
  tottori: '🐪',
  shimane: '⛩️',
  okayama: '🍑',
  hiroshima: '🍁',
  yamaguchi: '🐡',
  // 四国
  tokushima: '🌀',
  kagawa: '🍜',
  ehime: '🍊',
  kochi: '🐋',
  // 九州・沖縄
  fukuoka: '🍜',
  saga: '🏺',
  nagasaki: '⛪',
  kumamoto: '🐻',
  oita: '♨️',
  miyazaki: '🌴',
  kagoshima: '🌋',
  okinawa: '🌺',
};

interface SectionData {
  region: RegionRow;
  prefectures: PrefectureRow[];
}

export function PrefecturesPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { goBack } = useSafeBack();

  const { data: regions, isLoading: isRegionsLoading, error: regionsError } = useRegions();
  const { data: prefectures, isLoading: isPrefecturesLoading, error: prefecturesError } = usePrefectures();

  // 日本の地方・都道府県のみをフィルタリングしてグループ化
  const sections = useMemo((): SectionData[] => {
    if (!regions || !prefectures) return [];

    // 日本の地方のみ（regions.country_idは国コード：jp, kr, cn...）
    const jpRegions = regions.filter((r) => r.country_id === 'jp');

    // 日本の都道府県のみ（prefecturesはregion_id経由でフィルタ）
    const jpRegionIds = new Set(jpRegions.map((r) => r.id));
    const jpPrefectures = prefectures.filter((p) => jpRegionIds.has(p.region_id));

    // 都道府県を地方ごとにグループ化
    const groupedByRegion = new Map<string, PrefectureRow[]>();
    jpPrefectures.forEach((prefecture) => {
      const regionId = prefecture.region_id ?? 'other';
      const existing = groupedByRegion.get(regionId) ?? [];
      existing.push(prefecture);
      groupedByRegion.set(regionId, existing);
    });

    // セクションデータに変換（display_order順）
    const sortedRegions = [...jpRegions].sort((a, b) => a.display_order - b.display_order);

    return sortedRegions
      .filter((region) => groupedByRegion.has(region.id))
      .map((region) => ({
        region,
        prefectures: groupedByRegion.get(region.id) ?? [],
      }));
  }, [regions, prefectures]);

  const handlePrefecturePress = useCallback(
    (prefectureId: string) => {
      router.push(`/(tabs)/discover/prefectures/${prefectureId}` as Href);
    },
    [router]
  );

  const isLoading = isRegionsLoading || isPrefecturesLoading;
  const error = regionsError || prefecturesError;

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-dark-background"
      edges={['top']}
    >
      <PageHeader title={t('section.searchByPrefecture')} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={sections.length > 0 ? sections : null}
        emptyMessage={t('section.noPrefectureData')}
        emptyIonIcon="map-outline"
      >
        {(data) => (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {data.map((section) => (
              <View key={section.region.id} className="mt-4">
                {/* 地方名ヘッダー */}
                <Text className="text-lg font-bold text-foreground dark:text-dark-foreground px-4 mb-3">
                  {getTranslatedName(section.region.name, section.region.name_translations, locale)}
                </Text>

                {/* 2列グリッド */}
                <View className="flex-row flex-wrap px-4" style={{ marginHorizontal: -6 }}>
                  {section.prefectures.map((prefecture) => (
                    <View key={prefecture.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
                      <Pressable
                        onPress={() => handlePrefecturePress(prefecture.id)}
                        className="flex-row items-center bg-muted dark:bg-dark-muted rounded-xl px-4 py-3 active:opacity-70"
                      >
                        <Text style={{ fontSize: 24 }}>
                          {PREFECTURE_EMOJIS[prefecture.id] ?? '📍'}
                        </Text>
                        <Text className="text-base font-medium text-foreground dark:text-dark-foreground ml-3 flex-1" numberOfLines={1}>
                          {getTranslatedName(prefecture.name, prefecture.name_translations, locale)}
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
