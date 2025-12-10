/**
 * Mapbox初期化
 */

import Mapbox from '@rnmapbox/maps';
import { LogBox } from 'react-native';
import { ENV } from '@/shared/config/env';

/**
 * Mapboxを初期化する
 */
export function initMapbox(): void {
  const accessToken = ENV.MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('Mapbox access token is not set');
    return;
  }

  Mapbox.setAccessToken(accessToken);

  // @rnmapbox/maps の既知のタイミング問題によるエラーを抑制
  // マップのアンマウント時にheadingIndicatorレイヤーの更新が発生する問題
  // 機能自体は正常に動作するため、ログのみ抑制
  // 参考: https://github.com/rnmapbox/maps/issues/2895
  const ignoredMapboxErrors = [
    'Mapbox [error] updateLayer SymbolLayer.mapboxUserLocationHeadingIndicator',
    'Layer mapboxUserLocationHeadingIndicator is not in style',
  ];

  LogBox.ignoreLogs(ignoredMapboxErrors);

  // console.errorもフィルタリング（Mapboxの既知のエラーを抑制）
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args[0];
    if (typeof message === 'string' && ignoredMapboxErrors.some((err) => message.includes(err))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.log('Mapbox initialized');
}
