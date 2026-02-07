/**
 * コレクション一覧ページ
 */

import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCurrentUserId } from '@/entities/user';
import { useCollectionLimitGuard } from '@/features/check-usage-limit';
import { CollectionsTab } from '@/widgets/mypage-tab-content';
import { PageHeader } from '@/shared/ui';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';

interface CollectionsPageProps {
  userId?: string;
}

export function CollectionsPage({ userId: propUserId }: CollectionsPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;
  const isDarkMode = useIsDarkMode();
  const { checkCollectionLimit } = useCollectionLimitGuard();

  const handleCreate = useCallback(async () => {
    // コレクション上限チェック
    const canCreate = await checkCollectionLimit();
    if (!canCreate) return;

    router.push('/create-collection');
  }, [checkCollectionLimit, router]);

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader
        title={t('collection.collections')}
        rightComponent={
          <Pressable onPress={handleCreate} className="p-1">
            <Ionicons
              name="add"
              size={iconSizeNum.xl}
              color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
            />
          </Pressable>
        }
      />
      <CollectionsTab userId={userId} />
    </View>
  );
}
