/**
 * MapListCard コンポーネント
 *
 * 縦リスト表示用のマップカード
 * 左にサムネイル、右に情報のレイアウト
 *
 * 使用箇所:
 * - 最近見たマップ一覧（ViewHistoryPage）
 * - 本日のピックアップ一覧（TodayPicksPage）
 * - 人気マップランキング一覧（PopularMapsPage）
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { MapWithUser } from '@/shared/types';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { showLoginRequiredAlert, formatRelativeTime } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

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
  onPress: () => void;
  onUserPress: () => void;
  onArticlePress: () => void;
  /** ランキング番号（指定時にバッジ表示） */
  rank?: number;
}

// ===============================
// Component
// ===============================

export function MapListCard({
  map,
  onPress,
  onUserPress,
  onArticlePress,
  rank,
}: MapListCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 三点リーダーメニュー
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

  const handleArticlePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      onArticlePress();
    },
    [onArticlePress]
  );

  const handleUserPress = useCallback(
    (e: any) => {
      e.stopPropagation();
      onUserPress();
    },
    [onUserPress]
  );

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
    >
      {/* ランキングバッジ */}
      {rank !== undefined && (
        <View
          style={{
            backgroundColor: getRankColor(rank),
            borderRadius: 12,
            width: 28,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text className="text-white text-sm font-bold">{rank}</Text>
        </View>
      )}

      {/* サムネイル */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={80}
        height={80}
        borderRadius={8}
        defaultImagePadding={0.15}
      />

      {/* マップ情報 */}
      <View className="flex-1 ml-3">
        {/* 1行目: マップ名 + スポット数 | 記事アイコン + 三点リーダー */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
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
          {/* 記事アイコン + 三点リーダー（右上） */}
          <View className="flex-row items-center">
            {(isOwner || map.is_article_public) && (
              <Pressable onPress={handleArticlePress} className="flex-row items-center">
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
                />
              </Pressable>
            )}
            {!isOwner && (
              <PopupMenu
                items={menuItems}
                triggerSize={16}
                triggerColor={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
              />
            )}
          </View>
        </View>

        {/* 2行目: ユーザー情報 */}
        {map.user && (
          <Pressable onPress={handleUserPress} className="flex-row items-center mt-1">
            {map.user.avatar_url ? (
              <Image
                source={{ uri: map.user.avatar_url }}
                className="w-4 h-4 rounded-full mr-1"
              />
            ) : (
              <View className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-1">
                <Ionicons name="person" size={10} color={colors.gray[400]} />
              </View>
            )}
            <Text
              className="text-xs text-foreground-muted dark:text-dark-foreground-muted"
              numberOfLines={1}
            >
              {map.user.display_name || map.user.username}
            </Text>
          </Pressable>
        )}

        {/* 3行目: いいね・ブックマーク・作成日時 */}
        <View className="flex-row items-center mt-1.5 gap-3">
          {/* いいね */}
          <MapLikeButton
            mapId={map.id}
            currentUserId={currentUserId}
            likesCount={map.likes_count}
            size={14}
            inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
            onCountPress={() => setIsLikersModalVisible(true)}
          />
          {/* ブックマーク */}
          <MapBookmarkButton
            mapId={map.id}
            currentUserId={currentUserId}
            bookmarksCount={map.bookmarks_count ?? 0}
            size={14}
            showCount
            inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
          />
          {/* 作成日時 */}
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            {formatRelativeTime(map.created_at, locale)}
          </Text>
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
