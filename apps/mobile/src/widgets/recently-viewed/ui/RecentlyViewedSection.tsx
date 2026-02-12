/**
 * 最近見たマップセクションWidget
 *
 * 横スクロールで最近閲覧したマップを表示
 * ログイン時のみ表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { ErrorView } from '@/shared/ui';
import { MapDisplayCardSkeleton } from '@/shared/ui/skeleton';
import { useCurrentUserId } from '@/entities/user';
import { useRecentViewHistory } from '@/entities/view-history';
import { useBlockedUserIds } from '@/entities/block';
import { MapDisplayCard } from '@/widgets/map-cards';

export function RecentlyViewedSection() {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: rawViewHistory, isLoading, error } = useRecentViewHistory(currentUserId, 10);
  const { data: blockedUserIds } = useBlockedUserIds(currentUserId);
  const viewHistory = useMemo(
    () => rawViewHistory?.filter((item) => !blockedUserIds?.has(item.map.user_id)),
    [rawViewHistory, blockedUserIds]
  );

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/articles/maps/${mapId}` as Href);
    },
    [router]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/discover/users/${userId}` as Href);
    },
    [router]
  );

  const handleTitlePress = useCallback(() => {
    router.push('/(tabs)/discover/view-history' as Href);
  }, [router]);

  // 未ログインの場合は表示しない
  if (!currentUserId) {
    return null;
  }

  // データがない場合は表示しない
  if (!isLoading && (!viewHistory || viewHistory.length === 0)) {
    return null;
  }

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <Pressable
        onPress={handleTitlePress}
        className="flex-row items-center justify-between px-4 mb-3"
      >
        <Text className="text-lg font-bold text-on-surface">
          {t('section.recentlyViewed')}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={iconSizeNum.md}
          color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
        />
      </Pressable>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <MapDisplayCardSkeleton key={i} size="small" />
          ))}
        </ScrollView>
      ) : error ? (
        <ErrorView variant="inline" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {viewHistory?.map((item) => (
            <MapDisplayCard
              key={item.id}
              map={item.map}
              size="small"
              onPress={() => handleArticlePress(item.map.id)}
              onUserPress={() => handleUserPress(item.map.user_id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
