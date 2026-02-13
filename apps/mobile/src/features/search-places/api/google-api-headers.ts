/**
 * Google API リクエストにプラットフォーム識別ヘッダーを付与
 *
 * Google Cloud Console でアプリケーション制限を設定した場合、
 * これらのヘッダーがないとリクエストが拒否される。
 * https://developers.google.com/maps/api-security-best-practices
 */

import { Platform } from 'react-native';

const IOS_BUNDLE_ID = 'com.tyatsushi.machikore';
const ANDROID_PACKAGE = 'com.tyatsushi.machikore';

/**
 * Google API 用のプラットフォーム識別ヘッダーを取得
 */
export function getGoogleApiPlatformHeaders(): Record<string, string> {
  if (Platform.OS === 'ios') {
    return {
      'X-Ios-Bundle-Identifier': IOS_BUNDLE_ID,
    };
  }
  if (Platform.OS === 'android') {
    return {
      'X-Android-Package': ANDROID_PACKAGE,
    };
  }
  return {};
}
