/**
 * プロフィール統計情報ウィジェット
 *
 * 訪問した街数、投稿数、友達数を表示
 */

import React from 'react';
import { View, Text } from 'react-native';

interface ProfileStatsProps {
  visitedMachiCount: number;
  postsCount: number;
  friendsCount: number;
}

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <View className="flex-1 items-center py-4">
      <Text className="text-2xl font-bold text-gray-900 mb-1">
        {value.toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-500">{label}</Text>
    </View>
  );
}

export function ProfileStats({
  visitedMachiCount,
  postsCount,
  friendsCount,
}: ProfileStatsProps) {
  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row divide-x divide-gray-200">
        <StatItem label="訪問した街" value={visitedMachiCount} />
        <StatItem label="投稿" value={postsCount} />
        <StatItem label="友達" value={friendsCount} />
      </View>
    </View>
  );
}
