/**
 * SpotListCard コンポーネント
 *
 * リスト表示用スポットカード（サムネイル + 右側に情報）
 * MapListCardと同様のレイアウト
 *
 * 使用箇所:
 * - いいね一覧（スポット）
 * - ブックマーク一覧（スポット）
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert, shareSpot } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import { useSpotBookmarkMenu } from '@/features/spot-bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { PopupMenu, type PopupMenuItem, UserAvatar, SpotThumbnail } from '@/shared/ui';
import { useBlockAction } from '@/features/block-user';
import type { Json } from '@/shared/types';
import type { ThumbnailCrop } from '@/shared/lib/image';

// ===============================
// Types
// ===============================

interface SpotUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  avatar_crop: ThumbnailCrop | null;
}

interface SpotMasterSpot {
  id: string;
  name: Json;
  google_short_address: Json | null;
}

interface SpotThumbnailImage {
  id: string;
  cloud_path: string | null;
}

export interface SpotListCardSpot {
  id: string;
  user_id: string;
  map_id: string;
  name?: string | null;
  description: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  created_at: string;
  google_short_address: Json | null;
  master_spot: SpotMasterSpot | null;
  user: SpotUser | null;
  thumbnail_image: SpotThumbnailImage | null;
  thumbnail_crop?: ThumbnailCrop | null;
  language?: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_public?: boolean;
}

export interface SpotListCardProps {
  spot: SpotListCardSpot;
  currentUserId?: string | null;
  /** オーナーかどうか（編集・削除メニュー表示用） */
  isOwner?: boolean;
  onPress?: () => void;
  onEdit?: (spotId: string) => void;
  onDelete?: (spotId: string) => void;
  onUserPress?: (userId: string) => void;
  onMapPress?: () => void;
}

// ===============================
// Component
// ===============================

export function SpotListCard({
  spot,
  currentUserId,
  isOwner,
  onPress,
  onEdit,
  onDelete,
  onUserPress,
  onMapPress,
}: SpotListCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useSpotBookmarkMenu({
    spotId: spot.id,
    currentUserId,
  });

  // ブロック
  const { handleBlock } = useBlockAction({ currentUserId });

  // スポット名（spot.languageで抽出）
  const spotLanguage = spot.language || 'ja';
  const spotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, spotLanguage) || t('favorite.unknownSpot')
    : (spot.name ? spot.name : null) || t('favorite.unknownSpot');

  // 住所（spot.languageで抽出）
  const address = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
    || extractAddress(spot.google_short_address, spotLanguage);

  // サムネイルURL
  const thumbnailUrl = spot.thumbnail_image?.cloud_path || null;

  // メニューアイテム（オーナー: 編集・削除、非オーナー: 保存・通報・ブロック）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (isOwner) {
      return [
        {
          id: 'edit',
          label: t('common.edit'),
          icon: 'create-outline',
          onPress: () => onEdit?.(spot.id),
        },
        {
          id: 'delete',
          label: t('common.delete'),
          icon: 'trash-outline',
          destructive: true,
          onPress: () => onDelete?.(spot.id),
        },
      ];
    }
    // 非オーナーの場合は保存・共有・通報・ブロックメニュー
    return [
      bookmarkMenuItem,
      {
        id: 'share',
        label: t('common.share'),
        icon: 'share-outline',
        onPress: () => shareSpot(spot.user?.username || '', spot.map_id, spot.id),
      },
      {
        id: 'report',
        label: t('menu.report'),
        icon: 'flag-outline',
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert(t('menu.report'));
            return;
          }
          router.push(`/report?targetType=spot&targetId=${spot.id}`);
        },
      },
      {
        id: 'block',
        label: t('menu.blockUser'),
        icon: 'ban-outline',
        destructive: true,
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert(t('menu.blockUser'));
            return;
          }
          handleBlock(spot.user_id);
        },
      },
    ];
  }, [spot.id, spot.user_id, onEdit, onDelete, isOwner, currentUserId, router, t, bookmarkMenuItem, handleBlock]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 bg-surface border-b-hairline border-outline-variant"
    >
      <View className="flex-row items-start">
        {/* 左: サムネイル（正方形） */}
        <SpotThumbnail
          url={thumbnailUrl}
          crop={spot.thumbnail_crop}
          width={96}
          height={96}
          borderRadius={8}
        />

        {/* 右: スポット情報 */}
        <View className="flex-1 ml-3 justify-between">
          {/* 上部: スポット名 + 三点リーダ */}
          <View className="flex-row">
            <View className="flex-1">
              {/* スポット名 */}
              <View className="flex-row items-center">
                <Text
                  className="text-sm font-semibold text-on-surface flex-shrink"
                  numberOfLines={1}
                >
                  {spotName}
                </Text>
                {/* 非公開アイコン（自分のスポットで非公開の場合のみ表示） */}
                {isOwner && spot.is_public === false && (
                  <View className="ml-1.5 flex-row items-center bg-secondary px-1.5 py-0.5 rounded">
                    <Ionicons name="lock-closed" size={iconSizeNum.xs} className="text-on-surface-variant" />
                  </View>
                )}
              </View>
              {/* 説明 */}
              {spot.description && (
                <Text
                  className="text-xs text-on-surface-variant mt-0.5"
                  numberOfLines={1}
                >
                  {spot.description}
                </Text>
              )}
              {/* 住所 */}
              {address && (
                <Text
                  className="text-xs text-on-surface-variant mt-0.5"
                  numberOfLines={1}
                >
                  {address}
                </Text>
              )}
              {/* ユーザー情報 */}
              {spot.user && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onUserPress?.(spot.user!.id);
                  }}
                  className="flex-row items-center mt-1 self-start"
                >
                  <UserAvatar
                    url={spot.user.avatar_url}
                    crop={spot.user.avatar_crop}
                    alt={spot.user.display_name || spot.user.username || 'User'}
                    className="w-4 h-4 mr-1"
                    size={16}
                    iconSize={10}
                  />
                  <Text
                    className="text-xs text-on-surface-variant"
                    numberOfLines={1}
                  >
                    {spot.user.display_name || spot.user.username}
                  </Text>
                </Pressable>
              )}
            </View>
            {/* 右上: 三点リーダメニュー */}
            <PopupMenu
              items={menuItems}
              triggerIcon="ellipsis-vertical"
            />
          </View>

          {/* 下部: 日付 + マップアイコン */}
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-on-surface-variant">
              {formatRelativeTime(spot.created_at, locale)}
            </Text>
            {onMapPress && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onMapPress();
                }}
                hitSlop={8}
              >
                <Ionicons name="map-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
    </Pressable>
  );
}
