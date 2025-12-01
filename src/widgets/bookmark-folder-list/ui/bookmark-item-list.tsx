/**
 * ブックマークアイテム一覧Widget
 *
 * 特定フォルダ内のブックマークを表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useBookmarks, useBookmarkFolders } from '@/entities/bookmark';
import type { BookmarkWithDetails } from '@/shared/api/supabase/bookmarks';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';

interface BookmarkItemListProps {
  userId: string;
  folderId: string;
  activeTab: BookmarkTabMode;
  onBack: () => void;
}

export function BookmarkItemList({
  userId,
  folderId,
  activeTab,
  onBack,
}: BookmarkItemListProps) {
  const router = useRouter();
  const segments = useSegments();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';

  const { data: folders = [] } = useBookmarkFolders(userId);
  const { data: allBookmarks = [] } = useBookmarks(userId, undefined);

  // フォルダ名を取得
  const folderName = useMemo(() => {
    if (folderId === 'uncategorized') return '後で見る';
    return folders.find((f) => f.id === folderId)?.name || '';
  }, [folderId, folders]);

  // 選択中のフォルダのブックマーク
  const bookmarks = useMemo(() => {
    return allBookmarks.filter((b) => {
      const matchFolder = folderId === 'uncategorized'
        ? !b.folder_id
        : b.folder_id === folderId;
      const matchType = activeTab === 'spots' ? b.spot_id : b.map_id;
      return matchFolder && matchType;
    });
  }, [allBookmarks, folderId, activeTab]);

  // スポットへの遷移（タブ内ルートを使用）
  const navigateToSpot = useCallback((spotId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/spots/${spotId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/spots/${spotId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/spots/${spotId}`);
    } else {
      router.push(`/spots/${spotId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  // マップへの遷移（タブ内ルートを使用）
  const navigateToMap = useCallback((mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else {
      router.push(`/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  const renderBookmarkItem = useCallback(
    ({ item }: { item: BookmarkWithDetails }) => {
      if (item.spot) {
        return (
          <Pressable
            onPress={() => navigateToSpot(item.spot!.id)}
            className="bg-white px-4 py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="location" size={20} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {item.spot.custom_name || item.spot.master_spot?.name || '不明なスポット'}
                </Text>
                {item.spot.master_spot?.google_formatted_address && (
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {item.spot.master_spot.google_formatted_address}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </View>
          </Pressable>
        );
      }

      if (item.map) {
        return (
          <Pressable
            onPress={() => navigateToMap(item.map!.id)}
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
      }

      return null;
    },
    [navigateToSpot, navigateToMap]
  );

  return (
    <View className="flex-1">
      {/* フォルダヘッダー */}
      <Pressable
        onPress={onBack}
        className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center"
      >
        <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        <Text className="ml-2 text-base font-medium text-gray-900">
          {folderName}
        </Text>
      </Pressable>

      {/* ブックマーク一覧 */}
      {bookmarks.length === 0 ? (
        <View className="flex-1 items-center justify-center py-12">
          <Ionicons name="bookmark-outline" size={48} color={colors.text.secondary} />
          <Text className="text-gray-500 mt-4">
            {activeTab === 'spots' ? 'スポット' : 'マップ'}のブックマークがありません
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderBookmarkItem}
        />
      )}
    </View>
  );
}
