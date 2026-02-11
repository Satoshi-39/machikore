import { View, Text, Image, Dimensions } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, avatarSizeNum, iconSizeNum } from '@/shared/config';
import { getAdUnitId } from '@/shared/config/admob';
import { DEBUG_DISABLE_ADMOB } from '@/shared/config';
import { shouldRequestNonPersonalizedAdsOnly } from '@/shared/lib/tracking';

/**
 * マップ用ネイティブ広告コンポーネント
 * MapCardと同じスタイルでフィード内に溶け込む形式で広告を表示
 * プレミアムユーザーへの非表示はMixedFeedのshowAdsで制御
 */
export function MapNativeAdCard() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const nativeAdRef = useRef<NativeAd | null>(null);
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
    if (!adUnitId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    NativeAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: shouldRequestNonPersonalizedAdsOnly(),
    })
      .then((ad) => {
        if (cancelled) {
          ad.destroy();
          return;
        }
        nativeAdRef.current = ad;
        setNativeAd(ad);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    // クリーンアップ（refで最新のadを参照し、stale closure問題を回避）
    return () => {
      cancelled = true;
      if (nativeAdRef.current) {
        nativeAdRef.current.destroy();
        nativeAdRef.current = null;
      }
    };
  }, []);

  // ローディング中、広告なし、またはデバッグ無効化の場合は何も表示しない
  if (isLoading || !nativeAd || DEBUG_DISABLE_ADMOB) {
    return null;
  }

  return (
    <View className="bg-surface p-4 border-b-thin border-outline">
      <NativeAdView nativeAd={nativeAd}>
        {/* ヘッダー: アイコンと広告主名 */}
        <View className="flex-row items-center mb-3">
          {/* 広告主アイコン - iconがある場合のみNativeAssetを使用 */}
          {nativeAd.icon ? (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={{ width: avatarSizeNum.lg, height: avatarSizeNum.lg, borderRadius: avatarSizeNum.lg / 2, marginRight: 12 }}
              />
            </NativeAsset>
          ) : (
            <Image
              source={{ uri: 'https://via.placeholder.com/40x40.png?text=AD' }}
              style={{ width: avatarSizeNum.lg, height: avatarSizeNum.lg, borderRadius: avatarSizeNum.lg / 2, marginRight: 12, backgroundColor: colors.primitive.gray[200] }}
            />
          )}

          {/* 広告主名とラベル */}
          <View className="flex-1">
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text
                className="text-sm font-semibold text-on-surface"
                numberOfLines={1}
              >
                {nativeAd.advertiser || 'スポンサー'}
              </Text>
            </NativeAsset>
            {/* 広告ラベル */}
            <Text className="text-xs text-on-surface-variant">
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
          <Ionicons name="megaphone" size={iconSizeNum.md} className="text-primary" />
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text
              className="text-base font-semibold text-on-surface ml-2"
              numberOfLines={1}
            >
              {nativeAd.headline || ''}
            </Text>
          </NativeAsset>
        </View>

        {/* 本文（説明の位置） */}
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
          <Text className="bg-primary py-2.5 rounded-lg text-center text-white text-sm font-semibold overflow-hidden">
            {nativeAd.callToAction || '詳細'}
          </Text>
        </NativeAsset>
      </NativeAdView>
    </View>
  );
}
