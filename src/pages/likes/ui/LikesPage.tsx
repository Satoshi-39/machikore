/**
 * いいね一覧ページ
 */

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/like-item-list';
import { useUserLikedSpots, useUserLikedMaps, useUserLikedMasterSpots } from '@/entities/like/api/use-user-likes';
import { useSelectedPlaceStore } from '@/features/search-places';
import { removeSpotLike, removeMapLike, removeMasterSpotLike } from '@/shared/api/supabase/likes';
import { PageHeader } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import type { SpotWithDetails } from '@/shared/types';

interface LikesPageProps {
  userId?: string;
}

export function LikesPage({ userId: propUserId }: LikesPageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;
  const [activeTab, setActiveTab] = useState<LikeTabMode>('spots');

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMasterSpots = [], isLoading: masterSpotsLoading } = useUserLikedMasterSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットタップ: スポット詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleSpotPress = useCallback((spot: SpotWithDetails) => {
    router.push(`/(tabs)/${currentTab}/spots/${spot.id}` as any);
  }, [router, currentTab]);

  // マスタースポットタップ: デフォルトマップに遷移してスポットを表示
  const setJumpToMasterSpotId = useSelectedPlaceStore((state) => state.setJumpToMasterSpotId);
  const handleMasterSpotPress = useCallback((masterSpotId: string) => {
    // グローバルステートにジャンプ先を設定してからホームタブに遷移
    setJumpToMasterSpotId(masterSpotId);
    router.push('/(tabs)/home');
  }, [router, setJumpToMasterSpotId]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as any);
  }, [router, currentTab]);

  // マップタップ: マップ詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [router, currentTab]);

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
    <View className="flex-1 bg-surface dark:bg-dark-surface">
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
