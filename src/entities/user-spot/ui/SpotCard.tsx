/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 * ローカルSQLiteデータとSupabase JOINデータの両方に対応
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';
import type { SpotWithDetails, UUID } from '@/shared/types';
import { getRelativeSpotTime } from '@/entities/user-spot/model/helpers';
import { useSpotImages, useDeleteSpot } from '@/entities/user-spot/api';
import { useToggleSpotLike } from '@/entities/like';
import { useUser } from '@/entities/user';
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

// Supabase JOINで取得済みのユーザー情報
interface EmbeddedUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

// Supabase JOINで取得済みのmaster_spot情報
interface EmbeddedMasterSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_types: string[] | null;
}

interface SpotCardProps {
  // ローカルSQLiteデータまたはSupabase SpotWithDetailsデータ
  spot: SpotWithMasterSpot | SpotWithDetails;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のスポットか判定用、いいね機能にも使用）
  machiName?: string;
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onEdit?: (spotId: string) => void;
  // Supabase JOINで既に取得済みのデータ（あれば個別fetchをスキップ）
  embeddedUser?: EmbeddedUser | null;
  embeddedMasterSpot?: EmbeddedMasterSpot | null;
}

export function SpotCard({
  spot,
  currentUserId,
  machiName,
  onPress,
  onUserPress,
  onEdit,
  embeddedUser,
  embeddedMasterSpot,
}: SpotCardProps) {
  // embeddedUserがあればuseUserをスキップ
  const { data: fetchedUser } = useUser(embeddedUser ? null : spot.user_id);
  const user = embeddedUser || fetchedUser;

  // いいね状態は spot.is_liked を使用（SpotWithDetails の場合）
  const isLiked = 'is_liked' in spot ? (spot.is_liked ?? false) : false;
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleSpotLike();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();
  const { data: images = [], isLoading: imagesLoading } = useSpotImages(spot.id);

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;
  // ブックマーク済みフォルダIDのSetを作成
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  // 画像拡大表示用のstate
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // デバッグログ
  console.log(`[SpotCard] spot.id: ${spot.id}, images: ${images.length}, loading: ${imagesLoading}`);

  const avatarUri = user?.avatar_url ?? undefined;
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // スポット名の取得（SpotWithDetailsとSpotWithMasterSpotで構造が異なる）
  const getSpotName = (): string => {
    if (spot.custom_name) return spot.custom_name;
    // SpotWithDetails型の場合
    if ('master_spot' in spot && spot.master_spot?.name) {
      return spot.master_spot.name;
    }
    // SpotWithMasterSpot型の場合
    if ('name' in spot && spot.name) {
      return spot.name;
    }
    // embeddedMasterSpotがある場合
    if (embeddedMasterSpot?.name) {
      return embeddedMasterSpot.name;
    }
    return '不明なスポット';
  };

  // 住所の取得
  const getAddress = (): string | null => {
    if ('master_spot' in spot && spot.master_spot?.google_formatted_address) {
      return spot.master_spot.google_formatted_address;
    }
    if (embeddedMasterSpot?.google_formatted_address) {
      return embeddedMasterSpot.google_formatted_address;
    }
    return null;
  };

  const spotName = getSpotName();
  const address = getAddress();

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, spotId: spot.id });
  };

  // ブックマーク処理（フォルダ選択モーダルを開く）
  const handleBookmarkPress = useCallback((e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    setIsFolderModalVisible(true);
  }, [currentUserId]);

  // フォルダに追加
  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    addBookmark({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, addBookmark]);

  // フォルダから削除
  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    removeFromFolder({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, removeFromFolder]);

  const handleDelete = () => {
    Alert.alert(
      'スポットを削除',
      'このスポットを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteSpot(spot.id),
        },
      ]
    );
  };

  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit?.(spot.id),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: handleDelete,
    },
  ], [spot.id, onEdit]);

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border-b border-gray-200 p-4"
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコン（タップでプロフィールへ） */}
        <Pressable onPress={() => onUserPress?.(spot.user_id)}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-3">
              <Ionicons name="person" size={20} color={colors.gray[500]} />
            </View>
          )}
        </Pressable>

        {/* ユーザー名と時間 */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(spot.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-gray-800">
              {user?.display_name || user?.username || 'ユーザー'}
            </Text>
          </Pressable>
          <Text className="text-xs text-gray-500">
            {getRelativeSpotTime(spot.created_at)}
          </Text>
        </View>

        {/* 三点リーダーメニュー（自分のスポットのみ） */}
        {isOwner && !isDeleting && (
          <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
        )}
      </View>

      {/* スポット名 */}
      <Text className="text-base font-semibold text-gray-900 mb-2">
        📍 {spotName}
      </Text>

      {/* 説明 */}
      {spot.description && (
        <Text className="text-sm text-gray-700 mb-2">
          {spot.description}
        </Text>
      )}

      {/* 画像（2x2グリッド、最大4枚表示） */}
      {images.length > 0 && (
        <View className="mb-2">
          <View className="flex-row flex-wrap" style={{ gap: 4 }}>
            {images.slice(0, 4).map((image, index) => {
              const isLastWithMore = index === 3 && images.length > 4;
              const halfSize = (screenWidth - 32 - 4) / 2; // 2列用サイズ
              const fullWidth = screenWidth - 32; // 1列用サイズ（横幅いっぱい）

              // 3枚の場合の3枚目は横幅いっぱい
              const isThirdOfThree = images.length === 3 && index === 2;
              const imageWidth = isThirdOfThree ? fullWidth : halfSize;
              const imageHeight = isThirdOfThree ? halfSize : halfSize; // 高さは同じ

              return (
                <Pressable
                  key={image.id}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                >
                  <View style={{ width: imageWidth, height: imageHeight, position: 'relative' }}>
                    <Image
                      source={{ uri: image.cloud_path || image.local_path || '' }}
                      style={{ width: imageWidth, height: imageHeight, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    {isLastWithMore && (
                      <View
                        className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center"
                        style={{ borderRadius: 8 }}
                      >
                        <Text className="text-white text-lg font-bold">
                          +{images.length - 4}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* 画像拡大モーダル */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}
      >
        <Pressable
          className="flex-1 bg-black/90 items-center justify-center"
          onPress={() => setSelectedImageIndex(null)}
        >
          {selectedImageIndex !== null && images[selectedImageIndex] && (
            <>
              <Image
                source={{ uri: images[selectedImageIndex].cloud_path || images[selectedImageIndex].local_path || '' }}
                style={{ width: screenWidth, height: screenWidth }}
                resizeMode="contain"
              />
              {/* 閉じるボタン */}
              <Pressable
                onPress={() => setSelectedImageIndex(null)}
                className="absolute top-12 right-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
              {/* 画像カウンター */}
              <View className="absolute bottom-12 bg-black/50 px-4 py-2 rounded-full">
                <Text className="text-white text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </Text>
              </View>
              {/* 前へ/次へボタン */}
              {selectedImageIndex > 0 && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex - 1);
                  }}
                  className="absolute left-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                  <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
              )}
              {selectedImageIndex < images.length - 1 && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex + 1);
                  }}
                  className="absolute right-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </Pressable>
              )}
            </>
          )}
        </Pressable>
      </Modal>

      {/* 住所または街情報 */}
      {(address || machiName) && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
            {address || machiName}
          </Text>
        </View>
      )}

      {/* フッター情報 */}
      <View className="flex-row items-center justify-end mt-2">
        {/* いいね・コメント・ブックマーク */}
        <View className="flex-row items-center gap-4">
          {/* いいね */}
          <Pressable
            onPress={handleLikePress}
            className="flex-row items-center"
            disabled={isTogglingLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#EF4444' : colors.text.secondary}
            />
            <Text className="text-sm text-gray-600 ml-1">
              {spot.likes_count}
            </Text>
          </Pressable>

          {/* コメント */}
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-sm text-gray-600 ml-1">
              {spot.comments_count}
            </Text>
          </View>

          {/* ブックマーク */}
          <Pressable
            onPress={handleBookmarkPress}
            className="flex-row items-center"
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? colors.primary.DEFAULT : colors.text.secondary}
            />
          </Pressable>
        </View>
      </View>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}
    </Pressable>
  );
}
