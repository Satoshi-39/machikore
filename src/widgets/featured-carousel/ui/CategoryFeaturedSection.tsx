/**
 * カテゴリ別おすすめマップセクションWidget
 *
 * 運営が選定したマップを横スクロールで表示
 * ランキングより大きめのカードで目立つように
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { getMapThemeColor, showLoginRequiredAlert, formatRelativeTime } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { useCategoryFeaturedMaps } from '@/entities/featured-carousel';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

// カードサイズ（ランキングより大きめ）
const CARD_WIDTH = 250;
const CARD_HEIGHT = 160;

interface FeaturedMapCardProps {
  map: MapWithUser;
  onPress: () => void;
}

function FeaturedMapCard({ map, onPress }: FeaturedMapCardProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事ハンドラー
  const handleArticlePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      router.push(`/(tabs)/discover/articles/maps/${map.id}` as Href);
    },
    [router, map.id]
  );

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

  return (
    <Pressable
      onPress={onPress}
      style={{ width: CARD_WIDTH }}
      className="mr-3 active:opacity-80"
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          borderRadius={12}
          defaultImagePadding={0.15}
        />
      </View>

      {/* マップ情報 */}
      <View className="mt-2">
        {/* マップ名 + スポット数 */}
        <View className="flex-row items-center">
          <Text
            className="text-base font-semibold text-foreground dark:text-dark-foreground flex-shrink"
            numberOfLines={1}
          >
            {map.name}
          </Text>
          <View className="flex-row items-center ml-1 flex-shrink-0">
            <LocationPinIcon
              size={14}
              color={getMapThemeColor(map.theme_color)}
              strokeColor={
                map.theme_color
                  ? getThemeColorStroke(
                      map.theme_color as UserMapThemeColor,
                      isDarkMode
                    )
                  : undefined
              }
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
                className="w-5 h-5 rounded-full mr-1"
              />
            ) : (
              <View className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center mr-1">
                <Ionicons name="person" size={12} color={colors.gray[400]} />
              </View>
            )}
            <Text
              className="text-sm text-foreground-muted dark:text-dark-foreground-muted"
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
              size={14}
              inactiveColor={
                isDarkMode
                  ? colors.dark.foregroundSecondary
                  : colors.light.foreground
              }
              onCountPress={() => setIsLikersModalVisible(true)}
            />
            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              bookmarksCount={map.bookmarks_count ?? 0}
              size={14}
              showCount
              inactiveColor={
                isDarkMode
                  ? colors.dark.foregroundSecondary
                  : colors.light.foreground
              }
            />
            {/* 作成日時 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at)}
            </Text>
          </View>
          {/* 記事アイコン + 三点リーダ（自分のマップ以外） */}
          <View className="flex-row items-center">
            {(isOwner || map.is_article_public) && (
              <Pressable onPress={handleArticlePress}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={
                    isDarkMode
                      ? colors.dark.foregroundSecondary
                      : colors.text.secondary
                  }
                />
              </Pressable>
            )}
            {!isOwner && (
              <PopupMenu
                items={menuItems}
                triggerSize={16}
                triggerColor={colors.text.secondary}
              />
            )}
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

interface CategoryFeaturedSectionProps {
  categoryId: string;
}

export function CategoryFeaturedSection({ categoryId }: CategoryFeaturedSectionProps) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryFeaturedMaps(categoryId, currentUserId);

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // データがない場合は表示しない
  if (!isLoading && (!maps || maps.length === 0)) {
    return null;
  }

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          {categoryName}のおすすめ
        </Text>
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {maps?.map((map) => (
            <FeaturedMapCard
              key={map.id}
              map={map}
              onPress={() => handleMapPress(map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
