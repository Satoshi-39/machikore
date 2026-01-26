/**
 * ShortViewerModal - フルスクリーンショート動画ビューア
 *
 * YouTubeショート/TikTok風の縦スワイプで動画を切り替える
 * - 縦スワイプで次/前の動画へ
 * - 表示中の動画のみ自動再生
 * - タップでミュート切り替え
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
  FlatList,
  type ViewToken,
} from 'react-native';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LocationPinIcon } from '@/shared/ui';
import { SPOT_COLORS, DEFAULT_SPOT_COLOR, SPOT_COLOR_LIST, type SpotColor, avatarSizeNum } from '@/shared/config';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { useI18n } from '@/shared/lib/i18n';
import type { SpotWithDetails, Json } from '@/shared/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ShortItem {
  spot: SpotWithDetails;
  videoUrl: string;
}

interface ShortViewerModalProps {
  visible: boolean;
  onClose: () => void;
  items: ShortItem[];
  initialIndex?: number;
  onSpotPress?: (spotId: string, mapId: string) => void;
  onUserPress?: (userId: string) => void;
}

interface ShortVideoItemProps {
  item: ShortItem;
  isActive: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
  onSpotPress?: (spotId: string, mapId: string) => void;
  onUserPress?: (userId: string) => void;
}

function ShortVideoItem({
  item,
  isActive,
  isMuted,
  onMuteToggle,
  onSpotPress,
  onUserPress,
}: ShortVideoItemProps) {
  const videoRef = useRef<Video>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { locale } = useI18n();
  const insets = useSafeAreaInsets();

  const { spot, videoUrl } = item;
  const user = spot.user;
  const avatarUri = user?.avatar_url ?? undefined;

  // スポット名の取得
  const spotName = useMemo(() => {
    const hasMasterSpotId = spot.master_spot_id != null;
    if (!hasMasterSpotId && spot.name) {
      const name = extractName(spot.name as Json, locale);
      if (name) return name;
    }
    if (spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, locale);
      if (name) return name;
    }
    return spot.description || 'スポット';
  }, [spot, locale]);

  // スポットのカラー
  const spotColor = useMemo((): SpotColor => {
    if (spot.map_label?.color) {
      const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
      if (labelColorKey) return labelColorKey;
    }
    if (spot.spot_color) {
      return spot.spot_color as SpotColor;
    }
    return DEFAULT_SPOT_COLOR;
  }, [spot]);
  const spotColorValue = SPOT_COLORS[spotColor]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoaded(true);
    }
  }, []);

  const handleSpotPress = () => {
    onSpotPress?.(spot.id, spot.map_id);
  };

  const handleUserPress = () => {
    if (user?.id) {
      onUserPress?.(user.id);
    }
  };

  return (
    <Pressable
      onPress={onMuteToggle}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      {/* 動画 */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping
        isMuted={isMuted}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* ローディング */}
      {!isLoaded && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="videocam" size={48} color="#666" />
        </View>
      )}

      {/* 上部グラデーション */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120 + insets.top,
        }}
      />

      {/* 下部グラデーション */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 250 + insets.bottom,
        }}
      />

      {/* ミュートアイコン（中央に一瞬表示、常時は右上） */}
      {isLoaded && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: 8,
          }}
        >
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={20}
            color="white"
          />
        </View>
      )}

      {/* 右側アクションボタン */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 180 + insets.bottom,
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* いいね */}
        <View className="items-center">
          <Pressable className="bg-black/30 rounded-full p-3">
            <Ionicons name="heart-outline" size={28} color="white" />
          </Pressable>
          <Text className="text-white text-xs mt-1">{spot.likes_count}</Text>
        </View>

        {/* コメント */}
        <View className="items-center">
          <Pressable className="bg-black/30 rounded-full p-3">
            <Ionicons name="chatbubble-outline" size={26} color="white" />
          </Pressable>
          <Text className="text-white text-xs mt-1">{spot.comments_count}</Text>
        </View>

        {/* ブックマーク */}
        <View className="items-center">
          <Pressable className="bg-black/30 rounded-full p-3">
            <Ionicons name="bookmark-outline" size={26} color="white" />
          </Pressable>
          <Text className="text-white text-xs mt-1">{spot.bookmarks_count}</Text>
        </View>

        {/* シェア */}
        <View className="items-center">
          <Pressable className="bg-black/30 rounded-full p-3">
            <Ionicons name="share-outline" size={26} color="white" />
          </Pressable>
        </View>
      </View>

      {/* 下部コンテンツ */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 24,
          left: 16,
          right: 80,
        }}
      >
        {/* ユーザー情報 */}
        {user && (
          <Pressable
            onPress={handleUserPress}
            className="flex-row items-center mb-3"
          >
            {avatarUri ? (
              <Image
                source={{ uri: getOptimizedImageUrl(avatarUri, IMAGE_PRESETS.avatar) || avatarUri }}
                style={{ width: avatarSizeNum.lg, height: avatarSizeNum.lg, borderRadius: avatarSizeNum.lg / 2 }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-600 justify-center items-center">
                <Ionicons name="person" size={20} color="white" />
              </View>
            )}
            <Text className="text-white font-semibold ml-3 text-base">
              {user.display_name || user.username}
            </Text>
          </Pressable>
        )}

        {/* スポット名 */}
        <Pressable onPress={handleSpotPress} className="flex-row items-start mb-2">
          <LocationPinIcon size={18} color={spotColorValue} />
          <Text className="text-white text-lg font-bold ml-2 flex-1" numberOfLines={2}>
            {spotName}
          </Text>
        </Pressable>

        {/* 説明文 */}
        {spot.description && (
          <Text className="text-white/80 text-sm" numberOfLines={3}>
            {spot.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export function ShortViewerModal({
  visible,
  onClose,
  items,
  initialIndex = 0,
  onSpotPress,
  onUserPress,
}: ShortViewerModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ShortItem>>(null);

  const handleMuteToggle = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<ShortItem>[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: ShortItem; index: number }) => (
      <ShortVideoItem
        item={item}
        isActive={index === activeIndex}
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
        onSpotPress={onSpotPress}
        onUserPress={onUserPress}
      />
    ),
    [activeIndex, isMuted, handleMuteToggle, onSpotPress, onUserPress]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<ShortItem> | null | undefined, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  const handleClose = useCallback(() => {
    onClose();
    // リセット
    setActiveIndex(initialIndex);
    setIsMuted(true);
  }, [onClose, initialIndex]);

  // モーダルが開くときに初期位置にスクロール
  React.useEffect(() => {
    if (visible && initialIndex > 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 100);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black">
        {/* 閉じるボタン */}
        <Pressable
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            left: 16,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: 8,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="white" />
        </Pressable>

        {/* 縦スワイプリスト */}
        <FlatList
          ref={listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.spot.id}
          getItemLayout={getItemLayout}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={initialIndex}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </View>
    </Modal>
  );
}
