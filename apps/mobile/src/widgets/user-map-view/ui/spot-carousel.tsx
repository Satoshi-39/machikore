/**
 * スポットカルーセル
 *
 * マップ下部に表示される横スワイプ式のスポットカード
 * UserMapViewの内部コンポーネント
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsDarkMode } from '@/shared/lib/providers';
import { showLoginRequiredAlert, shareSpot, useSpotColor } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { LocationPinIcon, AddressPinIcon } from '@/shared/ui';
import { LOCATION_ICONS } from '@/shared/config';
import { useToggleSpotLike } from '@/entities/like';
import {
  useSpotBookmarkInfo,
  useBookmarkSpot,
  useUnbookmarkSpotFromFolder,
} from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import type { SpotWithDetails, UUID } from '@/shared/types';

// レイアウト定数
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_GAP = 10;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.22;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
// 1アイテムの幅（カード + 片側のギャップ）
const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

// ========== SpotCard コンポーネント ==========

interface SpotCardProps {
  spot: SpotWithDetails;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  currentUserId?: UUID | null;
  onPress: () => void;
  onCameraMove?: () => void;
}

function SpotCard({
  spot,
  isSelected,
  isFirst,
  isLast,
  currentUserId,
  onPress,
  onCameraMove,
}: SpotCardProps) {
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const spotName = spot.custom_name || spot.master_spot?.name || t('spot.unknownSpot');
  const description = spot.description;
  // スポットのカラーを取得（共通ユーティリティ使用）
  const { colorValue: spotColorValue, strokeColor: spotColorStroke } = useSpotColor(spot, isDarkMode);

  // いいね
  const isLiked = spot.is_liked ?? false;
  const likeCount = spot.likes_count ?? 0;
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleSpotLike();

  // ブックマーク
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = new Set(bookmarkInfo.map((b) => b.folder_id));
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const handleLike = () => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ spotId: spot.id, userId: currentUserId });
  };

  const handleBookmark = () => {
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    setIsFolderModalVisible(true);
  };

  const handleShare = async () => {
    await shareSpot(spot.id);
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginLeft: isFirst ? SIDE_SPACING : CARD_GAP / 2,
        marginRight: isLast ? SIDE_SPACING : CARD_GAP / 2,
      }}
    >
      <View
        className={`flex-1 bg-surface dark:bg-dark-surface rounded-2xl overflow-hidden ${
          isSelected ? 'border-2 border-primary' : ''
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-1 p-4">
          {/* タイトル + カメラ移動ボタン */}
          <View className="flex-row items-center">
            <LocationPinIcon size={20} color={spotColorValue} strokeColor={spotColorStroke} />
            <Text
              className="text-xl font-bold text-foreground dark:text-dark-foreground ml-1.5 flex-1"
              numberOfLines={2}
            >
              {spotName}
            </Text>
            {/* カメラ移動ボタン（目のアイコン） */}
            <Pressable
              onPress={onCameraMove}
              className="ml-2 p-1.5 rounded-full active:bg-gray-100 dark:active:bg-gray-700"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="eye-outline"
                size={22}
                color={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </View>

          {/* 住所 */}
          {(spot.master_spot?.google_short_address || spot.google_short_address) && (
            <View className="flex-row items-center mt-2">
              <AddressPinIcon size={14} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
              <Text
                className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1 flex-1"
                numberOfLines={1}
              >
                {spot.master_spot?.google_short_address || spot.google_short_address}
              </Text>
            </View>
          )}

          {/* 説明文 */}
          {description && (
            <Text
              className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-3"
              numberOfLines={3}
            >
              {description}
            </Text>
          )}

          <View className="flex-1" />

          {/* アクションボタン */}
          <View className="flex-row items-center justify-between pt-3 border-t border-border-light dark:border-dark-border-light">
            <Pressable onPress={onPress} className="flex-row items-center active:opacity-70">
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {t('common.comment')}
              </Text>
            </Pressable>

            <View className="flex-row items-center">
              <Pressable onPress={handleLike} className="active:opacity-70">
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isLiked ? '#EF4444' : isDarkMode ? '#9CA3AF' : '#6B7280'}
                />
              </Pressable>
              <Pressable onPress={() => setIsLikersModalVisible(true)} className="active:opacity-70 ml-1">
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                  {likeCount > 0 ? likeCount : t('common.like')}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={handleBookmark} className="flex-row items-center active:opacity-70">
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? '#007AFF' : isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {t('common.save')}
              </Text>
            </Pressable>

            <Pressable onPress={handleShare} className="flex-row items-center active:opacity-70">
              <Ionicons
                name="share-outline"
                size={22}
                color={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {t('common.share')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={(folderId) =>
            addBookmark({ userId: currentUserId, spotId: spot.id, folderId })
          }
          onRemoveFromFolder={(folderId) =>
            removeFromFolder({ userId: currentUserId, spotId: spot.id, folderId })
          }
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        spotId={spot.id}
        onClose={() => setIsLikersModalVisible(false)}
      />
    </Pressable>
  );
}

