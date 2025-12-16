/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 * ローカルSQLiteデータとSupabase JOINデータの両方に対応
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Dimensions, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, USER_MAP_THEME_COLORS, getThemeColorStroke, type UserMapThemeColor, log } from '@/shared/config';
import { PopupMenu, type PopupMenuItem, ImageViewerModal, useImageViewer, LocationPinIcon, AddressPinIcon } from '@/shared/ui';
import { LOCATION_ICONS } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';
import type { SpotWithDetails, UUID } from '@/shared/types';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
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
  google_short_address: string | null;
  google_types: string[] | null;
}

interface SpotCardProps {
  // ローカルSQLiteデータまたはSupabase SpotWithDetails/UserSpotSearchResultデータ
  spot: SpotWithMasterSpot | SpotWithDetails | UserSpotSearchResult;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のスポットか判定用、いいね機能にも使用）
  machiName?: string;
  /** コンテナの幅（画像サイズ計算用）。省略時はscreenWidth - 32 */
  containerWidth?: number;
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onMapPress?: (mapId: string) => void;
  onEdit?: (spotId: string) => void;
  onCommentPress?: (spotId: string) => void;
  // Supabase JOINで既に取得済みのデータ（あれば個別fetchをスキップ）
  embeddedUser?: EmbeddedUser | null;
  embeddedMasterSpot?: EmbeddedMasterSpot | null;
}

export function SpotCard({
  spot,
  currentUserId,
  machiName,
  containerWidth: containerWidthProp,
  onPress,
  onUserPress,
  onMapPress,
  onEdit,
  onCommentPress,
  embeddedUser,
  embeddedMasterSpot,
}: SpotCardProps) {
  const isDarkMode = useIsDarkMode();

  // embeddedUserがあればuseUserをスキップ
  const { data: fetchedUser } = useUser(embeddedUser ? null : spot.user_id);
  const user = embeddedUser || fetchedUser;

  // いいね状態は spot.is_liked を使用（SpotWithDetails の場合）
  const isLiked = 'is_liked' in spot ? (spot.is_liked ?? false) : false;

  // マップのテーマカラーを取得
  const themeColor = ('map' in spot && spot.map?.theme_color) ? spot.map.theme_color as UserMapThemeColor : 'blue';
  const themeColorValue = USER_MAP_THEME_COLORS[themeColor]?.color ?? colors.primary.DEFAULT;
  const themeColorStroke = getThemeColorStroke(themeColor, isDarkMode);
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

  // 画像拡大表示用
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImages, closeImage } = useImageViewer();
  const screenWidth = Dimensions.get('window').width;
  // コンテナ幅：指定があればそれを使用、なければscreenWidth - 32（デフォルトのパディング分）
  const containerWidth = containerWidthProp ?? (screenWidth - 32);

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

  // 住所の取得（表示用は短縮住所）
  const getAddress = (): string | null => {
    if ('master_spot' in spot && spot.master_spot?.google_short_address) {
      return spot.master_spot.google_short_address;
    }
    if (embeddedMasterSpot?.google_short_address) {
      return embeddedMasterSpot.google_short_address;
    }
    // ピン刺し・現在地登録の場合はuser_spotの住所を使用
    if ('google_short_address' in spot && spot.google_short_address) {
      return spot.google_short_address;
    }
    return null;
  };

  // マップ名の取得（SpotWithDetails型の場合のみ）
  const getMapName = (): string | null => {
    if ('map' in spot && spot.map?.name) {
      return spot.map.name;
    }
    return null;
  };

  const spotName = getSpotName();
  const address = getAddress();
  const mapName = getMapName();

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

  // 共有処理
  const handleSharePress = useCallback(async (e: any) => {
    e.stopPropagation();
    try {
      const url = `machikore://spots/${spot.id}`;
      await Share.share(Platform.select({
        ios: { message: `${spotName}をチェック！`, url },
        default: { message: `${spotName}をチェック！\n${url}` },
      })!);
    } catch (error) {
      log.error('[Spot] Share error:', error);
    }
  }, [spotName, spot.id]);

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
      className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border p-4"
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
            <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted justify-center items-center mr-3">
              <Ionicons name="person" size={20} color={colors.gray[500]} />
            </View>
          )}
        </Pressable>

        {/* ユーザー名と時間 */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(spot.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
              {user?.display_name || user?.username || 'ユーザー'}
            </Text>
          </Pressable>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
            {getRelativeSpotTime(spot.created_at)}
          </Text>
        </View>

        {/* 三点リーダーメニュー（自分のスポットのみ） */}
        {isOwner && !isDeleting && (
          <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
        )}
      </View>

      {/* スポット名 */}
      <View className="flex-row items-center mb-1">
        <LocationPinIcon size={18} color={themeColorValue} strokeColor={themeColorStroke} />
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-1">
          {spotName}
        </Text>
      </View>

      {/* 説明 */}
      {spot.description && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
          {spot.description}
        </Text>
      )}

      {/* マップ名 */}
      {mapName && (
        <Pressable
          onPress={() => onMapPress?.(spot.map_id)}
          className="flex-row items-center mb-2 self-start"
        >
          <Ionicons name="map-outline" size={14} color={colors.primary.DEFAULT} />
          <Text className="text-xs ml-1" style={{ color: colors.primary.DEFAULT }}>
            {mapName}
          </Text>
        </Pressable>
      )}

      {/* 画像（2x2グリッド、最大4枚表示） */}
      {/* 画像がない場合は何も表示しない、ローディング中はプレースホルダー表示 */}
      {(images.length > 0 || imagesLoading) && (
        <View className="mb-2">
          {imagesLoading ? (
            // ローディング中はプレースホルダーを表示（高さを確保してちらつき防止）
            <View
              className="bg-muted dark:bg-dark-muted rounded-lg"
              style={{ width: containerWidth, height: containerWidth * 0.6 }}
            />
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 4 }}>
              {images.slice(0, 4).map((image, index) => {
                const isLastWithMore = index === 3 && images.length > 4;
                const halfSize = (containerWidth - 4) / 2; // 2列用サイズ（gapの4pxを引く）

                // 1枚の場合は横幅いっぱい、3枚の場合の3枚目も横幅いっぱい
                const isSingleImage = images.length === 1;
                const isThirdOfThree = images.length === 3 && index === 2;
                const isFullWidth = isSingleImage || isThirdOfThree;
                const imageWidth = isFullWidth ? containerWidth : halfSize;
                const imageHeight = isSingleImage ? containerWidth * 0.6 : halfSize; // 1枚の時は少し低めに

                return (
                  <Pressable
                    key={image.id}
                    onPress={(e) => {
                      e.stopPropagation();
                      const imageUrls = images.map(img => img.cloud_path || img.local_path || '').filter(Boolean);
                      openImages(imageUrls, index);
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
          )}
        </View>
      )}

      {/* 画像拡大モーダル */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        images={viewerImages}
        initialIndex={initialIndex}
        onClose={closeImage}
      />

      {/* 住所または街情報 */}
      {(address || machiName) && (
        <View className="flex-row items-center mb-2">
          <AddressPinIcon
            size={14}
            color={LOCATION_ICONS.ADDRESS.color}
            holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight}
          />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1" numberOfLines={1}>
            {address || machiName}
          </Text>
        </View>
      )}

      {/* フッター情報 - 均等配置 */}
      <View className="flex-row items-center justify-around mt-2">
        {/* コメント */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onCommentPress?.(spot.id);
          }}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {spot.comments_count}
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
            {spot.likes_count}
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
