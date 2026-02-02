/**
 * YouTube埋め込みコンポーネント
 */

import { useState, useCallback } from 'react';
import { View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubeEmbedProps {
  embedId: string;
}

export function YouTubeEmbed({ embedId }: YouTubeEmbedProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) setLayoutWidth(width);
  }, []);

  // onLayoutで計測した実際の幅を優先（YouTube全画面中の回転に影響されない）
  const contentWidth = layoutWidth > 0 ? layoutWidth : screenWidth - 32;
  const contentHeight = Math.round(contentWidth * (9 / 16));

  return (
    <View className="mb-4" style={{ borderRadius: 8, overflow: 'hidden' }} onLayout={handleLayout}>
      <YoutubePlayer
        height={contentHeight}
        width={contentWidth}
        videoId={embedId}
        webViewStyle={{ borderRadius: 8 }}
      />
    </View>
  );
}
