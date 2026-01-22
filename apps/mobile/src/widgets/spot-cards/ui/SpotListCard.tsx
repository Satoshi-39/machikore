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
import { colors } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import { useSpotBookmarkMenu } from '@/features/spot-bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { PopupMenu, type PopupMenuItem, UserAvatar, SpotThumbnail } from '@/shared/ui';
import type { Json } from '@/shared/types';

// ===============================
// Types
// ===============================

interface SpotUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
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
  description: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  created_at: string;
  google_short_address: Json | null;
  master_spot: SpotMasterSpot | null;
  user: SpotUser | null;
  thumbnail_image: SpotThumbnailImage | null;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_public?: boolean;
}

export interface SpotListCardProps {
  spot: SpotListCardSpot;
  currentUserId?: string | null;
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
}

// ===============================
// Component
// ===============================

export function SpotListCard({
  spot,
  currentUserId,
  onPress,
  onUserPress,
}: SpotListCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useSpotBookmarkMenu({
    spotId: spot.id,
    currentUserId,
  });

  // オーナー判定
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // スポット名（master_spotのnameを優先）
  const spotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('favorite.unknownSpot')
    : t('favorite.unknownSpot');

  // 住所
  const address = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);

  // サムネイルURL
  const thumbnailUrl = spot.thumbnail_image?.cloud_path || null;

  // 三点リーダメニュー（保存・通報）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    return [
      bookmarkMenuItem,
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
    ];
  }, [currentUserId, router, spot.id, t, bookmarkMenuItem]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light"
    >
      <View className="flex-row items-start">
        {/* 左: サムネイル（正方形） */}
        <SpotThumbnail
          url={thumbnailUrl}
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
                  className="text-sm font-semibold text-foreground dark:text-dark-foreground flex-shrink"
                  numberOfLines={1}
                >
                  {spotName}
                </Text>
                {/* 非公開アイコン（自分のスポットで非公開の場合のみ表示） */}
                {isOwner && spot.is_public === false && (
                  <View className="ml-1.5 flex-row items-center bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    <Ionicons name="lock-closed" size={10} color={colors.gray[500]} />
                  </View>
                )}
              </View>
              {/* 説明 */}
              {spot.description && (
                <Text
                  className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-0.5"
                  numberOfLines={1}
                >
                  {spot.description}
                </Text>
              )}
              {/* 住所 */}
              {address && (
                <Text
                  className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5"
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
                    alt={spot.user.display_name || spot.user.username || 'User'}
                    className="w-4 h-4 mr-1"
                    iconSize={10}
                  />
                  <Text
                    className="text-xs text-foreground-muted dark:text-dark-foreground-muted"
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
              triggerColor={colors.text.secondary}
              triggerIcon="ellipsis-vertical"
            />
          </View>

          {/* 下部: 日付 */}
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(spot.created_at, locale)}
            </Text>
          </View>
        </View>
      </View>

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
    </Pressable>
  );
}
