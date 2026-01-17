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

  const results = await Promise.allSettled(
    validUrls.map(url => prefetchImage(url, options))
  );

  // 成功した数を返す
  return results.filter(r => r.status === 'fulfilled' && r.value).length;
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
  await Promise.allSettled(maps.map(map => prefetchMapCard(map)));
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
