/**
 * 記事著者セクション
 *
 * 著者情報とフォローボタンを表示
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UserAvatar } from '@/shared/ui';
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
  const avatarSizePx = size === 'small' ? 32 : 40;
  const iconSize = size === 'small' ? 16 : 20;
  const marginRight = size === 'small' ? 'mr-2' : 'mr-3';
  const textSize = size === 'small' ? 'text-sm' : 'text-base font-semibold';

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        onPress={() => onUserPress(userId)}
        className="flex-row items-center"
      >
        <UserAvatar
          url={user?.avatar_url}
          crop={user?.avatar_crop}
          alt={user?.display_name || user?.username || 'User'}
          className={`${avatarSize} ${marginRight}`}
          size={avatarSizePx}
          iconSize={iconSize}
        />
        <View>
          <Text className={`${textSize} text-on-surface`}>
            {user?.display_name || user?.username || 'ユーザー'}
          </Text>
          {createdAt && (
            <Text className="text-xs text-on-surface-variant">
              {createdAt}
            </Text>
          )}
        </View>
      </Pressable>

      <FollowButton targetUserId={userId} />
    </View>
  );
}
