/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail } from '@/shared/ui';
import { showLoginRequiredAlert, shareMap } from '@/shared/lib';
import type { MapRow } from '@/shared/types/database.types';
import type { MapWithUser, UUID } from '@/shared/types';
import { useUser } from '@/entities/user';
import { useDeleteMap } from '@/entities/map/api';
import { formatRelativeTime } from '@/shared/lib/utils';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';
import { useI18n } from '@/shared/lib/i18n';

interface MapCardProps {
  map: MapRow | MapWithUser;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のマップか判定用）
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onEdit?: (mapId: string) => void;
  onCommentPress?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
  /** 下部ボーダーを非表示にする */
  noBorder?: boolean;
}

export function MapCard({ map, currentUserId, onPress, onUserPress, onEdit, onCommentPress, onArticlePress, noBorder = false }: MapCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = 'user' in map ? map.user : null;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  const screenWidth = Dimensions.get('window').width;

  const { mutate: deleteMap } = useDeleteMap();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事公開状態（MapWithUserの場合のみ）
  const isArticlePublic = 'is_article_public' in map && map.is_article_public === true;

  // 共有処理
  const handleSharePress = useCallback(async (e: any) => {
    e.stopPropagation();
    await shareMap(map.id);
  }, [map.id]);

  const handleDelete = () => {
    Alert.alert(
      t('mapCard.deleteTitle'),
      t('mapCard.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteMap(map.id),
        },
      ]
    );
  };

  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];

    // オーナーの場合: 編集・削除
    if (isOwner) {
      items.push(
        {
          id: 'edit',
          label: t('menu.edit'),
          icon: 'create-outline',
          onPress: () => onEdit?.(map.id),
        },
        {
          id: 'delete',
          label: t('menu.delete'),
          icon: 'trash-outline',
          destructive: true,
          onPress: handleDelete,
        }
      );
    } else {
      // 他ユーザーの場合: 報告する
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
  }, [map.id, onEdit, isOwner, currentUserId, router, t]);

  return (
    <Pressable
      onPress={onPress}
      className={`bg-surface dark:bg-dark-surface p-4 ${noBorder ? '' : 'border-b border-border dark:border-dark-border'}`}
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコン（タップでプロフィールへ） */}
        <Pressable onPress={() => onUserPress?.(map.user_id)}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted justify-center items-center mr-3">
              <Ionicons name="person" size={20} color={colors.gray[500]} />
            </View>
          )}
        </Pressable>

        {/* ユーザー名と時間 */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(map.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
              {user?.display_name || user?.username || t('mapCard.defaultUser')}
            </Text>
          </Pressable>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
            {formatRelativeTime(map.created_at)}
          </Text>
        </View>

        {/* 記事アイコン（オーナーは常に表示、他ユーザーは公開時のみ） */}
        {(isOwner || isArticlePublic) && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onArticlePress?.(map.id);
            }}
            className="p-2 mr-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />
          </Pressable>
        )}

        {/* 三点リーダーメニュー */}
        <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
      </View>

      {/* サムネイル画像 */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={screenWidth - 32}
        height={160}
        defaultImagePadding={0.1}
        className="mb-3"
      />

      {/* マップ名とスポット数 */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="map" size={18} color={colors.primary.DEFAULT} />
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2" numberOfLines={1}>
          {map.name}
        </Text>
        {'spots_count' in map && (
          <View className="flex-row items-center ml-3">
            <LocationPinIcon
              size={14}
              color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
            />
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
              {map.spots_count}
            </Text>
          </View>
        )}
      </View>

      {/* 説明 */}
      {map.description && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2" numberOfLines={2}>
          {map.description}
        </Text>
      )}

      {/* フッター情報 - 均等配置 */}
      <View className="flex-row items-center justify-around mt-2">
        {/* コメント */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onCommentPress?.(map.id);
          }}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {map.comments_count ?? 0}
          </Text>
        </Pressable>

        {/* いいね */}
        <View className="py-2 px-3">
          <MapLikeButton
            mapId={map.id}
            currentUserId={currentUserId}
            likesCount={map.likes_count ?? 0}
            size={18}
            onCountPress={() => setIsLikersModalVisible(true)}
          />
        </View>

        {/* ブックマーク */}
        <View className="py-2 px-3">
          <MapBookmarkButton
            mapId={map.id}
            currentUserId={currentUserId}
            bookmarksCount={map.bookmarks_count ?? 0}
            size={18}
            showCount
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
            size={18}
            color={colors.text.secondary}
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
    </Pressable>
  );
}
