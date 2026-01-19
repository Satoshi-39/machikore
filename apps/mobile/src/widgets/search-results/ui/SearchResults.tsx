/**
 * 検索結果Widget
 *
 * FSDの原則：Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * - タブ切り替え（最新/話題/スポット/マップ/ユーザー）
 * - 検索結果リスト表示
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, AD_CONFIG } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { NativeAdCard } from '@/shared/ui';
import { useSpotSearch, useSpotTagSearch, SpotCard } from '@/entities/user-spot';
import { useMapSearch, useMapTagSearch, MapCard } from '@/entities/map';
import { useUserSearch, UserListItem, useUserStore } from '@/entities/user';
import { useSpotActions } from '@/features/spot-actions';
import { useMapActions } from '@/features/map-actions';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

type SearchResultTab = 'latest' | 'trending' | 'spots' | 'maps' | 'users';

interface SearchResultsProps {
  query: string;
  onSpotPress: (spotId: string) => void;
  onMapPress: (mapId: string) => void;
  onUserPress: (userId: string) => void;
  onSpotCommentPress: (spotId: string) => void;
  onMapCommentPress: (mapId: string) => void;
  onTagPress: (tagName: string) => void;
}

export function SearchResults({
  query,
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

  // タグ検索かどうかを判定（#で始まる場合）
  const isTagSearch = query.startsWith('#');
  const tagName = isTagSearch ? query.slice(1) : '';
  const keywordQuery = isTagSearch ? '' : query;

  // キーワードでスポット検索
  const { data: keywordSpots, isLoading: keywordSpotsLoading } = useSpotSearch(
    keywordQuery && (resultTab === 'spots' || resultTab === 'latest' || resultTab === 'trending')
      ? keywordQuery
      : ''
  );

  // タグでスポット検索
  const { data: tagSpots, isLoading: tagSpotsLoading } = useSpotTagSearch(
    isTagSearch && (resultTab === 'spots' || resultTab === 'latest' || resultTab === 'trending')
      ? tagName
      : ''
  );

  // タグ検索かキーワード検索かでスポット結果を切り替え
  const spots = isTagSearch ? tagSpots : keywordSpots;
  const spotsLoading = isTagSearch ? tagSpotsLoading : keywordSpotsLoading;

  // キーワード検索
  const { data: keywordMaps, isLoading: keywordMapsLoading } = useMapSearch(
    keywordQuery && (resultTab === 'maps' || resultTab === 'latest' || resultTab === 'trending')
      ? keywordQuery
      : ''
  );

  // タグ検索
  const { data: tagMaps, isLoading: tagMapsLoading } = useMapTagSearch(
    isTagSearch && (resultTab === 'maps' || resultTab === 'latest' || resultTab === 'trending')
      ? tagName
      : ''
  );

  // タグ検索かキーワード検索かで結果を切り替え
  const maps = isTagSearch ? tagMaps : keywordMaps;
  const mapsLoading = isTagSearch ? tagMapsLoading : keywordMapsLoading;

  const { data: users, isLoading: usersSearchLoading } = useUserSearch(
    keywordQuery && resultTab === 'users' ? keywordQuery : ''
  );

  const isLoading =
    (resultTab === 'spots' && spotsLoading) ||
    (resultTab === 'maps' && mapsLoading) ||
    (resultTab === 'users' && usersSearchLoading) ||
    ((resultTab === 'latest' || resultTab === 'trending') && (spotsLoading || mapsLoading));

  const searchResultTabs = useMemo(
    () => [
      { key: 'latest' as SearchResultTab, label: t('discover.latest') },
      { key: 'trending' as SearchResultTab, label: t('discover.trending') },
      { key: 'spots' as SearchResultTab, label: t('discover.spots') },
      { key: 'maps' as SearchResultTab, label: t('discover.maps') },
      { key: 'users' as SearchResultTab, label: t('discover.users') },
    ],
    [t]
  );

  // 最新タブ: スポットとマップを混合して新着順
  const renderLatestResults = useCallback(() => {
    const sortedItems: Array<{ type: 'spot' | 'map'; item: UserSpotSearchResult | MapWithUser; createdAt: string }> = [
      ...(spots?.map((s) => ({ type: 'spot' as const, item: s, createdAt: s.created_at })) || []),
      ...(maps?.map((m) => ({ type: 'map' as const, item: m, createdAt: m.created_at })) || []),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (sortedItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="search-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {t('discover.noSearchResults')}
          </Text>
        </View>
      );
    }

    // 広告を挿入
    const feedItems = insertAdsIntoList(sortedItems, AD_CONFIG.SEARCH_AD_INTERVAL);

    return (
      <FlashList
        data={feedItems}
        keyExtractor={(feedItem) =>
          feedItem.type === 'ad' ? feedItem.id : `${feedItem.data.type}-${feedItem.data.item.id}`
        }
        renderItem={({ item: feedItem }) => {
          if (feedItem.type === 'ad') {
            return <NativeAdCard />;
          }
          const item = feedItem.data;
          if (item.type === 'spot') {
            return (
              <SpotCard
                spot={item.item as UserSpotSearchResult}
                currentUserId={currentUser?.id}
                onPress={() => onSpotPress(item.item.id)}
                onUserPress={onUserPress}
                onMapPress={onMapPress}
                onEdit={handleEditSpot}
                onDelete={handleDeleteSpot}
                onReport={handleReportSpot}
                onCommentPress={onSpotCommentPress}
                onTagPress={onTagPress}
              />
            );
          }
          return (
            <MapCard
              map={item.item as MapWithUser}
              currentUserId={currentUser?.id}
              onPress={() => onMapPress(item.item.id)}
              onUserPress={onUserPress}
              onEdit={handleEditMap}
              onDelete={handleDeleteMap}
              onReport={handleReportMap}
              onCommentPress={onMapCommentPress}
              onTagPress={onTagPress}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [spots, maps, currentUser?.id, onSpotPress, onMapPress, onUserPress, onSpotCommentPress, onMapCommentPress, onTagPress, t, handleEditSpot, handleDeleteSpot, handleReportSpot, handleEditMap, handleDeleteMap, handleReportMap]);

  // 話題タブ: いいね数でソート
  const renderTrendingResults = useCallback(() => {
    const sortedItems: Array<{ type: 'spot' | 'map'; item: UserSpotSearchResult | MapWithUser; likesCount: number }> = [
      ...(spots?.map((s) => ({ type: 'spot' as const, item: s, likesCount: s.likes_count || 0 })) || []),
      ...(maps?.map((m) => ({ type: 'map' as const, item: m, likesCount: m.likes_count || 0 })) || []),
    ].sort((a, b) => b.likesCount - a.likesCount);

    if (sortedItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="trending-up-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {t('discover.noTrendingPosts')}
          </Text>
        </View>
      );
    }

    // 広告を挿入
    const feedItems = insertAdsIntoList(sortedItems, AD_CONFIG.SEARCH_AD_INTERVAL);

    return (
      <FlashList
        data={feedItems}
        keyExtractor={(feedItem) =>
          feedItem.type === 'ad' ? feedItem.id : `${feedItem.data.type}-${feedItem.data.item.id}`
        }
        renderItem={({ item: feedItem }) => {
          if (feedItem.type === 'ad') {
            return <NativeAdCard />;
          }
          const item = feedItem.data;
          if (item.type === 'spot') {
            return (
              <SpotCard
                spot={item.item as UserSpotSearchResult}
                currentUserId={currentUser?.id}
                onPress={() => onSpotPress(item.item.id)}
                onUserPress={onUserPress}
                onMapPress={onMapPress}
                onEdit={handleEditSpot}
                onDelete={handleDeleteSpot}
                onReport={handleReportSpot}
                onCommentPress={onSpotCommentPress}
                onTagPress={onTagPress}
              />
            );
          }
          return (
            <MapCard
              map={item.item as MapWithUser}
              currentUserId={currentUser?.id}
              onPress={() => onMapPress(item.item.id)}
              onUserPress={onUserPress}
              onEdit={handleEditMap}
              onDelete={handleDeleteMap}
              onReport={handleReportMap}
              onCommentPress={onMapCommentPress}
              onTagPress={onTagPress}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [spots, maps, currentUser?.id, onSpotPress, onMapPress, onUserPress, onSpotCommentPress, onMapCommentPress, onTagPress, t, handleEditSpot, handleDeleteSpot, handleReportSpot, handleEditMap, handleDeleteMap, handleReportMap]);

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      );
    }

    if (resultTab === 'latest') {
      return renderLatestResults();
    }

    if (resultTab === 'trending') {
      return renderTrendingResults();
    }

    if (resultTab === 'spots') {
      if (!spots?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="location-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noSpotsFound')}
            </Text>
          </View>
        );
      }
      // 広告を挿入
      const feedItems = insertAdsIntoList(spots, AD_CONFIG.SEARCH_AD_INTERVAL);
      return (
        <FlashList
          data={feedItems}
          keyExtractor={(feedItem) => (feedItem.type === 'ad' ? feedItem.id : feedItem.data.id)}
          renderItem={({ item: feedItem }) => {
            if (feedItem.type === 'ad') {
              return <NativeAdCard />;
            }
            return (
              <SpotCard
                spot={feedItem.data}
                currentUserId={currentUser?.id}
                onPress={() => onSpotPress(feedItem.data.id)}
                onUserPress={onUserPress}
                onMapPress={onMapPress}
                onEdit={handleEditSpot}
                onDelete={handleDeleteSpot}
                onReport={handleReportSpot}
                onCommentPress={onSpotCommentPress}
                onTagPress={onTagPress}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (resultTab === 'maps') {
      if (!maps?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="map-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noMapsFound')}
            </Text>
          </View>
        );
      }
      // 広告を挿入
      const feedItems = insertAdsIntoList(maps, AD_CONFIG.SEARCH_AD_INTERVAL);
      return (
        <FlashList
          data={feedItems}
          keyExtractor={(feedItem) => (feedItem.type === 'ad' ? feedItem.id : feedItem.data.id)}
          renderItem={({ item: feedItem }) => {
            if (feedItem.type === 'ad') {
              return <NativeAdCard />;
            }
            return (
              <MapCard
                map={feedItem.data}
                currentUserId={currentUser?.id}
                onPress={() => onMapPress(feedItem.data.id)}
                onUserPress={onUserPress}
                onEdit={handleEditMap}
                onDelete={handleDeleteMap}
                onReport={handleReportMap}
                onCommentPress={onMapCommentPress}
                onTagPress={onTagPress}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (resultTab === 'users') {
      if (!users?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="people-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noUsersFound')}
            </Text>
          </View>
        );
      }
      // 広告を挿入
      const feedItems = insertAdsIntoList(users, AD_CONFIG.SEARCH_AD_INTERVAL);
      return (
        <FlashList
          data={feedItems}
          keyExtractor={(feedItem) => (feedItem.type === 'ad' ? feedItem.id : feedItem.data.id)}
          renderItem={({ item: feedItem }) => {
            if (feedItem.type === 'ad') {
              return <NativeAdCard />;
            }
            return (
              <UserListItem user={feedItem.data} onPress={() => onUserPress(feedItem.data.id)} />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return null;
  };

  return (
    <View className="flex-1">
      {/* タブ（X風の下線スタイル） */}
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
      <View className="flex-1 bg-surface dark:bg-dark-surface">{renderSearchResults()}</View>
    </View>
  );
}
