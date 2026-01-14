/**
 * MapListCard コンポーネント
 *
 * リスト表示用マップカード（サムネイル + 右側に情報）
 *
 * 使用箇所:
 * - マイページ マップタブ（MapsTab）
 * - ユーザープロフィール マップタブ
 * - コレクション詳細ページ
 * - いいね一覧
 * - ブックマーク一覧
 * - 最近見たマップ一覧
 * - 本日のピックアップ一覧
 * - 人気マップランキング一覧
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR, getThumbnailHeight } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail, UserAvatar } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

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

export interface MapListCardProps {
  map: MapWithUser;
  currentUserId?: string | null;
  /** オーナーかどうか（編集・削除メニュー表示用） */
  isOwner?: boolean;
  /** ランキング番号（指定時にバッジ表示） */
  rank?: number;
  onPress?: () => void;
  onEdit?: (mapId: string) => void;
  onDelete?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
  onUserPress?: (userId: string) => void;
}

// ===============================
// Component
// ===============================

export function MapListCard({
  map,
  currentUserId,
  isOwner,
  rank,
  onPress,
  onEdit,
  onDelete,
  onArticlePress,
  onUserPress,
}: MapListCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  // 記事公開状態
  const isArticlePublic = map.is_article_public === true;

  // ブックマーク機能
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, map.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();

  const handleAddToFolder = useCallback(
    (folderId: string | null) => {
      if (!currentUserId) return;
      addBookmark({ userId: currentUserId, mapId: map.id, folderId });
    },
    [currentUserId, map.id, addBookmark]
  );

  const handleRemoveFromFolder = useCallback(
    (folderId: string | null) => {
      if (!currentUserId) return;
      removeFromFolder({ userId: currentUserId, mapId: map.id, folderId });
    },
    [currentUserId, map.id, removeFromFolder]
  );

  // メニューアイテム（オーナー: 編集・削除、非オーナー: 保存・通報）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (isOwner) {
      return [
        {
          id: 'edit',
          label: t('common.edit'),
          icon: 'create-outline',
          onPress: () => onEdit?.(map.id),
        },
        {
          id: 'delete',
          label: t('common.delete'),
          icon: 'trash-outline',
          destructive: true,
          onPress: () => onDelete?.(map.id),
        },
      ];
    }
    // 非オーナーの場合は保存・通報メニュー
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
          router.push(`/report?targetType=map&targetId=${map.id}`);
        },
      },
    ];
  }, [map.id, onEdit, onDelete, isOwner, currentUserId, router, t, isBookmarked]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light"
    >
      <View className="flex-row items-start">
        {/* 左: サムネイル + ランキングバッジ */}
        <View className="relative">
          <MapThumbnail
            url={map.thumbnail_url}
            width={128}
            height={getThumbnailHeight(128)}
          />
          {/* ランキングバッジ（サムネイル左上に重ねる） */}
          {rank !== undefined && (
            <View
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                backgroundColor: getRankColor(rank),
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-white text-xs font-bold">{rank}</Text>
            </View>
          )}
        </View>

        {/* 右: マップ情報 */}
        <View className="flex-1 ml-3 justify-between">
          {/* 上部: マップ名 + スポット数 + 三点リーダ */}
          <View className="flex-row">
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  className="text-sm font-semibold text-foreground dark:text-dark-foreground flex-shrink"
                  numberOfLines={1}
                >
                  {map.name}
                </Text>
                <View className="flex-row items-center ml-1.5 flex-shrink-0">
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
                    onUserPress?.(map.user!.id);
                  }}
                  className="flex-row items-center mt-1 self-start"
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
            </View>
            {/* 右上: 三点リーダメニュー（オーナー: 編集・削除、非オーナー: 通報） */}
            <View style={{ marginRight: -8 }}>
              <PopupMenu
                items={menuItems}
                triggerColor={colors.text.secondary}
                triggerIcon="ellipsis-vertical"
              />
            </View>
          </View>

          {/* 下部: 日付・アイコン群 */}
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at, locale)}
            </Text>
            <View className="flex-row items-center">
              {!map.is_public && (
                <View className="mr-2">
                  <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
                </View>
              )}
              {(isOwner || isArticlePublic) && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onArticlePress?.(map.id);
                  }}
                  className="p-1 mr-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="document-text-outline" size={18} color={colors.text.secondary} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ブックマークフォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="maps"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}
    </Pressable>
  );
}
