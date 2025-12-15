/**
 * エリア別セクションWidget
 *
 * 地域ボタンをグリッド形式で表示
 * タップでそのエリアのマップ一覧へ遷移
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

// エリア定義
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

  const handleAreaPress = useCallback(
    (areaLabel: string) => {
      router.push(`/(tabs)/discover/tag-results?tag=${encodeURIComponent(areaLabel)}` as Href);
    },
    [router]
  );

  return (
    <View className="py-4 px-4">
      {/* セクションタイトル */}
      <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-3">
        📍 エリアから探す
      </Text>

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