// ========== SpotCarousel コンポーネント ==========

interface SpotCarouselProps {
  spots: SpotWithDetails[];
  selectedSpotId?: string | null;
  currentUserId?: UUID | null;
  /** フォーカス（青枠）のみ変更（カメラ移動なし） */
  onSpotFocus?: (spot: SpotWithDetails) => void;
  /** フォーカス中のカードをタップ → 詳細カードを開く */
  onSpotSelect: (spot: SpotWithDetails) => void;
  onSpotPress: (spot: SpotWithDetails) => void;
  /** カメラ移動（目のアイコンタップ時） */
  onCameraMove?: (spot: SpotWithDetails) => void;
  onClose: () => void;
}

export function SpotCarousel({
  spots,
  selectedSpotId,
  currentUserId,
  onSpotFocus,
  onSpotSelect,
  onSpotPress,
  onCameraMove,
  onClose,
}: SpotCarouselProps) {
  const isDarkMode = useIsDarkMode();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<SpotWithDetails>>(null);

  // スポットが選択された時にそのカードまでスクロール
  useEffect(() => {
    if (selectedSpotId && flatListRef.current) {
      const index = spots.findIndex((s) => s.id === selectedSpotId);
      if (index >= 0) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedSpotId, spots]);

  // スクロール終了時（スナップ完了後）のフォーカス確定
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_WIDTH);
      const spot = spots[index];
      if (spot) {
        onSpotFocus?.(spot);
      }
    },
    [spots, onSpotFocus]
  );

  // カードタップ時の処理（フォーカス状態で分岐）
  const handleCardPress = useCallback(
    (spot: SpotWithDetails) => {
      if (spot.id === selectedSpotId) {
        // 既にフォーカス中 → 詳細カードを開く
        onSpotPress(spot);
      } else {
        // フォーカスを当てる
        onSpotSelect(spot);
      }
    },
    [selectedSpotId, onSpotPress, onSpotSelect]
  );

  // アイテムのレンダリング
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SpotWithDetails>) => (
      <SpotCard
        spot={item}
        isSelected={item.id === selectedSpotId}
        isFirst={index === 0}
        isLast={index === spots.length - 1}
        currentUserId={currentUserId}
        onPress={() => handleCardPress(item)}
        onCameraMove={() => onCameraMove?.(item)}
      />
    ),
    [selectedSpotId, currentUserId, handleCardPress, onCameraMove, spots.length]
  );

  // キー抽出
  const keyExtractor = useCallback((item: SpotWithDetails) => item.id, []);

  // スクロール失敗時のフォールバック
  const handleScrollToIndexFailed = useCallback(
    (info: { index: number }) => {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100);
    },
    []
  );

  if (spots.length === 0) {
    return null;
  }

  return (
    <View
      className="absolute left-0 right-0"
      style={{ bottom: insets.bottom + 8 }}
    >
      {/* 閉じるボタン */}
      <View className="flex-row justify-end px-4 mb-2">
        <Pressable
          onPress={onClose}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface dark:bg-dark-muted"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Ionicons
            name="close"
            size={24}
            color={isDarkMode ? '#9CA3AF' : '#6B7280'}
          />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={spots}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={renderItem}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        // 全アイテムをレンダリング（100枚以下を想定）
        initialNumToRender={spots.length}
        maxToRenderPerBatch={spots.length}
      />
    </View>
  );
}
