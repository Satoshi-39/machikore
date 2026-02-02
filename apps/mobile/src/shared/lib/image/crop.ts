/**
 * 画像クロップユーティリティ
 *
 * CropZoomの結果をexpo-image-manipulatorでクロップ処理する
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import type { CropContextResult } from 'react-native-zoom-toolkit';

export interface CropResult {
  uri: string;
  width: number;
  height: number;
  /** クロップ座標（元画像基準、DB保存用） */
  cropRegion: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
}

/**
 * リモートURLをローカルにダウンロードする
 * ローカルURIの場合はそのまま返す
 */
async function ensureLocalUri(uri: string): Promise<string> {
  if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
    return uri;
  }

  const filename = `crop_temp_${Date.now()}.jpg`;
  const localUri = `${FileSystem.cacheDirectory}${filename}`;
  const result = await FileSystem.downloadAsync(uri, localUri);
  return result.uri;
}

/**
 * CropZoomのcrop()結果を使って画像をクロップする
 *
 * @param uri - 元画像のURI（ローカルまたはリモート）
 * @param cropContext - CropZoomのcrop()メソッドの戻り値
 * @param compress - 圧縮率（0-1、デフォルト: 0.8）
 * @returns クロップ済み画像のURI、幅、高さ
 */
export async function cropImage(
  uri: string,
  cropContext: CropContextResult,
  compress: number = 0.8,
): Promise<CropResult> {
  // リモートURLの場合はローカルにダウンロード
  const localUri = await ensureLocalUri(uri);

  const actions: ImageManipulator.Action[] = [];

  // リサイズ（CropZoomがスケールに基づいて計算）
  if (cropContext.resize !== undefined) {
    actions.push({ resize: cropContext.resize });
  }

  // 水平反転
  if (cropContext.context.flipHorizontal) {
    actions.push({ flip: ImageManipulator.FlipType.Horizontal });
  }

  // 垂直反転
  if (cropContext.context.flipVertical) {
    actions.push({ flip: ImageManipulator.FlipType.Vertical });
  }

  // 回転
  if (cropContext.context.rotationAngle !== 0) {
    actions.push({ rotate: cropContext.context.rotationAngle });
  }

  // クロップ
  actions.push({ crop: cropContext.crop });

  const result = await ImageManipulator.manipulateAsync(localUri, actions, {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    cropRegion: {
      originX: cropContext.crop.originX,
      originY: cropContext.crop.originY,
      width: cropContext.crop.width,
      height: cropContext.crop.height,
    },
  };
}
