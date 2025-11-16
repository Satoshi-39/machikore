/**
 * 地方一覧Widget
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachiHierarchy } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';

interface RegionListProps {
  onRegionPress: (region: string) => void;
}

export function RegionList({ onRegionPress }: RegionListProps) {
  const { data: hierarchy, isLoading, error } = useMachiHierarchy();

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={hierarchy}
      loadingMessage="地方データを読み込み中..."
      emptyMessage="データがありません"
      emptyIcon="🗾"
    >
      {(hierarchy) => (
        <ScrollView className="flex-1 bg-gray-100">
            {hierarchy.map((regionData) => {
              const totalMachis = regionData.prefectures.reduce(
                (sum, p) => sum + p.totalMachiCount,
                0
              );
              const prefectureCount = regionData.prefectures.length;

              return (
                <TouchableOpacity
                  key={regionData.region}
                  onPress={() => onRegionPress(regionData.region)}
                  className="bg-white border-b border-gray-200 px-5 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">
                      {regionData.region}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {prefectureCount}都道府県 • {totalMachis}件の街
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
      )}
    </AsyncBoundary>
  );
}
