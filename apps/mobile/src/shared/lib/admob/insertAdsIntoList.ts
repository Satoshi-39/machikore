/**
 * 広告挿入ユーティリティ
 *
 * リストデータに一定間隔で広告を挿入する
 */

import type { FeedItemWithAd } from '@/shared/types';

/**
 * リストに広告を挿入する
 *
 * @param items - 元のリストデータ
 * @param interval - 広告を挿入する間隔（何件ごとに1広告）
 * @returns 広告が挿入されたリスト
 *
 * @example
 * const spots = [spot1, spot2, spot3, spot4, spot5, spot6];
 * const feedItems = insertAdsIntoList(spots, 5);
 * // [content, content, content, content, content, ad, content]
 */
export function insertAdsIntoList<T>(
  items: T[],
  interval: number,
  showAds: boolean = true
): FeedItemWithAd<T>[] {
  if (!showAds) {
    return items.map((item) => ({ type: 'content' as const, data: item }));
  }

  const result: FeedItemWithAd<T>[] = [];

  items.forEach((item, index) => {
    result.push({ type: 'content', data: item });

    // interval件ごとに広告を挿入（最後のアイテムの後には挿入しない）
    if ((index + 1) % interval === 0 && index < items.length - 1) {
      result.push({ type: 'ad', id: `ad-${index}` });
    }
  });

  return result;
}
