/**
 * マイページ いいねタブ
 *
 * ユーザーがいいねしたスポット・マップを表示
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading } from '@/shared/ui';
import { useUserLikedSpots, useUserLikedMaps } from '@/entities/like/api/use-user-likes';
import type { SpotWithDetails } from '@/shared/types';

type LikeSubTab = 'spots' | 'maps';

interface LikesTabProps {
  userId: string | null;
}

export function LikesTab({ userId }: LikesTabProps) {
  const router = useRouter();
  const segments = useSegments();
  const [subTab, setSubTab] = useState<LikeSubTab>('spots');

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットへの遷移
  const navigateToSpot = useCallback((spot: SpotWithDetails) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/spots/${spot.id}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/spots/${spot.id}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/spots/${spot.id}`);
    } else {
      router.push(`/spots/${spot.id}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  // マップへの遷移
  const navigateToMap = useCallback((mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/maps/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else {
      router.push(`/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  const isLoading = subTab === 'spots' ? spotsLoading : mapsLoading;

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* サブタブ */}
      <View className="flex-row border-b border-gray-200">
        <Pressable
          onPress={() => setSubTab('spots')}
          className={`flex-1 py-3 items-center ${subTab === 'spots' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${subTab === 'spots' ? 'text-blue-500' : 'text-gray-500'}`}>
            スポット
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSubTab('maps')}
          className={`flex-1 py-3 items-center ${subTab === 'maps' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text className={`text-sm font-medium ${subTab === 'maps' ? 'text-blue-500' : 'text-gray-500'}`}>
            マップ
          </Text>
        </Pressable>
      </View>

      {/* コンテンツ */}
      {subTab === 'spots' ? (
        likedSpots.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
            <Text className="text-gray-500 mt-4">
              いいねしたスポットがありません
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedSpots}
            keyExtractor={(item) => item.likeId}
            renderItem={({ item }) => {
              const spotName = item.spot.custom_name || item.spot.master_spot?.name || '不明なスポット';
              const address = item.spot.master_spot?.google_formatted_address;

              return (
                <Pressable
                  onPress={() => navigateToSpot(item.spot)}
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
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )
      ) : (
        likedMaps.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="heart-outline" size={48} color={colors.text.secondary} />
            <Text className="text-gray-500 mt-4">
              いいねしたマップがありません
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedMaps}
            keyExtractor={(item) => item.likeId}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigateToMap(item.map.id)}
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
            )}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )
      )}
    </View>
  );
}
