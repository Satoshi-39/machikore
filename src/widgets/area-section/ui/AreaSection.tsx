/**
 * エリア別セクションWidget
 *
 * 地域ボタンをグリッド形式で表示
 * タップでそのエリアのマップ一覧へ遷移
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// 主要都市エリア定義
const AREAS = [
  { id: 'tokyo', label: '東京', emoji: '🗼' },
  { id: 'osaka', label: '大阪', emoji: '🏯' },
  { id: 'kyoto', label: '京都', emoji: '⛩️' },
  { id: 'yokohama', label: '横浜', emoji: '🎡' },
  { id: 'nagoya', label: '名古屋', emoji: '🏰' },
  { id: 'fukuoka', label: '福岡', emoji: '🍜' },
  { id: 'sapporo', label: '札幌', emoji: '❄️' },
  { id: 'kobe', label: '神戸', emoji: '🌉' },
] as const;

export function AreaSection() {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();

  const handleAreaPress = useCallback(
    (areaLabel: string) => {
      router.push(`/(tabs)/discover/tag-results?tag=${encodeURIComponent(areaLabel)}` as Href);
    },
    [router]
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
          <View key={area.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
            <Pressable
              onPress={() => handleAreaPress(area.label)}
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
