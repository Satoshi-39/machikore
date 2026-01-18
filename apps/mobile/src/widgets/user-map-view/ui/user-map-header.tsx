/**
 * ユーザーマップヘッダーWidget
 *
 * ユーザーマップ専用のヘッダー表示
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import {
  useBookmarkMap,
  useMapBookmarkInfo,
  useUnbookmarkMapFromFolder,
} from '@/entities/bookmark';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { colors } from '@/shared/config';
import { shareMap, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { SpotWithDetails, TagBasicInfo } from '@/shared/types';
import { ImageViewerModal, PopupMenu, type PopupMenuItem, UserAvatar } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import { MapInfoModal } from './MapInfoModal';

interface UserMapHeaderProps {
  isLoading?: boolean;
  mapId: string;
  mapTitle?: string;
  /** マップの概要 */
  mapDescription?: string | null;
  /** マップのサムネイルURL */
  mapThumbnailUrl?: string | null;
  /** マップのタグ */
  mapTags?: TagBasicInfo[];
  /** マップ内のスポット一覧 */
  spots?: SpotWithDetails[];
  userId?: string | null;
  /** 現在ログイン中のユーザーID（自分のマップ判定用） */
  currentUserId?: string | null;
  /** マップ所有者のID */
  mapOwnerId?: string | null;
  /** 記事が公開されているかどうか */
  isArticlePublic?: boolean;
  userName?: string;
  userAvatarUrl?: string;
  onBack?: () => void;
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onArticlePress?: () => void;
  onEditPress?: () => void;
  /** スポットタップ時のコールバック */
  onSpotPress?: (spotId: string) => void;
}

