/**
 * ブロックしたユーザー一覧ページ
 *
 * FSDの原則：Pageレイヤー
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PageHeader, UserAvatar } from '@/shared/ui';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getBlockedUsers, type BlockedUsersPage as BlockedUsersPageData } from '@/shared/api/supabase/blocks';
import { useUnblockUser } from '@/entities/block';
import { useCurrentUserId } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { useRouter } from 'expo-router';

export function BlockedUsersPage() {
  const currentUserId = useCurrentUserId();
  const { t } = useI18n();
  const router = useRouter();
  const unblockMutation = useUnblockUser();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BlockedUsersPageData, Error>({
    queryKey: QUERY_KEYS.blockedUsers(currentUserId || ''),
    queryFn: ({ pageParam }) =>
      getBlockedUsers(currentUserId!, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!currentUserId,
    staleTime: 0,
  });

  const blockedUsers = data?.pages.flatMap((page) => page.data) ?? [];

  const handleUnblock = useCallback((blockedId: string) => {
    if (!currentUserId) return;
    unblockMutation.mutate({ blockerId: currentUserId, blockedId });
  }, [currentUserId, unblockMutation]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('settings.blockedUsers')} showBackButton />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  if (!blockedUsers.length) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('settings.blockedUsers')} showBackButton />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-on-surface-variant text-center">
            ブロックしたユーザーはいません
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.blockedUsers')} showBackButton />
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleUserPress(item.id)}
            className="flex-row items-center px-4 py-3 active:bg-secondary"
          >
            <UserAvatar
              url={item.avatar_url}
              className="w-10 h-10"
            />
            <View className="flex-1 ml-3">
              <Text className="text-base font-medium text-on-surface" numberOfLines={1}>
                {item.display_name || item.username}
              </Text>
              <Text className="text-sm text-on-surface-variant" numberOfLines={1}>
                @{item.username}
              </Text>
            </View>
            <Pressable
              onPress={() => handleUnblock(item.id)}
              className="px-4 py-1.5 rounded-full border border-outline"
            >
              <Text className="text-sm font-medium text-on-surface">
                {t('menu.unblockUser')}
              </Text>
            </Pressable>
          </Pressable>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" className="text-primary" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
