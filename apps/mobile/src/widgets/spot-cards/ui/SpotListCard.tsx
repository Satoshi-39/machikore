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

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { PopupMenu, type PopupMenuItem, UserAvatar } from '@/shared/ui';
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

  // ブックマーク機能
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  const isBookmarked = bookmarkInfo.length > 0;
  // ブックマーク済みフォルダIDのSetを作成
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );

  // スポット名（master_spotのnameを優先）
  const spotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('favorite.unknownSpot')
    : t('favorite.unknownSpot');

  // 住所
  const address = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);

  // サムネイルURL
  const thumbnailUrl = spot.thumbnail_image?.cloud_path || null;

  // フォルダに追加
  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    addBookmark({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, addBookmark]);

  // フォルダから削除
  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    removeFromFolder({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, removeFromFolder]);

  // 三点リーダメニュー（保存・通報）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    return [
      {
        id: 'save',
        label: isBookmarked ? t('common.saved') : t('common.save'),
        icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
        // 保存済みでもデフォルト色を使用（青色にしない）
        iconColor: undefined,
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert(t('common.save'));
            return;
          }
          setIsFolderModalVisible(true);
        },
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
    ];
  }, [currentUserId, router, spot.id, t, isBookmarked]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light"
    >
      <View className="flex-row items-start">
        {/* 左: サムネイル（正方形） */}
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: colors.gray[200],
          }}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="image-outline" size={32} color={colors.gray[400]} />
            </View>
          )}
        </View>

        {/* 右: スポット情報 */}
        <View className="flex-1 ml-3 justify-between">
          {/* 上部: スポット名 + 三点リーダ */}
          <View className="flex-row">
            <View className="flex-1">
              {/* スポット名 */}
              <Text
                className="text-sm font-semibold text-foreground dark:text-dark-foreground"
                numberOfLines={1}
              >
                {spotName}
              </Text>
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
            <View style={{ marginRight: -8 }}>
              <PopupMenu
                items={menuItems}
                triggerColor={colors.text.secondary}
                triggerIcon="ellipsis-vertical"
              />
            </View>
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
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}
    </Pressable>
  );
}
