/**
 * NativeWind cssInterop 設定
 *
 * React Native コンポーネントに className での Tailwind スタイル指定を可能にする
 * このファイルはアプリ起動時に一度だけインポートする必要がある
 */

import { cssInterop } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { NativeAdView } from 'react-native-google-mobile-ads';

/**
 * Ionicons に className での色指定を可能にする
 *
 * @example
 * <Ionicons name="heart" className="text-primary" size={24} />
 */
cssInterop(Ionicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

/**
 * ActivityIndicator に className での色指定を可能にする
 *
 * @example
 * <ActivityIndicator className="text-primary" />
 */
cssInterop(ActivityIndicator, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

/**
 * NativeAdView に className でのスタイル指定を可能にする
 *
 * @example
 * <NativeAdView nativeAd={ad} className="bg-surface rounded-2xl" />
 */
cssInterop(NativeAdView, {
  className: {
    target: 'style',
  },
});

