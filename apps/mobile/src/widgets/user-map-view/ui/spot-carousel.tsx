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
import { useSpotColor } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import {
  LocationPinIcon,
  AddressPinIcon,
  DirectionsButton,
  LikeButton,
  BookmarkButton,
  ShareButton,
} from '@/shared/ui';
import { LOCATION_ICONS } from '@/shared/config';
import {
  useSpotBookmarkInfo,
  useBookmarkSpot,
  useUnbookmarkSpotFromFolder,
} from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import { extractPlainText, type SpotWithDetails, type UUID } from '@/shared/types';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

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
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  // スポット名（JSONB型を現在のlocaleで抽出）
  // master_spotがある場合はその名前、ない場合（ピン刺し・現在地登録）はspot.nameを使用
  const masterSpotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('spot.unknownSpot')
    : (spot.name ? extractName(spot.name, locale) : null) || t('spot.unknownSpot');
  // 住所（JSONB型を現在のlocaleで抽出）
  const address = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);
  // 記事プレビュー（プレーンテキスト抽出）
  const articlePreview = extractPlainText(spot.article_content);
  // スポットのカラーを取得（共通ユーティリティ使用）
  const { colorValue: spotColorValue, strokeColor: spotColorStroke } = useSpotColor(spot, isDarkMode);

  // いいね
  const isLiked = spot.is_liked ?? false;
  const likeCount = spot.likes_count ?? 0;

  // ブックマーク
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = new Set(bookmarkInfo.map((b) => b.folder_id));
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const handleOpenFolderModal = () => {
    setIsFolderModalVisible(true);
  };

  // 経路用の座標
  const directionsLat = spot.master_spot?.latitude ?? spot.latitude ?? 0;
  const directionsLng = spot.master_spot?.longitude ?? spot.longitude ?? 0;

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
        <View className="flex-1 p-3">
          {/* タイトル + カメラ移動ボタン */}
          <View className="flex-row items-center">
            <LocationPinIcon size={18} color={spotColorValue} strokeColor={spotColorStroke} />
            <Text
              className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1.5 flex-1"
              numberOfLines={1}
            >
              {masterSpotName}
            </Text>
            {/* カメラ移動ボタン（目のアイコン） */}
            <Pressable
              onPress={onCameraMove}
              className="ml-2 p-1 rounded-full active:bg-gray-100 dark:active:bg-gray-700"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </View>

          {/* ユーザーの一言 */}
          {spot.description && (
            <Text
              className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1"
              numberOfLines={1}
            >
              {spot.description}
            </Text>
          )}

          {/* 住所 */}
          {address && (
            <View className="flex-row items-center mt-1">
              <AddressPinIcon size={13} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
              <Text
                className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1 flex-1"
                numberOfLines={1}
              >
                {address}
              </Text>
            </View>
          )}

          {/* 記事プレビュー */}
          {articlePreview ? (
            <>
              <Text
                className="text-sm text-foreground dark:text-dark-foreground mt-1.5"
                numberOfLines={2}
              >
                {articlePreview}
              </Text>
              <View className="flex-1" />
            </>
          ) : (
            <View className="flex-1 justify-center">
              <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted italic text-center">
                {t('spot.noArticle')}
              </Text>
            </View>
          )}

          {/* アクションボタン: いいね → 保存 → 経路 → 共有 */}
          <View className="flex-row items-center justify-between pt-2 border-t border-border-light dark:border-dark-border-light">
            {/* いいね */}
            <LikeButton
              spotId={spot.id}
              currentUserId={currentUserId}
              isLiked={isLiked}
              likesCount={likeCount}
              onCountPress={() => setIsLikersModalVisible(true)}
              variant="inline"
              iconSize={20}
              iconColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              labelClassName="text-xs text-foreground-secondary dark:text-dark-foreground-secondary"
            />

            {/* 保存 */}
            <BookmarkButton
              isBookmarked={isBookmarked}
              currentUserId={currentUserId}
              onPress={handleOpenFolderModal}
              variant="inline"
              iconSize={20}
              iconColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              labelClassName="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"
            />

            {/* 経路 */}
            <DirectionsButton
              latitude={directionsLat}
              longitude={directionsLng}
              variant="inline"
              iconSize={20}
              iconColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              labelClassName="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"
            />

            {/* 共有 */}
            <ShareButton
              type="spot"
              id={spot.id}
              variant="inline"
              iconSize={20}
              iconColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              labelClassName="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"
            />
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
      {/* 閉じるボタン（右側） */}
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
