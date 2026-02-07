/**
 * スポット用ネイティブ広告コンポーネント
 *
 * SpotCardと同じスタイルでカルーセル内に溶け込む形式で広告を表示
 * 広告画像は正方形（1:1）で表示（AdMobの標準的な比率に合わせる）
 * プレミアムユーザーへの非表示はMixedFeedのshowAdsで制御
 */

import { View, Text } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { useState, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAdUnitId } from '@/shared/config/admob';
import { shouldRequestNonPersonalizedAdsOnly } from '@/shared/lib/tracking';
import { iconSizeNum } from '@/shared/config';

interface SpotNativeAdCardProps {
  /** カードの幅（カルーセルから渡される） */
  cardWidth?: number;
}

/**
 * スポット用ネイティブ広告コンポーネント
 * カルーセル内でSpotCardと並んで表示される
 */
export function SpotNativeAdCard({ cardWidth = 300 }: SpotNativeAdCardProps) {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // レイアウト計算
  const contentWidth = cardWidth - 32;

  // 広告のアスペクト比に基づいて高さを計算
  const mediaHeight = useMemo(() => {
    if (!nativeAd?.mediaContent?.aspectRatio) {
      // アスペクト比が取得できない場合は16:9をデフォルトとする
      return contentWidth * (9 / 16);
    }
    // aspectRatio = width / height なので、height = width / aspectRatio
    return contentWidth / nativeAd.mediaContent.aspectRatio;
  }, [nativeAd?.mediaContent?.aspectRatio, contentWidth]);

  useEffect(() => {
    const adUnitId = getAdUnitId('native');
    if (!adUnitId) {
      setIsLoading(false);
      return;
    }

    NativeAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: shouldRequestNonPersonalizedAdsOnly(),
    })
      .then((ad) => {
        setNativeAd(ad);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // クリーンアップ
    return () => {
      if (nativeAd) {
        nativeAd.destroy();
      }
    };
  }, []);

  // ローディング中、または広告なしの場合は何も表示しない
  if (isLoading || !nativeAd) {
    return null;
  }

  return (
    <View
      className="bg-surface p-4 rounded-2xl border-thin border-outline"
      style={{ width: cardWidth }}
    >
      <NativeAdView nativeAd={nativeAd}>
        {/* 広告ラベル */}
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
            <Ionicons name="megaphone" size={iconSizeNum.md} className="text-primary" />
          </View>
          <View className="flex-1">
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text className="text-sm font-semibold text-on-surface" numberOfLines={1}>
                {nativeAd.advertiser || 'スポンサー'}
              </Text>
            </NativeAsset>
            <Text className="text-xs text-on-surface-variant">
              広告
            </Text>
          </View>
        </View>

        {/* 見出し */}
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text
            className="text-base font-semibold text-on-surface mb-1"
            numberOfLines={1}
          >
            {nativeAd.headline || ''}
          </Text>
        </NativeAsset>

        {/* 本文 */}
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            className="text-sm text-on-surface-variant mb-2"
            numberOfLines={2}
          >
            {nativeAd.body || ''}
          </Text>
        </NativeAsset>

        {/* メディア - 広告のアスペクト比に合わせて高さを動的に調整 */}
        <View
          className="rounded-xl mb-6 overflow-hidden"
          style={{ width: contentWidth, height: mediaHeight }}
        >
          <NativeMediaView
            style={{ width: contentWidth, height: mediaHeight }}
            resizeMode="contain"
          />
        </View>

        {/* CTA ボタン */}
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <Text className="bg-primary py-2.5 rounded-lg text-center text-white text-sm font-semibold overflow-hidden">
            {nativeAd.callToAction || '詳細'}
          </Text>
        </NativeAsset>
      </NativeAdView>
    </View>
  );
}
