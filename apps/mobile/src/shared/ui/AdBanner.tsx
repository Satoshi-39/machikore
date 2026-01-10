import { View } from 'react-native';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { useState, useRef, useCallback } from 'react';
import { getAdUnitId } from '@/shared/config/admob';

type AdBannerProps = {
  size?: BannerAdSize;
  className?: string;
};

/**
 * バナー広告コンポーネント
 * プレミアムユーザーには表示しない制御は呼び出し側で行う
 */
export function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER, className }: AdBannerProps) {
  const bannerRef = useRef<BannerAd>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // アプリがフォアグラウンドに戻った時に広告をリロード
  useForeground(() => {
    bannerRef.current?.load();
  });

  const handleAdLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleAdFailedToLoad = useCallback((error: Error) => {
    console.warn('[AdBanner] Failed to load:', error.message);
    setIsLoaded(false);
  }, []);

  const adUnitId = getAdUnitId('banner');

  return (
    <View className={className} style={{ opacity: isLoaded ? 1 : 0 }}>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={size}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
}
