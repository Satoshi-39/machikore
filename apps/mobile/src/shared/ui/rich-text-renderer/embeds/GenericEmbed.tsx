/**
 * 汎用埋め込みコンポーネント
 *
 * Instagram等のプロバイダー用
 */

import { View, Text, Pressable, useWindowDimensions, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import type { EmbedProvider } from '@/shared/lib/embed';
import { getProviderEmbedUrl, getProviderName } from '@/shared/lib/embed';
import { borderRadiusNum } from '@/shared/config';

interface GenericEmbedProps {
  provider: EmbedProvider;
  embedId: string;
  url: string | undefined;
}

export function GenericEmbed({ provider, embedId, url }: GenericEmbedProps) {
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = screenWidth - 32;
  const contentHeight = Math.round(contentWidth * (9 / 16));

  const embedUrl = getProviderEmbedUrl(provider, embedId);
  if (!embedUrl) {
    return (
      <Pressable
        onPress={() => url && Linking.openURL(url)}
        className="mb-4 p-4 bg-secondary rounded-lg"
      >
        <Text className="text-sm text-on-surface-variant">
          {getProviderName(provider)}のコンテンツを表示
        </Text>
        <Text className="text-xs text-primary mt-1">{url}</Text>
      </Pressable>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <iframe
          src="${embedUrl}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View className="mb-4" style={{ width: contentWidth, height: contentHeight, borderRadius: borderRadiusNum.md, overflow: 'hidden' }}>
      <WebView
        source={{ html }}
        style={{ flex: 1, borderRadius: borderRadiusNum.md }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        scrollEnabled={false}
      />
    </View>
  );
}
