/**
 * カテゴリ別マップ一覧Widget
 *
 * 選択されたカテゴリのマップを一覧表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useMapTagSearch } from '@/entities/map';
import type { MapWithUser } from '@/shared/types';
import { colors } from '@/shared/config';
import { MapThumbnail } from '@/shared/ui';

interface CategoryMapsCardProps {
  map: MapWithUser;
  onPress: () => void;
}

function CategoryMapsCard({ map, onPress }: CategoryMapsCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
    >
      {/* サムネイル */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={64}
        height={64}
        borderRadius={8}
        defaultImagePadding={0.15}
      />

      {/* マップ情報 */}
      <View className="flex-1 ml-3">
        <Text
          className="text-base font-semibold text-foreground dark:text-dark-foreground"
          numberOfLines={1}
        >
          {map.name}
        </Text>
        {map.user && (
          <Text
            className="text-sm text-foreground-muted dark:text-dark-foreground-muted mt-0.5"
            numberOfLines={1}
          >
            @{map.user.username}
          </Text>
        )}
        <View className="flex-row items-center mt-1 gap-3">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-1">
              {map.spots_count}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-1">
              {map.likes_count}
            </Text>
          </View>
        </View>
      </View>

      {/* 矢印 */}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

interface CategoryMapsSectionProps {
  tag: string;
}

export function CategoryMapsSection({ tag }: CategoryMapsSectionProps) {
  const router = useRouter();
  const { data: maps, isLoading, error } = useMapTagSearch(tag);

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-foreground-muted dark:text-dark-foreground-muted">
          読み込みに失敗しました
        </Text>
      </View>
    );
  }

  if (!maps || maps.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
          「{tag}」のマップが見つかりませんでした
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={maps}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryMapsCard map={item} onPress={() => handleMapPress(item.id)} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
