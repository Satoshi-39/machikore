/**
 * マップタブの検索結果
 */

import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, AD_CONFIG } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { MapNativeAdCard } from '@/shared/ui';
import { MapCard } from '@/entities/map';
import type { MapWithUser } from '@/shared/types';

interface MapResultsProps {
  maps: MapWithUser[] | undefined;
  currentUserId: string | undefined;
  onMapPress: (mapId: string) => void;
  onUserPress: (userId: string) => void;
  onCommentPress: (mapId: string) => void;
  onTagPress: (tagName: string) => void;
  onEdit: (mapId: string) => void;
  onDelete: (mapId: string) => void;
  onReport: (mapId: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function MapResults({
  maps,
  currentUserId,
  onMapPress,
  onUserPress,
  onCommentPress,
  onTagPress,
  onEdit,
  onDelete,
  onReport,
  onRefresh,
  refreshing,
}: MapResultsProps) {
  const { t } = useI18n();

  if (!maps?.length) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="map-outline" size={48} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('discover.noMapsFound')}
        </Text>
      </View>
    );
  }

  const feedItems = insertAdsIntoList(maps, AD_CONFIG.SEARCH_AD_INTERVAL);

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
          <MapCard
            map={feedItem.data}
            currentUserId={currentUserId}
            onPress={() => onMapPress(feedItem.data.id)}
            onUserPress={onUserPress}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
            onCommentPress={onCommentPress}
            onTagPress={onTagPress}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
