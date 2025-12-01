/**
 * フォロー/フォロワー一覧ページ
 *
 * フォロワーまたはフォロー中のユーザー一覧を表示
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader, EmptyState } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useFollowers, useFollowing, type FollowWithUser } from '@/entities/follow';
import { FollowButton } from '@/features/follow-user';

interface FollowListPageProps {
  userId: string;
  type: 'followers' | 'following';
}

export function FollowListPage({ userId, type }: FollowListPageProps) {
  const router = useRouter();
  const isFollowers = type === 'followers';

  const { data: followers, isLoading: isLoadingFollowers } = useFollowers(
    isFollowers ? userId : null
  );
  const { data: following, isLoading: isLoadingFollowing } = useFollowing(
    !isFollowers ? userId : null
  );

  const data = isFollowers ? followers : following;
  const isLoading = isFollowers ? isLoadingFollowers : isLoadingFollowing;

  const handleUserPress = (targetUserId: string) => {
    router.push(`/(tabs)/mypage/users/${targetUserId}`);
  };

  const renderItem = ({ item }: { item: FollowWithUser }) => (
    <TouchableOpacity
      onPress={() => handleUserPress(item.user.id)}
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
    >
      {/* アバター */}
      {item.user.avatar_url ? (
        <Image
          source={{ uri: item.user.avatar_url }}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
          <Ionicons name="person" size={24} color={colors.gray[400]} />
        </View>
      )}

      {/* ユーザー情報 */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900">
          {item.user.display_name || item.user.username}
        </Text>
        {item.user.username && (
          <Text className="text-sm text-gray-500">@{item.user.username}</Text>
        )}
        {item.user.bio && (
          <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
            {item.user.bio}
          </Text>
        )}
      </View>

      {/* フォローボタン */}
      <FollowButton targetUserId={item.user.id} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title={isFollowers ? 'フォロワー' : 'フォロー中'} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title={isFollowers ? 'フォロワー' : 'フォロー中'} />

      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <EmptyState
          ionIcon="people-outline"
          message={
            isFollowers
              ? 'フォロワーはいません'
              : 'フォロー中のユーザーはいません'
          }
        />
      )}
    </View>
  );
}
