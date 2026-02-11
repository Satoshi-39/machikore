/**
 * 画像プリフェッチ（先読み）ユーティリティ
 *
 * 次に表示される可能性が高い画像を事前にダウンロードしておくことで、
 * スクロールや画面遷移時の画像表示を高速化する
 *
 * @see https://docs.expo.dev/versions/latest/sdk/image/#imageprefetch
 */

import { Image } from 'expo-image';
import { getOptimizedImageUrl, IMAGE_PRESETS, type ImageTransformOptions } from './optimize';

/** プリフェッチの最大並列数（メモリスパイク防止） */
const MAX_CONCURRENT_PREFETCH = 3;

/**
 * 単一の画像をプリフェッチ
 *
 * @example
 * ```typescript
 * // マップ詳細を開く前にサムネイルを先読み
 * prefetchImage(map.thumbnail_url, IMAGE_PRESETS.mapThumbnail);
 * ```
 */
export async function prefetchImage(
  url: string | null | undefined,
  options?: ImageTransformOptions
): Promise<boolean> {
  if (!url) return false;

  try {
    const optimizedUrl = options ? getOptimizedImageUrl(url, options) : url;
    if (!optimizedUrl) return false;

    return await Image.prefetch(optimizedUrl);
  } catch {
    // プリフェッチ失敗は静かに無視（クリティカルではない）
    return false;
  }
}

/**
 * 複数の画像をプリフェッチ
 *
 * @example
 * ```typescript
 * // フィードの次の5件を先読み
 * const urls = nextMaps.map(m => m.thumbnail_url);
 * prefetchImages(urls, IMAGE_PRESETS.mapThumbnail);
 * ```
 */
export async function prefetchImages(
  urls: (string | null | undefined)[],
  options?: ImageTransformOptions
): Promise<number> {
  const validUrls = urls.filter((url): url is string => !!url);
  if (validUrls.length === 0) return 0;

  let successCount = 0;
  // 並列数を制限してメモリスパイクを防止
  for (let i = 0; i < validUrls.length; i += MAX_CONCURRENT_PREFETCH) {
    const batch = validUrls.slice(i, i + MAX_CONCURRENT_PREFETCH);
    const results = await Promise.allSettled(
      batch.map(url => prefetchImage(url, options))
    );
    successCount += results.filter(r => r.status === 'fulfilled' && r.value).length;
  }
  return successCount;
}

/**
 * マップカード用のプリフェッチ
 * サムネイルとユーザーアバターを同時に先読み
 */
export async function prefetchMapCard(map: {
  thumbnail_url?: string | null;
  user?: { avatar_url?: string | null } | null;
}): Promise<void> {
  await Promise.allSettled([
    prefetchImage(map.thumbnail_url, IMAGE_PRESETS.mapThumbnail),
    prefetchImage(map.user?.avatar_url, IMAGE_PRESETS.avatar),
  ]);
}

/**
 * 複数のマップカードをプリフェッチ
 */
export async function prefetchMapCards(
  maps: Array<{
    thumbnail_url?: string | null;
    user?: { avatar_url?: string | null } | null;
  }>
): Promise<void> {
  // 並列数を制限してメモリスパイクを防止
  for (let i = 0; i < maps.length; i += MAX_CONCURRENT_PREFETCH) {
    const batch = maps.slice(i, i + MAX_CONCURRENT_PREFETCH);
    await Promise.allSettled(batch.map(map => prefetchMapCard(map)));
  }
}

/**
 * スポット画像をプリフェッチ
 */
export async function prefetchSpotImages(
  imageUrls: (string | null | undefined)[]
): Promise<number> {
  return prefetchImages(imageUrls, IMAGE_PRESETS.spotGrid);
}

/**
 * フルスクリーン表示用に高解像度画像をプリフェッチ
 * 画像ギャラリーを開く前に呼び出すと効果的
 */
export async function prefetchFullscreenImages(
  imageUrls: (string | null | undefined)[]
): Promise<number> {
  // フルスクリーンは元画像を使用（最適化なし）
  return prefetchImages(imageUrls);
}
