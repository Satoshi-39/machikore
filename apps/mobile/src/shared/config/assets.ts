/**
 * アプリ内で使用する画像アセット
 *
 * 複数箇所で使う画像を一元管理
 */

import { ImageSourcePropType } from 'react-native';

export const ASSETS = {
  images: {
    /** マップのデフォルトサムネイル */
    defaultMapThumbnail: require('@assets/images/machikore7-small.png') as ImageSourcePropType,
  },
} as const;
