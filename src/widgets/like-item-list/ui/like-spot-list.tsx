/**
 * いいねしたスポット一覧Widget
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading } from '@/shared/ui';
import type { SpotWithDetails } from '@/shared/types';

export interface LikedSpotItem {
  likeId: string;
  likedAt: string;
  spot: SpotWithDetails;
}

interface LikeSpotListProps {
  data: LikedSpotItem[];
  isLoading: boolean;
  onSpotPress: (spot: SpotWithDetails) => void;
}

export function LikeSpotList({ data, isLoading, onSpotPress }: LikeSpotListProps) {
  const renderItem = useCallback(
    ({ item }: { item: LikedSpotItem }) => {
      const spotName = item.spot.custom_name || item.spot.master_spot?.name || '不明なスポット';
      const address = item.spot.master_spot?.google_formatted_address;

      return (
        <Pressable
          onPress={() => onSpotPress(item.spot)}
          className="bg-white px-4 py-4 border-b border-gray-100"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
              <Ionicons name="location" size={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {spotName}
              </Text>
              {address && (
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {address}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </View>
        </Pressable>
      );
    },
    [onSpotPress]
  );

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
        <Text className="text-gray-500 mt-4">
          いいねしたスポットがありません
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.likeId}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}
