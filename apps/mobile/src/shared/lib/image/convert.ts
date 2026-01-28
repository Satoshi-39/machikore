/**
 * 画像変換ユーティリティ
 *
 * 画像のリサイズ・圧縮・フォーマット変換を行う
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { MAX_IMAGE_DIMENSION } from '@/shared/config';

export interface ConvertedImage {
  uri: string;
  width: number;
  height: number;
}

/**
 * 画像をJPEGに変換・圧縮・リサイズ
 *
 * @param uri - 元画像のURI
 * @param options - オプション設定
 * @returns 変換後の画像情報
 */
export async function convertToJpeg(
  uri: string,
  options: {
    /** 最大幅/高さ（デフォルト: MAX_IMAGE_DIMENSION） */
    maxDimension?: number;
    /** 圧縮率（0-1、デフォルト: 0.6） */
    compress?: number;
  } = {}
): Promise<ConvertedImage> {
  const { maxDimension = MAX_IMAGE_DIMENSION, compress = 0.6 } = options;

  // 元画像の情報を取得
  const info = await ImageManipulator.manipulateAsync(uri, [], {});

  // リサイズが必要かチェック
  const actions: ImageManipulator.Action[] = [];
  if (info.width > maxDimension || info.height > maxDimension) {
    if (info.width > info.height) {
      actions.push({ resize: { width: maxDimension } });
    } else {
      actions.push({ resize: { height: maxDimension } });
    }
  }

  // JPEG変換・圧縮を実行
  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

/**
 * ローカル画像URIをBase64 data URIに変換
 *
 * WebView内で表示するために使用
 * file:// URIはWebViewで直接読み込めないため、data:image/jpeg;base64,... 形式に変換
 *
 * @param uri - ローカル画像のURI (file://...)
 * @returns Base64 data URI (data:image/jpeg;base64,...)
 */
export async function convertToBase64DataUri(uri: string): Promise<string> {
  // 既にdata URIの場合はそのまま返す
  if (uri.startsWith('data:')) {
    return uri;
  }

  // HTTPSの場合はそのまま返す（サーバー画像）
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  // ローカルファイルをBase64に変換
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/jpeg;base64,${base64}`;
}