export function UserMapHeader({
  isLoading = false,
  mapId,
  mapTitle,
  mapDescription,
  mapThumbnailUrl,
  mapTags = [],
  spots = [],
  userId,
  currentUserId,
  mapOwnerId,
  isArticlePublic = false,
  userName,
  userAvatarUrl,
  onBack,
  onUserPress,
  onSearchPress,
  onArticlePress,
  onEditPress,
  onSpotPress,
}: UserMapHeaderProps) {
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // いいね状態を取得
  const { data: isLiked = false } = useCheckMapLiked(userId, mapId);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();

  // マップブックマーク状態を取得
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(userId, mapId);
  const isBookmarked = bookmarkInfo.length > 0;
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();

  // いいね処理
  const handleLikePress = useCallback(() => {
    if (!userId) {
      showLoginRequiredAlert(t('common.like'));
      return;
    }
    if (!mapId || isTogglingLike) return;
    toggleLike({ userId, mapId });
  }, [userId, mapId, isTogglingLike, toggleLike, t]);

  // ブックマーク処理（フォルダ選択モーダルを開く）
  const handleBookmarkPress = useCallback(() => {
    if (!userId) return;
    setIsFolderModalVisible(true);
  }, [userId]);

  // フォルダに追加
  const handleAddToFolder = useCallback(
    (folderId: string | null) => {
      if (!userId || !mapId) return;
      addBookmark({ userId, mapId, folderId });
    },
    [userId, mapId, addBookmark]
  );

  // フォルダから削除
  const handleRemoveFromFolder = useCallback(
    (folderId: string | null) => {
      if (!userId || !mapId) return;
      removeFromFolder({ userId, mapId, folderId });
    },
    [userId, mapId, removeFromFolder]
  );

  // 共有処理
  const handleSharePress = useCallback(async () => {
    if (!mapId) return;
    await shareMap(mapId);
  }, [mapId]);

  // 自分のマップかどうかを判定
  const isOwnMap = currentUserId && mapOwnerId && currentUserId === mapOwnerId;

  // ポップアップメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];

    // 自分のマップの場合は編集ボタンを先頭に追加
    if (isOwnMap && onEditPress) {
      items.push({
        id: 'edit',
        label: t('map.editMap'),
        icon: 'create-outline',
        onPress: onEditPress,
      });
    }

    // 記事が公開されているまたは自分のマップの場合のみ「記事を見る」を表示
    if (isArticlePublic || isOwnMap) {
      items.push({
        id: 'article',
        label: t('menu.viewArticle'),
        icon: 'document-text-outline',
        onPress: () => onArticlePress?.(),
      });
    }

    items.push(
      {
        id: 'bookmark',
        label: isBookmarked ? t('bookmark.saved') : t('bookmark.save'),
        icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
        iconColor: undefined, // デフォルト色を使用
        closeOnSelect: false,
        onPress: handleBookmarkPress,
      },
      {
        id: 'share',
        label: t('common.share'),
        icon: 'share-outline',
        onPress: handleSharePress,
      }
    );

    return items;
  }, [
    isOwnMap,
    isArticlePublic,
    isBookmarked,
    handleBookmarkPress,
    handleSharePress,
    onArticlePress,
    onEditPress,
    t,
  ]);

  const handleMapTitlePress = () => {
    // マップ詳細情報がある場合はドロップダウンを開く
    if (mapTitle || mapDescription || mapTags.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // ローディング時の表示
  if (isLoading) {
    return (
      <View
        className="bg-surface dark:bg-dark-surface-elevated px-4 py-3 rounded-full"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: isDarkMode ? 8 : 4,
          elevation: isDarkMode ? 8 : 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* 左側：戻るボタン + ローディング */}
          <View className="flex-row items-center" style={{ flex: 0.8 }}>
            <Pressable onPress={onBack} className="mr-2.5">
              <Ionicons
                name="arrow-back"
                size={23}
                color={
                  isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary
                }
              />
            </Pressable>
            <ActivityIndicator
              size="small"
              color={
                isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary
              }
            />
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-2.5">
              {t('common.loading')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className="bg-surface dark:bg-dark-surface-elevated px-4 py-3 rounded-full"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.4 : 0.15,
        shadowRadius: isDarkMode ? 8 : 4,
        elevation: isDarkMode ? 8 : 4,
      }}
    >
      {/* ユーザーマップ：戻るボタン + ユーザーアイコン + マップ名（左）、アクションボタン群（右） */}
      <View className="flex-row items-center justify-between">
        {/* 左側：戻るボタン + ユーザーアイコン + マップ名 */}
        <View className="flex-row items-center flex-1 mr-2">
          {/* 戻るボタン */}
          <Pressable onPress={onBack} className="mr-2.5">
            <Ionicons
              name="arrow-back"
              size={23}
              color={
                isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary
              }
            />
          </Pressable>

          {/* ユーザーアイコン */}
          <Pressable
            onPress={onUserPress}
            onLongPress={() => userAvatarUrl && setIsAvatarModalVisible(true)}
            className="mr-2.5"
          >
            <UserAvatar
              url={userAvatarUrl}
              alt={userName || 'User'}
              className="w-10 h-10"
              iconSize={20}
            />
          </Pressable>

          {/* マップ名 - クリックでドロップダウン表示 */}
          <View className="flex-1 flex-shrink">
            <Pressable
              onPress={handleMapTitlePress}
              className="flex-row items-center"
            >
              <Text
                className="text-base font-bold text-foreground dark:text-dark-foreground flex-shrink"
                numberOfLines={1}
              >
                {mapTitle || t('userMap.usersMap', { name: userName || '' })}
              </Text>
              <Ionicons
                name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={19}
                color="#6B7280"
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>
        </View>

        {/* 右側：アクションボタン群 */}
        <View className="flex-row items-center gap-1.5">
          {/* スポット検索ボタン（自分のマップのみ表示） */}
          {isOwnMap && (
            <Pressable
              onPress={onSearchPress}
              className="items-center justify-center"
            >
              <Ionicons
                name="add-outline"
                size={25}
                color={
                  isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary
                }
              />
            </Pressable>
          )}

          {/* いいねボタン（他人のマップのみ表示） */}
          {!isOwnMap && (
            <Pressable
              onPress={handleLikePress}
              disabled={isTogglingLike}
              className="items-center justify-center"
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={25}
                color={isLiked ? colors.danger : (isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary)}
              />
            </Pressable>
          )}

          {/* 三点リーダメニュー */}
          <PopupMenu
            items={menuItems}
            triggerSize={23}
            triggerColor={
              isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary
            }
            respectSafeArea
          />
        </View>
      </View>

      {/* マップ情報モーダル */}
      <MapInfoModal
        visible={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        mapTitle={mapTitle}
        mapDescription={mapDescription}
        mapThumbnailUrl={mapThumbnailUrl}
        mapTags={mapTags}
        spots={spots}
        onSpotPress={onSpotPress}
        currentUserId={currentUserId}
        mapOwnerId={mapOwnerId ?? undefined}
      />

      {/* フォルダ選択モーダル */}
      {userId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={userId}
          folderType="maps"
          mapId={mapId}
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}

      {/* アバター拡大モーダル */}
      {userAvatarUrl && (
        <ImageViewerModal
          visible={isAvatarModalVisible}
          images={[userAvatarUrl]}
          onClose={() => setIsAvatarModalVisible(false)}
        />
      )}
    </View>
  );
}
