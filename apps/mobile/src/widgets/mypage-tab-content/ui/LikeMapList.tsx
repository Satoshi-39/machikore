/**
 * いいねしたマップ一覧Widget
 */

import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import type { MapWithUser } from '@/shared/types';

interface LikedMap {
  likeId: string;
  likedAt: string;
  map: {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    likes_count: number;
    spots_count: number;
    user: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

interface LikeMapListProps {
  data: LikedMap[];
  isLoading: boolean;
  currentUserId?: string | null;
  onMapPress: (mapId: string) => void;
  onUserPress?: (userId: string) => void;
  onArticlePress?: (mapId: string) => void;
  onDeleteMapLike?: (mapId: string) => void;
}

export function LikeMapList({ data, isLoading, currentUserId, onMapPress, onUserPress, onArticlePress, onDeleteMapLike }: LikeMapListProps) {
  const renderItem = useCallback(
    ({ item }: { item: LikedMap }) => {
      const content = (
        <MapListCard
          map={item.map as MapWithUser}
          currentUserId={currentUserId}
          isOwner={item.map.user?.id === currentUserId}
          onPress={() => onMapPress(item.map.id)}
          onUserPress={onUserPress}
          onArticlePress={onArticlePress}
        />
      );

      return onDeleteMapLike ? (
        <SwipeableRow onDelete={() => onDeleteMapLike(item.map.id)}>
          {content}
        </SwipeableRow>
      ) : content;
    },
    [currentUserId, onMapPress, onUserPress, onArticlePress, onDeleteMapLike]
  );

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        ionIcon="heart-outline"
        message="いいねしたマップがありません"
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
