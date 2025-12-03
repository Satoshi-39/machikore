/**
 * ブックマークアイテム一覧Widget
 *
 * 特定フォルダ内のブックマークを表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useBookmarks } from '@/entities/bookmark';
import { removeBookmark } from '@/shared/api/supabase/bookmarks';
import type { BookmarkWithDetails } from '@/shared/api/supabase/bookmarks';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { SwipeableRow } from '@/shared/ui';

interface BookmarkItemListProps {
  userId: string;
  folderId: string;
  activeTab: BookmarkTabMode;
}

export function BookmarkItemList({
  userId,
  folderId,
  activeTab,
}: BookmarkItemListProps) {
  const router = useRouter();
  const segments = useSegments();
  const queryClient = useQueryClient();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';

  const { data: allBookmarks = [] } = useBookmarks(userId, undefined);

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
      router.push(`/(tabs)/map/maps/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else {
      router.push(`/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  // ユーザープロフィールへの遷移
  const navigateToUser = useCallback((navUserId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/users/${navUserId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/users/${navUserId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/users/${navUserId}`);
    } else {
      router.push(`/users/${navUserId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab]);

  // ブックマーク削除
  const handleDeleteBookmark = useCallback(async (bookmarkId: string) => {
    try {
      await removeBookmark(bookmarkId);
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  }, [userId, queryClient]);

  const renderBookmarkItem = useCallback(
    ({ item }: { item: BookmarkWithDetails }) => {
      if (item.spot) {
        const user = item.spot.user;
        const content = (
          <Pressable
            onPress={() => navigateToSpot(item.spot!.id)}
            className="bg-white px-4 py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              {/* ユーザーアバター（タップでプロフィールへ） */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  if (user?.id) {
                    navigateToUser(user.id);
                  }
                }}
                disabled={!user?.id}
              >
                {user?.avatar_url ? (
                  <Image
                    source={{ uri: user.avatar_url }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color={colors.gray[500]} />
                  </View>
                )}
              </Pressable>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {item.spot.custom_name || item.spot.master_spot?.name || '不明なスポット'}
                </Text>
                {item.spot.master_spot?.google_formatted_address && (
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {item.spot.master_spot.google_formatted_address}
                  </Text>
                )}
                {user && (
                  <Text className="text-xs text-gray-400 mt-0.5">
                    {user.display_name || user.username || 'ユーザー'}の投稿
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </View>
          </Pressable>
        );

        return (
          <SwipeableRow onDelete={() => handleDeleteBookmark(item.id)}>
            {content}
          </SwipeableRow>
        );
      }

      if (item.map) {
        const user = item.map.user;
        const content = (
          <Pressable
            onPress={() => navigateToMap(item.map!.id)}
            className="bg-white px-4 py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              {/* ユーザーアバター（タップでプロフィールへ） */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  if (user?.id) {
                    navigateToUser(user.id);
                  }
                }}
                disabled={!user?.id}
              >
                {user?.avatar_url ? (
                  <Image
                    source={{ uri: user.avatar_url }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color={colors.gray[500]} />
                  </View>
                )}
              </Pressable>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {item.map.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.map.spots_count}スポット
                </Text>
                {user && (
                  <Text className="text-xs text-gray-400 mt-0.5">
                    {user.display_name || user.username || 'ユーザー'}のマップ
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </View>
          </Pressable>
        );

        return (
          <SwipeableRow onDelete={() => handleDeleteBookmark(item.id)}>
            {content}
          </SwipeableRow>
        );
      }

      return null;
    },
    [navigateToSpot, navigateToMap, navigateToUser, handleDeleteBookmark]
  );

  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="bookmark-outline" size={48} color={colors.text.secondary} />
        <Text className="text-gray-500 mt-4">
          {activeTab === 'spots' ? 'スポット' : 'マップ'}のブックマークがありません
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.id}
      renderItem={renderBookmarkItem}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}
