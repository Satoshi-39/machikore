/**
 * 記事フッターアクション
 *
 * いいね・コメント・保存・共有のアクションボタン（note風の左寄せレイアウト）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { ShareButton } from '@/shared/ui';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';

interface ArticleFooterActionsProps {
  mapId: string;
  /** マップ所有者のusername（共有URL用） */
  mapOwnerUsername?: string;
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
  mapOwnerUsername,
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
        size={iconSizeNum.lg}
        showCount={true}
        hideCountWhenZero={true}
        onCountPress={onLikersPress}
        inactiveColor={colors.light["on-surface-variant"]}
        isLiked={isLiked}
        textClassName="text-sm text-on-surface-variant"
        textMarginClassName="ml-1"
      />

      {/* コメント */}
      <Pressable
        onPress={onCommentPress}
        className="flex-row items-center"
      >
        <Ionicons name="chatbubble-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
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
        size={iconSizeNum.lg}
        isBookmarked={isBookmarked}
      />

      {/* 共有 */}
      <ShareButton
        type="map"
        username={mapOwnerUsername || ''}
        id={mapId}
        variant="icon-only"
        iconSize={iconSizeNum.lg}
        iconColor={colors.light["on-surface-variant"]}
      />
    </View>
  );
}
