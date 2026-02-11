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

  // リモートURLの場合はローカルにダウンロード
  // expo-image-manipulatorはローカルファイルのみ処理可能
  let localUri = uri;
  let tempPath: string | null = null;
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const filename = `convert_temp_${Date.now()}.jpg`;
    tempPath = `${FileSystem.cacheDirectory}${filename}`;
    const downloaded = await FileSystem.downloadAsync(uri, tempPath);
    localUri = downloaded.uri;
  }

  try {
    // 元画像の情報を取得
    const info = await ImageManipulator.manipulateAsync(localUri, [], {});

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
    const result = await ImageManipulator.manipulateAsync(localUri, actions, {
      compress,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  } finally {
    // ダウンロードした一時ファイルを削除
    if (tempPath) {
      FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
    }
  }
}

/**
 * リモート画像をダウンロードし、実際のピクセルサイズを取得する
 *
 * Image.getSizeはデバイスキャッシュを参照するため、
 * サーバー上でリサイズされた画像の正確なサイズを取得できない場合がある。
 * この関数はダウンロードして実サイズを確認する。
 *
 * @returns ローカルURI・実際の幅・高さ
 */
export async function downloadAndGetSize(
  uri: string,
): Promise<{ uri: string; width: number; height: number }> {
  // ローカルファイルの場合はそのまま処理
  let localUri = uri;
  let tempPath: string | null = null;
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const filename = `size_check_${Date.now()}.jpg`;
    tempPath = `${FileSystem.cacheDirectory}${filename}`;
    const downloaded = await FileSystem.downloadAsync(uri, tempPath);
    localUri = downloaded.uri;
  }

  try {
    // manipulateAsyncで実際のピクセルサイズを取得（新しいファイルが作成される）
    const info = await ImageManipulator.manipulateAsync(localUri, [], {});
    return { uri: info.uri, width: info.width, height: info.height };
  } finally {
    // ダウンロードした一時ファイルを削除（manipulate結果は別ファイル）
    if (tempPath) {
      FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
    }
  }
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
