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

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR, getThumbnailHeight, iconSizeNum } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useMapBookmarkMenu } from '@/features/map-bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail, UserAvatar, PrivateBadge } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

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

export interface MapListCardProps {
  map: MapWithUser;
  currentUserId?: string | null;
  /** オーナーかどうか（編集・削除メニュー表示用） */
  isOwner?: boolean;
  /** ランキング番号（指定時にバッジ表示） */
  rank?: number;
  /** カード全体タップ時（記事への遷移用） */
  onPress?: () => void;
  onEdit?: (mapId: string) => void;
  onDelete?: (mapId: string) => void;
  /** マップアイコンタップ時（マップ画面への遷移用） */
  onMapPress?: (mapId: string) => void;
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
  onMapPress,
  onUserPress,
}: MapListCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useMapBookmarkMenu({
    mapId: map.id,
    currentUserId,
  });

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
          router.push(`/report?targetType=map&targetId=${map.id}`);
        },
      },
    ];
  }, [map.id, onEdit, onDelete, isOwner, currentUserId, router, t, bookmarkMenuItem]);

  return (
    <View className="bg-surface">
      <Pressable
        onPress={onPress}
        className="px-4 py-3"
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
                  className="text-sm font-semibold text-on-surface flex-shrink"
                  numberOfLines={1}
                >
                  {map.name}
                </Text>
                <View className="flex-row items-center ml-1.5 flex-shrink-0">
                  {/* 非公開マップは鍵アイコン、公開マップはピンアイコン */}
                  {isOwner && map.is_public === false ? (
                    <PrivateBadge size={iconSizeNum.xs} />
                  ) : (
                    <LocationPinIcon
                      size={iconSizeNum.xs}
                      color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
                    />
                  )}
                  <Text className="text-xs text-on-surface-variant ml-0.5">
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
                  className="flex-row items-center mt-2 self-start"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <UserAvatar
                    url={map.user.avatar_url}
                    alt={map.user.display_name || map.user.username || 'User'}
                    className="w-4 h-4 mr-1"
                    iconSize={10}
                  />
                  <Text
                    className="text-xs text-on-surface-variant"
                    numberOfLines={1}
                  >
                    {map.user.display_name || map.user.username}
                  </Text>
                </Pressable>
              )}
            </View>
            {/* 右上: 三点リーダメニュー（オーナー: 編集・削除、非オーナー: 通報） */}
            <PopupMenu
              items={menuItems}
              triggerIcon="ellipsis-vertical"
            />
          </View>

          {/* 下部: 日付・マップアイコン */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-on-surface-variant">
              {formatRelativeTime(map.created_at, locale)}
            </Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onMapPress?.(map.id);
              }}
              className="p-3"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: -8, marginBottom: -8 }}
            >
              <Ionicons name="map-outline" size={iconSizeNum.sm} className="text-on-surface-variant" />
            </Pressable>
          </View>
        </View>
      </View>

        {/* ブックマークフォルダ選択モーダル */}
        {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
      </Pressable>
      {/* 下部ボーダー（両端に余白） */}
      <View className="mx-4 border-b-hairline border-outline-variant" />
    </View>
  );
}
