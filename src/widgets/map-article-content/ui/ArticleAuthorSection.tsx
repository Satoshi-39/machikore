/**
 * 記事著者セクション
 *
 * 著者情報とフォローボタンを表示
 */

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { FollowButton } from '@/features/follow-user';
import type { UserBasicInfo } from '@/shared/types';

interface ArticleAuthorSectionProps {
  user: UserBasicInfo | null | undefined;
  userId: string;
  /** アバターサイズ: small(8), medium(10) */
  size?: 'small' | 'medium';
  /** 作成日時（相対時間） */
  createdAt?: string;
  onUserPress: (userId: string) => void;
}

export function ArticleAuthorSection({
  user,
  userId,
  size = 'medium',
  createdAt,
  onUserPress,
}: ArticleAuthorSectionProps) {
  const avatarSize = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'small' ? 16 : 20;
  const marginRight = size === 'small' ? 'mr-2' : 'mr-3';
  const textSize = size === 'small' ? 'text-sm' : 'text-base font-semibold';

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        onPress={() => onUserPress(userId)}
        className="flex-row items-center flex-1"
      >
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            className={`${avatarSize} rounded-full ${marginRight}`}
          />
        ) : (
          <View className={`${avatarSize} rounded-full bg-gray-200 items-center justify-center ${marginRight}`}>
            <Ionicons name="person" size={iconSize} color={colors.gray[500]} />
          </View>
        )}
        <Text className={`${textSize} text-foreground dark:text-dark-foreground`}>
          {user?.display_name || user?.username || 'ユーザー'}
        </Text>
        {createdAt && (
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted ml-2">
            · {createdAt}
          </Text>
        )}
      </Pressable>

      <FollowButton targetUserId={userId} />
    </View>
  );
}
