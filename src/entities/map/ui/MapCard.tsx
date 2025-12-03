/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { MapRow } from '@/shared/types/database.types';
import type { MapWithUser, UUID } from '@/shared/types';
import { useUser } from '@/entities/user';
import { useDeleteMap } from '@/entities/map/api';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

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
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = 'user' in map ? map.user : null;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

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

  const isOwner = currentUserId && map.user_id === currentUserId;

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

    // 記事を見る（常に表示、非公開の場合は記事ページ側で対応）
    items.push({
      id: 'article',
      label: '記事を見る',
      icon: 'document-text-outline',
      onPress: () => onArticlePress?.(map.id),
    });

    // オーナーのみ編集・削除を表示
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
    }

    return items;
  }, [map.id, onEdit, onArticlePress, isOwner]);

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

        {/* 三点リーダーメニュー */}
        <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
      </View>

      {/* サムネイル画像 */}
      {map.thumbnail_url && (
        <Image
          source={{ uri: map.thumbnail_url }}
          className="w-full h-40 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

      {/* マップ名 */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="map" size={18} color={colors.primary.DEFAULT} />
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
          {map.name}
        </Text>
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
        <Pressable
          onPress={handleLikePress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={isTogglingLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#EF4444' : colors.text.secondary}
          />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {map.likes_count ?? 0}
          </Text>
        </Pressable>

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
    </Pressable>
  );
}
