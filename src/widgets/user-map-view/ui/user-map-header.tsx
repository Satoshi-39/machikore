/**
 * ユーザーマップヘッダーWidget
 *
 * ユーザーマップ専用のヘッダー表示
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import type { MapWithUser } from '@/shared/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View, Modal, Animated, ActivityIndicator, Share, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem, ImageViewerModal } from '@/shared/ui';
import { log } from '@/shared/config/logger';

interface UserMapHeaderProps {
  isLoading?: boolean;
  mapId?: string | null;
  mapTitle?: string;
  userId?: string | null;
  /** 現在ログイン中のユーザーID（自分のマップ判定用） */
  currentUserId?: string | null;
  /** マップ所有者のID */
  mapOwnerId?: string | null;
  /** 記事が公開されているかどうか */
  isArticlePublic?: boolean;
  userName?: string;
  userAvatarUrl?: string;
  userMaps?: MapWithUser[];
  onBack?: () => void;
  onMapSelect?: (mapId: string) => void;
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onArticlePress?: () => void;
  onEditPress?: () => void;
}

export function UserMapHeader({
  isLoading = false,
  mapId,
  mapTitle,
  userId,
  currentUserId,
  mapOwnerId,
  isArticlePublic = false,
  userName,
  userAvatarUrl,
  userMaps = [],
  onBack,
  onMapSelect,
  onUserPress,
  onSearchPress,
  onArticlePress,
  onEditPress,
}: UserMapHeaderProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // いいね状態を取得
  const { data: isLiked = false } = useCheckMapLiked(userId, mapId);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();
  const slideAnim = useRef(new Animated.Value(-500)).current; // 初期位置: 画面上部の外側

  // マップブックマーク状態を取得
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(userId, mapId);
  const isBookmarked = bookmarkInfo.length > 0;
  // ブックマーク済みフォルダIDのSetを作成
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
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
  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!userId || !mapId) return;
    addBookmark({ userId, mapId, folderId });
  }, [userId, mapId, addBookmark]);

  // フォルダから削除
  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!userId || !mapId) return;
    removeFromFolder({ userId, mapId, folderId });
  }, [userId, mapId, removeFromFolder]);

  // 共有処理
  const handleSharePress = useCallback(async () => {
    try {
      const url = `machikore://maps/${mapId}`;
      const shareMessage = t('share.checkThis', { name: mapTitle || t('tabs.map') });
      await Share.share(Platform.select({
        ios: { message: shareMessage, url },
        default: { message: `${shareMessage}\n${url}` },
      })!);
    } catch (error) {
      log.error('[UserMapHeader] Share error:', error);
    }
  }, [mapTitle, mapId, t]);

  // 自分のマップかどうかを判定
  const isOwnMap = currentUserId && mapOwnerId && currentUserId === mapOwnerId;

  // ポップアップメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];

    // 自分のマップの場合は編集ボタンを先頭に追加
    if (isOwnMap && onEditPress) {
      items.push({
        id: 'edit',
        label: t('common.edit'),
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
        id: 'like',
        label: isLiked ? t('favorite.liked') : t('common.like'),
        icon: isLiked ? 'heart' : 'heart-outline',
        iconColor: isLiked ? '#EF4444' : undefined,
        closeOnSelect: false,
        onPress: handleLikePress,
      },
      {
        id: 'bookmark',
        label: isBookmarked ? t('bookmark.saved') : t('bookmark.save'),
        icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
        iconColor: isBookmarked ? '#007AFF' : undefined,
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
  }, [isOwnMap, isArticlePublic, isLiked, isBookmarked, handleLikePress, handleBookmarkPress, handleSharePress, onArticlePress, onEditPress, t]);

  // モーダルの開閉に応じてアニメーション
  useEffect(() => {
    if (isDropdownOpen) {
      // 上からスライドダウン
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 上にスライドアップして消える
      Animated.timing(slideAnim, {
        toValue: -500,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isDropdownOpen, slideAnim]);

  const handleMapTitlePress = () => {
    if (userMaps.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleMapItemPress = (selectedMapId: string) => {
    onMapSelect?.(selectedMapId);
    setIsDropdownOpen(false);
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
              <Ionicons name="arrow-back" size={23} color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT} />
            </Pressable>
            <ActivityIndicator size="small" color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT} />
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-2.5">{t('common.loading')}</Text>
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
            <Ionicons name="arrow-back" size={23} color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT} />
          </Pressable>

          {/* ユーザーアイコン */}
          <Pressable
            onPress={onUserPress}
            onLongPress={() => userAvatarUrl && setIsAvatarModalVisible(true)}
            className="mr-2.5"
          >
            {userAvatarUrl ? (
              <Image
                source={{ uri: userAvatarUrl }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-sm font-bold text-foreground-secondary dark:text-dark-foreground-secondary">
                  {userName?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
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
              {userMaps.length > 0 && (
                <Ionicons
                  name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={19}
                  color="#6B7280"
                  style={{ marginLeft: 4 }}
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* 右側：アクションボタン群 */}
        <View className="flex-row items-center gap-3">
          {/* 検索ボタン */}
          <Pressable onPress={onSearchPress} className="items-center justify-center">
            <Ionicons name="search-outline" size={23} color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT} />
          </Pressable>

          {/* 三点リーダメニュー */}
          <PopupMenu
            items={menuItems}
            triggerSize={23}
            triggerColor={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT}
          />
        </View>
      </View>

      {/* マップ選択モーダル */}
      <Modal
        visible={isDropdownOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <Animated.View
            className="bg-surface dark:bg-dark-surface rounded-b-3xl shadow-2xl"
            style={{
              maxHeight: '70%',
              paddingTop: insets.top,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-light dark:border-dark-border-light">
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">{t('userMap.selectMap')}</Text>
              <Pressable onPress={() => setIsDropdownOpen(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView className="px-6">
              {userMaps.map((map, index) => (
                <Pressable
                  key={map.id}
                  onPress={() => handleMapItemPress(map.id)}
                  className={`py-4 active:bg-background-secondary dark:active:bg-dark-background-secondary ${
                    index < userMaps.length - 1 ? 'border-b border-border-light dark:border-dark-border-light' : ''
                  }`}
                >
                  <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
                    {map.name}
                  </Text>
                  {map.description && (
                    <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1" numberOfLines={2}>
                      {map.description}
                    </Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          <Pressable
            className="flex-1"
            onPress={() => setIsDropdownOpen(false)}
          />
        </View>
      </Modal>

      {/* フォルダ選択モーダル */}
      {userId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={userId}
          folderType="maps"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
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
