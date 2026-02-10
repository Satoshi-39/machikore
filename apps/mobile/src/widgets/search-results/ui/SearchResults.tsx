/**
 * 検索結果Widget
 *
 * FSDの原則：Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * - タブ切り替え（最新/スポット/マップ/ユーザー）
 * - 検索結果リスト表示
 * - フィルター機能対応
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import {
  MixedFeedSkeleton,
  RepeatSkeleton,
  SpotCardSkeleton,
  MapCardSkeleton,
  UserListItemSkeleton,
} from '@/shared/ui/skeleton';
import { useSpotSearch, useSpotTagSearch } from '@/entities/user-spot';
import { useMapSearch, useMapTagSearch } from '@/entities/map';
import { useUserSearch, useUserStore } from '@/entities/user';
import { useIsPremium } from '@/entities/subscription';
import { useSpotActions } from '@/features/spot-actions';
import { useMapActions } from '@/features/map-actions';
import type { SpotSearchFilters, MapSearchFilters } from '@/shared/api/supabase';
import { LatestResults } from './LatestResults';
import { SpotResults } from './SpotResults';
import { MapResults } from './MapResults';
import { UserResults } from './UserResults';

type SearchResultTab = 'latest' | 'spots' | 'maps' | 'users';

interface SearchResultsProps {
  query: string;
  spotFilters?: SpotSearchFilters;
  mapFilters?: MapSearchFilters;
  onSpotPress: (spotId: string) => void;
  onMapPress: (mapId: string) => void;
  /** スポットカード内のマップアイコンタップ時（マップ内スポットへの遷移用） */
  onSpotMapPress: (spotId: string, mapId: string) => void;
  onUserPress: (userId: string) => void;
  onSpotCommentPress: (spotId: string) => void;
  onMapCommentPress: (mapId: string) => void;
  onTagPress: (tagName: string) => void;
}

