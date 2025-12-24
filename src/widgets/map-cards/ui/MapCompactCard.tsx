/**
 * MapCompactCard コンポーネント
 *
 * マイページ・コレクション用のコンパクトなマップカード
 * サムネイル64×64 + 右側に情報
 *
 * 使用箇所:
 * - マイページ マップタブ（MapsTab）
 * - ユーザープロフィール マップタブ
 * - コレクション詳細ページ
 */

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { formatRelativeTime } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';
import { PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

// ===============================
// Props
// ===============================

export interface MapCompactCardProps {
  map: MapWithUser;
  currentUserId?: string | null;
  /** オーナーかどうか（編集・削除メニュー表示用） */
  isOwner?: boolean;
  onPress?: () => void;
  onEdit?: (mapId: string) => void;
  onDelete?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
  onUserPress?: (userId: string) => void;
}

// ===============================
// Component
// ===============================

export function MapCompactCard({
  map,
  currentUserId,
  isOwner,
  onPress,
  onEdit,
  onDelete,
  onArticlePress,
  onUserPress,
}: MapCompactCardProps) {
  const { t } = useI18n();
  // 記事公開状態
  const isArticlePublic = map.is_article_public === true;

  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // オーナーのみメニュー表示
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (!isOwner) return [];

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
  }, [map.id, onEdit, onDelete, isOwner, t]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light"
    >
      <View className="flex-row items-start">
        {/* サムネイル */}
        <MapThumbnail
          url={map.thumbnail_url}
          width={64}
          height={64}
          className="mr-3"
        />

        {/* マップ情報 */}
        <View className="flex-1">
          {/* マップ名 + スポット数 */}
          <View className="flex-row items-center mb-1">
            <Text
              className="text-base font-semibold text-foreground dark:text-dark-foreground flex-shrink"
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

          {/* 説明文 */}
          {map.description && (
            <Text
              className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2"
              numberOfLines={2}
            >
              {map.description}
            </Text>
          )}

          {/* アクションボタン（説明の下） */}
          <View className="flex-row items-center gap-4">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count ?? 0}
              size={14}
              onCountPress={() => setIsLikersModalVisible(true)}
            />

            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              bookmarksCount={map.bookmarks_count ?? 0}
              size={14}
              showCount
            />

            {/* 作成日時 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at)}
            </Text>
          </View>
        </View>

        {/* 公開/非公開アイコン + 記事アイコン + メニュー */}
        <View className="flex-row items-center">
          {!map.is_public && (
            <View className="mr-2">
              <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
            </View>
          )}
          {/* 記事アイコン（オーナーは常に表示、他ユーザーは公開時のみ） */}
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
          {/* オーナーのみ三点リーダメニューを表示 */}
          {isOwner && (
            <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
          )}
        </View>
      </View>

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        mapId={map.id}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={onUserPress}
      />
    </Pressable>
  );
}
