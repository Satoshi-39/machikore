/**
 * 画像のローカルストレージ管理
 *
 * 画像を永続的なドキュメントディレクトリに保存し、
 * アップロード完了時やキャンセル時に削除する
 */

import * as FileSystem from 'expo-file-system/legacy';
import { log } from '@/shared/config/logger';

/**
 * ドラフト画像ディレクトリのパスを取得
 */
function getDraftImagesDir(): string {
  if (!FileSystem.documentDirectory) {
    throw new Error('FileSystem.documentDirectory is not available');
  }
  return `${FileSystem.documentDirectory}draft-images/`;
}

/**
 * ドラフト画像ディレクトリを確保
 */
async function ensureDraftImagesDir(): Promise<void> {
  const draftImagesDir = getDraftImagesDir();
  const dirInfo = await FileSystem.getInfoAsync(draftImagesDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(draftImagesDir, { intermediates: true });
  }
}

/**
 * 画像を永続ディレクトリにコピーして保存
 *
 * @param sourceUri - 元画像のURI（キャッシュディレクトリ）
 * @returns 永続ディレクトリのURI
 */
export async function saveDraftImage(sourceUri: string): Promise<string> {
  await ensureDraftImagesDir();

  const draftImagesDir = getDraftImagesDir();
  const filename = `draft_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const destUri = `${draftImagesDir}${filename}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destUri,
  });

  log.debug('[LocalStorage] ドラフト画像を保存:', destUri);
  return destUri;
}

/**
 * 単一のドラフト画像を削除
 *
 * @param uri - 削除する画像のURI
 */
export async function deleteDraftImage(uri: string): Promise<void> {
  try {
    const draftImagesDir = getDraftImagesDir();
    // ドラフト画像ディレクトリ内の画像のみ削除
    if (!uri.startsWith(draftImagesDir)) {
      log.debug('[LocalStorage] ドラフトディレクトリ外の画像は削除しない:', uri);
      return;
    }

    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      log.debug('[LocalStorage] ドラフト画像を削除:', uri);
    }
  } catch (error) {
    log.warn('[LocalStorage] ドラフト画像削除エラー:', error);
  }
}

/**
 * 複数のドラフト画像を削除
 *
 * @param uris - 削除する画像のURI配列
 */
export async function deleteDraftImages(uris: string[]): Promise<void> {
  await Promise.all(uris.map((uri) => deleteDraftImage(uri)));
}

/**
 * すべてのドラフト画像を削除（ディレクトリごとクリア）
 * アプリ起動時の古いドラフトのクリーンアップに使用
 */
export async function clearAllDraftImages(): Promise<void> {
  try {
    const draftImagesDir = getDraftImagesDir();
    const dirInfo = await FileSystem.getInfoAsync(draftImagesDir);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(draftImagesDir, { idempotent: true });
      log.debug('[LocalStorage] ドラフト画像ディレクトリをクリア');
    }
  } catch (error) {
    log.warn('[LocalStorage] ドラフト画像ディレクトリのクリアに失敗:', error);
  }
}

/**
 * ドラフト画像ディレクトリのサイズを取得（デバッグ用）
 */
export async function getDraftImagesDirSize(): Promise<number> {
  try {
    const draftImagesDir = getDraftImagesDir();
    const dirInfo = await FileSystem.getInfoAsync(draftImagesDir);
    if (!dirInfo.exists) return 0;

    const files = await FileSystem.readDirectoryAsync(draftImagesDir);
    let totalSize = 0;

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${draftImagesDir}${file}`);
      if (fileInfo.exists && 'size' in fileInfo) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    log.warn('[LocalStorage] ディレクトリサイズ取得エラー:', error);
    return 0;
  }
}

/** デフォルトの有効期限（1日間） */
const DEFAULT_EXPIRY_DAYS = 1;

/**
 * 期限切れのドラフト画像を削除
 * ファイル名のタイムスタンプから経過日数を判定
 *
 * @param expiryDays - 有効期限（日数）、デフォルト1日
 * @returns 削除されたファイル数
 */
export async function cleanupExpiredDraftImages(expiryDays: number = DEFAULT_EXPIRY_DAYS): Promise<number> {
  try {
    const draftImagesDir = getDraftImagesDir();
    const dirInfo = await FileSystem.getInfoAsync(draftImagesDir);
    if (!dirInfo.exists) return 0;

    const files = await FileSystem.readDirectoryAsync(draftImagesDir);
    const now = Date.now();
    const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    for (const file of files) {
      // ファイル名からタイムスタンプを抽出: draft_1234567890123_abc123.jpg
      const match = file.match(/^draft_(\d+)_/);
      if (match && match[1]) {
        const timestamp = parseInt(match[1], 10);
        if (now - timestamp > expiryMs) {
          const filePath = `${draftImagesDir}${file}`;
          try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            deletedCount++;
            log.debug('[LocalStorage] 期限切れドラフト画像を削除:', file);
          } catch (error) {
            log.warn('[LocalStorage] ファイル削除エラー:', file, error);
          }
        }
      }
    }

    if (deletedCount > 0) {
      log.info(`[LocalStorage] ${deletedCount}件の期限切れドラフト画像を削除しました`);
    }

    return deletedCount;
  } catch (error) {
    log.warn('[LocalStorage] 期限切れドラフトのクリーンアップエラー:', error);
    return 0;
  }
}
