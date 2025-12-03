/**
 * フォローボタンコンポーネント
 *
 * 他のユーザーをフォロー/フォロー解除するためのボタン
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@/entities/follow';

interface FollowButtonProps {
  targetUserId: string | null;
}

export function FollowButton({ targetUserId }: FollowButtonProps) {
  const currentUserId = useCurrentUserId();

  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(
    currentUserId,
    targetUserId
  );
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();

  // 自分自身、または未ログインの場合は表示しない
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    return null;
  }

  const isActionPending = isFollowPending || isUnfollowPending;

  const handlePress = () => {
    if (isFollowing) {
      unfollowUser({ followerId: currentUserId, followeeId: targetUserId });
    } else {
      followUser({ followerId: currentUserId, followeeId: targetUserId });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isActionPending || isFollowingLoading}
      className="px-6 py-2 rounded-full"
      style={{
        backgroundColor: isFollowing ? colors.gray[200] : colors.primary.DEFAULT,
        borderWidth: isFollowing ? 1 : 0,
        borderColor: isFollowing ? colors.gray[300] : undefined,
      }}
    >
      {isActionPending ? (
        <ActivityIndicator
          size="small"
          color={isFollowing ? colors.gray[600] : '#fff'}
        />
      ) : (
        <Text
          className={`font-semibold ${
            isFollowing ? 'text-foreground-secondary dark:text-dark-foreground-secondary' : 'text-white'
          }`}
        >
          {isFollowing ? 'フォロー中' : 'フォローする'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
