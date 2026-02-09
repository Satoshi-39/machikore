/**
 * スポットタブの検索結果
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
import type { UserSpotSearchResult } from '@/shared/api/supabase';

interface SpotResultsProps {
  spots: UserSpotSearchResult[] | undefined;
  currentUserId: string | undefined;
  onSpotPress: (spotId: string) => void;
  onUserPress: (userId: string) => void;
  /** マップアイコンタップ時（マップ内スポットへの遷移用） */
  onMapPress: (spotId: string, mapId: string) => void;
  onCommentPress: (spotId: string) => void;
  onTagPress: (tagName: string) => void;
  onEdit: (spotId: string) => void;
  onDelete: (spotId: string) => void;
  onReport: (spotId: string) => void;
  onBlock?: (userId: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  showAds?: boolean;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

export function SpotResults({
  spots,
  currentUserId,
  onSpotPress,
  onUserPress,
  onMapPress,
  onCommentPress,
  onTagPress,
  onEdit,
  onReport,
  onBlock,
  onRefresh,
  refreshing,
  showAds = true,
  onEndReached,
  isFetchingNextPage,
}: SpotResultsProps) {
  const { t } = useI18n();

  if (!spots?.length) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="location-outline" size={iconSizeNum['4xl']} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('discover.noSpotsFound')}
        </Text>
      </View>
    );
  }

  const feedItems = insertAdsIntoList(spots, AD_CONFIG.SEARCH_AD_INTERVAL, showAds);

  return (
    <FlashList
      data={feedItems}
      keyExtractor={(feedItem) => (feedItem.type === 'ad' ? feedItem.id : feedItem.data.id)}
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
        return (
          <SpotCard
            spot={feedItem.data}
            currentUserId={currentUserId}
            onPress={() => onSpotPress(feedItem.data.id)}
            onUserPress={onUserPress}
            onMapPress={onMapPress}
            onEdit={onEdit}
            onReport={onReport}
            onBlock={onBlock}
            onCommentPress={onCommentPress}
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
