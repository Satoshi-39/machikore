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

  // initialIsFollowingを初期値として渡し、常にuseIsFollowingを有効化
  // これにより楽観的更新でキャッシュが変更された時もUIが反映される
  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(
    currentUserId,
    targetUserId,
    initialIsFollowing
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

  // 初期値がなく、ローディング中の場合のみローディング表示
  if (isFollowing === undefined && isFollowingLoading) {
    return (
      <TouchableOpacity
        disabled
        className="px-6 py-2 rounded-full"
        style={{
          backgroundColor: colors.primitive.gray[200],
          minWidth: 100,
        }}
      >
        <ActivityIndicator size="small" className="text-gray-400" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isActionPending}
      className="px-6 py-2 rounded-full"
      style={{
        backgroundColor: isFollowing ? colors.primitive.gray[200] : colors.light.primary,
        borderWidth: isFollowing ? 1 : 0,
        borderColor: isFollowing ? colors.primitive.gray[300] : undefined,
      }}
    >
      {isActionPending ? (
        <ActivityIndicator
          size="small"
          color={isFollowing ? colors.primitive.gray[600] : '#fff'}
        />
      ) : (
        <Text
          className={`font-semibold ${
            isFollowing ? 'text-on-surface-variant' : 'text-white'
          }`}
        >
          {isFollowing ? t('profile.following') : t('profile.follow')}
        </Text>
      )}
    </TouchableOpacity>
  );
}
