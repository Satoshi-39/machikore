/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, getThumbnailHeight, avatarSizeNum, iconSizeNum } from '@/shared/config';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail, PrivateBadge, TagChip } from '@/shared/ui';
import { shareMap } from '@/shared/lib';
import type { MapWithUser, UUID } from '@/shared/types';
import { useUser } from '@/entities/user';
import { formatRelativeTime } from '@/shared/lib/utils';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';
import { useI18n } from '@/shared/lib/i18n';

interface MapCardProps {
  map: MapWithUser;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のマップか判定用）
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onEdit?: (mapId: string) => void;
  onReport?: (mapId: string) => void;
  onCommentPress?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
  onTagPress?: (tagName: string) => void;
  /** 下部ボーダーを非表示にする */
  noBorder?: boolean;
}

export function MapCard({ map, currentUserId, onPress: onMapPress, onUserPress, onEdit, onReport, onCommentPress, onArticlePress, onTagPress, noBorder = false }: MapCardProps) {
  const { t, locale } = useI18n();
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = map.user;
  const tags = map.tags;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  const screenWidth = Dimensions.get('window').width;
  const thumbnailWidth = screenWidth - 32;
  const thumbnailHeight = getThumbnailHeight(thumbnailWidth);

  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const isOwner = currentUserId && map.user_id === currentUserId;

  // 共有処理
  const handleSharePress = useCallback(async (e: any) => {
    e.stopPropagation();
    await shareMap(map.id);
  }, [map.id]);

  // オーナー用メニュー（編集のみ）
  const ownerMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: t('menu.edit'),
      icon: 'create-outline',
      onPress: () => onEdit?.(map.id),
    },
  ], [map.id, onEdit, t]);

  // ゲスト用メニュー（通報）
  const guestMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'report',
      label: t('menu.report'),
      icon: 'flag-outline',
      onPress: () => onReport?.(map.id),
    },
  ], [map.id, onReport, t]);

  // メインコンテンツタップ時の処理（onArticlePressがあれば記事へ、なければマップへ）
  const handleContentPress = useCallback(() => {
    if (onArticlePress) {
      onArticlePress(map.id);
    } else {
      onMapPress?.();
    }
  }, [onArticlePress, onMapPress, map.id]);

  return (
    <View
      className={`bg-surface p-4 ${noBorder ? '' : 'border-b-thin border-outline'}`}
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコン（タップでプロフィールへ） */}
        <Pressable
          onPress={() => onUserPress?.(map.user_id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {avatarUri ? (
            <Image
              source={{ uri: getOptimizedImageUrl(avatarUri, IMAGE_PRESETS.avatar) || avatarUri }}
              style={{ width: avatarSizeNum.lg, height: avatarSizeNum.lg, borderRadius: avatarSizeNum.lg / 2, marginRight: 12 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-secondary justify-center items-center mr-3">
              <Ionicons name="person" size={iconSizeNum.md} className="text-on-surface-variant" />
            </View>
          )}
        </Pressable>

        {/* ユーザー名と時間（タップで記事へ） */}
        <Pressable onPress={handleContentPress} className="flex-1">
          <Text className="text-sm font-semibold text-on-surface">
            {user?.display_name || user?.username || t('mapCard.defaultUser')}
          </Text>
          <Text className="text-xs text-on-surface-variant">
            {formatRelativeTime(map.created_at, locale)}
          </Text>
        </Pressable>

        {/* マップアイコン（タップでマップ画面へ） */}
        <Pressable
          onPress={() => onMapPress?.()}
          className="p-3 mr-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="map-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
        </Pressable>

        {/* 三点リーダーメニュー */}
        {isOwner ? (
          <PopupMenu items={ownerMenuItems} />
        ) : currentUserId && !isOwner ? (
          <PopupMenu items={guestMenuItems} />
        ) : null}
      </View>

      {/* サムネイル画像（タップで記事へ） */}
      <Pressable onPress={handleContentPress}>
        <MapThumbnail
          url={map.thumbnail_url}
          width={thumbnailWidth}
          height={thumbnailHeight}
          className="mb-3"
        />
      </Pressable>

      {/* マップ名とスポット数（タップで記事へ） */}
      <Pressable onPress={handleContentPress}>
        <View className="flex-row items-center mb-2">
          <Ionicons name="map" size={iconSizeNum.sm} className="text-primary" />
          <Text className="text-base font-semibold text-on-surface ml-2" numberOfLines={1}>
            {map.name}
          </Text>
          {'spots_count' in map && (
            <View className="flex-row items-center ml-3">
              {/* 非公開マップは鍵アイコン、公開マップはピンアイコン */}
              {isOwner && map.is_public === false ? (
                <PrivateBadge size={iconSizeNum.xs} />
              ) : (
                <LocationPinIcon
                  size={iconSizeNum.xs}
                  color={colors.light.primary}
                />
              )}
              <Text className="text-xs text-on-surface-variant ml-1">
                {map.spots_count}
              </Text>
            </View>
          )}
        </View>

        {/* 説明 */}
        {map.description && (
          <Text className="text-sm text-on-surface-variant mb-2" numberOfLines={2}>
            {map.description}
          </Text>
        )}
      </Pressable>

      {/* タグ */}
      {tags && tags.length > 0 && (
        <View className="flex-row flex-wrap mb-2">
          {tags.slice(0, 5).map((tag) => (
            <TagChip key={tag.id} name={tag.name} onPress={onTagPress} />
          ))}
        </View>
      )}

      {/* フッター情報 - 均等配置 */}
      <View className="flex-row items-center justify-around mt-2">
        {/* コメント */}
        <Pressable
          onPress={() => onCommentPress?.(map.id)}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
          <Text className="text-sm text-on-surface-variant ml-2">
            {map.comments_count ?? 0}
          </Text>
        </Pressable>

        {/* いいね */}
        <View className="py-2 px-3">
          <MapLikeButton
            mapId={map.id}
            currentUserId={currentUserId}
            likesCount={map.likes_count ?? 0}
            size={iconSizeNum.md}
            onCountPress={() => setIsLikersModalVisible(true)}
            isLiked={map.is_liked}
            textMarginClassName="ml-2"
          />
        </View>

        {/* ブックマーク */}
        <View className="py-2 px-3">
          <MapBookmarkButton
            mapId={map.id}
            currentUserId={currentUserId}
            size={iconSizeNum.md}
            isBookmarked={map.is_bookmarked}
          />
        </View>

        {/* 共有 */}
        <Pressable
          onPress={handleSharePress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="share-outline"
            size={iconSizeNum.md}
            className="text-on-surface-variant"
          />
        </Pressable>
      </View>

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        mapId={map.id}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={onUserPress}
      />
    </View>
  );
}
