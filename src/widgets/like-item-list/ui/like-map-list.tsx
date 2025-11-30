/**
 * いいねしたマップ一覧Widget
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading } from '@/shared/ui';

interface LikedMap {
  likeId: string;
  likedAt: string;
  map: {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    likes_count: number;
    spots_count: number;
    user: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

interface LikeMapListProps {
  data: LikedMap[];
  isLoading: boolean;
  onMapPress: (mapId: string) => void;
}

export function LikeMapList({ data, isLoading, onMapPress }: LikeMapListProps) {
  const renderItem = useCallback(
    ({ item }: { item: LikedMap }) => {
      return (
        <Pressable
          onPress={() => onMapPress(item.map.id)}
          className="bg-white px-4 py-4 border-b border-gray-100"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Ionicons name="map" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {item.map.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {item.map.spots_count}スポット
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </View>
        </Pressable>
      );
    },
    [onMapPress]
  );

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
        <Text className="text-gray-500 mt-4">
          いいねしたマップがありません
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
