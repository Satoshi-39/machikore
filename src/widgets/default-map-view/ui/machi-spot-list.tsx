/**
 * 街に紐づくスポットリスト（デフォルトマップ詳細カード用）
 *
 * default-map 専用の内部コンポーネント
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useSpots } from '@/entities/spot/api';
import { getRelativeSpotTime } from '@/entities/spot/model';
import type { UUID } from '@/shared/types';

interface MachiSpotListProps {
  mapId: UUID | null;
}

export function MachiSpotList({ mapId }: MachiSpotListProps) {
  const { data: spots, isLoading } = useSpots(mapId || '');

  if (!mapId || isLoading) {
    return null;
  }

  if (!spots || spots.length === 0) {
    return (
      <View className="bg-gray-50 rounded-lg p-3">
        <View className="flex-row items-center">
          <Ionicons
            name="location-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-2">
            まだスポットがありません
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-gray-50 rounded-lg p-3">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="location"
          size={20}
          color={colors.primary.DEFAULT}
        />
        <Text className="text-sm font-semibold text-gray-900 ml-2">
          このマップのスポット（{spots.length}件）
        </Text>
      </View>

      <ScrollView
        className="max-h-40"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {spots.map((spot) => (
          <View
            key={spot.id}
            className="bg-white rounded-lg p-2 mb-2 border border-gray-200"
          >
            <Text className="text-sm font-semibold text-gray-900 mb-1">
              📍 {spot.custom_name || spot.name}
            </Text>
            {spot.description && (
              <Text className="text-xs text-gray-700 mb-1" numberOfLines={2}>
                {spot.description}
              </Text>
            )}
            {spot.address && (
              <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
                {spot.address}
              </Text>
            )}
            <Text className="text-xs text-gray-500">
              {getRelativeSpotTime(spot.created_at)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
