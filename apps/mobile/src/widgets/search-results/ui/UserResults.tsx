/**
 * ユーザータブの検索結果
 */

import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, AD_CONFIG, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { MapNativeAdCard } from '@/shared/ui';
import { UserListItem } from '@/entities/user';
import type { UserSearchResult } from '@/shared/api/supabase';

interface UserResultsProps {
  users: UserSearchResult[] | undefined;
  onUserPress: (userId: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function UserResults({ users, onUserPress, onRefresh, refreshing }: UserResultsProps) {
  const { t } = useI18n();

  if (!users?.length) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="people-outline" size={iconSizeNum['4xl']} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('discover.noUsersFound')}
        </Text>
      </View>
    );
  }

  const feedItems = insertAdsIntoList(users, AD_CONFIG.SEARCH_AD_INTERVAL);

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
          <UserListItem user={feedItem.data} onPress={() => onUserPress(feedItem.data.id)} />
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
