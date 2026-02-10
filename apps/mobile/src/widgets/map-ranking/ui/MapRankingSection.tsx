/**
 * マップランキングセクションWidget
 *
 * 横スクロールのマップカードを表示
 * オプションでランキング番号付き
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { ErrorView } from '@/shared/ui';
import { MapDisplayCardSkeleton } from '@/shared/ui/skeleton';
import { MapDisplayCard } from '@/widgets/map-cards';

interface MapRankingSectionProps {
  title: string;
  maps: MapWithUser[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** ランキングバッジを表示するか */
  showRank?: boolean;
  /** すべて見るリンク先 */
  seeAllHref?: string;
}

export function MapRankingSection({
  title,
  maps,
  isLoading,
  error,
  showRank = false,
  seeAllHref,
}: MapRankingSectionProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();

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

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/discover/users/${userId}` as Href);
    },
    [router]
  );

  const handleSeeAllPress = useCallback(() => {
    if (seeAllHref) {
      router.push(seeAllHref as Href);
    }
  }, [router, seeAllHref]);

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <Pressable
        onPress={seeAllHref ? handleSeeAllPress : undefined}
        disabled={!seeAllHref}
        className="flex-row items-center justify-between px-4 mb-3"
      >
        <Text className="text-lg font-bold text-on-surface">
          {title}
        </Text>
        {seeAllHref && (
          <Ionicons
            name="chevron-forward"
            size={iconSizeNum.md}
            color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
          />
        )}
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
      ) : !maps || maps.length === 0 ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-on-surface-variant">
            {t('empty.noMaps')}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {maps.map((map, index) => (
            <MapDisplayCard
              key={map.id}
              map={map}
              size="small"
              rank={showRank ? index + 1 : undefined}
              onPress={() => handleArticlePress(map.id)}
              onMapPress={() => handleMapPress(map.id)}
              onUserPress={() => handleUserPress(map.user_id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
