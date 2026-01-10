import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAdUnitId } from '@/shared/config/admob';
import { colors } from '@/shared/config';

/**
 * ネイティブ広告コンポーネント
 * MapCardと同じスタイルでフィード内に溶け込む形式で広告を表示
 */
export function NativeAdCard() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MapCardと同じサイズ計算（padding 16 * 2 = 32）
  const screenWidth = Dimensions.get('window').width;
  const mediaWidth = screenWidth - 32;
  const mediaHeight = 160;

  const loadAd = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const adUnitId = getAdUnitId('native');
      const ad = await NativeAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
      setNativeAd(ad);
    } catch (err) {
      setError('広告の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  // ローディング中または エラー時は何も表示しない
  if (isLoading || error || !nativeAd) {
    return null;
  }

  return (
    <View className="bg-surface dark:bg-dark-surface p-4 border-b border-border dark:border-dark-border">
      <NativeAdView nativeAd={nativeAd}>
        {/* ヘッダー: アイコンと広告主名 */}
        <View className="flex-row items-center mb-3">
          {/* 広告主アイコン */}
          {nativeAd.icon ? (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                className="w-10 h-10 rounded-full mr-3"
              />
            </NativeAsset>
          ) : (
            <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted justify-center items-center mr-3">
              <Ionicons name="megaphone" size={20} color={colors.gray[500]} />
            </View>
          )}

          {/* 広告主名とラベル */}
          <View className="flex-1">
            {nativeAd.advertiser && (
              <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                  {nativeAd.advertiser}
                </Text>
              </NativeAsset>
            )}
            {/* 広告ラベル */}
            <View className="flex-row items-center mt-0.5">
              <View className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                <Text className="text-[10px] text-foreground-secondary dark:text-dark-foreground-secondary">
                  広告
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* メディア（画像/動画） - MapThumbnailと同じスタイル */}
        <View
          className="mb-3 overflow-hidden bg-muted dark:bg-dark-muted"
          style={{ width: mediaWidth, height: mediaHeight, borderRadius: 8 }}
        >
          <NativeMediaView
            style={{ width: mediaWidth, height: mediaHeight }}
            resizeMode="contain"
          />
        </View>

        {/* 見出し（マップ名の位置） */}
        {nativeAd.headline && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="megaphone" size={18} color={colors.primary.DEFAULT} />
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text
                className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2 flex-1"
                numberOfLines={1}
              >
                {nativeAd.headline}
              </Text>
            </NativeAsset>
          </View>
        )}

        {/* 本文（説明の位置） */}
        {nativeAd.body && (
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text
              className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3"
              numberOfLines={2}
            >
              {nativeAd.body}
            </Text>
          </NativeAsset>
        )}

        {/* CTA ボタン */}
        {nativeAd.callToAction && (
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Pressable className="bg-primary py-2.5 rounded-lg items-center">
              <Text className="text-white text-sm font-semibold">
                {nativeAd.callToAction}
              </Text>
            </Pressable>
          </NativeAsset>
        )}
      </NativeAdView>
    </View>
  );
}
