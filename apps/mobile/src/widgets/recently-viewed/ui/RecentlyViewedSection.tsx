/**
 * 最近見たマップセクションWidget
 *
 * 横スクロールで最近閲覧したマップを表示
 * ログイン時のみ表示
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentUserId } from '@/entities/user';
import { useRecentViewHistory } from '@/entities/view-history';
import { MapDisplayCard } from '@/widgets/map-cards';

export function RecentlyViewedSection() {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: viewHistory, isLoading, error } = useRecentViewHistory(currentUserId, 10);

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/articles/maps/${mapId}` as Href);
    },
    [router]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // 未ログインの場合は表示しない
  if (!currentUserId) {
    return null;
  }

  // データがない場合は表示しない
  if (!isLoading && (!viewHistory || viewHistory.length === 0)) {
    return null;
  }

  const handleTitlePress = useCallback(() => {
    router.push('/(tabs)/discover/view-history' as Href);
  }, [router]);

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <Pressable
        onPress={handleTitlePress}
        className="flex-row items-center justify-between px-4 mb-3"
      >
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          {t('section.recentlyViewed')}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary}
        />
      </Pressable>

      {isLoading ? (
        <View className="h-32 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            {t('errors.loadFailed')}
          </Text>
        </View>
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
              onMapPress={() => handleMapPress(item.map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
