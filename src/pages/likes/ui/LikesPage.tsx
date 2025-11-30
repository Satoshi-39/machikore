/**
 * いいね一覧ページ
 */

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/like-item-list';
import { useUserLikedSpots, useUserLikedMaps } from '@/entities/like/api/use-user-likes';
import { PageHeader } from '@/shared/ui';
import type { SpotWithDetails } from '@/shared/types';

export function LikesPage() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const [activeTab, setActiveTab] = useState<LikeTabMode>('spots');

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットタップ: スポット詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleSpotPress = useCallback((spot: SpotWithDetails) => {
    router.push(`/spots/${spot.id}`);
  }, [router]);

  // マップタップ: マップ詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/maps/${mapId}`);
  }, [router]);

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="いいね" />
      {/* タブフィルター */}
      <LikeTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ */}
      {activeTab === 'spots' ? (
        <LikeSpotList
          data={likedSpots}
          isLoading={spotsLoading}
          onSpotPress={handleSpotPress}
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
