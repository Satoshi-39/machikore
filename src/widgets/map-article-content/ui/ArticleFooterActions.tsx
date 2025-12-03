/**
 * 記事フッターアクション
 *
 * いいね・コメント・保存・共有のアクションボタン（note風の左寄せレイアウト）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface ArticleFooterActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  isTogglingLike?: boolean;
  onLikePress: () => void;
  onCommentPress: () => void;
  onBookmarkPress: () => void;
  onSharePress: () => void;
}

export function ArticleFooterActions({
  isLiked,
  isBookmarked,
  likesCount,
  commentsCount,
  isTogglingLike = false,
  onLikePress,
  onCommentPress,
  onBookmarkPress,
  onSharePress,
}: ArticleFooterActionsProps) {
  return (
    <View className="flex-row items-center gap-5">
      {/* いいね */}
      <Pressable
        onPress={onLikePress}
        disabled={isTogglingLike}
        className="flex-row items-center"
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={isLiked ? '#EF4444' : colors.gray[400]}
        />
        {likesCount > 0 && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {likesCount}
          </Text>
        )}
      </Pressable>

      {/* コメント */}
      <Pressable
        onPress={onCommentPress}
        className="flex-row items-center"
      >
        <Ionicons name="chatbubble-outline" size={24} color={colors.gray[400]} />
        {commentsCount > 0 && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {commentsCount}
          </Text>
        )}
      </Pressable>

      {/* 保存 */}
      <Pressable
        onPress={onBookmarkPress}
        className="flex-row items-center"
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={isBookmarked ? colors.primary.DEFAULT : colors.gray[400]}
        />
      </Pressable>

      {/* 共有 */}
      <Pressable
        onPress={onSharePress}
        className="flex-row items-center"
      >
        <Ionicons
          name="share-outline"
          size={24}
          color={colors.gray[400]}
        />
      </Pressable>
    </View>
  );
}
