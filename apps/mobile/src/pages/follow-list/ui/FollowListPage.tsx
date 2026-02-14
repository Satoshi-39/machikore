/**
 * フォロー/フォロワー一覧ページ
 *
 * フォロワーまたはフォロー中のユーザー一覧を表示（無限スクロール対応）
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, Href } from 'expo-router';
import { PageHeader, EmptyState, UserAvatar, RepeatSkeleton, UserListItemSkeleton } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useFollowers, useFollowing, type FollowWithUser } from '@/entities/follow';
import { useCurrentUserId } from '@/entities/user';
import { FollowButton } from '@/features/follow-user';

interface FollowListPageProps {
  userId: string;
  type: 'followers' | 'following';
}

export function FollowListPage({ userId, type }: FollowListPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const isFollowers = type === 'followers';

  // currentUserIdを渡してフォロー状態を一括取得（N+1問題回避）
  const {
    data: followersData,
    isLoading: isLoadingFollowers,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowers,
    isFetchingNextPage: isFetchingNextFollowers,
  } = useFollowers(isFollowers ? userId : null, currentUserId);

  const {
    data: followingData,
    isLoading: isLoadingFollowing,
    fetchNextPage: fetchNextFollowing,
    hasNextPage: hasNextFollowing,
    isFetchingNextPage: isFetchingNextFollowing,
  } = useFollowing(!isFollowers ? userId : null, currentUserId);

  // 無限スクロールのデータをフラット化
  const data = useMemo(() => {
    const pages = isFollowers ? followersData?.pages : followingData?.pages;
    return pages?.flatMap((page) => page.data) ?? [];
  }, [isFollowers, followersData, followingData]);

  const isLoading = isFollowers ? isLoadingFollowers : isLoadingFollowing;
  const hasNextPage = isFollowers ? hasNextFollowers : hasNextFollowing;
  const isFetchingNextPage = isFollowers ? isFetchingNextFollowers : isFetchingNextFollowing;
  const fetchNextPage = isFollowers ? fetchNextFollowers : fetchNextFollowing;

  const handleUserPress = useCallback(
    (targetUserId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${targetUserId}` as Href);
    },
    [router, currentTab]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: FollowWithUser }) => (
      <TouchableOpacity
        onPress={() => handleUserPress(item.user.id)}
        className="flex-row items-center px-4 py-3 bg-surface"
      >
        {/* アバター */}
        <UserAvatar
          url={item.user.avatar_url}
          crop={item.user.avatar_crop}
          alt={item.user.display_name || item.user.username || 'User'}
          className="w-12 h-12"
          size={48}
          iconSize={24}
        />

        {/* ユーザー情報 */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-on-surface">
            {item.user.display_name || item.user.username}
          </Text>
          {item.user.username && (
            <Text className="text-sm text-on-surface-variant">
              @{item.user.username}
            </Text>
          )}
          {item.user.bio && (
            <Text
              className="text-sm text-on-surface-variant mt-1"
              numberOfLines={1}
            >
              {item.user.bio}
            </Text>
          )}
        </View>

        {/* フォローボタン */}
        <FollowButton targetUserId={item.user.id} initialIsFollowing={item.is_following} />
      </TouchableOpacity>
    ),
    [handleUserPress]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  const pageTitle = isFollowers ? t('profile.followers') : t('profile.following');

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={pageTitle} />
        <RepeatSkeleton component={UserListItemSkeleton} count={8} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={pageTitle} />

      {data.length > 0 ? (
        <FlashList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <EmptyState
          ionIcon="people-outline"
          message={isFollowers ? t('empty.noFollowers') : t('empty.noFollowing')}
        />
      )}
    </View>
  );
}
