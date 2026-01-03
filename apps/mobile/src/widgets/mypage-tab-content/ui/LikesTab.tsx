/**
 * マイページ いいねタブ
 *
 * ユーザーがいいねしたスポット・マップを表示
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, LOCATION_ICONS } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { Loading, LocationPinIcon } from '@/shared/ui';
import { useUserLikedSpots, useUserLikedMaps } from '@/entities/like/api/use-user-likes';
import type { SpotWithDetails } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';

type LikeSubTab = 'spots' | 'maps';

interface LikesTabProps {
  userId: string | null;
}

export function LikesTab({ userId }: LikesTabProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const [subTab, setSubTab] = useState<LikeSubTab>('spots');

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットへの遷移
  const navigateToSpot = useCallback((spot: SpotWithDetails) => {
    router.push(`/(tabs)/${currentTab}/spots/${spot.id}` as any);
  }, [router, currentTab]);

  // マップへの遷移
  const navigateToMap = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [router, currentTab]);

  const isLoading = subTab === 'spots' ? spotsLoading : mapsLoading;

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* サブタブ */}
      <View className="flex-row border-b border-border dark:border-dark-border">
        <Pressable
          onPress={() => setSubTab('spots')}
          className={`flex-1 py-3 items-center ${subTab === 'spots' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${subTab === 'spots' ? 'text-blue-500' : 'text-foreground-secondary dark:text-dark-foreground-secondary'}`}>
            {t('favorite.spot')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSubTab('maps')}
          className={`flex-1 py-3 items-center ${subTab === 'maps' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${subTab === 'maps' ? 'text-blue-500' : 'text-foreground-secondary dark:text-dark-foreground-secondary'}`}>
            {t('favorite.map')}
          </Text>
        </Pressable>
      </View>

      {/* コンテンツ */}
      {subTab === 'spots' ? (
        likedSpots.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
              {t('favorite.noLikedSpots')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedSpots}
            keyExtractor={(item) => item.likeId}
            renderItem={({ item }) => {
              const spotName = item.spot.description || item.spot.master_spot?.name || t('favorite.unknownSpot');
              const address = item.spot.master_spot?.google_short_address || item.spot.google_short_address;

              return (
                <Pressable
                  onPress={() => navigateToSpot(item.spot)}
                  className="bg-surface dark:bg-dark-surface px-4 py-4 border-b border-border-light dark:border-dark-border-light"
                >
                  <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full ${LOCATION_ICONS.USER_SPOT.bgColor} items-center justify-center mr-3`}>
                      <LocationPinIcon size={20} color={LOCATION_ICONS.USER_SPOT.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                        {spotName}
                      </Text>
                      {address && (
                        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
                          {address}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                  </View>
                </Pressable>
              );
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )
      ) : (
        likedMaps.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
              {t('favorite.noLikedMaps')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedMaps}
            keyExtractor={(item) => item.likeId}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigateToMap(item.map.id)}
                className="bg-surface dark:bg-dark-surface px-4 py-4 border-b border-border-light dark:border-dark-border-light"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="map" size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                      {item.map.name}
                    </Text>
                    <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                      {t('favorite.spotsCount', { count: item.map.spots_count })}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                </View>
              </Pressable>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )
      )}
    </View>
  );
}
