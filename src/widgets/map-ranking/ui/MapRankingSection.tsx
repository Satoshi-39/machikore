/**
 * マップランキングセクションWidget
 *
 * 横スクロールのマップカードを表示
 * ランキング番号付き
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors } from '@/shared/config';
import { MapThumbnail } from '@/shared/ui';

interface MapRankingCardProps {
  map: MapWithUser;
  rank: number;
  onPress: () => void;
}

function MapRankingCard({ map, rank, onPress }: MapRankingCardProps) {
  // ランキング1〜3位の色
  const getRankColor = (r: number) => {
    switch (r) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#9CA3AF'; // Gray
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ width: 160 }}
      className="mr-3 active:opacity-80"
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          width={160}
          height={100}
          borderRadius={12}
          defaultImagePadding={0.15}
        />

        {/* ランキングバッジ */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: getRankColor(rank),
            borderRadius: 12,
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text className="text-white text-xs font-bold">{rank}</Text>
        </View>
      </View>

      {/* マップ情報 */}
      <View className="mt-2">
        <Text
          className="text-sm font-semibold text-foreground dark:text-dark-foreground"
          numberOfLines={1}
        >
          {map.name}
        </Text>
        {map.user && (
          <Text
            className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5"
            numberOfLines={1}
          >
            @{map.user.username}
          </Text>
        )}
        <View className="flex-row items-center mt-1 gap-2">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={12} color="#EF4444" />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
              {map.likes_count}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={12} color={colors.primary.DEFAULT} />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
              {map.spots_count}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

interface MapRankingSectionProps {
  title: string;
  maps: MapWithUser[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function MapRankingSection({ title, maps, isLoading, error }: MapRankingSectionProps) {
  const router = useRouter();

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <Text className="text-lg font-bold text-foreground dark:text-dark-foreground px-4 mb-3">
        {title}
      </Text>

      {isLoading ? (
        <View className="h-32 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
          </Text>
        </View>
      ) : !maps || maps.length === 0 ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            マップがありません
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {maps.map((map, index) => (
            <MapRankingCard
              key={map.id}
              map={map}
              rank={index + 1}
              onPress={() => handleMapPress(map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
