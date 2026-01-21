import { View, Text, Image, Dimensions } from 'react-native';
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

/**
 * マップ用ネイティブ広告コンポーネント
 * MapCardと同じスタイルでフィード内に溶け込む形式で広告を表示
 */
export function MapNativeAdCard() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // メディアサイズ計算（padding 16 * 2 = 32）
  const screenWidth = Dimensions.get('window').width;
  const mediaWidth = screenWidth - 32;

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

    NativeAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
      .then((ad) => {
        setNativeAd(ad);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('MapNativeAdCard: Failed to load ad', err);
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
    <View className="bg-surface dark:bg-dark-surface p-4 border-b border-border dark:border-dark-border">
      <NativeAdView nativeAd={nativeAd}>
        {/* ヘッダー: アイコンと広告主名 */}
        <View className="flex-row items-center mb-3">
          {/* 広告主アイコン - iconがある場合のみNativeAssetを使用 */}
          {nativeAd.icon ? (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              />
            </NativeAsset>
          ) : (
            <Image
              source={{ uri: 'https://via.placeholder.com/40x40.png?text=AD' }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: colors.gray[200] }}
            />
          )}

          {/* 広告主名とラベル */}
          <View className="flex-1">
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text
                className="text-sm font-semibold text-foreground dark:text-dark-foreground"
                numberOfLines={1}
              >
                {nativeAd.advertiser || 'スポンサー'}
              </Text>
            </NativeAsset>
            {/* 広告ラベル */}
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
              広告
            </Text>
          </View>
        </View>

        {/* メディア（画像/動画） - 広告のアスペクト比に合わせて高さを動的に調整 */}
        <View
          className="mb-3 overflow-hidden rounded-lg"
          style={{ width: mediaWidth, height: mediaHeight }}
        >
          <NativeMediaView
            style={{ width: mediaWidth, height: mediaHeight }}
            resizeMode="contain"
          />
        </View>

        {/* 見出し（マップ名の位置） */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="megaphone" size={18} color={colors.primary.DEFAULT} />
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text
              className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2"
              numberOfLines={1}
            >
              {nativeAd.headline || ''}
            </Text>
          </NativeAsset>
        </View>

        {/* 本文（説明の位置） */}
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3"
            numberOfLines={2}
          >
            {nativeAd.body || ''}
          </Text>
        </NativeAsset>

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
