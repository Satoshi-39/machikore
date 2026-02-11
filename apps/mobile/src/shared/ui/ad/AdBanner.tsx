import { View } from 'react-native';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { useState, useRef, useCallback } from 'react';
import { getAdUnitId } from '@/shared/config/admob';
import { DEBUG_DISABLE_ADMOB } from '@/shared/config';
import { useIsPremium } from '@/entities/subscription';

type AdBannerProps = {
  size?: BannerAdSize;
  className?: string;
  /** 広告の拡大率（デフォルト: 1） */
  scale?: number;
};

/**
 * バナー広告コンポーネント
 * プレミアムユーザーには自動的に非表示
 */
export function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER, className, scale = 1 }: AdBannerProps) {
  const isPremium = useIsPremium();
  const bannerRef = useRef<BannerAd>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // アプリがフォアグラウンドに戻った時に広告をリロード
  useForeground(() => {
    if (!isPremium) {
      bannerRef.current?.load();
    }
  });

  const handleAdLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleAdFailedToLoad = useCallback(() => {
    setIsLoaded(false);
  }, []);

  const adUnitId = getAdUnitId('banner');

  // プレミアムユーザー、広告ID未設定、またはデバッグ無効化の場合は表示しない
  if (isPremium || !adUnitId || DEBUG_DISABLE_ADMOB) {
    return null;
  }

  return (
    <View
      className={isLoaded ? className : undefined}
      style={
        isLoaded
          ? { transform: [{ scale }] }
          : { height: 0, overflow: 'hidden' }
      }
    >
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
