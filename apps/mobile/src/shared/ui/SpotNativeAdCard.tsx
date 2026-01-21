/**
 * スポット用ネイティブ広告コンポーネント
 *
 * SpotCardと同じスタイルでカルーセル内に溶け込む形式で広告を表示
 * 広告画像は正方形（1:1）で表示（AdMobの標準的な比率に合わせる）
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
import { colors } from '@/shared/config';

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

    NativeAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
      .then((ad) => {
        setNativeAd(ad);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('SpotNativeAdCard: Failed to load ad', err);
        setIsLoading(false);
      });

    // クリーンアップ
    return () => {
      if (nativeAd) {
        nativeAd.destroy();
      }
    };
  }, []);

  // ローディング中または広告なしの場合は何も表示しない
  if (isLoading || !nativeAd) {
    return null;
  }

  return (
    <View
      className="bg-surface dark:bg-dark-muted p-4 rounded-2xl border border-border dark:border-transparent"
      style={{ width: cardWidth }}
    >
      {/* 広告ラベル */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
          <Ionicons name="megaphone" size={20} color={colors.primary.DEFAULT} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground" numberOfLines={1}>
            {nativeAd.advertiser || 'スポンサー'}
          </Text>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
            広告
          </Text>
        </View>
      </View>

      {/* NativeAdView */}
      <NativeAdView nativeAd={nativeAd}>
        {/* 見出し */}
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text
            className="text-base font-semibold text-foreground dark:text-dark-foreground mb-1"
            numberOfLines={1}
          >
            {nativeAd.headline || ''}
          </Text>
        </NativeAsset>

        {/* 本文 */}
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2"
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
