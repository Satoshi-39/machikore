/**
 * 都道府県一覧Widget
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachiHierarchy } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';

interface PrefectureListProps {
  region: string;
  onPrefecturePress: (prefectureId: string, prefectureName: string) => void;
}

export function PrefectureList({
  region,
  onPrefecturePress,
}: PrefectureListProps) {
  const { data: hierarchy, isLoading, error } = useMachiHierarchy();

  // 指定された地方のデータを取得
  const regionData = hierarchy?.find((r) => r.region === region);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={regionData}
      loadingMessage="都道府県データを読み込み中..."
      emptyMessage="都道府県データがありません"
      emptyIcon="🏛️"
    >
      {(regionData) => (
        <ScrollView className="flex-1 bg-gray-100">
            {regionData.prefectures.map((prefectureData) => {
              const cityCount = prefectureData.cities.length;
              const machiCount = prefectureData.totalMachiCount;

              return (
                <TouchableOpacity
                  key={prefectureData.prefecture.id}
                  onPress={() =>
                    onPrefecturePress(
                      prefectureData.prefecture.id,
                      prefectureData.prefecture.name
                    )
                  }
                  className="bg-white border-b border-gray-200 px-5 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {prefectureData.prefecture.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {cityCount}市区町村 • {machiCount}件の街
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
