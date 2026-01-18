/**
 * フォローボタンコンポーネント
 *
 * 他のユーザーをフォロー/フォロー解除するためのボタン
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentUserId } from '@/entities/user';
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@/entities/follow';

interface FollowButtonProps {
  targetUserId: string | null;
  /** 初期フォロー状態（JOINで取得済みの場合に渡す、N+1問題回避用） */
  initialIsFollowing?: boolean;
}

export function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();

  // initialIsFollowingが渡されている場合はuseIsFollowingをスキップ
  const { data: fetchedIsFollowing, isLoading: isFollowingLoading } = useIsFollowing(
    initialIsFollowing !== undefined ? null : currentUserId,
    initialIsFollowing !== undefined ? null : targetUserId
  );
  const isFollowing = initialIsFollowing ?? fetchedIsFollowing;

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

  // initialIsFollowingが渡されていない場合のみローディング表示
  if (initialIsFollowing === undefined && isFollowingLoading) {
    return (
      <TouchableOpacity
        disabled
        className="px-6 py-2 rounded-full"
        style={{
          backgroundColor: colors.gray[200],
          minWidth: 100,
        }}
      >
        <ActivityIndicator size="small" color={colors.gray[400]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isActionPending}
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
          {isFollowing ? t('profile.following') : t('profile.follow')}
        </Text>
      )}
    </TouchableOpacity>
  );
}
