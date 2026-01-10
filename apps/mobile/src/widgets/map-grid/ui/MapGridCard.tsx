/**
 * マップグリッドカードWidget
 *
 * グリッド表示用のマップカード
 * MapRankingCardと同様の情報を表示
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { showLoginRequiredAlert, formatRelativeTime } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem, UserAvatar } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const THUMBNAIL_HEIGHT = 100;

interface MapGridCardProps {
  map: MapWithUser;
  onPress: () => void;
}

export function MapGridCard({ map, onPress }: MapGridCardProps) {
  const { t, locale } = useI18n();
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
        label: t('menu.report'),
        icon: 'flag-outline',
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert(t('menu.report'));
            return;
          }
          router.push(`/report?targetType=map&targetId=${map.id}`);
        },
      },
    ];
  }, [currentUserId, router, map.id, t]);

  return (
    <Pressable
      onPress={onPress}
      style={{ width: CARD_WIDTH }}
      className="active:opacity-80"
    >
      {/* サムネイル */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={CARD_WIDTH}
        height={THUMBNAIL_HEIGHT}
        borderRadius={12}
        defaultImagePadding={0.15}
      />

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
              color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
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
            <UserAvatar
              url={map.user.avatar_url}
              alt={map.user.display_name || map.user.username || 'User'}
              className="w-4 h-4 mr-1"
              iconSize={10}
            />
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
          <View className="flex-row items-center gap-2">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={12}
              inactiveColor={
                isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground
              }
              onCountPress={() => setIsLikersModalVisible(true)}
            />
            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              bookmarksCount={map.bookmarks_count}
              size={12}
              showCount
              inactiveColor={
                isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground
              }
            />
            {/* 作成日時 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at, locale)}
            </Text>
          </View>
          {/* 記事アイコン + 三点リーダ（自分のマップ以外） */}
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
            {!isOwner && (
              <PopupMenu items={menuItems} triggerSize={14} triggerColor={colors.text.secondary} />
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

// レイアウト定数をエクスポート
export const MAP_GRID_CONSTANTS = {
  GRID_PADDING,
  GRID_GAP,
  CARD_WIDTH,
  THUMBNAIL_HEIGHT,
};
