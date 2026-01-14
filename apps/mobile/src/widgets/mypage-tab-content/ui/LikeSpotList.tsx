/**
 * いいねしたスポット一覧Widget
 * ユーザースポットのいいね一覧を表示
 */

import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';
import { SpotListCard, type SpotListCardSpot } from '@/widgets/spot-cards';
import { useI18n } from '@/shared/lib/i18n';

export interface LikedSpotItem {
  likeId: string;
  likedAt: string;
  spot: SpotListCardSpot;
}

interface LikeSpotListProps {
  data: LikedSpotItem[];
  isLoading: boolean;
  currentUserId?: string | null;
  onSpotPress: (spotId: string) => void;
  onUserPress?: (userId: string) => void;
  onDeleteSpotLike?: (spotId: string) => void;
}

export function LikeSpotList({
  data,
  isLoading,
  currentUserId,
  onSpotPress,
  onUserPress,
  onDeleteSpotLike,
}: LikeSpotListProps) {
  const { t } = useI18n();

  const renderItem = useCallback(
    ({ item }: { item: LikedSpotItem }) => {
      const content = (
        <SpotListCard
          spot={item.spot}
          currentUserId={currentUserId}
          onPress={() => onSpotPress(item.spot.id)}
          onUserPress={onUserPress}
        />
      );

      return onDeleteSpotLike ? (
        <SwipeableRow onDelete={() => onDeleteSpotLike(item.spot.id)}>
          {content}
        </SwipeableRow>
      ) : content;
    },
    [currentUserId, onSpotPress, onUserPress, onDeleteSpotLike]
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
