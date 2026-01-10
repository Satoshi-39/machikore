/**
 * MapDisplayCard コンポーネント
 *
 * 発見タブで使用する統一マップカード
 * 横スクロールセクション向けのコンパクトなカードデザイン
 *
 * サイズバリエーション:
 * - small: 160×100px (ランキング、最近見たマップ)
 * - medium: 250×160px (特集・おすすめ)
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { showLoginRequiredAlert, formatRelativeTimeCompact } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem, UserAvatar } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

// ===============================
// サイズ設定
// ===============================

type CardSize = 'small' | 'medium';

const CARD_SIZES = {
  small: {
    width: 160,
    height: 100,
    titleSize: 'text-sm' as const,
    userAvatarSize: 16, // w-4 h-4
    userTextSize: 'text-xs' as const,
    iconSize: 12,
    pinSize: 12,
    articleIconSize: 14,
    menuSize: 14,
  },
  medium: {
    width: 250,
    height: 160,
    titleSize: 'text-base' as const,
    userAvatarSize: 20, // w-5 h-5
    userTextSize: 'text-sm' as const,
    iconSize: 14,
    pinSize: 14,
    articleIconSize: 16,
    menuSize: 16,
  },
} as const;

// ===============================
// ランキングバッジカラー
// ===============================

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return colors.ranking.gold;
    case 2:
      return colors.ranking.silver;
    case 3:
      return colors.ranking.bronze;
    default:
      return colors.ranking.default;
  }
}

// ===============================
// Props
// ===============================

export interface MapDisplayCardProps {
  map: MapWithUser;
  onPress: () => void;
  /** カードサイズ @default 'small' */
  size?: CardSize;
  /** ランキング番号（指定時にバッジ表示） */
  rank?: number;
}

// ===============================
// Component
// ===============================

export function MapDisplayCard({
  map,
  onPress,
  size = 'small',
  rank,
}: MapDisplayCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const sizeConfig = CARD_SIZES[size];

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事が表示可能か
  const canViewArticle = isOwner || map.is_article_public;

  // 記事ハンドラー
  const handleArticlePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      router.push(`/(tabs)/discover/articles/maps/${map.id}` as Href);
    },
    [router, map.id]
  );

  // 三点リーダメニュー（通報のみ）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];

    // 通報（自分のマップ以外）
    if (!isOwner) {
      items.push({
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
      });
    }

    return items;
  }, [currentUserId, router, map.id, t, isOwner]);

  // アバターサイズのクラス
  const avatarSizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const avatarIconSize = size === 'small' ? 10 : 12;

  return (
    <Pressable
      onPress={onPress}
      style={{ width: sizeConfig.width }}
      className="mr-3 active:opacity-80"
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          width={sizeConfig.width}
          height={sizeConfig.height}
          borderRadius={12}
          defaultImagePadding={0.15}
        />
        {/* ランキングバッジ */}
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
            className={`${sizeConfig.titleSize} font-semibold text-foreground dark:text-dark-foreground flex-shrink`}
            numberOfLines={1}
          >
            {map.name}
          </Text>
          <View className="flex-row items-center ml-1 flex-shrink-0">
            <LocationPinIcon
              size={sizeConfig.pinSize}
              color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
            />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
              {map.spots_count}
            </Text>
          </View>
        </View>

        {/* ユーザー情報 + 日付 */}
        <View className="flex-row items-center justify-between mt-1">
          {/* ユーザー情報 */}
          {map.user && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/(tabs)/discover/users/${map.user_id}` as Href);
              }}
              className="flex-row items-center flex-1 mr-2"
            >
              <UserAvatar
                url={map.user.avatar_url}
                alt={map.user.display_name || map.user.username || 'User'}
                className={`${avatarSizeClass} mr-1`}
                iconSize={avatarIconSize}
              />
              <Text
                className={`${sizeConfig.userTextSize} text-foreground-muted dark:text-dark-foreground-muted flex-1`}
                numberOfLines={1}
              >
                {map.user.display_name || map.user.username}
              </Text>
            </Pressable>
          )}
          {/* 日付（右固定） */}
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted flex-shrink-0">
            {formatRelativeTimeCompact(map.created_at)}
          </Text>
        </View>

        {/* いいね + ブックマーク + 記事アイコン + 三点リーダ */}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-2">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={sizeConfig.iconSize}
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
              size={sizeConfig.iconSize}
              showCount
              inactiveColor={
                isDarkMode
                  ? colors.dark.foregroundSecondary
                  : colors.light.foreground
              }
            />
            {/* 記事アイコン */}
            {canViewArticle && (
              <Pressable onPress={handleArticlePress}>
                <Ionicons
                  name="document-text-outline"
                  size={sizeConfig.articleIconSize}
                  color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
                />
              </Pressable>
            )}
          </View>
          {/* 三点リーダ（右固定） */}
          <PopupMenu
            items={menuItems}
            triggerSize={sizeConfig.menuSize}
            triggerColor={colors.text.secondary}
          />
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
