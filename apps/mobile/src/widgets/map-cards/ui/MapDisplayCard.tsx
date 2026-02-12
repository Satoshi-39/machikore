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

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR, getThumbnailHeight, borderRadiusNum } from '@/shared/config';
import { showLoginRequiredAlert, formatRelativeTimeCompact } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem, UserAvatar } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { useBlockAction } from '@/features/block-user';
import { LikersModal } from '@/features/view-likers';

// ===============================
// サイズ設定
// ===============================

type CardSize = 'small' | 'medium';

const CARD_SIZES = {
  small: {
    width: 160,
    height: getThumbnailHeight(160),
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
    height: getThumbnailHeight(250),
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
      return colors.component.ranking.gold;
    case 2:
      return colors.component.ranking.silver;
    case 3:
      return colors.component.ranking.bronze;
    default:
      return colors.component.ranking.default;
  }
}

// ===============================
// Props
// ===============================

export interface MapDisplayCardProps {
  map: MapWithUser;
  /** カード全体タップ時（記事への遷移用） */
  onPress: () => void;
  /** ユーザータップ時（ユーザー画面への遷移用） */
  onUserPress?: () => void;
  /** カードサイズ @default 'small' */
  size?: CardSize;
  /** カード幅を外部から指定（グリッド配置用） */
  width?: number;
  /** ランキング番号（指定時にバッジ表示） */
  rank?: number;
}

// ===============================
// Component
// ===============================

export function MapDisplayCard({
  map,
  onPress,
  onUserPress,
  size = 'small',
  width: widthOverride,
  rank,
}: MapDisplayCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  const sizeConfig = CARD_SIZES[size];
  const cardWidth = widthOverride ?? sizeConfig.width;
  const cardHeight = getThumbnailHeight(cardWidth);

  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // ブロック
  const { handleBlock } = useBlockAction({ currentUserId });

  // 三点リーダメニュー（通報・ブロック）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];

    // 通報・ブロック（自分のマップ以外）
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
      items.push({
        id: 'block',
        label: t('menu.blockUser'),
        icon: 'ban-outline',
        destructive: true,
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert(t('menu.blockUser'));
            return;
          }
          handleBlock(map.user_id);
        },
      });
    }

    return items;
  }, [currentUserId, router, map.id, map.user_id, t, isOwner, handleBlock]);

  // アバターサイズのクラス
  const avatarSizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const avatarSizePx = size === 'small' ? 16 : 20;
  const avatarIconSize = size === 'small' ? 10 : 12;

  return (
    <Pressable
      onPress={onPress}
      style={{ width: cardWidth }}
      className={widthOverride ? 'active:opacity-80' : 'mr-3 active:opacity-80'}
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          crop={map.thumbnail_crop}
          width={cardWidth}
          height={cardHeight}
          borderRadius={12}
        />
        {/* ランキングバッジ（左上） */}
        {rank !== undefined && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: getRankColor(rank),
              borderRadius: borderRadiusNum.lg,
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
        {/* マップ名 + スポット数 + 三点リーダ（縦） */}
        <View className="flex-row items-center">
          <Text
            className={`${sizeConfig.titleSize} font-semibold text-on-surface flex-shrink`}
            numberOfLines={1}
          >
            {map.name}
          </Text>
          <View className="flex-row items-center ml-1 flex-shrink-0">
            <LocationPinIcon
              size={sizeConfig.pinSize}
              color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
            />
            <Text className="text-xs text-on-surface-variant ml-0.5">
              {map.spots_count}
            </Text>
          </View>
          {/* 三点リーダ（縦・右上） */}
          {menuItems.length > 0 && (
            <View className="ml-auto">
              <PopupMenu
                items={menuItems}
                triggerSize={sizeConfig.menuSize}
                triggerIcon="ellipsis-vertical"
                hitSlop={0}
              />
            </View>
          )}
        </View>

        {/* ユーザー情報 */}
        {map.user && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onUserPress?.();
            }}
            className="flex-row items-center mt-1 self-start"
          >
            <UserAvatar
              url={map.user.avatar_url}
              crop={map.user.avatar_crop}
              alt={map.user.display_name || map.user.username || 'User'}
              className={`${avatarSizeClass} mr-1`}
              size={avatarSizePx}
              iconSize={avatarIconSize}
            />
            <Text
              className={`${sizeConfig.userTextSize} text-on-surface-variant`}
              numberOfLines={1}
            >
              {map.user.display_name || map.user.username}
            </Text>
          </Pressable>
        )}

        {/* 日付 + いいね + 保存 + マップアイコン */}
        <View className="flex-row items-center justify-between mt-2 pb-1">
          <Text className="text-xs text-on-surface-variant">
            {formatRelativeTimeCompact(map.created_at)}
          </Text>
          <View className="flex-row items-center gap-6">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={sizeConfig.iconSize}
              inactiveColor={colors.light["on-surface-variant"]}
              isLiked={map.is_liked}
              onCountPress={() => setIsLikersModalVisible(true)}
              textMarginClassName="ml-2"
              textClassName="text-xs text-on-surface-variant"
            />
            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              size={sizeConfig.iconSize}
              isBookmarked={map.is_bookmarked}
            />
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