export function SearchResults({
  query,
  spotFilters,
  mapFilters,
  onSpotPress,
  onMapPress,
  onSpotMapPress,
  onUserPress,
  onSpotCommentPress,
  onMapCommentPress,
  onTagPress,
}: SearchResultsProps) {
  const { t } = useI18n();
  const [resultTab, setResultTab] = useState<SearchResultTab>('latest');
  const currentUser = useUserStore((state) => state.user);
  const isPremium = useIsPremium();
  const showAds = !isPremium;

  // スポット・マップ操作フック
  const {
    handleEdit: handleEditSpot,
    handleDelete: handleDeleteSpot,
    handleReport: handleReportSpot,
    handleBlock: handleBlockFromSpot,
  } = useSpotActions({ currentUserId: currentUser?.id });

  const {
    handleEdit: handleEditMap,
    handleDelete: handleDeleteMap,
    handleReport: handleReportMap,
    handleBlock: handleBlockFromMap,
  } = useMapActions({ currentUserId: currentUser?.id });

  // タグ検索かどうかを判定
  const isTagSearch = query.startsWith('#');
  const tagName = isTagSearch ? query.slice(1) : '';
  const keywordQuery = isTagSearch ? '' : query;

  // フィルターが有効かどうか
  const hasFilters = !!(
    spotFilters?.prefectureId ||
    spotFilters?.cityId ||
    (spotFilters?.dateRange && spotFilters.dateRange !== 'all')
  );

  // キーワードでスポット検索
  const keywordSpotsQuery = useSpotSearch(
    (keywordQuery || hasFilters) && (resultTab === 'spots' || resultTab === 'latest')
      ? keywordQuery
      : '',
    spotFilters,
    currentUser?.id
  );

  // タグでスポット検索
  const tagSpotsQuery = useSpotTagSearch(
    isTagSearch && (resultTab === 'spots' || resultTab === 'latest')
      ? tagName
      : '',
    spotFilters,
    currentUser?.id
  );

  const spotsQuery = isTagSearch ? tagSpotsQuery : keywordSpotsQuery;
  const spots = spotsQuery.data?.pages.flat();
  const spotsLoading = spotsQuery.isLoading;
  const spotsRefetching = spotsQuery.isRefetching;
  const refetchSpots = spotsQuery.refetch;

  // キーワードでマップ検索
  const keywordMapsQuery = useMapSearch(
    (keywordQuery || hasFilters) && (resultTab === 'maps' || resultTab === 'latest')
      ? keywordQuery
      : '',
    mapFilters,
    currentUser?.id
  );

  // タグでマップ検索
  const tagMapsQuery = useMapTagSearch(
    isTagSearch && (resultTab === 'maps' || resultTab === 'latest')
      ? tagName
      : '',
    mapFilters,
    currentUser?.id
  );

  const mapsQuery = isTagSearch ? tagMapsQuery : keywordMapsQuery;
  const maps = mapsQuery.data?.pages.flat();
  const mapsLoading = mapsQuery.isLoading;
  const mapsRefetching = mapsQuery.isRefetching;
  const refetchMaps = mapsQuery.refetch;

  // ユーザー検索
  const usersQueryResult = useUserSearch(
    keywordQuery && resultTab === 'users' ? keywordQuery : '',
    currentUser?.id
  );
  const users = usersQueryResult.data?.pages.flat();
  const usersLoading = usersQueryResult.isLoading;
  const usersRefetching = usersQueryResult.isRefetching;
  const refetchUsers = usersQueryResult.refetch;

  const isLoading =
    (resultTab === 'spots' && spotsLoading) ||
    (resultTab === 'maps' && mapsLoading) ||
    (resultTab === 'users' && usersLoading) ||
    (resultTab === 'latest' && (spotsLoading || mapsLoading));

  // Pull-to-refresh用のrefresh状態
  const isRefreshing =
    (resultTab === 'spots' && spotsRefetching) ||
    (resultTab === 'maps' && mapsRefetching) ||
    (resultTab === 'users' && usersRefetching) ||
    (resultTab === 'latest' && (spotsRefetching || mapsRefetching));

  // Pull-to-refresh用のrefetch関数
  const handleRefresh = useCallback(async () => {
    switch (resultTab) {
      case 'latest':
        await Promise.all([refetchSpots(), refetchMaps()]);
        break;
      case 'spots':
        await refetchSpots();
        break;
      case 'maps':
        await refetchMaps();
        break;
      case 'users':
        await refetchUsers();
        break;
    }
  }, [resultTab, refetchSpots, refetchMaps, refetchUsers]);

  // 無限スクロール: スポット
  const handleEndReachedSpots = useCallback(() => {
    if (spotsQuery.hasNextPage && !spotsQuery.isFetchingNextPage) {
      spotsQuery.fetchNextPage();
    }
  }, [spotsQuery]);

  // 無限スクロール: マップ
  const handleEndReachedMaps = useCallback(() => {
    if (mapsQuery.hasNextPage && !mapsQuery.isFetchingNextPage) {
      mapsQuery.fetchNextPage();
    }
  }, [mapsQuery]);

  // 無限スクロール: ユーザー
  const handleEndReachedUsers = useCallback(() => {
    if (usersQueryResult.hasNextPage && !usersQueryResult.isFetchingNextPage) {
      usersQueryResult.fetchNextPage();
    }
  }, [usersQueryResult]);

  // 無限スクロール: 最新（スポット+マップ両方）
  const handleEndReachedLatest = useCallback(() => {
    if (spotsQuery.hasNextPage && !spotsQuery.isFetchingNextPage) {
      spotsQuery.fetchNextPage();
    }
    if (mapsQuery.hasNextPage && !mapsQuery.isFetchingNextPage) {
      mapsQuery.fetchNextPage();
    }
  }, [spotsQuery, mapsQuery]);

  const searchResultTabs = useMemo(
    () => [
      { key: 'latest' as SearchResultTab, label: t('discover.latest') },
      { key: 'spots' as SearchResultTab, label: t('discover.spots') },
      { key: 'maps' as SearchResultTab, label: t('discover.maps') },
      { key: 'users' as SearchResultTab, label: t('discover.users') },
    ],
    [t]
  );

  const renderSkeleton = () => {
    switch (resultTab) {
      case 'latest':
        return <MixedFeedSkeleton />;
      case 'spots':
        return <RepeatSkeleton component={SpotCardSkeleton} count={3} />;
      case 'maps':
        return <RepeatSkeleton component={MapCardSkeleton} count={3} />;
      case 'users':
        return <RepeatSkeleton component={UserListItemSkeleton} count={6} />;
      default:
        return <MixedFeedSkeleton />;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    switch (resultTab) {
      case 'latest':
        return (
          <LatestResults
            spots={spots}
            maps={maps}
            currentUserId={currentUser?.id}
            onSpotPress={onSpotPress}
            onMapPress={onMapPress}
            onSpotMapPress={onSpotMapPress}
            onUserPress={onUserPress}
            onSpotCommentPress={onSpotCommentPress}
            onMapCommentPress={onMapCommentPress}
            onTagPress={onTagPress}
            onEditSpot={handleEditSpot}
            onDeleteSpot={handleDeleteSpot}
            onReportSpot={handleReportSpot}
            onBlockFromSpot={handleBlockFromSpot}
            onEditMap={handleEditMap}
            onDeleteMap={handleDeleteMap}
            onReportMap={handleReportMap}
            onBlockFromMap={handleBlockFromMap}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            showAds={showAds}
            onEndReached={handleEndReachedLatest}
            isFetchingNextPage={spotsQuery.isFetchingNextPage || mapsQuery.isFetchingNextPage}
          />
        );
      case 'spots':
        return (
          <SpotResults
            spots={spots}
            currentUserId={currentUser?.id}
            onSpotPress={onSpotPress}
            onUserPress={onUserPress}
            onMapPress={onSpotMapPress}
            onCommentPress={onSpotCommentPress}
            onTagPress={onTagPress}
            onEdit={handleEditSpot}
            onDelete={handleDeleteSpot}
            onReport={handleReportSpot}
            onBlock={handleBlockFromSpot}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            showAds={showAds}
            onEndReached={handleEndReachedSpots}
            isFetchingNextPage={spotsQuery.isFetchingNextPage}
          />
        );
      case 'maps':
        return (
          <MapResults
            maps={maps}
            currentUserId={currentUser?.id}
            onMapPress={onMapPress}
            onUserPress={onUserPress}
            onCommentPress={onMapCommentPress}
            onTagPress={onTagPress}
            onEdit={handleEditMap}
            onDelete={handleDeleteMap}
            onReport={handleReportMap}
            onBlock={handleBlockFromMap}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            showAds={showAds}
            onEndReached={handleEndReachedMaps}
            isFetchingNextPage={mapsQuery.isFetchingNextPage}
          />
        );
      case 'users':
        return (
          <UserResults
            users={users}
            onUserPress={onUserPress}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            showAds={showAds}
            onEndReached={handleEndReachedUsers}
            isFetchingNextPage={usersQueryResult.isFetchingNextPage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {/* タブ */}
      <View className="bg-surface">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {searchResultTabs.map((tab) => {
            const isActive = resultTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setResultTab(tab.key)}
                className="px-4 py-3"
                style={{
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: isActive ? colors.light.primary : 'transparent',
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-on-surface'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View className="border-b-hairline border-outline-variant" />
      </View>

      {/* 検索結果 */}
      <View className="flex-1 bg-surface">{renderContent()}</View>
    </View>
  );
}
