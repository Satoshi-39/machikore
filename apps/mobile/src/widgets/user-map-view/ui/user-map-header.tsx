/**
 * ユーザーマップヘッダーWidget
 *
 * ユーザーマップ専用のヘッダー表示
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import { MapLikeButton } from '@/features/map-like';
import { useMapBookmarkMenu } from '@/features/map-bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { colors, shadow } from '@/shared/config';
import { shareMap } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ThumbnailCrop } from '@/shared/lib/image';
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
  /** マップのサムネイルクロップ座標 */
  mapThumbnailCrop?: ThumbnailCrop | null;
  /** マップのタグ */
  mapTags?: TagBasicInfo[];
  /** マップ内のスポット一覧 */
  spots?: SpotWithDetails[];
  userId?: string | null;
  /** 現在ログイン中のユーザーID（自分のマップ判定用） */
  currentUserId?: string | null;
  /** マップ所有者のID */
  mapOwnerId?: string | null;
  /** マップが公開されているかどうか */
  isMapPublic?: boolean;
  /** いいね済みかどうか */
  isLiked?: boolean;
  /** いいね数 */
  likesCount?: number;
  userName?: string;
  userAvatarUrl?: string;
  userAvatarCrop?: ThumbnailCrop | null;
  /** マップ所有者のusername（共有URL用） */
  mapOwnerUsername?: string;
  onBack?: () => void;
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onArticlePress?: () => void;
  onEditPress?: () => void;
  /** スポットタップ時のコールバック */
  onSpotPress?: (spotId: string) => void;
  /** タグタップ時のコールバック */
  onTagPress?: (tagName: string) => void;
}

export function UserMapHeader({
  isLoading = false,
  mapId,
  mapTitle,
  mapDescription,
  mapThumbnailUrl,
  mapThumbnailCrop,
  mapTags = [],
  spots = [],
  userId,
  currentUserId,
  mapOwnerId,
  isMapPublic = false,
  isLiked = false,
  likesCount = 0,
  userName,
  userAvatarUrl,
  userAvatarCrop,
  mapOwnerUsername,
  onBack,
  onUserPress,
  onSearchPress,
  onArticlePress,
  onEditPress,
  onSpotPress,
  onTagPress,
}: UserMapHeaderProps) {
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useMapBookmarkMenu({
    mapId,
    currentUserId: userId,
  });

  // 共有処理
  const handleSharePress = useCallback(async () => {
    if (!mapId) return;
    await shareMap(mapOwnerUsername || '', mapId);
  }, [mapOwnerUsername, mapId]);

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

    // マップが公開されているまたは自分のマップの場合のみ「記事を見る」を表示
    if (isMapPublic || isOwnMap) {
      items.push({
        id: 'article',
        label: t('menu.viewArticle'),
        icon: 'document-text-outline',
        onPress: () => onArticlePress?.(),
      });
    }

    // ブックマーク
    items.push(bookmarkMenuItem);

    items.push({
      id: 'share',
      label: t('common.share'),
      icon: 'share-outline',
      onPress: handleSharePress,
    });

    return items;
  }, [
    isOwnMap,
    isMapPublic,
    bookmarkMenuItem,
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
        className="bg-surface-variant px-4 py-3 rounded-full"
        style={{
          ...shadow.dropdown,
          ...(isDarkMode && { shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 }),
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* 左側：戻るボタン + ローディング */}
          <View className="flex-row items-center" style={{ flex: 0.8 }}>
            <Pressable
              onPress={onBack}
              className="mr-2.5"
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color={
                  isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]
                }
              />
            </Pressable>
            <ActivityIndicator
              size="small"
              color={
                isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]
              }
            />
            <Text className="text-sm text-on-surface-variant ml-2.5">
              {t('common.loading')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className="bg-surface-variant px-4 py-3 rounded-full"
      style={{
        shadowColor: colors.light.scrim,
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
          <Pressable
            onPress={onBack}
            className="mr-2.5"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={
                isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]
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
              crop={userAvatarCrop}
              alt={userName || 'User'}
              className="w-10 h-10"
              size={40}
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
                className="text-base font-bold text-on-surface flex-shrink"
                numberOfLines={1}
              >
                {mapTitle || t('userMap.usersMap', { name: userName || '' })}
              </Text>
              <Ionicons
                name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={19}
                color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>
        </View>

        {/* 右側：アクションボタン群 */}
        <View className="flex-row items-center gap-3">
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
                  isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]
                }
              />
            </Pressable>
          )}

          {/* いいねボタン（他人のマップのみ表示） */}
          {!isOwnMap && (
            <MapLikeButton
              mapId={mapId}
              currentUserId={userId}
              isLiked={isLiked}
              size={25}
              showCount={false}
              inactiveColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
            />
          )}

          {/* 三点リーダメニュー */}
          <PopupMenu
            items={menuItems}
            triggerSize={23}
            respectSafeArea
          />
        </View>
      </View>

      {/* マップ情報モーダル */}
      <MapInfoModal
        visible={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        mapId={mapId}
        mapTitle={mapTitle}
        mapDescription={mapDescription}
        mapThumbnailUrl={mapThumbnailUrl}
        mapThumbnailCrop={mapThumbnailCrop}
        mapTags={mapTags}
        spots={spots}
        onSpotPress={onSpotPress}
        onTagPress={onTagPress}
        onArticlePress={onArticlePress}
        currentUserId={currentUserId}
        mapOwnerId={mapOwnerId ?? undefined}
        mapOwnerUsername={mapOwnerUsername}
        isLiked={isLiked}
        likesCount={likesCount}
      />

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}

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
