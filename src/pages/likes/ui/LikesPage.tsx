/**
 * いいね一覧ページ
 */

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/like-item-list';
import { useUserLikedSpots, useUserLikedMaps, useUserLikedMasterSpots } from '@/entities/like/api/use-user-likes';
import { useSelectedPlaceStore } from '@/features/search-places';
import { removeSpotLike, removeMapLike, removeMasterSpotLike } from '@/shared/api/supabase/likes';
import { PageHeader } from '@/shared/ui';
import type { SpotWithDetails } from '@/shared/types';

interface LikesPageProps {
  userId?: string;
}

export function LikesPage({ userId: propUserId }: LikesPageProps) {
  const router = useRouter();
  const segments = useSegments();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;
  const [activeTab, setActiveTab] = useState<LikeTabMode>('spots');

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';
  const isInNotificationsTab = segments[0] === '(tabs)' && segments[1] === 'notifications';

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMasterSpots = [], isLoading: masterSpotsLoading } = useUserLikedMasterSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットタップ: スポット詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleSpotPress = useCallback((spot: SpotWithDetails) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/spots/${spot.id}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/spots/${spot.id}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/spots/${spot.id}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/spots/${spot.id}`);
    } else {
      router.push(`/spots/${spot.id}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  // マスタースポットタップ: デフォルトマップに遷移してスポットを表示
  const setJumpToMasterSpotId = useSelectedPlaceStore((state) => state.setJumpToMasterSpotId);
  const handleMasterSpotPress = useCallback((masterSpotId: string) => {
    // グローバルステートにジャンプ先を設定してからマップタブに遷移
    setJumpToMasterSpotId(masterSpotId);
    router.push('/(tabs)/map');
  }, [router, setJumpToMasterSpotId]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((userId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/users/${userId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/users/${userId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/users/${userId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/users/${userId}`);
    } else {
      router.push(`/users/${userId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  // マップタップ: マップ詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleMapPress = useCallback((mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/maps/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/maps/${mapId}`);
    } else {
      router.push(`/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  // スポットいいね削除
  const handleDeleteSpotLike = useCallback(async (spotId: string) => {
    if (!userId) return;
    try {
      await removeSpotLike(userId, spotId);
      queryClient.invalidateQueries({ queryKey: ['user-liked-spots', userId] });
    } catch (error) {
      console.error('Failed to delete spot like:', error);
    }
  }, [userId, queryClient]);

  // マスタースポットいいね削除
  const handleDeleteMasterSpotLike = useCallback(async (masterSpotId: string) => {
    if (!userId) return;
    try {
      await removeMasterSpotLike(userId, masterSpotId);
      queryClient.invalidateQueries({ queryKey: ['user-liked-master-spots', userId] });
    } catch (error) {
      console.error('Failed to delete master spot like:', error);
    }
  }, [userId, queryClient]);

  // マップいいね削除
  const handleDeleteMapLike = useCallback(async (mapId: string) => {
    if (!userId) return;
    try {
      await removeMapLike(userId, mapId);
      queryClient.invalidateQueries({ queryKey: ['user-liked-maps', userId] });
    } catch (error) {
      console.error('Failed to delete map like:', error);
    }
  }, [userId, queryClient]);

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="いいね" />
      {/* タブフィルター */}
      <LikeTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ */}
      {activeTab === 'spots' ? (
        <LikeSpotList
          data={likedSpots}
          masterSpotData={likedMasterSpots}
          isLoading={spotsLoading || masterSpotsLoading}
          onSpotPress={handleSpotPress}
          onMasterSpotPress={handleMasterSpotPress}
          onUserPress={handleUserPress}
          onDeleteSpotLike={handleDeleteSpotLike}
          onDeleteMasterSpotLike={handleDeleteMasterSpotLike}
        />
      ) : (
        <LikeMapList
          data={likedMaps}
          isLoading={mapsLoading}
          onMapPress={handleMapPress}
          onUserPress={handleUserPress}
          onDeleteMapLike={handleDeleteMapLike}
        />
      )}
    </View>
  );
}
