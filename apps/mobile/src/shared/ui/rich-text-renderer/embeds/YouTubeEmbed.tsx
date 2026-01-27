/**
 * YouTube埋め込みコンポーネント
 */

import { View, useWindowDimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubeEmbedProps {
  embedId: string;
}

export function YouTubeEmbed({ embedId }: YouTubeEmbedProps) {
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = screenWidth - 32;
  const contentHeight = Math.round(contentWidth * (9 / 16));

  return (
    <View className="mb-4" style={{ borderRadius: 8, overflow: 'hidden' }}>
      <YoutubePlayer
        height={contentHeight}
        width={contentWidth}
        videoId={embedId}
        webViewStyle={{ borderRadius: 8 }}
      />
    </View>
  );
}
