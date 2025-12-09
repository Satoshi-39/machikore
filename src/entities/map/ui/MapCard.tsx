/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Share, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, USER_MAP_THEME_COLORS, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PopupMenu, type PopupMenuItem, LocationPinIcon } from '@/shared/ui';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { MapRow } from '@/shared/types/database.types';
import type { MapWithUser, UUID } from '@/shared/types';
import { useUser } from '@/entities/user';
import { useDeleteMap } from '@/entities/map/api';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';

interface MapCardProps {
  map: MapRow | MapWithUser;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のマップか判定用）
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onEdit?: (mapId: string) => void;
  onCommentPress?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
}

export function MapCard({ map, currentUserId, onPress, onUserPress, onEdit, onCommentPress, onArticlePress }: MapCardProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = 'user' in map ? map.user : null;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  // サムネイル画像のローディング状態
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(!!map.thumbnail_url);
  const screenWidth = Dimensions.get('window').width;

  const { mutate: deleteMap } = useDeleteMap();
  const { data: isLiked = false } = useCheckMapLiked(currentUserId, map.id);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, map.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事公開状態（MapWithUserの場合のみ）
  const isArticlePublic = 'is_article_public' in map && map.is_article_public === true;

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, mapId: map.id });
  };

  // ブックマーク処理
  const handleBookmarkPress = useCallback((e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    setIsFolderModalVisible(true);
  }, [currentUserId]);

  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    addBookmark({ userId: currentUserId, mapId: map.id, folderId });
  }, [currentUserId, map.id, addBookmark]);

  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    removeFromFolder({ userId: currentUserId, mapId: map.id, folderId });
  }, [currentUserId, map.id, removeFromFolder]);

  // 共有処理
  const handleSharePress = useCallback(async (e: any) => {
    e.stopPropagation();
    try {
      const url = `machikore://maps/${map.id}`;
      await Share.share(Platform.select({
        ios: { message: `${map.name}をチェック！`, url },
        default: { message: `${map.name}をチェック！\n${url}` },
      })!);
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [map.name, map.id]);

  const handleDelete = () => {
    Alert.alert(
      'マップを削除',
      'このマップと含まれるすべてのスポットを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
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
          label: '編集',
          icon: 'create-outline',
          onPress: () => onEdit?.(map.id),
        },
        {
          id: 'delete',
          label: '削除',
          icon: 'trash-outline',
          destructive: true,
          onPress: handleDelete,
        }
      );
    } else {
      // 他ユーザーの場合: 報告する
      items.push({
        id: 'report',
        label: '報告する',
        icon: 'flag-outline',
        onPress: () => {
          if (!currentUserId) {
            showLoginRequiredAlert('報告');
            return;
          }
          router.push(`/report?targetType=map&targetId=${map.id}`);
        },
      });
    }

    return items;
  }, [map.id, onEdit, isOwner, currentUserId, router]);

  return (
    <Pressable
      onPress={onPress}
      className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border p-4"
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

        {/* ユーザー名（タップでプロフィールへ） */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(map.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
              {user?.display_name || user?.username || 'ユーザー'}
            </Text>
          </Pressable>
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

      {/* サムネイル画像（ローディング中はプレースホルダー表示でちらつき防止） */}
      {map.thumbnail_url && (
        <View className="mb-3" style={{ width: screenWidth - 32, height: 160 }}>
          {isThumbnailLoading && (
            <View
              className="absolute inset-0 bg-muted dark:bg-dark-muted rounded-lg"
              style={{ width: screenWidth - 32, height: 160 }}
            />
          )}
          <Image
            source={{ uri: map.thumbnail_url }}
            className="w-full h-full rounded-lg"
            style={{ width: screenWidth - 32, height: 160 }}
            resizeMode="cover"
            onLoad={() => setIsThumbnailLoading(false)}
          />
        </View>
      )}

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
              color={USER_MAP_THEME_COLORS[map.theme_color as UserMapThemeColor].color}
              strokeColor={getThemeColorStroke(map.theme_color as UserMapThemeColor, isDarkMode)}
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

        {/* いいね（アイコン：トグル、数字：ユーザー一覧） */}
        <View className="flex-row items-center py-2 px-3">
          <Pressable
            onPress={handleLikePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
            disabled={isTogglingLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#EF4444' : colors.text.secondary}
            />
          </Pressable>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setIsLikersModalVisible(true);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
          >
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
              {map.likes_count ?? 0}
            </Text>
          </Pressable>
        </View>

        {/* ブックマーク */}
        <Pressable
          onPress={handleBookmarkPress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isBookmarked ? colors.primary.DEFAULT : colors.text.secondary}
          />
        </Pressable>

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

      {/* フォルダ選択モーダル */}
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
