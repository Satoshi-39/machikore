/**
 * いいね一覧ページ
 */

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/mypage-tab-content';
import { useUserLikedSpots, useUserLikedMaps } from '@/entities/like/api/use-user-likes';
import { removeSpotLike, removeMapLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { PageHeader } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { log } from '@/shared/config/logger';

interface LikesPageProps {
  userId?: string;
}

export function LikesPage({ userId: propUserId }: LikesPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;
  const [activeTab, setActiveTab] = useState<LikeTabMode>('maps');

  const { data: likedSpots = [], isLoading: spotsLoading } = useUserLikedSpots(userId);
  const { data: likedMaps = [], isLoading: mapsLoading } = useUserLikedMaps(userId);

  // スポットタップ: スポット詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}` as any);
  }, [router, currentTab]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as any);
  }, [router, currentTab]);

  // マップタップ: マップ詳細画面に遷移（戻るでいいね一覧に戻れる）
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [router, currentTab]);

  // 記事タップ: 記事画面に遷移
  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as any);
  }, [router, currentTab]);

  // スポットいいね削除
  const handleDeleteSpotLike = useCallback(async (spotId: string) => {
    if (!userId) return;
    try {
      await removeSpotLike(userId, spotId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedSpots(userId) });
    } catch (error) {
      log.error('[LikesPage] Failed to delete spot like:', error);
    }
  }, [userId, queryClient]);

  // マップいいね削除
  const handleDeleteMapLike = useCallback(async (mapId: string) => {
    if (!userId) return;
    try {
      await removeMapLike(userId, mapId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedMaps(userId) });
    } catch (error) {
      log.error('[LikesPage] Failed to delete map like:', error);
    }
  }, [userId, queryClient]);

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={t('favorite.likedItems')} />
      {/* タブフィルター */}
      <LikeTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ */}
      {activeTab === 'spots' ? (
        <LikeSpotList
          data={likedSpots}
          isLoading={spotsLoading}
          currentUserId={userId}
          onSpotPress={handleSpotPress}
          onUserPress={handleUserPress}
          onDeleteSpotLike={handleDeleteSpotLike}
        />
      ) : (
        <LikeMapList
          data={likedMaps}
          isLoading={mapsLoading}
          currentUserId={userId}
          onMapPress={handleMapPress}
          onUserPress={handleUserPress}
          onArticlePress={handleArticlePress}
          onDeleteMapLike={handleDeleteMapLike}
        />
      )}
    </View>
  );
}
