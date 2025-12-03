/**
 * 街に紐づくスポットリスト（デフォルトマップ詳細カード用）
 *
 * default-map 専用の内部コンポーネント
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useSpots } from '@/entities/user-spot/api';
import { getRelativeSpotTime } from '@/entities/user-spot/model';
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
      <View className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg p-3">
        <View className="flex-row items-center">
          <Ionicons
            name="location-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-2">
            まだスポットがありません
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg p-3">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="location"
          size={20}
          color={colors.primary.DEFAULT}
        />
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground ml-2">
          このマップのスポット（{spots.length}件）
        </Text>
      </View>

      <ScrollView
        className="max-h-40"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {spots.map((spot) => {
          const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
          const spotAddress = spot.master_spot?.google_formatted_address;
          return (
            <View
              key={spot.id}
              className="bg-surface dark:bg-dark-surface rounded-lg p-2 mb-2 border border-border dark:border-dark-border"
            >
              <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1">
                📍 {spotName}
              </Text>
              {spot.description && (
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1" numberOfLines={2}>
                  {spot.description}
                </Text>
              )}
              {spotAddress && (
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1" numberOfLines={1}>
                  {spotAddress}
                </Text>
              )}
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {getRelativeSpotTime(spot.created_at)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
