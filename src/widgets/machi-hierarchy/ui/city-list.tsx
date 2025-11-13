/**
 * 市区町村一覧Widget
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachiHierarchy } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';

interface CityListProps {
  region: string;
  prefectureId: string;
  onCityPress: (cityId: string, cityName: string) => void;
}

export function CityList({
  region,
  prefectureId,
  onCityPress,
}: CityListProps) {
  const { data: hierarchy, isLoading, error } = useMachiHierarchy();

  // 指定された都道府県のデータを取得
  const regionData = hierarchy?.find((r) => r.region === region);
  const prefectureData = regionData?.prefectures.find(
    (p) => p.prefecture.id === prefectureId
  );

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={prefectureData}
      loadingMessage="市区町村データを読み込み中..."
      emptyMessage="市区町村データがありません"
      emptyIcon="🏘️"
    >
      {(prefectureData) => (
        <ScrollView className="flex-1 bg-gray-100">
            {prefectureData.cities.map((cityData) => {
              const machiCount = cityData.machis.length;

              return (
                <TouchableOpacity
                  key={cityData.city.id}
                  onPress={() => onCityPress(cityData.city.id, cityData.city.name)}
                  className="bg-white border-b border-gray-200 px-5 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      {cityData.city.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {machiCount}件の街
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
