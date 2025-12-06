/**
 * コレクション一覧ページ
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { CollectionsTab } from '@/widgets/mypage-tab-content';
import { PageHeader } from '@/shared/ui';

interface CollectionsPageProps {
  userId?: string;
}

export function CollectionsPage({ userId: propUserId }: CollectionsPageProps) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;

  const handleCreate = () => {
    router.push('/create-collection');
  };

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader
        title="コレクション"
        rightComponent={
          <Pressable onPress={handleCreate} className="py-2">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">新規作成</Text>
          </Pressable>
        }
      />
      <CollectionsTab userId={userId} />
    </View>
  );
}
