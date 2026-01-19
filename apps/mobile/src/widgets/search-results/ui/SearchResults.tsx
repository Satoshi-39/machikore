/**
 * 検索結果Widget
 *
 * FSDの原則：Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * - タブ切り替え（最新/スポット/マップ/ユーザー）
 * - 検索結果リスト表示
 * - フィルター機能対応
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotSearch, useSpotTagSearch } from '@/entities/user-spot';
import { useMapSearch, useMapTagSearch } from '@/entities/map';
import { useUserSearch, useUserStore } from '@/entities/user';
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
  onUserPress,
  onSpotCommentPress,
  onMapCommentPress,
  onTagPress,
}: SearchResultsProps) {
  const { t } = useI18n();
  const [resultTab, setResultTab] = useState<SearchResultTab>('latest');
  const currentUser = useUserStore((state) => state.user);

  // スポット・マップ操作フック
  const {
    handleEdit: handleEditSpot,
    handleDelete: handleDeleteSpot,
    handleReport: handleReportSpot,
  } = useSpotActions({ currentUserId: currentUser?.id });

  const {
    handleEdit: handleEditMap,
    handleDelete: handleDeleteMap,
    handleReport: handleReportMap,
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
  const {
    data: keywordSpots,
    isLoading: keywordSpotsLoading,
    isRefetching: keywordSpotsRefetching,
    refetch: refetchKeywordSpots,
  } = useSpotSearch(
    (keywordQuery || hasFilters) && (resultTab === 'spots' || resultTab === 'latest')
      ? keywordQuery
      : '',
    spotFilters
  );

  // タグでスポット検索
  const {
    data: tagSpots,
    isLoading: tagSpotsLoading,
    isRefetching: tagSpotsRefetching,
    refetch: refetchTagSpots,
  } = useSpotTagSearch(
    isTagSearch && (resultTab === 'spots' || resultTab === 'latest')
      ? tagName
      : ''
  );

  const spots = isTagSearch ? tagSpots : keywordSpots;
  const spotsLoading = isTagSearch ? tagSpotsLoading : keywordSpotsLoading;
  const spotsRefetching = isTagSearch ? tagSpotsRefetching : keywordSpotsRefetching;
  const refetchSpots = isTagSearch ? refetchTagSpots : refetchKeywordSpots;

  // キーワードでマップ検索
  const {
    data: keywordMaps,
    isLoading: keywordMapsLoading,
    isRefetching: keywordMapsRefetching,
    refetch: refetchKeywordMaps,
  } = useMapSearch(
    (keywordQuery || hasFilters) && (resultTab === 'maps' || resultTab === 'latest')
      ? keywordQuery
      : '',
    mapFilters
  );

  // タグでマップ検索
  const {
    data: tagMaps,
    isLoading: tagMapsLoading,
    isRefetching: tagMapsRefetching,
    refetch: refetchTagMaps,
  } = useMapTagSearch(
    isTagSearch && (resultTab === 'maps' || resultTab === 'latest')
      ? tagName
      : ''
  );

  const maps = isTagSearch ? tagMaps : keywordMaps;
  const mapsLoading = isTagSearch ? tagMapsLoading : keywordMapsLoading;
  const mapsRefetching = isTagSearch ? tagMapsRefetching : keywordMapsRefetching;
  const refetchMaps = isTagSearch ? refetchTagMaps : refetchKeywordMaps;

  // ユーザー検索
  const {
    data: users,
    isLoading: usersLoading,
    isRefetching: usersRefetching,
    refetch: refetchUsers,
  } = useUserSearch(
    keywordQuery && resultTab === 'users' ? keywordQuery : ''
  );

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

  const searchResultTabs = useMemo(
    () => [
      { key: 'latest' as SearchResultTab, label: t('discover.latest') },
      { key: 'spots' as SearchResultTab, label: t('discover.spots') },
      { key: 'maps' as SearchResultTab, label: t('discover.maps') },
      { key: 'users' as SearchResultTab, label: t('discover.users') },
    ],
    [t]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      );
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
            onUserPress={onUserPress}
            onSpotCommentPress={onSpotCommentPress}
            onMapCommentPress={onMapCommentPress}
            onTagPress={onTagPress}
            onEditSpot={handleEditSpot}
            onDeleteSpot={handleDeleteSpot}
            onReportSpot={handleReportSpot}
            onEditMap={handleEditMap}
            onDeleteMap={handleDeleteMap}
            onReportMap={handleReportMap}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
          />
        );
      case 'spots':
        return (
          <SpotResults
            spots={spots}
            currentUserId={currentUser?.id}
            onSpotPress={onSpotPress}
            onUserPress={onUserPress}
            onMapPress={onMapPress}
            onCommentPress={onSpotCommentPress}
            onTagPress={onTagPress}
            onEdit={handleEditSpot}
            onDelete={handleDeleteSpot}
            onReport={handleReportSpot}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
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
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
          />
        );
      case 'users':
        return (
          <UserResults
            users={users}
            onUserPress={onUserPress}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {/* タブ */}
      <View className="bg-surface dark:bg-dark-surface">
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
                  borderBottomColor: isActive ? colors.primary.DEFAULT : 'transparent',
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-foreground dark:text-dark-foreground'
                      : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View className="h-px bg-border-light dark:bg-dark-border-light" />
      </View>

      {/* 検索結果 */}
      <View className="flex-1 bg-surface dark:bg-dark-surface">{renderContent()}</View>
    </View>
  );
}
