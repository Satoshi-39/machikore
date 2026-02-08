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
import { useRouter } from 'expo-router';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSpotColor } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import {
  LocationPinIcon,
  AddressPinIcon,
  ExternalMapButton,
  ShareButton,
  PopupMenu,
  PrivateBadge,
  type PopupMenuItem,
} from '@/shared/ui';
import { LOCATION_ICONS, colors, iconSizeNum, borderWidthNum, shadow } from '@/shared/config';
import { SpotLikeButton } from '@/features/spot-like';
import { SpotBookmarkButton } from '@/features/spot-bookmark';
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

interface DeleteSpotContext {
  isPublic?: boolean;
  publicSpotsCount?: number;
}

interface SpotCardProps {
  spot: SpotWithDetails;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  currentUserId?: UUID | null;
  onPress: () => void;
  onCameraMove?: () => void;
  onEdit?: (spotId: string) => void;
  onDelete?: (spotId: string, context?: DeleteSpotContext) => void;
  /** 公開スポット数（最後のスポット削除時の警告用） */
  publicSpotsCount?: number;
}

function SpotCard({
  spot,
  isSelected,
  isFirst,
  isLast,
  currentUserId,
  onPress,
  onCameraMove,
  onEdit,
  onDelete,
  publicSpotsCount = 0,
}: SpotCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const isOwner = currentUserId && spot.user_id === currentUserId;
  // スポット名（spot.languageで抽出）
  // master_spotがある場合はその名前（JSONB）、ない場合（ピン刺し・現在地登録）はspot.name（TEXT）を使用
  const spotLanguage = spot.language || 'ja';
  const masterSpotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, spotLanguage) || t('spot.unknownSpot')
    : (spot.name ? spot.name : null) || t('spot.unknownSpot');
  // 住所（spot.languageで抽出）
  const address = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
    || extractAddress(spot.google_short_address, spotLanguage);
  // 記事プレビュー（プレーンテキスト抽出）
  const articlePreview = extractPlainText(spot.article_content);
  // スポットのカラーを取得（共通ユーティリティ使用）
  const { colorValue: spotColorValue, strokeColor: spotColorStroke } = useSpotColor(spot, isDarkMode);

  // いいね
  const isLiked = spot.is_liked ?? false;
  const likeCount = spot.likes_count ?? 0;

  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 三点リーダーメニュー項目（オーナー用）
  const ownerMenuItems: PopupMenuItem[] = [
    {
      id: 'edit',
      label: t('common.edit'),
      icon: 'create-outline',
      onPress: () => onEdit?.(spot.id),
    },
    {
      id: 'delete',
      label: t('common.delete'),
      icon: 'trash-outline',
      destructive: true,
      onPress: () => onDelete?.(spot.id, { isPublic: spot.is_public, publicSpotsCount }),
    },
  ];

  // 三点リーダーメニュー項目（オーナー以外用）
  const guestMenuItems: PopupMenuItem[] = [
    {
      id: 'report',
      label: t('common.report'),
      icon: 'flag-outline',
      onPress: () => router.push(`/report?targetType=spot&targetId=${spot.id}`),
    },
  ];

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
        className="flex-1 bg-surface rounded-2xl overflow-hidden"
        style={{
          ...(isSelected
            ? {
                borderWidth: borderWidthNum.medium,
                borderColor: isDarkMode ? colors.dark.primary : colors.light.primary,
              }
            : undefined),
          ...shadow.modal,
        }}
      >
        <View className="flex-1 px-4 py-3">
          {/* タイトル + カメラ移動ボタン */}
          <View className="flex-row items-center">
            {/* 非公開スポットは鍵アイコン、公開スポットはピンアイコン */}
            {isOwner && spot.is_public === false ? (
              <PrivateBadge size={iconSizeNum.sm} />
            ) : (
              <LocationPinIcon size={iconSizeNum.sm} color={spotColorValue} strokeColor={spotColorStroke} />
            )}
            <Text
              className="text-lg font-bold text-on-surface ml-1.5 flex-1"
              numberOfLines={1}
            >
              {masterSpotName}
            </Text>
            {/* カメラ移動ボタン（目のアイコン） */}
            <Pressable
              onPress={onCameraMove}
              className="ml-3 p-1 rounded-full active:bg-secondary"
              hitSlop={4}
            >
              <Ionicons
                name="eye-outline"
                size={iconSizeNum.md}
                color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
              />
            </Pressable>
            {/* 三点リーダーメニュー */}
            {isOwner ? (
              <View className="ml-3">
                <PopupMenu items={ownerMenuItems} />
              </View>
            ) : currentUserId ? (
              <View className="ml-3">
                <PopupMenu items={guestMenuItems} />
              </View>
            ) : null}
          </View>

          {/* 住所 */}
          {address && (
            <View className="flex-row items-center mt-1">
              <AddressPinIcon size={iconSizeNum.xs} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
              <Text
                className="text-xs text-on-surface-variant ml-1 flex-1"
                numberOfLines={1}
              >
                {address}
              </Text>
            </View>
          )}

          {/* ユーザーの一言 */}
          {spot.description && (
            <Text
              className="text-lg font-bold text-on-surface mt-3"
              numberOfLines={2}
            >
              {spot.description}
            </Text>
          )}

          {/* スペーサー（記事プレビューを下部に固定） */}
          <View className="flex-1" />

          {/* 記事プレビュー */}
          {articlePreview && (
            <Text
              className="text-sm text-on-surface-variant mb-2"
              numberOfLines={1}
            >
              {articlePreview}
            </Text>
          )}

          {/* アクションボタン: いいね → 保存 → 詳細 → 共有 */}
          <View className="flex-row items-center pt-2 border-t-thin border-outline-variant">
            {/* いいね */}
            <View className="flex-1 items-center">
              <SpotLikeButton
                spotId={spot.id}
                currentUserId={currentUserId}
                isLiked={isLiked}
                likesCount={likeCount}
                onCountPress={() => setIsLikersModalVisible(true)}
                variant="inline"
                iconSize={iconSizeNum.md}
                inactiveColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                labelClassName="text-xs text-on-surface-variant"
              />
            </View>

            {/* 保存 */}
            <View className="flex-1 items-center">
              <SpotBookmarkButton
                spotId={spot.id}
                currentUserId={currentUserId}
                isBookmarked={spot.is_bookmarked}
                variant="inline"
                size={iconSizeNum.md}
                labelClassName="text-xs text-on-surface-variant ml-1"
              />
            </View>

            {/* 外部マップ */}
            <View className="flex-1 items-center">
              <ExternalMapButton
                latitude={directionsLat}
                longitude={directionsLng}
                googlePlaceId={spot.master_spot?.google_place_id}
                variant="inline"
                iconSize={iconSizeNum.md}
                iconColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                labelClassName="text-xs text-on-surface-variant ml-1"
              />
            </View>

            {/* 共有 */}
            <View className="flex-1 items-center">
              <ShareButton
                type="spot"
                username={spot.user?.username || ''}
                mapId={spot.map_id}
                id={spot.id}
                variant="inline"
                iconSize={iconSizeNum.md}
                iconColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                labelClassName="text-xs text-on-surface-variant ml-1"
              />
            </View>
          </View>
        </View>
      </View>

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
  /** 編集（三点メニューから） */
  onEdit?: (spotId: string) => void;
  /** 削除（三点メニューから） */
  onDelete?: (spotId: string, context?: DeleteSpotContext) => void;
  onClose: () => void;
  /** 公開スポット数（最後のスポット削除時の警告用） */
  publicSpotsCount?: number;
}

export function SpotCarousel({
  spots,
  selectedSpotId,
  currentUserId,
  onSpotFocus,
  onSpotSelect,
  onSpotPress,
  onCameraMove,
  onEdit,
  onDelete,
  onClose,
  publicSpotsCount = 0,
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
        onEdit={onEdit}
        onDelete={onDelete}
        publicSpotsCount={publicSpotsCount}
      />
    ),
    [selectedSpotId, currentUserId, handleCardPress, onCameraMove, onEdit, onDelete, spots.length, publicSpotsCount]
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
          className="w-10 h-10 rounded-full items-center justify-center bg-surface"
          style={shadow.dropdown}
        >
          <Ionicons
            name="close"
            size={iconSizeNum.lg}
            color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
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
