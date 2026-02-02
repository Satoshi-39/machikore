import { useCallback, useEffect, useState } from 'react';
import { useInterstitialAd as useRNGMAInterstitialAd } from 'react-native-google-mobile-ads';
import { getAdUnitId } from '@/shared/config/admob';
import { shouldRequestNonPersonalizedAdsOnly } from '@/shared/lib/tracking';
import { useIsPremium } from '@/entities/subscription';

type UseInterstitialAdReturn = {
  isLoaded: boolean;
  isShowing: boolean;
  show: () => void;
  load: () => void;
};

/**
 * インタースティシャル広告を管理するhook
 * プレミアムユーザーには広告を表示しない
 */
export function useInterstitialAd(): UseInterstitialAdReturn {
  const isPremium = useIsPremium();
  const adUnitId = getAdUnitId('interstitial');
  const { isLoaded, isClosed, load, show, isShowing } = useRNGMAInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: shouldRequestNonPersonalizedAdsOnly(),
  });

  const [hasShown, setHasShown] = useState(false);

  // 広告が閉じられたら再読み込み（プレミアムユーザーはスキップ）
  useEffect(() => {
    if (isPremium) return;
    if (isClosed && hasShown) {
      load();
      setHasShown(false);
    }
  }, [isClosed, hasShown, load, isPremium]);

  // 初回読み込み（プレミアムユーザーはスキップ）
  useEffect(() => {
    if (isPremium) return;
    load();
  }, [load, isPremium]);

  const showAd = useCallback(() => {
    // プレミアムユーザーには広告を表示しない
    if (isPremium) return;
    if (isLoaded) {
      setHasShown(true);
      show();
    }
  }, [isLoaded, show, isPremium]);

  return {
    isLoaded: isPremium ? false : isLoaded,
    isShowing,
    show: showAd,
    load,
  };
}
