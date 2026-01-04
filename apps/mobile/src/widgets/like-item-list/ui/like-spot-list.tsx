/**
 * いいねしたスポット一覧Widget
 * ユーザースポットのいいね一覧を表示
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';
import type { SpotWithDetails } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

export interface LikedSpotItem {
  likeId: string;
  likedAt: string;
  spot: SpotWithDetails;
}

interface LikeSpotListProps {
  data: LikedSpotItem[];
  isLoading: boolean;
  onSpotPress: (spot: SpotWithDetails) => void;
  onUserPress?: (userId: string) => void;
  onDeleteSpotLike?: (spotId: string) => void;
}

export function LikeSpotList({
  data,
  isLoading,
  onSpotPress,
  onUserPress,
  onDeleteSpotLike,
}: LikeSpotListProps) {
  const { t, locale } = useI18n();

  const renderItem = useCallback(
    ({ item }: { item: LikedSpotItem }) => {
      // マスタースポット名（JSONB型を現在のlocaleで抽出）
      const masterSpotName = item.spot.master_spot?.name
        ? extractName(item.spot.master_spot.name, locale) || t('favorite.unknownSpot')
        : t('favorite.unknownSpot');
      const address = extractAddress(item.spot.master_spot?.google_short_address, locale)
        || extractAddress(item.spot.google_short_address, locale);
      const user = item.spot.user;

      const content = (
        <Pressable
          onPress={() => onSpotPress(item.spot)}
          className="bg-surface dark:bg-dark-surface px-4 py-4 border-b border-border-light dark:border-dark-border-light"
        >
          <View className="flex-row items-center">
            {/* ユーザーアバター（タップでプロフィールへ） */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                if (user?.id && onUserPress) {
                  onUserPress(user.id);
                }
              }}
              disabled={!user?.id || !onUserPress}
            >
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-foreground-secondary items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color={colors.gray[500]} />
                </View>
              )}
            </Pressable>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                {masterSpotName}
              </Text>
              {item.spot.description && (
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                  {item.spot.description}
                </Text>
              )}
              {address && (
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
                  {address}
                </Text>
              )}
              {user && (
                <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5">
                  {t('favorite.userPost', { name: user.display_name || user.username || t('comment.defaultUser') })}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </View>
        </Pressable>
      );

      return onDeleteSpotLike ? (
        <SwipeableRow onDelete={() => onDeleteSpotLike(item.spot.id)}>
          {content}
        </SwipeableRow>
      ) : content;
    },
    [onSpotPress, onUserPress, onDeleteSpotLike, t]
  );

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        ionIcon="heart-outline"
        message={t('favorite.noLikedSpots')}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.likeId}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-surface dark:bg-dark-surface"
    />
  );
}
