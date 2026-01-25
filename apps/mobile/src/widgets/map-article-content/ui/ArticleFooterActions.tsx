/**
 * 記事フッターアクション
 *
 * いいね・コメント・保存・共有のアクションボタン（note風の左寄せレイアウト）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { ShareButton } from '@/shared/ui';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';

interface ArticleFooterActionsProps {
  mapId: string;
  currentUserId?: string | null;
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  onLikersPress?: () => void;
  onCommentPress: () => void;
}

export function ArticleFooterActions({
  mapId,
  currentUserId,
  isLiked,
  isBookmarked,
  likesCount,
  commentsCount,
  onLikersPress,
  onCommentPress,
}: ArticleFooterActionsProps) {
  return (
    <View className="flex-row items-center gap-5">
      {/* いいね */}
      <MapLikeButton
        mapId={mapId}
        currentUserId={currentUserId}
        likesCount={likesCount}
        size={24}
        showCount={true}
        hideCountWhenZero={true}
        onCountPress={onLikersPress}
        inactiveColor={colors.text.secondary}
        isLiked={isLiked}
        textClassName="text-sm text-on-surface-variant"
        textMarginClassName="ml-1"
      />

      {/* コメント */}
      <Pressable
        onPress={onCommentPress}
        className="flex-row items-center"
      >
        <Ionicons name="chatbubble-outline" size={24} color={colors.text.secondary} />
        {commentsCount > 0 && (
          <Text className="text-sm text-on-surface-variant ml-1">
            {commentsCount}
          </Text>
        )}
      </Pressable>

      {/* 保存 */}
      <MapBookmarkButton
        mapId={mapId}
        currentUserId={currentUserId}
        size={24}
        isBookmarked={isBookmarked}
      />

      {/* 共有 */}
      <ShareButton
        type="map"
        id={mapId}
        variant="icon-only"
        iconSize={24}
        iconColor={colors.text.secondary}
      />
    </View>
  );
}
