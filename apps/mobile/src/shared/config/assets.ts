/**
 * アプリ内で使用する画像アセット
 *
 * 複数箇所で使う画像を一元管理
 */

import { ImageSourcePropType } from 'react-native';
import { APP_ICON_BASE64 } from './app-icon';

export const ASSETS = {
  images: {
    /** マップのデフォルトサムネイル */
    defaultMapThumbnail: { uri: APP_ICON_BASE64 } as ImageSourcePropType,
  },
} as const;
