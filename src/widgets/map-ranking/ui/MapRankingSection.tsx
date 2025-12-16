/**
 * マップランキングセクションWidget
 *
 * 横スクロールのマップカードを表示
 * ランキング番号付き
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { getMapThemeColor, showLoginRequiredAlert, formatRelativeTime } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

interface MapRankingCardProps {
  map: MapWithUser;
  rank?: number;
  onPress: () => void;
}

function MapRankingCard({ map, rank, onPress }: MapRankingCardProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事ハンドラー
  const handleArticlePress = useCallback((e: any) => {
    e.stopPropagation();
    router.push(`/(tabs)/discover/articles/maps/${map.id}` as Href);
  }, [router, map.id]);

  // 三点リーダメニュー
  const menuItems: PopupMenuItem[] = useMemo(() => {
    return [
      {
        id: 'report',
        label: '報告する',
        icon: 'flag-outline',
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert('報告');
            return;
          }
          router.push(`/report?targetType=map&targetId=${map.id}`);
        },
      },
    ];
  }, [currentUserId, router, map.id]);

  // ランキング1〜3位の色
  const getRankColor = (r: number) => {
    switch (r) {
      case 1:
        return colors.ranking.gold;
      case 2:
        return colors.ranking.silver;
      case 3:
        return colors.ranking.bronze;
      default:
        return colors.ranking.default;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ width: 160 }}
      className="mr-3 active:opacity-80"
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          width={160}
          height={100}
          borderRadius={12}
          defaultImagePadding={0.15}
        />
        {/* ランキングバッジ（rankが指定されている場合のみ表示） */}
        {rank !== undefined && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: getRankColor(rank),
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text className="text-white text-xs font-bold">{rank}</Text>
          </View>
        )}
      </View>

      {/* マップ情報 */}
      <View className="mt-2">
        {/* マップ名 + スポット数 */}
        <View className="flex-row items-center">
          <Text
            className="text-sm font-semibold text-foreground dark:text-dark-foreground flex-shrink"
            numberOfLines={1}
          >
            {map.name}
          </Text>
          <View className="flex-row items-center ml-1 flex-shrink-0">
            <LocationPinIcon
              size={12}
              color={getMapThemeColor(map.theme_color)}
              strokeColor={map.theme_color ? getThemeColorStroke(map.theme_color as UserMapThemeColor, isDarkMode) : undefined}
            />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
              {map.spots_count}
            </Text>
          </View>
        </View>
        {/* ユーザー情報 */}
        {map.user && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(tabs)/discover/users/${map.user_id}` as Href);
            }}
            className="flex-row items-center mt-0.5"
          >
            {map.user.avatar_url ? (
              <Image
                source={{ uri: map.user.avatar_url }}
                className="w-4 h-4 rounded-full mr-1"
              />
            ) : (
              <View className="w-4 h-4 rounded-full bg-gray-200 items-center justify-center mr-1">
                <Ionicons name="person" size={10} color={colors.gray[400]} />
              </View>
            )}
            <Text
              className="text-xs text-foreground-muted dark:text-dark-foreground-muted"
              numberOfLines={1}
            >
              {map.user.display_name || map.user.username}
            </Text>
          </Pressable>
        )}
        {/* いいね、ブックマーク、作成日時、記事アイコン、三点リーダ */}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-3">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={12}
              inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
              onCountPress={() => setIsLikersModalVisible(true)}
            />
            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              bookmarksCount={map.bookmarks_count}
              size={12}
              showCount
              inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
            />
            {/* 作成日時 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at)}
            </Text>
          </View>
          {/* 記事アイコン + 三点リーダ */}
          <View className="flex-row items-center">
            {(isOwner || map.is_article_public) && (
              <Pressable onPress={handleArticlePress}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
                />
              </Pressable>
            )}
            <PopupMenu items={menuItems} triggerSize={14} triggerColor={colors.text.secondary} />
          </View>
        </View>
      </View>

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        mapId={map.id}
        onClose={() => setIsLikersModalVisible(false)}
      />
    </Pressable>
  );
}

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

export function MapRankingSection({ title, maps, isLoading, error, showRank = false, seeAllHref }: MapRankingSectionProps) {
  const router = useRouter();

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
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
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          {title}
        </Text>
        {seeAllHref && (
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        )}
      </Pressable>

      {isLoading ? (
        <View className="h-32 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
          </Text>
        </View>
      ) : !maps || maps.length === 0 ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            マップがありません
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {maps.map((map, index) => (
            <MapRankingCard
              key={map.id}
              map={map}
              rank={showRank ? index + 1 : undefined}
              onPress={() => handleMapPress(map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
