/**
 * SpotShortCard コンポーネント
 *
 * YouTubeショートのような縦型カード
 * 横スクロールカルーセルで複数表示される想定
 * 画像または動画を表示可能
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPOT_COLORS, DEFAULT_SPOT_COLOR, type SpotColor, SPOT_COLOR_LIST, avatarSizeNum } from '@/shared/config';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { LocationPinIcon, SpotThumbnail, VideoPlayer } from '@/shared/ui';
import type { SpotWithDetails, Json } from '@/shared/types';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { useI18n } from '@/shared/lib/i18n';

/** カードの幅（画面幅の40%） */
const CARD_WIDTH_RATIO = 0.4;
/** カードのアスペクト比（縦長: 9:16） */
const ASPECT_RATIO = 16 / 9;

interface SpotShortCardProps {
  spot: SpotWithDetails | UserSpotSearchResult;
  onPress?: (spotId: string, mapId: string) => void;
  onUserPress?: (userId: string) => void;
  /** カードの幅（指定しない場合は画面幅の40%） */
  width?: number;
  /** ショート動画URL（ある場合は動画を優先表示） */
  videoUrl?: string | null;
}

export function SpotShortCard({
  spot,
  onPress,
  onUserPress,
  width,
  videoUrl,
}: SpotShortCardProps) {
  const { locale } = useI18n();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = width ?? screenWidth * CARD_WIDTH_RATIO;
  const cardHeight = cardWidth * ASPECT_RATIO;

  // ユーザー情報
  const user = 'user' in spot ? spot.user : null;
  const avatarUri = user?.avatar_url ?? undefined;

  // スポット画像（最初の1枚）
  const imageUrl = useMemo(() => {
    if ('image_urls' in spot && spot.image_urls && spot.image_urls.length > 0) {
      return spot.image_urls[0];
    }
    return null;
  }, [spot]);

  // スポットのカラー
  const spotColor = useMemo((): SpotColor => {
    if ('map_label' in spot && spot.map_label?.color) {
      const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
      if (labelColorKey) return labelColorKey;
    }
    if ('spot_color' in spot && spot.spot_color) {
      return spot.spot_color as SpotColor;
    }
    return DEFAULT_SPOT_COLOR;
  }, [spot]);
  const spotColorValue = SPOT_COLORS[spotColor]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;

  // スポット名の取得
  const spotName = useMemo(() => {
    const hasMasterSpotId = 'master_spot_id' in spot && spot.master_spot_id != null;
    if (!hasMasterSpotId && 'name' in spot && spot.name) {
      const name = extractName(spot.name as Json, locale);
      if (name) return name;
    }
    if ('master_spot' in spot && spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, locale);
      if (name) return name;
    }
    return spot.description || 'スポット';
  }, [spot, locale]);

  const handlePress = () => {
    onPress?.(spot.id, spot.map_id);
  };

  const handleUserPress = (e: any) => {
    e.stopPropagation();
    if (user?.id) {
      onUserPress?.(user.id);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ width: cardWidth, height: cardHeight }}
      className="rounded-xl overflow-hidden mr-3"
    >
      {/* 背景メディア（動画優先、なければ画像） */}
      {videoUrl ? (
        <VideoPlayer
          uri={videoUrl}
          width={cardWidth}
          height={cardHeight}
          autoPlay
          loop
          initialMuted
          showMuteIcon
          showLoadingPlaceholder
        />
      ) : imageUrl ? (
        <Image
          source={{ uri: getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.spotShort) || imageUrl }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <SpotThumbnail
          url={null}
          width={cardWidth}
          height={cardHeight}
          borderRadius={0}
          defaultIconSize={48}
        />
      )}

      {/* グラデーションオーバーレイ */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
      />

      {/* 下部コンテンツ */}
      <View className="absolute bottom-0 left-0 right-0 p-3">
        {/* スポット名 */}
        <View className="flex-row items-center mb-2">
          <LocationPinIcon size={14} color={spotColorValue} />
          <Text
            className="text-white text-sm font-semibold ml-1 flex-1"
            numberOfLines={2}
          >
            {spotName}
          </Text>
        </View>

        {/* ユーザー情報 */}
        {user && (
          <Pressable
            onPress={handleUserPress}
            className="flex-row items-center"
          >
            {avatarUri ? (
              <Image
                source={{ uri: getOptimizedImageUrl(avatarUri, IMAGE_PRESETS.avatar) || avatarUri }}
                style={{ width: avatarSizeNum.xs, height: avatarSizeNum.xs, borderRadius: avatarSizeNum.xs / 2 }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View className="w-5 h-5 rounded-full bg-gray-500 justify-center items-center">
                <Ionicons name="person" size={12} color="white" />
              </View>
            )}
            <Text className="text-white text-xs ml-1.5 opacity-80" numberOfLines={1}>
              {user.display_name || user.username}
            </Text>
          </Pressable>
        )}

        {/* いいね数 */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="heart" size={12} color="white" />
          <Text className="text-white text-xs ml-1 opacity-80">
            {spot.likes_count}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
