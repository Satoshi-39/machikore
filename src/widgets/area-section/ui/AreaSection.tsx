/**
 * エリア別セクションWidget
 *
 * 地域ボタンをグリッド形式で表示
 * タップでそのエリアのスポット一覧へ遷移
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// 主要エリア定義（prefectureId は prefectures.id に対応）
const AREAS = [
  { prefectureId: 'tokyo', label: '東京', emoji: '🗼' },
  { prefectureId: 'osaka', label: '大阪', emoji: '🏯' },
  { prefectureId: 'kyoto', label: '京都', emoji: '⛩️' },
  { prefectureId: 'kanagawa', label: '神奈川', emoji: '🌊' },
  { prefectureId: 'aichi', label: '愛知', emoji: '🏰' },
  { prefectureId: 'fukuoka', label: '福岡', emoji: '🍜' },
  { prefectureId: 'hokkaido', label: '北海道', emoji: '❄️' },
  { prefectureId: 'hyogo', label: '兵庫', emoji: '🌉' },
] as const;

interface AreaSectionProps {
  categoryId?: string;
}

export function AreaSection({ categoryId }: AreaSectionProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();

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
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          📍 エリアから探す
        </Text>
        <Pressable
          onPress={handleShowAllPrefectures}
          className="active:opacity-70"
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary}
          />
        </Pressable>
      </View>

      {/* 2列グリッド */}
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
        {AREAS.map((area) => (
          <View key={area.prefectureId} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
            <Pressable
              onPress={() => handleAreaPress(area.prefectureId)}
              className="flex-row items-center bg-muted dark:bg-dark-muted rounded-xl px-4 py-3 active:opacity-70"
            >
              <Text style={{ fontSize: 24 }}>{area.emoji}</Text>
              <Text className="text-base font-medium text-foreground dark:text-dark-foreground ml-3">
                {area.label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
