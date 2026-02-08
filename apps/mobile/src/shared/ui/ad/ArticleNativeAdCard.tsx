/**
 * 記事用ネイティブ広告コンポーネント
 *
 * スポット記事・マップ記事ページのコンテンツ内に溶け込む形式で広告を表示
 * プレミアムユーザーには自動的に非表示
 */

import { View, Text, Image, Dimensions } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { useState, useEffect, useMemo } from 'react';
import { colors, avatarSizeNum, borderRadiusNum } from '@/shared/config';
import { getAdUnitId } from '@/shared/config/admob';
import { shouldRequestNonPersonalizedAdsOnly } from '@/shared/lib/tracking';
import { useIsPremium } from '@/entities/subscription';

/**
 * 記事用ネイティブ広告コンポーネント
 * 記事コンテンツに自然に溶け込むデザイン
 */
export function ArticleNativeAdCard() {
  const isPremium = useIsPremium();
  const { t } = useI18n();
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // メディアサイズ計算（全幅表示）
  const screenWidth = Dimensions.get('window').width;
  const mediaWidth = screenWidth;

  // 広告のアスペクト比に基づいて高さを計算
  const mediaHeight = useMemo(() => {
    if (!nativeAd?.mediaContent?.aspectRatio) {
      // アスペクト比が取得できない場合は16:9をデフォルトとする
      return mediaWidth * (9 / 16);
    }
    // aspectRatio = width / height なので、height = width / aspectRatio
    return mediaWidth / nativeAd.mediaContent.aspectRatio;
  }, [nativeAd?.mediaContent?.aspectRatio, mediaWidth]);

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

  // プレミアムユーザー、ローディング中、または広告なしの場合は何も表示しない
  if (isPremium || isLoading || !nativeAd) {
    return null;
  }

  return (
    <View className="bg-surface-container py-4">
      <NativeAdView nativeAd={nativeAd}>
        {/* 広告ラベル */}
        <View className="px-4 mb-2">
          <Text className="text-xs text-on-surface-variant">{t('ad.label')}</Text>
        </View>

        {/* メディア（画像/動画） - 全幅表示 */}
        <View
          className="mb-3 overflow-hidden"
          style={{ width: mediaWidth, height: mediaHeight }}
        >
          <NativeMediaView
            style={{ width: mediaWidth, height: mediaHeight }}
            resizeMode="cover"
          />
        </View>

        {/* コンテンツエリア */}
        <View className="px-4">
          {/* ヘッダー: アイコンと広告主名 */}
          <View className="flex-row items-center mb-2">
            {/* 広告主アイコン */}
            {nativeAd.icon ? (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  style={{
                    width: avatarSizeNum.md,
                    height: avatarSizeNum.md,
                    borderRadius: avatarSizeNum.md / 2,
                    marginRight: 8,
                  }}
                />
              </NativeAsset>
            ) : (
              <View
                style={{
                  width: avatarSizeNum.md,
                  height: avatarSizeNum.md,
                  borderRadius: avatarSizeNum.md / 2,
                  marginRight: 8,
                  backgroundColor: colors.primitive.gray[200],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text className="text-xs text-on-surface-variant">AD</Text>
              </View>
            )}

            {/* 広告主名 */}
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text
                className="text-sm text-on-surface-variant"
                numberOfLines={1}
              >
                {nativeAd.advertiser || t('ad.sponsor')}
              </Text>
            </NativeAsset>
          </View>

          {/* 見出し */}
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text
              className="text-base font-semibold text-on-surface mb-1"
              numberOfLines={2}
            >
              {nativeAd.headline || ''}
            </Text>
          </NativeAsset>

          {/* 本文 */}
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text
              className="text-sm text-on-surface-variant mb-3"
              numberOfLines={2}
            >
              {nativeAd.body || ''}
            </Text>
          </NativeAsset>

          {/* CTA ボタン */}
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <View
              className="bg-primary py-3 items-center justify-center"
              style={{ borderRadius: borderRadiusNum.lg }}
            >
              <Text className="text-white text-sm font-semibold">
                {nativeAd.callToAction || t('ad.viewDetails')}
              </Text>
            </View>
          </NativeAsset>
        </View>
      </NativeAdView>
    </View>
  );
}
