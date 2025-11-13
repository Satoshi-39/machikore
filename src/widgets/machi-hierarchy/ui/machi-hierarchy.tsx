/**
 * Machi階層表示Widget
 *
 * 地方 → 都道府県 → 市区町村 → 街 の階層構造で表示
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachiHierarchy } from '@/entities/machi';
import { useVisits } from '@/entities/visit/api';
import { useCurrentUserId } from '@/entities/user';
import { MachiCard } from '@/features/machi';
import { AsyncBoundary } from '@/shared/ui';

export function MachiHierarchy() {
  const currentUserId = useCurrentUserId();
  const { data: hierarchy, isLoading, error } = useMachiHierarchy();
  const { data: visits } = useVisits(currentUserId);

  // 展開状態を管理
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set()
  );
  const [expandedPrefectures, setExpandedPrefectures] = useState<Set<string>>(
    new Set()
  );
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());

  // 街IDから訪問情報へのマップを作成
  const visitMap = useMemo(() => {
    if (!visits) return new Map();
    const map = new Map();
    visits.forEach((visit) => {
      map.set(visit.machi_id, visit);
    });
    return map;
  }, [visits]);

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
      } else {
        next.add(region);
      }
      return next;
    });
  };

  const togglePrefecture = (prefectureId: string) => {
    setExpandedPrefectures((prev) => {
      const next = new Set(prev);
      if (next.has(prefectureId)) {
        next.delete(prefectureId);
      } else {
        next.add(prefectureId);
      }
      return next;
    });
  };

  const toggleCity = (cityId: string) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(cityId)) {
        next.delete(cityId);
      } else {
        next.add(cityId);
      }
      return next;
    });
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={hierarchy}
      loadingMessage="階層データを読み込み中..."
      emptyMessage="データがありません"
      emptyIcon="🏘️"
    >
      {(hierarchy) => (
        <ScrollView className="flex-1 bg-gray-100">
          {hierarchy.map((regionData) => {
            const isRegionExpanded = expandedRegions.has(regionData.region);
            const totalMachis = regionData.prefectures.reduce(
              (sum, p) => sum + p.totalMachiCount,
              0
            );

            return (
              <View key={regionData.region} className="mb-2">
                {/* 地方ヘッダー */}
                <TouchableOpacity
                  onPress={() => toggleRegion(regionData.region)}
                  className="bg-white border-b border-gray-200 px-5 py-4 flex-row items-center"
                >
                  {isRegionExpanded ? (
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  )}
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    {regionData.region}
                  </Text>
                  <Text className="text-sm text-gray-500 ml-auto">
                    {totalMachis}件
                  </Text>
                </TouchableOpacity>

                {/* 都道府県リスト */}
                {isRegionExpanded &&
                  regionData.prefectures.map((prefectureData) => {
                    const isPrefectureExpanded = expandedPrefectures.has(
                      prefectureData.prefecture.id
                    );

                    return (
                      <View key={prefectureData.prefecture.id}>
                        {/* 都道府県ヘッダー */}
                        <TouchableOpacity
                          onPress={() =>
                            togglePrefecture(prefectureData.prefecture.id)
                          }
                          className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex-row items-center pl-10"
                        >
                          {isPrefectureExpanded ? (
                            <Ionicons name="chevron-down" size={18} color="#6B7280" />
                          ) : (
                            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                          )}
                          <Text className="text-base font-semibold text-gray-700 ml-2">
                            {prefectureData.prefecture.name}
                          </Text>
                          <Text className="text-sm text-gray-500 ml-auto">
                            {prefectureData.totalMachiCount}件
                          </Text>
                        </TouchableOpacity>

                        {/* 市区町村リスト */}
                        {isPrefectureExpanded &&
                          prefectureData.cities.map((cityData) => {
                            const isCityExpanded = expandedCities.has(
                              cityData.city.id
                            );

                            return (
                              <View key={cityData.city.id}>
                                {/* 市区町村ヘッダー */}
                                <TouchableOpacity
                                  onPress={() => toggleCity(cityData.city.id)}
                                  className="bg-white border-b border-gray-100 px-5 py-3 flex-row items-center pl-16"
                                >
                                  {isCityExpanded ? (
                                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                  ) : (
                                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                  )}
                                  <Text className="text-sm font-medium text-gray-600 ml-2">
                                    {cityData.city.name}
                                  </Text>
                                  <Text className="text-xs text-gray-400 ml-auto">
                                    {cityData.machis.length}件
                                  </Text>
                                </TouchableOpacity>

                                {/* 街リスト */}
                                {isCityExpanded && (
                                  <View className="bg-gray-50 px-4 py-2">
                                    {cityData.machis.map((machi) => {
                                      const visit = visitMap.get(machi.id);
                                      return (
                                        <View key={machi.id} className="ml-6">
                                          <MachiCard
                                            station={machi}
                                            isVisited={!!visit}
                                            visitCount={
                                              visit?.visit_count ?? 0
                                            }
                                          />
                                        </View>
                                      );
                                    })}
                                  </View>
                                )}
                              </View>
                            );
                          })}
                      </View>
                    );
                  })}
              </View>
            );
          })}
        </ScrollView>
      )}
    </AsyncBoundary>
  );
}
