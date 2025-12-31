/**
 * いいねしたマップ一覧Widget
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';

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
  onMapPress: (mapId: string) => void;
  onUserPress?: (userId: string) => void;
  onDeleteMapLike?: (mapId: string) => void;
}

export function LikeMapList({ data, isLoading, onMapPress, onUserPress, onDeleteMapLike }: LikeMapListProps) {
  const renderItem = useCallback(
    ({ item }: { item: LikedMap }) => {
      const user = item.map.user;

      const content = (
        <Pressable
          onPress={() => onMapPress(item.map.id)}
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
                <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color={colors.gray[500]} />
                </View>
              )}
            </Pressable>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                {item.map.name}
              </Text>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {item.map.spots_count}スポット
              </Text>
              {user && (
                <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5">
                  {user.display_name || user.username || 'ユーザー'}のマップ
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </View>
        </Pressable>
      );

      return onDeleteMapLike ? (
        <SwipeableRow onDelete={() => onDeleteMapLike(item.map.id)}>
          {content}
        </SwipeableRow>
      ) : content;
    },
    [onMapPress, onUserPress, onDeleteMapLike]
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
