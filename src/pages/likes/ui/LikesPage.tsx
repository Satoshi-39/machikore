/**
 * いいね一覧ページ
 */

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/like-item-list';
import { useUserLikedSpots, useUserLikedMaps, useUserLikedMasterSpots } from '@/entities/like/api/use-user-likes';
import { useSelectedPlaceStore } from '@/features/search-places';
import { PageHeader } from '@/shared/ui';
import type { SpotWithDetails } from '@/shared/types';

interface LikesPageProps {
  userId?: string;
}

export function LikesPage({ userId: propUserId }: LikesPageProps) {
  const router = useRouter();
  const segments = useSegments();
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

  // マップタップ: マップ詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleMapPress = useCallback((mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/maps/${mapId}`);
    } else {
      router.push(`/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

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
        />
      ) : (
        <LikeMapList
          data={likedMaps}
          isLoading={mapsLoading}
          onMapPress={handleMapPress}
        />
      )}
    </View>
  );
}
