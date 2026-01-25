/**
 * エリア別セクションWidget
 *
 * 地域ボタンをグリッド形式で表示
 * タップでそのエリアのスポット一覧へ遷移
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';

// 主要エリア定義（prefectureId は prefectures.id に対応、jp_プレフィックス付き）
const AREA_CONFIGS = [
  { prefectureId: 'jp_tokyo', labelKey: 'area.tokyo', emoji: '🗼' },
  { prefectureId: 'jp_osaka', labelKey: 'area.osaka', emoji: '🏯' },
  { prefectureId: 'jp_kyoto', labelKey: 'area.kyoto', emoji: '⛩️' },
  { prefectureId: 'jp_kanagawa', labelKey: 'area.kanagawa', emoji: '🌊' },
  { prefectureId: 'jp_aichi', labelKey: 'area.aichi', emoji: '🏰' },
  { prefectureId: 'jp_fukuoka', labelKey: 'area.fukuoka', emoji: '🍜' },
  { prefectureId: 'jp_hokkaido', labelKey: 'area.hokkaido', emoji: '❄️' },
  { prefectureId: 'jp_hyogo', labelKey: 'area.hyogo', emoji: '🌉' },
] as const;

interface AreaSectionProps {
  categoryId?: string;
}

export function AreaSection({ categoryId }: AreaSectionProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();

  const areas = useMemo(() =>
    AREA_CONFIGS.map(config => ({
      prefectureId: config.prefectureId,
      label: t(config.labelKey),
      emoji: config.emoji,
    })),
  [t]);

  const handleAreaPress = useCallback(
    (prefectureId: string) => {
      if (categoryId) {
        // カテゴリ選択時はカテゴリ+都道府県スポットページへ遷移
        router.push(
          `/(tabs)/discover/categories/${categoryId}/prefectures/${prefectureId}` as Href
        );
      } else {
        // 全体表示時は都道府県スポットページへ遷移
        router.push(
          `/(tabs)/discover/prefectures/${prefectureId}` as Href
        );
      }
    },
    [router, categoryId]
  );

  const handleShowAllPrefectures = useCallback(() => {
    router.push('/(tabs)/discover/prefectures' as Href);
  }, [router]);

  return (
    <View className="py-4 px-4">
      {/* セクションタイトル */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-on-surface">
          📍 {t('section.searchByArea')}
        </Text>
        <Pressable
          onPress={handleShowAllPrefectures}
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
        {areas.map((area) => (
          <View key={area.prefectureId} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
            <Pressable
              onPress={() => handleAreaPress(area.prefectureId)}
              className="flex-row items-center bg-secondary rounded-xl px-4 py-3 active:opacity-70"
            >
              <Text style={{ fontSize: 24 }}>{area.emoji}</Text>
              <Text className="text-base font-medium text-on-surface ml-3">
                {area.label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
