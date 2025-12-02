/**
 * マップヘッダーWidget
 *
 * デフォルトマップとユーザーマップのヘッダー表示を切り替える
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import type { MapWithUser } from '@/shared/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View, Modal, Animated, ActivityIndicator, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { showLoginRequiredAlert } from '@/shared/lib';
import { PopupMenu, type PopupMenuItem, ImageViewerModal } from '@/shared/ui';

interface MapHeaderProps {
  isUserMap: boolean;
  isLoading?: boolean;
  mapId?: string | null;
  mapTitle?: string;
  userId?: string | null;
  userName?: string;
  userAvatarUrl?: string;
  userMaps?: MapWithUser[];
  onBack?: () => void;
  onMapSelect?: (mapId: string) => void;
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onArticlePress?: () => void;
}

export function MapHeader({
  isUserMap,
  isLoading = false,
  mapId,
  mapTitle,
  userId,
  userName,
  userAvatarUrl,
  userMaps = [],
  onBack,
  onMapSelect,
  onUserPress,
  onSearchPress,
  onArticlePress,
}: MapHeaderProps) {
  const insets = useSafeAreaInsets();
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
      showLoginRequiredAlert('いいね');
      return;
    }
    if (!mapId || isTogglingLike) return;
    toggleLike({ userId, mapId });
  }, [userId, mapId, isTogglingLike, toggleLike]);

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
      await Share.share({
        message: `${mapTitle || 'マップ'}をチェック！ machikore://maps/${mapId}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [mapTitle, mapId]);

  // ポップアップメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'article',
      label: '記事を見る',
      icon: 'document-text-outline',
      onPress: () => onArticlePress?.(),
    },
    {
      id: 'like',
      label: isLiked ? 'いいね済み' : 'いいね',
      icon: isLiked ? 'heart' : 'heart-outline',
      iconColor: isLiked ? '#EF4444' : undefined,
      onPress: handleLikePress,
    },
    {
      id: 'bookmark',
      label: isBookmarked ? '保存済み' : '保存',
      icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
      iconColor: isBookmarked ? '#007AFF' : undefined,
      onPress: handleBookmarkPress,
    },
    {
      id: 'share',
      label: '共有',
      icon: 'share-outline',
      onPress: handleSharePress,
    },
  ], [isLiked, isBookmarked, handleLikePress, handleBookmarkPress, handleSharePress, onArticlePress]);

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

  const handleMapItemPress = (mapId: string) => {
    onMapSelect?.(mapId);
    setIsDropdownOpen(false);
  };

  // ローディング時の表示
  if (isUserMap && isLoading) {
    return (
      <View className="bg-white px-5 py-4">
        <View className="flex-row items-center justify-between">
          {/* 左側：戻るボタン + ローディング */}
          <View className="flex-row items-center" style={{ flex: 0.8 }}>
            <Pressable onPress={onBack} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </Pressable>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text className="text-gray-500 ml-3">読み込み中...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white px-5 py-4">
      {isUserMap ? (
        // ユーザーマップ：戻るボタン + ユーザーアイコン + マップ名（左）、アクションボタン群（右）
        <View className="flex-row items-center justify-between">
          {/* 左側：戻るボタン + ユーザーアイコン + マップ名 */}
          <View className="flex-row items-center" style={{ flex: 0.8 }}>
            {/* 戻るボタン */}
            <Pressable onPress={onBack} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </Pressable>

            {/* ユーザーアイコン */}
            <Pressable
              onPress={onUserPress}
              onLongPress={() => userAvatarUrl && setIsAvatarModalVisible(true)}
              className="mr-3"
            >
              {userAvatarUrl ? (
                <Image
                  source={{ uri: userAvatarUrl }}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                  <Text className="text-base font-bold text-gray-600">
                    {userName?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* マップ名 - クリックでドロップダウン表示 */}
            <View className="flex-shrink">
              <Pressable
                onPress={handleMapTitlePress}
                className="flex-row items-center"
              >
                <Text
                  className="text-xl font-bold text-gray-800"
                  numberOfLines={1}
                >
                  {mapTitle || `${userName || 'ゲスト'}のマップ`}
                </Text>
                {userMaps.length > 0 && (
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6B7280"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </Pressable>
            </View>
          </View>

          {/* 右側：アクションボタン群 */}
          <View className="flex-row items-center gap-4">
            {/* 検索ボタン */}
            <Pressable onPress={onSearchPress} className="items-center justify-center">
              <Ionicons name="search-outline" size={24} color="#007AFF" />
            </Pressable>

            {/* 三点リーダメニュー */}
            <PopupMenu
              items={menuItems}
              triggerSize={24}
              triggerColor="#007AFF"
            />
          </View>
        </View>
      ) : (
        // デフォルトマップ：ロゴ（左）+ キャッチフレーズ（中央）
        <View className="flex-row items-center">
          {/* ロゴ（左端） */}
          <View className="flex-row items-center">
            <Ionicons name="map" size={20} color="#007AFF" />
            <Text className="ml-1 text-base font-bold text-blue-500">
              街コレ
            </Text>
          </View>

          {/* キャッチフレーズ（中央） */}
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-gray-700">
              日本の街を再発見しよう
            </Text>
          </View>

          {/* 右側のスペース（バランス調整） */}
          <View style={{ width: 60 }} />
        </View>
      )}

      {/* マップ選択モーダル */}
      <Modal
        visible={isDropdownOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <Animated.View
            className="bg-white rounded-b-3xl shadow-2xl"
            style={{
              maxHeight: '70%',
              paddingTop: insets.top,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">マップを選択</Text>
              <Pressable onPress={() => setIsDropdownOpen(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView className="px-6">
              {userMaps.map((map, index) => (
                <Pressable
                  key={map.id}
                  onPress={() => handleMapItemPress(map.id)}
                  className="py-4 active:bg-gray-50"
                  style={{
                    borderBottomWidth: index < userMaps.length - 1 ? 1 : 0,
                    borderBottomColor: '#F3F4F6',
                  }}
                >
                  <Text className="text-lg font-semibold text-gray-900">
                    {map.name}
                  </Text>
                  {map.description && (
                    <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
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
