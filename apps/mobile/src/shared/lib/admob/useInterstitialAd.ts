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
  const { isLoaded, isClosed, load, show, isShowing } = useRNGMAInterstitialAd(adUnitId ?? '', {
    requestNonPersonalizedAdsOnly: shouldRequestNonPersonalizedAdsOnly(),
  });

  const [hasShown, setHasShown] = useState(false);

  // 広告が閉じられたら再読み込み（プレミアムユーザーまたはID未設定はスキップ）
  useEffect(() => {
    if (isPremium || !adUnitId) return;
    if (isClosed && hasShown) {
      load();
      setHasShown(false);
    }
  }, [isClosed, hasShown, load, isPremium, adUnitId]);

  // 初回読み込み（プレミアムユーザーまたはID未設定はスキップ）
  useEffect(() => {
    if (isPremium || !adUnitId) return;
    load();
  }, [load, isPremium, adUnitId]);

  const showAd = useCallback(() => {
    // プレミアムユーザーまたはID未設定には広告を表示しない
    if (isPremium || !adUnitId) return;
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
