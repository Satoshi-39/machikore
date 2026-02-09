/**
 * 最新タブの検索結果
 *
 * スポットとマップを混合して新着順で表示
 */

import React from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, AD_CONFIG, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { MapNativeAdCard } from '@/shared/ui';
import { SpotCard } from '@/entities/user-spot';
import { MapCard } from '@/entities/map';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import type { SearchResultHandlers } from './types';

interface LatestResultsProps extends SearchResultHandlers {
  spots: UserSpotSearchResult[] | undefined;
  maps: MapWithUser[] | undefined;
  currentUserId: string | undefined;
  onRefresh: () => void;
  refreshing: boolean;
  showAds?: boolean;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

export function LatestResults({
  spots,
  maps,
  currentUserId,
  onSpotPress,
  onMapPress,
  onSpotMapPress,
  onUserPress,
  onSpotCommentPress,
  onMapCommentPress,
  onTagPress,
  onEditSpot,
  onReportSpot,
  onBlockFromSpot,
  onEditMap,
  onReportMap,
  onBlockFromMap,
  onRefresh,
  refreshing,
  showAds = true,
  onEndReached,
  isFetchingNextPage,
}: LatestResultsProps) {
  const { t } = useI18n();

  const sortedItems: Array<{ type: 'spot' | 'map'; item: UserSpotSearchResult | MapWithUser; createdAt: string }> = [
    ...(spots?.map((s) => ({ type: 'spot' as const, item: s, createdAt: s.created_at })) || []),
    ...(maps?.map((m) => ({ type: 'map' as const, item: m, createdAt: m.created_at })) || []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sortedItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="search-outline" size={iconSizeNum['4xl']} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('discover.noSearchResults')}
        </Text>
      </View>
    );
  }

  const feedItems = insertAdsIntoList(sortedItems, AD_CONFIG.SEARCH_AD_INTERVAL, showAds);

  return (
    <FlashList
      data={feedItems}
      keyExtractor={(feedItem) =>
        feedItem.type === 'ad' ? feedItem.id : `${feedItem.data.type}-${feedItem.data.item.id}`
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.light.primary}
          colors={[colors.light.primary]}
        />
      }
      renderItem={({ item: feedItem }) => {
        if (feedItem.type === 'ad') {
          return <MapNativeAdCard />;
        }
        const item = feedItem.data;
        if (item.type === 'spot') {
          return (
            <SpotCard
              spot={item.item as UserSpotSearchResult}
              currentUserId={currentUserId}
              onPress={() => onSpotPress(item.item.id)}
              onUserPress={onUserPress}
              onMapPress={onSpotMapPress}
              onEdit={onEditSpot}
              onReport={onReportSpot}
              onBlock={onBlockFromSpot}
              onCommentPress={onSpotCommentPress}
              onTagPress={onTagPress}
            />
          );
        }
        return (
          <MapCard
            map={item.item as MapWithUser}
            currentUserId={currentUserId}
            onPress={() => onMapPress(item.item.id)}
            onUserPress={onUserPress}
            onEdit={onEditMap}
            onReport={onReportMap}
            onBlock={onBlockFromMap}
            onCommentPress={onMapCommentPress}
            onTagPress={onTagPress}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" className="text-primary" />
          </View>
        ) : null
      }
    />
  );
}
