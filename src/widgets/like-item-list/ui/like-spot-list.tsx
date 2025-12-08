/**
 * いいねしたスポット一覧Widget
 * ユーザースポットといいね（ユーザーアイコン）とマスタースポットいいね（青スポットアイコン）を統合表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_CATEGORY_COLORS } from '@/shared/config';
import { Loading, EmptyState, SwipeableRow, LocationPinIcon } from '@/shared/ui';
import { determineSpotCategory } from '@/entities/master-spot';
import type { SpotWithDetails } from '@/shared/types';

export interface LikedSpotItem {
  likeId: string;
  likedAt: string;
  spot: SpotWithDetails;
}

export interface LikedMasterSpotItem {
  likeId: string;
  likedAt: string;
  masterSpot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_place_id: string | null;
    google_short_address: string | null;
    google_types: string[] | null;
    google_rating: number | null;
    google_user_rating_count: number | null;
    likes_count: number;
  };
}

// 統合型：ユーザースポットまたはマスタースポット
type UnifiedLikeItem =
  | { type: 'userSpot'; likeId: string; likedAt: string; spot: SpotWithDetails }
  | { type: 'masterSpot'; likeId: string; likedAt: string; masterSpot: LikedMasterSpotItem['masterSpot'] };

interface LikeSpotListProps {
  data: LikedSpotItem[];
  masterSpotData?: LikedMasterSpotItem[];
  isLoading: boolean;
  onSpotPress: (spot: SpotWithDetails) => void;
  onMasterSpotPress?: (masterSpotId: string) => void;
  onUserPress?: (userId: string) => void;
  onDeleteSpotLike?: (spotId: string) => void;
  onDeleteMasterSpotLike?: (masterSpotId: string) => void;
}

export function LikeSpotList({
  data,
  masterSpotData = [],
  isLoading,
  onSpotPress,
  onMasterSpotPress,
  onUserPress,
  onDeleteSpotLike,
  onDeleteMasterSpotLike,
}: LikeSpotListProps) {
  // 両方のいいねを統合して日時順にソート
  const unifiedData = useMemo(() => {
    const userSpotItems: UnifiedLikeItem[] = data.map(item => ({
      type: 'userSpot' as const,
      likeId: item.likeId,
      likedAt: item.likedAt,
      spot: item.spot,
    }));

    const masterSpotItems: UnifiedLikeItem[] = masterSpotData.map(item => ({
      type: 'masterSpot' as const,
      likeId: item.likeId,
      likedAt: item.likedAt,
      masterSpot: item.masterSpot,
    }));

    // 日時で降順ソート
    return [...userSpotItems, ...masterSpotItems].sort(
      (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
    );
  }, [data, masterSpotData]);

  const renderItem = useCallback(
    ({ item }: { item: UnifiedLikeItem }) => {
      if (item.type === 'userSpot') {
        // ユーザースポット：ユーザーのアバターを表示
        const spotName = item.spot.custom_name || item.spot.master_spot?.name || '不明なスポット';
        const address = item.spot.master_spot?.google_short_address || item.spot.google_short_address;
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
                  {spotName}
                </Text>
                {address && (
                  <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
                    {address}
                  </Text>
                )}
                {user && (
                  <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5">
                    {user.display_name || user.username || 'ユーザー'}の投稿
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
      } else {
        // マスタースポット：カテゴリ色のスポットアイコンを表示
        const { masterSpot } = item;
        const category = determineSpotCategory(masterSpot.google_types);
        const categoryColor = SPOT_CATEGORY_COLORS[category];

        const content = (
          <Pressable
            onPress={() => onMasterSpotPress?.(masterSpot.id)}
            className="bg-surface dark:bg-dark-surface px-4 py-4 border-b border-border-light dark:border-dark-border-light"
          >
            <View className="flex-row items-center">
              {/* カテゴリ色のスポットアイコン */}
              <View className="w-10 h-10 rounded-full bg-surface-secondary dark:bg-gray-200 items-center justify-center mr-3">
                <LocationPinIcon size={20} color={categoryColor} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  {masterSpot.name}
                </Text>
                {masterSpot.google_short_address && (
                  <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
                    {masterSpot.google_short_address}
                  </Text>
                )}
                <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5">
                  スポット
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </View>
          </Pressable>
        );

        return onDeleteMasterSpotLike ? (
          <SwipeableRow onDelete={() => onDeleteMasterSpotLike(masterSpot.id)}>
            {content}
          </SwipeableRow>
        ) : content;
      }
    },
    [onSpotPress, onMasterSpotPress, onUserPress, onDeleteSpotLike, onDeleteMasterSpotLike]
  );

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (unifiedData.length === 0) {
    return (
      <EmptyState
        ionIcon="heart-outline"
        message="いいねしたスポットがありません"
      />
    );
  }

  return (
    <FlatList
      data={unifiedData}
      keyExtractor={(item) => `${item.type}-${item.likeId}`}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-surface dark:bg-dark-surface"
    />
  );
}
