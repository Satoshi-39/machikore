/**
 * マイページ マップタブ
 *
 * ユーザーが作成したカスタムマップの一覧を表示
 * コンパクトなカードレイアウト（サムネイル左、情報右）
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, USER_MAP_THEME_COLORS, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useCurrentTab, showLoginRequiredAlert } from '@/shared/lib';
import { useUserMaps, useDeleteMap } from '@/entities/map';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import { AsyncBoundary, PopupMenu, type PopupMenuItem, LocationPinIcon, MapThumbnail } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

interface MapsTabProps {
  /** 表示対象のユーザーID */
  userId: string | null;
  /** 現在ログイン中のユーザーID */
  currentUserId?: string | null;
}

interface MyPageMapCardProps {
  map: MapWithUser;
  currentUserId?: string | null;
  isOwner?: boolean;
  onPress?: () => void;
  onEdit?: (mapId: string) => void;
  onDelete?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
  onUserPress?: (userId: string) => void;
}

function MyPageMapCard({
  map,
  currentUserId,
  isOwner,
  onPress,
  onEdit,
  onDelete,
  onArticlePress,
  onUserPress,
}: MyPageMapCardProps) {
  const isDarkMode = useIsDarkMode();
  const createdDate = new Date(map.created_at);

  // 記事公開状態
  const isArticlePublic = map.is_article_public === true;
  const formattedDate = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;

  // いいね状態
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

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, mapId: map.id });
  };

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

  // オーナーのみメニュー表示
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (!isOwner) return [];

    return [
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
        onPress: () => onDelete?.(map.id),
      },
    ];
  }, [map.id, onEdit, onDelete, isOwner]);

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
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-1">
            {map.name}
          </Text>
          {map.description && (
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2" numberOfLines={2}>
              {map.description}
            </Text>
          )}

          {/* アクションボタン（説明の下） */}
          <View className="flex-row items-center gap-5">
            {/* スポット数 */}
            <View className="flex-row items-center">
              <LocationPinIcon
                size={14}
                color={USER_MAP_THEME_COLORS[map.theme_color as UserMapThemeColor].color}
                strokeColor={getThemeColorStroke(map.theme_color as UserMapThemeColor, isDarkMode)}
              />
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {map.spots_count}
              </Text>
            </View>

            {/* いいね（アイコン：いいねトグル、数字：ユーザー一覧） */}
            <View className="flex-row items-center">
              <Pressable
                onPress={handleLikePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
                disabled={isTogglingLike}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={14}
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
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                  {map.likes_count ?? 0}
                </Text>
              </Pressable>
            </View>

            {/* ブックマーク */}
            <Pressable
              onPress={handleBookmarkPress}
              className="flex-row items-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={14}
                color={isBookmarked ? colors.primary.DEFAULT : colors.text.secondary}
              />
            </Pressable>

            {/* 作成日 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formattedDate}
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

export function MapsTab({ userId, currentUserId }: MapsTabProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const { data: maps, isLoading, error } = useUserMaps(userId, { currentUserId });
  const { mutate: deleteMap } = useDeleteMap();

  // 自分のマップかどうか
  const isOwner = userId === currentUserId;

  const handleMapPress = (map: MapWithUser) => {
    router.push(`/(tabs)/${currentTab}/maps/${map.id}` as any);
  };

  const handleEdit = (mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  };

  const handleDelete = (mapId: string) => {
    Alert.alert(
      'マップを削除',
      'このマップを削除しますか？関連するスポットも全て削除されます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteMap(mapId),
        },
      ]
    );
  };

  const handleArticlePress = (mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as any);
  };

  const handleUserPress = (targetUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${targetUserId}` as any);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps}
      loadingMessage="マップを読み込み中..."
      emptyMessage="まだマップを作成していません"
      emptyIonIcon="map"
    >
      {(data) => (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MyPageMapCard
              map={item}
              currentUserId={currentUserId}
              isOwner={isOwner}
              onPress={() => handleMapPress(item)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArticlePress={handleArticlePress}
              onUserPress={handleUserPress}
            />
          )}
          className="bg-surface dark:bg-dark-surface"
          contentContainerClassName="flex-grow"
        />
      )}
    </AsyncBoundary>
  );
}
