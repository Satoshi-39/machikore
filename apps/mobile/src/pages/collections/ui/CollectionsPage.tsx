/**
 * コレクション一覧ページ
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { CollectionsTab } from '@/widgets/mypage-tab-content';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface CollectionsPageProps {
  userId?: string;
}

export function CollectionsPage({ userId: propUserId }: CollectionsPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;

  const handleCreate = () => {
    router.push('/create-collection');
  };

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader
        title={t('collection.collections')}
        rightComponent={
          <Pressable onPress={handleCreate} className="py-2">
            <Text className="text-base font-semibold text-on-surface">{t('collection.createNew')}</Text>
          </Pressable>
        }
      />
      <CollectionsTab userId={userId} />
    </View>
  );
}
