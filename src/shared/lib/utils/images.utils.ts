/**
 * 画像ファイルシステム管理
 *
 * 設計書10.2に基づく画像管理：
 * - 画像実体：FileSystem.documentDirectory/images/ に保存
 * - SQLiteには画像パスのみ保存
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

/**
 * 画像保存ディレクトリのパス
 */
export function getImagesDirectory(): string {
  if (!FileSystem.documentDirectory) {
    throw new Error('FileSystem.documentDirectory is not available');
  }
  return `${FileSystem.documentDirectory}images/`;
}

/**
 * 画像ディレクトリを初期化（存在しない場合は作成）
 */
export async function initializeImagesDirectory(): Promise<void> {
  const IMAGES_DIR = getImagesDirectory();
  const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    console.log('📁 画像ディレクトリを作成:', IMAGES_DIR);
  }
}

/**
 * アセットから画像をファイルシステムにコピー
 *
 * @param assetModule - require()で取得したアセットモジュール
 * @param filename - 保存するファイル名
 * @returns ファイルシステム上のパス（URIとして使用可能）
 */
export async function copyAssetToFileSystem(
  assetModule: number,
  filename: string
): Promise<string> {
  await initializeImagesDirectory();

  // アセットをロード
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('Asset could not be loaded');
  }

  const IMAGES_DIR = getImagesDirectory();
  // 保存先パス
  const destinationUri = `${IMAGES_DIR}${filename}`;

  // ファイルをコピー
  await FileSystem.copyAsync({
    from: asset.localUri,
    to: destinationUri,
  });

  console.log(`📷 画像をコピー: ${filename} -> ${destinationUri}`);

  return destinationUri;
}

/**
 * 画像ファイルが存在するかチェック
 *
 * @param uri - ファイルシステムのURI
 * @returns 存在する場合true
 */
export async function imageExists(uri: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists;
}

/**
 * 画像ファイルを削除
 *
 * @param uri - ファイルシステムのURI
 */
export async function deleteImage(uri: string): Promise<void> {
  const exists = await imageExists(uri);
  if (exists) {
    await FileSystem.deleteAsync(uri);
    console.log(`🗑️  画像を削除: ${uri}`);
  }
}

/**
 * 投稿用の画像ファイル名を生成
 *
 * @param postId - 投稿ID
 * @param timestamp - タイムスタンプ（省略時は現在時刻）
 * @returns ファイル名（例：post_abc123_1234567.jpg）
 */
export function generatePostImageFilename(
  postId: string,
  timestamp?: number
): string {
  const ts = timestamp || Date.now();
  return `post_${postId}_${ts}.jpg`;
}
