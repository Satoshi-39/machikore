/**
 * 最新タブの検索結果
 *
 * スポットとマップを混合して新着順で表示
 */

import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, AD_CONFIG } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { NativeAdCard } from '@/shared/ui';
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
}

export function LatestResults({
  spots,
  maps,
  currentUserId,
  onSpotPress,
  onMapPress,
  onUserPress,
  onSpotCommentPress,
  onMapCommentPress,
  onTagPress,
  onEditSpot,
  onDeleteSpot,
  onReportSpot,
  onEditMap,
  onDeleteMap,
  onReportMap,
  onRefresh,
  refreshing,
}: LatestResultsProps) {
  const { t } = useI18n();

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

  const feedItems = insertAdsIntoList(sortedItems, AD_CONFIG.SEARCH_AD_INTERVAL);

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
          tintColor={colors.primary.DEFAULT}
          colors={[colors.primary.DEFAULT]}
        />
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
              currentUserId={currentUserId}
              onPress={() => onSpotPress(item.item.id)}
              onUserPress={onUserPress}
              onMapPress={onMapPress}
              onEdit={onEditSpot}
              onDelete={onDeleteSpot}
              onReport={onReportSpot}
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
            onDelete={onDeleteMap}
            onReport={onReportMap}
            onCommentPress={onMapCommentPress}
            onTagPress={onTagPress}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
