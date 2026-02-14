/**
 * OGPリンクカード埋め込みコンポーネント
 *
 * 汎用URLのOGP情報をカード形式で表示する
 */

import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Image } from 'expo-image';
import { View, Text, Pressable, Linking } from 'react-native';

interface LinkCardEmbedProps {
  url: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
}

const IMG_W = 100;
const IMG_H = 80;

export function LinkCardEmbed({ url, ogTitle, ogDescription, ogImage }: LinkCardEmbedProps) {
  const isDarkMode = useIsDarkMode();

  const hostname = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  const handlePress = () => {
    Linking.openURL(url);
  };

  const borderColor = isDarkMode
    ? colors.dark.outline
    : colors.light.outline;

  const bgColor = isDarkMode
    ? colors.dark['surface-variant']
    : colors.light['surface-variant'];

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 rounded-xl overflow-hidden active:opacity-80"
      style={{ borderWidth: 1, borderColor, backgroundColor: bgColor }}
    >
      <View className="flex-row">
        {/* サムネイル画像 */}
        {ogImage && (
          <View style={{ width: IMG_W, minHeight: IMG_H, overflow: 'hidden', backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.secondary }}>
            <Image
              source={{ uri: ogImage }}
              style={{ width: IMG_W, flex: 1 }}
              contentFit="cover"
              cachePolicy="disk"
            />
          </View>
        )}

        {/* テキスト情報 */}
        <View className="flex-1 p-3 justify-center" style={{ gap: 2 }}>
          <Text
            className="text-sm font-semibold text-on-surface"
            numberOfLines={2}
          >
            {ogTitle || url}
          </Text>
          {ogDescription && (
            <Text
              className="text-xs text-on-surface-variant"
              numberOfLines={2}
            >
              {ogDescription}
            </Text>
          )}
          <Text className="text-xs text-on-surface-variant opacity-60" numberOfLines={1}>
            {hostname}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
