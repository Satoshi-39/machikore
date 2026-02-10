/**
 * スポットカード埋め込みコンポーネント
 *
 * 記事内のスポットカードを表示し、タップでアプリ内遷移する
 */

import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib/navigation';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ThumbnailCrop } from '@/shared/lib/image';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface SpotCardEmbedProps {
  embedId: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  thumbnailUrl?: string | null;
  thumbnailCrop?: ThumbnailCrop | null;
}

const IMG_W = 100;
const IMG_H = 80;

export function SpotCardEmbed({ embedId, ogTitle, ogDescription, thumbnailUrl, thumbnailCrop }: SpotCardEmbedProps) {
  const isDarkMode = useIsDarkMode();
  const router = useRouter();
  const currentTab = useCurrentTab();

  const handlePress = () => {
    router.push(`/(tabs)/${currentTab}/articles/spots/${embedId}`);
  };

  const borderColor = isDarkMode
    ? colors.dark.outline
    : colors.light.outline;

  const bgColor = isDarkMode
    ? colors.dark['surface-variant']
    : colors.light['surface-variant'];

  const iconColor = isDarkMode
    ? colors.dark['on-surface']
    : colors.light['on-surface'];

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 rounded-xl overflow-hidden active:opacity-80"
      style={{ borderWidth: 1, borderColor, backgroundColor: bgColor }}
    >
      <View className="flex-row">
        {/* サムネイル画像 */}
        {thumbnailUrl && (
          <View style={{ width: IMG_W, height: IMG_H, overflow: 'hidden', backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.secondary }}>
            {thumbnailCrop ? (
              <CoverCroppedImage url={thumbnailUrl} crop={thumbnailCrop} width={IMG_W} height={IMG_H} />
            ) : (
              <Image
                source={{ uri: getOptimizedImageUrl(thumbnailUrl, { width: getOptimalWidth(IMG_W), height: getOptimalWidth(IMG_H), quality: 75 }) ?? thumbnailUrl }}
                style={{ width: IMG_W, height: IMG_H }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            )}
          </View>
        )}

        {/* テキスト情報 */}
        <View className="flex-1 p-3 justify-center" style={{ gap: 2 }}>
          {/* タイトル行（アイコン + 名前） */}
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="location-outline" size={14} color={iconColor} />
            <Text
              className="text-sm font-semibold text-on-surface flex-1"
              numberOfLines={1}
            >
              {ogTitle || 'スポット'}
            </Text>
          </View>
          {ogDescription && (
            <Text
              className="text-xs text-on-surface-variant"
              numberOfLines={2}
            >
              {ogDescription}
            </Text>
          )}
          <Text className="text-xs text-on-surface-variant opacity-60" numberOfLines={1}>
            machikore.io
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * クロップ領域を100x80コンテナにcover表示する
 *
 * CroppedThumbnailはcropのアスペクト比(1.91:1)でコンテナ高さを決めるため
 * カード用の1.25:1(100x80)コンテナでは隙間が出る。
 * ここではcoverスケーリングでクロップ中心を基準に隙間なく埋める。
 */
function CoverCroppedImage({ url, crop, width, height }: { url: string; crop: ThumbnailCrop; width: number; height: number }) {
  // cropをコンテナにcover表示するスケール（幅・高さ両方を埋める）
  const scaleX = width / crop.width;
  const scaleY = height / crop.height;
  const scale = Math.max(scaleX, scaleY);

  // クロップ領域をコンテナ中央に配置
  const cropDisplayW = crop.width * scale;
  const cropDisplayH = crop.height * scale;
  const offsetX = (width - cropDisplayW) / 2;
  const offsetY = (height - cropDisplayH) / 2;

  const imageW = crop.imageWidth * scale;
  const imageH = crop.imageHeight * scale;

  const optimalWidth = Math.min(getOptimalWidth(imageW), crop.imageWidth);
  const optimalHeight = Math.round(optimalWidth * crop.imageHeight / crop.imageWidth);
  const optimizedUrl = getOptimizedImageUrl(url, { width: optimalWidth, height: optimalHeight, quality: 75 });

  return (
    <Image
      source={{ uri: optimizedUrl ?? url }}
      style={{
        position: 'absolute',
        width: imageW,
        height: imageH,
        left: -crop.originX * scale + offsetX,
        top: -crop.originY * scale + offsetY,
      }}
      cachePolicy="memory-disk"
    />
  );
}
