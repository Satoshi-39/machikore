import { useCallback, useEffect, useState } from 'react';
import { useInterstitialAd as useRNGMAInterstitialAd } from 'react-native-google-mobile-ads';
import { getAdUnitId } from '@/shared/config/admob';

type UseInterstitialAdReturn = {
  isLoaded: boolean;
  isShowing: boolean;
  show: () => void;
  load: () => void;
};

/**
 * インタースティシャル広告を管理するhook
 */
export function useInterstitialAd(): UseInterstitialAdReturn {
  const adUnitId = getAdUnitId('interstitial');
  const { isLoaded, isClosed, load, show, isShowing } = useRNGMAInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [hasShown, setHasShown] = useState(false);

  // 広告が閉じられたら再読み込み
  useEffect(() => {
    if (isClosed && hasShown) {
      load();
      setHasShown(false);
    }
  }, [isClosed, hasShown, load]);

  // 初回読み込み
  useEffect(() => {
    load();
  }, [load]);

  const showAd = useCallback(() => {
    if (isLoaded) {
      setHasShown(true);
      show();
    }
  }, [isLoaded, show]);

  return {
    isLoaded,
    isShowing,
    show: showAd,
    load,
  };
}
