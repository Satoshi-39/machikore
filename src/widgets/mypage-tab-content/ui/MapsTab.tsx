/**
 * マイページ マップタブ
 *
 * ユーザーが作成したカスタムマップの一覧を表示
 */

import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useUserMaps, useMapStore } from '@/entities/user-map';
import { AsyncBoundary } from '@/shared/ui';
import type { MapRow } from '@/shared/types/database.types';

interface MapsTabProps {
  userId: string | null;
}

interface MapCardProps {
  map: MapRow;
  onPress?: () => void;
}

function MapCard({ map, onPress }: MapCardProps) {
  const createdDate = new Date(map.created_at);
  const formattedDate = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 bg-white border-b border-gray-100"
    >
      <View className="flex-row items-start">
        {/* サムネイル or アイコン */}
        <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
          <Ionicons name="map" size={24} color={colors.primary.DEFAULT} />
        </View>

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {map.name}
          </Text>
          {map.description && (
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {map.description}
            </Text>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">
                {map.spots_count}スポット
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="heart" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">
                {map.likes_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-400">
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* 公開/非公開アイコン */}
        {map.is_public === 0 && (
          <View className="ml-2">
            <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function MapsTab({ userId }: MapsTabProps) {
  const router = useRouter();
  const { data: maps, isLoading, error } = useUserMaps(userId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);

  const handleMapPress = (map: MapRow) => {
    setSelectedMapId(map.id);
    router.push(`/(tabs)/map?id=${map.id}`);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps}
      loadingMessage="マップを読み込み中..."
      emptyMessage="まだマップを作成していません"
      emptyIonIcon="map"
    >
      {(data) => (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard
              map={item}
              onPress={() => handleMapPress(item)}
            />
          )}
          contentContainerClassName="bg-white"
        />
      )}
    </AsyncBoundary>
  );
}
